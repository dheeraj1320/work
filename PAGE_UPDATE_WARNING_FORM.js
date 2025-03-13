try {
  console.log('Update Modal Action Flow');
  let input = msg.payload.apiRequestBody.baseEntity.records;
  console.log('inputtttttt', input);
  let AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let QuerytoFetchNavigationStep = `select VIEW_NAVIGATION_STEP_UUID from VIEW_NAVIGATION_STEP where VIEW_UUID in (select VIEW_UUID from PAGE_VIEW where PAGE_UUID='${input[0]['PAGE_UUID']}' AND IS_DEFAULT_VIEW = 'Yes') AND FUNCTIONAL_AREA_UUID = '${input[0]['APP_LOGGED_IN_FUNTIONAL_AREA_ID']}'`;
  let QuerytoFetchNavigationStepData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    QuerytoFetchNavigationStep,
    input[0]
  );
  let QuerytoFetchNavigationStepRecords = JSON.parse(JSON.stringify(QuerytoFetchNavigationStepData));
  console.log('length', QuerytoFetchNavigationStepRecords.length);
  if (input[0]['PAGE_ACCESS_RELATIVE_URL']) {
    if (QuerytoFetchNavigationStepRecords.length > 0) {
      console.log('Action Flow Called');
      msg.payload['isOpenModal'] = true;
    } else {
      msg.payload['isOpenModal'] = false;
    }
  } else {
    msg.payload.result = { formData: input };
    msg.payload['isOpenModal'] = false;
  }
  console.log('msg:::::::::::::::::::', msg.payload['isOpenModal']);
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured ', error.message);
}
return;

// ----------------------------------

let atr = msg.payload.apiRequestBody;
let routeStateParams = {};
let input = msg.payload.apiRequestBody.baseEntity.records;
let warningPortal = '0_6330d9fb-6540-4b47-88d7-c627082204fe';
let warningPortalCard = '0_cea910ec-eaaf-4962-a0e7-bff8b6b62546';
routeStateParams.portalId = '0_6330d9fb-6540-4b47-88d7-c627082204fe';
atr.cleanData = warningPortal;
atr.routeStateParams = routeStateParams;
msg.payload.result = {
  mode: 'Enable Message',
  message: 'Please Wait..',
  attributes: atr,
  navigation: { operationType: 'OpenModal', portalId: '0_6330d9fb-6540-4b47-88d7-c627082204fe' },
};
msg.payload.result.modifyOtherCard = {};
msg.payload.result.modifyOtherCard[warningPortal] = [
  {
    parameter: 'referenceData',
    parentId: '0_6330d9fb-6540-4b47-88d7-c627082204fe',
    portalId: '0_6330d9fb-6540-4b47-88d7-c627082204fe',
    parameterKey: 'data',
    type: 'SubPortal',
    eventType: 'uploadGridData',
    data: input[0],
  },
];
return msg;
