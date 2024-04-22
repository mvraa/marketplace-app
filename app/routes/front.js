const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const path = require('path');
var fs = require('fs');

// multer - image middleware
var multer = require('multer');
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});
var upload = multer({ storage: storage });

// Home page route
router.get('/', async (req, res) => {
    const products = await Product.find()

    res.render("market", { // <- this label must match the ejs filename
        products: (Object.keys(products).length > 0 ? products.sort((a, b) => b.created_at - a.created_at) : {})
    });
});

// POST - Destroy Product
router.post('/product/destroy', async (req, res) => {
    // use req.body for POST requests
    const productKey = req.body._key;
    const err = await Product.findOneAndRemove({_id: productKey})
    res.redirect('/');
});

// GET - Product details
router.get('/details', async (req, res) => {
    // use req.query for GET requests
    const productKey = req.query._key;
    const product = await Product.findById(productKey)

    res.render("details", {
        product: product,
    });
});

// GET - Product details
router.get('/contact', async (req, res) => {
    res.render("contact");
});

// GET - Product details
router.get('/login', async (req, res) => {
    res.render("login");
});

// GET - Product details
router.get('/sell', async (req, res) => {
    res.render("sell");
});

// POST - Submit Product for sale
router.post('/sell', upload.single('image'), (req, res) => {
    var obj = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        image: {
            data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    Product.create(obj);

    res.redirect('/');
});


module.exports = router;