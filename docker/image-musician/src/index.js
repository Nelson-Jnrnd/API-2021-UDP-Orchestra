const Musician = require('./musician.js');
const Instruments = require('./instruments.js');

var args = process.argv.slice(2);

console.log(args);
console.log(Object.keys(Instruments));
console.log(Instruments['PIANO'].name);

var chosenInstrument = Object.keys(Instruments).find(key => Instruments[key].name == args);
console.log(chosenInstrument);
if(!chosenInstrument){
  console.log("\nError the musician can't play " + args);
  process.exit(0);
}
console.log(Instruments[chosenInstrument]);
let musician = new Musician(Instruments[chosenInstrument]);

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(0);
  });