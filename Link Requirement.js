const AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
let input = msg.payload.apiRequestBody.baseEntity.records;
console.log('hello', input);
console.log(input[0].ASSOCIATION_TYPE, 'input[0].ASSOCIATION_TYPE::::');
let dataSetQuery = '';
if (input[0].ASSOCIATION_TYPE === 'FEATURE') {
  dataSetQuery = `SELECT * FROM IMPACTED_PROCESS WHERE REQUIREMENT_UUID=:REQUIREMENT_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and REQUIREMENT_TITLE_UUID=:REQUIREMENT_TITLE_UUID and IMPACTED_PROCESS_UUID=:IMPACTED_PROCESS_UUID`;
} else if (input[0].ASSOCIATION_TYPE === 'PAGE-EVENT') {
  dataSetQuery = `SELECT * FROM IMPACTED_PROCESS WHERE REQUIREMENT_UUID=:REQUIREMENT_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and REQUIREMENT_TITLE_UUID is null and IMPACTED_PROCESS_UUID=:IMPACTED_PROCESS_UUID`;
}
console.log(dataSetQuery, 'query');
const dataSet = `SELECT * FROM CONDITION_SATISFACTION WHERE REQUIREMENT_UUID=:REQUIREMENT_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
try {
  const dataSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', dataSetQuery, input[0]);
  const impacteddata = JSON.parse(JSON.stringify(dataSetQueryData));
  console.log('first data', impacteddata);
  let data = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', dataSet, input[0]);
  const conditiondata = JSON.parse(JSON.stringify(data));
  console.log('first juytdata', conditiondata);
  if (conditiondata && conditiondata.length > 0 && impacteddata[0] && impacteddata[0].ASSOCIATION_TYPE === 'FEATURE') {
    msg.payload['isErrorCheck'] = false;
    console.log('error1', msg.payload['isErrorCheck']);
  } else if (
    conditiondata &&
    conditiondata.length > 0 &&
    impacteddata[0] &&
    impacteddata[0].ASSOCIATION_TYPE === 'FEATURE'
  ) {
    msg.payload['isErrorCheck'] = false;
    console.log('error2', msg.payload['isErrorCheck']);
  } else if (
    conditiondata &&
    conditiondata.length > 0 &&
    impacteddata[0] &&
    impacteddata[0].ASSOCIATION_TYPE === 'FEATURE'
  ) {
    msg.payload['isErrorCheck'] = false;
    console.log('error3', msg.payload['isErrorCheck']);
  } else {
    msg.payload['isErrorCheck'] = false;
    console.log('error4', (msg.payload['isErrorCheck'] = false));
  }
  node.send(msg);
} catch (error) {
  console.error('Error occurred:', error);
}

// ------------------------------------------------

// ------------------------------------------------

let inputData = msg.payload.apiRequestBody;
console.log('jhgftrddfg', inputData);
try {
  let generatedKey;
  if (inputData.baseEntity.records[0].tab == 'AllIntegrationTestCases') {
    generatedKey =
      inputData.baseEntity.records[0].TEST_CASE_STEP_UUID +
      '_05dceca9-83ca-43bd-b1db-c4934d709c01_9445c3e4-f44a-4b70-833e-f76c4010cfdf';
  } else if (inputData.baseEntity.records[0].tab == 'AllUnitFunctionalTestCases') {
    if (
      inputData.baseEntity.records[0].TEST_CASE_UUID &&
      inputData.baseEntity.records[0].TEST_CASE_STEP_UUID &&
      inputData.baseEntity.records[0].TEST_CASE_STEP_UUID != 'null'
    ) {
      console.log('if called :::::::::::::::::::::::::::');
      generatedKey =
        inputData.baseEntity.records[0].TEST_CASE_STEP_UUID +
        '_0af0c61f-14fe-4639-8f97-63a8b360f8fa_f8a5de17-ad54-4e9d-aed1-126c3b15554a';
    } else {
      console.log('else called :::::::::::::::::::::::::::');
      generatedKey =
        inputData.baseEntity.records[0].TEST_CASE_UUID +
        '_3e5b3bf2-96cc-4ec3-84a6-45fab6e0e3e0_f8a5de17-ad54-4e9d-aed1-126c3b15554a';
    }
  }
  console.log('helllo', inputData.baseEntity.records[0]);
  msg.payload.result['modifyOtherCard'] = {};
  msg.payload.result.modifyOtherCard[generatedKey] = [{ parameter: 'referenceData', parameterKey: 'AE_RELOAD' }];
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured ', error.message);
}
return;
