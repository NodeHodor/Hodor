// test("Command Injection in theme-core", (done) => {
//   expect.assertions(2);
//   const a = require("theme-core");
//   const fs = require("fs");
//   const path = "./theme-core";
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
//   a.utils.sh("touch theme-core", true, function () {
//     file_exist = fs.existsSync(path);
//     expect(file_exist).toBe(true);
//     fs.unlink(path, function (err) {});
//     done();
//   });
// });


const a = require("theme-core");
a.events;
a.showTasks("aaaa")
a.utils.sh("touch aaa", true, () => {
})
a.utils.flattenArray([[123, 123], [2,2,2,2]]);
a.utils.uniqueArray([1, 2, 2, 2, 2, 3]);
a.utils.error("error message");
var b = a.utils.toYaml("test");
a.utils.fromYaml(b);
a.utils.writeYamlFileSync("test", b);
a.utils.writeYamlFile("test2", b, ()=>{});
setTimeout(()=>{}, 3000);
a.utils.readYamlFileSync("test");
a.utils.readYamlFile("test2",()=>{});


