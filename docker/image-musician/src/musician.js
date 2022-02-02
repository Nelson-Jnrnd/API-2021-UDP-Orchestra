var udp = require('dgram');
const { v4: uuidv4} = require('uuid');
const Instruments = require('./instruments.js');


class Musician {

    instrument;
    playing;
    musician_socket;
    id;
    address;
    port;
    intervalBetweenNotes;
    constructor(address, port, intervalBetweenNotes, instrument) {
        var chosenInstrument = Object.keys(Instruments).find(key => Instruments[key].name == instrument);

        if(!chosenInstrument){
            console.log("\nError the musician can't play " + instrument);
            process.exit(0);
        }


        this.instrument = Instruments[chosenInstrument];
        this.port = port;
        this.address = address;
        this.intervalBetweenNotes = intervalBetweenNotes;
        this.musician_socket = udp.createSocket('udp4');
        this.startPlaying();
        this.id = uuidv4();
    }
    startPlaying() {
        this.playing = setInterval(() => {
            this.play()
        }, this.intervalBetweenNotes);
    }
    stopPlaying() {
        clearInterval(this.playing);
    }
    play() {
        console.log(this.instrument.sound);
        var data = JSON.stringify({
            id : this.id,
            sound : this.instrument.sound});
        this.musician_socket.send(data, 0, data.length, this.port, this.address, function(err, byte) {
            console.log("sending music");
        });
    }
}

module.exports = Musician;