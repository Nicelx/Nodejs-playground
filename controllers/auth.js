const User = require('../models/user');

exports.getLogin = (req, res, next) => {
	// let isLoggedIn;
	// if (req.get("Cookie")) {
	// 	console.log(req.get("Cookie"));
	// 	isLoggedIn = req.get("Cookie").split(";")[0].trim().split("=")[1] === 'true';
	// } else {
	// 	isLoggedIn = false;
	// }
	console.log(req.session.isLoggedIn);
	
	res.render("auth/login", {
		path: "/login",
		pageTitle: "Login",
		// isAuthenticated: isLoggedIn,
		isAuthenticated: req.session.user ? true : false,
	});
};

exports.postLogin = (req, res, next) => {
	// res.setHeader("Set-Cookie", "loggedIn=true");
	User.findById("612292d82442e71f6c0fa15f")
		.then((user) => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			res.redirect("/");
		})
		.catch((e) => console.log(e));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		console.log(err);
		res.redirect('/')
	});
};

