try {
  console.log('Data Element Action Flow');
  let input = msg.payload.apiRequestBody.baseEntity.records[0];
  console.log('inputtttttt', input);
  let AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  console.log('value in payload == == == ', msg.payload);
  let queryToFetchCount = `select COUNT(*) AS COUNT from UI_ELEMENT where DATA_ELEMENT_UUID = '${input.DATA_ELEMENT_UUID}' AND FUNCTIONAL_AREA_UUID = '${input.APP_LOGGED_IN_FUNTIONAL_AREA_ID}'`;
  let queryToFetchCountData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    queryToFetchCount,
    input
  );
  console.log('query result === ', queryToFetchCountData);
  if (queryToFetchCountData[0].COUNT > 0 || msg.payload.apiRequestBody.action === 'Delete') {
    console.log('SETTED THE OPEN MODAL TO TRUE');
    msg.payload['isOpenModal'] = true;
  } else {
    msg.payload['isOpenModal'] = false;
  }
  console.log('msg:::::::::::::::::::', msg.payload['isOpenModal']);
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured ', error.message);
}
return;

////////////////////////////////////////////

////////////////////////////////////////////

////////////////////////////////////////////

let atr = msg.payload.apiRequestBody;
let routeStateParams = {};
let input = msg.payload.apiRequestBody.baseEntity.records;
const updateWarningPortal = '0_1cd1075c-c650-4f8c-bea0-3aa8adde9db2';
const deleteWarningPortal = '0_c857d993-3106-4941-8e9b-b55578a35700';
let portalToOpen;
if(msg.payload.apiRequestBody.action === 'Update'){
  portalToOpen = updateWarningPortal;
} else{
  portalToOpen = deleteWarningPortal;
}

routeStateParams.portalId = portalToOpen;
atr.cleanData = portalToOpen;
atr.routeStateParams = routeStateParams;
atr.refreshData = input[0].DATA_SET_UUID + '_2678e2a2-fa11-477d-94a7-11d030e1531f_3be161ff-76dd-46ee-b6f6-cf33bc4f30af';
msg.payload.result = {
  mode: 'Enable Message',
  message: 'Please Wait..',
  attributes: atr,
  navigation: { operationType: 'OpenModal', portalId: portalToOpen },
};
msg.payload.result.modifyOtherCard = {};
msg.payload.result.modifyOtherCard[portalToOpen] = [
  {
    parameter: 'referenceData',
    parentId: portalToOpen,
    portalId: portalToOpen,
    parameterKey: 'data',
    type: 'SubPortal',
    eventType: 'uploadGridData',
    data: input[0],
  },
];
console.log('opening portal ::: ', portalToOpen);
return msg;
