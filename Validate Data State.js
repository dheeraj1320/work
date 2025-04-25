try {
  let input = msg.payload.apiRequestBody.baseEntity.childEntities[0].records;

  let combinationArr = input.map((item) => `${item.DATA_SET_UUID}|${item.DATA_ELEMENT_UUID}`);

  msg.payload['isErrorCheck'] = combinationArr.some((item, idx) => {
    return combinationArr.indexOf(item) !== idx;
  });

  if (msg.payload['isErrorCheck']) {
    msg.payload.result.mode = 'Enable Message';
    msg.payload.result.code = 406;
    msg.payload.result.errors = [
      {
        message: 'Cannot add same Data Set and Data Element.',
        reason: 'Message On Form',
        warningMessage: '',
        location: '2a2a1059-ad99-4eeb-8922-f8e3b8b4c426=>0',
      },
    ];
  }

  console.log('input inside validate data state :::::::: ', input);
  node.send(msg);
  return;
} catch (e) {
  console.log('Error occurred:', e.message);
}

// --------------------

try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  msg.payload.result.pk = input[0]['DATA_STATE_UUID'];
  node.send(msg);
  return;
} catch (e) {
  console.log('Error occurred:', e.message);
}
