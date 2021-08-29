const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require('./routes/auth')

const errorController = require("./controllers/error");
const MONGODB_URI = "mongodb+srv://Nicel:12345@node-complete.nsiof.mongodb.net/shop"

const app = express();
const store = new MongoDBStore({
	uri : MONGODB_URI,
	collection : 'sessions'
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
	secret : 'my secret', 
	resave: false,
	saveUninitialized : false,
	store : store,
}));


app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
	.connect(
		MONGODB_URI
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
