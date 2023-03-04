var { Sheet } = require('metacalc');

var sheet = new Sheet();

sheet.cells['A1'] = 100;
sheet.cells['B1'] = 2;
sheet.cells['C1'] = '=A1*B1';

console.log({ sheet });

'use strict';

// var metatests = require('metatests');
var { Sheet } = require('metacalc');
var sheet = new Sheet();
  sheet.cells['A1'] = 100;
  sheet.cells['B1'] = 2;
  sheet.cells['C1'] = '=A1*B1';
  sheet.cells['D1'] = '=(A1 / B1) - 5';
  sheet.cells['E1'] = '=-A1';
sheet.values['C1']
sheet.values['D1']
sheet.values['E1']

var sheet = new Sheet();
sheet.cells['A1'] = 100;
sheet.cells['B1'] = 2;
sheet.cells['C1'] = '=A1*B1';
sheet.cells['D1'] = '=C1+8';
sheet.cells['E1'] = '=D1/2';
sheet.values['D1'];
sheet.values['E1'];


var sheet = new Sheet();
sheet.cells['A1'] = 100;
sheet.cells['B1'] = -2;
sheet.cells['C1'] = '=Math.abs(B1)';
sheet.cells['D1'] = '=Math.exp(A1)';
sheet.cells['E1'] = '=Math.max(A1, B1)';
sheet.cells['F1'] = '=Math.pow(A1, 2)';
sheet.cells['G1'] = '=Math.sin(A1)';
sheet.cells['H1'] = '=Math.sqrt(A1)';
sheet.cells['I1'] = '=Math.sin(Math.sqrt(Math.pow(A1, B1)))';
sheet.cells['J1'] = '=Math.PI * Math.E * Math.LN2 * Math.LN10';
sheet.values['C1']
sheet.values['D1']
sheet.values['E1']
sheet.values['F1']
sheet.values['G1']
sheet.values['H1']
sheet.values['I1']
sheet.values['J1']



