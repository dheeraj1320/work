input[0]['Dummy_UI_ELEMENT_GROUP'] = null;
input[0]['UIFilterType'] = input[0]['UI_ELEMENT_STEP_FILTER_TYPE'] == 'User Input' ? 'Input' : 'Output';
input[0]['UIFilterTypeForVerBage'] = input[0]['UI_ELEMENT_STEP_FILTER_TYPE'] == 'User Input' ? 'Input Step' : 'Expected Result Step';
input[0]['enableConditionalValidation'] = 'Yes';

if (!input[0]['UI_ELEMENTS']) {
    let uiElementQuery = `SELECT UI_ELEMENT_UUID FROM UI_ELEMENT WHERE PAGE_NEW_UUID=:PAGE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND CONCAT(',',UI_ELEMENT_MODE, ',') LIKE CONCAT('%,',:UIFilterType,',%');`;
    let uiElementQueryData = JSON.parse(JSON.stringify(await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input[0])));
    input[0]['UI_ELEMENTS'] = uiElementQueryData.map(uiElement => uiElement.UI_ELEMENT_UUID).join(',');
    input[0]['isExecutedOnce'] = true;
}

if (input[0]['UI_ELEMENTS'] && input[0]['isExecutedOnce']) {
    let splitedUIElement = input[0]['UI_ELEMENTS'].split(',');
    let strUIElement = splitedUIElement.map(item => `'` + item + `'`).join(',');
    let sellectedUIElementQuery = `select UI_ELEMENT_UUID,UI_ELEMENT_ID,UI_ELEMENT_NAME,(select UI_ELEMENT_TYPE_NAME from UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID=UI_ELEMENT_TYPE) as UI_ELEMENT_TYPE,LOCATOR_TYPE,LOCATOR_VALUE,IS_PAGE_IDENTIFIER,EVENT_NAME,PAGE_NEW_UUID,FUNCTIONAL_AREA_UUID,UI_ELEMENT_MODE from UI_ELEMENT WHERE PAGE_NEW_UUID=:PAGE_UUID and UI_ELEMENT_UUID in(${strUIElement}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND CONCAT(',',UI_ELEMENT_MODE, ',') LIKE CONCAT('%,',:UIFilterType,',%');`;
    let selectedUIElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", sellectedUIElementQuery, input[0]);
    let strSelectedUIElementType = selectedUIElementQueryData.map(item => `'` + item['UI_ELEMENT_TYPE'] + `'`).join(',');
    let stepDefTemplateVerbaleQuery = input[0]['UI_ELEMENT_STEP_FILTER_TYPE'] == 'User Input' ? `SELECT STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM STEP_DEFINITION_TEMPLATE_VERBIAGE WHERE STEP_FILTER=:UIFilterTypeForVerBage AND IS_ACTIVE_STEP_DEFINITION_TEMPLATE_VERBIAGE='Yes' and APPLICABLE_UI_ELEMENT_TYPE in(${strSelectedUIElementType}) AND ((CONCAT(',', TENANT_UUID, ',') like CONCAT('%,', :TENANT_UUID, ',%') AND CONCAT(',', FUNCTIONAL_AREA_UUID, ',') like CONCAT('%,', :APP_LOGGED_IN_FUNTIONAL_AREA_ID, ',%')) OR(CONCAT(',', TENANT_UUID, ',') like CONCAT('%,', :TENANT_UUID, ',%') AND COALESCE(FUNCTIONAL_AREA_UUID, '') = '') OR (COALESCE(TENANT_UUID, '') = '' AND COALESCE(FUNCTIONAL_AREA_UUID, '') = ''))` : `SELECT SDTV.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM STEP_DEFINITION_TEMPLATE_VERBIAGE SDTV INNER JOIN STEP_DEFINITION_ATTRIBUTE SDA ON SDTV.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = SDA.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID WHERE SDTV.STEP_FILTER=:UIFilterTypeForVerBage AND SDTV.IS_ACTIVE_STEP_DEFINITION_TEMPLATE_VERBIAGE='Yes' AND SDA.STEP_DEFINITION_ATTRIBUTE_MASTER_UUID="adcf6e25-f890-476c-bdcf-e723c6d7894c" AND ((CONCAT(',', SDTV.TENANT_UUID, ',') like CONCAT('%,', :TENANT_UUID, ',%') AND CONCAT(',', SDTV.FUNCTIONAL_AREA_UUID, ',') like CONCAT('%,', :APP_LOGGED_IN_FUNTIONAL_AREA_ID, ',%')) OR(CONCAT(',', SDTV.TENANT_UUID, ',') like CONCAT('%,', :TENANT_UUID, ',%') AND COALESCE(SDTV.FUNCTIONAL_AREA_UUID, '') = '') OR (COALESCE(SDTV.TENANT_UUID, '') = '' AND COALESCE(SDTV.FUNCTIONAL_AREA_UUID, '') = '')) order by STEP_DEFINITION_ATTRIBUTE_ID asc`;

    const stepDefinationData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefTemplateVerbaleQuery, input[0]);
    if (stepDefinationData && stepDefinationData.length > 0) {
        let index = 0;
        input[0].child['0e4794da-d6c2-4d82-a91b-b0d84de01cbe'] = [];
        if (input[0]['isExecutedOnce']) {
            for (let stepDefinitionUUID of stepDefinationData) {
                input[0].child['0e4794da-d6c2-4d82-a91b-b0d84de01cbe'][index] = stepDefinitionUUID;
                input[0].child['0e4794da-d6c2-4d82-a91b-b0d84de01cbe'][index]['isNew'] = true;
                input[0].child['0e4794da-d6c2-4d82-a91b-b0d84de01cbe'][index]['Dummy_Primary_Key'] = null;
                index++;
            }
            input[0]['isExecutedOnce'] = false;
        }
    }
}