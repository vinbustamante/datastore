import ApplicationException from '../../exception/ApplicationException';

export default class DbException extends ApplicationException {

    constructor(message?: string) {
        super(message);
    }

}