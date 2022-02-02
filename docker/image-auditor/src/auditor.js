const udp = require('dgram');
const Instruments = require('./instruments');
const moment = require('moment');
const timeCheckForInactiveMusician = 1000;

/**
 * Simulates someone who listens to the orchestra.
 * Keep tracks of active musician (if it played a sound during the last 5 seconds) and provides a list of those
 * musicicans via a JSON payload sent after a TCP connection on port 2205
 */
class Auditor {
    /**
     * List of musicians we remember hearing
     */
    #musicians = new Map();
    #udpServer = udp.createSocket('udp4');
    #timeBeforeForgetting;

    /**
     * @param  {string} address multicast address were we listen to the musicians
     * @param  {number} port port were we listen to the musicians
     * @param  {number} timeBeforeForgetting time it takes before a musician is considered inactive
     */
    constructor(address, port, timeBeforeForgetting) {
        this.#timeBeforeForgetting = timeBeforeForgetting;

        // Create udp server...
        this.#udpServer.bind(port, () => {
            this.#udpServer.addMembership(address);
        });
        this.#udpServer.on('listening', () => {
            const addr = this.#udpServer.address();
            console.log('Listening for UDP Datagrams on ' + addr.address + ' with port ' + addr.port);
        })
        this.#udpServer.on('message', (msg) => {
            const message = JSON.parse(msg);
            this.#addMusician(message.id, message.sound);
        })

        setInterval(this.#removeInactiveMusicians.bind(this), timeCheckForInactiveMusician);
    }

    /**
     * Adds or update a musician in the list of musicians we heard recently
     * @param  {string} id id of the musician to add/update
     * @param  {string} sound sound the musician made when we heard him
     */
    #addMusician(id, sound) {
        const timeOfAudition = moment();
        let instrumentHeard = Object.keys(Instruments).find(key => Instruments[key].sound == sound);

        if (!instrumentHeard)
            instrumentHeard = 'unknown';

        if (this.#musicians.has(id)) {
            // Update
            this.#musicians.get(id).activeLast = timeOfAudition;
        } else {
            // Add
            this.#musicians.set(id, {
                "instrument": instrumentHeard,
                "activeSince": timeOfAudition,
                "activeLast": timeOfAudition
            });
        }

    }

    /**
     * Remove inactive musicians from the list of musicians we heard recently
     */
    #removeInactiveMusicians() {
        console.log(this.#musicians);
        for (const [id, musician] of this.#musicians.entries()) {
            if (Date.now() - musician.activeLast > this.#timeBeforeForgetting) {
                this.#musicians.delete(id);
            }
        }
    }

    getMusicians() {
        return Array.from(this.#musicians, ([uuid, musician]) =>
            ({
                uuid,
                instrument: musician.instrument,
                activeSince: musician.activeSince
            }));
    }

}

module.exports = Auditor;