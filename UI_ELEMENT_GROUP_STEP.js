let uiElementGroupStepList = [];
let uiElementGroupStepAttributeValueList = [];
console.log("########################",input)
async function fetchStepDefinitionTemplateVerbiage(stepDefTemplateVerbiageId) {
    const StepDefinitionTemplateVerbiageQuery = `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = ${stepDefTemplateVerbiageId}`;
    let StepDefinitionTemplateVerbiageQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", StepDefinitionTemplateVerbiageQuery, input);
    return StepDefinitionTemplateVerbiageQueryData;
}

function isDataAvailable(str) {
    if(str === null || str === undefined || str.trim() === '' || str === 'null' || str === 'undefined'){
       return false;
    } else {
       return true;
    }
 }

async function createUiElementGroupStepAttributeValue() {
    let StepDefinitionTemplateVerbiageQueryData = await fetchStepDefinitionTemplateVerbiage("'" + input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] + "'");
    let stepDefVerbiageStr = StepDefinitionTemplateVerbiageQueryData[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'];
    let stepVerviageID = "{StepVerbiage@#$'" + input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] + "'}";
    let uiElementGroupStepAttributeKeysData = [stepVerviageID];
    if (input['UI_ELEMENT_GROUP_STEP_UUID']) {
        const stepDefAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID=:STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
        let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input);

        for (let codeDesc of stepDefAttributeQueryData) {
            let object = {};
            object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
            object['UI_ELEMENT_GROUP_UUID'] = input['UI_ELEMENT_GROUP_UUID'];
            object['UI_ELEMENT_GROUP_STEP_UUID'] = input['UI_ELEMENT_GROUP_STEP_UUID'];
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
                case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                    object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE'];
                    let uiElementValue = input['UI_ELEMENT_VALUE'].toString();
                    stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element Value>', function () { return "'" + uiElementValue + "'" });
                    uiElementGroupStepAttributeKeysData.push('{UIElementValue@#$' + "'" + input['UI_ELEMENT_VALUE'] + "'}");
                    break;
                case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                    object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE1'];
                    let uiElementValue1 = input['UI_ELEMENT_VALUE1'].toString();
                    stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element Value 1>', function () { return "'" + uiElementValue1 + "'" });
                    uiElementGroupStepAttributeKeysData.push('{UIElementValue1@#$' + "'" + input['UI_ELEMENT_VALUE1'] + "'}");
                    break;
                case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                    object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME'];
                    const uiElementQuery = `SELECT * FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
                    stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element Name>', function () { return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'" });
                    uiElementGroupStepAttributeKeysData.push('{UIElementName@#$' + "'" + input['UI_ELEMENT_NAME'] + "'}");
                    break;
                case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                    object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME1'];
                    const uiElementQuery1 = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME1 AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData1 = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery1, input);
                    stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element Name 1>', function () { return "'" + uiElementQueryData1['UI_ELEMENT_NAME'] + "'" });
                    uiElementGroupStepAttributeKeysData.push('{UIElementName1@#$' + "'" + input['UI_ELEMENT_NAME1'] + "'}");
                    break;
                case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                    object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = input['USER_ACTION_NAME'];
                    const uiElementQuery2 = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:USER_ACTION_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementQueryData2 = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery2, input);
                    stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<User Action Name>', function () { return "'" + uiElementQueryData2['UI_ELEMENT_NAME'] + "'" });
                    uiElementGroupStepAttributeKeysData.push('{UserActionName@#$' + "'" + input['USER_ACTION_NAME'] + "'}");
                    break;
                case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                    object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = input['USER_ACTION_TYPE'];
                    const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID=:USER_ACTION_TYPE`;
                    let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input);
                    stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<User Action Type>', function () { return "'" + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + "'" });
                    uiElementGroupStepAttributeKeysData.push('{UserActionType@#$' + "'" + input['USER_ACTION_TYPE'] + "'}");
                    break;
                default: null
            }
            input['UI_ELEMENT_GROUP_STEP_NAME'] = stepDefVerbiageStr;
            input['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'] = JSON.stringify(uiElementGroupStepAttributeKeysData);
            uiElementGroupStepAttributeValueList.push(object);
        }
    }
}
function deleteRecords(key, value) {
    const deleteParamenter = {};
    deleteParamenter[key] = value;
    deleteParamenter["compositeEntityAction"] = "Delete";
    uiElementGroupStepAttributeValueList.push(deleteParamenter)
}

async function deleteUiElementGroupStepAttributeData(uiElementGroupStepStr) {
    const uiElementGroupStepAttributeValueQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where UI_ELEMENT_GROUP_STEP_UUID in(${uiElementGroupStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", uiElementGroupStepAttributeValueQuery, input);

    for (let attributeData of testCaseStepAttributeValueQueryData) {
        deleteRecords('UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID']);
    }
}
async function processUiElementGroupStep(element, verbale) {
    let uiElementGroupStepObject = {};
    let uiElementGroupStepUUID = uuid();
    let stepDefTemplateVerbage = verbale['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'];

    uiElementGroupStepObject['UI_ELEMENT_GROUP_STEP_UUID'] = uiElementGroupStepUUID;
    uiElementGroupStepObject['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = verbale['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];

    let stepVerviageID = "{StepVerbiage@#$'" + verbale['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] + "'}";
    let uiElementGroupStepAttributeKeysData = [stepVerviageID];

    uiElementGroupStepObject['STEP_TYPE'] = input['UI_ELEMENT_STEP_FILTER_TYPE'];
    let stepDefAttributeQuery = `SELECT STEP_DEFINITION_ATTRIBUTE_UUID,STEP_DEFINITION_ATTRIBUTE_MASTER_UUID FROM STEP_DEFINITION_ATTRIBUTE WHERE STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = '${verbale['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']}' order by STEP_DEFINITION_ATTRIBUTE_ID asc`;

    let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input);

    for (let codeDesc of stepDefAttributeQueryData) {
        let object = {};
        object['UI_ELEMENT_GROUP_UUID'] = input['UI_ELEMENT_GROUP_UUID'];
        object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
        object['UI_ELEMENT_GROUP_STEP_UUID'] = uiElementGroupStepUUID;
        switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
            case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = '';
                stepDefTemplateVerbage = stepDefTemplateVerbage.replaceAll('<UI Element Value>', "' '");
                uiElementGroupStepAttributeKeysData.push('{UIElementValue@#$' + "' '}");
                break;
            case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                object['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = '';
                stepDefTemplateVerbage = stepDefTemplateVerbage.replaceAll('<UI Element Value 1>', "' '");
                uiElementGroupStepAttributeKeysData.push('{UIElementValue1@#$' + "' '}");
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

    uiElementGroupStepObject['CURRENT_PAGE_CONTEXT'] = input['PAGE_UUID']
    uiElementGroupStepObject['UI_ELEMENT_GROUP_UUID'] = input['UI_ELEMENT_GROUP_UUID'];
    uiElementGroupStepObject['UI_ELEMENT_GROUP_STEP_NAME'] = stepDefTemplateVerbage;
    uiElementGroupStepObject['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'] = JSON.stringify(uiElementGroupStepAttributeKeysData);
    uiElementGroupStepList.push(uiElementGroupStepObject);
}

async function processUiElements() {
    const quotedStrings = [];
    const stringsArray = input['UI_ELEMENTS'].split(',');
    for (const str of stringsArray) {
        quotedStrings.push(`'${str}'`);
    }
    let uiElementsUUID = quotedStrings.join(',');
    let uiElementQuery = `SELECT UI_ELEMENT_UUID, UI_ELEMENT_TYPE FROM UI_ELEMENT WHERE UI_ELEMENT_UUID IN (${uiElementsUUID})`;

    
    let stepDefTemplateVerbaleQuery = `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE WHERE IS_ACTIVE_STEP_DEFINITION_TEMPLATE_VERBIAGE="Yes"`;
    
    let stepDefTemplateVerbaleQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefTemplateVerbaleQuery, input);
    let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);

    for (let element of uiElementQueryData) {
        let uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID='${element['UI_ELEMENT_TYPE']}'`;
        let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input);

        for (let verbale of stepDefTemplateVerbaleQueryData) {
            if (input['UI_ELEMENT_STEP_FILTER_TYPE'] === 'User Input' && uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] === verbale['APPLICABLE_UI_ELEMENT_TYPE']) {
                await processUiElementGroupStep(element, verbale);
            } else if (input['UI_ELEMENT_STEP_FILTER_TYPE'] !== 'User Input') {
                await processUiElementGroupStep(element, verbale);
            }
        }
    }
}
// the below if block will exist when action is Update
if (input.compositeEntityAction === 'Save') {
    await processUiElements();
} else if (input.compositeEntityAction == 'Update') {
    if (input['UI_ELEMENT_GROUP_UUID']) {
        await deleteUiElementGroupStepAttributeData("'" + input['UI_ELEMENT_GROUP_STEP_UUID'] + "'");
        await createUiElementGroupStepAttributeValue();
    }
} else if (input.compositeEntityAction == 'Delete') {
    await deleteUiElementGroupStepAttributeData("'" + input['UI_ELEMENT_GROUP_STEP_UUID'] + "'");
}
console.log("###########uiElementGroupStepList",uiElementGroupStepList);
console.log("###########uiElementGroupStepAttributeValueList",uiElementGroupStepAttributeValueList);
input["AppEngChildEntity:UI_ELEMENT_GROUP_STEP_CHILD_OF_UI_ELEMENT_GROUP_STEP"] = uiElementGroupStepList;
input["AppEngChildEntity:UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE"] = uiElementGroupStepAttributeValueList;