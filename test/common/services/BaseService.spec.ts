import 'reflect-metadata';
import * as _ from 'underscore';
import expect = require('expect');
import mockHelper from '../../MockHelper';
import BaseService from '../../../common/services/implementation/BaseService';
import IUtilService from '../../../common/services/IUtilService';
import mapField from '../../../common/annotation/mapField';

describe('BaseService', () => {
    let _utilService: IUtilService;
    let _service: MockService;

    beforeEach(() => {
        _utilService = mockHelper.utilService();
        _service = new MockService();
        _service['_utilService'] = _utilService;
    });

    describe('getRecords', () => {
        it('should return empty array if null/undefined/empty result', async () => {
            let results: any[];

            results = await _service.getResults(undefined);
            expect(results.length === 0).toBe(true);

            results = await _service.getResults(null);
            expect(results.length === 0).toBe(true);

            results = await _service.getResults([]);
            expect(results.length === 0).toBe(true);
        });
        
        it('should return array of dto', async () => {
            let results = await _service.getResults([
                {
                    id: '123',
                    name: 'marvin'
                }
            ]);        
            expect(results.length === 1).toBe(true);
            expect(results[0].id === '123').toBe(true);
        });
    });

    describe('createCacheKey', () => {
        it('sss', () => {
            expect(_service.getKey() === 'mockdto:test').toBe(true);
        });
    });
});

@mapField('id')
@mapField('name')
class MockDto {
    id: string;
    name: string;
}

class MockService extends BaseService<MockDto> {
    getDtoClass(): Function {
        return MockDto;
    }

    getResults(data: any): Promise<any[]> {
        return super.getRecords(Promise.resolve(data));
    };

    getKey(): string {
        return super.createCacheKey('test');
    }
}