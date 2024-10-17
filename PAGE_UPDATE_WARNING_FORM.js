let input = msg.payload.apiRequestBody.baseEntity.records;
console.log('inputtttttt', input);
let AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
msg.payload['isOpenModal'] = true;

node.send(msg);

return;
