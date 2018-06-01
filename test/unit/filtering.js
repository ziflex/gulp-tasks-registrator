/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import path from 'path';
import registrator from '../../src/index';
import GulpMock from '../mock/gulp';

describe('filtering', () => {
    let gulp = null;

    beforeEach(() => {
        gulp = new GulpMock();
    });

    describe('by regexp expression', () => {
        it('it should filter out tasks', () => {
            registrator({
                gulp,
                dir: path.join(__dirname, '../fixtures/nesting'),
                panic: true,
                verbose: false,
                filter: 'task-1'
            });

            expect(gulp.getTasks().length).to.eql(3);
        });
    });

    describe('by function', () => {
        it('it should filter out tasks', () => {
            const reg = new RegExp('/1/task-1');
            registrator({
                gulp,
                dir: path.join(__dirname, '../fixtures/nesting'),
                panic: true,
                verbose: false,
                filter: i => reg.test(i)
            });

            expect(gulp.getTasks().length).to.eql(1);
        });
    });
});
/* eslint-enable no-unused-expressions */
