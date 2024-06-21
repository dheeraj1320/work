let testCaseStepAttributeValueArray = [];
let testCaseStepList = [];
let testCaseFunctionStepAttributeValueArray = [];
let testCaseFunctionStepArray = [];
let testCaseFunctionUIElementGroupStepAttributeList = [];
let testCaseFunctionUIElementGroupStepList = [];
let testCaseUIElementGroupStepAttributeList = [];
let testCaseUIElementGroupStepList = [];
async function fetchStepDefinitionTemplateVerbiage(stepDefTemplateVerbiageId) {
    // firing query to get all the step definition for particular stap def name (verbiage)
    const stepDefAttributeQuery = `SELECT STEP_DEFINITION_ATTRIBUTE_UUID,STEP_DEFINITION_ATTRIBUTE_MASTER_UUID,STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME FROM STEP_DEFINITION_ATTRIBUTE sda,STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv where sda.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID=sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID and sda.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID in(${stepDefTemplateVerbiageId}) order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
    let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input);
    return stepDefAttributeQueryData;
}

function isDataAvailable(str) {
    if (str === null || str === undefined || str.trim() === '' || str === 'null' || str === "' '" || str === 'undefined') {
        return false;
    } else {
        return true;
    }
}
async function changeSequence() {
    let seqId = input['TEST_CASE_STEP_SEQ_ID'];
    if (input.compositeEntityAction == "Save") {
        const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_STEP_SEQ_ID >= :TEST_CASE_STEP_SEQ_ID ORDER BY TEST_CASE_STEP_SEQ_ID asc`;
        let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
        if (testCaseStepQueryData && testCaseStepQueryData.length) {
            for (let data of testCaseStepQueryData) {
                let changedSeqID = {}
                changedSeqID['TEST_CASE_STEP_UUID'] = data['TEST_CASE_STEP_UUID'];
                changedSeqID['TEST_CASE_STEP_SEQ_ID'] = ++seqId;
                testCaseStepList.push(changedSeqID)
            }
        }
    } else if (input.compositeEntityAction == "Delete") {

        const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_STEP_SEQ_ID > :TEST_CASE_STEP_SEQ_ID ORDER BY TEST_CASE_STEP_SEQ_ID asc`;
        let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
        if (testCaseStepQueryData && testCaseStepQueryData.length) {
            for (let data of testCaseStepQueryData) {
                let changedSeqID = {}
                changedSeqID["compositeEntityAction"] = "Update";
                changedSeqID['TEST_CASE_STEP_UUID'] = data['TEST_CASE_STEP_UUID'];
                changedSeqID['TEST_CASE_STEP_SEQ_ID'] = seqId;
                seqId++;
                testCaseStepList.push(changedSeqID)
            }
        }
    }
}

let stepDefAttributeQueryData = await fetchStepDefinitionTemplateVerbiage("'" + input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] + "'");
let testCaseNameStepDefVerbiageStr = stepDefAttributeQueryData[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'];
let stepVerviageID = "{StepVerbiage@#$'" + input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] + "'}";
let testCaseNameAttributeKeysStepDefVerbiageStr = [stepVerviageID];

// this createTestCaseStepAttributeValue function is responsible to create the record for test case step attribute value table and also responsible to generete the actual step definition based on selected verbiage
async function createTestCaseStepAttributeValue(stepDefAttributeData) {
    for (let codeDesc of stepDefAttributeData) {
        let object = {};
        object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
        object['TEST_CASE_UUID'] = input['TEST_CASE_UUID'];
        object['TEST_SET_UUID'] = input['TEST_SET_UUID'];
        switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
            case '57b76ab3-8112-4343-af0f-49643c808bf7':
                let currentPage = input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
                // input['CURRENT_PAGE_CONTEXT'] = currentPage;
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = currentPage;
                const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID=${"'" + currentPage + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", pageNewQuery, input);
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<Page Name>', function () {
                    return "'" + pageNewQueryData['PAGE_NAME'] + "'"
                });

                testCaseNameAttributeKeysStepDefVerbiageStr.push('{PageName@#$' + "'" + currentPage + "'}");
                break;

            case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME'];
                const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<UI Element Name>', function () {
                    return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                });
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{UIElementName@#$' + "'" + input['UI_ELEMENT_NAME'] + "'}");
                break;

            case '7f855066-ad39-4325-8108-30befb2447e6':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_TYPE'];
                const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID=:UI_ELEMENT_TYPE`;
                let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input);
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<UI Element Type>', function () {
                    return "'" + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + "'"
                });
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{UIElementType@#$' + "'" + input['UI_ELEMENT_TYPE'] + "'}");
                break;

            case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE'];
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<UI Element Value>', input['UI_ELEMENT_VALUE'] ? function () {
                    return "'" + input['UI_ELEMENT_VALUE'] + "'"
                } : "' '");
                let uiElementValueData = isDataAvailable(input['UI_ELEMENT_VALUE']) ? "'" + input['UI_ELEMENT_VALUE'] + "'" : "' '";
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{UIElementValue@#$' + uiElementValueData + "}");
                break;

            case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['KEY_NAME_IN_KEY_PAD'];
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<Key Name in Keypad>', function () {
                    return "'" + input['KEY_NAME_IN_KEY_PAD'] + "'"
                });
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{KeyNameinKeypad@#$' + "'" + input['KEY_NAME_IN_KEY_PAD'] + "'}");
                break;

            case '005d158d-428c-4bca-ae2d-1c3f9630b549':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['EVENT_NAME'];
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<Event Name>', input['EVENT_NAME'] ? function () {
                    return "'" + input['EVENT_NAME'] + "'"
                } : "' '");
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{EventName@#$' + "'" + input['EVENT_NAME'] + "'}");
                break;

            case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['CONFIRM_UI_ELEMENT_VALUE'];
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<Confirm UI Element Value>', input['CONFIRM_UI_ELEMENT_VALUE'] ? function () {
                    return "'" + input['CONFIRM_UI_ELEMENT_VALUE'] + "'"
                } : "' '");
                let confirmUIElementValueData = isDataAvailable(input['CONFIRM_UI_ELEMENT_VALUE']) ? "'" + input['CONFIRM_UI_ELEMENT_VALUE'] + "'" : "' '";
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{ConfirmUIElementValue@#$' + confirmUIElementValueData + "}");
                break;

            case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['FUNCTION_UUID'];
                const functionNameQuery = `SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID=:FUNCTION_UUID`;
                let functionNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", functionNameQuery, input);
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<Function Name>', function () {
                    return "'" + functionNameQueryData['FUNCTION_NAME'] + "'"
                });
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{FunctionName@#$' + "'" + input['FUNCTION_UUID'] + "'}");
                break;

            case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a': {
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME_1'];
                const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME_1 AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<UI Element Name 1>', function () {
                    return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                });
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{UIElementName1@#$' + "'" + input['UI_ELEMENT_NAME_1'] + "'}");
            }
                break;

            case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE_1'];
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<UI Element Value 1>', input['UI_ELEMENT_VALUE_1'] ? function () {
                    return "'" + input['UI_ELEMENT_VALUE_1'] + "'"
                } : "' '");
                let uiElementValue1Data = isDataAvailable(input['UI_ELEMENT_VALUE_1']) ? "'" + input['UI_ELEMENT_VALUE_1'] + "'" : "' '";
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{UIElementValue1@#$' + uiElementValue1Data + "}");
                break;

            // user action name
            case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43': {
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['USER_ACTION_NAME'];
                const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:USER_ACTION_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<User Action Name>', function () {
                    return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                });
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{UserActionName@#$' + "'" + input['USER_ACTION_NAME'] + "'}");
            }
                break;
            // user action type
            case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43': {
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['USER_ACTION_TYPE'];
                const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID=:USER_ACTION_TYPE`;
                let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input);
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<User Action Type>', function () {
                    return "'" + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + "'"
                });
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{UserActionType@#$' + "'" + input['USER_ACTION_TYPE'] + "'}");

            }
                break;

            case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_GROUP_UUID'];
                let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP  WHERE UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let uiElementGroupStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input);
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<UI Element Group Name>', function () {
                    return "'" + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + "'"
                });
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{UIElementGroupName@#$' + "'" + input['UI_ELEMENT_GROUP_UUID'] + "'}");
                break;
            // page number
            case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['PAGE_NUMBER'];
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<Page Number>', input['PAGE_NUMBER'] ? function () {
                    return "'" + input['PAGE_NUMBER'] + "'"
                } : "' '");
                let pageNumberData = isDataAvailable(input['PAGE_NUMBER']) ? "'" + input['PAGE_NUMBER'] + "'" : "' '";
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{PageNumber@#$' + pageNumberData + "}");
                break;

            case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['DATA_VALUE'];
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<Data Value>', input['DATA_VALUE'] ? function () {
                    return "'" + input['DATA_VALUE'] + "'"
                } : "' '");
                let dataValuesData = isDataAvailable(input['DATA_VALUE']) ? "'" + input['DATA_VALUE'] + "'" : "' '";
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{DataValue@#$' + dataValuesData + "}");
                break;

            case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['DATA_KEY'];
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<Data Key>', input['DATA_KEY'] ? function () {
                    return "'" + input['DATA_KEY'] + "'"
                } : "' '");
                let dataKeyData = isDataAvailable(input['DATA_KEY']) ? "'" + input['DATA_KEY'] + "'" : "' '";
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{DataKey@#$' + dataKeyData + "}");
                break;

            case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['FILE_NAME'];
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<File Name>', input['FILE_NAME'] ? function () {
                    return "'" + input['FILE_NAME'] + "'"
                } : "' '");
                let fileNameData = isDataAvailable(input['FILE_NAME']) ? "'" + input['FILE_NAME'] + "'" : "' '";
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{FileName@#$' + fileNameData + "}");
                break;

            case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                object['TEST_CASE_STEP_ATTRIBUTE_DATA'] = input['DOCUMENT_PARSER_NAME'];
                testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<Document Parser Name>', input['DOCUMENT_PARSER_NAME'] ? function () {
                    return "'" + input['DOCUMENT_PARSER_NAME'] + "'"
                } : "' '");
                let documentParserNameData = isDataAvailable(input['DOCUMENT_PARSER_NAME']) ? "'" + input['DOCUMENT_PARSER_NAME'] + "'" : "' '";
                testCaseNameAttributeKeysStepDefVerbiageStr.push('{DocumentParserName@#$' + documentParserNameData + "}");
                break;
            default:
                null
        }
        testCaseStepAttributeValueArray.push(object);
    }
}

function deleteRecords(key, value, deleteType) {
    const deleteParamenter = {};
    deleteParamenter[key] = value;
    deleteParamenter["compositeEntityAction"] = "Delete";
    if (deleteType === "TEST_CASE_STEP") {
        testCaseStepList.push(deleteParamenter);
    } else if (deleteType === "TEST_CASE_STEP_ATTRIBUTE_VALUE") {
        testCaseStepAttributeValueArray.push(deleteParamenter);
    } else if (deleteType === "TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE") {
        testCaseFunctionStepAttributeValueArray.push(deleteParamenter);
    } else if (deleteType === "TEST_CASE_FUNCTION_STEP") {
        testCaseFunctionStepArray.push(deleteParamenter);
    } else if (deleteType === "TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE") {
        testCaseUIElementGroupStepAttributeList.push(deleteParamenter);
    } else if (deleteType === "TEST_CASE_UI_ELEMENT_GROUP_STEP") {
        testCaseUIElementGroupStepList.push(deleteParamenter);
    } else if (deleteType === "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE") {
        testCaseFunctionUIElementGroupStepAttributeList.push(deleteParamenter);
    } else if (deleteType === "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP") {
        testCaseFunctionUIElementGroupStepList.push(deleteParamenter);
    }
}

async function deleteTestCaseStepAttributeData(testCaseStepStr) {
    // firing the query to get all the test case step attribute value for that particulat test case step
    const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input);

    for (let attributeData of testCaseStepAttributeValueQueryData) {
        deleteRecords('TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_STEP_ATTRIBUTE_VALUE');
    }
}


async function deleteTestCaseFunctionStepAttributeData(testCaseStepStr) {
    // firing the query to get all the test case function step attribute value for that particulat test case step
    const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);

    for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
        deleteRecords('TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE');
    }
}

async function deleteTestCaseUIElementGroupStepAttributeData(testCaseStepStr) {
    // firing the query to get all the test case function step attribute value for that particulat test case step
    const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);

    for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
        deleteRecords('TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
    }
}


async function deleteTestCaseFunctionStepData(testCaseStepStr) {
    // firing the query to get all the test case function step  for that particulat test case step
    const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);

    for (let data of testCaseFunctionStepData) {
        deleteRecords('TEST_CASE_FUNCTION_STEP_UUID', data['TEST_CASE_FUNCTION_STEP_UUID'], 'TEST_CASE_FUNCTION_STEP');
    }
}


async function deleteTestCaseUIElementGroupStepData(testCaseStepStr) {
    // firing the query to get all the test case function step  for that particulat test case step
    const testCaseUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementGroupStepQuery, input);

    for (let data of testCaseUIElementGroupStepQueryData) {
        deleteRecords('TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP');
    }
}


async function deleteTestCaseFunctionUIElementGroupStepAttributeData(testCaseStepStr) {
    // firing the query to get all the test case function step attribute value for that particulat test case step
    const testCaseFunctionUIElementGroupStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeValueQuery, input);

    for (let attributeData of testCaseFunctionUIElementGroupStepAttributeValueQueryData) {
        deleteRecords('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
    }
}


async function deleteTestCaseFunctionUIElementGroupStepData(testCaseStepStr) {
    // firing the query to get all the test case function step  for that particular test case step
    const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);

    for (let data of testCaseFunctionUIElementGroupStepQueryData) {
        deleteRecords('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP');
    }
}


async function createTestCaseFunctionStep() {
    let functionStepQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_STEP_ID asc`;
    let functionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionStepQuery, input);
    if (functionStepQueryData && functionStepQueryData.length) {
        // testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<UI Element Group Name>', "'" + functionStepQueryData[0]['UI_ELEMENT_GROUP_NAME'] + "'");
        for (let data of functionStepQueryData) {
            let testCaseFunctionStepId = uuid();
            let testCaseFunctionStep = {
                TEST_CASE_FUNCTION_STEP_UUID: testCaseFunctionStepId,
                TEST_CASE_FUNCTION_STEP_NAME: data['FUNCTION_STEP_NAME'],
                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
                NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
                TEST_CASE_FUNCTION_STEP_TYPE: data['FUNCTION_STEP_TYPE'],
                FUNCTION_STEP_UUID: data['FUNCTION_STEP_UUID'],
                FUNCTION_UUID: input['FUNCTION_UUID'],
                TEST_CASE_FUNCTION_STEP_ATTRIBUTE_KEYS: data['FUNCTION_STEP_ATTRIBUTE_KEYS']
            };

            let functionStepId = `'` + data['FUNCTION_STEP_UUID'] + `'`;
            let functionStepAttributeQuery = `SELECT * FROM FUNCTION_STEP_ATTRIBUTE_VALUE where FUNCTION_STEP_UUID in(${functionStepId})`;
            let functionStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionStepAttributeQuery, input);

            for (let functionStepAttribute of functionStepAttributeQueryData) {
                let stepDefArttributeId = `'` + functionStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'] + `'`;
                let stepDefinitionAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_ATTRIBUTE_UUID in(${stepDefArttributeId})`;
                let stepDefinitionAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefinitionAttributeQuery, input);
                for (let codeDesc of stepDefinitionAttributeQueryData) {
                    let object = {};
                    object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
                    object['TEST_CASE_FUNCTION_STEP_UUID'] = testCaseFunctionStepId;
                    object['FUNCTION_UUID'] = input['FUNCTION_UUID'];
                    switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
                        //page
                        case '57b76ab3-8112-4343-af0f-49643c808bf7':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;
                        // ui element
                        case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;
                        // ui element type
                        case '7f855066-ad39-4325-8108-30befb2447e6':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;
                        // ui element value
                        case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;

                        // key name in key pad
                        case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;
                        // event name
                        case '005d158d-428c-4bca-ae2d-1c3f9630b549':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;
                        //confitm 
                        case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;
                        //function 
                        case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                            break;
                        // ui element name 1
                        case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;
                        // ui element value 1
                        case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;
                        // user action name
                        case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;
                        // user action type
                        case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;
                        //ui element group
                        case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                            object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionStepAttribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
                            break;
                        default:
                            null
                    }
                    testCaseFunctionStepAttributeValueArray.push(object);
                }
            }

            testCaseFunctionStep['IS_UI_ELEMENT_GROUP_STEP'] = 'No';
            let functionUIElementGroupStepQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_STEP_UUID in(${functionStepId}) order by FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
            let functionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionUIElementGroupStepQuery, input);

            if (functionUIElementGroupStepQueryData && functionUIElementGroupStepQueryData.length) {
                testCaseFunctionStep['IS_UI_ELEMENT_GROUP_STEP'] = 'Yes';
                await createTestCaseFunctionUIElementGroupStep(functionUIElementGroupStepQueryData, testCaseFunctionStepId);
            }
            testCaseFunctionStepArray.push(testCaseFunctionStep);
        }
    }
}

async function createTestCaseFunctionUIElementGroupStep(functionUIElementGroupStepQueryData, testCaseFunctionStepId) {
    if (functionUIElementGroupStepQueryData && functionUIElementGroupStepQueryData.length) {
        // testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<UI Element Group Name>', "'" + functionUIElementGroupStepQueryData[0]['UI_ELEMENT_GROUP_NAME'] + "'");
        for (let data of functionUIElementGroupStepQueryData) {
            let testCaseFunctionUIElementGroupStepId = uuid();
            let getKeywordForStepType = data['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'] === 'Pre Condition' ? 'Given ' : data['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'] === 'User Input' ? 'When ' : data['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'] === 'Expected Result' ? 'Then ' : '';

            let testCaseFunctionUIElementGroupStep = {
                TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: testCaseFunctionUIElementGroupStepId,
                TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: data['FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
                TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: data['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
                UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID'],
                TEST_CASE_FUNCTION_STEP_UUID: testCaseFunctionStepId,
                FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: data['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'],
                TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS: data['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS']
            };

            let functiomUIElementGroupStepId = `'` + data['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] + `'`;
            let functiomUIElementGroupStepAttributeQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${functiomUIElementGroupStepId})`;

            let functiomUIElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functiomUIElementGroupStepAttributeQuery, input);
            for (let functiomUIElementGroupStepAttribute of functiomUIElementGroupStepAttributeQueryData) {
                let stepDefArttributeId = `'` + functiomUIElementGroupStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'] + `'`;
                let stepDefinitionAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_ATTRIBUTE_UUID in(${stepDefArttributeId})`;
                let stepDefinitionAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefinitionAttributeQuery, input);
                for (let codeDesc of stepDefinitionAttributeQueryData) {
                    let object = {};
                    object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
                    object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] = testCaseFunctionUIElementGroupStepId;
                    object['UI_ELEMENT_GROUP_UUID'] = data['UI_ELEMENT_GROUP_UUID'],
                        object['TEST_CASE_FUNCTION_STEP_UUID'] = testCaseFunctionStepId
                    switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
                        //page
                        case '57b76ab3-8112-4343-af0f-49643c808bf7':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        // ui element
                        case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        // ui element type
                        case '7f855066-ad39-4325-8108-30befb2447e6':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        // ui element value
                        case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;

                        // key name in key pad
                        case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        // event name
                        case '005d158d-428c-4bca-ae2d-1c3f9630b549':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        //confitm 
                        case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        //function 
                        case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                            break;
                        // ui element name 1
                        case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        // ui element value 1
                        case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        // user action name
                        case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        // user action type
                        case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        //ui element group
                        case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                            object['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = functiomUIElementGroupStepAttribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;

                        default:
                            null
                    }
                    testCaseFunctionUIElementGroupStepAttributeList.push(object);
                }
            }
            testCaseFunctionUIElementGroupStepList.push(testCaseFunctionUIElementGroupStep);
        }
    }
}

async function createTestCaseUIElementGroupStep() {
    let uiElementGroupStepQuery = `SELECT UI_ELEMENT_GROUP_STEP_UUID,UI_ELEMENT_GROUP_NAME,STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID,UI_ELEMENT_GROUP_STEP_NAME,ueg.UI_ELEMENT_GROUP_UUID,UI_ELEMENT_STEP_FILTER_TYPE,CURRENT_PAGE_CONTEXT,UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS FROM UI_ELEMENT_GROUP ueg ,UI_ELEMENT_GROUP_STEP uegs WHERE ueg.UI_ELEMENT_GROUP_UUID=uegs.UI_ELEMENT_GROUP_UUID and ueg.UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID and ueg.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by UI_ELEMENT_GROUP_STEP_ID asc`;
    let uiElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input);

    if (uiElementGroupStepQueryData && uiElementGroupStepQueryData.length) {
        // testCaseNameStepDefVerbiageStr = testCaseNameStepDefVerbiageStr.replaceAll('<UI Element Group Name>', "'" + uiElementGroupStepQueryData[0]['UI_ELEMENT_GROUP_NAME'] + "'");

        for (let data of uiElementGroupStepQueryData) {
            let testCaseUIElementGroupStepId = uuid();
            let getKeywordForStepType = data['UI_ELEMENT_STEP_FILTER_TYPE'] === 'Pre Condition' ? 'Given ' : data['UI_ELEMENT_STEP_FILTER_TYPE'] === 'User Input' ? 'When ' : data['UI_ELEMENT_STEP_FILTER_TYPE'] === 'Expected Result' ? 'Then ' : '';
            let testCaseUIElementGroupStep = {
                TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: testCaseUIElementGroupStepId,
                TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME: getKeywordForStepType + data['UI_ELEMENT_GROUP_STEP_NAME'],
                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
                TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE: data['UI_ELEMENT_STEP_FILTER_TYPE'],
                UI_ELEMENT_GROUP_UUID: input['UI_ELEMENT_GROUP_UUID'],
                TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS: data['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS']
            };

            let uiElementGroupStepId = `'` + data['UI_ELEMENT_GROUP_STEP_UUID'] + `'`;
            let uiElementGroupStepAttributeQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where UI_ELEMENT_GROUP_STEP_UUID in(${uiElementGroupStepId})`;
            let uiElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepAttributeQuery, input);
            for (let uiElementGroupStepAttribute of uiElementGroupStepAttributeQueryData) {
                let stepDefArttributeId = `'` + uiElementGroupStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'] + `'`;
                let stepDefinitionAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_ATTRIBUTE_UUID in(${stepDefArttributeId})`;
                let stepDefinitionAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefinitionAttributeQuery, input);
                for (let codeDesc of stepDefinitionAttributeQueryData) {
                    let object = {};
                    object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
                    object['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'] = testCaseUIElementGroupStepId;
                    object['UI_ELEMENT_GROUP_UUID'] = input['UI_ELEMENT_GROUP_UUID'];
                    switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
                        //page
                        case '57b76ab3-8112-4343-af0f-49643c808bf7':
                            object['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
                            break;
                        // ui element
                        case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                            object['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
                            break;
                        // ui element type
                        case '7f855066-ad39-4325-8108-30befb2447e6':
                            object['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
                            break;
                        // ui element value
                        case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                            object['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
                            break;

                        // key name in key pad
                        case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                            object['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
                            break;
                        // event name
                        case '005d158d-428c-4bca-ae2d-1c3f9630b549':
                            object['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
                            break;
                        //confitm 
                        case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                            object['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
                            break;
                        //function 
                        case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                            break;
                        // ui element name 1
                        case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                            object['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        // ui element value 1
                        case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                            object['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        // user action name
                        case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                            object['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        // user action type
                        case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                            object['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA']
                            break;
                        default:
                            null
                    }
                    testCaseUIElementGroupStepAttributeList.push(object);
                }
            }
            testCaseUIElementGroupStepList.push(testCaseUIElementGroupStep);
        }
    }
}

async function modifyTestCaseStepName(type) {
    let object = {};
    if (type == 'FUNCTION') {
        const functionNameQuery = `SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID=:FUNCTION_UUID`;
        let functionNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", functionNameQuery, input);
        object['testCaseStepName'] = testCaseNameStepDefVerbiageStr.replaceAll('<Function Name>', function () {
            return "'" + functionNameQueryData['FUNCTION_NAME'] + "'"
        });
        testCaseNameAttributeKeysStepDefVerbiageStr.push('{FunctionName@#$' + "'" + input['FUNCTION_UUID'] + "'}");
    } else if (type == 'UI_ELEMENT_GROUP') {
        let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP  WHERE UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let uiElementGroupStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input);
        object['testCaseStepName'] = testCaseNameStepDefVerbiageStr.replaceAll('<UI Element Group Name>', function () {
            return "'" + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + "'"
        });
        testCaseNameAttributeKeysStepDefVerbiageStr.push('{UIElementGroupName@#$' + "'" + input['UI_ELEMENT_GROUP_UUID'] + "'}");
    }
    return object;
}

// modifying the step definition with actual detail
let getKeywordByStepType = input['TEST_CASE_STEP_TYPE'] === 'Pre Condition' ? 'Given ' : input['TEST_CASE_STEP_TYPE'] === 'User Input' ? 'When ' : input['TEST_CASE_STEP_TYPE'] === 'Expected Result' ? 'Then ' : '';

// the below if block will exist when action is save
if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && input.compositeEntityAction == 'Save') {

    if (!input['FUNCTION_UUID'] && !input['UI_ELEMENT_GROUP_UUID']) {
        // calling the below function to generate the records for test case step attribute value table
        await createTestCaseStepAttributeValue(stepDefAttributeQueryData);
        input['TEST_CASE_STEP_NAME'] = getKeywordByStepType + testCaseNameStepDefVerbiageStr;
        input['TEST_CASE_STEP_ATTRIBUTE_KEYS'] = JSON.stringify(testCaseNameAttributeKeysStepDefVerbiageStr);
    } else if (input['FUNCTION_UUID']) {
        await createTestCaseFunctionStep();
        await createTestCaseStepAttributeValue(stepDefAttributeQueryData);
        input['TEST_CASE_STEP_NAME'] = getKeywordByStepType + testCaseNameStepDefVerbiageStr;
        input['TEST_CASE_STEP_ATTRIBUTE_KEYS'] = JSON.stringify(testCaseNameAttributeKeysStepDefVerbiageStr);
    } else if (input['UI_ELEMENT_GROUP_UUID']) {
        await createTestCaseUIElementGroupStep();
        await createTestCaseStepAttributeValue(stepDefAttributeQueryData);
        input['TEST_CASE_STEP_NAME'] = getKeywordByStepType + testCaseNameStepDefVerbiageStr;
        input['TEST_CASE_STEP_ATTRIBUTE_KEYS'] = JSON.stringify(testCaseNameAttributeKeysStepDefVerbiageStr);
    }
    if (!input['isInitialRecord'] && input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No' && input['TEST_CASE_STEP_POSITION'] == 'Intermediate Test Case Step') {
        await changeSequence();
    } else if (!input['isInitialRecord'] && input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'Yes' && input['TEST_CASE_STEP_POSITION'] == 'Intermediate Test Case Step') {
        let testCaseStepIds = '';
        const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_STEP_SEQ_ID >= :TEST_CASE_STEP_SEQ_ID`;
        let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
        for (let data of testCaseStepQueryData) {
            deleteRecords('TEST_CASE_STEP_UUID', data['TEST_CASE_STEP_UUID'], 'TEST_CASE_STEP');
            testCaseStepIds = testCaseStepIds + "'" + data['TEST_CASE_STEP_UUID'] + "',";
        }
        let testCaseStepStr = testCaseStepIds.substring(0, testCaseStepIds.length - 1);
        for (let data of testCaseStepQueryData) {
            //if any testCaseStep is create with a function
            if (data.IS_FUNCTION_STEP == 'Yes') {
                await deleteTestCaseFunctionStepData("'" + data.TEST_CASE_STEP_UUID + "'");
                await deleteTestCaseFunctionStepAttributeData("'" + data.TEST_CASE_STEP_UUID + "'");
            }
            // if any test case step is created with ui element group
            if (data.IS_UI_ELEMENT_GROUP_STEP == 'Yes') {
                deleteTestCaseUIElementGroupStepData("'" + data.TEST_CASE_STEP_UUID + "'")
                deleteTestCaseUIElementGroupStepAttributeData("'" + data.TEST_CASE_STEP_UUID + "'")
            }
        }
        // if any testCaseFunctionStep is create with ui element group
        const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`
        let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
        for (let data of testCaseFunctionStepData) {
            // if test case function step is created with ui element group
            if (data.IS_UI_ELEMENT_GROUP_STEP == 'Yes') {
                await deleteTestCaseFunctionUIElementGroupStepData("'" + data.TEST_CASE_STEP_UUID + "'");
                await deleteTestCaseFunctionUIElementGroupStepAttributeData("'" + data.TEST_CASE_STEP_UUID + "'");
            }
        }
        // the below function will delete the existing  test case step attribute value for the particular test case step
        await deleteTestCaseStepAttributeData(testCaseStepStr);
    }
} else if (input.compositeEntityAction == 'Update') { // the below if block will exist when action is save
    if (!input['FUNCTION_UUID'] && !input['UI_ELEMENT_GROUP_UUID']) {
        // the below function will delete the existing test case step attribute value for the particular test case step.
        await deleteTestCaseStepAttributeData("'" + input.TEST_CASE_STEP_UUID + "'");
        // creating the new records in test case step attribute value table with new value
        await createTestCaseStepAttributeValue(stepDefAttributeQueryData);
        input['TEST_CASE_STEP_NAME'] = getKeywordByStepType + testCaseNameStepDefVerbiageStr;
        input['TEST_CASE_STEP_ATTRIBUTE_KEYS'] = JSON.stringify(testCaseNameAttributeKeysStepDefVerbiageStr);
    } else if (input['FUNCTION_UUID']) {
        if (input['isFunctionNameChanged']) {
            await deleteTestCaseStepAttributeData("'" + input.TEST_CASE_STEP_UUID + "'");
            await deleteTestCaseFunctionStepData("'" + input.TEST_CASE_STEP_UUID + "'");
            await deleteTestCaseFunctionStepAttributeData("'" + input.TEST_CASE_STEP_UUID + "'");
            deleteTestCaseFunctionUIElementGroupStepData("'" + input.TEST_CASE_STEP_UUID + "'")
            deleteTestCaseFunctionUIElementGroupStepAttributeData("'" + input.TEST_CASE_STEP_UUID + "'")
            await createTestCaseFunctionStep();
            await createTestCaseStepAttributeValue(stepDefAttributeQueryData);
            input['TEST_CASE_STEP_NAME'] = getKeywordByStepType + testCaseNameStepDefVerbiageStr;
            input['TEST_CASE_STEP_ATTRIBUTE_KEYS'] = JSON.stringify(testCaseNameAttributeKeysStepDefVerbiageStr);
        }

    } else if (input['UI_ELEMENT_GROUP_UUID']) {
        if (input['isUIElementGroupChanged']) {
            await deleteTestCaseStepAttributeData("'" + input.TEST_CASE_STEP_UUID + "'");
            await deleteTestCaseUIElementGroupStepData("'" + input.TEST_CASE_STEP_UUID + "'");
            await deleteTestCaseUIElementGroupStepAttributeData("'" + input.TEST_CASE_STEP_UUID + "'");
            await createTestCaseUIElementGroupStep();
            await createTestCaseStepAttributeValue(stepDefAttributeQueryData);
            input['TEST_CASE_STEP_NAME'] = getKeywordByStepType + testCaseNameStepDefVerbiageStr;
            input['TEST_CASE_STEP_ATTRIBUTE_KEYS'] = JSON.stringify(testCaseNameAttributeKeysStepDefVerbiageStr);
        }
    }
}

else if (input.compositeEntityAction == 'Delete') {
    if (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'Yes') {
        let testCaseStepIds = '';

        const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_STEP_SEQ_ID > :TEST_CASE_STEP_SEQ_ID`;
        let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
        await deleteTestCaseStepAttributeData("'" + input['TEST_CASE_STEP_UUID'] + "'");
        for (let data of testCaseStepQueryData) {
            deleteRecords('TEST_CASE_STEP_UUID', data['TEST_CASE_STEP_UUID'], 'TEST_CASE_STEP');
            // the below function will delete the existing  test case step attribute value for the particular test case step
            await deleteTestCaseStepAttributeData("'" + data['TEST_CASE_STEP_UUID'] + "'");
            if (data.IS_FUNCTION_STEP == 'Yes') {
                await deleteTestCaseFunctionStepData("'" + data.TEST_CASE_STEP_UUID + "'");
                await deleteTestCaseFunctionStepAttributeData("'" + data.TEST_CASE_STEP_UUID + "'");
            }

            // if any test case step is created with ui element group
            if (data.IS_UI_ELEMENT_GROUP_STEP == 'Yes') {
                deleteTestCaseUIElementGroupStepData("'" + data.TEST_CASE_STEP_UUID + "'")
                deleteTestCaseUIElementGroupStepAttributeData("'" + data.TEST_CASE_STEP_UUID + "'")
            }
            testCaseStepIds = testCaseStepIds + "'" + data['TEST_CASE_STEP_UUID'] + "',";
        }

        let testCaseStepStr = testCaseStepIds.substring(0, testCaseStepIds.length - 1);

        if (testCaseStepStr) {
            // if any testCaseFunctionStep is create with ui element group
            const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`

            let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);

            for (let data of testCaseFunctionStepData) {
                // if test case function step is created with ui element group
                if (data.IS_UI_ELEMENT_GROUP_STEP == 'Yes') {
                    await deleteTestCaseFunctionUIElementGroupStepData("'" + data.TEST_CASE_STEP_UUID + "'");
                    await deleteTestCaseFunctionUIElementGroupStepAttributeData("'" + data.TEST_CASE_STEP_UUID + "'");
                }
            }
        }


        // await deleteTestCaseFunctionStepData(testCaseStepStr);
        // await deleteTestCaseFunctionStepAttributeData(testCaseStepStr);

    } else if (input['IS_FUNCTION_STEP'] == "Yes" && input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No') {
        // the below function will delete test case function step and its attribute
        await deleteTestCaseFunctionStepData("'" + input.TEST_CASE_STEP_UUID + "'");
        await deleteTestCaseFunctionStepAttributeData("'" + input.TEST_CASE_STEP_UUID + "'");
        const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${"'" + input.TEST_CASE_STEP_UUID + "'"}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`
        let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
        for (let data of testCaseFunctionStepData) {
            // if test case function step is created with ui element group
            if (data.IS_UI_ELEMENT_GROUP_STEP == 'Yes') {
                await deleteTestCaseFunctionUIElementGroupStepData("'" + data.TEST_CASE_STEP_UUID + "'");
                await deleteTestCaseFunctionUIElementGroupStepAttributeData("'" + data.TEST_CASE_STEP_UUID + "'");
            }
        }
        // the below function will delete the existing  test case step attribute value for the particular test case step
        await deleteTestCaseStepAttributeData("'" + input.TEST_CASE_STEP_UUID + "'");
    } else if (input['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes' && input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No') {
        await deleteTestCaseStepAttributeData("'" + input.TEST_CASE_STEP_UUID + "'");
        await deleteTestCaseUIElementGroupStepData("'" + input.TEST_CASE_STEP_UUID + "'");
        await deleteTestCaseUIElementGroupStepAttributeData("'" + input.TEST_CASE_STEP_UUID + "'");
    } else if (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No' && !input['FUNCTION_UUID'] && !input['UI_ELEMENT_GROUP_UUID']) {
        // the below function will delete the existing test case step attribute value for the particular test case step
        await deleteTestCaseStepAttributeData("'" + input.TEST_CASE_STEP_UUID + "'");
    }
    if (input['TEST_CASE_STEP_POSITION'] == 'Intermediate Test Case Step') {
        await changeSequence();
    }
}
input["AppEngChildEntity:INTEGRATION TEST_CASE_STEP"] = testCaseStepList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP'] = testCaseFunctionStepArray;
input["AppEngChildEntity:TEST_CASE_STEP_ATTRIBUTE_VALUE"] = testCaseStepAttributeValueArray;
input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP'] = testCaseFunctionStepArray;
input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE"] = testCaseFunctionStepAttributeValueArray;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP'] = testCaseFunctionUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseFunctionUIElementGroupStepAttributeList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP'] = testCaseUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseUIElementGroupStepAttributeList;