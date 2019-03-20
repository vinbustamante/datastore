import 'reflect-metadata';
const expect = require('expect');
import * as sinon from 'sinon';
import LogService from '../../common/services/implementation/LogService';
import UtilService from '../../common/services/implementation/UtilService';
import LogType from '../../common/enum/LogType';

const FUNC_NAME = {
    consoleInfo:  'console-info',
    consoleError:  'console-error',
    consoleWarn:  'console-warn',
};

describe('LogService', function() {
    let _logService: any;
    let _mocks = {};

    beforeEach(() => {
        //mock console provider
        _mocks[FUNC_NAME.consoleInfo] = sinon.stub(console, 'info');
        _mocks[FUNC_NAME.consoleInfo].returns(Promise.resolve());
        _mocks[FUNC_NAME.consoleError] = sinon.stub(console, 'error');
        _mocks[FUNC_NAME.consoleError].returns(Promise.resolve());
        _mocks[FUNC_NAME.consoleWarn] = sinon.stub(console, 'warn');
        _mocks[FUNC_NAME.consoleWarn].returns(Promise.resolve());

        //object to test
        _logService = new LogService();
        _logService._logProvider = console;
        _logService._utilService = new UtilService();
    });

    afterEach(() => {
        if(_mocks) {
            const keys = Object.keys(_mocks)
            keys.forEach(key => {
                _mocks[key].restore();
            });
        }
    });

    describe('log', () => {        
        it('should call info method if logType is info', () => {
            _logService.log('hello world', LogType.info);
            expect(_mocks[FUNC_NAME.consoleInfo].calledOnce === true).toBe(true);
        });

        it('should call error method if logType is error', () => {
            _logService.log('hello world', LogType.error);
            expect(_mocks[FUNC_NAME.consoleError].calledOnce === true).toBe(true);
        });

        it('should call warning method if logType is warning', () => {
            _logService.log('hello world', LogType.warning);
            expect(_mocks[FUNC_NAME.consoleWarn].calledOnce === true).toBe(true);
        });
    });

    describe('info', () => {        
        it('should accept string', () => {
            _logService.info('hello world');
            expect(_mocks[FUNC_NAME.consoleInfo].calledOnce === true).toBe(true);
        });

        it('should accept number', () => {
            _logService.info(123);
            expect(_mocks[FUNC_NAME.consoleInfo].calledOnce === true).toBe(true);
        });

        it('should accept boolean', () => {
            _logService.info(true);
            expect(_mocks[FUNC_NAME.consoleInfo].calledOnce === true).toBe(true);
        });

        it('should accept object', () => {
            _logService.info({
                payload: 'hello world'
            });
            expect(_mocks[FUNC_NAME.consoleInfo].calledOnce === true).toBe(true);
        });
    });

    describe('error', () => {        
        it('should accept string', () => {
            _logService.error('hello world');
            expect(_mocks[FUNC_NAME.consoleError].calledOnce === true).toBe(true);
        });

        it('should accept number', () => {
            _logService.error(123);
            expect(_mocks[FUNC_NAME.consoleError].calledOnce === true).toBe(true);
        });

        it('should accept boolean', () => {
            _logService.error(true);
            expect(_mocks[FUNC_NAME.consoleError].calledOnce === true).toBe(true);
        });

        it('should accept object', () => {
            _logService.error({
                payload: 'hello world'
            });
            expect(_mocks[FUNC_NAME.consoleError].calledOnce === true).toBe(true);
        });
    });

    describe('warn', () => {        
        it('should accept string', () => {
            _logService.warning('hello world');
            expect(_mocks[FUNC_NAME.consoleWarn].calledOnce === true).toBe(true);
        });

        it('should accept number', () => {
            _logService.warning(123);
            expect(_mocks[FUNC_NAME.consoleWarn].calledOnce === true).toBe(true);
        });

        it('should accept boolean', () => {
            _logService.warning(true);
            expect(_mocks[FUNC_NAME.consoleWarn].calledOnce === true).toBe(true);
        });

        it('should accept object', () => {
            _logService.warning({
                payload: 'hello world'
            });
            expect(_mocks[FUNC_NAME.consoleWarn].calledOnce === true).toBe(true);
        });
    });
});