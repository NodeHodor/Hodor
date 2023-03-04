var PDFImage = require("pdf-image").PDFImage;
 
var pdfImage = new PDFImage("sample.pdf");
pdfImage.getInfo();
pdfImage.convertPage(0).then(function (imagePath) {
  console.log(imagePath);
  // 0-th page (first page) of the slide.pdf is available as slide-0.png
  // fs.existsSync("slide-0.png") // => true
});
pdfImage.convertPage(100).then(function (imagePath) {
  console.log(imagePath);
  // 0-th page (first page) of the slide.pdf is available as slide-0.png
  // fs.existsSync("slide-0.png") // => true
});
pdfImage.numberOfPages();
pdfImage.getOutputImagePathForPage(0);
pdfImage.constructGetInfoCommand();

// pdfImage.convertFile().then(function (imagePaths) {
//   // [ /tmp/slide-0.png, /tmp/slide-1.png ]
// });

// pdfImage.convertFile().then(function (imagePaths) {
//    // /tmp/slide.png 
// });
