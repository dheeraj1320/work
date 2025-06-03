input[0]['TEST_SET_INFORMATION_MESSAGE'] = '';
input[0]['FEATURE_REQ_INFORMATION_MESSAGE'] = '';
input[0]['TEST_CASE_FEATURE_REQ_INFORMATION_MESSAGE'] = '';
input[0]['USER_ACTION_ACTION_FLOW_INFORMATION_MESSAGE'] = '';
input[0]['USER_ACTION_REQ_INFORMATION_MESSAGE'] = '';
input[0]['TEST_CASE_USER_ACTION_REQ_INFORMATION_MESSAGE'] = '';
input[0]['IMPACTED_USER_STORY_INFORMATION_MESSAGE'] = '';
input[0]['DATA_SET_DATA_ELEMENT_REQ_INFORMATION_MESSAGE'] = '';
input[0]['NO_LINKING_EXISTS_INFORMATION_MESSAGE'] = '';
let isLinkingExists = false;

let impactedProcessQueryData = [];
let testCaseRequirementQueryData = [];

let processPageQuery = `select * from PROCESS_PAGE where PROCESS_UUID=:PROCESS_UUID AND PAGE_UUID=:PAGE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
const processPageQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", processPageQuery, input[0]);
input[0]['PROCESS_PAGE_UUID'] = processPageQueryData['PROCESS_PAGE_UUID'];

 let testSetQuery =   `SELECT 
    TEST_SET.TEST_SET_UUID, TEST_SET_NAME,
    CASE 
        WHEN COUNT(TEST_CASE.TEST_SET_UUID) > 0 THEN 'Yes'
        ELSE 'No'
    END AS IS_TEST_CASE_PRESENT
FROM 
    TEST_SET
LEFT JOIN 
    TEST_CASE 
ON 
    TEST_SET.TEST_SET_UUID = TEST_CASE.TEST_SET_UUID
WHERE 
    TEST_SET.PROCESS_UUID =:PROCESS_UUID
    AND TEST_SET.PAGE_UUID =:PAGE_UUID
    AND TEST_SET.USER_ACTION_UUID =:USER_ACTION_UUID
GROUP BY TEST_SET.TEST_SET_UUID,TEST_SET_NAME`

const testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testSetQuery, input[0]);


if (testSetQueryData && testSetQueryData.length) {
    isLinkingExists = true;
    input[0]['testSetQueryData'] = testSetQueryData;
    if(testSetQueryData[0].IS_TEST_CASE_PRESENT== 'No'){
       input[0]["TEST_SET_INFORMATION_MESSAGE"] = "-> User Action Test Set and its linking with Test Suite will be deleted.";
    } else{
      input[0]["TEST_SET_INFORMATION_MESSAGE"] = "-> Test Case exists with associated User Action Test Set. Please review and delete it from the Orphan Test Set.";
    }
}

let featureRequirementQuery = `select * from IMPACTED_PROCESS where PROCESS_UUID=:PROCESS_UUID AND PAGE_UUID=:PAGE_UUID AND USER_ACTION_UUID=:USER_ACTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ASSOCIATION_TYPE IN('FEATURE')`;
const featureRequirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", featureRequirementQuery, input[0]);

if (featureRequirementQueryData && featureRequirementQueryData.length) {
    impactedProcessQueryData.push(...featureRequirementQueryData);
    isLinkingExists = true;
    input[0]["FEATURE_REQ_INFORMATION_MESSAGE"] = "-> There are linked Feature Requirement/Condition of Satisfaction' with this User Action. They will be unlinked.";
}

let featureImapctedProcessIds = featureRequirementQueryData.map((item) => `'` + item['IMPACTED_PROCESS_UUID'] + `'`).join();
if (featureImapctedProcessIds && featureImapctedProcessIds.length) {
    let testCaseFeatureRequirementQuery = `select * from TEST_CASE_REQUIREMENT where IMPACTED_PROCESS_UUID in(${featureImapctedProcessIds}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    const testCaseFeatureRequirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFeatureRequirementQuery, input[0]);

    if (testCaseFeatureRequirementQueryData && testCaseFeatureRequirementQueryData.length) {
        testCaseRequirementQueryData.push(...testCaseFeatureRequirementQueryData);
        isLinkingExists = true;
        input[0]["TEST_CASE_FEATURE_REQ_INFORMATION_MESSAGE"] = "-> There are Linked Test Cases for associated Feature Requirement/Condition of Satisfaction. They will be unlinked.";
    }
}

let requirementSetQuery = `select * from REQUIREMENT_SET where REQUIREMENT_SET_ASSOCIATION_UUID=:USER_ACTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
const requirementSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", requirementSetQuery, input[0]);

let requirementQuery = `select * from REQUIREMENT where REQUIREMENT_ASSOCIATION_UUID=:USER_ACTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
const requirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", requirementQuery, input[0]);


let conditionOfSatisfactionQuery = `select * from CONDITION_SATISFACTION where CONDITION_SATISFACTION_ASSOCIATION_UUID=:USER_ACTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
const conditionOfSatisfactionQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", conditionOfSatisfactionQuery, input[0]);

if ((requirementSetQueryData && requirementSetQueryData.length) || (requirementQueryData && requirementQueryData.length) || (conditionOfSatisfactionQueryData && conditionOfSatisfactionQueryData.length)) {
    if (requirementSetQueryData && requirementSetQueryData.length) {
        input[0]['requirementSetQueryData'] = requirementSetQueryData;
    }

    if (requirementQueryData && requirementQueryData.length) {
        input[0]['requirementQueryData'] = requirementQueryData;
    }

    if (conditionOfSatisfactionQueryData && conditionOfSatisfactionQueryData.length) {
        input[0]['conditionOfSatisfactionQueryData'] = conditionOfSatisfactionQueryData;
    }
    isLinkingExists = true;
    input[0]["USER_ACTION_REQ_INFORMATION_MESSAGE"] = "-> There are User Action Requirement/Condition of Satisfaction. They will be deleted.";
}


let userActionRequirementQuery = `select * from IMPACTED_PROCESS where PROCESS_UUID=:PROCESS_UUID AND PAGE_UUID=:PAGE_UUID AND USER_ACTION_UUID=:USER_ACTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ASSOCIATION_TYPE IN('PAGE-EVENT')`;
const userActionRequirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", userActionRequirementQuery, input[0]);

if (userActionRequirementQueryData && userActionRequirementQueryData.length) {
    impactedProcessQueryData.push(...userActionRequirementQueryData);
    // input[0]["FEATURE_REQ_INFORMATION_MESSAGE"] = "There are linked Feature Requirement / Condition of Satisfaction' with this User Action. They will be unlinked";
}

let userActionImapctedProcessIds = userActionRequirementQueryData.map((item) => `'` + item['IMPACTED_PROCESS_UUID'] + `'`).join();
if (userActionImapctedProcessIds && userActionImapctedProcessIds.length) {
    let testCaseUserActionRequirementQuery = `select * from TEST_CASE_REQUIREMENT where IMPACTED_PROCESS_UUID in(${userActionImapctedProcessIds}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    const testCaseUserActionRequirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUserActionRequirementQuery, input[0]);

    if (testCaseUserActionRequirementQueryData && testCaseUserActionRequirementQueryData.length) {
        testCaseRequirementQueryData.push(...testCaseUserActionRequirementQueryData);
        isLinkingExists = true;
        input[0]["TEST_CASE_USER_ACTION_REQ_INFORMATION_MESSAGE"] = "-> There are Test Cases associated with User Action Requirement/Condition of satisfaction. They will be unlinked.";
    }
}

let impactedUserStoryQuery = `select * from IMPACTED_USER_STORY where PROCESS_UUID=:PROCESS_UUID AND PAGE_UUID=:PAGE_UUID AND USER_ACTION_UUID=:USER_ACTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
const impactedUserStoryQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", impactedUserStoryQuery, input[0]);

if (impactedUserStoryQueryData && impactedUserStoryQueryData.length) {
    input[0]['impactedUserStoryQueryData'] = impactedUserStoryQueryData;
    isLinkingExists = true;
    input[0]["IMPACTED_USER_STORY_INFORMATION_MESSAGE"] = "-> There are mapped User Stories. They will be unlinked.";
}

let requirementIds = requirementQueryData.map((item) => `'` + item['REQUIREMENT_UUID'] + `'`).join();
if (requirementIds && requirementIds.length) {
    let requirementDataSetDataElementQuery = `select * from REQUIREMENT_DATA_SET_DATA_ELEMENT where REQUIREMENT_UUID in(${requirementIds}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    const requirementDataSetDataElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", requirementDataSetDataElementQuery, input[0]);
    if (requirementDataSetDataElementQueryData && requirementDataSetDataElementQueryData.length) {
        input[0]['requirementDataSetDataElementQueryData'] = requirementDataSetDataElementQueryData;
        isLinkingExists = true;
        input[0]["DATA_SET_DATA_ELEMENT_REQ_INFORMATION_MESSAGE"] = "-> Data Elements are tagged to this User Action Requirement. They will be unlinked.";
    }
}
if (!isLinkingExists) {
    input[0]['NO_LINKING_EXISTS_INFORMATION_MESSAGE'] = 'No Linking exists, you can proceed.';
}

input[0]['impactedProcessQueryData'] = impactedProcessQueryData;
input[0]['testCaseRequirementQueryData'] = testCaseRequirementQueryData