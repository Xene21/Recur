const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Subscription = require('../models/Subscriptions');

const auth = require('../middleware/authMiddleware.js'); // Middleware to protect routes

// Apply authentication middleware to all routes in this router
router.use(auth);

router.get('/dashboard', async (req, res) => {
    try{
    const userId = req.user.id;
    const authenticatedUser = await User.findById(userId); // 
    const userSubscriptions = await Subscription.find({ userId }); // Fetch subscriptions for the logged-in user

    res.render('dashboard', { user: authenticatedUser, subscriptions: userSubscriptions });
    } catch (error){
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('An error occurred while loading the dashboard.');
    }
    });

module.exports = router;