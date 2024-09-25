try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  msg.payload.result['mode'] = 'Enable Message';
  msg.payload.result['message'] = 'Deleted Successfully';
  msg.payload.result['pk'] = '';
  msg.payload.result['modifyOtherCard'] = {};
  let dataGridCard =
    input[0].VIEW_NAVIGATION_UUID + '_0ec166ef-25d9-488b-9548-3d8952315bab_480f4c57-48b4-11ef-bdb4-bf6e65503eee';
  msg.payload.result.modifyOtherCard[dataGridCard] = [
    {
      parameter: 'data',
      parameterKey: 'VIEW_NAVIGATION_STEP_UUID',
      type: 'PortalDataGrid',
      parameterKeyValue: input[0].VIEW_NAVIGATION_STEP_UUID,
      type: 'RefreshGrid',
    },
  ];
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
