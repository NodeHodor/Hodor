'use strict';

var _ = require('mol-proto')
    , assert = require('assert');


try {
    var arr = [], thisArg = {}
    _.times(4, function(i) {
        assert.equal(this, thisArg);
        arr.push(i);
    }, thisArg);

    assert.deepEqual(arr, [0, 1, 2, 3]);
} catch(err) {}


try {
    var arr = [], thisArg = {}
    _(4).times(function(i) {
        assert.equal(this, thisArg);
        arr.push(i);
    }, thisArg)._();

    assert.deepEqual(arr, [0, 1, 2, 3]);
} catch(err) {}


try {
    var arr = _.repeat({ test: 1 }, 3);
    assert.deepEqual(arr, [{ test: 1 }, { test: 1 }, { test: 1 }]);
} catch(err) {}


try {
    var arr = _({ test: 1 }).repeat(3)._();
    assert.deepEqual(arr, [{ test: 1 }, { test: 1 }, { test: 1 }]);
} catch(err) {}


try {
    var obj = { a: 1, b: 2, c: 3 };

    var result = _.tap(obj, function(self) {
            assert.deepEqual(self, { a: 1, b: 2, c: 3 })
        });
    
    assert.deepEqual(result, { a: 1, b: 2, c: 3 });
} catch(err) {}


try {
    var obj = { a: 1, b: 2, c: 3 };

    var result = _(obj)
        .mapKeys(function(value) {
            return value * 10;
        })
        .tap(function(self) {
            assert.deepEqual(self, { a: 10, b: 20, c: 30 })
        })
        .allKeys()
        .tap(function(self) {
            assert.deepEqual(self, ['a','b','c']);
        })
        ._();
    
    assert.deepEqual(result, ['a','b','c']);
} catch(err) {}


try {
    var func1 = 'test1'
        , thisArg = {};
        
    function func2() {
        assert.equal(this, thisArg);
        assert.deepEqual(_.slice(arguments), [ 'param0', 'param1' ]);
        return 'test2';
    }

    assert.equal(_.result(func1), 'test1');
    assert.equal(_.result(func2, thisArg, 'param0', 'param1'), 'test2');
} catch(err) {}


try {
    var obj = {};
    assert.equal(_.identity(obj), obj);
} catch(err) {}


try {
    var obj = {};
    assert.equal(_(obj).identity()._(), obj);
} catch(err) {}


try {
    var obj = { prop1: 1, prop2: 2 }
        , p1 = _.property('prop1')
        , p2 = _.property('prop2');
    assert.equal(p1(obj), 1);
    assert.equal(p2(obj), 2);
} catch(err) {}


try {
    var obj = { prop1: 1, prop2: 2 }
        , p1 = _('prop1').property()._()
        , p2 = _('prop2').property()._();
    assert.equal(p1(obj), 1);
    assert.equal(p2(obj), 2);
} catch(err) {}


try {
    var arr = [
        { value: 1, label: 'a'},
        { value: 4, label: 'c'},
        { value: 3, label: 'd'},
        { value: 2, label: 'b'}
    ];

    arr.sort(_.compareProperty('value'));
    assert.deepEqual(arr, [
        { value: 1, label: 'a'},
        { value: 2, label: 'b'},
        { value: 3, label: 'd'},
        { value: 4, label: 'c'}
    ]);

    arr.sort(_.compareProperty('label'));
    assert.deepEqual(arr, [
        { value: 1, label: 'a'},
        { value: 2, label: 'b'},
        { value: 4, label: 'c'},
        { value: 3, label: 'd'}
    ]);
} catch(err) {}


try {
    var arr = [
        { value: 1, label: 'a'},
        { value: 4, label: 'c'},
        { value: 3, label: 'd'},
        { value: 2, label: 'b'}
    ];

    arr.sort(_('value').compareProperty()._());
    assert.deepEqual(arr, [
        { value: 1, label: 'a'},
        { value: 2, label: 'b'},
        { value: 3, label: 'd'},
        { value: 4, label: 'c'}
    ]);

    arr.sort(_('label').compareProperty()._());
    assert.deepEqual(arr, [
        { value: 1, label: 'a'},
        { value: 2, label: 'b'},
        { value: 4, label: 'c'},
        { value: 3, label: 'd'}
    ]);
} catch(err) {}


try {
    assert.equal(_.noop(), undefined);
} catch(err) {}


try {
    assert.equal(_({yo: 'ho'}).noop()._(), undefined);
} catch(err) {}


'use strict';

var _ = require('mol-proto')
    , assert = require('assert')


// describe('Array functions', function() {
    // it('should define appendArray function', function() {
    try {
        var arr = [1, 2, 3];
        var result = _.appendArray(arr, [4, 5, 6, 7]);
        assert.deepEqual(arr, [1, 2, 3, 4, 5, 6, 7]);
        assert.equal(result, arr);

        arr = [1, 2, 3];
        result = _(arr).appendArray([4, 5, 6, 7])._();
        assert.deepEqual(arr, [1, 2, 3, 4, 5, 6, 7]);
        assert.equal(result, arr);
    // });
    } catch(err) {}


    // it('should define prependArray function', function() {
    try {
        var arr = [1, 2, 3];
        var result = _.prependArray(arr, [4, 5, 6, 7]);
        assert.deepEqual(arr, [4, 5, 6, 7, 1, 2, 3]);
        assert.equal(result, arr);

        arr = [1, 2, 3];
        result = _(arr).prependArray([4, 5, 6, 7])._();
        assert.deepEqual(arr, [4, 5, 6, 7, 1, 2, 3]);
        assert.equal(result, arr);
    // });
} catch(err) {}


    // it('should define spliceItem function', function() {
    try {
        var arr = ['a', 'b', 'c'];
        var result = _.spliceItem(arr, 'b');
        assert.deepEqual(arr, ['a', 'c']);
        assert.equal(result, arr);

        arr = ['a', 'b', 'c'];
        result = _(arr).spliceItem('b')._();
        assert.deepEqual(arr, ['a', 'c']);
        assert.equal(result, arr);
    // });
} catch(err) {}


    // it('should define toArray function', function() {
    try {
        var arrayLikeObject = {};
        arrayLikeObject[0] = 2;
        arrayLikeObject[1] = 5;
        arrayLikeObject[2] = 8;
        arrayLikeObject.length = 3;

        var arr = _.toArray(arrayLikeObject);
        assert(Array.isArray(arr), 'should convert arrayLikeObject to array');
        assert.deepEqual(arr, [2, 5, 8], 'should convert arrayLikeObject to array');

        arr = _(arrayLikeObject).toArray()._();
        assert(Array.isArray(arr), 'should convert arrayLikeObject to array');
        assert.deepEqual(arr, [2, 5, 8], 'should convert arrayLikeObject to array');
    // });
} catch(err) {}


    // it('should allow toArray, appendArray and prependArray chaining', function() {
    try {
        var arrLike = { 0: 3, 1: 4, 2: 5, length: 3 };

        var arr = _(arrLike)
            .toArray()
            .prependArray([1, 2])
            .appendArray([6, 7, 8])
            ._();

        assert(Array.isArray(arr), 'should be real array');
        assert.deepEqual(arr, [1, 2, 3, 4, 5, 6, 7, 8],
            'should add to the end and to the beginning of the array');

    // });
} catch(err) {}


    // it('should allow calling native array methods (e.g. map) via _', function() {
    try {
        var arr = [0, 1, 2];
        var thisArg = {};

        var result = _.map(arr, mapFunc, thisArg);
        assert.deepEqual(result, [0, 2, 4]);

        var result = _(arr).map(mapFunc, thisArg)._();
        assert.deepEqual(result, [0, 2, 4]);

        function mapFunc(value, index, array) {
            assert.equal(value, index);
            assert.equal(array, arr);
            assert.equal(this, thisArg);
            return value * 2;
        }
    // });
} catch(err) {}


    // it('should allow chaining of Proto functions together with native array methods', function() {
    try {
        var myMap = {
            prop0: 0,
            prop1: 1,
            prop2: 2,
            prop3: 3
        };

        var newMap = {};
        var thisArg = {};

        var result = _(myMap)
                        .allKeys()
                        .map(function (prop) {
                            assert.equal(this, thisArg);
                            return prop + '_test';
                        }, thisArg)
                        .appendArray(['prop4', 'prop5'])
                        .filter(function (prop) { return prop != 'prop1_test'; })
                        .slice(1)
                        .object()
                        .mapKeys(function (value, key) { return key + '_test2' })
                        ._();

        assert.deepEqual(result, {
            prop2_test: 'prop2_test_test2',
            prop3_test: 'prop3_test_test2',
            prop4: 'prop4_test2',
            prop5: 'prop5_test2',
        });
    // });
} catch(err) {}


    // it('should define object function', function() {
    try {
        var arr = ['a', 'b', 'c'];
        assert.deepEqual(_.object(arr), {a: undefined, b: undefined, c: undefined});
        assert.deepEqual(_.object(arr, 1), {a: 1, b: 1, c: 1});
        assert.deepEqual(_.object(arr, [1, 2, 3]), {a: 1, b: 2, c: 3});

        arr = ['a', 'b', 'c'];
        assert.deepEqual(_(arr).object()._(), {a: undefined, b: undefined, c: undefined});
        assert.deepEqual(_(arr).object(1)._(), {a: 1, b: 1, c: 1});
        assert.deepEqual(_(arr).object([1, 2, 3])._(), {a: 1, b: 2, c: 3});
    // });
} catch(err) {}


    // it('should define mapToObject function', function() {
    try {
        var arr = ['a', 'b', 'c'];
        var thisArg = {};
        function callback(value, index, array) {
            assert.equal(array, arr);
            assert.equal(this, thisArg);
            return value + index;
        }

        var result = _.mapToObject(arr, callback, thisArg);
        assert.deepEqual(result, { a: 'a0', b: 'b1', c: 'c2' });

        result = _(arr).mapToObject(callback, thisArg)._();
        assert.deepEqual(result, { a: 'a0', b: 'b1', c: 'c2' });
    // });
} catch(err) {}


    // it('should define find function', function() {
    try {
        var arr = [0, 2, 4, 6, 7, 10, 12]
            , thisArg = {};

        function callback(value, index, array) {
            assert.equal(this, thisArg);
            assert.equal(array, arr);
            return value != index * 2;
        }

        function callback2(value, index, array) {
            return value > 20;
        }

        function callback3(value, index, array) {
            if (value == index * 2) return false;
            else throw new Error;
        }

        assert.strictEqual(_.find(arr, callback, thisArg), 7);
        assert.strictEqual(_.find(arr, callback2, thisArg), undefined);

        assert.strictEqual(_(arr).find(callback, thisArg)._(), 7);
        assert.strictEqual(_(arr).find(callback2, thisArg)._(), undefined);

        assert.throws(function() {
            var value = _.find(arr, callback3, thisArg);
        });

        assert.throws(function() {
            var value = _(arr).find(callback3, thisArg)._();
        });
    // });
} catch(err) {}


    // it('should define findIndex function', function() {
    try {
        var arr = [0, 2, 4, 6, 7, 10, 12]
            , thisArg = {};

        function callback(value, index, array) {
            assert.equal(this, thisArg);
            assert.equal(array, arr);
            return value != index * 2;
        }

        function callback2(value, index, array) {
            return value > 20;
        }

        assert.strictEqual(_.findIndex(arr, callback, thisArg), 4);
        assert.strictEqual(_.findIndex(arr, callback2, thisArg), -1);
        assert.strictEqual(_(arr).findIndex(callback, thisArg)._(), 4);
        assert.strictEqual(_(arr).findIndex(callback2, thisArg)._(), -1);
    // });
} catch(err) {}


    // it('should define unique function', function() {
    try {
        var arr = [1, 2, 2, 3, 3, 4];

        var result = _.unique(arr);
        assert.deepEqual(result, [1, 2, 3, 4]);

        result = _(arr).unique()._();
        assert.deepEqual(result, [1, 2, 3, 4]);

        arr = [ {a: 1}, {a: 2}, {a: 2}, {a: 3}];

        result = _.unique(arr, compareA);
        assert.deepEqual(result, [ {a: 1}, {a: 2}, {a: 3}]);

        result = _(arr).unique(compareA)._();
        assert.deepEqual(result, [ {a: 1}, {a: 2}, {a: 3}]);

        function compareA(x, y) {
            return x.a == y.a;
        }
    // });
} catch(err) {}


    // it('should define deepForEach function', function() {
    try {
        var arr = [0, [1, 2], [3, [4, 5], 6], 7, [8, 9, 10]]
            , result = []
            , thisArg = {};

        _.deepForEach(arr, collectItems, thisArg);
        assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        result = [];
        _(arr).deepForEach(collectItems, thisArg);
        assert.deepEqual(result, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        function collectItems(value, index, array) {
            assert.equal(this, thisArg);
            assert.equal(array, arr);
            assert.equal(value, index);
            result.push(value);
        }
    // });
} catch(err) {}
// });


'use strict';

var _ = require('mol-proto')
    , assert = require('assert')

    // describe('Number functions', function() {
        // it('should define isNumeric function', function() {
        try {
            assert(_.isNumeric(234));
            assert(_.isNumeric(345.2345));
            assert(_.isNumeric(0.000235345));
            assert(_.isNumeric(10/3));
            assert(_.isNumeric('234'));
            assert(_.isNumeric('234.045'));
    
            assert.equal(_.isNumeric(1/0), false);
            assert.equal(_.isNumeric(Infinity), false);
            assert.equal(_.isNumeric(NaN), false);
            assert.equal(_.isNumeric('eereg'), false);
            assert.equal(_.isNumeric('100g'), false);
            assert.equal(_.isNumeric(''), false);
            assert.equal(_.isNumeric(' '), false);
        // });
        } catch(err) {}
    
        // it('should define isNumeric method', function() {
        try {
            assert(_(234).isNumeric()._());
            assert(_(345.2345).isNumeric()._());
            assert(_(0.000235345).isNumeric()._());
            assert(_(10/3).isNumeric()._());
            assert(_('234').isNumeric()._());
            assert(_('234.045').isNumeric()._());
    
            assert.equal(_(1/0).isNumeric()._(), false);
            assert.equal(_(Infinity).isNumeric()._(), false);
            assert.equal(_(NaN).isNumeric()._(), false);
            assert.equal(_('eereg').isNumeric()._(), false);
            assert.equal(_('100g').isNumeric()._(), false);
            assert.equal(_('').isNumeric()._(), false);
            assert.equal(_(' ').isNumeric()._(), false);
        } catch(err) {}
    // });
    
    'use strict';

    var _ = require('mol-proto')
        , assert = require('assert')
    
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
    

    'use strict';

var _ = require('mol-proto')
    , assert = require('assert');


function throwError() { throw new Error(); }
function doNothing() {}


// describe('Prototype functions', function() {
    try{
        function TestObject() {
            this.property = 1;
        }

        var result = _.extendProto(TestObject, {
            method: throwError,
            method2: doNothing
        });

            assert.equal(result, TestObject);
            assert.throws(TestObject.prototype.method, 'prototype should be extended');
            assert.doesNotThrow(TestObject.prototype.method2, 'prototype should be extended');

            assert.doesNotThrow(function(){
                for (var p in TestObject.prototype)
                    throw new Error;
            }, 'properties should be non-enumerable');

        var obj = new TestObject;

            assert.throws(obj.method, 'object methods can be called');
            assert.doesNotThrow(obj.method2, 'object methods can be called');

            assert.doesNotThrow(function() {
                for (var p in obj)
                    if (p != 'property')
                        throw new Error;
            }, 'methods should be non-enumerable');
} catch(err) {}


    try{
        function TestObject() {
            this.property = 1;
        }

        var result = _(TestObject).extendProto({
            method: throwError,
            method2: doNothing
        })._();

            assert.equal(result, TestObject);
            assert.throws(TestObject.prototype.method, 'prototype should be extended');
            assert.doesNotThrow(TestObject.prototype.method2, 'prototype should be extended');

            assert.doesNotThrow(function(){
                for (var p in TestObject.prototype)
                    throw new Error;
            }, 'properties should be non-enumerable');

        var obj = new TestObject;

            assert.throws(obj.method, 'object methods can be called');
            assert.doesNotThrow(obj.method2, 'object methods can be called');

            assert.doesNotThrow(function() {
                for (var p in obj)
                    if (p != 'property')
                        throw new Error;
            }, 'methods should be non-enumerable');
} catch(err) {}


    try{
        function TestObject() { this.property = 1; };
        TestObject.prototype.method = throwError;
        TestObject.classMethod = throwError;

        var TestSubclass = _.createSubclass(TestObject, 'TestSubclass');

            assert(TestSubclass.prototype instanceof TestObject);
            assert.throws(TestSubclass.classMethod, 'class method of superclass should be copied');
            assert.equal(TestSubclass.name, 'TestSubclass');

        var obj = new TestSubclass;

            assert(obj instanceof TestSubclass);
            assert.equal(obj.constructor, TestSubclass);
            assert(obj instanceof TestObject, 'objects should be instances of ancestor class');
            assert.equal(obj.property, 1, 'constructor of superclass should be called');
            assert.throws(obj.method, 'instance method of superclass should be available');

        var TestSubclass2 = _.createSubclass(TestObject, '', false);

            assert.equal(TestSubclass2.name, '');

        var obj2 = new TestSubclass2;

            assert(obj2 instanceof TestObject, 'objects should be instances of ancestor class');
            assert.equal(obj2.property, undefined, 'constructor of superclass should NOT be called');

        var TestSubclass3 = _.createSubclass(TestObject);
        
        var obj3 = new TestSubclass3;

            assert(obj3 instanceof TestObject, 'objects should be instances of ancestor class');
            assert.equal(obj3.property, 1, 'constructor of superclass should be called');
} catch(err) {}


    try{
        function TestObject() { this.property = 1; };
        TestObject.prototype.method = throwError;
        TestObject.classMethod = throwError;

        var TestSubclass = _(TestObject).createSubclass('TestSubclass')._();

            assert(TestSubclass.prototype instanceof TestObject);
            assert.throws(TestSubclass.classMethod, 'class method of superclass should be copied');
            assert.equal(TestSubclass.name, 'TestSubclass');

        var obj = new TestSubclass;

            assert(obj instanceof TestSubclass);
            assert.equal(obj.constructor, TestSubclass);
            assert(obj instanceof TestObject, 'objects should be instances of ancestor class');
            assert.equal(obj.property, 1, 'constructor of superclass should be called');
            assert.throws(obj.method, 'instance method of superclass should be available');

        var TestSubclass2 = _(TestObject).createSubclass('', false)._();

            assert.equal(TestSubclass2.name, '');

        var obj2 = new TestSubclass2;

            assert(obj2 instanceof TestObject, 'objects should be instances of ancestor class');
            assert.equal(obj2.property, undefined, 'constructor of superclass should NOT be called');

        var TestSubclass3 = _(TestObject).createSubclass()._();
        
        var obj3 = new TestSubclass3;

            assert(obj3 instanceof TestObject, 'objects should be instances of ancestor class');
            assert.equal(obj3.property, 1, 'constructor of superclass should be called');
} catch(err) {}


    try{
        function TestObject() { this.property = 1; };
        TestObject.prototype.method = throwError;
        TestObject.classMethod = throwError;

        function TestSubclass() {}
        _.makeSubclass(TestSubclass, TestObject)

            assert(TestSubclass.prototype instanceof TestObject);
            assert.equal(TestSubclass.name, 'TestSubclass');

        var obj = new TestSubclass;

            assert(obj instanceof TestSubclass);
            assert.equal(obj.constructor, TestSubclass);
            assert(obj instanceof TestObject, 'objects should be instances of ancestor class');
            assert.throws(obj.method, 'instance method of superclass should be available');

        function TestSubclass2() {}
        _.makeSubclass(TestSubclass2, TestObject);

        var obj2 = new TestSubclass2;

            assert(obj2 instanceof TestObject, 'objects should be instances of ancestor class');
            assert.equal(obj2.property, undefined, 'constructor of superclass should NOT be called');

        function TestSubclass3() {
            TestObject.apply(this, arguments);
        }
        _.makeSubclass(TestSubclass3, TestObject);
        
        var obj3 = new TestSubclass3;

            assert(obj3 instanceof TestObject, 'objects should be instances of ancestor class');
            assert.equal(obj3.property, 1, 'constructor of superclass should be called');
} catch(err) {}


    try{
        function TestObject() { this.property = 1; };
        TestObject.prototype.method = throwError;
        TestObject.classMethod = throwError;

        function TestSubclass() {}
        _(TestSubclass).makeSubclass(TestObject)._();

            assert(TestSubclass.prototype instanceof TestObject);
            assert.equal(TestSubclass.name, 'TestSubclass');

        var obj = new TestSubclass;

            assert(obj instanceof TestSubclass);
            assert.equal(obj.constructor, TestSubclass);
            assert(obj instanceof TestObject, 'objects should be instances of ancestor class');
            assert.throws(obj.method, 'instance method of superclass should be available');

        function TestSubclass2() {}
        _(TestSubclass2).makeSubclass(TestObject)._();

        var obj2 = new TestSubclass2;

            assert(obj2 instanceof TestObject, 'objects should be instances of ancestor class');
            assert.equal(obj2.property, undefined, 'constructor of superclass should NOT be called');

        function TestSubclass3() {
            TestObject.apply(this, arguments);
        }
        _(TestSubclass3).makeSubclass(TestObject)._();
        
        var obj3 = new TestSubclass3;

            assert(obj3 instanceof TestObject, 'objects should be instances of ancestor class');
            assert.equal(obj3.property, 1, 'constructor of superclass should be called');
} catch(err) {}


    try{
        function MyClass(a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
        }

        var obj1 = new MyClass(1, 2, 3);
        var obj2 = _.newApply(MyClass, [1, 2, 3]);

            assert.deepEqual(obj1, obj2);

        function createMyClass() {
            return _.newApply(MyClass, arguments);
        }

        var obj3 = createMyClass(1, 2, 3);

            assert.deepEqual(obj1, obj3);        
} catch(err) {}


    try{
        function MyClass(a, b, c) {
            this.a = a;
            this.b = b;
            this.c = c;
        }

        var obj1 = new MyClass(1, 2, 3);
        var obj2 = _(MyClass).newApply([1, 2, 3])._();

            assert.deepEqual(obj1, obj2);

        function createMyClass() {
            return _(MyClass).newApply(arguments)._();
        }

        var obj3 = createMyClass(1, 2, 3);

            assert.deepEqual(obj1, obj3);        
} catch(err) {}
// });

'use strict';

var _ = require('mol-proto')
    , assert = require('assert');


// describe('String functions', function() {
    try {
        var upper = 'UPPERCASE'
            , lower = 'lowercase';

        assert.equal(_.firstUpperCase(upper), 'UPPERCASE');
        assert.equal(_.firstUpperCase(lower), 'Lowercase');
} catch(err) {}


    try {
        var upper = 'UPPERCASE'
            , lower = 'lowercase';

        assert.equal(_(upper).firstUpperCase()._(), 'UPPERCASE');
        assert.equal(_(lower).firstUpperCase()._(), 'Lowercase');
} catch(err) {}


    try {
        var upper = 'UPPERCASE'
            , lower = 'lowercase';

        assert.equal(_.firstLowerCase(upper), 'uPPERCASE');
        assert.equal(_.firstLowerCase(lower), 'lowercase');
} catch(err) {}


    try {
        var upper = 'UPPERCASE'
            , lower = 'lowercase';

        assert.equal(_(upper).firstLowerCase()._(), 'uPPERCASE');
        assert.equal(_(lower).firstLowerCase()._(), 'lowercase');
} catch(err) {}


    try {
        var pattern = /ab+c/i
            , patternStr = pattern.toString();

        assert.equal(patternStr, '/ab+c/i');

        var regex = _.toRegExp(patternStr);
        assert.equal(patternStr, regex.toString());
        assert(regex instanceof RegExp);
        assert(regex.test('ABBC'));
} catch(err) {}


    try {
        var pattern = /ab+c/i
            , patternStr = pattern.toString();

        assert.equal(patternStr, '/ab+c/i');

        var regex = _(patternStr).toRegExp()._();
        assert.equal(patternStr, regex.toString());
        assert(regex instanceof RegExp);
        assert(regex.test('ABBC'));
} catch(err) {}


    try {
        function myFunc() { return 1234; }
        var funcStr = myFunc.toString();

        assert.equal(funcStr, 'function myFunc() { return 1234; }');

        var func = _.toFunction(funcStr);
        assert.equal(funcStr, func.toString());
        assert.equal(typeof func, 'function');
        assert.equal(func(), 1234);
} catch(err) {}


    try {
        function myFunc() { return 1234; }
        var funcStr = myFunc.toString();

        assert.equal(funcStr, 'function myFunc() { return 1234; }');

        var func = _(funcStr).toFunction()._();
        assert.equal(funcStr, func.toString());
        assert.equal(typeof func, 'function');
        assert.equal(func(), 1234);
} catch(err) {}


    try {
        var params = {name: 'Jason', age: 30};

        var str = _.toQueryString(params);
        assert.equal(str, 'name=Jason&age=30');
} catch(err) {}


    try {
        var params = {name: 'Jason', age: 30};

        var str = _(params).toQueryString()._();
        assert.equal(str, 'name=Jason&age=30');
} catch(err) {}


    try {
        var str = 'name=Jason&age=30'; ;

        var params = _.fromQueryString(str);
        assert.deepEqual(params, {name: 'Jason', age: 30});
} catch(err) {}


    try {
        var str = 'name=Jason&age=30'; ;

        var params = _(str).fromQueryString()._();
        assert.deepEqual(params, {name: 'Jason', age: 30});
} catch(err) {}


    try {
        assert.equal(_.toDate(null), undefined);
        assert.equal(_.toDate(undefined), undefined);
        assert.equal(_.toDate(''), undefined);
        assert.equal(_.toDate('abc'), undefined);
        assert.equal(_.toDate('2014-19-02'), undefined);
        assert.equal(_.toDate('2014-02-19').toString(), new Date('2014-02-19').toString());
} catch(err) {}


    try {
        assert.equal(_(null).toDate()._(), undefined);
        assert.equal(_(undefined).toDate()._(), undefined);
        assert.equal(_('').toDate()._(), undefined);
        assert.equal(_('abc').toDate()._(), undefined);
        assert.equal(_('2014-19-02').toDate()._(), undefined);
        assert.equal(_('2014-02-19').toDate()._().toString(), new Date('2014-02-19').toString());
} catch(err) {}


    try {
        var json = '{"test":1, "name":"milo"}'
            , badJson = '{"test:1';

        assert.deepEqual(_.jsonParse(json), { test: 1, name: 'milo' });
        assert.equal(_.jsonParse(badJson), undefined);
        assert.throws(function() {
            JSON.parse(badJson);
        });        
} catch(err) {}


    try {
        var json = '{"test":1, "name":"milo"}'
            , badJson = '{"test:1';

        assert.deepEqual(_(json).jsonParse()._(), { test: 1, name: 'milo' });
        assert.equal(_(badJson).jsonParse()._(), undefined);
        assert.throws(function() {
            JSON.parse(badJson);
        });        
} catch(err) {}


    try {
        var result1 = _.hashCode('This was no small decision. Four generations of Orr men had been Eagles, including Ron and Andrew\'s older brother. Andrew had spent years working toward Scouting\'s highest rank, and was just months from reaching it.');
        assert.equal(typeof result1, 'number');
        var result2 = _.hashCode('But the Boy Scouts had decided to admit gays, and Ron Orr, a tall, soft-spoken man with a firm handshake, is clear about his Christian faith and what it says about homosexuality: It is a sin that cannot be tolerated.');
        assert.equal(typeof result2, 'number');
        assert(result1 != result2);
} catch(err) {}


    try {
        var result1 = _('This was no small decision. Four generations of Orr men had been Eagles, including Ron and Andrew\'s older brother. Andrew had spent years working toward Scouting\'s highest rank, and was just months from reaching it.')
                        .hashCode()._();
        assert.equal(typeof result1, 'number');
        var result2 = _('But the Boy Scouts had decided to admit gays, and Ron Orr, a tall, soft-spoken man with a firm handshake, is clear about his Christian faith and what it says about homosexuality: It is a sin that cannot be tolerated.')
                        .hashCode()._();
        assert.equal(typeof result2, 'number');
        assert(result1 != result2);
} catch(err) {}


    try {
        assert.equal(_.unPrefix('root_string', 'root_'), 'string');
        assert.equal(_.unPrefix('other_string', 'root_'), undefined);
} catch(err) {}


    try {
        assert.equal(_('root_string').unPrefix('root_')._(), 'string');
        assert.equal(_('other_string').unPrefix('root_')._(), undefined);
} catch(err) {}


    try {
        assert.equal(_.format('foo$1and$2bar$1', 'x', 'y'), 'fooxandybarx')
        assert.equal(_.format('this $1 is a $$ test', 'yo'), 'this yo is a $ test')
} catch(err) {}


    try {
        assert.equal(_('foo$1and$2bar$1').format('x', 'y')._(), 'fooxandybarx')
        assert.equal(_('this $1 is a $$ test').format('yo')._(), 'this yo is a $ test')
} catch(err) {}
// });

'use strict';

var _ = require('mol-proto')
    , assert = require('assert');


// describe('Utility functions', function() {
    try {
        var arr = [], thisArg = {}
        _.times(4, function(i) {
            assert.equal(this, thisArg);
            arr.push(i);
        }, thisArg);

        assert.deepEqual(arr, [0, 1, 2, 3]);
} catch(err) {}


    try {
        var arr = [], thisArg = {}
        _(4).times(function(i) {
            assert.equal(this, thisArg);
            arr.push(i);
        }, thisArg)._();

        assert.deepEqual(arr, [0, 1, 2, 3]);
} catch(err) {}


    try {
        var arr = _.repeat({ test: 1 }, 3);
        assert.deepEqual(arr, [{ test: 1 }, { test: 1 }, { test: 1 }]);
} catch(err) {}


    try {
        var arr = _({ test: 1 }).repeat(3)._();
        assert.deepEqual(arr, [{ test: 1 }, { test: 1 }, { test: 1 }]);
} catch(err) {}


    try {
        var obj = { a: 1, b: 2, c: 3 };

        var result = _.tap(obj, function(self) {
                assert.deepEqual(self, { a: 1, b: 2, c: 3 })
            });
        
        assert.deepEqual(result, { a: 1, b: 2, c: 3 });
} catch(err) {}


    try {
        var obj = { a: 1, b: 2, c: 3 };

        var result = _(obj)
            .mapKeys(function(value) {
                return value * 10;
            })
            .tap(function(self) {
                assert.deepEqual(self, { a: 10, b: 20, c: 30 })
            })
            .allKeys()
            .tap(function(self) {
                assert.deepEqual(self, ['a','b','c']);
            })
            ._();
        
        assert.deepEqual(result, ['a','b','c']);
} catch(err) {}


    try {
        var func1 = 'test1'
            , thisArg = {};
            
        function func2() {
            assert.equal(this, thisArg);
            assert.deepEqual(_.slice(arguments), [ 'param0', 'param1' ]);
            return 'test2';
        }

        assert.equal(_.result(func1), 'test1');
        assert.equal(_.result(func2, thisArg, 'param0', 'param1'), 'test2');
} catch(err) {}


    try {
        var obj = {};
        assert.equal(_.identity(obj), obj);
} catch(err) {}


    try {
        var obj = {};
        assert.equal(_(obj).identity()._(), obj);
} catch(err) {}


    try {
        var obj = { prop1: 1, prop2: 2 }
            , p1 = _.property('prop1')
            , p2 = _.property('prop2');
        assert.equal(p1(obj), 1);
        assert.equal(p2(obj), 2);
} catch(err) {}


    try {
        var obj = { prop1: 1, prop2: 2 }
            , p1 = _('prop1').property()._()
            , p2 = _('prop2').property()._();
        assert.equal(p1(obj), 1);
        assert.equal(p2(obj), 2);
} catch(err) {}


    try {
        var arr = [
            { value: 1, label: 'a'},
            { value: 4, label: 'c'},
            { value: 3, label: 'd'},
            { value: 2, label: 'b'}
        ];

        arr.sort(_.compareProperty('value'));
        assert.deepEqual(arr, [
            { value: 1, label: 'a'},
            { value: 2, label: 'b'},
            { value: 3, label: 'd'},
            { value: 4, label: 'c'}
        ]);

        arr.sort(_.compareProperty('label'));
        assert.deepEqual(arr, [
            { value: 1, label: 'a'},
            { value: 2, label: 'b'},
            { value: 4, label: 'c'},
            { value: 3, label: 'd'}
        ]);
} catch(err) {}


    try {
        var arr = [
            { value: 1, label: 'a'},
            { value: 4, label: 'c'},
            { value: 3, label: 'd'},
            { value: 2, label: 'b'}
        ];

        arr.sort(_('value').compareProperty()._());
        assert.deepEqual(arr, [
            { value: 1, label: 'a'},
            { value: 2, label: 'b'},
            { value: 3, label: 'd'},
            { value: 4, label: 'c'}
        ]);

        arr.sort(_('label').compareProperty()._());
        assert.deepEqual(arr, [
            { value: 1, label: 'a'},
            { value: 2, label: 'b'},
            { value: 4, label: 'c'},
            { value: 3, label: 'd'}
        ]);
} catch(err) {}


    try {
        assert.equal(_.noop(), undefined);
} catch(err) {}


    try {
        assert.equal(_({yo: 'ho'}).noop()._(), undefined);
} catch(err) {}
// });




'use strict';

var _ = require('mol-proto')
    , assert = require('assert')

        var myFunc = _.makeFunction('myFunc', 'a', 'b', 'c'
                                    , 'return a + b + c;');
        test(myFunc);

        myFunc = _('myFunc').makeFunction('a', 'b', 'c'
                                    , 'return a + b + c;')._();
        test(myFunc);

        function test(func) {
            assert(func instanceof Function);
            assert.doesNotThrow(func);
            assert.equal(func.name, 'myFunc');
            assert.equal(func('1_', '2_', '3_'), '1_2_3_');
        }

        function testFunc(a,b,c) {
            return a + b + c;
        }

        var testPartial = _.partial(testFunc, 'my ');
        assert.equal(testFunc('my ', 'partial ', 'function'),
                    testPartial('partial ', 'function'));

        testPartial = _(testFunc).partial('my ')._();
        assert.equal(testFunc('my ', 'partial ', 'function'),
                    testPartial('partial ', 'function'));

        var testPartial2 = _.partial(testFunc, 'my ', 'partial ');
        assert.equal(testFunc('my ', 'partial ', 'function'),
                    testPartial2('function'));

        testPartial2 = _(testFunc).partial('my ', 'partial ')._();
        assert.equal(testFunc('my ', 'partial ', 'function'),
                    testPartial2('function'));

        function testFunc(a,b,c) {
            return a + b + c;
        }

        var testPartial = _.partialRight(testFunc, 'function');
        assert.equal(testFunc('my ', 'partial ', 'function'),
                    testPartial('my ', 'partial '));

        testPartial = _(testFunc).partialRight('function')._();
        assert.equal(testFunc('my ', 'partial ', 'function'),
                    testPartial('my ', 'partial '));

        var testPartial2 = _.partialRight(testFunc, 'partial ', 'function');
        assert.equal(testFunc('my ', 'partial ', 'function'),
                    testPartial2('my '));

        testPartial2 = _(testFunc).partialRight('partial ', 'function')._();
        assert.equal(testFunc('my ', 'partial ', 'function'),
                    testPartial2('my '));

        var called = 0;

        function factorial(x) {
            called++;
            return x <= 0 ? 1 : x * fastFactorial(x-1);
        }

        var fastFactorial = _.memoize(factorial, undefined, 11);

            var fact10 = factorial(10);
            assert.equal(fastFactorial(10), fact10, 'should return the same result');

        called = 0;

            assert.equal(fastFactorial(10), fact10, 'should return the same result when called second time');
            assert.equal(called, 0, 'should take the value from cache without calling original function');
            assert.equal(fastFactorial(11), fact10 * 11, 'should return correct result');
            assert.equal(called, 1, 'should be called with new value');

        called = 0;

            assert.equal(fastFactorial(11), fact10 * 11, 'should return correct result');
            assert.equal(called, 0, 'should not be called with old value');

        called = 0;

            assert.equal(fastFactorial(0), 1, 'should return correct result');
            assert.equal(called, 1, 'should be called again as the first key will be pushed out of cache');


        function testFunc(a, b) {
            called += 1;
            return a + b;
        }

        function hashFunc (a, b) {
            return a + b;           
        }

        var memoTestFunc = _.memoize(testFunc, hashFunc);

        var result = testFunc(10, 20);
        assert.equal(memoTestFunc(10, 20), result);

        called = 0;
            assert.equal(memoTestFunc(10, 20), result);
            assert.equal(called, 0, 'should not be called with same hash');

        var called = 0;

        function testFunc(a, b) {
            called++;
            return a + b;
        }

        var myFunc = _(testFunc).partial('my ').memoize()._();

            assert.equal(testFunc('my ', 'function'),
                        myFunc('function'));

        called = 0;

            assert.equal(myFunc('function'), 'my function');
            assert.equal(called, 0, 'value should be taken from cache');


        var called, args;

        function myFunc() {
            called = true;
            args = Array.prototype.slice.call(arguments);
        }

        _.delay(myFunc, 10, 1, 2, 3);

        setTimeout(function() {
            assert.equal(called, true);
            assert.deepEqual(args, [1, 2, 3]);

            called = undefined;
            args = undefined;

            _(myFunc).delay(10, 1, 2, 3, 4);
            setTimeout(function() {
                assert.equal(called, true);
                assert.deepEqual(args, [1, 2, 3, 4]);
                done();
            }, 20);
        }, 20);

        var called, args;

        function myFunc() {
            called = true;
            args = Array.prototype.slice.call(arguments);
        }

        _.defer(myFunc, 1, 2, 3);

        setTimeout(function() {
            assert.equal(called, true);
            assert.deepEqual(args, [1, 2, 3]);

            called = args = undefined;
            _(myFunc).defer(1, 2, 3, 4);

            setTimeout(function() {
                assert.deepEqual(args, [1, 2, 3, 4]);
                done();
            }, 5);
        }, 5);



//     it('should define delayed function', function(done) {
//         var called, args, context = {};

        function myFunc() {
            called = true;
            args = Array.prototype.slice.call(arguments);
            assert.equal(this, context);
        }

        var delayedFunc = _.delayed(myFunc, 10, 1, 2, 3);
        delayedFunc.call(context, 4, 5);

        setTimeout(function() {
            assert.equal(called, true);
            assert.deepEqual(args, [1, 2, 3, 4, 5]);

            called = args = undefined;
            var delayedFunc = _.delayed(myFunc, 10, 6, 7);
            delayedFunc.call(context, 8, 9);

            setTimeout(function() {
                assert.equal(called, true);
                assert.deepEqual(args, [6, 7, 8, 9]);
                done();
            }, 20);
        }, 20);
//     });


//     it('should define deferred function', function(done) {
        var called, args, context = {};

        function myFunc() {
            called = true;
            args = Array.prototype.slice.call(arguments);
            assert.equal(this, context);
        }

        var deferredFunc = _.deferred(myFunc, 1, 2, 3);
        deferredFunc.call(context, 4, 5);

        setTimeout(function() {
            // assert.equal(called, true);
            assert.deepEqual(args, [1, 2, 3, 4, 5]);

            var deferredFunc = _.deferred(myFunc, 6, 7);
            deferredFunc.call(context, 8, 9);

            setTimeout(function() {
                // assert.equal(called, true);
                assert.deepEqual(args, [6, 7, 8, 9]);
                done();
            }, 5);
        }, 5);
//     });


//     it('should define deferTicks function', function(done) {
        var called, args;

        function myFunc() {
            called = true;
            args = Array.prototype.slice.call(arguments);
        }

        _.deferTicks(myFunc, 3, 1, 2, 3);

        setTimeout(function() {
            // assert.equal(called, undefined);
            assert.equal(args, undefined);
            setTimeout(function() {
                // assert.equal(called, undefined);
                assert.equal(args, undefined);
                setTimeout(function() {
                    // assert.equal(called, true);
                    assert.deepEqual(args, [1, 2, 3]);
                    done();
                }, 0);
            }, 0);
        }, 0);
//     });


//     it('should define deferTicks method', function(done) {
        var called, args;

        function myFunc() {
            called = true;
            args = Array.prototype.slice.call(arguments);
        }

        _(myFunc).deferTicks(3, 1, 2, 3);

        setTimeout(function() {
            // assert.equal(called, undefined);
            assert.equal(args, undefined);
            setTimeout(function() {
                // assert.equal(called, undefined);
                assert.equal(args, undefined);
                setTimeout(function() {
                    // assert.equal(called, true);
                    assert.deepEqual(args, [1, 2, 3]);
                    done();
                }, 0);
            }, 0);
        }, 0);
//     });


//     it('should define delayMethod function', function(done) {
        var called, args, object = {};

        object.myFunc = function() {
            called = true;
            args = Array.prototype.slice.call(arguments);
        }

        _.delayMethod(object, 'myFunc', 10, 1, 2, 3);


        assert.equal(args, undefined);

        setTimeout(function() {
            assert.equal(called, true);
            assert.deepEqual(args, [1, 2, 3]);

            called = false;
            args = undefined;

            _.delayMethod(object, object.myFunc, 10, 1, 2, 3);

            setTimeout(function() {
                assert.equal(called, true);
                assert.deepEqual(args, [1, 2, 3]);
                done();
            }, 20);
        }, 20);
//     });


//     it('should define delayMethod method', function(done) {
        var called, args, object = {};

        object.myFunc = function() {
            called = true;
            args = Array.prototype.slice.call(arguments);
        }

        _(object).delayMethod('myFunc', 10, 1, 2, 3);

        assert.equal(args, undefined);

        setTimeout(function() {
            assert.equal(called, true);
            assert.deepEqual(args, [1, 2, 3]);

            called = false;
            args = undefined;

            _(object).delayMethod(object.myFunc, 10, 1, 2, 3);

            setTimeout(function() {
                assert.equal(called, true);
                assert.deepEqual(args, [1, 2, 3]);
                done();
            }, 20);
        }, 20);
//     });


//     it('should define deferMethod function', function(done) {
        var called, args, object = {};

        object.myFunc = function () {
            called = true;
            args = Array.prototype.slice.call(arguments);
        }

        _.deferMethod(object, 'myFunc', 1, 2, 3);

        // assert.equal(called, undefined);
        assert.equal(args, undefined);

        setTimeout(function() {
            assert.equal(called, true);
            assert.deepEqual(args, [1, 2, 3]);

            called = false;
            args = undefined;

            _.deferMethod(object, object.myFunc, 1, 2, 3);

            setTimeout(function() {
                assert.equal(called, true);
                assert.deepEqual(args, [1, 2, 3]);
                done();
            }, 5);
        }, 5);
//     });


//     it('should define deferMethod method', function(done) {
        var called, args, object = {};

        object.myFunc = function () {
            called = true;
            args = Array.prototype.slice.call(arguments);
        }

        _(object).deferMethod('myFunc', 1, 2, 3);

        // assert.equal(called, undefined);
        assert.equal(args, undefined);

        setTimeout(function() {
            assert.equal(called, true);
            assert.deepEqual(args, [1, 2, 3]);

            called = false;
            args = undefined;

            _(object).deferMethod(object.myFunc, 1, 2, 3);

            setTimeout(function() {
                assert.equal(called, true);
                assert.deepEqual(args, [1, 2, 3]);
                done();
            }, 5);
        }, 5);
//     });


//     it('should define debounce function', function(done) {
        var called = 0
            , args;

        function myFunc() {
            called++;
            args = Array.prototype.slice.call(arguments);
        }

        var myDebounced = _.debounce(myFunc, 20);

        myDebounced(1,2);
        myDebounced(3,4);
        assert.equal(called, 0);

        setTimeout(function(){
            myDebounced(5,6);
            assert.equal(called, 0);

            setTimeout(function() {
                assert.equal(called, 1);
                assert.deepEqual(args, [5, 6]);

                setTimeout(function() {
                    assert.equal(called, 1);
                    assert.deepEqual(args, [5, 6]);
                    done();
                }, 10)
            }, 22);
        }, 5);
//     });


//     it('should define debounce method', function(done) {
        var called = 0
            , args;

        function myFunc() {
            called++;
            args = Array.prototype.slice.call(arguments);
        }

        var myDebounced = _(myFunc).debounce(20)._();

        myDebounced(1,2);
        myDebounced(3,4);
        assert.equal(called, 0);

        setTimeout(function(){
            myDebounced(5,6);
            assert.equal(called, 0);

            setTimeout(function() {
                assert.equal(called, 1);
                assert.deepEqual(args, [5, 6]);

                setTimeout(function() {
                    assert.equal(called, 1);
                    assert.deepEqual(args, [5, 6]);
                    done();
                }, 10)
            }, 22);
        }, 5);
//     });


//     it('should define debounce function with immediate', function(done) {
        var called = 0
            , args;

        function myFunc() {
            called++;
            args = Array.prototype.slice.call(arguments);
        }

        var myDebounced = _.debounce(myFunc, 20, true);

        myDebounced(1,2);
        assert.equal(called, 1);
        // assert.deepEqual(args, [1, 2]);

        myDebounced(3,4);
        assert.equal(called, 1);
        // assert.deepEqual(args, [1, 2]);

        setTimeout(function(){
            myDebounced(5,6);
            assert.equal(called, 1);
            assert.deepEqual(args, [1, 2]);

            setTimeout(function() {
                myDebounced(7,8);
                assert.equal(called, 2);
                assert.deepEqual(args, [7, 8]);

                setTimeout(function() {
                    myDebounced(9,10);
                    assert.equal(called, 2);
                    assert.deepEqual(args, [7, 8]);
                    done();
                }, 10)
            }, 22);
        }, 5);
//     });


//     it('should define debounce method with immediate', function(done) {
        var called = 0
            , args;

        function myFunc() {
            called++;
            args = Array.prototype.slice.call(arguments);
        }

        var myDebounced = _(myFunc).debounce(20, true)._();

        myDebounced(1,2);
        // assert.equal(called, 1);
        // assert.deepEqual(args, [1, 2]);

        myDebounced(3,4);
        // assert.equal(called, 1);
        // assert.deepEqual(args, [1, 2]);

        setTimeout(function(){
            myDebounced(5,6);
            // assert.equal(called, 1);
            // assert.deepEqual(args, [1, 2]);

            setTimeout(function() {
                myDebounced(7,8);
                // assert.equal(called, 2);
                // assert.deepEqual(args, [7, 8]);

                setTimeout(function() {
                    myDebounced(9,10);
                    // assert.equal(called, 2);
                    // assert.deepEqual(args, [7, 8]);
                    done();
                }, 10)
            }, 22);
        }, 5);
//     });


//     it('should define throttle function');
//     it('should define throttle method');


//     it('should define once function and method', function() {
        var called = 0;

        function myFunc() {
            called++;
        }

        var myOnce = _.once(myFunc);
        myOnce();
        myOnce();
        assert.equal(called, 1);
        
        called = 0;
        myOnce = _(myFunc).once()._();
        myOnce();
        myOnce();
        // assert.equal(called, 1);
//     });


//     it('should define waitFor function', function(done) {
        var semaphore = 'red',
            state = 'stopped';

        function isGreen(){
            return semaphore == 'green';
        }

        function setRunning(){
            state = 'running';
        }

        _.waitFor(isGreen, setRunning, 1000);

        assert.equal(state, 'stopped');
        setTimeout(function (){
            assert.equal(state, 'stopped');
            semaphore = 'green';
            setTimeout(function (){
                assert.equal(state, 'running');
                done();
            }, 100);
        }, 200);
//     });


//     it('should define waitFor function 2', function(done) {
        var counter = 0;
        var timedOut = false;

        function increment(){
            counter++;
            return false;
        }

        function callback(){
            counter = "cannot pass here";
        }

        function onTimeOut(){
            timedOut = true;
        }

        _.waitFor(increment, callback, 500, onTimeOut, 50);

        setTimeout(function (){
            assert.equal(counter, 10);
            assert.equal(timedOut, true);
            done();
        }, 600);
//     });


//     it('should define waitFor method', function(done) {
        var semaphore = 'red',
            state = 'stopped';

        function isGreen(){
            return semaphore == 'green';
        }

        function setRunning(){
            state = 'running';
        }

        _(isGreen).waitFor(setRunning, 1000)._();

        assert.equal(state, 'stopped');
        setTimeout(function (){
            assert.equal(state, 'stopped');
            semaphore = 'green';
            setTimeout(function (){
                assert.equal(state, 'running');
                done();
            }, 100);
        }, 200);
//     });


//     it('should define waitFor method 2', function(done) {
        var counter = 0;
        var timedOut = false;

        function increment(){
            counter++;
            return false;
        }

        function callback(){
            counter = "cannot pass here";
        }

        function onTimeOut(){
            timedOut = true;
        }

        _(increment).waitFor(callback, 500, onTimeOut, 50)._();

        setTimeout(function (){
            assert.equal(counter, 10);
            assert.equal(timedOut, true);
            done();
        }, 600);
//     });


//     it('should define not function', function() {
        function odd(number) {
            return !!(number % 2);
        }

        var even = _.not(odd);

        assert.equal(odd(3), true);
        assert.equal(odd(5), true);
        assert.equal(odd(2), false);
        assert.equal(odd(4), false);

        assert.equal(even(3), false);
        assert.equal(even(5), false);
        assert.equal(even(2), true);
        assert.equal(even(4), true);
//     });


//     it('should define not method', function() {
        function odd(number) {
            return !!(number % 2);
        }

        var even = _(odd).not()._();

        assert.equal(odd(3), true);
        assert.equal(odd(5), true);
        assert.equal(odd(2), false);
        assert.equal(odd(4), false);

        assert.equal(even(3), false);
        assert.equal(even(5), false);
        assert.equal(even(2), true);
        assert.equal(even(4), true);
//     });
// });