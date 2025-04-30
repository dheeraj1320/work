try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  msg.payload.result['modifyOtherCard'] = {};
  let dataGridCard = input[0].TEST_SET_UUID;
  if (input[0]['PARENT_GRID_NAME'] == 'Unit Functional Test Set') {
    dataGridCard += '_5c4b27f5-f2e3-4220-8f6b-4c83604422b9_7771b533-2741-4d2a-a4e6-d08446c3ab81';
    msg.payload.result['message'] = 'Test Case Committed Successfully.';
  } else if (input[0]['PARENT_GRID_NAME'] == 'Orphan Test Set') {
    dataGridCard += '_9a903ec6-c08d-4815-b557-5cd4136a588d_7771b533-2741-4d2a-a4e6-d08446c3ab81';
    msg.payload.result['message'] = 'Test Case Committed Successfully.';
  } else if (input[0]['PARENT_GRID_NAME'] == 'Test Set') {
    dataGridCard += '_e399bb2a-e7b3-4e2c-a9ed-c7fd303d7962_7771b533-2741-4d2a-a4e6-d08446c3ab81';
    msg.payload.result['message'] = 'Test Case Committed Successfully.';
  } else if (input[0]['PARENT_GRID_NAME'] == 'Personal - Unit Functional Test Set') {
    dataGridCard += '_f4656ce7-bfbe-471e-a7e1-4c3e5e3543bf_7771b533-2741-4d2a-a4e6-d08446c3ab81';
    msg.payload.result['message'] = 'Test Case Committed Successfully and Moved under User Action Test Set.';
  } else if (input[0]['PARENT_GRID_NAME'] == 'Personal - Regular Test Set') {
    dataGridCard += '_e7168933-8b67-4540-9474-758ed9f27dc9_7771b533-2741-4d2a-a4e6-d08446c3ab81';
    msg.payload.result['message'] = 'Test Case Committed Successfully and Moved under Functional Test Set.';
  } else if (input[0]['PARENT_GRID_NAME'] == 'Personal - Orphan Test Set') {
    dataGridCard += '_4b77f551-e544-4fae-b4df-045ed493345c_7771b533-2741-4d2a-a4e6-d08446c3ab81';
    msg.payload.result['message'] = 'Test Case Committed Successfully and Moved under Orphan Test Set.';
  } else if (input[0]['PARENT_GRID_NAME'] == 'Page Navigation Test Set') {
    dataGridCard += '_6acf847b-d130-4040-82d7-0f37a9713848_7771b533-2741-4d2a-a4e6-d08446c3ab81';
    msg.payload.result['message'] = 'Test Case Committed Successfully.';
  }
  console.log('input[0][PARENT_GRID_NAME]', input[0]['PARENT_GRID_NAME']);
  console.log('dataGridCard', dataGridCard);
  if (
    [
      'Personal - Unit Functional Test Set',
      'Personal - Regular Test Set',
      'Personal - Orphan Test Set',
      'Page Navigation Test Set',
    ].includes(input[0]['PARENT_GRID_NAME'])
  ) {
    msg.payload.result['mode'] = 'Enable Message';
    msg.payload.result['pk'] = '';
    msg.payload.result.modifyOtherCard[dataGridCard] = [
      {
        parameter: 'data',
        parameterKey: 'TEST_CASE_UUID',
        type: 'PortalDataGrid',
        parameterKeyValue: input[0].TEST_CASE_UUID,
        type: 'RefreshGrid',
      },
    ];
  }
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured ', error.message);
}
return;

// ------------------------------------------------------

// -----------------------------------------------------

// ------------------------------------------------------

// ---------------------------------------------------------------

let atr = msg.payload.apiRequestBody;
let routeStateParams = {};
let input = msg.payload.apiRequestBody.baseEntity.records;
let warningPortal = '0_9705a7b7-fdec-4232-8919-ea3da9448fad';
routeStateParams.portalId = '0_9705a7b7-fdec-4232-8919-ea3da9448fad';
atr.refreshData = input[0].TEST_SET_UUID + '_0a10210a-c5d6-40d1-bbc2-cef05bc16e54_c939d725-7d91-4dbc-be7d-a31fba507136';
atr.cleanData =
  warningPortal +
  ',' +
  input[0].TEST_CASE_UUID +
  '_3e5b3bf2-96cc-4ec3-84a6-45fab6e0e3e0_fdfca397-b973-47f2-a9b1-b54eedba475b';
atr.routeStateParams = routeStateParams;
console.log('######actionlow Input', input);
msg.payload.result = {
  mode: 'Enable Message',
  message: 'Please Wait..',
  attributes: atr,
  navigation: { operationType: 'OpenModal', portalId: '0_9705a7b7-fdec-4232-8919-ea3da9448fad' },
};
msg.payload.result.modifyOtherCard = {};
msg.payload.result.modifyOtherCard[warningPortal] = [
  {
    parameter: 'referenceData',
    parentId: '0_9705a7b7-fdec-4232-8919-ea3da9448fad',
    portalId: '0_9705a7b7-fdec-4232-8919-ea3da9448fad',
    parameterKey: 'data',
    type: 'SubPortal',
    eventType: 'uploadGridData',
    data: input[0],
  },
];
return msg;
