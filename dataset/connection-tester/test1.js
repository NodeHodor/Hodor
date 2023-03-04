const connectionTester = require('connection-tester');

connectionTester.test(
    'www.yahoo.com',  // host
    80,               // port
    1000,             // connection timeout
    (err, output) => {
        console.log(output);
    }
);

connectionTester.test(
    'api.paypal.com', // host
    443,              // port
    1000,             // connection timeout
    (err, output) => {
        console.log(output);
    }
);

console.log(connectionTester.test('www.yahoo.com', 80, 1000));
console.log(connectionTester.test('api.paypal.com', 443, 1000));
