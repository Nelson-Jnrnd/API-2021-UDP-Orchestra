class Musician {

    instrument;
    playing;
    constructor(instrument) {
        this.instrument = instrument;
        this.startPlaying();
    }
    startPlaying() {
        this.playing = setInterval(() => {
            console.log(this.instrument.sound);
        }, 1000);
    }
    stopPlaying() {
        clearInterval(this.playing);
    }
}

module.exports = Musician;