const express = require('express');

const app = express();

// allow add new middleware
// app.use((req,res,next) => {
// 	console.log('in the first middleware');	
// 	next();
// })
app.use('/add-product', (req,res,next) => {
	res.send('<h1>add product</h1>')
})
app.use('/', (req,res,next) => {
	console.log('in the second middleware');	
	res.send('<h1>Hello from Express</h1>')
})

// const server = http.createServer(app);

// server.listen(3000);

// alternative

app.listen(3000);