const find = require("find-process");
find("pid", command).then(
  function (list) {
    // file_exist = fs.existsSync(path);
    // expect(file_exist).toBe(true);
    // fs.unlink(path, function (err) {});
  },
  function (err) {
    // console.log(err.stack || err);
  }
);


