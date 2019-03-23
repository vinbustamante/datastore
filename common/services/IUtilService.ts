import FieldMap from './FieldMap';

export default interface IUtilService {
    toJson(value: any): string;
    toObject(value: any): any;
    createObjectFrom(klass: Function, objectSource: any): any;
    createObject(klass: Function): any;
    getMapFields(modelClass: any): FieldMap[];
    setMapField(target: any, fieldName: string, dbFieldName?: string)
    getTablename(modelClass: any): string;
    setTablename(target: any, tablename: string);
    getClassname(instance: any): string;    
}