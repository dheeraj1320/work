try {
  let input = msg.payload.apiRequestBody.baseEntity.records;
  msg.payload.result['mode'] = 'Insert';
  msg.payload.result['message'] = 'Deleted Successfully';
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured in Delete message for impacted process', error.message);
}
return;
