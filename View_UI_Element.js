let viewUIElementList = [];
let viewUIElementApplicableStep = [];

function deleteRecord(primarykey, primarykeyvalue, tablename) {
    let deleteTableData = {};
    deleteTableData[primarykey] = primarykeyvalue;
    deleteTableData["compositeEntityAction"] = "Delete";
    deleteTableData["FUNCTIONAL_AREA_UUID"] = input.APP_LOGGED_IN_FUNTIONAL_AREA_ID;
    if (tablename == 'VIEW_UI_ELEMENT') {
        viewUIElementList.push(deleteTableData);
    } else if (tablename == 'VIEW_UI_ELEMENT_APPLICABLE_STEP') {
        viewUIElementApplicableStep.push(deleteTableData);
    }
}

function isValidUUID(uuid) {
    let uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(uuid);
}

function appendCommas(list) {
    if (list && list.length) {
        return [...new Set(list.map(item => item).filter(isValidUUID))].map(uuid => `'${uuid}'`).join(', ');
    } else {
        return '';
    }
}

function getViewUIElementIds(list, uiElementIds) {
    let result = list.filter((item) => item['UI_ELEMENT_UUID'] == uiElementIds);
    if (result && result.length) {
        return result[0]['VIEW_UI_ELEMENT_UUID'];
    } else {
        return '';
    }
}

if (input.compositeEntityAction == 'Save' && input.VIEW_UI_ELEMENT_NAME) {
    let uiElementUuids = input.VIEW_UI_ELEMENT_NAME.split(',');
    for (let id of uiElementUuids) {
        let viewUIElementObject = {};
        let viewUIElementUUID = uuid();
        viewUIElementObject['VIEW_UUID'] = input.VIEW_UUID;
        viewUIElementObject['PAGE_UUID'] = input.PAGE_UUID;
        viewUIElementObject['UI_ELEMENT_UUID'] = id;
        viewUIElementObject['VIEW_UI_ELEMENT_UUID'] = viewUIElementUUID;
        viewUIElementList.push(viewUIElementObject);
    }

    let stepDefinitionBasedOnMode = [{
        primaryMode: 'Input',
        secondaryMode: 'User Action',
        isLike: false,
        stepFilter: 'Input Step'
    }, {
        primaryMode: 'User Action',
        secondaryMode: 'Input',
        isLike: true,
        stepFilter: 'Input and Action Step'
    }, {
        primaryMode: 'User Action',
        secondaryMode: 'Input',
        isLike: false,
        stepFilter: 'Action Step'
    }, {
        primaryMode: 'Output',
        secondaryMode: 'Output',
        isLike: true,
        stepFilter: 'Expected Result Step'
    }];

    const RESTRICTED_STEP_DEFINITIONS = [ // scope step definitions
      '17432d20-f8e3-479e-9d4a-05ca3aebae28',
      '3312c68f-bf0d-4389-9081-34bd2ba26559',
      '3cd33ec9-9546-45f5-bf24-3188c87147fa',
      '4aa0b8fb-ecc8-4bab-a136-9af0b90e31d0',
      '5f0f57d3-df33-49cf-b96c-6bd47d173d61',
      '642c2197-0447-458c-945b-698d93524780',
      'c6cb9afc-bbdd-42e1-8f76-312f88f3b77a',
      'ea4aba04-3ba2-42d5-9a46-f6e4459fb825',
      'effee043-6bdc-4f26-85ed-f2cf1bdecf29',
      'f13dafc8-4a84-4065-b55b-eb6de41b2fa2',
    ];

    const restrictedStepDefinitionsString = `'${RESTRICTED_STEP_DEFINITIONS.join("','")}'`;

    let uiElementIds = appendCommas(input['VIEW_UI_ELEMENT_NAME'] ? input['VIEW_UI_ELEMENT_NAME'].split(',') : []);

    // for (let data of stepDefinitionBasedOnMode) {
    //     let uiElementQuery = `SELECT ue.UI_ELEMENT_UUID, UI_ELEMENT_ID, UI_ELEMENT_NAME, UI_ELEMENT_TYPE_NAME, UI_ELEMENT_TYPE_ID, UI_ELEMENT_TYPE, LOCATOR_TYPE, LOCATOR_VALUE, IS_PAGE_IDENTIFIER, EVENT_NAME, PAGE_NEW_UUID, ue.FUNCTIONAL_AREA_UUID, UI_ELEMENT_MODE FROM UI_ELEMENT ue, UI_ELEMENT_TYPE_MASTER uetm WHERE ue.UI_ELEMENT_TYPE = uetm.UI_ELEMENT_TYPE_UUID AND ue.UI_ELEMENT_UUID in (${uiElementIds ? uiElementIds : `' '`}) AND ue.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND CONCAT(',', UI_ELEMENT_MODE, ',') LIKE CONCAT( '%,', ${`'` + data['primaryMode'] + `'`}, ',%' ) AND CONCAT(',', UI_ELEMENT_MODE, ',') ${data['isLike'] ? ' LIKE ' : ' NOT LIKE '} CONCAT( '%,', ${`'` + data['secondaryMode'] + `'`}, ',%' ) order by UI_ELEMENT_ID asc`;
    //     let stepDefinitionFilter = `'` + data['stepFilter'] + `'`;
    //     let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementQuery, input);
    //     for (let uiElement of uiElementQueryData) {
    //         let uIElementType = `'` + uiElement['UI_ELEMENT_TYPE_NAME'] + `'`;
    //         let stepDefTemplateVerbaleQuery = ['Input', 'User Action'].includes(data['primaryMode']) && ['Input Step', 'Input and Action Step'].includes(data['stepFilter']) ? `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE WHERE STEP_FILTER in (${stepDefinitionFilter}) AND IS_ACTIVE_STEP_DEFINITION_TEMPLATE_VERBIAGE = 'Yes' and APPLICABLE_UI_ELEMENT_TYPE in (${uIElementType}) AND ((CONCAT(',', TENANT_UUID, ',') like CONCAT('%,', :TENANT_UUID, ',%') AND CONCAT(',', FUNCTIONAL_AREA_UUID, ',') like CONCAT('%,', :APP_LOGGED_IN_FUNTIONAL_AREA_ID, ',%')) OR(CONCAT(',', TENANT_UUID, ',') like CONCAT('%,', :TENANT_UUID, ',%') AND COALESCE(FUNCTIONAL_AREA_UUID, '') = '') OR (COALESCE(TENANT_UUID, '') = '' AND COALESCE(FUNCTIONAL_AREA_UUID, '') = '')) AND STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID NOT IN (${restrictedStepDefinitionsString})` : `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE WHERE STEP_FILTER in(${stepDefinitionFilter}) AND IS_ACTIVE_STEP_DEFINITION_TEMPLATE_VERBIAGE = 'Yes' AND ((CONCAT(',', TENANT_UUID, ',') like CONCAT('%,', :TENANT_UUID, ',%') AND CONCAT(',', FUNCTIONAL_AREA_UUID, ',') like CONCAT('%,', :APP_LOGGED_IN_FUNTIONAL_AREA_ID, ',%')) OR(CONCAT(',', TENANT_UUID, ',') like CONCAT('%,', :TENANT_UUID, ',%') AND COALESCE(FUNCTIONAL_AREA_UUID, '') = '') OR (COALESCE(TENANT_UUID, '') = '' AND COALESCE(FUNCTIONAL_AREA_UUID, '') = '')) AND STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID NOT IN (${restrictedStepDefinitionsString})`;
    //         let stepDefinationData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefTemplateVerbaleQuery, input);
    //         for (let stepDefData of stepDefinationData) {
    //             let viewUIElementApplicableStepObject = {};
    //             viewUIElementApplicableStepObject['VIEW_UI_ELEMENT_UUID'] = getViewUIElementIds(viewUIElementList, uiElement['UI_ELEMENT_UUID']);
    //             viewUIElementApplicableStepObject['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = stepDefData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
    //             viewUIElementApplicableStep.push(viewUIElementApplicableStepObject);
    //         }
    //     }
    // }

}

// if (input.compositeEntityAction == 'Delete') {
//     deleteRecord("VIEW_UI_ELEMENT_UUID", input.VIEW_UI_ELEMENT_UUID, "VIEW_UI_ELEMENT");
//     let applicableStepViewUIElementQuery = `SELECT * FROM VIEW_UI_ELEMENT_APPLICABLE_STEP WHERE VIEW_UI_ELEMENT_UUID=:VIEW_UI_ELEMENT_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
//     let applicableStepViewUIElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', applicableStepViewUIElementQuery, input);
//     for (let data of applicableStepViewUIElementQueryData) {
//         deleteRecord("VIEW_UI_ELEMENT_APPLICABLE_STEP_UUID", data['VIEW_UI_ELEMENT_APPLICABLE_STEP_UUID'], "VIEW_UI_ELEMENT_APPLICABLE_STEP");
//     }
// }

input["AppEngChildEntity:VIEW_UI_ELEMENT_CHILD_OF_VIEW_UI_ELEMENT"] = viewUIElementList;
// input["AppEngChildEntity:VIEW_UI_ELEMENT_APPLICABLE_STEP"] = viewUIElementApplicableStep;