import { Container } from "inversify";  

import types from './types';
import ILogService from './ILogService';
import LogService from './implementation/LogService';

import IUtilService from './IUtilService';
import UtilService from './implementation/UtilService';

import IErrorHandlerService from './IErrorHandlerService';
import ErrorHandlerService from './implementation/ErrorHandlerService';

export function configureCommonServices(container: Container): Container {
    container.bind<any>(types.EnvironmentVariables).toConstantValue(process.env);
    container.bind<IUtilService>(types.IUtilService).to(UtilService);
    container.bind<ILogService>(types.ILogService).to(LogService);
    container.bind<IErrorHandlerService>(types.IErrorHandlerService).to(ErrorHandlerService);
    return container;
}