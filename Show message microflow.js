try {
    let input = msg.payload.apiRequestBody.baseEntity.records;
    console.log('inpput in microflo ============= >>>>>>>>>>> ', input)
    msg.payload.result['mode'] = 'Enable Message';
    msg.payload.result['message'] = 'Deleted Successfully';
    msg.payload.result['pk'] = '';
    msg.payload.result['modifyOtherCard'] = {};
    let dataGridCard;
    if(input[0]['CONVERSATION_MESSAGE_UUID']){
        dataGridCard = '20ed3f6b-a5f4-4c5d-9e1f-933913936e41_0bfabfbe-0eb8-40ae-a5b9-8c0ed3081d8e_96acf353-d8b9-4b13-9596-805d402bb3e0';
        msg.payload.result.modifyOtherCard[dataGridCard] = [
          {
            parameter: 'data',
            parameterKey: 'CONVERSATION_MESSAGE_UUID',
            type: 'PortalDataGrid',
            parameterKeyValue: input[0].CONVERSATION_MESSAGE_UUID,
            type: 'RefreshGrid',
          },
        ];
    }else if(input[0]['CONVERSATION_UUID_FOR_REPLY']){
        dataGridCard = '0_9a3ea4a6-9ba1-4978-874d-11a6f1c38ea8';
        msg.payload.result.modifyOtherCard[dataGridCard] = [
          {
            parameter: 'data',
            parameterKey: 'CONVERSATION_UUID',
            type: 'PortalDataGrid',
            parameterKeyValue: input[0].CONVERSATION_UUID_FOR_REPLY,
            type: 'RefreshGrid',
          },
        ];
    }

    node.send(msg);
} catch (error) {
  console.log('Errorr Occured ', error.message);
}
return;
