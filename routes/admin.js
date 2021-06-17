const express = require('express');

const router = express.Router();


router.get('/add-product', (req,res,next) => {
	res.send(
		`<form action = '/product' method = 'POST'>
			<input type = 'text' name = 'title'>
			<button type = 'submit'>add product</button>
			</form>`)
		})
		
// router.use('/product', (req, res) => {  // we can specify methods in routes
// app.use('/product', (req, res) => {  // we can specify methods in routes
router.post('/product', (req, res) => {
	console.log(req.body);
	res.redirect('/')
})

module.exports = router;