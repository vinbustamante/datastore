
import 'reflect-metadata';
const expect = require('expect');
import IUtilService from '../../common/services/IUtilService';
import UtilService from '../../common/services/implementation/UtilService';

describe('UtilService', function() {    
    let _utilService: IUtilService;

    beforeEach(() => {
        _utilService = new UtilService();
    });

    describe('toJson', () => {
        it('should accept string and return', () => {
            const message = 'hello world';
            expect(_utilService.toJson(message)).toBe(message);
        });

        it('should accept number and return', () => {
            const message = 123;
            expect(_utilService.toJson(message)).toBe(message);
        });

        it('should accept boolean and return', () => {
            const message = true;
            expect(_utilService.toJson(message)).toBe(message);
        });

        it('should accept null and return', () => {
            const message = null;
            expect(_utilService.toJson(message)).toBe(message);
        });

        it('should accept undefined and return', () => {
            const message = undefined;
            expect(_utilService.toJson(message)).toBe(message);
        });

        it('should accept object and return string', () => {
            const message = {
                message:'hello world'
            };
            expect(_utilService.toJson(message)).toBe(JSON.stringify(message));
        });
    });

    describe('toObject', () => {
        it('should accept object and return same reference', () => {
            let message = {
                payload: 1
            };
            let deserialized = _utilService.toObject(message);
            expect(deserialized).toBe(message);
        });

        it('should accept number and return', () => {
            let message = 123;
            expect(_utilService.toObject(message)).toBe(message);
        });

        it('should accept string and return', () => {
            let payload = {
                message: 'hello world'
            };
            let jsonString = JSON.stringify(payload);
            expect(_utilService.toObject(jsonString)).toEqual(payload);
        });
    });
});