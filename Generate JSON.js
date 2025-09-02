function decideScopePrefix(uiElementValueData) {
  let str = uiElementValueData['SCOPE_VARIABLE_TYPE'] == 'Test Case' ? '@TCV:' : uiElementValueData['SCOPE_VARIABLE_TYPE'] == 'Test Set' ? '@TSV:' : '';
  return str;
}
function excludeAttribute(attributeList, stepAttributeID) {
  const filteredData = attributeList.filter((item) => item.STEP_DEFINITION_ATTRIBUTE_UUID !== stepAttributeID);
  return filteredData;
}
function transformApiDataMultiple(apiList, attributeList) {
  const attributesByApiId = attributeList.reduce((acc, attr) => {
    const apiId = attr['API ID'];
    if (!acc[apiId]) acc[apiId] = [];
    acc[apiId].push({
      apiId: String(attr['API ID']),
      attributeId: String(attr['API Attribute ID']),
      attributeName: attr['Attribute Name'],
      attributeType: attr['Attribute Type'],
      locatorType: attr['Attribute Locator Type'],
      locatorValue: attr['Attribute Locator Value'] || '',
      status: attr['status'],
      uuid: attr['API Attribute UUID']
    });
    return acc;
  }, {});
  return apiList.map((api) => ({
    uuid: api['API UUID'],
    apiId: String(api['API ID']),
    apiName: api['API Name'],
    url: api['API URL'],
    headers: api['API Header'] || {},
    auth: api['API Auth'] || {},
    status: api['status'],
    useProxy: api['Use Proxy Indicator'],
    attributes: attributesByApiId[api['API ID']] || []
  }));
}
function escapeSingleQuote(inpt) {
  let output = '';
  const backslash = String.fromCharCode(92);
  const doubleinvertedcomma = String.fromCharCode(34);
  if (inpt && inpt.length) {
    for (let i = 0; i < inpt.length; i++) {
      if ((inpt[i] === `'` || inpt[i] === '`' || inpt[i] === doubleinvertedcomma) && i !== 0 && i !== inpt.length - 1) {
        output += backslash + inpt[i];
      } else {
        output += inpt[i];
      }
    }
  }
  return output;
}
function getFunctionDataFromAttributeValue(attributeValueQueryData, stepDefArrributeId) {
  let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
  if (result && result.length) {
    return result[0]['FUNCTION_UUID'];
  } else {
    return '';
  }
}
function replaceKeyword(dataStr) {
  let str = '';
  if (dataStr) {
    str = dataStr.replace(/[']+/g, '');
  }
  return str;
}
function getDataFromAttributeValue(attributeValueQueryData, stepDefArrributeId, attributeData) {
  let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
  if (result && result.length) {
    return result[0][attributeData] ? result[0][attributeData] : '';
  } else {
    return '';
  }
}
function extactUIElementValueStepAttributeDetails(list, attributeId) {
  if (list && list.length) {
    return list.filter((item) => item.STEP_DEFINITION_ATTRIBUTE_MASTER_UUID == attributeId);
  } else {
    return [];
  }
}
function checkIsUIElementValueAttributeEmpty(attributeValueQueryData, stepDefArrributeId, attributeData) {
  let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
  if (result && result.length) {
    return result[0] && result[0]['SCOPE_VARIABLE_UUID'] ? false : result[0][attributeData] ? false : true;
  } else {
    return false;
  }
}
function removeDataFromList(testCaseStepList) {
  let newList = [];
  for (let data of testCaseStepList) {
    if (!data['isItemRemove']) {
      newList.push(data);
    }
  }
  return newList;
}
async function ConcatinateURL(data) {
  const returnData = [];
  for (const item of data) {
    const { IS_BASE_URL_OVERRIDDEN, ...rest } = item;
    if (item['Page Direct Access URL'] && item['Page Direct Access URL'].trim().length > 0) {
      if (IS_BASE_URL_OVERRIDDEN == 'Yes') {
        const pageOverrideQuery = `SELECT url.BASE_URL FROM APPLICATION_ENVIRONMENT_BASE_URL url JOIN PAGE_OVERRIDE_BASE_URL po ON url.APPLICATION_ENVIRONMENT_BASE_URL_UUID = po.APPLICATION_ENVIRONMENT_BASE_URL_UUID WHERE url.APPLICATION_ENVIRONMENT_UUID = '${input.APPLICATION_ENVIRONMENT_UUID}' AND po.PAGE_UUID = '${item['Page UUID']}'`;
        const pageOverrideData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageOverrideQuery, input);
        if (pageOverrideData && pageOverrideData[0] && pageOverrideData[0]['BASE_URL']) {
          rest['Page Direct Access URL'] = pageOverrideData[0]['BASE_URL'] + '/' + rest['Page Direct Access URL'];
        } else {
          rest['Page Direct Access URL'] = input.APPLICATION_ENVIRONMENT_BASE_URL + '/' + rest['Page Direct Access URL'];
        }
      } else {
        rest['Page Direct Access URL'] = input.APPLICATION_ENVIRONMENT_BASE_URL + '/' + rest['Page Direct Access URL'];
      }
    }
    returnData.push(rest);
  }
  return returnData;
}
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
function isValidUUID(uuid) {
  if (typeof uuid !== 'string' || uuid.trim() == '') {
    return false;
  }
  const parts = uuid && uuid.split('-');
  if (parts.length == 5 && parts[0].length <= 10 && parts[1].length <= 10 && parts[2].length <= 10 && parts[3].length <= 10 && parts[4].length <= 15) {
    return parts.every((part) => /^[a-f0-9]+$/i.test(part));
  }
  return false;
}
function getChildAttributeData(attributeValueQueryDataEntries, primaryIds, columnName) {
  let attributeValueQueryData = attributeValueQueryDataEntries.filter((item) => item[columnName] == primaryIds);
  if (attributeValueQueryData && attributeValueQueryData.length) {
    return attributeValueQueryData;
  } else {
    return [];
  }
}
function getPageDetails(pageList, pageIds) {
  let pageNewQueryData = pageList.filter((item) => item['PAGE_UUID'] == pageIds);
  if (pageNewQueryData && pageNewQueryData.length) {
    return pageNewQueryData[0];
  } else {
    return {};
  }
}
function getFunctionDetails(functionList, functionIds) {
  let functionListData = functionList.filter((item) => item['FUNCTION_UUID'] == functionIds);
  if (functionListData && functionListData.length) {
    return functionListData[0];
  } else {
    return {};
  }
}
function getUIElementGroupDetails(uiElementGroupQueryDataList, uiElementGroupIds) {
  let uiElementGroupQueryDataListData = uiElementGroupQueryDataList.filter((item) => item['UI_ELEMENT_GROUP_UUID'] == uiElementGroupIds);
  if (uiElementGroupQueryDataListData && uiElementGroupQueryDataListData.length) {
    return uiElementGroupQueryDataListData[0];
  } else {
    return {};
  }
}
function getUIElementDetails(uiElementList, uiElementIds) {
  const uiElementQueryData = uiElementList.filter((item) => item['UI_ELEMENT_UUID'] == uiElementIds);
  if (uiElementQueryData && uiElementQueryData.length) {
    return uiElementQueryData[0];
  } else {
    return {};
  }
}
function getUIElementType(uiElementList, uiElementTypeList, uiElementIds) {
  const uiElementQueryData = uiElementList.filter((item) => item['UI_ELEMENT_UUID'] == uiElementIds);
  if (uiElementQueryData && uiElementQueryData.length) {
    let uiElementTypeData = uiElementTypeList.filter((item) => item['UI_ELEMENT_TYPE_UUID'] == uiElementQueryData[0]['UI_ELEMENT_TYPE']);
    if (uiElementTypeData && uiElementTypeData.length) {
      return uiElementTypeData[0];
    } else {
      return {};
    }
  } else {
    return {};
  }
}
function getApiDetails(apiList, apiIds) {
  const apiListData = apiList.filter((item) => item['API_UUID'] == apiIds);
  if (apiListData && apiListData.length) {
    return apiListData[0];
  } else {
    return {};
  }
}
function getApiAttributeDetails(apiAttributeList, apiAttributeIds) {
  const apiAttributeListData = apiAttributeList.filter((item) => item['API_ATTRIBUTE_UUID'] == apiAttributeIds);
  if (apiAttributeListData && apiAttributeListData.length) {
    return apiAttributeListData[0];
  } else {
    return {};
  }
}
async function fetchPageDetails(attributeIds) {
  if (attributeIds) {
    let pagesQuery = `SELECT * from PAGE where PAGE_UUID in (${attributeIds}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
    let pageQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, pagesQuery, input);
    return pageQueryDataList;
  } else {
    return [];
  }
}
async function fetchUIElementsDetails(attributeIds) {
  if (attributeIds) {
    let uiElementQuery = `SELECT * from UI_ELEMENT where UI_ELEMENT_UUID in (${attributeIds}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
    let uiElementDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, uiElementQuery, input);
    return uiElementDataList;
  } else {
    return [];
  }
}
async function fetchFunctionDetails(attributeIds) {
  if (attributeIds) {
    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in (${attributeIds}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
    let functionQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, functionQuery, input);
    return functionQueryDataList;
  } else {
    return [];
  }
}
async function fetchUIElementGroupDetails(attributeIds) {
  if (attributeIds) {
    let uiElementGroupQuery = `SELECT * FROM UI_ELEMENT_GROUP WHERE UI_ELEMENT_GROUP_UUID in (${attributeIds}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
    let uiElementGroupQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, uiElementGroupQuery, input);
    return uiElementGroupQueryDataList;
  } else {
    return [];
  }
}
async function fetchApiDetails(attributeIds) {
  if (attributeIds) {
    let apiQuery = `SELECT * FROM API_NEW WHERE API_UUID in (${attributeIds}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
    let apiQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, apiQuery, input);
    return apiQueryDataList;
  } else {
    return [];
  }
}
async function fetchApiAttributeDetails(attributeIds) {
  if (attributeIds) {
    let apiAttributeQuery = `SELECT * FROM API_ATTRIBUTE WHERE API_ATTRIBUTE_UUID in (${attributeIds}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
    let apiAttributeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, apiAttributeQuery, input);
    return apiAttributeQueryDataList;
  } else {
    return [];
  }
}
async function fetchChildAttributeFromAttributeTable(queryListMap) {
  let attributeValueQueryDataEntries = [];
  let attrValues = [];
  let object = {};
  for (let queries of queryListMap) {
    if (queries['primaryKeys']) {
      const attributeValueQuery = `SELECT * FROM ${queries['CHILD_ATTRIBUTE_TABLE_NAME']} WHERE ${queries['PRIMARY_COLUMN_NAME']} in (${queries['primaryKeys']}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      let attributeValueQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', attributeValueQuery, input);
      if (attributeValueQueryDataList && attributeValueQueryDataList.length) {
        let childAttrdata = queries['CHILD_ATTRIBUTE_DATA'];
        let newList = attributeValueQueryDataList.map((item) => item[childAttrdata]);
        attrValues = attrValues.concat(newList);
        attributeValueQueryDataEntries = attributeValueQueryDataEntries.concat(attributeValueQueryDataList);
      }
    }
  }
  object['attributeValueQueryDataEntries'] = attributeValueQueryDataEntries;
  object['attrValues'] = attrValues;
  return object;
}
function testCaseStepNormalQueryObject(primaryIds) {
  let object = {};
  object['primaryKeys'] = primaryIds;
  object['PRIMARY_COLUMN_NAME'] = 'TEST_CASE_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'TEST_CASE_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'TEST_CASE_STEP_ATTRIBUTE_DATA';
  return object;
}
function testCaseNavigationStepQueryObject(primaryIds) {
  let object = {};
  object['primaryKeys'] = primaryIds;
  object['PRIMARY_COLUMN_NAME'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA';
  return object;
}
function testCaseFunctionStepQueryObject(primaryIds) {
  let object = {};
  object['primaryKeys'] = primaryIds;
  object['PRIMARY_COLUMN_NAME'] = 'TEST_CASE_FUNCTION_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA';
  return object;
}
function testCaseFunctionNavigationStepQueryObject(primaryIds) {
  let object = {};
  object['primaryKeys'] = primaryIds;
  object['PRIMARY_COLUMN_NAME'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA';
  return object;
}
function testCaseFunctionUIElementGroupStepQueryObject(primaryIds) {
  let object = {};
  object['primaryKeys'] = primaryIds;
  object['PRIMARY_COLUMN_NAME'] = 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA';
  return object;
}
function testCaseUIElementGroupStepQueryObject(primaryIds) {
  let object = {};
  object['primaryKeys'] = primaryIds;
  object['PRIMARY_COLUMN_NAME'] = 'TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA';
  return object;
}
function uIElementGroupStepQueryObject(primaryIds) {
  let object = {};
  object['primaryKeys'] = primaryIds;
  object['PRIMARY_COLUMN_NAME'] = 'UI_ELEMENT_GROUP_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA';
  return object;
}
function functionStepNormalQueryObject(primaryIds) {
  let object = {};
  object['primaryKeys'] = primaryIds;
  object['PRIMARY_COLUMN_NAME'] = 'FUNCTION_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'FUNCTION_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'FUNCTION_STEP_ATTRIBUTE_DATA';
  return object;
}
function functionNavigationStepQueryObject(primaryIds) {
  let object = {};
  object['primaryKeys'] = primaryIds;
  object['PRIMARY_COLUMN_NAME'] = 'FUNCTION_VIEW_NAVIGATION_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA';
  return object;
}
function functionUIElementGroupStepNormalQueryObject(primaryIds) {
  let object = {};
  object['primaryKeys'] = primaryIds;
  object['PRIMARY_COLUMN_NAME'] = 'FUNCTION_UI_ELEMENT_GROUP_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA';
  return object;
}
function viewNavigationStepQueryObject(primaryIds) {
  let object = {};
  object['primaryKeys'] = primaryIds;
  object['PRIMARY_COLUMN_NAME'] = 'VIEW_NAVIGATION_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA';
  return object;
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
    actualUIElementUUID = getUIElementIdFromAttribute[0][data['CHILD_ATTRIBUTE_DATA']];
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
function getUIElementValueAttributeValue(attributeValueQueryData, stepDefArrributeId) {
  let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
  if (result && result.length && input) {
    return result[0];
  } else {
    return {};
  }
}
function concatePrimaryKeys(list) {
  return [...new Set(list.map((item) => item['Test Case UUID']).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ');
}
async function fetchTestData(primaryKeyIds) {
  let testDataQuery = `SELECT tsds.EXCEL_COLUMN_POSITION as TEST_DATA_COLUMN_ID,tsD.TEST_DATA_ROW_ID,tsD.FUNCTION_UUID,tsD.FUNCTION_STEP_UUID,tsD.UI_ELEMENT_GROUP_UUID,tsD.UI_ELEMENT_GROUP_STEP_UUID,tsD.VIEW_UUID,tsD.VIEW_NAVIGATION_STEP_UUID,tsD.TEST_CASE_UUID, tsD.TEST_CASE_STEP_UUID,tsD.TEST_DATA_VALUE,tsds.TEST_DATA_SET_UUID FROM TEST_DATA tsD , TEST_DATA_SET tsds where tsds.PARENT_UUID = tsD.TEST_CASE_UUID and tsD.TEST_DATA_SET_UUID = tsds.TEST_DATA_SET_UUID and TEST_CASE_UUID in(${
    primaryKeyIds ? primaryKeyIds : `''`
  }) AND tsds.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by tsD.TEST_DATA_ROW_ID asc`;
  let testDataQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testDataQuery, input);
  return testDataQueryData && testDataQueryData.length ? testDataQueryData : [];
}
function getStepKey(td, step) {
  return [
    normalize(td.TEST_CASE_STEP_UUID) === normalize(step['Test Case Step UUID']) ? normalize(step['Test Case Step UUID']) : '',
    normalize(td.TEST_CASE_UUID) === normalize(step['Test Case UUID']) ? normalize(step['Test Case UUID']) : '',
    normalize(td.FUNCTION_UUID) === normalize(step.FunctionKey) ? normalize(step.FunctionKey) : '',
    normalize(td.FUNCTION_STEP_UUID) === normalize(step.FunctionStepKey) ? normalize(step.FunctionStepKey) : '',
    normalize(td.UI_ELEMENT_GROUP_UUID) === normalize(step.UIElementGroupKey) ? normalize(step.UIElementGroupKey) : '',
    normalize(td.UI_ELEMENT_GROUP_STEP_UUID) === normalize(step.UIElementGroupStepKey) ? normalize(step.UIElementGroupStepKey) : '',
    normalize(td.VIEW_NAVIGATION_STEP_UUID) === normalize(step.ViewNavigationStepKey) ? normalize(step.ViewNavigationStepKey) : ''
  ].join('|');
}
function processTestCaseSteps(testData, testCaseStepNormalQueryData) {
  debugger;
  function groupBy(array, key) {
    return array.reduce((result, item) => {
      const groupKey = item[key] || ' ';
      if (!result[groupKey]) result[groupKey] = [];
      result[groupKey].push(item);
      return result;
    }, {});
  }
  function replaceAngleBrackets(stepName, testDataValue) {
    const parts = testDataValue.split(']');
    const values = [];
    for (let part of parts) {
      if (part.includes('[')) {
        values.push(part.split('[')[1] || '');
      }
    }
    while (values.length < (stepName.match(/<[^>]*>/g) || []).length) {
      values.push('');
    }
    let index = 0;
    return stepName.replace(/<[^>]*>/g, () => `'${values[index++] || ''}'`);
  }
  let multipliedData = [];
  let stepsWithBracketReplacement = new Set();
  let data = [];
  const testCaseGroups = groupBy(testData, 'TEST_CASE_UUID');
  Object.entries(testCaseGroups).forEach(([testCaseUUID, caseRows]) => {
    const dataSetGroups = groupBy(caseRows, 'TEST_DATA_SET_UUID');
    Object.entries(dataSetGroups).forEach(([dataSetKey, groupRows]) => {
      let copy = JSON.parse(JSON.stringify(testCaseStepNormalQueryData));
      copy = copy
        .filter((step) => normalize(step['Test Case UUID']) === normalize(testCaseUUID))
        .map((step) => {
          let match = groupRows.find(
            (td) =>
              normalize(td.TEST_CASE_STEP_UUID) === normalize(step['Test Case Step UUID']) &&
              normalize(td.TEST_CASE_UUID) === normalize(step['Test Case UUID']) &&
              normalize(td.FUNCTION_UUID) === normalize(step.FunctionKey) &&
              normalize(td.FUNCTION_STEP_UUID) === normalize(step.FunctionStepKey) &&
              normalize(td.UI_ELEMENT_GROUP_UUID) === normalize(step.UIElementGroupKey) &&
              normalize(td.UI_ELEMENT_GROUP_STEP_UUID) === normalize(step.UIElementGroupStepKey) &&
              normalize(td.VIEW_NAVIGATION_STEP_UUID) === normalize(step.ViewNavigationStepKey)
          );
          if (!match) {
            match = caseRows.find(
              (td) =>
                !td.TEST_DATA_SET_UUID &&
                normalize(td.TEST_CASE_STEP_UUID) === normalize(step['Test Case Step UUID']) &&
                normalize(td.TEST_CASE_UUID) === normalize(step['Test Case UUID']) &&
                normalize(td.FUNCTION_UUID) === normalize(step.FunctionKey) &&
                normalize(td.FUNCTION_STEP_UUID) === normalize(step.FunctionStepKey) &&
                normalize(td.UI_ELEMENT_GROUP_UUID) === normalize(step.UIElementGroupKey) &&
                normalize(td.UI_ELEMENT_GROUP_STEP_UUID) === normalize(step.UIElementGroupStepKey) &&
                normalize(td.VIEW_NAVIGATION_STEP_UUID) === normalize(step.ViewNavigationStepKey)
            );
          }
          let value = match ? match.TEST_DATA_VALUE : '';
          if (value.includes('[') && value.includes(']')) {
            step['Test Case Step Name'] = replaceAngleBrackets(step['Test Case Step Name'], value);
            stepsWithBracketReplacement.add(getStepKey(match, step));
          } else {
            step['Test Case Step Name'] = step['Test Case Step Name'].replace(/<.*?>/g, `'${value}'`);
          }
          return step;
        });
      multipliedData.push(...copy);
    });
  });
  multipliedData = multipliedData.filter((row) => {
    const stepName = row['Test Case Step Name'];
    const stepKey = [
      normalize(row['Test Case Step UUID']),
      normalize(row['Test Case UUID']),
      normalize(row.FunctionKey),
      normalize(row.FunctionStepKey),
      normalize(row.UIElementGroupKey),
      normalize(row.UIElementGroupStepKey),
      normalize(row.ViewNavigationStepKey)
    ].join('|');
    const skipStep = row['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] === 'Yes';
    const hasValue = !(stepName.includes(`''`) || stepName.includes(` ' '`));
    const allowByReplacement = stepsWithBracketReplacement.has(stepKey);
    if (skipStep) {
      return hasValue || allowByReplacement;
    }
    return true;
  });
  return multipliedData;
}
function checkTestDataExistsForTestCase(testCaseList, testDataList, data) {
  let testCaseDetails = testCaseList.filter((item) => item['Test Case ID'] == data['Test Case ID']);
  if (testCaseDetails && testCaseDetails.length) {
    let filteredTestDataReult = testDataList.filter((item) => item['TEST_CASE_UUID'] == testCaseDetails[0]['Test Case UUID']);
    if (filteredTestDataReult && filteredTestDataReult.length) {
      return true;
    }
    return false;
  }
}
function checkIsUIElementValueExist(stepDefinitionVerbiageName) {
  if (stepDefinitionVerbiageName.includes('<UI Element Value>')) {
    return true;
  } else {
    return false;
  }
}
function extractTestDataByCaseID(testDataList, testCaseID, testCaseStepID) {
  let filteredData = testDataList.filter((item) => item['TEST_CASE_UUID'] == testCaseID && item['TEST_CASE_STEP_UUID'] == testCaseStepID);
  if (filteredData && filteredData.length) {
    filteredData.sort(function (a, b) {
      if (a['TEST_DATA_COLUMN_ID'] < b['TEST_DATA_COLUMN_ID']) {
        return -1;
      }
      if (a['TEST_DATA_COLUMN_ID'] > b['TEST_DATA_COLUMN_ID']) {
        return 1;
      }
      return 0;
    });
  }
  return filteredData && filteredData.length ? filteredData : [];
}
function prepareTestData(testCaseStepList, testDataList) {
  let cloneList = [];
  if (testCaseStepList && testCaseStepList.length) {
    for (let i = 0; i < testCaseStepList.length; i++) {
      if (testCaseStepList[0].length) {
        let step = [...testCaseStepList[i]];
        let dataBody = { 'Step Definition Template': step[6], 'Test Case Step ID': i + 1, 'Test Case Step Name': step[5] };
        let isUIElementValueExist = checkIsUIElementValueExist(step[6]);
        if (isUIElementValueExist) {
          let filteredData = extractTestDataByCaseID(testDataList, step[step.length - 1], step[16]);
          for (let j = 0; j < filteredData.length; j++) {
            dataBody['Test Set Data ' + (j + 1)] = filteredData[j]['TEST_DATA_VALUE'];
            dataBody['Test Case ID'] = filteredData[j]['TEST_CASE_UUID'];
          }
          cloneList.push(dataBody);
        } else {
          cloneList.push(dataBody);
        }
      }
    }
  }
  return cloneList;
}
const formatedTestSetKeyData = (keyList, exceldata) => {
  return (
    keyList &&
    keyList.map((dataKey) => {
      const groupedByTestCaseId = {};
      exceldata.forEach((item) => {
        const testCaseId = item['Test Case ID'];
        const value = item[dataKey];
        if (testCaseId && value !== undefined) {
          if (!groupedByTestCaseId[testCaseId]) {
            groupedByTestCaseId[testCaseId] = [];
          }
          groupedByTestCaseId[testCaseId].push(value);
        }
      });
      const dataArray = Object.entries(groupedByTestCaseId).map(([id, values]) => ({ [id]: values }));
      return { [dataKey]: dataArray };
    })
  );
};
function createTestCaseStepForEachEntry(preparedList, flatList) {
  let stepArray = [];
  for (let i = 0; i < flatList.length; i++) {
    let testCaseUUID = Object.keys(flatList[i])[0];
    for (let j = 0; j < preparedList.length; j++) {
      let step = [...preparedList[j]];
      if (testCaseUUID == step[step.length - 1]) {
        stepArray.push([...step]);
      }
    }
  }
  let filteredStep = filterTestCaseOtherThanTestData(preparedList, flatList);
  stepArray.push(...filteredStep);
  return stepArray;
}
function keyValueFormatedData(list) {
  let finalArray = [];
  list.forEach((set) => {
    const key = Object.keys(set)[0];
    const items = set[key];
    items.forEach((obj) => {
      finalArray.push(obj);
    });
  });
  return finalArray;
}
const filterTestCaseOtherThanTestData = (preparedList, referenceObjects) => {
  let validKeys = referenceObjects.map((obj) => Object.keys(obj)[0]);
  let validKeySet = new Set(validKeys);
  return preparedList.filter((item) => !validKeySet.has(item[item.length - 1]));
};
function endsWithFunction(input) {
  return input.trim().endsWith('Function');
}
function includesFunctionAndEndsWithUIElementGroup(input) {
  const hasFunctionDash = input.includes('Function - ');
  const endsWithUI = input.trim().endsWith('UI Element Group');
  return hasFunctionDash && endsWithUI;
}
function endsWithUIElementGroup(input) {
  return input.trim().endsWith('UI Element Group');
}
function endsWithNavigationStep(input) {
  return input.trim().endsWith('Navigation Step');
}
function checkGroupTypeAndSetValue(input) {
  input = typeof input == 'string' && input ? input : '';
  let testDataSourceType = 'TEST_CASE_STEP';
  if (endsWithFunction(input)) {
    testDataSourceType = 'TEST_CASE_FUNCTION_STEP';
  } else if (includesFunctionAndEndsWithUIElementGroup(input)) {
    testDataSourceType = 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP';
  } else if (endsWithUIElementGroup(input)) {
    testDataSourceType = 'TEST_CASE_UI_ELEMENT_GROUP_STEP';
  } else if (endsWithNavigationStep(input)) {
    testDataSourceType = 'TEST_CASE_VIEW_NAVIGATION_GROUP_STEP';
  }
  return testDataSourceType;
}
function extractTags(input) {
  const regex = /<([^>]+)>/g;
  let matches = [];
  let match;
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}
function extractInitialUIElementValuePosition(data) {
  if (data && data.length) {
    const matches = data[6] && extractTags(data[6]);
    if (!matches || !matches.length) return 0;
    const extractedValues = matches.map((match) => match.replace(/[<>]/g, ''));
    const index = extractedValues.indexOf('UI Element Value');
    const length = extractedValues.length;
    if (index === -1) return 0;
    if (length <= 5 && index <= 4) {
      return 7 + index;
    }
    if (index === length - 1 && length >= 6 && length <= 12) {
      return 12 + length;
    }
  }
  return 0;
}
function extractActualUIElementvalue(data) {
  let positionindex = extractInitialUIElementValuePosition(data);
  if (positionindex == 0) {
    return '';
  } else {
    return data[positionindex];
  }
}
async function getAttributeValueDetails(attributeId, type) {
  let query = `SELECT 'No' as 'IS_FUNCTION_ATTRIBUTE',TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_STEP_ATTRIBUTE_DATA AS NAME,'Test Case' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}' UNION SELECT 'Yes' as 'IS_FUNCTION_ATTRIBUTE', FUNCTION_STEP_ATTRIBUTE_VALUE_UUID AS ID, FUNCTION_STEP_ATTRIBUTE_DATA AS NAME, 'Test Case' as SOURCE_TYPE, STEP_DEFINITION_ATTRIBUTE_UUID FROM FUNCTION_STEP_ATTRIBUTE_VALUE WHERE FUNCTION_STEP_ATTRIBUTE_VALUE_UUID = '${attributeId}'`;
  let res = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', query, input);
  return res && res.length ? res[0] : '';
}
async function getStepData(dataObject, testCaseStepId) {
  let result = [];
  if (dataObject['isTestCaseFunctionExist'] == 'Yes') {
    const testCasefunctionStepAttributeValueQuery = `SELECT 'Test_Case_Function_Step' as 'QueryDataType', tcfs.TEST_CASE_FUNCTION_STEP_UUID, TEST_CASE_FUNCTION_STEP_ID, TEST_CASE_FUNCTION_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT, NEXT_PAGE_CONTEXT, TEST_CASE_FUNCTION_STEP_TYPE, TEST_CASE_FUNCTION_STEP_SEQ_ID,tcfs.TEST_CASE_STEP_UUID as 'ParentKey', IS_UI_ELEMENT_GROUP_STEP, tcfs.FUNCTIONAL_AREA_UUID,tcfsav.FUNCTION_UUID,tcfs.FUNCTION_UUID as 'FUNCTION_UUIDS', FUNCTION_STEP_UUID, IS_PURE_NAVIGATION_STEP, VIEW_UUID, API_UUID, TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID, TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_ID, STEP_DEFINITION_ATTRIBUTE_UUID, TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA AS 'FUNCTION_STEP_ATTRIBUTE_DATA', PRE_DEFINED_VALUES_UUID, SCOPE_VARIABLE_TYPE, SCOPE_VARIABLE_UUID FROM TEST_CASE_FUNCTION_STEP tcfs LEFT JOIN TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE tcfsav ON tcfs.TEST_CASE_FUNCTION_STEP_UUID = tcfsav.TEST_CASE_FUNCTION_STEP_UUID WHERE tcfs.TEST_CASE_STEP_UUID in(${
      testCaseStepId ? testCaseStepId : `''`
    }) AND tcfs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    result.push(...(await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCasefunctionStepAttributeValueQuery, input)));
  }
  if (dataObject['isTestCaseViewNavigationExist'] == 'Yes') {
    const testCasefunctionStepAttributeValueQuery = `SELECT 'Test_Case_View_Navigation_Step' as 'QueryDataType',tcfs.VIEW_NAVIGATION_STEP_UUID,tcfs.TEST_CASE_VIEW_NAVIGATION_STEP_UUID, TEST_CASE_VIEW_NAVIGATION_STEP_ID, TEST_CASE_VIEW_NAVIGATION_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT, NEXT_PAGE_CONTEXT, TEST_CASE_VIEW_NAVIGATION_STEP_TYPE, TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID, tcfs.TEST_CASE_STEP_UUID as 'ParentKey', tcfs.FUNCTIONAL_AREA_UUID, tcfsav.FUNCTION_UUID,tcfs.FUNCTION_UUID as 'FUNCTION_UUIDS',tcfs.FUNCTION_STEP_UUID, tcfs.VIEW_UUID, TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID, TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_ID, STEP_DEFINITION_ATTRIBUTE_UUID, TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA AS 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA', PRE_DEFINED_VALUES_UUID, SCOPE_VARIABLE_TYPE, SCOPE_VARIABLE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP tcfs LEFT JOIN TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE tcfsav ON tcfs.TEST_CASE_VIEW_NAVIGATION_STEP_UUID = tcfsav.TEST_CASE_VIEW_NAVIGATION_STEP_UUID WHERE tcfs.TEST_CASE_STEP_UUID in(${
      testCaseStepId ? testCaseStepId : `''`
    }) AND (tcfs.FUNCTION_UUID IS NULL OR tcfs.FUNCTION_UUID='') AND (tcfs.FUNCTION_STEP_UUID IS NULL OR tcfs.FUNCTION_STEP_UUID='') AND tcfs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    result.push(...(await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCasefunctionStepAttributeValueQuery, input)));
  }
  if (dataObject['isFunctionUIElementGroupExist'] == 'Yes') {
    const functionStepAttributeValueQuery = `SELECT 'Function_UI_Element_Group_Step' as 'QueryDataType',fuiegs.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ID, FUNCTION_UI_ELEMENT_GROUP_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT, FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE, FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID,fuiegs.FUNCTION_STEP_UUID, fuiegs.FUNCTIONAL_AREA_UUID, fuiegs.FUNCTION_UUID, fuiegs.FUNCTION_STEP_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_ID, STEP_DEFINITION_ATTRIBUTE_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA AS 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA', PRE_DEFINED_VALUES_UUID, SCOPE_VARIABLE_TYPE, SCOPE_VARIABLE_UUID,UI_ELEMENT_GROUP_STEP_UUID,fuiegs.FUNCTION_STEP_UUID as 'ParentKey',fuiegs.UI_ELEMENT_GROUP_UUID FROM FUNCTION_UI_ELEMENT_GROUP_STEP fuiegs LEFT JOIN FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE fuiegsav ON fuiegs.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID = fuiegsav.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID WHERE fuiegs.FUNCTION_STEP_UUID in(${
      testCaseStepId ? testCaseStepId : `''`
    }) AND fuiegs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    result.push(...(await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionStepAttributeValueQuery, input)));
  }
  if (dataObject['isTestCaseFunctionViewNavigationExist'] == 'Yes') {
    const testCasefunctionStepAttributeValueQuery = `SELECT 'Test_Case_Function_View_Navigation_Step' as 'QueryDataType',tcfs.VIEW_NAVIGATION_STEP_UUID,tcfs.TEST_CASE_VIEW_NAVIGATION_STEP_UUID, TEST_CASE_VIEW_NAVIGATION_STEP_ID, TEST_CASE_VIEW_NAVIGATION_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT, NEXT_PAGE_CONTEXT, TEST_CASE_VIEW_NAVIGATION_STEP_TYPE, TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID, tcfs.TEST_CASE_STEP_UUID as 'ParentKey', tcfs.FUNCTIONAL_AREA_UUID, tcfsav.FUNCTION_UUID, tcfs.FUNCTION_STEP_UUID,tcfs.FUNCTION_UUID as 'FUNCTION_UUIDS', tcfs.VIEW_UUID, TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID, TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_ID, STEP_DEFINITION_ATTRIBUTE_UUID, TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA AS 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA', PRE_DEFINED_VALUES_UUID, SCOPE_VARIABLE_TYPE, SCOPE_VARIABLE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP tcfs LEFT JOIN TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE tcfsav ON tcfs.TEST_CASE_VIEW_NAVIGATION_STEP_UUID = tcfsav.TEST_CASE_VIEW_NAVIGATION_STEP_UUID WHERE tcfs.TEST_CASE_STEP_UUID in(${
      testCaseStepId ? testCaseStepId : `''`
    }) AND (tcfs.FUNCTION_UUID IS NOT NULL OR tcfs.FUNCTION_UUID !='') AND (tcfs.FUNCTION_STEP_UUID IS NOT NULL OR tcfs.FUNCTION_STEP_UUID !='') AND tcfs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    result.push(...(await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCasefunctionStepAttributeValueQuery, input)));
  }
  if (dataObject['isFunctionViewNavigationExist'] == 'Yes') {
    const functionViewNavigationStepAttributeValueQuery = `SELECT 'Function_View_Navigation_Step' as 'QueryDataType',tcfs.VIEW_NAVIGATION_STEP_UUID,tcfs.FUNCTION_VIEW_NAVIGATION_STEP_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ID, FUNCTION_VIEW_NAVIGATION_STEP_NAME,STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT, NEXT_PAGE_CONTEXT, FUNCTION_VIEW_NAVIGATION_STEP_TYPE, FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID, tcfs.FUNCTIONAL_AREA_UUID, tcfsav.FUNCTION_UUID, tcfs.FUNCTION_STEP_UUID, tcfs.VIEW_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_ID, STEP_DEFINITION_ATTRIBUTE_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA AS 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA', PRE_DEFINED_VALUES_UUID, SCOPE_VARIABLE_TYPE, SCOPE_VARIABLE_UUID,tcfs.FUNCTION_STEP_UUID as 'ParentKey' FROM FUNCTION_VIEW_NAVIGATION_STEP tcfs LEFT JOIN FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE tcfsav ON tcfs.FUNCTION_VIEW_NAVIGATION_STEP_UUID = tcfsav.FUNCTION_VIEW_NAVIGATION_STEP_UUID WHERE tcfs.FUNCTION_STEP_UUID in(${
      testCaseStepId ? testCaseStepId : `''`
    }) AND tcfs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    result.push(...(await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionViewNavigationStepAttributeValueQuery, input)));
  }
  if (dataObject['isTestCaseUIElementGroupExist'] == 'Yes') {
    const testCaseUIElementGroupStepAttributeValueQuery = `SELECT 'Test_Case_UI_Element_Group_Step' as 'QueryDataType',fuegs.UI_ELEMENT_GROUP_UUID,fuegs.UI_ELEMENT_GROUP_STEP_UUID,fuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID, TEST_CASE_UI_ELEMENT_GROUP_STEP_ID, TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT, TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE, TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID, fuegs.FUNCTIONAL_AREA_UUID, fuegs.TEST_CASE_STEP_UUID as 'ParentKey', TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID, TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_ID, STEP_DEFINITION_ATTRIBUTE_UUID, TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA AS 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA', PRE_DEFINED_VALUES_UUID, SCOPE_VARIABLE_TYPE, SCOPE_VARIABLE_UUID,fuegsav.FUNCTION_UUID FROM TEST_CASE_UI_ELEMENT_GROUP_STEP fuegs LEFT JOIN TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE fuegsav ON fuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID = fuegsav.TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID WHERE fuegs.TEST_CASE_STEP_UUID in(${
      testCaseStepId ? testCaseStepId : `''`
    }) AND fuegs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
    result.push(...(await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementGroupStepAttributeValueQuery, input)));
  }
  if (dataObject['isTestCaseFunctionUIElementGroupExist'] == 'Yes') {
    const testCaseFunctionUIElementGroupStepAttributeValueQuery = `SELECT 'Test_Case_Function_UI_Element_Group_Step' as 'QueryDataType',fuegs.UI_ELEMENT_GROUP_UUID,fuegs.UI_ELEMENT_GROUP_STEP_UUID,fuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID, fuegs.FUNCTIONAL_AREA_UUID, fuegs.TEST_CASE_STEP_UUID as 'ParentKey', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_ID, STEP_DEFINITION_ATTRIBUTE_UUID, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA AS 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA', PRE_DEFINED_VALUES_UUID, SCOPE_VARIABLE_TYPE, SCOPE_VARIABLE_UUID,fuegsav.FUNCTION_UUID,fuegs.FUNCTION_STEP_UUID FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP fuegs LEFT JOIN TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE fuegsav ON fuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID = fuegsav.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID WHERE fuegs.TEST_CASE_STEP_UUID in(${
      testCaseStepId ? testCaseStepId : `''`
    }) AND fuegs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
    result.push(...(await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepAttributeValueQuery, input)));
  }
  return result;
}
function getDataByParentKeyAndType(stepData, pk) {
  return stepData.filter((item) => item['ParentKey'] == pk);
}
async function getStepChildData(dataObject, functionStepIds) {
  let result = [];
  if (dataObject['isTestCaseFunctionViewNavigationExist'] == 'Yes') {
    const testCasefunctionStepAttributeValueQuery = `SELECT 'Test_Case_Function_View_Navigation_Step' as 'QueryDataType',tcfs.VIEW_NAVIGATION_STEP_UUID,tcfs.FUNCTION_VIEW_NAVIGATION_STEP_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ID, FUNCTION_VIEW_NAVIGATION_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT, NEXT_PAGE_CONTEXT, FUNCTION_VIEW_NAVIGATION_STEP_TYPE, FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID, tcfs.FUNCTIONAL_AREA_UUID, tcfs.FUNCTION_UUID, tcfs.FUNCTION_STEP_UUID, tcfs.VIEW_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_ID, STEP_DEFINITION_ATTRIBUTE_UUID, FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA AS 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA', PRE_DEFINED_VALUES_UUID, SCOPE_VARIABLE_TYPE, SCOPE_VARIABLE_UUID FROM FUNCTION_VIEW_NAVIGATION_STEP tcfs LEFT JOIN FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE tcfsav ON tcfs.FUNCTION_VIEW_NAVIGATION_STEP_UUID = tcfsav.FUNCTION_VIEW_NAVIGATION_STEP_UUID WHERE tcfs.FUNCTION_STEP_UUID in(${
      functionStepIds ? functionStepIds : `''`
    }) AND tcfs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    result.push(...(await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCasefunctionStepAttributeValueQuery, input)));
  }
  if (dataObject['isTestCaseFunctionUIElementGroupExist'] == 'Yes') {
    const testCasefunctionStepAttributeValueQuery = `SELECT 'Test_Case_Function_UI_Element_Group_Step' as 'QueryDataType',fuiegs.UI_ELEMENT_GROUP_UUID,fuiegs.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ID, FUNCTION_UI_ELEMENT_GROUP_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT, FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE, FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID,fuiegs.FUNCTIONAL_AREA_UUID, fuiegs.FUNCTION_UUID, fuiegs.FUNCTION_STEP_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_ID, STEP_DEFINITION_ATTRIBUTE_UUID, FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA AS 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA', PRE_DEFINED_VALUES_UUID, SCOPE_VARIABLE_TYPE, SCOPE_VARIABLE_UUID,UI_ELEMENT_GROUP_STEP_UUID FROM FUNCTION_UI_ELEMENT_GROUP_STEP fuiegs LEFT JOIN FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE fuiegsav ON fuiegs.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID = fuiegsav.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID WHERE fuiegs.FUNCTION_STEP_UUID in(${
      functionStepIds ? functionStepIds : `''`
    }) AND fuiegs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    result.push(...(await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCasefunctionStepAttributeValueQuery, input)));
  }
  return result;
}
async function getStepDataUsingChild(data, currentAttributeId, childStepAttributeValueData) {
  let result = [];
  if (data['QueryDataType'] == 'Test_Case_Function_View_Navigation_Step') {
    result = childStepAttributeValueData.filter(
      (item) =>
        item[data['PRIMARY_COLUMN_NAME']] == data['PRIMARY_COLUMN_VALUE'] &&
        item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId &&
        item['VIEW_UUID'] == data['ViewKey'] &&
        item['FUNCTION_UUID'] == data['FunctionKey'] &&
        item['FUNCTION_STEP_UUID'] == data['FunctionStepKey'] &&
        data['QueryDataType'] == item['QueryDataType']
    );
  } else if (data['QueryDataType'] == 'Test_Case_Function_UI_Element_Group_Step') {
    result = childStepAttributeValueData.filter(
      (item) =>
        item[data['PRIMARY_COLUMN_NAME']] == data['PRIMARY_COLUMN_VALUE'] &&
        item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId &&
        item['UI_ELEMENT_GROUP_UUID'] == data['UIElementGroupKey'] &&
        item['FUNCTION_STEP_UUID'] == data['FunctionStepKey'] &&
        data['QueryDataType'] == item['QueryDataType']
    );
  }
  return result;
}
const normalize = (value) => (value === null || value === undefined || value === '' || value === 'null' || value === 'undefined' ? '' : value);
async function filterStepByCurrentStep(parentStepAttributeValueData, data, currentAttributeId, dataObject, childStepAttributeValueData) {
  let result = [];
  if (data['QueryDataType'] == 'Test_Case_Step_Normal') {
    result = [];
  } else if (data['QueryDataType'] == 'Test_Case_View_Navigation_Step') {
    result = parentStepAttributeValueData.filter(
      (item) =>
        item[data['PRIMARY_COLUMN_NAME']] == data['PRIMARY_COLUMN_VALUE'] &&
        item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId &&
        item['VIEW_UUID'] == data['ViewKey'] &&
        normalize(item['FUNCTION_UUIDS']) == '' &&
        normalize(item['FUNCTION_STEP_UUID']) == '' &&
        data['QueryDataType'] == item['QueryDataType']
    );
  } else if (data['QueryDataType'] == 'Test_Case_Function_Step') {
    result = parentStepAttributeValueData.filter(
      (item) =>
        item[data['PRIMARY_COLUMN_NAME']] == data['PRIMARY_COLUMN_VALUE'] &&
        item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId &&
        item['FUNCTION_UUIDS'] == data['FunctionKey'] &&
        data['QueryDataType'] == item['QueryDataType']
    );
  } else if (data['QueryDataType'] == 'Test_Case_Function_View_Navigation_Step') {
    result = parentStepAttributeValueData.filter(
      (item) =>
        item[data['PRIMARY_COLUMN_NAME']] == data['PRIMARY_COLUMN_VALUE'] &&
        item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId &&
        item['VIEW_UUID'] == data['ViewKey'] &&
        normalize(item['FUNCTION_UUIDS']) &&
        normalize(item['FUNCTION_STEP_UUID']) &&
        item['FUNCTION_STEP_UUID'] == data['FunctionStepKey'] &&
        data['QueryDataType'] == item['QueryDataType']
    );
    if (result && result.length == 0) {
      result = await getStepDataUsingChild(data, currentAttributeId, childStepAttributeValueData);
    }
  } else if (data['QueryDataType'] == 'Test_Case_Function_UI_Element_Group_Step') {
    result = parentStepAttributeValueData.filter(
      (item) =>
        item[data['PRIMARY_COLUMN_NAME']] == data['PRIMARY_COLUMN_VALUE'] &&
        item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId &&
        item['FUNCTION_STEP_UUID'] == data['FunctionStepKey'] &&
        item['UI_ELEMENT_GROUP_UUID'] == data['UIElementGroupKey'] &&
        data['QueryDataType'] == item['QueryDataType']
    );
    if (result && result.length == 0) {
      result = await getStepDataUsingChild(data, currentAttributeId, childStepAttributeValueData);
    }
  } else if (data['QueryDataType'] == 'Test_Case_UI_Element_Group_Step') {
    result = parentStepAttributeValueData.filter(
      (item) =>
        item[data['PRIMARY_COLUMN_NAME']] == data['PRIMARY_COLUMN_VALUE'] &&
        item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId &&
        item['UI_ELEMENT_GROUP_UUID'] == data['UIElementGroupKey'] &&
        data['QueryDataType'] == item['QueryDataType']
    );
  } else if (data['QueryDataType'] == 'Function_UI_Element_Group_Step') {
    result = parentStepAttributeValueData.filter(
      (item) =>
        item[data['PRIMARY_COLUMN_NAME']] == data['PRIMARY_COLUMN_VALUE'] &&
        item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId &&
        item['UI_ELEMENT_GROUP_UUID'] == data['UIElementGroupKey'] &&
        data['QueryDataType'] == item['QueryDataType']
    );
  } else if (data['QueryDataType'] == 'Function_View_Navigation_Step') {
    result = parentStepAttributeValueData.filter(
      (item) =>
        item[data['PRIMARY_COLUMN_NAME']] == data['PRIMARY_COLUMN_VALUE'] &&
        item['STEP_DEFINITION_ATTRIBUTE_UUID'] == currentAttributeId &&
        item['VIEW_UUID'] == data['ViewKey'] &&
        data['QueryDataType'] == item['QueryDataType']
    );
  } else if (data['QueryDataType'] == 'Function_Normal') {
    result = [];
  }
  return result;
}
function primaryIdString(testCaseStepNormalQueryData) {
  const keys = ['ParentKey', 'FunctionKey', 'FunctionStepKey', 'UIElementGroupKey', 'UIElementGroupStepKey'];
  const collectedUUIDs = keys.flatMap((key) => [...new Set(testCaseStepNormalQueryData.map((item) => item[key]).filter(isValidUUID))]);
  return collectedUUIDs.map((uuid) => `'${uuid}'`).join(', ');
}
function preparePageConfig(pageList, uIElementList) {
  let preparedPageList = [];
  for (let pageDetails of pageList) {
    let pageobject = { uuid: pageDetails['Page UUID'], pageElements: [], status: pageDetails['Status'], pageId: pageDetails['Page ID'], pageName: pageDetails['Page Name'], navigation: {} };
    pageobject['navigation'] = { navigationType: 'URL', navigationValue: pageDetails['Page Direct Access URL'] };
    for (let uiElementDetails of uIElementList) {
      if (pageDetails['Page ID'] == uiElementDetails['Page ID']) {
        let uiElementObject = {
          pageId: uiElementDetails['Page ID'],
          elementId: uiElementDetails['UI ELement ID'],
          elementName: uiElementDetails['UI Element Name'],
          elementType: uiElementDetails['Element Type'],
          locatorType: uiElementDetails['Locator Type'],
          locatorValue: uiElementDetails['Locator Value'],
          isPageIdentifier: uiElementDetails['Is Page Load Identifier'],
          status: uiElementDetails['Status'],
          eventName: uiElementDetails['Event Name'],
          uuid: uiElementDetails['UI Element UUID']
        };
        pageobject['pageElements'].push(uiElementObject);
      }
    }
    preparedPageList.push(pageobject);
  }
  return preparedPageList;
}
function prepareTestSetConfig(testSetList, testCaseList, testCaseStepList) {
  let testSetConfigObject = { testsets: [] };
  let testsetConfigFlattendObject = { testsets: [] };
  let testSetSeq = 0;
  for (let testSetDetails of testSetList) {
    testSetSeq++;
    let testSetObject = {
      id: testSetDetails['Test Set ID'],
      name: testSetDetails['Test Set Name'],
      status: testSetDetails['Status'],
      uuid: testSetDetails['Test Set UUID'],
      appId: testSetDetails['App ID'],
      seqId: testSetSeq,
      testCases: []
    };
    let clonedtestSetObject = JSON.parse(JSON.stringify(testSetObject));
    let testCaseSeq = 0;
    for (let testCaseDetails of testCaseList) {
      if (testSetDetails['Test Set ID'] == testCaseDetails['Test Set ID']) {
        testCaseSeq++;
        let testCaseObject = {
          testSetId: testCaseDetails['Test Set ID'],
          id: testCaseDetails['Test Case ID'],
          seqId: testCaseSeq,
          name: testCaseDetails['Test Case Name'],
          status: testCaseDetails['Status'],
          uuid: testCaseDetails['Test Case UUID'],
          steps: []
        };
        let clonedtestCaseObject = JSON.parse(JSON.stringify(testCaseObject));
        let testCaseStepSeq = 0;
        for (let testCaseStepDetails of testCaseStepList) {
          if (testCaseDetails['Test Case ID'] == testCaseStepDetails['Test Case ID']) {
            testCaseStepSeq++;
            let testCaseStepObject = {
              testCaseId: testCaseStepDetails['Test Case ID'],
              seqId: testCaseStepDetails['Test Case Step ID'],
              type: testCaseStepDetails['Test Case Step Type'],
              text: testCaseStepDetails['Test Case Step Name'],
              testStepGroupName: testCaseStepDetails['Test Case Step Group Name'],
              status: testCaseStepDetails['Status'],
              uuid: testCaseStepDetails['Test Case Step UUID'],
              tesCaseFunctionSteps: []
            };
            let clonedtestCaseStepObject = JSON.parse(JSON.stringify(testCaseStepObject));
            testCaseStepObject['id'] = testCaseStepDetails['Test Case Step ID'];
            clonedtestCaseStepObject['id'] = testCaseStepDetails['Test Case ID'] + testCaseStepSeq;
            testCaseObject['steps'].push(testCaseStepObject);
            clonedtestCaseObject['steps'].push(clonedtestCaseStepObject);
          }
        }
        testSetObject['testCases'].push(testCaseObject);
        clonedtestSetObject['testCases'].push(clonedtestCaseObject);
      }
    }
    testSetConfigObject['testsets'].push(testSetObject);
    testsetConfigFlattendObject['testsets'].push(clonedtestSetObject);
  }
  return { testSetConfigObject: testSetConfigObject, testsetConfigFlattendObject: testsetConfigFlattendObject };
}
const getTcCondition = (testCaseAlias) => {
  const finalTestCaseAlias = testCaseAlias ? testCaseAlias + '.' : '';
  const INCLUDED_TEST_CASES = input.INCLUDED_TEST_CASES;
  switch (INCLUDED_TEST_CASES) {
    case 'COMMITTED&DRAFT':
      return `(${finalTestCaseAlias}TEST_CASE_STATUS = 'COMMITTED' OR ${finalTestCaseAlias}TEST_CASE_STATUS = 'DRAFT')`;
    case 'COMMITTED&MY_DRAFT':
      return `(${finalTestCaseAlias}TEST_CASE_STATUS = 'COMMITTED' OR (${finalTestCaseAlias}TEST_CASE_STATUS = 'DRAFT' AND ${finalTestCaseAlias}TEST_CASE_OWNER=:APP_LOGGED_IN_USER_ID))`;
    case 'COMMITTED':
    default:
      return `${finalTestCaseAlias}TEST_CASE_STATUS = 'COMMITTED'`;
  }
};
function reorderTestCaseStep(testCaseStepNormalQueryData) {
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    testCaseStepNormalQueryData.sort((a, b) => {
      if (a['Test Set ID'] !== b['Test Set ID']) {
        return a['Test Set ID'] - b['Test Set ID'];
      }
      if (a['Test Case ID'] !== b['Test Case ID']) {
        return a['Test Case ID'] - b['Test Case ID'];
      }
      let keyA = a['Test Case Step ID'].toString().split('-').map(Number);
      let keyB = b['Test Case Step ID'].toString().split('-').map(Number);
      for (let i = 0; i < Math.max(keyA?.length, keyB?.length); i++) {
        if (keyA[i] !== keyB[i]) {
          return (keyA[i] || 0) - (keyB[i] || 0);
        }
      }
      return 0;
    });
  }
  return testCaseStepNormalQueryData;
}
let input = msg.payload.apiRequestBody;
input['FUNCTIONAL_AREA_UUID'] = input['APP_LOGGED_IN_FUNTIONAL_AREA_ID'];
let responseJson = { pageConfig: [], testsetConfig: {}, testsetConfigFlattend: {}, apiconfig: [], application: [] };
let queryListMap = [];
AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
const stepDefAttributeQueryList = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
let stepDefAttributeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefAttributeQueryList, input);
const stepDefTemplateVerbiageQueryList = `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE`;
let stepDefTemplateVerbiageQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, stepDefTemplateVerbiageQueryList, input);
const uiElementTypeQuery = `SELECT * FROM UI_ELEMENT_TYPE_MASTER`;
let uiElementTypeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, uiElementTypeQuery, input);
input['AUTOMATION_TYPE'] = 'Automated';
let dataObject = {};
if (input.TYPE == 'TEST_CASE') {
  msg.payload.result = {};
  let apiList = [];
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster = versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let testSetQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_SET_NAME AS 'Test Set Name', 'Active' AS Status,'No Action' AS Actions,TEST_SET.TEST_SET_UUID AS 'Test Set UUID',FUNCTIONAL_AREA_ID AS 'App ID' FROM TEST_SET, TEST_CASE, FUNCTIONAL_AREA WHERE TEST_SET.TEST_SET_UUID = TEST_CASE.TEST_SET_UUID AND TEST_CASE.TEST_CASE_UUID =:TEST_CASE_UUID AND TEST_SET.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID;`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
    testSetQueryData = testSetQueryData.map((testSet) => {
      return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
    });
  }
  let testCaseQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_SEQ_ID as 'Test Case Seq ID',TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE,TEST_SET WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID and TEST_CASE.TEST_CASE_UUID=:TEST_CASE_UUID order by TEST_CASE_SEQ_ID asc`;
  let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
  let testCaseStepNormalQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey',tcs.VIEW_UUID as 'ViewKey','Test_Case_Step_Normal' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tc.TEST_CASE_UUID=:TEST_CASE_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' or tcs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
  let testCaseStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepNormalQuery, input);
  dataObject['isNormalTestCaseExist'] = testCaseStepNormalQueryData && testCaseStepNormalQueryData.length ? 'Yes' : 'No';
  queryListMap.push(testCaseStepNormalQueryObject([...new Set(testCaseStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  let testCaseNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE,tcs.TEST_CASE_STEP_UUID as 'ParentKey',tcs.FUNCTION_UUID as 'FunctionKey','' as 'FunctionStepKey',tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey','' as 'UIElementGroupStepKey',tcs.VIEW_UUID as 'ViewKey','Test_Case_View_Navigation_Step' as 'QueryDataType',vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tc.TEST_CASE_UUID=:TEST_CASE_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationStepQuery, input);
  dataObject['isTestCaseViewNavigationExist'] = testCaseNavigationStepQueryData && testCaseNavigationStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(viewNavigationStepQueryObject([...new Set(testCaseNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseNavigationStepQueryData);
  let testCaseFunctionStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', FUNCTION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcfs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'FUNCTION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'FUNCTION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'FUNCTION_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfs.FUNCTION_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE,tcs.TEST_CASE_STEP_UUID as 'ParentKey',tcs.FUNCTION_UUID as 'FunctionKey',tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey',tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey','' as 'UIElementGroupStepKey',tcfs.VIEW_UUID as 'ViewKey','Test_Case_Function_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, TEST_CASE tc, TEST_SET ts, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND tc.TEST_CASE_UUID=:TEST_CASE_UUID AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' or tcfs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcfs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY TEST_CASE_STEP_ID, FUNCTION_STEP_ID ASC`;
  let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
  dataObject['isTestCaseFunctionExist'] = testCaseFunctionStepQueryData && testCaseFunctionStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(functionStepNormalQueryObject([...new Set(testCaseFunctionStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionStepQueryData);
  let testCaseFunctionNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.FUNCTION_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ), ' Page - ', 'Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey',tcs.FUNCTION_UUID as 'FunctionKey',tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey',tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey','' as 'UIElementGroupStepKey',tcfs.VIEW_UUID as 'ViewKey','Test_Case_Function_View_Navigation_Step' as 'QueryDataType', vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW v, FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tc.TEST_CASE_UUID=:TEST_CASE_UUID AND tcfs.CURRENT_PAGE_CONTEXT = v.PAGE_UUID AND v.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcfs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND EXISTS( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcfs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseFunctionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionNavigationStepQuery, input);
  dataObject['isTestCaseFunctionViewNavigationExist'] = testCaseFunctionNavigationStepQueryData && testCaseFunctionNavigationStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    viewNavigationStepQueryObject([...new Set(testCaseFunctionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionNavigationStepQueryData);
  let testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID',STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfuegs.UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey',tcs.FUNCTION_UUID as 'FunctionKey',tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey',tcfs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey',tcfuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey',tcfs.VIEW_UUID as 'ViewKey','Test_Case_Function_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID and tcfs.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID and tc.TEST_CASE_UUID=:TEST_CASE_UUID and tcs.IS_FUNCTION_STEP = 'Yes' and tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY TEST_CASE_STEP_ID asc, UI_ELEMENT_GROUP_STEP_SEQ_ID asc`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input);
  dataObject['isTestCaseFunctionUIElementGroupExist'] = testCaseFunctionUIElementGroupStepQueryData && testCaseFunctionUIElementGroupStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    uIElementGroupStepQueryObject([...new Set(testCaseFunctionUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionUIElementGroupStepQueryData);
  let testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID',STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcuegs.UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE,tcs.TEST_CASE_STEP_UUID as 'ParentKey',tcs.FUNCTION_UUID as 'FunctionKey','' as 'FunctionStepKey',tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey',tcuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey',tcs.VIEW_UUID as 'ViewKey','Test_Case_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcuegs.UI_ELEMENT_GROUP_UUID = tcs.UI_ELEMENT_GROUP_UUID and tc.TEST_CASE_UUID=:TEST_CASE_UUID and tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID, UI_ELEMENT_GROUP_STEP_SEQ_ID asc`;
  let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementGroupStepQuery, input);
  dataObject['isTestCaseUIElementGroupExist'] = testCaseUIElementGroupStepQueryData && testCaseUIElementGroupStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    uIElementGroupStepQueryObject([...new Set(testCaseUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseUIElementGroupStepQueryData);
  let attributeIds = '';
  let ui_element_list = [];
  let primaryKeyIds = concatePrimaryKeys(testCaseQueryData);
  let testDataQueryData = await fetchTestData(primaryKeyIds);
  msg.payload.filePresent = false;
  if (testDataQueryData && testDataQueryData.length) {
    msg.payload.filePresent = true;
  }
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    let attributeDataObject = await fetchChildAttributeFromAttributeTable(queryListMap);
    attributeIds = attributeDataObject.attrValues
      .filter(isValidUUID)
      .map((uuid) => `'${uuid}'`)
      .join(', ');
    let pageQueryDataList = await fetchPageDetails(attributeIds);
    let uiElementDataList = await fetchUIElementsDetails(attributeIds);
    let functionQueryDataList = await fetchFunctionDetails(attributeIds);
    let uiElementGroupQueryDataList = await fetchUIElementGroupDetails(attributeIds);
    let apiQueryDataList = await fetchApiDetails(attributeIds);
    let apiAttributeQueryDataList = await fetchApiAttributeDetails(attributeIds);
    let primaryColumnIds = primaryIdString(testCaseStepNormalQueryData);
    let parentStepAttributeValueData = await getStepData(dataObject, primaryColumnIds);
    let childStepAttributeValueData = await getStepChildData(dataObject, primaryColumnIds);
    debugger;
    for (let data of testCaseStepNormalQueryData) {
      data['isItemRemove'] = false;
      let ui_elements = '';
      let is_ui_element = false;
      let inc = 0;
      let stepDefAttributeQueryData = getStepAttributeData(stepDefAttributeQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
      let attributeValueQueryData = getChildAttributeData(attributeDataObject.attributeValueQueryDataEntries, data.PRIMARY_COLUMN_VALUE, data.PRIMARY_COLUMN_NAME);
      let filteredStepAttributeValueData = getDataByParentKeyAndType(parentStepAttributeValueData, data['ParentKey']);
      if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Automated') {
        let inputStepType = data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data' ? 'Given' : data['Test Case Step Type'];
        data['Test Case Step Type'] = inputStepType;
        let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
        let stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';
        data['Step Definition Template'] = stepDefTemplateVerbiageName;
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
          let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
          let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
          for (let codeDesc of stepDefAttributeQueryData) {
            let getAttr = '';
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
              case '57b76ab3-8112-4343-af0f-49643c808bf7':
                {
                  let pageName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7f855066-ad39-4325-8108-30befb2447e6':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '74da67d2-41c9-4cf7-9eea-715243e5fcdc');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (uiElementValueData && Object.keys(uiElementValueData).length && uiElementValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(uiElementValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
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
                  ui_elements = uiElementValue;
                  is_ui_element = true;
                  if (!msg.payload.filePresent) {
                    getAttr = replaceKeyword(uiElementValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Value>',
                      uiElementValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let keyNameInKeyPad = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(keyNameInKeyPad);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Key Name in Keypad>', function () {
                    let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                    return `'` + Datawithbackslash + `'`;
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
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, selectedUIElement);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = replaceKeyword(uiElementQueryData['EVENT_NAME']);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Event Type>',
                      uiElementQueryData['EVENT_NAME']
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementQueryData['EVENT_NAME']);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let confirmUIElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${confirmUIElementValue}]` : '';
                  if (!msg.payload.filePresent) {
                    getAttr = replaceKeyword(confirmUIElementValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Confirm UI Element Value>',
                      confirmUIElementValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(confirmUIElementValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                {
                  let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                  if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                    let functionNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, functionNameQuery, input);
                    getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '3f50ff70-f3e4-11ee-9a12-6fc3e771212a');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(uiElementValue1);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${uiElementValue1}]` : '';
                  if (!msg.payload.filePresent) {
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Value 1>',
                      uiElementValue1
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementValue1);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let userActionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                {
                  let uiElementGroupName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementGroupStepQueryData = getUIElementGroupDetails(uiElementGroupQueryDataList, uiElementGroupName);
                  if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                    getAttr = uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] + `:-:` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let pageNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(pageNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Page Number>',
                    pageNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(pageNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataKey = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataKey);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Key>',
                    dataKey
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataKey);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataValue);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Value>',
                    dataValue
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataValue);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Name>',
                    fileName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let downloadParserName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(downloadParserName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Document Parser Name>',
                    downloadParserName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(downloadParserName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiQueryData = getApiDetails(apiQueryDataList, apiName);
                  if (apiQueryData && Object.keys(apiQueryData).length) {
                    getAttr = apiQueryData['API_ID'] + `:-:` + apiQueryData['API_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiQueryData['API_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '46136260-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiAttributeName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                  if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                    getAttr = apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '7182ebf0-2e33-11ef-9033-4bb93e602d01');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let apiAttributeValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (apiAttributeValueData && Object.keys(apiAttributeValueData).length && apiAttributeValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(apiAttributeValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      ['Test_Case_Step_Normal', 'Test_Case_Function_Step'].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${apiAttributeValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      apiAttributeValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      apiAttributeValue = selectedAttributeDetails['NAME'];
                    }
                    apiAttributeValue = decideScopePrefix(apiAttributeValueData) + apiAttributeValue;
                  }
                  getAttr = replaceKeyword(apiAttributeValue);
                  ui_elements = apiAttributeValue;
                  is_ui_element = true;
                  if (!msg.payload.filePresent) {
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<API Attribute Value>',
                      apiAttributeValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(apiAttributeValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '833eb770-2e33-11ef-9033-4bb93e602d01':
                {
                  let responseStatusCode = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(responseStatusCode);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Response Status Code>',
                    responseStatusCode
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(responseStatusCode);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd':
                {
                  let pageName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName1);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                {
                  let uiElementState = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(uiElementState);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element State>',
                    uiElementState
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementState);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeOot = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeOot);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Timeout>',
                    timeOot
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeOot);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
                {
                  let testSetScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testSetScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testSetScope;
                  }
                  getAttr = replaceKeyword(testSetScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Set Scope Variable>',
                    testSetScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testSetScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '842981e7-e484-11ef-904e-02c8cad0208d':
                {
                  let testCaseScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testCaseScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testCaseScope;
                  }
                  getAttr = replaceKeyword(testCaseScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Case Scope Variable>',
                    testCaseScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testCaseScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeInterval = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeInterval);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Time Interval>',
                    timeInterval
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeInterval);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let attempts = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(attempts);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Attempts>',
                    attempts
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(attempts);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '75b16425-1531-4cee-8c09-30f5be70c4b0');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let cellValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (cellValueData && Object.keys(cellValueData).length && cellValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(cellValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${cellValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      cellValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      cellValue = selectedAttributeDetails['NAME'];
                    }
                    cellValue = decideScopePrefix(cellValueData) + cellValue;
                  }
                  getAttr = replaceKeyword(cellValue);
                  ui_elements = cellValue;
                  is_ui_element = true;
                  if (!msg.payload.filePresent) {
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Cell Value>',
                      cellValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(cellValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let rowNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(rowNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Row Number>',
                    rowNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(rowNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Table Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '078e6534-f38f-4aad-b89d-cad8216ad86b':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ba1ef281-412a-4544-b615-7767b06eb489':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, 'ba1ef281-412a-4544-b615-7767b06eb489');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(cellValue1);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${cellValue1}]` : '';
                  if (!msg.payload.filePresent) {
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Cell Value 1>',
                      cellValue1
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(cellValue1);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let columnNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(columnNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Column Number>',
                    columnNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(columnNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '28058e26-fa09-42fb-868a-1988bd0a746c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileFullPath = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileFullPath);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Full Path>',
                    fileFullPath
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileFullPath);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
            }
            inc++;
            let valueColumnName = `v` + inc;
            data[valueColumnName] = getAttr;
          }
        }
        let getKeywordByStepType = inputStepType ? inputStepType + ' ' : '';
        data['Test Case Step Name'] = getKeywordByStepType + stepDefTemplateVerbiageName;
        data['TEST_CASE_STEP_UUID'] = data['ParentKey'];
        if (data['API_UUID']) {
          apiList.push(data['API_UUID']);
        }
        if (is_ui_element) {
          let testCaseDetails = testCaseQueryData.filter((item) => item['Test Case ID'] == data['Test Case ID']);
          let stepDetails = {};
          stepDetails['TEST_CASE_UUID'] = testCaseDetails[0]['Test Case UUID'];
          stepDetails['TEST_DATA_COLUMN_ID'] = 'F';
          stepDetails['TEST_CASE_STEP_UUID'] = data['ParentKey'];
          stepDetails['TEST_DATA_VALUE'] = ui_elements;
          stepDetails['IS_ITEM_REMOVE'] = data['isItemRemove'];
          stepDetails['FUNCTION_UUID'] = data['FunctionKey'];
          stepDetails['FUNCTION_STEP_UUID'] = data['FunctionStepKey'];
          stepDetails['UI_ELEMENT_GROUP_UUID'] = data['UIElementGroupKey'];
          stepDetails['UI_ELEMENT_GROUP_STEP_UUID'] = data['UIElementGroupStepKey'];
          stepDetails['VIEW_UUID'] = data['ViewKey'];
          stepDetails['QueryDataType'] = data['QueryDataType'];
          stepDetails['VIEW_NAVIGATION_STEP_UUID'] = data['ViewNavigationStepKey'];
          ui_element_list.push(stepDetails);
        }
      }
    }
  }
  testCaseStepNormalQueryData = reorderTestCaseStep(testCaseStepNormalQueryData);
  let testDataQueryDataPreList = testDataQueryData;
  testDataQueryDataPreList = ui_element_list.concat(testDataQueryData);
  testCaseStepNormalQueryData = processTestCaseSteps(testDataQueryDataPreList, testCaseStepNormalQueryData);
  let currentPageIds = '';
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    currentPageIds = testCaseStepNormalQueryData
      .map((item) => item['Page ID'])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID', IS_BASE_URL_OVERRIDDEN FROM PAGE WHERE PAGE_UUID in(${
    attributeIds ? attributeIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
  pageNewQueryData = await ConcatinateURL(pageNewQueryData);
  let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
  let uiElementQuery = `SELECT PAGE.PAGE_ID AS 'Page ID', UI_ELEMENT.UI_ELEMENT_ID AS 'UI Element ID', UI_ELEMENT.UI_ELEMENT_NAME AS 'UI Element Name', (SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID = UI_ELEMENT.UI_ELEMENT_TYPE) AS 'Element Type', UI_ELEMENT.LOCATOR_TYPE AS 'Locator Type', UI_ELEMENT.LOCATOR_VALUE AS 'Locator Value', CASE WHEN (IFNULL(UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER END AS 'Is Page Load Identifier', 'Active' AS Status, 'No Action' AS Actions, UI_ELEMENT.EVENT_NAME AS 'Event Name', UI_ELEMENT.UI_ELEMENT_UUID AS 'UI Element UUID' FROM UI_ELEMENT JOIN PAGE ON PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID WHERE UI_ELEMENT.PAGE_NEW_UUID IN (${
    pageList ? pageList : `''`
  }) ORDER BY UI_ELEMENT.UI_ELEMENT_ID ASC`;
  let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementQuery, input);
  if (uiElementQueryData && uiElementQueryData.length) {
    uiElementQueryData.sort((a, b) => {
      let afield1 = a['Page ID'];
      let bfield1 = b['Page ID'];
      let afield2 = a['UI ELement ID'];
      let bfield2 = b['UI ELement ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  let currentApiIds = '';
  if (apiList && apiList.length) {
    currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
  }
  let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID',USE_PROXY_INDICATOR as 'Use Proxy Indicator' FROM API_NEW WHERE API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID order by API_ID asc`;
  let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
  let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) order by API_ATTRIBUTE_ID asc`;
  let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiAttributeQuery, input);
  if (apiAttributeQueryData && apiAttributeQueryData.length) {
    apiAttributeQueryData.sort((a, b) => {
      let afield1 = a['API ID'];
      let bfield1 = b['API ID'];
      let afield2 = a['API Attribute ID'];
      let bfield2 = b['API Attribute ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  msg.payload.result.message = 'JSON Downloaded';
  let userNameQuery = `SELECT concat(FIRST_NAME, ' ',LAST_NAME) as USER_NAME FROM USER_PROFILE WHERE AE_USER_PROFILE_UUID=:APP_LOGGED_IN_USER_ID;`;
  let userNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('INFO_AUTHORIZATION', userNameQuery, input);
  let functionalAreaQuery = `SELECT '${userNameQueryData['USER_NAME']}' as USER_NAME,:APP_LOGGED_IN_USER_ID as USER_UUID, FUNCTIONAL_AREA_UUID as APP_UUID,TENANT_UUID as TENANT_UUID, :TEST_SUITE_UUID as 'TEST_SUITE_UUID',:MASTER_CODE_VERSION_ID as 'VERSION_NUMBER' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID;`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionalAreaQuery, input);
  responseJson['application'] = functionalAreaQueryData;
  responseJson['apiconfig'] = transformApiDataMultiple(apiQueryData, apiAttributeQueryData);
  responseJson['pageConfig'] = preparePageConfig(pageNewQueryData, uiElementQueryData);
  let testSetData = prepareTestSetConfig(testSetQueryData, testCaseQueryData, testCaseStepNormalQueryData);
  responseJson['testsetConfig'] = testSetData['testSetConfigObject'];
  responseJson['testsetConfigFlattend'] = testSetData['testsetConfigFlattendObject'];
  msg.payload.result.data = responseJson;
  node.send(msg);
} else if (input.TYPE == 'TEST_SET') {
  msg.payload.result = {};
  let apiList = [];
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster = versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let testSetQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_SET_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,TEST_SET_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM TEST_SET,FUNCTIONAL_AREA WHERE TEST_SET_UUID=:TEST_SET_UUID AND TEST_SET.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
    testSetQueryData = testSetQueryData.map((testSet) => {
      return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
    });
  }
  const tcCondition = getTcCondition('TEST_CASE');
  let testCaseQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', TEST_CASE_SEQ_ID AS 'Test Case Seq ID', TEST_CASE_NAME AS 'Test Case Name', 'Active' AS Status, 'No Action' AS Actions, TEST_CASE_UUID AS 'Test Case UUID' FROM TEST_CASE, TEST_SET WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID AND TEST_CASE.TEST_SET_UUID=:TEST_SET_UUID AND TEST_CASE.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND ${tcCondition} ORDER BY TEST_CASE_SEQ_ID ASC;`;
  let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
  const testCaseCondition = getTcCondition('tc');
  let testCaseStepNormalQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_Step_Normal' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ${testCaseCondition} AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' OR tcs.IS_PURE_NAVIGATION_STEP IS NULL ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
  let testCaseStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepNormalQuery, input);
  dataObject['isNormalTestCaseExist'] = testCaseStepNormalQueryData && testCaseStepNormalQueryData.length ? 'Yes' : 'No';
  queryListMap.push(testCaseStepNormalQueryObject([...new Set(testCaseStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  let testCaseNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' AS PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID AS PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_View_Navigation_Step' as 'QueryDataType',vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ${testCaseCondition} AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationStepQuery, input);
  dataObject['isTestCaseViewNavigationExist'] = testCaseNavigationStepQueryData && testCaseNavigationStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(viewNavigationStepQueryObject([...new Set(testCaseNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseNavigationStepQueryData);
  let testCaseFunctionStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', FUNCTION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcfs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'FUNCTION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'FUNCTION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'FUNCTION_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcfs.FUNCTION_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, TEST_CASE tc, TEST_SET ts, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd WHERE ${testCaseCondition} AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' OR tcfs.IS_PURE_NAVIGATION_STEP IS NULL OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcfs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY TEST_CASE_STEP_ID, FUNCTION_STEP_ID ASC;`;
  let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
  dataObject['isTestCaseFunctionExist'] = testCaseFunctionStepQueryData && testCaseFunctionStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(functionStepNormalQueryObject([...new Set(testCaseFunctionStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionStepQueryData);
  let testCaseFunctionNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.FUNCTION_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ), ' Page - ', 'Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' AS PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID AS PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_View_Navigation_Step' as 'QueryDataType', vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ${testCaseCondition} AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcfs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcfs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcfs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseFunctionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionNavigationStepQuery, input);
  dataObject['isTestCaseFunctionViewNavigationExist'] = testCaseFunctionNavigationStepQueryData && testCaseFunctionNavigationStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    viewNavigationStepQueryObject([...new Set(testCaseFunctionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionNavigationStepQueryData);
  let testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) AS 'Test Case Step Group Name', '' AS reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfuegs.CURRENT_PAGE_CONTEXT ) AS 'Page ID', 'Active' AS Status, UI_ELEMENT_GROUP_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcfuegs.UI_ELEMENT_GROUP_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcfs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', tcfuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE ${testCaseCondition} AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND tcfs.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY TEST_CASE_STEP_ID ASC, UI_ELEMENT_GROUP_STEP_SEQ_ID ASC;`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input);
  dataObject['isTestCaseFunctionUIElementGroupExist'] = testCaseFunctionUIElementGroupStepQueryData && testCaseFunctionUIElementGroupStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    uIElementGroupStepQueryObject([...new Set(testCaseFunctionUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionUIElementGroupStepQueryData);
  let testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) AS 'Test Case Step Group Name', '' AS reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcuegs.CURRENT_PAGE_CONTEXT ) AS 'Page ID', 'Active' AS Status, UI_ELEMENT_GROUP_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcuegs.UI_ELEMENT_GROUP_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', tcuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE ${testCaseCondition} AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcuegs.UI_ELEMENT_GROUP_UUID = tcs.UI_ELEMENT_GROUP_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE ORDER BY TEST_CASE_STEP_ID, UI_ELEMENT_GROUP_STEP_SEQ_ID ASC;`;
  let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementGroupStepQuery, input);
  dataObject['isTestCaseUIElementGroupExist'] = testCaseUIElementGroupStepQueryData && testCaseUIElementGroupStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    uIElementGroupStepQueryObject([...new Set(testCaseUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseUIElementGroupStepQueryData);
  let attributeIds = '';
  let ui_element_list = [];
  let primaryKeyIds = concatePrimaryKeys(testCaseQueryData);
  let testDataQueryData = await fetchTestData(primaryKeyIds);
  msg.payload.filePresent = false;
  if (testDataQueryData && testDataQueryData.length) {
    msg.payload.filePresent = true;
  }
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    let attributeDataObject = await fetchChildAttributeFromAttributeTable(queryListMap);
    attributeIds = attributeDataObject.attrValues
      .filter(isValidUUID)
      .map((uuid) => `'${uuid}'`)
      .join(', ');
    let pageQueryDataList = await fetchPageDetails(attributeIds);
    let uiElementDataList = await fetchUIElementsDetails(attributeIds);
    let functionQueryDataList = await fetchFunctionDetails(attributeIds);
    let uiElementGroupQueryDataList = await fetchUIElementGroupDetails(attributeIds);
    let apiQueryDataList = await fetchApiDetails(attributeIds);
    let apiAttributeQueryDataList = await fetchApiAttributeDetails(attributeIds);
    let primaryColumnIds = primaryIdString(testCaseStepNormalQueryData);
    let parentStepAttributeValueData = await getStepData(dataObject, primaryColumnIds);
    let childStepAttributeValueData = await getStepChildData(dataObject, primaryColumnIds);
    for (let data of testCaseStepNormalQueryData) {
      let ui_elements = '';
      let is_ui_element = false;
      let inc = 0;
      let stepDefAttributeQueryData = getStepAttributeData(stepDefAttributeQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
      let attributeValueQueryData = getChildAttributeData(attributeDataObject.attributeValueQueryDataEntries, data.PRIMARY_COLUMN_VALUE, data.PRIMARY_COLUMN_NAME);
      let filteredStepAttributeValueData = getDataByParentKeyAndType(parentStepAttributeValueData, data['ParentKey']);
      if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Automated') {
        let inputStepType = data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data' ? 'Given' : data['Test Case Step Type'];
        data['Test Case Step Type'] = inputStepType;
        let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
        let stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';
        data['Step Definition Template'] = stepDefTemplateVerbiageName;
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
          let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
          let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
          for (let codeDesc of stepDefAttributeQueryData) {
            let getAttr = '';
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
              case '57b76ab3-8112-4343-af0f-49643c808bf7':
                {
                  let pageName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7f855066-ad39-4325-8108-30befb2447e6':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '74da67d2-41c9-4cf7-9eea-715243e5fcdc');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (uiElementValueData && Object.keys(uiElementValueData).length && uiElementValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(uiElementValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
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
                  ui_elements = uiElementValue;
                  is_ui_element = true;
                  getAttr = replaceKeyword(uiElementValue);
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Value>',
                      uiElementValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let keyNameInKeyPad = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(keyNameInKeyPad);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Key Name in Keypad>', function () {
                    let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                    return `'` + Datawithbackslash + `'`;
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
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, selectedUIElement);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = replaceKeyword(uiElementQueryData['EVENT_NAME']);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Event Type>',
                      uiElementQueryData['EVENT_NAME']
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementQueryData['EVENT_NAME']);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let confirmUIElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${confirmUIElementValue}]` : '';
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(confirmUIElementValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Confirm UI Element Value>',
                      confirmUIElementValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(confirmUIElementValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                {
                  let functionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                  if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                    getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '3f50ff70-f3e4-11ee-9a12-6fc3e771212a');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${uiElementValue1}]` : '';
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(uiElementValue1);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Value 1>',
                      uiElementValue1
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementValue1);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let userActionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                {
                  let uiElementGroupName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementGroupStepQueryData = getUIElementGroupDetails(uiElementGroupQueryDataList, uiElementGroupName);
                  if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                    getAttr = uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] + `:-:` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let pageNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(pageNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Page Number>',
                    pageNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(pageNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataKey = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataKey);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Key>',
                    dataKey
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataKey);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataValue);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Value>',
                    dataValue
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataValue);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Name>',
                    fileName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let downloadParserName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(downloadParserName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Document Parser Name>',
                    downloadParserName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(downloadParserName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiQueryData = getApiDetails(apiQueryDataList, apiName);
                  if (apiQueryData && Object.keys(apiQueryData).length) {
                    getAttr = apiQueryData['API_ID'] + `:-:` + apiQueryData['API_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiQueryData['API_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '46136260-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiAttributeName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                  if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                    getAttr = apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '7182ebf0-2e33-11ef-9033-4bb93e602d01');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let apiAttributeValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (apiAttributeValueData && Object.keys(apiAttributeValueData).length && apiAttributeValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(apiAttributeValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      ['Test_Case_Step_Normal', 'Test_Case_Function_Step'].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${apiAttributeValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      apiAttributeValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      apiAttributeValue = selectedAttributeDetails['NAME'];
                    }
                    apiAttributeValue = decideScopePrefix(apiAttributeValueData) + apiAttributeValue;
                  }
                  ui_elements = apiAttributeValue;
                  is_ui_element = true;
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(apiAttributeValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<API Attribute Value>',
                      apiAttributeValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(apiAttributeValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '833eb770-2e33-11ef-9033-4bb93e602d01':
                {
                  let responseStatusCode = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(responseStatusCode);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Response Status Code>',
                    responseStatusCode
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(responseStatusCode);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd':
                {
                  let pageName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName1);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                {
                  let uiElementState = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(uiElementState);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element State>',
                    uiElementState
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementState);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeOot = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeOot);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Timeout>',
                    timeOot
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeOot);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
                {
                  let testSetScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testSetScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testSetScope;
                  }
                  getAttr = replaceKeyword(testSetScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Set Scope Variable>',
                    testSetScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testSetScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '842981e7-e484-11ef-904e-02c8cad0208d':
                {
                  let testCaseScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testCaseScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testCaseScope;
                  }
                  getAttr = replaceKeyword(testCaseScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Case Scope Variable>',
                    testCaseScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testCaseScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeInterval = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeInterval);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Time Interval>',
                    timeInterval
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeInterval);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let attempts = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(attempts);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Attempts>',
                    attempts
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(attempts);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '75b16425-1531-4cee-8c09-30f5be70c4b0');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let cellValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (cellValueData && Object.keys(cellValueData).length && cellValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(cellValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${cellValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      cellValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      cellValue = selectedAttributeDetails['NAME'];
                    }
                    cellValue = decideScopePrefix(cellValueData) + cellValue;
                  }
                  getAttr = replaceKeyword(cellValue);
                  ui_elements = cellValue;
                  is_ui_element = true;
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Cell Value>',
                      cellValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(cellValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let rowNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(rowNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Row Number>',
                    rowNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(rowNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Table Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '078e6534-f38f-4aad-b89d-cad8216ad86b':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ba1ef281-412a-4544-b615-7767b06eb489':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, 'ba1ef281-412a-4544-b615-7767b06eb489');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${cellValue1}]` : '';
                  getAttr = replaceKeyword(cellValue1);
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Cell Value 1>',
                      cellValue1
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(cellValue1);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let columnNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(columnNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Column Number>',
                    columnNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(columnNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '28058e26-fa09-42fb-868a-1988bd0a746c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileFullPath = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileFullPath);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Full Path>',
                    fileFullPath
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileFullPath);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
            }
            inc++;
            let valueColumnName = `v` + inc;
            data[valueColumnName] = getAttr;
          }
        }
        let getKeywordByStepType = inputStepType ? inputStepType + ' ' : '';
        data['Test Case Step Name'] = getKeywordByStepType + stepDefTemplateVerbiageName;
        data['TEST_CASE_STEP_UUID'] = data['ParentKey'];
        if (data['API_UUID']) {
          apiList.push(data['API_UUID']);
        }
        if (is_ui_element) {
          let testCaseDetails = testCaseQueryData.filter((item) => item['Test Case ID'] == data['Test Case ID']);
          let stepDetails = {};
          stepDetails['TEST_CASE_UUID'] = testCaseDetails[0]['Test Case UUID'];
          stepDetails['TEST_DATA_COLUMN_ID'] = 'F';
          stepDetails['TEST_CASE_STEP_UUID'] = data['ParentKey'];
          stepDetails['TEST_DATA_VALUE'] = ui_elements;
          stepDetails['IS_ITEM_REMOVE'] = data['isItemRemove'];
          stepDetails['FUNCTION_UUID'] = data['FunctionKey'];
          stepDetails['FUNCTION_STEP_UUID'] = data['FunctionStepKey'];
          stepDetails['UI_ELEMENT_GROUP_UUID'] = data['UIElementGroupKey'];
          stepDetails['UI_ELEMENT_GROUP_STEP_UUID'] = data['UIElementGroupStepKey'];
          stepDetails['VIEW_UUID'] = data['ViewKey'];
          stepDetails['QueryDataType'] = data['QueryDataType'];
          stepDetails['VIEW_NAVIGATION_STEP_UUID'] = data['ViewNavigationStepKey'];
          ui_element_list.push(stepDetails);
        }
      }
    }
  }
  testCaseStepNormalQueryData = reorderTestCaseStep(testCaseStepNormalQueryData);
  let testDataQueryDataPreList = testDataQueryData;
  testDataQueryDataPreList = ui_element_list.concat(testDataQueryData);
  testCaseStepNormalQueryData = processTestCaseSteps(testDataQueryDataPreList, testCaseStepNormalQueryData);
  let currentPageIds = '';
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    currentPageIds = testCaseStepNormalQueryData
      .map((item) => item['Page ID'])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID', IS_BASE_URL_OVERRIDDEN FROM PAGE WHERE PAGE_UUID in(${
    attributeIds ? attributeIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
  pageNewQueryData = await ConcatinateURL(pageNewQueryData);
  let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
  let uiElementQuery = `SELECT PAGE.PAGE_ID AS 'Page ID', UI_ELEMENT.UI_ELEMENT_ID AS 'UI Element ID', UI_ELEMENT.UI_ELEMENT_NAME AS 'UI Element Name', (SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID = UI_ELEMENT.UI_ELEMENT_TYPE) AS 'Element Type', UI_ELEMENT.LOCATOR_TYPE AS 'Locator Type', UI_ELEMENT.LOCATOR_VALUE AS 'Locator Value', CASE WHEN (IFNULL(UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER END AS 'Is Page Load Identifier', 'Active' AS Status, 'No Action' AS Actions, UI_ELEMENT.EVENT_NAME AS 'Event Name', UI_ELEMENT.UI_ELEMENT_UUID AS 'UI Element UUID' FROM UI_ELEMENT JOIN PAGE ON PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID WHERE UI_ELEMENT.PAGE_NEW_UUID IN (${
    pageList ? pageList : `''`
  }) ORDER BY UI_ELEMENT.UI_ELEMENT_ID ASC`;
  let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementQuery, input);
  if (uiElementQueryData && uiElementQueryData.length) {
    uiElementQueryData.sort((a, b) => {
      let afield1 = a['Page ID'];
      let bfield1 = b['Page ID'];
      let afield2 = a['UI ELement ID'];
      let bfield2 = b['UI ELement ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  let currentApiIds = '';
  if (apiList && apiList.length) {
    currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
  }
  let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID',USE_PROXY_INDICATOR as 'Use Proxy Indicator' FROM API_NEW WHERE API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID order by API_ID asc`;
  let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
  let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) order by API_ATTRIBUTE_ID asc`;
  let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiAttributeQuery, input);
  if (apiAttributeQueryData && apiAttributeQueryData.length) {
    apiAttributeQueryData.sort((a, b) => {
      let afield1 = a['API ID'];
      let bfield1 = b['API ID'];
      let afield2 = a['API Attribute ID'];
      let bfield2 = b['API Attribute ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  msg.payload.result.message = 'JSON Downloaded';
  let userNameQuery = `SELECT concat(FIRST_NAME, ' ',LAST_NAME) as USER_NAME FROM USER_PROFILE WHERE AE_USER_PROFILE_UUID=:APP_LOGGED_IN_USER_ID;`;
  let userNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('INFO_AUTHORIZATION', userNameQuery, input);
  let functionalAreaQuery = `SELECT '${userNameQueryData['USER_NAME']}' as USER_NAME,:APP_LOGGED_IN_USER_ID as USER_UUID, FUNCTIONAL_AREA_UUID as APP_UUID,TENANT_UUID as TENANT_UUID, :TEST_SUITE_UUID as 'TEST_SUITE_UUID',:MASTER_CODE_VERSION_ID as 'VERSION_NUMBER' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID;`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionalAreaQuery, input);
  responseJson['application'] = functionalAreaQueryData;
  responseJson['apiconfig'] = transformApiDataMultiple(apiQueryData, apiAttributeQueryData);
  responseJson['pageConfig'] = preparePageConfig(pageNewQueryData, uiElementQueryData);
  let testSetData = prepareTestSetConfig(testSetQueryData, testCaseQueryData, testCaseStepNormalQueryData);
  responseJson['testsetConfig'] = testSetData['testSetConfigObject'];
  responseJson['testsetConfigFlattend'] = testSetData['testsetConfigFlattendObject'];
  msg.payload.result.data = responseJson;
  node.send(msg);
} else if (input.TYPE == 'PERSONAL_TEST_SET') {
  msg.payload.result = {};
  let apiList = [];
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster = versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let testSetQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_SET_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,TEST_SET_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM TEST_SET,FUNCTIONAL_AREA WHERE TEST_SET_UUID=:TEST_SET_UUID AND TEST_SET.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
    testSetQueryData = testSetQueryData.map((testSet) => {
      return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
    });
  }
  let testCaseQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', TEST_CASE_SEQ_ID AS 'Test Case Seq ID', TEST_CASE_NAME AS 'Test Case Name', 'Active' AS Status, 'No Action' AS Actions, TEST_CASE_UUID AS 'Test Case UUID' FROM TEST_CASE, TEST_SET WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID AND TEST_CASE.TEST_SET_UUID=:TEST_SET_UUID AND TEST_CASE.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND TEST_CASE.TEST_CASE_STATUS = 'DRAFT' AND TEST_CASE.TEST_CASE_OWNER=:APP_LOGGED_IN_USER_ID ORDER BY TEST_CASE_SEQ_ID ASC;`;
  let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
  let testCaseStepNormalQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_Step_Normal' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'DRAFT' AND tc.TEST_CASE_OWNER=:APP_LOGGED_IN_USER_ID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' OR tcs.IS_PURE_NAVIGATION_STEP IS NULL ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
  let testCaseStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepNormalQuery, input);
  dataObject['isNormalTestCaseExist'] = testCaseStepNormalQueryData && testCaseStepNormalQueryData.length ? 'Yes' : 'No';
  queryListMap.push(testCaseStepNormalQueryObject([...new Set(testCaseStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  let testCaseNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' AS PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID AS PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_View_Navigation_Step' as 'QueryDataType',vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'DRAFT' AND tc.TEST_CASE_OWNER=:APP_LOGGED_IN_USER_ID AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationStepQuery, input);
  dataObject['isTestCaseViewNavigationExist'] = testCaseNavigationStepQueryData && testCaseNavigationStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(viewNavigationStepQueryObject([...new Set(testCaseNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseNavigationStepQueryData);
  let testCaseFunctionStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', FUNCTION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcfs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'FUNCTION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'FUNCTION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'FUNCTION_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcfs.FUNCTION_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, TEST_CASE tc, TEST_SET ts, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'DRAFT' AND tc.TEST_CASE_OWNER=:APP_LOGGED_IN_USER_ID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' OR tcfs.IS_PURE_NAVIGATION_STEP IS NULL OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcfs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY TEST_CASE_STEP_ID, FUNCTION_STEP_ID ASC;`;
  let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
  dataObject['isTestCaseFunctionExist'] = testCaseFunctionStepQueryData && testCaseFunctionStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(functionStepNormalQueryObject([...new Set(testCaseFunctionStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionStepQueryData);
  let testCaseFunctionNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.FUNCTION_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ), ' Page - ', 'Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' AS PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID AS PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_View_Navigation_Step' as 'QueryDataType',vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcfs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'DRAFT' AND tc.TEST_CASE_OWNER=:APP_LOGGED_IN_USER_ID AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcfs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcfs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseFunctionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionNavigationStepQuery, input);
  dataObject['isTestCaseFunctionViewNavigationExist'] = testCaseFunctionNavigationStepQueryData && testCaseFunctionNavigationStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    viewNavigationStepQueryObject([...new Set(testCaseFunctionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionNavigationStepQueryData);
  let testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) AS 'Test Case Step Group Name', '' AS reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfuegs.CURRENT_PAGE_CONTEXT ) AS 'Page ID', 'Active' AS Status, UI_ELEMENT_GROUP_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcfuegs.UI_ELEMENT_GROUP_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcfs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', tcfuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND tcfs.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'DRAFT' AND tc.TEST_CASE_OWNER=:APP_LOGGED_IN_USER_ID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY TEST_CASE_STEP_ID ASC, UI_ELEMENT_GROUP_STEP_SEQ_ID ASC;`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input);
  dataObject['isTestCaseFunctionUIElementGroupExist'] = testCaseFunctionUIElementGroupStepQueryData && testCaseFunctionUIElementGroupStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    uIElementGroupStepQueryObject([...new Set(testCaseFunctionUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionUIElementGroupStepQueryData);
  let testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) AS 'Test Case Step Group Name', '' AS reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcuegs.CURRENT_PAGE_CONTEXT ) AS 'Page ID', 'Active' AS Status, UI_ELEMENT_GROUP_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcuegs.UI_ELEMENT_GROUP_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', tcuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcuegs.UI_ELEMENT_GROUP_UUID = tcs.UI_ELEMENT_GROUP_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'DRAFT' AND tc.TEST_CASE_OWNER=:APP_LOGGED_IN_USER_ID ORDER BY TEST_CASE_STEP_ID, UI_ELEMENT_GROUP_STEP_SEQ_ID ASC;`;
  let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementGroupStepQuery, input);
  dataObject['isTestCaseUIElementGroupExist'] = testCaseUIElementGroupStepQueryData && testCaseUIElementGroupStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    uIElementGroupStepQueryObject([...new Set(testCaseUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseUIElementGroupStepQueryData);
  let attributeIds = '';
  let ui_element_list = [];
  let primaryKeyIds = concatePrimaryKeys(testCaseQueryData);
  let testDataQueryData = await fetchTestData(primaryKeyIds);
  msg.payload.filePresent = false;
  if (testDataQueryData && testDataQueryData.length) {
    msg.payload.filePresent = true;
  }
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    let attributeDataObject = await fetchChildAttributeFromAttributeTable(queryListMap);
    attributeIds = attributeDataObject.attrValues
      .filter(isValidUUID)
      .map((uuid) => `'${uuid}'`)
      .join(', ');
    let pageQueryDataList = await fetchPageDetails(attributeIds);
    let uiElementDataList = await fetchUIElementsDetails(attributeIds);
    let functionQueryDataList = await fetchFunctionDetails(attributeIds);
    let uiElementGroupQueryDataList = await fetchUIElementGroupDetails(attributeIds);
    let apiQueryDataList = await fetchApiDetails(attributeIds);
    let apiAttributeQueryDataList = await fetchApiAttributeDetails(attributeIds);
    let primaryColumnIds = primaryIdString(testCaseStepNormalQueryData);
    let parentStepAttributeValueData = await getStepData(dataObject, primaryColumnIds);
    let childStepAttributeValueData = await getStepChildData(dataObject, primaryColumnIds);
    for (let data of testCaseStepNormalQueryData) {
      data['isItemRemove'] = false;
      let ui_elements = '';
      let is_ui_element = false;
      let inc = 0;
      let stepDefAttributeQueryData = getStepAttributeData(stepDefAttributeQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
      let attributeValueQueryData = getChildAttributeData(attributeDataObject.attributeValueQueryDataEntries, data.PRIMARY_COLUMN_VALUE, data.PRIMARY_COLUMN_NAME);
      let filteredStepAttributeValueData = getDataByParentKeyAndType(parentStepAttributeValueData, data['ParentKey']);
      if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Automated') {
        let inputStepType = data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data' ? 'Given' : data['Test Case Step Type'];
        data['Test Case Step Type'] = inputStepType;
        let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
        let stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';
        data['Step Definition Template'] = stepDefTemplateVerbiageName;
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
          let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
          let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
          for (let codeDesc of stepDefAttributeQueryData) {
            let getAttr = '';
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
              case '57b76ab3-8112-4343-af0f-49643c808bf7':
                {
                  let pageName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7f855066-ad39-4325-8108-30befb2447e6':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '74da67d2-41c9-4cf7-9eea-715243e5fcdc');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (uiElementValueData && Object.keys(uiElementValueData).length && uiElementValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(uiElementValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
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
                  ui_elements = uiElementValue;
                  is_ui_element = true;
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(uiElementValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Value>',
                      uiElementValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let keyNameInKeyPad = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(keyNameInKeyPad);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Key Name in Keypad>', function () {
                    let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                    return `'` + Datawithbackslash + `'`;
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
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, selectedUIElement);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = replaceKeyword(uiElementQueryData['EVENT_NAME']);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Event Type>',
                      uiElementQueryData['EVENT_NAME']
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementQueryData['EVENT_NAME']);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let confirmUIElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${confirmUIElementValue}]` : '';
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(confirmUIElementValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Confirm UI Element Value>',
                      confirmUIElementValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(confirmUIElementValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                {
                  let functionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                  if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                    getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '3f50ff70-f3e4-11ee-9a12-6fc3e771212a');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${uiElementValue1}]` : '';
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(uiElementValue1);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Value 1>',
                      uiElementValue1
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementValue1);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let userActionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                {
                  let uiElementGroupName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementGroupStepQueryData = getUIElementGroupDetails(uiElementGroupQueryDataList, uiElementGroupName);
                  if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                    getAttr = uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] + `:-:` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let pageNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(pageNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Page Number>',
                    pageNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(pageNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataKey = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataKey);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Key>',
                    dataKey
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataKey);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataValue);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Value>',
                    dataValue
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataValue);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Name>',
                    fileName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let downloadParserName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(downloadParserName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Document Parser Name>',
                    downloadParserName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(downloadParserName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiQueryData = getApiDetails(apiQueryDataList, apiName);
                  if (apiQueryData && Object.keys(apiQueryData).length) {
                    getAttr = apiQueryData['API_ID'] + `:-:` + apiQueryData['API_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiQueryData['API_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '46136260-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiAttributeName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                  if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                    getAttr = apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '7182ebf0-2e33-11ef-9033-4bb93e602d01');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let apiAttributeValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (apiAttributeValueData && Object.keys(apiAttributeValueData).length && apiAttributeValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(apiAttributeValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      ['Test_Case_Step_Normal', 'Test_Case_Function_Step'].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${apiAttributeValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      apiAttributeValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      apiAttributeValue = selectedAttributeDetails['NAME'];
                    }
                    apiAttributeValue = decideScopePrefix(apiAttributeValueData) + apiAttributeValue;
                  }
                  ui_elements = apiAttributeValue;
                  is_ui_element = true;
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(apiAttributeValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<API Attribute Value>',
                      apiAttributeValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(apiAttributeValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '833eb770-2e33-11ef-9033-4bb93e602d01':
                {
                  let responseStatusCode = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(responseStatusCode);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Response Status Code>',
                    responseStatusCode
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(responseStatusCode);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd':
                {
                  let pageName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName1);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                {
                  let uiElementState = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(uiElementState);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element State>',
                    uiElementState
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementState);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeOot = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeOot);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Timeout>',
                    timeOot
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeOot);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
                {
                  let testSetScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testSetScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testSetScope;
                  }
                  getAttr = replaceKeyword(testSetScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Set Scope Variable>',
                    testSetScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testSetScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '842981e7-e484-11ef-904e-02c8cad0208d':
                {
                  let testCaseScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testCaseScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testCaseScope;
                  }
                  getAttr = replaceKeyword(testCaseScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Case Scope Variable>',
                    testCaseScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testCaseScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeInterval = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeInterval);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Time Interval>',
                    timeInterval
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeInterval);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let attempts = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(attempts);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Attempts>',
                    attempts
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(attempts);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '75b16425-1531-4cee-8c09-30f5be70c4b0');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let cellValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (cellValueData && Object.keys(cellValueData).length && cellValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(cellValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${cellValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      cellValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      cellValue = selectedAttributeDetails['NAME'];
                    }
                    cellValue = decideScopePrefix(cellValueData) + cellValue;
                  }
                  ui_elements = cellValue;
                  is_ui_element = true;
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(cellValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Cell Value>',
                      cellValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(cellValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let rowNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(rowNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Row Number>',
                    rowNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(rowNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Table Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '078e6534-f38f-4aad-b89d-cad8216ad86b':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ba1ef281-412a-4544-b615-7767b06eb489':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, 'ba1ef281-412a-4544-b615-7767b06eb489');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${cellValue1}]` : '';
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(cellValue1);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Cell Value 1>',
                      cellValue1
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(cellValue1);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let columnNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(columnNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Column Number>',
                    columnNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(columnNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '28058e26-fa09-42fb-868a-1988bd0a746c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileFullPath = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileFullPath);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Full Path>',
                    fileFullPath
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileFullPath);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
            }
            inc++;
            let valueColumnName = `v` + inc;
            data[valueColumnName] = getAttr;
          }
        }
        let getKeywordByStepType = inputStepType ? inputStepType + ' ' : '';
        data['Test Case Step Name'] = getKeywordByStepType + stepDefTemplateVerbiageName;
        data['TEST_CASE_STEP_UUID'] = data['ParentKey'];
        if (data['API_UUID']) {
          apiList.push(data['API_UUID']);
        }
        if (is_ui_element) {
          let testCaseDetails = testCaseQueryData.filter((item) => item['Test Case ID'] == data['Test Case ID']);
          let stepDetails = {};
          stepDetails['TEST_CASE_UUID'] = testCaseDetails[0]['Test Case UUID'];
          stepDetails['TEST_DATA_COLUMN_ID'] = 'F';
          stepDetails['TEST_CASE_STEP_UUID'] = data['ParentKey'];
          stepDetails['TEST_DATA_VALUE'] = ui_elements;
          stepDetails['IS_ITEM_REMOVE'] = data['isItemRemove'];
          stepDetails['FUNCTION_UUID'] = data['FunctionKey'];
          stepDetails['FUNCTION_STEP_UUID'] = data['FunctionStepKey'];
          stepDetails['UI_ELEMENT_GROUP_UUID'] = data['UIElementGroupKey'];
          stepDetails['UI_ELEMENT_GROUP_STEP_UUID'] = data['UIElementGroupStepKey'];
          stepDetails['VIEW_UUID'] = data['ViewKey'];
          stepDetails['QueryDataType'] = data['QueryDataType'];
          stepDetails['VIEW_NAVIGATION_STEP_UUID'] = data['ViewNavigationStepKey'];
          ui_element_list.push(stepDetails);
        }
      }
    }
  }
  testCaseStepNormalQueryData = reorderTestCaseStep(testCaseStepNormalQueryData);
  let testDataQueryDataPreList = testDataQueryData;
  testDataQueryDataPreList = ui_element_list.concat(testDataQueryData);
  testCaseStepNormalQueryData = processTestCaseSteps(testDataQueryDataPreList, testCaseStepNormalQueryData);
  let currentPageIds = '';
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    currentPageIds = testCaseStepNormalQueryData
      .map((item) => item['Page ID'])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID', IS_BASE_URL_OVERRIDDEN FROM PAGE WHERE PAGE_UUID in(${
    attributeIds ? attributeIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
  pageNewQueryData = await ConcatinateURL(pageNewQueryData);
  let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
  let uiElementQuery = `SELECT PAGE.PAGE_ID AS 'Page ID', UI_ELEMENT.UI_ELEMENT_ID AS 'UI Element ID', UI_ELEMENT.UI_ELEMENT_NAME AS 'UI Element Name', (SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID = UI_ELEMENT.UI_ELEMENT_TYPE) AS 'Element Type', UI_ELEMENT.LOCATOR_TYPE AS 'Locator Type', UI_ELEMENT.LOCATOR_VALUE AS 'Locator Value', CASE WHEN (IFNULL(UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER END AS 'Is Page Load Identifier', 'Active' AS Status, 'No Action' AS Actions, UI_ELEMENT.EVENT_NAME AS 'Event Name', UI_ELEMENT.UI_ELEMENT_UUID AS 'UI Element UUID' FROM UI_ELEMENT JOIN PAGE ON PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID WHERE UI_ELEMENT.PAGE_NEW_UUID IN (${
    pageList ? pageList : `''`
  }) ORDER BY UI_ELEMENT.UI_ELEMENT_ID ASC`;
  let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementQuery, input);
  if (uiElementQueryData && uiElementQueryData.length) {
    uiElementQueryData.sort((a, b) => {
      let afield1 = a['Page ID'];
      let bfield1 = b['Page ID'];
      let afield2 = a['UI ELement ID'];
      let bfield2 = b['UI ELement ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  let currentApiIds = '';
  if (apiList && apiList.length) {
    currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
  }
  let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID',USE_PROXY_INDICATOR as 'Use Proxy Indicator' FROM API_NEW WHERE API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID order by API_ID asc`;
  let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
  let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) order by API_ATTRIBUTE_ID asc`;
  let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiAttributeQuery, input);
  if (apiAttributeQueryData && apiAttributeQueryData.length) {
    apiAttributeQueryData.sort((a, b) => {
      let afield1 = a['API ID'];
      let bfield1 = b['API ID'];
      let afield2 = a['API Attribute ID'];
      let bfield2 = b['API Attribute ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  msg.payload.result.message = 'JSON Downloaded';
  let userNameQuery = `SELECT concat(FIRST_NAME, ' ',LAST_NAME) as USER_NAME FROM USER_PROFILE WHERE AE_USER_PROFILE_UUID=:APP_LOGGED_IN_USER_ID;`;
  let userNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('INFO_AUTHORIZATION', userNameQuery, input);
  let functionalAreaQuery = `SELECT '${userNameQueryData['USER_NAME']}' as USER_NAME,:APP_LOGGED_IN_USER_ID as USER_UUID, FUNCTIONAL_AREA_UUID as APP_UUID,TENANT_UUID as TENANT_UUID, :TEST_SUITE_UUID as 'TEST_SUITE_UUID',:MASTER_CODE_VERSION_ID as 'VERSION_NUMBER' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID;`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionalAreaQuery, input);
  responseJson['application'] = functionalAreaQueryData;
  responseJson['apiconfig'] = transformApiDataMultiple(apiQueryData, apiAttributeQueryData);
  responseJson['pageConfig'] = preparePageConfig(pageNewQueryData, uiElementQueryData);
  let testSetData = prepareTestSetConfig(testSetQueryData, testCaseQueryData, testCaseStepNormalQueryData);
  responseJson['testsetConfig'] = testSetData['testSetConfigObject'];
  responseJson['testsetConfigFlattend'] = testSetData['testsetConfigFlattendObject'];
  msg.payload.result.data = responseJson;
  node.send(msg);
} else if (input.TYPE == 'TEST_SUITE') {
  msg.payload.result = {};
  let apiList = [];
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster = versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let fetchTestSetsIds = `select TEST_SET_UUID from TEST_SUITE_TEST_SET where TEST_SUITE_UUID=:TEST_SUITE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_SUITE_TEST_SET_ID asc;`;
  let testSetIdsData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fetchTestSetsIds, input);
  let fetchTestSuiteType = `select TEST_SUITE_TYPE from TEST_SUITE where TEST_SUITE_UUID=:TEST_SUITE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
  let fetchTestSuiteTypeData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fetchTestSuiteType, input);
  let testSuiteType = fetchTestSuiteTypeData[0]['TEST_SUITE_TYPE'];
  if (testSetIdsData && testSetIdsData.length) {
    let testSetID = [...new Set(testSetIdsData.map((item) => item.TEST_SET_UUID).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ');
    let testSetQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_SET_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,TEST_SET_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM TEST_SET,FUNCTIONAL_AREA WHERE TEST_SET_UUID in(${testSetID}) AND TEST_SET.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
    let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
    if (testSetQueryData && testSetQueryData.length > 0) {
      testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
      testSetQueryData = testSetQueryData.map((testSet) => {
        return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
      });
    }
    let testCaseQuery = `''`;
    const tcCondition = getTcCondition('TEST_CASE');
    const usTcCondition = getTcCondition('tc');
    if (input.TEST_SUITE_TYPE !== 'Release' || input.TEST_SUITE_TYPE == null) {
      testCaseQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_SEQ_ID as 'Test Case Seq ID',TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,TEST_CASE_UUID as 'Test Case UUID',TEST_CASE_UUID FROM TEST_CASE,TEST_SET WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID AND TEST_CASE.TEST_SET_UUID in(${testSetID}) AND TEST_CASE.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND ${tcCondition} ORDER BY TEST_CASE_SEQ_ID asc`;
    } else {
      testCaseQuery = `SELECT DISTINCT TEST_SET_ID as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_SEQ_ID as 'Test Case Seq ID',TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions, tc.TEST_CASE_UUID as 'Test Case UUID',tc.TEST_CASE_UUID FROM TEST_CASE tc INNER JOIN TEST_SET ts ON tc.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') INNER JOIN TEST_CASE_STEP tsc ON tc.TEST_CASE_UUID = tsc.TEST_CASE_UUID WHERE ts.TEST_SET_UUID in (${testSetID}) AND ${usTcCondition} ORDER BY tc.TEST_CASE_ID ASC; `;
    }
    let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
    let testCaseID = testCaseQueryData && testCaseQueryData.length ? [...new Set(testCaseQueryData.map((item) => item.TEST_CASE_UUID).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ') : '';
    let testCaseStepNormalQuery = `SELECT TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_Step_Normal' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tc.TEST_SET_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.TEST_CASE_UUID in (${
      testCaseID ? testCaseID : `''`
    }) AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' OR tcs.IS_PURE_NAVIGATION_STEP IS NULL ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
    let testCaseStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepNormalQuery, input);
    dataObject['isNormalTestCaseExist'] = testCaseStepNormalQueryData && testCaseStepNormalQueryData.length ? 'Yes' : 'No';
    queryListMap.push(testCaseStepNormalQueryObject([...new Set(testCaseStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
    let testCaseNavigationStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' AS PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID AS PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_View_Navigation_Step' as 'QueryDataType',vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tc.TEST_SET_UUID AND tcs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcs.TEST_CASE_UUID in (${
      testCaseID ? testCaseID : `''`
    }) AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
    let testCaseNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationStepQuery, input);
    dataObject['isTestCaseViewNavigationExist'] = testCaseNavigationStepQueryData && testCaseNavigationStepQueryData.length ? 'Yes' : 'No';
    queryListMap.push(viewNavigationStepQueryObject([...new Set(testCaseNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
    testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseNavigationStepQueryData);
    let testCaseFunctionStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', FUNCTION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcfs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'FUNCTION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'FUNCTION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'FUNCTION_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcfs.FUNCTION_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, TEST_CASE tc, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tc.TEST_SET_UUID AND tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND tcs.TEST_CASE_UUID in (${
      testCaseID ? testCaseID : `''`
    }) AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' OR tcfs.IS_PURE_NAVIGATION_STEP IS NULL OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcfs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY TEST_CASE_STEP_ID, FUNCTION_STEP_ID ASC;`;
    let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
    dataObject['isTestCaseFunctionExist'] = testCaseFunctionStepQueryData && testCaseFunctionStepQueryData.length ? 'Yes' : 'No';
    queryListMap.push(functionStepNormalQueryObject([...new Set(testCaseFunctionStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
    testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionStepQueryData);
    let testCaseFunctionNavigationStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.FUNCTION_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ), ' Page - ', 'Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' AS PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID AS PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_View_Navigation_Step' as 'QueryDataType', vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tc.TEST_SET_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcs.TEST_CASE_UUID in (${
      testCaseID ? testCaseID : `''`
    }) AND tcfs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcfs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcfs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
    let testCaseFunctionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionNavigationStepQuery, input);
    dataObject['isTestCaseFunctionViewNavigationExist'] = testCaseFunctionNavigationStepQueryData && testCaseFunctionNavigationStepQueryData.length ? 'Yes' : 'No';
    queryListMap.push(
      viewNavigationStepQueryObject([...new Set(testCaseFunctionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
    );
    testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionNavigationStepQueryData);
    let testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) AS 'Test Case Step Group Name', '' AS reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfuegs.CURRENT_PAGE_CONTEXT ) AS 'Page ID', 'Active' AS Status, UI_ELEMENT_GROUP_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcfuegs.UI_ELEMENT_GROUP_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcfs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', tcfuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tc.TEST_SET_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND tcfs.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID AND tcs.TEST_CASE_UUID in (${
      testCaseID ? testCaseID : `''`
    }) AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY TEST_CASE_STEP_ID ASC, UI_ELEMENT_GROUP_STEP_SEQ_ID ASC;`;
    let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input);
    dataObject['isTestCaseFunctionUIElementGroupExist'] = testCaseFunctionUIElementGroupStepQueryData && testCaseFunctionUIElementGroupStepQueryData.length ? 'Yes' : 'No';
    queryListMap.push(
      uIElementGroupStepQueryObject([...new Set(testCaseFunctionUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
    );
    testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionUIElementGroupStepQueryData);
    let testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) AS 'Test Case Step Group Name', '' AS reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcuegs.CURRENT_PAGE_CONTEXT ) AS 'Page ID', 'Active' AS Status, UI_ELEMENT_GROUP_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcuegs.UI_ELEMENT_GROUP_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', tcuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tc.TEST_SET_UUID AND tcuegs.UI_ELEMENT_GROUP_UUID = tcs.UI_ELEMENT_GROUP_UUID AND tcs.TEST_CASE_UUID in (${
      testCaseID ? testCaseID : `''`
    }) AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID, UI_ELEMENT_GROUP_STEP_SEQ_ID ASC;`;
    let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementGroupStepQuery, input);
    dataObject['isTestCaseUIElementGroupExist'] = testCaseUIElementGroupStepQueryData && testCaseUIElementGroupStepQueryData.length ? 'Yes' : 'No';
    queryListMap.push(
      uIElementGroupStepQueryObject([...new Set(testCaseUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
    );
    testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseUIElementGroupStepQueryData);
    let attributeIds = '';
    let ui_element_list = [];
    let primaryKeyIds = concatePrimaryKeys(testCaseQueryData);
    let testDataQueryData = await fetchTestData(primaryKeyIds);
    msg.payload.filePresent = false;
    if (testDataQueryData && testDataQueryData.length) {
      msg.payload.filePresent = true;
    }
    if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
      let attributeDataObject = await fetchChildAttributeFromAttributeTable(queryListMap);
      attributeIds = attributeDataObject.attrValues
        .filter(isValidUUID)
        .map((uuid) => `'${uuid}'`)
        .join(', ');
      let pageQueryDataList = await fetchPageDetails(attributeIds);
      let uiElementDataList = await fetchUIElementsDetails(attributeIds);
      let functionQueryDataList = await fetchFunctionDetails(attributeIds);
      let uiElementGroupQueryDataList = await fetchUIElementGroupDetails(attributeIds);
      let apiQueryDataList = await fetchApiDetails(attributeIds);
      let apiAttributeQueryDataList = await fetchApiAttributeDetails(attributeIds);
      let primaryColumnIds = primaryIdString(testCaseStepNormalQueryData);
      let parentStepAttributeValueData = await getStepData(dataObject, primaryColumnIds);
      let childStepAttributeValueData = await getStepChildData(dataObject, primaryColumnIds);
      for (let data of testCaseStepNormalQueryData) {
        let ui_elements = '';
        let is_ui_element = false;
        let inc = 0;
        let stepDefAttributeQueryData = getStepAttributeData(stepDefAttributeQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
        let attributeValueQueryData = getChildAttributeData(attributeDataObject.attributeValueQueryDataEntries, data.PRIMARY_COLUMN_VALUE, data.PRIMARY_COLUMN_NAME);
        let filteredStepAttributeValueData = getDataByParentKeyAndType(parentStepAttributeValueData, data['ParentKey']);
        if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Automated') {
          let inputStepType = data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data' ? 'Given' : data['Test Case Step Type'];
          data['Test Case Step Type'] = inputStepType;
          let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
          let stepDefTemplateVerbiageName =
            stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';
          data['Step Definition Template'] = stepDefTemplateVerbiageName;
          if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
            let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
            let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
            for (let codeDesc of stepDefAttributeQueryData) {
              let getAttr = '';
              switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
                case '57b76ab3-8112-4343-af0f-49643c808bf7':
                  {
                    let pageName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let pageNewQueryData = getPageDetails(pageQueryDataList, pageName);
                    if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                      getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                        let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                  {
                    let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name>', function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case '7f855066-ad39-4325-8108-30befb2447e6':
                  {
                    let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                    if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                      getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                      let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '74da67d2-41c9-4cf7-9eea-715243e5fcdc');
                      if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                        let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                          attributeValueQueryData,
                          uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          data['CHILD_ATTRIBUTE_DATA']
                        );
                        if (isUIElementValueEmpty) {
                          data['isItemRemove'] = true;
                        }
                      }
                    }
                    let uiElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let uiElementValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    if (uiElementValueData && Object.keys(uiElementValueData).length && uiElementValueData['SCOPE_VARIABLE_UUID']) {
                      let selectedAttributeDetails = await getAttributeValueDetails(uiElementValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                      if (
                        selectedAttributeDetails &&
                        Object.keys(selectedAttributeDetails).length &&
                        [
                          'Test_Case_Step_Normal',
                          'Test_Case_View_Navigation_Step',
                          'Test_Case_Function_Step',
                          'Test_Case_Function_View_Navigation_Step',
                          'Test_Case_Function_UI_Element_Group_Step',
                          'Test_Case_UI_Element_Group_Step'
                        ].includes(data['QueryDataType']) &&
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
                    ui_elements = uiElementValue;
                    is_ui_element = true;
                    if (uiElementValue) {
                      getAttr = replaceKeyword(uiElementValue);
                    }
                    if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<UI Element Value>',
                        uiElementValue
                          ? function () {
                              let Datawithbackslash = escapeSingleQuote(uiElementValue);
                              return `'` + Datawithbackslash + `'`;
                            }
                          : `' '`
                      );
                    }
                  }
                  break;
                case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let keyNameInKeyPad = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (keyNameInKeyPad) {
                      getAttr = replaceKeyword(keyNameInKeyPad);
                    }
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Key Name in Keypad>', function () {
                      let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                      return `'` + Datawithbackslash + `'`;
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
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, selectedUIElement);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = replaceKeyword(uiElementQueryData['EVENT_NAME']);
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<Event Type>',
                        uiElementQueryData['EVENT_NAME']
                          ? function () {
                              let Datawithbackslash = escapeSingleQuote(uiElementQueryData['EVENT_NAME']);
                              return `'` + Datawithbackslash + `'`;
                            }
                          : `' '`
                      );
                    }
                  }
                  break;
                case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let confirmUIElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    is_ui_element = true;
                    ui_elements = ui_elements ? `[${ui_elements}][${confirmUIElementValue}]` : '';
                    if (confirmUIElementValue) {
                      getAttr = replaceKeyword(confirmUIElementValue);
                    }
                    if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<Confirm UI Element Value>',
                        confirmUIElementValue
                          ? function () {
                              let Datawithbackslash = escapeSingleQuote(confirmUIElementValue);
                              return `'` + Datawithbackslash + `'`;
                            }
                          : `' '`
                      );
                    }
                  }
                  break;
                case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                  {
                    let functionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                    if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                      getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                        let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                  {
                    let uiElementName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name 1>', function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                      let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '3f50ff70-f3e4-11ee-9a12-6fc3e771212a');
                      if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                        let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                          attributeValueQueryData,
                          uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          data['CHILD_ATTRIBUTE_DATA']
                        );
                        if (isUIElementValueEmpty) {
                          data['isItemRemove'] = true;
                        }
                      }
                    }
                    let uiElementValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    is_ui_element = true;
                    ui_elements = ui_elements ? `[${ui_elements}][${uiElementValue1}]` : '';
                    if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<UI Element Value 1>',
                        uiElementValue1
                          ? function () {
                              let Datawithbackslash = escapeSingleQuote(uiElementValue1);
                              return `'` + Datawithbackslash + `'`;
                            }
                          : `' '`
                      );
                    }
                  }
                  break;
                case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                  {
                    let userActionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                  {
                    let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                    if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                      getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                  {
                    let uiElementGroupName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let uiElementGroupStepQueryData = getUIElementGroupDetails(uiElementGroupQueryDataList, uiElementGroupName);
                    if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                      getAttr = uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] + `:-:` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let pageNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (pageNumber) {
                      getAttr = replaceKeyword(pageNumber);
                    }
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Page Number>',
                      pageNumber
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(pageNumber);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let dataKey = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (dataKey) {
                      getAttr = replaceKeyword(dataKey);
                    }
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Data Key>',
                      dataKey
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(dataKey);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let dataValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (dataValue) {
                      getAttr = replaceKeyword(dataValue);
                    }
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Data Value>',
                      dataValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(dataValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let fileName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (fileName) {
                      getAttr = replaceKeyword(fileName);
                    }
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<File Name>',
                      fileName
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(fileName);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let downloadParserName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (downloadParserName) {
                      getAttr = replaceKeyword(downloadParserName);
                    }
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Document Parser Name>',
                      downloadParserName
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(downloadParserName);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
                  {
                    let apiName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let apiQueryData = getApiDetails(apiQueryDataList, apiName);
                    if (apiQueryData && Object.keys(apiQueryData).length) {
                      getAttr = apiQueryData['API_ID'] + `:-:` + apiQueryData['API_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                        let Datawithbackslash = escapeSingleQuote(apiQueryData['API_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case '46136260-2e33-11ef-b3ef-e52f192c3af0':
                  {
                    let apiAttributeName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                    if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                      getAttr = apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
                        let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                      let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '7182ebf0-2e33-11ef-9033-4bb93e602d01');
                      if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                        let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                          attributeValueQueryData,
                          uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          data['CHILD_ATTRIBUTE_DATA']
                        );
                        if (isUIElementValueEmpty) {
                          data['isItemRemove'] = true;
                        }
                      }
                    }
                    let apiAttributeValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let apiAttributeValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    if (apiAttributeValueData && Object.keys(apiAttributeValueData).length && apiAttributeValueData['SCOPE_VARIABLE_UUID']) {
                      let selectedAttributeDetails = await getAttributeValueDetails(apiAttributeValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                      if (
                        selectedAttributeDetails &&
                        Object.keys(selectedAttributeDetails).length &&
                        ['Test_Case_Step_Normal', 'Test_Case_Function_Step'].includes(data['QueryDataType']) &&
                        selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                      ) {
                        let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${apiAttributeValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                        apiAttributeValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                      } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                        apiAttributeValue = selectedAttributeDetails['NAME'];
                      }
                      apiAttributeValue = decideScopePrefix(apiAttributeValueData) + apiAttributeValue;
                    }
                    ui_elements = apiAttributeValue;
                    is_ui_element = true;
                    if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                      getAttr = replaceKeyword(apiAttributeValue);
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<API Attribute Value>',
                        apiAttributeValue
                          ? function () {
                              let Datawithbackslash = escapeSingleQuote(apiAttributeValue);
                              return `'` + Datawithbackslash + `'`;
                            }
                          : `' '`
                      );
                    }
                  }
                  break;
                case '833eb770-2e33-11ef-9033-4bb93e602d01':
                  {
                    let responseStatusCode = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (responseStatusCode) {
                      getAttr = replaceKeyword(responseStatusCode);
                    }
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Response Status Code>',
                      responseStatusCode
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(responseStatusCode);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd':
                  {
                    let pageName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let pageNewQueryData = getPageDetails(pageQueryDataList, pageName1);
                    if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                      getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                        let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                  {
                    let uiElementState = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (uiElementState) {
                      getAttr = replaceKeyword(uiElementState);
                    }
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element State>',
                      uiElementState
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementState);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let timeOot = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (timeOot) {
                      getAttr = replaceKeyword(timeOot);
                    }
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Timeout>',
                      timeOot
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(timeOot);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
                  {
                    let testSetScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    if (
                      functionIds &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType'])
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      testSetScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testSetScope;
                    }
                    getAttr = replaceKeyword(testSetScope);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Test Set Scope Variable>',
                      testSetScope
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(testSetScope);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case '842981e7-e484-11ef-904e-02c8cad0208d':
                  {
                    let testCaseScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    if (
                      functionIds &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType'])
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      testCaseScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testCaseScope;
                    }
                    getAttr = replaceKeyword(testCaseScope);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Test Case Scope Variable>',
                      testCaseScope
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(testCaseScope);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let timeInterval = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    getAttr = replaceKeyword(timeInterval);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Time Interval>',
                      timeInterval
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(timeInterval);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let attempts = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    getAttr = replaceKeyword(attempts);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Attempts>',
                      attempts
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(attempts);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
                  {
                    let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header>', function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                      let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '75b16425-1531-4cee-8c09-30f5be70c4b0');
                      if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                        let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                          attributeValueQueryData,
                          uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          data['CHILD_ATTRIBUTE_DATA']
                        );
                        if (isUIElementValueEmpty) {
                          data['isItemRemove'] = true;
                        }
                      }
                    }
                    let cellValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let cellValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    if (cellValueData && Object.keys(cellValueData).length && cellValueData['SCOPE_VARIABLE_UUID']) {
                      let selectedAttributeDetails = await getAttributeValueDetails(cellValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                      if (
                        selectedAttributeDetails &&
                        Object.keys(selectedAttributeDetails).length &&
                        [
                          'Test_Case_Step_Normal',
                          'Test_Case_View_Navigation_Step',
                          'Test_Case_Function_Step',
                          'Test_Case_Function_View_Navigation_Step',
                          'Test_Case_Function_UI_Element_Group_Step',
                          'Test_Case_UI_Element_Group_Step'
                        ].includes(data['QueryDataType']) &&
                        selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                      ) {
                        let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${cellValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                        cellValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                      } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                        cellValue = selectedAttributeDetails['NAME'];
                      }
                      cellValue = decideScopePrefix(cellValueData) + cellValue;
                    }
                    getAttr = replaceKeyword(cellValue);
                    ui_elements = cellValue;
                    is_ui_element = true;
                    if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<Cell Value>',
                        cellValue
                          ? function () {
                              let Datawithbackslash = escapeSingleQuote(cellValue);
                              return `'` + Datawithbackslash + `'`;
                            }
                          : `' '`
                      );
                    }
                  }
                  break;
                case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let rowNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    getAttr = replaceKeyword(rowNumber);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Row Number>',
                      rowNumber
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(rowNumber);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
                  {
                    let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Table Name>', function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case '078e6534-f38f-4aad-b89d-cad8216ad86b':
                  {
                    let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header 1>', function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      });
                    }
                  }
                  break;
                case 'ba1ef281-412a-4544-b615-7767b06eb489':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                      let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, 'ba1ef281-412a-4544-b615-7767b06eb489');
                      if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                        let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                          attributeValueQueryData,
                          uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          data['CHILD_ATTRIBUTE_DATA']
                        );
                        if (isUIElementValueEmpty) {
                          data['isItemRemove'] = true;
                        }
                      }
                    }
                    let cellValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    getAttr = replaceKeyword(cellValue1);
                    is_ui_element = true;
                    ui_elements = ui_elements ? `[${ui_elements}][${cellValue1}]` : '';
                    if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<Cell Value 1>',
                        cellValue1
                          ? function () {
                              let Datawithbackslash = escapeSingleQuote(cellValue1);
                              return `'` + Datawithbackslash + `'`;
                            }
                          : `' '`
                      );
                    }
                  }
                  break;
                case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let columnNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    getAttr = replaceKeyword(columnNumber);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Column Number>',
                      columnNumber
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(columnNumber);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
                case '28058e26-fa09-42fb-868a-1988bd0a746c':
                  {
                    let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                    if (filteredResult && filteredResult.length) {
                      attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                      attributeValueQueryData.push(...filteredResult);
                    }
                    let fileFullPath = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    getAttr = replaceKeyword(fileFullPath);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<File Full Path>',
                      fileFullPath
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(fileFullPath);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                  break;
              }
              inc++;
              let valueColumnName = `v` + inc;
              data[valueColumnName] = getAttr;
            }
          }
          let getKeywordByStepType = inputStepType ? inputStepType + ' ' : '';
          data['Test Case Step Name'] = getKeywordByStepType + stepDefTemplateVerbiageName;
          data['TEST_CASE_STEP_UUID'] = data['ParentKey'];
          if (data['API_UUID']) {
            apiList.push(data['API_UUID']);
          }
          if (is_ui_element) {
            let testCaseDetails = testCaseQueryData.filter((item) => item['Test Case ID'] == data['Test Case ID']);
            let stepDetails = {};
            stepDetails['TEST_CASE_UUID'] = testCaseDetails[0]['Test Case UUID'];
            stepDetails['TEST_DATA_COLUMN_ID'] = 'F';
            stepDetails['TEST_CASE_STEP_UUID'] = data['ParentKey'];
            stepDetails['TEST_DATA_VALUE'] = ui_elements;
            stepDetails['IS_ITEM_REMOVE'] = data['isItemRemove'];
            stepDetails['FUNCTION_UUID'] = data['FunctionKey'];
            stepDetails['FUNCTION_STEP_UUID'] = data['FunctionStepKey'];
            stepDetails['UI_ELEMENT_GROUP_UUID'] = data['UIElementGroupKey'];
            stepDetails['UI_ELEMENT_GROUP_STEP_UUID'] = data['UIElementGroupStepKey'];
            stepDetails['VIEW_UUID'] = data['ViewKey'];
            stepDetails['QueryDataType'] = data['QueryDataType'];
            stepDetails['VIEW_NAVIGATION_STEP_UUID'] = data['ViewNavigationStepKey'];
            ui_element_list.push(stepDetails);
          }
        }
      }
    }
    testCaseStepNormalQueryData = reorderTestCaseStep(testCaseStepNormalQueryData);
    let testDataQueryDataPreList = testDataQueryData;
    testDataQueryDataPreList = ui_element_list.concat(testDataQueryData);
    testCaseStepNormalQueryData = processTestCaseSteps(testDataQueryDataPreList, testCaseStepNormalQueryData);
    let currentPageIds = '';
    if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
      currentPageIds = testCaseStepNormalQueryData
        .map((item) => item['Page ID'])
        .filter((id) => id !== undefined && id !== null && id !== '')
        .map((id) => `'` + id + `'`)
        .join(',');
    }
    let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID', IS_BASE_URL_OVERRIDDEN FROM PAGE WHERE PAGE_UUID in(${
      attributeIds ? attributeIds : `''`
    }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
    let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
    pageNewQueryData = await ConcatinateURL(pageNewQueryData);
    let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
    let uiElementQuery = `SELECT PAGE_ID as 'Page ID', UI_ELEMENT_ID as 'UI ELement ID',UI_ELEMENT_NAME as 'UI Element Name',(SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID=UI_ELEMENT.UI_ELEMENT_TYPE) as 'Element Type',LOCATOR_TYPE as 'Locator Type', LOCATOR_VALUE as 'Locator Value',CASE WHEN (IFNULL(IS_PAGE_LOAD_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER END AS 'Is Page Load Identifier','Active' as Status, 'No Action' as Actions, EVENT_NAME as 'Event Name',UI_ELEMENT_UUID as 'UI Element UUID' FROM UI_ELEMENT ,PAGE WHERE PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID and UI_ELEMENT.PAGE_NEW_UUID in(${
      pageList ? pageList : `''`
    }) AND UI_ELEMENT.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by UI_ELEMENT_ID asc`;
    let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementQuery, input);
    let currentApiIds = '';
    if (apiList && apiList.length) {
      currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
    }
    let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID',USE_PROXY_INDICATOR as 'Use Proxy Indicator' FROM API_NEW WHERE API_UUID in(${
      currentApiIds ? currentApiIds : `''`
    }) and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID order by API_ID asc`;
    let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
    let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
      currentApiIds ? currentApiIds : `''`
    }) order by API_ATTRIBUTE_ID asc`;
    let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiAttributeQuery, input);
    if (apiAttributeQueryData && apiAttributeQueryData.length) {
      apiAttributeQueryData.sort((a, b) => {
        let afield1 = a['API ID'];
        let bfield1 = b['API ID'];
        let afield2 = a['API Attribute ID'];
        let bfield2 = b['API Attribute ID'];
        return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
      });
    }
    msg.payload.result.message = 'JSON Downloaded';
    let userNameQuery = `SELECT concat(FIRST_NAME, ' ',LAST_NAME) as USER_NAME FROM USER_PROFILE WHERE AE_USER_PROFILE_UUID=:APP_LOGGED_IN_USER_ID;`;
    let userNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('INFO_AUTHORIZATION', userNameQuery, input);
    let functionalAreaQuery = `SELECT '${userNameQueryData['USER_NAME']}' as USER_NAME,:APP_LOGGED_IN_USER_ID as USER_UUID, FUNCTIONAL_AREA_UUID as APP_UUID,TENANT_UUID as TENANT_UUID, :TEST_SUITE_UUID as 'TEST_SUITE_UUID',:MASTER_CODE_VERSION_ID as 'VERSION_NUMBER' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID;`;
    let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionalAreaQuery, input);
    responseJson['application'] = functionalAreaQueryData;
    responseJson['apiconfig'] = transformApiDataMultiple(apiQueryData, apiAttributeQueryData);
    responseJson['pageConfig'] = preparePageConfig(pageNewQueryData, uiElementQueryData);
    let testSetData = prepareTestSetConfig(testSetQueryData, testCaseQueryData, testCaseStepNormalQueryData);
    responseJson['testsetConfig'] = testSetData['testSetConfigObject'];
    responseJson['testsetConfigFlattend'] = testSetData['testsetConfigFlattendObject'];
    msg.payload.result.data = responseJson;
    node.send(msg);
  }
} else if (input.TYPE == 'FUNCTION') {
  msg.payload.result = {};
  let apiList = [];
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster = versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let testSetQuery = `SELECT FUNCTION_ID as 'Test Set ID',FUNCTION_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,FUNCTION_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM featuremanagement_app.FUNCTION,FUNCTIONAL_AREA WHERE FUNCTION_UUID=:FUNCTION_UUID AND featuremanagement_app.FUNCTION.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
    testSetQueryData = testSetQueryData.map((testSet) => {
      return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
    });
  }
  let functionQuery = `SELECT FUNCTION_ID as 'Test Set ID',FUNCTION_ID as 'Test Case ID','' as 'Test Case Seq ID',FUNCTION_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,FUNCTION_UUID as 'Test Case UUID' FROM featuremanagement_app.FUNCTION,FUNCTIONAL_AREA WHERE FUNCTION_UUID=:FUNCTION_UUID AND featuremanagement_app.FUNCTION.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let functionQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
  let functionStepNormalQuery = `SELECT FUNCTION_ID AS 'Test Set ID', FUNCTION_ID AS 'Test Case ID', tcs.FUNCTION_STEP_SEQ_ID AS 'Test Case Step ID', tcs.FUNCTION_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.FUNCTION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, 'FUNCTION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'FUNCTION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'FUNCTION_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.FUNCTION_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.FUNCTION_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Function_Normal' as 'QueryDataType' FROM featuremanagement_app.FUNCTION tc JOIN FUNCTION_STEP tcs ON tc.FUNCTION_UUID = tcs.FUNCTION_UUID WHERE tcs.FUNCTION_UUID=:FUNCTION_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' OR tcs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY FUNCTION_STEP_ID, FUNCTION_STEP_SEQ_ID ASC`;
  let functionStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionStepNormalQuery, input);
  dataObject['isNormalFunctionExist'] = functionStepNormalQueryData && functionStepNormalQueryData.length ? 'Yes' : 'No';
  queryListMap.push(functionStepNormalQueryObject([...new Set(functionStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  let functionNavigationStepQuery = `SELECT tc.FUNCTION_ID AS 'Test Set ID', tc.FUNCTION_ID AS 'Test Case ID', CONCAT( tcs.FUNCTION_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.FUNCTION_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Function_View_Navigation_Step' as 'QueryDataType' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, FUNCTION_STEP tcs, featuremanagement_app.FUNCTION tc, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd WHERE tc.FUNCTION_UUID = tcs.FUNCTION_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tc.FUNCTION_UUID=:FUNCTION_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND EXISTS( SELECT 1 FROM VIEW_NAVIGATION_STEP vns where vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let functionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionNavigationStepQuery, input);
  dataObject['isFunctionViewNavigationExist'] = functionNavigationStepQueryData && functionNavigationStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(viewNavigationStepQueryObject([...new Set(functionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  functionStepNormalQueryData = functionStepNormalQueryData.concat(functionNavigationStepQueryData);
  let functionUIElementGroupStepNormalQuery = `SELECT FUNCTION_ID as 'Test Set ID', FUNCTION_ID as 'Test Case ID', concat( tcs.FUNCTION_STEP_SEQ_ID, '-', tcfs.UI_ELEMENT_GROUP_STEP_SEQ_ID ) as 'Test Case Step ID', tcs.FUNCTION_STEP_SEQ_ID as 'Test Case Step Seq ID', tcfs.STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP f WHERE f.UI_ELEMENT_GROUP_UUID = tcfs.UI_ELEMENT_GROUP_UUID ), ' UI_ELEMENT_GROUP' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, tcfs.UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfs.UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.FUNCTION_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', tcfs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Function_UI_Element_Group_Step' as 'QueryDataType' FROM FUNCTION_STEP tcs, UI_ELEMENT_GROUP_STEP tcfs, featuremanagement_app.FUNCTION tc WHERE tc.FUNCTION_UUID = tcs.FUNCTION_UUID and tcfs.UI_ELEMENT_GROUP_UUID = tcs.UI_ELEMENT_GROUP_UUID and tcs.FUNCTION_UUID=:FUNCTION_UUID and tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY FUNCTION_STEP_ID, UI_ELEMENT_GROUP_STEP_SEQ_ID asc`;
  let functionUIElementGroupStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionUIElementGroupStepNormalQuery, input);
  dataObject['isFunctionUIElementGroupExist'] = functionUIElementGroupStepNormalQueryData && functionUIElementGroupStepNormalQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    uIElementGroupStepQueryObject([...new Set(functionUIElementGroupStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  functionStepNormalQueryData = functionStepNormalQueryData.concat(functionUIElementGroupStepNormalQueryData);
  let attributeIds = '';
  if (functionStepNormalQueryData && functionStepNormalQueryData.length) {
    let attributeDataObject = await fetchChildAttributeFromAttributeTable(queryListMap);
    attributeIds = attributeDataObject.attrValues
      .filter(isValidUUID)
      .map((uuid) => `'${uuid}'`)
      .join(', ');
    let pageQueryDataList = await fetchPageDetails(attributeIds);
    let uiElementDataList = await fetchUIElementsDetails(attributeIds);
    let functionQueryDataList = await fetchFunctionDetails(attributeIds);
    let uiElementGroupQueryDataList = await fetchUIElementGroupDetails(attributeIds);
    let apiQueryDataList = await fetchApiDetails(attributeIds);
    let apiAttributeQueryDataList = await fetchApiAttributeDetails(attributeIds);
    let primaryColumnIds = primaryIdString(functionStepNormalQueryData);
    let parentStepAttributeValueData = await getStepData(dataObject, primaryColumnIds);
    let childStepAttributeValueData = await getStepChildData(dataObject, primaryColumnIds);
    for (let data of functionStepNormalQueryData) {
      let inc = 0;
      let stepDefAttributeQueryData = getStepAttributeData(stepDefAttributeQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
      let attributeValueQueryData = getChildAttributeData(attributeDataObject.attributeValueQueryDataEntries, data.PRIMARY_COLUMN_VALUE, data.PRIMARY_COLUMN_NAME);
      let filteredStepAttributeValueData = getDataByParentKeyAndType(parentStepAttributeValueData, data['ParentKey']);
      if (data && Object.keys(data).length) {
        let inputStepType = data['Test Case Step Type'];
        let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
        let stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';
        data['Step Definition Template'] = stepDefTemplateVerbiageName;
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
          let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
          let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
          for (let codeDesc of stepDefAttributeQueryData) {
            let getAttr = '';
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
              case '57b76ab3-8112-4343-af0f-49643c808bf7':
                {
                  let pageName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7f855066-ad39-4325-8108-30befb2447e6':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '74da67d2-41c9-4cf7-9eea-715243e5fcdc');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (uiElementValueData && Object.keys(uiElementValueData).length && uiElementValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(uiElementValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
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
                  getAttr = replaceKeyword(uiElementValue);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element Value>',
                    uiElementValue
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementValue);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let keyNameInKeyPad = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(keyNameInKeyPad);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Key Name in Keypad>', function () {
                    let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                    return `'` + Datawithbackslash + `'`;
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
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, selectedUIElement);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = replaceKeyword(uiElementQueryData['EVENT_NAME']);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Event Type>',
                      uiElementQueryData['EVENT_NAME']
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementQueryData['EVENT_NAME']);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let confirmUIElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(confirmUIElementValue);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Confirm UI Element Value>',
                    confirmUIElementValue
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(confirmUIElementValue);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                {
                  let functionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                  if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                    getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '3f50ff70-f3e4-11ee-9a12-6fc3e771212a');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(uiElementValue1);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element Value 1>',
                    uiElementValue1
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementValue1);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let userActionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                {
                  let uiElementGroupName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementGroupStepQueryData = getUIElementGroupDetails(uiElementGroupQueryDataList, uiElementGroupName);
                  if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                    getAttr = uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] + `:-:` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let pageNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(pageNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Page Number>',
                    pageNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(pageNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataKey = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataKey);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Key>',
                    dataKey
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataKey);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataValue);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Value>',
                    dataValue
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataValue);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Name>',
                    fileName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let downloadParserName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(downloadParserName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Document Parser Name>',
                    downloadParserName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(downloadParserName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiQueryData = getApiDetails(apiQueryDataList, apiName);
                  if (apiQueryData && Object.keys(apiQueryData).length) {
                    getAttr = apiQueryData['API_ID'] + `:-:` + apiQueryData['API_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiQueryData['API_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '46136260-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiAttributeName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                  if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                    getAttr = apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '7182ebf0-2e33-11ef-9033-4bb93e602d01');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let apiAttributeValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (apiAttributeValueData && Object.keys(apiAttributeValueData).length && apiAttributeValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(apiAttributeValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      ['Test_Case_Step_Normal', 'Test_Case_Function_Step'].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${apiAttributeValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      apiAttributeValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      apiAttributeValue = selectedAttributeDetails['NAME'];
                    }
                    apiAttributeValue = decideScopePrefix(apiAttributeValueData) + apiAttributeValue;
                  }
                  getAttr = replaceKeyword(apiAttributeValue);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<API Attribute Value>',
                    apiAttributeValue
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(apiAttributeValue);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '833eb770-2e33-11ef-9033-4bb93e602d01':
                {
                  let responseStatusCode = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(responseStatusCode);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Response Status Code>',
                    responseStatusCode
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(responseStatusCode);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd':
                {
                  let pageName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName1);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                {
                  let uiElementState = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(uiElementState);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element State>',
                    uiElementState
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementState);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeOot = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeOot);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Timeout>',
                    timeOot
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeOot);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
                {
                  let testSetScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testSetScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testSetScope;
                  }
                  getAttr = replaceKeyword(testSetScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Set Scope Variable>',
                    testSetScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testSetScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '842981e7-e484-11ef-904e-02c8cad0208d':
                {
                  let testCaseScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testCaseScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testCaseScope;
                  }
                  getAttr = replaceKeyword(testCaseScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Case Scope Variable>',
                    testCaseScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testCaseScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeInterval = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeInterval);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Time Interval>',
                    timeInterval
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeInterval);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let attempts = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(attempts);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Attempts>',
                    attempts
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(attempts);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '75b16425-1531-4cee-8c09-30f5be70c4b0');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let cellValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (cellValueData && Object.keys(cellValueData).length && cellValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(cellValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${cellValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      cellValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      cellValue = selectedAttributeDetails['NAME'];
                    }
                    cellValue = decideScopePrefix(cellValueData) + cellValue;
                  }
                  getAttr = replaceKeyword(cellValue);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Cell Value>',
                    cellValue
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(cellValue);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let rowNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(rowNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Row Number>',
                    rowNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(rowNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Table Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '078e6534-f38f-4aad-b89d-cad8216ad86b':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ba1ef281-412a-4544-b615-7767b06eb489':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, 'ba1ef281-412a-4544-b615-7767b06eb489');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(cellValue1);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Cell Value 1>',
                    cellValue1
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(cellValue1);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let columnNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(columnNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Column Number>',
                    columnNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(columnNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '28058e26-fa09-42fb-868a-1988bd0a746c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileFullPath = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileFullPath);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Full Path>',
                    fileFullPath
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileFullPath);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
            }
            inc++;
            let valueColumnName = `v` + inc;
            data[valueColumnName] = getAttr;
          }
        }
        let getKeywordByStepType = inputStepType ? inputStepType + ' ' : '';
        data['Test Case Step Name'] = getKeywordByStepType + stepDefTemplateVerbiageName;
        if (data['API_UUID']) {
          apiList.push(data['API_UUID']);
        }
      }
    }
  }
  functionStepNormalQueryData = removeDataFromList(functionStepNormalQueryData);
  functionStepNormalQueryData = reorderTestCaseStep(functionStepNormalQueryData);
  let currentPageIds = '';
  if (functionStepNormalQueryData && functionStepNormalQueryData.length) {
    currentPageIds = functionStepNormalQueryData
      .map((item) => item['Page ID'])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID', IS_BASE_URL_OVERRIDDEN FROM PAGE WHERE PAGE_UUID in(${
    attributeIds ? attributeIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
  pageNewQueryData = await ConcatinateURL(pageNewQueryData);
  let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
  let uiElementQuery = `SELECT PAGE.PAGE_ID AS 'Page ID', UI_ELEMENT.UI_ELEMENT_ID AS 'UI Element ID', UI_ELEMENT.UI_ELEMENT_NAME AS 'UI Element Name', (SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID = UI_ELEMENT.UI_ELEMENT_TYPE) AS 'Element Type', UI_ELEMENT.LOCATOR_TYPE AS 'Locator Type', UI_ELEMENT.LOCATOR_VALUE AS 'Locator Value', CASE WHEN (IFNULL(UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER END AS 'Is Page Load Identifier', 'Active' AS Status, 'No Action' AS Actions, UI_ELEMENT.EVENT_NAME AS 'Event Name', UI_ELEMENT.UI_ELEMENT_UUID AS 'UI Element UUID' FROM UI_ELEMENT JOIN PAGE ON PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID WHERE UI_ELEMENT.PAGE_NEW_UUID IN (${
    pageList ? pageList : `''`
  }) ORDER BY UI_ELEMENT.UI_ELEMENT_ID ASC`;
  let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementQuery, input);
  if (uiElementQueryData && uiElementQueryData.length) {
    uiElementQueryData.sort((a, b) => {
      let afield1 = a['Page ID'];
      let bfield1 = b['Page ID'];
      let afield2 = a['UI ELement ID'];
      let bfield2 = b['UI ELement ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  let currentApiIds = '';
  if (apiList && apiList.length) {
    currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
  }
  let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID',USE_PROXY_INDICATOR as 'Use Proxy Indicator' FROM API_NEW WHERE API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID order by API_ID asc`;
  let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
  let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) order by API_ATTRIBUTE_ID asc`;
  let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiAttributeQuery, input);
  if (apiAttributeQueryData && apiAttributeQueryData.length) {
    apiAttributeQueryData.sort((a, b) => {
      let afield1 = a['API ID'];
      let bfield1 = b['API ID'];
      let afield2 = a['API Attribute ID'];
      let bfield2 = b['API Attribute ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  msg.payload.result.message = 'JSON Downloaded';
  let userNameQuery = `SELECT concat(FIRST_NAME, ' ',LAST_NAME) as USER_NAME FROM USER_PROFILE WHERE AE_USER_PROFILE_UUID=:APP_LOGGED_IN_USER_ID;`;
  let userNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('INFO_AUTHORIZATION', userNameQuery, input);
  let functionalAreaQuery = `SELECT '${userNameQueryData['USER_NAME']}' as USER_NAME,:APP_LOGGED_IN_USER_ID as USER_UUID, FUNCTIONAL_AREA_UUID as APP_UUID,TENANT_UUID as TENANT_UUID, :TEST_SUITE_UUID as 'TEST_SUITE_UUID',:MASTER_CODE_VERSION_ID as 'VERSION_NUMBER' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID;`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionalAreaQuery, input);
  responseJson['application'] = functionalAreaQueryData;
  responseJson['apiconfig'] = transformApiDataMultiple(apiQueryData, apiAttributeQueryData);
  responseJson['pageConfig'] = preparePageConfig(pageNewQueryData, uiElementQueryData);
  let testSetData = prepareTestSetConfig(testSetQueryData, functionQueryData, functionStepNormalQueryData);
  responseJson['testsetConfig'] = testSetData['testSetConfigObject'];
  responseJson['testsetConfigFlattend'] = testSetData['testsetConfigFlattendObject'];
  msg.payload.result.data = responseJson;
  node.send(msg);
} else if (input.TYPE == 'MULTIPLE_TEST_SET') {
  msg.payload.result = {};
  let apiList = [];
  let testSetIds = input.TEST_SET_UUID;
  let testSetList = testSetIds.split(',');
  const stepDefAttributeQueryList = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
  let stepDefAttributeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefAttributeQueryList, input);
  const stepDefTemplateVerbiageQueryList = `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE`;
  let stepDefTemplateVerbiageQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, stepDefTemplateVerbiageQueryList, input);
  const uiElementTypeQuery = `SELECT * FROM UI_ELEMENT_TYPE_MASTER`;
  let uiElementTypeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, uiElementTypeQuery, input);
  let testSetID = [...new Set(testSetList.map((item) => item).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ');
  let testSetQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_SET_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,TEST_SET_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM TEST_SET,FUNCTIONAL_AREA WHERE TEST_SET_UUID in(${testSetID}) AND TEST_SET.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
    testSetQueryData = testSetQueryData.map((testSet) => {
      return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
    });
  }
  const testCaseCondition = getTcCondition('TEST_CASE');
  let testCaseQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', TEST_CASE_SEQ_ID as 'Test Case Seq ID', TEST_CASE_NAME as 'Test Case Name', 'Active' as Status, 'No Action' as Actions, TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE, TEST_SET WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID AND TEST_CASE.TEST_SET_UUID in(${testSetID}) AND TEST_CASE.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND ${testCaseCondition} ORDER BY TEST_CASE_SEQ_ID ASC;`;
  let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
  const tcCondition = getTcCondition('tc');
  let testCaseStepNormalQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_Step_Normal' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.TEST_SET_UUID in(${testSetID}) AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' OR tcs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) AND ${tcCondition} ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
  let testCaseStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepNormalQuery, input);
  dataObject['isNormalTestCaseExist'] = testCaseStepNormalQueryData && testCaseStepNormalQueryData.length ? 'Yes' : 'No';
  queryListMap.push(testCaseStepNormalQueryObject([...new Set(testCaseStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  let testCaseNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' AS PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID AS PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_View_Navigation_Step' as 'QueryDataType',vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW v, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.CURRENT_PAGE_CONTEXT = v.PAGE_UUID AND v.VIEW_UUID = vns.VIEW_UUID AND tcs.TEST_SET_UUID IN (${testSetID}) AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ${tcCondition} AND EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns_inner WHERE vns_inner.VIEW_UUID = tcs.VIEW_UUID AND vns_inner.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationStepQuery, input);
  dataObject['isTestCaseViewNavigationExist'] = testCaseNavigationStepQueryData && testCaseNavigationStepQueryData.length ? 'Yes' : 'No';
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseNavigationStepQueryData);
  queryListMap.push(viewNavigationStepQueryObject([...new Set(testCaseNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  let testCaseFunctionStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', FUNCTION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcfs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'FUNCTION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'FUNCTION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'FUNCTION_STEP_UUID' as PRIMARY_COLUMN_NAME, FUNCTION_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, TEST_CASE tc, TEST_SET ts, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND tcs.TEST_SET_UUID in(${testSetID}) AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ${tcCondition} AND ( ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' OR tcfs.IS_PURE_NAVIGATION_STEP IS NULL ) OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcfs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY TEST_CASE_STEP_ID, FUNCTION_STEP_ID ASC;`;
  let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
  dataObject['isTestCaseFunctionExist'] = testCaseFunctionStepQueryData && testCaseFunctionStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(functionStepNormalQueryObject([...new Set(testCaseFunctionStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionStepQueryData);
  let testCaseFunctionNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.FUNCTION_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ), ' Page - ', 'Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_View_Navigation_Step' as 'QueryDataType',vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcs.TEST_SET_UUID IN (${testSetID}) AND tcfs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcfs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ${tcCondition} AND EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns_inner WHERE vns_inner.VIEW_UUID = tcfs.VIEW_UUID AND vns_inner.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseFunctionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionNavigationStepQuery, input);
  dataObject['isTestCaseFunctionViewNavigationExist'] = testCaseFunctionNavigationStepQueryData && testCaseFunctionNavigationStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    viewNavigationStepQueryObject([...new Set(testCaseFunctionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionNavigationStepQueryData);
  let testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfuegs.UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcfs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', tcfuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND tcfs.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID AND tcs.TEST_SET_UUID IN (${testSetID}) AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ${tcCondition} ORDER BY TEST_CASE_STEP_ID ASC, UI_ELEMENT_GROUP_STEP_SEQ_ID ASC;`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input);
  dataObject['isTestCaseFunctionUIElementGroupExist'] = testCaseFunctionUIElementGroupStepQueryData && testCaseFunctionUIElementGroupStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    uIElementGroupStepQueryObject([...new Set(testCaseFunctionUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionUIElementGroupStepQueryData);
  let testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, CONCAT( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcuegs.UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', tcuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcuegs.UI_ELEMENT_GROUP_UUID = tcs.UI_ELEMENT_GROUP_UUID AND tcs.TEST_SET_UUID IN (${testSetID}) AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND ${tcCondition} ORDER BY TEST_CASE_STEP_ID, UI_ELEMENT_GROUP_STEP_SEQ_ID ASC;`;
  let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementGroupStepQuery, input);
  dataObject['isTestCaseUIElementGroupExist'] = testCaseUIElementGroupStepQueryData && testCaseUIElementGroupStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    uIElementGroupStepQueryObject([...new Set(testCaseUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseUIElementGroupStepQueryData);
  let attributeIds = '';
  let ui_element_list = [];
  let primaryKeyIds = concatePrimaryKeys(testCaseQueryData);
  let testDataQueryData = await fetchTestData(primaryKeyIds);
  msg.payload.filePresent = false;
  if (testDataQueryData && testDataQueryData.length) {
    msg.payload.filePresent = true;
  }
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    let attributeDataObject = await fetchChildAttributeFromAttributeTable(queryListMap);
    attributeIds = attributeDataObject.attrValues
      .filter(isValidUUID)
      .map((uuid) => `'${uuid}'`)
      .join(', ');
    let pageQueryDataList = await fetchPageDetails(attributeIds);
    let uiElementDataList = await fetchUIElementsDetails(attributeIds);
    let functionQueryDataList = await fetchFunctionDetails(attributeIds);
    let uiElementGroupQueryDataList = await fetchUIElementGroupDetails(attributeIds);
    let apiQueryDataList = await fetchApiDetails(attributeIds);
    let apiAttributeQueryDataList = await fetchApiAttributeDetails(attributeIds);
    let primaryColumnIds = primaryIdString(testCaseStepNormalQueryData);
    let parentStepAttributeValueData = await getStepData(dataObject, primaryColumnIds);
    let childStepAttributeValueData = await getStepChildData(dataObject, primaryColumnIds);
    for (let data of testCaseStepNormalQueryData) {
      let ui_elements = '';
      let is_ui_element = false;
      let inc = 0;
      if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Automated') {
        let inputStepType = data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data' ? 'Given' : data['Test Case Step Type'];
        data['Test Case Step Type'] = inputStepType;
        let stepDefAttributeQueryData = getStepAttributeData(stepDefAttributeQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
        let attributeValueQueryData = getChildAttributeData(attributeDataObject.attributeValueQueryDataEntries, data.PRIMARY_COLUMN_VALUE, data.PRIMARY_COLUMN_NAME);
        let filteredStepAttributeValueData = getDataByParentKeyAndType(parentStepAttributeValueData, data['ParentKey']);
        let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
        let stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';
        data['Step Definition Template'] = stepDefTemplateVerbiageName;
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
          let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
          let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
          for (let codeDesc of stepDefAttributeQueryData) {
            let getAttr = '';
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
              case '57b76ab3-8112-4343-af0f-49643c808bf7':
                {
                  let pageName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7f855066-ad39-4325-8108-30befb2447e6':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_ID'] + `:-:` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '74da67d2-41c9-4cf7-9eea-715243e5fcdc');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (uiElementValueData && Object.keys(uiElementValueData).length && uiElementValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(uiElementValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
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
                  ui_elements = uiElementValue;
                  is_ui_element = true;
                  getAttr = replaceKeyword(uiElementValue);
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Value>',
                      uiElementValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let keyNameInKeyPad = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(keyNameInKeyPad);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Key Name in Keypad>', function () {
                    let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                    return `'` + Datawithbackslash + `'`;
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
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, selectedUIElement);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = replaceKeyword(uiElementQueryData['EVENT_NAME']);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Event Type>',
                      uiElementQueryData['EVENT_NAME']
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementQueryData['EVENT_NAME']);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let confirmUIElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${confirmUIElementValue}]` : '';
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(confirmUIElementValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Confirm UI Element Value>',
                      confirmUIElementValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(confirmUIElementValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                {
                  let functionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                  if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                    getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '3f50ff70-f3e4-11ee-9a12-6fc3e771212a');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${uiElementValue1}]` : '';
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(uiElementValue1);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Value 1>',
                      uiElementValue1
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementValue1);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let userActionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_ID'] + `:-:` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                {
                  let uiElementGroupName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementGroupStepQueryData = getUIElementGroupDetails(uiElementGroupQueryDataList, uiElementGroupName);
                  if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                    getAttr = uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] + `:-:` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let pageNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(pageNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Page Number>',
                    pageNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(pageNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataKey = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataKey);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Key>',
                    dataKey
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataKey);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataValue);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Value>',
                    dataValue
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataValue);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Name>',
                    fileName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let downloadParserName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(downloadParserName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Document Parser Name>',
                    downloadParserName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(downloadParserName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiQueryData = getApiDetails(apiQueryDataList, apiName);
                  if (apiQueryData && Object.keys(apiQueryData).length) {
                    getAttr = apiQueryData['API_ID'] + `:-:` + apiQueryData['API_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiQueryData['API_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '46136260-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiAttributeName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                  if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                    getAttr = apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '7182ebf0-2e33-11ef-9033-4bb93e602d01');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let apiAttributeValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (apiAttributeValueData && Object.keys(apiAttributeValueData).length && apiAttributeValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(apiAttributeValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      ['Test_Case_Step_Normal', 'Test_Case_Function_Step'].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${apiAttributeValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      apiAttributeValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      apiAttributeValue = selectedAttributeDetails['NAME'];
                    }
                    apiAttributeValue = decideScopePrefix(apiAttributeValueData) + apiAttributeValue;
                  }
                  ui_elements = apiAttributeValue;
                  is_ui_element = true;
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(apiAttributeValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<API Attribute Value>',
                      apiAttributeValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(apiAttributeValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '833eb770-2e33-11ef-9033-4bb93e602d01':
                {
                  let responseStatusCode = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(responseStatusCode);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Response Status Code>',
                    responseStatusCode
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(responseStatusCode);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd':
                {
                  let pageName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName1);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                {
                  let uiElementState = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(uiElementState);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element State>',
                    uiElementState
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementState);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeOot = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeOot);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Timeout>',
                    timeOot
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeOot);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
                {
                  let testSetScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testSetScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testSetScope;
                  }
                  getAttr = replaceKeyword(testSetScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Set Scope Variable>',
                    testSetScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testSetScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '842981e7-e484-11ef-904e-02c8cad0208d':
                {
                  let testCaseScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testCaseScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testCaseScope;
                  }
                  getAttr = replaceKeyword(testCaseScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Case Scope Variable>',
                    testCaseScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testCaseScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeInterval = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeInterval);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Time Interval>',
                    timeInterval
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeInterval);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let attempts = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(attempts);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Attempts>',
                    attempts
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(attempts);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '75b16425-1531-4cee-8c09-30f5be70c4b0');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let cellValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (cellValueData && Object.keys(cellValueData).length && cellValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(cellValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${cellValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      cellValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      cellValue = selectedAttributeDetails['NAME'];
                    }
                    cellValue = decideScopePrefix(cellValueData) + cellValue;
                  }
                  ui_elements = cellValue;
                  is_ui_element = true;
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(cellValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Cell Value>',
                      cellValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(cellValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let rowNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(rowNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Row Number>',
                    rowNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(rowNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Table Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '078e6534-f38f-4aad-b89d-cad8216ad86b':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ba1ef281-412a-4544-b615-7767b06eb489':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, 'ba1ef281-412a-4544-b615-7767b06eb489');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${cellValue1}]` : '';
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(cellValue1);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Cell Value 1>',
                      cellValue1
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(cellValue1);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let columnNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(columnNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Column Number>',
                    columnNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(columnNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '28058e26-fa09-42fb-868a-1988bd0a746c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileFullPath = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileFullPath);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Full Path>',
                    fileFullPath
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileFullPath);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
            }
            inc++;
            let valueColumnName = `v` + inc;
            data[valueColumnName] = getAttr;
          }
        }
        let getKeywordByStepType = inputStepType ? inputStepType + ' ' : '';
        data['Test Case Step Name'] = getKeywordByStepType + stepDefTemplateVerbiageName;
        data['TEST_CASE_STEP_UUID'] = data['ParentKey'];
        if (data['API_UUID']) {
          apiList.push(data['API_UUID']);
        }
        if (is_ui_element) {
          let testCaseDetails = testCaseQueryData.filter((item) => item['Test Case ID'] == data['Test Case ID']);
          let stepDetails = {};
          stepDetails['TEST_CASE_UUID'] = testCaseDetails[0]['Test Case UUID'];
          stepDetails['TEST_DATA_COLUMN_ID'] = 'F';
          stepDetails['TEST_CASE_STEP_UUID'] = data['ParentKey'];
          stepDetails['TEST_DATA_VALUE'] = ui_elements;
          stepDetails['IS_ITEM_REMOVE'] = data['isItemRemove'];
          stepDetails['FUNCTION_UUID'] = data['FunctionKey'];
          stepDetails['FUNCTION_STEP_UUID'] = data['FunctionStepKey'];
          stepDetails['UI_ELEMENT_GROUP_UUID'] = data['UIElementGroupKey'];
          stepDetails['UI_ELEMENT_GROUP_STEP_UUID'] = data['UIElementGroupStepKey'];
          stepDetails['VIEW_UUID'] = data['ViewKey'];
          stepDetails['QueryDataType'] = data['QueryDataType'];
          stepDetails['VIEW_NAVIGATION_STEP_UUID'] = data['ViewNavigationStepKey'];
          ui_element_list.push(stepDetails);
        }
      }
    }
  }
  testCaseStepNormalQueryData = reorderTestCaseStep(testCaseStepNormalQueryData);
  let testDataQueryDataPreList = testDataQueryData;
  testDataQueryDataPreList = ui_element_list.concat(testDataQueryData);
  testCaseStepNormalQueryData = processTestCaseSteps(testDataQueryDataPreList, testCaseStepNormalQueryData);
  let currentPageIds = '';
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    currentPageIds = testCaseStepNormalQueryData
      .map((item) => item['Page ID'])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID', IS_BASE_URL_OVERRIDDEN FROM PAGE WHERE PAGE_UUID in(${
    attributeIds ? attributeIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
  pageNewQueryData = await ConcatinateURL(pageNewQueryData);
  let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
  let uiElementQuery = `SELECT PAGE_ID as 'Page ID', UI_ELEMENT_ID as 'UI ELement ID',UI_ELEMENT_NAME as 'UI Element Name',(SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID=UI_ELEMENT.UI_ELEMENT_TYPE) as 'Element Type',LOCATOR_TYPE as 'Locator Type', LOCATOR_VALUE as 'Locator Value',CASE WHEN (IFNULL(UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER END AS 'Is Page Load Identifier','Active' as Status, 'No Action' as Actions, EVENT_NAME as 'Event Name',UI_ELEMENT_UUID as 'UI Element UUID' FROM UI_ELEMENT ,PAGE WHERE PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID and UI_ELEMENT.PAGE_NEW_UUID in(${
    pageList ? pageList : `''`
  }) AND UI_ELEMENT.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by UI_ELEMENT_ID asc`;
  let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementQuery, input);
  let currentApiIds = '';
  if (apiList && apiList.length) {
    currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
  }
  let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID',USE_PROXY_INDICATOR as 'Use Proxy Indicator' FROM API_NEW WHERE API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID order by API_ID asc`;
  let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
  let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) order by API_ATTRIBUTE_ID asc`;
  let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiAttributeQuery, input);
  if (apiAttributeQueryData && apiAttributeQueryData.length) {
    apiAttributeQueryData.sort((a, b) => {
      let afield1 = a['API ID'];
      let bfield1 = b['API ID'];
      let afield2 = a['API Attribute ID'];
      let bfield2 = b['API Attribute ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  msg.payload.result.message = 'JSON Downloaded';
  let userNameQuery = `SELECT concat(FIRST_NAME, ' ',LAST_NAME) as USER_NAME FROM USER_PROFILE WHERE AE_USER_PROFILE_UUID=:APP_LOGGED_IN_USER_ID;`;
  let userNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('INFO_AUTHORIZATION', userNameQuery, input);
  let functionalAreaQuery = `SELECT '${userNameQueryData['USER_NAME']}' as USER_NAME,:APP_LOGGED_IN_USER_ID as USER_UUID, FUNCTIONAL_AREA_UUID as APP_UUID,TENANT_UUID as TENANT_UUID, :TEST_SUITE_UUID as 'TEST_SUITE_UUID',:MASTER_CODE_VERSION_ID as 'VERSION_NUMBER' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID;`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionalAreaQuery, input);
  responseJson['application'] = functionalAreaQueryData;
  responseJson['apiconfig'] = transformApiDataMultiple(apiQueryData, apiAttributeQueryData);
  responseJson['pageConfig'] = preparePageConfig(pageNewQueryData, uiElementQueryData);
  let testSetData = prepareTestSetConfig(testSetQueryData, testCaseQueryData, testCaseStepNormalQueryData);
  responseJson['testsetConfig'] = testSetData['testSetConfigObject'];
  responseJson['testsetConfigFlattend'] = testSetData['testsetConfigFlattendObject'];
  msg.payload.result.data = responseJson;
  node.send(msg);
} else if (input.TYPE == 'NAVIGATION_STEPS') {
  msg.payload.result = {};
  let apiList = [];
  let paegeQuery = `SELECT PAGE_UUID FROM PAGE_VIEW WHERE VIEW_UUID=:VIEW_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let paegeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', paegeQuery, input);
  let pageID = paegeQueryData && paegeQueryData.length ? paegeQueryData[0]['PAGE_UUID'] : '';
  input['PAGE_UUID'] = pageID;
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster = versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let testSetQuery = `SELECT PAGE_ID as 'Test Set ID',PAGE_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,PAGE_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM PAGE,FUNCTIONAL_AREA WHERE PAGE_UUID=:PAGE_UUID AND PAGE.FUNCTIONAL_AREA_UUID=FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIfMARYSPRINGFM', testSetQuery, input);
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
    testSetQueryData = testSetQueryData.map((testSet) => {
      return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
    });
  }
  let functionQuery = `SELECT PAGE_ID as 'Test Set ID', VIEW_ID as 'Test Case ID','1' as 'Test Case Seq ID', VIEW_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions, PAGE_VIEW.VIEW_UUID as 'Test Case UUID' FROM PAGE,FUNCTIONAL_AREA,PAGE_VIEW WHERE PAGE.PAGE_UUID=:PAGE_UUID AND PAGE.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID AND PAGE_VIEW.PAGE_UUID = PAGE.PAGE_UUID AND PAGE_VIEW.VIEW_UUID=:VIEW_UUID`;
  let functionQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
  let functionStepNormalQuery = `SELECT PAGE_ID as 'Test Set ID', VIEW_ID as 'Test Case ID', VIEW_NAVIGATION_STEP_ID as 'Test Case Step ID', VIEW_NAVIGATION_STEP_SEQ_ID as 'Test Case Step Seq ID', VIEW_NAVIGATION_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, '' as 'Test Case Sep Group Name', '' as reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' as Status, VIEW_NAVIGATION_STEP_UUID as 'Test Case Step UUID', 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW vn, PAGE p WHERE vn.VIEW_UUID = vns.VIEW_UUID AND vn.PAGE_UUID = p.PAGE_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND vn.PAGE_UUID=:PAGE_UUID AND vn.VIEW_UUID=:VIEW_UUID ORDER BY VIEW_NAVIGATION_STEP_ID, VIEW_NAVIGATION_STEP_SEQ_ID asc`;
  let functionStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionStepNormalQuery, input);
  queryListMap.push(viewNavigationStepQueryObject([...new Set(functionStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  let attributeIds = '';
  if (functionStepNormalQueryData && functionStepNormalQueryData.length) {
    let attributeDataObject = await fetchChildAttributeFromAttributeTable(queryListMap);
    attributeIds = attributeDataObject.attrValues
      .filter(isValidUUID)
      .map((uuid) => `'${uuid}'`)
      .join(', ');
    let pageQueryDataList = await fetchPageDetails(attributeIds);
    let uiElementDataList = await fetchUIElementsDetails(attributeIds);
    let functionQueryDataList = await fetchFunctionDetails(attributeIds);
    let uiElementGroupQueryDataList = await fetchUIElementGroupDetails(attributeIds);
    let apiQueryDataList = await fetchApiDetails(attributeIds);
    let apiAttributeQueryDataList = await fetchApiAttributeDetails(attributeIds);
    for (let data of functionStepNormalQueryData) {
      let inc = 0;
      let inputStepType = data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data' ? 'Given' : data['Test Case Step Type'];
      data['Test Case Step Type'] = inputStepType;
      let stepDefAttributeQueryData = getStepAttributeData(stepDefAttributeQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
      let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
      let stepDefTemplateVerbiageName =
        stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';
      data['Step Definition Template'] = stepDefTemplateVerbiageName;
      if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
        let attributeValueQueryData = getChildAttributeData(attributeDataObject.attributeValueQueryDataEntries, data.PRIMARY_COLUMN_VALUE, data.PRIMARY_COLUMN_NAME);
        let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
        let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
        for (let codeDesc of stepDefAttributeQueryData) {
          let getAttr = '';
          switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
            case '57b76ab3-8112-4343-af0f-49643c808bf7':
              {
                let pageName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let pageNewQueryData = getPageDetails(pageQueryDataList, pageName);
                if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                  getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                    let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
              {
                let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                  getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name>', function () {
                    let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case '7f855066-ad39-4325-8108-30befb2447e6':
              {
                let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                  getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
                    let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
              {
                let uiElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(uiElementValue);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<UI Element Value>',
                  uiElementValue
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementValue);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
              {
                let keyNameInKeyPad = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(keyNameInKeyPad);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Key Name in Keypad>', function () {
                  let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                  return `'` + Datawithbackslash + `'`;
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
                let uiElementQueryData = getUIElementDetails(uiElementDataList, selectedUIElement);
                if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                  getAttr = replaceKeyword(uiElementQueryData['EVENT_NAME']);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Event Type>',
                    uiElementQueryData['EVENT_NAME']
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementQueryData['EVENT_NAME']);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
              }
              break;
            case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
              let confirmUIElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
              getAttr = replaceKeyword(confirmUIElementValue);
              stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                '<Confirm UI Element Value>',
                confirmUIElementValue
                  ? function () {
                      let Datawithbackslash = escapeSingleQuote(confirmUIElementValue);
                      return `'` + Datawithbackslash + `'`;
                    }
                  : `' '`
              );
              break;
            case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
              {
                let functionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                  getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                    let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
              {
                let uiElementName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                  getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name 1>', function () {
                    let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
              {
                let uiElementValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(uiElementValue1);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<UI Element Value 1>',
                  uiElementValue1
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementValue1);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
              {
                let userActionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                  getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
                    let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
              {
                let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                  getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
                    let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
              {
                let uiElementGroupName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementGroupStepQueryData = getUIElementGroupDetails(uiElementGroupQueryDataList, uiElementGroupName);
                if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                  getAttr = uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] + `:-:` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                    let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
              {
                let pageNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(pageNumber);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Page Number>',
                  pageNumber
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(pageNumber);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
              {
                let dataKey = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(dataKey);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Data Key>',
                  dataKey
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(dataKey);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
              {
                let dataValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(dataValue);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Data Value>',
                  dataValue
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(dataValue);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'ceb66327-216f-42fd-845b-9f4543c62baa':
              {
                let fileName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(fileName);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<File Name>',
                  fileName
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(fileName);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
              {
                let downloadParserName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(downloadParserName);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Document Parser Name>',
                  downloadParserName
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(downloadParserName);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
              {
                let apiName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let apiQueryData = getApiDetails(apiQueryDataList, apiName);
                if (apiQueryData && Object.keys(apiQueryData).length) {
                  getAttr = apiQueryData['API_ID'] + `:-:` + apiQueryData['API_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                    let Datawithbackslash = escapeSingleQuote(apiQueryData['API_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case '46136260-2e33-11ef-b3ef-e52f192c3af0':
              {
                let apiAttributeName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                  getAttr = apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
                    let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
              {
                let apiAttributeValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(apiAttributeValue);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<API Attribute Value>',
                  apiAttributeValue
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(apiAttributeValue);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '833eb770-2e33-11ef-9033-4bb93e602d01':
              {
                let responseStatusCode = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(responseStatusCode);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Response Status Code>',
                  responseStatusCode
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(responseStatusCode);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd':
              {
                let pageName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let pageNewQueryData = getPageDetails(pageQueryDataList, pageName1);
                if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                  getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                    let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
              {
                let uiElementState = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(uiElementState);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<UI Element State>',
                  uiElementState
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementState);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
              {
                let timeOot = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(timeOot);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Timeout>',
                  timeOot
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(timeOot);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
              {
                let testSetScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                if (
                  functionIds &&
                  !['FUNCTION_STEP_ATTRIBUTE_DATA', 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA', 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA', 'FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'].includes(
                    data['CHILD_ATTRIBUTE_DATA']
                  )
                ) {
                  let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
                  let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                  testSetScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testSetScope;
                }
                getAttr = replaceKeyword(testSetScope);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Test Set Scope Variable>',
                  testSetScope
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(testSetScope);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case '842981e7-e484-11ef-904e-02c8cad0208d':
              {
                let testCaseScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                if (
                  functionIds &&
                  !['FUNCTION_STEP_ATTRIBUTE_DATA', 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA', 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA', 'FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'].includes(
                    data['CHILD_ATTRIBUTE_DATA']
                  )
                ) {
                  let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
                  let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                  testCaseScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testCaseScope;
                }
                getAttr = replaceKeyword(testCaseScope);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Test Case Scope Variable>',
                  testCaseScope
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(testCaseScope);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
              let timeInterval = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
              getAttr = replaceKeyword(timeInterval);
              stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                '<Time Interval>',
                timeInterval
                  ? function () {
                      let Datawithbackslash = escapeSingleQuote(timeInterval);
                      return `'` + Datawithbackslash + `'`;
                    }
                  : `' '`
              );
              break;
            case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
              let attempts = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
              getAttr = replaceKeyword(attempts);
              stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                '<Attempts>',
                attempts
                  ? function () {
                      let Datawithbackslash = escapeSingleQuote(attempts);
                      return `'` + Datawithbackslash + `'`;
                    }
                  : `' '`
              );
              break;
            case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
              {
                let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                  getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header>', function () {
                    let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case '75b16425-1531-4cee-8c09-30f5be70c4b0':
              let cellValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
              getAttr = replaceKeyword(cellValue);
              stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                '<Cell Value>',
                cellValue
                  ? function () {
                      let Datawithbackslash = escapeSingleQuote(cellValue);
                      return `'` + Datawithbackslash + `'`;
                    }
                  : `' '`
              );
              break;
            case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
              let rowNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
              getAttr = replaceKeyword(rowNumber);
              stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                '<Row Number>',
                rowNumber
                  ? function () {
                      let Datawithbackslash = escapeSingleQuote(rowNumber);
                      return `'` + Datawithbackslash + `'`;
                    }
                  : `' '`
              );
              break;
            case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
              {
                let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                  getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Table Name>', function () {
                    let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case '078e6534-f38f-4aad-b89d-cad8216ad86b':
              {
                let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                  getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header 1>', function () {
                    let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                    return `'` + Datawithbackslash + `'`;
                  });
                }
              }
              break;
            case 'ba1ef281-412a-4544-b615-7767b06eb489':
              let cellValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
              getAttr = replaceKeyword(cellValue1);
              stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                '<Cell Value 1>',
                cellValue1
                  ? function () {
                      let Datawithbackslash = escapeSingleQuote(cellValue1);
                      return `'` + Datawithbackslash + `'`;
                    }
                  : `' '`
              );
              break;
            case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
              let columnNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
              getAttr = replaceKeyword(columnNumber);
              stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                '<Column Number>',
                columnNumber
                  ? function () {
                      let Datawithbackslash = escapeSingleQuote(columnNumber);
                      return `'` + Datawithbackslash + `'`;
                    }
                  : `' '`
              );
              break;
            case '28058e26-fa09-42fb-868a-1988bd0a746c':
              {
                let fileFullPath = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                getAttr = replaceKeyword(fileFullPath);
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<File Full Path>',
                  fileFullPath
                    ? function () {
                        let Datawithbackslash = escapeSingleQuote(fileFullPath);
                        return `'` + Datawithbackslash + `'`;
                      }
                    : `' '`
                );
              }
              break;
          }
          inc++;
          let valueColumnName = `v` + inc;
          data[valueColumnName] = getAttr;
        }
      }
      let getKeywordByStepType = inputStepType ? inputStepType + ' ' : '';
      data['Test Case Step Name'] = getKeywordByStepType + stepDefTemplateVerbiageName;
      if (data['API_UUID']) {
        apiList.push(data['API_UUID']);
      }
    }
  }
  functionStepNormalQueryData = reorderTestCaseStep(functionStepNormalQueryData);
  let currentPageIds = '';
  if (functionStepNormalQueryData && functionStepNormalQueryData.length) {
    currentPageIds = functionStepNormalQueryData
      .map((item) => item['Page ID'])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID', IS_BASE_URL_OVERRIDDEN FROM PAGE WHERE PAGE_ID in(${
    currentPageIds ? currentPageIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
  pageNewQueryData = await ConcatinateURL(pageNewQueryData);
  let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
  let uiElementQuery = `SELECT PAGE.PAGE_ID AS 'Page ID', UI_ELEMENT.UI_ELEMENT_ID AS 'UI Element ID', UI_ELEMENT.UI_ELEMENT_NAME AS 'UI Element Name', (SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID = UI_ELEMENT.UI_ELEMENT_TYPE) AS 'Element Type', UI_ELEMENT.LOCATOR_TYPE AS 'Locator Type', UI_ELEMENT.LOCATOR_VALUE AS 'Locator Value', CASE WHEN (IFNULL(UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER END AS 'Is Page Load Identifier', 'Active' AS Status, 'No Action' AS Actions, UI_ELEMENT.EVENT_NAME AS 'Event Name', UI_ELEMENT.UI_ELEMENT_UUID AS 'UI Element UUID' FROM UI_ELEMENT JOIN PAGE ON PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID WHERE UI_ELEMENT.PAGE_NEW_UUID IN (${
    pageList ? pageList : `''`
  }) ORDER BY UI_ELEMENT.UI_ELEMENT_ID ASC`;
  let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementQuery, input);
  if (uiElementQueryData && uiElementQueryData.length) {
    uiElementQueryData.sort((a, b) => {
      let afield1 = a['Page ID'];
      let bfield1 = b['Page ID'];
      let afield2 = a['UI ELement ID'];
      let bfield2 = b['UI ELement ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  let currentApiIds = '';
  if (apiList && apiList.length) {
    currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
  }
  let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID',USE_PROXY_INDICATOR as 'Use Proxy Indicator' FROM API_NEW WHERE API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID order by API_ID asc`;
  let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
  let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) order by API_ATTRIBUTE_ID asc`;
  let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiAttributeQuery, input);
  if (apiAttributeQueryData && apiAttributeQueryData.length) {
    apiAttributeQueryData.sort((a, b) => {
      let afield1 = a['API ID'];
      let bfield1 = b['API ID'];
      let afield2 = a['API Attribute ID'];
      let bfield2 = b['API Attribute ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  msg.payload.result.message = 'JSON Downloaded';
  let userNameQuery = `SELECT concat(FIRST_NAME, ' ',LAST_NAME) as USER_NAME FROM USER_PROFILE WHERE AE_USER_PROFILE_UUID=:APP_LOGGED_IN_USER_ID;`;
  let userNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('INFO_AUTHORIZATION', userNameQuery, input);
  let functionalAreaQuery = `SELECT '${userNameQueryData['USER_NAME']}' as USER_NAME,:APP_LOGGED_IN_USER_ID as USER_UUID, FUNCTIONAL_AREA_UUID as APP_UUID,TENANT_UUID as TENANT_UUID, :TEST_SUITE_UUID as 'TEST_SUITE_UUID',:MASTER_CODE_VERSION_ID as 'VERSION_NUMBER' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID;`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionalAreaQuery, input);
  responseJson['application'] = functionalAreaQueryData;
  responseJson['apiconfig'] = transformApiDataMultiple(apiQueryData, apiAttributeQueryData);
  responseJson['pageConfig'] = preparePageConfig(pageNewQueryData, uiElementQueryData);
  let testSetData = prepareTestSetConfig(testSetQueryData, functionQueryData, functionStepNormalQueryData);
  responseJson['testsetConfig'] = testSetData['testSetConfigObject'];
  responseJson['testsetConfigFlattend'] = testSetData['testsetConfigFlattendObject'];
  msg.payload.result.data = responseJson;
  node.send(msg);
} else if (input.TYPE == 'FEATURE_TEST_SET' || input.TYPE == 'USER_STORY_TEST_SET') {
  msg.payload.result = {};
  let apiList = [];
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster = versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let testSetQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_SET_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,TEST_SET_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID',FEATURE_UUID, USER_STORY_UUID FROM TEST_SET,FUNCTIONAL_AREA WHERE TEST_SET_UUID=:TEST_SET_UUID AND TEST_SET.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
    testSetQueryData = testSetQueryData.map((testSet) => {
      return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
    });
  }
  let testSetID = testSetQueryData[0]['Test Set ID'];
  let testCaseQuery;
  const testCaseCondition = getTcCondition('TEST_CASE');
  const tcCondition = getTcCondition('tc');
  if (input.TYPE == 'FEATURE_TEST_SET') {
    let featureId = testSetQueryData && testSetQueryData.length ? `'${testSetQueryData[0]['FEATURE_UUID']}'` : null;
    testCaseQuery = `SELECT DISTINCT ${testSetID} as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_SEQ_ID as 'Test Case Seq ID',TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,TEST_CASE.TEST_CASE_UUID as 'Test Case UUID',TEST_CASE.TEST_CASE_UUID,TEST_CASE.TEST_SET_UUID FROM TEST_CASE,TEST_SET,TEST_CASE_REQUIREMENT tcr WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID and TEST_CASE.TEST_CASE_UUID=tcr.TEST_CASE_UUID and TEST_CASE.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE and tcr.REQUIREMENT_TITLE_UUID in (${
      featureId ? featureId : `''`
    }) AND ${testCaseCondition} order by TEST_CASE_SEQ_ID asc`;
  } else if (input.TYPE == 'USER_STORY_TEST_SET') {
    let userStoryId = testSetQueryData && testSetQueryData.length ? testSetQueryData[0]['USER_STORY_UUID'] : null;
    testCaseQuery = `SELECT ${testSetID} as 'Test Set ID', tc.TEST_CASE_ID as 'Test Case ID', tc.TEST_CASE_SEQ_ID as 'Test Case Seq ID', tc.TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions, tc.TEST_CASE_UUID as 'Test Case UUID', tc.TEST_CASE_UUID FROM TEST_SET ts, TEST_CASE tc WHERE tc.TEST_SET_UUID = ts.TEST_SET_UUID and tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tc.USER_STORY_UUID LIKE '%${userStoryId}%' AND ${tcCondition} order by tc.TEST_CASE_SEQ_ID asc`;
  }
  let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
  let testCaseID = [...new Set(testCaseQueryData.map((item) => item.TEST_CASE_UUID).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ');
  let testCaseStepNormalQuery = `SELECT ${testSetID} AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_Step_Normal' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, TEST_CASE tc WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.TEST_CASE_UUID in (${
    testCaseID ? testCaseID : `''`
  }) AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' OR tcs.IS_PURE_NAVIGATION_STEP IS NULL ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
  let testCaseStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepNormalQuery, input);
  dataObject['isNormalTestCaseExist'] = testCaseStepNormalQueryData && testCaseStepNormalQueryData.length ? 'Yes' : 'No';
  queryListMap.push(testCaseStepNormalQueryObject([...new Set(testCaseStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  let testCaseNavigationStepQuery = `SELECT ${testSetID} AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' AS PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID AS PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_View_Navigation_Step' as 'QueryDataType',vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_STEP tcs, TEST_CASE tc WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcs.TEST_CASE_UUID in (${
    testCaseID ? testCaseID : `''`
  }) AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationStepQuery, input);
  dataObject['isTestCaseViewNavigationExist'] = testCaseNavigationStepQueryData && testCaseNavigationStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(viewNavigationStepQueryObject([...new Set(testCaseNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseNavigationStepQueryData);
  let testCaseFunctionStepQuery = `SELECT ${testSetID} AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', FUNCTION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcfs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'FUNCTION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'FUNCTION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'FUNCTION_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcfs.FUNCTION_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, TEST_CASE tc, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND tcs.TEST_CASE_UUID in (${
    testCaseID ? testCaseID : `''`
  }) AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' OR tcfs.IS_PURE_NAVIGATION_STEP IS NULL OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcfs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ) ) ORDER BY TEST_CASE_STEP_ID, FUNCTION_STEP_ID ASC;`;
  let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
  dataObject['isTestCaseFunctionExist'] = testCaseFunctionStepQueryData && testCaseFunctionStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(functionStepNormalQueryObject([...new Set(testCaseFunctionStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionStepQueryData);
  let testCaseFunctionNavigationStepQuery = `SELECT ${testSetID} AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.FUNCTION_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ), ' Page - ', 'Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' AS PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID AS PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE, tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', '' as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_View_Navigation_Step' as 'QueryDataType', vns.VIEW_NAVIGATION_STEP_UUID as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcs.TEST_CASE_UUID in (${
    testCaseID ? testCaseID : `''`
  }) AND tcfs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.VIEW_UUID = tcfs.VIEW_UUID AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND EXISTS ( SELECT 1 FROM VIEW_NAVIGATION_STEP vns WHERE vns.VIEW_UUID = tcfs.VIEW_UUID AND vns.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseFunctionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionNavigationStepQuery, input);
  dataObject['isTestCaseFunctionViewNavigationExist'] = testCaseFunctionNavigationStepQueryData && testCaseFunctionNavigationStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    viewNavigationStepQueryObject([...new Set(testCaseFunctionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionNavigationStepQueryData);
  let testCaseFunctionUIElementGroupStepQuery = `SELECT ${testSetID} AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', FUNCTION_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) AS 'Test Case Step Group Name', '' AS reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfuegs.CURRENT_PAGE_CONTEXT ) AS 'Page ID', 'Active' AS Status, UI_ELEMENT_GROUP_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcfs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcfuegs.UI_ELEMENT_GROUP_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', tcfs.FUNCTION_STEP_UUID as 'FunctionStepKey', tcfs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', tcfuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey', tcfs.VIEW_UUID as 'ViewKey', 'Test_Case_Function_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, FUNCTION_STEP tcfs, UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.FUNCTION_UUID = tcs.FUNCTION_UUID AND tcfs.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID AND tcs.TEST_CASE_UUID in (${
    testCaseID ? testCaseID : `''`
  }) AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tcs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY TEST_CASE_STEP_ID ASC, UI_ELEMENT_GROUP_STEP_SEQ_ID ASC;`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input);
  dataObject['isTestCaseFunctionUIElementGroupExist'] = testCaseFunctionUIElementGroupStepQueryData && testCaseFunctionUIElementGroupStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    uIElementGroupStepQueryObject([...new Set(testCaseFunctionUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionUIElementGroupStepQueryData);
  let testCaseUIElementGroupStepQuery = `SELECT ${testSetID} AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', UI_ELEMENT_GROUP_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) AS 'Test Case Step Group Name', '' AS reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcuegs.CURRENT_PAGE_CONTEXT ) AS 'Page ID', 'Active' AS Status, UI_ELEMENT_GROUP_STEP_UUID AS 'Test Case Step UUID', '' AS actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'UI_ELEMENT_GROUP_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcuegs.UI_ELEMENT_GROUP_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE , tcs.TEST_CASE_STEP_UUID as 'ParentKey', tcs.FUNCTION_UUID as 'FunctionKey', '' as 'FunctionStepKey', tcs.UI_ELEMENT_GROUP_UUID as 'UIElementGroupKey', tcuegs.UI_ELEMENT_GROUP_STEP_UUID as 'UIElementGroupStepKey', tcs.VIEW_UUID as 'ViewKey', 'Test_Case_UI_Element_Group_Step' as 'QueryDataType','' as 'ViewNavigationStepKey',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcuegs.UI_ELEMENT_GROUP_UUID = tcs.UI_ELEMENT_GROUP_UUID AND tcs.TEST_CASE_UUID in (${
    testCaseID ? testCaseID : `''`
  }) AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID, UI_ELEMENT_GROUP_STEP_SEQ_ID ASC;`;
  let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementGroupStepQuery, input);
  dataObject['isTestCaseUIElementGroupExist'] = testCaseUIElementGroupStepQueryData && testCaseUIElementGroupStepQueryData.length ? 'Yes' : 'No';
  queryListMap.push(
    uIElementGroupStepQueryObject([...new Set(testCaseUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseUIElementGroupStepQueryData);
  let attributeIds = '';
  let ui_element_list = [];
  let primaryKeyIds = concatePrimaryKeys(testCaseQueryData);
  let testDataQueryData = await fetchTestData(primaryKeyIds);
  msg.payload.filePresent = false;
  if (testDataQueryData && testDataQueryData.length) {
    msg.payload.filePresent = true;
  }
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    let attributeDataObject = await fetchChildAttributeFromAttributeTable(queryListMap);
    attributeIds = attributeDataObject.attrValues
      .filter(isValidUUID)
      .map((uuid) => `'${uuid}'`)
      .join(', ');
    let pageQueryDataList = await fetchPageDetails(attributeIds);
    let uiElementDataList = await fetchUIElementsDetails(attributeIds);
    let functionQueryDataList = await fetchFunctionDetails(attributeIds);
    let uiElementGroupQueryDataList = await fetchUIElementGroupDetails(attributeIds);
    let apiQueryDataList = await fetchApiDetails(attributeIds);
    let apiAttributeQueryDataList = await fetchApiAttributeDetails(attributeIds);
    let primaryColumnIds = primaryIdString(testCaseStepNormalQueryData);
    let parentStepAttributeValueData = await getStepData(dataObject, primaryColumnIds);
    let childStepAttributeValueData = await getStepChildData(dataObject, primaryColumnIds);
    for (let data of testCaseStepNormalQueryData) {
      data['isItemRemove'] = false;
      let ui_elements = '';
      let is_ui_element = false;
      let inc = 0;
      let stepDefAttributeQueryData = getStepAttributeData(stepDefAttributeQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
      let attributeValueQueryData = getChildAttributeData(attributeDataObject.attributeValueQueryDataEntries, data.PRIMARY_COLUMN_VALUE, data.PRIMARY_COLUMN_NAME);
      let filteredStepAttributeValueData = getDataByParentKeyAndType(parentStepAttributeValueData, data['ParentKey']);
      if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Automated') {
        let inputStepType = data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data' ? 'Given' : data['Test Case Step Type'];
        data['Test Case Step Type'] = inputStepType;
        let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
        let stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';
        data['Step Definition Template'] = stepDefTemplateVerbiageName;
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
          let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
          let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
          for (let codeDesc of stepDefAttributeQueryData) {
            let getAttr = '';
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
              case '57b76ab3-8112-4343-af0f-49643c808bf7':
                {
                  let pageName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7f855066-ad39-4325-8108-30befb2447e6':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '74da67d2-41c9-4cf7-9eea-715243e5fcdc');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (uiElementValueData && Object.keys(uiElementValueData).length && uiElementValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(uiElementValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
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
                  ui_elements = uiElementValue;
                  is_ui_element = true;
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(uiElementValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Value>',
                      uiElementValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let keyNameInKeyPad = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(keyNameInKeyPad);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Key Name in Keypad>', function () {
                    let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                    return `'` + Datawithbackslash + `'`;
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
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, selectedUIElement);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = replaceKeyword(uiElementQueryData['EVENT_NAME']);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Event Type>',
                      uiElementQueryData['EVENT_NAME']
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementQueryData['EVENT_NAME']);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let confirmUIElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${confirmUIElementValue}]` : '';
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(confirmUIElementValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Confirm UI Element Value>',
                      confirmUIElementValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(confirmUIElementValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
                {
                  let functionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                  if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                    getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '3f50ff70-f3e4-11ee-9a12-6fc3e771212a');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let uiElementValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${uiElementValue1}]` : '';
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(uiElementValue1);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Value 1>',
                      uiElementValue1
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(uiElementValue1);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let userActionName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                {
                  let uiElementGroupName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementGroupStepQueryData = getUIElementGroupDetails(uiElementGroupQueryDataList, uiElementGroupName);
                  if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                    getAttr = uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] + `:-:` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let pageNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(pageNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Page Number>',
                    pageNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(pageNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataKey = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataKey);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Key>',
                    dataKey
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataKey);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let dataValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(dataValue);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Value>',
                    dataValue
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(dataValue);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'ceb66327-216f-42fd-845b-9f4543c62baa':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Name>',
                    fileName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let downloadParserName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(downloadParserName);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Document Parser Name>',
                    downloadParserName
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(downloadParserName);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiQueryData = getApiDetails(apiQueryDataList, apiName);
                  if (apiQueryData && Object.keys(apiQueryData).length) {
                    getAttr = apiQueryData['API_ID'] + `:-:` + apiQueryData['API_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiQueryData['API_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '46136260-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiAttributeName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                  if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                    getAttr = apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '7182ebf0-2e33-11ef-9033-4bb93e602d01');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let apiAttributeValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let apiAttributeValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (apiAttributeValueData && Object.keys(apiAttributeValueData).length && apiAttributeValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(apiAttributeValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      ['Test_Case_Step_Normal', 'Test_Case_Function_Step'].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${apiAttributeValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      apiAttributeValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      apiAttributeValue = selectedAttributeDetails['NAME'];
                    }
                    apiAttributeValue = decideScopePrefix(apiAttributeValueData) + apiAttributeValue;
                  }
                  ui_elements = apiAttributeValue;
                  is_ui_element = true;
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(apiAttributeValue);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<API Attribute Value>',
                      apiAttributeValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(apiAttributeValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case '833eb770-2e33-11ef-9033-4bb93e602d01':
                {
                  let responseStatusCode = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(responseStatusCode);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Response Status Code>',
                    responseStatusCode
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(responseStatusCode);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd':
                {
                  let pageName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName1);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                {
                  let uiElementState = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(uiElementState);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element State>',
                    uiElementState
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementState);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeOot = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeOot);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Timeout>',
                    timeOot
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeOot);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
                {
                  let testSetScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testSetScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testSetScope;
                  }
                  getAttr = replaceKeyword(testSetScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Set Scope Variable>',
                    testSetScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testSetScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '842981e7-e484-11ef-904e-02c8cad0208d':
                {
                  let testCaseScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (
                    functionIds &&
                    [
                      'Test_Case_Step_Normal',
                      'Test_Case_View_Navigation_Step',
                      'Test_Case_Function_Step',
                      'Test_Case_Function_View_Navigation_Step',
                      'Test_Case_Function_UI_Element_Group_Step',
                      'Test_Case_UI_Element_Group_Step'
                    ].includes(data['QueryDataType'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    testCaseScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testCaseScope;
                  }
                  getAttr = replaceKeyword(testCaseScope);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Test Case Scope Variable>',
                    testCaseScope
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(testCaseScope);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let timeInterval = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(timeInterval);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Time Interval>',
                    timeInterval
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(timeInterval);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let attempts = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(attempts);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Attempts>',
                    attempts
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(attempts);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, '75b16425-1531-4cee-8c09-30f5be70c4b0');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let cellValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                  if (cellValueData && Object.keys(cellValueData).length && cellValueData['SCOPE_VARIABLE_UUID']) {
                    let selectedAttributeDetails = await getAttributeValueDetails(cellValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                    if (
                      selectedAttributeDetails &&
                      Object.keys(selectedAttributeDetails).length &&
                      [
                        'Test_Case_Step_Normal',
                        'Test_Case_View_Navigation_Step',
                        'Test_Case_Function_Step',
                        'Test_Case_Function_View_Navigation_Step',
                        'Test_Case_Function_UI_Element_Group_Step',
                        'Test_Case_UI_Element_Group_Step'
                      ].includes(data['QueryDataType']) &&
                      selectedAttributeDetails['IS_FUNCTION_ATTRIBUTE'] == 'Yes'
                    ) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${cellValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                      cellValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                    } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                      cellValue = selectedAttributeDetails['NAME'];
                    }
                    cellValue = decideScopePrefix(cellValueData) + cellValue;
                  }
                  getAttr = replaceKeyword(cellValue);
                  ui_elements = cellValue;
                  is_ui_element = true;
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Cell Value>',
                      cellValue
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(cellValue);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let rowNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(rowNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Row Number>',
                    rowNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(rowNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Table Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '078e6534-f38f-4aad-b89d-cad8216ad86b':
                {
                  let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Column Header 1>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'ba1ef281-412a-4544-b615-7767b06eb489':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  if (data['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] == 'Yes') {
                    let uiElementValueStepAttributeDetails = extactUIElementValueStepAttributeDetails(stepDefAttributeQueryData, 'ba1ef281-412a-4544-b615-7767b06eb489');
                    if (uiElementValueStepAttributeDetails && uiElementValueStepAttributeDetails.length) {
                      let isUIElementValueEmpty = checkIsUIElementValueAttributeEmpty(
                        attributeValueQueryData,
                        uiElementValueStepAttributeDetails[0]['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        data['CHILD_ATTRIBUTE_DATA']
                      );
                      if (isUIElementValueEmpty) {
                        data['isItemRemove'] = true;
                      }
                    }
                  }
                  let cellValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  is_ui_element = true;
                  ui_elements = ui_elements ? `[${ui_elements}][${cellValue1}]` : '';
                  if (!checkTestDataExistsForTestCase(testCaseQueryData, testDataQueryData, data)) {
                    getAttr = replaceKeyword(cellValue1);
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Cell Value 1>',
                      cellValue1
                        ? function () {
                            let Datawithbackslash = escapeSingleQuote(cellValue1);
                            return `'` + Datawithbackslash + `'`;
                          }
                        : `' '`
                    );
                  }
                }
                break;
              case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let columnNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(columnNumber);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Column Number>',
                    columnNumber
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(columnNumber);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
              case '28058e26-fa09-42fb-868a-1988bd0a746c':
                {
                  let filteredResult = await filterStepByCurrentStep(filteredStepAttributeValueData, data, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], dataObject, childStepAttributeValueData);
                  if (filteredResult && filteredResult.length) {
                    attributeValueQueryData = excludeAttribute(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                    attributeValueQueryData.push(...filteredResult);
                  }
                  let fileFullPath = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  getAttr = replaceKeyword(fileFullPath);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Full Path>',
                    fileFullPath
                      ? function () {
                          let Datawithbackslash = escapeSingleQuote(fileFullPath);
                          return `'` + Datawithbackslash + `'`;
                        }
                      : `' '`
                  );
                }
                break;
            }
            inc++;
            let valueColumnName = `v` + inc;
            data[valueColumnName] = getAttr;
          }
        }
        let getKeywordByStepType = inputStepType ? inputStepType + ' ' : '';
        data['Test Case Step Name'] = getKeywordByStepType + stepDefTemplateVerbiageName;
        data['TEST_CASE_STEP_UUID'] = data['ParentKey'];
        if (data['API_UUID']) {
          apiList.push(data['API_UUID']);
        }
        if (is_ui_element) {
          let testCaseDetails = testCaseQueryData.filter((item) => item['Test Case ID'] == data['Test Case ID']);
          let stepDetails = {};
          stepDetails['TEST_CASE_UUID'] = testCaseDetails[0]['Test Case UUID'];
          stepDetails['TEST_DATA_COLUMN_ID'] = 'F';
          stepDetails['TEST_CASE_STEP_UUID'] = data['ParentKey'];
          stepDetails['TEST_DATA_VALUE'] = ui_elements;
          stepDetails['IS_ITEM_REMOVE'] = data['isItemRemove'];
          stepDetails['FUNCTION_UUID'] = data['FunctionKey'];
          stepDetails['FUNCTION_STEP_UUID'] = data['FunctionStepKey'];
          stepDetails['UI_ELEMENT_GROUP_UUID'] = data['UIElementGroupKey'];
          stepDetails['UI_ELEMENT_GROUP_STEP_UUID'] = data['UIElementGroupStepKey'];
          stepDetails['VIEW_UUID'] = data['ViewKey'];
          stepDetails['QueryDataType'] = data['QueryDataType'];
          stepDetails['VIEW_NAVIGATION_STEP_UUID'] = data['ViewNavigationStepKey'];
          ui_element_list.push(stepDetails);
        }
      }
    }
  }
  testCaseStepNormalQueryData = reorderTestCaseStep(testCaseStepNormalQueryData);
  let testDataQueryDataPreList = testDataQueryData;
  testDataQueryDataPreList = ui_element_list.concat(testDataQueryData);
  testCaseStepNormalQueryData = processTestCaseSteps(testDataQueryDataPreList, testCaseStepNormalQueryData);
  let currentPageIds = '';
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    currentPageIds = testCaseStepNormalQueryData
      .map((item) => item['Page ID'])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID', IS_BASE_URL_OVERRIDDEN FROM PAGE WHERE PAGE_UUID in(${
    attributeIds ? attributeIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
  pageNewQueryData = await ConcatinateURL(pageNewQueryData);
  let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
  let uiElementQuery = `SELECT PAGE.PAGE_ID AS 'Page ID', UI_ELEMENT.UI_ELEMENT_ID AS 'UI Element ID', UI_ELEMENT.UI_ELEMENT_NAME AS 'UI Element Name', (SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID = UI_ELEMENT.UI_ELEMENT_TYPE) AS 'Element Type', UI_ELEMENT.LOCATOR_TYPE AS 'Locator Type', UI_ELEMENT.LOCATOR_VALUE AS 'Locator Value', CASE WHEN (IFNULL(UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_LOAD_IDENTIFIER END AS 'Is Page Load Identifier', 'Active' AS Status, 'No Action' AS Actions, UI_ELEMENT.EVENT_NAME AS 'Event Name', UI_ELEMENT.UI_ELEMENT_UUID AS 'UI Element UUID' FROM UI_ELEMENT JOIN PAGE ON PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID WHERE UI_ELEMENT.PAGE_NEW_UUID IN (${
    pageList ? pageList : `''`
  }) ORDER BY UI_ELEMENT.UI_ELEMENT_ID ASC`;
  let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementQuery, input);
  if (uiElementQueryData && uiElementQueryData.length) {
    uiElementQueryData.sort((a, b) => {
      let afield1 = a['Page ID'];
      let bfield1 = b['Page ID'];
      let afield2 = a['UI ELement ID'];
      let bfield2 = b['UI ELement ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  let currentApiIds = '';
  if (apiList && apiList.length) {
    currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
  }
  let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID',USE_PROXY_INDICATOR as 'Use Proxy Indicator' FROM API_NEW WHERE API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID order by API_ID asc`;
  let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
  let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) order by API_ATTRIBUTE_ID asc`;
  let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiAttributeQuery, input);
  if (apiAttributeQueryData && apiAttributeQueryData.length) {
    apiAttributeQueryData.sort((a, b) => {
      let afield1 = a['API ID'];
      let bfield1 = b['API ID'];
      let afield2 = a['API Attribute ID'];
      let bfield2 = b['API Attribute ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  msg.payload.result.message = 'JSON Downloaded';
  let userNameQuery = `SELECT concat(FIRST_NAME, ' ',LAST_NAME) as USER_NAME FROM USER_PROFILE WHERE AE_USER_PROFILE_UUID=:APP_LOGGED_IN_USER_ID;`;
  let userNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('INFO_AUTHORIZATION', userNameQuery, input);
  let functionalAreaQuery = `SELECT '${userNameQueryData['USER_NAME']}' as USER_NAME,:APP_LOGGED_IN_USER_ID as USER_UUID, FUNCTIONAL_AREA_UUID as APP_UUID,TENANT_UUID as TENANT_UUID, :TEST_SUITE_UUID as 'TEST_SUITE_UUID',:MASTER_CODE_VERSION_ID as 'VERSION_NUMBER' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID;`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionalAreaQuery, input);
  responseJson['application'] = functionalAreaQueryData;
  responseJson['apiconfig'] = transformApiDataMultiple(apiQueryData, apiAttributeQueryData);
  responseJson['pageConfig'] = preparePageConfig(pageNewQueryData, uiElementQueryData);
  let testSetData = prepareTestSetConfig(testSetQueryData, testCaseQueryData, testCaseStepNormalQueryData);
  responseJson['testsetConfig'] = testSetData['testSetConfigObject'];
  responseJson['testsetConfigFlattend'] = testSetData['testsetConfigFlattendObject'];
  msg.payload.result.data = responseJson;
  node.send(msg);
} else {
  msg.payload.result = {};
  msg.payload.result.message = 'Invalid Type';
  node.send(msg);
}
