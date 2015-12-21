/**
* Represents a logger.
*/
export default class Logger {
    /**
     * Creates a logger.
     * @param verbose {Boolean} - Define whether it should write logs to output stream.
     * @returns {Object} - Logger.
     */
    constructor(verbose = true) {
        this._verbose = verbose;
    }

    error(...args) {
        if (this._verbose) {
            console.error(...args);
        }
    }

    warn(...args) {
        if (this._verbose) {
            console.warn(...args);
        }
    }

    info(...args) {
        if (this._verbose) {
            console.info(...args);
        }
    }
}
