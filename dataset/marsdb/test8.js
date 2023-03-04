var Collection = require('marsdb').Collection;

const posts = new Collection('posts');
posts.update(
  {authorId: {$in: [1, 2, 3]}},
  {$set: {text: 'noop'}}
).then(result => {
  console.log(result.modified) // count of modified docs
  console.log(result.updated) // array of updated docs
  console.log(result.original) // array of original docs
});
 
// Upsert (insert when nothing found)
posts.update(
  {authorId: "123"},
  {$set: {text: 'noop'}},
  {upsert: true}
).then(result => {
  // { authorId: "123", text: 'noop', _id: '...' }
});
