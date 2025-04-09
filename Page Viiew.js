const VIEW_UI_ELEMENT = [];
const VIEW_NAVIGATION_STEP = [];
const VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE = [];

const INTEGRATION_TEST_CASE = [];
const TEST_CASE_DESCRIPTION = [];

const testCaseStepList = [];
const testCaseRequirmentList = [];
const testCaseStepAttributeValueList = [];
const testCaseFunctionStepAttributeValueList = [];
const testCaseFunctionStepList = [];
const testCaseUIElementGroupStepAttributeList = [];
const testCaseUIElementGroupStepList = [];
const testCaseFunctionUIElementGroupStepAttributeList = [];
const testCaseFunctionUIElementGroupStepList = [];

const TEST_CASE_VIEW_NAVIGATION_STEP = [];
const TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE = [];
const FUNCTION_VIEW_NAVIGATION_STEP = [];
const FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE = [];



function deleteRecord(primarykey, primarykeyvalue, deleteType, functionalareauuid) {
  
    let deleteParamenter = {};

    deleteParamenter[primarykey] = primarykeyvalue;
    deleteParamenter["compositeEntityAction"] = "Delete";
    deleteParamenter["FUNCTIONAL_AREA_UUID"] = functionalareauuid;
    
    if (deleteType == 'VIEW_UI_ELEMENT') {
      VIEW_UI_ELEMENT.push(deleteParamenter);
    }
    else if(deleteType == 'VIEW_NAVIGATION_STEP'){
      VIEW_NAVIGATION_STEP.push(deleteParamenter);
    }
    else if(deleteType == 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'){
      VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteParamenter);
    }
    else if (deleteType === 'TEST_CASE') {
      INTEGRATION_TEST_CASE.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_DESCRIPTION') {
      TEST_CASE_DESCRIPTION.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_STEP') {
      testCaseStepList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_REQUIREMENT') {
      testCaseRequirmentList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_STEP_ATTRIBUTE_VALUE') {
      testCaseStepAttributeValueList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE') {
      testCaseFunctionStepAttributeValueList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_FUNCTION_STEP') {
      testCaseFunctionStepList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE') {
      testCaseUIElementGroupStepAttributeList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_UI_ELEMENT_GROUP_STEP') {
      testCaseUIElementGroupStepList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE') {
      testCaseFunctionUIElementGroupStepAttributeList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP') {
      testCaseFunctionUIElementGroupStepList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_VIEW_NAVIGATION_STEP') {
        TEST_CASE_VIEW_NAVIGATION_STEP.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE') {
        TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteParamenter);
    } else if (deleteType === 'FUNCTION_VIEW_NAVIGATION_STEP') {
        FUNCTION_VIEW_NAVIGATION_STEP.push(deleteParamenter);
    } else if (deleteType === 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE') {
        FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteParamenter);
    }
}

async function deleteTestCaseRequirmentData(testCaseRequirmentStr) {
    deleteRecords('TEST_CASE_REQUIREMENT_UUID', testCaseRequirmentStr, 'TEST_CASE_REQUIREMENT');
}

async function deleteTestCaseStepData(testCaseStepStr) {
    deleteRecords('TEST_CASE_STEP_UUID', testCaseStepStr, 'TEST_CASE_STEP');
}

async function deleteTestCaseStepAttributeData(testCaseStepStr) {
    // firing the query to get all the test case step attribute value for that particulat test case step
    const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input);

    for (let attributeData of testCaseStepAttributeValueQueryData) {
        deleteRecords('TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_STEP_ATTRIBUTE_VALUE');
    }
}

async function deleteTestCaseUIElementGroupStepData(testCaseStepStr) {
    // firing the query to get all the test case function step  for that particulat test case step
    const testCaseUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementGroupStepQuery, input);

    for (let data of testCaseUIElementGroupStepQueryData) {
        deleteRecords('TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP');
    }
}

async function deleteTestCaseUIElementGroupStepAttributeData(testCaseStepStr) {
    // firing the query to get all the test case function step attribute value for that particulat test case step
    const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);

    for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
        deleteRecords('TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
    }
}

async function deleteTestCaseFunctionStepData(testCaseFunctionStepStr) {
    // firing the query to get all the test case function step  for that particulat test case step
    const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);

    for (let data of testCaseFunctionStepData) {
        deleteRecords('TEST_CASE_FUNCTION_STEP_UUID', data['TEST_CASE_FUNCTION_STEP_UUID'], 'TEST_CASE_FUNCTION_STEP');
    }
}

async function deleteTestCaseFunctionStepAttributeData(testCaseFunctionStepStr) {
    // firing the query to get all the test case function step attribute value for that particulat test case step
    const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);

    for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
        deleteRecords('TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE');
    }
}

async function deleteTestCaseFunctionUIElementGroupStepData(testCaseFunctionStepStr) {
    // firing the query to get all the test case function step  for that particular test case step
    const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);

    for (let data of testCaseFunctionUIElementGroupStepQueryData) {
        deleteRecords('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP');
    }
}

async function deleteTestCaseFunctionUIElementGroupStepAttributeData(testCaseFunctionStepStr) {
    // firing the query to get all the test case function step attribute value for that particulat test case step
    const testCaseFunctionUIElementGroupStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeValueQuery, input);

    for (let attributeData of testCaseFunctionUIElementGroupStepAttributeValueQueryData) {
        deleteRecords('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
    }
}


if (input.compositeEntityAction == "Insert") {
  input["IS_DEFAULT_VIEW"] = 'No';
  console.log("input :::::;:::::::::::::", input);

  // Fetching TEST_SET_UUID
  const testSetQuery = `SELECT TEST_SET_UUID FROM TEST_SET WHERE PAGE_UUID = :PAGE_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  const testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM",testSetQuery, input );

  if(testSetQueryData && testSetQueryData[0]['TEST_SET_UUID']){
    // Adding Test Case for the page view
    const TEST_CASE_UUID = uuid();
    const TEST_CASE_DESCRIPTION_UUID = uuid();
    const testCaseObj = {};
    testCaseObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
    testCaseObj['TEST_CASE_NAME'] = input['VIEW_NAME'];
    testCaseObj['TEST_CASE_STATUS'] = 'COMMITTED';
    testCaseObj['TEST_SET_UUID'] = testSetQueryData[0]['TEST_SET_UUID'];
    testCaseObj['TEST_CASE_EXECUTON_TYPE'] = 'Manual';
    testCaseObj['ASSOCIATED_VIEW_UUID'] = input['VIEW_UUID'];
    testCaseObj['TEST_CASE_DESCRIPTION_UUID'] = TEST_CASE_DESCRIPTION_UUID;
    testCaseObj['compositeEntityAction'] = 'Insert';
    INTEGRATION_TEST_CASE.push(testCaseObj);

    // Adding Test Case Description
    const testCaseDescriptionObj = {};
    testCaseDescriptionObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
    testCaseDescriptionObj['TEST_CASE_DESCRIPTION_UUID'] = TEST_CASE_DESCRIPTION_UUID;
    TEST_CASE_DESCRIPTION.push(testCaseDescriptionObj);

    const pageQuery =  `SELECT PAGE_NAME FROM PAGE where PAGE_UUID=:PAGE_UUID`;
    const pageQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", pageQuery, input);


    //Adding Test Case Step
    const TEST_CASE_STEP_UUID = uuid();
    const testCaseStepObj ={};
    testCaseStepObj['TEST_CASE_STEP_UUID'] = TEST_CASE_STEP_UUID;
    testCaseStepObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
    testCaseStepObj['TEST_SET_UUID'] = testSetQueryData[0]['TEST_SET_UUID'];
    testCaseStepObj['TEST_CASE_STEP_NAME'] = 'When User is on '+ pageQueryData[0]['PAGE_NAME']+' Page'
    testCaseStepObj['PAGE_UUID'] = input["PAGE_UUID"];
    testCaseStepObj['VIEW_UUID'] = input['VIEW_UUID'];
    testCaseStepObj['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = '20b169ba-34aa-46d1-888d-9324b9b77bc8';
    testCaseStepObj['CURRENT_PAGE_CONTEXT'] = input["PAGE_UUID"];
    testCaseStepObj['TEST_CASE_STEP_SEQ_ID'] = '1';
    testCaseStepObj['TEST_CASE_STEP_TYPE'] = 'Given'
    testCaseStepObj['IS_PURE_NAVIGATION_STEP'] = 'Yes';
    testCaseStepObj['IS_UI_ELEMENT_GROUP_STEP'] = 'No';
    testCaseStepObj['IS_FUNCTION_STEP'] = 'No';
    testCaseStepList.push(testCaseStepObj);

    //Adding Attribute Value For Test Case Step
    const testCaseStepAttributeObj ={};
    testCaseStepAttributeObj['STEP_DEFINITION_ATTRIBUTE_UUID'] = '11cf20fb-2cdf-4d03-a0b2-aad3644056af';
    testCaseStepAttributeObj['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input["PAGE_UUID"];
    testCaseStepAttributeObj['TEST_SET_UUID'] = testSetQueryData[0]['TEST_SET_UUID'];
    testCaseStepAttributeObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
    testCaseStepAttributeObj['TEST_CASE_STEP_UUID'] = TEST_CASE_STEP_UUID;
    testCaseStepAttributeValueList.push(testCaseStepAttributeObj);
  }

} 
else if (input.compositeEntityAction == "Update") {
    const testCaseQuery = `SELECT * FROM TEST_CASE where ASSOCIATED_VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    const testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseQuery, input);

    if(testCaseQueryData && testCaseQueryData.length){
        const testCaseObj = {};
        testCaseObj['TEST_CASE_UUID'] = testCaseQueryData[0]['TEST_CASE_UUID'];
        testCaseObj['TEST_CASE_NAME'] = input['VIEW_NAME'];
        testCaseObj['compositeEntityAction'] = 'Update';
        INTEGRATION_TEST_CASE.push(testCaseObj);
    }
}
else if (input.compositeEntityAction == "Delete") {

    //for VIEW_UI_ELEMENT
    let QuerytoFetchViewUIElements = `SELECT VIEW_UI_ELEMENT_UUID FROM VIEW_UI_ELEMENT WHERE VIEW_UUID = :VIEW_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let QuerytoFetchViewUIElementsData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM",
    QuerytoFetchViewUIElements, input );

    for(data of QuerytoFetchViewUIElementsData){
        deleteRecord("VIEW_UI_ELEMENT_UUID", data["VIEW_UI_ELEMENT_UUID"], "VIEW_UI_ELEMENT", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID)
    }

    // for VIEW_NAVIGATION_STEPS
    let QuerytoFetchViewNavigationSteps = `SELECT VIEW_NAVIGATION_STEP_UUID FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID = :VIEW_UUID`;
    let QuerytoFetchViewNavigationStepsData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", QuerytoFetchViewNavigationSteps, input );

    for(data of QuerytoFetchViewNavigationStepsData){
        deleteRecord("VIEW_NAVIGATION_STEP_UUID", data["VIEW_NAVIGATION_STEP_UUID"], "VIEW_NAVIGATION_STEP", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    
    //for VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE
    let QuerytoFetchNavigationStepAtt = `SELECT VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE VIEW_UUID = :VIEW_UUID`;

    let QuerytoFetchNavigationStepAttData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", QuerytoFetchNavigationStepAtt,input);

    for(data of QuerytoFetchNavigationStepAttData){
        deleteRecord("VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID", data["VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"], "VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    // for TEST_CASE_VIEW_NAVIGATION_STEP
    let tcvnsQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP WHERE VIEW_UUID = :VIEW_UUID`;
    let tcvnsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", tcvnsQuery, input);

    for(data of tcvnsQueryData){
        deleteRecord("TEST_CASE_VIEW_NAVIGATION_STEP_UUID", data["TEST_CASE_VIEW_NAVIGATION_STEP_UUID"], "TEST_CASE_VIEW_NAVIGATION_STEP", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    // for TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE
    let tcvnsavQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE VIEW_UUID = :VIEW_UUID`;
    let tcvnsavQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", tcvnsavQuery, input);

    for(data of tcvnsavQueryData){
        deleteRecord("TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID", data["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"], "TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    // for FUNCTION_VIEW_NAVIGATION_STEP
    let fvnsQuery = `SELECT FUNCTION_VIEW_NAVIGATION_STEP_UUID FROM FUNCTION_VIEW_NAVIGATION_STEP WHERE VIEW_UUID = :VIEW_UUID`;
    let fvnsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", fvnsQuery, input);

    for(data of fvnsQueryData){
        deleteRecord("FUNCTION_VIEW_NAVIGATION_STEP_UUID", data["FUNCTION_VIEW_NAVIGATION_STEP_UUID"], "FUNCTION_VIEW_NAVIGATION_STEP", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    // for FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE
    let fvnsavQuery = `SELECT FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE VIEW_UUID = :VIEW_UUID`;
    let fvnsavQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", fvnsavQuery, input);

    for(data of fvnsavQueryData){
        deleteRecord("FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID", data["FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"], "FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    // Delete The whole test case heirarchy
    const getTestCase = `SELECT * FROM TEST_CASE where ASSOCIATED_VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    const getTestCaseData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", getTestCase, input);

    if (getTestCaseData && getTestCaseData[0]['TEST_CASE_UUID']) {
        input['TEST_CASE_UUID'] = getTestCaseData[0]['TEST_CASE_UUID'];

        const testCaseObj = {};
        testCaseObj['TEST_CASE_UUID'] = input['TEST_CASE_UUID'];
        testCaseObj['compositeEntityAction'] = 'Delete';
        INTEGRATION_TEST_CASE.push(testCaseObj);

        const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
        const testCaseRequirmentQuery = `SELECT * FROM TEST_CASE_REQUIREMENT where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseRequirmentQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseRequirmentQuery, input);
        if (testCaseRequirmentQueryData && testCaseRequirmentQueryData.length) {
            for (let requirmentData of testCaseRequirmentQueryData) {
                deleteTestCaseRequirmentData(requirmentData['TEST_CASE_REQUIREMENT_UUID']);
            }
        }
        for (let data of testCaseStepQueryData) {
            deleteTestCaseStepData(data['TEST_CASE_STEP_UUID']);
            deleteTestCaseStepAttributeData("'" + data['TEST_CASE_STEP_UUID'] + "'");
            if (data["IS_UI_ELEMENT_GROUP_STEP"] == 'Yes' && data["IS_FUNCTION_STEP"] == 'No') {
                deleteTestCaseUIElementGroupStepData("'" + data['TEST_CASE_STEP_UUID'] + "'");
                deleteTestCaseUIElementGroupStepAttributeData("'" + data['TEST_CASE_STEP_UUID'] + "'");
            } else if (data["IS_UI_ELEMENT_GROUP_STEP"] == 'No' && data["IS_FUNCTION_STEP"] == 'Yes') {
                const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in('${data['TEST_CASE_STEP_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
                let functionStepCount = 1;
                for (let functionStepData of testCaseFunctionStepData) {
                    if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'No') {
                        deleteTestCaseFunctionStepData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'")
                        deleteTestCaseFunctionStepAttributeData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'")
                    } else if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
                        deleteTestCaseFunctionStepData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'")
                        deleteTestCaseFunctionStepAttributeData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'")
                        deleteTestCaseFunctionUIElementGroupStepData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'")
                        deleteTestCaseFunctionUIElementGroupStepAttributeData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'");
                    }
                }
            }
        }
    }
}

input["AppEngChildEntity:VIEW_NAVIGATION_STEP"] = VIEW_NAVIGATION_STEP;
input["AppEngChildEntity:VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE"] = VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE;

input["AppEngChildEntity:VIEW_UI_ELEMENT_CHILD_OF_VIEW_UI_ELEMENT"] = VIEW_UI_ELEMENT;
input["AppEngChildEntity:INTEGRATION_TEST_CASE"] = INTEGRATION_TEST_CASE;
input['AppEngChildEntity:TEST_CASE_DESCRIPTION'] = TEST_CASE_DESCRIPTION;


// -----------------

input["AppEngChildEntity:TEST_CASE_STEP_NEW"] = testCaseStepList;
input["AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT"] = testCaseRequirmentList;
input["AppEngChildEntity:TEST_CASE_STEP_ATTRIBUTE_VALUE"] = testCaseStepAttributeValueList;
input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE"] = testCaseFunctionStepAttributeValueList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP'] = testCaseFunctionStepList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseUIElementGroupStepAttributeList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP'] = testCaseUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseFunctionUIElementGroupStepAttributeList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP'] = testCaseFunctionUIElementGroupStepList;

input['AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP'] = TEST_CASE_VIEW_NAVIGATION_STEP;
input['AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'] = TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE;
input['AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP'] = FUNCTION_VIEW_NAVIGATION_STEP;
input['AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'] = FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE;
