const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login",
		isAuthenticated: req.session.user ? true : false,
	});
};

exports.postLogin = (req, res, next) => {

	User.findById("612292d82442e71f6c0fa15f")
		.then((user) => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save(err => {
				res.redirect('/')
			})
		})
		.catch((e) => console.log(e));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/')
	});
};

