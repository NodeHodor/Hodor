var a = require("monorepo-build");
// const execUtil = require('./util/exec');
// execUtil.calls = [];
// const preRepkg = jest.fn(), postRepkg = jest.fn();
// TODO: have publish return packages and snapshot that value
a.build("./tests/", 'https://github.com/facebookincubator/create-react-app.git', 'HEAD', {
exclude: ['create-react-app'],
// preRepkg,
// postRepkg,
});
