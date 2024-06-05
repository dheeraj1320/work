let currentUIElementName = '';
let currentUserActionName = '';
let currentFunctionName = '';
let currentUIElementGroupName = '';
input[0]['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] = 'No';

async function fetchStepDefinitionTemplateVerbiage(stepDefTemplateVerbiageId) {
    // firing query to get all the step definition for particular stap def name (verbiage)
    const stepDefAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID in(${stepDefTemplateVerbiageId})`;
    let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input);
    return stepDefAttributeQueryData;
}

// firing query to check any test case step exist or not
const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_ID desc`;
let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input[0]);
input[0]['isInitialRecord'] = testCaseStepQueryData && testCaseStepQueryData.length > 0 ? false : true;
input[0]['isSecondRecord'] = testCaseStepQueryData && testCaseStepQueryData.length == 1 ? true : false;

// generating the test case step seq id at the time of record creation
if (!input[0]['TEST_CASE_STEP_UUID'] && !input[0]['SELECTED_TEST_CASE_STEP_SEQ_ID']) {
    input[0]['TEST_CASE_STEP_SEQ_ID'] = testCaseStepQueryData.length + 1;
} else if (input[0]['TEST_CASE_STEP_POSITION'] == 'Intermediate Test Case Step' && input[0]['SELECTED_TEST_CASE_STEP_SEQ_ID']) {
    input[0]['TEST_CASE_STEP_SEQ_ID'] = input[0]['SELECTED_TEST_CASE_STEP_SEQ_ID'] + 1;
}

// setting the default value for step def type when no test case step exist
if (input[0]['isInitialRecord'] && !input[0]['TEST_CASE_STEP_UUID']) {
    input[0]['TEST_CASE_STEP_TYPE'] = 'Pre Condition';
    input[0]['isMoreThanOneAttribute'] = false;
    input[0]['isOnlyOneAttribute'] = true;
    input[0]['TEST_CASE_STEP_POSITION'] = 'First Test Case Step';
} else if (!input[0]['isInitialRecord'] && !input[0]['TEST_CASE_STEP_UUID'] && !input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] && !input[0]['TEST_CASE_STEP_POSITION']) {
    input[0]['TEST_CASE_STEP_TYPE'] = input[0]['TEST_CASE_STEP_TYPE'] ? input[0]['TEST_CASE_STEP_TYPE'] : 'User Input';
    input[0]['TEST_CASE_STEP_POSITION'] = 'Last Test Case Step';
}
if (input[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] && !input[0]['TEST_CASE_STEP_UUID']) {
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
else if (input[0]['TEST_CASE_STEP_UUID']) {
    input[0]['isFunctionNameChanged'] = false;
    input[0]['isUIElementGroupChanged'] = false;
    if (input[0]['TEST_CASE_STEP_SEQ_ID'] == 1) {
        input[0]['TEST_CASE_STEP_POSITION'] = 'First Test Case Step'
        input[0]['SELECTED_TEST_CASE_STEP_SEQ_ID'] = null;
    } else if (input[0]['TEST_CASE_STEP_SEQ_ID'] == testCaseStepQueryData.length) {
        input[0]['TEST_CASE_STEP_POSITION'] = 'Last Test Case Step'
        input[0]['SELECTED_TEST_CASE_STEP_SEQ_ID'] = null;
    } else {
        input[0]['TEST_CASE_STEP_POSITION'] = 'Intermediate Test Case Step'
        input[0]['SELECTED_TEST_CASE_STEP_SEQ_ID'] = input[0]['TEST_CASE_STEP_SEQ_ID'] - 1;
    }
    // firing query to get all the test case step attribute value for particulat test case step
    const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID=:TEST_CASE_STEP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
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
                            //  input[0]['CURRENT_PAGE_CONTEXT'] = !input[0]['CURRENT_PAGE_CONTEXT'] ? attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'] : input[0]['CURRENT_PAGE_CONTEXT'];
                            input[0]['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] = 'Yes';
                            break;

                        case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                            currentUIElementName = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            input[0]['UI_ELEMENT_NAME'] = !input[0]['UI_ELEMENT_NAME'] ? attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'] : input[0]['UI_ELEMENT_NAME'];
                            break;

                        case '7f855066-ad39-4325-8108-30befb2447e6':
                            input[0]['UI_ELEMENT_TYPE'] = !input[0]['UI_ELEMENT_TYPE'] ? attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'] : input[0]['UI_ELEMENT_TYPE'];
                            break;

                        case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                            input[0]['UI_ELEMENT_VALUE'] = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            break;

                        case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                            input[0]['KEY_NAME_IN_KEY_PAD'] = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            break;

                        case '005d158d-428c-4bca-ae2d-1c3f9630b549':
                            input[0]['EVENT_NAME'] = !input[0]['EVENT_NAME'] ? attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'] : input[0]['EVENT_NAME'];
                            break;

                        case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                            input[0]['CONFIRM_UI_ELEMENT_VALUE'] = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            break;

                        case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                            input[0]['UI_ELEMENT_NAME_1'] = !input[0]['UI_ELEMENT_NAME_1'] ? attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'] : input[0]['UI_ELEMENT_NAME_1'];
                            break;

                        case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                            input[0]['UI_ELEMENT_VALUE_1'] = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            break;

                        // user action name
                        case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                            currentUserActionName = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            input[0]['USER_ACTION_NAME'] = !input[0]['USER_ACTION_NAME'] ? attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'] : input[0]['USER_ACTION_NAME'];
                            break;
                        // user action type
                        case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                            input[0]['USER_ACTION_TYPE'] = !input[0]['USER_ACTION_TYPE'] ? attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'] : input[0]['USER_ACTION_TYPE'];
                            break;

                        case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                            currentFunctionName = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            input[0]['FUNCTION_UUID'] = !input[0]['FUNCTION_UUID'] ? attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'] : input[0]['FUNCTION_UUID'];
                            break;

                        case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                            currentUIElementGroupName = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            input[0]['UI_ELEMENT_GROUP_UUID'] = !input[0]['UI_ELEMENT_GROUP_UUID'] ? attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'] : input[0]['UI_ELEMENT_GROUP_UUID'];
                            break;

                        // page number
                        case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                            input[0]['PAGE_NUMBER'] = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            break;

                        case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                            input[0]['DATA_VALUE'] = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            break;

                        case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                            input[0]['DATA_KEY'] = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            break;

                        case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                            input[0]['FILE_NAME'] = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
                            break;

                        case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                            input[0]['DOCUMENT_PARSER_NAME'] = attributeValue['TEST_CASE_STEP_ATTRIBUTE_DATA'];
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