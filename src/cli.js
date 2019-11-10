#!/usr/bin/env node
/**
Usage:
web-icons test.svg --output test_icon.js
web-icons --src './test/svg_files' --dest './test/dest'
web-icons --src './test/svg_files' --dest './test/dest' --svgoConfig config.js
web-icons --src './test/svg_files' --dest './test/dest' --prefix hr
web-icons --src './test/svg_files' --dest './test/dest' --prefix icon --suffix component
*/
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
  logError,
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
} = args;
let svgoInstance;

async function generateFile(options) {
  const {
    srcPath,
    outputPath,
  } = options;

  const rawSvg = await readFile(srcPath, 'utf8');
  const optimizedSvg = await svgoInstance.optimize(rawSvg);
  ensureDirectoryExistence(outputPath);
  await writeFile(outputPath, generate({
    ...options,
    svg: optimizedSvg.data,
  }), {
    flag: 'w',
  });
  logSuccess(`WebIcons: Successfully generated ${outputPath}`);
}


async function generateExampleHTML(files) {
  const outputPath = path.resolve(dest, 'example.html');
  let importString = '';
  let outputString = '';

  files.forEach(async (fileName) => {
    const outputFileName = generateFileName(fileName, { prefix, suffix });
    const customElementName = generateCustomElementName(fileName, { prefix, suffix });
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
  const svgFiles = files.filter((fileName) => path.extname(fileName) === '.svg');

  if (!svgFiles.length) {
    logError('There are no svg files in the given source directory');
  }

  svgFiles.forEach(async (fileName) => {
    const srcPath = path.resolve(src, fileName);
    const outputFileName = generateFileName(fileName, { prefix, suffix });
    const customElementName = generateCustomElementName(fileName, { prefix, suffix });
    const componentName = generateComponentName(fileName, { prefix, suffix });

    const outputPath = path.resolve(dest, `${outputFileName}.js`);
    const options = {
      srcPath,
      outputPath,
      componentName,
      customElementName,
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
