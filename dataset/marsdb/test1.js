var Collection = require('marsdb').Collection;

// Default storage is in-memory
// Setup different storage managers
// (all documents will be save in a browser cache)
// Collection.defaultStorageManager(LocalForageManager);
 
// Create collection wit new default storage
const users = new Collection('users');
const session = new Collection('session', {inMemory: true});
const posts = new Collection('posts');
posts.find({author: 'Bob'})
  .project({author: 1})
  .sort(['createdAt'])
  .then(docs => {
    // do something with docs
  });

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

const stopper = posts.find({tags: {$in: ['marsdb', 'is', 'awesome']}})
  .observe(docs => {
    // invoked on every result change
    // (on initial result too)
    stopper.stop(); // stops observing
  }).then(docs => {
    // invoked once on initial result
    // (after `observer` callback)
  });
  posts.find()
  .join(doc => {
    // Return a Promise for waiting of the result.
    return users.findOne(doc.authorId).then(user => {
      doc.authorObj = user;
      // any return is ignored
    });
  })
  .join(doc => {
    // For reactive join you must invoke `observe` instead `then`
    // That's it!
    return users.findOne(doc.authorId).observe(user => {
      doc.authorObj = user;
    });
  })
  .join((doc, updated) => {
    // Also any other “join” mutations supported
    // doc.another = _cached_data_by_post[doc._id];
 
    // Manually update a joined parameter and propagate
    // update event from current cursor to a root
    // (`observe` callback invoked)
    setTimeout(() => {
      doc.another = 'some another user';
      updated();
    }, 10);
  })
  // Or just pass join spec object for fast joining
  // (only one `find` will be produced for all posts)
  .join({ authorId: users }) // posts[i].authorId will be user object
  .observe((posts) => {
    // do something with posts with authors
    // invoked any time when posts changed
    // (and when observed joins changed too)
  })

  posts.insert({text: 'MarsDB is awesome'}).then(docId => {
    // Invoked after persisting document
  })
//   posts.insertAll(
//     {text: 'MarsDB'},
//     {text: 'is'},
//     {text: 'awesome'}
//   ).then(docsIds => {
//     // invoked when all documents inserted
//   });

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

  posts.remove({authorId: {$in: [1,2,3]}})
  .then(removedDocs => {
    // do something with removed documents array
  });

  





