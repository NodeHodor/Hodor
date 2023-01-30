/* Including Imports module */
require('node-import');

/* Configuring Include location */
include.location('./test/include').verbose(true);

/* Testing Imports */
console.log('\r\nTESTING IMPORTS --------------------\r\n');

/* Import without export */
console.log('IMPORT - NO EXPORT ------------------------------------');
imports('test/imports/index', false, true);

/* Import without export */
console.log('IMPORT - ONLY EXPORT ------------------------------------');
imports('test/imports/index', { exec: false, export: true, exportDir: 'test/imports/output' }, true);

/* Import without export */
console.log('\r\nTEST INCLUDE ------------------------------------');
include('index')();

/* Import without export */
console.log('\r\nTEST INCLUDE ------------------------------------');
include('people')();

/* Import without export */
console.log('\r\nTEST INCLUDE ------------------------------------');
include('master')();

/* Import without export */
console.log('\r\nTEST INCLUDE ------------------------------------');
include('team')();

/* Import without export */
console.log('\r\nTEST INCLUDE ------------------------------------');
include('child')();
