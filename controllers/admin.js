const { validationResult } = require("express-validator/check");
const Product = require("../models/product");
const fileHelper = require("../util/file");

exports.getAddProduct = (req, res, next) => {
	res.render("admin/edit-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		editing: false,
		hasError: false,
		errorMessage: null,
		validationErrors: [],
	});
};

exports.postAddProduct = (req, res, next) => {
	const { title, price, description } = req.body;
	const image = req.file;
	const errors = validationResult(req);

	if (!image) {
		return res.status(422).render("admin/edit-product", {
			pageTitle: "Add Product",
			path: "/admin/add-product",
			editing: false,
			hasError: true,
			product: { title, price, description },
			errorMessage: "Attached file is not an image",
			validationErrors: [],
		});
	}

	if (!errors.isEmpty()) {
		return res.status(422).render("admin/edit-product", {
			pageTitle: "Add Product",
			path: "/admin/add-product",
			editing: false,
			hasError: true,
			product: { title, imageUrl, price, description },
			// product: { title, price, description },
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	const imageUrl = image.path;

	const product = new Product({
		//  to remove!
		// _id: mongoose.Types.ObjectId("614a0e2e4012371384184a95"),
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
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/");
	}
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return res.redirect("/");
			}
			res.render("admin/edit-product", {
				pageTitle: "Edit Product",
				path: "/admin/edit-product",
				editing: editMode,
				product: product,
				hasError: false,
				errorMessage: null,
				validationErrors: [],
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const image = req.file;
	const updatedDesc = req.body.description;
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).render("admin/edit-product", {
			pageTitle: "Edit Product",
			path: "/admin/edit-product",
			editing: true,
			hasError: true,
			product: {
				title: updatedTitle,
				price: updatedPrice,
				description: updatedDesc,
				_id: prodId,
			},
			errorMessage: errors.array()[0].msg,
			validationErrors: errors.array(),
		});
	}

	Product.findById(prodId)
		.then((product) => {
			if (product.userId.toString() !== req.user._id.toString()) {
				return res.redirect("/");
			}
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDesc;
			if (image) {
				fileHelper.deleteFile(product.imageUrl);
				product.imageUrl = image.path;
			}
			return product.save().then((result) => {
				console.log("Updated Product!");
				res.redirect("/admin/products");
			});
		})

		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.deleteProduct = (req, res, next) => {
	const prodId = req.params.productId;

	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return next(new Error("Product not found"));
			}

			fileHelper.deleteFile(product.imageUrl);
			return Product.deleteOne({ _id: prodId, userId: req.user._id });
		})
		.then(() => {
			console.log("destroyed");
			res.status(200).json({ message: "success!" });
		})
		.catch((err) => {
			res.status(500).json({ message: "delete failed" });
		});
};

exports.getProducts = (req, res, next) => {
	Product.find({ userId: req.user._id })
		// .select('title price -_id')
		// .populate('userId')
		.then((products) => {
			res.render("admin/products", {
				prods: products,
				pageTitle: "Admin Products",
				path: "/admin/products",
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};
