const fs = require('fs');
const path = require('path');
const changeCase = require('change-case');

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

function generateFileName(fileName) {
  return `${changeCase.snake(fileName.replace('.svg', ''))}_icon`;
}

function generateClassName(fileName) {
  return `${changeCase.pascalCase(fileName.replace('.svg', ''))}Icon`;
}

function generateCustomElementName(fileName) {
  return `${changeCase.param(fileName.replace('.svg', ''))}-icon`;
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
};
