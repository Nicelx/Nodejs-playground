const http = require('http')
const fs = require('fs');

const rqListener = (req, res) => {
	// process.exit();

	const url = req.url;
	const method = req.method;

	if (url === '/') {
		const template = `
			<html>
				<head>
					<title>test</title>
				</head>
				<body>
					<form action ="/message" method = "POST">
						<input type = "text" name = "message"/>
						<button type = "submit">click</button>
					</form>
				</body>
			</html>
		`
		res.write(template);
		return res.end();
	}

	if (url === '/message' && method === 'POST') {
		const body = []
		req.on('data', (chunk) => {
			console.log(chunk)
			body.push(chunk)
		})
		req.on('end', () => {
			const parsedBody = Buffer.concat(body).toString();
			const message = parsedBody.split('=')[1];
			fs.writeFileSync('message.txt', message)
		})


		res.statusCode = 302;
		res.setHeader('Location', '/')
		return res.end();
	}

	res.setHeader('Content-Type', 'text/html')
	res.write('<html>')
	res.write('<head><title>lol</title></head>')
	res.write('<body>wtf</body>')
	res.write('</html>')
	res.end();
}

const server = http.createServer(rqListener) 

server.listen(3000)