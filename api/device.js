const express = require("express");
const Device = require("../models/device");
const User = require("../models/user");

let router = express.Router();

// /api/device

router.route("/").get((req,res)=>{
    var deviceFilters = req.deviceFilters;
    Device.find(deviceFilters).then((devices)=>{
        res.send(devices,200);
    });
});

router.route("/:name").get((req,res)=>{
    // Get details about a device;
    var deviceFilters = req.deviceFilters;
    deviceFilters.name = req.params.name;
    Device.findOne(deviceFilters).then((device)=>{
        if(!device){
            res.send({error:"Device not found"},404);
        }
        var resData = device
        res.send(resData,200);
    });
});

router.route("/:name").post((req,res)=>{
    // Update details of a device with :name
    console.log("Here");
    // req.body.ports = JSON.parse(req.body.ports);
    Device.findOneAndUpdate({name: req.params.name},req.body).then(function(device){
        console.log(device);
        Device.findOne({_id: device._id}).then(function(device){
            res.send(device,200);
        });
    });
});

router.route("/:name/control/:port/:operation").post((req,res)=>{
    var {name, port, operation} = req.params;
    var wsConnections = req.wsConnections;
    Device.findOne({name:name}).then(device=>{
        if(!device){
            res.send({error:"Device not found"},200);
        }    
        var msg = {};
        msg.port = port;
        msg.operation = operation;
        msg.event = "CONTROL"
        wsConnections.sendMsg(device.mac,msg);
        for(portIndex in device.ports){
            if(device.ports[portIndex].id == parseInt(port)){
                device.ports[portIndex].status=operation;
            }
        }
        Device.findOneAndUpdate({name:name},device).then(()=>{});
        res.send(device,200);
    });
})


module.exports=router;