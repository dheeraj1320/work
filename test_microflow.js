try {
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let queryData = [];
  let input = Object.assign(msg.payload.apiRequestBody, msg.payload.referenceData);
  console.log(input, ':::>>>');
  if (input && input.GRID_NAME == 'Linked test Case Req Level') {
    const selectQuery = `SELECT tc.TEST_CASE_UUID, TEST_CASE_ID,TEST_CASE_NAME, TEST_SET_UUID,TEST_CASE_STATUS,TEST_CASE_EXECUTON_TYPE FROM TEST_CASE tc,TEST_CASE_REQUIREMENT tcr WHERE tc.TEST_CASE_UUID=tcr.TEST_CASE_UUID and tcr.REQUIREMENT_UUID=:REQUIREMENT_UUID group by TEST_CASE_ID order by TEST_CASE_ID desc ;`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
  } else if (input && input.GRID_NAME == 'Linked test Case COS Level') {
    const selectQuery = `SELECT tc.TEST_CASE_UUID, TEST_CASE_ID,TEST_CASE_NAME, TEST_SET_UUID,TEST_CASE_STATUS,TEST_CASE_EXECUTON_TYPE FROM TEST_CASE tc,TEST_CASE_REQUIREMENT tcr WHERE tc.TEST_CASE_UUID=tcr.TEST_CASE_UUID and tcr.CONDITION_SATISFACTION_UUID=:CONDITION_SATISFACTION_UUID group by TEST_CASE_ID order by TEST_CASE_ID desc;`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
  }
  msg.payload.result = { gridData: queryData };
  console.log(msg.payload.result, '::::');
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
