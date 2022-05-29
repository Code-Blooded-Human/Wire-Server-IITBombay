const createDevice = require("../controllers/device/createDevice");
const fetchDevice = require("../controllers/device/fetchDevice");
const updateDevice = require("../controllers/device/updateDevice");
const Device = require("../models/device");
const log = require('log-to-file');



function handleWS(ws,wsConnections, expressWs){
    
    
    
    ws.on('message', (rawMsg)=>{
        var msg = JSON.parse(rawMsg);
        console.log("WS:" , msg);
        if(msg.type == "CONNECTION"){
            /*
            Expected msg structure:
                type : String =  CONNECTION
                mac : String
                org : String
                ports : [1,2]
            Example:
            {
                "type": "CONNECTION",
                "mac": "LOL",
                "ports": [
                    1,
                    2
                ],
                "org": "iitb"
            }
            */
            handleConnectionMessage(ws,msg,wsConnections); //async function
        }
    });

    ws.on('close',()=>{
        console.log("Connection Closed");
        console.log(expressWs.getWss().clients);
        handleConnectionClose(ws,wsConnections);
    })
}

async function handleConnectionMessage(ws,msg,wsConnections){
    console.log("Device connected")
    log("New device connected mac: "+msg.mac);
    wsConnections.addConnection(msg.mac,ws);
    var devices = await fetchDevice({mac:msg.mac});

    if(devices.length == 0)
    {
        if(!msg.ports){
            msg.ports = [1,2];
        }
        await createDevice(msg.mac,msg.org,msg.ports);
        console.log("Device Created");
    }
    await updateDevice({mac:msg.mac},{status:"ACTIVE",lastConnected:Date.now()})

    Device.findOne({mac:msg.mac}).then(device=>{
        if(!device){
            console.log("Failed to update the port status to OFF after reboot");
        }    
        for(portIndex in device.ports){
                device.ports[portIndex].status="OFF";
        }
        Device.findOneAndUpdate({mac:msg.mac},device).then(()=>{
            console.log("Updated device port status to OFF on boot")
        });
    });
}

async function handleConnectionClose(ws,wsConnections){
    console.log("Device disconnected");
    // console.log(ws.getWss().clients);
    var mac = wsConnections.getMac(ws);
    console.log("Device disconnected " + mac);
    log("Device disconnected " + mac);
    await updateDevice({mac:mac}, {status:"INACTIVE", lastDisconnected:Date.now()})
    wsConnections.closeConnectionWS(ws);
}

module.exports = handleWS;  