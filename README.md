# HTML Region Merge

This package was developed to work in tandem with the Regional Model Framework.

## Getting Started

To get started install the package using npm `npm install html-region-merge`. Create a config file within the project root folder named `rfm-config.json`.

```
// rfm-config.json
{
  "templateDir": "This is the directory where all the *.region.html documents will live",
  "entry": "The central HTML document to merge all other documents into.",
  "build": "The name and path of the newly merged HTML document."
}
// example
{
  "templateDir": "./src/templates",
  "entry": "./src/index.html",
  "build": "./public/index.html"
}
```

## Usage

Create a central HTML file, adding `<region name="region-name">` in the place of a block of HTML.
The script will search within the template directory (`templateDir`) for a file named `region-name.region.html` and replace the `<region />` element with the HTML.
This script will create a new file specified by the `build` config and will overwrite any old documents. This will not overwrite the central HTML file, unless specified.
