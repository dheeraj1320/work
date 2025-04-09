console.log("Page node business rule ========================== >>>>>>>>>>>> ", input)

let UI_ELEMENT = [];
let VIEW_UI_ELEMENT = [];
let VIEW_NAVIGATION_STEP = [];
let VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE = [];
let pageViewList = [];
let testSetlist = [];

let TEST_SET_FOR_PAGE = [];
let TEST_CASE_FOR_PAGE_VIEW = [];
let TEST_CASE_DESCRIPTION = [];
let TEST_SUITE_TEST_SET = [];

const TEST_CASE_VIEW_NAVIGATION_STEP = [];
const TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE = [];
const FUNCTION_VIEW_NAVIGATION_STEP = [];
const FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE = [];

let testCaseStepList = [];
let testCaseStepAttributeValueList = [];
let testCaseFunctionStepList = [];
let testCaseFunctionStepAttributeValueList = [];
let testCaseFunctionUIElementGroupStepList = [];
let testCaseFunctionUIElementGroupStepAttributeList = [];
let testCaseUIElementGroupStepList = [];
let testCaseUIElementGroupStepAttributeList = [];
let testCaseRequirmentList = [];

let deletedTestCaseStepSet = new Set();
let deletedTestCaseStepAttributeValueSet = new Set();
let deletedTestCaseFunctionStepSet = new Set();
let deletedTestCaseFunctionStepAttributeValueSet = new Set();
let deletedTestCaseFunctionUIElementGroupStepSet = new Set();
let deletedTestCaseFunctionUIElementGroupStepAttributeSet = new Set();
let deletedTestCaseUIElementGroupStepSet = new Set();
let deletedTestCaseUIElementGroupStepAttributeSet = new Set();
let deletedTestCaseRequirmentSet = new Set();

function deleteRecord(primarykey, primarykeyvalue, deleteType, functionalareauuid = null) {

  let deleteParameter = {};

  deleteParameter[primarykey] = primarykeyvalue;
  deleteParameter["compositeEntityAction"] = "Delete";
  if(functionalareauuid) 
    deleteParameter["FUNCTIONAL_AREA_UUID"] = functionalareauuid;

  switch (deleteType) {
    case 'UI_ELEMENT':
      UI_ELEMENT.push(deleteParameter);
      break;
    case 'VIEW_UI_ELEMENT':
      VIEW_UI_ELEMENT.push(deleteParameter);
      break;
    case 'PAGE_VIEW':
      pageViewList.push(deleteParameter);
      break;
    case 'VIEW_NAVIGATION_STEP':
      VIEW_NAVIGATION_STEP.push(deleteParameter);
      break;
    case 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE':
      VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteParameter);
      break;
    case 'TEST_SET':
      testSetlist.push(deleteParameter);
      break;
    case 'TEST_SUITE_TEST_SET':
      TEST_SUITE_TEST_SET.push(deleteParameter);
      break;
    case 'TEST_CASE':
      TEST_CASE_FOR_PAGE_VIEW.push(deleteParameter);
      break;
    case 'TEST_CASE_DESCRIPTION':
      TEST_CASE_DESCRIPTION.push(deleteParameter);
      break;
    case 'TEST_CASE_VIEW_NAVIGATION_STEP':
      TEST_CASE_VIEW_NAVIGATION_STEP.push(deleteParameter);
      break;
    case 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE':
      TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteParameter);
      break;
    case 'FUNCTION_VIEW_NAVIGATION_STEP':
      FUNCTION_VIEW_NAVIGATION_STEP.push(deleteParameter);
      break;
    case 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE':
      FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteParameter);
      break;
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
    case 'TEST_CASE_REQUIREMENT':
      if (!deletedTestCaseRequirmentSet.has(primarykeyvalue)) {
        testCaseRequirmentList.push(deleteParameter);
        deletedTestCaseRequirmentSet.add(primarykeyvalue);
      }
      break;
  }

}

async function deleteTestCaseRequirmentData(testCaseRequirmentStr) {
  deleteRecord('TEST_CASE_REQUIREMENT_UUID', testCaseRequirmentStr, 'TEST_CASE_REQUIREMENT');
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



if (input.compositeEntityAction == "Update") {
  input["Informational_label"] = "";
  let testCaseFunctionStepList = [];
  let functionStepList = [];
  let pageQuery = `select * FROM PAGE WHERE PAGE_UUID=:PAGE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let pageQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", pageQuery, input);

  async function updateIsPureNavigationStep(isPureNavigationStep) {
    let testCaseStepQuery = `select tcs.TEST_CASE_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_STEP tcs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes'`;

    let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);

    for (let testCaseStep of testCaseStepQueryData) {
      let data = {};
      data["TEST_CASE_STEP_UUID"] = testCaseStep['TEST_CASE_STEP_UUID'];
      data["IS_PURE_NAVIGATION_STEP"] = isPureNavigationStep;
      testCaseStepList.push(data);
    }

    let testCaseFunctionStepQuery = `select tcfs.TEST_CASE_FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_FUNCTION_STEP tcfs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcfs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes'`;

    let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);

    for (let testCaseFunctionStep of testCaseFunctionStepQueryData) {
      let data = {};
      data["TEST_CASE_FUNCTION_STEP_UUID"] = testCaseFunctionStep['TEST_CASE_FUNCTION_STEP_UUID'];
      data["IS_PURE_NAVIGATION_STEP"] = isPureNavigationStep;
      testCaseFunctionStepList.push(data);
    }

    let functionStepQuery = `select fs.FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv 
        join FUNCTION_STEP fs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = fs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where fs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes'`;

    let functionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepQuery, input);

    for (let functionStep of functionStepQueryData) {
      let data = {};
      data["FUNCTION_STEP_UUID"] = functionStep['FUNCTION_STEP_UUID'];
      data["IS_PURE_NAVIGATION_STEP"] = isPureNavigationStep;
      functionStepList.push(data);
    }
  }

  if (
    pageQueryData['PAGE_ACCESS_RELATIVE_URL'] == input['PAGE_ACCESS_RELATIVE_URL'] ||
    (pageQueryData['PAGE_ACCESS_RELATIVE_URL'] && input['PAGE_ACCESS_RELATIVE_URL']) ||
    (!pageQueryData['PAGE_ACCESS_RELATIVE_URL'] && !input['PAGE_ACCESS_RELATIVE_URL'])
  ) {
    console.log('No data need to modify.');
  } else if (
    pageQueryData['PAGE_ACCESS_RELATIVE_URL'] != input['PAGE_ACCESS_RELATIVE_URL'] &&
    input['PAGE_ACCESS_RELATIVE_URL'] &&
    input['PAGE_ACCESS_RELATIVE_URL'].length > 0
  ) {
    await updateIsPureNavigationStep('No');
  } else if (
    pageQueryData['PAGE_ACCESS_RELATIVE_URL'] != input['PAGE_ACCESS_RELATIVE_URL'] &&
    (!input['PAGE_ACCESS_RELATIVE_URL'] || input['PAGE_ACCESS_RELATIVE_URL'].length == 0)
  ) {
    await updateIsPureNavigationStep('Yes');
  }

  let testSetListQuery = `SELECT ts.TEST_SET_UUID,p.PROCESS_NAME, ua.USER_ACTION_NAME FROM TEST_SET ts JOIN PROCESS p ON ts.PROCESS_UUID = p.PROCESS_UUID JOIN VIEW_USER_ACTION ua ON ts.USER_ACTION_UUID = ua.USER_ACTION_UUID WHERE ts.PAGE_UUID=:PAGE_UUID`;
  let testSetListQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testSetListQuery, input);
  for (let data of testSetListQueryData) {
    let object = {};
    object['TEST_SET_UUID'] = data['TEST_SET_UUID'];
    object['TEST_SET_NAME'] = data['PROCESS_NAME'] + ' - ' + input['PAGE_NAME'] + ' - ' + data['USER_ACTION_NAME'];
    testSetlist.push(object);
  }

  const pageNavigationTestSet = 'SELECT TEST_SET_UUID FROM TEST_SET WHERE PAGE_UUID = :PAGE_UUID AND TEST_SET_TYPE = "Page Navigation"';
  const pageNavigationTestSetData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", pageNavigationTestSet, input);

  if(pageNavigationTestSetData && pageNavigationTestSetData.length > 0){
    const obj = {};
    obj['TEST_SET_UUID'] = pageNavigationTestSetData[0]['TEST_SET_UUID'];
    obj['TEST_SET_NAME'] = input['PAGE_NAME'];
    testSetlist.push(obj);
  }

  input["AppEngChildEntity:FUNCTION_STEP"] = functionStepList;


} else if (input.compositeEntityAction == 'Delete') {

  
  // UI Element
  let uiElementsQuery = `SELECT UI_ELEMENT_UUID FROM UI_ELEMENT WHERE PAGE_NEW_UUID = :PAGE_UUID;`;
  let uiElementsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", uiElementsQuery, input);

  for (data of uiElementsQueryData) {
    deleteRecord('UI_ELEMENT_UUID', data['UI_ELEMENT_UUID'], 'UI_ELEMENT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

  // For Page View
  let pageViewQuery = `SELECT VIEW_UUID FROM PAGE_VIEW WHERE PAGE_UUID=:PAGE_UUID`;
  let pageViewQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", pageViewQuery, input);

  for (data of pageViewQueryData) {
    deleteRecord('VIEW_UUID', data['VIEW_UUID'], 'PAGE_VIEW', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

  const allViewUUIDS = pageViewQueryData.map(data => "'" + data['VIEW_UUID'] + "'").join(',');

  // for View Navigation Step
  let viewNavigationStepQuery = `SELECT VIEW_NAVIGATION_STEP_UUID FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID IN (${allViewUUIDS});`;
  let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepQuery, input);

  for (data of viewNavigationStepQueryData) {
    deleteRecord('VIEW_NAVIGATION_STEP_UUID', data['VIEW_NAVIGATION_STEP_UUID'], 'VIEW_NAVIGATION_STEP', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

  // for View Navigation Step Attribute Value
  let viewNavigationStepAttributeValueQuery = `SELECT VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE VIEW_UUID IN (${allViewUUIDS});`;
  let viewNavigationStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepAttributeValueQuery, input);

  for (data of viewNavigationStepAttributeValueQueryData) {
    deleteRecord('VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', data['VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

  // for TEST_CASE_VIEW_NAVIGATION_STEP
  const tcvnsQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP WHERE VIEW_UUID IN (${allViewUUIDS})`;
  const tcvnsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", tcvnsQuery, input);

  for (data of tcvnsQueryData) {
    deleteRecord('TEST_CASE_VIEW_NAVIGATION_STEP_UUID', data['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'], 'TEST_CASE_VIEW_NAVIGATION_STEP', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

  // for TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE
  const tcvnsavQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE VIEW_UUID IN (${allViewUUIDS})`;
  const tcvnsavQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", tcvnsavQuery, input);

  for (data of tcvnsavQueryData) {
    deleteRecord('TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', data['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

  // for FUNCTION_VIEW_NAVIGATION_STEP
  const fvnsQuery = `SELECT FUNCTION_VIEW_NAVIGATION_STEP_UUID FROM FUNCTION_VIEW_NAVIGATION_STEP WHERE VIEW_UUID IN (${allViewUUIDS})`;
  const fvnsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", fvnsQuery, input);

  for (data of fvnsQueryData) {
    deleteRecord('FUNCTION_VIEW_NAVIGATION_STEP_UUID', data['FUNCTION_VIEW_NAVIGATION_STEP_UUID'], 'FUNCTION_VIEW_NAVIGATION_STEP', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

  // for FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE
  const fvnsavQuery = `SELECT FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE VIEW_UUID IN (${allViewUUIDS})`;
  const fvnsavQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", fvnsavQuery, input);
  
  for (data of fvnsavQueryData) {
    deleteRecord('FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', data['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }


  // for View UI Element
  let viewUiElementsQuery = `SELECT VIEW_UI_ELEMENT_UUID FROM VIEW_UI_ELEMENT WHERE PAGE_UUID = :PAGE_UUID`;
  let viewUiElementsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewUiElementsQuery, input);

  for (data of viewUiElementsQueryData) {
    deleteRecord('VIEW_UI_ELEMENT_UUID', data['VIEW_UI_ELEMENT_UUID'], 'VIEW_UI_ELEMENT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

  // for Test Set
  let testSetQuery = `SELECT TEST_SET_UUID FROM TEST_SET WHERE PAGE_UUID = :PAGE_UUID and TEST_SET_TYPE = 'Page Navigation'`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testSetQuery, input);

  if(testSetQueryData && testSetQueryData.length > 0){
    deleteRecord('TEST_SET_UUID', testSetQueryData[0]['TEST_SET_UUID'], 'TEST_SET', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);

    const testSetTestSuiteQuery = `SELECT TEST_SUITE_TEST_SET_UUID FROM TEST_SUITE_TEST_SET WHERE TEST_SET_UUID = '${testSetQueryData[0]['TEST_SET_UUID']}'`;
    const testSetTestSuiteQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testSetTestSuiteQuery, input);

    for (data of testSetTestSuiteQueryData) {
      deleteRecord('TEST_SUITE_TEST_SET_UUID', data['TEST_SUITE_TEST_SET_UUID'], 'TEST_SUITE_TEST_SET', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    const testCaseQuery = `SELECT TEST_CASE_UUID, TEST_CASE_DESCRIPTION_UUID FROM TEST_CASE WHERE TEST_SET_UUID = '${testSetQueryData[0]['TEST_SET_UUID']}'`;
    const testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseQuery, input);

    for (data of testCaseQueryData) {
      deleteRecord('TEST_CASE_UUID', data['TEST_CASE_UUID'], 'TEST_CASE', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    const descriptionUUIDS = testCaseQueryData.map(data => data['TEST_CASE_DESCRIPTION_UUID']).join("','");
    const testCaseDescriptionQuery = `SELECT TEST_CASE_DESCRIPTION_UUID FROM TEST_CASE_DESCRIPTION WHERE TEST_CASE_DESCRIPTION_UUID IN ('${descriptionUUIDS}')`;
    const testCaseDescriptionQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseDescriptionQuery, input);

    for (data of testCaseDescriptionQueryData) {
      deleteRecord('TEST_CASE_DESCRIPTION_UUID', data['TEST_CASE_DESCRIPTION_UUID'], 'TEST_CASE_DESCRIPTION', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    for (let testCaseData of testCaseQueryData) {
      const testCaseUUID = testCaseData['TEST_CASE_UUID'];
      await deleteTestCaseDataAndSteps(testCaseUUID);

      const testCaseRequirmentQuery = `SELECT * FROM TEST_CASE_REQUIREMENT WHERE TEST_CASE_UUID = :TEST_CASE_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      let testCaseRequirmentQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseRequirmentQuery, { TEST_CASE_UUID: testCaseUUID, APP_LOGGED_IN_FUNTIONAL_AREA_ID: input.APP_LOGGED_IN_FUNTIONAL_AREA_ID });

      for (let requirmentData of testCaseRequirmentQueryData) {
        await deleteTestCaseRequirmentData(requirmentData['TEST_CASE_REQUIREMENT_UUID']);
      }
    }
  }


} else if (input.compositeEntityAction == "Insert" || input.compositeEntityAction == "Save") {
  const viewUUID = uuid();
  let data = {};
  let pageID = uuid();
  data["PAGE_UUID"] = input["PAGE_UUID"]? input["PAGE_UUID"] : pageID;
  data['VIEW_UUID'] = viewUUID;
  data["VIEW_NAME"] = 'Default View';
  data["IS_DEFAULT_VIEW"] = 'Yes';
  pageViewList.push(data);

  // Adding Test Set for the page
  const TEST_SET_UUID = uuid();
  let testSetObj = {};
  testSetObj['TEST_SET_NAME'] = input['PAGE_NAME'];
  testSetObj['TEST_SET_TYPE'] = 'Page Navigation';
  testSetObj['PAGE_UUID'] = input["PAGE_UUID"]? input["PAGE_UUID"] : pageID;;
  testSetObj['VIEW_UUID'] = viewUUID;
  testSetObj['TEST_SET_UUID'] = TEST_SET_UUID;
  testSetlist.push(testSetObj);

  // Linking test set to Page Navigation Test Suite
  const suiteQuery = `SELECT TEST_SUITE_UUID FROM TEST_SUITE WHERE FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID AND TEST_SUITE_TYPE = 'Page Navigation'`;
  const suiteQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", suiteQuery, input);

  if(suiteQueryData.length){
    const testSetTestSuiteObj = {};
    testSetTestSuiteObj['TEST_SET_UUID'] = TEST_SET_UUID;
    testSetTestSuiteObj['TEST_SUITE_UUID'] = suiteQueryData[0]['TEST_SUITE_UUID'];
    testSetTestSuiteObj['FUNCTIONAL_AREA_UUID'] = input.APP_LOGGED_IN_FUNTIONAL_AREA_ID;
    TEST_SUITE_TEST_SET.push(testSetTestSuiteObj);
  }


  // Adding Test Case for the page view
  const TEST_CASE_UUID = uuid();
  const TEST_CASE_DESCRIPTION_UUID = uuid();
  const testCaseObj = {};
  testCaseObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
  testCaseObj['TEST_CASE_NAME'] = 'Default View';
  testCaseObj['TEST_CASE_STATUS'] = 'COMMITTED';
  testCaseObj['TEST_SET_UUID'] = TEST_SET_UUID;
  testCaseObj['TEST_CASE_EXECUTON_TYPE'] = 'Manual';
  testCaseObj['ASSOCIATED_VIEW_UUID'] = viewUUID;
  testCaseObj['TEST_CASE_DESCRIPTION_UUID'] = TEST_CASE_DESCRIPTION_UUID;
  testCaseObj['compositeEntityAction'] = 'Insert';
  TEST_CASE_FOR_PAGE_VIEW.push(testCaseObj);

  // Adding Test Case Description
  const testCaseDescriptionObj = {};
  testCaseDescriptionObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
  testCaseDescriptionObj['TEST_CASE_DESCRIPTION_UUID'] = TEST_CASE_DESCRIPTION_UUID;
  TEST_CASE_DESCRIPTION.push(testCaseDescriptionObj);

  //Adding Test Case Step
  const TEST_CASE_STEP_UUID = uuid();
  const testCaseStepObj ={};
  testCaseStepObj['TEST_CASE_STEP_UUID'] = TEST_CASE_STEP_UUID;
  testCaseStepObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
  testCaseStepObj['TEST_SET_UUID'] = TEST_SET_UUID;
  testCaseStepObj['TEST_CASE_STEP_NAME'] = 'When User is on '+ input['PAGE_NAME']+' Page'
  testCaseStepObj['PAGE_UUID'] = input["PAGE_UUID"]? input["PAGE_UUID"] : pageID;;
  testCaseStepObj['VIEW_UUID'] = viewUUID;
  testCaseStepObj['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = '20b169ba-34aa-46d1-888d-9324b9b77bc8';
  testCaseStepObj['CURRENT_PAGE_CONTEXT'] = input["PAGE_UUID"]? input["PAGE_UUID"] : pageID;;
  testCaseStepObj['TEST_CASE_STEP_SEQ_ID'] = '1';
  testCaseStepObj['TEST_CASE_STEP_TYPE'] = 'Given'
  testCaseStepObj['IS_PURE_NAVIGATION_STEP'] = 'Yes';
  testCaseStepObj['IS_UI_ELEMENT_GROUP_STEP'] = 'No';
  testCaseStepObj['IS_FUNCTION_STEP'] = 'No';
  testCaseStepList.push(testCaseStepObj);

  //Adding Attribute Value For Test Case Step
  const testCaseStepAttributeObj ={};
  testCaseStepAttributeObj['STEP_DEFINITION_ATTRIBUTE_UUID'] = '11cf20fb-2cdf-4d03-a0b2-aad3644056af';
  testCaseStepAttributeObj['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input["PAGE_UUID"]? input["PAGE_UUID"] : pageID;;
  testCaseStepAttributeObj['TEST_SET_UUID'] = TEST_SET_UUID;
  testCaseStepAttributeObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
  testCaseStepAttributeObj['TEST_CASE_STEP_UUID'] = TEST_CASE_STEP_UUID;
  testCaseStepAttributeValueList.push(testCaseStepAttributeObj);
}

input["AppEngChildEntity:UI_ELEMENT"] = UI_ELEMENT;
input["AppEngChildEntity:VIEW_UI_ELEMENT_CHILD_OF_VIEW_UI_ELEMENT"] = VIEW_UI_ELEMENT;
input["AppEngChildEntity:PAGE_VIEW"] = pageViewList;

// -------------- 

input["AppEngChildEntity:TEST_SET_NEW"] = testSetlist;
input["AppEngChildEntity:INTEGRATION_TEST_CASE"] = TEST_CASE_FOR_PAGE_VIEW;
input['AppEngChildEntity:TEST_CASE_DESCRIPTION'] = TEST_CASE_DESCRIPTION;
input['AppEngChildEntity:TEST_SUITE_TEST_SET'] = TEST_SUITE_TEST_SET;

input['AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP'] = TEST_CASE_VIEW_NAVIGATION_STEP;
input['AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'] = TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE;
input['AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP'] = FUNCTION_VIEW_NAVIGATION_STEP;
input['AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'] = FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE;

input['AppEngChildEntity:TEST_CASE_STEP_NEW'] = testCaseStepList;
input['AppEngChildEntity:TEST_CASE_STEP_ATTRIBUTE_VALUE'] = testCaseStepAttributeValueList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP'] = testCaseFunctionStepList;
input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE"] = testCaseFunctionStepAttributeValueList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP'] = testCaseFunctionUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseFunctionUIElementGroupStepAttributeList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP'] = testCaseUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseUIElementGroupStepAttributeList;
input['AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT'] = testCaseRequirmentList;