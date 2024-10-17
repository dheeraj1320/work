console.log("inside node business rule for impacted process ::::::::::::", input);

const TEST_CASE_REQUIREMENT = [];
const IMPACTED_USER_STORY = [];

function deleteRecord(primarykey, primarykeyvalue, tablename, functionalareauuid) {
  
    let deleteTableData = {};

    deleteTableData[primarykey] = primarykeyvalue;
    deleteTableData["compositeEntityAction"] = "Delete";
    deleteTableData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;
    
    if (tablename == 'TEST_CASE_REQUIREMENT') {
        TEST_CASE_REQUIREMENT.push(deleteTableData);
    }
    else if(tablename == 'IMPACTED_USER_STORY'){
        IMPACTED_USER_STORY.push(deleteTableData)
    }
}


if (input.compositeEntityAction == "Delete") {

    //for TES_CASE_REQUIREMENT
    let TestCaseRequirementQuery = `SELECT TEST_CASE_REQUIREMENT_UUID FROM TEST_CASE_REQUIREMENT WHERE IMPACTED_PROCESS_UUID = :IMPACTED_PROCESS_UUID`;
    let TestCaseRequirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM",
        TestCaseRequirementQuery, input );

    for(data of TestCaseRequirementQueryData){
        deleteRecord("TEST_CASE_REQUIREMENT_UUID", data["TEST_CASE_REQUIREMENT_UUID"], "TEST_CASE_REQUIREMENT", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID)
    }


    //for IMPACTED_USER_STORY
    let ImpactedStoryQuery = `SELECT IMPACTED_USER_STORY_UUID FROM IMPACTED_USER_STORY WHERE REQUIREMENT_UUID = :REQUIREMENT_UUID AND CONDITION_SATISFACTION_UUID = COALESCE(:CONDITION_SATISFACTION_UUID, '') AND PROCESS_UUID = :PROCESS_UUID AND PAGE_UUID = :PAGE_UUID AND USER_ACTION_UUID = :USER_ACTION_UUID`;
    let ImpactedStoryQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM",
        ImpactedStoryQuery, input );

    for(data of ImpactedStoryQueryData){
        deleteRecord("IMPACTED_USER_STORY_UUID", data["IMPACTED_USER_STORY_UUID"], "IMPACTED_USER_STORY", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID)
    }
}

console.log("Data prepared TEST_CASE_REQUIREMENT, IMPACTED_USER_STORY :::::::::::: ", TEST_CASE_REQUIREMENT, IMPACTED_USER_STORY);


input["AppEngChildEntity:TEST_CASE_REQUIREMENT"] = TEST_CASE_REQUIREMENT;
input["AppEngChildEntity:IMPACTED_USER_STORY"] = IMPACTED_USER_STORY;