const fs = require('fs');
const { mdToPdf } = require('md-to-pdf');

(async () => {
	const pdf = await mdToPdf({ path: './readme.md' }).catch(console.error);

	if (pdf) {
		fs.writeFileSync(pdf.filename, pdf.content);
	}
})();
