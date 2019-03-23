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
            createObjectFrom: sinon.spy(),
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

    static dbConnection(): any {
        let db: any = {
            model: (): any => {
                //return MockHelper.dbModel();
            }
        };
        let modelFuncStub = sinon.stub(db, 'model');
        let model = MockHelper.dbModel();
        modelFuncStub.returns(model);
        db._mockModel = model;
        return db;
    }

    static dbModel(data: any = {}): any {
        let execQuery = {
            exec: (callback): any => {
                callback(null, {
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

        model._mockSort = sortQuerySub;
        model._mockFindOneAndUpdate = findOneAndUpdate;
        model._mockSave = saveStub;
        return model;
    }

}