const express = require('express');
const path = require('path'); 
const app = express();
const connectDB = require('./config/db.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes.js');
const indexRoutes = require('./routes/indexRoutes.js');
const subscriptionRoutes = require('./routes/subscriptionRoutes.js');


connectDB();


// 1. Support JSON data
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Supporting EJS
app.set('view engine', 'ejs');

// Make req.path available to all views
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// 2. Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// 3. Mount your routes


app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', subscriptionRoutes);

// Exporting the app for Supertest
module.exports = app;



  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Recur Server is running on port ${port}`);
  });