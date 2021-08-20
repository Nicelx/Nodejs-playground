const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
// 	User.findById("61116f85e4231a8d7318c375")
// 		.then((user) => {
// 			req.user = new User(user.name, user.email, user.cart, user._id);
// 			next();
// 		})
// 		.catch((e) => console.log(e));
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
	.connect(
		"mongodb+srv://Nicel:12345@node-complete.nsiof.mongodb.net/shop?retryWrites=true&w=majority"
	)
	.then((result) => {
		console.log("connected");
		app.listen(3000);
	})
	.catch((err) => console.log(err));
