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

	const product = new Product({
		title: title,
		imageUrl: imageUrl,
		price: price,
		description: description,
		userId: req.user._id,
	});
	product
		.save()
		.then(() => {
			res.redirect("/admin/products");
		})
		.catch((err) => console.err(err));
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/");
	}
	const prodId = req.params.productId;
	Product.findById(prodId).then((product) => {
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

	Product.findById(prodId)
		.then((product) => {
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDesc;
			product.imageUrl = updatedImageUrl;
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
	Product.findByIdAndDelete(prodId)
		.then(() => {
			console.log("destroyed");
			res.redirect("/admin/products");
		})
		.catch((e) => console.log(e));
};

exports.getProducts = (req, res, next) => {
	Product.find()
		// .select('title price -_id')
		// .populate('userId')
		.then((products) => {
			res.render("admin/products", {
				prods: products,
				pageTitle: "Admin Products",
				path: "/admin/products",
			});
		})
		.catch((e) => console.log(e));
};
