const mongoose = require('mongoose');
const {url,dbName} = require('../keys/dbkey');

const connectDB = async () => {
    await mongoose.connect(url, { 
        useUnifiedTopology: true, 
        useNewUrlParser: true ,
        dbName
    });
}

module.exports = connectDB;