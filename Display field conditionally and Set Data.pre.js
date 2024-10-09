let currentUIElementName = '';
let currentUserActionName = '';
let currentFunctionName = '';
let currentUIElementGroupName = '';
input[0]['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] = 'No';
input[0]['IS_API_EXIST_FOR_STEP_DEFINITION'] = 'No';
input[0]['isOtherVisiblePage'] = false;

async function fetchStepDefinitionTemplateVerbiage() {
    const stepDefAttributeQuery = `SELECT STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME,IS_PAGE_CONTEXT_SETTER,IS_API_CONTEXT_SETTER FROM STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv,STEP_DEFINITION_ATTRIBUTE sda where sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID=sda.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID=:STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID`;
    let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input[0]);
    return stepDefAttributeQueryData;
}

let stepDefAttributeVerbiageQueryData = await fetchStepDefinitionTemplateVerbiage();
if (stepDefAttributeVerbiageQueryData && stepDefAttributeVerbiageQueryData.length) {
    input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = stepDefAttributeVerbiageQueryData[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'];
    if (stepDefAttributeVerbiageQueryData[0]['IS_PAGE_CONTEXT_SETTER'] == 'Yes' || stepDefAttributeVerbiageQueryData[0]['IS_API_CONTEXT_SETTER'] == 'Yes') {
        input[0]['isOtherVisiblePage'] = stepDefAttributeVerbiageQueryData[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].includes('other visible <Page Name>');
        input[0]['isMoreThanOneAttribute'] = stepDefAttributeVerbiageQueryData.length > 1 && !input[0]['isOtherVisiblePage'] ? true : false;
        input[0]['isOnlyOneAttribute'] = stepDefAttributeVerbiageQueryData.length == 1 ? true : false;
    }
}

// firing query to check any Page Navigation step exist or not
const testCaseStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by VIEW_NAVIGATION_STEP_ID desc`;
let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input[0]);
input[0]['isInitialRecord'] = viewNavigationStepQueryData && viewNavigationStepQueryData.length > 0 ? false : true;
input[0]['isSecondRecord'] = viewNavigationStepQueryData && viewNavigationStepQueryData.length == 1 ? true : false;

// generating the Page Navigation step seq id at the time of record creation
if (!input[0]['VIEW_NAVIGATION_STEP_UUID'] && !input[0]['SELECTED_VIEW_NAVIGATION_STEP_SEQ_ID']) {
    input[0]['VIEW_NAVIGATION_STEP_SEQ_ID'] = viewNavigationStepQueryData.length + 1;
} else if (input[0]['VIEW_NAVIGATION_STEP_POSITION'] == 'Intermediate Page Navigation Step' && input[0]['SELECTED_VIEW_NAVIGATION_STEP_SEQ_ID']) {
    input[0]['VIEW_NAVIGATION_STEP_SEQ_ID'] = input[0]['SELECTED_VIEW_NAVIGATION_STEP_SEQ_ID'] + 1;
}

// setting the default value for step def type when no Page Navigation step exist
if (input[0]['isInitialRecord'] && !input[0]['VIEW_NAVIGATION_STEP_UUID']) {
    input[0]['VIEW_NAVIGATION_STEP_TYPE'] = 'Pre Condition';
    input[0]['isMoreThanOneAttribute'] = false;
    input[0]['isOnlyOneAttribute'] = true;
    input[0]['VIEW_NAVIGATION_STEP_POSITION'] = 'First Page Navigation Step';
} else if (!input[0]['isInitialRecord'] && !input[0]['VIEW_NAVIGATION_STEP_UUID'] && !input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] && !input[0]['VIEW_NAVIGATION_STEP_POSITION']) {
    input[0]['VIEW_NAVIGATION_STEP_TYPE'] = input[0]['VIEW_NAVIGATION_STEP_TYPE'] ? input[0]['VIEW_NAVIGATION_STEP_TYPE'] : 'User Input';
    input[0]['VIEW_NAVIGATION_STEP_POSITION'] = 'Last Page Navigation Step';
}
if (input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] && !input[0]['VIEW_NAVIGATION_STEP_UUID']) {
    const stepDefAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = ${"'" + input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] + "'"}`;
    let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input[0]);
    for (let codeDesc of stepDefAttributeQueryData) {
        if (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '57b76ab3-8112-4343-af0f-49643c808bf7') {
            input[0]['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] = 'Yes';
            break;
        }
    }
}
// this block is responsible to show data in the field at the time of view/edit
else if (input[0]['VIEW_NAVIGATION_STEP_UUID']) {
    input[0]['isFunctionNameChanged'] = false;
    input[0]['isUIElementGroupChanged'] = false;
    if (input[0]['VIEW_NAVIGATION_STEP_SEQ_ID'] == 1) {
        input[0]['VIEW_NAVIGATION_STEP_POSITION'] = 'First Page Navigation Step'
        input[0]['SELECTED_VIEW_NAVIGATION_STEP_SEQ_ID'] = null;
    } else if (input[0]['VIEW_NAVIGATION_STEP_SEQ_ID'] == viewNavigationStepQueryData.length) {
        input[0]['VIEW_NAVIGATION_STEP_POSITION'] = 'Last Page Navigation Step'
        input[0]['SELECTED_VIEW_NAVIGATION_STEP_SEQ_ID'] = null;
    } else {
        input[0]['VIEW_NAVIGATION_STEP_POSITION'] = 'Intermediate Page Navigation Step'
        input[0]['SELECTED_VIEW_NAVIGATION_STEP_SEQ_ID'] = input[0]['VIEW_NAVIGATION_STEP_SEQ_ID'] - 1;
    }
    // firing query to get all the Page Navigation step attribute value for particulat Page Navigation step
    const testCaseStepAttributeValueQuery = `SELECT * FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where VIEW_NAVIGATION_STEP_UUID=:VIEW_NAVIGATION_STEP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input[0]);

    if (testCaseStepAttributeValueQueryData && testCaseStepAttributeValueQueryData.length) {

        for (let attributeValue of testCaseStepAttributeValueQueryData) {
            // firing the query to get the code description uuid from the step def attribute table
            const stepDefAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_ATTRIBUTE_UUID = ${"'" + attributeValue['STEP_DEFINITION_ATTRIBUTE_UUID'] + "'"}  `;
            let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input[0]);

            if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
                for (let codeDesc of stepDefAttributeQueryData) {
                    // here is the below switch case based on code description setting the value in the field 
                    switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
                        case '57b76ab3-8112-4343-af0f-49643c808bf7':
                            //  input[0]['CURRENT_PAGE_CONTEXT'] = !input[0]['CURRENT_PAGE_CONTEXT'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['CURRENT_PAGE_CONTEXT'];
                            input[0]['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] = 'Yes';
                            break;

                        case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                            currentUIElementName = attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'];
                            input[0]['UI_ELEMENT_NAME'] = !input[0]['UI_ELEMENT_NAME'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['UI_ELEMENT_NAME'];
                            break;

                        case '7f855066-ad39-4325-8108-30befb2447e6':
                            input[0]['UI_ELEMENT_TYPE'] = !input[0]['UI_ELEMENT_TYPE'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['UI_ELEMENT_TYPE'];
                            break;

                        case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                            input[0]['UI_ELEMENT_VALUE'] = !input[0]['UI_ELEMENT_VALUE'] && !input[0]['uiElementValCodeDesc'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['UI_ELEMENT_VALUE'];
                            break;

                        case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                            input[0]['KEY_NAME_IN_KEY_PAD'] = !input[0]['KEY_NAME_IN_KEY_PAD'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['KEY_NAME_IN_KEY_PAD'];
                            break;

                        case '005d158d-428c-4bca-ae2d-1c3f9630b549':
                            input[0]['EVENT_NAME'] = !input[0]['EVENT_NAME'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['EVENT_NAME'];
                            break;

                        case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                            input[0]['CONFIRM_UI_ELEMENT_VALUE'] = !input[0]['CONFIRM_UI_ELEMENT_VALUE'] && !input[0]['confirmUIElementValCodeDesc'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['CONFIRM_UI_ELEMENT_VALUE'];
                            break;

                        case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                            input[0]['UI_ELEMENT_NAME_1'] = !input[0]['UI_ELEMENT_NAME_1'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['UI_ELEMENT_NAME_1'];
                            break;

                        case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                            input[0]['UI_ELEMENT_VALUE_1'] = !input[0]['UI_ELEMENT_VALUE_1'] && !input[0]['uiElementVal1CodeDesc'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['UI_ELEMENT_VALUE_1'];
                            break;

                        // user action name
                        case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                            currentUserActionName = attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'];
                            input[0]['USER_ACTION_NAME'] = !input[0]['USER_ACTION_NAME'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['USER_ACTION_NAME'];
                            break;
                        // user action type
                        case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                            input[0]['USER_ACTION_TYPE'] = !input[0]['USER_ACTION_TYPE'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['USER_ACTION_TYPE'];
                            break;

                        case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                            currentFunctionName = attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'];
                            input[0]['FUNCTION_UUID'] = !input[0]['FUNCTION_UUID'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['FUNCTION_UUID'];
                            break;

                        case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                            currentUIElementGroupName = attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'];
                            input[0]['UI_ELEMENT_GROUP_UUID'] = !input[0]['UI_ELEMENT_GROUP_UUID'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['UI_ELEMENT_GROUP_UUID'];
                            break;

                        // page number
                        case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                            input[0]['PAGE_NUMBER'] = !input[0]['PAGE_NUMBER'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['PAGE_NUMBER'];
                            break;

                        case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                            input[0]['DATA_VALUE'] = !input[0]['DATA_VALUE'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['DATA_VALUE'];
                            break;

                        case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                            input[0]['DATA_KEY'] = !input[0]['DATA_KEY'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['DATA_KEY'];
                            break;

                        case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                            input[0]['FILE_NAME'] = !input[0]['FILE_NAME'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['FILE_NAME'];
                            break;

                        case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                            input[0]['DOCUMENT_PARSER_NAME'] = !input[0]['DOCUMENT_PARSER_NAME'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['DOCUMENT_PARSER_NAME'];
                            break;

                        case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
                            input[0]['IS_API_EXIST_FOR_STEP_DEFINITION'] = 'Yes';
                            // input[0]['API_UUID'] = !input[0]['API_UUID'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['API_UUID'];
                            break;

                        case '46136260-2e33-11ef-b3ef-e52f192c3af0':
                            input[0]['API_ATTRIBUTE_NAME'] = !input[0]['API_ATTRIBUTE_NAME'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['API_ATTRIBUTE_NAME'];
                            break;

                        case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                            input[0]['API_ATTRIBUTE_VALUE'] = !input[0]['API_ATTRIBUTE_VALUE'] && !input[0]['apiAttributeValueCodeDesc'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['API_ATTRIBUTE_VALUE'];
                            break;

                        case '833eb770-2e33-11ef-9033-4bb93e602d01':
                            input[0]['RESPONSE_CODE_VALUE'] = !input[0]['RESPONSE_CODE_VALUE'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['RESPONSE_CODE_VALUE'];
                            break;

                        case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                            input[0]['UI_ELEMENT_STATE'] = !input[0]['UI_ELEMENT_STATE'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['UI_ELEMENT_STATE'];
                            break;

                        case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
                            input[0]['TIMEOUT'] = !input[0]['TIMEOUT'] && !input[0]['timeoutCodeDesc'] ? attributeValue['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] : input[0]['TIMEOUT'];
                            break;

                        default: null
                    }
                }
                if (input[0]['UI_ELEMENT_NAME'] && input[0]['UI_ELEMENT_TYPE']) {
                    if (currentUIElementName && input[0]['UI_ELEMENT_NAME'] && currentUIElementName != input[0]['UI_ELEMENT_NAME']) {
                        input[0]['UI_ELEMENT_TYPE'] = "";
                    }
                } else if (input[0]['USER_ACTION_NAME'] && input[0]['USER_ACTION_TYPE']) {
                    if (currentUserActionName && input[0]['USER_ACTION_NAME'] && currentUserActionName != input[0]['USER_ACTION_NAME']) {
                        input[0]['USER_ACTION_TYPE'] = "";
                    }
                } else if (input[0]['FUNCTION_UUID']) {
                    if (currentFunctionName && input[0]['FUNCTION_UUID'] && currentFunctionName != input[0]['FUNCTION_UUID']) {
                        input[0]['isFunctionNameChanged'] = true;
                    }
                } else if (input[0]['UI_ELEMENT_GROUP_UUID']) {
                    if (currentUIElementGroupName && input[0]['UI_ELEMENT_GROUP_UUID'] && currentUIElementGroupName != input[0]['UI_ELEMENT_GROUP_UUID']) {
                        input[0]['isUIElementGroupChanged'] = true;
                    }
                }
            }
        }
    }
}


if ((input[0]['uiElementNameCodeDesc'] == 'adcf6e25-f890-476c-bdcf-e723c6d7894c' || input[0]['userActionNameCodeDesc'] == '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43') || (input[0]['VIEW_NAVIGATION_STEP_UUID'] && (input[0]['UI_ELEMENT_NAME'] || input[0]['USER_ACTION_NAME']))) {
    const uiElementQuery = `SELECT UI_ELEMENT_NAME,EVENT_NAME,UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT ue,UI_ELEMENT_TYPE_MASTER uetm WHERE UI_ELEMENT_TYPE_UUID=UI_ELEMENT_TYPE AND (UI_ELEMENT_UUID=:UI_ELEMENT_NAME OR UI_ELEMENT_UUID=:USER_ACTION_NAME) AND ue.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input[0]);

    if (input[0]['UI_ELEMENT_NAME']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Name>', function () {
            return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
        });
    }

    if (input[0]['USER_ACTION_NAME']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<User Action Name>', function () {
            return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
        });
    }

    if (input[0]['uiElementTypeCodeDesc'] == '7f855066-ad39-4325-8108-30befb2447e6' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
        if (uiElementQueryData['UI_ELEMENT_TYPE_NAME']) {
            input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Type>', function () {
                return "'" + uiElementQueryData['UI_ELEMENT_TYPE_NAME'] + "'"
            });
        }
    }

    if (input[0]['userActionTypeCodeDesc'] == '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
        if (uiElementQueryData['UI_ELEMENT_TYPE_NAME']) {
            input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<User Action Type>', function () {
                return "'" + uiElementQueryData['UI_ELEMENT_TYPE_NAME'] + "'"
            });
        }
    }

    if (input[0]['eventNameCodeDesc'] == '005d158d-428c-4bca-ae2d-1c3f9630b549' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
        if (uiElementQueryData['EVENT_NAME']) {
            input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Event Type>', function () {
                return "'" + uiElementQueryData['EVENT_NAME'] + "'"
            });
        }
    }

    if (input[0]['uiElementValCodeDesc'] == '74da67d2-41c9-4cf7-9eea-715243e5fcdc' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Value>', input[0]['UI_ELEMENT_VALUE'] ? function () {
            return "'" + input[0]['UI_ELEMENT_VALUE'] + "'"
        } : "' '");
    }

    if (input[0]['uiElementName1CodeDesc'] == '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
        if (input[0]['UI_ELEMENT_NAME_1']) {
            const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME_1 AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input[0]);
            input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Name 1>', function () {
                return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
            });
        }
    }

    if (input[0]['uiElementVal1CodeDesc'] == '3f50ff70-f3e4-11ee-9a12-6fc3e771212a' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Value 1>', input[0]['UI_ELEMENT_VALUE_1'] ? function () {
            return "'" + input[0]['UI_ELEMENT_VALUE_1'] + "'"
        } : "' '");
    }

    if (input[0]['timeoutCodeDesc'] == '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
        if (input[0]['TIMEOUT']) {
            input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Timeout>', input[0]['TIMEOUT'] ? function () {
                return "'" + input[0]['TIMEOUT'] + "'"
            } : "' '");
        }
    }
}

if (input[0]['keyPadCodeDesc'] == '235dfa3a-a897-4076-b9bc-ed813ec7c39f' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    if (input[0]['KEY_NAME_IN_KEY_PAD']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Key Name in Keypad>', function () {
            return "'" + input[0]['KEY_NAME_IN_KEY_PAD'] + "'"
        });
    }
}

if (input[0]['confirmUIElementValCodeDesc'] == 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Confirm UI Element Value>', input[0]['CONFIRM_UI_ELEMENT_VALUE'] ? function () {
        return "'" + input[0]['CONFIRM_UI_ELEMENT_VALUE'] + "'"
    } : "' '");
}

if (input[0]['functionNameCodeDesc'] == '6c698ae8-6305-4bb6-8c23-3a938e7234bd' || input[0]['VIEW_NAVIGATION_STEP_UUID']) {
    if (input[0]['FUNCTION_UUID']) {
        const functionNameQuery = `SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID=:FUNCTION_UUID`;
        let functionNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", functionNameQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Function Name>', function () {
            return "'" + functionNameQueryData['FUNCTION_NAME'] + "'"
        });
    }
}

if (input[0]['uiElementGroupCodeDesc'] == '5c3edc60-f290-11ee-a7a7-c7f3437be2cf' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    if (input[0]['UI_ELEMENT_GROUP_UUID']) {
        let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP  WHERE UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let uiElementGroupStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element Group Name>', function () {
            return "'" + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + "'"
        });
    }
}

if (input[0]['pageNumberCodeDesc'] == '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    if (input[0]['PAGE_NUMBER']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Page Number>', input[0]['PAGE_NUMBER'] ? function () {
            return "'" + input[0]['PAGE_NUMBER'] + "'"
        } : "' '");
    }
}

if (input[0]['dataValueCodeDesc'] == '3aff7b0e-472c-4393-b6b2-5a61b07cfbff' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    if (input[0]['DATA_VALUE']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Data Value>', input[0]['DATA_VALUE'] ? function () {
            return "'" + input[0]['DATA_VALUE'] + "'"
        } : "' '");
    }
}

if (input[0]['dataKeyCodeDesc'] == 'bca9a7f7-1948-407c-9953-2d01356bbd15' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    if (input[0]['DATA_KEY']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Data Key>', input[0]['DATA_KEY'] ? function () {
            return "'" + input[0]['DATA_KEY'] + "'"
        } : "' '");
    }
}

if (input[0]['fileNameCodeDesc'] == 'ceb66327-216f-42fd-845b-9f4543c62baa' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    if (input[0]['FILE_NAME']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<File Name>', input[0]['FILE_NAME'] ? function () {
            return "'" + input[0]['FILE_NAME'] + "'"
        } : "' '");
    }
}
if (input[0]['documentParserNameCodeDesc'] == 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    if (input[0]['DOCUMENT_PARSER_NAME']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Document Parser Name>', input[0]['DOCUMENT_PARSER_NAME'] ? function () {
            return "'" + input[0]['DOCUMENT_PARSER_NAME'] + "'"
        } : "' '");
    }
}
if (input[0]['apiNameCodeDesc'] == '36880b70-2e33-11ef-b3ef-e52f192c3af0' || (input[0]['VIEW_NAVIGATION_STEP_UUID']) || (stepDefAttributeVerbiageQueryData && stepDefAttributeVerbiageQueryData.length && stepDefAttributeVerbiageQueryData[0]['IS_API_CONTEXT_SETTER'] == 'Yes')) {
    if (input[0]['API_UUID']) {
        const apiQuery = `SELECT API_NAME FROM API_NEW WHERE API_UUID=:API_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let apiQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", apiQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<API Name>', function () {
            return "'" + apiQueryData['API_NAME'] + "'"
        });
    }
}
if (input[0]['apiAttributeNameCodeDesc'] == '46136260-2e33-11ef-b3ef-e52f192c3af0' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    if (input[0]['API_ATTRIBUTE_NAME']) {
        const apiAttributeQuery = `SELECT ATTRIBUTE_NAME FROM API_ATTRIBUTE WHERE API_ATTRIBUTE_UUID=:API_ATTRIBUTE_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let apiAttributeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", apiAttributeQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<API Attribute Name>', function () {
            return "'" + apiAttributeQueryData['ATTRIBUTE_NAME'] + "'"
        });
    }
}
if (input[0]['apiAttributeValueCodeDesc'] == '7182ebf0-2e33-11ef-9033-4bb93e602d01' || input[0]['VIEW_NAVIGATION_STEP_UUID']) {
    input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<API Attribute Value>', input[0]['API_ATTRIBUTE_VALUE'] ? function () {
        return "'" + input[0]['API_ATTRIBUTE_VALUE'] + "'"
    } : "' '");
}
if (input[0]['responseCodeValueCodeDesc'] == '833eb770-2e33-11ef-9033-4bb93e602d01' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    if (input[0]['RESPONSE_CODE_VALUE']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Response Status Code>', input[0]['RESPONSE_CODE_VALUE'] ? function () {
            return "'" + input[0]['RESPONSE_CODE_VALUE'] + "'"
        } : "' '");
    }
}

if (input[0]['uiElementStateCodeDesc'] == 'ccd0b030-613e-11ef-81c7-b59b0b9089cd' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    if (input[0]['UI_ELEMENT_STATE']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element State>', input[0]['UI_ELEMENT_STATE'] ? function () {
            return "'" + input[0]['UI_ELEMENT_STATE'] + "'"
        } : "' '");
    }
}

if (input[0]['uiElementStateCodeDesc'] == 'ccd0b030-613e-11ef-81c7-b59b0b9089cd' || (input[0]['VIEW_NAVIGATION_STEP_UUID'])) {
    if (input[0]['UI_ELEMENT_STATE']) {
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<UI Element State>', input[0]['UI_ELEMENT_STATE'] ? function () {
            return "'" + input[0]['UI_ELEMENT_STATE'] + "'"
        } : "' '");
    }
}

if (input[0]['pageNameCodeDesc'] == '57b76ab3-8112-4343-af0f-49643c808bf7' || input[0]['VIEW_NAVIGATION_STEP_UUID'] || (stepDefAttributeVerbiageQueryData && stepDefAttributeVerbiageQueryData.length && stepDefAttributeVerbiageQueryData[0]['IS_PAGE_CONTEXT_SETTER'] == 'Yes' && (input[0]['pageNameChanged'] == 'Yes' || input[0]['isOnlyOneAttribute']))) {
    // let currentPage = input[0]['isMoreThanOneAttribute'] && input[0]['NEXT_PAGE_CONTEXT'] ? input[0]['NEXT_PAGE_CONTEXT'] : input[0]['CURRENT_PAGE_CONTEXT'];

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
}

if (input[0]['pageName1CodeDesc'] == 'c53a65a0-613e-11ef-81c7-b59b0b9089cd' || (input[0]['VIEW_NAVIGATION_STEP_UUID']) || (stepDefAttributeVerbiageQueryData && stepDefAttributeVerbiageQueryData.length && stepDefAttributeVerbiageQueryData[0]['IS_PAGE_CONTEXT_SETTER'] == 'Yes' && input[0]['pageNameChanged'] == 'Yes')) {
    let currentPage = input[0]['NEXT_PAGE_CONTEXT'];
    if (currentPage) {
        const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID=${"'" + currentPage + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", pageNewQuery, input[0]);
        input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] = input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].replaceAll('<Page Name 1>', currentPage ? function () {
            return "'" + pageNewQueryData['PAGE_NAME'] + "'"
        } : '<Page Name 1>');
    }
}

if (!input[0]['STEP_FILTER']) {
    input[0]['STEP_DEFINITION_FILTER'] = '%';
} else {
    input[0]['STEP_DEFINITION_FILTER'] = '#do-not-match';
}
