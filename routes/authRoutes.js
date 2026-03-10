const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path: './variables.env'});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.post('/login', async (req, res) => {
    try{
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }
        const user = await User.findOne({username}).select('+password');
        console.log(user);
        if(!user){
            return res.status(400).json({message:'Invalid Credentials'});
        }

        
        const isMatch = await user.comparePassword(password);
        

        if(!isMatch){
            return res.status(400).json({message:'Invalid Credentials'});
        }

        const payload = {
            user: {
                id: user._id,
                username: user.username,
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
        });
        
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
   
});

router.post('/register', async (req, res) => {
    try{
        const { fullName, email, password, username } = req.body;
        console.log('Received registration data:', { fullName, email, password, username });
        if (!fullName || !email || !password || !username) {
            return res.status(400).send('All fields are required');
        }
    
        const existingUser = await User.findOne({$or: [{ email }, { username }]});
        if (existingUser) {
            return res.status(400).send('Email or username already in use');
        }

        console.log('hi')
        const newUser = await User.create({ fullName, email, password, username });
        console.log(newUser);
        const payload = {
            user: {
                id: newUser._id,
                username: newUser.username
            }
        };
        
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    }
    catch(err){
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;