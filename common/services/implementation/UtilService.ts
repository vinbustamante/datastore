import { injectable } from 'inversify';
import IUtilService from '../IUtilService';
import FieldMap from '../FieldMap';

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

    createObject(klass: Function): any {
        //todo: hookup an afterCreateHandler for mapping
        let k: any = klass;
        let object = new k();
        return object;
    }

    createObjectFrom(klass: Function, objectSource: any): any {
        let model: any;
        if (klass && objectSource) {
            model = this.createObject(klass);
            let fields = this.getMapFields(klass);
            if(fields && fields.length > 0) {
                fields.forEach(field => {
                    let fieldName = field.destinationField;
                    let dbFieldName = field.sourceField;
                    if (fieldName && objectSource[dbFieldName] !== undefined) {
                        model[fieldName] = objectSource[dbFieldName];
                    }                  
                });
            }
        }
        return model;
    }

    getMapFields(modelClass: any): FieldMap[] {
        let fields: any[] = [];
        if(modelClass && modelClass.$__mapFields !== undefined && modelClass.$__mapFields.length > 0) {
            fields =  modelClass.$__mapFields.map(field => {
                return Object.assign({}, field);
            });
        }
        return fields;
    }

    setMapField(target: any, fieldName: string, dbFieldName?: string): FieldMap {
        let fieldMap = new FieldMap();
        if (target) {
            if(target.$__mapFields === undefined) {
                target.$__mapFields = [];
            }
            dbFieldName = dbFieldName || fieldName;        
            fieldMap.destinationField = fieldName;
            fieldMap.sourceField = dbFieldName;
            target.$__mapFields.push(fieldMap);
        }
        return fieldMap;
    }

    getTablename(modelClass: any): string {
        let tableName: string;
        if(modelClass && modelClass.$__tableName !== undefined) {
            tableName = modelClass.$__tableName;
        }
        return tableName;
    }

    setTablename(target: any, tablename?: string) {
        if (target) {
            if (!tablename) {
                tablename = this.getClassname(target);
                tablename = tablename.replace('Model','').toLowerCase();
            }            
            if(target.$__tableName === undefined) {
                target.$__tableName = tablename;
            }
        }
    }

    getClassname(instance: any): string {
        let clsssName: string = '';
        if (instance !== undefined && instance !== null) {
            let typeName = typeof instance;
            if(typeName === 'object') {
                clsssName = instance.constructor.name;
            } else if(typeName === 'function') {
                clsssName = instance.name;
            } else {
                clsssName = typeName;
            }
        }
        return clsssName;
    }
}