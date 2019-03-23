import 'reflect-metadata';
import * as _ from 'underscore';
import sinon = require('sinon');
import expect = require('expect');
import IDateService from '../../../../../common/services/IDateService';
import IUtilService from '../../../../../common/services/IUtilService';
import IRecordService from '../../../../../webapi/public/kvp/services/IRecordService';
import IRecordRepository from '../../../../../webapi/public/kvp/repositories/IRecordRepository';
import RecordService from '../../../../../webapi/public/kvp/services/implementation/RecordService';
import RecordDto from '../../../../../webapi/public/kvp/services/dto/RecordDto';
import RecordQueryCriteriaDto from '../../../../../webapi/public/kvp/services/dto/RecordQueryCriteriaDto';
import mockHelper from '../../../../MockHelper';

describe('RecordService', () => {
    let _recordService: IRecordService;
    let _recordRepository: IRecordRepository;
    let _dateService: IDateService;
    let _utilService: IUtilService;


    beforeEach(() => {
        _recordRepository = {
            getByCriteria: sinon.spy(),
            save: sinon.spy()            
        };
        _dateService = mockHelper.dateService();
        _utilService = mockHelper.utilService();

        _recordService = new RecordService();
        _recordService['_dateService'] = _dateService;        
        _recordService['_utilService'] = _utilService;
        _recordService['_recordrepository'] = _recordRepository;
    });

    describe('getByCriteria', () => {
        it('it should call the dateService.getCurrentUnixTimestamp if no version is provided', async () => {
            let criteria: RecordQueryCriteriaDto = {
                workspace: 'employees',
                key: 'employee-1'                
            };            
            await _recordService.getByCriteria(criteria);
            expect(_dateService.getCurrentUnixTimestamp['calledOnce']).toBe(true);
        });

        it('should not call dateService.getCurrentUnixTimestamp if version is provided', async () => {
            let criteria: RecordQueryCriteriaDto = {
                workspace: 'employees',
                key: 'employee-1',
                version: 123
            };            
            await _recordService.getByCriteria(criteria);
            expect(_dateService.getCurrentUnixTimestamp['calledOnce']).toBe(false);
        });

        it('should _recordRepository.getByCriteria', async () => {
            let criteria: RecordQueryCriteriaDto = {
                workspace: 'employees',
                key: 'employee-1'
            };            
            await _recordService.getByCriteria(criteria);
            expect(_recordRepository.getByCriteria['calledOnce']).toBe(true);
        });
    });

    describe('save', () => {
        it('it should call the dateService.getCurrentUnixTimestamp if no version is provided', async () => {
            let record: RecordDto = new RecordDto();
            record.workspace = 'employees';
            record.key = 'employee-1';
            record.value = {
                name: 'marvin',
                work: 'software engineer'
            };
            await _recordService.save(record);
            expect(_dateService.getCurrentUnixTimestamp['calledOnce']).toBe(true);
        });

        it('should not call dateService.getCurrentUnixTimestamp if version is provided', async () => {
            let record: RecordDto = new RecordDto();
            record.workspace = 'employees';
            record.key = 'employee-1';
            record.version = 123;
            record.value = {
                name: 'marvin',
                work: 'software engineer'                
            };
            await _recordService.save(record);
            expect(_dateService.getCurrentUnixTimestamp['calledOnce']).toBe(false);
        });

        it('should call _recordRepository.save', async () => {
            let record: RecordDto = new RecordDto();
            record.workspace = 'employees';
            record.key = 'employee-1';
            record.version = 123;
            record.value = {
                name: 'marvin',
                work: 'software engineer'                
            };
            await _recordService.save(record);
            expect(_recordRepository.save['calledOnce']).toBe(true);
            expect(_utilService.createObjectFrom['callCount'] === 2).toBe(true); //call from toDto, toDbModel
        });
    });

});