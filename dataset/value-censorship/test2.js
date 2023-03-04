const censor = require('value-censorship')
 
censor(`
  global["eva" + "l"]("42")  // Throws CensorStop error
  global["Functio" + "n"]("42")  // Throws CensorStop error
  new (function(){}.constructor)("42")  // Throws CensorStop error
`)
 
censor(legitCode, { giveThisFunctionToTheCode: () => null })