let viewNavigationStepList = [];
let viewNavigationStepAttributeValueArray = [];

const TEST_CASE_VIEW_NAVIGATION_STEP = [];
const TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE = [];
const FUNCTION_VIEW_NAVIGATION_STEP = [];
const FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE = [];

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

const updateSequenceForCopySteps = async (viewNavigationStepUUID, updatedSequence) => {
    const tcvnStepQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP WHERE VIEW_NAVIGATION_STEP_UUID='${viewNavigationStepUUID}'`;
    const tcvnStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", tcvnStepQuery, input);

    tcvnStepQueryData.forEach(tcvnData => {
        const tcvnDataObj = {};
        tcvnDataObj['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] = tcvnData['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'];
        tcvnDataObj['TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID'] = updatedSequence;
        tcvnDataObj['compositeEntityAction'] = 'Update';
        TEST_CASE_VIEW_NAVIGATION_STEP.push(tcvnDataObj);
    });

    const fcvnStepQuery = `SELECT FUNCTION_VIEW_NAVIGATION_STEP_UUID FROM FUNCTION_VIEW_NAVIGATION_STEP WHERE VIEW_NAVIGATION_STEP_UUID='${viewNavigationStepUUID}'`;
    const fcvnStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", fcvnStepQuery, input);

    fcvnStepQueryData.forEach(fcvnData => {
        const fcvnDataObj = {};
        fcvnDataObj['FUNCTION_VIEW_NAVIGATION_STEP_UUID'] = fcvnData['FUNCTION_VIEW_NAVIGATION_STEP_UUID'];
        fcvnDataObj['FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID'] = updatedSequence;
        fcvnDataObj['compositeEntityAction'] = 'Update';
        FUNCTION_VIEW_NAVIGATION_STEP.push(fcvnDataObj);
    });
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

                await updateSequenceForCopySteps(changedSeqID['VIEW_NAVIGATION_STEP_UUID'], changedSeqID['VIEW_NAVIGATION_STEP_SEQ_ID']);
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

                await updateSequenceForCopySteps(changedSeqID['VIEW_NAVIGATION_STEP_UUID'], changedSeqID['VIEW_NAVIGATION_STEP_SEQ_ID']);
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

                await updateSequenceForCopySteps(changedSeqID['VIEW_NAVIGATION_STEP_UUID'], changedSeqID['VIEW_NAVIGATION_STEP_SEQ_ID']);
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

                await updateSequenceForCopySteps(changedSeqID['VIEW_NAVIGATION_STEP_UUID'], changedSeqID['VIEW_NAVIGATION_STEP_SEQ_ID']);
            }
        }
    }
}

let stepDefAttributeQueryData = await fetchStepDefinitionTemplateVerbiage("'" + input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] + "'");
let viewNavigationNameStepDefVerbiageStr = stepDefAttributeQueryData[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'];

// this createViewNavigationStepAttributeValue function is responsible to create the record for view navigation step attribute value table and also responsible to generete the actual step definition based on selected verbiage
async function createViewNavigationStepAttributeValue(stepDefAttributeData, createdTestCaseViewNav = [], createdFunctionViewNav = []) {
    for (let codeDesc of stepDefAttributeData) {
        if (codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'] && codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
            let object = {};
            object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
            object['VIEW_UUID'] = input['VIEW_UUID'];
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
                case '57b76ab3-8112-4343-af0f-49643c808bf7':
                    let currentPage = input['isMoreThanOneAttribute'] && input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
                    // input['CURRENT_PAGE_CONTEXT'] = currentPage;
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = currentPage;
                    const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID=${"'" + currentPage + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", pageNewQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Page Name>', function () {
                        return "'" + pageNewQueryData['PAGE_NAME'] + "'"
                    });
                    break;

                case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME'];
                    const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element Name>', function () {
                        return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                    });
                    break;

                case '7f855066-ad39-4325-8108-30befb2447e6':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_TYPE'];
                    const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID=:UI_ELEMENT_TYPE`;
                    let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element Type>', function () {
                        return "'" + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + "'"
                    });
                    break;

                case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element Value>', input['UI_ELEMENT_VALUE'] ? function () {
                        return "'" + input['UI_ELEMENT_VALUE'] + "'"
                    } : "' '");
                    if (input['PRE_DEFINED_VALUES_UUID'] && input['PRE_DEFINED_VALUES_UUID'] != 'a1112471-fd9e-11ef-ba34-02a48541b261') {
                        object['PRE_DEFINED_VALUES_UUID'] = input['PRE_DEFINED_VALUES_UUID'];
                    }
                    break;

                case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['KEY_NAME_IN_KEY_PAD'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Key Name in Keypad>', function () {
                        return "'" + input['KEY_NAME_IN_KEY_PAD'] + "'"
                    });
                    break;

                case '005d158d-428c-4bca-ae2d-1c3f9630b549':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['EVENT_NAME'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Event Type>', input['EVENT_NAME'] ? function () {
                        return "'" + input['EVENT_NAME'] + "'"
                    } : "' '");
                    break;

                case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['CONFIRM_UI_ELEMENT_VALUE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Confirm UI Element Value>', input['CONFIRM_UI_ELEMENT_VALUE'] ? function () {
                        return "'" + input['CONFIRM_UI_ELEMENT_VALUE'] + "'"
                    } : "' '");
                    break;
                case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME_1'];
                    const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME_1 AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element Name 1>', function () {
                        return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                    });
                }
                    break;

                case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE_1'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element Value 1>', input['UI_ELEMENT_VALUE_1'] ? function () {
                        return "'" + input['UI_ELEMENT_VALUE_1'] + "'"
                    } : "' '");
                    if (input['PRE_DEFINED_VALUES_UUID_1'] && input['PRE_DEFINED_VALUES_UUID_1'] != 'a1112471-fd9e-11ef-ba34-02a48541b261') {
                        object['PRE_DEFINED_VALUES_UUID'] = input['PRE_DEFINED_VALUES_UUID_1']
                    }

                    break;

                // user action name
                case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['USER_ACTION_NAME'];
                    const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:USER_ACTION_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<User Action Name>', function () {
                        return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                    });
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
                }
                    break;
                // page number
                case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['PAGE_NUMBER'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Page Number>', input['PAGE_NUMBER'] ? function () {
                        return "'" + input['PAGE_NUMBER'] + "'"
                    } : "' '");
                    break;

                case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['DATA_VALUE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Data Value>', input['DATA_VALUE'] ? function () {
                        return "'" + input['DATA_VALUE'] + "'"
                    } : "' '");
                    break;

                case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['DATA_KEY'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Data Key>', input['DATA_KEY'] ? function () {
                        return "'" + input['DATA_KEY'] + "'"
                    } : "' '");
                    break;

                case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['FILE_NAME'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<File Name>', input['FILE_NAME'] ? function () {
                        return "'" + input['FILE_NAME'] + "'"
                    } : "' '");
                    break;

                case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['DOCUMENT_PARSER_NAME'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Document Parser Name>', input['DOCUMENT_PARSER_NAME'] ? function () {
                        return "'" + input['DOCUMENT_PARSER_NAME'] + "'"
                    } : "' '");
                    break;

                case '36880b70-2e33-11ef-b3ef-e52f192c3af0': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['API_UUID'];
                    const apiQuery = `SELECT API_NAME FROM API_NEW WHERE API_UUID=:API_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let apiQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", apiQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<API Name>', function () {
                        return "'" + apiQueryData['API_NAME'] + "'"
                    });
                }
                    break;
                case '46136260-2e33-11ef-b3ef-e52f192c3af0': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['API_ATTRIBUTE_NAME'];
                    const apiAttributeQuery = `SELECT ATTRIBUTE_NAME FROM API_ATTRIBUTE WHERE API_ATTRIBUTE_UUID=:API_ATTRIBUTE_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let apiAttributeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", apiAttributeQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<API Attribute Name>', function () {
                        return "'" + apiAttributeQueryData['ATTRIBUTE_NAME'] + "'"
                    });
                }
                    break;
                case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['API_ATTRIBUTE_VALUE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<API Attribute Value>', input['API_ATTRIBUTE_VALUE'] ? function () {
                        return "'" + input['API_ATTRIBUTE_VALUE'] + "'"
                    } : "' '");
                    break;

                case '833eb770-2e33-11ef-9033-4bb93e602d01':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['RESPONSE_CODE_VALUE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Response Status Code>', input['RESPONSE_CODE_VALUE'] ? function () {
                        return "'" + input['RESPONSE_CODE_VALUE'] + "'"
                    } : "' '");
                    break;

                case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_STATE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<UI Element State>', input['UI_ELEMENT_STATE'] ? function () { return "'" + input['UI_ELEMENT_STATE'] + "'" } : "' '");
                    break;

                case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['TIMEOUT'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Timeout>', input['TIMEOUT'] ? function () {
                        return "'" + input['TIMEOUT'] + "'"
                    } : "' '");
                    break;

                case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['TEST_SET_SCOPE_VARIABLE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Test Set Scope Variable>', input['TEST_SET_SCOPE_VARIABLE'] ? function () {
                        return "'" + input['TEST_SET_SCOPE_VARIABLE'] + "'"
                    } : "' '");
                    break;

                case '842981e7-e484-11ef-904e-02c8cad0208d':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['TEST_CASE_SCOPE_VARIABLE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Test Case Scope Variable>', input['TEST_CASE_SCOPE_VARIABLE'] ? function () {
                        return "'" + input['TEST_CASE_SCOPE_VARIABLE'] + "'"
                    } : "' '");
                    break;

                case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd': {
                    let currentPage = input['NEXT_PAGE_CONTEXT'];
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = currentPage;
                    const pageNewQuery = `SELECT PAGE_NAME, PAGE_ACCESS_RELATIVE_URL FROM PAGE WHERE PAGE_UUID=${"'" + currentPage + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", pageNewQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Page Name 1>', function () {
                        return "'" + pageNewQueryData['PAGE_NAME'] + "'"
                    });
                }
                    break;

                case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['TIME_INTERVAL'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Time Interval>', input['TIME_INTERVAL'] ? function () {
                        return "'" + input['TIME_INTERVAL'] + "'"
                    } : "' '");
                    break;

                case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['ATTEMPTS'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Attempts>', input['ATTEMPTS'] ? function () {
                        return "'" + input['ATTEMPTS'] + "'"
                    } : "' '");
                    break;

                case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['COLUMN_HEADER'];
                    const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:COLUMN_HEADER AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Column Header>', function () {
                        return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                    });
                }
                    break;

                case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['CELL_VALUE'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Cell Value>', input['CELL_VALUE'] ? function () {
                        return "'" + input['CELL_VALUE'] + "'"
                    } : "' '");
                    break;

                case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['ROW_NUMBER'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Row Number>', input['ROW_NUMBER'] ? function () {
                        return "'" + input['ROW_NUMBER'] + "'"
                    } : "' '");
                    break;

                case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['TABLE_NAME'];
                    const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:TABLE_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Table Name>', function () {
                        return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                    });
                }
                    break;

                case '078e6534-f38f-4aad-b89d-cad8216ad86b': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['COLUMN_HEADER_1'];
                    const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:COLUMN_HEADER_1 AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Column Header 1>', function () {
                        return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
                    });
                }
                    break;

                case 'ba1ef281-412a-4544-b615-7767b06eb489':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['CELL_VALUE_1'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Cell Value 1>', input['CELL_VALUE_1'] ? function () {
                        return "'" + input['CELL_VALUE_1'] + "'"
                    } : "' '");
                    break;

                case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['COLUMN_NUMBER'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<Column Number>', input['COLUMN_NUMBER'] ? function () {
                        return "'" + input['COLUMN_NUMBER'] + "'"
                    } : "' '");
                    break;

                case '28058e26-fa09-42fb-868a-1988bd0a746c': {
                    object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = input['FILE_FULL_PATH'];
                    viewNavigationNameStepDefVerbiageStr = viewNavigationNameStepDefVerbiageStr.replaceAll('<File Full Path>', input['FILE_FULL_PATH'] ? function () {
                        return "'" + input['FILE_FULL_PATH'] + "'"
                    } : "' '");
                }
                    break;
            }

            if (!['005d158d-428c-4bca-ae2d-1c3f9630b549', '7f855066-ad39-4325-8108-30befb2447e6'].includes(codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'])) {
                // creating new records in TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE
                createdTestCaseViewNav.forEach(tcvnData => {
                    const tcvnattData = {};
                    tcvnattData['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] = tcvnData['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'];
                    tcvnattData['FUNCTION_UUID'] = tcvnData['FUNCTION_UUID'];
                    tcvnattData['TEST_CASE_STEP_UUID'] = tcvnData['TEST_CASE_STEP_UUID'];
                    tcvnattData['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA']
                    tcvnattData['STEP_DEFINITION_ATTRIBUTE_UUID'] = object['STEP_DEFINITION_ATTRIBUTE_UUID'];
                    tcvnattData['VIEW_UUID'] = object['VIEW_UUID'];
                    tcvnattData['PRE_DEFINED_VALUES_UUID'] = object['PRE_DEFINED_VALUES_UUID'];

                    TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(tcvnattData);
                });

                // creating new records in FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE
                createdFunctionViewNav.forEach(fcvnData => {
                    const fcvnattData = {};
                    fcvnattData['FUNCTION_VIEW_NAVIGATION_STEP_UUID'] = fcvnData['FUNCTION_VIEW_NAVIGATION_STEP_UUID'];
                    fcvnattData['FUNCTION_UUID'] = fcvnData['FUNCTION_UUID'];
                    fcvnattData['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = object['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'];
                    fcvnattData['STEP_DEFINITION_ATTRIBUTE_UUID'] = object['STEP_DEFINITION_ATTRIBUTE_UUID'];
                    fcvnattData['VIEW_UUID'] = object['VIEW_UUID'];
                    fcvnattData['PRE_DEFINED_VALUES_UUID'] = object['PRE_DEFINED_VALUES_UUID'];

                    FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(fcvnattData);
                });

                viewNavigationStepAttributeValueArray.push(object);
            }
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
    } else if (deleteType === "TEST_CASE_VIEW_NAVIGATION_STEP") {
        TEST_CASE_VIEW_NAVIGATION_STEP.push(deleteParamenter);
    } else if (deleteType === "FUNCTION_VIEW_NAVIGATION_STEP") {
        FUNCTION_VIEW_NAVIGATION_STEP.push(deleteParamenter);
    } else if (deleteType === "TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE") {
        TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteParamenter);
    } else if (deleteType === "FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE") {
        FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteParamenter);
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


const deleteTestCaseViewNavAttributeData = async (tcvnsIdStr) => {
    if (!tcvnsIdStr || !tcvnsIdStr.trim()) return;
    const tcvnattDataQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_VIEW_NAVIGATION_STEP_UUID in (${tcvnsIdStr})`;
    const tcvnattDataQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", tcvnattDataQuery, input);

    for (let tcvnattData of tcvnattDataQueryData) {
        deleteRecords('TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', tcvnattData['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE');
    }
}

const deleteFunctionViewNavAttributeData = async (fcvnsIdStr) => {
    // console.log(fcvnsIdStr,'fcvnsIdStr******');
    if (!fcvnsIdStr || !fcvnsIdStr.trim()) return;
    const fcvnattDataQuery = `SELECT FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE FUNCTION_VIEW_NAVIGATION_STEP_UUID in (${fcvnsIdStr})`;
    const fcvnattDataQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", fcvnattDataQuery, input);

    for (let fcvnattData of fcvnattDataQueryData) {
        deleteRecords('FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', fcvnattData['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE');
    }
}

const deleteCopyViewNavigationData = async (viewNavigationStepStr, isDeleteNavigationData) => {
    if (!viewNavigationStepStr || !viewNavigationStepStr.trim()) return;
    const tcvnQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP WHERE VIEW_NAVIGATION_STEP_UUID in (${viewNavigationStepStr})`;
    const tcvnQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", tcvnQuery, input);

    const fcvnQuery = `SELECT FUNCTION_VIEW_NAVIGATION_STEP_UUID FROM FUNCTION_VIEW_NAVIGATION_STEP WHERE VIEW_NAVIGATION_STEP_UUID in (${viewNavigationStepStr})`;
    const fcvnQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", fcvnQuery, input);
    // console.log(fcvnQueryDat,'fcvnQueryData::::');
    if (isDeleteNavigationData) {
        for (let tcvnData of tcvnQueryData) {
            deleteRecords('TEST_CASE_VIEW_NAVIGATION_STEP_UUID', tcvnData['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'], 'TEST_CASE_VIEW_NAVIGATION_STEP');
        }
        for (let fcvnData of fcvnQueryData) {
            deleteRecords('FUNCTION_VIEW_NAVIGATION_STEP_UUID', fcvnData['FUNCTION_VIEW_NAVIGATION_STEP_UUID'], 'FUNCTION_VIEW_NAVIGATION_STEP');
        }
    }

    const tcvnsIdStr = tcvnQueryData.map(tcvnData => "'" + tcvnData['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] + "'").join(',');
    const fcvnsIdStr = fcvnQueryData.map(fcvnData => "'" + fcvnData['FUNCTION_VIEW_NAVIGATION_STEP_UUID'] + "'").join(',');
    // console.log(fcvnsIdStr,'fcvnsIdStr>>>>>>>>');
    await deleteTestCaseViewNavAttributeData(tcvnsIdStr);
    await deleteFunctionViewNavAttributeData(fcvnsIdStr);
}

// modifying the step definition with actual detail
let getKeywordByStepType = input['VIEW_NAVIGATION_STEP_TYPE'] === 'Pre Condition' ? 'Given ' : input['VIEW_NAVIGATION_STEP_TYPE'] === 'User Input' ? 'When ' : input['VIEW_NAVIGATION_STEP_TYPE'] === 'Expected Result' ? 'Then ' : '';

// the below if block will exist when action is save
if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && input.compositeEntityAction == 'Save') {

    // creating new records in TEST_CASE_VIEW_NAVIGATION_STEP for TEST_CASE_STEP
    const testCaseViewNavQuery = `SELECT TEST_CASE_STEP_UUID FROM TEST_CASE_STEP where VIEW_UUID =:VIEW_UUID AND IS_PURE_NAVIGATION_STEP = 'Yes'`;
    const testCaseViewNavQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseViewNavQuery, input);

    const createdTestCaseViewNav = [];
    testCaseViewNavQueryData.forEach(tcvnData => {
        const newTcvn = {};
        newTcvn['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] = uuid();
        newTcvn['TEST_CASE_STEP_UUID'] = tcvnData['TEST_CASE_STEP_UUID'];
        newTcvn['VIEW_NAVIGATION_STEP_UUID'] = input['VIEW_NAVIGATION_STEP_UUID'];
        newTcvn['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'] = getKeywordByStepType + viewNavigationNameStepDefVerbiageStr;
        newTcvn['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
        newTcvn['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'] = input['VIEW_NAVIGATION_STEP_TYPE'];
        newTcvn['TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID'] = input['VIEW_NAVIGATION_STEP_SEQ_ID'];
        newTcvn['CURRENT_PAGE_CONTEXT'] = input['CURRENT_PAGE_CONTEXT'];
        newTcvn['NEXT_PAGE_CONTEXT'] = input['NEXT_PAGE_CONTEXT'];
        newTcvn['VIEW_UUID'] = input['VIEW_UUID'];
        newTcvn['FUNCTIONAL_AREA_UUID'] = input['APP_LOGGED_IN_FUNTIONAL_AREA_ID'];

        TEST_CASE_VIEW_NAVIGATION_STEP.push(newTcvn);
        createdTestCaseViewNav.push(newTcvn);
    });


    // creating new records in FUNCTION_VIEW_NAVIGATION_STEP for FUNCTION_STEP
    const funcViewNavQuery = `SELECT FUNCTION_STEP_UUID, FUNCTION_UUID FROM FUNCTION_STEP where VIEW_UUID =:VIEW_UUID AND IS_PURE_NAVIGATION_STEP = 'Yes'`;
    const funcViewNavQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", funcViewNavQuery, input);

    const createdFunctionViewNav = [];
    funcViewNavQueryData.forEach(fcvnData => {
        const newFcvn = {};
        newFcvn['FUNCTION_VIEW_NAVIGATION_STEP_UUID'] = uuid();
        newFcvn['FUNCTION_UUID'] = fcvnData['FUNCTION_UUID'];
        newFcvn['FUNCTION_STEP_UUID'] = fcvnData['FUNCTION_STEP_UUID'];
        newFcvn['FUNCTIONAL_AREA_UUID'] = input['APP_LOGGED_IN_FUNTIONAL_AREA_ID'];
        newFcvn['VIEW_UUID'] = input['VIEW_UUID'];
        newFcvn['VIEW_NAVIGATION_STEP_UUID'] = input['VIEW_NAVIGATION_STEP_UUID'];
        newFcvn['FUNCTION_VIEW_NAVIGATION_STEP_NAME'] = getKeywordByStepType + viewNavigationNameStepDefVerbiageStr;
        newFcvn['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
        newFcvn['FUNCTION_VIEW_NAVIGATION_STEP_TYPE'] = input['VIEW_NAVIGATION_STEP_TYPE'];
        newFcvn['FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID'] = input['VIEW_NAVIGATION_STEP_SEQ_ID'];
        newFcvn['CURRENT_PAGE_CONTEXT'] = input['CURRENT_PAGE_CONTEXT'];
        newFcvn['NEXT_PAGE_CONTEXT'] = input['NEXT_PAGE_CONTEXT'];

        FUNCTION_VIEW_NAVIGATION_STEP.push(newFcvn);
        createdFunctionViewNav.push(newFcvn);
    });


    // creating new records in TEST_CASE_VIEW_NAVIGATION_STEP for TEST_CASE_FUNCTION_STEP
    const testCaseFuncViewNavQuery = `SELECT TEST_CASE_STEP_UUID, FUNCTION_STEP_UUID, FUNCTION_UUID FROM TEST_CASE_FUNCTION_STEP where VIEW_UUID =:VIEW_UUID AND IS_PURE_NAVIGATION_STEP = 'Yes'`;
    const testCaseFuncViewNavData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFuncViewNavQuery, input);

    testCaseFuncViewNavData.forEach(tcfvData => {
        const newTcfv = {};
        newTcfv['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] = uuid();
        newTcfv['TEST_CASE_STEP_UUID'] = tcfvData['TEST_CASE_STEP_UUID'];
        newTcfv['FUNCTION_STEP_UUID'] = tcfvData['FUNCTION_STEP_UUID'];
        newTcfv['FUNCTION_UUID'] = tcfvData['FUNCTION_UUID'];
        newTcfv['VIEW_NAVIGATION_STEP_UUID'] = input['VIEW_NAVIGATION_STEP_UUID'];
        newTcfv['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'] = getKeywordByStepType + viewNavigationNameStepDefVerbiageStr;
        newTcfv['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
        newTcfv['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'] = input['VIEW_NAVIGATION_STEP_TYPE'];
        newTcfv['TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID'] = input['VIEW_NAVIGATION_STEP_SEQ_ID'];
        newTcfv['CURRENT_PAGE_CONTEXT'] = input['CURRENT_PAGE_CONTEXT'];
        newTcfv['NEXT_PAGE_CONTEXT'] = input['NEXT_PAGE_CONTEXT'];
        newTcfv['VIEW_UUID'] = input['VIEW_UUID'];
        newTcfv['FUNCTIONAL_AREA_UUID'] = input['APP_LOGGED_IN_FUNTIONAL_AREA_ID'];

        TEST_CASE_VIEW_NAVIGATION_STEP.push(newTcfv);
        createdTestCaseViewNav.push(newTcfv);
    });



    // calling the below function to generate the records for view navigation step attribute value table
    await createViewNavigationStepAttributeValue(stepDefAttributeQueryData, createdTestCaseViewNav, createdFunctionViewNav);
    input['VIEW_NAVIGATION_STEP_NAME'] = getKeywordByStepType + viewNavigationNameStepDefVerbiageStr;

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
            await deleteCopyViewNavigationData(viewNavigationStepStr, true);
        } else if (input['STEP_SELECTION_TYPE'] == 'Do not delete subsequent steps') {
            await changeSequence();
        }
    }
} else if (input.compositeEntityAction == 'Update' && input['IS_STEP_TYPE_DISPLAYED'] == "No") { // the below if block will exist when action is save
    // the below function will delete the existing view navigation step attribute value for the particular view navigation step.
    await deleteViewNavigationStepAttributeData("'" + input.VIEW_NAVIGATION_STEP_UUID + "'");
    // creating the new records in view navigation step attribute value table with new value
    await createViewNavigationStepAttributeValue(stepDefAttributeQueryData);
    input['VIEW_NAVIGATION_STEP_NAME'] = getKeywordByStepType + viewNavigationNameStepDefVerbiageStr;

} else if (input.compositeEntityAction == 'Delete') {
    if (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'Yes' && input['isStepExistsAfterCurrentStep'] == 'Yes') {
        await deleteViewNavigationStepAttributeData("'" + input['VIEW_NAVIGATION_STEP_UUID'] + "'");
        await deleteCopyViewNavigationData("'" + input['VIEW_NAVIGATION_STEP_UUID'] + "'", true);
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
            await deleteCopyViewNavigationData("'" + data['VIEW_NAVIGATION_STEP_UUID'] + "'", true);
        }
    } else if (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No' || input['isStepExistsAfterCurrentStep'] == 'No') {
        // the below function will delete the existing view navigation step attribute value for the particular view navigation step
        await deleteViewNavigationStepAttributeData("'" + input.VIEW_NAVIGATION_STEP_UUID + "'");
        await deleteCopyViewNavigationData("'" + input.VIEW_NAVIGATION_STEP_UUID + "'", true);
    }

    if (input['VIEW_NAVIGATION_STEP_POSITION'] == 'Intermediate Page Navigation Step' || input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No' || input['isStepExistsAfterCurrentStep'] == 'No') {
        await changeSequence();
    }
}


input["AppEngChildEntity:VIEW_NAVIGATION_STEP_CHILD"] = viewNavigationStepList;
input["AppEngChildEntity:VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE"] = viewNavigationStepAttributeValueArray;
input['AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP'] = TEST_CASE_VIEW_NAVIGATION_STEP;
input['AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'] = TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE;
input['AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP'] = FUNCTION_VIEW_NAVIGATION_STEP;
input['AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'] = FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE;