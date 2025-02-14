try {
  console.log('Data set Action Flow');
  msg.payload['isOpenModal'] = true;
  console.log('msg:::::::::::::::::::', msg.payload['isOpenModal']);
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured ', error.message);
}
return;

// ----------------------------------------------

// ----------------------------------------------

// ----------------------------------------------

let atr = msg.payload.apiRequestBody;
let routeStateParams = {};
let input = msg.payload.apiRequestBody.baseEntity.records;
let portalToOpen = '0_6f7b89cd-90a4-482d-abdd-900f6b483b2d';
routeStateParams.portalId = portalToOpen;
atr.cleanData = portalToOpen;
atr.routeStateParams = routeStateParams;
atr.refreshData = '0_430835d6-d87c-418b-9b72-5f331cfec638';
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
return msg;
