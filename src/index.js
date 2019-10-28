/**
Usage:
web-icons test.svg --output test_icon.js
web-icons --src './test/svg_files' --dest './test/dest'
web-icons --src './test/svg_files' --dest './test/dest' --svgoConfig config.js
web-icons --src './test/svg_files' --dest './test/dest' --prefix hr
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
  generateClassName,
  generateCustomElementName,
  mergeConfig,
} = require('./utils');
const generate = require('./template');
const args = require('./args');

const {
  src,
  dest,
  svgoConfig: svgoConfigPath,
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
}

async function generateFiles() {
  const files = await readFilesFromDirectory(src);
  files.forEach(async (fileName) => {
    const srcPath = path.resolve(src, fileName);
    const outputFileName = generateFileName(fileName);
    const customElementName = generateCustomElementName(fileName);
    const className = generateClassName(fileName);

    const outputPath = path.resolve(dest, `${outputFileName}.js`);
    const options = {
      srcPath,
      outputPath,
      className,
      customElementName,
    };
    await generateFile(options);
  });
}

(async () => {
  let externalConfig = {};
  if (svgoConfigPath) {
    const svgoConfigString = await readFile(svgoConfigPath, 'utf8');
    externalConfig = JSON.parse(svgoConfigString);
  }
  svgoInstance = new Svgo(mergeConfig(svgoConfig, externalConfig));

  await generateFiles();
})();
