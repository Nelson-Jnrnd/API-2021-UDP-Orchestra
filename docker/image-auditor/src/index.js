const Auditor = require('./auditor.js');
const runTCPServer = require('./TCPServer');

let auditor = new Auditor('239.255.22.5', 9907, 5000);
runTCPServer(2205, auditor.getMusicians.bind(auditor));

// allows to stop the process by hitting CTRL+C when run with Docker in foreground mode
process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(0);
});
