try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  msg.payload.result['mode'] = 'Enable Message';
  msg.payload.result['message'] = 'Deleted Successfully';
  msg.payload.result['pk'] = '';
  msg.payload.result['modifyOtherCard'] = {};
  let warningPortal = '0_12154003-6316-4e21-b003-c743352a6c97';
  let atr = msg.payload.apiRequestBody;
  atr.cleanData = warningPortal;
  let dataGridCard =
    input[0].REQUIREMENT_UUID + '_4e3fe144-65bf-40da-a42d-e13c4c5408bd_b434885c-1bf2-47f2-b99c-b6fac0dcd7f7';
  msg.payload.result.modifyOtherCard[dataGridCard] = [
    {
      parameter: 'data',
      parameterKey: 'REQUIREMENT_UUID',
      type: 'PortalDataGrid',
      parameterKeyValue: input[0].REQUIREMENT_UUID,
      type: 'RefreshGrid',
    },
  ];
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured in Delete message for impacted process', error.message);
}
return;

try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  console.log('inside delete impacted process ::::::::::::: ', input[0]);
  msg.payload.result['mode'] = 'Enable Message';
  msg.payload.result['message'] = 'Deleted Successfully';
  msg.payload.result['pk'] = '';
  msg.payload.result['modifyOtherCard'] = {};

  dataGridCard = input[0].VIEW_UUID + '_90d4210d-c3fe-4597-8f6d-94f25173c3d4_480f4c57-48b4-11ef-bdb4-bf6e65503eee';

  msg.payload.result.modifyOtherCard[dataGridCard] = [
    {
      parameter: 'data',
      parameterKey: 'VIEW_NAVIGATION_STEP_UUID',
      type: 'PortalDataGrid',
      parameterKeyValue: input[0].VIEW_NAVIGATION_STEP_UUID,
      type: 'RefreshGrid',
    },
  ];
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
//   return;
