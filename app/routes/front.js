const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Home page route
router.get('/', async (req, res) => {

    const todos = await Product.find()
    res.render("todos", {
        tasks: (Object.keys(todos).length > 0 ? todos : {})
    });
});

// POST - Submit Task
router.post('/', (req, res) => {
    const newTask = new Product({
        task: req.body.task
    });

    newTask.save()
    .then(task => res.redirect('/'))
    .catch(err => console.log(err));
});

// POST - Destroy todo item
router.post('/todo/destroy', async (req, res) => {
    const taskKey = req.body._key;
    const err = await Product.findOneAndRemove({_id: taskKey})
    res.redirect('/');
});


module.exports = router;