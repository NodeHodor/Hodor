var Collection = require('marsdb').Collection;

const posts = new Collection('posts');
const stopper = posts.find({tags: {$in: ['marsdb', 'is', 'awesome']}})
  .observe(docs => {
    // invoked on every result change
    // (on initial result too)
    stopper.stop(); // stops observing
  }).then(docs => {
    // invoked once on initial result
    // (after `observer` callback)
  });
