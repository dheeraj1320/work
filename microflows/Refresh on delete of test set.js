try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  msg.payload.result['mode'] = 'Enable Message';
  msg.payload.result['message'] = 'Deleted Successfully';
  msg.payload.result['pk'] = '';
  msg.payload.result['modifyOtherCard'] = {};
  let dataGridCard;
  if (input[0].TAGS_UUID && input[0].TAGS_UUID.includes('1b763b10-f81c-11ee-8c09-9376aaa8e4da')) {
    if (input[0].GRID_NAME == 'Unit Functional Test Set') {
      dataGridCard = '0_ebaadb86-87d8-43b5-9ec1-8d928d8715eb';
    } else if (input[0].GRID_NAME == 'Orphan Test Set') {
      dataGridCard = '0_9a2fc215-2ec2-4450-8706-3a4d94e1992c';
    }
  } else {
    dataGridCard = '0_a74710c6-0404-42ec-a5f8-a5f6222b3e8c';
  }
  msg.payload.result.modifyOtherCard[dataGridCard] = [
    {
      parameter: 'data',
      parameterKey: 'TEST_SET_UUID',
      type: 'PortalDataGrid',
      parameterKeyValue: input[0].TEST_SET_UUID,
      type: 'RefreshGrid',
    },
  ];
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
