// fetching the Page Navigation step 
const viewNavigationStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by VIEW_NAVIGATION_STEP_SEQ_ID asc`;
let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationStepQuery, input[0]);

// arranging the page uuid from privious Page Navigation step 
if (viewNavigationStepQueryData && viewNavigationStepQueryData.length) {
    let lastRecord = viewNavigationStepQueryData[viewNavigationStepQueryData.length - 1];
    // set page for ui element
    if (input[0]['VIEW_NAVIGATION_STEP_POSITION'] != 'Intermediate Page Navigation Step') {
        if (!input[0]['VIEW_NAVIGATION_STEP_UUID'] && lastRecord['CURRENT_PAGE_CONTEXT'] && lastRecord['NEXT_PAGE_CONTEXT']) {
            input[0]['CURRENT_PAGE_CONTEXT'] = lastRecord['NEXT_PAGE_CONTEXT'];
        } else if (!input[0]['VIEW_NAVIGATION_STEP_UUID'] && lastRecord['CURRENT_PAGE_CONTEXT']) {
            input[0]['CURRENT_PAGE_CONTEXT'] = lastRecord['CURRENT_PAGE_CONTEXT'];
        } else if (!input[0]['VIEW_NAVIGATION_STEP_UUID'] && lastRecord['API_UUID']) {
            input[0]['API_UUID'] = lastRecord['API_UUID'];
        }
    }

    if (!input[0]['VIEW_NAVIGATION_STEP_UUID'] && input[0]['VIEW_NAVIGATION_STEP_POSITION'] == 'Intermediate Page Navigation Step') {
        const viewNavigationStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:VIEW_UUID and VIEW_NAVIGATION_STEP_SEQ_ID=:SELECTED_VIEW_NAVIGATION_STEP_SEQ_ID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let viewNavigationStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", viewNavigationStepQuery, input[0]);
        input[0]['CURRENT_PAGE_CONTEXT'] = viewNavigationStepQueryData['NEXT_PAGE_CONTEXT'] && viewNavigationStepQueryData['CURRENT_PAGE_CONTEXT'] ? viewNavigationStepQueryData['NEXT_PAGE_CONTEXT'] : viewNavigationStepQueryData['CURRENT_PAGE_CONTEXT'];
        // input[0]['API_UUID'] = viewNavigationStepQueryData['API_UUID'];
        if (viewNavigationStepQueryData['API_UUID']) {
            input[0]['API_UUID'] = viewNavigationStepQueryData['API_UUID'];
        }
    }
}

// firing the query to get the step definition attribute for that particular step definition name
const stepDefAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID =:STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID`;
let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input[0]);

input[0]['pageNameCodeDesc'] = "";
input[0]['uiElementNameCodeDesc'] = ""
input[0]['uiElementValCodeDesc'] = "";
input[0]['uiElementTypeCodeDesc'] = "";
input[0]['keyPadCodeDesc'] = "";
input[0]['eventNameCodeDesc'] = "";
input[0]['confirmUIElementValCodeDesc'] = "";
input[0]['uiElementName1CodeDesc'] = ""
input[0]['uiElementVal1CodeDesc'] = "";
input[0]['userActionNameCodeDesc'] = "";
input[0]['userActionTypeCodeDesc'] = "";
input[0]['pageNumberCodeDesc'] = "";
input[0]['dataValueCodeDesc'] = "";
input[0]['dataKeyCodeDesc'] = "";
input[0]['fileNameCodeDesc'] = "";
input[0]['documentParserNameCodeDesc'] = "";
input[0]['apiNameCodeDesc'] = "";
input[0]['apiAttributeNameCodeDesc'] = "";
input[0]['apiAttributeValueCodeDesc'] = "";
input[0]['responseCodeValueCodeDesc'] = "";
input[0]['primaryMode'] = "";
input[0]['secondaryMode'] = "";
input[0]['userActionTypeofUIElement'] = "";
input[0]['uiElementStateCodeDesc'] = "";
input[0]['timeoutCodeDesc'] = "";

if (!input[0]['VIEW_NAVIGATION_STEP_UUID']) {
    input[0]['UI_ELEMENT_NAME'] = "";
    input[0]['UI_ELEMENT_TYPE'] = "";
    input[0]['UI_ELEMENT_NAME_1'] = "";
    input[0]['USER_ACTION_NAME'] = "";
    input[0]['USER_ACTION_TYPE'] = "";
    input[0]['API_ATTRIBUTE_NAME'] = "";
}


if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
    for (let codeDesc of stepDefAttributeQueryData) {
        // the below switch case is responsible to display the field based on step def name
        switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
            case '57b76ab3-8112-4343-af0f-49643c808bf7':
                input[0]['pageNameCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                input[0]['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] = 'Yes';
                break;
            case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                input[0]['uiElementNameCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;
            case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                input[0]['uiElementValCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;
            case '7f855066-ad39-4325-8108-30befb2447e6':
                input[0]['uiElementTypeCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;
            case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                input[0]['keyPadCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;
            case '005d158d-428c-4bca-ae2d-1c3f9630b549':
                input[0]['eventNameCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;
            case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                input[0]['confirmUIElementValCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;
            case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                input[0]['uiElementName1CodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;

            case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                input[0]['uiElementVal1CodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;

            case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                input[0]['userActionNameCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;

            case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                input[0]['userActionTypeCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;

            // page number
            case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                input[0]['pageNumberCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;

            case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                input[0]['dataValueCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;

            case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                input[0]['dataKeyCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;

            case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                input[0]['fileNameCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;

            case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                input[0]['documentParserNameCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;

            case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
                input[0]['apiNameCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['CURRENT_PAGE_CONTEXT'] = null;
                input[0]['NEXT_PAGE_CONTEXT'] = null;
                input[0]['IS_API_EXIST_FOR_STEP_DEFINITION'] = 'Yes';
                break;

            case '46136260-2e33-11ef-b3ef-e52f192c3af0':
                input[0]['apiAttributeNameCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['CURRENT_PAGE_CONTEXT'] = null;
                input[0]['NEXT_PAGE_CONTEXT'] = null;
                break;

            case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                input[0]['apiAttributeValueCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['CURRENT_PAGE_CONTEXT'] = null;
                input[0]['NEXT_PAGE_CONTEXT'] = null;
                break;

            case '833eb770-2e33-11ef-9033-4bb93e602d01':
                input[0]['responseCodeValueCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['CURRENT_PAGE_CONTEXT'] = null;
                input[0]['NEXT_PAGE_CONTEXT'] = null;
                break;


            case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                input[0]['uiElementStateCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;

            case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
                input[0]['timeoutCodeDesc'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'];
                input[0]['API_UUID'] = null;
                break;
            default: null;
        }
    }

    // firing the query to get the step definition attribute verbiage text for that particular step definition name
    const stepDefAttributeVerbiageQuery = `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID =:STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID`;
    let stepDefAttributeVerbiageQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", stepDefAttributeVerbiageQuery, input[0]);

    if (stepDefAttributeVerbiageQueryData && Object.keys(stepDefAttributeVerbiageQueryData).length && ['Action Step'].includes(stepDefAttributeVerbiageQueryData['STEP_FILTER'])) {
        input[0]['primaryMode'] = 'User Action';
        input[0]['secondaryMode'] = 'Input';
        input[0]['userActionTypeofUIElement'] = 'Yes';
    } else {
        input[0]['primaryMode'] = 'Input';
        input[0]['secondaryMode'] = 'Output';
        input[0]['userActionTypeofUIElement'] = 'No';
    }


    if (stepDefAttributeVerbiageQueryData && Object.keys(stepDefAttributeVerbiageQueryData).length && (stepDefAttributeVerbiageQueryData['IS_PAGE_CONTEXT_SETTER'] == 'Yes' || stepDefAttributeVerbiageQueryData['IS_API_CONTEXT_SETTER'] == 'Yes')) {
        let isOtherVisiblePage = stepDefAttributeVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'].includes('other visible <Page Name>');
        input[0]['isMoreThanOneAttribute'] = stepDefAttributeQueryData.length > 1 && !isOtherVisiblePage ? true : false;
        input[0]['isOnlyOneAttribute'] = stepDefAttributeQueryData.length == 1 ? true : false;

        if (input[0]['isMoreThanOneAttribute'] && !input[0]['VIEW_NAVIGATION_STEP_UUID']) {
            input[0]['NEXT_PAGE_CONTEXT'] = null;
        } else if (isOtherVisiblePage && !input[0]['VIEW_NAVIGATION_STEP_UUID']) {
            input[0]['NEXT_PAGE_CONTEXT'] = null;
            input[0]['CURRENT_PAGE_CONTEXT'] = null;
        } else {
            input[0]['NEXT_PAGE_CONTEXT'] = input[0]['NEXT_PAGE_CONTEXT'] ? input[0]['NEXT_PAGE_CONTEXT'] : input[0]['isMoreThanOneAttribute'] ? input[0]['CURRENT_PAGE_CONTEXT'] : null;
        }
    } else {
        input[0]['isOnlyOneAttribute'] = false;
        input[0]['NEXT_PAGE_CONTEXT'] = null;
    }
}