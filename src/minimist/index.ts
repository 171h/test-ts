// for ESM
import minimist from 'minimist';
console.log('process.argv', process.argv)
console.log('process.argv0', process.argv0)
const argv = minimist(process.argv.slice(2));
console.log('argv', argv);

const argv2 = minimist(process.argv, {
  string: [
    'user-data-dir',
    'locale',
    'js-flags',
    'crash-reporter-directory'
  ],
  boolean: [
    'disable-chromium-sandbox',
  ],
  default: {
    'sandbox': true
  },
  alias: {
    'no-sandbox': 'sandbox'
  }
})

console.log('argv2', argv2);
