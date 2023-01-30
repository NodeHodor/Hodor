var ks = require('node-key-sender');

ks.startBatch()
    .batchTypeKey('N')
    .batchTypeKey('o')
    .batchTypeKey('d')
    .batchTypeKey('e')
    .batchTypeKeys(['N', 'o', 'd', 'e'])
    .batchTypeText('Node')
    .batchTypeKey('N', 1000)
    .batchTypeKey('o', 1000)
    .batchTypeKey('d', 1000)
    .batchTypeKey('e', 1000)
    .sendBatch();
