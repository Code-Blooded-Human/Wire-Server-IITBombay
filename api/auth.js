const crypto = require('crypto');
const express = require("express");
const User = require("../models/user");
let router = express.Router();


router.route("/login").post((req,res)=>{
    const {username, password} = req.body;
    console.log(req.body);
    User.findOne({username:username}).then((user)=>{
        if(user == undefined){
            res.send({error:"User not found"},200);
            return;
        }
        if(user.password != password){
            res.send({error:"Wrong password"},200);
            return;
        }
        var token = crypto.randomBytes(64).toString('hex');
        User.updateOne({username:username},{token:token}).then(()=>{})
        res.send({error:"", token:token})        
    });
});


module.exports=router;