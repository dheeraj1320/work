let input = msg.payload.apiRequestBody.baseEntity.records[0];
const AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
msg.payload['isErrorCheck'] = false;
if (input.PAGE_ACCESS_RELATIVE_URL) {
  const PAGE_ACCESS_RELATIVE_URL = input.PAGE_ACCESS_RELATIVE_URL;
  const PAGE_UUID = input.PAGE_UUID;
  const PageURL = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_ACCESS_RELATIVE_URL = '${PAGE_ACCESS_RELATIVE_URL}' AND PAGE_UUID NOT IN ('${PAGE_UUID}')`;
  let PageURLData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', PageURL, input[0]);
  if (PageURLData.length > 0) {
    const pagename = `The Page Access Relative URL already exists in the '${PageURLData[0].PAGE_NAME}' Page.`;
    msg.payload.result = { mode: 'Enable Message', code: 406, errors: [] };
    msg.payload.result.errors.push({
      message: pagename,
      reason: 'Message below form field',
      warningMessage: '',
      location: '5264eded-97f5-4593-b48c-c029356440a4=>0=>PAGE_ACCESS_RELATIVE_URL',
    });
    msg.payload['isErrorCheck'] = true;
  }
}
node.send(msg);
return;

// ----------------------------------------

try {
  console.log('Update Modal Action Flow');
  let input = msg.payload.apiRequestBody.baseEntity.records;
  console.log('inputtttttt', input);
  let AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  const overridenModalCondition = input[0]['OLD_IS_BASE_URL_OVERRIDDEN'] == 'Yes' && input[0]['IS_BASE_URL_OVERRIDDEN'] == 'Yes' && !input[0]['PAGE_ACCESS_RELATIVE_URL'];
  console.log('overridenModalCondition ==== ', overridenModalCondition, input[0]['OLD_IS_BASE_URL_OVERRIDDEN'], input[0]['IS_BASE_URL_OVERRIDDEN'], input[0]['PAGE_ACCESS_RELATIVE_URL']);
  if (input[0]['PAGE_ACCESS_RELATIVE_URL'] || overridenModalCondition) {
      let QuerytoFetchNavigationStep = `select VIEW_NAVIGATION_STEP_UUID from VIEW_NAVIGATION_STEP where VIEW_UUID in (select VIEW_UUID from PAGE_VIEW where PAGE_UUID='${input[0]['PAGE_UUID']}' AND IS_DEFAULT_VIEW = 'Yes') AND FUNCTIONAL_AREA_UUID = '${input[0]['APP_LOGGED_IN_FUNTIONAL_AREA_ID']}'`;
      let QuerytoFetchNavigationStepData = await serviceOrchestrator.selectRecordsUsingQuery(
        'PRIMARYSPRINGFM',
        QuerytoFetchNavigationStep,
        input[0]
      );
      let QuerytoFetchNavigationStepRecords = JSON.parse(JSON.stringify(QuerytoFetchNavigationStepData));
    if (QuerytoFetchNavigationStepRecords.length > 0 || overridenModalCondition ) {
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

// -----------------------------------------

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
