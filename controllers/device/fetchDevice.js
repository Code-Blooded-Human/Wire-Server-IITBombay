Device = require("../../models/device");


async function fetchDevice(filter={}){
    return new Promise((res,rej)=>{
        Device.find(filter)
            .then((data)=>{
                res(data);
            })
            .catch((err)=>{
                rej(err);
            })
    });
}

module.exports = fetchDevice;