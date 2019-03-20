import 'reflect-metadata';
const expect = require('expect');
import * as sinon from 'sinon';
//import ILogService from '../../common/services/ILogService';
import LogService from '../../common/services/implementation/LogService';

describe('LogService', function() {
    let _logService: any;
    let _utilService;

    beforeEach(() => {
        _logService = new LogService();
        _logService._utilService = sinon.stub();
        //_logService._utilService.stub(
    });

    describe('info', () => {        
        it('shopuld ', () => {

        });
    });
});