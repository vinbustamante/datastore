import * as sinon from 'sinon';
import IDateService from '../common/services/IDateService';
import IUtilService from '../common/services/IUtilService';
import ILogService from '../common/services/ILogService';
import IConfigService from '../common/services/IConfigService';

export default class MockHelper {

    static dateService(): IDateService {
        return {
            getCurrentUnixTimestamp: sinon.spy()
        };
    }

    static utilService(): IUtilService {
        let service = {
            toJson: sinon.spy(),
            toObject: sinon.spy(),
            //createObjectFrom: sinon.spy(),
            // @ts-ignore
            createObjectFrom: (klass: Function, objectSource: any): any => {},
            createObject: sinon.spy(),
            getMapFields: (): any => {
            },
            setMapField: sinon.spy(),
            getTablename: sinon.spy(),
            setTablename: sinon.spy(),
            getClassname: sinon.spy()
        };
        let getMapFields = sinon.stub(service, 'getMapFields');
        service['_mockGetMapFields'] = getMapFields;

        let createObjectFromStub = sinon.stub(service, 'createObjectFrom');
        // @ts-ignore
        createObjectFromStub.callsFake((kclass: any, sourceData: any) => {
            return sourceData;
        });
        return service;
    }

    static logService(): ILogService {
        return {
            log: sinon.spy(),
            info: sinon.spy(),
            error: sinon.spy(),
            warning: sinon.spy()
        };
    }

    static configService(): IConfigService {
        return {
            getDatabaseConnString: sinon.spy()
        };
    }

    static dbConnection(data?: any, err?: any): any {
        let db: any = {
            model: (): any => {
                //return MockHelper.dbModel();
            }
        };
        let modelFuncStub = sinon.stub(db, 'model');
        let model = MockHelper.dbModel(data, err);
        modelFuncStub.returns(model);
        db._mockModel = model;
        return db;
    }

    static dbModel(data: any = {}, err?: any): any {
        let execQuery = {
            exec: (callback): any => {                
                callback(err, {
                    toObject: () => {
                        return data;
                    }
                });
            }
        };

        let sortQuery = {
            sort: () :any=> {
            }
        };
        let sortQuerySub = sinon.stub(sortQuery, 'sort');
        sortQuerySub.returns(execQuery);
     
        let model: any = function() {
            this.save = (): any => {}
            let saveStub = sinon.stub(this, 'save');
            saveStub.returns(Promise.resolve());
            model._mockSave = saveStub;
        };
        // @ts-ignore
        model.find = () => {
           
        };
        model.findOne = () => {
        };
        model.findOneAndUpdate = () => {
        };
        model.save = () => {
        };

        let saveStub = sinon.stub(model, 'save');
        saveStub.returns(Promise.resolve());

        let findOneStub = sinon.stub(model, 'findOne');
        findOneStub.returns(sortQuery);

        let findOneAndUpdate = sinon.stub(model, 'findOneAndUpdate');
        findOneAndUpdate.returns(Promise.resolve());

        let findStub = sinon.stub(model, 'find');
        // @ts-ignore
        findStub.callsFake((criteria: any, callback: any) => {
            callback(err, data);
        });
           

        model._mockSort = sortQuerySub;
        model._mockFindOneAndUpdate = findOneAndUpdate;
        model._mockSave = saveStub;
        model._mockFind = findStub;
        return model;
    }

}