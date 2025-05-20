AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
let input = msg.payload.apiRequestBody.baseEntity.records[0];
let deleteObj = {};
deleteObj['TEST_CASE_REQUIREMENT_UUID'] = input['TEST_CASE_REQUIREMENT_UUID'];
let Deleted = await serviceOrchestrator.delete(
  'TEST_CASE_REQUIREMENT',
  deleteObj,
  'PRIMARYSPRINGFM',
  'TEST_CASE_REQUIREMENT_UUID',
  'KNEX_DYNAMIC'
);
let mode = { mode: 'Enable Message', message: 'Unlinked Successfully' };
msg.payload['result'] = mode;
node.send(msg);

// ----------------------

let inputData = msg.payload.apiRequestBody;
try {
  let generatedKey;
  if (inputData.baseEntity.records[0].tab == 'LinkedIntegrationTestCases') {
    console.log('LinkedIntegrationTestCases :::::::::::::::::::::::::::::::::::::');
    generatedKey =
      inputData.baseEntity.records[0].TEST_CASE_STEP_UUID +
      '_05dceca9-83ca-43bd-b1db-c4934d709c01_68cae3ce-c4b0-4c09-9c47-3b50401b8b3c';
  } else if (inputData.baseEntity.records[0].tab == 'AllIntegrationTestCases') {
    generatedKey =
      inputData.baseEntity.records[0].TEST_CASE_STEP_UUID +
      '_05dceca9-83ca-43bd-b1db-c4934d709c01_9445c3e4-f44a-4b70-833e-f76c4010cfdf';
  } else if (inputData.baseEntity.records[0].tab == 'LinkedUnitFunctionalTestCases') {
    console.log('LinkedUnitFunctionalTestCases :::::::::::::::::::::::::::::::::::::');
    if (
      inputData.baseEntity.records[0].TEST_CASE_STEP_UUID &&
      inputData.baseEntity.records[0].TEST_CASE_UUID &&
      inputData.baseEntity.records[0].TEST_CASE_STEP_UUID != 'null'
    ) {
      console.log('LinkedUnitFunctionalTestCases if:::::::::::::::::::::::::::::::::::::');
      generatedKey =
        inputData.baseEntity.records[0].TEST_CASE_STEP_UUID +
        '_0af0c61f-14fe-4639-8f97-63a8b360f8fa_90532048-63c1-4d1f-ba53-f47ee0d440c0';
    } else {
      console.log('LinkedUnitFunctionalTestCases Else:::::::::::::::::::::::::::::::::::::');
      generatedKey =
        inputData.baseEntity.records[0].TEST_CASE_UUID +
        '_3e5b3bf2-96cc-4ec3-84a6-45fab6e0e3e0_90532048-63c1-4d1f-ba53-f47ee0d440c0';
    }
  } else if (inputData.baseEntity.records[0].tab == 'AllUnitFunctionalTestCases') {
    console.log('AllUnitFunctionalTestCases :::::::::::::::::::::::::::::::::::::');
    if (
      inputData.baseEntity.records[0].TEST_CASE_STEP_UUID &&
      inputData.baseEntity.records[0].TEST_CASE_UUID &&
      inputData.baseEntity.records[0].TEST_CASE_STEP_UUID != 'null'
    ) {
      console.log('AllUnitFunctionalTestCases if called :::::::::::::::::::::::::::::::::::::');
      generatedKey =
        inputData.baseEntity.records[0].TEST_CASE_STEP_UUID +
        '_0af0c61f-14fe-4639-8f97-63a8b360f8fa_f8a5de17-ad54-4e9d-aed1-126c3b15554a';
    } else {
      console.log(' AllUnitFunctionalTestCases else called :::::::::::::::::::::::::::::::::::::');
      generatedKey =
        inputData.baseEntity.records[0].TEST_CASE_UUID +
        '_3e5b3bf2-96cc-4ec3-84a6-45fab6e0e3e0_f8a5de17-ad54-4e9d-aed1-126c3b15554a';
    }
  }
  msg.payload.result['modifyOtherCard'] = {};
  msg.payload.result.modifyOtherCard[generatedKey] = [{ parameter: 'referenceData', parameterKey: 'AE_RELOAD' }];
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured ', error.message);
}
return;
