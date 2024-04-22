const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Home page route
router.get('/', async (req, res) => {
    const products = await Product.find()

    res.render("market", { // <- this label must match the ejs filename
        products: (Object.keys(products).length > 0 ? products.sort((a, b) => b.created_at - a.created_at) : {})
    });
});

// POST - Submit Product for sale
router.post('/', (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    });

    newProduct.save()
    .then(name => res.redirect('/'))
    .catch(err => console.log(err));
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


module.exports = router;