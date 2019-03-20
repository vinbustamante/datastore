import { controller, httpPost, httpGet } from 'inversify-express-utils';
//import { inject } from 'inversify';

@controller('/object')
export default class KeyStoreController {
    @httpGet("/")
    get() {
        return 'get';
    }

    @httpPost("/")
    post() {
        return 'post';
    }
}