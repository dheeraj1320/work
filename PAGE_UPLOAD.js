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
}
msg.payload.bucketType = 'tempBucket';
msg.payload.headerPosition = 4;
msg.payload.skipAttachmentUpload = true;
node.send(msg);

//^ ----------------------------------------

//^ ----------------------------------------

console.log('msg.payload :::::::::::::::::::::::::', msg.payload);
if (
  msg.payload.excelToJsonFormattedData &&
  Object.keys(msg.payload.excelToJsonFormattedData).length &&
  msg.payload.excelToJsonFormattedData.hasOwnProperty('Page UI Element Upload') &&
  msg.payload.entityGroupData.attachmentDetails &&
  msg.payload.entityGroupData.attachmentDetails.length == 1
) {
  msg.payload.entityGroupData.logicalData.appData.data[0]['excelToJsonFormattedData'] =
    msg.payload.excelToJsonFormattedData;
  console.log('::::::::::::::: if :::::::::::::::::::::;');
  msg.payload['isErrorCheck'] = false;
  msg.payload['infoMessage'] = 'Data Uploaded Successfully';
} else {
  console.log('::::::::::::::: else :::::::::::::::::::::;');
  if (!msg.payload.entityGroupData.attachmentDetails) {
    msg.payload['infoMessage'] = 'Please upload at least one attachment.';
    console.log(' :::::: if 22::::::::::::::: error');
  } else if (
    msg.payload.entityGroupData.attachmentDetails &&
    msg.payload.entityGroupData.attachmentDetails.length > 1
  ) {
    msg.payload['infoMessage'] = 'Only one attachment is allowed. Please remove any additional files and try again.';
    console.log(' :::::: else if 33::::::::::::::: error');
  } else if (
    msg.payload.entityGroupData.attachmentDetails &&
    msg.payload.entityGroupData.attachmentDetails.length == 1 &&
    msg.payload.entityGroupData.attachmentDetails[0].attachment &&
    msg.payload.entityGroupData.attachmentDetails[0].attachment.length &&
    msg.payload.entityGroupData.attachmentDetails[0].attachment[0].fileName &&
    !['xlsx', 'xlsm'].includes(
      msg.payload.entityGroupData.attachmentDetails[0].attachment[0].fileName.split('.').pop().toLowerCase()
    )
  ) {
    msg.payload['infoMessage'] = 'Only xlsx/xlsm file types are allowed. Please upload a valid Excel file.';
  } else if (
    msg.payload.entityGroupData.attachmentDetails &&
    msg.payload.entityGroupData.attachmentDetails.length == 1 &&
    msg.payload.excelToJsonFormattedData &&
    Object.keys(msg.payload.excelToJsonFormattedData).length &&
    !msg.payload.excelToJsonFormattedData['Page UI Element Upload']
  ) {
    console.log(' :::::: else if 55::::::::::::::: error');
    msg.payload['infoMessage'] = 'Attachment should have Page UI Element Upload.';
  }
  msg.payload['isErrorCheck'] = true;
}
node.send(msg);

//^ ----------------------------------------

//^ ----------------------------------------

function generateExcelData(inputData) {
  let mainArray = [];
  for (let data of inputData) {
    let dataArray = [];
    if (data.hasOwnProperty('Status')) {
      dataArray.push(data['Status']);
    }
    if (data.hasOwnProperty('Comments')) {
      dataArray.push(data['Comments']);
    }
    for (let key in data) {
      if (key !== 'Status' && key !== 'Comments') {
        dataArray.push(data[key]);
      }
    }
    mainArray.push(dataArray);
  }
  return mainArray;
}
console.log('will Enter from here');
let errordataList = [];
let parentErrorDataList = [];
for (const dataEntry of msg.payload.entityGroupData.logicalData.childLogicalData[0].appData.data) {
  if (dataEntry.errorMessage) {
    parentErrorDataList.push(dataEntry.Row_Index);
  }
}
for (const logicalData of msg.payload.entityGroupData.logicalData.childLogicalData) {
  const dataIndexPass = msg.payload.entityGroupData.logicalData.childLogicalData.indexOf(logicalData);
  for (const lcData of logicalData.appData.data) {
    const dataInnerPass =
      msg.payload.entityGroupData.logicalData.childLogicalData[dataIndexPass].appData.data.indexOf(lcData);
    let errorMap = {};
    errorMap['errorMessage'] = '';
    if (lcData.Parent_Index && parentErrorDataList.includes(lcData.Parent_Index)) {
      errorMap['errorMessage'] = 'Can not processes as Page not persisted. ';
    }
    if (lcData.errorMessage) {
      errorMap['errorMessage'] = errorMap['errorMessage'] + lcData.errorMessage;
    }
    if (!lcData.errorMessage && errorMap['errorMessage']) {
      msg.payload.entityGroupData.logicalData.childLogicalData[dataIndexPass].appData.data[dataInnerPass][
        'errorMessage'
      ] = errorMap['errorMessage'];
    }
    errorMap['rowIndex'] = lcData.Row_Index;
    errordataList.push(errorMap);
  }
}
errordataList.forEach((error) => {
  if (error.rowIndex) {
    const index = error.rowIndex - 1;
    if (msg.payload.excelToJsonFormattedData['Page UI Element Upload'][index]) {
      if (
        msg.payload.excelToJsonFormattedData['Page UI Element Upload'][index]['Comments'] &&
        msg.payload.excelToJsonFormattedData['Page UI Element Upload'][index]['Status'] &&
        error.errorMessage
      ) {
        msg.payload.excelToJsonFormattedData['Page UI Element Upload'][index]['Status'] = 'Skipped';
        msg.payload.excelToJsonFormattedData['Page UI Element Upload'][index]['Comments'] += `; ${error.errorMessage}`;
      } else if (error.errorMessage) {
        msg.payload.excelToJsonFormattedData['Page UI Element Upload'][index]['Status'] = 'Skipped';
        msg.payload.excelToJsonFormattedData['Page UI Element Upload'][index]['Comments'] = error.errorMessage;
      } else if (
        !msg.payload.excelToJsonFormattedData['Page UI Element Upload'][index].hasOwnProperty('Comments') &&
        !msg.payload.excelToJsonFormattedData['Page UI Element Upload'][index].hasOwnProperty('Status')
      ) {
        msg.payload.excelToJsonFormattedData['Page UI Element Upload'][index]['Status'] = 'Processed';
        msg.payload.excelToJsonFormattedData['Page UI Element Upload'][index]['Comments'] = '';
      }
    }
  }
});
msg.payload.documentData = {};
let objectData = {};
objectData['Page UI Element Upload'] = generateExcelData(
  msg.payload.excelToJsonFormattedData['Page UI Element Upload']
);
Object.assign(msg.payload.documentData, objectData);
msg.payload.result = {};
if (msg.payload.message == 'Validation Failed') {
  msg.payload['infoMessage'] = 'Records processing is completed. Please check downloaded file for results';
}
msg.payload.templateFile = 'Page_UI_Element_Response_Template.xlsm';
msg.payload.startCell = 'A5';
console.log('will call excludeErrorData');
node.send(msg);

//^ ----------------------------------------

//^ ----------------------------------------

if (msg.payload['isErrorCheck']) {
  console.log(' is error occured ::::::::::::::::::');
  let mode = {};
  mode = { mode: 'Enable Message', message: msg.payload['infoMessage'] };
  msg.payload['result'] = mode;
  node.send(msg);
} else {
  console.log(' is not error occured ::::::::::::::::::');
  msg.payload.result.mode = 'Insert';
  msg.payload.result.message = msg.payload['infoMessage'];
  msg.payload.result.documentName = msg.payload.documentName;
  msg.payload.result.navigation = {};
  msg.payload.result.navigation.operationType = 'GenerateExcelTemplateDocument';
  node.send(msg);
}
