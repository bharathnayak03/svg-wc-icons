"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const fs = require('fs');

const path = require('path');

const changeCase = require('change-case');

const chalk = require('chalk');

function errorFirstCallbackToPromise(fn) {
  return (...args) => new Promise((resolve, reject) => {
    fn(...args, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(data);
    });
  });
}

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);

  if (fs.existsSync(dirname)) {
    return;
  }

  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function generateFileName(fileName, {
  prefix
}) {
  const prefixStr = prefix ? `${prefix}-` : '';
  return `${changeCase.snake(prefixStr + fileName.replace('.svg', ''))}_icon`;
}

function generateComponentName(fileName, {
  prefix
}) {
  const prefixStr = prefix ? `${prefix}-` : '';
  return `${changeCase.pascalCase(prefixStr + fileName.replace('.svg', ''))}Icon`;
}

function generateCustomElementName(fileName, {
  prefix
}) {
  const prefixStr = prefix ? `${prefix}-` : '';
  return `${changeCase.param(prefixStr + fileName.replace('.svg', ''))}-icon`;
}

function mergeConfig(src, config) {
  return _objectSpread({}, src, {
    plugins: [...src.plugins, ...(config.plugins || [])]
  });
}

function logError(message) {
  console.error(chalk.red(message));
}

function logSuccess(message) {
  console.log(chalk.green(message));
}

module.exports = {
  errorFirstCallbackToPromise,
  readFile: errorFirstCallbackToPromise(fs.readFile),
  writeFile: errorFirstCallbackToPromise(fs.writeFile),
  readFilesFromDirectory: errorFirstCallbackToPromise(fs.readdir),
  ensureDirectoryExistence,
  generateFileName,
  generateComponentName,
  generateCustomElementName,
  mergeConfig,
  logSuccess,
  logError
};