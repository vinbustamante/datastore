import 'reflect-metadata';
import * as _ from 'underscore';
import expect = require('expect');
import mapField from '../../../common/annotation/mapField';
import dbTable from '../../../common/annotation/DbTable';
import IUtilService from '../../../common/services/IUtilService';
import UtilService from '../../../common/services/implementation/UtilService';


@mapField('id')
@mapField('username')
class CustomerDto {
    id: string;
    username: string;
    unmapField: string;
}

@dbTable('customer')
@mapField('id', '_id')
@mapField('username')
@mapField('password')
class CustomerModel {
    id: string;
    username: string;
    password: string;
}

class NoMappingClass {
    id: string;
    username: string;
    password: string;
}

describe('UtilService', function() {    
    let _utilService: IUtilService;

    beforeEach(() => {
        _utilService = new UtilService();
    });

    describe('toJson', () => {
        it('should accept string and return', () => {
            const message = 'hello world';
            expect(_utilService.toJson(message)).toBe(message);
        });

        it('should accept number and return', () => {
            const message = 123;
            expect(_utilService.toJson(message)).toBe(message);
        });

        it('should accept boolean and return', () => {
            const message = true;
            expect(_utilService.toJson(message)).toBe(message);
        });

        it('should accept null and return', () => {
            const message = null;
            expect(_utilService.toJson(message)).toBe(message);
        });

        it('should accept undefined and return', () => {
            const message = undefined;
            expect(_utilService.toJson(message)).toBe(message);
        });

        it('should accept object and return string', () => {
            const message = {
                message:'hello world'
            };
            expect(_utilService.toJson(message)).toBe(JSON.stringify(message));
        });
    });

    describe('toObject', () => {
        it('should accept object and return same reference', () => {
            let message = {
                payload: 1
            };
            let deserialized = _utilService.toObject(message);
            expect(deserialized).toBe(message);
        });

        it('should accept number and return', () => {
            let message = 123;
            expect(_utilService.toObject(message)).toBe(message);
        });

        it('should accept string and return', () => {
            let payload = {
                message: 'hello world'
            };
            let jsonString = JSON.stringify(payload);
            expect(_utilService.toObject(jsonString)).toEqual(payload);
        });
    });

    describe('createObject', () => {
        it('should support any function as constructor', () => {
            let customerClass = function() {
            };
            let instance = _utilService.createObject(customerClass);
            expect(instance instanceof customerClass).toBe(true);
        });

        it('it should throw an error if pass in non function', () => {
            expect(() => {
                return  _utilService.createObject(<any>1);
            }).toThrow('k is not a constructor')
        });
    });

    describe('createObjectFrom', () => {
        it('should return undefined if any parameter pass is undefined/null', () => {
            expect(_utilService.createObjectFrom(undefined, undefined) === undefined).toBe(true);
            expect(_utilService.createObjectFrom(function() {}, undefined) === undefined).toBe(true);
            expect(_utilService.createObjectFrom(undefined, {}) === undefined).toBe(true);
        });

        it('should only copy the field that has an explicit mapping to avoid risking passing a sensitive data', () => {
            let genericDataFromDataSource = {
                _id: '123',
                username: 'marvin',
                password: 'password'
            };
            let model = _utilService.createObjectFrom(CustomerModel, genericDataFromDataSource);
            let dto = _utilService.createObjectFrom(CustomerDto, model);

            expect(model.id === genericDataFromDataSource._id).toBe(true);
            expect(model.username === genericDataFromDataSource.username).toBe(true);
            expect(model.password === genericDataFromDataSource.password).toBe(true);

            expect(dto.id === model.id).toBe(true);
            expect(dto.username === model.username).toBe(true);
            expect(dto.unmapField === undefined).toBe(true);
        });

        it('should not ceate any property if no mapping fields defined.', () => {
            let genericDataFromDataSource = {
                _id: '123',
                username: 'marvin',
                password: 'password'
            };
            let model = _utilService.createObjectFrom(NoMappingClass, genericDataFromDataSource);            
            expect(model !== null).toBe(true);
            expect(Object.keys(model).length === 0).toBe(true);
        });
    });

    describe('getMapFields', () => {
        it('it should return empty array if no mapping fields defined', () => {
            expect(_utilService.getMapFields(NoMappingClass).length === 0).toBe(true);
        });

        it('it should return the mapping fields define', () => {
            let mapFields = _utilService.getMapFields(CustomerModel);
            let idMap = _.findWhere(mapFields, {sourceField: '_id'});
            let usernameMap = _.findWhere(mapFields, {sourceField: 'username'});
            let passwordMap = _.findWhere(mapFields, {sourceField: 'password'});

            expect(idMap.destinationField === 'id').toBe(true);
            expect(usernameMap.destinationField === 'username').toBe(true);
            expect(passwordMap.destinationField === 'password').toBe(true);
        });
    });

    describe('setMapField', () => {
        it('should return empty map if the target is null', () => {           
            let mapField = _utilService.setMapField(null, 'id');
            expect(Object.keys(mapField).length === 0).toBe(true);
        });

        it('should support optional source field', () => {
            let suppliedClass = function() {
            };
            let mapField = _utilService.setMapField(suppliedClass, 'id');
            expect(mapField.destinationField === 'id').toBe(true);
            expect(mapField.sourceField === 'id').toBe(true);
        });

        it('it should support explicitly passing source field', () => {
            let suppliedClass = function() {
            };
            let mapField = _utilService.setMapField(suppliedClass, 'id', '__id__');
            expect(mapField.destinationField === 'id').toBe(true);
            expect(mapField.sourceField === '__id__').toBe(true);
        });
    });

    describe('setTablename', () => {
        it('should support optional table name', () => {
            class SupplierModel {
            }
            _utilService.setTablename(SupplierModel);
            let fn: any = SupplierModel;
            expect(fn.$__tableName === 'supplier').toBe(true);
        });

        it('should save the table name define', () => {
            const tableName = 'suppierTable';
            let suppliedClass: any = function() {
            };
            _utilService.setTablename(suppliedClass, tableName);
            expect(suppliedClass.$__tableName === tableName).toBe(true);
        });
    });

    describe('getTablename', () => {
        it('should get table name define', () => {
            const tableName = 'suppierTable';
            let suppliedClass: any = function() {
            };
            _utilService.setTablename(suppliedClass, tableName);
            expect(tableName === _utilService.getTablename(suppliedClass)).toBe(true);
        });
    });

    describe('getClassname', () => {
        it('it should return empty string if pass null/undefined', () => {
            expect(_utilService.getClassname(null) === '').toBe(true);
            expect(_utilService.getClassname(undefined) === '').toBe(true);
        });

        it('should support passing string', () => {
            expect(_utilService.getClassname('hello world') === 'string').toBe(true);
        });

        it('should support passing boolean', () => {
            expect(_utilService.getClassname(true) === 'boolean').toBe(true);
            expect(_utilService.getClassname(false) === 'boolean').toBe(true);
        });

        it('should support passing number', () => {
            expect(_utilService.getClassname(1) === 'number').toBe(true);
            expect(_utilService.getClassname(1.0) === 'number').toBe(true);
            expect(_utilService.getClassname(-1) === 'number').toBe(true);
            expect(_utilService.getClassname(0.001) === 'number').toBe(true);
        });

        it('should support object instance', () => {
            let model = new CustomerModel();
            let className = _utilService.getClassname(model);
            expect(className === 'CustomerModel').toBe(true);
        });

        it('should support pass passing constructor', () => {
            expect(_utilService.getClassname(CustomerModel) === 'CustomerModel').toBe(true);
        });
    });
});
