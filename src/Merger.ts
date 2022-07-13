import * as fs from "fs";

const regionRegEx = /<region.*\/>/g;
const nameRegEx = /name=("|').*("|')/g;

class Merger {
	private config: {
		templateDir: string;
		entry: string;
		build: string;
		runScript: string;
	};

	constructor() {
		this.config = getConfig();
	}

	/**
	 * Loops through entry file, checking for any <region /> elements.
	 * Gets specified HTML document, checking internally for any region elements before merging to the main HTML document.
	 * ---
	 * @param path Document to merge. Will check this.config.entry if nothing is passed. Used to pass back through the build file (this functionality should be removed).
	 */
	mergeDocument(path?: string) {
		const mainHTML = fs.readFileSync(path ?? this.config.entry, { encoding: "utf8" });

		let newContent: string = this.replaceRegions(mainHTML);

		fs.writeFileSync(this.config.build, newContent, {
			encoding: "utf8",
			flag: "w",
		});
	}

	/**
	 * Loops through each line of an HTML document, recursively replacing each iteration of a region with the html it references.
	 * ---
	 * @returns Merged HTML string
	 */
	replaceRegions(html: string): string {
		const htmlContent = html.split("\n");
		const newContent: Array<string> = [];
		// Check each line of the html document for <region />
		// if no region on that line, add that line to the new html document.
		// If there is a region on that line, check the template directory for specified region.
		for (const line of htmlContent) {
			if (line.match(regionRegEx)) {
				// noRegions = false;
				for (const region of line.matchAll(regionRegEx)) {
					const nameIndex = region.toString().indexOf("name");
					let dirIndex = region.toString().indexOf("dir");

					let nameStr;
					let dirStr;
					if (dirIndex === -1) {
						nameStr = region.toString().match(nameRegEx).toString();
					} else {
						nameStr = region.toString().substring(nameIndex, dirIndex);
						dirStr = region.toString().substring(dirIndex);
					}

					const name = nameStr
						.replace(/ /g, "")
						.replace(/'/g, "")
						.replace(/name=/g, "")
						.replace(/"/g, "");

					const dir = dirStr
						? dirStr
								.replace(/ /g, "")
								.replace(/\/>/g, "")
								.replace(/'/g, "")
								.replace(/dir=/g, "")
								.replace(/"/g, "")
						: "";

					// Got content of HTML document being referenced.
					// Now to check this content before adding it to the new content.
					const replaceContent = this.getHTMLTemplate(name, dir === "" ? undefined : dir);
					const regionContent = this.replaceRegions(replaceContent);
					newContent.push(regionContent);
				}
			} else {
				newContent.push(line);
			}
		}
		return newContent.join("\n");
	}

	getHTMLTemplate(name: string, dir?: string) {
		let filePath = dir
			? `${this.config.templateDir}/${dir}/${name}.region.html`
			: `${this.config.templateDir}/${name}.region.html`;
		try {
			return fs.readFileSync(filePath, {
				encoding: "utf8",
			});
		} catch {
			console.log(`No file found while searching for region document ${filePath}`);
		}
	}
}

export const getConfig = () => {
	const rootDir = process.env.INIT_CWD;
	let file;
	try {
		file = fs.readFileSync(`${rootDir}/rfm-config.json`, {
			encoding: "utf8",
		});
	} catch {
		console.log(
			`Missing configuration file. Must be named "rfm-config.json" and must exist in the project's root directory.`
		);
	}
	let config;
	try {
		config = JSON.parse(file);
	} catch {
		console.log(`Configuration file in invalid format. "rfm-config.json" must be valid JSON.`);
	}
	return config;
};

export default Merger;
