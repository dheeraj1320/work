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

function deleteRecord(primarykey, primarykeyvalue, tablename, functionalareauuid) {

  let deleteTableData = {};

  deleteTableData[primarykey] = primarykeyvalue;
  deleteTableData["compositeEntityAction"] = "Delete";
  deleteTableData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;

  if (tablename == 'UI_ELEMENT') {
    UI_ELEMENT.push(deleteTableData);
  } else if (tablename == 'VIEW_UI_ELEMENT') {
    VIEW_UI_ELEMENT.push(deleteTableData);
  } else if (tablename == 'VIEW_NAVIGATION_STEP') {
    VIEW_NAVIGATION_STEP.push(deleteTableData);
  } else if (tablename == 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE') {
    VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteTableData);
  } else if (tablename == 'PAGE_VIEW') {
    pageViewList.push(deleteTableData);
  }
}

if (input.compositeEntityAction == "Update") {
  input["Informational_label"] = "";
  let testCaseStepList = [];
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

  if (pageQueryData['PAGE_ACCESS_RELATIVE_URL'] == input["PAGE_ACCESS_RELATIVE_URL"] || (pageQueryData['PAGE_ACCESS_RELATIVE_URL'] && input["PAGE_ACCESS_RELATIVE_URL"]) || (!pageQueryData['PAGE_ACCESS_RELATIVE_URL'] && !input["PAGE_ACCESS_RELATIVE_URL"])) {
    console.log('No data need to modify.');
  } else if (pageQueryData['PAGE_ACCESS_RELATIVE_URL'] != input["PAGE_ACCESS_RELATIVE_URL"] && input["PAGE_ACCESS_RELATIVE_URL"].length > 0) {
    await updateIsPureNavigationStep('No');
  } else if (pageQueryData['PAGE_ACCESS_RELATIVE_URL'] != input["PAGE_ACCESS_RELATIVE_URL"] && input["PAGE_ACCESS_RELATIVE_URL"].length == 0) {
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

  input["AppEngChildEntity:TEST_SET_NEW"] = testSetlist;
  input["AppEngChildEntity:TEST_CASE_STEP_NEW"] = testCaseStepList;
  input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP"] = testCaseFunctionStepList;
  input["AppEngChildEntity:FUNCTION_STEP"] = functionStepList;
} else if (input.compositeEntityAction == 'Delete') {
  // UI Element
  let uiElementsQuery = `SELECT UI_ELEMENT_UUID FROM UI_ELEMENT WHERE PAGE_NEW_UUID = :PAGE_UUID;`;
  let uiElementsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", uiElementsQuery, input);

  for (data of uiElementsQueryData) {
    deleteRecord('UI_ELEMENT_UUID', data['UI_ELEMENT_UUID'], 'UI_ELEMENT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

  // for View UI Element
  let viewUiElementsQuery = `SELECT VIEW_UI_ELEMENT_UUID FROM VIEW_UI_ELEMENT WHERE PAGE_UUID = :PAGE_UUID`;
  let viewUiElementsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewUiElementsQuery, input);

  for (data of viewUiElementsQueryData) {
    deleteRecord('VIEW_UI_ELEMENT_UUID', data['VIEW_UI_ELEMENT_UUID'], 'VIEW_UI_ELEMENT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }


  // for View Navigation Step
  let viewNavigationStepQuery = `SELECT VIEW_NAVIGATION_STEP_UUID FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID IN (SELECT VIEW_UUID FROM PAGE_VIEW WHERE PAGE_UUID = :PAGE_UUID);`;
  let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepQuery, input);

  for (data of viewNavigationStepQueryData) {
    deleteRecord('VIEW_NAVIGATION_STEP_UUID', data['VIEW_NAVIGATION_STEP_UUID'], 'VIEW_NAVIGATION_STEP', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

  // for View Navigation Step Attribute Value
  let viewNavigationStepAttributeValueQuery = `SELECT VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE VIEW_UUID IN (SELECT VIEW_UUID FROM PAGE_VIEW WHERE PAGE_UUID = :PAGE_UUID);`;
  let viewNavigationStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepAttributeValueQuery, input);

  for (data of viewNavigationStepAttributeValueQueryData) {
    deleteRecord('VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', data['VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

  let pageViewQuery = `SELECT VIEW_UUID FROM PAGE_VIEW WHERE PAGE_UUID=:PAGE_UUID`;
  let pageViewQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", pageViewQuery, input);

  for (data of pageViewQueryData) {
    deleteRecord('VIEW_UUID', data['VIEW_UUID'], 'PAGE_VIEW', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }

} else if (input.compositeEntityAction == "Insert" || input.compositeEntityAction == "Save") {
  const viewUUID = uuid();
  let data = {};
  // let pageID = uuid();
  // input["PAGE_UUID"] = pageID;
  // data["PAGE_UUID"] = pageID;
  data['VIEW_UUID'] = viewUUID;
  data["VIEW_NAME"] = 'Default View';
  data["IS_DEFAULT_VIEW"] = 'Yes';
  pageViewList.push(data);

  // Adding Test Set for the page
  const TEST_SET_UUID = uuid();
  let testSetObj = {};
  testSetObj['TEST_SET_NAME'] = input['PAGE_NAME'];
  testSetObj['TEST_SET_TYPE'] = 'Page Navigation';
  testSetObj['TEST_SET_UUID'] = TEST_SET_UUID;
  testSetlist.push(testSetObj);

  // Adding Test Case for the page view
  const TEST_CASE_UUID = uuid();
  const TEST_CASE_DESCRIPTION_UUID = uuid();
  const testCaseObj = {};
  testCaseObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
  testCaseObj['TEST_CASE_NAME'] = 'Default View';
  testCaseObj['TEST_CASE_STATUS'] = 'DRAFT';
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

  input["AppEngChildEntity:TEST_SET_NEW"] = testSetlist;
}

input["AppEngChildEntity:UI_ELEMENT"] = UI_ELEMENT;
input["AppEngChildEntity:VIEW_UI_ELEMENT_CHILD_OF_VIEW_UI_ELEMENT"] = VIEW_UI_ELEMENT;
input["AppEngChildEntity:VIEW_NAVIGATION_STEP"] = VIEW_NAVIGATION_STEP;
input["AppEngChildEntity:VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE"] = VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE;
input["AppEngChildEntity:PAGE_VIEW"] = pageViewList;
input["AppEngChildEntity:INTEGRATION_TEST_CASE"] = TEST_CASE_FOR_PAGE_VIEW;
input['AppEngChildEntity:TEST_CASE_DESCRIPTION'] = TEST_CASE_DESCRIPTION;