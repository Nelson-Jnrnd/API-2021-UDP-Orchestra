var udp = require('dgram');

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
        })
    }

    addMusician(id){
        if(this.musicians_heard){

        }
    }

}

module.exports = Auditor;