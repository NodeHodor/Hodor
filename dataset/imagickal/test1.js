var im = require('imagickal');
var fs = require('fs');

//get image dimensions
im.dimensions('small.jpg').then(function (dim) {
    console.log(dim.width);
    console.log(dim.height);
});

//get image dimensions and type
im.identify('small.jpg').then(function (data) {
    console.log(data);
});

//Add true as second argument on identify to check if the image is corrupt.
im.identify('small.jpg', true).then(function (data) {
    console.log(data);
});

//Don't like using promises, use regular node style callbacks for all functions that returns promises.
im.identify('small.jpg', function (err, data) {
    console.log(data);
});

//Using streams instead of filepath
im.identify(fs.createReadStream('small.jpg'), function (err, data) {
    console.log(data);
});

// im.transform(fs.createReadStream('small.jpg'), fs.createWriteStream('out.jpg', {encoding: 'binary'}), {strip: true}).then(function () {
//     console.log('Done')
// });


//transform image with action object,
//actions is applied in the same order as they are recevied
var actions =  {
    resize: { width: 100 },
    crop: { width: 10, height: 10, x: 10, y: 10 },
    quality: 90,
    strip: true
};

im.transform('src.jpg', 'dst.jpg', actions).then(function () {
    console.log('Done')
});

//transform image with command object
im.commands()
    .resize({ width: 100 })
    .crop({ width: 10, height: 10, x: 10, y: 10 })
    .quality(90)
    .strip()
    .exec('src.jpg', 'dst.jpg').then(function () {
        console.log('done');
    });


var cmds = im.commands({ executable: 'MAGICK_MEMORY_LIMIT=256MB /tmp/convert' });
var cmd = cmds.get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.strip()
    .quality(5)
    .crop({ width: 1, height: 2, x: 3, y: 4 })
    .get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.rotate({ angle: 0, x: 1, y: 2 }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.rotate({ angle: 1, x: 1, y: 2, bgColor: 'blue' }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.resize({ flag: '!' }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.resize({ width: 10, flag: '>' }).get('src.jpg', 'dst.jpg');

cmds = im.commands();
cmd = cmds.resize({ width: 10, flag: '^' }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.resize({ width: 10, flag: 'f' }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.gravity('Center').get('src.jpg', 'dst.jpg');
var cmds = im.commands();
var cmd = cmds.gravity('Invalid').get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.sharpen({ mode: 'foobar' }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.sharpen({ mode: 'off' }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.sharpen({ mode: 0 }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.sharpen({ mode: 'variable' }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.sharpen({ mode: 'variable', width: 250, height: 250 }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.crop({ width: 100, height: 250, x: 10, y: 0 }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.crop({ width: 100, height: 250, x: -10, y: -12 }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.density(300).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var widthCmd = cmds.extent({ width: 100 }).get('src.jpg', 'dst.jpg');
var heightCmd = cmds.extent({ height: 100 }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
var cmd = cmds.extent({ width: 100, height: 200 }).get('src.jpg', 'dst.jpg');

var cmds = im.commands();
    cmds
    .strip()
    .exec("small.jpg", 'test.jpg');

var cmds = im.commands();
cmds.strip().exec("small.jpg", 'test.jpg', { format: 'png' });

var cmds = im.commands();
cmds.exec(fs.createReadStream("small.jpg"), fs.createWriteStream('test.jpg', { encoding: 'binary' }), { format: 'png' });

var cmds = im.commands();
cmds
    .strip()
    .exec(fs.createReadStream("small.jpg"), fs.createWriteStream('test.jpg', { encoding: 'binary' }));

var stream = require("stream");
const Readable = stream.Readable;
const Writeable = stream.Writable;
var cmds = im.commands();
var dst = new Writeable();
var src = new Readable();
cmds.get(src, dst);

    

// //specify executable path
// im.commands({ executable: 'MAGICK_MEMORY_LIMIT=256MB /tmp/convert' }).exec('src.jpg', 'dst.png');

// //or set global for im.
// im.setDefaults({ executable: 'MAGICK_MEMORY_LIMIT=256MB /tmp/convert' });