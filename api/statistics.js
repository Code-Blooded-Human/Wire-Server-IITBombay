const express = require("express");
const Device = require("../models/device");
const User = require("../models/user");
let router = express.Router();


router.route("/").get((req,res)=>{
    Device.find(req.deviceFilters).then((devices)=>{
        var totalDevices = devices.length;
        var activeDevices = 0;
        var inactiveDevices = 0;
        var unregisteredDevices = 0;
        for(i in devices){
            if(!devices[i].isRegistered){
                unregisteredDevices++;
            }
            if(devices[i].status.toUpperCase() == 'ACTIVE'){
                activeDevices++;
            }else{
                inactiveDevices++;
            }
        }
        res.send({totalDevices,activeDevices,inactiveDevices,unregisteredDevices});
    })
});



module.exports=router;