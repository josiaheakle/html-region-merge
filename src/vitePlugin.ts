import path from "path";

import { exec } from "child_process";
import { getConfig } from "./Merger";

export default function hmrPlugin() {
  return {
    name: `HMR HTML Merger`,
    handleHotUpdate(opts: any): [] {
      const config = getConfig();
      const rootDir = process.env.INIT_CWD;
      if (opts.file === path.join(rootDir, config.build)) return;
      exec(config.runScript);
      return [];
    },
  };
}
