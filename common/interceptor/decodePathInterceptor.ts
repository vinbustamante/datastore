import { Container } from 'inversify';
import * as _ from 'underscore';
import * as express from 'express';
import BadRequestApplicationException from '../exception/BadRequestApplicationException';

const _queryParamVersionName = 'timestamp';

// @ts-ignore
export default function decodePathInterceptor (iocContainer: Container) {
    // @ts-ignore
    return async function(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (_.isObject(req.params) && _.isString(req.params[0])) {
            const path = req.params[0];
            let parts = path.split('/');
            if (parts.length <= 3) {
                let [ workspace, id, version ]  = path.split('/');
                if (workspace || id || version) {
                    let request: any = req;
                    let versionValue = version || req.query[_queryParamVersionName];
                    request.objectId = {
                        workspace: workspace,
                        key: id
                    };
                    if (versionValue) {
                        try {
                            request.objectId.version = parseInt(versionValue);
                        } catch(err ) {
                        }
                    }
                }
                next();
            } else {
                next(new BadRequestApplicationException('path specs not valid.'));
            }         
        }                
    }
}