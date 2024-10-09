try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  console.log('inside refresh view navigation step datagrid ::::::::::::: ', input[0]);
  msg.payload.result['mode'] = 'Enable Message';
  msg.payload.result['message'] = 'Deleted Successfully';
  msg.payload.result['pk'] = '';
  msg.payload.result['modifyOtherCard'] = {};
  let viewQuery = `SELECT IS_DEFAULT_VIEW FROM PAGE_VIEW WHERE VIEW_UUID = :VIEW_UUID`;
  let viewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewQuery, input[0]);

  let dataGridCard;
  if (viewQueryData[0].IS_DEFAULT_VIEW == 'Yes') {
    dataGridCard = input[0].VIEW_UUID + '_7adf03e4-9008-458d-a064-f3a061d308de_480f4c57-48b4-11ef-bdb4-bf6e65503eee';
  } else {
    dataGridCard = input[0].VIEW_UUID + '_90d4210d-c3fe-4597-8f6d-94f25173c3d4_480f4c57-48b4-11ef-bdb4-bf6e65503eee';
  }

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
return;

try {
  console.log('inside refresh view navigation step datagrid ::::::::::::: ', input[0]);
  let input = msg.payload.apiRequestBody.baseEntity.records;
  msg.payload.result['mode'] = 'Enable Message';
  msg.payload.result['message'] = 'Deleted Successfully';
  msg.payload.result['pk'] = '';
  msg.payload.result['modifyOtherCard'] = {};
  let dataGridCard = input[0].VIEW_UUID + '_90d4210d-c3fe-4597-8f6d-94f25173c3d4_480f4c57-48b4-11ef-bdb4-bf6e65503eee';
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
return;
