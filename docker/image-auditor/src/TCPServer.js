const net = require("net");

/**
 * Runs a TCP server that provides json formatted information about musicians
 * @param port port that the server listens to
 * @param getMusicians function that returns active musicians information
 */
function runTCPServer(port, getMusicians) {
    let TCPServer = net.createServer();

    TCPServer.on('listening', () => {
        console.log('Waiting for TCP connections on port ' + port);
    })

    TCPServer.on("connection", ((socket) => {
        socket.write(JSON.stringify(getMusicians()));
        socket.end();
    }))

    TCPServer.listen(port);
}

module.exports = runTCPServer;