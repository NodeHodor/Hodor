var publisher = require('apex-publish-static-files');

// If connecting to OCI (Oracle cloud) need to specify location of Oracle Wallet
process.env['TNS_ADMIN'] = '/Users/vmorneau/oracle/wallets/atp01';

publisher.publish({
    libDir: "/Users/vmorneau/Oracle/instantclient_19_8",
	username: "vmorneau",
	password: "xxxxxx",
	connectionString: "localhost:1521/servicename",
    directory: "/Users/vmorneau/Documents/project/www",
    appID: 111
});
