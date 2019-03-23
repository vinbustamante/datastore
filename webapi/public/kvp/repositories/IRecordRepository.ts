import RecordModel from './model/RecordModel';
import RecordQueryCriteriaModel from './model/RecordQueryCriteriaModel';

export default interface IRecordRepository {
    save(record: RecordModel): Promise<RecordModel>;
    getByCriteria(criteria: RecordQueryCriteriaModel): Promise<RecordModel>;
}