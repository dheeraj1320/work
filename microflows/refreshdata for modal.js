let atr = msg.payload.apiRequestBody;
let routeStateParams = {};
let input = Object.assign(msg.payload.apiRequestBody.baseEntity.records[0], msg.payload.referenceData);
let warningPortal = '0_12154003-6316-4e21-b003-c743352a6c97';
let warningPortalCard = '0_dfddc5e0-75fb-4e48-9cb6-767abf183b7d';
routeStateParams.portalId = '0_12154003-6316-4e21-b003-c743352a6c97';
atr.refreshData = input.REQ_COS_UUID + '_4e3fe144-65bf-40da-a42d-e13c4c5408bd_b434885c-1bf2-47f2-b99c-b6fac0dcd7f7';
atr.cleanData =
  warningPortal +
  ',' +
  input.IMPACTED_PROCESS_UUID +
  '_01267b38-dfb0-4794-8ee0-d3eb234d744f_54339d54-02a0-468d-a826-45a6702037d3';
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
    data: input,
  },
];
return msg;
