import glob from 'glob';
import path from 'path';
import { getOptions, getFactory, getPath } from './utils';
import Logger from './logger';
import Group from './group';

const NOOP = function noop() {};
const SUCESS_MESSAGE = 'Registered task:';
const FAILURE_MESSAGE = 'Failed to register task:';

/**
 * Iterates over target directory and registers gulp tasks by invoking task factories.
 * Task name is based on its path.
 * @param params
 * @param params.gulp {Object} - Gulp instance.
 * @param params.dir {String} - Full path to task factories directory.
 * @param params.args {Array<any>} - Arguments to pass to task factories. optionsional.
 * @param params.verbose {Boolean} - Defines whether to push to console logs. optionsional. Default false.
 * @param params.panic {Boolean} - Defines whether to throw error if task registration failed. optionsional. Default true.
 * @param params.group {Boolean} - Defines whether to create gulp task based on folder name and add nested tasks as dependencies.
 */
module.exports = function registrator(params) {
    const options = getOptions(params);
    const logger = Logger.create(options.verbose);
    const group = Group(options.group);

    glob.sync(path.join(options.dir, '/**/*.js')).forEach((file) => {
        let taskFullName = '';

        try {
            const taskName = path.basename(file, '.js');
            const taskPath = getPath(options.dir, path.dirname(file));
            const factory = getFactory(require(file));

            if (taskPath) {
                taskFullName = `${taskPath}:${taskName}`;
            } else {
                taskFullName = taskName;
            }

            const task = factory(...options.args);

            options.gulp.task(taskFullName, task.dependencies || [], task);

            group.push(taskFullName);

            logger.info(SUCESS_MESSAGE, Logger.colors.cyan(taskFullName));
        } catch (err) {
            logger.error(FAILURE_MESSAGE, Logger.colors.cyan(taskFullName), err.toString());

            if (options.panic) {
                throw err;
            }
        }
    });

    group.forEach((task) => {
        try {
            options.gulp.task(task.name, task.dependencies, NOOP);
            logger.info(SUCESS_MESSAGE, Logger.colors.cyan(task.name));
        } catch (err) {
            logger.error(FAILURE_MESSAGE, Logger.colors.cyan(task.name), err.toString());

            if (options.panic) {
                throw err;
            }
        }
    });
};
