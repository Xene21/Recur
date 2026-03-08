const express = require('express');
const router = express.Router();

router.get('/Dashboard', (req, res) => {
    res.render('Dashboard');
});

router.get('/Subscription/new', (req, res) => {
    res.render('Subscription/new');
});

router.post('/Subscription', (req, res) => {
    // Handle subscription creation logic here
    res.redirect('/Dashboard');
});

router.get('/Subscription/:id', (req, res) => {
    const subscriptionId = req.params.id;
    // Fetch subscription details using subscriptionId and render the view
    res.render('Subscription/show', { subscriptionId });
});

router.put('/Subscription/:id', (req, res) => {
    const subscriptionId = req.params.id;
}); // Handle subscription update logic here

router.delete('/Subscription/:id', (req, res) => {
    const subscriptionId = req.params.id;
    // Handle subscription deletion logic here
    res.redirect('/Dashboard');
});

module.exports = router;