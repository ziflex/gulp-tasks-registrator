import chai from 'chai';
import spies from 'chai-spies';
import path from 'path';
import registrator from '../../index';
import GulpMock from '../mock/gulp';

chai.use(spies);
const expect = chai.expect;

describe('registration', () => {
    let gulp = null;

    beforeEach(() => {
        gulp = new GulpMock();
    });

    describe('task names', () => {
        context('without nesting', () => {
            it('it should create proper names', () => {
                registrator({
                    gulp,
                    dir: path.join(__dirname, '../fixtures/no-nesting'),
                    panic: true,
                    verbose: false
                });

                const expectedNames = {
                    'task-1': true,
                    'task-2': true
                };

                const tasks = gulp.getTasks();

                expect(tasks).to.not.empty;

                tasks.forEach((task) => {
                    expect(expectedNames[task.name]).to.exist;
                });
            });
        });

        context('nesting', () => {
            it('it should create proper names', () => {
                registrator({
                    gulp,
                    dir: path.join(__dirname, '../fixtures/nesting'),
                    panic: true,
                    verbose: false
                });

                const expectedNames = {
                    '1:task-1': true,
                    '1:task-2': true,
                    '1:2:task-1': true,
                    '1:2:task-2': true,
                    '1:2:3:task-1': true,
                    '1:2:3:task-2': true
                };

                const tasks = gulp.getTasks();

                expect(tasks).to.not.empty;

                tasks.forEach((task) => {
                    expect(expectedNames[task.name]).to.exist;
                });
            });
        });
    });

    describe('task arguments', () => {
        it('should pass multiple arguments to factory', () => {
            const arg1 = 'foo';
            const arg2 = {bar: 'qaz'};

            registrator({
                gulp,
                dir: path.join(__dirname, '../fixtures/arguments'),
                args: [arg1, arg2],
                panic: true,
                verbose: false
            });

            const tasks = gulp.getTasks();

            expect(tasks).to.not.empty;

            tasks.forEach((task) => {
                const args = task.func();

                expect(args.arg1).to.equal(arg1);
                expect(args.arg2).to.equal(arg2);
            });
        });
    });
});
