var NodeClam = require('clamscan');
var ClamScan = new NodeClam().init();

var NodeClam = require('clamscan');
var ClamScan = new NodeClam().init({
    removeInfected: false, // If true, removes infected files
    quarantineInfected: false, // False: Don't quarantine, Path: Moves files to this place.
    scanLog: null, // Path to a writeable log file to write scan results into
    debugMode: false, // Whether or not to log info/debug/error msgs to the console
    fileList: null, // path to file containing list of files to scan (for scanFiles method)
    scanRecursively: true, // If true, deep scan folders recursively
    clamscan: {
        path: '/usr/bin/clamscan', // Path to clamscan binary on your server
        db: null, // Path to a custom virus definition database
        scanArchives: true, // If true, scan archives (ex. zip, rar, tar, dmg, iso, etc...)
        active: true // If true, this module will consider using the clamscan binary
    },
    clamdscan: {
        socket: false, // Socket file for connecting via TCP
        host: false, // IP of host to connect to TCP interface
        port: false, // Port of host to use when connecting via TCP interface
        timeout: 60000, // Timeout for scanning files
        localFallback: true, // Use local preferred binary to scan if socket/tcp fails
        path: '/usr/bin/clamdscan', // Path to the clamdscan binary on your server
        configFile: null, // Specify config file if it's in an unusual place
        multiscan: true, // Scan using all available cores! Yay!
        reloadDb: false, // If true, will re-load the DB on every call (slow)
        active: true, // If true, this module will consider using the clamdscan binary
        bypassTest: false, // Check to see if socket is available when applicable
    },
    preference: 'clamdscan' // If clamdscan is found and active, it will be used by default
});

var NodeClam = require('clamscan');
var ClamScan = new NodeClam().init({
    removeInfected: true, // Removes files if they are infected
    quarantineInfected: '~/infected/', // Move file here. removeInfected must be FALSE, though.
    scanLog: '/var/log/node-clam', // You're a detail-oriented security professional.
    debugMode: true, // This will put some debug info in your js console
    fileList: '/home/webuser/scanFiles.txt', // path to file containing list of files to scan
    scanRecursively: false, // Choosing false here will save some CPU cycles
    clamscan: {
        path: '/usr/bin/clam', // I dunno, maybe your clamscan is just call "clam"
        scanArchives: false, // Choosing false here will save some CPU cycles
        db: '/usr/bin/better_clam_db', // Path to a custom virus definition database
        active: false // you don't want to use this at all because it's evil
    },
    clamdscan: {
        socket: '/var/run/clamd.scan/clamd.sock', // This is pretty typical
        host: '127.0.0.1', // If you want to connect locally but not through socket
        port: 12345, // Because, why not
        timeout: 300000, // 5 minutes
        localFallback: false, // Do no fail over to binary-method of scanning
        path: '/bin/clamdscan', // Special path to the clamdscan binary on your server
        configFile: '/etc/clamd.d/daemon.conf', // A fairly typical config location
        multiscan: false, // You hate speed and multi-threaded awesome-sauce
        reloadDb: true, // You want your scans to run slow like with clamscan
        active: false, // you don't want to use this at all because it's evil
        bypassTest: true, // Don't check to see if socket is available. You should probably never set this to true.
    },
    preference: 'clamscan' // If clamscan is found and active, it will be used by default
});

var NodeClam = require('clamscan');
var ClamScan = new NodeClam().init({
    removeInfected: true, // Removes files if they are infected
    quarantineInfected: '~/infected/', // Move file here. removeInfected must be FALSE, though.
    scanLog: '/var/log/node-clam', // You're a detail-oriented security professional.
    debugMode: true, // This will put some debug info in your js console
    fileList: '/home/webuser/scanFiles.txt', // path to file containing list of files to scan
    scanRecursively: false, // Choosing false here will save some CPU cycles
    clamscan: {
        path: '/usr/bin/clam', // I dunno, maybe your clamscan is just call "clam"
        scanArchives: false, // Choosing false here will save some CPU cycles
        db: '/usr/bin/better_clam_db', // Path to a custom virus definition database
        active: false // you don't want to use this at all because it's evil
    },
    clamdscan: {
        socket: '/var/run/clamd.scan/clamd.sock', // This is pretty typical
        host: '127.0.0.1', // If you want to connect locally but not through socket
        port: 12345, // Because, why not
        timeout: 300000, // 5 minutes
        localFallback: false, // Do no fail over to binary-method of scanning
        path: '/bin/clamdscan', // Special path to the clamdscan binary on your server
        configFile: '/etc/clamd.d/daemon.conf', // A fairly typical config location
        multiscan: false, // You hate speed and multi-threaded awesome-sauce
        reloadDb: true, // You want your scans to run slow like with clamscan
        active: false, // you don't want to use this at all because it's evil
        bypassTest: true, // Don't check to see if socket is available. You should probably never set this to true.
    },
    preference: 'clamscan' // If clamscan is found and active, it will be used by default
});

// // Get instance by resolving ClamScan promise object
ClamScan.then(async clamscan => {
    try {
        // You can re-use the `clamscan` object as many times as you want
        var version = clamscan.getVersion();
        console.log(`ClamAV Version: ${version}`);

        var {isInfected, file, viruses} = clamscan.isInfected('/some/file.zip');
        if (isInfected) console.log(`${file} is infected with ${viruses}!`);
    } catch (err) {
        // Handle any errors raised by the code in the try block
    }
}).catch(err => {
    // Handle errors that may have occurred during initialization
});

// var NodeClam = require('clamscan');

function some_function() {
    try {
        // Get instance by resolving ClamScan promise object
        var clamscan = new NodeClam().init({
            removeInfected: true, // Removes files if they are infected
            quarantineInfected: '~/infected/', // Move file here. removeInfected must be FALSE, though.
            scanLog: '/var/log/node-clam', // You're a detail-oriented security professional.
            debugMode: true, // This will put some debug info in your js console
            fileList: '/home/webuser/scanFiles.txt', // path to file containing list of files to scan
            scanRecursively: false, // Choosing false here will save some CPU cycles
            clamscan: {
                path: '/usr/bin/clam', // I dunno, maybe your clamscan is just call "clam"
                scanArchives: false, // Choosing false here will save some CPU cycles
                db: '/usr/bin/better_clam_db', // Path to a custom virus definition database
                active: false // you don't want to use this at all because it's evil
            },
            clamdscan: {
                socket: '/var/run/clamd.scan/clamd.sock', // This is pretty typical
                host: '127.0.0.1', // If you want to connect locally but not through socket
                port: 12345, // Because, why not
                timeout: 300000, // 5 minutes
                localFallback: false, // Do no fail over to binary-method of scanning
                path: '/bin/clamdscan', // Special path to the clamdscan binary on your server
                configFile: '/etc/clamd.d/daemon.conf', // A fairly typical config location
                multiscan: false, // You hate speed and multi-threaded awesome-sauce
                reloadDb: true, // You want your scans to run slow like with clamscan
                active: false, // you don't want to use this at all because it's evil
                bypassTest: true, // Don't check to see if socket is available. You should probably never set this to true.
            },
            preference: 'clamscan' // If clamscan is found and active, it will be used by default
        });
        var {goodFiles, badFiles} = clamscan.scanDir('/foo/bar');
    } catch (err) {
        // Handle any errors raised by the code in the try block
    }
}

some_function();

// ClamScan.getVersion((err, version) => {
//     if (err) return console.error(err);
//     console.log(`ClamAV Version: ${version}`);
// });

// ClamScan.isInfected('/a/picture/for_example.jpg', (err, file, isInfected, viruses) => {
//     if (err) return console.error(err);

//     if (isInfected) {
//         console.log(`${file} is infected with ${viruses.join(', ')}.`);
//     }
// });

var request = require('request');
var fs = require('fs');
var fake_virus_url = 'https://secure.eicar.org/eicar_com.txt';
var normal_file_url = 'https://raw.githubusercontent.com/kylefarris/clamscan/sockets/README.md';
var temp_dir = __dirname;
var scan_file = `${temp_dir}/tmp_file.txt`;
//var test_file = normal_file_url;
var test_file = fake_virus_url;

// Initialize the clamscan module
var NodeClam = require('clamscan'); // Offically: require('clamscan');

var ClamScan = new NodeClam().init({
    remove_infected: true,
    scan_recursively: false,
    clamdscan: {
        path: '/usr/bin/clamdscan',
        config_file: '/etc/clamd.d/daemon.conf'
    },
    preference: 'clamdscan'
});

// Request a test file from the internet...
request(test_file, (error, response, body) => {
    if (!error && response.statusCode == 200) {
        // Write the file to the filesystem
        fs.writeFileSync(scan_file, body);

        // Scan the file
        ClamScan.then(clamscan => {
            clamscan.is_infected(scan_file, (err, file, is_infected) => {
                // If there's an error, log it
                if (err) {
                    console.error("ERROR: " + err);
                    console.trace(err.stack);
                    process.exit(1);
                }

                // If `is_infected` is TRUE, file is a virus!
                if (is_infected === true) {
                    console.log("You've downloaded a virus! (don't worry, it's only a test one and is not malicious..)");
                } else if (is_infected === null) {
                    console.log("Something didn't work right...", )
                } else if (is_infected === false) {
                    console.log("The file you downloaded was just fine... Carry on...");
                }

                // Remove the file (for good measure)
                if (fs.existsSync(scan_file)) fs.unlinkSync(scan_file);
                process.exit(0);
            });
        });
    } else {
        console.log("Could not download test virus file!");
        console.error(error);
        process.exit(1);
    }
});


var {PassThrough} = require('stream');
var request = require('request');
var fs = require('fs');
var {promisify} = require('util');
var fs_unlink = promisify(fs.unlink);

var fake_virus_url = 'https://secure.eicar.org/eicar_com.txt';
var normal_file_url = 'https://raw.githubusercontent.com/kylefarris/clamscan/sockets/README.md';
var large_file_url = 'http://speedtest-ny.turnkeyinternet.net/100mb.bin';
var passthru_file = __dirname + '/output';

var test_url = normal_file_url;
// var test_url = fake_virus_url;
// var test_url = large_file_url;


// Initialize the clamscan module
var NodeClam = require('clamscan'); // Offically: require('clamscan');

async function test() {
    var clamscan = await new NodeClam().init({
        debug_mode: true,
        clamdscan: {
            host: 'localhost',
            port: 3310,
            bypass_test: true,
            // socket: '/var/run/clamd.scan/clamd.sock',
        },
    });

    var input = request.get(test_url);
    var output = fs.createWriteStream(passthru_file);
    var av = clamscan.passthrough();

    input.pipe(av).pipe(output);

    av.on('error', error => {
        if ('data' in error && error.data.is_infected) {
            console.error("Dang, your stream contained a virus(es):", error.data.viruses);
        } else {
            console.error(error);
        }
        remove_final_file();
    }).on('finish', () => {
        console.log("All data has been sent to virus scanner");
    }).on('end', () => {
        console.log("All data has been scanned sent on to the destination!");
    }).on('scan-complete', result => {
        console.log("Scan Complete: Result: ", result);
        if (result.is_infected === true) {
            console.log(`You've downloaded a virus (${result.viruses.join(', ')})! Don't worry, it's only a test one and is not malicious...`);
        } else if (result.is_infected === null) {
            console.log(`There was an issue scanning the file you downloaded...`);
        } else {
            console.log(`The file (${test_url}) you downloaded was just fine... Carry on...`);
        }
        remove_final_file();
        process.exit(0);
    });

    output.on('finish', () => {
        console.log("Data has been fully written to the output...");
        output.destroy();
    });

    output.on('error', error => {
        console.log("Final Output Fail: ", error);
        process.exit(1);
    });
}

async function remove_final_file() {
    try {
        await fs_unlink(passthru_file);
        console.log(`Output file: "${passthru_file}" was deleted.`);
        process.exit(1);
    } catch (err) {
        throw err;
        process.exit(1);
    }
}

test();


var {PassThrough, Readable, Writable} = require('stream');
var request = require('request');

var fake_virus_url = 'https://secure.eicar.org/eicar_com.txt';
var normal_file_url = 'https://raw.githubusercontent.com/kylefarris/clamscan/sockets/README.md';
var test_url = normal_file_url;

// Initialize the clamscan module
// var NodeClam = require('../index.js'); // Offically: require('clamscan');
var NodeClam = require('clamscan');
async function test() {
    var clamscan = await new NodeClam().init({
        debug_mode: false,
        clamdscan: {
            bypass_test: true,
            host: 'localhost',
            port: 3310,
            socket: '/var/run/clamd.scan/clamd.sock',
        },
    });

    var passthrough = new PassThrough();
    var source = request.get(test_url);

    // Fetch fake Eicar virus file and pipe it through to our scan screeam
    source.pipe(passthrough);

    try {
        var {is_infected, viruses} = await clamscan.scan_stream(passthrough)

        // If `is_infected` is TRUE, file is a virus!
        if (is_infected === true) {
            console.log(`You've downloaded a virus (${viruses.join('')})! Don't worry, it's only a test one and is not malicious...`);
        } else if (is_infected === null) {
            console.log("Something didn't work right...");
        } else if (is_infected === false) {
            console.log(`The file (${test_url}) you downloaded was just fine... Carry on...`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();

// Initialize the clamscan module
var NodeClam = require('clamscan'); // Offically: require('clamscan');

var ClamScan = new NodeClam().init({
    debug_mode: false,
    clamdscan: {
        // Run scan using command line
        path: '/usr/bin/clamdscan',                // <-- Secondary fallback to command line -|
        config_file: '/etc/clamd.d/daemon.conf',   // <---------------------------------------|
        // Connect via Host/Port
        host: 'localhost',                         // <-- Primary fallback - |
        port: 3310,                                // <----------------------|
        // Connect via socket (preferred)
        socket: '/var/run/clamd.scan/clamd.sock',  // <-- Preferred connection method
        active: true,                              // Set to 'false' to test getting version info from `clamscan`
    },
    clamscan: {
        path: '/usr/bin/clamscan',                 // <-- Worst-case scenario fallback
    },
    preference: 'clamdscan',                        // Set to 'clamscan' to test getting version info from `clamav`
});

ClamScan.then(async av => {
    var result = await av.get_version();
    console.log("Version: ", result);
});
