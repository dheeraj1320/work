const TEST_CASE_REQUIREMENT = [];
const IMPACTED_USER_STORY = [];
const INTEGRATION_TEST_CASE = [];

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

const getTestCaseForRequirement = async () => {
  const requirementQuery = `SELECT tc.TEST_CASE_UUID, tc.USER_STORY_UUID FROM TEST_CASE_REQUIREMENT tcr JOIN TEST_CASE tc ON tcr.TEST_CASE_UUID = tc.TEST_CASE_UUID WHERE tcr.REQUIREMENT_UUID = :REQUIREMENT_UUID`;
  return await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', requirementQuery, input);
};

const checkIfOtherLinkingExists = async (testCaseUUID, userStoryUUID, impactedUserStoryUUID) => {
  // Checking if this user story is related to the test case via any other requirement
  const iusQuery = `SELECT REQUIREMENT_UUID, USER_STORY_UUID FROM IMPACTED_USER_STORY where USER_STORY_UUID = '${userStoryUUID}' AND IMPACTED_USER_STORY_UUID != '${impactedUserStoryUUID}'`;
  const iusData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', iusQuery, input);

  for (const ius of iusData) {
    const testCaseReqForThisReq = `SELECT TEST_CASE_UUID, REQUIREMENT_UUID FROM TEST_CASE_REQUIREMENT WHERE REQUIREMENT_UUID = '${ius['REQUIREMENT_UUID']}' and TEST_CASE_UUID = '${testCaseUUID}'`;
    const testCaseReqData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseReqForThisReq, input);
    if (testCaseReqData && testCaseReqData.length > 0) {
      return true; // Found another linking
    }
  }

  return false; // No other linking found
};


if (input.compositeEntityAction == "Delete") {

    //for TES_CASE_REQUIREMENT
    let TestCaseRequirementQuery = `SELECT TEST_CASE_REQUIREMENT_UUID FROM TEST_CASE_REQUIREMENT WHERE IMPACTED_PROCESS_UUID = :IMPACTED_PROCESS_UUID`;
    let TestCaseRequirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM",
        TestCaseRequirementQuery, input );

    for(const data of TestCaseRequirementQueryData){
        deleteRecord("TEST_CASE_REQUIREMENT_UUID", data["TEST_CASE_REQUIREMENT_UUID"], "TEST_CASE_REQUIREMENT", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID)
    }


    //for IMPACTED_USER_STORY
    let ImpactedStoryQuery;
    if(!input['CONDITION_SATISFACTION_UUID'] || input['CONDITION_SATISFACTION_UUID'] == 'null' || input['CONDITION_SATISFACTION_UUID'].trim() == ''){
        ImpactedStoryQuery = `SELECT IMPACTED_USER_STORY_UUID, USER_STORY_UUID FROM IMPACTED_USER_STORY WHERE REQUIREMENT_UUID = :REQUIREMENT_UUID AND ( CONDITION_SATISFACTION_UUID IS NULL OR CONDITION_SATISFACTION_UUID = '' OR CONDITION_SATISFACTION_UUID = 'null') AND  PROCESS_UUID = :PROCESS_UUID AND PAGE_UUID = :PAGE_UUID AND USER_ACTION_UUID = :USER_ACTION_UUID`;
    } else {
        ImpactedStoryQuery = `SELECT IMPACTED_USER_STORY_UUID, USER_STORY_UUID FROM IMPACTED_USER_STORY WHERE REQUIREMENT_UUID = :REQUIREMENT_UUID AND CONDITION_SATISFACTION_UUID = :CONDITION_SATISFACTION_UUID AND PROCESS_UUID = :PROCESS_UUID AND PAGE_UUID = :PAGE_UUID AND USER_ACTION_UUID = :USER_ACTION_UUID`
    }
      
    let ImpactedStoryQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM",
        ImpactedStoryQuery, input );

    for(const data of ImpactedStoryQueryData){
        deleteRecord("IMPACTED_USER_STORY_UUID", data["IMPACTED_USER_STORY_UUID"], "IMPACTED_USER_STORY", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID)
    }

    // for Test Case
    const testCaseData = await getTestCaseForRequirement();
    for (const data of testCaseData) {
      const existingUUIDs = new Set(
        (data['USER_STORY_UUID'] || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      );
      for (const imSt of ImpactedStoryQueryData) {
        let foundOtherLinking = false;
        if (existingUUIDs.has(imSt['USER_STORY_UUID'])) {
          foundOtherLinking = await checkIfOtherLinkingExists(data['TEST_CASE_UUID'], imSt['USER_STORY_UUID'], imSt['IMPACTED_USER_STORY_UUID']);

          if (!foundOtherLinking) {
            existingUUIDs.delete(imSt['USER_STORY_UUID']);
            const testCaseObj = {
              compositeEntityAction: 'Update',
              TEST_CASE_UUID: data['TEST_CASE_UUID'],
              USER_STORY_UUID: Array.from(existingUUIDs).join(',')
            };

            const existingObj = INTEGRATION_TEST_CASE.find((obj) => obj.TEST_CASE_UUID === testCaseObj.TEST_CASE_UUID);

            if (existingObj) {
              existingObj.USER_STORY_UUID = testCaseObj.USER_STORY_UUID;
            } else {
              INTEGRATION_TEST_CASE.push(testCaseObj);
            }
          }
        }
      }
    }
}


input["AppEngChildEntity:TEST_CASE_REQUIREMENT"] = TEST_CASE_REQUIREMENT;
input["AppEngChildEntity:IMPACTED_USER_STORY"] = IMPACTED_USER_STORY;
input["AppEngChildEntity:INTEGRATION_TEST_CASE"] = INTEGRATION_TEST_CASE;