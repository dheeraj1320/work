const REQUIREMENT = [];
const IMPACTED_USER_STORY = [];
const TEST_CASE_REQUIREMENT = [];
const REQUIREMENT_DATA_SET_DATA_ELEMENT = [];
const INTEGRATION_TEST_CASE = [];

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

    if(requirementQueryData[0]['IS_SOLO_REQUIREMENT'] === 'Yes'){

        // Requirement
        let requirementObject = {
            'REQUIREMENT_UUID': input['parentNodeID'],
            'IS_SOLO_REQUIREMENT': 'No',
            'REQUIREMENT_ASSOCIATION_TYPE': 'PAGE-EVENT'
        };
        REQUIREMENT.push(requirementObject);

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

} else if (input['className'] == 'CONDITION_SATISFACTION' && input['actionName'] == 'Remove') {
    if (!input['isRequirementChildExists']) {
        let requirementObject = {
            'REQUIREMENT_UUID': input['parentNodeID'],
            'IS_SOLO_REQUIREMENT': 'Yes',
            'REQUIREMENT_ASSOCIATION_TYPE': 'PAGE-EVENT'
        };
        REQUIREMENT.push(requirementObject);
    }

    // Impacted User Story
    

    const impactedUserStoryQuery = `SELECT IMPACTED_USER_STORY_UUID, CONDITION_SATISFACTION_UUID, ASSOCIATION_TYPE FROM IMPACTED_USER_STORY WHERE REQUIREMENT_UUID = '${input['parentNodeID']}' AND CONDITION_SATISFACTION_UUID = '${input['PRIMARY_KEY']}' AND ASSOCIATION_TYPE = 'PAGE-EVENT'`
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
                'IS_SOLO_REQUIREMENT': isSoloRequirement,
                'REQUIREMENT_ASSOCIATION_TYPE': 'PAGE-EVENT'
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
                'IS_SOLO_REQUIREMENT': isSoloRequirement,
                'REQUIREMENT_ASSOCIATION_TYPE': 'PAGE-EVENT'
            };
            let result = filterList(requirementQueryData, input['newParentRequirementID']);
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

    // Impacted User Story
    const impactedUserStoryQuery = `SELECT ius.IMPACTED_USER_STORY_UUID, ius.USER_STORY_UUID, us.USER_STORY_NAME, us.USER_STORY_STATUS FROM IMPACTED_USER_STORY ius JOIN USER_STORY us ON ius.USER_STORY_UUID = us.USER_STORY_UUID WHERE REQUIREMENT_UUID = '${input['primaryKey']}'`
    const impactedUserStoryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, impactedUserStoryQuery, input);

    for(data of impactedUserStoryData){
        deleteRecord('IMPACTED_USER_STORY_UUID', data['IMPACTED_USER_STORY_UUID'], 'IMPACTED_USER_STORY', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
    }

    // Removing user story ids mapped to this requirement from test cases mapped to this requirement
    // Array of impacted user stories
    const userStories = impactedUserStoryData.map(data => ({USER_STORY_UUID: data['USER_STORY_UUID'], USER_STORY_NAME: data['USER_STORY_NAME'], USER_STORY_STATUS: data['USER_STORY_STATUS']}));

    const linkedTestCasesQuery = `SELECT tc.TEST_CASE_UUID, tcr.REQUIREMENT_UUID, tc.USER_STORY_UUID FROM TEST_CASE_REQUIREMENT tcr JOIN TEST_CASE tc ON tcr.TEST_CASE_UUID = tc.TEST_CASE_UUID WHERE REQUIREMENT_UUID = '${input['primaryKey']}'`;
    const linkedTestCases = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, linkedTestCasesQuery, input);

    for(const ltc of linkedTestCases){
        if(ltc['USER_STORY_UUID'] && ltc['USER_STORY_UUID'].length > 0){
            const existingUUIDs = new Set(
                (ltc['USER_STORY_UUID'] || '')
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean)
            );
            let changed = false;
            
            for(const userStory of userStories){
                let foundOtherLinking = false;
                if(existingUUIDs.has(userStory['USER_STORY_UUID'])){

                    const otherReqForStory = `SELECT IMPACTED_USER_STORY_UUID, USER_STORY_UUID, REQUIREMENT_UUID FROM IMPACTED_USER_STORY where REQUIREMENT_UUID != '${input['primaryKey']}' AND USER_STORY_UUID = '${userStory['USER_STORY_UUID']}'`;
                    const otherReqForStoryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, otherReqForStory, input);

                    if(otherReqForStoryData && otherReqForStoryData.length > 0){

                        for(const otherReq of otherReqForStoryData){
                            const testCaseReqForThisReq = `SELECT TEST_CASE_REQUIREMENT_UUID FROM TEST_CASE_REQUIREMENT WHERE REQUIREMENT_UUID = '${otherReq['REQUIREMENT_UUID']}' AND TEST_CASE_UUID = '${ltc['TEST_CASE_UUID']}'`;
                            const testCaseReqForThisReqData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, testCaseReqForThisReq, input);

                            if(testCaseReqForThisReqData && testCaseReqForThisReqData.length > 0){
                                foundOtherLinking = true;
                                break;
                            }
                        }
                    }

                    if(!foundOtherLinking){
                        console.log('Removing user story from test case :', userStory['USER_STORY_NAME']);
                        existingUUIDs.delete(userStory['USER_STORY_UUID']);
                        changed = true;
                    }
                }
            }

            if (changed) {
                const testCaseObj = {
                    compositeEntityAction: 'Update',
                    TEST_CASE_UUID: ltc['TEST_CASE_UUID'],
                    USER_STORY_UUID: Array.from(existingUUIDs).join(',')
                };
                INTEGRATION_TEST_CASE.push(testCaseObj);
            }
        }
    }

}

input['CONDITION_SATISFACTION_ASSOCIATION_UUID'] = input['USER_ACTION_UUID'];
input["AppEngChildEntity:USER_ACTION_REQUIREMENT"] = REQUIREMENT;
input["AppEngChildEntity:IMPACTED_USER_STORY"] = IMPACTED_USER_STORY;
input["AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT"] = TEST_CASE_REQUIREMENT;
input["AppEngChildEntity:REQUIREMENT_DATA_SET_DATA_ELEMENT"] = REQUIREMENT_DATA_SET_DATA_ELEMENT;
input["AppEngChildEntity:INTEGRATION_TEST_CASE"] = INTEGRATION_TEST_CASE;
