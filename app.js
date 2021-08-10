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
			console.log(user);
			req.user = user;
			next();
		})
		.catch((e) => console.log(e));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
	app.listen(3000);
})