import path from 'path';

const OPTIONS_NOT_FOUND_ERROR = 'Options are missed';
const GULP_NOT_DEFINED_ERROR = 'Gulp is missed!';
const DIR_NOT_DEFINED_ERROR = 'Target directory is missed!';
const INVALID_MODULE_ERROR = 'Invalid task factory module';

/**
 * Validates and builds options.
 * @param params {Object} - Passed options.
 * @returns {Object} - Normalized options.
 */
export function getOptions(params) {
    if (!params) {
        throw new Error(OPTIONS_NOT_FOUND_ERROR);
    }

    if (!params.gulp) {
        throw new Error(GULP_NOT_DEFINED_ERROR);
    }

    if (!params.dir) {
        throw new Error(DIR_NOT_DEFINED_ERROR);
    }

    return {
        gulp: params.gulp,
        dir: params.dir,
        args: params.args || [],
        panic: !!params.panic,
        group: !!params.group,
        verbose: !!params.verbose
    };
}

/**
 * Returns task's factory function.
 * @param module {Any} - Target module.
 * @returns {Function} - Task's factory function.
 */
export function getFactory(module) {
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

/**
 * Creates task's path.
 * @param root {String} - Root directory.
 * @param current {String} - Current task's directory.
 * @returns {String} - Task's fpath.
 */
export function getPath(root, current) {
    const part = path.relative(root, current);

    if (part) {
        return part.split(/\/|\\/g).join(':');
    }

    return '';
}
