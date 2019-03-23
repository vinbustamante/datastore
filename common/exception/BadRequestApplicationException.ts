import ApplicationException from './ApplicationException';

export default class BadRequestApplicationException extends ApplicationException {

    constructor(message?: string) {
        super(message);
    }

}