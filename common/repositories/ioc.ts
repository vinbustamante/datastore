import { Container } from "inversify";
import * as mongoose from 'mongoose';
import commonServiceTypes from '../services/types';
import types from './types';
import IConfigService from '../services/IConfigService';

export default function configureCommonRepositories(container: Container): Container {
    let configService: IConfigService = container.get<IConfigService>(commonServiceTypes.IConfigService);
    let mongoDbConnectionString = configService.getDatabaseConnString();
    if (mongoDbConnectionString) {        
        let mongoDbConnection = mongoose.createConnection(mongoDbConnectionString, {poolSize: 4, autoIndex: false, useNewUrlParser: true });
        mongoDbConnection.then(() => {
                            console.log('mongodb connected');
                        })
                        .catch(err => {
                            console.log('error database connecting... ', err);
                        });
        container.bind<mongoose.Connection>(types.MongodbConnection).toConstantValue(mongoDbConnection);
    }
    return container;
}