const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Post = require("../models/post");

module.exports = {
	createUser: async function ({ userInput }, req) {
		const errors = [];
		if (!validator.isEmail(userInput.email)) {
			errors.push({ message: "E-mail is invalid" });
		}
		if (
			validator.isEmpty(userInput.password) ||
			!validator.isLength(userInput.password, { min: 5 })
		) {
			error.push({ message: "password is short" });
		}
		if (errors.length > 0) {
			const error = new Error("invalid input");
			error.data = errors;
			error.code = 422;
			throw error;
		}
		const { email, password, name } = userInput;
		const existingUser = await User.findOne({ email: email });
		if (existingUser) {
			const error = new Error("User exists already");
			throw error;
		}
		const hashedPw = await bcrypt.hash(password, 12);
		const user = new User({
			email,
			name,
			password: hashedPw,
		});
		const createdUser = await user.save();
		return { ...createdUser._doc, _id: createdUser._id.toString() };
	},
	login: async function ({ email, password }) {
		const user = await User.findOne({ email: email });
		if (!user) {
			const error = new Error("User not found");
			error.code = 401;
			throw error;
		}
		const isEqual = await bcrypt.compare(password, user.password);
		if (!isEqual) {
			const error = new Error("Password is incorrect.");
			error.code = 401;
			throw error;
		}
		const token = jwt.sign(
			{
				userId: user._id.toString(),
				email: user.email,
			},
			"secret",
			{ expiresIn: "1h" }
		);
		return {
			token,
			userId: user._id.toString(),
		};
	},
	createPost: async function ({ postInput }, req) {
		if (!req.isAuth) {
			const error = new Error("Not authenticated!");
			error.code = 401;
			throw error;
		}
		const errors = [];
		const { title, content, imageUrl } = postInput;
		if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
			errors.push({
				message: "Title is invalid",
			});
		}

		if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
			errors.push({
				message: "Content is invalid",
			});
		}

		if (errors.length > 0) {
			const error = new Error("invalid input");
			error.data = errors;
			error.code = 422;
			throw error;
		}

		const user = await User.findById(req.userId);
		if (!user) {
			const error = new Error("invalid user");
			error.code = 401;
			throw error;
		}
		const post = new Post({ title, content, imageUrl, creator: user });
		const createdPost = await post.save();
		user.posts.push(createdPost)
		return {
			...createdPost._doc,
			_id: createdPost._id.toString(),
			createdAt: createdPost.createdAt.toISOString(),
			updatedAt: createdPost.updatedAt.toISOString(),
		};
	},
};
