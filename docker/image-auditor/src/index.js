let net = require('net');

const Auditor = require('./auditor.js');

let auditor = new Auditor('230.185.192.108', 2205, 5000);

let TCPServer = net.createServer();
TCPServer.on("connection", (function (socket) {
    socket.write(JSON.stringify(auditor.getMusicians()));
    socket.end();
}))

TCPServer.listen(2205)

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(0);
});
