debugger;
try {
  const AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let queryData = [];
  const optionData = [];
  let input = Object.assign(msg.payload.apiRequestBody, msg.payload.referenceData);
  async function getStepDataUsingChild(currentStepKey, currentStepID, currentAttributeId) {
    const testCasefunctionStepAttributeValueQuery = `SELECT tcfs.VIEW_NAVIGATION_STEP_UUID,tcfs.FUNCTION_VIEW_NAVIGATION_STEP_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ID, FUNCTION_VIEW_NAVIGATION_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT, NEXT_PAGE_CONTEXT, FUNCTION_VIEW_NAVIGATION_STEP_TYPE, FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID, tcfs.FUNCTIONAL_AREA_UUID, tcfs.FUNCTION_UUID, tcfs.FUNCTION_STEP_UUID, tcfs.VIEW_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_ID, STEP_DEFINITION_ATTRIBUTE_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA AS 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA', PRE_DEFINED_VALUES_UUID, SCOPE_VARIABLE_TYPE, SCOPE_VARIABLE_UUID FROM FUNCTION_VIEW_NAVIGATION_STEP tcfs LEFT JOIN FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE tcfsav ON tcfs.FUNCTION_VIEW_NAVIGATION_STEP_UUID = tcfsav.FUNCTION_VIEW_NAVIGATION_STEP_UUID WHERE tcfs.FUNCTION_STEP_UUID=:FUNCTION_STEP_UUID AND tcfs.FUNCTION_UUID=:FUNCTION_UUID AND tcfs.VIEW_UUID=:VIEW_UUID AND tcfs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let stepAttrValueList = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCasefunctionStepAttributeValueQuery, input);
    let result = stepAttrValueList.filter((item) => item[currentStepKey] == currentStepID && item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId);
    if (result && result.length) {
      return result;
    } else {
      return [];
    }
  }
  async function getStepDataUsingChildForTestCaseFunctionUIElementGroupStep(currentStepKey, currentStepID, currentAttributeId) {
    const functionUIElementGroupStepQuery = `SELECT fuiegs.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ID, FUNCTION_UI_ELEMENT_GROUP_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT, FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE, FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID,fuiegs.FUNCTION_STEP_UUID, fuiegs.FUNCTIONAL_AREA_UUID, fuiegs.FUNCTION_UUID, fuiegs.FUNCTION_STEP_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_ID, STEP_DEFINITION_ATTRIBUTE_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA AS 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA', PRE_DEFINED_VALUES_UUID, SCOPE_VARIABLE_TYPE, SCOPE_VARIABLE_UUID,UI_ELEMENT_GROUP_STEP_UUID FROM FUNCTION_UI_ELEMENT_GROUP_STEP fuiegs LEFT JOIN FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE fuiegsav ON fuiegs.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID = fuiegsav.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID WHERE fuiegs.FUNCTION_STEP_UUID=:FUNCTION_STEP_UUID AND fuiegs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let stepAttrValueList = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionUIElementGroupStepQuery, input);
    let result = stepAttrValueList.filter((item) => item[currentStepKey] == currentStepID && item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId);
    if (result && result.length) {
      return result;
    } else {
      return [];
    }
  }
  function getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data) {
    let getUIElementStepDefAttributeUUID = stepDefAttributeQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == 'adcf6e25-f890-476c-bdcf-e723c6d7894c');
    let stepDefAttributeIdforUIElement = '';
    if (getUIElementStepDefAttributeUUID && getUIElementStepDefAttributeUUID.length) {
      stepDefAttributeIdforUIElement = getUIElementStepDefAttributeUUID[0]['STEP_DEFINITION_ATTRIBUTE_UUID'];
    }
    let actualUIElementUUID = '';
    let getUIElementIdFromAttribute = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefAttributeIdforUIElement);
    if (getUIElementIdFromAttribute && getUIElementIdFromAttribute.length) {
      actualUIElementUUID = getUIElementIdFromAttribute[0][data['CHILD_ATTRIBUTE_DATA']];
    }
    return actualUIElementUUID;
  }
  function getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data) {
    let getColumnHeaderStepDefAttributeUUID = stepDefAttributeQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == 'd797acb4-5e5c-447b-b0c5-60dad38e39a5');
    let stepDefAttributeIdforUIElement = '';
    if (getColumnHeaderStepDefAttributeUUID && getColumnHeaderStepDefAttributeUUID.length) {
      stepDefAttributeIdforUIElement = getColumnHeaderStepDefAttributeUUID[0]['STEP_DEFINITION_ATTRIBUTE_UUID'];
    }
    let actualColumnHeaderUUID = '';
    let getUIElementIdFromAttribute = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefAttributeIdforUIElement);
    if (getUIElementIdFromAttribute && getUIElementIdFromAttribute.length) {
      actualColumnHeaderUUID = getUIElementIdFromAttribute[0][data['CHILD_ATTRIBUTE_DATA']];
    }
    return actualColumnHeaderUUID;
  }
  function decideAndSetOrder(stepDefAttributeQueryData) {
    let decideFieldOrder = 0;
    let object = {};
    for (let codeDesc of stepDefAttributeQueryData) {
      switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
        case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
          decideFieldOrder++;
          object['firstUIElementName'] = decideFieldOrder;
          break;
        case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
          decideFieldOrder++;
          object['firstColumnHeaderName'] = decideFieldOrder;
          break;
      }
    }
    return object;
  }
  function getUIElementValueAttributeValue(attributeValueQueryData, stepDefAttributeId) {
    let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefAttributeId);
    if (result && result.length && input) {
      return result[0];
    } else {
      return {};
    }
  }
  async function getAttributeValueDetails(attributeId, type) {
    let query = `SELECT 'No' as 'IS_FUNCTION_ATTRIBUTE',TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_STEP_ATTRIBUTE_DATA AS NAME,'Test Case' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}' UNION SELECT 'Yes' as 'IS_FUNCTION_ATTRIBUTE', FUNCTION_STEP_ATTRIBUTE_VALUE_UUID AS ID, FUNCTION_STEP_ATTRIBUTE_DATA AS NAME, 'Test Case' as SOURCE_TYPE, STEP_DEFINITION_ATTRIBUTE_UUID FROM FUNCTION_STEP_ATTRIBUTE_VALUE WHERE FUNCTION_STEP_ATTRIBUTE_VALUE_UUID = '${attributeId}' UNION SELECT 'Yes' as 'IS_FUNCTION_ATTRIBUTE', TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA AS NAME,'Function' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}'`;
    let res = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', query, input);
    return res && res.length ? res[0] : '';
  }
  function decideScopePrefix(uiElementValueData) {
    let str = uiElementValueData['SCOPE_VARIABLE_TYPE'] == 'Test Case' ? '@TCV:' : uiElementValueData['SCOPE_VARIABLE_TYPE'] == 'Test Set' ? '@TSV:' : '';
    return str;
  }
  function getFunctionDataFromAttributeValue(attributeValueQueryData, stepDefAttributeId) {
    let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefAttributeId);
    if (
      result &&
      result.length &&
      ([
        'TEST_CASE_STEP_ATTRIBUTE_DATA',
        'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA',
        'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA',
        'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'
      ].includes(result[0]['CHILD_ATTRIBUTE_DATA']) ||
        ['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA', 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'].includes(result[0]['REFERENCE_ATTRIBUTE_DATA']))
    ) {
      return result[0]['FUNCTION_UUID'];
    } else {
      return '';
    }
  }
  function getDataFromAttributeValue(attributeValueQueryData, stepDefAttributeId, attributeData) {
    let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefAttributeId);
    if (result && result.length) {
      return result[0][attributeData];
    } else {
      return '';
    }
  }
  function excludeAttribute(attributeList, stepAttributeID) {
    const filteredData = attributeList.filter((item) => item.STEP_DEFINITION_ATTRIBUTE_UUID !== stepAttributeID);
    return filteredData;
  }
  async function filterStepByCurrentStep(stepAttrValueList, currentStepKey, currentStepID, currentAttributeId) {
    let result = stepAttrValueList.filter((item) => item[currentStepKey] == currentStepID && item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId);
    if (result && result.length) {
      return result;
    } else if (input && input.GRID_NAME == 'Test Case Function View Navigation Step') {
      return await getStepDataUsingChild(currentStepKey, currentStepID, currentAttributeId);
    } else if (input && input.GRID_NAME == 'Test Case Function Step') {
      return await getStepDataUsingChildForTestCaseFunctionUIElementGroupStep(currentStepKey, currentStepID, currentAttributeId);
    } else {
      return [];
    }
  }
  let selectQuery = '';
  if (input.FUNCTION_UUID) {
    selectQuery = `SELECT VIEW_UUID, CURRENT_PAGE_CONTEXT as PAGE_NAME, FUNCTION_STEP_ID, FUNCTION_STEP_NAME, FUNCTION_STEP_UUID, IS_PURE_NAVIGATION_STEP, NEXT_PAGE_CONTEXT, CURRENT_PAGE_CONTEXT, IS_OVERIDE_UI_ELEMENT_VALUE_ALLOWED, IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT, IS_UI_ELEMENT_GROUP_STEP, 'FUNCTION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'FUNCTION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'FUNCTION_STEP_UUID' as PRIMARY_COLUMN_NAME, FUNCTION_STEP_UUID as PRIMARY_COLUMN_VALUE, 'Function Step' as GRID_NAME, FUNCTION_STEP_TYPE, API_UUID, IS_API_ATTRIBUTE_VALUE_PRESENT, FUNCTION_STEP_SEQ_ID, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID,UI_ELEMENT_GROUP_UUID,FUNCTION_UUID FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY FUNCTION_STEP_SEQ_ID asc`;
  } else if (input.VIEW_UUID) {
    selectQuery = `SELECT VIEW_NAVIGATION_STEP_UUID, VIEW_NAVIGATION_STEP_ID, VIEW_NAVIGATION_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, VIEW_NAVIGATION_STEP_TYPE, VIEW_NAVIGATION_STEP_SEQ_ID, CURRENT_PAGE_CONTEXT, NEXT_PAGE_CONTEXT, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, VIEW_UUID, 'No' as IS_PURE_NAVIGATION_STEP, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as REFERENCE_ATTRIBUTE_DATA FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID=:VIEW_UUID ORDER BY VIEW_NAVIGATION_STEP_SEQ_ID asc`;
  }
  queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
  for (let data of queryData) {
    if (data && Object.keys(data).length) {
      const stepDefAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID='${data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']}' order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
      let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefAttributeQuery, input);
      const stepDefTemplateVerbiageQuery = `SELECT STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME FROM STEP_DEFINITION_TEMPLATE_VERBIAGE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID='${data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']}'`;
      let stepDefTemplateVerbiageQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, stepDefTemplateVerbiageQuery, input);
      let stepDefTemplateVerbiageName = stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'];
      if (stepDefTemplateVerbiageName && stepDefTemplateVerbiageName.includes('<Table Name>')) {
      }
      let test_data = '';
      let isEdit = false;
      if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
        const attributeValueQuery = `SELECT * FROM ${data['CHILD_ATTRIBUTE_TABLE_NAME']} WHERE ${data['PRIMARY_COLUMN_NAME']}='${data['PRIMARY_COLUMN_VALUE']}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let attributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', attributeValueQuery, input);
        let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
        let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
        let isDataElementNameTypePassword = false;
        let isDataElementName1TypePassword = false;
        for (let codeDesc of stepDefAttributeQueryData) {
          switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
            case '57b76ab3-8112-4343-af0f-49643c808bf7':
              {
                let pageName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                if (!data['PAGE_NAME']) {
                  data['PAGE_NAME'] = pageName;
                }
                const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID='${pageName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, pageNewQuery, input);
                if (data['IS_PURE_NAVIGATION_STEP'] == 'Yes' && data['VIEW_UUID']) {
                  const viewQuery = `SELECT VIEW_NAME, IS_DEFAULT_VIEW FROM PAGE_VIEW WHERE VIEW_UUID='${data['VIEW_UUID']}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  const viewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewQuery, input);
                  if (viewQueryData && viewQueryData.length && viewQueryData[0]['IS_DEFAULT_VIEW'] != 'Yes') {
                    pageNewQueryData['PAGE_NAME'] += '$$$' + viewQueryData[0]['VIEW_NAME'];
                  }
                }
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                  return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
                });
              }
              break;
            case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
              {
                let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['UI_ELEMENT_NAME'] = uiElementName;
                const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${uiElementName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name>', function () {
                  return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                });
                if (uiElementQueryData['UI_ELEMENT_NAME'] && uiElementQueryData['UI_ELEMENT_NAME'].toUpperCase() == 'PASSWORD') {
                  isDataElementNameTypePassword = true;
                }
              }
              break;
            case '7f855066-ad39-4325-8108-30befb2447e6':
              {
                const uiElementTypeQuery = `SELECT * FROM UI_ELEMENT ui,UI_ELEMENT_TYPE_MASTER uit WHERE ui.UI_ELEMENT_TYPE=uit.UI_ELEMENT_TYPE_UUID AND ui.UI_ELEMENT_UUID='${actualUIElementUUID}'`;
                let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementTypeQuery, input);
                data['UI_ELEMENT_TYPE'] = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
                  return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
                });
              }
              break;
            case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
              {
                isEdit = true;
                let uiElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                if (uiElementValueData && Object.keys(uiElementValueData).length && uiElementValueData['SCOPE_VARIABLE_UUID']) {
                  let selectedAttributeDetails = await getAttributeValueDetails(uiElementValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  if (
                    selectedAttributeDetails &&
                    Object.keys(selectedAttributeDetails).length &&
                    ([
                      'TEST_CASE_STEP_ATTRIBUTE_DATA',
                      'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA',
                      'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA',
                      'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'
                    ].includes(data['CHILD_ATTRIBUTE_DATA']) ||
                      ['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA', 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'].includes(data['REFERENCE_ATTRIBUTE_DATA'])) &&
                    selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${uiElementValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    uiElementValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                  } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                    uiElementValue = selectedAttributeDetails['NAME'];
                  }
                  uiElementValue = decideScopePrefix(uiElementValueData) + uiElementValue;
                }
                if (uiElementValueData && Object.keys(uiElementValueData).length && (uiElementValueData['PRE_DEFINED_VALUES_UUID'] || uiElementValueData['SCOPE_VARIABLE_UUID'])) {
                  isEdit = false;
                }
                let replacementValue;
                if (isDataElementName1TypePassword || isDataElementNameTypePassword) {
                  test_data = '********';
                  replacementValue = '********';
                } else {
                  test_data = uiElementValue ? uiElementValue : `' '`;
                  replacementValue = uiElementValue ? `'${uiElementValue}'` : `' '`;
                }
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Value>', replacementValue);
              }
              break;
            case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
              {
                let keyNameInKeyPad = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['KEY_NAME_IN_KEYPAD'] = keyNameInKeyPad;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Key Name in Keypad>', function () {
                  return `'` + keyNameInKeyPad + `'`;
                });
              }
              break;
            case '005d158d-428c-4bca-ae2d-1c3f9630b549':
              {
                let orderObject = decideAndSetOrder(stepDefAttributeQueryData);
                let selectedUIElement = '';
                if (orderObject['firstUIElementName'] == '1') {
                  selectedUIElement = actualUIElementUUID;
                } else if (orderObject['firstColumnHeaderName'] == '1') {
                  selectedUIElement = actualColumnHeaderUUID;
                }
                const uiElementQuery = `SELECT * FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${selectedUIElement}'`;
                let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementQuery, input);
                data['EVENT_TYPE'] = uiElementQueryData['EVENT_NAME'];
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Event Type>',
                  uiElementQueryData['EVENT_NAME']
                    ? function () {
                        return `'` + uiElementQueryData['EVENT_NAME'] + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
              isEdit = false;
              let confirmUIElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
              test_data = confirmUIElementValue ? '[' + test_data + '][' + confirmUIElementValue + ']' : '[' + test_data + '][' + `' '` + ']';
              stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                '<Confirm UI Element Value>',
                confirmUIElementValue
                  ? function () {
                      return `'` + confirmUIElementValue + `'`;
                    }
                  : `' '`
              );
              break;
            case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
              {
                let functionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                const functionNameQuery = `SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID='${functionName}'`;
                let functionNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, functionNameQuery, input);
                data['FUNCTION_NAME'] = functionName;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                  return `'` + functionNameQueryData['FUNCTION_NAME'] + `'`;
                });
              }
              break;
            case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
              {
                let uiElementName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${uiElementName1}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
                data['UI_ELEMENT_NAME_1'] = uiElementName1;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name 1>', function () {
                  return uiElementQueryData['UI_ELEMENT_NAME'] ? `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'` : `' '`;
                });
                if (uiElementQueryData['UI_ELEMENT_NAME'] && uiElementQueryData['UI_ELEMENT_NAME'].toUpperCase() == 'PASSWORD') {
                  isDataElementName1TypePassword = true;
                }
              }
              break;
            case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
              {
                isEdit = false;
                let uiElementValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                if (isDataElementName1TypePassword) {
                  test_data = '[' + test_data + '][********]';
                } else {
                  test_data = uiElementValue1 ? '[' + test_data + '][' + uiElementValue1 + ']' : '[' + test_data + '][' + `' '` + ']';
                }
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<UI Element Value 1>',
                  uiElementValue1
                    ? function () {
                        if (isDataElementName1TypePassword) {
                          return '********';
                        } else {
                          return `'` + uiElementValue1 + `'`;
                        }
                      }
                    : `' '`
                );
              }
              break;
            case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
              {
                let userActionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${userActionName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
                data['USER_ACTION_NAME'] = userActionName;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
                  return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                });
              }
              break;
            case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
              {
                const uiElementTypeQuery = `SELECT * FROM UI_ELEMENT ui,UI_ELEMENT_TYPE_MASTER uit WHERE ui.UI_ELEMENT_TYPE=uit.UI_ELEMENT_TYPE_UUID AND ui.UI_ELEMENT_UUID='${actualUIElementUUID}'`;
                let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementTypeQuery, input);
                data['USER_ACTION_TYPE'] = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
                  return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
                });
              }
              break;
            case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
              {
                let uiElementGroupName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP WHERE UI_ELEMENT_GROUP_UUID='${uiElementGroupName}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let uiElementGroupStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input);
                data['UI_ELEMENT_GROUP_NAME'] = uiElementGroupName;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                  return `'` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + `'`;
                });
              }
              break;
            case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
              {
                let pageNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['PAGE_NUMBER'] = pageNumber;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Page Number>',
                  pageNumber
                    ? function () {
                        return `'` + pageNumber + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
              {
                let dataKey = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['DATA_KEY'] = dataKey;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Data Key>',
                  dataKey
                    ? function () {
                        return `'` + dataKey + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
              {
                let dataValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['DATA_VALUE'] = dataValue;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Data Value>',
                  dataValue
                    ? function () {
                        return `'` + dataValue + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'ceb66327-216f-42fd-845b-9f4543c62baa':
              {
                let fileName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['FILE_NAME'] = fileName;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<File Name>',
                  fileName
                    ? function () {
                        return `'` + fileName + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
              {
                let downloadParserName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['DOCUMENT_PARSER_NAME'] = downloadParserName;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Document Parser Name>',
                  downloadParserName
                    ? function () {
                        return `'` + downloadParserName + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
              {
                let apiName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                const apiQuery = `SELECT API_NAME FROM API_NEW WHERE API_UUID='${apiName}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let apiQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, apiQuery, input);
                data['API_NAME'] = apiName;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                  return `'` + apiQueryData['API_NAME'] + `'`;
                });
              }
              break;
            case '46136260-2e33-11ef-b3ef-e52f192c3af0':
              {
                let apiAttributeName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                const apiAttributeQuery = `SELECT ATTRIBUTE_NAME FROM API_ATTRIBUTE WHERE API_ATTRIBUTE_UUID='${apiAttributeName}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let apiAttributeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, apiAttributeQuery, input);
                data['API_ATTRIBUTE_NAME'] = apiAttributeName;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
                  return `'` + apiAttributeQueryData['ATTRIBUTE_NAME'] + `'`;
                });
              }
              break;
            case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
              {
                isEdit = true;
                let apiAttributeValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let apiAttributeValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                if (apiAttributeValueData && Object.keys(apiAttributeValueData).length && apiAttributeValueData['SCOPE_VARIABLE_UUID']) {
                  let selectedAttributeDetails = await getAttributeValueDetails(apiAttributeValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  if (
                    selectedAttributeDetails &&
                    Object.keys(selectedAttributeDetails).length &&
                    (['TEST_CASE_STEP_ATTRIBUTE_DATA', 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'].includes(data['CHILD_ATTRIBUTE_DATA']) ||
                      ['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA', 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'].includes(data['REFERENCE_ATTRIBUTE_DATA'])) &&
                    apiAttributeValueData['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${apiAttributeValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    apiAttributeValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                  } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                    apiAttributeValue = selectedAttributeDetails['NAME'];
                  }
                  apiAttributeValue = decideScopePrefix(apiAttributeValueData) + apiAttributeValue;
                }
                test_data = apiAttributeValue ? apiAttributeValue : `' '`;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<API Attribute Value>',
                  apiAttributeValue
                    ? function () {
                        return `'` + apiAttributeValue + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '833eb770-2e33-11ef-9033-4bb93e602d01':
              {
                let responseStatusCode = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['RESPONSE_STATUS_CODE'] = responseStatusCode;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Response Status Code>',
                  responseStatusCode
                    ? function () {
                        return `'` + responseStatusCode + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd':
              {
                let pageName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID='${pageName1}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, pageNewQuery, input);
                data['PAGE_NAME_1'] = pageName1;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                  return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
                });
              }
              break;
            case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
              {
                isEdit = false;
                let uiElementState = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['UI_ELEMENT_STATE'] = uiElementState;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<UI Element State>',
                  uiElementState
                    ? function () {
                        return `'` + uiElementState + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
              {
                let timeOut = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['TIMEOUT'] = timeOut;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Timeout>',
                  timeOut
                    ? function () {
                        return `'` + timeOut + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
              {
                let testSetScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                if (functionIds) {
                  let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                  testSetScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testSetScope;
                }
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Test Set Scope Variable>',
                  testSetScope
                    ? function () {
                        if (isDataElementNameTypePassword) {
                          data['TEST_SET_SCOPE_VARIABLE'] = '********';
                          return '********';
                        } else {
                          data['TEST_SET_SCOPE_VARIABLE'] = testSetScope;
                          return `'` + testSetScope + `'`;
                        }
                      }
                    : `' '`
                );
              }
              break;
            case '842981e7-e484-11ef-904e-02c8cad0208d':
              {
                let testCaseScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                if (functionIds) {
                  let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                  testCaseScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testCaseScope;
                }
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Test Case Scope Variable>',
                  testCaseScope
                    ? function () {
                        if (isDataElementNameTypePassword) {
                          data['TEST_CASE_SCOPE_VARIABLE'] = '********';
                          return '********';
                        } else {
                          data['TEST_CASE_SCOPE_VARIABLE'] = testCaseScope;
                          return `'` + testCaseScope + `'`;
                        }
                      }
                    : `' '`
                );
              }
              break;
            case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
              {
                let timeInterval = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['TIME_INTERVAL'] = timeInterval;
                if (timeInterval) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Time Interval>',
                    timeInterval
                      ? function () {
                          return `'` + timeInterval + `'`;
                        }
                      : `' '`
                  );
                }
              }
              break;
            case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
              {
                let attempts = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['ATTEMPTS'] = attempts;
                if (attempts) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Attempts>',
                    attempts
                      ? function () {
                          return `'` + attempts + `'`;
                        }
                      : `' '`
                  );
                }
              }
              break;
            case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
              {
                let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['COLUMN_HEADER'] = uiElementName;
                if (uiElementName) {
                  const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${uiElementName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header>', function () {
                    return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                  });
                }
              }
              break;
            case '75b16425-1531-4cee-8c09-30f5be70c4b0':
              {
                isEdit = true;
                let cellValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                test_data = cellValue ? cellValue : `' '`;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Cell Value>',
                  cellValue
                    ? function () {
                        return `'` + cellValue + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
              {
                let rowNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['ROW_NUMBER'] = rowNumber;
                if (rowNumber) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Row Number>',
                    rowNumber
                      ? function () {
                          return `'` + rowNumber + `'`;
                        }
                      : `' '`
                  );
                }
              }
              break;
            case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
              {
                let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['TABLE_NAME'] = uiElementName;
                if (uiElementName) {
                  const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${uiElementName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Table Name>', function () {
                    return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                  });
                }
              }
              break;
            case '078e6534-f38f-4aad-b89d-cad8216ad86b':
              {
                let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['COLUMN_HEADER_1'] = uiElementName;
                if (uiElementName) {
                  const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${uiElementName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header 1>', function () {
                    return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                  });
                }
              }
              break;
            case 'ba1ef281-412a-4544-b615-7767b06eb489':
              {
                isEdit = false;
                let cellValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                test_data = cellValue1 ? '[' + test_data + '][' + cellValue1 + ']' : '[' + test_data + '][' + `' '` + ']';
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Cell Value 1>',
                  cellValue1
                    ? function () {
                        return `'` + cellValue1 + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
              {
                let columnNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['COLUMN_NUMBER'] = columnNumber;
                if (columnNumber) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Column Number>',
                    columnNumber
                      ? function () {
                          return `'` + columnNumber + `'`;
                        }
                      : `' '`
                  );
                }
              }
              break;
            case '28058e26-fa09-42fb-868a-1988bd0a746c':
              {
                let fileFullPath = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                data['FILE_FULL_PATH'] = fileFullPath;
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<File Full Path>',
                  fileFullPath
                    ? function () {
                        return `'` + fileFullPath + `'`;
                      }
                    : `' '`
                );
              }
              break;
          }
        }
      }
      const stepTypeObj = {
        FUNCTION_STEP: { seqIdField: 'FUNCTION_STEP_SEQ_ID', idField: 'FUNCTION_STEP_SEQ_ID' },
        VIEW_NAVIGATION_STEP: { seqIdField: 'VIEW_NAVIGATION_STEP_SEQ_ID', idField: 'VIEW_NAVIGATION_STEP_UUID' }
      };
      data['ATTRIBUTE_KEYS'] = stepDefTemplateVerbiageName;
      debugger;
      let stepType = input.FUNCTION_UUID ? 'FUNCTION_STEP' : input.VIEW_UUID ? 'VIEW_NAVIGATION_STEP' : null;
      if (stepType && stepTypeObj[stepType]) {
        const config = stepTypeObj[stepType];
        const optn = {
          label: `${data[config.seqIdField]} - ${stepDefTemplateVerbiageName}`,
          NAME: `${data[config.seqIdField]} - ${stepDefTemplateVerbiageName}`,
          ID: data[config.idField],
          value: data[config.idField]
        };
        optionData.push(optn);
      }
    }
  }
  msg.payload.result = { optionData: optionData };
  node.send(msg);
} catch (error) {
  console.log('Error Occurred Process and Send Data to ui', error.message);
  console.log('Error stack:', error.stack);
  msg.payload.result = { gridData: [], error: error.message, type: input.FUNCTION_UUID ? 'FUNCTION_STEP' : 'VIEW_NAVIGATION_STEP' };
  node.send(msg);
}
return;
