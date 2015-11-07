import glob from 'glob';
import path from 'path';

const INVALID_MODULE_ERROR = 'Invalid task factory module';
const OPTIONS_NOT_FOUND_ERROR = 'Options are missed';
const GULP_NOT_DEFINED_ERROR = 'Gulp is missed!';
const DIR_NOT_DEFINED_ERROR = 'Target directory is missed!';

/**
 * Iterates over target directory and registers gulp tasks by invoking task factories.
 * Task name is based on its path.
 * @param options
 * @param options.gulp {Object} - Gulp instance.
 * @param options.dir {string} - Full path to task factories directory.
 * @param options.args {Array<any>} - Arguments to pass to task factories. Optional.
 * @param options.verbose {boolean} - Defines whether to push to console logs. Optional. Default false.
 * @param options.panic {boolean} - Defines whether to throw error if task registration failed. Optional. Default true.
 */
export default function(options) {
    if (!options) {
        throw new Error(OPTIONS_NOT_FOUND_ERROR);
    }

    if (!options.gulp) {
        throw new Error(GULP_NOT_DEFINED_ERROR);
    }

    if (!options.dir) {
        throw new Error(DIR_NOT_DEFINED_ERROR);
    }

    if (!options.args) {
        options.args = [];
    }

    if (typeof options.panic !== 'boolean') {
        options.panic = true;
    }

    function info(...args) {
        if (options.verbose) {
            console.info(...args);
        }
    }

    function error(...args) {
        if (options.verbose) {
            console.error(...args);
        }
    }

    function getFactory(module) {
        if (!module) {
            throw new Error(INVALID_MODULE_ERROR);
        }

        if (typeof module === 'function') {
            return module;
        }

        if (typeof module.default === 'function') {
            return module.default;
        }

        throw new Error(INVALID_MODULE_ERROR);
    }

    function getPath(dirname) {
        const part = path.relative(options.dir, dirname);

        if (part) {
            return part.split('/').join(':');
        }

        return '';
    }

    glob.sync(path.join(options.dir, '/**/*.js')).forEach(function onForEach(file) {
        let taskFullName = '';

        try {
            const taskName = path.basename(file, '.js');
            const taskPath = getPath(path.dirname(file));
            const factory = getFactory(require(file));

            if (taskPath) {
                taskFullName = `${taskPath}:${taskName}`;
            } else {
                taskFullName = taskName;
            }

            options.gulp.task(taskFullName, factory(...options.args));

            info('Registered task:', taskFullName);
        } catch (ex) {
            error(`Error during '${taskFullName}' task registration.`, ex.toString());

            if (options.panic) {
                throw ex;
            }
        }
    });
}
