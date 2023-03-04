var cmd = require('wc-cmd')
cmd('echo 123').then(
        function(data) {
            console.log(process.cwd());
        }
    )
    .then(
        function() {
            return cmd('echo 123')
        }
    )
    .then(function(data) {
        console.log(data.join(''))
        console.log('all cmd over!')
    })

cmd(['echo 123', 'echo 123'])
    .then(
        function(data) {
            console.log(data.join(''))
        }
    );
