var Collection = require('marsdb').Collection;

// Default storage is in-memory
// Setup different storage managers
// (all documents will be save in a browser cache)
// Collection.defaultStorageManager(LocalForageManager);
 
// Create collection wit new default storage
const users = new Collection('users');
