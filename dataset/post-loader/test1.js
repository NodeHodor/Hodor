const postLoader = require('post-loader')
 
module.exports = {
  module: {
    rules: [{
      test: /\.md$/,
      loader: 'post-loader'
    }]
  }
}

