try {
  debugger;
  if (msg.payload.apiRequestBody.action == 'Activate') {
    msg.payload.result.message = 'Data Sync Activated';
  } else if (msg.payload.apiRequestBody.action == 'Deactivate') {
    msg.payload.result.message = 'Data Sync Deactivated';
  }
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured ', error.message);
  node.send(msg);
}
return;
