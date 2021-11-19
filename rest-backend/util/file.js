const path = require('path');
const fs = require('fs');

const clearImage = (filePath) => {
	const fP = path.join(__dirname, "..", filePath);
	fs.unlink(fP, (err) => {
		console.log(err);
	});
};

exports.clearImage = clearImage;