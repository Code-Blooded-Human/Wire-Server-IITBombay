function whoami(req,res,next){
    var user = req.user;
    var u = {};
    u.name=user.name;
    u.email=user.email;
    u.org=user.org;
    u.username=user.username;
    res.send(u,200);
}

module.exports = whoami;