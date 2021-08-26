const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require('./routes/auth')

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
	User.findById("612292d82442e71f6c0fa15f")
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((e) => console.log(e));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
	.connect(
		"mongodb+srv://Nicel:12345@node-complete.nsiof.mongodb.net/shop?retryWrites=true&w=majority"
	)
	.then((result) => {
		User.findOne().then((user) => {
			if (!user) {
				const user = new User({
					name: "Nikolay",
					email: "some@mail.ru",
					cart: {
						items: [],
					},
				});
				user.save();
			}
		});
		app.listen(3000);
	})
	.catch((err) => console.log(err));
