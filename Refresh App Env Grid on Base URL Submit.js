try {
  const AppengProcessConfig = global.get('AppengProcessConfig');
  let input = msg.payload.apiRequestBody.baseEntity.records;
  if (input[0].IS_DEFAULT_BASE_URL == 'Yes') {
    let generatedKey = '0_9b5804b0-1850-41b5-8046-4a9e313fd5f3';
    let mode = { mode: 'Enable Message', message: 'Successfully updated the default Base URL for this Environment.' };
    msg.payload['result'] = mode;
    msg.payload.result['modifyOtherCard'] = {};
    msg.payload.result.modifyOtherCard[generatedKey] = [
      { parameter: 'data', parameterKey: 'APPLICATION_ENVIRONMENT_UUID', type: 'RefreshGrid', parameterKeyValue: input[0].APPLICATION_ENVIRONMENT_UUID }
    ];
  }
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
