try {
  debugger;
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let input = Object.assign(msg.payload.apiRequestBody.baseEntity.records[0], msg.payload.referenceData);
  if (msg.payload.apiRequestBody.action === 'Test Data') {
    input.type = input.SCREEN_NAME;
    msg.payload.result['mode'] = 'Update';
  } else if (msg.payload.apiRequestBody.action === 'Update' && Object.keys(msg.payload.result).length && msg.payload.result['mode'] == 'Delete') {
    msg.payload.result['mode'] = 'Update';
  }
  const stepDefAttributeQueryList = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
  let stepDefAttributeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefAttributeQueryList, input);
  const stepDefTemplateVerbiageQueryList = `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE`;
  let stepDefTemplateVerbiageQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, stepDefTemplateVerbiageQueryList, input);
  let inputUIElementName;
  let inputUIElementType;
  let inputUIElementValue;
  let inputKeyNameInKeyPad;
  let inputEventName;
  let inputConfirmUIElementValue;
  let inputFunctionUUID;
  let inputUIElementName1;
  let inputUIElementValue1;
  let inputUserActionName;
  let inputUserActionType;
  let inputUIElementGroupUUID;
  let inputStepType;
  let inputPrimaryDBCode;
  let inputPrimaryDBCodeOFParentUUID;
  let inputPageName;
  let inputPrimaryDBCodeOFChildUUID;
  let inputPageNumber;
  let inputDataValue;
  let inputDataKey;
  let inputFileName;
  let inputDocumentParserName;
  let inputAPIName;
  let inputAPIAttributeName;
  let inputAPIAttributeValue;
  let inputResponseCodeValue;
  let inputUIElementState;
  let inputPageName1;
  let inputTimeout;
  let inputTimeInterval;
  let inputAttempts;
  let inputTestSetScope;
  let inputTestCaseScope;
  let inputColumnHeader;
  let inputCellValue;
  let inputRowNumber;
  let inputTableName;
  let inputColumnHeader1;
  let inputCellValue1;
  let inputColumnNumber;
  let inputFileFullPath;
  let isFunctionOrUIElementGroup = false;
  let changedDataArray = [];
  let uiElementValueObject = {};
  function getStepAttributeData(list, verbiageId) {
    if (list && list.length) {
      return list.filter((item) => item.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID == verbiageId);
    } else {
      return [];
    }
  }
  function getStepVerbiageData(list, verbiageId) {
    if (list && list.length) {
      let data = list.filter((item) => item.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID == verbiageId);
      if (data && data.length) {
        return data[0];
      } else {
        return {};
      }
    } else {
      return {};
    }
  }
  async function setAttributeValue(attributeId) {
    attributeId = (attributeId && attributeId.split('(:)')[1]) || attributeId;
    let query = `SELECT TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_STEP_ATTRIBUTE_DATA AS NAME, 'Test Case' as SOURCE_TYPE, STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID = '${attributeId}' UNION SELECT FUNCTION_STEP_ATTRIBUTE_VALUE_UUID AS ID, FUNCTION_STEP_ATTRIBUTE_DATA AS NAME, 'Test Case' as SOURCE_TYPE, STEP_DEFINITION_ATTRIBUTE_UUID FROM FUNCTION_STEP_ATTRIBUTE_VALUE WHERE FUNCTION_STEP_ATTRIBUTE_VALUE_UUID = '${attributeId}' UNION SELECT TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA AS NAME,'Function' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}'`;
    let res = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', query, input);
    return res && res.length ? res[0] : '';
  }
  function getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data) {
    let getUIElementStepDefAttributeUUID = stepDefAttributeQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == 'adcf6e25-f890-476c-bdcf-e723c6d7894c');
    let stepDefArrributeIdforUIElement = '';
    if (getUIElementStepDefAttributeUUID && getUIElementStepDefAttributeUUID.length) {
      stepDefArrributeIdforUIElement = getUIElementStepDefAttributeUUID[0]['STEP_DEFINITION_ATTRIBUTE_UUID'];
    }
    let actualUIElementUUID = '';
    let getUIElementIdFromAttribute = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeIdforUIElement);
    if (getUIElementIdFromAttribute && getUIElementIdFromAttribute.length) {
      actualUIElementUUID = getUIElementIdFromAttribute[0]['TEST_CASE_STEP_ATTRIBUTE_DATA'];
    }
    return actualUIElementUUID;
  }
  function getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data) {
    let getColumnHeaderStepDefAttributeUUID = stepDefAttributeQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == 'd797acb4-5e5c-447b-b0c5-60dad38e39a5');
    let stepDefArrributeIdforUIElement = '';
    if (getColumnHeaderStepDefAttributeUUID && getColumnHeaderStepDefAttributeUUID.length) {
      stepDefArrributeIdforUIElement = getColumnHeaderStepDefAttributeUUID[0]['STEP_DEFINITION_ATTRIBUTE_UUID'];
    }
    let actualColumnHeaderUUID = '';
    let getUIElementIdFromAttribute = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeIdforUIElement);
    if (getUIElementIdFromAttribute && getUIElementIdFromAttribute.length) {
      actualColumnHeaderUUID = getUIElementIdFromAttribute[0]['TEST_CASE_STEP_ATTRIBUTE_DATA'];
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
  function getDataFromAttributeValue(attributeValueQueryData, stepDefArrributeId) {
    let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
    if (result && result.length) {
      let columnkKey = input.type == 'Function Step' ? 'FUNCTION_STEP_ATTRIBUTE_DATA' : 'TEST_CASE_STEP_ATTRIBUTE_DATA';
      return result[0] && result[0][columnkKey] ? result[0][columnkKey] : '';
    } else {
      return '';
    }
  }
  async function updateAttributeForScopeVariable(referedID, sourceVariableType, value) {
    let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
    if (stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length && stepDefTemplateVerbiageQueryData['STEP_FILTER'] == 'Scope Step') {
      let testCaseStepQuery = '';
      if (input.type == 'Function Step') {
        testCaseStepQuery = `SELECT * FROM FUNCTION_STEP where FUNCTION_UUID=:FUNCTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_STEP_SEQ_ID asc`;
      } else {
        testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_SET_UUID=:TEST_SET_UUID AND TEST_CASE_UUID=:TEST_CASE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
      }
      let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepQuery, input);
      for (let data of testCaseStepQueryData) {
        if (data && Object.keys(data).length) {
          let stepDefAttributeQueryData = getStepAttributeData(stepDefAttributeQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
          let isUIElementValueAttributeExists =
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.filter(
              (item) =>
                item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '74da67d2-41c9-4cf7-9eea-715243e5fcdc' || item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7182ebf0-2e33-11ef-9033-4bb93e602d01'
            );
          if (isUIElementValueAttributeExists && isUIElementValueAttributeExists.length) {
            let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
            let stepDefTemplateVerbiageName =
              stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';
            if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
              let attributeValueQuery = '';
              if (input.type == 'Function Step') {
                attributeValueQuery = `SELECT * FROM FUNCTION_STEP_ATTRIBUTE_VALUE where FUNCTION_STEP_UUID ='${data['FUNCTION_STEP_UUID']}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              } else {
                attributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID ='${data['TEST_CASE_STEP_UUID']}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              }
              let attributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', attributeValueQuery, input);
              let isScopeVariableReffered =
                attributeValueQueryData && attributeValueQueryData.filter((item) => item['SCOPE_VARIABLE_UUID'] == referedID && item['SCOPE_VARIABLE_TYPE'] == sourceVariableType);
              if (isScopeVariableReffered && isScopeVariableReffered.length) {
                let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
                let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
                let isDataElementNameTypePassword = false;
                let isDataElementName1TypePassword = false;
                let firstUIElementName = 0;
                let firstColumnHeaderName = 0;
                for (let codeDesc of stepDefAttributeQueryData) {
                  switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
                    case '57b76ab3-8112-4343-af0f-49643c808bf7':
                      {
                        let pageName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
                          return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
                        });
                      }
                      break;
                    case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                      {
                        let uiElementValue = sourceVariableType == 'Test Set' ? '@TSV:' : sourceVariableType == 'Test Case' ? '@TCV:' : '' + value;
                        stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                          '<UI Element Value>',
                          uiElementValue
                            ? function () {
                                if (isDataElementNameTypePassword) {
                                  return '********';
                                } else {
                                  return `'` + uiElementValue + `'`;
                                }
                              }
                            : `' '`
                        );
                      }
                      break;
                    case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                      {
                        let keyNameInKeyPad = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                      let confirmUIElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let functionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                        const functionNameQuery = `SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID='${functionName}'`;
                        let functionNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, functionNameQuery, input);
                        stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                          return `'` + functionNameQueryData['FUNCTION_NAME'] + `'`;
                        });
                      }
                      break;
                    case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                      {
                        let uiElementName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                        const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${uiElementName1}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
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
                        let uiElementValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let userActionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                        const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${userActionName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
                        stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
                          return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                        });
                      }
                      break;
                    case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                      {
                        const uiElementTypeQuery = `SELECT * FROM UI_ELEMENT ui,UI_ELEMENT_TYPE_MASTER uit WHERE ui.UI_ELEMENT_TYPE=uit.UI_ELEMENT_TYPE_UUID AND ui.UI_ELEMENT_UUID='${actualUIElementUUID}'`;
                        let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementTypeQuery, input);
                        stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
                          return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
                        });
                      }
                      break;
                    case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                      {
                        let uiElementGroupName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                        let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP WHERE UI_ELEMENT_GROUP_UUID='${uiElementGroupName}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let uiElementGroupStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input);
                        stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                          return `'` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + `'`;
                        });
                      }
                      break;
                    case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                      {
                        let pageNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let dataKey = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let dataValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let fileName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let downloadParserName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let apiName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                        const apiQuery = `SELECT API_NAME FROM API_NEW WHERE API_UUID='${apiName}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let apiQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, apiQuery, input);
                        stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                          return `'` + apiQueryData['API_NAME'] + `'`;
                        });
                      }
                      break;
                    case '46136260-2e33-11ef-b3ef-e52f192c3af0':
                      {
                        let apiAttributeName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                        const apiAttributeQuery = `SELECT ATTRIBUTE_NAME FROM API_ATTRIBUTE WHERE API_ATTRIBUTE_UUID='${apiAttributeName}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let apiAttributeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, apiAttributeQuery, input);
                        stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
                          return `'` + apiAttributeQueryData['ATTRIBUTE_NAME'] + `'`;
                        });
                      }
                      break;
                    case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                      {
                        let apiAttributeValue = sourceVariableType == 'Test Set' ? '@TSV:' : sourceVariableType == 'Test Case' ? '@TCV:' : '' + value;
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
                        let responseStatusCode = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let pageName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                        const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID='${pageName1}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, pageNewQuery, input);
                        stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                          return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
                        });
                      }
                      break;
                    case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                      {
                        let uiElementState = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let timeOot = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                        stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                          '<Timeout>',
                          timeOot
                            ? function () {
                                return `'` + timeOot + `'`;
                              }
                            : `' '`
                        );
                      }
                      break;
                    case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
                      {
                        let testSetScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                                  return '********';
                                } else {
                                  return `'` + testSetScope + `'`;
                                }
                              }
                            : `' '`
                        );
                      }
                      break;
                    case '842981e7-e484-11ef-904e-02c8cad0208d':
                      {
                        let testCaseScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                                  return '********';
                                } else {
                                  return `'` + testCaseScope + `'`;
                                }
                              }
                            : `' '`
                        );
                      }
                      break;
                    case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
                      {
                        let timeInterval = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let attempts = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let cellValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let rowNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let cellValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let columnNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                        let fileFullPath = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
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
                changedDataArray.push({
                  parameter: 'data',
                  parameterKey: input.type == 'Function Step' ? 'FUNCTION_STEP_UUID' : 'TEST_CASE_STEP_UUID',
                  type: 'PortalDataGrid',
                  parameterKeyValue: input.type == 'Function Step' ? data['FUNCTION_STEP_UUID'] : data['TEST_CASE_STEP_UUID'],
                  changedData: { ATTRIBUTE_KEYS: stepDefTemplateVerbiageName }
                });
              }
            }
          }
        }
      }
    }
  }
  async function refreshGridIfScopeChanged(inputPrimaryDBCodeOFChildUUID) {
    let object = {};
    if (input['TEST_SET_SCOPE_VARIABLE']) {
      if (input['TEST_SET_SCOPE_VARIABLE'].includes('(:)')) {
        let splitedTestCaseScope = input['TEST_SET_SCOPE_VARIABLE'].split('(:)');
        let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${splitedTestCaseScope[0]}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
        object['inputTestSetScope'] = functionQueryData['FUNCTION_NAME'] + ' $ ' + splitedTestCaseScope[1];
      } else {
        object['inputTestSetScope'] = input['TEST_SET_SCOPE_VARIABLE'];
      }
      if (input.type == 'Test Case Step' && inputPrimaryDBCodeOFChildUUID && !input['FUNCTION_UUID'] && !input['UI_ELEMENT_GROUP_UUID']) {
        await updateAttributeForScopeVariable(input['EXISTING_TEST_SET_SCOPE_ATTRIBUTE'], 'Test Set', object['inputTestSetScope']);
      } else if (input.type == 'Function Step' && inputPrimaryDBCodeOFChildUUID && !input['UI_ELEMENT_GROUP_UUID']) {
        await updateAttributeForScopeVariable(input['EXISTING_TEST_SET_SCOPE_ATTRIBUTE'], 'Test Set', object['inputTestSetScope']);
      }
    }
    if (input['TEST_CASE_SCOPE_VARIABLE']) {
      if (input['TEST_CASE_SCOPE_VARIABLE'].includes('(:)')) {
        let splitedTestCaseScope = input['TEST_CASE_SCOPE_VARIABLE'].split('(:)');
        let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${splitedTestCaseScope[0]}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
        object['inputTestCaseScope'] = functionQueryData['FUNCTION_NAME'] + ' $ ' + splitedTestCaseScope[1];
      } else {
        object['inputTestCaseScope'] = input['TEST_CASE_SCOPE_VARIABLE'];
      }
      if (input.type == 'Test Case Step' && inputPrimaryDBCodeOFChildUUID && !input['FUNCTION_UUID'] && !input['UI_ELEMENT_GROUP_UUID']) {
        await updateAttributeForScopeVariable(input['EXISTING_TEST_CASE_SCOPE_ATTRIBUTE'], 'Test Case', object['inputTestCaseScope']);
      } else if (input.type == 'Function Step' && inputPrimaryDBCodeOFChildUUID && !input['UI_ELEMENT_GROUP_UUID']) {
        await updateAttributeForScopeVariable(input['EXISTING_TEST_SET_SCOPE_ATTRIBUTE'], 'Test Case', object['inputTestCaseScope']);
      }
    }
    return object;
  }
  async function decideScopePrefix() {
    let str = '';
    if (input['UI_ELEMENT_VALUE_SOURCE'] == 'Select from Scope Variable' && input['EXISTING_SCOPE_VARIABLE']) {
      let selectedAttributeDetails = await setAttributeValue(input['EXISTING_SCOPE_VARIABLE']);
      if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
        let stepDefAttribute = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE WHERE STEP_DEFINITION_ATTRIBUTE_UUID='${selectedAttributeDetails['STEP_DEFINITION_ATTRIBUTE_UUID']}'`;
        let stepDefAttributeData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', stepDefAttribute, input);
        if (stepDefAttributeData && Object.keys(stepDefAttributeData).length) {
          if (stepDefAttributeData['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d') {
            str = '@TSV:';
          } else if (stepDefAttributeData['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d') {
            str = '@TCV:';
          }
        }
      }
    }
    return str;
  }
  function prepareAndWrap(uiElementValueObj) {
    let str = '';
    if (uiElementValueObj && Object.keys(uiElementValueObj).length && uiElementValueObj['UI_ELEMENT_VALUE'] && uiElementValueObj['UI_ELEMENT_VALUE_1']) {
      str = '[' + uiElementValueObj['UI_ELEMENT_VALUE'] + '][' + uiElementValueObj['UI_ELEMENT_VALUE_1'] + ']';
    } else if (uiElementValueObj && Object.keys(uiElementValueObj).length && uiElementValueObj['UI_ELEMENT_VALUE'] && uiElementValueObj['CONFIRM_UI_ELEMENT_VALUE']) {
      str = '[' + uiElementValueObj['UI_ELEMENT_VALUE'] + '][' + uiElementValueObj['CONFIRM_UI_ELEMENT_VALUE'] + ']';
    } else if (uiElementValueObj && Object.keys(uiElementValueObj).length && uiElementValueObj['UI_ELEMENT_VALUE']) {
      str = uiElementValueObj['UI_ELEMENT_VALUE'];
      if (str && str.startsWith(`'`) && str.endsWith(`'`)) {
        str = str.slice(1, -1);
      }
    } else if (uiElementValueObj && Object.keys(uiElementValueObj).length && uiElementValueObj['CELL_VALUE'] && uiElementValueObj['CELL_VALUE_1']) {
      str = '[' + uiElementValueObj['CELL_VALUE'] + '][' + uiElementValueObj['CELL_VALUE_1'] + ']';
    } else if (uiElementValueObj && Object.keys(uiElementValueObj).length && uiElementValueObj['CELL_VALUE']) {
      str = uiElementValueObj['CELL_VALUE'];
      if (str && str.startsWith(`'`) && str.endsWith(`'`)) {
        str = str.slice(1, -1);
      }
    } else if (uiElementValueObj && Object.keys(uiElementValueObj).length && uiElementValueObj['API_ATTRIBIUTE_VALUE']) {
      str = uiElementValueObj['API_ATTRIBIUTE_VALUE'];
      if (str && str.startsWith(`'`) && str.endsWith(`'`)) {
        str = str.slice(1, -1);
      }
    }
    return str;
  }
  if (input.type == 'Test Case Step') {
    inputPageName = input['isMoreThanOneAttribute'] && input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
    inputUIElementName = input['UI_ELEMENT_NAME'];
    inputUIElementType = input['UI_ELEMENT_TYPE'];
    inputUIElementValue = input['UI_ELEMENT_VALUE'];
    inputKeyNameInKeyPad = input['KEY_NAME_IN_KEY_PAD'];
    inputEventName = input['EVENT_NAME'];
    inputConfirmUIElementValue = input['CONFIRM_UI_ELEMENT_VALUE'];
    inputFunctionUUID = input['FUNCTION_UUID'];
    inputUIElementName1 = input['UI_ELEMENT_NAME_1'];
    inputUIElementValue1 = input['UI_ELEMENT_VALUE_1'];
    inputUserActionName = input['USER_ACTION_NAME'];
    inputUserActionType = input['USER_ACTION_TYPE'];
    inputUIElementGroupUUID = input['UI_ELEMENT_GROUP_UUID'];
    inputStepType = input['TEST_CASE_STEP_TYPE'];
    inputPrimaryDBCodeOFParentUUID = input['TEST_CASE_UUID'];
    inputPrimaryDBCodeOFChildUUID = input['TEST_CASE_STEP_UUID'];
    inputPrimaryDBCode = 'TEST_CASE_STEP_UUID';
    inputPageNumber = input['PAGE_NUMBER'];
    inputDataValue = input['DATA_VALUE'];
    inputDataKey = input['DATA_KEY'];
    inputFileName = input['FILE_NAME'];
    inputDocumentParserName = input['DOCUMENT_PARSER_NAME'];
    inputAPIName = input['API_UUID'];
    inputAPIAttributeName = input['API_ATTRIBUTE_NAME'];
    inputAPIAttributeValue = input['API_ATTRIBUTE_VALUE'];
    inputResponseCodeValue = input['RESPONSE_CODE_VALUE'];
    inputUIElementState = input['UI_ELEMENT_STATE'];
    inputTimeout = input['TIMEOUT'];
    inputPageName1 = input['NEXT_PAGE_CONTEXT'];
    inputTimeInterval = input['TIME_INTERVAL'];
    inputAttempts = input['ATTEMPTS'];
    inputColumnHeader = input['COLUMN_HEADER'];
    inputCellValue = input['CELL_VALUE'];
    inputRowNumber = input['ROW_NUMBER'];
    inputTableName = input['TABLE_NAME'];
    inputColumnHeader1 = input['COLUMN_HEADER_1'];
    inputCellValue1 = input['CELL_VALUE_1'];
    inputColumnNumber = input['COLUMN_NUMBER'];
    inputFileFullPath = input['FILE_FULL_PATH'];
    let objectDetails = await refreshGridIfScopeChanged(inputPrimaryDBCodeOFChildUUID);
    inputTestSetScope = objectDetails['inputTestSetScope'] ? objectDetails['inputTestSetScope'] : input['TEST_SET_SCOPE_VARIABLE'];
    inputTestCaseScope = objectDetails['inputTestCaseScope'] ? objectDetails['inputTestCaseScope'] : input['TEST_CASE_SCOPE_VARIABLE'];
  } else if (input.type == 'UI Element Group Step') {
    inputUIElementValue = input['UI_ELEMENT_VALUE'];
    inputUIElementValue1 = input['UI_ELEMENT_VALUE1'];
    inputUIElementName = input['UI_ELEMENT_NAME'];
    inputConfirmUIElementValue = input['CONFIRM_UI_ELEMENT_VALUE'];
    inputUIElementName1 = input['UI_ELEMENT_NAME1'];
    inputUserActionName = input['USER_ACTION_NAME'];
    inputUserActionType = input['USER_ACTION_TYPE'];
    inputUIElementType = input['UI_ELEMENT_TYPE'];
    inputStepType = input['UI_ELEMENT_STEP_FILTER_TYPE'];
    inputPrimaryDBCodeOFParentUUID = input['UI_ELEMENT_GROUP_UUID'];
    inputPrimaryDBCodeOFChildUUID = input['UI_ELEMENT_GROUP_STEP_UUID'];
    inputPrimaryDBCode = 'UI_ELEMENT_GROUP_STEP_UUID';
    inputTimeout = input['TIMEOUT'];
    inputPageName1 = input['NEXT_PAGE_CONTEXT'];
    inputTimeInterval = input['TIME_INTERVAL'];
    inputAttempts = input['ATTEMPTS'];
    inputColumnHeader = input['COLUMN_HEADER'];
    inputCellValue = input['CELL_VALUE'];
    inputRowNumber = input['ROW_NUMBER'];
    inputTableName = input['TABLE_NAME'];
    inputColumnHeader1 = input['COLUMN_HEADER_1'];
    inputCellValue1 = input['CELL_VALUE_1'];
    inputColumnNumber = input['COLUMN_NUMBER'];
    inputFileFullPath = input['FILE_FULL_PATH'];
  } else if (input.type == 'Test Case UI Element Group Step') {
    inputPageName = input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
    inputUIElementName = input['UI_ELEMENT_NAME'];
    inputUIElementType = input['UI_ELEMENT_TYPE'];
    inputUIElementValue = input['UI_ELEMENT_VALUE'];
    inputKeyNameInKeyPad = input['KEY_NAME_IN_KEY_PAD'];
    inputEventName = input['EVENT_NAME'];
    inputConfirmUIElementValue = input['CONFIRM_UI_ELEMENT_VALUE'];
    inputUIElementName1 = input['UI_ELEMENT_NAME_1'];
    inputUIElementValue1 = input['UI_ELEMENT_VALUE_1'];
    inputUserActionName = input['USER_ACTION_NAME'];
    inputUserActionType = input['USER_ACTION_TYPE'];
    inputStepType = input['TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE'];
    inputPrimaryDBCodeOFParentUUID = input['TEST_CASE_STEP_UUID'];
    inputPrimaryDBCodeOFChildUUID = input['UI_ELEMENT_GROUP_STEP_UUID'];
    inputPrimaryDBCode = 'UI_ELEMENT_GROUP_STEP_UUID';
    inputTimeout = input['TIMEOUT'];
    inputPageName1 = input['NEXT_PAGE_CONTEXT'];
    inputTimeInterval = input['TIME_INTERVAL'];
    inputAttempts = input['ATTEMPTS'];
    inputColumnHeader = input['COLUMN_HEADER'];
    inputCellValue = input['CELL_VALUE'];
    inputRowNumber = input['ROW_NUMBER'];
    inputTableName = input['TABLE_NAME'];
    inputColumnHeader1 = input['COLUMN_HEADER_1'];
    inputCellValue1 = input['CELL_VALUE_1'];
    inputColumnNumber = input['COLUMN_NUMBER'];
    inputFileFullPath = input['FILE_FULL_PATH'];
  } else if (input.type == 'Function Step') {
    inputPageName = input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
    inputUIElementName = input['UI_ELEMENT_NAME'];
    inputUIElementType = input['UI_ELEMENT_TYPE'];
    inputUIElementValue = input['UI_ELEMENT_VALUE'];
    inputKeyNameInKeyPad = input['KEY_NAME_IN_KEY_PAD'];
    inputEventName = input['EVENT_NAME'];
    inputConfirmUIElementValue = input['CONFIRM_UI_ELEMENT_VALUE'];
    inputUIElementName1 = input['UI_ELEMENT_NAME_1'];
    inputUIElementValue1 = input['UI_ELEMENT_VALUE_1'];
    inputUserActionName = input['USER_ACTION_NAME'];
    inputUserActionType = input['USER_ACTION_TYPE'];
    inputStepType = input['FUNCTION_STEP_TYPE'];
    inputUIElementGroupUUID = input['UI_ELEMENT_GROUP_UUID'];
    inputPrimaryDBCodeOFParentUUID = input['FUNCTION_UUID'];
    inputPrimaryDBCodeOFChildUUID = input['FUNCTION_STEP_UUID'];
    inputPrimaryDBCode = 'FUNCTION_STEP_UUID';
    inputPageNumber = input['PAGE_NUMBER'];
    inputDataValue = input['DATA_VALUE'];
    inputDataKey = input['DATA_KEY'];
    inputFileName = input['FILE_NAME'];
    inputDocumentParserName = input['DOCUMENT_PARSER_NAME'];
    inputAPIName = input['API_UUID'];
    inputAPIAttributeName = input['API_ATTRIBUTE_NAME'];
    inputAPIAttributeValue = input['API_ATTRIBUTE_VALUE'];
    inputResponseCodeValue = input['RESPONSE_CODE_VALUE'];
    inputUIElementState = input['UI_ELEMENT_STATE'];
    inputTimeout = input['TIMEOUT'];
    inputTimeInterval = input['TIME_INTERVAL'];
    inputAttempts = input['ATTEMPTS'];
    inputPageName1 = input['NEXT_PAGE_CONTEXT'];
    inputColumnHeader = input['COLUMN_HEADER'];
    inputCellValue = input['CELL_VALUE'];
    inputRowNumber = input['ROW_NUMBER'];
    inputTableName = input['TABLE_NAME'];
    inputColumnHeader1 = input['COLUMN_HEADER_1'];
    inputCellValue1 = input['CELL_VALUE_1'];
    inputColumnNumber = input['COLUMN_NUMBER'];
    inputFileFullPath = input['FILE_FULL_PATH'];
    let objectDetails = await refreshGridIfScopeChanged(inputPrimaryDBCodeOFChildUUID);
    inputTestSetScope = objectDetails['inputTestSetScope'] ? objectDetails['inputTestSetScope'] : input['TEST_SET_SCOPE_VARIABLE'];
    inputTestCaseScope = objectDetails['inputTestCaseScope'] ? objectDetails['inputTestCaseScope'] : input['TEST_CASE_SCOPE_VARIABLE'];
  } else if (input.type == 'Function UI Element Group Step') {
    inputPageName = input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
    inputUIElementName = input['UI_ELEMENT_NAME'];
    inputUIElementType = input['UI_ELEMENT_TYPE'];
    inputUIElementValue = input['UI_ELEMENT_VALUE'];
    inputKeyNameInKeyPad = input['KEY_NAME_IN_KEY_PAD'];
    inputEventName = input['EVENT_NAME'];
    inputConfirmUIElementValue = input['CONFIRM_UI_ELEMENT_VALUE'];
    inputUIElementName1 = input['UI_ELEMENT_NAME_1'];
    inputUIElementValue1 = input['UI_ELEMENT_VALUE_1'];
    inputUserActionName = input['USER_ACTION_NAME'];
    inputUserActionType = input['USER_ACTION_TYPE'];
    inputStepType = input['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'];
    inputUIElementGroupUUID = input['UI_ELEMENT_GROUP_UUID'];
    inputPrimaryDBCodeOFParentUUID = input['FUNCTION_STEP_UUID'];
    inputPrimaryDBCodeOFChildUUID = input['UI_ELEMENT_GROUP_STEP_UUID'];
    inputPrimaryDBCode = 'UI_ELEMENT_GROUP_STEP_UUID';
    inputTimeout = input['TIMEOUT'];
    inputPageName1 = input['NEXT_PAGE_CONTEXT'];
    inputTimeInterval = input['TIME_INTERVAL'];
    inputAttempts = input['ATTEMPTS'];
    inputColumnHeader = input['COLUMN_HEADER'];
    inputCellValue = input['CELL_VALUE'];
    inputRowNumber = input['ROW_NUMBER'];
    inputTableName = input['TABLE_NAME'];
    inputColumnHeader1 = input['COLUMN_HEADER_1'];
    inputCellValue1 = input['CELL_VALUE_1'];
    inputColumnNumber = input['COLUMN_NUMBER'];
    inputFileFullPath = input['FILE_FULL_PATH'];
  } else if (input.type == 'Test Case Function Step') {
    inputPageName = input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
    inputUIElementName = input['UI_ELEMENT_NAME'];
    inputUIElementType = input['UI_ELEMENT_TYPE'];
    inputUIElementValue = input['UI_ELEMENT_VALUE'];
    inputKeyNameInKeyPad = input['KEY_NAME_IN_KEY_PAD'];
    inputEventName = input['EVENT_NAME'];
    inputConfirmUIElementValue = input['CONFIRM_UI_ELEMENT_VALUE'];
    inputUIElementName1 = input['UI_ELEMENT_NAME_1'];
    inputUIElementValue1 = input['UI_ELEMENT_VALUE_1'];
    inputUserActionName = input['USER_ACTION_NAME'];
    inputUserActionType = input['USER_ACTION_TYPE'];
    inputStepType = input['TEST_CASE_FUNCTION_STEP_TYPE'];
    inputUIElementGroupUUID = input['UI_ELEMENT_GROUP_UUID'];
    inputPrimaryDBCodeOFParentUUID = input['TEST_CASE_STEP_UUID'];
    inputPrimaryDBCodeOFChildUUID = input['FUNCTION_STEP_UUID'];
    inputPrimaryDBCode = 'FUNCTION_STEP_UUID';
    inputPageNumber = input['PAGE_NUMBER'];
    inputDataValue = input['DATA_VALUE'];
    inputDataKey = input['DATA_KEY'];
    inputFileName = input['FILE_NAME'];
    inputDocumentParserName = input['DOCUMENT_PARSER_NAME'];
    inputAPIName = input['API_UUID'];
    inputAPIAttributeName = input['API_ATTRIBUTE_NAME'];
    inputAPIAttributeValue = input['API_ATTRIBUTE_VALUE'];
    inputResponseCodeValue = input['RESPONSE_CODE_VALUE'];
    inputUIElementState = input['UI_ELEMENT_STATE'];
    inputTimeout = input['TIMEOUT'];
    inputTimeInterval = input['TIME_INTERVAL'];
    inputAttempts = input['ATTEMPTS'];
    inputPageName1 = input['NEXT_PAGE_CONTEXT'];
    inputTestSetScope = input['TEST_SET_SCOPE_VARIABLE'];
    inputTestCaseScope = input['TEST_CASE_SCOPE_VARIABLE'];
    inputColumnHeader = input['COLUMN_HEADER'];
    inputCellValue = input['CELL_VALUE'];
    inputRowNumber = input['ROW_NUMBER'];
    inputTableName = input['TABLE_NAME'];
    inputColumnHeader1 = input['COLUMN_HEADER_1'];
    inputCellValue1 = input['CELL_VALUE_1'];
    inputColumnNumber = input['COLUMN_NUMBER'];
    inputFileFullPath = input['FILE_FULL_PATH'];
  } else if (input.type == 'Test Case Function UI Element Group Step') {
    inputPageName = input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
    inputUIElementName = input['UI_ELEMENT_NAME'];
    inputUIElementType = input['UI_ELEMENT_TYPE'];
    inputUIElementValue = input['UI_ELEMENT_VALUE'];
    inputKeyNameInKeyPad = input['KEY_NAME_IN_KEY_PAD'];
    inputEventName = input['EVENT_NAME'];
    inputConfirmUIElementValue = input['CONFIRM_UI_ELEMENT_VALUE'];
    inputUIElementName1 = input['UI_ELEMENT_NAME_1'];
    inputUIElementValue1 = input['UI_ELEMENT_VALUE_1'];
    inputUserActionName = input['USER_ACTION_NAME'];
    inputUserActionType = input['USER_ACTION_TYPE'];
    inputStepType = input['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'];
    inputPrimaryDBCodeOFParentUUID = input['FUNCTION_STEP_UUID'];
    inputPrimaryDBCodeOFChildUUID = input['UI_ELEMENT_GROUP_STEP_UUID'];
    inputPrimaryDBCode = 'UI_ELEMENT_GROUP_STEP_UUID';
    inputTimeout = input['TIMEOUT'];
    inputPageName1 = input['NEXT_PAGE_CONTEXT'];
    inputTimeInterval = input['TIME_INTERVAL'];
    inputAttempts = input['ATTEMPTS'];
    inputColumnHeader = input['COLUMN_HEADER'];
    inputCellValue = input['CELL_VALUE'];
    inputRowNumber = input['ROW_NUMBER'];
    inputTableName = input['TABLE_NAME'];
    inputColumnHeader1 = input['COLUMN_HEADER_1'];
    inputCellValue1 = input['CELL_VALUE_1'];
    inputColumnNumber = input['COLUMN_NUMBER'];
    inputFileFullPath = input['FILE_FULL_PATH'];
  } else if (input.type == 'View Navigation Step') {
    inputPageName = input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
    inputUIElementName = input['UI_ELEMENT_NAME'];
    inputUIElementType = input['UI_ELEMENT_TYPE'];
    inputUIElementValue = input['UI_ELEMENT_VALUE'];
    inputKeyNameInKeyPad = input['KEY_NAME_IN_KEY_PAD'];
    inputEventName = input['EVENT_NAME'];
    inputConfirmUIElementValue = input['CONFIRM_UI_ELEMENT_VALUE'];
    inputUIElementName1 = input['UI_ELEMENT_NAME_1'];
    inputUIElementValue1 = input['UI_ELEMENT_VALUE_1'];
    inputUserActionName = input['USER_ACTION_NAME'];
    inputUserActionType = input['USER_ACTION_TYPE'];
    inputStepType = input['VIEW_NAVIGATION_STEP_TYPE'];
    inputPrimaryDBCodeOFParentUUID = input['VIEW_UUID'];
    inputPrimaryDBCodeOFChildUUID = input['VIEW_NAVIGATION_STEP_UUID'];
    inputPrimaryDBCode = 'VIEW_NAVIGATION_STEP_UUID';
    inputPageNumber = input['PAGE_NUMBER'];
    inputDataValue = input['DATA_VALUE'];
    inputDataKey = input['DATA_KEY'];
    inputFileName = input['FILE_NAME'];
    inputDocumentParserName = input['DOCUMENT_PARSER_NAME'];
    inputUIElementState = input['UI_ELEMENT_STATE'];
    inputTimeout = input['TIMEOUT'];
    inputTimeInterval = input['TIME_INTERVAL'];
    inputAttempts = input['ATTEMPTS'];
    inputTestSetScope = input['TEST_SET_SCOPE_VARIABLE'];
    inputTestCaseScope = input['TEST_CASE_SCOPE_VARIABLE'];
    inputColumnHeader = input['COLUMN_HEADER'];
    inputCellValue = input['CELL_VALUE'];
    inputRowNumber = input['ROW_NUMBER'];
    inputTableName = input['TABLE_NAME'];
    inputColumnHeader1 = input['COLUMN_HEADER_1'];
    inputCellValue1 = input['CELL_VALUE_1'];
    inputColumnNumber = input['COLUMN_NUMBER'];
    inputFileFullPath = input['FILE_FULL_PATH'];
  } else if (input.type == 'Test Case View Navigation Step' && !input['FUNCTION_UUID'] && !input['FUNCTION_STEP_UUID']) {
    inputPageName = input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
    inputUIElementName = input['UI_ELEMENT_NAME'];
    inputUIElementType = input['UI_ELEMENT_TYPE'];
    inputUIElementValue = input['UI_ELEMENT_VALUE'];
    inputKeyNameInKeyPad = input['KEY_NAME_IN_KEY_PAD'];
    inputEventName = input['EVENT_NAME'];
    inputConfirmUIElementValue = input['CONFIRM_UI_ELEMENT_VALUE'];
    inputUIElementName1 = input['UI_ELEMENT_NAME_1'];
    inputUIElementValue1 = input['UI_ELEMENT_VALUE_1'];
    inputUserActionName = input['USER_ACTION_NAME'];
    inputUserActionType = input['USER_ACTION_TYPE'];
    inputStepType = input['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'];
    inputUIElementGroupUUID = input['UI_ELEMENT_GROUP_UUID'];
    inputPrimaryDBCodeOFParentUUID = input['TEST_CASE_STEP_UUID'];
    inputPrimaryDBCodeOFChildUUID = input['VIEW_NAVIGATION_STEP_UUID'];
    inputPrimaryDBCode = 'VIEW_NAVIGATION_STEP_UUID';
    inputPageNumber = input['PAGE_NUMBER'];
    inputDataValue = input['DATA_VALUE'];
    inputDataKey = input['DATA_KEY'];
    inputFileName = input['FILE_NAME'];
    inputDocumentParserName = input['DOCUMENT_PARSER_NAME'];
    inputAPIName = input['API_UUID'];
    inputAPIAttributeName = input['API_ATTRIBUTE_NAME'];
    inputAPIAttributeValue = input['API_ATTRIBUTE_VALUE'];
    inputResponseCodeValue = input['RESPONSE_CODE_VALUE'];
    inputUIElementState = input['UI_ELEMENT_STATE'];
    inputTimeout = input['TIMEOUT'];
    inputTimeInterval = input['TIME_INTERVAL'];
    inputAttempts = input['ATTEMPTS'];
    inputPageName1 = input['NEXT_PAGE_CONTEXT'];
    inputTestSetScope = input['TEST_SET_SCOPE_VARIABLE'];
    inputTestCaseScope = input['TEST_CASE_SCOPE_VARIABLE'];
    inputColumnHeader = input['COLUMN_HEADER'];
    inputCellValue = input['CELL_VALUE'];
    inputRowNumber = input['ROW_NUMBER'];
    inputTableName = input['TABLE_NAME'];
    inputColumnHeader1 = input['COLUMN_HEADER_1'];
    inputCellValue1 = input['CELL_VALUE_1'];
    inputColumnNumber = input['COLUMN_NUMBER'];
    inputFileFullPath = input['FILE_FULL_PATH'];
  } else if (input.type == 'Test Case View Navigation Step' && input['FUNCTION_UUID'] && input['FUNCTION_STEP_UUID']) {
    inputPageName = input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
    inputUIElementName = input['UI_ELEMENT_NAME'];
    inputUIElementType = input['UI_ELEMENT_TYPE'];
    inputUIElementValue = input['UI_ELEMENT_VALUE'];
    inputKeyNameInKeyPad = input['KEY_NAME_IN_KEY_PAD'];
    inputEventName = input['EVENT_NAME'];
    inputConfirmUIElementValue = input['CONFIRM_UI_ELEMENT_VALUE'];
    inputUIElementName1 = input['UI_ELEMENT_NAME_1'];
    inputUIElementValue1 = input['UI_ELEMENT_VALUE_1'];
    inputUserActionName = input['USER_ACTION_NAME'];
    inputUserActionType = input['USER_ACTION_TYPE'];
    inputStepType = input['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'];
    inputUIElementGroupUUID = input['UI_ELEMENT_GROUP_UUID'];
    inputPrimaryDBCodeOFParentUUID = input['FUNCTION_STEP_UUID'];
    inputPrimaryDBCodeOFChildUUID = input['VIEW_NAVIGATION_STEP_UUID'];
    inputPrimaryDBCode = 'VIEW_NAVIGATION_STEP_UUID';
    inputPageNumber = input['PAGE_NUMBER'];
    inputDataValue = input['DATA_VALUE'];
    inputDataKey = input['DATA_KEY'];
    inputFileName = input['FILE_NAME'];
    inputDocumentParserName = input['DOCUMENT_PARSER_NAME'];
    inputAPIName = input['API_UUID'];
    inputAPIAttributeName = input['API_ATTRIBUTE_NAME'];
    inputAPIAttributeValue = input['API_ATTRIBUTE_VALUE'];
    inputResponseCodeValue = input['RESPONSE_CODE_VALUE'];
    inputUIElementState = input['UI_ELEMENT_STATE'];
    inputTimeout = input['TIMEOUT'];
    inputTimeInterval = input['TIME_INTERVAL'];
    inputAttempts = input['ATTEMPTS'];
    inputPageName1 = input['NEXT_PAGE_CONTEXT'];
    inputTestSetScope = input['TEST_SET_SCOPE_VARIABLE'];
    inputTestCaseScope = input['TEST_CASE_SCOPE_VARIABLE'];
    inputColumnHeader = input['COLUMN_HEADER'];
    inputCellValue = input['CELL_VALUE'];
    inputRowNumber = input['ROW_NUMBER'];
    inputTableName = input['TABLE_NAME'];
    inputColumnHeader1 = input['COLUMN_HEADER_1'];
    inputCellValue1 = input['CELL_VALUE_1'];
    inputColumnNumber = input['COLUMN_NUMBER'];
    inputFileFullPath = input['FILE_FULL_PATH'];
  } else if (input.type == 'Function View Navigation Step') {
    inputPageName = input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
    inputUIElementName = input['UI_ELEMENT_NAME'];
    inputUIElementType = input['UI_ELEMENT_TYPE'];
    inputUIElementValue = input['UI_ELEMENT_VALUE'];
    inputKeyNameInKeyPad = input['KEY_NAME_IN_KEY_PAD'];
    inputEventName = input['EVENT_NAME'];
    inputConfirmUIElementValue = input['CONFIRM_UI_ELEMENT_VALUE'];
    inputUIElementName1 = input['UI_ELEMENT_NAME_1'];
    inputUIElementValue1 = input['UI_ELEMENT_VALUE_1'];
    inputUserActionName = input['USER_ACTION_NAME'];
    inputUserActionType = input['USER_ACTION_TYPE'];
    inputStepType = input['FUNCTION_VIEW_NAVIGATION_STEP_TYPE'];
    inputUIElementGroupUUID = input['UI_ELEMENT_GROUP_UUID'];
    inputPrimaryDBCodeOFParentUUID = input['FUNCTION_STEP_UUID'];
    inputPrimaryDBCodeOFChildUUID = input['VIEW_NAVIGATION_STEP_UUID'];
    inputPrimaryDBCode = 'VIEW_NAVIGATION_STEP_UUID';
    inputPageNumber = input['PAGE_NUMBER'];
    inputDataValue = input['DATA_VALUE'];
    inputDataKey = input['DATA_KEY'];
    inputFileName = input['FILE_NAME'];
    inputDocumentParserName = input['DOCUMENT_PARSER_NAME'];
    inputAPIName = input['API_UUID'];
    inputAPIAttributeName = input['API_ATTRIBUTE_NAME'];
    inputAPIAttributeValue = input['API_ATTRIBUTE_VALUE'];
    inputResponseCodeValue = input['RESPONSE_CODE_VALUE'];
    inputUIElementState = input['UI_ELEMENT_STATE'];
    inputTimeout = input['TIMEOUT'];
    inputTimeInterval = input['TIME_INTERVAL'];
    inputAttempts = input['ATTEMPTS'];
    inputPageName1 = input['NEXT_PAGE_CONTEXT'];
    inputTestSetScope = input['TEST_SET_SCOPE_VARIABLE'];
    inputTestCaseScope = input['TEST_CASE_SCOPE_VARIABLE'];
    inputColumnHeader = input['COLUMN_HEADER'];
    inputCellValue = input['CELL_VALUE'];
    inputRowNumber = input['ROW_NUMBER'];
    inputTableName = input['TABLE_NAME'];
    inputColumnHeader1 = input['COLUMN_HEADER_1'];
    inputCellValue1 = input['CELL_VALUE_1'];
    inputColumnNumber = input['COLUMN_NUMBER'];
    inputFileFullPath = input['FILE_FULL_PATH'];
  }
  let stepDefAttributeQueryData = getStepAttributeData(stepDefAttributeQueryDataList, input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
  let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
  let stepDefTemplateVerbiageName =
    stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';
  let isDataElementNameTypePassword = false;
  let isDataElementName1TypePassword = false;
  if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
    let actualData;
    for (let codeDesc of stepDefAttributeQueryData) {
      switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
        case '57b76ab3-8112-4343-af0f-49643c808bf7':
          {
            const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID='${inputPageName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, pageNewQuery, input);
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
              return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
            });
          }
          break;
        case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
          {
            const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${inputUIElementName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
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
            const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID='${inputUIElementType}'`;
            let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementTypeQuery, input);
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
              return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
            });
          }
          break;
        case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
          {
            if (msg.payload.apiRequestBody.action === 'Test Data') {
              inputUIElementValue = input['TEST_DATA_VALUE'];
            }
            inputUIElementValue = (await decideScopePrefix()) + inputUIElementValue;
            actualData = inputUIElementValue ? `'` + inputUIElementValue + `'` : `' '`;
            uiElementValueObject['UI_ELEMENT_VALUE'] = actualData;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<UI Element Value>',
              actualData
                ? function () {
                    if (isDataElementNameTypePassword) {
                      return '********';
                    } else {
                      return actualData;
                    }
                  }
                : `' '`
            );
          }
          break;
        case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
          {
            actualData = inputKeyNameInKeyPad ? `'` + inputKeyNameInKeyPad + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Key Name in Keypad>', function () {
              return actualData;
            });
          }
          break;
        case '005d158d-428c-4bca-ae2d-1c3f9630b549':
          {
            actualData = `'` + input['EVENT_NAME'] + `'`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Event Type>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
          actualData = inputConfirmUIElementValue ? `'` + inputConfirmUIElementValue + `'` : `' '`;
          uiElementValueObject['CONFIRM_UI_ELEMENT_VALUE'] = actualData;
          stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
            '<Confirm UI Element Value>',
            actualData
              ? function () {
                  return actualData;
                }
              : `' '`
          );
          break;
        case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
          {
            if (inputFunctionUUID) {
              isFunctionOrUIElementGroup = true;
              const functionNameQuery = `SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID='${inputFunctionUUID}'`;
              let functionNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, functionNameQuery, input);
              stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                return `'` + functionNameQueryData['FUNCTION_NAME'] + `'`;
              });
            }
          }
          break;
        case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
          {
            const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${inputUIElementName1}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name 1>', function () {
              return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
            });
            if (uiElementQueryData['UI_ELEMENT_NAME'] && uiElementQueryData['UI_ELEMENT_NAME'].toUpperCase() == 'PASSWORD') {
              isDataElementName1TypePassword = true;
            }
          }
          break;
        case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
          {
            actualData = inputUIElementValue1 ? `'` + inputUIElementValue1 + `'` : `' '`;
            uiElementValueObject['UI_ELEMENT_VALUE_1'] = actualData;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<UI Element Value 1>',
              actualData
                ? function () {
                    if (isDataElementName1TypePassword) {
                      return '********';
                    } else {
                      return actualData;
                    }
                  }
                : `' '`
            );
          }
          break;
        case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
          {
            const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${inputUserActionName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
              return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
            });
          }
          break;
        case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
          {
            const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID ='${inputUserActionType}'`;
            let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementTypeQuery, input);
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
              return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
            });
          }
          break;
        case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
          {
            if (inputUIElementGroupUUID) {
              isFunctionOrUIElementGroup = true;
              let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP WHERE UI_ELEMENT_GROUP_UUID='${inputUIElementGroupUUID}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let uiElementGroupStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input);
              stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                return `'` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + `'`;
              });
            }
          }
          break;
        case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
          {
            actualData = inputPageNumber ? `'` + inputPageNumber + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Page Number>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
          {
            actualData = inputDataKey ? `'` + inputDataKey + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Data Key>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
          {
            actualData = inputDataValue ? `'` + inputDataValue + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Data Value>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case 'ceb66327-216f-42fd-845b-9f4543c62baa':
          {
            actualData = inputFileName ? `'` + inputFileName + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<File Name>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
          {
            actualData = inputDocumentParserName ? `'` + inputDocumentParserName + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Document Parser Name>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
          {
            const apiQuery = `SELECT API_NAME FROM API_NEW WHERE API_UUID='${inputAPIName}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let apiQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, apiQuery, input);
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
              return `'` + apiQueryData['API_NAME'] + `'`;
            });
          }
          break;
        case '46136260-2e33-11ef-b3ef-e52f192c3af0':
          {
            const apiAttributeQuery = `SELECT ATTRIBUTE_NAME FROM API_ATTRIBUTE WHERE API_ATTRIBUTE_UUID ='${inputAPIAttributeName}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let apiAttributeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, apiAttributeQuery, input);
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
              return `'` + apiAttributeQueryData['ATTRIBUTE_NAME'] + `'`;
            });
          }
          break;
        case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
          {
            if (msg.payload.apiRequestBody.action === 'Test Data') {
              inputAPIAttributeValue = input['TEST_DATA_VALUE'];
            }
            inputAPIAttributeValue = (await decideScopePrefix()) + inputAPIAttributeValue;
            actualData = inputAPIAttributeValue ? `'` + inputAPIAttributeValue + `'` : `' '`;
            uiElementValueObject['API_ATTRIBUTE_VALUE'] = actualData;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<API Attribute Value>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case '833eb770-2e33-11ef-9033-4bb93e602d01':
          {
            actualData = inputResponseCodeValue ? `'` + inputResponseCodeValue + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Response Status Code>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd':
          {
            const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID ='${inputPageName1}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, pageNewQuery, input);
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
              return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
            });
          }
          break;
        case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
          {
            actualData = inputUIElementState ? `'` + inputUIElementState + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<UI Element State>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
          {
            actualData = inputTimeout ? `'` + inputTimeout + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Timeout>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
          {
            actualData = inputTestSetScope ? `'` + inputTestSetScope + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Test Set Scope Variable>',
              actualData
                ? function () {
                    if (isDataElementNameTypePassword) {
                      return '********';
                    } else {
                      return actualData;
                    }
                  }
                : `' '`
            );
          }
          break;
        case '842981e7-e484-11ef-904e-02c8cad0208d':
          {
            actualData = inputTestCaseScope ? `'` + inputTestCaseScope + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Test Case Scope Variable>',
              actualData
                ? function () {
                    if (isDataElementNameTypePassword) {
                      return '********';
                    } else {
                      return actualData;
                    }
                  }
                : `' '`
            );
          }
          break;
        case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
          {
            actualData = inputTimeInterval ? `'` + inputTimeInterval + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Time Interval>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
          {
            actualData = inputAttempts ? `'` + inputAttempts + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Attempts>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
          {
            const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${inputColumnHeader}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header>', function () {
              return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
            });
          }
          break;
        case '75b16425-1531-4cee-8c09-30f5be70c4b0':
          {
            if (msg.payload.apiRequestBody.action === 'Test Data') {
              inputCellValue = input['TEST_DATA_VALUE'];
            }
            actualData = inputCellValue ? `'` + inputCellValue + `'` : `' '`;
            uiElementValueObject['CELL_VALUE'] = actualData;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Cell Value>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
          {
            actualData = inputRowNumber ? `'` + inputRowNumber + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Row Number>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
          {
            const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${inputTableName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Table Name>', function () {
              return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
            });
          }
          break;
        case '078e6534-f38f-4aad-b89d-cad8216ad86b':
          {
            const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID='${inputColumnHeader1}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header 1>', function () {
              return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
            });
          }
          break;
        case 'ba1ef281-412a-4544-b615-7767b06eb489':
          {
            actualData = inputCellValue1 ? `'` + inputCellValue1 + `'` : `' '`;
            uiElementValueObject['CELL_VALUE_1'] = actualData;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Cell Value 1>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
          {
            actualData = inputColumnNumber ? `'` + inputColumnNumber + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<Column Number>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
        case '28058e26-fa09-42fb-868a-1988bd0a746c':
          {
            actualData = inputFileFullPath ? `'` + inputFileFullPath + `'` : `' '`;
            stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
              '<File Full Path>',
              actualData
                ? function () {
                    return actualData;
                  }
                : `' '`
            );
          }
          break;
      }
    }
  }
  msg.payload.result['modifyOtherCard'] = {};
  let dataGridCard = '';
  if (input.type == 'Test Case Step') {
    dataGridCard = inputPrimaryDBCodeOFParentUUID + '_3e5b3bf2-96cc-4ec3-84a6-45fab6e0e3e0_7c466db3-d115-4e9e-b088-294c781e9735';
  } else if (input.type == 'UI Element Group Step') {
    dataGridCard = inputPrimaryDBCodeOFParentUUID + '_e339867b-25bb-4cf3-9bc7-c4a12d576a0f_59c08d77-f1b5-11ee-bbba-31faf16f32eb';
  } else if (input.type == 'Test Case UI Element Group Step') {
    dataGridCard = input.UNQ_UUID_FOR_REFRESH + '_76198730-a92c-4d7b-a455-47afe1c94c93_a8b99757-ddaf-4156-b673-b39990057a13';
    msg.payload.result['pk'] = inputPrimaryDBCodeOFChildUUID;
  } else if (input.type == 'Function Step') {
    dataGridCard = inputPrimaryDBCodeOFParentUUID + '_c48b1c6e-931a-4502-baf4-0453ed265921_474c8457-dc52-11ee-bbad-c3828f5505d2';
  } else if (input.type == 'Function UI Element Group Step') {
    dataGridCard = input.UNQ_UUID_FOR_REFRESH + '_f12752e7-6ed6-4bf1-8ba8-c701303e3a4d_1762d383-d818-4bbb-83a6-3cbefd4728a8';
    msg.payload.result['pk'] = inputPrimaryDBCodeOFChildUUID;
  } else if (input.type == 'Test Case Function Step') {
    dataGridCard = input.UNQ_UUID_FOR_REFRESH + '_76198730-a92c-4d7b-a455-47afe1c94c93_26986e06-5ad4-472e-8f01-04fde7ed0182';
    msg.payload.result['pk'] = inputPrimaryDBCodeOFChildUUID;
  } else if (input.type == 'Test Case Function UI Element Group Step') {
    dataGridCard = input.UNQ_UUID_FOR_REFRESH + '_3dcd6c34-ea14-4192-a7cb-4586280b0a2e_27b3d04a-ae67-4140-ace8-1d532fe56245';
    msg.payload.result['pk'] = inputPrimaryDBCodeOFChildUUID;
  } else if (input.type == 'View Navigation Step') {
    const pageViewQuery = `SELECT IS_DEFAULT_VIEW FROM PAGE_VIEW WHERE VIEW_UUID=:VIEW_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let pageViewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, pageViewQuery, input);
    if (pageViewQueryData && Object.keys(pageViewQueryData).length && pageViewQueryData['IS_DEFAULT_VIEW'] == 'Yes') {
      dataGridCard = inputPrimaryDBCodeOFParentUUID + '_7adf03e4-9008-458d-a064-f3a061d308de_480f4c57-48b4-11ef-bdb4-bf6e65503eee';
    } else if (pageViewQueryData && Object.keys(pageViewQueryData).length && pageViewQueryData['IS_DEFAULT_VIEW'] == 'No') {
      dataGridCard = inputPrimaryDBCodeOFParentUUID + '_90d4210d-c3fe-4597-8f6d-94f25173c3d4_480f4c57-48b4-11ef-bdb4-bf6e65503eee';
    }
  } else if (input.type == 'Test Case View Navigation Step' && !input['FUNCTION_UUID'] && !input['FUNCTION_STEP_UUID']) {
    dataGridCard = input.UNQ_UUID_FOR_REFRESH + '_76198730-a92c-4d7b-a455-47afe1c94c93_4fe0ae52-6878-444e-a81c-783f9dce29bf';
    msg.payload.result['pk'] = inputPrimaryDBCodeOFChildUUID;
  } else if (input.type == 'Test Case View Navigation Step' && input['FUNCTION_UUID'] && input['FUNCTION_STEP_UUID']) {
    const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID AND FUNCTION_STEP_UUID=:FUNCTION_STEP_UUID AND TEST_CASE_STEP_UUID=:TEST_CASE_STEP_UUID`;
    let testCaseFunctionStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, testCaseFunctionStepQuery, input);
    if (testCaseFunctionStepQueryData && Object.keys(testCaseFunctionStepQueryData).length) {
      inputPrimaryDBCodeOFParentUUID = testCaseFunctionStepQueryData['TEST_CASE_FUNCTION_STEP_UUID'];
    }
    dataGridCard = input.UNQ_UUID_FOR_REFRESH + '_3dcd6c34-ea14-4192-a7cb-4586280b0a2e_b1e92269-ce43-4965-96e8-59c48d6a6e7f';
    msg.payload.result['pk'] = inputPrimaryDBCodeOFChildUUID;
  } else if (input.type == 'Function View Navigation Step') {
    dataGridCard = input.UNQ_UUID_FOR_REFRESH + '_f12752e7-6ed6-4bf1-8ba8-c701303e3a4d_01d866ac-12e4-4d28-901c-8ac0b37918de';
    msg.payload.result['pk'] = inputPrimaryDBCodeOFChildUUID;
  }
  msg.payload.result['message'] = 'Updated Successfully';
  msg.payload.result.modifyOtherCard[dataGridCard] = [
    {
      parameter: 'data',
      parameterKey: inputPrimaryDBCode,
      type: 'PortalDataGrid',
      parameterKeyValue: inputPrimaryDBCodeOFChildUUID,
      changedData: {
        ATTRIBUTE_KEYS: stepDefTemplateVerbiageName,
        ...(['Test Case Step', 'Test Case UI Element Group Step', 'Test Case Function Step', 'Test Case View Navigation Step', 'Test Case Function UI Element Group Step'].includes(input.type) &&
          msg.payload.apiRequestBody.action != 'Test Data' && { TEST_DATA_VALUE: prepareAndWrap(uiElementValueObject) })
      }
    },
    ...changedDataArray
  ];
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
