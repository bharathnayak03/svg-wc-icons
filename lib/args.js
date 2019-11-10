"use strict";

const {
  argv
} = require('yargs').options({
  src: {
    alias: 's',
    describe: 'Source directory',
    type: 'string',
    demandOption: true
  },
  dest: {
    alias: 'd',
    describe: 'Destination directory',
    type: 'string',
    demandOption: true
  },
  svgoConfig: {
    describe: 'SVGO config json file to override the svgo config',
    type: 'string'
  },
  prefix: {
    alias: 'p',
    describe: 'prefix for generated custom elements',
    type: 'string'
  }
});

module.exports = argv;