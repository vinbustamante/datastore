import 'reflect-metadata';
const expect = require('expect');
import IDateService from '../../../common/services/IDateService';
import DateService from '../../../common/services/implementation/DateService';


describe('DateService', () => {
    let _dateService: IDateService;

    beforeEach(() => {
        _dateService = new DateService();
    });

    describe('getCurrentUnixTimestamp', () => {
        it('should return number', () => {
            expect(typeof _dateService.getCurrentUnixTimestamp() === 'number').toBe(true);
        });
    });
});