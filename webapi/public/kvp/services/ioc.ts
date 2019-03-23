import { Container } from 'inversify';
import kvpServiceTypes from './types';


import IRecordService from  './IRecordService';
import RecordService from  './implementation/RecordService';

export default function configureKvpServices(iocContainer: Container) {
    iocContainer.bind<IRecordService>(kvpServiceTypes.IRecordService).to(RecordService).inSingletonScope();

    return iocContainer;
}