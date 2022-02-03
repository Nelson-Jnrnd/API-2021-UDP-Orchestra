const Musician = require('./musician.js');

const musicalInstrument = process.argv[2];
new Musician('239.255.22.5', 9907, 1000, musicalInstrument);

// allows to stop the process by hitting CTRL+C when run with Docker in foreground mode
process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(0);
  });