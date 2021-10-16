const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

const app = express();

const MONGODB_URI = "mongodb+srv://Nicel:12345@node-complete.nsiof.mongodb.net/messages";

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

app.use("/feed", feedRoutes);
app.use((err, req, res, next) => {
	console.log(err);
	const status = err.statusCode || 500
	const message = err.message;
	res.status(status).json({
		message
	});
})

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		app.listen(8080);
	})
	.catch((err) => console.log(err));
