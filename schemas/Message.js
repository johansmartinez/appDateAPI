const mongoose = require('mongoose');

const Message= mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text:{type: String},
    respond:{type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
});

module.exports=Message;