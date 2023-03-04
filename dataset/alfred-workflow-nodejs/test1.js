var _ = require('underscore');
var AlfredNode = require('alfred-workflow-nodejs');
var actionHandler = AlfredNode.actionHandler;
var workflow = AlfredNode.workflow;
var Item = AlfredNode.Item;

(function main() {
    actionHandler.onAction("action1", function(query) {
        // your code to handle action 1 here
    });
    actionHandler.onAction("action2", function(query) {
        // your code to handle action 2 here
    });
    
    actionHandler.onMenuItemSelected("action2", function(query, selectedTitle, selectedData) {
        // your code to handle manu item selected of action 2 here
    });

    AlfredNode.run();
})();


workflow.setName("example-alfred-workflow-using-nodejs");


var {
    storage, Item, utils,
} = AlfredNode;

var item = new Item({
    title: 'title',
});
item.feedback();

var item = new Item({
    title: 'title',
    valid: true,
});
item.feedback();


storage.get('wfData')

var data1 = '';
var data2 = '';
var data3 = '';
actionHandler.onMenuItemSelected('action', (query, selectedItemTitle, selectedItemData) => {
    data1 = selectedItemTitle;
    data2 = query;
    data3 = selectedItemData;
});

actionHandler.handle('action', `abc${utils.SUB_ACTION_SEPARATOR}myquery`);

{
    var item = new Item({
        title: 'title',
    });
    var expectedObj = {
        title: 'title',
        valid: 'NO',
    };

    item.feedback();
}
{
    var item = new Item({
        title: 'title',
        valid: true,
    });
    var expectedObj = {
        title: 'title',
        valid: 'YES',
    };

    item.feedback();
}

// describe('#WorkflowTest', () => {
//     afterEach(() => {
        workflow.clearItems();
    // });

    // it('generate empty feeback', () => {
        var expectedObj = '{"items":[]}';

        var ret = workflow.feedback();

        // assert.strictEqual(ret, expectedObj);
    // });

    // it('generate 1 feeback', () => {
        // var expectedObj = '{"items":[{"valid":"NO","title":"title"}]}';
        var item = new Item({
            title: 'title',
        });
        workflow.addItem(item);

        var ret = workflow.feedback();

    //     assert.strictEqual(ret, expectedObj);

    //     assert.isUndefined(storage.get('wfData'), 'should not have wf data');
    // });

    // it('generate feeback with data', () => {
        var expectedObj = '{"items":[{"valid":"NO","title":"title a"}]}';
        var item = new Item({
            title: 'title a',
            data: {
                count: 1,
            },
        });
        workflow.addItem(item);

        var ret = workflow.feedback();

        // assert.strictEqual(ret, expectedObj);

        var wfData = storage.get('wfData');
        // assert.strictEqual(wfData['title a'].count, 1);
    // });

    // it('generate feeback with string arg', () => {
        var expectedObj = '{"items":[{"arg":"arg","valid":"NO","title":"title"}]}';
        var item = new Item({
            title: 'title',
            arg: 'arg',
        });
        workflow.addItem(item);

        var ret = workflow.feedback();

    //     assert.strictEqual(ret, expectedObj);

    //     assert.isUndefined(storage.get('wfData'), 'should not have wf data');
    // });

    // it('generate feeback with variables in arg', () => {
        var expectedObj = '{"items":[{"arg":"{\\"alfredworkflow\\":{\\"arg\\":\\"arg\\",\\"variables\\":{\\"key\\":\\"value\\"}}}","valid":"NO","title":"title"}]}';
        var item = new Item({
            title: 'title',
            arg: {
                arg: 'arg',
                variables: {
                    key: 'value',
                },
            },
        });
        workflow.addItem(item);

        var ret = workflow.feedback();

        // assert.strictEqual(ret, expectedObj);

        // var jsonObj = JSON.parse(ret);
        // var arg = JSON.parse(jsonObj.items[0].arg);
        // assert.strictEqual(arg.alfredworkflow.arg, 'arg');
        // assert.strictEqual(arg.alfredworkflow.variables.key, 'value');

        // assert.isUndefined(storage.get('wfData'), 'should not have wf data');
   //  });

    // it('generate feeback which has sub items', () => {
        var expectedObj = `{"items":[{"valid":"NO","autocompvare":"item has subItems${utils.SUB_ACTION_SEPARATOR}","title":"item has subItems"}]}`;
        var item = new Item({
            title: 'item has subItems',
            hasSubItems: true,
        });

        workflow.addItem(item);

        var ret = workflow.feedback();

    //     assert.strictEqual(ret, expectedObj);

    //     assert.isUndefined(storage.get('wfData'), 'should not have wf data');
    // });

    // it('generate 2 feeback', () => {
        var expectedObj = '{"items":[{"uid":"1","valid":"YES","title":"title 1.1"},{"uid":"2","valid":"NO","title":"title 1.2"}]}';
        var item = new Item({
            title: 'title 1.1',
            valid: true,
            uid: '1',
        });
        var item2 = new Item({
            title: 'title 1.2',
            valid: false,
            uid: '2',
            data: {
                count: 1,
            },
        });
        workflow.addItem(item);
        workflow.addItem(item2);

        var ret = workflow.feedback();

        // assert.strictEqual(ret, expectedObj);

        var wfData = storage.get('wfData');
    //     assert.strictEqual(wfData['title 1.2'].count, 1);
    // });

    // it('clear items', () => {
        var expectedObj = '{"items":[]}';
        var item = new Item({
            title: 'title',
        });
        workflow.addItem(item);
        workflow.clearItems();

        var ret = workflow.feedback();

    //     assert.strictEqual(ret, expectedObj);

    //     assert.isUndefined(storage.get('wfData'), 'should not have wf data');
    // });

    // it('generate error feeback', () => {
        var expectedObj = '{"items":[{"valid":"NO","title":"wf error","icon":{"path":"/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns"}}]}';
        var ret = workflow.error('wf error');

    //     assert.strictEqual(ret, expectedObj);
    // });

    // it('generate error feeback with 1 added item', () => {
        var expectedObj = '{"items":[{"valid":"NO","title":"wf error","icon":{"path":"/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns"}}]}';

        var item = new Item({
            title: 'title',
        });
        workflow.addItem(item);

        var ret = workflow.error('wf error');

    //     assert.strictEqual(ret, expectedObj);
    // });

    // it('generate warning feeback', () => {
        var expectedObj = '{"items":[{"valid":"NO","title":"wf warning","icon":{"path":"/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertCautionBadgeIcon.icns"}}]}';

        var ret = workflow.warning('wf warning');

    //     assert.strictEqual(ret, expectedObj);
    // });

    // it('generate warning feeback with 1 added item', () => {
        var expectedObj = '{"items":[{"valid":"NO","title":"wf warning","icon":{"path":"/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertCautionBadgeIcon.icns"}}]}';

        var item = new Item({
            title: 'title',
        });
        workflow.addItem(item);

        var ret = workflow.warning('wf warning');

    //     assert.strictEqual(ret, expectedObj);
    // });

    // it('generate info feeback', () => {
        var expectedObj = '{"items":[{"valid":"NO","title":"wf info","icon":{"path":"/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/ToolbarInfo.icns"}}]}';

        var ret = workflow.info('wf info');

    //     assert.strictEqual(ret, expectedObj);
    // });

    // it('generate info feeback with 1 added item', () => {
        var expectedObj = '{"items":[{"valid":"NO","title":"wf info","icon":{"path":"/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/ToolbarInfo.icns"}}]}';

        var item = new Item({
            title: 'title',
        });
        workflow.addItem(item);

        var ret = workflow.info('wf info');

//         assert.strictEqual(ret, expectedObj);
//     });
// });


// describe('#ActionHandlerTest', () => {
    var { actionHandler } = AlfredNode;
    // afterEach(() => {
        actionHandler.clear();
    // });

    // it('test action handler', () => {
        var data = '';
        actionHandler.onAction('action', (query) => {
            data = query;
        });

        actionHandler.handle('action', 'myquery');

        // assert.strictEqual(data, 'myquery');
    // });

    // it('test action handler for empty query', () => {
        var data = '';
        actionHandler.onAction('action', (query) => {
            data = query;
        });

        actionHandler.handle('action', undefined);

        // assert.strictEqual(data, undefined);
    // });

    // it('test action handler is not call for different action', () => {
        var data = '';
        actionHandler.onAction('action', (query) => {
            data = query;
        });

        actionHandler.handle('actionX', 'myquery');

        // assert.strictEqual(data, '');
    // });

    // it('test sub action handler', () => {
        var data1 = '';
        var data2 = '';
        var data3 = '';
        actionHandler.onMenuItemSelected('action', (query, selectedItemTitle, selectedItemData) => {
            data1 = selectedItemTitle;
            data2 = query;
            data3 = selectedItemData;
        });

        actionHandler.handle('action', `abc${utils.SUB_ACTION_SEPARATOR}myquery`);
        // assert.strictEqual(data1, 'abc');
        // assert.strictEqual(data2, 'myquery');
        // assert.isUndefined(data3);
    // });

    // it('test sub action handler with empty query', () => {
        var data1 = '';
        var data2 = '';
        actionHandler.onMenuItemSelected('action', (query, selectedItem) => {
            data1 = selectedItem;
            data2 = query;
        });

        actionHandler.handle('action', `abc${utils.SUB_ACTION_SEPARATOR}`);
        // assert.strictEqual(data1, 'abc');
        // assert.strictEqual(data2, '');
    // });

    // it('test action and sub action handler', () => {
        var data0 = '';
        var data1 = '';
        var data2 = '';

        actionHandler.onAction('action', (query) => {
            data0 = query;
        });

        actionHandler.onMenuItemSelected('action', (query, selectedItem) => {
            data1 = selectedItem;
            data2 = query;
        });

        actionHandler.handle('action', 'myquery');
        // assert.strictEqual(data0, 'myquery');

        actionHandler.handle('action', `abc${utils.SUB_ACTION_SEPARATOR}myquery`);
        // assert.strictEqual(data1, 'abc');
        // assert.strictEqual(data2, 'myquery');
    // });
// });



// describe('#StorageTest', () => {
//     afterEach(() => {
        storage.clear();
    // });

    // it('test set and get item without ttl', () => {
        var obj = {
            text: 'abc',
        };

        storage.set('key', obj);
        var obj2 = storage.get('key');
        // obj.should.equal(obj2);
    // });

    // it('test set and get item with ttl is not expired', (done) => {
        var obj = {
            text: 'abc',
        };

        storage.set('key', obj, 1000); // ttl is 1s
        setTimeout(() => {
            var obj2 = storage.get('key');
            // obj.should.equal(obj2);
            // done();
        }, 500);
    // });

    // it('test set and get item with ttl is expired', (done) => {
        var obj = {
            text: 'abc',
        };

        storage.set('key', obj, 1000); // ttl is 1s
        setTimeout(() => {
            var obj2 = storage.get('key');
            // should.not.exist(obj2);
            // done();
        }, 1100);
    // });

    // it('test set and get multiple items', () => {
        var obj1 = {
            text: 'abc',
        };

        var obj2 = {
            text: 'abc',
        };

        storage.set('key1', obj1);
        storage.set('key2', obj2);

        // obj1.should.equal(storage.get('key1'));
        // obj2.should.equal(storage.get('key2'));
    // });

    // it('test remove item', () => {
        var obj = {
            text: 'abc',
        };

        storage.set('key', obj);
        storage.remove('key');

        var obj2 = storage.get('key');
        // should.not.exist(obj2);
    // });

    // it('test clear item', () => {
        var obj = {
            text: 'abc',
        };

        storage.set('key', obj);
        storage.clear();

        var obj2 = storage.get('key');
        // should.not.exist(obj2);
    // });
// });

// describe('#Settings test', () => {
    var Settings = AlfredNode.settings;

    // afterEach(() => {
        Settings.clear();
    // });

    // it('test set + get setting', () => {
        Settings.set('username', 'user1');

        var username = Settings.get('username');
        // assert.strictEqual(username, 'user1');
    // });

    // it('test set + get multiple settings', () => {
        Settings.set('username', 'user1');
        Settings.set('password', 'pass1');

        // assert.strictEqual('user1', Settings.get('username'));
        // assert.strictEqual('pass1', Settings.get('password'));
    // });

    // it('test remove setting', () => {
        Settings.set('username', 'user1');
        Settings.remove('username');
        // assert.isUndefined(Settings.get('username'));
    // });

    // it('test clear setting', () => {
        Settings.set('username', 'user1');
        Settings.clear();
        // assert.isUndefined(Settings.get('username'));
    // });

    /* it("test set password", function(done) {
        Settings.setPassword("user1", "mypass");
        Settings.getPassword("user1", function(error, password) {
            assert.strictEqual(password, "mypass");
            done();
        });
    }); */
// });


// describe('#Utils test', () => {
//     it('test filter 1', () => {
        var list = [{
            key: '1',
            name: 'This is a pencil',
        }, {
            key: '2',
            name: 'This is a pen',
        }];

        var keyBuilder = function(item) {
            return item.name;
        };

        var results = utils.filter('this is', list, keyBuilder);
        // assert.strictEqual(results.length, 2);
        // assert.strictEqual(results[0].key, '1');

        results = utils.filter('pencil', list, keyBuilder);
        // assert.strictEqual(results.length, 1);
        // assert.strictEqual(results[0].key, '1');

        results = utils.filter('abcdef', list, keyBuilder);
    //     assert.strictEqual(results.length, 0);
    // });

    // it('test generate variables', () => {
        var data = {
            arg: 'xyz',
            variables: {
                key: 'value',
            },
        };

        var ret = utils.generateVars(data);
        // assert.strictEqual(ret, '{"alfredworkflow":{"arg":"xyz","variables":{"key":"value"}}}');
    // });

    // it('test generate variables with empty variables', () => {
        var data = {
            arg: 'xyz',
        };

        var ret = utils.generateVars(data);
    //     assert.strictEqual(ret, '{"alfredworkflow":{"arg":"xyz"}}');
    // });

    // it('test generate variables with empty arg', () => {
        var data = {
            variables: {
                key: 'value',
            },
        };

        var ret = utils.generateVars(data);
    //     assert.strictEqual(ret, '{"alfredworkflow":{"variables":{"key":"value"}}}');
    // });

    // it('test generate variables with input is string (not object)', () => {
        var data = 'string arg';

        var ret = utils.generateVars(data);
    //     assert.strictEqual(ret, 'string arg');
    // });

    // it('test generate variables with input is undefined', () => {
        var data = undefined;

        var ret = utils.generateVars(data);
    //     assert.isUndefined(ret);
    // });

    // it('test get/set env', () => {
        utils.envVars.set('key', 'value');
    //     assert.strictEqual(utils.envVars.get('key'), 'value');
    // });

    // it('test get/set env for obj', () => {
        utils.envVars.set('key', {
            name: 'alex',
        });
    //     assert.strictEqual(utils.envVars.get('key').name, 'alex');
    // });

    // it('test get/set workflow var', (done) => {
        var { wfVars } = utils;
        var ret;
        wfVars.clear(() => {
            wfVars.set('key', 'value', (error) => {
                // assert.isUndefined(error);

                wfVars.get('key', (err, value) => {
                    // assert.isUndefined(error);
                    ret = value;
                    // assert.strictEqual(ret, 'value');
                    wfVars.clear();
                    // done();
                });
            });
        });
//     });
// });

const { ICONS } = AlfredNode;
ICONS.ACCOUNT
ICONS.BURN
ICONS.CLOCK
ICONS.COLOR
ICONS.EJECT
ICONS.ERROR
ICONS.FAVORITE
ICONS.GROUP
ICONS.HELP
ICONS.HOME
ICONS.INFO
ICONS.NETWORK
ICONS.NOTE
ICONS.SETTINGS
ICONS.SWIRL
ICONS.SWITCH
ICONS.SYNC
ICONS.TRASH
ICONS.USER
ICONS.WARNING
ICONS.WEB



/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
var _getData = function() {
    return [{
        name: 'Alex',
        age: '20',
    }, {
        name: 'David',
        age: '30',
    }, {
        name: 'Kat',
        age: '10',
    }];
};

var search = function(query) {
    _.each(utils.filter(query, _getData(), (data) => data.name), (item) => {
        workflow.addItem(new Item({
            title: item.name,
            subtitle: item.age,
            data: item,
            hasSubItems: true,
        }));
    });

    return workflow.feedback();
};

var feedback = '';
actionHandler.onAction('action', (query) => {
    feedback = search(query);
});

actionHandler.onMenuItemSelected('action', (query, selectedItemTitle) => {
    console.log('onMenuItemSelected.....');
    workflow.addItem(new Item({
        title: `Menu Item 1: ${query}`,
        subtitle: selectedItemTitle,
    }));

    feedback = workflow.feedback();
});

workflow.clearItems();
storage.clear();

// test no items found
process.argv = ['', '', 'action', 'myquery'];
AlfredNode.run();
workflow.clearItems();

// test 1 item found
process.argv = ['', '', 'action', 'ka'];
AlfredNode.run();
workflow.clearItems();

// test with empty query => all items should be returned
process.argv = ['', '', 'action', ''];
AlfredNode.run();
workflow.clearItems();

// test menuitem
process.argv = ['', '', 'action', `Alex${AlfredNode.utils.SUB_ACTION_SEPARATOR}abc`];
AlfredNode.run();
workflow.clearItems();

// test item usages are tracked
storage.clear();
process.argv = ['', '', 'action', `Alex${AlfredNode.utils.SUB_ACTION_SEPARATOR}`];
AlfredNode.run();
var usage = storage.get('usage');

process.argv = ['', '', 'action', `Alex${AlfredNode.utils.SUB_ACTION_SEPARATOR}`];
AlfredNode.run();
usage = storage.get('usage');

process.argv = ['', '', 'action', `Alex${AlfredNode.utils.SUB_ACTION_SEPARATOR}abc`];
AlfredNode.run();
usage = storage.get('usage');
// usage should NOT be increased when `query` is not empty
workflow.clearItems();
storage.clear();

// test items are sorted
process.argv = ['', '', 'action', ''];
storage.set('usage', {
    Kat: 1,
    David: 2,
});

AlfredNode.run();
workflow.clearItems();
storage.clear();