var Collection = require('marsdb').Collection;

const users = new Collection('users');
 
// But it may be useful to create in-memory
// collection without defined defaults
// (for example to save some session state)
const session = new Collection('session', {inMemory: true});
