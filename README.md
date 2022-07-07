# HTML Region Merge

This package was developed to work in tandem with the Regional Model Framework.

## Getting Started

To get started install the package using npm `npm install html-region-merge`. Create a config file within the project root folder named `rfm-config.json`.

```
// rfm-config.json
{
  "templateDir": "This is the directory where all the *.region.html documents will live",
  "entry": "The central HTML document to merge all other documents into.",
  "build": "The name and path of the newly merged HTML document.",
  "runScript": "Will be called on hot module reload."
}
// example
{
  "templateDir": "./src/templates",
  "entry": "./src/templates/main.html",
  "build": "./public/index.html",
  "runScript": "npm run html-merge"
}
```

NOTE: Be sure the build folder exists, or a error will be thrown.

## Usage

### Setting up

Start by creating the `rfm-config.json` as seen in getting started.
Create a script importing and initialzing the `Merger`, then run `Merger.merge()`

```
// merge-html.js

import Merger from 'html-region-merge'

const merger = new Merger();
merger.mergeDocument();
```

Create a script within the package.json to run this script.

```
  ...
  "scripts": {
    "dev": "vite",
    "html-merge": "node src/_dev_scripts/html-merge.js",
  },
  ...
```

### Hot Module Reloading (with Vite)

If using Vite, add the hmr vite plugin to run the merge script on hot module reload.

```
// vite.config.js

import { defineConfig } from "vite";
import { hmrPlugin } from "html-region-merge";

export default defineConfig({
  plugins: [hmrPlugin()],
});

```

### Merging HTML

Create a central HTML file, adding `<region name="region-name">` in the place of a block of HTML.
The script will search within the template directory (`templateDir`) for a file named `region-name.region.html` and replace the `<region />` element with the HTML.
This script will create a new file specified by the `build` config and will overwrite any old documents. This will not overwrite the central HTML file, unless specified.

#### Example

```
// main.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Main</title>
</head>
<body>
  <!-- Will look within a folder named 'subdirectory' inside the template directory for a file named 'region-name.region.html'  -->
  <region name="region-name" dir="subdirectory" />
  <!-- Will look within the template directory for a file named 'other-region.region.html' -->
  <region name="other-region" />
</body>
</html>

```

```
// {templateDir}/subdirectory/region-name.region.html
<div>This is an element</div>
```

```
// {templateDir}/other-region.region.html
<span>This is also an element</span>
```

Will create a new file named index.html in the public folder, which looks like:

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Main</title>
</head>
<body>
  <div>This is an element</div>
  <span>This is also an element</span>
</body>
</html>
```
