const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator/check");

const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
	Post.find()
		.then((posts) => {
			res.status(200).json({
				message: "fetched posts succesfully",
				posts,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.createPost = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error("Validation failed");
		error.statusCode = 422;
		throw error;
	}
	if (!req.file) {
		const error = new Error("No image provided");
		error.statusCode = 422;
		throw error;
	}

	const imageUrl = req.file.path.replace("\\", "/");
	const title = req.body.title;
	const content = req.body.content;
	const post = new Post({
		title: title,
		content: content,
		imageUrl: imageUrl,
		creator: {
			name: "me",
		},
	});
	post.save()
		.then((result) => {
			res.status(201).json({
				message: "Post created successfully!",
				post: result,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.getPost = (req, res, next) => {
	const postId = req.params.postId;

	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error("Not find post");
				error.statusCode = 404;
				throw error;
			}
			res.status(200).json({
				message: "Post fetched",
				post,
			});
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

exports.updatePost = (req, res, next) => {
	const postId = req.params.postId;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const error = new Error("Validation failed");
		error.statusCode = 422;
		throw error;
	}

	const title = req.body.title;
	const content = req.body.content;
	let imageUrl = req.body.image;

	if (req.file) {
		imageUrl = req.path.replace("\\", "/");
	}

	if (!imageUrl) {
		const error = new Error("No file picked");
		error.statusCode = 422;
		throw error;
	}
	Post.findById(postId)
		.then((post) => {
			if (!post) {
				const error = new Error("Not find post");
				error.statusCode = 404;
				throw error;
			}
			if (imageUrl !== post.imageUrl) {
				clearImage(post.imageUrl);
			}
			post.title = title;
			post.imageUrl = imageUrl;
			post.content = content;
			return post.save();
		})
		.then((result) => {
			res.status(200).json({ message: "post updated", post: result });
		})
		.catch((err) => {
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		});
};

const clearImage = (filePath) => {
	const fP = path.join(__dirname, "..", filePath);
	fs.unlink(fP, (err) => {
		console.log(err);
	});
};
