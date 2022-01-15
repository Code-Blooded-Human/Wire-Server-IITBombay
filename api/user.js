const express = require("express");
const User = require("../models/user");
let router = express.Router();

// /api/device

router.route("/").get((req,res)=>{
    // List all users;
});

router.route("/:username").get((req,res)=>{
    // Get details about an user;
});


module.exports=router;