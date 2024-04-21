const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Home page route
router.get('/', async (req, res) => {

    const products = await Product.find()
    res.render("products", { // <- this label must match the ejs filename
        tasks: (Object.keys(products).length > 0 ? products : {})
    });
});

// POST - Submit Task
router.post('/', (req, res) => {
    const newTask = new Product({
        name: req.body.name
    });

    newTask.save()
    .then(name => res.redirect('/'))
    .catch(err => console.log(err));
});

// POST - Destroy todo item
router.post('/todo/destroy', async (req, res) => {
    const taskKey = req.body._key;
    const err = await Product.findOneAndRemove({_id: taskKey})
    res.redirect('/');
});


module.exports = router;