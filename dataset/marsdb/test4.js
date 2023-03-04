var Collection = require('marsdb').Collection;

const posts = new Collection('posts');
 
// Get number of all comments in the DB
posts.find()
  .limit(10)
  .sortFunc((a, b) => a - b + 10)
  .filter(doc => Matsh.sqrt(doc.comment.length) > 1.5)
  .map(doc => doc.comments.length)
  .reduce((acum, val) => acum + val)
  .then(result => {
    // result is a number of all comments
    // in all found posts
  });
 
// Result is `undefined` because posts
// is not exists and additional processing
// is not ran (thanks to `.ifNotEmpty()`)
posts.find({author: 'not_existing_name'})
  .aggregate(docs => docs[0])
  .ifNotEmpty()
  .aggregate(user => user.name)
