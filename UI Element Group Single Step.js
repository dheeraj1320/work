let uiElementGroupStepAttributeValueList = [];

let functionUiElementGroupStepList = [];
let functionUiElementGroupStepAttributeValueList = [];

let testCaseUiElementGroupStepList = [];
let testCaseUiElementGroupStepAttributeValueList = [];

let testCaseFunctionUiElementGroupStepList = [];
let testCaseFunctionUiElementGroupStepAttributeValueList = [];

let uiElementGroupStepUUID = uuid();

function isDataAvailable(str) {
    if (str === null || str === undefined || str.trim() === '' || str === 'null' || str === "' '" || str === 'undefined') {
        return false;
    } else {
        return true;
    }
}

async function processUiElementGroupStep(element, verbale) {
    let stepDefTemplateVerbage = verbale['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'];
    input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = verbale['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
    let stepVerviageID = "{StepVerbiage@#$'" + verbale['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] + "'}";
    let uiElementGroupStepAttributeKeysData = [stepVerviageID];
    input['UI_ELEMENT_GROUP_STEP_UUID'] = uiElementGroupStepUUID;
    let stepDefAttributeQuery = `SELECT STEP_DEFINITION_ATTRIBUTE_UUID,STEP_DEFINITION_ATTRIBUTE_MASTER_UUID FROM STEP_DEFINITION_ATTRIBUTE WHERE STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = '${verbale['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']}' order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
    let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input);
    for (let codeDesc of stepDefAttributeQueryData) {
        let object = {};
        object['UI_ELEMENT_GROUP_STEP_UUID'] = uiElementGroupStepUUID;
        object['UI_ELEMENT_GROUP_UUID'] = input['UI_ELEMENT_GROUP_UUID'];
        object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
        switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
            case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE'];
                stepDefTemplateVerbage = stepDefTemplateVerbage.replaceAll('<UI Element Value>', input['UI_ELEMENT_VALUE'] ? function () {
                    return "'" + input['UI_ELEMENT_VALUE'] + "'"
                } : "' '");
                let uiElementValueData = isDataAvailable(input['UI_ELEMENT_VALUE']) ? "'" + input['UI_ELEMENT_VALUE'] + "'" : "' '";
                uiElementGroupStepAttributeKeysData.push('{UIElementValue@#$' + uiElementValueData + "}");
                break;
            case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE1'];
                stepDefTemplateVerbage = stepDefTemplateVerbage.replaceAll('<UI Element Value 1>', input['UI_ELEMENT_VALUE1'] ? function () {
                    return "'" + input['UI_ELEMENT_VALUE1'] + "'"
                } : "' '");
                let uiElementValue1Data = isDataAvailable(input['UI_ELEMENT_VALUE1']) ? "'" + input['UI_ELEMENT_VALUE1'] + "'" : "' '";
                uiElementGroupStepAttributeKeysData.push('{UIElementValue@#$' + uiElementValue1Data + "}");
                break;
            case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = element['UI_ELEMENT_UUID'];
                const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=${"'" + element['UI_ELEMENT_UUID'] + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                stepDefTemplateVerbage = stepDefTemplateVerbage.replaceAll('<UI Element Name 1>', "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'");
                uiElementGroupStepAttributeKeysData.push('{UIElementName1@#$' + "'" + element['UI_ELEMENT_UUID'] + "'}");
                break;
            case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = element['UI_ELEMENT_UUID'];
                const uiElementQuery1 = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=${"'" + element['UI_ELEMENT_UUID'] + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;

                let uiElementQueryData1 = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery1, input);
                stepDefTemplateVerbage = stepDefTemplateVerbage.replaceAll('<UI Element Name>', "'" + uiElementQueryData1['UI_ELEMENT_NAME'] + "'");
                uiElementGroupStepAttributeKeysData.push('{UIElementName@#$' + "'" + element['UI_ELEMENT_UUID'] + "'}");
                break;
            case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                {
                    object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = element['UI_ELEMENT_UUID'];
                    const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=${"'" + element['UI_ELEMENT_UUID'] + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                    stepDefTemplateVerbage = stepDefTemplateVerbage.replaceAll('<User Action Name>', function () { return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'" });
                    uiElementGroupStepAttributeKeysData.push('{UserActionName@#$' + "'" + element['UI_ELEMENT_UUID'] + "'}");
                }
                break;
            case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                {
                    object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = element['UI_ELEMENT_TYPE'];
                    const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID=${"'" + element['UI_ELEMENT_TYPE'] + "'"}`;
                    let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input);
                    stepDefTemplateVerbage = stepDefTemplateVerbage.replaceAll('<User Action Type>', function () { return "'" + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + "'" });
                    uiElementGroupStepAttributeKeysData.push('{UserActionType@#$' + "'" + element['UI_ELEMENT_TYPE'] + "'}");
                }
                break;
            default: null
        }
        uiElementGroupStepAttributeValueList.push(object);
    }
    input['CURRENT_PAGE_CONTEXT'] = input['PAGE_UUID'];
    input['UI_ELEMENT_GROUP_STEP_NAME'] = stepDefTemplateVerbage;
    input['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'] = JSON.stringify(uiElementGroupStepAttributeKeysData);
}

async function processUiElements() {
    let uiElementQuery = `SELECT UI_ELEMENT_UUID, UI_ELEMENT_TYPE FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENTS`;
    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);

    let uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID='${uiElementQueryData['UI_ELEMENT_TYPE']}'`;
    let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input);

    const StepDefinitionTemplateVerbiageQuery = `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID =:STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID `;
    let StepDefinitionTemplateVerbiageQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", StepDefinitionTemplateVerbiageQuery, input);

    if (input['STEP_TYPE'] === 'User Input' && uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] === StepDefinitionTemplateVerbiageQueryData['APPLICABLE_UI_ELEMENT_TYPE']) {
        await processUiElementGroupStep(uiElementQueryData, StepDefinitionTemplateVerbiageQueryData);
    } else if (input['STEP_TYPE'] === 'Expected Result') {
        await processUiElementGroupStep(uiElementQueryData, StepDefinitionTemplateVerbiageQueryData);
    }


}
async function createFunctionUIElementGroupStep(functionStep) {
    let functionUIElementGroupStep = {};
    functionUIElementGroupStep['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] = uuid();
    functionUIElementGroupStep['FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'] = input['UI_ELEMENT_GROUP_STEP_NAME'];
    functionUIElementGroupStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
    functionUIElementGroupStep['CURRENT_PAGE_CONTEXT'] = input['PAGE_UUID'];
    functionUIElementGroupStep['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'] = input['STEP_TYPE'];
    functionUIElementGroupStep['FUNCTION_STEP_UUID'] = functionStep['FUNCTION_STEP_UUID'];
    functionUIElementGroupStep['FUNCTION_UUID'] = functionStep['FUNCTION_UUID'];
    functionUIElementGroupStep['UI_ELEMENT_GROUP_UUID'] = input['UI_ELEMENT_GROUP_UUID'];
    functionUIElementGroupStep['FUNCTIONAL_AREA_UUID '] = input['FUNCTIONAL_AREA_UUID '];
    functionUIElementGroupStep['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'] = input['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'];
    functionUIElementGroupStep['UI_ELEMENT_GROUP_STEP_UUID'] = uiElementGroupStepUUID;
    functionUiElementGroupStepList.push(functionUIElementGroupStep);
    await createFunctionUIElementGroupAttributeValue(functionUIElementGroupStep);
}

async function createFunctionUIElementGroupAttributeValue(functionUIElementGroupStep) {
    for (let attribute of uiElementGroupStepAttributeValueList) {
        let functionUIElementGroupAttributeValue = {};
        functionUIElementGroupAttributeValue['STEP_DEFINITION_ATTRIBUTE_UUID'] = attribute['STEP_DEFINITION_ATTRIBUTE_UUID'];
        functionUIElementGroupAttributeValue['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = attribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
        functionUIElementGroupAttributeValue['FUNCTION_STEP_UUID'] = functionUIElementGroupStep['FUNCTION_STEP_UUID'];
        functionUIElementGroupAttributeValue['FUNCTION_UUID'] = functionUIElementGroupStep['FUNCTION_UUID'];
        functionUIElementGroupAttributeValue['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] = functionUIElementGroupStep['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'];
        functionUIElementGroupAttributeValue['FUNCTIONAL_AREA_UUID '] = functionUIElementGroupStep['FUNCTIONAL_AREA_UUID '];
        functionUiElementGroupStepAttributeValueList.push(functionUIElementGroupAttributeValue);
    }
}

async function createTestCaseUIElementGroupStep(testCaseStep) {
    let testCaseUIElementGroupStep = {};
    testCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'] = uuid();
    testCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME'] = input['UI_ELEMENT_GROUP_STEP_NAME'];
    testCaseUIElementGroupStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
    testCaseUIElementGroupStep['CURRENT_PAGE_CONTEXT'] = input['PAGE_UUID'];
    testCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE'] = input['STEP_TYPE'];
    testCaseUIElementGroupStep['TEST_CASE_STEP_UUID'] = testCaseStep['TEST_CASE_STEP_UUID']
    testCaseUIElementGroupStep['UI_ELEMENT_GROUP_UUID'] = input['UI_ELEMENT_GROUP_UUID'];
    testCaseUIElementGroupStep['FUNCTIONAL_AREA_UUID'] = input['FUNCTIONAL_AREA_UUID'];
    testCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'] = input['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'];
    testCaseUIElementGroupStep['UI_ELEMENT_GROUP_STEP_UUID'] = uiElementGroupStepUUID;
    testCaseUiElementGroupStepList.push(testCaseUIElementGroupStep);
    await createTestCaseUIElementGroupAttributeValue(testCaseUIElementGroupStep);
}

async function createTestCaseUIElementGroupAttributeValue(testCaseUIElementGroupStep) {
    for (let attribute of uiElementGroupStepAttributeValueList) {
        let testCaseUIElementGroupAttributeValue = {};
        testCaseUIElementGroupAttributeValue['STEP_DEFINITION_ATTRIBUTE_UUID'] = attribute['STEP_DEFINITION_ATTRIBUTE_UUID'];
        testCaseUIElementGroupAttributeValue['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = attribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
        testCaseUIElementGroupAttributeValue['TEST_CASE_STEP_UUID'] = testCaseUIElementGroupStep['TEST_CASE_STEP_UUID'];
        testCaseUIElementGroupAttributeValue['UI_ELEMENT_GROUP_UUID'] = testCaseUIElementGroupStep['UI_ELEMENT_GROUP_UUID'];
        testCaseUIElementGroupAttributeValue['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'] = testCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'];
        testCaseUIElementGroupAttributeValue['FUNCTIONAL_AREA_UUID '] = testCaseUIElementGroupStep['FUNCTIONAL_AREA_UUID '];
        testCaseUiElementGroupStepAttributeValueList.push(testCaseUIElementGroupAttributeValue);
    }
}
async function createTestCaseFunctionUIElementGroupStep(testCaseFunctionStep) {
    let testCaseFunctionUIElementGroupStep = {};
    testCaseFunctionUIElementGroupStep['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] = uuid();
    testCaseFunctionUIElementGroupStep['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'] = input['UI_ELEMENT_GROUP_STEP_NAME'];
    testCaseFunctionUIElementGroupStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
    testCaseFunctionUIElementGroupStep['CURRENT_PAGE_CONTEXT'] = input['PAGE_UUID'];
    testCaseFunctionUIElementGroupStep['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'] = input['STEP_TYPE'];
    testCaseFunctionUIElementGroupStep['TEST_CASE_STEP_UUID'] = testCaseFunctionStep['TEST_CASE_STEP_UUID']
    testCaseFunctionUIElementGroupStep['TEST_CASE_FUNCTION_STEP_UUID'] = testCaseFunctionStep['TEST_CASE_FUNCTION_STEP_UUID'];
    testCaseFunctionUIElementGroupStep['UI_ELEMENT_GROUP_UUID'] = input['UI_ELEMENT_GROUP_UUID'];
    testCaseFunctionUIElementGroupStep['FUNCTIONAL_AREA_UUID'] = input['FUNCTIONAL_AREA_UUID'];
    testCaseFunctionUIElementGroupStep['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'] = input['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'];
    testCaseFunctionUIElementGroupStep['UI_ELEMENT_GROUP_STEP_UUID'] = uiElementGroupStepUUID;
    for (let step of functionUiElementGroupStepList) {
        if (testCaseFunctionStep['FUNCTION_STEP_UUID'] == step['FUNCTION_STEP_UUID']) {
            testCaseFunctionUIElementGroupStep['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] = step['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'];
        }
    }
    testCaseFunctionUiElementGroupStepList.push(testCaseFunctionUIElementGroupStep);
    await createTestCaseFunctionUIElementGroupAttributeValue(testCaseFunctionUIElementGroupStep);
}

async function createTestCaseFunctionUIElementGroupAttributeValue(testCaseFunctionUIElementGroupStep) {
    for (let attribute of uiElementGroupStepAttributeValueList) {
        let testCaseFunctionUIElementGroupAttributeValue = {};
        testCaseFunctionUIElementGroupAttributeValue['STEP_DEFINITION_ATTRIBUTE_UUID'] = attribute['STEP_DEFINITION_ATTRIBUTE_UUID'];
        testCaseFunctionUIElementGroupAttributeValue['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = attribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
        testCaseFunctionUIElementGroupAttributeValue['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] = testCaseFunctionUIElementGroupStep['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'];
        testCaseFunctionUIElementGroupAttributeValue['TEST_CASE_STEP_UUID'] = testCaseFunctionUIElementGroupStep['TEST_CASE_STEP_UUID'];
        testCaseFunctionUIElementGroupAttributeValue['UI_ELEMENT_GROUP_UUID'] = testCaseFunctionUIElementGroupStep['UI_ELEMENT_GROUP_UUID'];
        testCaseFunctionUIElementGroupAttributeValue['TEST_CASE_FUNCTION_STEP_UUID'] = testCaseFunctionUIElementGroupStep['TEST_CASE_FUNCTION_STEP_UUID'];
        testCaseFunctionUIElementGroupAttributeValue['FUNCTIONAL_AREA_UUID '] = testCaseFunctionUIElementGroupStep['FUNCTIONAL_AREA_UUID '];
        testCaseFunctionUiElementGroupStepAttributeValueList.push(testCaseFunctionUIElementGroupAttributeValue);
    }
}

if (input.compositeEntityAction === 'Save') {
    await processUiElements();

    let functionStepQuery = `Select FUNCTION_UUID, FUNCTION_STEP_UUID From FUNCTION_STEP_ATTRIBUTE_VALUE where FUNCTION_STEP_ATTRIBUTE_DATA='${input['UI_ELEMENT_GROUP_UUID']}'`;
    let functionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepQuery, input);
    if (functionStepQueryData && functionStepQueryData.length > 0) {
        for (let functionStep of functionStepQueryData) {
            await createFunctionUIElementGroupStep(functionStep);
        }
    }

    let testCaseStepQuery = `Select TEST_CASE_UUID, TEST_CASE_STEP_UUID From TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_ATTRIBUTE_DATA='${input['UI_ELEMENT_GROUP_UUID']}'`;
    let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
    if (testCaseStepQueryData && testCaseStepQueryData.length > 0) {
        for (let testCaseStep of testCaseStepQueryData) {
            await createTestCaseUIElementGroupStep(testCaseStep);
        }
    }

    let testCaseFunctionStepQuery = `Select tcfsav.TEST_CASE_STEP_UUID, tcfsav.TEST_CASE_FUNCTION_STEP_UUID, tcfs.FUNCTION_STEP_UUID From TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE tcfsav join TEST_CASE_FUNCTION_STEP tcfs on tcfs.TEST_CASE_FUNCTION_STEP_UUID = tcfsav.TEST_CASE_FUNCTION_STEP_UUID where tcfsav.TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA='${input['UI_ELEMENT_GROUP_UUID']}'`;
    let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
    if (testCaseFunctionStepQueryData && testCaseFunctionStepQueryData.length > 0) {
        for (let testCaseFunctionStep of testCaseFunctionStepQueryData) {
            await createTestCaseFunctionUIElementGroupStep(testCaseFunctionStep);
        }
    }

}
input["AppEngChildEntity:UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE"] = uiElementGroupStepAttributeValueList;

input["AppEngChildEntity:FUNCTION_UI_ELEMENT_GROUP_STEP"] = functionUiElementGroupStepList;
input["AppEngChildEntity:FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE"] = functionUiElementGroupStepAttributeValueList;

input["AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP"] = testCaseUiElementGroupStepList;
input["AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE"] = testCaseUiElementGroupStepAttributeValueList;

input["AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP"] = testCaseFunctionUiElementGroupStepList;
input["AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE"] = testCaseFunctionUiElementGroupStepAttributeValueList;