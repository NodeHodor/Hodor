'use strict';

var _ = require('protojs')
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
