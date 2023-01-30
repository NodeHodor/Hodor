var mongo_express = require('mongo-express/lib/middleware')
var mongo_express_config = require('../mongo_express_config')

app.use('mongo_express', mongo_express(mongo_express_config))
