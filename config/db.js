const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const connectDB = async () => {
    //If the connection string is not defined, log an error and exit the process
    if(!process.env.DATABASE_URL){
        console.error('DATABASE_URL is not defined in environment variables');
        process.exit(1);
    }

    try{
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoDB Connected');
    }
    catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;