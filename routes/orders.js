const {Router} = require('express');
const Order = require ('../models/order');
const router = Router ();

router.get('/', async (req, res) => {
    res.render('orders', {
        isOrder: true, 
        title: 'Orders'
    })
});

riuter.post('/', async (req,res) => {
    res.redirect('/orders');
});

module.exports = router;