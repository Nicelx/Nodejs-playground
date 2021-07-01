const express = require('express');
const path = require('path');

const router = express.Router();

const users = [];

router.get('/', (req,res,next) => {
	res.render('index', {title: 'home'});
	console.log('yay')
})
router.get('/users', (req,res,next) => {
	res.render('users', {title: 'users'})
})

router.post('/add-user' , (req,res) => {
	users.push('123456');
	console.log('222')
	res.redirect("/");
})



module.exports = router;




// const routes = (req, res) => {
	// 	const { url, method } = req;
	
	// 	if (url === "/") {
	// 		const greetingHtml = `
	// 			<h1>hello there</h1>
	// 			<form action ="/create-user" method = "POST">
	// 				<input name = "username">
	// 				<button>go</button>
	// 				<div>${mockData.join('')}
	// 			</form>
	// 			`;
	// 		res.write(makeTemplate(greetingHtml));
	// 		return res.end();
	// 	}
	
	// 	if (url === "/create-user" && method === "POST") {
	// 		console.log("got here");
	// 		const data = [];
	
	// 		req.on("data", (chunk) => {
	// 			data.push(chunk);
	// 		});
	// 		req.on("end", () => {
	// 			const text = Buffer.concat(data).toString();
	// 			console.log(text);
	// 			res.statusCode = 302;
	// 			res.setHeader("Location", "/");
	// 			console.log(mockData);
	// 			mockData.push({
	// 				name : text,
	// 			})
	// 			return res.end();
	// 		});
	// 	}
	// };
	
	