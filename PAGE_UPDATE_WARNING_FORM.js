try {
  console.log('Update Modal Action Flow');
  let input = msg.payload.apiRequestBody.baseEntity.records;
  console.log('inputtttttt', input);
  let AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let QuerytoFetchNavigationStep = `SELECT tcs.TEST_CASE_STEP_UUID FROM TEST_CASE_STEP tcs JOIN TEST_CASE tc ON tcs.TEST_CASE_UUID = tc.TEST_CASE_UUID JOIN PAGE_VIEW pv ON tc.ASSOCIATED_VIEW_UUID = pv.VIEW_UUID WHERE pv.PAGE_UUID = :PAGE_UUID AND pv.IS_DEFAULT_VIEW = 'Yes';`;
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
