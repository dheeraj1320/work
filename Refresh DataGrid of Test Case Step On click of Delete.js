try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  msg.payload.result['mode'] = 'Enable Message';
  msg.payload.result['message'] = 'Deleted Successfully';
  msg.payload.result['pk'] = '';
  msg.payload.result['modifyOtherCard'] = {};
  let dataGridCard =
    input[0].REQUIREMENT_UUID + '_4e3fe144-65bf-40da-a42d-e13c4c5408bd_b434885c-1bf2-47f2-b99c-b6fac0dcd7f7';
  msg.payload.result.modifyOtherCard[dataGridCard] = [
    {
      parameter: 'data',
      parameterKey: 'REQUIREMENT_UUID',
      type: 'PortalDataGrid',
      parameterKeyValue: input[0].REQUIREMENT_UUID,
      type: 'RefreshGrid',
    },
  ];
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured in Delete message for impacted process', error.message);
}
return;
