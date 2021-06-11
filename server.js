const http = require('http')

const rqListener = (req, res) => {
	console.log(req.url, req.method, req.headers)
	// process.exit();
	res.setHeader('Content-Type', 'text/html')
	res.write('<html>')
	res.write('<head><title>lol</title></head>')
	res.write('<body>wtf</body>')
	res.write('</html>')
	res.end();
}

const server = http.createServer(rqListener) 

server.listen(3000)