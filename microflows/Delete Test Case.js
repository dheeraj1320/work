try {
  let input = msg.payload.apiRequestBody.baseEntity.records[0];
  msg.payload.result['mode'] = 'Enable Message';
  msg.payload.result['message'] = 'Deleted Successfully';
  msg.payload.result['pk'] = '';
  msg.payload.result['modifyOtherCard'] = {};
  let dataGridCard = input.TEST_SET_UUID;
  if (input['PARENT_GRID_NAME'] == 'Personal Test Set') {
    dataGridCard += '_0a10210a-c5d6-40d1-bbc2-cef05bc16e54_7771b533-2741-4d2a-a4e6-d08446c3ab81';
  } else if (input['PARENT_GRID_NAME'] == 'Unit Functional Test Set') {
    dataGridCard += '_5c4b27f5-f2e3-4220-8f6b-4c83604422b9_7771b533-2741-4d2a-a4e6-d08446c3ab81';
  } else if (input['PARENT_GRID_NAME'] == 'Orphan Test Set') {
    dataGridCard += '_9a903ec6-c08d-4815-b557-5cd4136a588d_7771b533-2741-4d2a-a4e6-d08446c3ab81';
  } else if (input['PARENT_GRID_NAME'] == 'Test Set') {
    dataGridCard += '_e399bb2a-e7b3-4e2c-a9ed-c7fd303d7962_7771b533-2741-4d2a-a4e6-d08446c3ab81';
  } else if (input['PARENT_GRID_NAME'] == 'Personal - Unit Functional Test Set') {
    dataGridCard += '_f4656ce7-bfbe-471e-a7e1-4c3e5e3543bf_7771b533-2741-4d2a-a4e6-d08446c3ab81';
  } else if (input['PARENT_GRID_NAME'] == 'Personal - Regular Test Set') {
    dataGridCard += '_e7168933-8b67-4540-9474-758ed9f27dc9_7771b533-2741-4d2a-a4e6-d08446c3ab81';
  } else if (input['PARENT_GRID_NAME'] == 'Personal - Orphan Test Set') {
    dataGridCard += '_4b77f551-e544-4fae-b4df-045ed493345c_7771b533-2741-4d2a-a4e6-d08446c3ab81';
  } else if (input['PARENT_GRID_NAME'] == 'Page Navigation Test Set') {
    dataGridCard += '_6acf847b-d130-4040-82d7-0f37a9713848_7771b533-2741-4d2a-a4e6-d08446c3ab81';
  }
  console.log('input[PARENT_GRID_NAME]', input['PARENT_GRID_NAME']);
  msg.payload.result.modifyOtherCard[dataGridCard] = [
    {
      parameter: 'data',
      parameterKey: 'TEST_CASE_UUID',
      type: 'PortalDataGrid',
      parameterKeyValue: input.TEST_CASE_UUID,
      type: 'RefreshGrid',
    },
  ];
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
