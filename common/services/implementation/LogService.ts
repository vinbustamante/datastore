import { injectable, inject } from 'inversify';
import LogType from '../../enum/LogType';
import ILogService from '../ILogService';
import IUtilService from '../IUtilService';
import commonServiceTypes from '../types';

@injectable()
export default class LogService implements ILogService {

    @inject(commonServiceTypes.LogProvider)
    protected _logProvider: any;

    @inject(commonServiceTypes.IUtilService)
    protected _utilService: IUtilService;

    log(logType: LogType, message: any): Promise<void> {
        if (logType === LogType.error) {
            return this.error(message);
        } else if (logType === LogType.warning) {
            return this.warning(message);
        } else {
            return this.info(message);
        }
    }

    info(message: any): Promise<void> {
        let payload = this._utilService.toJson(message);
        this._logProvider.info(payload);
        return Promise.resolve();
    }

    error(message: any): Promise<void> {
        this._logProvider.error(message);
        return Promise.resolve();
    }

    warning(message: any): Promise<void> {
        let payload = this._utilService.toJson(message);
        this._logProvider.warn(payload);
        return Promise.resolve();
    }
}