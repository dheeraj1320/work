let atr = msg.payload.apiRequestBody;
let routeStateParams = {};
let input = msg.payload.apiRequestBody.baseEntity.records;
let warningPortal = '0_12154003-6316-4e21-b003-c743352a6c97';
let warningPortalCard = '0_dfddc5e0-75fb-4e48-9cb6-767abf183b7d';
routeStateParams.portalId = '0_12154003-6316-4e21-b003-c743352a6c97';
atr.cleanData = warningPortal;
atr.routeStateParams = routeStateParams;
msg.payload.result = {
  mode: 'Enable Message',
  message: 'Please Wait..',
  attributes: atr,
  navigation: { operationType: 'OpenModal', portalId: '0_12154003-6316-4e21-b003-c743352a6c97' },
};
msg.payload.result.modifyOtherCard = {};
msg.payload.result.modifyOtherCard[warningPortal] = [
  {
    parameter: 'referenceData',
    parentId: '0_12154003-6316-4e21-b003-c743352a6c97',
    portalId: '0_12154003-6316-4e21-b003-c743352a6c97',
    parameterKey: 'data',
    type: 'SubPortal',
    eventType: 'uploadGridData',
    data: input[0],
  },
];
// return msg;





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
