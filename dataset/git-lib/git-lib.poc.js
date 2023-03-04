const git = require("git-lib");
git.add("test;touch git-lib;").finally(function () {
  // file_exist = fs.existsSync(path);
  // expect(file_exist).toBe(true);
  // fs.unlink(path, function (err) {});
});


