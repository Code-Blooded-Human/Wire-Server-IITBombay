class WSConnectionManager{
    constructor(){
        this.connectedDevicesMac = [];
        this.macWSMapping  = {};
    }

    addConnection(mac,ws){
        console.log(mac,ws);
        if(this.connectedDevicesMac.indexOf(mac) == -1){
            this.connectedDevicesMac.push(mac);
        }
        this.macWSMapping[mac]=ws;
    }

    closeConnectionMac(mac){
        this.connectedDevicesMac = this.connectedDevicesMac.filter((m)=>m!=mac);
        this.macWSMapping[mac] = undefined;
    }
    closeConnectionWS(ws){
        var mac = this.getMac(ws);
        this.closeConnectionMac(mac);
    }

    getWS(mac){
        return this.macWSMapping[mac];
    }

    getMac(ws){
        for(var i in this.connectedDevicesMac){
            if(this.macWSMapping[this.connectedDevicesMac[i]] == ws){
                return this.connectedDevicesMac[i];
            }
        }
    }

    sendMsg(mac,msg){
        var ws = this.getWS(mac);
        if(ws == undefined){
            return false;
        }
        var serializeMsg = JSON.stringify(msg);
        ws.send(serializeMsg);
        return true;
    }

}

module.exports = WSConnectionManager;