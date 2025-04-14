try {
  let input = msg.payload.apiRequestBody.baseEntity.childEntities[0].records;
  var valueArr = input.map(function (item) {
    return item.DATA_ELEMENT_UUID;
  });
  msg.payload['isErrorCheck'] = valueArr.some(function (item, idx) {
    return valueArr.indexOf(item) != idx;
  });
  if (msg.payload['isErrorCheck']) {
    msg.payload.result.mode = 'Enable Message';
    msg.payload.result.code = 406;
    msg.payload.result.errors = [
      {
        message: 'Same Data Element cannot be Added.',
        reason: 'Message On Form',
        warningMessage: '',
        location: 'bc3b912d-5cd2-4de1-8560-29c221189647=>0',
      },
    ];
  }
  node.send(msg);
  return;
} catch (e) {
  console.log('Error occurred:', e.message);
}

// --------------------------

try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  msg.payload.result.pk = input[0]['REQUIREMENT_UUID'];
  node.send(msg);
  return;
} catch (e) {
  console.log('Error occurred:', e.message);
}
