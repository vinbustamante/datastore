import ServiceException from './ServiceException';

export default class AccessDeniedServiceException extends ServiceException {
    constructor(message?: string) {
        super(message);
    }
}