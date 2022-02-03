const udp = require('dgram');
const instruments = require('./instruments');
const moment = require('moment');
const INTERVAL_CHECK_FOR_INACTIVE_MUSICIANS = 1000;

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
        this.#udpServer.on('listening', () => {
            console.log('Listening for UDP Datagrams on ' + address + ' with port ' + port);
        })
        this.#udpServer.on('message', (buffer) => {
            const jsonText = buffer.toString();
            console.log("received : ", jsonText);
            const message = JSON.parse(jsonText);
            this.#addMusician(message.uuid, message.sound);
        })
        this.#udpServer.bind(port, () => {
            this.#udpServer.addMembership(address);
        });

        setInterval(this.#removeInactiveMusicians.bind(this), INTERVAL_CHECK_FOR_INACTIVE_MUSICIANS);
    }

    /**
     * Adds or update a musician in the list of musicians we heard recently
     * @param  {string} id id of the musician to add/update
     * @param  {string} heardSound sound the musician made when we heard him
     */
    #addMusician(id, heardSound) {
        const timeOfAudition = moment();
        let heardInstrument;
        for (let [instrument, sound] of instruments.entries()) {
            if (heardSound === sound) {
                heardInstrument = instrument;
            }
        }
        if (heardInstrument === undefined) {
            console.log("Error unrecognized sound :", heardSound);
        } else {
            if (this.#musicians.has(id)) {
                // Update
                this.#musicians.get(id).activeLast = timeOfAudition;
            } else {
                // Add
                this.#musicians.set(id, {
                    "instrument": heardInstrument,
                    "activeSince": timeOfAudition,
                    "activeLast": timeOfAudition
                });
            }
        }


    }

    /**
     * Remove inactive musicians from the list of musicians we heard recently
     */
    #removeInactiveMusicians() {
        for (const [id, musician] of this.#musicians.entries()) {
            if (Date.now() - musician.activeLast > this.#timeBeforeForgetting) {
                this.#musicians.delete(id);
            }
        }
    }

    /**
     * Returns information about the active musicians
     */
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