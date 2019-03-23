import mapField from '../../../../common/annotation/mapField';

@mapField('key')
@mapField('value')
@mapField('timestamp', 'version')
export default class RecordViewModel {
    key: string;
    value: any;
    timestamp: number;
}