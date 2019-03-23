import "reflect-metadata";
const proxyHandler = require('serverless-http'); //use this traditional nodejs call since webpack has some issue with export default
import app from  "./app";

//proxy to expressjs app
export const handler = proxyHandler(app);