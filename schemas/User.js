const mongoose = require('mongoose');

const UserSchema= mongoose.Schema({
    name:{type: String},
    lastname:{type: String},
    email:{type:String},
    description:{type:String},
    password:{type:String},
    interests: [String],
    status:[String],
    images:[String],
    matches:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likesRecived:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', UserSchema);
module.exports=User;