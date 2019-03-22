import * as express from "express";
const cors = require('cors');
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import IErrorHandlerService from '../../../common/services/IErrorHandlerService';
import commonServiceTypes from '../../../common/services/types';
import { configureCommonServices } from '../../../common/services/ioc';
import iocContainer from './iocContainer';

//list of controller
import './controller/KeyStoreController';

const app: express.Application = express();
configureCommonServices(iocContainer);

// @ts-ignore
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin");
//     next();
// });
app.use(cors({
  origin: '*'
}));
let server = new InversifyExpressServer(iocContainer, app);
server.setConfig((app) => {    
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(bodyParser.json());
});

let errorHandlerService = iocContainer.get<IErrorHandlerService>(commonServiceTypes.IErrorHandlerService);
server.setErrorConfig(app => {  
  app.use(errorHandlerService.handle.bind(errorHandlerService));    
});
const serverInstance = server.build();
export default serverInstance;