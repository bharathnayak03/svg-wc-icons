"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  generateComponentName
} = require('./utils');

const generate = require('./template');

let svgoInstance;

async function generateWebComponent(srcPath, options = {}) {
  const {
    svgoConfig: externalConfig = {},
    prefix,
    suffix = 'icon',
    customElementName,
    componentName
  } = options;
  svgoInstance = new Svgo(mergeConfig(svgoConfig, externalConfig));
  const fileName = path.basename(srcPath);

  if (path.extname(fileName) !== '.svg') {
    throw new Error('Only svg files can be converted into web component icons');
  }

  const rawSvg = await readFile(srcPath, 'utf8');
  const optimizedSvg = await svgoInstance.optimize(rawSvg);
  return generate(_objectSpread({}, options, {
    svg: optimizedSvg.data,
    customElementName: customElementName || generateCustomElementName(fileName, {
      prefix,
      suffix
    }),
    componentName: componentName || generateComponentName(fileName, {
      prefix,
      suffix
    })
  }));
}

module.exports = generateWebComponent;