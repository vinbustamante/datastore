import 'reflect-metadata';
import expect = require('expect');
import * as _ from 'underscore';
import IConfigService from '../../../common/services/IConfigService';
import ConfigService from '../../../common/services/implementation/ConfigService';

describe('ConfigService', () => {
    let _configService: IConfigService;
    let _environmentVariables: any;

    beforeEach(() => {
        _configService = new ConfigService();
        _environmentVariables = {
            mongoDbConnection: 'localhost'
        };
        (<any>_configService)._environmentVariables = _environmentVariables;
    });

    describe('getDatabaseConnString', () => {
        it('should read from environment variables supplied', () => {
            expect(_configService.getDatabaseConnString() === _environmentVariables.mongoDbConnection).toBe(true);
        });
    });

})