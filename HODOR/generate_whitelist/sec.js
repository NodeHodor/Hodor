var fs = require("fs");

function sec(){
  var seccomp = require("node-seccomp");
  const seccomp_ctx = seccomp.NodeSeccomp();
  var sec = seccomp_ctx.init(seccomp.SCMP_ACT_KILL_PROCESS);
  seccomp_ctx.init(seccomp.SCMP_ACT_KILL_PROCESS)
  const data_base = fs.readFileSync('sec_musl/whitelist_base', 'UTF-8');
  const lines_base = data_base.split(/\r?\n/);
  lines_base.forEach((line) => {
      if (line.trim()) {
          sec.addRule(seccomp.SCMP_ACT_ALLOW, line.trim());
           }
  });

  const data = fs.readFileSync('sec_musl/whitelist', 'UTF-8');
  const lines = data.split(/\r?\n/);
  lines.forEach((line) => {
      if (line.trim()) {
          sec.addRule(seccomp.SCMP_ACT_ALLOW, line.trim());
           }
  });

  sec.load();
}

sec();
