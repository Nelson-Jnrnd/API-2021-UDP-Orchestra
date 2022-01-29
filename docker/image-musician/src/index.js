const Musician = require('./musician.js');
const Instruments = require('./instruments.js');
var udp = require('dgram');

var musician_socket = udp.createSocket('udp4');

var args = process.argv.slice(2);

console.log(args);
console.log(Instruments.DRUM);
let musician = new Musician(Instruments.DRUM);

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(0);
  });