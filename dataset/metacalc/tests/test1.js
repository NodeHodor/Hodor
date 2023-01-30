const { Sheet } = require('metacalc');

const sheet = new Sheet();

sheet.cells['A1'] = 100;
sheet.cells['B1'] = 2;
sheet.cells['C1'] = '=A1*B1';

console.log({ sheet });
