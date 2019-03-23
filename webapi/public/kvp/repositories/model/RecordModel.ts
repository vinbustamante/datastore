import dbTable from '../../../../../common/annotation/dbTable';
import mapField from '../../../../../common/annotation/mapField';

@dbTable("kvp")
@mapField("id", "_id")
@mapField("workspace")
@mapField("key")
@mapField("value")
@mapField("version")
export default class RecordModel {
    id: string;
    workspace: string;
    key: string;
    value: object;
    version: number;
}