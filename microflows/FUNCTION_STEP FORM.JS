// firing query to check any function step exist or not

const functionStepQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID =:FUNCTION_UUID AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY FUNCTION_STEP_ID DESC`;
let functionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepQuery, input[0]);
input[0]['isInitialRecord'] = functionStepQueryData && functionStepQueryData.length > 0 ? false : true;
input[0]['isSecondRecord'] = functionStepQueryData && functionStepQueryData.length == 1 ? true : false;
input[0]['isMoreThanTwoRecord'] = functionStepQueryData && functionStepQueryData.length >= 2 ? true : false;
input[0]['isFirstRecord'] = input[0]['isInitialRecord'] ? 'Yes' : 'No';
input[0]['isOtherVisiblePage'] = false;

// generating the function step step seq id at the time of record creation
if (!input[0]['FUNCTION_STEP_UUID'] && !input[0]['SELECTED_FUNCTION_STEP_SEQ_ID'] && input[0]['FUNCTION_STEP_POSITION'] != 'First Function Step') {
    input[0]['FUNCTION_STEP_SEQ_ID'] = functionStepQueryData.length + 1;
} else if (input[0]['FUNCTION_STEP_POSITION'] == 'Intermediate Function Step' && input[0]['SELECTED_FUNCTION_STEP_SEQ_ID']) {
    input[0]['FUNCTION_STEP_SEQ_ID'] = input[0]['SELECTED_FUNCTION_STEP_SEQ_ID'] + 1;
} else if (!input[0]['FUNCTION_STEP_UUID'] && !input[0]['SELECTED_FUNCTION_STEP_SEQ_ID'] && input[0]['FUNCTION_STEP_POSITION'] == 'First Function Step') {
    input[0]['FUNCTION_STEP_SEQ_ID'] = 1;
}

let currentUIElementName = '';
let currentUserActionName = '';
let currentFunctionName = '';
let currentUIElementGroupName = '';
input[0]['isRegularEvent'] = true;
input[0]['IS_STEP_TYPE_DISPLAYED'] = "No";
input[0]['isUiElementValue'] = "No";
input[0]['isUiElementValue1'] = "No";
input[0]['CODE_SET_UUID'] = "";
input[0]['CODESET_UUID_1'] = "";
input[0]['isViewAvailable'] = '';
input[0]['SELECTED_UI_ELEMENT_COLUMN_HEADER'] = "";
input[0]['IS_VALUE_CHANGED'] = [];

let predDefValue1;
let predDefValue;

function isOldValueChanged(currentValue, existingValue) {
    if (currentValue && existingValue && currentValue != existingValue) {
        input[0]['IS_VALUE_CHANGED'].push('Yes');
    }
}


function getPreDefinedValueValue(attributeValueQueryData, stepDefArrributeId) {
    let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
    if (result && result.length) {
        return result[0]['PRE_DEFINED_VALUES_UUID'];
    } else {
        return '';
    }
}

async function checkIsCodeSetExist(data) {
    const codeSetQuery = `SELECT de.CODE_SET_UUID FROM UI_ELEMENT ue JOIN DATA_ELEMENT de ON de.DATA_ELEMENT_UUID = ue.DATA_ELEMENT_UUID where ue.UI_ELEMENT_UUID in('${data}')`;
    let codeSetQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", codeSetQuery, input[0]);
    return codeSetQueryData;
}

function getDataFromAttributeValue(attributeValueQueryData, stepDefArrributeId) {
    let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
    if (result && result.length) {
        return result[0]['FUNCTION_STEP_ATTRIBUTE_DATA'];
    } else {
        return '';
    }
}

async function fetchStepDefinitionTemplateVerbiage() {
    let result = [];
    const stepDefAttributeQuery = `SELECT STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME,IS_PAGE_CONTEXT_SETTER,IS_API_CONTEXT_SETTER,'Yes' as IS_ATTRIBUTE_EXIST FROM STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv,STEP_DEFINITION_ATTRIBUTE sda where sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID=sda.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID=:STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID`;
    let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input[0]);

    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
        result = stepDefAttributeQueryData;
    } else {
        const stepDefQuery = `SELECT STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME,'No' as IS_ATTRIBUTE_EXIST FROM STEP_DEFINITION_TEMPLATE_VERBIAGE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID=:STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID`;
        let stepDefQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefQuery, input[0]);
        if (stepDefQueryData.length) {
            result = stepDefQueryData;
        }
    }
    return result;
}


function getUIElementData(stepDefAttributeQueryData, functionStepAttributeValueQueryData) {
    let getUIElementStepDefAttributeUUID = stepDefAttributeQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == 'adcf6e25-f890-476c-bdcf-e723c6d7894c');

    let stepDefArrributeIdforUIElement = '';
    if (getUIElementStepDefAttributeUUID && getUIElementStepDefAttributeUUID.length) {
        stepDefArrributeIdforUIElement = getUIElementStepDefAttributeUUID[0]['STEP_DEFINITION_ATTRIBUTE_UUID'];
    }

    let actualUIElementUUID = '';
    let getUIElementIdFromAttribute = functionStepAttributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeIdforUIElement);

    if (getUIElementIdFromAttribute && getUIElementIdFromAttribute.length) {
        actualUIElementUUID = getUIElementIdFromAttribute[0]['FUNCTION_STEP_ATTRIBUTE_DATA'];
    }

    return actualUIElementUUID;
}


function getColumnHeaderData(stepDefAttributeQueryData, functionStepAttributeValueQueryData) {
    let getColumnHeaderStepDefAttributeUUID = stepDefAttributeQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == 'd797acb4-5e5c-447b-b0c5-60dad38e39a5');

    let stepDefArrributeIdforUIElement = '';
    if (getColumnHeaderStepDefAttributeUUID && getColumnHeaderStepDefAttributeUUID.length) {
        stepDefArrributeIdforUIElement = getColumnHeaderStepDefAttributeUUID[0]['STEP_DEFINITION_ATTRIBUTE_UUID'];
    }

    let actualColumnHeaderUUID = '';
    let getUIElementIdFromAttribute = functionStepAttributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeIdforUIElement);

    if (getUIElementIdFromAttribute && getUIElementIdFromAttribute.length) {
        actualColumnHeaderUUID = getUIElementIdFromAttribute[0]['FUNCTION_STEP_ATTRIBUTE_DATA'];
    }

    return actualColumnHeaderUUID;
}

function decideAndSetOrder(stepDefAttributeQueryData) {
    let decideFieldOrder = 0;
    for (let codeDesc of stepDefAttributeQueryData) {
        switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
            case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                decideFieldOrder++;
                input[0]['FIRST_UI_ELEMENT_NAME'] = decideFieldOrder;
                break;
            case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
                decideFieldOrder++;
                input[0]['FIRST_COLUMN_HEADER_NAME'] = decideFieldOrder;
                break;
        }
    }
}

let stepDefAttributeVerbiageQueryData = await fetchStepDefinitionTemplateVerbiage();
if (stepDefAttributeVerbiageQueryData && stepDefAttributeVerbiageQueryData.length) {
    input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = stepDefAttributeVerbiageQueryData[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'];
    if (stepDefAttributeVerbiageQueryData[0]['IS_PAGE_CONTEXT_SETTER'] == 'Yes' || stepDefAttributeVerbiageQueryData[0]['IS_API_CONTEXT_SETTER'] == 'Yes') {
        input[0]['isOtherVisiblePage'] = stepDefAttributeVerbiageQueryData[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].includes('other visible <Page Name>');
        input[0]['isMoreThanOneAttribute'] = stepDefAttributeVerbiageQueryData.length > 1 && !input[0]['isOtherVisiblePage'] ? true : false;
        input[0]['isOnlyOneAttribute'] = stepDefAttributeVerbiageQueryData.length == 1 ? true : false;
    } else {
        if (stepDefAttributeVerbiageQueryData[0]['IS_ATTRIBUTE_EXIST'] == 'Yes') {
            input[0]['isOnlyOneAttribute'] = false;
        } else if (stepDefAttributeVerbiageQueryData[0]['IS_ATTRIBUTE_EXIST'] == 'No') {
            input[0]['isOnlyOneAttribute'] = true;
        }
    }
}

if (input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] && !input[0]['FUNCTION_STEP_UUID']) {
    if (input[0]['FIRST_UI_ELEMENT_NAME'] == '1' && input[0]['UI_ELEMENT_NAME']) {
        input[0]['SELECTED_UI_ELEMENT_COLUMN_HEADER'] = input[0]['UI_ELEMENT_NAME'];
    } else if (input[0]['FIRST_COLUMN_HEADER_NAME'] == '1' && input[0]['COLUMN_HEADER']) {
        input[0]['SELECTED_UI_ELEMENT_COLUMN_HEADER'] = input[0]['COLUMN_HEADER'];
    }
}

// setting the default value for step def type when no Function exist
if (!input[0]['FUNCTION_STEP_UUID'] && input[0]['isInitialRecord'] === true && input[0]['IS_INTERMEDIATE_FUNCTION'] === 'No') {
    input[0]['FUNCTION_STEP_TYPE'] = 'Given';
    input[0]['isMoreThanOneAttribute'] = false;
    input[0]['isOnlyOneAttribute'] = true;
    input[0]['FUNCTION_STEP_POSITION'] = 'First Function Step';
} else if (input[0]['FUNCTION_STEP_UUID'] && input[0]['isInitialRecord'] === false) { // this block is responsible to show data in the field at the time of view/edit
    input[0]['isFunctionNameChanged'] = false;
    input[0]['isUIElementGroupChanged'] = false;
    input[0]['UI_ELEMENT_NAME'] = input[0]['UI_ELEMENT_NAME'] ? input[0]['UI_ELEMENT_NAME'] : "";
    input[0]['USER_ACTION_NAME'] = input[0]['USER_ACTION_NAME'] ? input[0]['USER_ACTION_NAME'] : "";
    input[0]['TABLE_NAME'] = input[0]['TABLE_NAME'] ? input[0]['TABLE_NAME'] : "";
    input[0]['COLUMN_HEADER'] = input[0]['COLUMN_HEADER'] ? input[0]['COLUMN_HEADER'] : '';

    if (input[0]['FUNCTION_STEP_SEQ_ID'] == 1) {
        input[0]['FUNCTION_STEP_POSITION'] = 'First Function Step'
        input[0]['SELECTED_FUNCTION_STEP_SEQ_ID'] = null;
    } else if (input[0]['FUNCTION_STEP_SEQ_ID'] == functionStepQueryData.length) {
        input[0]['FUNCTION_STEP_POSITION'] = 'Last Function Step'
        input[0]['SELECTED_FUNCTION_STEP_SEQ_ID'] = null;
    } else {
        input[0]['FUNCTION_STEP_POSITION'] = 'Intermediate Function Step'
        input[0]['SELECTED_FUNCTION_STEP_SEQ_ID'] = input[0]['FUNCTION_STEP_SEQ_ID'] - 1;
    }

    const stepDefAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID=:STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
    let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input[0]);
    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {

        // firing query to get all the Function step attribute value for particular Function step
        const functionStepAttributeValueQuery = `SELECT * FROM FUNCTION_STEP_ATTRIBUTE_VALUE where FUNCTION_STEP_UUID=:FUNCTION_STEP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let functionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepAttributeValueQuery, input[0]);

        let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, functionStepAttributeValueQueryData);
        let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, functionStepAttributeValueQueryData);

        for (let codeDesc of stepDefAttributeQueryData) {
            // here is the below switch case based on code description setting the value in the field 
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
                case '57b76ab3-8112-4343-af0f-49643c808bf7':
                    const viewQuery = `SELECT * FROM PAGE_VIEW WHERE PAGE_UUID=:CURRENT_PAGE_CONTEXT`;
                    let viewQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewQuery, input[0]);
                    if (viewQueryData && viewQueryData.length > 1) {
                        input[0]['isViewAvailable'] = 'Yes';
                    }
                    break;

                case 'adcf6e25-f890-476c-bdcf-e723c6d7894c': {
                    currentUIElementName = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['UI_ELEMENT_NAME'] = !input[0]['UI_ELEMENT_NAME'] ? currentUIElementName : input[0]['UI_ELEMENT_NAME'];
                    isOldValueChanged(input[0]['UI_ELEMENT_NAME'], currentUIElementName);
                }
                    break;

                case '7f855066-ad39-4325-8108-30befb2447e6': {
                    let selectedUIElement = input[0]['UI_ELEMENT_NAME'] && input[0]['UI_ELEMENT_NAME'] != actualUIElementUUID ? input[0]['UI_ELEMENT_NAME'] : actualUIElementUUID;
                    const uiElementTypeQuery = `SELECT * FROM UI_ELEMENT ui,UI_ELEMENT_TYPE_MASTER uit WHERE ui.UI_ELEMENT_TYPE=uit.UI_ELEMENT_TYPE_UUID AND ui.UI_ELEMENT_UUID='${selectedUIElement}'`;
                    let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input[0]);
                    input[0]['UI_ELEMENT_TYPE'] = !input[0]['UI_ELEMENT_TYPE'] ? uiElementTypeQueryData['UI_ELEMENT_TYPE_UUID'] : input[0]['UI_ELEMENT_TYPE'];
                }
                    break;

                case '74da67d2-41c9-4cf7-9eea-715243e5fcdc': {
                    input[0]['UI_ELEMENT_VALUE'] = !input[0]['UI_ELEMENT_VALUE'] && !input[0]['uiElementValCodeDesc'] ? getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']) : input[0]['UI_ELEMENT_VALUE'];
                    predDefValue = getPreDefinedValueValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                }
                    break;

                case '235dfa3a-a897-4076-b9bc-ed813ec7c39f': {
                    let keyNameInKeyPad = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['KEY_NAME_IN_KEY_PAD'] = !input[0]['KEY_NAME_IN_KEY_PAD'] ? keyNameInKeyPad : input[0]['KEY_NAME_IN_KEY_PAD'];
                    isOldValueChanged(input[0]['KEY_NAME_IN_KEY_PAD'], keyNameInKeyPad);
                }
                    break;

                case '005d158d-428c-4bca-ae2d-1c3f9630b549': {
                    decideAndSetOrder(stepDefAttributeQueryData);
                    if (input[0]['FIRST_UI_ELEMENT_NAME'] == '1') {
                        let selectedUIElement = input[0]['UI_ELEMENT_NAME'] && input[0]['UI_ELEMENT_NAME'] != actualUIElementUUID ? input[0]['UI_ELEMENT_NAME'] : actualUIElementUUID;
                        input[0]['SELECTED_UI_ELEMENT_COLUMN_HEADER'] = selectedUIElement;
                    } else if (input[0]['FIRST_COLUMN_HEADER_NAME'] == '1') {
                        let selectedColumnHeader = input[0]['COLUMN_HEADER'] && input[0]['COLUMN_HEADER'] != actualColumnHeaderUUID ? input[0]['COLUMN_HEADER'] : actualColumnHeaderUUID
                        input[0]['SELECTED_UI_ELEMENT_COLUMN_HEADER'] = selectedColumnHeader;
                    }
                    const uiElementQuery = `SELECT * FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:SELECTED_UI_ELEMENT_COLUMN_HEADER`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input[0]);
                    input[0]['EVENT_NAME'] = !input[0]['EVENT_NAME'] ? uiElementQueryData['EVENT_NAME'] : input[0]['EVENT_NAME'];
                }
                    break;

                case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755': {
                    input[0]['CONFIRM_UI_ELEMENT_VALUE'] = !input[0]['CONFIRM_UI_ELEMENT_VALUE'] && !input[0]['confirmUIElementValCodeDesc'] ? getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']) : input[0]['CONFIRM_UI_ELEMENT_VALUE'];
                }
                    break;

                case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a': {
                    let uiElementName1 = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'])
                    input[0]['UI_ELEMENT_NAME_1'] = !input[0]['UI_ELEMENT_NAME_1'] ? uiElementName1 : input[0]['UI_ELEMENT_NAME_1'];
                    isOldValueChanged(input[0]['UI_ELEMENT_NAME_1'], uiElementName1);
                }
                    break;

                case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a': {
                    input[0]['UI_ELEMENT_VALUE_1'] = !input[0]['UI_ELEMENT_VALUE_1'] && !input[0]['uiElementVal1CodeDesc'] ? getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']) : input[0]['UI_ELEMENT_VALUE_1'];
                    predDefValue1 = getPreDefinedValueValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                }
                    break;

                case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43': {
                    currentUserActionName = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['USER_ACTION_NAME'] = !input[0]['USER_ACTION_NAME'] ? currentUserActionName : input[0]['USER_ACTION_NAME'];
                    isOldValueChanged(input[0]['USER_ACTION_NAME'], currentUserActionName);
                }
                    break;

                case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                    input[0]['USER_ACTION_TYPE'] = !input[0]['USER_ACTION_TYPE'] ? getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']) : input[0]['USER_ACTION_TYPE'];
                    break;

                case '6c698ae8-6305-4bb6-8c23-3a938e7234bd': {
                    currentFunctionName = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['FUNCTION_UUID'] = !input[0]['FUNCTION_UUID'] ? currentFunctionName : input[0]['FUNCTION_UUID'];
                    isOldValueChanged(input[0]['FUNCTION_UUID'], currentFunctionName);
                }
                    break;

                case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf': {
                    currentUIElementGroupName = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['UI_ELEMENT_GROUP_UUID'] = !input[0]['UI_ELEMENT_GROUP_UUID'] ? currentUIElementGroupName : input[0]['UI_ELEMENT_GROUP_UUID'];
                    isOldValueChanged(input[0]['UI_ELEMENT_GROUP_UUID'], currentUIElementGroupName);
                }
                    break;

                // page number
                case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c': {
                    let pageNumber = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['PAGE_NUMBER'] = !input[0]['PAGE_NUMBER'] ? pageNumber : input[0]['PAGE_NUMBER'];
                    isOldValueChanged(input[0]['PAGE_NUMBER'], pageNumber);
                }
                    break;

                case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff': {
                    let dataValue = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['DATA_VALUE'] = !input[0]['DATA_VALUE'] ? dataValue : input[0]['DATA_VALUE'];
                    isOldValueChanged(input[0]['DATA_VALUE'], dataValue);
                }
                    break;

                case 'bca9a7f7-1948-407c-9953-2d01356bbd15': {
                    let dataKey = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['DATA_KEY'] = !input[0]['DATA_KEY'] ? dataKey : input[0]['DATA_KEY'];
                    isOldValueChanged(input[0]['DATA_KEY'], dataKey);
                }
                    break;

                case 'ceb66327-216f-42fd-845b-9f4543c62baa': {
                    let fileName = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['FILE_NAME'] = !input[0]['FILE_NAME'] ? fileName : input[0]['FILE_NAME'];
                    isOldValueChanged(input[0]['FILE_NAME'], fileName);
                }
                    break;

                case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90': {
                    let documentParserName = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['DOCUMENT_PARSER_NAME'] = !input[0]['DOCUMENT_PARSER_NAME'] ? documentParserName : input[0]['DOCUMENT_PARSER_NAME'];
                    isOldValueChanged(input[0]['DOCUMENT_PARSER_NAME'], documentParserName);
                }
                    break;

                case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
                    // input[0]['IS_API_EXIST_FOR_STEP_DEFINITION'] = 'Yes';
                    // input[0]['API_UUID'] = !input[0]['API_UUID'] ? getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']) : input[0]['API_UUID'];
                    isOldValueChanged(input[0]['API_UUID'], getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']));
                    break;

                case '46136260-2e33-11ef-b3ef-e52f192c3af0': {
                    let apiAttributeName = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['API_ATTRIBUTE_NAME'] = !input[0]['API_ATTRIBUTE_NAME'] ? apiAttributeName : input[0]['API_ATTRIBUTE_NAME'];
                    isOldValueChanged(input[0]['API_ATTRIBUTE_NAME'], apiAttributeName);
                }
                    break;

                case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                    input[0]['API_ATTRIBUTE_VALUE'] = !input[0]['API_ATTRIBUTE_VALUE'] && !input[0]['apiAttributeValueCodeDesc'] ? getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']) : input[0]['API_ATTRIBUTE_VALUE'];
                    break;

                case '833eb770-2e33-11ef-9033-4bb93e602d01': {
                    let responseCodeValue = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['RESPONSE_CODE_VALUE'] = !input[0]['RESPONSE_CODE_VALUE'] ? responseCodeValue : input[0]['RESPONSE_CODE_VALUE'];
                    isOldValueChanged(input[0]['RESPONSE_CODE_VALUE'], responseCodeValue);
                }

                    break;

                case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd':
                    input[0]['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] = 'Yes';
                    break;

                case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd': {
                    let uiElementState = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['UI_ELEMENT_STATE'] = !input[0]['UI_ELEMENT_STATE'] ? uiElementState : input[0]['UI_ELEMENT_STATE'];
                    isOldValueChanged(input[0]['UI_ELEMENT_STATE'], uiElementState);
                }
                    break;

                case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8': {
                    let timeout = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['TIMEOUT'] = !input[0]['TIMEOUT'] && !input[0]['timeoutCodeDesc'] ? timeout : input[0]['TIMEOUT'];
                    isOldValueChanged(input[0]['TIMEOUT'], timeout);
                }
                    break;

                case '7c7a43c8-e484-11ef-904e-02c8cad0208d':{
                    let testSetScopeVariable = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['TEST_SET_SCOPE_VARIABLE'] = !input[0]['TEST_SET_SCOPE_VARIABLE'] && !input[0]['testSetScopeCodeDesc'] ? testSetScopeVariable : input[0]['TEST_SET_SCOPE_VARIABLE'];
                    isOldValueChanged(input[0]['TEST_SET_SCOPE_VARIABLE'], testSetScopeVariable);
                }
                    break;

                case '842981e7-e484-11ef-904e-02c8cad0208d':
                    let testCaseScopeVariable = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['TEST_CASE_SCOPE_VARIABLE'] = !input[0]['TEST_CASE_SCOPE_VARIABLE'] && !input[0]['testCaseScopeCodeDesc'] ? testCaseScopeVariable : input[0]['TEST_CASE_SCOPE_VARIABLE'];
                    isOldValueChanged(input[0]['TEST_CASE_SCOPE_VARIABLE'], testCaseScopeVariable);
                    break;

                case 'e0568059-ce39-4a69-aadd-6a0dccba696d': {
                    let timeInterval = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['TIME_INTERVAL'] = !input[0]['TIME_INTERVAL'] ? timeInterval : input[0]['TIME_INTERVAL'];
                    isOldValueChanged(input[0]['TIME_INTERVAL'], timeInterval);
                }
                    break;

                case '9d27f361-ac8b-4673-82fe-66c40b2cb634': {
                    let attempts = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['ATTEMPTS'] = !input[0]['ATTEMPTS'] ? attempts : input[0]['ATTEMPTS'];
                    isOldValueChanged(input[0]['ATTEMPTS'], attempts);
                }
                    break;

                case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5': {
                    let columnHeader = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'])
                    input[0]['COLUMN_HEADER'] = !input[0]['COLUMN_HEADER'] ? columnHeader : input[0]['COLUMN_HEADER'];
                    isOldValueChanged(input[0]['COLUMN_HEADER'], columnHeader);
                }
                    break;

                case '75b16425-1531-4cee-8c09-30f5be70c4b0': {
                    input[0]['CELL_VALUE'] = !input[0]['CELL_VALUE'] && !input[0]['cellValueCodeDesc'] ? getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']) : input[0]['CELL_VALUE'];
                }
                    break;

                case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5': {
                    let rowNumber = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['ROW_NUMBER'] = !input[0]['ROW_NUMBER'] && !input[0]['rowNumberCodeDesc'] ? rowNumber : input[0]['ROW_NUMBER'];
                    isOldValueChanged(input[0]['ROW_NUMBER'], rowNumber);
                }
                    break;

                case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
                    input[0]['TABLE_NAME'] = !input[0]['TABLE_NAME'] ? getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']) : input[0]['TABLE_NAME'];
                    break;

                case '078e6534-f38f-4aad-b89d-cad8216ad86b': {
                    let columnHeader1 = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['COLUMN_HEADER_1'] = !input[0]['COLUMN_HEADER_1'] ? columnHeader1 : input[0]['COLUMN_HEADER_1'];
                    isOldValueChanged(input[0]['COLUMN_HEADER_1'], columnHeader1);
                }
                    break;

                case 'ba1ef281-412a-4544-b615-7767b06eb489':
                    input[0]['CELL_VALUE_1'] = !input[0]['CELL_VALUE_1'] && !input[0]['cellValue1CodeDesc'] ? getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']) : input[0]['CELL_VALUE_1'];
                    break;

                case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83': {
                    let columnNumber = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['COLUMN_NUMBER'] = !input[0]['COLUMN_NUMBER'] && !input[0]['columnNumberCodeDesc'] ? columnNumber : input[0]['COLUMN_NUMBER'];
                    isOldValueChanged(input[0]['COLUMN_NUMBER'], columnNumber);
                }
                    break;

                case '28058e26-fa09-42fb-868a-1988bd0a746c': {
                    let fileFullPath = getDataFromAttributeValue(functionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    input[0]['FILE_FULL_PATH'] = !input[0]['FILE_FULL_PATH'] && !input[0]['fileFullPathCodeDesc'] ? fileFullPath : input[0]['FILE_FULL_PATH'];
                    isOldValueChanged(input[0]['FILE_FULL_PATH'], fileFullPath);
                }
                    break;
                default: null
            }
        }

        if (input[0]['UI_ELEMENT_NAME'] && input[0]['UI_ELEMENT_TYPE']) {
            if (currentUIElementName && input[0]['UI_ELEMENT_NAME'] && currentUIElementName != input[0]['UI_ELEMENT_NAME']) {
                input[0]['UI_ELEMENT_TYPE'] = "";
                input[0]['EVENT_NAME'] = "";
            }
        } else if (input[0]['USER_ACTION_NAME'] && input[0]['USER_ACTION_TYPE']) {
            if (currentUserActionName && input[0]['USER_ACTION_NAME'] && currentUserActionName != input[0]['USER_ACTION_NAME']) {
                input[0]['USER_ACTION_TYPE'] = "";
            }
        } else if (input[0]['UI_ELEMENT_GROUP_UUID']) {
            if (currentUIElementGroupName && input[0]['UI_ELEMENT_GROUP_UUID'] && currentUIElementGroupName != input[0]['UI_ELEMENT_GROUP_UUID']) {
                input[0]['isUIElementGroupChanged'] = true;
            }
        }
    }

} else if ((input[0]['isInitialRecord'] && input[0]['IS_INTERMEDIATE_FUNCTION'] === 'Yes' && input[0]['START_PAGE_NAME']) && !input[0]['FUNCTION_STEP_UUID']) {
    input[0]['FUNCTION_STEP_POSITION'] = 'First Function Step';
    input[0]['FUNCTION_STEP_TYPE'] = input[0]['FUNCTION_STEP_TYPE'] ? input[0]['FUNCTION_STEP_TYPE'] : 'When';
} else if ((!input[0]['isInitialRecord'] || input[0]['IS_INTERMEDIATE_FUNCTION'] === 'Yes') && !input[0]['FUNCTION_STEP_UUID']) {
    input[0]['FUNCTION_STEP_POSITION'] = input[0]['FUNCTION_STEP_POSITION'] ? input[0]['FUNCTION_STEP_POSITION'] : 'Last Function Step';
    input[0]['FUNCTION_STEP_TYPE'] = input[0]['FUNCTION_STEP_TYPE'] ? input[0]['FUNCTION_STEP_TYPE'] : 'When';
}


if ((input[0]['uiElementNameCodeDesc'] == 'adcf6e25-f890-476c-bdcf-e723c6d7894c' || input[0]['userActionNameCodeDesc'] == '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43') || (input[0]['FUNCTION_STEP_UUID'] && (input[0]['UI_ELEMENT_NAME'] || input[0]['USER_ACTION_NAME']))) {
    const uiElementQuery = `SELECT UI_ELEMENT_NAME,EVENT_NAME,UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT ue,UI_ELEMENT_TYPE_MASTER uetm WHERE UI_ELEMENT_TYPE_UUID=UI_ELEMENT_TYPE AND (UI_ELEMENT_UUID=:UI_ELEMENT_NAME OR UI_ELEMENT_UUID=:USER_ACTION_NAME) AND ue.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input[0]);

    if (input[0]['UI_ELEMENT_NAME']) {
        let codeSetQueryData = await checkIsCodeSetExist(input[0]['UI_ELEMENT_NAME']);
        if (codeSetQueryData && codeSetQueryData['CODE_SET_UUID']) {
            input[0]['CODE_SET_UUID'] = codeSetQueryData['CODE_SET_UUID'];
        }

        if (input[0]['CODE_SET_UUID'] && predDefValue && !input[0]['PRE_DEFINED_VALUES_UUID']) {
            input[0]['PRE_DEFINED_VALUES_UUID'] = predDefValue;
        } else if (input[0]['CODE_SET_UUID'] && !predDefValue && !input[0]['PRE_DEFINED_VALUES_UUID']) {
            input[0]['PRE_DEFINED_VALUES_UUID'] = 'a1112471-fd9e-11ef-ba34-02a48541b261';
            input[0]['isUiElementValue'] = "Yes";
        } else if (!input[0]['CODE_SET_UUID']) {
            input[0]['isUiElementValue'] = "Yes";
        }
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Name>', function () {
            return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
        });
    }

    if (input[0]['USER_ACTION_NAME']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<User Action Name>', function () {
            return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
        });
    }

    if (input[0]['uiElementTypeCodeDesc'] == '7f855066-ad39-4325-8108-30befb2447e6' || (input[0]['FUNCTION_STEP_UUID'])) {
        if (uiElementQueryData['UI_ELEMENT_TYPE_NAME']) {
            input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Type>', function () {
                return "'" + uiElementQueryData['UI_ELEMENT_TYPE_NAME'] + "'"
            });
        }
    }

    if (input[0]['userActionTypeCodeDesc'] == '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43' || (input[0]['FUNCTION_STEP_UUID'])) {
        if (uiElementQueryData['UI_ELEMENT_TYPE_NAME']) {
            input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<User Action Type>', function () {
                return "'" + uiElementQueryData['UI_ELEMENT_TYPE_NAME'] + "'"
            });
        }
    }

    if (input[0]['uiElementValCodeDesc'] == '74da67d2-41c9-4cf7-9eea-715243e5fcdc' || (input[0]['FUNCTION_STEP_UUID'])) {
        if (input[0]['PRE_DEFINED_VALUES_UUID'] && input[0]['PRE_DEFINED_VALUES_UUID'] != 'a1112471-fd9e-11ef-ba34-02a48541b261') {
            const preDefinedValue = `SELECT PRE_DEFINED_VALUES_TEXT FROM PRE_DEFINED_VALUES where PRE_DEFINED_VALUES_UUID=:PRE_DEFINED_VALUES_UUID`;
            let preDefinedValueData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFO_TENANT", preDefinedValue, input[0]);
            if (preDefinedValueData && preDefinedValueData['PRE_DEFINED_VALUES_TEXT']) {
                input[0]['UI_ELEMENT_VALUE'] = preDefinedValueData['PRE_DEFINED_VALUES_TEXT']
            }
        }

        if ((input[0]['CODE_SET_UUID'] && input[0]['PRE_DEFINED_VALUES_UUID'] == 'a1112471-fd9e-11ef-ba34-02a48541b261') || input[0]['UI_ELEMENT_NAME'] && !input[0]['CODE_SET_UUID']) {
            input[0]['isUiElementValue'] = "Yes";
        }
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Value>', input[0]['UI_ELEMENT_VALUE'] ? function () {
            return "'" + input[0]['UI_ELEMENT_VALUE'] + "'"
        } : "' '");
    }

    if (input[0]['uiElementName1CodeDesc'] == '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a' || (input[0]['FUNCTION_STEP_UUID'])) {
        if (input[0]['UI_ELEMENT_NAME_1']) {
            let codeSetQueryData = await checkIsCodeSetExist(input[0]['UI_ELEMENT_NAME_1']);
            if (codeSetQueryData && codeSetQueryData['CODE_SET_UUID']) {
                input[0]['CODESET_UUID_1'] = codeSetQueryData['CODE_SET_UUID'];
            }
            if (input[0]['CODESET_UUID_1'] && predDefValue1 && !input[0]['PRE_DEFINED_VALUES_UUID_1']) {
                input[0]['PRE_DEFINED_VALUES_UUID_1'] = predDefValue1;
            } else if (input[0]['CODESET_UUID_1'] && !predDefValue1 && !input[0]['PRE_DEFINED_VALUES_UUID_1']) {
                input[0]['PRE_DEFINED_VALUES_UUID_1'] = 'a1112471-fd9e-11ef-ba34-02a48541b261';
                input[0]['isUiElementValue1'] = "Yes";
            } else if (!input[0]['CODESET_UUID_1']) {
                input[0]['isUiElementValue1'] = "Yes";
            }
            const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME_1 AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input[0]);
            input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Name 1>', function () {
                return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
            });
        }
    }

    if (input[0]['uiElementVal1CodeDesc'] == '3f50ff70-f3e4-11ee-9a12-6fc3e771212a' || (input[0]['FUNCTION_STEP_UUID'])) {
        if (input[0]['PRE_DEFINED_VALUES_UUID_1']) {
            const preDefinedValue = `SELECT PRE_DEFINED_VALUES_TEXT FROM PRE_DEFINED_VALUES where PRE_DEFINED_VALUES_UUID=:PRE_DEFINED_VALUES_UUID_1`;
            let preDefinedValueData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFO_TENANT", preDefinedValue, input[0]);
            if (preDefinedValueData && preDefinedValueData['PRE_DEFINED_VALUES_TEXT']) {
                input[0]['UI_ELEMENT_VALUE_1'] = preDefinedValueData['PRE_DEFINED_VALUES_TEXT']
            }
        }

        if ((input[0]['CODESET_UUID_1'] && input[0]['PRE_DEFINED_VALUES_UUID_1'] == 'a1112471-fd9e-11ef-ba34-02a48541b261') || input[0]['UI_ELEMENT_NAME_1'] && !input[0]['CODESET_UUID_1']) {
            input[0]['isUiElementValue1'] = "Yes";
        }
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Value 1>', input[0]['UI_ELEMENT_VALUE_1'] ? function () {
            return "'" + input[0]['UI_ELEMENT_VALUE_1'] + "'"
        } : "' '");
    }
}

if (input[0]['eventNameCodeDesc'] == '005d158d-428c-4bca-ae2d-1c3f9630b549' || (input[0]['FUNCTION_STEP_UUID'])) {
    const uiElementEventQuery = `SELECT * FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:SELECTED_UI_ELEMENT_COLUMN_HEADER`;
    let uiElementEventQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementEventQuery, input[0]);
    if (uiElementEventQueryData['EVENT_NAME']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Event Type>', function () {
            return "'" + uiElementEventQueryData['EVENT_NAME'] + "'"
        });
    }
}

if (input[0]['timeoutCodeDesc'] == '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['TIMEOUT']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Timeout>', input[0]['TIMEOUT'] ? function () {
            return "'" + input[0]['TIMEOUT'] + "'"
        } : "' '");
    }
}

if (input[0]['keyPadCodeDesc'] == '235dfa3a-a897-4076-b9bc-ed813ec7c39f' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['KEY_NAME_IN_KEY_PAD']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Key Name in Keypad>', function () {
            return "'" + input[0]['KEY_NAME_IN_KEY_PAD'] + "'"
        });
    }
}

if (input[0]['confirmUIElementValCodeDesc'] == 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755' || (input[0]['FUNCTION_STEP_UUID'])) {
    input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Confirm UI Element Value>', input[0]['CONFIRM_UI_ELEMENT_VALUE'] ? function () {
        return "'" + input[0]['CONFIRM_UI_ELEMENT_VALUE'] + "'"
    } : "' '");
}

if (input[0]['functionNameCodeDesc'] == '6c698ae8-6305-4bb6-8c23-3a938e7234bd' || input[0]['FUNCTION_STEP_UUID']) {
    if (input[0]['FUNCTION_UUID']) {
        const functionNameQuery = `SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID=:FUNCTION_UUID`;
        let functionNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", functionNameQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Function Name>', function () {
            return "'" + functionNameQueryData['FUNCTION_NAME'] + "'"
        });
    }
}

if (input[0]['uiElementGroupCodeDesc'] == '5c3edc60-f290-11ee-a7a7-c7f3437be2cf' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['UI_ELEMENT_GROUP_UUID']) {
        let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP  WHERE UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let uiElementGroupStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Group Name>', function () {
            return "'" + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + "'"
        });
    }
}

if (input[0]['pageNumberCodeDesc'] == '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['PAGE_NUMBER']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Page Number>', input[0]['PAGE_NUMBER'] ? function () {
            return "'" + input[0]['PAGE_NUMBER'] + "'"
        } : "' '");
    }
}

if (input[0]['dataValueCodeDesc'] == '3aff7b0e-472c-4393-b6b2-5a61b07cfbff' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['DATA_VALUE']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Data Value>', input[0]['DATA_VALUE'] ? function () {
            return "'" + input[0]['DATA_VALUE'] + "'"
        } : "' '");
    }
}

if (input[0]['dataKeyCodeDesc'] == 'bca9a7f7-1948-407c-9953-2d01356bbd15' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['DATA_KEY']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Data Key>', input[0]['DATA_KEY'] ? function () {
            return "'" + input[0]['DATA_KEY'] + "'"
        } : "' '");
    }
}

if (input[0]['fileNameCodeDesc'] == 'ceb66327-216f-42fd-845b-9f4543c62baa' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['FILE_NAME']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<File Name>', input[0]['FILE_NAME'] ? function () {
            return "'" + input[0]['FILE_NAME'] + "'"
        } : "' '");
    }
}
if (input[0]['documentParserNameCodeDesc'] == 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['DOCUMENT_PARSER_NAME']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Document Parser Name>', input[0]['DOCUMENT_PARSER_NAME'] ? function () {
            return "'" + input[0]['DOCUMENT_PARSER_NAME'] + "'"
        } : "' '");
    }
}
if (input[0]['apiNameCodeDesc'] == '36880b70-2e33-11ef-b3ef-e52f192c3af0' || (input[0]['FUNCTION_STEP_UUID']) || (stepDefAttributeVerbiageQueryData && stepDefAttributeVerbiageQueryData.length && stepDefAttributeVerbiageQueryData[0]['IS_API_CONTEXT_SETTER'] == 'Yes')) {
    if (input[0]['API_UUID']) {
        const apiQuery = `SELECT API_NAME FROM API_NEW WHERE API_UUID=:API_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let apiQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", apiQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<API Name>', function () {
            return "'" + apiQueryData['API_NAME'] + "'"
        });
    }
}
if (input[0]['apiAttributeNameCodeDesc'] == '46136260-2e33-11ef-b3ef-e52f192c3af0' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['API_ATTRIBUTE_NAME']) {
        const apiAttributeQuery = `SELECT ATTRIBUTE_NAME FROM API_ATTRIBUTE WHERE API_ATTRIBUTE_UUID=:API_ATTRIBUTE_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let apiAttributeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", apiAttributeQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<API Attribute Name>', function () {
            return "'" + apiAttributeQueryData['ATTRIBUTE_NAME'] + "'"
        });
    }
}
if (input[0]['apiAttributeValueCodeDesc'] == '7182ebf0-2e33-11ef-9033-4bb93e602d01' || input[0]['FUNCTION_STEP_UUID']) {
    input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<API Attribute Value>', input[0]['API_ATTRIBUTE_VALUE'] ? function () {
        return "'" + input[0]['API_ATTRIBUTE_VALUE'] + "'"
    } : "' '");
}
if (input[0]['responseCodeValueCodeDesc'] == '833eb770-2e33-11ef-9033-4bb93e602d01' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['RESPONSE_CODE_VALUE']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Response Status Code>', input[0]['RESPONSE_CODE_VALUE'] ? function () {
            return "'" + input[0]['RESPONSE_CODE_VALUE'] + "'"
        } : "' '");
    }
}

if (input[0]['uiElementStateCodeDesc'] == 'ccd0b030-613e-11ef-81c7-b59b0b9089cd' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['UI_ELEMENT_STATE']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element State>', input[0]['UI_ELEMENT_STATE'] ? function () {
            return "'" + input[0]['UI_ELEMENT_STATE'] + "'"
        } : "' '");
    }
}

if (input[0]['testSetScopeCodeDesc'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['TEST_SET_SCOPE_VARIABLE']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Test Set Scope Variable>', input[0]['TEST_SET_SCOPE_VARIABLE'] ? function () {
            return "'" + input[0]['TEST_SET_SCOPE_VARIABLE'] + "'"
        } : "' '");
    }
}

if (input[0]['testCaseScopeCodeDesc'] == '842981e7-e484-11ef-904e-02c8cad0208d' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['TEST_CASE_SCOPE_VARIABLE']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Test Case Scope Variable>', input[0]['TEST_CASE_SCOPE_VARIABLE'] ? function () {
            return "'" + input[0]['TEST_CASE_SCOPE_VARIABLE'] + "'"
        } : "' '");
    }
}

if (input[0]['pageNameCodeDesc'] == '57b76ab3-8112-4343-af0f-49643c808bf7' || input[0]['FUNCTION_STEP_UUID'] || (stepDefAttributeVerbiageQueryData && stepDefAttributeVerbiageQueryData.length && stepDefAttributeVerbiageQueryData[0]['IS_PAGE_CONTEXT_SETTER'] == 'Yes' && (input[0]['pageNameChanged'] == 'Yes' || input[0]['isOnlyOneAttribute']))) {
    // let currentPage = input[0]['isMoreThanOneAttribute'] && input[0]['NEXT_PAGE_CONTEXT'] ? input[0]['NEXT_PAGE_CONTEXT'] : input[0]['CURRENT_PAGE_CONTEXT'];

    let currentPage = '';
    if (input[0]['isMoreThanOneAttribute'] && !input[0]['isOtherVisiblePage']) {
        currentPage = input[0]['NEXT_PAGE_CONTEXT'];
    } else if (!input[0]['isMoreThanOneAttribute'] && input[0]['isOtherVisiblePage']) {
        currentPage = input[0]['CURRENT_PAGE_CONTEXT'];
    } else {
        currentPage = input[0]['CURRENT_PAGE_CONTEXT'];
    }

    if (currentPage) {
        const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID=${"'" + currentPage + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", pageNewQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Page Name>', function () {
            return "'" + pageNewQueryData['PAGE_NAME'] + "'"
        });
    }

    const viewQuery = `SELECT * FROM PAGE_VIEW WHERE PAGE_UUID=:CURRENT_PAGE_CONTEXT`;
    let viewQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewQuery, input[0]);
    if (viewQueryData && viewQueryData.length > 1) {
        input[0]['isViewAvailable'] = 'Yes';
        if (!input[0]['VIEW_UUID']) {
            let defaultView = viewQueryData.filter((item) => item['IS_DEFAULT_VIEW'] == 'Yes');
            input[0]['VIEW_UUID'] = defaultView[0]['VIEW_UUID'];
        }
    } else if (viewQueryData && viewQueryData.length == 1) {
        //let defaultView = viewQueryData.filter((item) => item['IS_DEFAULT_VIEW'] == 'Yes');
        input[0]['VIEW_UUID'] = viewQueryData[0]['VIEW_UUID'];
    }

}

if (input[0]['pageName1CodeDesc'] == 'c53a65a0-613e-11ef-81c7-b59b0b9089cd' || (input[0]['FUNCTION_STEP_UUID']) || (stepDefAttributeVerbiageQueryData && stepDefAttributeVerbiageQueryData.length && stepDefAttributeVerbiageQueryData[0]['IS_PAGE_CONTEXT_SETTER'] == 'Yes' && input[0]['pageNameChanged'] == 'Yes')) {
    let currentPage = input[0]['NEXT_PAGE_CONTEXT'];
    if (currentPage) {
        const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID=${"'" + currentPage + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", pageNewQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Page Name 1>', currentPage ? function () {
            return "'" + pageNewQueryData['PAGE_NAME'] + "'"
        } : '<Page Name 1>');
    }
}

if (input[0]['timeIntervalCodeDesc'] == 'e0568059-ce39-4a69-aadd-6a0dccba696d' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['TIME_INTERVAL']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Time Interval>', input[0]['TIME_INTERVAL'] ? function () {
            return "'" + input[0]['TIME_INTERVAL'] + "'"
        } : "' '");
    }
}

if (input[0]['attemptsCodeDesc'] == '9d27f361-ac8b-4673-82fe-66c40b2cb634' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['ATTEMPTS']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Attempts>', input[0]['ATTEMPTS'] ? function () {
            return "'" + input[0]['ATTEMPTS'] + "'"
        } : "' '");
    }
}

if (input[0]['columnHeaderCodeDesc'] == 'd797acb4-5e5c-447b-b0c5-60dad38e39a5' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['COLUMN_HEADER']) {
        const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:COLUMN_HEADER AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Column Header>', function () {
            return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
        });
    }
}

if (input[0]['cellValueCodeDesc'] == '75b16425-1531-4cee-8c09-30f5be70c4b0' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['CELL_VALUE']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Cell Value>', input[0]['CELL_VALUE'] ? function () {
            return "'" + input[0]['CELL_VALUE'] + "'"
        } : "' '");
    }
}

if (input[0]['rowNumberCodeDesc'] == 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['ROW_NUMBER']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Row Number>', input[0]['ROW_NUMBER'] ? function () {
            return "'" + input[0]['ROW_NUMBER'] + "'"
        } : "' '");
    }
}

if (input[0]['tableNameCodeDesc'] == 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['TABLE_NAME']) {
        const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:TABLE_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Table Name>', function () {
            return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
        });
    }
}

if (input[0]['columnHeader1CodeDesc'] == '078e6534-f38f-4aad-b89d-cad8216ad86b' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['COLUMN_HEADER_1']) {
        const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:COLUMN_HEADER_1 AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Column Header 1>', function () {
            return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
        });
    }
}

if (input[0]['cellValue1CodeDesc'] == 'ba1ef281-412a-4544-b615-7767b06eb489' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['CELL_VALUE_1']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Cell Value 1>', input[0]['CELL_VALUE_1'] ? function () {
            return "'" + input[0]['CELL_VALUE_1'] + "'"
        } : "' '");
    }
}

if (input[0]['columnNumberCodeDesc'] == 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['COLUMN_NUMBER']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Column Number>', input[0]['COLUMN_NUMBER'] ? function () {
            return "'" + input[0]['COLUMN_NUMBER'] + "'"
        } : "' '");
    }
}

if (input[0]['fileFullPathCodeDesc'] == '28058e26-fa09-42fb-868a-1988bd0a746c' || (input[0]['FUNCTION_STEP_UUID'])) {
    if (input[0]['FILE_FULL_PATH']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<File Full Path>', input[0]['FILE_FULL_PATH'] ? function () {
            return "'" + input[0]['FILE_FULL_PATH'] + "'"
        } : "' '");
    }
}


if (!input[0]['STEP_FILTER']) {
    input[0]['STEP_DEFINITION_FILTER'] = '%';
} else {
    input[0]['STEP_DEFINITION_FILTER'] = '#do-not-match';
}