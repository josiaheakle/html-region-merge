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
