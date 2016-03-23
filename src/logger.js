import gutil from 'gulp-util';

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
        this._verbose = verbose;
    }

    error(...args) {
        if (this._verbose) {
            gutil.log(...args);
        }
    }

    warn(...args) {
        if (this._verbose) {
            gutil.log(...args);
        }
    }

    info(...args) {
        if (this._verbose) {
            gutil.log(...args);
        }
    }
}

export default {
    create(...args) {
        return new Logger(...args);
    },

    colors: gutil.colors
};
