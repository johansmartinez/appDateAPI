const express = require('express');
const cors = require('cors');

//config api
const app= express();
const PORT= process.env.PORT || 3000;

//db
const connection = require('./db/connection');
connection();

// middlewares
app.use(express.json());
app.use(cors())

//routes
const user = require('./routes/user');
app.use('/user', user);

//init
app.listen(PORT, ()=>{
    console.log(`API Running on port: ${3000}`);
});