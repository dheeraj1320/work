debugger;
console.log(' ---------------- HHHH --------------', msg.payload.apiRequestBody.baseEntity);
if (
  msg.payload.apiRequestBody.baseEntity.records &&
  msg.payload.apiRequestBody.baseEntity.records[0] &&
  msg.payload.apiRequestBody.baseEntity.records[0].attachmentData &&
  msg.payload.apiRequestBody.baseEntity.records[0].attachmentData.length > 0 &&
  msg.payload.apiRequestBody.baseEntity.records[0].attachmentData[0].attachment.length > 0
) {
  let fileName = msg.payload.apiRequestBody.baseEntity.records[0].attachmentData[0].attachment[0].fileName;
  msg.payload.documentName = fileName;
  let attachmentId = msg.payload.apiRequestBody.baseEntity.records[0].attachmentData[0].attachment[0].attachmentId;
  let fileNameList = fileName && fileName.split('.');
  let extention = fileNameList.slice(-1);
  fileName = fileName.replace('.' + extention[0], '_' + attachmentId + '.' + extention[0]);
  msg.payload.templateFile = fileName;
  delete msg.payload.apiRequestBody.baseEntity.records[0].attachmentData;
  delete msg.payload.entityGroupData.attachmentDetails;
  delete msg.payload.entityGroupData.logicalData.appData.data[0].attachmentData;
  msg.payload['isErrorCheck'] = false;
} else {
  msg.payload['isErrorCheck'] = true;
  msg.payload['infoMessage'] = 'Test Run zip is required.';
}
msg.payload.bucketType = 'tempBucket';
msg.payload.headerPosition = 4;
msg.payload.skipAttachmentUpload = true;
node.send(msg);

// ------------------
// ------------------
// ------------------

debugger;
const input = msg.payload.apiRequestBody.baseEntity.records[0];
const payload = msg.payload;
let message = 'Test Run Data Inserted Sucessfully!';
if (msg.payload['isErrorCheck']) {
  message = msg.payload.infoMessage;
} else if (msg.payload.automationZipError && msg.payload.automationZipError.length > 0) {
  message = msg.payload.automationZipError;
}
console.log(' is input input ::::::::::::::::::', input, payload);
let mode = {};
const generatedKey = '0_65d43c53-d390-42ab-ae53-68ebd46610d6';
mode = { mode: 'Enable Message', message };
msg.payload['result'] = mode;
msg.payload.result.modifyOtherCard = {};
msg.payload.result.modifyOtherCard[generatedKey] = [{ parameter: 'data', parameterKey: 'TEST_RUN_UUID', type: 'RefreshGrid', parameterKeyValue: 'ABCDEFGHIJKLMNOPARSTUV' }];
node.send(msg);
