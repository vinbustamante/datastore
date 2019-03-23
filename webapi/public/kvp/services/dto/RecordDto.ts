import mapField from '../../../../../common/annotation/mapField';

@mapField("id")
@mapField("workspace")
@mapField("key")
@mapField("value")
@mapField("version")
export default class RecordDto {
    id: string;
    workspace: string;
    key: string;
    value: any;
    version: number;
}