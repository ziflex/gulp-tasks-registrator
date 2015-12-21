/* eslint-disable no-unused-expressions */
import chai from 'chai';
import path from 'path';
import registrator from '../../index';
import GulpMock from '../mock/gulp';

const expect = chai.expect;

describe('error handling', () => {
    context('panic=true', () => {
        it('should throw exception', () => {
            function invalidDir() {
                registrator({
                    gulp: new GulpMock(),
                    dir: path.join(__dirname, '../fixtures/invalid'),
                    panic: true
                });
            }

            expect(invalidDir).to.throw();
        });
    });

    context('panic=false', () => {
        it('should not throw exception', () => {
            function invalidDir() {
                registrator({
                    gulp: new GulpMock(),
                    dir: path.join(__dirname, '../fixtures/invalid'),
                    panic: false
                });
            }

            expect(invalidDir).to.not.throw();
        });
    });
});
/* eslint-enable no-unused-expressions */
