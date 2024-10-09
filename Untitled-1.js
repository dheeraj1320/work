let atr = msg.payload.apiRequestBody;
AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
let routeStateParams = {};
let input = msg.payload.apiRequestBody.baseEntity.records;
console.log('input =========== ::::::::::: >>>>>>>>>>> ????????????? ', input[0]);
let warningPortal = '0_b832cc59-3902-4262-aa46-12d290aca60a';
let warningPortalCard = '0_ea3935d9-1c44-44c2-9159-fad42ae744e4';
routeStateParams.portalId = '0_b832cc59-3902-4262-aa46-12d290aca60a';

let viewQuery = `SELECT IS_DEFAULT_VIEW FROM PAGE_VIEW WHERE VIEW_UUID = :VIEW_UUID`;
let viewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewQuery, input[0]);

if (viewQueryData[0].IS_DEFAULT_VIEW == 'Yes') {
  atr.refreshData = input[0].VIEW_UUID + '_7adf03e4-9008-458d-a064-f3a061d308de_480f4c57-48b4-11ef-bdb4-bf6e65503eee';
  atr.cleanData =
    warningPortal +
    ',' +
    input[0].VIEW_UUID +
    '_7adf03e4-9008-458d-a064-f3a061d308de_480f4c50-48b4-11ef-bdb4-bf6e65503eee';
} else {
  atr.refreshData = input[0].VIEW_UUID + '_90d4210d-c3fe-4597-8f6d-94f25173c3d4_480f4c57-48b4-11ef-bdb4-bf6e65503eee';
  atr.cleanData =
    warningPortal +
    ',' +
    input[0].VIEW_UUID +
    '_90d4210d-c3fe-4597-8f6d-94f25173c3d4_480f4c50-48b4-11ef-bdb4-bf6e65503eee';
}
atr.routeStateParams = routeStateParams;
msg.payload.result = {
  mode: 'Enable Message',
  message: 'Please Wait..',
  attributes: atr,
  navigation: { operationType: 'OpenModal', portalId: '0_b832cc59-3902-4262-aa46-12d290aca60a' },
};
msg.payload.result.modifyOtherCard = {};
msg.payload.result.modifyOtherCard[warningPortal] = [
  {
    parameter: 'referenceData',
    parentId: '0_b832cc59-3902-4262-aa46-12d290aca60a',
    portalId: '0_b832cc59-3902-4262-aa46-12d290aca60a',
    parameterKey: 'data',
    type: 'SubPortal',
    eventType: 'uploadGridData',
    data: input[0],
  },
];
return msg;
