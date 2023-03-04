var root = require("google-cloudstorage-commands");
root
    // .upload("./", "& touch google-cloudstorage-commands", true)
    .upload("./", "", true)
    .finally(() => {
      // file_exist = fs.existsSync(path);
      // expect(file_exist).toBe(true);
      // fs.unlink(path, function (err) {});
    });


