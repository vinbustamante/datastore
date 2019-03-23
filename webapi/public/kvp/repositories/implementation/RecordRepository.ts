import { injectable } from 'inversify';
import * as mongoose from 'mongoose';
import RecordModel from '../model/RecordModel';
import IRecordRepository from '../IRecordRepository';
import MongoDbRepositoryBase from '../../../../../common/repositories/implementation/MongoDbRepositoryBase';
import RecordQueryCriteriaModel from '../model/RecordQueryCriteriaModel';

@injectable()
export default class RecordRepository extends MongoDbRepositoryBase<RecordModel> implements IRecordRepository {

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
                type: Number,
                required: true
            }
        });
    }

    getByCriteria(criteria: RecordQueryCriteriaModel): Promise<RecordModel> {
        return super.findOne({
            workspace: criteria.workspace,
            key: criteria.key,
            version: {
                $lte: criteria.version
            }
        }, {
            version: -1
        });
    }

    save(record: RecordModel): Promise<RecordModel> {
        return super.dbSave(record);
    }
}