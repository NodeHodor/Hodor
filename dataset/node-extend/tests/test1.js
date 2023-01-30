function A(){
	this.name = 'brighthas | leo';
}

A.prototype.getName = function(){
	return this.name;
}

function B(){
	this.age = 31;
}

B.prototype.getAge = function(){
	return this.age;
}


var extend = require('node-extend');
var A2 = extend(A,B); // A extend B.
var a = new A2();
console.log(a.getName());  // brighthas | leo
console.log(a.getAge());   // 31
