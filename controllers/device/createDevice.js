Device = require("../../models/device")


async function createDevice(mac,org,ports){
    return new Promise((res,rej)=>{
        var portsData = [];
        for (p in ports){
            portsData.push({id:ports[p], comment:"Comment not added yet", status:"OFF"})
        }
        Device.create({mac:mac, org:org, ports: portsData, isRegistered: false, status:'INACTIVE', name:mac, comment:"Device not registered", installAddress:"N/A"})
            .then((data)=>{res(data)})
            .catch((err)=>{rej(err)});
    })
}

module.exports=createDevice;