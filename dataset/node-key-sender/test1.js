var ks = require('node-key-sender');
ks.sendKey('a');
ks.sendKeys(['a', 'b', 'c']);
ks.sendCombination(['control', 'shift', 'v']);

var accentsMap = {
    'ã': '@514 a',
    'ẽ': '@514 e',
    'ĩ': '@514 i',
    'õ': '@514 o',
    'ũ': '@514 u',
    'Ã': '@514 A',
    'Ẽ': '@514 E',
    'Ĩ': '@514 I',
    'Õ': '@514 O',
    'Ũ': '@514 U',
    'â': 'shift-@514 a',
    'ê': 'shift-@514 e',
    'î': 'shift-@514 i',
    'ô': 'shift-@514 o',
    'û': 'shift-@514 u',
    'Â': 'shift-@514 A',
    'Ê': 'shift-@514 E',
    'Î': 'shift-@514 I',
    'Ô': 'shift-@514 O',
    'Û': 'shift-@514 U',
    'à': 'shift-@192 a',
    'è': 'shift-@192 e',
    'ì': 'shift-@192 i',
    'ò': 'shift-@192 o',
    'ù': 'shift-@192 u',
    'À': 'shift-@192 A',
    'È': 'shift-@192 E',
    'Ì': 'shift-@192 I',
    'Ò': 'shift-@192 O',
    'Ù': 'shift-@192 U',
    'á': '@192 a',
    'é': '@192 e',
    'í': '@192 i',
    'ó': '@192 o',
    'ú': '@192 u',
    'Á': '@192 A',
    'É': '@192 E',
    'Í': '@192 I',
    'Ó': '@192 O',
    'Ú': '@192 U',
    'ç': '@192 c',
    'Ç': '@192 C',
    'ä': 'shift-@54 a',
    'ë': 'shift-@54 e',
    'ï': 'shift-@54 i',
    'ö': 'shift-@54 o',
    'ü': 'shift-@54 u',
    'Ä': 'shift-@54 A',
    'Ë': 'shift-@54 E',
    'Ï': 'shift-@54 I',
    'Ö': 'shift-@54 O',
    'Ü': 'shift-@54 O'
};

var ks = require('node-key-sender');
ks.aggregateKeyboardLayout(accentsMap);
ks.sendText("Héllõ Wíth Áçcents");

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
