var resize = require('mobile-icon-resizer');

var options = 
  {android: {
        "images" : [
                {
                          "baseRatio" : console.log('hacked'),

                          "folder" : "drawable-mdpi"
                        },
       {
               "baseRatio" : "4",
                       "folder" : "drawable-xxxhdpi"
                             },
                                   {
                                           "size": "512x512",
                                                   "folder" : "WEB"
                                                         }
                                                             ]
                                                               }
  }



resize(options, function (err) {


});

var options = {
  "size": "512x512",
  "folder" : "WEB"
}
resize(options, function (err) {});

var config = {
  iOS: {
    "images": [
      {
        "size" : "29x29",
        "idiom" : "iphone",
        "filename" : "-Small.png", // The filename will be prefixed with the provided iOS filename prefix
        "scale" : "1x"
      },
      {
        "size" : "29x29",
        "idiom" : "iphone",
        "filename" : "-Small@2x.png",
        "scale" : "2x"
      },
      // ...
      {
        "size" : "76x76",
        "idiom" : "ipad",
        "filename" : "-76@2x.png",
        "scale" : "2x"
      }
    ]
  },
  android: {
    "images" : [
      {
        "baseRatio" : "1",
        "folder" : "drawable-mdpi"
      },
      // ...
      {
        "baseRatio" : "4",
        "folder" : "drawable-xxxhdpi"
      },
      {
        "size": "512x512",
        "folder" : "WEB"
      }
    ]
  }
};
resize(options, function (err) {});

var options = {
  "iOS": {
    "images": [
      {
        "size" : "29x29",
        "idiom" : "iphone",
        "filename" : "-Small.png", // The filename will be prefixed with the provided iOS filename prefix
        "scale" : "1x"
      },
      // ...
    ]
  },
  "android": {
    "images" : [
      {
        "baseRatio" : "1",
        "folder" : "drawable-mdpi"
      },
      // ...
    ]
  }
}
resize(options, function (err) {});
resize(options, function (err) {});
resize(options, function (err) {});
