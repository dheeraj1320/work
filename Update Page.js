console.log("Page node business rule ========================== >>>>>>>>>>>> ", input)

const UI_ELEMENT = [];
const VIEW_UI_ELEMENT = [];
const VIEW_NAVIGATION_STEP = [];
const VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE = [];

function deleteRecord(primarykey, primarykeyvalue, tablename, functionalareauuid) {
  
    let deleteTableData = {};

    deleteTableData[primarykey] = primarykeyvalue;
    deleteTableData["compositeEntityAction"] = "Delete";
    deleteTableData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;
    
    if (tablename == 'UI_ELEMENT') {
        UI_ELEMENT.push(deleteTableData);
    }
    else if(tablename == 'VIEW_UI_ELEMENT'){
        VIEW_UI_ELEMENT.push(deleteTableData)
    }
    else if(tablename == 'VIEW_NAVIGATION_STEP'){
        VIEW_NAVIGATION_STEP.push(deleteTableData)
    }
    else if(tablename == 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'){
        VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteTableData)
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
    
    input["AppEngChildEntity:TEST_CASE_STEP_NEW"] = testCaseStepList;
    input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP"] = testCaseFunctionStepList;
    input["AppEngChildEntity:FUNCTION_STEP"] = functionStepList;
} 

else if (input.compositeEntityAction == 'Delete') {
    // UI Element
    let uiElementsQuery = `SELECT UI_ELEMENT_UUID FROM UI_ELEMENT WHERE PAGE_NEW_UUID = :PAGE_UUID;`;
    let uiElementsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", uiElementsQuery, input);

    for(data of uiElementsQueryData){
        deleteRecord('UI_ELEMENT_UUID', data['UI_ELEMENT_UUID'], 'UI_ELEMENT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    // for View UI Element
    let viewUiElementsQuery = `SELECT VIEW_UI_ELEMENT_UUID FROM VIEW_UI_ELEMENT WHERE PAGE_UUID = :PAGE_UUID`;
    let viewUiElementsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewUiElementsQuery, input);

    for(data of viewUiElementsQueryData){
        deleteRecord('VIEW_UI_ELEMENT_UUID', data['VIEW_UI_ELEMENT_UUID'], 'VIEW_UI_ELEMENT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }
    

    // for View Navigation Step
    let viewNavigationStepQuery = `SELECT VIEW_NAVIGATION_STEP_UUID FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID IN (SELECT VIEW_UUID FROM PAGE_VIEW WHERE PAGE_UUID = :PAGE_UUID);`;
    let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepQuery, input);

    for(data of viewNavigationStepQueryData){
        deleteRecord('VIEW_NAVIGATION_STEP_UUID', data['VIEW_NAVIGATION_STEP_UUID'], 'VIEW_NAVIGATION_STEP', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    // for View Navigation Step Attribute Value
    let viewNavigationStepAttributeValueQuery = `SELECT VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE VIEW_UUID IN (SELECT VIEW_UUID FROM PAGE_VIEW WHERE PAGE_UUID = :PAGE_UUID);`;
    let viewNavigationStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepAttributeValueQuery, input);

    for(data of viewNavigationStepAttributeValueQueryData){
        deleteRecord('VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', data['VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }
}



console.log("UI_ELEMENT =============== >", UI_ELEMENT);
console.log("VIEW_UI_ELEMENT =============== >", VIEW_UI_ELEMENT);
console.log("VIEW_NAVIGATION_STEP =============== >", VIEW_NAVIGATION_STEP);
console.log("VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE =============== >", VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE);


input["AppEngChildEntity:UI_ELEMENT"] = UI_ELEMENT;
input["AppEngChildEntity:VIEW_UI_ELEMENT_CHILD_OF_VIEW_UI_ELEMENT"] = VIEW_UI_ELEMENT;
input["AppEngChildEntity:VIEW_NAVIGATION_STEP"] = VIEW_NAVIGATION_STEP;
input["AppEngChildEntity:VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE"] = VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE;