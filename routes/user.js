const express = require('express');
const Route = express.Router();
const {crypt,compare} = require('../crypt');

const User = require('../schemas/User');
const Chats = require('../schemas/Chats');

//singup
Route.post('/singup', async (req,res)=>{
    const {name, lastname, email, password, interests} =req.body;
    const u1=new User({name, lastname, email, password:await crypt(password), interests});
    try {
        u1.save((err,data)=>{
            if (err) {
                res.sendStatus(400).send('Error')
            }else {
                generateChats(data._id)
                res.json(data)
            }
        })
    } catch (error) {
        console.log('error sino')
    }
});

//login

//update

//get

async function generateChats(id) {
    let c1=new Chats({user:id});
    return c1.save((err,data)=>{
        if (err) return null;
        else return data
    });
}
module.exports=Route