import 'reflect-metadata';
import * as _ from 'underscore';
import expect = require('expect');
import * as mongoose from 'mongoose';
import mockHelper from '../../MockHelper';
import MongoDbRepositoryBase from '../../../common/repositories/implementation/MongoDbRepositoryBase';
import DbException from '../../../common/repositories/exception/DbException';
import IUtilService from '../../../common/services/IUtilService';
import UtilService from '../../../common/services/implementation/UtilService';
import mapField from '../../../common/annotation/mapField';


describe('MongoDbRepositoryBase', () => {
    let _utilService: IUtilService;
    let _dbConnection: any;
    let _repository: MockRepository;

    beforeEach(() => {
        _dbConnection = mockHelper.dbConnection();
        _utilService = new UtilService();
        _repository = new MockRepository();
        _repository['_utilService'] = _utilService;
        _repository['_dbConnection'] = _dbConnection;
    });


    describe('find', () => {
        it('should call the Schema.find method', async () => {
            _dbConnection = mockHelper.dbConnection([]);
            _repository['_dbConnection'] = _dbConnection;
            await _repository.getByCriteria({});
            expect(_dbConnection._mockModel._mockFind.calledOnce).toBe(true);
        });

        it('should return the array of models', async () => {
            _dbConnection = mockHelper.dbConnection([
                {                   
                    toObject: () => {
                        return {
                            _id: '1',
                            name: 'marvin',
                        }
                    }
                },
                {                   
                    toObject: () => {
                        return {
                            _id: '2',
                            name: 'red',
                        }
                    }
                },
            ]);
            _repository['_dbConnection'] = _dbConnection;
            let results = await _repository.getByCriteria({});
            expect(results.length === 2).toBe(true);
            expect(results[0].id === '1').toBe(true);
            expect(results[1].id === '2').toBe(true);
        });

        it('should throw DbException when there was an error', async () => {
            let errorMessage = 'there was an error accessing db';
            _dbConnection = mockHelper.dbConnection([], errorMessage);
            _repository['_dbConnection'] = _dbConnection;
            try {
                await _repository.getByCriteria({});
            } catch(err) {
                expect(err instanceof DbException).toBe(true);
            }
        });
    });
});

@mapField('id', '_id')
@mapField('name')
class MockModel {
    id: string;
    name: string;
}

class MockRepository extends MongoDbRepositoryBase<MockModel> {

    getModelClass(): Function {
        return MockModel;
    }

    getDbSchema(): mongoose.Schema {       
        return new mongoose.Schema({
            _id : {
                type: String,
                required: true,
                unique: true
            },
            workspace: {
                type: String,
                required: true
            },
            key: {
                type: String,
                required: true
            },
            value: {
                type: Object,
                required: true
            },
            version: {
                type: Number,
                required: true
            }
        });
    }

    getByCriteria(criteria: any): Promise<any> {
        return super.find(criteria);
    }
}