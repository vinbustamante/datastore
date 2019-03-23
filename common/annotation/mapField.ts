import UtilService from '../services/implementation/UtilService';

export default  function mapField(destinationFieldname: string, sourceFieldname?: string) {
    //note: data annotation run first before anything else so IoC will not function here
    let utilService = new UtilService();
    return function (target) {       
        utilService.setMapField(target, destinationFieldname, sourceFieldname);
    }
}