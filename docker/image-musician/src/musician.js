var udp = require('dgram');
const { v4: uuidv4} = require('uuid');

class Musician {

    instrument;
    playing;
    musician_socket;
    id;
    constructor(instrument) {
        this.musician_socket = udp.createSocket('udp4');
        this.instrument = instrument;
        this.startPlaying();
        this.id = uuidv4();
    }
    startPlaying() {
        this.playing = setInterval(() => {
            this.play()
        }, 1000);
    }
    stopPlaying() {
        clearInterval(this.playing);
    }
    play() {
        console.log(this.instrument.sound);
        var data = JSON.stringify({
            id : this.id,
            sound : this.instrument.sound});
        this.musician_socket.send(data, 0, data.length, 2205, '230.185.192.108', function(err, byte) {
            console.log("sending music");
        });
    }
}

module.exports = Musician;