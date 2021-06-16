// const http = require('http');

// const routes = require('./routes');

// const server = http.createServer(routes);

// server.listen(3000);


// new task

const express = require('express');

const app = express();

app.listen(3000);

app.use((req,res,next) => {
	console.log('first middleware');
	next();
})
app.use((req,res,next) => {
	console.log('second middleware');
	next();
})
app.use('/users', (req,res) => {
	res.send('<h1>users</h1>')
})
app.use('/', (req,res) => {
	res.send('<h1>home</h1>')
})