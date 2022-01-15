const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const DeviceSchema = new Schema({
    name: {
        type: String,
    },
    mac:{
        type:String,
    },
    installAddress:{
        type:String,
    },
    ports:{
        type:[{
        id:Number,
        comment:String,
        status:String
        }],
        default:[{id:1,comment:"No comment",status:"OFF"},{id:2,comment:"No comment", status:"OFF"}]
    },
    status:String,
    isRegistered:Boolean,
    lastConnected: Date,
    lastDisconnected: Date,
    comment:String,
    org:String,
});


const Device = mongoose.model('device',DeviceSchema);

module.exports = Device;