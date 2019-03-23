import 'reflect-metadata';
import * as _ from 'underscore';
import expect = require('expect');
import mockHelper from '../../../../MockHelper';
import IUtilService from '../../../../../common/services/IUtilService';
import IRecordRepository from '../../../../../webapi/public/kvp/repositories/IRecordRepository';
import RecordRepository from '../../../../../webapi/public/kvp/repositories/implementation/RecordRepository';
import RecordQueryCriteriaModel from '../../../../../webapi/public/kvp/repositories/model/RecordQueryCriteriaModel';
import RecordModel from '../../../../../webapi/public/kvp/repositories/model/RecordModel';
import DbException from '../../../../../common/repositories/exception/DbException';

describe('RecordRepository', () => {
    let _utilService: IUtilService;
    let _recordRepository: IRecordRepository;
    let _dbConnection: any;

    beforeEach(() => {
        _dbConnection = mockHelper.dbConnection();
        _utilService = mockHelper.utilService();
        _recordRepository = new RecordRepository();
        _recordRepository['_utilService'] = _utilService;
        _recordRepository['_dbConnection'] = _dbConnection;
    });

    describe('getByCriteria', () => {
        it('should call BaseRepository.findOne', async () => {
            let criteria: RecordQueryCriteriaModel = {
                workspace: 'employees',
                key : 'emp-1',
                version : 1
            };
            await _recordRepository.getByCriteria(criteria);
            expect(_dbConnection.model['calledOnce']).toBe(true);            
            expect(_dbConnection._mockModel.findOne.calledOnce).toBe(true); // only 1 record is needed
            expect(_dbConnection._mockModel._mockSort.calledOnce).toBe(true); // this is important to be called since it should return latest record
            expect(_utilService.createObjectFrom['calledOnce']).toBe(true); //required to do conversion from source data to model
        });
        
        it('should throw DbException if there was an error', async () => {
            let errorMessage = 'there was an error accessing db';
            let criteria: RecordQueryCriteriaModel = {
                workspace: 'employees',
                key : 'emp-1',
                version : 1
            };
            try {
                _dbConnection = mockHelper.dbConnection({}, errorMessage);
                _recordRepository['_dbConnection'] = _dbConnection;
                await _recordRepository.getByCriteria(criteria);                
            } catch(err) {
                expect(err instanceof DbException).toBe(true);
            }
        });
    });

    describe('save', () => {
        it('should not call save/_mockFindOneAndUpdate if pass null', async () => {
            await _recordRepository.save(null);
            expect(_dbConnection._mockModel._mockSave.calledOnce).toBe(false);
            expect(_dbConnection._mockModel._mockFindOneAndUpdate.calledOnce).toBe(false);

            await _recordRepository.save(undefined);
            expect(_dbConnection._mockModel._mockSave.calledOnce).toBe(false);
            expect(_dbConnection._mockModel._mockFindOneAndUpdate.calledOnce).toBe(false);
        })

        it('should call Model.save if no id is pass', async () => {
            let record = new RecordModel();
            record.workspace = 'employees';
            record.key = 'empl-1';
            record.value = {
                name: 'Marvin',
                position: 'Tech Lead'
            };
            _utilService['_mockGetMapFields'].returns([]);
            await _recordRepository.save(record);
            expect(_dbConnection._mockModel._mockSave.calledOnce).toBe(true);
        });

        it('should call Model.findOneAndUpdate id is pass', async () => {
            let record = new RecordModel();
            record.id = '123';
            record.workspace = 'employees';
            record.key = 'empl-1';
            record.value = {
                name: 'Marvin',
                position: 'Tech Lead'
            };
            _utilService['_mockGetMapFields'].returns([{
                destinationField: 'id',
                sourceField: '_id'                            
            }]);
            await _recordRepository.save(record);
            expect(_dbConnection._mockModel._mockFindOneAndUpdate.calledOnce).toBe(true);
        });
    });

});