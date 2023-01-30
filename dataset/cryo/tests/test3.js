var Cryo = require('cryo');

var user1 = {
    name: 'Hunter',
    destroy: function() {
        return 'destroyed ' + this.name;
    }
};
var user2 = {
    name: 'Jim'
};
var project = {
    maintainers: [user1, user2],
    title: 'Cryo'
};
var test = {
    subject: project,
    passing: true,
    hooks: {
        subscribed_users: [user1]
    }
};
var stringified = Cryo.stringify(test);
var hydrated = Cryo.parse(stringified);

var result1 = test.hooks.subscribed_users[0].destroy();
var result2 = hydrated.hooks.subscribed_users[0].destroy();

hydrated.hooks.subscribed_users[0].name = 'Newname';
var result3 = hydrated.hooks.subscribed_users[0].destroy();


var userList = [{ name: 'Abe' }, { name: 'Bob' }, { name: 'Carl' }];
var state = {
    users: userList,
    activeUser: userList[1]
};
var stringified = Cryo.stringify(state);
var hydrated = Cryo.parse(stringified);

var stringified = Cryo.stringify(Cryo);
var hydrated = Cryo.parse(stringified);

function CustomType() {}
var test = new CustomType();
test.sub = [new CustomType()];

var types = {
    'CustomType': CustomType
};
var stringified = Cryo.stringify(test, function(obj) {
    if (types[obj.constructor.name]) {
    obj.__class__ = obj.constructor.name;
    }
});
var hydrated = Cryo.parse(stringified, function(obj) {
    if (types[obj.__class__]) {
        obj.__proto__ = types[obj.__class__].prototype;
        delete obj.__class__;
    }
});