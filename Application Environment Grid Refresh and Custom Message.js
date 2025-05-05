try {
  const AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let input = msg.payload.apiRequestBody.baseEntity.records;
  if (input[0].IS_DEFAULT_APPLICATION_ENVIRONMENT == 'Yes') {
    let appEnvQuery = `select APPLICATION_ENVIRONMENT_UUID,IS_DEFAULT_APPLICATION_ENVIRONMENT from APPLICATION_ENVIRONMENT where IS_DEFAULT_APPLICATION_ENVIRONMENT='Yes';`;
    let QuerytoFetchData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', appEnvQuery, input[0]);
    let QuerytoFetchRecords = JSON.parse(JSON.stringify(QuerytoFetchData));
    if (QuerytoFetchRecords.length > 0) {
      let generatedKey;
      generatedKey = '0_9b5804b0-1850-41b5-8046-4a9e313fd5f3';
      if (msg.payload.apiRequestBody.action == 'Save') {
        let mode = { mode: 'Insert', message: 'Default is set to No for Other Application Environment record.' };
        msg.payload['result'] = mode;
      }
      if (msg.payload.apiRequestBody.action == 'Update') {
        let mode = {
          mode: 'Enable Message',
          message: 'Default is set to No for Other Application Environment record.',
        };
        msg.payload['result'] = mode;
        msg.payload.result['modifyOtherCard'] = {};
        msg.payload.result.modifyOtherCard[generatedKey] = [
          {
            parameter: 'data',
            parameterKey: 'APPLICATION_ENVIRONMENT_UUID',
            type: 'RefreshGrid',
            parameterKeyValue: input[0].APPLICATION_ENVIRONMENT_UUID,
          },
        ];
      }
    }
  }
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
