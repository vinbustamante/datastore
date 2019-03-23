import ApplicationException from './ApplicationException';

export default class NotFoundApplicationException extends ApplicationException {

    constructor(message?: string) {
        super(message);
    }

}