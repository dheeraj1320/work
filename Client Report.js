try {
  let input = msg.payload.apiRequestBody;
  const effectiveDate = new Date(input.CONTRACT_EFFECTIVE_DATE);
  const cancelDate = new Date(input.CONTRACT_CANCEL_DATE);

  msg.payload['isErrorCheck'] = cancelDate < effectiveDate ;

  if(msg.payload['isErrorCheck']){
    msg.payload.result = { message: 'Cancel Date cannot be greater than Effective Date.', mode: 'Enable Message' };
  }
  console.log('for error ============>>>>>>>>>>> ', input);
  node.send(msg);
} catch (e) {
  console.log('::::::::::::::::::::::::::', e.message);
}

// ------------------------

try {
  let input = msg.payload.apiRequestBody;
  msg.payload.result = { message: 'asdfgqwer', mode: 'Insert' };
  console.log('for asdfasdf ============>>>>>>>>>>> ', input);

  node.send(msg);
} catch (t) {
  console.log('Errorr Occured', t.message);
  return;
}
