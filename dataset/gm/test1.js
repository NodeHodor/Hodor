const fs = require('fs');
const gm = require("gm");

var buf = fs.readFileSync('tests/imgs/original.jpg');
var m = gm(buf, 'original.jpg');
m.identify(function (err, _) {
  });

gm('tests/imgs/original.jpg')
  .montage('tests/imgs/list.jpg')
  .geometry('+100+150')
  .write('montage.png', function(err) {
      if(!err) console.log("Written montage image.");
  });
  
gm('tests/imgs/original.jpg')
  .composite('tests/imgs/list.jpg')
  .geometry('+100+150')
  .write('montage.png', function(err) {
      if(!err) console.log("Written montage image.");
  });
  
var options = {
    file: 'tests/fixtures/favicon.png',
    highlightColor: 'yellow',
    tolerance: 0.02
}
gm.compare('tests/fixtures/compare_1.png', 'tests/fixtures/compare_1.png', options, function (err, isEqual, equality, raw) {
})

gm('tests/imgs/original.jpg')
    .stroke("#ffffff")
    .drawCircle(10, 10, 20, 10)
    .font("Helvetica.ttf", 12)
    .drawText(30, 20, "GMagick!")
    .write("drawing.png", function (err) {
    if (!err) console.log('done');
    });

gm(200, 400, "#ddff99f3")
    .drawText(10, 50, "from scratch")
    .write("brandNewImg.jpg", function (err) {
    // ...
    });

gm('tests/imgs/original.jpg')
    .flip()
    .magnify()
    .rotate('green', 45)
    .blur(7, 3)
    .crop(300, 300, 150, 130)
    .edge(3)
    .write('/crazy.jpg', function (err) {
    if (!err) console.log('crazytown has arrived');
    })

// auto-orient an image
gm('tests/imgs/original.jpg')
    .autoOrient()
    .write('/path/to/oriented.jpg', function (err) {
    })

// pull out the first frame of an animated gif and save as png
gm('tests/imgs/original.gif')
    .write('original.png', function (err) {
    if (err) console.log('aaw, shucks');
    });

gm('tests/imgs/original.jpg')
    .resize(240, 240)
    .noProfile()
    .write('resize.png', function (err) {
      if (!err) console.log('done');
    });

// obtain the size of an image
gm('tests/imgs/original.jpg')
    .size(function (err, size) {
    if (!err)
        console.log(size.width > size.height ? 'wider' : 'taller than you');
    });

gm('tests/imgs/original.jpg')
    .resizeExact(240, 240)
    .write('/path/to/resize.png', function (err) {
      if (!err) console.log('done');
    });

gm('tests/imgs/original.jpg')
    .identify(function (err, data) {
      if (!err) console.log(data)
    });

var readStream = fs.createReadStream('tests/imgs/original.jpg');
gm(readStream, 'img.jpg')
    .write('reformat.png', function (err) {
      if (!err) console.log('done');
    });

try{
    var request = require('request');
    var url = "www.abc.com/pic.jpg"

    gm(request(url))
    .write('reformat.png', function (err) {
    if (!err) console.log('done');
    });
} catch(err){
}

// gm('tests/fixtures/iptc-multiple.jpg')
//     .resize('200', '200')
//     .stream(function (err, stdout, stderr) {
//     var writeStream = fs.createWriteStream('resized.jpg');
//     stdout.pipe(writeStream);
// });

// var writeStream = fs.createWriteStream('tests/imgs/original.jpg');
// gm('img.jpg')
//     .resize('200', '200')
//     .stream()
//     .pipe(writeStream);

// gm('tests/imgs/original.jpg')
//     .stream('png', function (err, stdout, stderr) {
//       var writeStream = fs.createWriteStream('reformatted.png');
//       stdout.pipe(writeStream);
//     });

// var writeStream = fs.createWriteStream('reformatted.png');
// gm('tests/imgs/original.jpg')
//     .stream('png')
//     .pipe(writeStream);

// var readStream = fs.createReadStream('tests/imgs/original.jpg');
// gm(readStream)
//     .resize('200', '200')
//     .stream(function (err, stdout, stderr) {
//     var writeStream = fs.createWriteStream('resized.jpg');
//     stdout.pipe(writeStream);
//     });

// var readStream = fs.createReadStream('tests/imgs/original.jpg');
// gm(readStream)
//     .size({bufferStream: true}, function(err, size) {
//       this.resize(size.width / 2, size.height / 2)
//       this.write('resized.jpg', function (err) {
//         if (!err) console.log('done');
//       });
//     });

// var buf = require('fs').readFileSync('tests/imgs/original.png');

gm(buf, 'image.jpg')
    .noise('laplacian')
    .write('out.jpg', function (err) {
      console.log('Created an image from a Buffer!');
    });

// gm('img.jpg')
//     .resize(100, 100)
//     .toBuffer('PNG',function (err, buffer) {
//       console.log('done!');
//     })

// gm()
// .label('Offline')
// .stream();

// gm()
// .out('label:Offline')
// .stream();

gm('tests/imgs/original.jpg').format(function (err, format) {

})

gm('img.png').identify('%m', function (err, format) {

})

gm('tests/imgs/original.jpg').morph('tests/imgs/lost.png', 'tmp', function (err, format) {

})

gm('tests/imgs/original.jpg').thumb(200, 200, 'tmp', 1, function (err, format) {

})
gm('tests/imgs/original.jpg').quality(1)

gm('tests/imgs/original.jpg').size(function(err, value){
    // note : value may be undefined
  })
gm('tests/imgs/original.jpg').depth (function(err, value){
    // note : value may be undefined
  })
gm('tests/imgs/original.jpg').color(function(err, value){
    // note : value may be undefined
  })
gm('tests/imgs/original.jpg').res(function(err, value){
    // note : value may be undefined
  })
gm('tests/imgs/original.jpg').filesize(function(err, value){
    // note : value may be undefined
  })
gm('tests/imgs/original.jpg').identify(function(err, value){
    // note : value may be undefined
  })
gm('tests/imgs/original.jpg').orientation(function(err, value){
    // note : value may be undefined
  })

gm('tests/imgs/original.jpg').append('tests/imgs/original.gif', true)

gm('tests/imgs/original.jpg').adjoin()
gm('tests/imgs/original.jpg').affine("1")
gm('tests/imgs/original.jpg').antialias(false)


gm("img.png").authenticate("2333")

gm("img.jpg").autoOrient()

gm("img.jpg").autoOrient()

gm("img.png").backdrop()

gm("img.png").bitdepth("1")

gm("img.png").blackThreshold("red")

gm("img.png").bluePrimary(1, 2)

gm("img.png").blur("radius")

gm("img.png").border(1, 1)

gm("img.png").borderColor("red")

gm("img.png").box("red")

gm("img.png").channel("red")

gm("img.png").charcoal()

gm("img.png").chop(1, 1, 1, 1)

gm("img.png").clip()

gm("img.png").coalesce()

gm("img.png").colorize("red")

gm("img.png").colorMap("shared")

gm("img.png").compose()

gm("img.png").compress()

gm("img.png").comment("text")

gm("img.png").contrast()

gm("img.png").convolve()

gm("img.png").createDirectories()

gm("img.png").silent()

var gm2 = require('gm').subClass({ imageMagick: '7+' });
var gm3 = require('gm').subClass({ imageMagick: true });
var gm4 = require('gm').subClass({
    appPath: String.raw`/home/linuxbrew/.linuxbrew/bin/magick`
  });


