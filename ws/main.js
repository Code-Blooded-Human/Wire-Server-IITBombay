const createDevice = require("../controllers/device/createDevice");
const fetchDevice = require("../controllers/device/fetchDevice");
const updateDevice = require("../controllers/device/updateDevice");


function handleWS(ws,wsConnections){
    
    ws.on('message', (rawMsg)=>{
        var msg = JSON.parse(rawMsg);
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
        handleConnectionClose(ws,wsConnections);
    })
}

async function handleConnectionMessage(ws,msg,wsConnections){
    wsConnections.addConnection(msg.mac,ws);
    var devices = await fetchDevice({mac:msg.mac});

    if(devices.length == 0)
    {
        await createDevice(msg.mac,msg.org,msg.ports);
        console.log("Device Created");
    }
    await updateDevice({mac:msg.mac},{status:"ACTIVE",lastConnected:Date.now()})
}

async function handleConnectionClose(ws,wsConnections){
    mac = wsConnections.getMac(ws);
    await updateDevice({mac:mac}, {status:"INACTIVE", lastDisconnected:Date.now()})
    wsConnections.closeConnectionWS(ws);
}

module.exports = handleWS;