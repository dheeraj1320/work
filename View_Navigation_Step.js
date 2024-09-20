let viewNavigationStepList = [];
let viewNavigationStepAttributeValueArray = [];

console.log('-------------------------', input);
async function fetchStepDefinitionTemplateVerbiage(stepDefTemplateVerbiageId) {
    let result = [];
    // firing query to get all the step definition for particular stap def name (verbiage)
    const stepDefAttributeQuery = `SELECT STEP_DEFINITION_ATTRIBUTE_UUID,STEP_DEFINITION_ATTRIBUTE_MASTER_UUID,STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME FROM STEP_DEFINITION_ATTRIBUTE sda,STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv where sda.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID=sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID and sda.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID in(${stepDefTemplateVerbiageId}) order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
    let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input);
    if (stepDefAttributeQueryData.length) {
        result = stepDefAttributeQueryData;
    } else {
        const stepDefQuery = `SELECT STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME FROM STEP_DEFINITION_TEMPLATE_VERBIAGE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID in(${stepDefTemplateVerbiageId})`;
        let stepDefQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefQuery, input);
        if (stepDefQueryData.length) {
            result = stepDefQueryData;
        }
    }
    return result;
}

function isDataAvailable(str) {
    if (str === null || str === undefined || str.trim() === '' || str === 'null' || str === "' '" || str === 'undefined') {
        return false;
    } else {
        return true;
    }
}
async function changeSequence() {
    let seqId = input['VIEW_NAVIGATION_STEP_SEQ_ID'];
    if (input.compositeEntityAction == "Save" && input['STEP_SELECTION_TYPE'] == 'Delete selected steps' && input['START_STEP'] && input['END_STEP']) {
        seqId = input['VIEW_NAVIGATION_STEP_SEQ_ID'] + 1;
        const viewNavigationStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND VIEW_NAVIGATION_STEP_SEQ_ID>=:VIEW_NAVIGATION_STEP_SEQ_ID AND VIEW_NAVIGATION_STEP_SEQ_ID <:START_STEP UNION SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND VIEW_NAVIGATION_STEP_SEQ_ID > :END_STEP ORDER BY VIEW_NAVIGATION_STEP_SEQ_ID asc`;
        let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepQuery, input);
        if (viewNavigationStepQueryData && viewNavigationStepQueryData.length) {
            for (let data of viewNavigationStepQueryData) {
                let changedSeqID = {}
                changedSeqID["compositeEntityAction"] = "Update";
                changedSeqID['VIEW_NAVIGATION_STEP_UUID'] = data['VIEW_NAVIGATION_STEP_UUID'];
                changedSeqID['VIEW_NAVIGATION_STEP_SEQ_ID'] = seqId;
                seqId++;
                viewNavigationStepList.push(changedSeqID)
            }
        }
    } else if (input.compositeEntityAction == "Save") {
        const viewNavigationStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and VIEW_NAVIGATION_STEP_SEQ_ID >= :VIEW_NAVIGATION_STEP_SEQ_ID ORDER BY VIEW_NAVIGATION_STEP_SEQ_ID asc`;
        let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepQuery, input);
        if (viewNavigationStepQueryData && viewNavigationStepQueryData.length) {
            for (let data of viewNavigationStepQueryData) {
                let changedSeqID = {}
                changedSeqID['VIEW_NAVIGATION_STEP_UUID'] = data['VIEW_NAVIGATION_STEP_UUID'];
                changedSeqID['VIEW_NAVIGATION_STEP_SEQ_ID'] = ++seqId;
                viewNavigationStepList.push(changedSeqID)
            }
        }
    } else if (input.compositeEntityAction == "Delete" && input['STEP_SELECTION_TYPE'] == 'Select Steps for Deletion' && input['START_STEP'] && input['END_STEP']) {
        const viewNavigationStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and VIEW_NAVIGATION_STEP_SEQ_ID > :END_STEP ORDER BY VIEW_NAVIGATION_STEP_SEQ_ID asc`;
        let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepQuery, input);
        if (viewNavigationStepQueryData && viewNavigationStepQueryData.length) {
            for (let data of viewNavigationStepQueryData) {
                let changedSeqID = {}
                changedSeqID["compositeEntityAction"] = "Update";
                changedSeqID['VIEW_NAVIGATION_STEP_UUID'] = data['VIEW_NAVIGATION_STEP_UUID'];
                changedSeqID['VIEW_NAVIGATION_STEP_SEQ_ID'] = seqId;
                seqId++;
                viewNavigationStepList.push(changedSeqID)
            }
        }
    } else if (input.compositeEntityAction == "Delete") {
        const viewNavigationStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and VIEW_NAVIGATION_STEP_SEQ_ID > :VIEW_NAVIGATION_STEP_SEQ_ID ORDER BY VIEW_NAVIGATION_STEP_SEQ_ID asc`;
        let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepQuery, input);
        if (viewNavigationStepQueryData && viewNavigationStepQueryData.length) {
            for (let data of viewNavigationStepQueryData) {
                let changedSeqID = {}
                changedSeqID["compositeEntityAction"] = "Update";
                changedSeqID['VIEW_NAVIGATION_STEP_UUID'] = data['VIEW_NAVIGATION_STEP_UUID'];
                changedSeqID['VIEW_NAVIGATION_STEP_SEQ_ID'] = seqId;
                seqId++;
                viewNavigationStepList.push(changedSeqID)
            }
        }
    }
}

let stepDefAttributeQueryData = await fetchStepDefinitionTemplateVerbiage("'" + input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] + "'");
let viewNavigationNameStepDefVerbiageStr = stepDefAttributeQueryData[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'];
let stepVerviageID = "{StepVerbiage@#$'" + input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] + "'}";
let viewNavigationNameAttributeKeysStepDefVerbiageStr = [stepVerviageID];

// this createViewNavigationStepAttributeValue function is responsible to create the record for view navigation step attribute value table and also responsible to generete the actual step definition based on selected verbiage
async function createViewNavigationStepAttributeValue(stepDefAttributeData) {
    for (let codeDesc of stepDefAttributeData) {
        if (codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'] && codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
            let object = {};
            object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
            object['VIEW_UUID'] = input['VIEW_UUID'];
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
                case '57b76ab3-8112-4343-af0f-49643c808bf7':
                    let currentPage = input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
                    // input['CURRENT_PAGE_CONTEXT'] = currentPage;
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = currentPage;
                    const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID=${"'" + currentPage + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", pageNewQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Page Name>', function () {
                        return "'" + pageNewQueryData['PAGE_NAME'] + "'"
                    });

                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{PageName@#$' + "'" + currentPage + "'}");
                    break;

                case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME'];
                    const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element Name>', function () {
                        return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                    });
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{UIElementName@#$' + "'" + input['UI_ELEMENT_NAME'] + "'}");
                    break;

                case '7f855066-ad39-4325-8108-30befb2447e6':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_TYPE'];
                    const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID=:UI_ELEMENT_TYPE`;
                    let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element Type>', function () {
                        return "'" + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + "'"
                    });
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{UIElementType@#$' + "'" + input['UI_ELEMENT_TYPE'] + "'}");
                    break;

                case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element Value>', input['UI_ELEMENT_VALUE'] ? function () {
                        return "'" + input['UI_ELEMENT_VALUE'] + "'"
                    } : "' '");
                    let uiElementValueData = isDataAvailable(input['UI_ELEMENT_VALUE']) ? "'" + input['UI_ELEMENT_VALUE'] + "'" : "' '";
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{UIElementValue@#$' + uiElementValueData + "}");
                    break;

                case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['KEY_NAME_IN_KEY_PAD'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Key Name in Keypad>', function () {
                        return "'" + input['KEY_NAME_IN_KEY_PAD'] + "'"
                    });
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{KeyNameinKeypad@#$' + "'" + input['KEY_NAME_IN_KEY_PAD'] + "'}");
                    break;

                case '005d158d-428c-4bca-ae2d-1c3f9630b549':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['EVENT_NAME'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Event Type>', input['EVENT_NAME'] ? function () {
                        return "'" + input['EVENT_NAME'] + "'"
                    } : "' '");
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{EventType@#$' + "'" + input['EVENT_NAME'] + "'}");
                    break;

                case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['CONFIRM_UI_ELEMENT_VALUE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Confirm UI Element Value>', input['CONFIRM_UI_ELEMENT_VALUE'] ? function () {
                        return "'" + input['CONFIRM_UI_ELEMENT_VALUE'] + "'"
                    } : "' '");
                    let confirmUIElementValueData = isDataAvailable(input['CONFIRM_UI_ELEMENT_VALUE']) ? "'" + input['CONFIRM_UI_ELEMENT_VALUE'] + "'" : "' '";
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{ConfirmUIElementValue@#$' + confirmUIElementValueData + "}");
                    break;
                case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME_1'];
                    const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME_1 AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element Name 1>', function () {
                        return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                    });
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{UIElementName1@#$' + "'" + input['UI_ELEMENT_NAME_1'] + "'}");
                }
                    break;

                case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE_1'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element Value 1>', input['UI_ELEMENT_VALUE_1'] ? function () {
                        return "'" + input['UI_ELEMENT_VALUE_1'] + "'"
                    } : "' '");
                    let uiElementValue1Data = isDataAvailable(input['UI_ELEMENT_VALUE_1']) ? "'" + input['UI_ELEMENT_VALUE_1'] + "'" : "' '";
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{UIElementValue1@#$' + uiElementValue1Data + "}");
                    break;

                // user action name
                case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['USER_ACTION_NAME'];
                    const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:USER_ACTION_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<User Action Name>', function () {
                        return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                    });
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{UserActionName@#$' + "'" + input['USER_ACTION_NAME'] + "'}");
                }
                    break;
                // user action type
                case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['USER_ACTION_TYPE'];
                    const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID=:USER_ACTION_TYPE`;
                    let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<User Action Type>', function () {
                        return "'" + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + "'"
                    });
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{UserActionType@#$' + "'" + input['USER_ACTION_TYPE'] + "'}");
                }
                    break;
                // page number
                case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['PAGE_NUMBER'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Page Number>', input['PAGE_NUMBER'] ? function () {
                        return "'" + input['PAGE_NUMBER'] + "'"
                    } : "' '");
                    let pageNumberData = isDataAvailable(input['PAGE_NUMBER']) ? "'" + input['PAGE_NUMBER'] + "'" : "' '";
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{PageNumber@#$' + pageNumberData + "}");
                    break;

                case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['DATA_VALUE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Data Value>', input['DATA_VALUE'] ? function () {
                        return "'" + input['DATA_VALUE'] + "'"
                    } : "' '");
                    let dataValuesData = isDataAvailable(input['DATA_VALUE']) ? "'" + input['DATA_VALUE'] + "'" : "' '";
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{DataValue@#$' + dataValuesData + "}");
                    break;

                case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['DATA_KEY'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Data Key>', input['DATA_KEY'] ? function () {
                        return "'" + input['DATA_KEY'] + "'"
                    } : "' '");
                    let dataKeyData = isDataAvailable(input['DATA_KEY']) ? "'" + input['DATA_KEY'] + "'" : "' '";
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{DataKey@#$' + dataKeyData + "}");
                    break;

                case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['FILE_NAME'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<File Name>', input['FILE_NAME'] ? function () {
                        return "'" + input['FILE_NAME'] + "'"
                    } : "' '");
                    let fileNameData = isDataAvailable(input['FILE_NAME']) ? "'" + input['FILE_NAME'] + "'" : "' '";
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{FileName@#$' + fileNameData + "}");
                    break;

                case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['DOCUMENT_PARSER_NAME'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Document Parser Name>', input['DOCUMENT_PARSER_NAME'] ? function () {
                        return "'" + input['DOCUMENT_PARSER_NAME'] + "'"
                    } : "' '");
                    let documentParserNameData = isDataAvailable(input['DOCUMENT_PARSER_NAME']) ? "'" + input['DOCUMENT_PARSER_NAME'] + "'" : "' '";
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{DocumentParserName@#$' + documentParserNameData + "}");
                    break;

                case '36880b70-2e33-11ef-b3ef-e52f192c3af0': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['API_UUID'];
                    const apiQuery = `SELECT API_NAME FROM API_NEW WHERE API_UUID=:API_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let apiQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", apiQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<API Name>', function () {
                        return "'" + apiQueryData['API_NAME'] + "'"
                    });
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{APIName@#$' + "'" + input['API_UUID'] + "'}");
                }
                    break;
                case '46136260-2e33-11ef-b3ef-e52f192c3af0': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['API_ATTRIBUTE_NAME'];
                    const apiAttributeQuery = `SELECT ATTRIBUTE_NAME FROM API_ATTRIBUTE WHERE API_ATTRIBUTE_UUID=:API_ATTRIBUTE_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let apiAttributeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", apiAttributeQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<API Attribute Name>', function () {
                        return "'" + apiAttributeQueryData['ATTRIBUTE_NAME'] + "'"
                    });
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{APIAttributeName@#$' + "'" + input['API_ATTRIBUTE_NAME'] + "'}");
                }
                    break;
                case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['API_ATTRIBUTE_VALUE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<API Attribute Value>', input['API_ATTRIBUTE_VALUE'] ? function () {
                        return "'" + input['API_ATTRIBUTE_VALUE'] + "'"
                    } : "' '");
                    let apiAttributeValueData = isDataAvailable(input['API_ATTRIBUTE_VALUE']) ? "'" + input['API_ATTRIBUTE_VALUE'] + "'" : "' '";
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{APIAttributeValue@#$' + apiAttributeValueData + "}");
                    break;

                case '833eb770-2e33-11ef-9033-4bb93e602d01':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['RESPONSE_CODE_VALUE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Response Status Code>', input['RESPONSE_CODE_VALUE'] ? function () {
                        return "'" + input['RESPONSE_CODE_VALUE'] + "'"
                    } : "' '");
                    let responseCodeValueData = isDataAvailable(input['RESPONSE_CODE_VALUE']) ? "'" + input['RESPONSE_CODE_VALUE'] + "'" : "' '";
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{ResponseStatusCode@#$' + responseCodeValueData + "}");
                    break;

                case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_STATE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element State>', input['UI_ELEMENT_STATE'] ? function () { return "'" + input['UI_ELEMENT_STATE'] + "'" } : "' '");
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{UIElementState@#$' + "'" + input['UI_ELEMENT_STATE'] + "'}");
                    break;

                case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['TIMEOUT'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Timeout>', input['TIMEOUT'] ? function () {
                        return "'" + input['TIMEOUT'] + "'"
                    } : "' '");
                    let timeoutValueData = isDataAvailable(input['TIMEOUT']) ? "'" + input['TIMEOUT'] + "'" : "' '";
                    viewNavigationNameAttributeKeysStepDefVerbiageStr.push('{Timeout@#$' + timeoutValueData + "}");
                    break;
            }
            viewNavigationStepAttributeValueArray.push(object);
        }
    }
}
function deleteRecords(key, value, deleteType) {
    const deleteParamenter = {};
    deleteParamenter[key] = value;
    deleteParamenter["compositeEntityAction"] = "Delete";
    if (deleteType === "VIEW_NAVIGATION_STEP") {
        viewNavigationStepList.push(deleteParamenter);
    } else if (deleteType === "VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE") {
        viewNavigationStepAttributeValueArray.push(deleteParamenter);
    }
}

async function deleteViewNavigationStepAttributeData(viewNavigationStepStr) {
    // firing the query to get all the view navigation step attribute value for that particulat view navigation step
    const viewNavigationStepAttributeValueQuery = `SELECT * FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where VIEW_NAVIGATION_STEP_UUID in(${viewNavigationStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let viewNavigationStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepAttributeValueQuery, input);

    for (let attributeData of viewNavigationStepAttributeValueQueryData) {
        deleteRecords('VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', attributeData['VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE');
    }
}

// modifying the step definition with actual detail
let getKeywordByStepType = input['VIEW_NAVIGATION_STEP_TYPE'] === 'Pre Condition' ? 'Given ' : input['VIEW_NAVIGATION_STEP_TYPE'] === 'User Input' ? 'When ' : input['VIEW_NAVIGATION_STEP_TYPE'] === 'Expected Result' ? 'Then ' : '';

// the below if block will exist when action is save
if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && input.compositeEntityAction == 'Save') {

    // calling the below function to generate the records for view navigation step attribute value table
    await createViewNavigationStepAttributeValue(stepDefAttributeQueryData);
    input['VIEW_NAVIGATION_STEP_NAME'] = getKeywordByStepType + viewNavigationNameStepDefVerbiageStr;
    input['VIEW_NAVIGATION_STEP_ATTRIBUTE_KEYS'] = JSON.stringify(viewNavigationNameAttributeKeysStepDefVerbiageStr);

    if (!input['isInitialRecord'] && input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No' && input['VIEW_NAVIGATION_STEP_POSITION'] == 'Intermediate Page Navigation Step') {
        await changeSequence();
    } else if (!input['isInitialRecord'] && input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'Yes' && input['VIEW_NAVIGATION_STEP_POSITION'] == 'Intermediate Page Navigation Step') {
        if (input['STEP_SELECTION_TYPE'] != 'Do not delete subsequent steps') {
            let viewNavigationStepQuery = '';
            let viewNavigationStepIds = '';
            if (input['STEP_SELECTION_TYPE'] == 'Delete selected steps' && input['START_STEP'] && input['END_STEP']) {
                viewNavigationStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and VIEW_NAVIGATION_STEP_SEQ_ID>=:START_STEP and VIEW_NAVIGATION_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                await changeSequence();
            } else if (input['STEP_SELECTION_TYPE'] == 'Delete subsequent steps') {
                viewNavigationStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and VIEW_NAVIGATION_STEP_SEQ_ID >= :VIEW_NAVIGATION_STEP_SEQ_ID`;
            }
            let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepQuery, input);
            for (let data of viewNavigationStepQueryData) {
                deleteRecords('VIEW_NAVIGATION_STEP_UUID', data['VIEW_NAVIGATION_STEP_UUID'], 'VIEW_NAVIGATION_STEP');
                viewNavigationStepIds = viewNavigationStepIds + "'" + data['VIEW_NAVIGATION_STEP_UUID'] + "',";
            }
            let viewNavigationStepStr = viewNavigationStepIds.substring(0, viewNavigationStepIds.length - 1);
            // the below function will delete the existing  view navigation step attribute value for the particular view navigation step
            await deleteViewNavigationStepAttributeData(viewNavigationStepStr);
        } else if (input['STEP_SELECTION_TYPE'] == 'Do not delete subsequent steps') {
            await changeSequence();
        }
    }
} else if (input.compositeEntityAction == 'Update') { // the below if block will exist when action is save
    // the below function will delete the existing view navigation step attribute value for the particular view navigation step.
    await deleteViewNavigationStepAttributeData("'" + input.VIEW_NAVIGATION_STEP_UUID + "'");
    // creating the new records in view navigation step attribute value table with new value
    await createViewNavigationStepAttributeValue(stepDefAttributeQueryData);
    input['VIEW_NAVIGATION_STEP_NAME'] = getKeywordByStepType + viewNavigationNameStepDefVerbiageStr;
    input['VIEW_NAVIGATION_STEP_ATTRIBUTE_KEYS'] = JSON.stringify(viewNavigationNameAttributeKeysStepDefVerbiageStr);
} else if (input.compositeEntityAction == 'Delete') {
    if (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'Yes') {
        await deleteViewNavigationStepAttributeData("'" + input['VIEW_NAVIGATION_STEP_UUID'] + "'");
        let viewNavigationStepIds = '';
        let viewNavigationStepQuery = ``;
        if (input['STEP_SELECTION_TYPE'] == 'Select Steps for Deletion' && input['START_STEP'] && input['END_STEP']) {
            viewNavigationStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and VIEW_NAVIGATION_STEP_SEQ_ID>=:START_STEP and VIEW_NAVIGATION_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by VIEW_NAVIGATION_STEP_SEQ_ID asc`;
            await changeSequence();
        } else if (input['STEP_SELECTION_TYPE'] == 'Delete all Subsequent Steps') {
            viewNavigationStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and VIEW_NAVIGATION_STEP_SEQ_ID > :VIEW_NAVIGATION_STEP_SEQ_ID`;
        }

        let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepQuery, input);
        for (let data of viewNavigationStepQueryData) {
            deleteRecords('VIEW_NAVIGATION_STEP_UUID', data['VIEW_NAVIGATION_STEP_UUID'], 'VIEW_NAVIGATION_STEP');
            // the below function will delete the existing  view navigation step attribute value for the particular view navigation step
            await deleteViewNavigationStepAttributeData("'" + data['VIEW_NAVIGATION_STEP_UUID'] + "'");
        }
    } else if (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No') {
        // the below function will delete the existing view navigation step attribute value for the particular view navigation step
        await deleteViewNavigationStepAttributeData("'" + input.VIEW_NAVIGATION_STEP_UUID + "'");
    }

    if (input['VIEW_NAVIGATION_STEP_POSITION'] == 'Intermediate Page Navigation Step' || input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No') {
        await changeSequence();
    }
}


input["AppEngChildEntity:VIEW_NAVIGATION_STEP_CHILD"] = viewNavigationStepList;
input["AppEngChildEntity:VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE"] = viewNavigationStepAttributeValueArray;