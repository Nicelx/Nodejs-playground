const http = require("http");

const express = require('express');

const app = express();

// allow add new middleware
app.use((req,res,next) => {
	console.log('in the first middleware');	
	next();
})
app.use((req,res,next) => {
	console.log('in the second middleware');	
	next();
})

const server = http.createServer(app);

server.listen(3000);