// Load node-import without wrapping to variable.
require('node-import');
 
// After node-import loaded, all methods will available in global scope.
include('foo');
imports('bar/main');
