import * as express from 'express';
import { injectable, inject } from 'inversify';
import IErrorHandlerService from '../IErrorHandlerService';
import ILogService from '../ILogService';
import commonServiceTypes from '../types';
import ApplicationException from '../../exception/ApplicationException';
import ServiceException from '../exception/ServiceException';
import DbException from '../../repositories/exception/DbException';

@injectable()
export default class ErrorHandlerService implements IErrorHandlerService {

    @inject(commonServiceTypes.ILogService)
    protected _logService: ILogService;

    // @ts-ignore
    handle(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        let status: string = '500';
        let message: string = '';
        if (error instanceof ServiceException) {
            message = error.message;
        } else if(error instanceof DbException) {
            message = 'db error';
        }else if (error instanceof ApplicationException) {
            message = error.message;
        }

        let payload = {
            message: message
        };
        if (!status) {
            status = '500'
        }
        let statusId = parseInt(status);
        if (statusId === 401) {
            payload.message = 'access denied';
        }       
        this._logService.error(error);        
        res.status(statusId);
        res.send(payload);
    }
}