/**
usage:
const gwc = require('svg-wc-icons');
const webComponentString = gwc(svgPath, {
  customElementName: 'user-icon',
  componentName: 'UserIcon',
});
 */
const path = require('path');
const Svgo = require('svgo');
const svgoConfig = require('./svgo.config');
const {
  readFile,
  generateCustomElementName,
  mergeConfig,
  generateComponentName,
} = require('./utils');
const generate = require('./template');

let svgoInstance;

async function generateWebComponent(srcPath, options = {}) {
  const {
    svgoConfig: externalConfig = {},
    prefix,
    suffix = 'icon',
    customElementName,
    componentName,
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
    || generateCustomElementName(fileName, { prefix, suffix }),
    componentName: componentName || generateComponentName(fileName, { prefix, suffix }),
  });
}

module.exports = generateWebComponent;
