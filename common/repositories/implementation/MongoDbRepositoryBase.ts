import { injectable, inject } from 'inversify';
import uuidv1 = require('uuid/v1');
import * as mongoose from 'mongoose';
import IUtilService from '../../services/IUtilService';
import commonServiceTypes from '../../services/types';
import commonRepositoryTypes from '../types';

@injectable()
export default abstract class MongoDbRepositoryBase<TModel> {

    @inject(commonServiceTypes.IUtilService)
    private _utilService: IUtilService;

    @inject(commonRepositoryTypes.MongodbConnection)
    private _dbConnection: mongoose.Connection;

    private _dbSchemaModel: any;

     //note: typescript type will strip away after compilation so let's explicitly return type so we could still don reflection at run time
    abstract getModelClass(): Function;
    abstract getDbSchema(): mongoose.Schema;

    protected find(criteria: any): Promise<TModel[]> {
        return new Promise((resolve, reject) => {
            let schemaModel = this._getSchemaModel();
            schemaModel.find(criteria, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    let models: TModel[] = [];
                    if (results) {                        
                        models = results.map(dbModel => {
                            let model = this._utilService.createObjectFrom(this.getModelClass(), dbModel.toObject());
                            return model;
                        });
                    }
                    resolve(models);
                }
            });
        });
    }

    async findOne(criteria: any): Promise<TModel> {
        // let dataModel: any = null;
        // let schemaModel = this._getSchemaModel();       
        // return dataModel;
        return new Promise((resolve, reject) => {
            let schemaModel = this._getSchemaModel();
            schemaModel.findOne(criteria, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    let model: TModel;
                    if (result) {
                        model = this._utilService.createObjectFrom(this.getModelClass(), result.toObject());
                    }
                    resolve(model);
                }
            });
        });
    }

    protected async dbSave(record: TModel): Promise<TModel> {
        if (record) {
            let ModelClass = this._getSchemaModel();
            let dbModel = new ModelClass();
            let mapFields = this._utilService.getMapFields(this.getModelClass());
            mapFields.forEach(field => {
                dbModel[field.sourceField] = record[field.destinationField];
            });
            if (dbModel._id) {
                await ModelClass.findOneAndUpdate({_id: dbModel._id}, dbModel, {upsert:true});
            } else {
                dbModel._id = uuidv1();
                record['id'] = dbModel._id;
                await dbModel.save();
            }            
        }
        return record;
    }

    private _getSchemaModel(): any {
        if (this._dbSchemaModel === undefined) {
            let modelClass = this.getModelClass();
            this._dbSchemaModel = this._dbConnection.model(modelClass.name, this.getDbSchema(), this._getTableName());
        }
        return this._dbSchemaModel;
    }

    private _getTableName(): string {
        return this._utilService.getTablename(this.getModelClass());
    }
}