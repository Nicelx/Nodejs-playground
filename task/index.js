// const http = require('http');

// const routes = require('./routes');

// const server = http.createServer(routes);

// server.listen(3000);


// new task

const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');

const router = require('./routes');

const app = express();

app.set("view engine", "ejs");
app.set("views", "task/views");

// app.use(express.static(path.join(__dirname)));


app.use(router);

app.use((req,res) => {
	res.send('<h1>page not found</h1>')
})
app.listen(3000);