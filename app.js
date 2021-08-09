const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const User = require('./models/user');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");
const mongoConnect = require('./util/database').mongoConnect;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
	User.findById('61116f85e4231a8d7318c375')
		.then((user) => {
			req.user = user;
			next();
		})
		.catch((e) => console.log(e));
	next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
	app.listen(3000);	
	// const newUser = new User('Nicel', 'mail.ru');
	// newUser.save().then(result => {
	// 	console.log('Saved')
	// });

	// User.findById('61116f85e4231a8d7318c375').then(result => {
	// 	console.log('finded')
	// 	console.log(result)
	// })
})