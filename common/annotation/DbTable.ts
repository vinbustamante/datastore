import UtilService from '../services/implementation/UtilService';

export default  function dbTable(name: string) {
    //note: data annotation run first before anything else so IoC will not function here
    let utilService = new UtilService();       
    return function (target) {                
        utilService.setTablename(target, name);
    }
}