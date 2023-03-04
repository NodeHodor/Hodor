const root = require("apiconnect-cli-plugins");
let payload = "& touch apiconnect-cli-plugins &";
root.pluginLoader.installPlugin(payload, "").catch(() => {
  // file_exist = fs.existsSync(path);
  // expect(file_exist).toBe(true);
  // fs.unlink(path, function (err) {});
});
