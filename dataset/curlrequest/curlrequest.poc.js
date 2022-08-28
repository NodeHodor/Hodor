var curl = require("curlrequest");
let userPayload = "/etc/passwd";
curl.request({ file: userPayload }, function (err, stdout, meta) {
    console.log("%s %s", meta.cmd, meta.args.join(" "));
});
