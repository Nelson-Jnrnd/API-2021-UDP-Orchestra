let udp = require('dgram');
const { v4: uuidv4} = require('uuid');
const instruments = require('./instruments.js');

/**
 * simulates someone who plays an instrument in an orchestra.
 * When the app is started, it is assigned an instrument. 
 * As long as it is running, every second it will emit a sound depending on the instrument
 */
class Musician {

    #instrument;
    #id = uuidv4();
    #intervalBetweenNotes;
    #address;
    #port;
    #musicianSocket = udp.createSocket('udp4');
    #playing;
    /**
     * @param  {string} address address where the udp packages will be sent
     * @param  {number} port port where the upd packages will be sent
     * @param  {number} intervalBetweenNotes interval at which the packages are sent
     * @param  {string} instrument name of the instrument to play
     */
    constructor(address, port, intervalBetweenNotes, instrument) {
        // Validate instrument argument
        if(!instruments.has(instrument)){
            console.log("\nError the musician can't play " + instrument);
            process.exit(0);
        }

        this.#instrument = instrument;
        this.#port = port;
        this.#address = address;
        this.#intervalBetweenNotes = intervalBetweenNotes;

        this.#startPlaying();
    }
    /**
     * start playing music at the speed specified in this.intervalBetweenNotes
     */
    #startPlaying() {
        this.#playing = setInterval(this.#play.bind(this), this.#intervalBetweenNotes);
    }
    /**
     * stop playing music
     */
    #stopPlaying() {
        clearInterval(this.#playing);
    }
    /**
     * Send a UDP package at the multicast address in property
     */
    #play() {
        let sound = instruments.get(this.#instrument);
        let data = JSON.stringify({
            uuid : this.#id,
            sound: sound});
        this.#musicianSocket.send(data, 0, data.length, this.#port, this.#address);
        console.log("sent", sound, "at address", this.#address, "on port", this.#port);
    }
}

module.exports = Musician;