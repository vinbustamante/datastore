import { inject } from 'inversify';
import * as _ from 'underscore';
import { controller, httpPost, httpGet } from 'inversify-express-utils';
import * as express from 'express';
import iocContainer from '../iocContainer';
import decodePathInterceptor from '../../../../common/interceptor/decodePathInterceptor';
import kvpServiceTypes from '../services/types';
import IRecordService from '../services/IRecordService';
import ObjectIdViewModel from '../viewModel/ObjectIdViewModel';
import BaseController from '../../../../common/controller/BaseController';
import RecordDto from '../services/dto/RecordDto';
import RecordViewModel from '../viewModel/RecordViewModel';
import RecordQueryCriteriaDto from '../services/dto/RecordQueryCriteriaDto';

@controller('/')
export default class KeyStoreController extends BaseController {

    @inject(kvpServiceTypes.IRecordService)
    private _recordService: IRecordService;

    @httpGet("/:paths?*", decodePathInterceptor(iocContainer))
    async get(request: express.Request) {
        return super.returnValue(async () => {
            let objectId: ObjectIdViewModel = (<any>request).objectId;
            let criteria: RecordQueryCriteriaDto = {
                workspace: objectId.workspace,
                key: objectId.key,
                version: objectId.version
            };
            let record: RecordDto = await this._recordService.getByCriteria(criteria);
            return record;
        });
    }

    @httpPost("/:paths?*", decodePathInterceptor(iocContainer))
    async post(request: express.Request) {
        let objectId: ObjectIdViewModel = (<any>request).objectId;
        let postData = request.body;
        let recordKey = objectId.key;
        let payload: any = undefined;
        if (recordKey) {
            payload = postData;
        } else {
            //if record key was not part of the url, the expected format is that there is only one key on the postData
            if (_.isObject(postData)) {
                let keys = Object.keys(postData);
                if (keys.length == 1) {
                    objectId.key = keys[0];
                    payload = postData[objectId.key];
                } else {
                    super.badrequest('post body should only have one key. If the key is not part of the url.');
                }
            } else {
                super.badrequest('object is expected as part of the post data.');
            }
        }
        let record: RecordDto = new RecordDto();
        record.workspace = objectId.workspace;
        record.key = objectId.key;
        record.value = payload;
        record.version = Date.now();
        let updatedRecord = await this._recordService.save(record);
        return this.toViewModel(updatedRecord, RecordViewModel);
    }
}