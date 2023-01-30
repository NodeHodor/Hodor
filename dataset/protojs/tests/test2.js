'use strict';

var _ = require('protojs')
    , assert = require('assert')
    , perfTest = require('./perf');


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

        perfTest(
            function(){
                var arr = _(arrLike)
                    .toArray()
                    .prependArray([1, 2])
                    .appendArray([6, 7, 8])
                    ._();
            },
            function() {
                var arr = _.toArray(arrLike);
                _.prependArray(arr, [1, 2]);
                _.appendArray(arr, [6, 7, 8]);
            }
        );
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
