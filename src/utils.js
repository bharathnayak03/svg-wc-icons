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

function generateFileName(fileName, { prefix }) {
  const prefixStr = prefix ? `${prefix}-` : '';
  return `${changeCase.snake(prefixStr + fileName.replace('.svg', ''))}_icon`;
}

function generateClassName(fileName, { prefix }) {
  const prefixStr = prefix ? `${prefix}-` : '';

  return `${changeCase.pascalCase(prefixStr + fileName.replace('.svg', ''))}Icon`;
}

function generateCustomElementName(fileName, { prefix }) {
  const prefixStr = prefix ? `${prefix}-` : '';

  return `${changeCase.param(prefixStr + fileName.replace('.svg', ''))}-icon`;
}

function mergeConfig(src, config) {
  return {
    ...src,
    plugins: [
      ...src.plugins,
      ...(config.plugins || []),
    ],
  };
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
  generateClassName,
  generateCustomElementName,
  mergeConfig,
  logSuccess,
  logError,
};
