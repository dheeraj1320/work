try {
  let input = msg.payload.apiRequestBody.baseEntity.records[0];
  const AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  const testSetQuery = `SELECT TAGS_UUID FROM TEST_SET WHERE TEST_SET_UUID = '${input.TEST_SET_UUID}'`;
  const testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
  console.log('#######input[0]', input);
  console.log('::::::::::::::::::::::::: , ', testSetQueryData);

  msg.payload.result['mode'] = 'Enable Message';
  msg.payload.result['message'] = 'Deleted Successfully';
  msg.payload.result['pk'] = '';
  msg.payload.result['modifyOtherCard'] = {};
  let dataGridCard;
  if (testSetQueryData[0].TAGS_UUID.includes('1b763b10-f81c-11ee-8c09-9376aaa8e4da')) {
    dataGridCard =
      input.TEST_SET_UUID + '_5c4b27f5-f2e3-4220-8f6b-4c83604422b9_7771b533-2741-4d2a-a4e6-d08446c3ab81';
  } else {
    dataGridCard =
      input.TEST_SET_UUID + '_e399bb2a-e7b3-4e2c-a9ed-c7fd303d7962_7771b533-2741-4d2a-a4e6-d08446c3ab81';
  }

  msg.payload.result.modifyOtherCard[dataGridCard] = [
    {
      parameter: 'data',
      parameterKey: 'TEST_CASE_UUID',
      type: 'PortalDataGrid',
      parameterKeyValue: input.TEST_CASE_UUID,
      type: 'RefreshGrid',
    },
  ];
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
