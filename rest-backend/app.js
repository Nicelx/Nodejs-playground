const path = require("path");
const fs = require('fs');

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const graphqlHttp = require('express-graphql').graphqlHTTP;

const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');


const app = express();

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		const filenameString = new Date().valueOf() + '-' + file.originalname;
		cb(null, filenameString);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const MONGODB_URI = "mongodb+srv://Nicel:12345@node-complete.nsiof.mongodb.net/messages";

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	// res.setHeader("Access-Control-Allow-Headers", "*");
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200)
	}
	next();
});

app.use(auth);

app.put('/post-image', (req, res, next) => {
	if (!req.isAuth) {
		throw new Error('Not authenticated')
	}
	if (!req.file) {
		return res.status(200).json({message: 'No file provided!'})
	}
	if (req.body.oldPath) {
		clearImage(req.body.oldPath);
	}

	const correctPath = req.file.path.replace(/\\/g, '/');
	return res.status(201).json({message : 'file stored!', filePath: correctPath})
});


app.use('/graphql', graphqlHttp({
	schema : graphqlSchema,
	rootValue : graphqlResolver,
	graphiql : true,
	formatError(err) {
		if (!err.originalError) {
			return err;
		}
		const data = err.originalError.data;
		const message = err.message || 'An error occur';
		const code = err.originalError.code || 500;
		return {
			message, status: code, data
		}
	}
}));


app.use((err, req, res, next) => {
	console.log(err);
	const status = err.statusCode || 500;
	const message = err.message;
	const data = error.data;
	res.status(status).json({
		message,
		data,
	});
});

mongoose
	.connect(MONGODB_URI)
	.then((result) => {
		app.listen(8080);
	})
	.catch((err) => console.log(err));


	const clearImage = (filePath) => {
		const fP = path.join(__dirname, "..", filePath);
		fs.unlink(fP, (err) => {
			console.log(err);
		});
	};
	