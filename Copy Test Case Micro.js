const AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
const input = msg.payload.apiRequestBody.baseEntity.records[0];
console.log('----------------------------------------', input);
if (input.FORM_TYPE != 'Copy Test Case Steps') {
  let testCaseExistingQuery = `SELECT * FROM TEST_CASE WHERE TEST_CASE_NAME=:TEST_CASE_NAME AND TEST_SET_UUID=:TEST_SET_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseExistingQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseExistingQuery,
    input
  );
  if (testCaseExistingQueryData && testCaseExistingQueryData.length) {
    msg.payload['isErrorCheck'] = true;
    msg.payload.result = { mode: 'Enable Message', code: 406, errors: [] };
    msg.payload.result.errors.push({
      message: 'Test Case already exists.',
      reason: 'Message below form field',
      warningMessage: '',
      location: '62092a77-feb9-4b97-ac5f-c3427e7d113a=>0=>TEST_CASE_NAME',
    });
  } else {
    msg.payload['isErrorCheck'] = false;
  }
} else {
  msg.payload['isErrorCheck'] = false;
}
node.send(msg);

// --------------------------------------------

try {
    const AppengProcessConfig = global.get('AppengProcessConfig');
const input = msg.payload.apiRequestBody.baseEntity.records[0];
  let mode;
  if (input.FORM_TYPE != 'Copy Test Case Steps') {
    mode = { mode: 'Insert', message: 'Test Case Copied Successfully.' };
  } else {
    mode = { mode: 'Insert', message: 'Test Case Step(s) Copied Successfully.' };
  }
  msg.payload['result'] = mode;
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured ', error.message);
}
return;
