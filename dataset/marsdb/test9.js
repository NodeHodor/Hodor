var Collection = require('marsdb').Collection;

const posts = new Collection('posts');
posts.remove({authorId: {$in: [1,2,3]}})
  .then(removedDocs => {
    // do something with removed documents array
  });
