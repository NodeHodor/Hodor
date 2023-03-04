var eval = require('@zhaoyao91/eval-in-vm')

var result = eval('1 + 2') // 3

var result = eval('a + 2', {a: 1}) // 3

var result = eval('b + 2') // Error !!!
