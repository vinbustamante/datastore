import RecordDto from './dto/RecordDto';
import RecordQueryCriteriaDto from './dto/RecordQueryCriteriaDto';

export default interface IRecordService {
    getByCriteria(criteria: RecordQueryCriteriaDto): Promise<RecordDto>;
    save(record: RecordDto): Promise<RecordDto>;
}