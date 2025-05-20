let testCaseList = [];
let testCaseStepList = [];
let testCaseStepAttributeValueList = [];
let testCaseFunctionStepList = [];
let testCaseFunctionStepAttributeValueList = [];
let testCaseFunctionUIElementGroupStepList = [];
let testCaseFunctionUIElementGroupStepAttributeList = [];
let testCaseUIElementGroupStepList = [];
let testCaseUIElementGroupStepAttributeList = [];
let testCaseRequirmentList = [];
let testCaseViewNavigationStepList = [];
let testCaseViewNavigationStepAttributeValueList = [];
let testSuiteTestCaseList = [];
let deletedTestCaseSet = new Set();
let deletedTestCaseStepSet = new Set();
let deletedTestCaseStepAttributeValueSet = new Set();
let deletedTestCaseFunctionStepSet = new Set();
let deletedTestCaseFunctionStepAttributeValueSet = new Set();
let deletedTestCaseFunctionUIElementGroupStepSet = new Set();
let deletedTestCaseFunctionUIElementGroupStepAttributeSet = new Set();
let deletedTestCaseUIElementGroupStepSet = new Set();
let deletedTestCaseUIElementGroupStepAttributeSet = new Set();
let deletedTestCaseRequirmentSet = new Set();
let deletedTestCaseViewNavigationStepSet = new Set();
let deletedTestCaseViewNavigationAttributeSet = new Set();

function deleteRecord(key, value, deleteType) {
    const deleteParameter = {};
    deleteParameter[key] = value;
    deleteParameter["compositeEntityAction"] = "Delete";

    switch (deleteType) {
        case "TEST_CASE":
            if (!deletedTestCaseSet.has(value)) {
                testCaseList.push(deleteParameter);
                deletedTestCaseSet.add(value);
            }
            break;
        case "TEST_CASE_STEP":
            if (!deletedTestCaseStepSet.has(value)) {
                testCaseStepList.push(deleteParameter);
                deletedTestCaseStepSet.add(value);
            }
            break;
        case "TEST_CASE_STEP_ATTRIBUTE_VALUE":
            if (!deletedTestCaseStepAttributeValueSet.has(value)) {
                testCaseStepAttributeValueList.push(deleteParameter);
                deletedTestCaseStepAttributeValueSet.add(value);
            }
            break;
        case "TEST_CASE_FUNCTION_STEP":
            if (!deletedTestCaseFunctionStepSet.has(value)) {
                testCaseFunctionStepList.push(deleteParameter);
                deletedTestCaseFunctionStepSet.add(value);
            }
            break;
        case "TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE":
            if (!deletedTestCaseFunctionStepAttributeValueSet.has(value)) {
                testCaseFunctionStepAttributeValueList.push(deleteParameter);
                deletedTestCaseFunctionStepAttributeValueSet.add(value);
            }
            break;
        case "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP":
            if (!deletedTestCaseFunctionUIElementGroupStepSet.has(value)) {
                testCaseFunctionUIElementGroupStepList.push(deleteParameter);
                deletedTestCaseFunctionUIElementGroupStepSet.add(value);
            }
            break;
        case "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE":
            if (!deletedTestCaseFunctionUIElementGroupStepAttributeSet.has(value)) {
                testCaseFunctionUIElementGroupStepAttributeList.push(deleteParameter);
                deletedTestCaseFunctionUIElementGroupStepAttributeSet.add(value);
            }
            break;
        case "TEST_CASE_UI_ELEMENT_GROUP_STEP":
            if (!deletedTestCaseUIElementGroupStepSet.has(value)) {
                testCaseUIElementGroupStepList.push(deleteParameter);
                deletedTestCaseUIElementGroupStepSet.add(value);
            }
            break;
        case "TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE":
            if (!deletedTestCaseUIElementGroupStepAttributeSet.has(value)) {
                testCaseUIElementGroupStepAttributeList.push(deleteParameter);
                deletedTestCaseUIElementGroupStepAttributeSet.add(value);
            }
            break;
        case "TEST_CASE_REQUIREMENT":
            if (!deletedTestCaseRequirmentSet.has(value)) {
                testCaseRequirmentList.push(deleteParameter);
                deletedTestCaseRequirmentSet.add(value);
            }
            break;
        case "TEST_CASE_VIEW_NAVIGATION_STEP":
            if (!deletedTestCaseViewNavigationStepSet.has(value)) {
                testCaseViewNavigationStepList.push(deleteParameter);
                deletedTestCaseViewNavigationStepSet.add(value);
            }
            break;
        case "TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE":
            if (!deletedTestCaseViewNavigationAttributeSet.has(value)) {
                testCaseViewNavigationStepAttributeValueList.push(deleteParameter);
                deletedTestCaseViewNavigationAttributeSet.add(value);
            }
            break;

        case "TEST_SUITE_TEST_SET": {
            testSuiteTestCaseList.push(deleteParameter);
        }
            break;
    }
}

async function deleteTestCaseData(testCaseUUID) {
    deleteRecord('TEST_CASE_UUID', testCaseUUID, 'TEST_CASE');
}

async function deleteTestCaseStepData(testCaseStepUUID) {
    deleteRecord('TEST_CASE_STEP_UUID', testCaseStepUUID, 'TEST_CASE_STEP');
}

async function deleteTestCaseRequirmentData(testCaseRequirmentStr) {
    deleteRecord('TEST_CASE_REQUIREMENT_UUID', testCaseRequirmentStr, 'TEST_CASE_REQUIREMENT');
}

async function deleteTestCaseStepAttributeData(testCaseStepUUID) {
    const testCaseStepAttributeQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeQuery, input);
    for (let attributeData of testCaseStepAttributeQueryData) {
        await deleteRecord('TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_STEP_ATTRIBUTE_VALUE');
    }
}

async function deleteTestCaseUIElementGroupStepData(testCaseStepUUID) {
    const testCaseUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementGroupStepQuery, input);
    for (let data of testCaseUIElementGroupStepQueryData) {
        await deleteRecord('TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP');
    }
}

async function deleteTestCaseUIElementGroupStepAttributeData(testCaseStepUUID) {
    const testCaseUIElementGroupStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementGroupStepAttributeValueQuery, input);
    for (let attributeData of testCaseUIElementGroupStepAttributeValueQueryData) {
        await deleteRecord('TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
    }
}

async function deleteTestCaseFunctionStepData(testCaseStepUUID) {
    const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
    for (let data of testCaseFunctionStepData) {
        await deleteRecord('TEST_CASE_FUNCTION_STEP_UUID', data['TEST_CASE_FUNCTION_STEP_UUID'], 'TEST_CASE_FUNCTION_STEP');
    }
}

async function deleteTestCaseFunctionStepAttributeData(testCaseStepUUID) {
    const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
    for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
        await deleteRecord('TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE');
    }
}

async function deleteTestCaseFunctionUIElementGroupStepData(testCaseStepUUID) {
    const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);
    for (let data of testCaseFunctionUIElementGroupStepQueryData) {
        await deleteRecord('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP');
    }
}

async function deleteTestCaseFunctionUIElementGroupStepAttributeData(testCaseStepUUID) {
    const testCaseFunctionUIElementGroupStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_UUID IN (${testCaseStepUUID}) AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeValueQuery, input);
    for (let attributeData of testCaseFunctionUIElementGroupStepAttributeValueQueryData) {
        await deleteRecord('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
    }
}


async function deleteTestCaseDataAndSteps(testCaseUUID) {
    await deleteTestCaseData(testCaseUUID);

    const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP WHERE TEST_CASE_UUID = :TEST_CASE_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, { TEST_CASE_UUID: testCaseUUID, APP_LOGGED_IN_FUNTIONAL_AREA_ID: input.APP_LOGGED_IN_FUNTIONAL_AREA_ID });

    for (let stepData of testCaseStepQueryData) {
        const testCaseStepUUID = stepData['TEST_CASE_STEP_UUID'];
        await deleteTestCaseStepData(testCaseStepUUID);
        await deleteTestCaseStepAttributeData("'" + testCaseStepUUID + "'");
        if (stepData["IS_UI_ELEMENT_GROUP_STEP"] === 'Yes' && stepData["IS_FUNCTION_STEP"] === 'No') {
            await deleteTestCaseUIElementGroupStepData("'" + testCaseStepUUID + "'");
            await deleteTestCaseUIElementGroupStepAttributeData("'" + testCaseStepUUID + "'");
        } else if (stepData["IS_UI_ELEMENT_GROUP_STEP"] === 'No' && stepData["IS_FUNCTION_STEP"] === 'Yes') {
            await deleteTestCaseFunctionStepData("'" + testCaseStepUUID + "'");
            await deleteTestCaseFunctionStepAttributeData("'" + testCaseStepUUID + "'");

            const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP WHERE TEST_CASE_STEP_UUID = :TEST_CASE_STEP_UUID AND FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, { TEST_CASE_STEP_UUID: testCaseStepUUID, APP_LOGGED_IN_FUNTIONAL_AREA_ID: input.APP_LOGGED_IN_FUNTIONAL_AREA_ID });

            for (let functionUIElementGroupStepData of testCaseFunctionUIElementGroupStepQueryData) {
                await deleteTestCaseFunctionUIElementGroupStepData("'" + functionUIElementGroupStepData['TEST_CASE_STEP_UUID'] + "'");
                await deleteTestCaseFunctionUIElementGroupStepAttributeData("'" + functionUIElementGroupStepData['TEST_CASE_STEP_UUID'] + "'");
            }
        }
        if (stepData['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
            const viewNavigationDataQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP WHERE TEST_CASE_STEP_UUID = :TEST_CASE_STEP_UUID AND FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`
            const viewNavigationData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewNavigationDataQuery, { TEST_CASE_STEP_UUID: testCaseStepUUID, APP_LOGGED_IN_FUNTIONAL_AREA_ID: input.APP_LOGGED_IN_FUNTIONAL_AREA_ID });

            for (const [index, viewNavigation] of viewNavigationData.entries()) {
                deleteRecord('TEST_CASE_VIEW_NAVIGATION_STEP_UUID', viewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'], 'TEST_CASE_VIEW_NAVIGATION_STEP');

                const viewNavAttributeQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_VIEW_NAVIGATION_STEP_UUID = '${viewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_UUID']}'`
                const viewNavAttributeData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewNavAttributeQuery, input);

                for (const attrData of viewNavAttributeData) {
                    deleteRecord('TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', attrData['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE');
                }

            }

        }
    }

}

async function deleteAllTestCases() {
    const testCaseQuery = `SELECT * FROM TEST_CASE WHERE TEST_SET_UUID = :TEST_SET_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseQuery, input);

    for (let testCaseData of testCaseQueryData) {
        const testCaseUUID = testCaseData['TEST_CASE_UUID'];
        await deleteTestCaseDataAndSteps(testCaseUUID);

        const testCaseRequirmentQuery = `SELECT * FROM TEST_CASE_REQUIREMENT WHERE TEST_CASE_UUID = :TEST_CASE_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseRequirmentQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseRequirmentQuery, { TEST_CASE_UUID: testCaseUUID, APP_LOGGED_IN_FUNTIONAL_AREA_ID: input.APP_LOGGED_IN_FUNTIONAL_AREA_ID });

        for (let requirmentData of testCaseRequirmentQueryData) {
            await deleteTestCaseRequirmentData(requirmentData['TEST_CASE_REQUIREMENT_UUID']);
        }
    }
}


async function unlinkTestSetFromTestSuite() {
    const testSuiteTestSetQuery = `SELECT * FROM TEST_SUITE_TEST_SET WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND TEST_SET_UUID=:TEST_SET_UUID`;
    const testSuiteTestSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSuiteTestSetQuery, input);
    if (testSuiteTestSetQueryData && testSuiteTestSetQueryData.length) {
        for (let data of testSuiteTestSetQueryData) {
            deleteRecord('TEST_SUITE_TEST_SET_UUID', data['TEST_SUITE_TEST_SET_UUID'], 'TEST_SUITE_TEST_SET');
        }
    }
}


if (input.compositeEntityAction === 'Delete') {
    await deleteAllTestCases();
    await unlinkTestSetFromTestSuite();
} else if (input.compositeEntityAction === 'Insert' || input.compositeEntityAction === 'Save') {
    input['TEST_SET_TYPE'] = 'Functional';
}


input['AppEngChildEntity:INTEGRATION_TEST_CASE'] = testCaseList;
input['AppEngChildEntity:TEST_CASE_STEP_NEW'] = testCaseStepList;
input['AppEngChildEntity:TEST_CASE_STEP_ATTRIBUTE_VALUE'] = testCaseStepAttributeValueList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP'] = testCaseFunctionStepList;
input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE"] = testCaseFunctionStepAttributeValueList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP'] = testCaseFunctionUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseFunctionUIElementGroupStepAttributeList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP'] = testCaseUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseUIElementGroupStepAttributeList;
input['AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT'] = testCaseRequirmentList;
input['AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP'] = testCaseViewNavigationStepList;
input['AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'] = testCaseViewNavigationStepAttributeValueList;
input['AppEngChildEntity:TEST_SUITE_TEST_SET'] = testSuiteTestCaseList;