const scp = require("scp");
scp.send(options, function (err) {});

// test("Command Injection in scp", (done) => {
//   expect.assertions(2);
//   const scp = require("scp");
//   const fs = require("fs");
//   const path = "./scp";
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
//   let options = {
//     file: "& touch scp; #",
//     user: "username",
//     host: "myServer",
//     port: "20",
//     path: "~",
//   };
//   scp.send(options, function (err) {
//     file_exist = fs.existsSync(path);
//     expect(file_exist).toBe(true);
//     fs.unlink(path, function (err) {
//       done();
//     });
//   });
// });

