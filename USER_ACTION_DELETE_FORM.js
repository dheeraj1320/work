let testSetList = [];
let impactedProcessList = [];
let testCaseRequiremenList = [];
let requirementSetList = [];
let requirementList = [];
let conditionOfSatisfactionList = [];
let impactedUserStoryList = [];
let requirementDataSetDataElementList = [];
let actionFlowConditionList = [];
let actionFlowActionList = [];
let actionFlowAssociationList = [];
let actionFlowAPIList = [];
let onlineScreenPageNavigationList = [];
let testSuiteTestCaseList = [];

function removeNodeByPrimaryKey(data, primaryKey) {
    if (data && data.length) {
        for (const node of data) {
            if (node.primaryKey === primaryKey) {
                return null;
            }

            if (node.children && node.children.length > 0) {
                const updatedChildren = removeNodeByPrimaryKey(node.children, primaryKey);
                if (updatedChildren === null) {
                    node.children = node.children.filter(child => child.primaryKey !== primaryKey);
                } else {
                    node.children = updatedChildren;
                }
            }
        }
    }
    return data;
}

function recalculateLevels(data, currentLevel = 1) {
    let maxDepth = currentLevel;
    for (const node of data) {
        node.level = currentLevel;
        if (node.children && node.children.length > 0) {
            const childDepth = recalculateLevels(node.children, currentLevel + 1);
            maxDepth = Math.max(maxDepth, childDepth);
        }
    }
    return maxDepth;
}

function deleteRecord(key, value, deleteType) {
    const deleteParameter = {};
    deleteParameter[key] = value;
    deleteParameter["compositeEntityAction"] = "Delete";

    switch (deleteType) {
        case "TEST_SUITE_TEST_SET": {
            testSuiteTestCaseList.push(deleteParameter);
        }
            break;
    }
}

async function unlinkTestSetFromTestSuite() {
    const testSuiteTestSetQuery = `SELECT * FROM TEST_SUITE_TEST_SET WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND TEST_SET_UUID in (SELECT TEST_SET_UUID FROM TEST_SET WHERE USER_ACTION_UUID=:USER_ACTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID)`;
    const testSuiteTestSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSuiteTestSetQuery, input);
    if (testSuiteTestSetQueryData && testSuiteTestSetQueryData.length) {
        for (let data of testSuiteTestSetQueryData) {
            deleteRecord('TEST_SUITE_TEST_SET_UUID', data['TEST_SUITE_TEST_SET_UUID'], 'TEST_SUITE_TEST_SET');
        }
    }
}

if (input.compositeEntityAction == 'Delete') {

    if (input['testSetQueryData'] && input['testSetQueryData'].length) {
        for (let testSet of input['testSetQueryData']) {
            let object = {};
            object['TEST_SET_UUID'] = testSet['TEST_SET_UUID'];
            if (testSet['IS_TEST_CASE_PRESENT'] == 'No') {
                object["compositeEntityAction"] = "Delete";
            } else {
                object['PROCESS_UUID'] = null;
                object['PAGE_UUID'] = null;
                object['USER_ACTION_UUID'] = null;
                object['VIEW_UUID'] = null;
                object["compositeEntityAction"] = "Update";
                if (testSet.TEST_SET_NAME) {
                    object['TEST_SET_NAME'] = testSet['TEST_SET_NAME'] + ' - Orphan';
                } else {
                    object['TEST_SET_NAME'] = testSet['NAME'] + ' - Orphan';
                }
                object['TAGS_UUID'] = testSet['TAGS_UUID']
                object['IS_ORPHAN_TEST_SET'] = "Yes";
            }
            await unlinkTestSetFromTestSuite();
            testSetList.push(object);
        }

        input["AppEngChildEntity:TEST_SET_NEW"] = testSetList;
        input['AppEngChildEntity:TEST_SUITE_TEST_SET'] = testSuiteTestCaseList;
    }

    if (input['impactedProcessQueryData'] && input['impactedProcessQueryData'].length) {
        for (let impactedProcess of input['impactedProcessQueryData']) {
            let object = {};
            object['IMPACTED_PROCESS_UUID'] = impactedProcess['IMPACTED_PROCESS_UUID'];
            impactedProcessList.push(object);
        }
        input["AppEngChildEntity:IMPACTED_PROCESS"] = impactedProcessList;
    }

    if (input['testCaseRequirementQueryData'] && input['testCaseRequirementQueryData'].length) {
        for (let testCaseRequirement of input['testCaseRequirementQueryData']) {
            let object = {};
            object['TEST_CASE_REQUIREMENT_UUID'] = testCaseRequirement['TEST_CASE_REQUIREMENT_UUID'];
            testCaseRequiremenList.push(object);
        }
        input["AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT"] = testCaseRequiremenList;
    }

    if (input['requirementSetQueryData'] && input['requirementSetQueryData'].length) {
        for (let requirementSet of input['requirementSetQueryData']) {
            let object = {};
            object['REQUIREMENT_SET_UUID'] = requirementSet['REQUIREMENT_SET_UUID'];
            requirementSetList.push(object);
        }
        input["AppEngChildEntity:USER_ACTION_REQUIREMENT_SET"] = requirementSetList;
    }

    if (input['requirementQueryData'] && input['requirementQueryData'].length) {
        for (let requirementSet of input['requirementQueryData']) {
            let object = {};
            object['REQUIREMENT_UUID'] = requirementSet['REQUIREMENT_UUID'];
            requirementList.push(object);
        }
        input["AppEngChildEntity:USER_ACTION_REQUIREMENT"] = requirementList;
    }

    if (input['conditionOfSatisfactionQueryData'] && input['conditionOfSatisfactionQueryData'].length) {
        for (let conditionOfSatisfaction of input['conditionOfSatisfactionQueryData']) {
            let object = {};
            object['CONDITION_SATISFACTION_UUID'] = conditionOfSatisfaction['CONDITION_SATISFACTION_UUID'];
            conditionOfSatisfactionList.push(object);
        }
        input["AppEngChildEntity:USER_ACTION_CONDITION_OF_SATISFACTION"] = conditionOfSatisfactionList;
    }

    if (input['impactedUserStoryQueryData'] && input['impactedUserStoryQueryData'].length) {
        for (let impactedUserStory of input['impactedUserStoryQueryData']) {
            let object = {};
            object['IMPACTED_USER_STORY_UUID'] = impactedUserStory['IMPACTED_USER_STORY_UUID'];
            impactedUserStoryList.push(object);
        }
        input["AppEngChildEntity:IMPACTED_USER_STORY"] = impactedUserStoryList;
    }

    if (input['requirementDataSetDataElementQueryData'] && input['requirementDataSetDataElementQueryData'].length) {
        for (let requirementDataSetDataElement of input['requirementDataSetDataElementQueryData']) {
            let object = {};
            object['REQUIREMENT_DATA_SET_DATA_ELEMENT_UUID'] = requirementDataSetDataElement['REQUIREMENT_DATA_SET_DATA_ELEMENT_UUID'];
            requirementDataSetDataElementList.push(object);
        }
        input["AppEngChildEntity:REQUIREMENT_DATA_SET_DATA_ELEMENT"] = requirementDataSetDataElementList;
    }


    let userActionRequirementTreeQuery = `select * from USER_ACTION_REQUIREMENT_TREE where USER_ACTION_UUID=:USER_ACTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    const userActionRequirementTreeData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", userActionRequirementTreeQuery, input);

    if (userActionRequirementTreeData && Object.keys(userActionRequirementTreeData).length) {
        input['USER_ACTION_REQUIREMENT_UUID'] = userActionRequirementTreeData['USER_ACTION_REQUIREMENT_UUID'];
    }

    let userAction_ActionFlowQuery = `select * from USER_ACTION_ACTION_FLOW where USER_ACTION_UUID=:USER_ACTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    const userAction_ActionFlowQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", userAction_ActionFlowQuery, input);

    if (userAction_ActionFlowQueryData && Object.keys(userAction_ActionFlowQueryData).length) {
        input['ACTION_FLOW_UUID'] = userAction_ActionFlowQueryData['ACTION_FLOW_UUID'];

        let actionFlowConditionQuery = `select * from ACTION_FLOW_CONDITION where ACTION_FLOW_UUID=:ACTION_FLOW_UUID`;
        const actionFlowConditionQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", actionFlowConditionQuery, input);

        if (actionFlowConditionQueryData && actionFlowConditionQueryData.length) {
            for (let actionFlowCondition of actionFlowConditionQueryData) {
                let object = {};
                object['MAPPING_CONDITION_UUID'] = actionFlowCondition['MAPPING_CONDITION_UUID'];
                object['CONDITION_UUID'] = actionFlowCondition['CONDITION_UUID'];
                object['ACTION_FLOW_UUID'] = actionFlowCondition['ACTION_FLOW_UUID'];
                actionFlowConditionList.push(object);
            }
            input["AppEngChildEntity:USER_ACTION_ACTION_FLOW_CONDITION"] = actionFlowConditionList;
        }

        let actionFlowActionQuery = `select * from ACTION_FLOW_ACTION where ACTION_FLOW_UUID=:ACTION_FLOW_UUID`;
        const actionFlowActionQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", actionFlowActionQuery, input);

        if (actionFlowActionQueryData && actionFlowActionQueryData.length) {
            for (let actionFlowAction of actionFlowActionQueryData) {
                let object = {};
                object['MAPPING_ACTION_UUID'] = actionFlowAction['MAPPING_ACTION_UUID'];
                object['ACTION_UUID'] = actionFlowAction['ACTION_UUID'];
                object['ACTION_FLOW_UUID'] = actionFlowAction['ACTION_FLOW_UUID'];
                actionFlowActionList.push(object);
            }
            input["AppEngChildEntity:USER_ACTION_ACTION_FLOW_ACTION"] = actionFlowActionList;
        }


        let actionFlowAssociationQuery = `select * from ACTION_FLOW_ASSOCIATION where ACTION_FLOW_UUID=:ACTION_FLOW_UUID`;
        const actionFlowAssociationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", actionFlowAssociationQuery, input);

        if (actionFlowAssociationQueryData && actionFlowAssociationQueryData.length) {
            for (let actionFlowAssociation of actionFlowAssociationQueryData) {
                let object = {};
                object['ACTION_FLOW_ASSOCIATION_MAPPING_UUID'] = actionFlowAssociation['ACTION_FLOW_ASSOCIATION_MAPPING_UUID'];
                object['ACTION_FLOW_UUID'] = actionFlowAssociation['ACTION_FLOW_UUID'];
                object['DATA_STATE_UUID'] = actionFlowAssociation['ASSOCIACTION_UUID'];
                object['ASSOCIACTION_UUID'] = actionFlowAssociation['ASSOCIACTION_UUID'];
                actionFlowAssociationList.push(object);
            }

            input["AppEngChildEntity:USER_ACTION_ACTION_FLOW_ASSOCIATION"] = actionFlowAssociationList;
        }


        let actionFlowAPIQuery = `select * from ACTION_FLOW_SUB_PROCESS where ACTION_FLOW_UUID=:ACTION_FLOW_UUID`;
        const actionFlowAPIQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", actionFlowAPIQuery, input);

        if (actionFlowAPIQueryData && actionFlowAPIQueryData.length) {
            for (let actionFlowAPI of actionFlowAPIQueryData) {
                let object = {};
                object['MAPPING_SUB_PROCESS_UUID'] = actionFlowAPI['MAPPING_SUB_PROCESS_UUID'];
                object['SUB_PROCESS_UUID'] = actionFlowAPI['SUB_PROCESS_UUID'];
                object['ACTION_FLOW_UUID'] = actionFlowAPI['ACTION_FLOW_UUID'];
                actionFlowAPIList.push(object);
            }
            input["AppEngChildEntity:USER_ACTION_ACTION_FLOW_API"] = actionFlowAPIList;
        }
    }

    if (!input.ITEM_CLASS) {
        const onlineScreenPageNavigationQuery = `SELECT * FROM ONLINE_SCREEN_PAGE_NAVIGATION_TREE WHERE PROCESS_UUID=:PROCESS_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let onlineScreenPageNavigationQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, onlineScreenPageNavigationQuery, input);
        if (onlineScreenPageNavigationQueryData && Object.keys(onlineScreenPageNavigationQueryData).length) {
            let parsedTreeData = JSON.parse(onlineScreenPageNavigationQueryData['ONLINE_SCREEN_PAGE_NAVIGATION_TREE']);
            let selectedPage = input['UI_ELEMENT_UUID'];
            let modifiedData = removeNodeByPrimaryKey(parsedTreeData, selectedPage);
            if (modifiedData && modifiedData.length) {
                const depth = recalculateLevels(modifiedData);
                let object = {
                    'ONLINE_SCREEN_PAGE_NAVIGATION_UUID': onlineScreenPageNavigationQueryData['ONLINE_SCREEN_PAGE_NAVIGATION_UUID'],
                    'PROCESS_UUID': onlineScreenPageNavigationQueryData['PROCESS_UUID'],
                    'ONLINE_SCREEN_PAGE_NAVIGATION_TREE': JSON.stringify(modifiedData),
                    'ONLINE_SCREEN_PAGE_NAVIGATION_LEVEL_COUNT': depth,
                    'compositeEntityAction': 'Update'
                };
                onlineScreenPageNavigationList.push(object);
                input["AppEngChildEntity:ONLINE_SCREEN_PAGE_NAVIGATION_TREE"] = onlineScreenPageNavigationList;
            }
        }
    }
}