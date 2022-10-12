const fs = require("fs");
const { Worker, isMainThread, parentPort, workerData, MessageChannel } = require('worker_threads');

function sec(){
    var seccomp = require("seccomp-demo");
    const seccomp_ctx = seccomp.NodeSeccomp();
    var sec = seccomp_ctx.init(seccomp.SCMP_ACT_KILL_PROCESS);
    seccomp_ctx.init(seccomp.SCMP_ACT_KILL_PROCESS)
        .addRule(seccomp.SCMP_ACT_ALLOW, 'close')
        .addRule(seccomp.SCMP_ACT_ALLOW, 'madvise')
        .addRule(seccomp.SCMP_ACT_ALLOW, 'epoll_wait')
        .addRule(seccomp.SCMP_ACT_ALLOW, 'futex')
        .addRule(seccomp.SCMP_ACT_ALLOW, 'exit')
        .addRule(seccomp.SCMP_ACT_ALLOW, 'write')
        .addRule(seccomp.SCMP_ACT_ALLOW, 'munmap')
        .addRule(seccomp.SCMP_ACT_ALLOW, 'mprotect')
        .addRule(seccomp.SCMP_ACT_ALLOW, 'read');

    const data = fs.readFileSync('whitelist', 'UTF-8');
    const lines = data.split(/\r?\n/);
    lines.forEach((line) => {
        sec.addRule(seccomp.SCMP_ACT_ALLOW, line.trim());
    });

    sec.load();
}

if ( isMainThread ) {
    fs.readFile("", function(err, data){});
    const worker = new Worker(__filename);
} else {
    sec();
    require("./poc");
}