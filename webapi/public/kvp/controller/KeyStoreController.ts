import { controller, httpPost, httpGet } from 'inversify-express-utils';
import * as express from 'express';
import iocContainer from '../iocContainer';
import decodePathInterceptor from '../../../../common/interceptor/decodePathInterceptor';

@controller('/')
export default class KeyStoreController {
    @httpGet("/:paths?*", decodePathInterceptor(iocContainer))
    get(request: express.Request) {        
        return 'get';
    }

    @httpPost("/:paths?*", decodePathInterceptor(iocContainer))
    post(request: express.Request) {
        let req: any = request;       
        return 'post';
    }
}