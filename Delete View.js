const VIEW_UI_ELEMENT = [];
const VIEW_NAVIGATION_STEP = [];
const VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE = [];

function deleteRecord(primarykey, primarykeyvalue, tablename, functionalareauuid) {
  
    let deleteTableData = {};

    deleteTableData[primarykey] = primarykeyvalue;
    deleteTableData["compositeEntityAction"] = "Delete";
    deleteTableData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;
    
    if (tablename == 'VIEW_UI_ELEMENT') {
        VIEW_UI_ELEMENT.push(deleteTableData);
    }
    else if(tablename == 'VIEW_NAVIGATION_STEP'){
        VIEW_NAVIGATION_STEP.push(deleteTableData)
    }
    else if(tablename == 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'){
        VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteTableData)
    }
}


if (input.compositeEntityAction == "Delete") {

    //for VIEW_UI_ELEMENT
    let QuerytoFetchViewUIElements = `SELECT VIEW_UI_ELEMENT_UUID FROM VIEW_UI_ELEMENT WHERE VIEW_UUID = :VIEW_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let QuerytoFetchViewUIElementsData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM",
    QuerytoFetchViewUIElements, input );

    for(data of QuerytoFetchViewUIElementsData){
        deleteRecord("VIEW_UI_ELEMENT_UUID", data["VIEW_UI_ELEMENT_UUID"], "VIEW_UI_ELEMENT", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID)
    }

    //for VIEW_NAVIGATION_STEPS
    let QuerytoFetchNavigationStep = `SELECT VIEW_NAVIGATION_STEP_UUID FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID = :VIEW_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let QuerytoFetchNavigationStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM",
    QuerytoFetchNavigationStep,input);

    for(data of QuerytoFetchNavigationStepData){
        deleteRecord("VIEW_NAVIGATION_STEP_UUID", data["VIEW_NAVIGATION_STEP_UUID"], "VIEW_NAVIGATION_STEP", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID)
    }

    //for VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE
    let QuerytoFetchNavigationStepAtt = `SELECT VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE VIEW_UUID = :VIEW_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let QuerytoFetchNavigationStepAttData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", QuerytoFetchNavigationStepAtt,input);

    for(data of QuerytoFetchNavigationStepAttData){
        deleteRecord("VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID", data["VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"], "VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID)
    }
}

input["AppEngChildEntity:VIEW_NAVIGATION_STEP"] = VIEW_NAVIGATION_STEP;
input["AppEngChildEntity:VIEW_UI_ELEMENT_CHILD_OF_VIEW_UI_ELEMENT"] = VIEW_UI_ELEMENT;
input["AppEngChildEntity:VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE"] = VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE;