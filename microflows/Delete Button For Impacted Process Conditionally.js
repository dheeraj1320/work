const AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
let input = msg.payload.apiRequestBody.baseEntity.records;
const dataSetQuery = `SELECT * FROM TEST_CASE_REQUIREMENT WHERE REQUIREMENT_TITLE_UUID=:REQUIREMENT_TITLE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
const dataSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', dataSetQuery, input[0]);
msg.payload['isErrorCheck'] = dataSetQueryData && dataSetQueryData.length > 0 ? true : false;
console.log('hello', msg.payload['isErrorCheck']);
if (msg.payload['isErrorCheck']) {
  msg.payload.result = {
    mode: 'Enable Message',
    message: 'Impacted process cannot be deleted as it has linked testcases.',
  };
} else {
  msg.payload.result = { mode: 'Enable Message', message: 'Deleted Successfully' };
}
node.send(msg);
