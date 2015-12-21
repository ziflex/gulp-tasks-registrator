import glob from 'glob';
import path from 'path';
import chalk from 'chalk';
import { getOptions, getFactory, getPath } from './utils';
import Logger from './logger';
import Group from './group';

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
export default function(params) {
    const options = getOptions(params);
    const logger = new Logger(options.verbose);
    const group = new Group(options.group);

    glob.sync(path.join(options.dir, '/**/*.js')).forEach(function onForEach(file) {
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

            options.gulp.task(taskFullName, factory(...options.args));
            group.push(taskFullName);

            logger.info(chalk.cyan(SUCESS_MESSAGE), chalk.magenta(taskFullName));
        } catch (err) {
            logger.error(chalk.red(FAILURE_MESSAGE), chalk.magenta(taskFullName), err.toString());

            if (options.panic) {
                throw err;
            }
        }
    });

    group.forEach((task) => {
        try {
            options.gulp.task(task.name, task.dependencies, done => done());
            logger.info(chalk.cyan(SUCESS_MESSAGE), chalk.magenta(task.name));
        } catch (err) {
            logger.error(chalk.red(FAILURE_MESSAGE), chalk.magenta(task.name), err.toString());

            if (options.panic) {
                throw err;
            }
        }
    });
}
