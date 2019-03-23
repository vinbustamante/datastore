import { injectable, inject } from 'inversify';
import * as mongoose from 'mongoose';
import RecordModel from '../model/RecordModel';
import IRecordRepository from '../IRecordRepository';
import MongoDbRepositoryBase from '../../../../../common/repositories/implementation/MongoDbRepositoryBase';
import IDateService from '../../../../../common/services/IDateService';
import commonServiceTypes from '../../../../../common/services/types';
import RecordQueryCriteriaModel from '../model/RecordQueryCriteriaModel';

@injectable()
export default class RecordRepository extends MongoDbRepositoryBase<RecordModel> implements IRecordRepository {

    @inject(commonServiceTypes.IDateService)
    private _dateService: IDateService;

    getModelClass(): Function {
        return RecordModel;
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
                type: String,
                required: true
            }
        });
    }

    getByCriteria(criteria: RecordQueryCriteriaModel): Promise<RecordModel> {
        // if version is not supplied, assume get the latest versio
        if (criteria.version) {
            criteria.version = this._dateService.getCurrentUnixTimestamp();
        }
        return super.findOne({
            workSpace: criteria.workspace,
            key: criteria.key,
            version: {
                $lte: criteria.version
            }
        });
    }

    save(record: RecordModel): Promise<RecordModel> {
        return super.dbSave(record);
    }
}