
  let testSetlist = [];
  let testCaseStepList = [];
  let testCaseStepAttributeValueList = [];
  let testCaseFunctionStepList = [];
  let testCaseFunctionStepAttributeValueList = [];
  let testCaseFunctionUIElementGroupStepList = [];
  let testCaseFunctionUIElementGroupStepAttributeList = [];
  let testCaseUIElementGroupStepList = [];
  let testCaseUIElementGroupStepAttributeList = [];

  let deletedTestCaseStepSet = new Set();
  let deletedTestCaseStepAttributeValueSet = new Set();
  let deletedTestCaseFunctionStepSet = new Set();
  let deletedTestCaseFunctionStepAttributeValueSet = new Set();
  let deletedTestCaseFunctionUIElementGroupStepSet = new Set();
  let deletedTestCaseFunctionUIElementGroupStepAttributeSet = new Set();
  let deletedTestCaseUIElementGroupStepSet = new Set();
  let deletedTestCaseUIElementGroupStepAttributeSet = new Set();

  if (input.compositeEntityAction == 'Update') {

  function deleteRecord(primarykey, primarykeyvalue, deleteType, functionalareauuid = null) {
    let deleteParameter = {};

    deleteParameter[primarykey] = primarykeyvalue;
    deleteParameter['compositeEntityAction'] = 'Delete';
    if (functionalareauuid) deleteParameter['FUNCTIONAL_AREA_UUID'] = functionalareauuid;

    switch (deleteType) {
      case 'TEST_CASE_STEP':
        if (!deletedTestCaseStepSet.has(primarykeyvalue)) {
          testCaseStepList.push(deleteParameter);
          deletedTestCaseStepSet.add(primarykeyvalue);
        }
        break;
      case 'TEST_CASE_STEP_ATTRIBUTE_VALUE':
        if (!deletedTestCaseStepAttributeValueSet.has(primarykeyvalue)) {
          testCaseStepAttributeValueList.push(deleteParameter);
          deletedTestCaseStepAttributeValueSet.add(primarykeyvalue);
        }
        break;
      case 'TEST_CASE_FUNCTION_STEP':
        if (!deletedTestCaseFunctionStepSet.has(primarykeyvalue)) {
          testCaseFunctionStepList.push(deleteParameter);
          deletedTestCaseFunctionStepSet.add(primarykeyvalue);
        }
        break;
      case 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE':
        if (!deletedTestCaseFunctionStepAttributeValueSet.has(primarykeyvalue)) {
          testCaseFunctionStepAttributeValueList.push(deleteParameter);
          deletedTestCaseFunctionStepAttributeValueSet.add(primarykeyvalue);
        }
        break;
      case 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP':
        if (!deletedTestCaseFunctionUIElementGroupStepSet.has(primarykeyvalue)) {
          testCaseFunctionUIElementGroupStepList.push(deleteParameter);
          deletedTestCaseFunctionUIElementGroupStepSet.add(primarykeyvalue);
        }
        break;
      case 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE':
        if (!deletedTestCaseFunctionUIElementGroupStepAttributeSet.has(primarykeyvalue)) {
          testCaseFunctionUIElementGroupStepAttributeList.push(deleteParameter);
          deletedTestCaseFunctionUIElementGroupStepAttributeSet.add(primarykeyvalue);
        }
        break;
      case 'TEST_CASE_UI_ELEMENT_GROUP_STEP':
        if (!deletedTestCaseUIElementGroupStepSet.has(primarykeyvalue)) {
          testCaseUIElementGroupStepList.push(deleteParameter);
          deletedTestCaseUIElementGroupStepSet.add(primarykeyvalue);
        }
        break;
      case 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE':
        if (!deletedTestCaseUIElementGroupStepAttributeSet.has(primarykeyvalue)) {
          testCaseUIElementGroupStepAttributeList.push(deleteParameter);
          deletedTestCaseUIElementGroupStepAttributeSet.add(primarykeyvalue);
        }
        break;
    }
  }

  
async function deleteTestCaseStepData(testCaseStepUUID) {
  deleteRecord('TEST_CASE_STEP_UUID', testCaseStepUUID, 'TEST_CASE_STEP');
}

async function deleteTestCaseStepAttributeData(testCaseStepUUID) {
  const testCaseStepAttributeQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeQuery, input);
  for (let attributeData of testCaseStepAttributeQueryData) {
      await deleteRecord('TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_STEP_ATTRIBUTE_VALUE');
  }
}

async function deleteTestCaseUIElementGroupStepData(testCaseStepUUID) {
  const testCaseUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementGroupStepQuery, input);
  for (let data of testCaseUIElementGroupStepQueryData) {
      await deleteRecord('TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP');
  }
}

async function deleteTestCaseUIElementGroupStepAttributeData(testCaseStepUUID) {
  const testCaseUIElementGroupStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementGroupStepAttributeValueQuery, input);
  for (let attributeData of testCaseUIElementGroupStepAttributeValueQueryData) {
      await deleteRecord('TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
  }
}

async function deleteTestCaseFunctionStepData(testCaseStepUUID) {
  const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
  for (let data of testCaseFunctionStepData) {
      await deleteRecord('TEST_CASE_FUNCTION_STEP_UUID', data['TEST_CASE_FUNCTION_STEP_UUID'], 'TEST_CASE_FUNCTION_STEP');
  }
}

async function deleteTestCaseFunctionStepAttributeData(testCaseStepUUID) {
  const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
  for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
      await deleteRecord('TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE');
  }
}

async function deleteTestCaseFunctionUIElementGroupStepData(testCaseStepUUID) {
  const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);
  for (let data of testCaseFunctionUIElementGroupStepQueryData) {
      await deleteRecord('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP');
  }
}

async function deleteTestCaseFunctionUIElementGroupStepAttributeData(testCaseStepUUID) {
  const testCaseFunctionUIElementGroupStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeValueQuery, input);
  for (let attributeData of testCaseFunctionUIElementGroupStepAttributeValueQueryData) {
      await deleteRecord('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
  }
}

async function deleteTestCaseDataAndSteps(testCaseUUID) {

  const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP WHERE TEST_CASE_UUID = :TEST_CASE_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, { TEST_CASE_UUID: testCaseUUID, APP_LOGGED_IN_FUNTIONAL_AREA_ID: input.APP_LOGGED_IN_FUNTIONAL_AREA_ID });

  for (let stepData of testCaseStepQueryData) {
      const testCaseStepUUID = stepData['TEST_CASE_STEP_UUID'];
      await deleteTestCaseStepData(testCaseStepUUID);
       await deleteTestCaseStepAttributeData("'" + testCaseStepUUID + "'");
             if (stepData["IS_UI_ELEMENT_GROUP_STEP"] === 'Yes' && stepData["IS_FUNCTION_STEP"] === 'No') {
          await deleteTestCaseUIElementGroupStepData("'" + testCaseStepUUID + "'");
          await deleteTestCaseUIElementGroupStepAttributeData("'" + testCaseStepUUID + "'");
      } else if (stepData["IS_UI_ELEMENT_GROUP_STEP"] === 'No' && stepData["IS_FUNCTION_STEP"] === 'Yes') {
          await deleteTestCaseFunctionStepData("'" + testCaseStepUUID + "'");
          await deleteTestCaseFunctionStepAttributeData("'" + testCaseStepUUID + "'");

          const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP WHERE TEST_CASE_STEP_UUID = :TEST_CASE_STEP_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, { TEST_CASE_STEP_UUID: testCaseStepUUID, APP_LOGGED_IN_FUNTIONAL_AREA_ID: input.APP_LOGGED_IN_FUNTIONAL_AREA_ID });

          for (let functionUIElementGroupStepData of testCaseFunctionUIElementGroupStepQueryData) {
              await deleteTestCaseFunctionUIElementGroupStepData("'" + functionUIElementGroupStepData['TEST_CASE_STEP_UUID'] + "'");
              await deleteTestCaseFunctionUIElementGroupStepAttributeData("'" + functionUIElementGroupStepData['TEST_CASE_STEP_UUID'] + "'");
          }
      }
  }
}

  // Delete Records
  input['Informational_label'] = '';
  if (input['PAGE_ACCESS_RELATIVE_URL']) {
    // Fetching associated TEST_CASE
    const testCaseQuery = `select TEST_CASE_UUID from TEST_CASE where ASSOCIATED_VIEW_UUID in (select VIEW_UUID from PAGE_VIEW where PAGE_UUID=:PAGE_UUID AND IS_DEFAULT_VIEW = 'Yes')`;
    const testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      testCaseQuery,
      input
    );

    if(testCaseQueryData.length > 0) {
      const testCaseUUID = testCaseQueryData[0].TEST_CASE_UUID;
      await deleteTestCaseDataAndSteps(testCaseUUID);
    }

    // Update IS_PURE_NAVIGATION_STEP for TEST_CASE_STEP
    let QueryToFetchTestCaseStep = `select tcs.* from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_STEP tcs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

    let QueryToFetchTestCaseStepData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      QueryToFetchTestCaseStep,
      input
    );
    let QuerytoFetchTestCaseStepRecords = JSON.parse(JSON.stringify(QueryToFetchTestCaseStepData));

    let TestCaseStep = [];
    for (let key in QuerytoFetchTestCaseStepRecords) {
      let data = {};

      data['TEST_CASE_STEP_UUID'] = QuerytoFetchTestCaseStepRecords[key].TEST_CASE_STEP_UUID;
      data['IS_PURE_NAVIGATION_STEP'] = 'No';

      TestCaseStep.push(data);
    }

    // Update IS_PURE_NAVIGATION_STEP for TEST_CASE_FUNCTION_STEP
    let QueryToFetchTestCaseFunctionStep = `
          select tcfs.TEST_CASE_FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_FUNCTION_STEP tcfs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcfs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

    let QueryToFetchTestCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      QueryToFetchTestCaseFunctionStep,
      input
    );
    let QuerytoFetchTestCaseFunctionStepRecords = JSON.parse(JSON.stringify(QueryToFetchTestCaseFunctionStepData));

    let TestCaseFunctionStep = [];

    for (let key in QuerytoFetchTestCaseFunctionStepRecords) {
      let data = {};
      data['TEST_CASE_FUNCTION_STEP_UUID'] = QuerytoFetchTestCaseFunctionStepRecords[key].TEST_CASE_FUNCTION_STEP_UUID;
      data['IS_PURE_NAVIGATION_STEP'] = 'No';

      TestCaseFunctionStep.push(data);
    }

    // Update IS_PURE_NAVIGATION_STEP for FUNCTION_STEP
    let QueryToFetchFunctionStep = `
      select fs.FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv 
      join FUNCTION_STEP fs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = fs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where fs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

    let QueryToFetchFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      QueryToFetchFunctionStep,
      input
    );
    let QuerytoFetchFunctionStepRecords = JSON.parse(JSON.stringify(QueryToFetchFunctionStepData));

    let FunctionStep = [];

    for (let key in QuerytoFetchFunctionStepRecords) {
      let data = {};
      data['FUNCTION_STEP_UUID'] = QuerytoFetchFunctionStepRecords[key].FUNCTION_STEP_UUID;
      data['IS_PURE_NAVIGATION_STEP'] = 'No';

      FunctionStep.push(data);
    }

    input['AppEngChildEntity:TEST_CASE_STEP_NEW'] = TestCaseStep;
    input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP'] = TestCaseFunctionStep;
    input['AppEngChildEntity:FUNCTION_STEP'] = FunctionStep;
  } else {
    // Update IS_PURE_NAVIGATION_STEP for TEST_CASE_STEP
    let QueryToFetchTestCaseStep = `select tcs.TEST_CASE_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_STEP tcs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

    let QueryToFetchTestCaseStepData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      QueryToFetchTestCaseStep,
      input
    );
    let QuerytoFetchTestCaseStepRecords = JSON.parse(JSON.stringify(QueryToFetchTestCaseStepData));

    let TestCaseStep = [];

    for (let key in QuerytoFetchTestCaseStepRecords) {
      let data = {};
      data['TEST_CASE_STEP_UUID'] = QuerytoFetchTestCaseStepRecords[key].TEST_CASE_STEP_UUID;
      data['IS_PURE_NAVIGATION_STEP'] = 'Yes';

      TestCaseStep.push(data);
    }

    // Update IS_PURE_NAVIGATION_STEP for TEST_CASE_FUNCTION_STEP
    let QueryToFetchTestCaseFunctionStep = `
          select tcfs.TEST_CASE_FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_FUNCTION_STEP tcfs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcfs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

    let QueryToFetchTestCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      QueryToFetchTestCaseFunctionStep,
      input
    );
    let QuerytoFetchTestCaseFunctionStepRecords = JSON.parse(JSON.stringify(QueryToFetchTestCaseFunctionStepData));

    let TestCaseFunctionStep = [];

    for (let key in QuerytoFetchTestCaseFunctionStepRecords) {
      let data = {};
      data['TEST_CASE_FUNCTION_STEP_UUID'] = QuerytoFetchTestCaseFunctionStepRecords[key].TEST_CASE_FUNCTION_STEP_UUID;
      data['IS_PURE_NAVIGATION_STEP'] = 'Yes';

      TestCaseFunctionStep.push(data);
    }

    // Update IS_PURE_NAVIGATION_STEP for FUNCTION_STEP
    let QueryToFetchFunctionStep = `
      select fs.FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv 
      join FUNCTION_STEP fs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = fs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where fs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

    let QueryToFetchFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      QueryToFetchFunctionStep,
      input
    );
    let QuerytoFetchFunctionStepRecords = JSON.parse(JSON.stringify(QueryToFetchFunctionStepData));

    let FunctionStep = [];

    for (let key in QuerytoFetchFunctionStepRecords) {
      let data = {};
      data['FUNCTION_STEP_UUID'] = QuerytoFetchFunctionStepRecords[key].FUNCTION_STEP_UUID;
      data['IS_PURE_NAVIGATION_STEP'] = 'Yes';

      FunctionStep.push(data);
    }

    input['AppEngChildEntity:TEST_CASE_STEP_NEW'] = TestCaseStep;
    input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP'] = TestCaseFunctionStep;
    input['AppEngChildEntity:FUNCTION_STEP'] = FunctionStep;
  }


  const pageNavigationTestSet = 'SELECT TEST_SET_UUID FROM TEST_SET WHERE PAGE_UUID = :PAGE_UUID AND TEST_SET_TYPE = "Page Navigation"';
  const pageNavigationTestSetData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", pageNavigationTestSet, input);

  if(pageNavigationTestSetData && pageNavigationTestSetData.length > 0){
    const obj = {};
    obj['TEST_SET_UUID'] = pageNavigationTestSetData[0]['TEST_SET_UUID'];
    obj['TEST_SET_NAME'] = input['PAGE_NAME'];
    testSetlist.push(obj);
  }
}


input["AppEngChildEntity:TEST_SET_NEW"] = testSetlist;
input['AppEngChildEntity:TEST_CASE_STEP_NEW'] = testCaseStepList;
input['AppEngChildEntity:TEST_CASE_STEP_ATTRIBUTE_VALUE'] = testCaseStepAttributeValueList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP'] = testCaseFunctionStepList;
input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE"] = testCaseFunctionStepAttributeValueList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP'] = testCaseFunctionUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseFunctionUIElementGroupStepAttributeList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP'] = testCaseUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseUIElementGroupStepAttributeList;