import { injectable, inject } from 'inversify';
import IConfigService from '../IConfigService';
import commonServiceTypes from '../types';

@injectable()
export default class ConfigService implements IConfigService {

    @inject(commonServiceTypes.EnvironmentVariables)
    private _environmentVariables: any;

    getDatabaseConnString(): string {
        return this._environmentVariables.mongoDbConnection;
    }
}