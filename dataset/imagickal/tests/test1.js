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

im.transform(fs.createReadStream('small.jpg'), fs.createWriteStream('out.jpg', {encoding: 'binary'}), {strip: true}).then(function () {
    console.log('Done')
});


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

// //specify executable path
// im.commands({ executable: 'MAGICK_MEMORY_LIMIT=256MB /tmp/convert' }).exec('src.jpg', 'dst.png');

// //or set global for im.
// im.setDefaults({ executable: 'MAGICK_MEMORY_LIMIT=256MB /tmp/convert' });