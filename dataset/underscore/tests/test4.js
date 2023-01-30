var _ = require("underscore");
var assert = require("assert");
console.log(233);
    try {
        
      assert.ok(!_.isEqual(iNumber, 101));
      assert.ok(_.isEqual(iNumber, 100));
  
      // Objects from another frame.
      assert.ok(_.isEqual({}, iObject), 'Objects with equivalent members created in different documents are equal');
  
      // Array from another frame.
      assert.ok(_.isEqual([1, 2, 3], iArray), 'Arrays with equivalent elements created in different documents are equal');
} catch(err){}
  
    try {
      assert.ok(!_([iNumber]).isEmpty(), '[1] is not empty');
      assert.ok(!_.isEmpty(iArray), '[] is empty');
      assert.ok(_.isEmpty(iObject), '{} is empty');
} catch(err){}
  
    try {
      assert.ok(!_.isElement('div'), 'strings are not dom elements');
      assert.ok(_.isElement(document.body), 'the body tag is a DOM element');
      assert.ok(_.isElement(iElement), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isArguments(iArguments), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isObject(iElement), 'even from another frame');
      assert.ok(_.isObject(iFunction), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isArray(iArray), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isString(iString), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isNumber(iNumber), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isBoolean(iBoolean), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isFunction(iFunction), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isDate(iDate), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isRegExp(iRegExp), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isNaN(iNaN), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isNull(iNull), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isUndefined(iUndefined), 'even from another frame');
} catch(err){}
  
    try {
      assert.ok(_.isError(iError), 'even from another frame');
} catch(err){}
  
  
      try {
        var fn = function() {};
        var xml = new ActiveXObject('Msxml2.DOMDocument.3.0');
        var div = document.createElement('div');
  
        // JIT the function
        var count = 200;
        while (count--) {
          _.isFunction(fn);
        } 
  
        assert.strictEqual(_.isFunction(xml), false);
        assert.strictEqual(_.isFunction(div), false);
        assert.strictEqual(_.isFunction(fn), true);
  } catch(err){}
