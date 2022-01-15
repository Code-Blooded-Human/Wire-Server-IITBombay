const User = require("../models/user");

function authenticateUserMiddleware(req,res,next){
    
    var token = req.headers.authorization;
    if(token == undefined){
        res.send({error:"Token absent on authenticated route"},403);
    }
    User.findOne({token:token}).then((user)=>{
        if(user == undefined){
            res.send({error:"Token invalid"}, 403);
            return;
        }
        if(req.deviceFilters == undefined){
            req.deviceFilters = {};
        }
        if(req.userFilters == undefined){
            req.userFilters = {};
        }
        if(user.org != "axesdock"){
            req.deviceFilters.org = user.org;
            req.userFilters.org = user.org;
        }
        req.user = user;
        next();
    })
    
}

module.exports =authenticateUserMiddleware;