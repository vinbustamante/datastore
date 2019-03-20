import { injectable } from 'inversify';
import IUtilService from '../IUtilService';

@injectable()
export default class UtilService implements IUtilService {

    toJson(value: any): string {
        let converted: any = value;
        if (value && typeof value === 'object' ) {
            converted = JSON.stringify(value)
        }
        return converted;
    }

    toObject(value: any): any {
        let converted: any = value;
        if (typeof value === 'string') {
            converted = JSON.parse(value);
        }
        return converted;
    }
}