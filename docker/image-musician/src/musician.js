class Musician {

    instrument;
    playing;
    constructor(instrument) {
        this.instrument = instrument;
        this.startPlaying();
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
    }
}

module.exports = Musician;