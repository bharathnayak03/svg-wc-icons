const { argv } = require('yargs')
  .options({
    src: {
      alias: 's',
      describe: 'Source directory',
      type: 'string',
      demandOption: true,
    },
    dest: {
      alias: 'd',
      describe: 'Destination directory',
      type: 'string',
      demandOption: true,
    },
    svgoConfig: {
      describe: 'SVGO config json file to override the svgo config',
      type: 'string',
    },
    prefix: {
      describe: 'prefix for generated custom elements',
      type: 'string',
    },
    suffix: {
      describe: 'suffix for generated custom elements',
      default: 'icon',
      type: 'string',
    },
    example: {
      describe: 'generate example.html file which uses generated web components',
      type: 'boolean',
    },
    style: {
      describe: 'custom style for the internals of generated web components',
      type: 'string',
    },
  });

module.exports = argv;
