const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const expressHbs = require('express-handlebars');

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.engine('hbs', expressHbs());
// app.set('view engine', 'pug');
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
	// res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
	res.status(404).render('404', {pageTitle:'Page Not Found'});

})

app.listen(3000);

// const server = http.createServer(app);

// server.listen(3000);

// alternative

// allow add new middleware
// app.use((req,res,next) => {
// 	console.log('in the first middleware');
// 	next();
// })
