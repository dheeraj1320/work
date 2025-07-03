try {
  msg.payload.result = {};
  const AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let mode = {
    mode: 'Enable Message',
    message: 'Script Ran Successfully.'
  };
  const pageQuery = `SELECT PAGE_UUID, PAGE_NAME FROM PAGE ORDER BY PAGE_ID DESC;`;
  // await serviceOrchestrator.update('query', {'param': 'value'}, 'PRIMARYSPRINGFM');
  msg.payload['result'] = mode;
  node.send(msg);
} catch (t) {
  console.log('Error Occurred', t.message);
  return;
}
