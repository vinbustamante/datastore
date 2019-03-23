import 'reflect-metadata';
import expect = require('expect');
import * as _ from 'underscore';
import * as sinon from 'sinon';
import IErrorHandlerService from '../../../common/services/IErrorHandlerService';
import ErrorHandlerService from '../../../common/services/implementation/ErrorHandlerService';
import ServiceException from '../../../common/services/exception/ServiceException';
import DbException from '../../../common/repositories/exception/DbException';
import ApplicationException from '../../../common/exception/ApplicationException';
import BadRequestApplicationException from '../../../common/exception/BadRequestApplicationException';
import AccessDeniedServiceException from '../../../common/services/exception/AccessDeniedServiceException';
import NotFoundApplicationException from '../../../common/exception/NotFoundApplicationException';

describe('ErrorHandlerService', function () {
    let _errorHandlerService: IErrorHandlerService;
    let _mockResponse;
    let _mockLogService;

    beforeEach(() => {
        //express response object
        _mockResponse = {
            status: sinon.spy(),
            send: sinon.spy()
        };
        _errorHandlerService = new ErrorHandlerService();
        _mockLogService = {
            error: sinon.spy()
        };
        let errorService: any = _errorHandlerService;
        errorService._logService = _mockLogService;
    });

    describe('handle', () => {
        it('should support receiving string and expexted to set status to 500', () => {
            let request: any = {};
            let error = 'hello world';
            _errorHandlerService.handle(error, request, _mockResponse, () => { });
            let status = _mockResponse.status.getCall(0).args[0];
            let body = _mockResponse.send.getCall(0).args[0];
            let logMessage = _mockLogService.error.getCall(0).args[0];

            expect(status === 500).toBe(true);
            expect(_.isObject(body)).toBe(true);
            expect(body.message === error).toBe(true);
            expect(logMessage === error).toBe(true);
        });

        it('should accept ServiceException. Status code 500 and message should come from message property.', () => {
            let request: any = {};
            let errorMessage = 'hello world';
            let exception = new ServiceException(errorMessage);
            _errorHandlerService.handle(exception, request, _mockResponse, () => { });
            let status = _mockResponse.status.getCall(0).args[0];
            let body = _mockResponse.send.getCall(0).args[0];
            let logException = _mockLogService.error.getCall(0).args[0];
            expect(status === 500).toBe(true);
            expect(_.isObject(body)).toBe(true);
            expect(body.message === errorMessage).toBe(true);
            expect(logException instanceof ServiceException).toBe(true);
            expect(logException.message === errorMessage).toBe(true);
        });

        it('should accept DbException. Status code 500 and message should be suppress for potential risk of showing credential from db.', () => {
            let request: any = {};
            let errorMessage = "erro connecting from db using username: 'admin' password: 'password'";
            let exception = new DbException(errorMessage);
            _errorHandlerService.handle(exception, request, _mockResponse, () => { });
            let status = _mockResponse.status.getCall(0).args[0];
            let body = _mockResponse.send.getCall(0).args[0];
            let logException = _mockLogService.error.getCall(0).args[0];

            expect(status === 500).toBe(true);
            expect(_.isObject(body)).toBe(true);
            expect(body.message !== errorMessage).toBe(true);
            expect(logException instanceof DbException).toBe(true);
            expect(logException.message === errorMessage).toBe(true);
        });

        it('should accept ApplicationException. Status code 500 and message should come from message property.', () => {
            let request: any = {};
            let errorMessage = "there was an error processing request";
            let exception = new ApplicationException(errorMessage);
            _errorHandlerService.handle(exception, request, _mockResponse, () => { });
            let status = _mockResponse.status.getCall(0).args[0];
            let body = _mockResponse.send.getCall(0).args[0];
            let logException = _mockLogService.error.getCall(0).args[0];

            expect(status === 500).toBe(true);
            expect(_.isObject(body)).toBe(true);
            expect(body.message === errorMessage).toBe(true);
            expect(logException instanceof ApplicationException).toBe(true);
            expect(logException.message === errorMessage).toBe(true);
        });

        it('should accept AccessDeniedServiceException. Status code 500 and message should come from message property.', () => {
            let request: any = {};
            let errorMessage = "access denied from user";
            let exception = new AccessDeniedServiceException(errorMessage);
            _errorHandlerService.handle(exception, request, _mockResponse, () => { });
            let status = _mockResponse.status.getCall(0).args[0];
            let body = _mockResponse.send.getCall(0).args[0];
            let logException = _mockLogService.error.getCall(0).args[0];

            expect(status === 401).toBe(true);
            expect(_.isObject(body)).toBe(true);
            expect(body.message === 'access denied').toBe(true);
            expect(logException instanceof AccessDeniedServiceException).toBe(true);
            expect(logException.message === errorMessage).toBe(true);
        });

        it('should accept BadRequestApplicationException. Status code 500 and message should come from message property.', () => {
            let request: any = {};
            let errorMessage = "access denied from user";
            let exception = new BadRequestApplicationException(errorMessage);
            _errorHandlerService.handle(exception, request, _mockResponse, () => { });
            let status = _mockResponse.status.getCall(0).args[0];
            let body = _mockResponse.send.getCall(0).args[0];
            let logException = _mockLogService.error.getCall(0).args[0];

            expect(status === 400).toBe(true);
            expect(_.isObject(body)).toBe(true);
            expect(body.message === errorMessage).toBe(true);
            expect(logException instanceof BadRequestApplicationException).toBe(true);
            expect(logException.message === errorMessage).toBe(true);
        });

        it('should support NotFoundApplicationException', () => {
            let request: any = {};
            let errorMessage = "access denied from user";
            let exception = new NotFoundApplicationException(errorMessage);
            _errorHandlerService.handle(exception, request, _mockResponse, () => { });
            let status = _mockResponse.status.getCall(0).args[0];
            let body = _mockResponse.send.getCall(0).args[0];
            let logException = _mockLogService.error.getCall(0).args[0];

            expect(status === 404).toBe(true);
            expect(_.isObject(body)).toBe(true);
            expect(body.message === errorMessage).toBe(true);
            expect(logException instanceof NotFoundApplicationException).toBe(true);
            expect(logException.message === errorMessage).toBe(true);
        });
    });

});