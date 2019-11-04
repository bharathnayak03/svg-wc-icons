/**
usage:
const gwc = require('svg-wc-icons');
const webComponentString = gwc(svgPath, {
  customElementName: 'user-icon',
  className: 'UserIcon',
});
 */
const path = require('path');
const Svgo = require('svgo');
const svgoConfig = require('./svgo.config');
const {
  readFile,
  generateCustomElementName,
  mergeConfig,
  generateClassName,
} = require('./utils');
const generate = require('./template');

let svgoInstance;

async function generateWebComponent(srcPath, options = {}) {
  const {
    svgoConfig: externalConfig = {},
    prefix,
    customElementName,
    className,
  } = options;

  svgoInstance = new Svgo(mergeConfig(svgoConfig, externalConfig));

  const fileName = path.basename(srcPath);

  if (path.extname(fileName) !== '.svg') {
    throw new Error('Only svg files can be converted into web component icons');
  }

  const rawSvg = await readFile(srcPath, 'utf8');
  const optimizedSvg = await svgoInstance.optimize(rawSvg);

  return generate({
    ...options,
    svg: optimizedSvg.data,
    customElementName: customElementName
    || generateCustomElementName(fileName, { prefix }),
    className: className || generateClassName(fileName, { prefix }),
  });
}

module.exports = generateWebComponent;
