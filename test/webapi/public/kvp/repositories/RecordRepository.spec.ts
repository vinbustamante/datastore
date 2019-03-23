import 'reflect-metadata';
import * as _ from 'underscore';
import expect = require('expect');
import mockHelper from '../../../../MockHelper';
import IUtilService from '../../../../../common/services/IUtilService';
import IRecordRepository from '../../../../../webapi/public/kvp/repositories/IRecordRepository';
import RecordRepository from '../../../../../webapi/public/kvp/repositories/implementation/RecordRepository';
import RecordQueryCriteriaModel from '../../../../../webapi/public/kvp/repositories/model/RecordQueryCriteriaModel';

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
    });

});