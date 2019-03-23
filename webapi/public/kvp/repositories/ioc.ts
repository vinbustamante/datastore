import { Container } from 'inversify';

import repositoryTypes from './types';
import IRecordRepository from './IRecordRepository';
import RecordRepository from './implementation/RecordRepository';

export default function configureKvpRepositories(container: Container) {
    container.bind<IRecordRepository>(repositoryTypes.IRecordRepository).to(RecordRepository).inSingletonScope();
    return container;
}