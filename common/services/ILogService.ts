import LogType from '../enum/LogType';
export default interface ILogService {
    log(logType: LogType, message: any): Promise<void>;
    info(message: any): Promise<void>;
    error(message: any): Promise<void>;
    warning(message: any): Promise<void>;
}