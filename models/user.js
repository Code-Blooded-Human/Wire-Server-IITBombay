const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const UserSchema = new Schema({
    username: {
        type: String,
    },
    name:{
        type:String,
    },
    password:{
        type: String,
    },
    email:String,
    token:String,
    org:String,
});


const User = mongoose.model('user',UserSchema);

module.exports = User;