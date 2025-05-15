let input = msg.payload.apiRequestBody.baseEntity.records[0];
msg.payload.result = { mode: 'Insert', message: 'Updated Successfully' };
try {
  let generatedKey = '0_d1ae50fc-b730-4c46-975f-f31bd56667fb';
  msg.payload.result['modifyOtherCard'] = {};
  msg.payload.result.modifyOtherCard[generatedKey] = [
    {
      parameter: 'data',
      parameterKey: 'PAGE_UUID',
      type: 'PortalDataGrid',
      parameterKeyValue: input['PAGE_UUID'],
      changedData: { PAGE_NAME: input['PAGE_UUID'], PAGE_ACCESS_RELATIVE_URL: input['PAGE_ACCESS_RELATIVE_URL'] },
    },
  ];
  let keyForEditForm =
    input['PAGE_UUID'] + '_41270660-f213-406c-a978-a486ecebc497_5665a740-4c7d-4797-8bae-33c21bb71dab';
    msg.payload.result.modifyOtherCard[keyForEditForm] = [
      {
        parameter: 'data',
        parameterKey: 'AE_RELOAD',
      },
    ];
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured ', error.message);
}
return;
