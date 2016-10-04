/* eslint-disable no-unused-expressions */
import chai from 'chai';
import spies from 'chai-spies';
import path from 'path';
import registrator from '../../src/index';
import GulpMock from '../mock/gulp';

chai.use(spies);
const expect = chai.expect;

function indexBy(arr, propName) {
    const result = {};

    arr.forEach((item) => {
        const propValue = item[propName];

        result[propValue.toString()] = item;
    });

    return result;
}

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

                const expectedTasks = [
                    {
                        name: 'task-1'
                    },
                    {
                        name: 'task-2'
                    }
                ];

                const tasks = indexBy(gulp.getTasks(), 'name');

                expectedTasks.forEach((expectedTask) => {
                    const task = tasks[expectedTask.name];
                    expect(task).to.exist;
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

                const expectedTasks = [
                    {
                        name: '1:task-1'
                    },
                    {
                        name: '1:task-2'
                    },
                    {
                        name: '1:2:task-1'
                    },
                    {
                        name: '1:2:task-2'
                    },
                    {
                        name: '1:2:3:task-1'
                    },
                    {
                        name: '1:2:3:task-2'
                    }
                ];

                const tasks = indexBy(gulp.getTasks(), 'name');

                expectedTasks.forEach((expectedTask) => {
                    const task = tasks[expectedTask.name];
                    expect(task).to.exist;
                });
            });
        });
    });

    describe('task arguments', () => {
        it('should pass multiple arguments to factory', () => {
            const arg1 = 'foo';
            const arg2 = { bar: 'qaz' };

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

    describe('groups', () => {
        it('should register task with dependencies of nested tasks', () => {
            registrator({
                gulp,
                dir: path.join(__dirname, '../fixtures/nesting'),
                panic: true,
                verbose: true,
                group: true
            });

            const expectedTasks = [
                {
                    name: '1',
                    dependencies: [
                        '1:2',
                        '1:task-1',
                        '1:task-2'
                    ]
                },
                {
                    name: '1:task-1'
                },
                {
                    name: '1:task-2'
                },
                {
                    name: '1:2',
                    dependencies: [
                        '1:2:3',
                        '1:2:task-1',
                        '1:2:task-2'
                    ]
                },
                {
                    name: '1:2:task-1'
                },
                {
                    name: '1:2:task-2'
                },
                {
                    name: '1:2:3',
                    dependencies: [
                        '1:2:3:task-1',
                        '1:2:3:task-2'
                    ]
                },
                {
                    name: '1:2:3:task-1'
                },
                {
                    name: '1:2:3:task-2'
                }
            ];

            const tasks = indexBy(gulp.getTasks(), 'name');

            expectedTasks.forEach((expectedTask) => {
                const task = tasks[expectedTask.name];
                expect(task, expectedTask.name).to.exist;

                if (expectedTask.dependencies) {
                    expect(task.dependencies).to.exist;
                    expect(task.dependencies).to.not.empty;
                    expect(task.dependencies.length).to.be.equal(expectedTask.dependencies.length);

                    expectedTask.dependencies.forEach((dep) => {
                        expect(task.dependencies).to.include(dep);
                    });
                }
            });
        });
    });

    describe('dependencies', () => {
        it('should register tasks with dependencies', () => {
            registrator({
                gulp,
                dir: path.join(__dirname, '../fixtures/with-deps/'),
                panic: true,
                verbose: true
            });

            const tasks = gulp.getTasks();
            const task = tasks.find(i => i.name === 'task-3');
            expect(task.dependencies).to.eql(['task-1', 'task-2']);
        });
    });
});
/* eslint-enable no-unused-expressions */
