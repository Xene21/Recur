const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({path: './variables.env'});

const auth = (req,res,next) => {
    
    const token = req.header('x-auth-token') || req.cookies.authToken;
    if (!token) {
    // If the request is looking for a web page, redirect them
    if (req.accepts('html')) {
        return res.redirect('/login');
    }
    // If it's a script/API request, send the JSON you wrote
    return res.status(401).json({ message: 'No token, authorization denied' });
}

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }
    catch(err){
        res.status(401).json({message: 'Token is not valid'});
    }
}

module.exports = auth;