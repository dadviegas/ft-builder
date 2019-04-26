const config = require('../src').default;

var variables = [
  { key: 'test1', value: '_test1_'},
  { key: 'test2', value: '_test2_'},
];

const a = config({file: './example/config.yml', environment: 'development', transformOptions: variables });
const b = config({file: './example/config.yml', environment: 'test', transformOptions: variables });
const c = config({file: './example/config.yml', environment: 'production', transformOptions: variables });
const d = config({file: './example/config.yml', environment: '1', transformOptions: variables });

console.log(a);
console.log(b);
console.log(c);
console.log(d);