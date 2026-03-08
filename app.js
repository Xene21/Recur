const express = require('express');
const path = require('path'); // Essential for Render paths
const app = express();
const port = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes.js');
const indexRoutes = require('./routes/indexRoutes.js');

// 1. Support JSON data (for your login/register forms)
app.use(express.json());

// 2. THE FIX: Serve static files
// This allows your HTML to actually find the CSS/Icons in your 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// 3. Mount your routes
app.use('/', indexRoutes);
app.use('/', authRoutes);

app.listen(port, () => {
  console.log(`🚀 Recur Server is running on port ${port}`);
});