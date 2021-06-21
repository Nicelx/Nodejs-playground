const express = require("express");
const path = require('path');

const rootDir = require('../util/path');

const router = express.Router();

const products = [];

router.get("/add-product", (req, res, next) => {
	res.sendFile(path.join(rootDir, "views", "add-product.html"));
});
// router.use('/product', (req, res) => {  // we can specify methods in routes
// app.use('/product', (req, res) => {  // we can specify methods in routes
router.post("/add-product", (req, res) => {
	products.push({title: req.body.title})
	res.redirect("/");
});

exports.routes = router;
exports.products = products;