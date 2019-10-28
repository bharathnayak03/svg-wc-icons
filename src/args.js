const { argv } = require('yargs')
  .options({
    src: {
      alias: 's',
      describe: 'Source directory',
      type: 'string',
    },
    dest: {
      alias: 'd',
      describe: 'Destination directory',
      type: 'string',
    },
    output: {
      alias: 'o',
      describe: 'Output file',
      type: 'string',
    },
    svgoConfig: {
      describe: 'SVGO config json file to override the svgo config',
      type: 'string',
    },
    prefix: {
      alias: 'p',
      default: 'web',
      describe: 'prefix for generated custom elements',
      type: 'string',
    },
  });

module.exports = argv;
