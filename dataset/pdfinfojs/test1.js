const pdfinfo = require('pdfinfojs');
const pdf = new pdfinfo('{your_dataset_path}/pdfinfojs/node_modules/pdfinfojs/test/pdfs/sample.pdf');
 
pdf.getInfo()

pdf.getInfoSync()