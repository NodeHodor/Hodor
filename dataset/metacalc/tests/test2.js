'use strict';

// const metatests = require('metatests');
const { Sheet } = require('metacalc');

// metatests.test('Simple expressions', async (test) => {
try{
  const sheet = new Sheet();
  sheet.cells['A1'] = 100;
  sheet.cells['B1'] = 2;
  sheet.cells['C1'] = '=A1*B1';
  sheet.cells['D1'] = '=(A1 / B1) - 5';
  sheet.cells['E1'] = '=-A1';
  test.strictSame(sheet.values['C1'], 200);
  test.strictSame(sheet.values['D1'], 45);
  test.strictSame(sheet.values['E1'], -100);
  test.end();
} catch(err) {}

// metatests.test('Expression chain', async (test) => {
try{
  const sheet = new Sheet();
  sheet.cells['A1'] = 100;
  sheet.cells['B1'] = 2;
  sheet.cells['C1'] = '=A1*B1';
  sheet.cells['D1'] = '=C1+8';
  sheet.cells['E1'] = '=D1/2';
  test.strictSame(sheet.values['D1'], 208);
  test.strictSame(sheet.values['E1'], 104);
  test.end();
} catch(err) {}

// metatests.test('JavaScript Math', async (test) => {
try{
  const sheet = new Sheet();
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
  test.strictSame(sheet.values['C1'], 2);
  test.strictSame(sheet.values['D1'], Math.exp(100));
  test.strictSame(sheet.values['E1'], 100);
  test.strictSame(sheet.values['F1'], 10000);
  test.strictSame(sheet.values['G1'], Math.sin(100));
  test.strictSame(sheet.values['H1'], Math.sqrt(100));
  test.strictSame(sheet.values['I1'], Math.sin(Math.sqrt(Math.pow(100, -2))));
  test.strictSame(sheet.values['J1'], Math.PI * Math.E * Math.LN2 * Math.LN10);
  test.end();
} catch(err) {}

// metatests.test('Correct cell values', async (test) => {
try{
  const sheet = new Sheet();
  sheet.cells['A1'] = 20;

  sheet.cells['B1'] = 100;
  test.strictEqual(sheet.values['B1'], 100, 'Correct simple value');

  sheet.cells['B1'] = '=Math.pow(A1, 2)';
  test.strictEqual(sheet.values['B1'], Math.pow(20, 2));

  sheet.cells['B1'] = 30;
  test.strictEqual(sheet.values['B1'], 30);

  sheet.cells['B1'] = 'value';
  test.strictEqual(sheet.values['B1'], 'value');

  sheet.cells['B1'] = '=(7 / 2).toFixed(2)';
  test.strictEqual(sheet.values['B1'], '3.50');

  sheet.cells['B1'] = '=+(10 / 3).toFixed(4)';
  test.strictEqual(sheet.values['B1'], 3.3333);

  sheet.cells['B1'] = '=+(Math.PI).toFixed(2)';
  test.strictEqual(sheet.values['B1'], 3.14);

  test.end();
} catch(err) {}

// metatests.test('Prevent arbitrary js code execution', async (test) => {
try{
  const sheet = new Sheet();

  sheet.cells['A1'] =
    '=Math.constructor.constructor("console.log(\\"Hello, World!\\")")();';
  try {
    sheet.values['A1'];
    test.fail();
  } catch (error) {
    test.strictSame(error.constructor.name === 'TypeError', true);
  }

  sheet.cells['A1'] =
    '=this.data.constructor.constructor("console.log(\\"Hello, World!\\")")();';
  try {
    sheet.values['A1'];
    test.fail();
  } catch (error) {
    test.strictSame(error.constructor.name === 'TypeError', true);
  }

  sheet.cells['A1'] =
    '=this.constructor.constructor("console.log(\\"Hello, World!\\")")();';
  try {
    sheet.values['A1'];
    test.fail();
  } catch (error) {
    test.strictSame(error.constructor.name === 'TypeError', true);
  }

  sheet.cells['A1'] = `=Reflect.get(this, "constructor")
    .constructor("console.log(\\"Hello, World!\\")")();`;
  try {
    sheet.values['A1'];
    test.fail();
  } catch (error) {
    test.strictSame(error.constructor.name === 'TypeError', true);
  }

  sheet.cells['A1'] =
    '=Object.constructor.constructor("console.log(\\"Hello, World!\\")")();';
  try {
    sheet.values['A1'];
    test.fail();
  } catch (error) {
    test.strictSame(error.constructor.name === 'TypeError', true);
  }

  sheet.cells['A1'] =
    '=({}).constructor.constructor("console.log(\\"Hello, World!\\")")();';
  try {
    sheet.values['A1'];
    test.fail();
  } catch (error) {
    test.strictSame(error.constructor.name === 'EvalError', true);
  }

  sheet.cells['A1'] =
    '=Math.ceil.constructor("console.log(\\"Hello, World!\\")")();';
  try {
    sheet.values['A1'];
    test.fail();
  } catch (error) {
    test.strictSame(error.constructor.name === 'TypeError', true);
  }

  test.end();
} catch(err) {}

// metatests.test('Should emit idetifier hook', (test) => {
try{
  const sheet = new Sheet();

  sheet.on(
    'identifier',
    test.mustCall((prop, sht) => {
      test.strictEqual(sht, sheet);
      test.strictEqual(prop, 'C1');
      return 3;
    }, 1),
  );

  sheet.cells['A1'] = 100;
  sheet.cells['B1'] = -2;
  sheet.cells['D1'] = '= A1 + B1 + C1';
  test.strictEqual(sheet.values['D1'], 101);

  test.end();
} catch(err) {}

// metatests.test(
//   'Multiple identifier hooks must handle first non undefined value',
//   (test) => {
try{
    const sheet = new Sheet();

    sheet.on(
      'identifier',
      test.mustCall((prop) => {
        if (prop === 'A0') return 1;
        return undefined;
      }, 3),
    );

    sheet.on(
      'identifier',
      test.mustCall((prop) => {
        if (prop === 'A1') return 2;
        return undefined;
      }, 2),
    );

    test.strictEqual(sheet.values['A0'], 1, 'Value from first subscription');
    test.strictEqual(sheet.values['A1'], 2, 'Value from second subscription');
    test.strictEqual(
      sheet.values['A2'],
      undefined,
      'Not handled value equals undefined',
    );

    test.end();
} catch(err) {}

// metatests.test('Keeping expression sources', async (test) => {
try{
  const sheet = new Sheet();
  sheet.cells['A1'] = 100;
  sheet.cells['B1'] = -2;
  sheet.cells['C1'] = '=(A1 / B1) - 5';
  sheet.cells['D1'] = '=Math.exp(A1)';
  sheet.cells['E1'] = '=Math.sin(Math.sqrt(Math.pow(A1, B1)))';

  test.strictEqual(
    sheet.cells['C1'].source,
    '=(A1 / B1) - 5',
    'Correct expression source',
  );
  test.strictEqual(
    sheet.cells['D1'].source,
    '=Math.exp(A1)',
    'Correct expression source',
  );
  test.strictEqual(
    sheet.cells['E1'].source,
    '=Math.sin(Math.sqrt(Math.pow(A1, B1)))',
    'Correct expression source',
  );

  test.end();
} catch(err) {}
