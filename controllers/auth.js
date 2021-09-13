const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
// const sendgridTransport = require('nodemailer-sendgrid-transport');

let transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	auth: {
		user: "nicelmailfordev@gmail.com",
		pass: "testsNeverEnds",
	},
});

const User = require("../models/user");

// const transporter = nodemailer.createTransport(sendgridTransport({
// 	auth : {
// 		api_user : 'key',
// 	}
// }));

exports.getLogin = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login",
		errorMessage: message,
	});
	transporter.sendMail({
		to: "nicezero321@gmail.com",
		from: "nicelmailfordev@gmail.com",
		subject: "Test email",
		html: "<h1>you signed up</h1>",
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/signup", {
		path: "/signup",
		pageTitle: "Signup",
		errorMessage: message,
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email })
		.then((user) => {
			if (!user) {
				req.flash("error", "Invalid email or password");
				return res.redirect("/login");
			}
			bcrypt
				.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save((err) => {
							console.log(err);
							res.redirect("/");
						});
					}
					req.flash("error", "Invalid email or password");
					res.redirect("/login");
				})
				.catch((err) => {
					console.log(err);
					res.redirect("/");
				});
		})
		.catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	User.findOne({ email: email })
		.then((userDoc) => {
			if (userDoc) {
				req.flash("error", "email exists already");
				return res.redirect("/signup");
			}
			return bcrypt
				.hash(password, 12)
				.then((hashedPassword) => {
					const user = new User({
						email,
						password: hashedPassword,
						cart: { items: [] },
					});
					return user.save();
				})
				.then(() => {
					res.redirect("/login");
					// return transporter.sendMail({
					// 	to : email,
					// 	from : 'shop@node-complete.com',
					// 	subject: 'Sugnup Succeded!',
					// 	html : '<h1>you signed up</h1>'
					// });
				});
			// .catch(err => {
			// 	console.log(err);
			// })
		})

		.catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect("/");
	});
};
