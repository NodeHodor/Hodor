var Collection = require('marsdb').Collection;

const posts = new Collection('posts');
posts.insert({text: 'MarsDB is awesome'}).then(docId => {
  // Invoked after persisting document
})
posts.insertAll(
  {text: 'MarsDB'},
  {text: 'is'},
  {text: 'awesome'}
).then(docsIds => {
  // invoked when all documents inserted
});
