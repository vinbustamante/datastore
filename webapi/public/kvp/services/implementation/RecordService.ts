import { injectable, inject } from 'inversify';
import IRecordService from '../IRecordService';
import IDateService from '../../../../../common/services/IDateService';
import RecordDto from '../dto/RecordDto';
import RecordModel from '../../repositories/model/RecordModel';
import BaseService from '../../../../../common/services/implementation/BaseService';
import IRecordRepository from '../../repositories/IRecordRepository';
import kvpRepositoryTypes from '../../repositories/types';
import commonServiceTypes from '../../../../../common/services/types';
import RecordQueryCriteriaDto from '../dto/RecordQueryCriteriaDto';

@injectable()
export default class RecordService extends BaseService<RecordDto> implements IRecordService {
    
    @inject(kvpRepositoryTypes.IRecordRepository)
    private _recordrepository: IRecordRepository;

    @inject(commonServiceTypes.IDateService)
    private _dateService: IDateService;

    getDtoClass(): Function {
        return RecordDto;
    }

    getByCriteria(criteria: RecordQueryCriteriaDto): Promise<RecordDto> {
        criteria.version  = criteria.version  || this._dateService.getCurrentUnixTimestamp();
        return this._recordrepository.getByCriteria(criteria);
    }

    save(record: RecordDto): Promise<RecordDto> {
        record.version = record.version || this._dateService.getCurrentUnixTimestamp();
        let recordModel = super.toDbModel(record, RecordModel);
        const saveRequest = this._recordrepository.save(recordModel);
        return super.getRecord(saveRequest);
    }
}