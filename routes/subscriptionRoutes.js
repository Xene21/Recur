const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Subscription = require('../models/subscriptions');
const path = require('path');

const auth = require('../middleware/authMiddleware'); // Middleware to protect routes

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

router.get('/subscriptions', async (req, res) => {
    try{
        const userId = req.user.id;
        const userSubscriptions = await Subscription.find({ userId }); // Fetch subscriptions for the logged-in user
        
        res.render('subscriptions', { subscriptions: userSubscriptions });
    } catch (error){
        console.error('Error fetching subscriptions:', error);
        res.status(500).send('An error occurred while loading the subscriptions.');

    }
});
router.get('/subscriptions/new', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'newSubscription.html'));
});

router.post('/subscriptions/new', async (req, res) => {
    try{
        const userId = req.user.id;
        const {service,price,cycle,category,renewalDate} = req.body;

        //console.log('Received subscription data:', { service, price, cycle, category, renewalDate });

        const newSubscription = await Subscription.create({
            providerName: service,
            amount: price,
            billingCycle: cycle,
            category: category,
            userId: userId,
            renewalDate: renewalDate
        });
        res.status(201).json(newSubscription);
    } catch (error) {
        console.error('Error creating subscription:', error);
        res.status(500).json({ message: 'Server error' });

    }
});
router.get('/subscriptions/:id', async (req, res) => {
    const subscriptionId = req.params.id;
    const userId = req.user.id;
    const subscription = await Subscription.findOne({ _id: subscriptionId, userId });
    if(!subscription){
        return res.status(404).json({ message: 'Subscription not found' });
    }
    res.render('details', { subscription });
});
router.delete('/subscriptions/:id', async (req, res) => {
    try{
        const userId = req.user.id;
        const subscriptionId = req.params.id;
        const subscription = await Subscription.findOne({ _id: subscriptionId, userId });
        if(!subscription){
            return res.status(404).json({ message: 'Subscription not found' });
        }
        await subscription.deleteOne();
        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error){
        console.error('Error deleting subscription:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;