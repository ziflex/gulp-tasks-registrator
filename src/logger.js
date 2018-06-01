import log from 'fancy-log';
import chalk from 'chalk';

/**
* Represents a logger.
*/
class Logger {
    /**
     * Creates a logger.
     * @param verbose {Boolean} - Define whether it should write logs to output stream.
     * @returns {Object} - Logger.
     */
    constructor(verbose = true) {
        this.verbose = verbose;
    }

    error(...args) {
        if (this.verbose) {
            log.error(...args);
        }
    }

    warn(...args) {
        if (this.verbose) {
            log.warn(...args);
        }
    }

    info(...args) {
        if (this.verbose) {
            log.info(...args);
        }
    }
}

export default {
    create(...args) {
        return new Logger(...args);
    },

    colors: chalk
};
