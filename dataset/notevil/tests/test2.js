var safeEval = require('notevil')

var context = { x: 1, obj: {y: 2} }

// update context global
safeEval('x = 300', context)
console.log(context.x) // 300

// update property on object
safeEval('obj.y = 300', context)
console.log(context.obj.y) // 300
