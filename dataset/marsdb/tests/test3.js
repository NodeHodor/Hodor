var Collection = require('marsdb').Collection;

const posts = new Collection('posts');
posts.find({author: 'Bob'})
  .project({author: 1})
  .sort(['createdAt'])
  .then(docs => {
    // do something with docs
  });
