import { constants } from "buffer";
import fs from "fs";
import path from "path";

class Merger {
  private config: {
    templateDir: string;
    entry: string;
    build: string;
  };

  constructor() {
    this._readConfig();
  }

  private _readConfig() {
    const rootDir = path.dirname(require.main.filename);
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
      throw new Error(
        `Configuration file in invalid format. "rfm-config.json" must be valid JSON.`
      );
    }
    this.config = config;
  }

  mergeDocument(path?: string) {
    const mainHTML = fs.readFileSync(path ?? this.config.entry, { encoding: "utf8" });
    const htmlContent = mainHTML.split("\n");

    const regionRegEx = /<region.*\/>/g;
    const nameRegEx = /name=("|').*("|')/g;

    let newContent: Array<string> = [];

    // Check each line of the html document for <region />
    // if no region on that line, add that line to the new html document.
    // If there is a region on that line, check the template directory for specified region.
    let noRegions = true;
    for (const line of htmlContent) {
      if (line.match(regionRegEx)) {
        noRegions = false;
        for (const region of line.matchAll(regionRegEx)) {
          const name = region
            .toString()
            .match(nameRegEx)
            .toString()
            .replace('"', "")
            .replace('"', "")
            .replace("name=", "");
          const htmlContent = this.getHTMLTemplate(name);
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

  getHTMLTemplate(name: string) {
    return fs.readFileSync(`${this.config.templateDir}/${name}.region.html`, {
      encoding: "utf8",
    });
  }
}

export default Merger;
