const killPortProcess = require('kill-port-process');
killPortProcess(1234);
killPortProcess([1234, 6789]);
killPortProcess(1234, { signal: 'SIGTERM' });
