try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  console.log('input[0]:::::', input[0]);
  debugger;
  const selectedFunctionalAreas = input.SELECTED_FUNCTIONAL_AREAS
    ? input.SELECTED_FUNCTIONAL_AREAS.split(',')
        .map((area) => `'${area.trim()}'`)
        .join(',')
    : `''`;
  if (!selectedFunctionalAreas || selectedFunctionalAreas === `''`) {
    console.log('Validation failed>>>>');
    msg.payload['isErrorCheck'] = true;
    msg.payload.result = {};
    msg.payload.result.code = 406;
    msg.payload.result.mode = 'Enable Message';
    const errorData = [{ message: 'Is Required.', reason: 'Message below form field', warningMessage: '', location: '5f17043c-3227-4545-87e3-c963b5e5d515=>0=>SELECTED_FUNCTIONAL_AREAS' }];
    msg.payload.result.errors = errorData;
  } else {
    msg.payload['isErrorCheck'] = false;
  }
  node.send(msg);
} catch (t) {
  console.log('Errorr Occured', t.message);
  return;
}
