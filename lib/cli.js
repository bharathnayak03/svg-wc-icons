#!/usr/bin/env node

/**
Usage:
web-icons test.svg --output test_icon.js
web-icons --src './test/svg_files' --dest './test/dest'
web-icons --src './test/svg_files' --dest './test/dest' --svgoConfig config.js
web-icons --src './test/svg_files' --dest './test/dest' --prefix hr
web-icons --src './test/svg_files' --dest './test/dest' --prefix icon --suffix component
*/
"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const path = require('path');

const Svgo = require('svgo');

const svgoConfig = require('./svgo.config');

const {
  readFilesFromDirectory,
  readFile,
  writeFile,
  ensureDirectoryExistence,
  generateFileName,
  generateComponentName,
  generateCustomElementName,
  mergeConfig,
  logSuccess,
  logError
} = require('./utils');

const generate = require('./template');

const args = require('./args');

const {
  src,
  dest,
  svgoConfig: svgoConfigPath,
  prefix,
  suffix,
  example,
  style
} = args;
let svgoInstance;

async function generateFile(options) {
  const {
    srcPath,
    outputPath
  } = options;
  const rawSvg = await readFile(srcPath, 'utf8');
  const optimizedSvg = await svgoInstance.optimize(rawSvg);
  ensureDirectoryExistence(outputPath);
  await writeFile(outputPath, generate(_objectSpread({}, options, {
    svg: optimizedSvg.data
  })), {
    flag: 'w'
  });
  logSuccess(`WebIcons: Successfully generated ${outputPath}`);
}

async function generateExampleHTML(files) {
  const outputPath = path.resolve(dest, 'example.html');
  let importString = '';
  let outputString = '';
  files.forEach(async fileName => {
    const outputFileName = generateFileName(fileName, {
      prefix,
      suffix
    });
    const customElementName = generateCustomElementName(fileName, {
      prefix,
      suffix
    });
    importString += `<script crossorigin type="module" src="${outputFileName}.js" ></script> `;
    outputString += `<${customElementName}></${customElementName}>
    `;
  });
  writeFile(outputPath, `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Title of the document</title>
${importString}
</head>

<body>
${outputString}
</body>

</html>`);
  logSuccess('Successfully generated example.html');
}

async function generateFiles() {
  const files = await readFilesFromDirectory(src);
  const svgFiles = files.filter(fileName => path.extname(fileName) === '.svg');

  if (!svgFiles.length) {
    logError('There are no svg files in the given source directory');
  }

  svgFiles.forEach(async fileName => {
    const srcPath = path.resolve(src, fileName);
    const outputFileName = generateFileName(fileName, {
      prefix,
      suffix
    });
    const customElementName = generateCustomElementName(fileName, {
      prefix,
      suffix
    });
    const componentName = generateComponentName(fileName, {
      prefix,
      suffix
    });
    const outputPath = path.resolve(dest, `${outputFileName}.js`);
    const options = {
      srcPath,
      outputPath,
      componentName,
      customElementName,
      style
    };
    await generateFile(options);
  });

  if (example) {
    await generateExampleHTML(svgFiles);
  }
}

(async () => {
  try {
    logSuccess('WebIcons: Generating WebComponents from svgs');
    let externalConfig = {};

    if (svgoConfigPath) {
      const svgoConfigString = await readFile(svgoConfigPath, 'utf8');
      externalConfig = JSON.parse(svgoConfigString);
    }

    svgoInstance = new Svgo(mergeConfig(svgoConfig, externalConfig));
    await generateFiles();
  } catch (error) {
    logError(error);
  }
})();