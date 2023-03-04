var cmd = require('wc-cmd')
cmd('mkdir hh').then(
        function(data) {
            console.log(process.cwd());
        }
    )
    .then(
        function() {
            return cmd('dir')
        }
    )
    .then(function(data) {
        console.log(data.join(''))
        console.log('all cmd over!')
    })
