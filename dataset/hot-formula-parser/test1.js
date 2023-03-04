var FormulaParser = require('hot-formula-parser').Parser;
var parser = new FormulaParser();

parser.parse('SUM(1, 6, 7)'); // It returns `Object {error: null, result: 14}`

var FormulaParser = require('hot-formula-parser').Parser;
var parser = new FormulaParser();

parser.parse('SUM(1, 6, 7)'); // It returns `Object {error: null, result: 14}`

// var parser = new FormulaParser（

parser.parse('(1 + 5 + (5 * 10)) / 10'); // returns `Object {error: null, result: 5.6}`
parser.parse('SUM(MY_VAR)'); // returns `Object {error: "#NAME?", result: null}`
parser.parse('1;;1'); // returns `Object {error: "#ERROR!", result: null}`

parser.setVariable('MY_VARIABLE', 5);
parser.setVariable('fooBar', 10);

parser.parse('(1 + MY_VARIABLE + (5 * fooBar)) / fooBar'); // returns `5.6`

parser.setVariable('fooBar', 10);

parser.getVariable('fooBar'); // returns `10`

parser.setFunction('ADD_5', function(params) {
    return params[0] + 5;
  });
parser.setFunction('GET_LETTER', function(params) {
var string = params[0];
var index = params[1] - 1;

return string.charAt(index);
});

parser.parse('SUM(4, ADD_5(1))'); // returns `10`
parser.parse('GET_LETTER("Some string", 3)'); // returns `m`

parser.setFunction('ADD_5', function(params) {
    return params[0] + 5;
  });
  
parser.getFunction('ADD_5')([1]); // returns `6

parser.on('callVariable', function(name, done) {
    if (name === 'foo') {
      done(Math.PI / 2);
    }
  });
  
parser.parse('SUM(SIN(foo), COS(foo))'); // returns `1`

parser.on('callFunction', function(name, params, done) {
    if (name === 'ADD_5') {
      done(params[0] + 5);
    }
  });
  
parser.parse('ADD_5(3)'); // returns `8`

parser.on('callCellValue', function(cellCoord, done) {
    // using label
    if (cellCoord.label === 'B$6') {
      done('hello');
    }
    // or using indexes
    if (cellCoord.row.index === 5 && cellCoord.row.isAbsolute && cellCoord.column.index === 1 && !cellCoord.column.isAbsolute) {
      done('hello');
    }
  
    if (cellCoord.label === 'C6') {
      done(0.75);
    }
  });
  
parser.parse('B$6'); // returns `"hello"`
parser.parse('B$6&" world"'); // returns `"hello world"`
parser.parse('FISHER(C6)'); // returns `0.9729550745276566`

parser.on('callRangeValue', function(startCellCoord, endCellCoord, done) {
    var data = [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
    ];
    var fragment = [];
  
    for (var row = startCellCoord.row.index; row <= endCellCoord.row.index; row++) {
      var rowData = data[row];
      var colFragment = [];
  
      for (var col = startCellCoord.column.index; col <= endCellCoord.column.index; col++) {
        colFragment.push(rowData[col]);
      }
      fragment.push(colFragment);
    }
  
    if (fragment) {
      done(fragment);
    }
  });
  
parser.parse('JOIN(A1:E2)'); // returns `"1,2,3,4,5,6,7,8,9,10"`
parser.parse('COLUMNS(A1:E2)'); // returns `5`
parser.parse('ROWS(A1:E2)'); // returns `2`
parser.parse('COUNT(A1:E2)'); // returns `10`
parser.parse('COUNTIF(A1:E2, ">5")'); // returns `5`