const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		editing: false,
	});
};

exports.postAddProduct = (req, res) => {
	const { title, imageUrl, price, description } = req.body;
	Product.create({
		title: title,
		price: price,
		imageUrl: imageUrl,
		description: description,
	})
		.then(() => {
			res.redirect("/admin/products")
		})
		.catch((err) => console.err(err));
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/");
	}
	const prodId = req.params.productId;
	Product.findByPk(prodId).then((product) => {
		if (!product) {
			return res.redirect("/");
		}
		res.render("admin/edit-product", {
			pageTitle: "Edit Product",
			path: "/admin/edit-product",
			editing: editMode,
			product: product,
		}).catch((e) => console.log(e));
	});
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDesc = req.body.description;

	Product.findByPk(prodId)
		.then((product) => {
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.imageUrl = updatedImageUrl;
			product.description = updatedDesc;
			return product.save();
		})
		.then((result) => {
			console.log("Updated Product!");
			res.redirect("/admin/products");
		})
		.catch((e) => console.log(e));
};

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findByPk(prodId)
		.then((product) => {
			return product.destroy();
		})
		.then((result) => {
			console.log("destroyed");
			res.redirect("/admin/products");
		})
		.catch((e) => console.log(e));
};

exports.getProducts = (req, res, next) => {
	Product.findAll()
		.then((products) => {
			res.render("admin/products", {
				prods: products,
				pageTitle: "Admin Products",
				path: "/admin/products",
			});
		})
		.catch((e) => console.log(e));
	// Product.fetchAll((products) => {
	// 	res.render("admin/products", {
	// 		prods: products,
	// 		pageTitle: "Admin Products",
	// 		path: "/admin/products",
	// 	});
	// });
};
