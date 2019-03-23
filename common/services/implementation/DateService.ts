import { injectable } from 'inversify';
import IDateService from '../IDateService';
import * as moment from 'moment';

@injectable()
export default class DateService implements IDateService {
    getCurrentUnixTimestamp(): number {
        return moment().unix();
    }
}