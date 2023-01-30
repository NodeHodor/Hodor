var Collection = require('marsdb').Collection;

const users = new Collection('users');
const posts = new Collection('posts');
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
    doc.another = _cached_data_by_post[doc._id];
 
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
