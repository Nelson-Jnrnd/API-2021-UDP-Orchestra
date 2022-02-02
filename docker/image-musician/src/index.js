const Musician = require('./musician.js');

var args = process.argv.slice(2);

let musician = new Musician(args);

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(0);
  });