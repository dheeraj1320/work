try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  console.log('inside refresh grid and show message microflow ::::::::::::: ', input[0]);
  msg.payload.result['mode'] = 'Enable Message';
  msg.payload.result['message'] = 'Deleted Successfully';
  msg.payload.result['pk'] =
    input[0]['ENTITY_TYPE'] != 'CONVERSATION_MESSAGE' ? input[0]['CONVERSATION_UUID_FOR_REPLY'] : '';
  msg.payload.result['modifyOtherCard'] = {};
  let dataGridCard;
  if (input[0]['ENTITY_TYPE'] === 'CONVERSATION_MESSAGE' && false) {
    dataGridCard =
      input[0].CONVERSATION_MESSAGE_UUID + '_0bfabfbe-0eb8-40ae-a5b9-8c0ed3081d8e_96acf353-d8b9-4b13-9596-805d402bb3e0';
    msg.payload.result.modifyOtherCard[dataGridCard] = [
      {
        parameter: 'data',
        parameterKey: 'CONVERSATION_MESSAGE_UUID',
        type: 'PortalDataGrid',
        parameterKeyValue: input[0].CONVERSATION_MESSAGE_UUID,
        type: 'RefreshGrid',
      },
    ];
  } else if (false) {
    dataGridCard = '0_df9154cc-dc89-4ec3-a348-3c5376d468b6';
    msg.payload.result.modifyOtherCard[dataGridCard] = [
      {
        parameter: 'data',
        parameterKey: 'CONVERSATION_UUID',
        type: 'PortalDataGrid',
        parameterKeyValue: '',
        type: 'RefreshGrid',
      },
    ];
  }
  console.log('inside conversation deleted succesfull ::::::::::::::::: ', input[0]);
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
