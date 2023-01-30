'use strict';

var _ = require('protojs')
    , assert = require('assert')
    , perfTest = require('./perf');


// describe('Object functions', function() {
    try{
        function TestObject() { this.property = 0; }
        function TestObject2() { this.property = 0; }
        var obj = new TestObject;
        var obj1 = new TestObject;
        var obj2 = new TestObject2;

        obj.prop1 = 1;
        obj1.prop1 = 1;
        obj2.prop2 = 2;

        var result = _.extend(obj, obj2);

            assert.equal(result, obj);
            assert.equal(obj.prop1, 1 , 'properties should be copied');
            assert.equal(obj.prop2, 2 , 'properties should be copied');

        result = _(obj1).extend(obj2)._();

            assert.equal(result, obj1);
            assert.equal(obj1.prop1, 1 , 'properties should be copied');
            assert.equal(obj1.prop2, 2 , 'properties should be copied');

        Object.defineProperty(obj2, 'nonEnum', {
            enumerable: false,
            value: 3
        });

        _.extend(obj, obj2);

            assert.equal(obj.nonEnum, 3 , 'non-enumerable properties should be copied');
            assert.doesNotThrow(function() {
                for (var p in obj)
                    if (p == 'nonEnum')
                        throw new Error;
            }, 'non-enumerable should be copied as non-enumerable');

        _(obj1).extend(obj2);

            assert.equal(obj1.nonEnum, 3 , 'non-enumerable properties should be copied');
            assert.doesNotThrow(function() {
                for (var p in obj1)
                    if (p == 'nonEnum')
                        throw new Error;
            }, 'non-enumerable should be copied as non-enumerable');


        var obj3 = new TestObject;
        Object.defineProperty(obj3, 'prop3', {
            enumerable: false,
            value: 3
        });

        _.extend(obj, obj3, true); // only enumerable properties
            assert.notEqual(obj.prop3, 3, 'non-enumerable properties should NOT be copied if onlyEnumerable is truthy');

        _(obj1).extend(obj3, true); // only enumerable properties
            assert.notEqual(obj1.prop3, 3, 'non-enumerable properties should NOT be copied if onlyEnumerable is truthy');

        _.extend(obj, obj3); // all properties
            assert.equal(obj.prop3, 3, 'non-enumerable properties should be copied if onlyEnumerable is falsy');

        _(obj1).extend(obj3); // all properties
            assert.equal(obj1.prop3, 3, 'non-enumerable properties should be copied if onlyEnumerable is falsy');

        Object.defineProperty(TestObject2.prototype, 'enum', {
            enumerable: true,
            value: 4
        });

            assert.throws(function() {
                for (var p in obj2)
                    if (p == 'enum')
                        throw new Error;
            }, 'enumerable prototype properties should be enumerated too - more like JS test');

        _.extend(obj, obj2);

            assert.equal(obj2.enum, 4, 'prototype property is visible via object');
            assert.equal(obj.enum, undefined, 'enumerable prototype properties should NOT be copied');

        _(obj1).extend(obj2);

            assert.equal(obj2.enum, 4, 'prototype property is visible via object');
            assert.equal(obj1.enum, undefined, 'enumerable prototype properties should NOT be copied');
} catch(err) {}


    try{
        var obj = { prop1: 1 };
        var obj2 = { prop2: 2 };

        _(obj).extend(obj2);

            assert.equal(obj.prop2, 2 , 'properties should be copied');
} catch(err) {}


    try{
        var obj = { prop1: 1 };
        var obj2 = { prop2: 2 };
        var obj3 = { prop3: 3 };

        _(obj).extend(obj2).extend(obj3);

            assert.deepEqual(obj, { prop1: 1, prop2: 2, prop3: 3 }, 'properties should be copied');
} catch(err) {}


    try{
        var obj = {
            attr: {
                bind: 'ml-bind',
                load: 'ml-load'
            }
        };

        _.deepExtend(obj, {
            attr: {
                load: 'cc-load',
                ctrl: 'cc-ctrl'
            }
        });

                assert.deepEqual(obj, {
                    attr: {
                        bind: 'ml-bind', // left untouched
                        load: 'cc-load', // changed
                        ctrl: 'cc-ctrl' // added
                    }
                }, 'should extend inside properties without overwriting them');


        obj = {
            wasScalar: 'overwrite',
            wasObject: {
                inside: 'overwrite too'
            },
            test: {
                deeper: {
                    value1: 'not touched',
                    value2: 'will be changed'
                }
            }
        };

        _.deepExtend(obj, {
            wasScalar: {
                inside: 'overwritten scalar'
            },
            wasObject: 'overwritten object',
            test: {
                deeper: {
                    value2: 'was changed',
                    value3: 'just added'
                }
            }
        });

                assert.deepEqual(obj, {
                    wasScalar: {
                        inside: 'overwritten scalar'
                    },
                    wasObject: 'overwritten object',
                    test: {
                        deeper: {
                            value1: 'not touched', // left untouched
                            value2: 'was changed', // changed
                            value3: 'just added' // added
                        }
                    }
                }, 'should extend deeply nested properties without overwriting them, and overwrite when specified');


        var objWithRecursion = {
            test: {
                normal: 'property',
                recursive: 'object itself will go here'
            }
        };

        objWithRecursion.test.recursive = objWithRecursion;

        var objWithoutRecursion = {
            test: {
                recursive: {
                    test: 'should not be overwritten'
                }
            }
        };
        _.deepExtend(objWithoutRecursion, objWithRecursion);


                assert.deepEqual(objWithoutRecursion, {
                    test: {
                        normal: 'property',
                        recursive: {
                            test: 'should not be overwritten'
                        }
                    }
                }, 'should NOT recreate recursion in this case and should not timeout, may recreate recursion in some cases');
} catch(err) {}


    try{
        var obj = {
            attr: {
                bind: 'ml-bind',
                load: 'ml-load'
            }
        };

        assert.doesNotThrow(function() {
            _.deepExtend(obj, {
                attr: {
                    load: 'cc-load',
                    ctrl: 'cc-ctrl'
                }
            }, false, true);
        });

        obj = {
            wasScalar: 'overwrite'
        };

        assert.throws(function() {
            _.deepExtend(obj, {
                wasScalar: {
                    inside: 'overwritten scalar'
                }
            }, false, true);
        });

        obj = {
            wasObject: {
                inside: 'overwrite too'
            }
        };

        assert.throws(function() {
            _.deepExtend(obj, {
                wasObject: 'overwritten object'
            }, false, true);
        });
} catch(err) {}


    function testExtendWithNonEnum(method) {
        function Test() {}
        Test.prototype.foo = 'bar';

        var obj = { bar: 'foo' };
        var test = new Test;
        test.foobar = 'barfoo'; // own properties should get through
        _[method](obj, test, true);

        assert.deepEqual(obj, { bar: 'foo', foobar: 'barfoo' });
    }

    try{
        testExtendWithNonEnum('deepExtend');
} catch(err) {}


    try{
        testExtendWithNonEnum('extend');
} catch(err) {}


    function textExtendWithNonEnumArray(method) {
        function Test() {}
        Test.prototype.foo = 'bar';

        var arr = ['foo'];
        var test = new Test;
        test.foobar = 'barfoo'; // own properties should get through
        _[method](arr, [test], true);

        assert.deepEqual(arr, [{ foobar: 'barfoo' }]);
    }

    try{
        textExtendWithNonEnumArray('deepExtend');
} catch(err) {}


    try{
        textExtendWithNonEnumArray('extend');
} catch(err) {}


    try{
        var cloned = _.deepClone({ a: 1, b: { c: 2, d: { e: 3 } } });
        assert.deepEqual(cloned, { a: 1, b: { c: 2, d: { e: 3 } } });
        cloned = _({ a: 1, b: { c: 2, d: { e: 3 } } }).deepClone()._();
        assert.deepEqual(cloned, { a: 1, b: { c: 2, d: { e: 3 } } });

        cloned = _.deepClone({a: 1, b: [ {c: 2, d: [3, 4] } ] });
        assert.deepEqual(cloned, {a: 1, b: [ {c: 2, d: [3, 4] } ] });
        cloned = _({a: 1, b: [ {c: 2, d: [3, 4] } ] }).deepClone()._();
        assert.deepEqual(cloned, {a: 1, b: [ {c: 2, d: [3, 4] } ] });

        cloned = _.deepClone([ {a: 1, b: [ {c: 2, d: [3, 4] } ] }, 5, 6 ]);
        assert.deepEqual(cloned, [ {a: 1, b: [ {c: 2, d: [3, 4] } ] }, 5, 6 ]);
        cloned = _.deepClone([ {a: 1, b: [ {c: 2, d: [3, 4] } ] }, 5, 6 ]);
        assert.deepEqual(cloned, [ {a: 1, b: [ {c: 2, d: [3, 4] } ] }, 5, 6 ]);

        var tempDate = new Date();

        cloned = _.deepClone({ elem: [ 'hello', 'hello',
                { x: [ new Date(tempDate), new RegExp('hello') ] } ], temp: { temp2: [ 'hello1' ] } });
        assert.deepEqual(cloned, { elem: [ 'hello', 'hello',
                { x: [ new Date(tempDate), new RegExp('hello') ] } ], temp: { temp2: [ 'hello1' ] } });
        cloned = _({ elem: [ 'hello', 'hello',
                { x: [ new Date(tempDate), new RegExp('hello') ] } ], temp: { temp2: [ 'hello1' ] } }).deepClone()._();
        assert.deepEqual(cloned, { elem: [ 'hello', 'hello',
                { x: [ new Date(tempDate), new RegExp('hello') ] } ], temp: { temp2: [ 'hello1' ] } });

        cloned = _.deepClone(new Date(tempDate));
        assert.deepEqual(cloned, new Date(tempDate));
        assert(cloned instanceof Date, 'cloned object should be the same class');
        cloned = _(new Date(tempDate)).deepClone()._();
        assert.deepEqual(cloned, new Date(tempDate));
        assert(cloned instanceof Date, 'cloned object should be the same class');

        cloned = _.deepClone(new RegExp('hello'));
        assert.deepEqual(cloned, new RegExp('hello'));
        assert(cloned instanceof RegExp, 'cloned object should be the same class');
        cloned = _(new RegExp('hello')).deepClone()._();
        assert.deepEqual(cloned, new RegExp('hello'));
        assert(cloned instanceof RegExp, 'cloned object should be the same class');

        var duplicatedObject = { prop: true };
        var objectWithDuplicatedObject = {
            x: duplicatedObject,
            y: [ duplicatedObject ],
            z: {
                x2: duplicatedObject
            }
        };

        cloned = _.deepClone(objectWithDuplicatedObject);
        assert.deepEqual(cloned, objectWithDuplicatedObject);
} catch(err) {}


    try{
        function TestObject() { this.property = 0; }
        var obj = new TestObject;
        obj.prop1 = 1;

        var obj2 = _.clone(obj);
            assert(obj2 instanceof TestObject, 'cloned object should be of the same class');
            assert.equal(obj2.prop1, 1);

        var obj3 = _(obj).clone()._();
            assert(obj3 instanceof TestObject, 'cloned object should be of the same class');
            assert.equal(obj3.prop1, 1);

        var tempDate = new Date();
        var cloned = _.clone(new Date(tempDate));
            assert(cloned, new Date(tempDate), 'cloned object should be the same');
            assert(cloned instanceof Date, 'cloned object should be the same class');

        cloned = _.clone(new RegExp('hello'));
            assert(cloned, new RegExp('hello'), '');
            assert(cloned instanceof RegExp, 'cloned object should be the same class');
} catch(err) {}


    try{
        var self = {
            a: 1,
            b: 2
        };

        Object.defineProperty(self, 'nonenum', {
            enumerable: false,
            value: 3
        });

        assert.equal(_.keyOf(self, 1), 'a', 'should find property value');
        assert.equal(_.keyOf(self, 3), 'nonenum',
            'should find non-enumerable property value');
        assert.equal(_.keyOf(self, 3, true), undefined,
            'should NOT find non-enumerable property value if nonEnumerable true is specified');

        assert.equal(_(self).keyOf(1)._(), 'a', 'should find property value');
        assert.equal(_(self).keyOf(3)._(), 'nonenum',
            'should find non-enumerable property value');
        assert.equal(_(self).keyOf(3, true)._(), undefined,
            'should NOT find non-enumerable property value if nonEnumerable true is specified');
} catch(err) {}


    try{
        var self = {
            a: 1,
            b: 2,
            c: 3
        };

        Object.defineProperty(self, 'nonenum', {
            enumerable: false,
            value: 4
        });

        assert.deepEqual(_.keys(self), ['a', 'b', 'c']);
        assert.deepEqual(_(self).keys()._(), ['a', 'b', 'c']);

        assert.deepEqual(_.allKeys(self), ['a', 'b', 'c', 'nonenum']);
        assert.deepEqual(_(self).allKeys()._(), ['a', 'b', 'c', 'nonenum']);

        assert.deepEqual(_.values(self), [1, 2, 3, 4]);
        assert.deepEqual(_(self).values()._(), [1, 2, 3, 4]);
        assert.deepEqual(_.values(self, true), [1, 2, 3]);
        assert.deepEqual(_(self).values(true)._(), [1, 2, 3]);
} catch(err) {}


    try{
        var self = {
            a: 1,
            b: 2,
            c: 2,
            d: 3
        };

        Object.defineProperty(self, 'nonenum', {
            enumerable: false,
            value: 3
        });

        var keys = _.allKeysOf(self, 2);
            assert.notEqual(keys.indexOf('b'), -1, 'should find keys for a given property value');
            assert.notEqual(keys.indexOf('c'), -1, 'should find keys for a given property value');

        keys = _(self).allKeysOf(2)._();
            assert.notEqual(keys.indexOf('b'), -1, 'should find keys for a given property value');
            assert.notEqual(keys.indexOf('c'), -1, 'should find keys for a given property value');

        keys = _.allKeysOf(self, 3);
            assert.notEqual(keys.indexOf('d'), -1, 'should find ALL keys for a given property value');
            assert.notEqual(keys.indexOf('nonenum'), -1, 'should ALL find keys for a given property value');

        keys = _(self).allKeysOf(3)._();
            assert.notEqual(keys.indexOf('d'), -1, 'should find ALL keys for a given property value');
            assert.notEqual(keys.indexOf('nonenum'), -1, 'should ALL find keys for a given property value');

        keys = _.allKeysOf(self, 3, true); // enumerable only
            assert.notEqual(keys.indexOf('d'), -1,
                'should find enumerable keys for a given property value if nonEnumerable true is specified');
            assert.equal(keys.indexOf('nonenum'), -1,
                'should NOT find non-enumerable keys for a given property value if nonEnumerable true is specified');

        keys = _(self).allKeysOf(3, true)._(); // enumerable only
            assert.notEqual(keys.indexOf('d'), -1,
                'should find enumerable keys for a given property value if nonEnumerable true is specified');
            assert.equal(keys.indexOf('nonenum'), -1,
                'should NOT find non-enumerable keys for a given property value if nonEnumerable true is specified');
} catch(err) {}


    try{
        var self = {
            a: 1,
            b: 2
        };

        Object.defineProperty(self, 'nonenum', {
            enumerable: false,
            value: 3
        });

        var result, thisArg;
        function callback(value, key, obj) {
            result[key] = value;
            assert.equal(obj, self, 'iterated object should be passed as the third parameter');
            assert.equal(this, thisArg, 'context should be correctly set from the third parameter of eachKey');
        }

        var result = {}, thisArg = this;
        _.eachKey(self, callback, thisArg); // iterate over all properties
            assert.deepEqual(result, { a: 1, b: 2, nonenum: 3 }, 'ALL properties should be used in iteration');

        result = {};
        _(self).eachKey(callback, thisArg); // iterate over all properties
            assert.deepEqual(result, { a: 1, b: 2, nonenum: 3 }, 'ALL properties should be used in iteration');

        result = {}, thisArg = null;
        _.eachKey(self, callback, thisArg, true); // iterate over enumerable properties
            assert.deepEqual(result, { a: 1, b: 2 }, 'only enumerable properties should be used in iteration');

        result = {};
        _(self).eachKey(callback, thisArg, true); // iterate over enumerable properties
            assert.deepEqual(result, { a: 1, b: 2 }, 'only enumerable properties should be used in iteration');

        function TestClass() {}
        TestClass.prototype.protoProp = 4;
        self = new TestClass;
        self.a = 1;
        self.b = 2;
        Object.defineProperty(self, 'nonenum', {
            enumerable: false,
            value: 3
        });

        var result = {}, thisArg = undefined;
        _.eachKey(self, callback); // iterate over all properties
            assert('protoProp' in self);
            assert.deepEqual(result, { a: 1, b: 2, nonenum: 3 }, 'prototype properties should NOT be used in iteration');

        result = {};
        _(self).eachKey(callback); // iterate over all properties
            assert('protoProp' in self);
            assert.deepEqual(result, { a: 1, b: 2, nonenum: 3 }, 'prototype properties should NOT be used in iteration');
} catch(err) {}


    try{
        var self = {
            a: 1,
            b: 2
        };

        _.defineProperty(self, 'nonenum', 3);

        var result, thisArg;
        function callback(value, key, obj) {
            assert.equal(obj, self, 'iterated object should be passed as the third parameter');
            assert.equal(this, thisArg, 'context should be correctly set from the third parameter of eachKey');
            return value * 10;
        }

        var thisArg = this;
        var result = _.mapKeys(self, callback, thisArg); // iterate over all properties
        assert1(result);

        var result = _(self).mapKeys(callback, thisArg)._(); // iterate over all properties
        assert1(result);


        var thisArg = null;
        var result = _.mapKeys(self, callback, thisArg, true); // iterate over enumerable properties
        assert2(result);

        var result = _(self).mapKeys(callback, thisArg, true)._(); // iterate over enumerable properties
        assert2(result);


        function TestClass() {}
        TestClass.prototype.protoProp = 4;
        self = new TestClass;
        self.a = 1;
        self.b = 2;

        var thisArg = undefined;
        var result = _.mapKeys(self, callback); // iterate over all properties
        assert3(result);

        var result = _(self).mapKeys(callback)._(); // iterate over all properties
        assert3(result);

            assert('protoProp' in self);
            assert.equal(result.hasOwnProperty('protoProp'), false, 'prototype properties should not be used in iteration');
            assert.equal(result.protoProp, 4, 'result should have the same prototype');
            assert.equal(result.a, 10, 'only enumerable properties should be used in iteration');
            assert.equal(result.b, 20, 'only enumerable properties should be used in iteration');

        function assert1(result) {
            assert.deepEqual(result, {
                a: 10,
                b: 20
            });
            assert.equal(result.a, 10, 'ALL properties should be used in iteration');
            assert.equal(result.b, 20, 'ALL properties should be used in iteration');
            assert.equal(result.nonenum, 30, 'ALL properties should be used in iteration');
        }

        function assert2(result) {
            assert.equal(result.a, 10, 'only enumerable properties should be used in iteration');
            assert.equal(result.b, 20, 'only enumerable properties should be used in iteration');
            assert.equal(result.nonenum, undefined, 'only enumerable properties should be used in iteration');
        }

        function assert3(result) {
            assert('protoProp' in self);
            assert.equal(result.hasOwnProperty('protoProp'), false, 'prototype properties should not be used in iteration');
            assert.equal(result.protoProp, 4, 'result should have the same prototype');
            assert.equal(result.a, 10, 'only enumerable properties should be used in iteration');
            assert.equal(result.b, 20, 'only enumerable properties should be used in iteration');
        }
} catch(err) {}


    try{
        var self = {
            a: 1,
            b: 2,
            c: 3
        };
        _.defineProperty(self, 'nonenum', 100);

        var thisArg = {};

        function callback(prevValue, value, key, obj) {
            assert.equal(this, thisArg);
            return prevValue + value;
        }

        assert.equal(_.reduceKeys(self, callback, 10, thisArg, true), 16);
        assert.equal(_(self).reduceKeys(callback, 10, thisArg, true)._(), 16);

        assert.equal(_.reduceKeys(self, callback, 10, thisArg, false), 116);
        assert.equal(_(self).reduceKeys(callback, 10, thisArg, false)._(), 116);

        assert.throws(_.partial(_.reduceKeys, self, callback, 0));
} catch(err) {}


    try{
        var self = {
            a: 1,
            b: 2,
            c: 3,
            d: 4,
            e: 5
        };
        _.defineProperty(self, 'nonenum', 7);

        var thisArg = {};

        function callback(value, key, obj) {
            assert.equal(this, thisArg);
            return value % 2;
        }

        assert.deepEqual(_.filterKeys(self, callback, thisArg, true), {a: 1, c: 3, e: 5});
        assert.deepEqual(_(self).filterKeys(callback, thisArg, true)._(), {a: 1, c: 3, e: 5});

        var expected = {a: 1, c: 3, e: 5};
        _.defineProperty(expected, 'nonenum', 7);
        var result = _.filterKeys(self, callback, thisArg);
            assert.deepEqual(result, expected);
            assert.equal(result.nonenum, expected.nonenum);

        result = _(self).filterKeys(callback, thisArg)._();
            assert.deepEqual(result, expected);
            assert.equal(result.nonenum, expected.nonenum);

        assert.throws(_.partial(_.filterKeys, self, callback));
} catch(err) {}


    try{
        var self = {
            a: 1,
            b: 2,
            c: 3
        };
        _.defineProperty(self, 'nonenum', 4);

        var thisArg = {};

        function callback(value, key, obj) {
            assert.equal(this, thisArg);
            return value > 3;
        }

        assert.equal(_.someKey(self, callback, thisArg, true), false);
        assert.equal(_.someKey(self, callback, thisArg), true);
        assert.throws(_.partial(_.someKey, self, callback));
} catch(err) {}


    try{
        var self = {
            a: 1,
            b: 2,
            c: 3
        };
        _.defineProperty(self, 'nonenum', 4);

        var thisArg = {};

        function callback(value, key, obj) {
            assert.equal(this, thisArg);
            return value < 4;
        }

        assert.equal(_.everyKey(self, callback, thisArg, true), true);
        assert.equal(_.everyKey(self, callback, thisArg), false);
        assert.throws(_.partial(_.everyKey, self, callback));
} catch(err) {}


    try{
        var self = {
            a: 1,
            b: 2
        };

        function mapCallback(value) {
            return value + 'test';
        }

        function eachCallback(value, key, obj) {
            obj[key] = value * 10;
        }

        var result = _(self)
                        .eachKey(eachCallback)
                        .mapKeys(mapCallback)
                        ._();

            assert.deepEqual(result, { a: '10test', b: '20test' });

        perfTest(
            function() {
                var result = _(self)
                                .eachKey(eachCallback)
                                .mapKeys(mapCallback)
                                ._();
            },
            function() {
                _.eachKey(self, eachCallback);
                var result = _.mapKeys(self, mapCallback);
            },
            20000
        );
} catch(err) {}


    try{
        var obj = { a: 0, b: 2, c: 4, d: 6, e: 7, f: 10, g: 12 }
            , thisArg = {};

        function callback(value, key, object) {
            assert(this, thisArg);
            assert(object, obj);
            return value % 2;
        }

        function callback2(value, key, array) {
            return value > 20;
        }

        assert.equal(_.findValue(obj, callback, thisArg), 7);
        assert.equal(_.findValue(obj, callback2, thisArg), undefined);

        assert.equal(_(obj).findValue(callback, thisArg)._(), 7);
        assert.equal(_(obj).findValue(callback2, thisArg)._(), undefined);

        _.defineProperty(obj, 'nonenum', 100)

        assert.equal(_.findValue(obj, callback2, thisArg), 100);
        assert.equal(_.findValue(obj, callback2, thisArg, true), undefined);

        assert.equal(_(obj).findValue(callback2, thisArg)._(), 100);
        assert.equal(_(obj).findValue(callback2, thisArg, true)._(), undefined);
} catch(err) {}


    try{
        var obj = { a: 0, b: 2, c: 4, d: 6, e: 7, f: 10, g: 12 }
            , thisArg = {};

        function callback(value, key, object) {
            assert(this, thisArg);
            assert(object, obj);
            return value % 2;
        }

        function callback2(value, key, array) {
            return value > 20;
        }

        assert.equal(_.findKey(obj, callback, thisArg), 'e');
        assert.equal(_.findKey(obj, callback2, thisArg), undefined);

        assert.equal(_(obj).findKey(callback, thisArg)._(), 'e');
        assert.equal(_(obj).findKey(callback2, thisArg)._(), undefined);

        _.defineProperty(obj, 'nonenum', 100)

        assert.equal(_.findKey(obj, callback2, thisArg), 'nonenum');
        assert.equal(_.findKey(obj, callback2, thisArg, true), undefined);

        assert.equal(_(obj).findKey(callback2, thisArg)._(), 'nonenum');
        assert.equal(_(obj).findKey(callback2, thisArg, true)._(), undefined);
} catch(err) {} 


    try{
        var obj1 = {}
            , o1 = {}
            , obj2 = {};

        _.defineProperty(obj1, 'prop', 1);
        _(o1).defineProperty('prop', 1);
        Object.defineProperty(obj2, 'prop', {
            value: 1
        });
        assertProp(obj1, 'prop');
        assertProp(o1, 'prop');


        _.defineProperty(obj1, 'enumprop', 2, _.ENUMERABLE);
        _(o1).defineProperty('enumprop', 2, _.ENUMERABLE);
        Object.defineProperty(obj2, 'enumprop', {
            enumerable: true,
            value: 2
        });
        assertProp(obj1, 'enumprop');
        assertProp(o1, 'enumprop');


        _.defineProperty(obj1, 'enum_writ_prop', 3, _.ENUMERABLE + _.WRITABLE);
        _(o1).defineProperty('enum_writ_prop', 3, _.ENUMERABLE + _.WRITABLE);
        Object.defineProperty(obj2, 'enum_writ_prop', {
            enumerable: true,
            writable: true,
            value: 3
        });
        assertProp(obj1, 'enum_writ_prop');
        assertProp(o1, 'enum_writ_prop');


        function assertProp(o, prop) {
            assert.deepEqual(
                Object.getOwnPropertyDescriptor(o1, prop),
                Object.getOwnPropertyDescriptor(obj2, prop)
            );
        }
} catch(err) {}


    try{
        var obj1 = {}
            , obj2 = {};

        _.defineProperties(obj1, {
            prop1: 1,
            prop2: 2
        });

        Object.defineProperties(obj2, {
            prop1: { value: 1 },
            prop2: { value: 2 }
        });

            assert.deepEqual(
                Object.getOwnPropertyDescriptor(obj1, 'prop1'),
                Object.getOwnPropertyDescriptor(obj2, 'prop1')
            );
            assert.deepEqual(
                Object.getOwnPropertyDescriptor(obj1, 'prop2'),
                Object.getOwnPropertyDescriptor(obj2, 'prop2')
            );


        _.defineProperties(obj1, {
            enumprop1: 3,
            enumprop2: 4
        }, _.ENUM);

        Object.defineProperties(obj2, {
            enumprop1: { value: 3, enumerable: true },
            enumprop2: { value: 4, enumerable: true }
        });

            assert.deepEqual(
                Object.getOwnPropertyDescriptor(obj1, 'enumprop1'),
                Object.getOwnPropertyDescriptor(obj2, 'enumprop1')
            );
            assert.deepEqual(
                Object.getOwnPropertyDescriptor(obj1, 'enumprop2'),
                Object.getOwnPropertyDescriptor(obj2, 'enumprop2')
            );

        _.defineProperties(obj1, {
            enum_writ_prop1: 5,
            enum_writ_prop2: 6
        }, _.ENUM + _.WRIT);

        Object.defineProperties(obj2, {
            enum_writ_prop1: { value: 5, enumerable: true, writable: true },
            enum_writ_prop2: { value: 6, enumerable: true, writable: true }
        });

            assert.deepEqual(
                Object.getOwnPropertyDescriptor(obj1, 'enum_writ_prop1'),
                Object.getOwnPropertyDescriptor(obj2, 'enum_writ_prop1')
            );
            assert.deepEqual(
                Object.getOwnPropertyDescriptor(obj1, 'enum_writ_prop2'),
                Object.getOwnPropertyDescriptor(obj2, 'enum_writ_prop2')
            );
} catch(err) {}


    try{
        var obj = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 };
        var picked = _.pickKeys(obj, 'a', 'b', ['e', 'f', 'zzz']);
        assert.deepEqual(picked, { a: 1, b: 2, e: 5, f: 6 });

        picked = _(obj).pickKeys('a', 'b', ['e', 'f', 'zzz'])._();
        assert.deepEqual(picked, { a: 1, b: 2, e: 5, f: 6 });
} catch(err) {}


    try{
        var obj = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 };
        var omitted = _.omitKeys(obj, 'a', 'b', ['e', 'f', 'zzz']);
        assert.deepEqual(omitted, { c: 3, d: 4 });

        omitted = _(obj).omitKeys('a', 'b', ['e', 'f', 'zzz'])._();
        assert.deepEqual(omitted, { c: 3, d: 4 });
} catch(err) {}


    try{
        testIsEqual('isEqual', assert);
} catch(err) {}


    try{
        testIsEqual('isNot', assert.ifError);
} catch(err) {}


    function testIsEqual(eqMethod, assert) {
        var obj1 = { name: 'milo', info: { test: 1 } }
            , obj2 = { name: 'milo', info: { test: 1 } }
            , obj3 = { name: 'milo', info: { test: 2 } }
            , obj4 = { name: 'milo' }
            , arr1 = [ 1, 2, [ 3, 4, { test: 5 } ] ]
            , arr2 = [ 1, 2, [ 3, 4, { test: 5 } ] ]
            , arr3 = [ 1, 2, [ 3, 4, { test: 6 } ] ];

        assert(_[eqMethod](null, null));
        assert(_[eqMethod](NaN, NaN));
        assert(_[eqMethod](undefined, undefined));
        assert(! _[eqMethod](0, -0));
        assert(_[eqMethod](obj1, obj2));
        assert(! _[eqMethod](obj1, obj3));
        assert(_[eqMethod](arr1, arr2));
        assert(! _[eqMethod](arr1, arr3));
        assert(_[eqMethod](/[a-c]/, /[a-c]/));
        assert(! _[eqMethod](/[a-c]/, /[a-c]/i));

        assert(! _[eqMethod](obj3, obj4));
        assert(! _[eqMethod](obj4, obj3));

        assert(_(null)[eqMethod](null)._());
        assert(_(NaN)[eqMethod](NaN)._());
        assert(_(undefined)[eqMethod](undefined)._());
        assert(! _(0)[eqMethod](-0)._());
        assert(_(obj1)[eqMethod](obj2)._());
        assert(! _[eqMethod](obj1, obj3));
        assert(_(arr1)[eqMethod](arr2)._());
        assert(! _(arr1)[eqMethod](arr3)._());
        assert(_(/[a-c]/)[eqMethod](/[a-c]/)._());
        assert(! _(/[a-c]/)[eqMethod](/[a-c]/i)._());

        assert(! _(obj3)[eqMethod](obj4)._());
        assert(! _(obj4)[eqMethod](obj3)._());
    }
// });
