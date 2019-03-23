import * as express from 'express';

export default interface IErrorHandlerService {
    handle(error: any, req: express.Request, res: express.Response, next: express.NextFunction);
}