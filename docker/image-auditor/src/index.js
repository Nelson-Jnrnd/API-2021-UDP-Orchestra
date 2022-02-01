var udp = require('dgram');

const udpServer = udp.createSocket('udp4');

udpServer.bind(2205, () => {
    udpServer.addMembership('230.185.192.108');
});

udpServer.on('listening', () => {
    const addr = udpServer.address();
    console.log('Listening for UDP Datagrams on ' + addr.address + ' with port ' + addr.port);
})

udpServer.on('message', (msg) => {
    const message = JSON.parse(msg)
    console.log(message);
})

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(0);
  });