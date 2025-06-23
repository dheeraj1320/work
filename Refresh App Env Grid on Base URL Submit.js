try {
  debugger;
  let input = msg.payload.apiRequestBody.baseEntity.records[0];
  const message = msg.payload.entityGroupData?.logicalData?.appData?.data?.[0]?.message;
  const action = msg.payload.apiRequestBody.action;
  const OLD_DEFAULT_APPENV_BASE_URL_UUID = msg.payload.entityGroupData?.logicalData?.appData?.data?.[0]?.OLD_DEFAULT_APPENV_BASE_URL_UUID;
  if (message) {
    let mode = { mode: action == 'Save' || 'Update' ? 'Insert' : action, message: message };
    msg.payload['result'] = mode;
  }
  if (input.IS_DEFAULT_BASE_URL == 'Yes') {
    let dataGridCard = '0_9b5804b0-1850-41b5-8046-4a9e313fd5f3';
    let baseUrlDatagridCard = input.APPLICATION_ENVIRONMENT_UUID + '_4cc5b870-625c-4149-a947-d11a8dc4234c_e951c288-5bd4-4305-b3e3-73a0e1bd72d2';
    msg.payload.result['modifyOtherCard'] = {};
    msg.payload.result.modifyOtherCard[dataGridCard] = [
      {
        parameter: 'data',
        parameterKey: 'APPLICATION_ENVIRONMENT_UUID',
        type: 'PortalDataGrid',
        parameterKeyValue: input.APPLICATION_ENVIRONMENT_UUID,
        changedData: { APPLICATION_ENVIRONMENT_BASE_URL: input.BASE_URL }
      }
    ];
    msg.payload.result.modifyOtherCard[baseUrlDatagridCard] = [
      {
        parameter: 'data',
        parameterKey: 'APPLICATION_ENVIRONMENT_BASE_URL_UUID',
        type: 'PortalDataGrid',
        parameterKeyValue: OLD_DEFAULT_APPENV_BASE_URL_UUID,
        changedData: { IS_DEFAULT_BASE_URL: 'No' }
      }
    ];
  }
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
