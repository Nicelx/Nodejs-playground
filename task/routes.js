const mockData = require("./mockData");

const routes = (req, res) => {
	const { url, method } = req;

	if (url === "/") {
		const greetingHtml = `
			<h1>hello there</h1>
			<form action ="/create-user" method = "POST">
				<input name = "username">
				<button>go</button>
				<div>${mockData.join('')}
			</form>
			`;
		res.write(makeTemplate(greetingHtml));
		return res.end();
	}

	if (url === "/create-user" && method === "POST") {
		console.log("got here");
		const data = [];

		req.on("data", (chunk) => {
			data.push(chunk);
		});
		req.on("end", () => {
			const text = Buffer.concat(data).toString();
			console.log(text);
			res.statusCode = 302;
			res.setHeader("Location", "/");
			console.log(mockData);
			mockData.push({
				name : text,
			})
			return res.end();
		});
	}
};

const makeTemplate = (bodyString) => {
	return `
		<html>
			<head>
				<title>
					page
				</title>
			</head>
			<body>
				${bodyString}
			</body>
		</html>
	`;
};

module.exports = routes;
