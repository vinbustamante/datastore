import { inject } from 'inversify';
import { controller } from 'inversify-express-utils';
import { Request } from 'express';
import IUtilService from '../services/IUtilService';
import ILogService from '../services/ILogService';
import comonServiceTypes from '../services/types';
import BadRequestApplicationException from '../exception/BadRequestApplicationException';
import NotFoundApplicationException from '../exception/NotFoundApplicationException';

@controller('/')
export default abstract class BaseController {

    @inject(comonServiceTypes.IUtilService)
    protected _utilService: IUtilService;

    @inject(comonServiceTypes.ILogService)
    protected _logService: ILogService;

    protected notfound(message?: string) {
        throw new NotFoundApplicationException(message || 'Not found');
    }

    protected badrequest(message?: string) {
        throw new BadRequestApplicationException(message || 'bad request');
    }

    protected returnValue(handler: () => Promise<any>): Promise<any> {
        const self = this;
        return Promise.resolve()
            .then(handler)
            .then(result => {
                if (result === undefined) {
                    self.notfound();
                }
                return result;
            });              
    }

    protected sanitiseRequest(request: Request) {
        if(request.method.toLowerCase() === 'post'&&  request.body && Buffer.isBuffer(request.body)) {
            try {
                request.body = this._utilService.toObject(request.body.toString());
            } catch(err) {
            }            
        }
    }

    protected toViewModel(dto: any, viewModelClass: Function) {
        return this._utilService.createObjectFrom(viewModelClass, dto);
    }
}