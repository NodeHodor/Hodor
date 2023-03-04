var Test = require("giting");
var injection_command = ";";
test = new Test({"workDir": "./"});
repo = {"organization": "./", "name": "./", "branch": injection_command}
test.init("./", function(){});
// test.onRequest("aaa");
// test.perm(function(){});
// test.checkout(repo, function(){});
// test.pull(repo, function(){});
// test.handlePush(repo, function(){});
// console.log("finished");

var Git = require("giting");

var git = new Git({
	auth : function(username, password, callback) {

		for (var i = 0,
		    j = users.length; i < j; i++) {

			if (users[i].username == username && users[i].password == password) {
				return callback(null, users[i]);
			}

		};
		callback(401);
	},
	autoCreate : true
});

var demo = {
	username : 'demo',
	password : 'demo'
};

var bob = {
	username : 'bob',
	password : 'bob'
};

var users = [demo, bob];

var repos = {
	test : {
		name : 'test',
		organization : 'test',
		url : 'http://localhost:5000/bob/test.git',
		users : [{
			user : demo,
			permissions : {
				read : true,
				write : true
			}
		}, {
			user : bob,
			permissions : {
				read : true,
				write : true
			}
		}],
        sideband: {
            write: ()=>{},
        }
	},
    write: ()=>{},
};
Object.keys(repos).forEach(function(key) {
	git.create(repos[key].organization, repos[key].name, function() {

	});
});
/**
 *
 *
 *
 */

git.perm(function(repo) {
	var info = repos[repo.name];
	for (var i = 0,
	    j = info.users.length; i < j; i++) {
		if (info.users[i].user.username == repo.credentials.username) {
			if (info.users[i].permissions.write == repo.write) {
				return repo.accept();
			}
			if (info.users[i].permissions.read == repo.read) {
				return repo.accept();
			}
		}
	};
	repo.reject();
});

git.on('sideband', function(repo) {
	console.log('sideband', repo);
	repo.sideband.end('all good\n');

});

git.update(repo, function(){});
git.perm(function(){});
git.pull(repo, function(){});
git.onRequest({
    method: "GET",
    cwd: 1,
    commit: 1,
    branch: 1,
    evName: 1,
    req: {
        credentials: 1
    },
    repo: "https://github.com/xjamundx/gitblame.git",

});
git.handlePush(repo, function(){});

git.handle({
    headers: {
        "x-forwarded-for": 1
    },
    method: "GET",

}, {
    setHeader: ()=>{},
    statusCode: 1,
    end: ()=>{},
})

git.createDir("./", "./", ()=>{})
git.checkoutDir("./", "./", ()=>{})