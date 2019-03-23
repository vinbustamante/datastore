import ApplicationException from '../../exception/ApplicationException';

export default class ServiceException extends ApplicationException {

    constructor(message?: string) {
        super(message);
    }

}