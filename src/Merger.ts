import * as fs from "fs";

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

  mergeDocument(path?: string) {
    const mainHTML = fs.readFileSync(path ?? this.config.entry, { encoding: "utf8" });
    const htmlContent = mainHTML.split("\n");

    const regionRegEx = /<region.*\/>/g;
    const nameRegEx = /name=("|').*("|')/g;
    const folderRegEx = /dir=("|').*("|')/g;

    let newContent: Array<string> = [];

    // Check each line of the html document for <region />
    // if no region on that line, add that line to the new html document.
    // If there is a region on that line, check the template directory for specified region.
    let noRegions = true;
    for (const line of htmlContent) {
      if (line.match(regionRegEx)) {
        noRegions = false;
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

          const htmlContent = this.getHTMLTemplate(name, dir === "" ? undefined : dir);
          newContent.push(htmlContent);
        }
      } else {
        newContent.push(line);
      }
    }

    fs.writeFileSync(this.config.build, newContent.join("\n"), {
      encoding: "utf8",
      flag: "w",
    });

    if (noRegions === false) this.mergeDocument(this.config.build);
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
      console.error(`No file found while searching for region document ${filePath}`);
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
    throw new Error(
      `Missing configuration file. Must be named "rfm-config.json" and must exist in the project's root directory.`
    );
  }
  let config;
  try {
    config = JSON.parse(file);
  } catch {
    throw new Error(`Configuration file in invalid format. "rfm-config.json" must be valid JSON.`);
  }
  return config;
};

export default Merger;
