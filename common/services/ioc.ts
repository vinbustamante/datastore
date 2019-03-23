import { Container } from "inversify";  

import types from './types';
import ILogService from './ILogService';
import LogService from './implementation/LogService';

import IUtilService from './IUtilService';
import UtilService from './implementation/UtilService';

import IConfigService from './IConfigService';
import ConfigService from './implementation/ConfigService';

import IErrorHandlerService from './IErrorHandlerService';
import ErrorHandlerService from './implementation/ErrorHandlerService';

import IDateService from './IDateService';
import DateService from './implementation/DateService';

export default function configureCommonServices(container: Container): Container {
    container.bind<any>(types.EnvironmentVariables).toConstantValue(process.env);
    container.bind<any>(types.LogProvider).toConstantValue(console);
    container.bind<IUtilService>(types.IUtilService).to(UtilService).inSingletonScope();
    container.bind<ILogService>(types.ILogService).to(LogService).inSingletonScope();
    container.bind<IErrorHandlerService>(types.IErrorHandlerService).to(ErrorHandlerService).inSingletonScope();
    container.bind<IConfigService>(types.IConfigService).to(ConfigService).inSingletonScope();
    container.bind<IDateService>(types.IDateService).to(DateService).inSingletonScope();
    return container;
}