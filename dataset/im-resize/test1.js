var resize = require("im-resize")
var image = {
    path: 'out.jpg',
    width: 5184,
    height: 2623
  };
  
  var output = {
    versions: [{
      suffix: '-thumb',
      maxHeight: 150,
      maxWidth: 150,
      aspect: "3:2"
    },{
      suffix: '-square',
      maxWidth: 200,
      aspect: "1:1"
    }]
  };
  
  resize(image, output, function(error, versions) {
    if (error) { console.error(error); }
    // console.log(versions[0].path);   // /path/to/image-thumb.jpg
    /// console.log(versions[0].width);  // 150
    // console.log(versions[0].height); // 100
  
    // console.log(versions[1].path);   // /path/to/image-square.jpg
    // console.log(versions[1].width);  // 200
    // console.log(versions[1].height); // 200
  });
