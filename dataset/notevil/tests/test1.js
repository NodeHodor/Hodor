var safeEval = require('notevil')

// basic math
var result = safeEval('1+2+3')
console.log(result) // 6

// context and functions
var result = safeEval('1+f(2,3)+x', {
  x: 100, 
  f: function(a,b){
    return a*b
  }
})
console.log(result) // 107

// multiple statements, variables and if statements
var result = safeEval('var x = 100, y = 200; if (x > y) { "cats" } else { "dogs" }')
console.log(result) // dogs

// inner functions
var result = safeEval('[1,2,3,4].map(function(item){ return item*100 })')
console.log(result) // [100, 200, 300, 400]
