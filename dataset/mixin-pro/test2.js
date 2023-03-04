'use strict';

var Class = require('mixin-pro').createClass;

var A = Class({
  constructor: function A(){
    this._fa = 0;
    console.log('A');
  },
  va: 'a',
  fa: function() {
    console.log('A->fa()');
  },
});

var B = Class({
  constructor: function B(){
    this._fb = 0;
    console.log('B');
  },
  vb: 'b',
  fb: function() {
    console.log('B->fb()');
  },
});

var C = Class({
  constructor: function C(){
    this._fc = 0;
    console.log('C');
  },
  vc: 'c',
  fc: function() {
    console.log('C->fc()');
  },
});

var D = Class(C, {
  constructor: function D(){
    this._fd = 0;
    console.log('D');
  },
  vd: 'd',
  fd: function() {
    console.log('D->fd()');
  },
});

var E = Class([A, B, D], {
  constructor: function E(){
    this._fe = 0;
    console.log('E');
  },
  ve: 'e',
  fa: function() {
    this.Super('fa').apply(this, arguments);
    console.log('E->fa()');
  },
  fe: function() {
    console.log('\naccess properties')
    console.log(this.va);
    console.log(this.vb);
    console.log(this.vc);
    console.log(this.vd);
    console.log(this.ve);

    console.log('\naccess methods')
    this.fa();
    this.fb();
    this.fc();
    this.fd();
    console.log('E->fe()');
  },
});

console.log('\ninit with constructors')
var e = new E();

console.log('\ncheck initialized data')
console.log(e);

console.log('\ncheck instanceOf()')
console.log('e.instanceOf(A) -> ' + e.instanceOf(A));
console.log('e.instanceOf(B) -> ' + e.instanceOf(B));
console.log('e.instanceOf(C) -> ' + e.instanceOf(C));
console.log('e.instanceOf(D) -> ' + e.instanceOf(D));
console.log('e.instanceOf(E) -> ' + e.instanceOf(E));

e.fe();

console.log('\ncall method in base class with Super()');
e.fa(1, 2, 3);


var Class = require('mixin-pro').createClass;

// use case 1: create a base class
var Bar1 = Class({
  constructor: function Bar1() {},
  t1: function() { console.log('Bar1->t1()'); },
});

// use case 2: create a class and inherit from a base class
var Bar2 = Class(Bar1, {
  constructor: function Bar2() {},
  t2: function() { console.log('Bar2->t2()'); },
});

// use case 3: create a class and inherit from multi base classes
var Bar3 = Class([Bar1, Bar2], {
  constructor: function Bar3() {},
  t3: function() { console.log('Bar3->t3()'); },
  t1: function() {
    // call same name method in super class, with apply() or call()
    this.Super('t1').apply(this, arguments);
    // this.Super('t1').call(this, 1, 2, 3);

    console.log('Bar3->t1()');
  },
});

// check an object is instance of the inherited base class
var bar3 = new Bar3();
console.log(bar3.instanceOf(Bar3)); // true
console.log(bar3.instanceOf(Bar1)); // true
console.log(bar3.instanceOf(Bar2)); // true
bar3.t1(); // Bar1->t1()   Bar3->t1()
bar3.t2(); // Bar2->t2()
bar3.t3(); // Bar3->t3()


function A() {
  this._va = 0;
  console.log('A');
}
A.prototype = {
  va: 1,
  fa: function() {
    console.log('A->fa()');
  }
};

function B() {
  this._vb = 0;
  console.log('B');
}
B.prototype = {
  vb: 1,
  fb: function() {
    console.log('B->fb()');
  }
};

function C() {
  this._vc = 0;
  console.log('C');
}
C.prototype = {
  vc: 1,
  fc: function() {
    console.log('C->fc()');
  }
};

function D(){
  this._vd = 0;
  console.log('D');
}
D.prototype = {
  vd: 1,
  fd: function() {
  this.fa();
  this.fb();
  this.fc();
  console.log('D->fd()');
  }
};

var mixin = require('mixin-pro');

D = mixin(D, A);
D = mixin(D, B);
D = mixin(D, C);

var d = new D();

console.log(d);
console.log(d.constructor.name);

d.fd();

var a = new A();

console.log(a);
console.log(a.__proto__);
console.log(a.va);

