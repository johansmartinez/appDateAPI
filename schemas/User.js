const mongoose = require('mongoose');

const UserSchema= mongoose.Schema({
    name:{type: String},
    lastname:{type: String},
    email:{type:String},
    description:{type:String},
    password:{type:String},
    interests: [String],
    images:[String]
});

const User = mongoose.model('User', UserSchema);
module.exports=User;