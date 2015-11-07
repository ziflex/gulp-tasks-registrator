import chai from 'chai';
import registrator from '../../index';

const expect = chai.expect;

describe('validation', () => {
    context('invalid options', () => {
        context('missed all options', () => {
            it('should throw an error', () => {
                function undefinedOptions() {
                    registrator();
                }

                function emptyObject() {
                    registrator({});
                }

                expect(undefinedOptions).to.throw();
                expect(emptyObject).to.throw();
            });
        });

        context('missed gulp', () => {
            it('should throw an error', () => {
                function gulpNull() {
                    registrator({ gulp: null });
                }

                expect(gulpNull).to.throw();
            });
        });

        context('missed dir', () => {
            it('should throw an error', () => {
                function dirNull() {
                    registrator({ gulp: {}, dir: null });
                }

                function dirEmptyString() {
                    registrator({ gulp: {}, dir: null });
                }

                expect(dirNull).to.throw();
                expect(dirEmptyString).to.throw();
            });
        });
    });
});
