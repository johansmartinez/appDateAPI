const mongoose = require('mongoose');
const Message = require('./Message');

const Chat=mongoose.Schema({
    destination:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messages:[Message]
});

const ChatsSchema= mongoose.Schema({
    user:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    chats:[Chat]
});

const Chats = mongoose.model('Chats', ChatsSchema);
module.exports=Chats;