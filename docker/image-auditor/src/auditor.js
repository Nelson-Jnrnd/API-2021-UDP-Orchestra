var udp = require('dgram');
var Instruments = require('./instruments');

class Auditor {
    musicians_heard = {};
    udpServer;
    constructor(adress, port){
        this.udpServer = udp.createSocket('udp4');

        this.udpServer.bind(port, () => {
            this.udpServer.addMembership(adress);
        });
        
        this.udpServer.on('listening', () => {
            const addr = this.udpServer.address();
            console.log('Listening for UDP Datagrams on ' + addr.address + ' with port ' + addr.port);
        })

        this.udpServer.on('message', (msg) => {
            const message = JSON.parse(msg)
            console.log(message);
            this.addMusician(message.id, message.sound);
        })
    }

    addMusician(id, sound){
        var timeOfAddition = Date.now();
        var instrumentHeard = Object.keys(Instruments).find(key => Instruments[key].sound == sound);
        
        if(!instrumentHeard)
            instrumentHeard = 'unknown';

        if(this.musicians_heard[id]){
            this.musicians_heard[id].activeLast = timeOfAddition;
            this.instrument = instrumentHeard;
        } else{
            this.musicians_heard[id] = {
                "uuid" : id,
                "instrument" : instrumentHeard,
                "activeSince" : timeOfAddition,
                "activeLast" : timeOfAddition
            }
        }
        console.log(this.musicians_heard);
    }

}

module.exports = Auditor;