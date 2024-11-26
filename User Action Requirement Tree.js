console.log('is solo req :::::::::::::', input);

const REQUIREMENT = [];
const IMPACTED_PROCESS = [];
const IMPACTED_USER_STORY = [];
const TEST_CASE_REQUIREMENT = [];
const REQUIREMENT_DATA_SET_DATA_ELEMENT = [];

function filterList(list, item) {
    let result = list.filter(data => data['REQUIREMENT_UUID'] === item);
    if (result && result.length) {
        return result[0];
    } else {
        return {};
    }
}

function deleteRecord(primarykey, primarykeyvalue, tablename, functionalareauuid) {
  
    let deleteTableData = {};

    deleteTableData[primarykey] = primarykeyvalue;
    deleteTableData["compositeEntityAction"] = "Delete";
    deleteTableData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;
    
    if (tablename == 'REQUIREMENT') {
        REQUIREMENT.push(deleteTableData);
    }
    else if(tablename == 'IMPACTED_USER_STORY'){
        IMPACTED_USER_STORY.push(deleteTableData)
    }
    else if(tablename == 'TEST_CASE_REQUIREMENT'){
        TEST_CASE_REQUIREMENT.push(deleteTableData)
    }
    else if(tablename == 'REQUIREMENT_DATA_SET_DATA_ELEMENT'){
        REQUIREMENT_DATA_SET_DATA_ELEMENT.push(deleteTableData)
    }
}

if (input['className'] == 'CONDITION_SATISFACTION' && input['isNewCOS'] == 'New') {
  
    const requirementQuery = `SELECT * FROM REQUIREMENT WHERE REQUIREMENT_UUID = '${input['parentNodeID']}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let requirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, requirementQuery, input);

    const impactedProcessObj = {};
    impactedProcessObj.REQUIREMENT_UUID = input.parentNodeID;
    impactedProcessObj.CONDITION_SATISFACTION_UUID = input.PRIMARY_KEY;
    impactedProcessObj.ASSOCIATION_TYPE = 'USER_ACTION_CONDITION_SATISFACTION';
    impactedProcessObj.PROCESS_UUID = input.processUuid;
    impactedProcessObj.PAGE_UUID = input.pageUuid;
    impactedProcessObj.VIEW_UUID = input.viewUuid;
    impactedProcessObj.USER_ACTION_UUID = input.USER_ACTION_UUID;

    if(requirementQueryData[0]['IS_SOLO_REQUIREMENT'] === 'Yes'){

        // Requirement
        let requirementObject = {
            'REQUIREMENT_UUID': input['parentNodeID'],
            'IS_SOLO_REQUIREMENT': 'No'
        };
        REQUIREMENT.push(requirementObject);

        // Impacted Process
        const impactedProcessQuery = `SELECT IMPACTED_PROCESS_UUID FROM IMPACTED_PROCESS WHERE REQUIREMENT_UUID = '${input['parentNodeID']}' AND ASSOCIATION_TYPE = 'USER_ACTION_REQUIREMENT'`;
        const impactedProcessData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, impactedProcessQuery, input);

        if(impactedProcessData && impactedProcessData.length > 0){
            impactedProcessObj.IMPACTED_PROCESS_UUID = impactedProcessData[0].IMPACTED_PROCESS_UUID;
        }

        // Impacted User Story
        const impactedUserStoryQuery = `SELECT IMPACTED_USER_STORY_UUID, CONDITION_SATISFACTION_UUID, ASSOCIATION_TYPE FROM IMPACTED_USER_STORY WHERE REQUIREMENT_UUID = '${input['parentNodeID']}' AND ASSOCIATION_TYPE = 'USER_ACTION_REQUIREMENT'`
        const impactedUserStoryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, impactedUserStoryQuery, input);
 
        for(story of impactedUserStoryData){
            const storyObj = {...story};
            storyObj['CONDITION_SATISFACTION_UUID'] = input['PRIMARY_KEY'];
            storyObj['ASSOCIATION_TYPE'] = 'USER_ACTION_CONDITION_SATISFACTION';
 
            IMPACTED_USER_STORY.push(storyObj);
        }

        // Test Case Requirement
        const testCaseRequirement = `SELECT TEST_CASE_REQUIREMENT_UUID, REQUIREMENT_UUID, CONDITION_SATISFACTION_UUID  FROM TEST_CASE_REQUIREMENT WHERE REQUIREMENT_UUID = '${input['parentNodeID']}'`;
        const testCaseRequirementData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, testCaseRequirement,input);
    
        for(data of testCaseRequirementData){
            const obj = {...data};
            obj['CONDITION_SATISFACTION_UUID'] = input['PRIMARY_KEY'];
    
            TEST_CASE_REQUIREMENT.push(obj);
        }

    }

    IMPACTED_PROCESS.push(impactedProcessObj);

} else if (input['className'] == 'CONDITION_SATISFACTION' && input['actionName'] == 'Remove') {
    if (!input['isRequirementChildExists']) {
        let requirementObject = {
            'REQUIREMENT_UUID': input['parentNodeID'],
            'IS_SOLO_REQUIREMENT': 'Yes'
        };
        REQUIREMENT.push(requirementObject);

        
    }

    // Impacted User Story
    const impactedUserStoryQuery = `SELECT IMPACTED_USER_STORY_UUID, CONDITION_SATISFACTION_UUID, ASSOCIATION_TYPE FROM IMPACTED_USER_STORY WHERE REQUIREMENT_UUID = '${input['parentNodeID']}' AND CONDITION_SATISFACTION_UUID = '${input['PRIMARY_KEY']}' AND ASSOCIATION_TYPE = 'USER_ACTION_CONDITION_SATISFACTION'`
    const impactedUserStoryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, impactedUserStoryQuery, input);

    for(story of impactedUserStoryData){
        const storyObj = {...story};
        storyObj['CONDITION_SATISFACTION_UUID'] = '';
        storyObj['ASSOCIATION_TYPE'] = 'USER_ACTION_REQUIREMENT';

        IMPACTED_USER_STORY.push(storyObj);
    }

    // Test Case Requirement
    const testCaseRequirement = `SELECT TEST_CASE_REQUIREMENT_UUID, REQUIREMENT_UUID, CONDITION_SATISFACTION_UUID  FROM TEST_CASE_REQUIREMENT WHERE REQUIREMENT_UUID = '${input['parentNodeID']}' AND CONDITION_SATISFACTION_UUID = '${input['PRIMARY_KEY']}'`;
    const testCaseRequirementData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, testCaseRequirement,input);

    for(data of testCaseRequirementData){
        const obj = {...data};
        obj['CONDITION_SATISFACTION_UUID'] = '';

        TEST_CASE_REQUIREMENT.push(obj);
    }


} else if (input['className'] == 'CONDITION_SATISFACTION' && input['isNewCOS'] == 'Old') {
    let strID = "'" + input['oldParentRequirementID'] + "','" + input['newParentRequirementID'] + "'";
    const requirementQuery = `SELECT * FROM REQUIREMENT WHERE REQUIREMENT_UUID in(${strID}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let requirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, requirementQuery, input);

    if (requirementQueryData && requirementQueryData.length) {
        if (!input['isOldParentRequirementChildExists']) {
            let isSoloRequirement = 'Yes';
            let requirementObject = {
                'REQUIREMENT_UUID': input['oldParentRequirementID'],
                'IS_SOLO_REQUIREMENT': isSoloRequirement
            };

            let result = filterList(requirementQueryData, input['oldParentRequirementID']);
            console.log('::::::::: result old :::::::::::', result);
            if (result && Object.keys(result).length && result['IS_SOLO_REQUIREMENT'] != isSoloRequirement) {
                REQUIREMENT.push(requirementObject);
            }
        }

        if (input['isNewParentRequirementChildExists']) {
            let isSoloRequirement = 'No';
            let requirementObject = {
                'REQUIREMENT_UUID': input['newParentRequirementID'],
                'IS_SOLO_REQUIREMENT': isSoloRequirement
            };
            let result = filterList(requirementQueryData, input['newParentRequirementID']);
            console.log('::::::::: result new :::::::::::', result);
            if (result && Object.keys(result).length && result['IS_SOLO_REQUIREMENT'] != isSoloRequirement) {
                REQUIREMENT.push(requirementObject);
            }
        }

        // Impacted User Story
        const impactedUserStoryQuery = `SELECT IMPACTED_USER_STORY_UUID, CONDITION_SATISFACTION_UUID, REQUIREMENT_UUID, ASSOCIATION_TYPE FROM IMPACTED_USER_STORY WHERE CONDITION_SATISFACTION_UUID = '${input['primaryKey']}' AND ASSOCIATION_TYPE = 'USER_ACTION_CONDITION_SATISFACTION'`
        const impactedUserStoryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, impactedUserStoryQuery, input);
 
        for(story of impactedUserStoryData){
            const storyObj = {...story};
            storyObj['REQUIREMENT_UUID'] = input['newParentRequirementID'];
 
            IMPACTED_USER_STORY.push(storyObj);
        }

        // Test Case Requirement
        const testCaseRequirement = `SELECT TEST_CASE_REQUIREMENT_UUID, CONDITION_SATISFACTION_UUID, REQUIREMENT_UUID FROM TEST_CASE_REQUIREMENT WHERE CONDITION_SATISFACTION_UUID = '${input['primaryKey']}'`;
        const testCaseRequirementData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, testCaseRequirement, input);
 
        for(data of testCaseRequirementData){
            const obj = {...data};
            obj['REQUIREMENT_UUID'] = input['newParentRequirementID'];
 
            TEST_CASE_REQUIREMENT.push(obj);
        }
    }
}  else if (input['className'] == 'REQUIREMENT' && input['isDeleted']) {

    console.log("Delete requirement running for user action tree ========== >>>>>>>>>> ");

    // Impacted User Story
    const impactedUserStoryQuery = `SELECT IMPACTED_USER_STORY_UUID FROM IMPACTED_USER_STORY WHERE REQUIREMENT_UUID = '${input['primaryKey']}'`
    const impactedUserStoryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, impactedUserStoryQuery, input);

    for(data of impactedUserStoryData){
        deleteRecord('IMPACTED_USER_STORY_UUID', data['IMPACTED_USER_STORY_UUID'], 'IMPACTED_USER_STORY', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    // Test Case Requirement
    const testCaseRequirement = `SELECT TEST_CASE_REQUIREMENT_UUID FROM TEST_CASE_REQUIREMENT WHERE REQUIREMENT_UUID = '${input['primaryKey']}'`;
    const testCaseRequirementData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, testCaseRequirement, input);

    for(data of testCaseRequirementData){
        deleteRecord('TEST_CASE_REQUIREMENT_UUID', data['TEST_CASE_REQUIREMENT_UUID'], 'TEST_CASE_REQUIREMENT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    // Data Set Data Element
    const requirementDataSetDataElementQuery = `SELECT REQUIREMENT_DATA_SET_DATA_ELEMENT_UUID FROM REQUIREMENT_DATA_SET_DATA_ELEMENT WHERE REQUIREMENT_UUID = '${input['primaryKey']}'`;
    const requirementDataSetDataElementData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, requirementDataSetDataElementQuery, input);

    for(data of requirementDataSetDataElementData){
        deleteRecord('REQUIREMENT_DATA_SET_DATA_ELEMENT_UUID', data['REQUIREMENT_DATA_SET_DATA_ELEMENT_UUID'], 'REQUIREMENT_DATA_SET_DATA_ELEMENT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }
}


console.log("Requirement data :::::::+================ >>>>>>>>>> ", REQUIREMENT);
console.log("IMPACTED_USER_STORY data :::::::+================ >>>>>>>>>> ", IMPACTED_USER_STORY);
console.log("TEST_CASE_REQUIREMENT data :::::::+================ >>>>>>>>>> ", TEST_CASE_REQUIREMENT);
console.log("REQUIREMENT_DATA_SET_DATA_ELEMENT data :::::::+================ >>>>>>>>>> ", REQUIREMENT_DATA_SET_DATA_ELEMENT);

input['CONDITION_SATISFACTION_ASSOCIATION_UUID'] = input['USER_ACTION_UUID'];
input['AppEngChildEntity:USER_ACTION_REQUIREMENT'] = REQUIREMENT;
input['AppEngChildEntity:IMPACTED_PROCESS'] = IMPACTED_PROCESS;
input['AppEngChildEntity:IMPACTED_USER_STORY'] = IMPACTED_USER_STORY;
input['AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT'] = TEST_CASE_REQUIREMENT;
input['AppEngChildEntity:REQUIREMENT_DATA_SET_DATA_ELEMENT'] = REQUIREMENT_DATA_SET_DATA_ELEMENT;
