const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const path = require('path');
var fs = require('fs');
const passport = require('passport');

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

    res.render('market', { // <- this label must match the ejs filename
        products: (Object.keys(products).length > 0 ? products.sort((a, b) => b.created_at - a.created_at) : {}),
        user: req.user
    });
});

// GET - Product details
router.get('/details', async (req, res) => {
    // use req.query for GET requests
    const productKey = req.query._key;
    const product = await Product.findById(productKey)

    res.render('details', {
        product: product,
        user: req.user
    });
});

// GET - Product details
router.get('/contact', async (req, res) => {
    res.render('contact', {
        user: req.user
    });
});

// GET - Product details
router.get('/sell', isLoggedIn, (req, res) => {
    res.render('sell', {
        user: req.user
    });
});

// GET - Product details
router.get('/login', async (req, res) => {
    res.render('login', {
        user: req.user
    });
});

router.get('/user', isLoggedIn, (req, res) => {
    res.render('user', {
        user: req.user
    });
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
        },
        sellerId: req.user.id,
        sellerName: req.user.displayName
    }

    Product.create(obj);

    res.redirect('/');
});

// POST - Destroy Product
router.post('/product/destroy', async (req, res) => {
    // use req.body for POST requests
    const productKey = req.body._key;
    const err = await Product.findOneAndRemove({_id: productKey})
    res.redirect('/');
});

//////////////////LOGIN////////////////////

function isLoggedIn(req, res, next){
    req.user ? next() : res.sendStatus(401);
}

router.get('/auth/google', 
    passport.authenticate('google', {
        scope: ['email', 'profile']
    })
);

router.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/auth/failure'
    })
);

router.get('/auth/failure', (req, res) => {
    res.send("Something went wrong!")
})

router.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}`);
});

router.get('/logout', (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
        res.redirect("/");
    });
});


module.exports = router;