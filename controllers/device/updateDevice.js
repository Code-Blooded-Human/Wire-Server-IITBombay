const Device = require("../../models/device")

async function updateDevice(query,data){
    return new Promise((res,rej)=>{
        Device.findOneAndUpdate(query,data).then((device)=>{
            res();
        }).catch((e)=>{
            rej(e);
        })
    });
}

module.exports = updateDevice;