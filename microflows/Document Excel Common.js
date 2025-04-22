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
function generateExcelData(inputData) {
  let mainArray = [];
  for (let data of inputData) {
    let dataArray = [];
    for (let key in data) {
      dataArray.push(data[key]);
    }
    mainArray.push(dataArray);
  }
  return mainArray;
}
let input = msg.payload.apiRequestBody;
debugger;
function ConcatinateURL(data) {
  data.forEach((item) => {
    if (item['Page Direct Access URL']) {
      item['Page Direct Access URL'] = input.APPLICATION_ENVIRONMENT_BASE_URL + '/' + item['Page Direct Access URL'];
    }
  });
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
  if (
    parts.length == 5 &&
    parts[0].length <= 10 &&
    parts[1].length <= 10 &&
    parts[2].length <= 10 &&
    parts[3].length <= 10 &&
    parts[4].length <= 15
  ) {
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
  let uiElementGroupQueryDataListData = uiElementGroupQueryDataList.filter(
    (item) => item['UI_ELEMENT_GROUP_UUID'] == uiElementGroupIds
  );
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
    let uiElementTypeData = uiElementTypeList.filter(
      (item) => item['UI_ELEMENT_TYPE_UUID'] == uiElementQueryData[0]['UI_ELEMENT_TYPE']
    );
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
    let functionQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      functionQuery,
      input
    );
    return functionQueryDataList;
  } else {
    return [];
  }
}
async function fetchUIElementGroupDetails(attributeIds) {
  if (attributeIds) {
    let uiElementGroupQuery = `SELECT * FROM UI_ELEMENT_GROUP WHERE UI_ELEMENT_GROUP_UUID in (${attributeIds}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
    let uiElementGroupQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      uiElementGroupQuery,
      input
    );
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
    let apiAttributeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      apiAttributeQuery,
      input
    );
    return apiAttributeQueryDataList;
  } else {
    return [];
  }
}
async function fetchChildAttributeFromAttributeTable(queryListMap) {
  let attributeValueQueryDataEntries = [];
  let attrValues = [];
  let object = {};
  console.log('queryListMap:::::::::::::::::::', queryListMap);
  for (let queries of queryListMap) {
    if (queries['primaryKeys']) {
      const attributeValueQuery = `SELECT * FROM ${queries['CHILD_ATTRIBUTE_TABLE_NAME']} WHERE ${queries['PRIMARY_COLUMN_NAME']} in (${queries['primaryKeys']}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      let attributeValueQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(
        'PRIMARYSPRINGFM',
        attributeValueQuery,
        input
      );
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
  let getUIElementStepDefAttributeUUID = stepDefAttributeQueryData.filter(
    (item) => item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == 'adcf6e25-f890-476c-bdcf-e723c6d7894c'
  );
  let stepDefArrributeIdforUIElement = '';
  if (getUIElementStepDefAttributeUUID && getUIElementStepDefAttributeUUID.length) {
    stepDefArrributeIdforUIElement = getUIElementStepDefAttributeUUID[0]['STEP_DEFINITION_ATTRIBUTE_UUID'];
  }
  let actualUIElementUUID = '';
  let getUIElementIdFromAttribute = attributeValueQueryData.filter(
    (item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeIdforUIElement
  );
  if (getUIElementIdFromAttribute && getUIElementIdFromAttribute.length) {
    actualUIElementUUID = getUIElementIdFromAttribute[0][data['CHILD_ATTRIBUTE_DATA']];
  }
  return actualUIElementUUID;
}
function getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data) {
  let getColumnHeaderStepDefAttributeUUID = stepDefAttributeQueryData.filter(
    (item) => item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == 'd797acb4-5e5c-447b-b0c5-60dad38e39a5'
  );
  let stepDefArrributeIdforUIElement = '';
  if (getColumnHeaderStepDefAttributeUUID && getColumnHeaderStepDefAttributeUUID.length) {
    stepDefArrributeIdforUIElement = getColumnHeaderStepDefAttributeUUID[0]['STEP_DEFINITION_ATTRIBUTE_UUID'];
  }
  let actualColumnHeaderUUID = '';
  let getUIElementIdFromAttribute = attributeValueQueryData.filter(
    (item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeIdforUIElement
  );
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
let queryListMap = [];
AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
const stepDefAttributeQueryList = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
let stepDefAttributeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(
  'PRIMARYSPRINGFM',
  stepDefAttributeQueryList,
  input
);
const stepDefTemplateVerbiageQueryList = `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE`;
let stepDefTemplateVerbiageQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(
  `PRIMARYSPRINGFM`,
  stepDefTemplateVerbiageQueryList,
  input
);
const uiElementTypeQuery = `SELECT * FROM UI_ELEMENT_TYPE_MASTER`;
let uiElementTypeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(
  `PRIMARYSPRINGFM`,
  uiElementTypeQuery,
  input
);
debugger;
if (
  input.APPLICATION_ENVIRONMENT_BASE_URL &&
  input.TEST_SET_UUID &&
  input.TEST_SET_NAME &&
  input.FUNCTIONAL_AREA_UUID &&
  (input.GRID_NAME == 'Test Set' ||
    input.GRID_NAME == 'Personal Test Set' ||
    input.GRID_NAME == 'Personal - Regular Test Set' ||
    input.GRID_NAME == 'Personal - Unit Functional Test Set' ||
    input.GRID_NAME == 'Page Navigation Test Set' ||
    input.GRID_NAME == 'Personal - Orphan Test Set' ||
    input.GRID_NAME == 'Unit Functional Test Set' ||
    input.GRID_NAME == 'Orphan Test Set')
) {
  msg.payload.result = {};
  let maxLength = 200;
  let documentName = msg.payload.apiRequestBody.TEST_SET_NAME
    ? msg.payload.apiRequestBody.TEST_SET_NAME.replaceAll(/[^A-Z0-9-]+/gi, '_')
    : 'GeneratedTestCase';
  msg.payload.result.documentName =
    documentName && documentName.length > maxLength ? documentName.substring(0, maxLength) : documentName;
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster =
    versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let functionalAreaQuery = `SELECT FUNCTIONAL_AREA_ID as 'App ID',FUNCTIONAL_AREA_NAME as 'App Name','Active' as Status, 'No Action' as Actions,FUNCTIONAL_AREA_UUID as 'App UUID', :APP_LOGGED_IN_USER_ID as 'User UUID', :MASTER_CODE_VERSION_ID as 'Version Number' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    functionalAreaQuery,
    input
  );
  msg.payload.documentData = {};
  let objectData = {};
  let apiList = [];
  objectData['Application'] = generateExcelData(functionalAreaQueryData);
  let testSetQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_SET_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,TEST_SET_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM TEST_SET,FUNCTIONAL_AREA WHERE TEST_SET_UUID=:TEST_SET_UUID AND TEST_SET.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
    testSetQueryData = testSetQueryData.map((testSet) => {
      return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
    });
  }
  objectData['Test Set'] = generateExcelData(testSetQueryData);
  let testCaseQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_SEQ_ID as 'Test Case Seq ID',TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE,TEST_SET WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID AND TEST_CASE.TEST_SET_UUID=:TEST_SET_UUID AND TEST_CASE.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE ORDER BY TEST_CASE_SEQ_ID asc`;
  let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
  objectData['Test Case'] = generateExcelData(testCaseQueryData);
  let testCaseStepNormalQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tc.TEST_CASE_EXECUTON_TYPE =:AUTOMATION_TYPE AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.TEST_SET_UUID =:TEST_SET_UUID AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' or tcs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and ( vns.FUNCTION_STEP_UUID IS NULL or vns.FUNCTION_STEP_UUID = '' ) and ( vns.FUNCTION_UUID IS NULL or vns.FUNCTION_UUID = '' ) ) ) ) ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
  let testCaseStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseStepNormalQuery,
    input
  );
  queryListMap.push(
    testCaseStepNormalQueryObject(
      [...new Set(testCaseStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  let testCaseNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2,CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcs.TEST_SET_UUID =:TEST_SET_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE =:AUTOMATION_TYPE AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND EXISTS ( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and ( vns.FUNCTION_STEP_UUID IS NULL or vns.FUNCTION_STEP_UUID = '' ) and ( vns.FUNCTION_UUID IS NULL or vns.FUNCTION_UUID = '' ) ) ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseNavigationStepQuery,
    input
  );
  queryListMap.push(
    testCaseNavigationStepQueryObject(
      [...new Set(testCaseNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseNavigationStepQueryData);
  let testCaseFunctionStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', TEST_CASE_FUNCTION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcfs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, TEST_CASE_FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfs.TEST_CASE_FUNCTION_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE tc, TEST_SET ts, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND tcs.TEST_SET_UUID =:TEST_SET_UUID AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE =:AUTOMATION_TYPE AND ( ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' or tcfs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NOT NULL and vns.FUNCTION_STEP_UUID!='' and vns.FUNCTION_UUID IS NOT NULL and vns.FUNCTION_UUID !='' ) ) ) ORDER BY TEST_CASE_STEP_ID, TEST_CASE_FUNCTION_STEP_ID ASC`;
  let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseFunctionStepQuery,
    input
  );
  queryListMap.push(
    testCaseFunctionStepQueryObject(
      [...new Set(testCaseFunctionStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionStepQueryData);
  let testCaseFunctionNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ), ' Page - ', 'Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2,CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcs.TEST_SET_UUID =:TEST_SET_UUID AND tcfs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE =:AUTOMATION_TYPE AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and ( vns.FUNCTION_STEP_UUID IS NOT NULL and vns.FUNCTION_STEP_UUID != '' ) and ( vns.FUNCTION_UUID IS NOT NULL and vns.FUNCTION_UUID != '' ) ) ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseFunctionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseFunctionNavigationStepQuery,
    input
  );
  queryListMap.push(
    testCaseFunctionNavigationStepQueryObject(
      [...new Set(testCaseFunctionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionNavigationStepQueryData);
  let testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND tcfs.TEST_CASE_FUNCTION_STEP_UUID = tcfuegs.TEST_CASE_FUNCTION_STEP_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE ORDER BY TEST_CASE_STEP_ID asc, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseFunctionUIElementGroupStepQuery,
    input
  );
  queryListMap.push(
    testCaseFunctionUIElementGroupStepQueryObject(
      [
        ...new Set(
          testCaseFunctionUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID)
        ),
      ]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionUIElementGroupStepQueryData);
  let testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_UI_ELEMENT_GROUP_STEP_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcuegs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE ORDER BY TEST_CASE_STEP_ID, TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
  let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseUIElementGroupStepQuery,
    input
  );
  queryListMap.push(
    testCaseUIElementGroupStepQueryObject(
      [...new Set(testCaseUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseUIElementGroupStepQueryData);
  let attributeIds = '';
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
    for (let data of testCaseStepNormalQueryData) {
      let inc = 0;
      if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Automated') {
        let inputStepType =
          data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data' ? 'Given' : data['Test Case Step Type'];
        data['Test Case Step Type'] = inputStepType;
        let stepDefAttributeQueryData = getStepAttributeData(
          stepDefAttributeQueryDataList,
          data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']
        );
        let stepDefTemplateVerbiageQueryData = getStepVerbiageData(
          stepDefTemplateVerbiageQueryDataList,
          data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']
        );
        let stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length
            ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME']
            : '';
        data['Step Definition Template'] = stepDefTemplateVerbiageName;
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
          let attributeValueQueryData = getChildAttributeData(
            attributeDataObject.attributeValueQueryDataEntries,
            data.PRIMARY_COLUMN_VALUE,
            data.PRIMARY_COLUMN_NAME
          );
          let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
          let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
          for (let codeDesc of stepDefAttributeQueryData) {
            let getAttr = '';
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
              case '57b76ab3-8112-4343-af0f-49643c808bf7':
                {
                  let pageName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '7f855066-ad39-4325-8108-30befb2447e6':
                {
                  let uiElementTypeQueryData = getUIElementType(
                    uiElementDataList,
                    uiElementTypeQueryDataList,
                    actualUIElementUUID
                  );
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Type>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                {
                  let uiElementValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let keyNameInKeyPad = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  getAttr = replaceKeyword(keyNameInKeyPad);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Key Name in Keypad>',
                    function () {
                      let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                      return `'` + Datawithbackslash + `'`;
                    }
                  );
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
                let confirmUIElementValue = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let functionName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                  if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                    getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Function Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementName1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Name 1>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementValue1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let userActionName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<User Action Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let uiElementTypeQueryData = getUIElementType(
                    uiElementDataList,
                    uiElementTypeQueryDataList,
                    actualUIElementUUID
                  );
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<User Action Type>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                {
                  let uiElementGroupName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementGroupStepQueryData = getUIElementGroupDetails(
                    uiElementGroupQueryDataList,
                    uiElementGroupName
                  );
                  if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                    getAttr =
                      uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] +
                      `:-:` +
                      uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Group Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                {
                  let pageNumber = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let dataKey = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let dataValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let fileName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let downloadParserName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let apiName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let apiAttributeName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                  if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                    getAttr =
                      apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<API Attribute Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                {
                  let apiAttributeValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let responseStatusCode = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let pageName1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let uiElementState = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let timeOot = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let testSetScope = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let functionIds = getFunctionDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']
                  );
                  if (functionIds) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                      'PRIMARYSPRINGFM',
                      functionQuery,
                      input
                    );
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
                  let testCaseScope = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let functionIds = getFunctionDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']
                  );
                  if (functionIds) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                      'PRIMARYSPRINGFM',
                      functionQuery,
                      input
                    );
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
                let timeInterval = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let attempts = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Column Header>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                let cellValue = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let rowNumber = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Column Header 1>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case 'ba1ef281-412a-4544-b615-7767b06eb489':
                let cellValue1 = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let columnNumber = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let fileFullPath = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
        delete data['API_UUID'];
        delete data['TEST_CASE_EXECUTON_TYPE'];
        delete data['PLAYWRITE_STEP_CODE'];
        delete data['CHILD_ATTRIBUTE_TABLE_NAME'];
        delete data['CHILD_ATTRIBUTE_DATA'];
        delete data['PRIMARY_COLUMN_NAME'];
        delete data['PRIMARY_COLUMN_VALUE'];
        delete data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
      } else if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Recorded') {
        let inputStepType =
          data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data' ? 'Given' : data['Test Case Step Type'];
        data['Test Case Step Type'] = inputStepType;
        data['Step Definition Template'] = data['PLAYWRITE_STEP_CODE'];
        if (data['API_UUID']) {
          apiList.push(data['API_UUID']);
        }
        delete data['API_UUID'];
        delete data['TEST_CASE_EXECUTON_TYPE'];
        delete data['PLAYWRITE_STEP_CODE'];
        delete data['CHILD_ATTRIBUTE_TABLE_NAME'];
        delete data['CHILD_ATTRIBUTE_DATA'];
        delete data['PRIMARY_COLUMN_NAME'];
        delete data['PRIMARY_COLUMN_VALUE'];
        delete data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
      }
    }
  }
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
  let originalList = generateExcelData(testCaseStepNormalQueryData);
  let dupList = [];
  let index = 0;
  if (originalList && originalList.length) {
    if (originalList[0].length) {
      let firstvalue = originalList[0][1];
      for (let i = 0; i < originalList.length; i++) {
        if (firstvalue == originalList[i][1]) {
          let mng = originalList[i];
          index = index + 1;
          originalList[i][3] = index;
          dupList.push(mng);
        } else {
          firstvalue = originalList[i][1];
          let mng = originalList[i];
          index = 1;
          originalList[i][3] = index;
          dupList.push(mng);
        }
      }
    }
  }
  objectData['Test Case Step'] = dupList;
  let currentPageIds = '';
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    currentPageIds = testCaseStepNormalQueryData
      .map((item) => item['Page ID'])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID' FROM PAGE WHERE PAGE_UUID in(${
    attributeIds ? attributeIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
  ConcatinateURL(pageNewQueryData);
  objectData['Page'] = generateExcelData(pageNewQueryData);
  let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
  let uiElementQuery = `SELECT PAGE.PAGE_ID AS 'Page ID', UI_ELEMENT.UI_ELEMENT_ID AS 'UI Element ID', UI_ELEMENT.UI_ELEMENT_NAME AS 'UI Element Name', (SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID = UI_ELEMENT.UI_ELEMENT_TYPE) AS 'Element Type', UI_ELEMENT.LOCATOR_TYPE AS 'Locator Type', UI_ELEMENT.LOCATOR_VALUE AS 'Locator Value', CASE WHEN (IFNULL(UI_ELEMENT.IS_PAGE_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_IDENTIFIER END AS 'Is Page Identifier', 'Active' AS Status, 'No Action' AS Actions, UI_ELEMENT.EVENT_NAME AS 'Event Name', UI_ELEMENT.UI_ELEMENT_UUID AS 'UI Element UUID' FROM UI_ELEMENT JOIN PAGE ON PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID WHERE UI_ELEMENT.PAGE_NEW_UUID IN (${
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
  objectData['UI Element'] = generateExcelData(uiElementQueryData);
  let currentApiIds = '';
  if (apiList && apiList.length) {
    currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
  }
  let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID' FROM API_NEW WHERE API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by API_ID asc`;
  let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
  objectData['API'] = generateExcelData(apiQueryData);
  let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) order by API_ATTRIBUTE_ID asc`;
  let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    apiAttributeQuery,
    input
  );
  if (apiAttributeQueryData && apiAttributeQueryData.length) {
    apiAttributeQueryData.sort((a, b) => {
      let afield1 = a['API ID'];
      let bfield1 = b['API ID'];
      let afield2 = a['API Attribute ID'];
      let bfield2 = b['API Attribute ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  objectData['API Attribute'] = generateExcelData(apiAttributeQueryData);
  Object.assign(msg.payload.documentData, objectData);
  msg.payload.result.message = 'Document Downloaded';
  if (input['AUTOMATION_TYPE'] == 'Recorded') {
    msg.payload.templateFile = 'Feature_Management_Recorded_Test_Case_Template.xlsm';
  } else {
    msg.payload.templateFile = 'Feature_Management_Test_Case_Template.xlsm';
  }
  node.send(msg);
} else if (
  input.APPLICATION_ENVIRONMENT_BASE_URL &&
  input.TEST_SET_UUID &&
  input.FUNCTIONAL_AREA_UUID &&
  input.TEST_CASE_UUID &&
  input.TEST_CASE_NAME &&
  input.GRID_NAME == 'Test Case'
) {
  msg.payload.result = {};
  let maxLength = 200;
  let docName =
    input.PARENT_GRID_NAME == 'Page Navigation Test Set'
      ? input.TEST_SET_NAME
        ? input.TEST_SET_NAME + ' ' + input.TEST_CASE_NAME
        : input.TEST_CASE_NAME
      : input.TEST_CASE_NAME;
  let documentName = docName ? docName.replaceAll(/[^A-Z0-9-]+/gi, '_') : 'GeneratedTestCase';
  msg.payload.result.documentName =
    documentName && documentName.length > maxLength ? documentName.substring(0, maxLength) : documentName;
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster =
    versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let functionalAreaQuery = `SELECT FUNCTIONAL_AREA_ID as 'App ID',FUNCTIONAL_AREA_NAME as 'App Name','Active' as Status, 'No Action' as Actions,FUNCTIONAL_AREA_UUID as 'App UUID', :APP_LOGGED_IN_USER_ID as 'User UUID',:MASTER_CODE_VERSION_ID as 'Version Number' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    functionalAreaQuery,
    input
  );
  msg.payload.documentData = {};
  let objectData = {};
  let apiList = [];
  objectData['Application'] = generateExcelData(functionalAreaQueryData);
  let testSetQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_SET_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,TEST_SET_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM TEST_SET,FUNCTIONAL_AREA WHERE TEST_SET_UUID=:TEST_SET_UUID AND TEST_SET.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
    testSetQueryData = testSetQueryData.map((testSet) => {
      return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
    });
  }
  objectData['Test Set'] = generateExcelData(testSetQueryData);
  let testCaseQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_SEQ_ID as 'Test Case Seq ID',TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE,TEST_SET WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID and TEST_CASE.TEST_CASE_UUID=:TEST_CASE_UUID order by TEST_CASE_SEQ_ID asc`;
  let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
  objectData['Test Case'] = generateExcelData(testCaseQueryData);
  let testCaseStepNormalQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tc.TEST_CASE_UUID =:TEST_CASE_UUID AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' or tcs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and (vns.FUNCTION_STEP_UUID IS NULL or vns.FUNCTION_STEP_UUID='' ) and (vns.FUNCTION_UUID IS NULL or vns.FUNCTION_UUID='') ) ) ) ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
  let testCaseStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseStepNormalQuery,
    input
  );
  queryListMap.push(
    testCaseStepNormalQueryObject(
      [...new Set(testCaseStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  let testCaseNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12,tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tc.TEST_CASE_UUID =:TEST_CASE_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND EXISTS ( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NULL or vns.FUNCTION_STEP_UUID ='' and vns.FUNCTION_UUID IS NULL or vns.FUNCTION_UUID ='') ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseNavigationStepQuery,
    input
  );
  queryListMap.push(
    testCaseNavigationStepQueryObject(
      [...new Set(testCaseNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseNavigationStepQueryData);
  let testCaseFunctionStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', TEST_CASE_FUNCTION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcfs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, TEST_CASE_FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfs.TEST_CASE_FUNCTION_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE tc, TEST_SET ts, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND tc.TEST_CASE_UUID =:TEST_CASE_UUID AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND ( ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' or tcfs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NOT NULL and vns.FUNCTION_STEP_UUID!='' and vns.FUNCTION_UUID IS NOT NULL and vns.FUNCTION_UUID !='' ) ) ) ORDER BY TEST_CASE_STEP_ID, TEST_CASE_FUNCTION_STEP_ID ASC`;
  let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseFunctionStepQuery,
    input
  );
  queryListMap.push(
    testCaseFunctionStepQueryObject(
      [...new Set(testCaseFunctionStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionStepQueryData);
  let testCaseFunctionNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ), ' Page - ', 'Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2,CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns, PAGE_VIEW v, TEST_CASE_FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tc.TEST_CASE_UUID =:TEST_CASE_UUID AND tcfs.CURRENT_PAGE_CONTEXT = v.PAGE_UUID AND v.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NOT NULL and vns.FUNCTION_STEP_UUID!='' and vns.FUNCTION_UUID IS NOT NULL and vns.FUNCTION_UUID !='' ) ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseFunctionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseFunctionNavigationStepQuery,
    input
  );
  queryListMap.push(
    testCaseFunctionNavigationStepQueryObject(
      [...new Set(testCaseFunctionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionNavigationStepQueryData);
  let testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and tcfs.TEST_CASE_FUNCTION_STEP_UUID = tcfuegs.TEST_CASE_FUNCTION_STEP_UUID and tc.TEST_CASE_UUID=:TEST_CASE_UUID and tcs.IS_FUNCTION_STEP = 'Yes' and tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID asc, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseFunctionUIElementGroupStepQuery,
    input
  );
  queryListMap.push(
    testCaseFunctionUIElementGroupStepQueryObject(
      [
        ...new Set(
          testCaseFunctionUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID)
        ),
      ]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionUIElementGroupStepQueryData);
  let testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_UI_ELEMENT_GROUP_STEP_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcuegs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and tc.TEST_CASE_UUID=:TEST_CASE_UUID and tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID, TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
  let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseUIElementGroupStepQuery,
    input
  );
  queryListMap.push(
    testCaseUIElementGroupStepQueryObject(
      [...new Set(testCaseUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseUIElementGroupStepQueryData);
  let executionType = '';
  let attributeIds = '';
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
    for (let data of testCaseStepNormalQueryData) {
      let inc = 0;
      executionType = data['TEST_CASE_EXECUTON_TYPE'];
      if (data && data['TEST_CASE_EXECUTON_TYPE'] != 'Recorded') {
        let inputStepType =
          data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data' ? 'Given' : data['Test Case Step Type'];
        data['Test Case Step Type'] = inputStepType;
        let stepDefAttributeQueryData = getStepAttributeData(
          stepDefAttributeQueryDataList,
          data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']
        );
        let stepDefTemplateVerbiageQueryData = getStepVerbiageData(
          stepDefTemplateVerbiageQueryDataList,
          data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']
        );
        let stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length
            ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME']
            : '';
        data['Step Definition Template'] = stepDefTemplateVerbiageName;
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
          let attributeValueQueryData = getChildAttributeData(
            attributeDataObject.attributeValueQueryDataEntries,
            data.PRIMARY_COLUMN_VALUE,
            data.PRIMARY_COLUMN_NAME
          );
          let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
          let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
          for (let codeDesc of stepDefAttributeQueryData) {
            let getAttr = '';
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
              case '57b76ab3-8112-4343-af0f-49643c808bf7':
                {
                  let pageName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '7f855066-ad39-4325-8108-30befb2447e6':
                {
                  let uiElementTypeQueryData = getUIElementType(
                    uiElementDataList,
                    uiElementTypeQueryDataList,
                    actualUIElementUUID
                  );
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Type>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                {
                  let uiElementValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let keyNameInKeyPad = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  getAttr = replaceKeyword(keyNameInKeyPad);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Key Name in Keypad>',
                    function () {
                      let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                      return `'` + Datawithbackslash + `'`;
                    }
                  );
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
                let confirmUIElementValue = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                  if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                    let functionNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      functionNameQuery,
                      input
                    );
                    getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Function Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementName1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Name 1>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementValue1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let userActionName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<User Action Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let uiElementTypeQueryData = getUIElementType(
                    uiElementDataList,
                    uiElementTypeQueryDataList,
                    actualUIElementUUID
                  );
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<User Action Type>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                {
                  let uiElementGroupName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementGroupStepQueryData = getUIElementGroupDetails(
                    uiElementGroupQueryDataList,
                    uiElementGroupName
                  );
                  if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                    getAttr =
                      uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] +
                      `:-:` +
                      uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Group Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                {
                  let pageNumber = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let dataKey = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let dataValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let fileName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let downloadParserName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let apiName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let apiAttributeName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                  if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                    getAttr =
                      apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<API Attribute Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                {
                  let apiAttributeValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let responseStatusCode = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let pageName1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let uiElementState = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let timeOot = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let testSetScope = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let functionIds = getFunctionDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']
                  );
                  if (functionIds) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                      'PRIMARYSPRINGFM',
                      functionQuery,
                      input
                    );
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
                  let testCaseScope = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let functionIds = getFunctionDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']
                  );
                  if (functionIds) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                      'PRIMARYSPRINGFM',
                      functionQuery,
                      input
                    );
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
                let timeInterval = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let attempts = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Column Header>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                let cellValue = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let rowNumber = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Column Header 1>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case 'ba1ef281-412a-4544-b615-7767b06eb489':
                let cellValue1 = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let columnNumber = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let fileFullPath = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
        delete data['API_UUID'];
        delete data['TEST_CASE_EXECUTON_TYPE'];
        delete data['PLAYWRITE_STEP_CODE'];
        delete data['CHILD_ATTRIBUTE_TABLE_NAME'];
        delete data['CHILD_ATTRIBUTE_DATA'];
        delete data['PRIMARY_COLUMN_NAME'];
        delete data['PRIMARY_COLUMN_VALUE'];
        delete data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
      } else if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Recorded') {
        let inputStepType =
          data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data' ? 'Given' : data['Test Case Step Type'];
        data['Test Case Step Type'] = inputStepType;
        data['Step Definition Template'] = data['PLAYWRITE_STEP_CODE'];
        if (data['API_UUID']) {
          apiList.push(data['API_UUID']);
        }
        delete data['API_UUID'];
        delete data['TEST_CASE_EXECUTON_TYPE'];
        delete data['PLAYWRITE_STEP_CODE'];
        delete data['CHILD_ATTRIBUTE_TABLE_NAME'];
        delete data['CHILD_ATTRIBUTE_DATA'];
        delete data['PRIMARY_COLUMN_NAME'];
        delete data['PRIMARY_COLUMN_VALUE'];
        delete data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
      }
    }
  }
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
  let originalList = generateExcelData(testCaseStepNormalQueryData);
  let dupList = [];
  let index = 0;
  if (originalList && originalList.length) {
    if (originalList[0].length) {
      let firstvalue = originalList[0][1];
      for (let i = 0; i < originalList.length; i++) {
        if (firstvalue == originalList[i][1]) {
          let mng = originalList[i];
          index = index + 1;
          originalList[i][3] = index;
          dupList.push(mng);
        } else {
          firstvalue = originalList[i][1];
          let mng = originalList[i];
          index = 1;
          originalList[i][3] = index;
          dupList.push(mng);
        }
      }
    }
  }
  objectData['Test Case Step'] = dupList;
  let currentPageIds = '';
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    currentPageIds = testCaseStepNormalQueryData
      .map((item) => item['Page ID'])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID' FROM PAGE WHERE PAGE_UUID in(${
    attributeIds ? attributeIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
  ConcatinateURL(pageNewQueryData);
  objectData['Page'] = generateExcelData(pageNewQueryData);
  let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
  let uiElementQuery = `SELECT PAGE.PAGE_ID AS 'Page ID', UI_ELEMENT.UI_ELEMENT_ID AS 'UI Element ID', UI_ELEMENT.UI_ELEMENT_NAME AS 'UI Element Name', (SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID = UI_ELEMENT.UI_ELEMENT_TYPE) AS 'Element Type', UI_ELEMENT.LOCATOR_TYPE AS 'Locator Type', UI_ELEMENT.LOCATOR_VALUE AS 'Locator Value', CASE WHEN (IFNULL(UI_ELEMENT.IS_PAGE_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_IDENTIFIER END AS 'Is Page Identifier', 'Active' AS Status, 'No Action' AS Actions, UI_ELEMENT.EVENT_NAME AS 'Event Name', UI_ELEMENT.UI_ELEMENT_UUID AS 'UI Element UUID' FROM UI_ELEMENT JOIN PAGE ON PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID WHERE UI_ELEMENT.PAGE_NEW_UUID IN (${
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
  objectData['UI Element'] = generateExcelData(uiElementQueryData);
  let currentApiIds = '';
  if (apiList && apiList.length) {
    currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
  }
  let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID' FROM API_NEW WHERE API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by API_ID asc`;
  let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
  objectData['API'] = generateExcelData(apiQueryData);
  let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) order by API_ATTRIBUTE_ID asc`;
  let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    apiAttributeQuery,
    input
  );
  if (apiAttributeQueryData && apiAttributeQueryData.length) {
    apiAttributeQueryData.sort((a, b) => {
      let afield1 = a['API ID'];
      let bfield1 = b['API ID'];
      let afield2 = a['API Attribute ID'];
      let bfield2 = b['API Attribute ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  objectData['API Attribute'] = generateExcelData(apiAttributeQueryData);
  Object.assign(msg.payload.documentData, objectData);
  msg.payload.result.message = 'Document Downloaded';
  if (executionType == 'Recorded') {
    msg.payload.templateFile = 'Feature_Management_Recorded_Test_Case_Template.xlsm';
  } else {
    msg.payload.templateFile = 'Feature_Management_Test_Case_Template.xlsm';
  }
  node.send(msg);
} else if (
  input.APPLICATION_ENVIRONMENT_BASE_URL &&
  input.FUNCTIONAL_AREA_UUID &&
  input.FUNCTION_UUID &&
  input.FUNCTION_NAME &&
  input.GRID_NAME == 'Function'
) {
  msg.payload.result = {};
  let maxLength = 200;
  let documentName = input.FUNCTION_NAME ? input.FUNCTION_NAME.replaceAll(/[^A-Z0-9-]+/gi, '_') : 'GeneratedFunction';
  msg.payload.result.documentName =
    documentName && documentName.length > maxLength ? documentName.substring(0, maxLength) : documentName;
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster =
    versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let functionalAreaQuery = `SELECT FUNCTIONAL_AREA_ID as 'App ID',FUNCTIONAL_AREA_NAME as 'App Name','Active' as Status, 'No Action' as Actions,FUNCTIONAL_AREA_UUID as 'App UUID', :APP_LOGGED_IN_USER_ID as 'User UUID',:MASTER_CODE_VERSION_ID as 'Version Number' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    functionalAreaQuery,
    input
  );
  msg.payload.documentData = {};
  let objectData = {};
  let apiList = [];
  objectData['Application'] = generateExcelData(functionalAreaQueryData);
  let testSetQuery = `SELECT FUNCTION_ID as 'Test Set ID',FUNCTION_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,FUNCTION_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM featuremanagement_app.FUNCTION,FUNCTIONAL_AREA WHERE FUNCTION_UUID=:FUNCTION_UUID AND featuremanagement_app.FUNCTION.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
    testSetQueryData = testSetQueryData.map((testSet) => {
      return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
    });
  }
  objectData['Test Set'] = generateExcelData(testSetQueryData);
  let functionQuery = `SELECT FUNCTION_ID as 'Test Set ID',FUNCTION_ID as 'Test Case ID','' as 'Test Case Seq ID',FUNCTION_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,FUNCTION_UUID as 'Test Case UUID' FROM featuremanagement_app.FUNCTION,FUNCTIONAL_AREA WHERE FUNCTION_UUID=:FUNCTION_UUID AND featuremanagement_app.FUNCTION.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let functionQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
  objectData['Test Case'] = generateExcelData(functionQueryData);
  let functionStepNormalQuery = `SELECT FUNCTION_ID AS 'Test Set ID', FUNCTION_ID AS 'Test Case ID', tcs.FUNCTION_STEP_SEQ_ID AS 'Test Case Step ID', tcs.FUNCTION_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.FUNCTION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, 'FUNCTION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'FUNCTION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'FUNCTION_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.FUNCTION_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM featuremanagement_app.FUNCTION tc JOIN FUNCTION_STEP tcs ON tc.FUNCTION_UUID = tcs.FUNCTION_UUID WHERE tcs.FUNCTION_UUID =:FUNCTION_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' OR tcs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM FUNCTION_VIEW_NAVIGATION_STEP vns WHERE vns.FUNCTION_STEP_UUID = tcs.FUNCTION_STEP_UUID ) ) ) ORDER BY FUNCTION_STEP_ID, FUNCTION_STEP_SEQ_ID ASC`;
  let functionStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    functionStepNormalQuery,
    input
  );
  queryListMap.push(
    functionStepNormalQueryObject(
      [...new Set(functionStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  let functionNavigationStepQuery = `SELECT tc.FUNCTION_ID AS 'Test Set ID', tc.FUNCTION_ID AS 'Test Case ID', CONCAT( tcs.FUNCTION_STEP_SEQ_ID, '-', vns.FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.FUNCTION_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.FUNCTION_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6, '' AS v7, '' AS v8, '' AS v9, '' AS v10, '' AS v11, '' AS v12, tcs.API_UUID, 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'FUNCTION_VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.FUNCTION_VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM FUNCTION_VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, FUNCTION_STEP tcs, featuremanagement_app.FUNCTION tc, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd WHERE tc.FUNCTION_UUID = tcs.FUNCTION_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tc.FUNCTION_UUID =:FUNCTION_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.FUNCTION_STEP_UUID = tcs.FUNCTION_STEP_UUID AND EXISTS( SELECT 1 FROM FUNCTION_VIEW_NAVIGATION_STEP vns where vns.FUNCTION_STEP_UUID = tcs.FUNCTION_STEP_UUID ) ORDER BY vns.FUNCTION_VIEW_NAVIGATION_STEP_ID, vns.FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let functionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    functionNavigationStepQuery,
    input
  );
  queryListMap.push(
    functionNavigationStepQueryObject(
      [...new Set(functionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
  functionStepNormalQueryData = functionStepNormalQueryData.concat(functionNavigationStepQueryData);
  let functionUIElementGroupStepNormalQuery = `SELECT FUNCTION_ID as 'Test Set ID', FUNCTION_ID as 'Test Case ID', concat( tcs.FUNCTION_STEP_SEQ_ID, '-', tcfs.FUNCTION_UI_ELEMENT_GROUP_STEP_ID ) as 'Test Case Step ID', tcs.FUNCTION_STEP_SEQ_ID as 'Test Case Step Seq ID', tcfs.FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP f WHERE f.UI_ELEMENT_GROUP_UUID = tcfs.UI_ELEMENT_GROUP_UUID ), ' UI_ELEMENT_GROUP' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, tcfs.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, 'FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'FUNCTION_UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfs.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM FUNCTION_STEP tcs, FUNCTION_UI_ELEMENT_GROUP_STEP tcfs, featuremanagement_app.FUNCTION tc WHERE tc.FUNCTION_UUID = tcs.FUNCTION_UUID and tcfs.FUNCTION_STEP_UUID = tcs.FUNCTION_STEP_UUID and tcs.FUNCTION_UUID=:FUNCTION_UUID and tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY FUNCTION_STEP_ID, FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
  let functionUIElementGroupStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    functionUIElementGroupStepNormalQuery,
    input
  );
  queryListMap.push(
    functionUIElementGroupStepNormalQueryObject(
      [
        ...new Set(
          functionUIElementGroupStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID)
        ),
      ]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
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
    for (let data of functionStepNormalQueryData) {
      let inc = 0;
      if (data && Object.keys(data).length) {
        let inputStepType = data['Test Case Step Type'];
        let stepDefAttributeQueryData = getStepAttributeData(
          stepDefAttributeQueryDataList,
          data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']
        );
        let stepDefTemplateVerbiageQueryData = getStepVerbiageData(
          stepDefTemplateVerbiageQueryDataList,
          data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']
        );
        let stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length
            ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME']
            : '';
        data['Step Definition Template'] = stepDefTemplateVerbiageName;
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
          let attributeValueQueryData = getChildAttributeData(
            attributeDataObject.attributeValueQueryDataEntries,
            data.PRIMARY_COLUMN_VALUE,
            data.PRIMARY_COLUMN_NAME
          );
          let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
          let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
          for (let codeDesc of stepDefAttributeQueryData) {
            let getAttr = '';
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
              case '57b76ab3-8112-4343-af0f-49643c808bf7':
                {
                  let pageName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '7f855066-ad39-4325-8108-30befb2447e6':
                {
                  let uiElementTypeQueryData = getUIElementType(
                    uiElementDataList,
                    uiElementTypeQueryDataList,
                    actualUIElementUUID
                  );
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Type>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                {
                  let uiElementValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let keyNameInKeyPad = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  getAttr = replaceKeyword(keyNameInKeyPad);
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Key Name in Keypad>',
                    function () {
                      let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                      return `'` + Datawithbackslash + `'`;
                    }
                  );
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
                let confirmUIElementValue = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let functionName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                  if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                    getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Function Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementName1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Name 1>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementValue1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let userActionName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<User Action Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let uiElementTypeQueryData = getUIElementType(
                    uiElementDataList,
                    uiElementTypeQueryDataList,
                    actualUIElementUUID
                  );
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<User Action Type>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                {
                  let uiElementGroupName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementGroupStepQueryData = getUIElementGroupDetails(
                    uiElementGroupQueryDataList,
                    uiElementGroupName
                  );
                  if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                    getAttr =
                      uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] +
                      `:-:` +
                      uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Group Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                {
                  let pageNumber = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let dataKey = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let dataValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let fileName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let downloadParserName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let apiName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let apiAttributeName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                  if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                    getAttr =
                      apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<API Attribute Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                {
                  let apiAttributeValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let responseStatusCode = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let pageName1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let uiElementState = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let timeOot = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let testSetScope = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let functionIds = getFunctionDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']
                  );
                  if (functionIds) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                      'PRIMARYSPRINGFM',
                      functionQuery,
                      input
                    );
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
                  let testCaseScope = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let functionIds = getFunctionDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']
                  );
                  if (functionIds) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                      'PRIMARYSPRINGFM',
                      functionQuery,
                      input
                    );
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
                let timeInterval = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let attempts = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Column Header>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                let cellValue = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let rowNumber = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Column Header 1>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case 'ba1ef281-412a-4544-b615-7767b06eb489':
                let cellValue1 = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let columnNumber = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let fileFullPath = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
        delete data['API_UUID'];
        delete data['CHILD_ATTRIBUTE_TABLE_NAME'];
        delete data['CHILD_ATTRIBUTE_DATA'];
        delete data['PRIMARY_COLUMN_NAME'];
        delete data['PRIMARY_COLUMN_VALUE'];
        delete data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
      }
    }
  }
  if (functionStepNormalQueryData && functionStepNormalQueryData.length) {
    functionStepNormalQueryData.sort((a, b) => {
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
  let originalList = generateExcelData(functionStepNormalQueryData);
  let dupList = [];
  let index = 0;
  if (originalList && originalList.length) {
    if (originalList[0].length) {
      let firstvalue = originalList[0][1];
      for (let i = 0; i < originalList.length; i++) {
        if (firstvalue == originalList[i][1]) {
          let mng = originalList[i];
          index = index + 1;
          originalList[i][3] = index;
          dupList.push(mng);
        } else {
          firstvalue = originalList[i][1];
          let mng = originalList[i];
          index = 1;
          originalList[i][3] = index;
          dupList.push(mng);
        }
      }
    }
  }
  objectData['Test Case Step'] = dupList;
  let currentPageIds = '';
  if (functionStepNormalQueryData && functionStepNormalQueryData.length) {
    currentPageIds = functionStepNormalQueryData
      .map((item) => item['Page ID'])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID' FROM PAGE WHERE PAGE_UUID in(${
    attributeIds ? attributeIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
  ConcatinateURL(pageNewQueryData);
  objectData['Page'] = generateExcelData(pageNewQueryData);
  let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
  let uiElementQuery = `SELECT PAGE.PAGE_ID AS 'Page ID', UI_ELEMENT.UI_ELEMENT_ID AS 'UI Element ID', UI_ELEMENT.UI_ELEMENT_NAME AS 'UI Element Name', (SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID = UI_ELEMENT.UI_ELEMENT_TYPE) AS 'Element Type', UI_ELEMENT.LOCATOR_TYPE AS 'Locator Type', UI_ELEMENT.LOCATOR_VALUE AS 'Locator Value', CASE WHEN (IFNULL(UI_ELEMENT.IS_PAGE_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_IDENTIFIER END AS 'Is Page Identifier', 'Active' AS Status, 'No Action' AS Actions, UI_ELEMENT.EVENT_NAME AS 'Event Name', UI_ELEMENT.UI_ELEMENT_UUID AS 'UI Element UUID' FROM UI_ELEMENT JOIN PAGE ON PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID WHERE UI_ELEMENT.PAGE_NEW_UUID IN (${
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
  objectData['UI Element'] = generateExcelData(uiElementQueryData);
  let currentApiIds = '';
  if (apiList && apiList.length) {
    currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
  }
  let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID' FROM API_NEW WHERE API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by API_ID asc`;
  let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
  objectData['API'] = generateExcelData(apiQueryData);
  let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
    currentApiIds ? currentApiIds : `''`
  }) order by API_ATTRIBUTE_ID asc`;
  let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    apiAttributeQuery,
    input
  );
  if (apiAttributeQueryData && apiAttributeQueryData.length) {
    apiAttributeQueryData.sort((a, b) => {
      let afield1 = a['API ID'];
      let bfield1 = b['API ID'];
      let afield2 = a['API Attribute ID'];
      let bfield2 = b['API Attribute ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  objectData['API Attribute'] = generateExcelData(apiAttributeQueryData);
  Object.assign(msg.payload.documentData, objectData);
  msg.payload.result.message = 'Document Downloaded';
  msg.payload.templateFile = 'Feature_Management_Test_Case_Template.xlsm';
  node.send(msg);
} else if (
  input.APPLICATION_ENVIRONMENT_BASE_URL &&
  input.FUNCTIONAL_AREA_UUID &&
  input.TEST_SUITE_UUID &&
  input.TEST_SUITE_NAME &&
  input.APP_LOGGED_IN_FUNTIONAL_AREA_ID &&
  input.GRID_NAME == 'Test Suite'
) {
  msg.payload.result = {};
  let maxLength = 200;
  let documentName = msg.payload.apiRequestBody.TEST_SUITE_NAME
    ? msg.payload.apiRequestBody.TEST_SUITE_NAME.replaceAll(/[^A-Z0-9-]+/gi, '_')
    : 'GeneratedTestSuite';
  msg.payload.result.documentName =
    documentName && documentName.length > maxLength ? documentName.substring(0, maxLength) : documentName;
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster =
    versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let functionalAreaQuery = `SELECT FUNCTIONAL_AREA_ID as 'App ID',FUNCTIONAL_AREA_NAME as 'App Name','Active' as Status, 'No Action' as Actions,FUNCTIONAL_AREA_UUID as 'App UUID',:TENANT_UUID as 'Tenant UUID',:TEST_SUITE_UUID as 'Suite UUID', :APP_LOGGED_IN_USER_ID as 'User UUID',:MASTER_CODE_VERSION_ID as 'Version Number' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    functionalAreaQuery,
    input
  );
  msg.payload.documentData = {};
  let objectData = {};
  let apiList = [];
  let testSetTabList = [];
  let testCaseTabList = [];
  let testCaseStepTabList = [];
  let pageTabList = [];
  let uiElementTabList = [];
  let apiTabList = [];
  let apiAttributeTabList = [];
  objectData['Application'] = generateExcelData(functionalAreaQueryData);
  let fetchTestSetsIds = `select TEST_SET_UUID from TEST_SUITE_TEST_SET where TEST_SUITE_UUID=:TEST_SUITE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_SUITE_TEST_SET_ID asc;`;
  let testSetIdsData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fetchTestSetsIds, input);
  if (testSetIdsData && testSetIdsData.length) {
    let testSetID = [...new Set(testSetIdsData.map((item) => item.TEST_SET_UUID).filter(isValidUUID))]
      .map((uuid) => `'${uuid}'`)
      .join(', ');
    let testSetQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_SET_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,TEST_SET_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM TEST_SET,FUNCTIONAL_AREA WHERE TEST_SET_UUID in(${testSetID}) AND TEST_SET.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
    let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
    if (testSetQueryData && testSetQueryData.length > 0) {
      testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
      testSetQueryData = testSetQueryData.map((testSet) => {
        return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
      });
    }
    testSetTabList.push(...generateExcelData(testSetQueryData));
    let testCaseQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_SEQ_ID as 'Test Case Seq ID',TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE,TEST_SET WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID AND TEST_CASE.TEST_SET_UUID in(${testSetID}) AND TEST_CASE.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND TEST_CASE.TEST_CASE_STATUS='COMMITTED' ORDER BY TEST_CASE_SEQ_ID asc`;
    let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
    testCaseTabList.push(...generateExcelData(testCaseQueryData));
    let testCaseStepNormalQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tc.TEST_CASE_EXECUTON_TYPE =:AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'COMMITTED' AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.TEST_SET_UUID in (${testSetID}) AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' OR tcs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns where vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and ( vns.FUNCTION_STEP_UUID IS NULL or vns.FUNCTION_STEP_UUID = '' ) and ( vns.FUNCTION_UUID IS NULL or vns.FUNCTION_UUID = '' ) ) ) ) ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
    let testCaseStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      testCaseStepNormalQuery,
      input
    );
    queryListMap.push(
      testCaseStepNormalQueryObject(
        [...new Set(testCaseStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
          .map((uuid) => `'${uuid}'`)
          .join(', ')
      )
    );
    let testCaseNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2,CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcs.TEST_SET_UUID in(${testSetID}) AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE =:AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'COMMITTED' AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and ( vns.FUNCTION_STEP_UUID IS NULL or vns.FUNCTION_STEP_UUID = '' ) and ( vns.FUNCTION_UUID IS NULL or vns.FUNCTION_UUID = '' ) ) ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
    let testCaseNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      testCaseNavigationStepQuery,
      input
    );
    queryListMap.push(
      testCaseNavigationStepQueryObject(
        [...new Set(testCaseNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
          .map((uuid) => `'${uuid}'`)
          .join(', ')
      )
    );
    testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseNavigationStepQueryData);
    let testCaseFunctionStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', TEST_CASE_FUNCTION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcfs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, TEST_CASE_FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfs.TEST_CASE_FUNCTION_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE tc, TEST_SET ts, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND tcs.TEST_SET_UUID in(${testSetID}) AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE = :AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'COMMITTED' AND ( ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' or tcfs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NOT NULL and vns.FUNCTION_STEP_UUID != '' and vns.FUNCTION_UUID IS NOT NULL and vns.FUNCTION_UUID != '' ) ) ) ORDER BY TEST_CASE_STEP_ID, TEST_CASE_FUNCTION_STEP_ID ASC`;
    let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      testCaseFunctionStepQuery,
      input
    );
    queryListMap.push(
      testCaseFunctionStepQueryObject(
        [...new Set(testCaseFunctionStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
          .map((uuid) => `'${uuid}'`)
          .join(', ')
      )
    );
    testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionStepQueryData);
    let testCaseFunctionNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ), ' Page - ', 'Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2,CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns, PAGE_VIEW v, TEST_CASE_FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcs.TEST_SET_UUID in(${testSetID}) AND tcfs.CURRENT_PAGE_CONTEXT = v.PAGE_UUID AND v.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tc.TEST_CASE_EXECUTON_TYPE = :AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'COMMITTED' AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and ( vns.FUNCTION_STEP_UUID IS NOT NULL and vns.FUNCTION_STEP_UUID != '' ) and ( vns.FUNCTION_UUID IS NOT NULL and vns.FUNCTION_UUID != '' ) ) ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
    let testCaseFunctionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      testCaseFunctionNavigationStepQuery,
      input
    );
    queryListMap.push(
      testCaseFunctionNavigationStepQueryObject(
        [
          ...new Set(
            testCaseFunctionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID)
          ),
        ]
          .map((uuid) => `'${uuid}'`)
          .join(', ')
      )
    );
    testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionNavigationStepQueryData);
    let testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND tcfs.TEST_CASE_FUNCTION_STEP_UUID = tcfuegs.TEST_CASE_FUNCTION_STEP_UUID AND tcs.TEST_SET_UUID in(${testSetID}) AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'COMMITTED' ORDER BY TEST_CASE_STEP_ID asc, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
    let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      testCaseFunctionUIElementGroupStepQuery,
      input
    );
    queryListMap.push(
      testCaseFunctionUIElementGroupStepQueryObject(
        [
          ...new Set(
            testCaseFunctionUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID)
          ),
        ]
          .map((uuid) => `'${uuid}'`)
          .join(', ')
      )
    );
    testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionUIElementGroupStepQueryData);
    let testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_UI_ELEMENT_GROUP_STEP_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE,'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcuegs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND tcs.TEST_SET_UUID in(${testSetID}) AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' AND tc.TEST_CASE_EXECUTON_TYPE=:AUTOMATION_TYPE AND tc.TEST_CASE_STATUS = 'COMMITTED' ORDER BY TEST_CASE_STEP_ID, TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
    let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      testCaseUIElementGroupStepQuery,
      input
    );
    queryListMap.push(
      testCaseUIElementGroupStepQueryObject(
        [...new Set(testCaseUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
          .map((uuid) => `'${uuid}'`)
          .join(', ')
      )
    );
    testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseUIElementGroupStepQueryData);
    let attributeIds = '';
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
      for (let data of testCaseStepNormalQueryData) {
        let inc = 0;
        if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Automated') {
          let inputStepType =
            data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data'
              ? 'Given'
              : data['Test Case Step Type'];
          data['Test Case Step Type'] = inputStepType;
          let stepDefAttributeQueryData = getStepAttributeData(
            stepDefAttributeQueryDataList,
            data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']
          );
          let stepDefTemplateVerbiageQueryData = getStepVerbiageData(
            stepDefTemplateVerbiageQueryDataList,
            data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']
          );
          let stepDefTemplateVerbiageName =
            stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length
              ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME']
              : '';
          data['Step Definition Template'] = stepDefTemplateVerbiageName;
          if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
            let attributeValueQueryData = getChildAttributeData(
              attributeDataObject.attributeValueQueryDataEntries,
              data.PRIMARY_COLUMN_VALUE,
              data.PRIMARY_COLUMN_NAME
            );
            let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
            let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
            for (let codeDesc of stepDefAttributeQueryData) {
              let getAttr = '';
              switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
                case '57b76ab3-8112-4343-af0f-49643c808bf7':
                  {
                    let pageName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let uiElementName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<UI Element Name>',
                        function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                          return `'` + Datawithbackslash + `'`;
                        }
                      );
                    }
                  }
                  break;
                case '7f855066-ad39-4325-8108-30befb2447e6':
                  {
                    let uiElementTypeQueryData = getUIElementType(
                      uiElementDataList,
                      uiElementTypeQueryDataList,
                      actualUIElementUUID
                    );
                    if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                      getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<UI Element Type>',
                        function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                          return `'` + Datawithbackslash + `'`;
                        }
                      );
                    }
                  }
                  break;
                case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                  {
                    let uiElementValue = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    if (uiElementValue) {
                      getAttr = replaceKeyword(uiElementValue);
                    }
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
                    let keyNameInKeyPad = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    if (keyNameInKeyPad) {
                      getAttr = replaceKeyword(keyNameInKeyPad);
                    }
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Key Name in Keypad>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
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
                  let confirmUIElementValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  if (confirmUIElementValue) {
                    getAttr = replaceKeyword(confirmUIElementValue);
                  }
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
                    let functionName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                    if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                      getAttr = functionNameQueryData['FUNCTION_ID'] + `:-:` + functionNameQueryData['FUNCTION_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<Function Name>',
                        function () {
                          let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                          return `'` + Datawithbackslash + `'`;
                        }
                      );
                    }
                  }
                  break;
                case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                  {
                    let uiElementName1 = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<UI Element Name 1>',
                        function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                          return `'` + Datawithbackslash + `'`;
                        }
                      );
                    }
                  }
                  break;
                case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                  {
                    let uiElementValue1 = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let userActionName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<User Action Name>',
                        function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                          return `'` + Datawithbackslash + `'`;
                        }
                      );
                    }
                  }
                  break;
                case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                  {
                    let uiElementTypeQueryData = getUIElementType(
                      uiElementDataList,
                      uiElementTypeQueryDataList,
                      actualUIElementUUID
                    );
                    if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                      getAttr = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<User Action Type>',
                        function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                          return `'` + Datawithbackslash + `'`;
                        }
                      );
                    }
                  }
                  break;
                case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                  {
                    let uiElementGroupName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let uiElementGroupStepQueryData = getUIElementGroupDetails(
                      uiElementGroupQueryDataList,
                      uiElementGroupName
                    );
                    if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                      getAttr =
                        uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'] +
                        `:-:` +
                        uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<UI Element Group Name>',
                        function () {
                          let Datawithbackslash = escapeSingleQuote(
                            uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']
                          );
                          return `'` + Datawithbackslash + `'`;
                        }
                      );
                    }
                  }
                  break;
                case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                  {
                    let pageNumber = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let dataKey = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let dataValue = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let fileName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let downloadParserName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let apiName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let apiAttributeName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                    if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                      getAttr =
                        apiAttributeQueryData['API_ATTRIBUTE_ID'] + `:-:` + apiAttributeQueryData['ATTRIBUTE_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<API Attribute Name>',
                        function () {
                          let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                          return `'` + Datawithbackslash + `'`;
                        }
                      );
                    }
                  }
                  break;
                case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                  {
                    let apiAttributeValue = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    if (apiAttributeValue) {
                      getAttr = replaceKeyword(apiAttributeValue);
                    }
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
                    let responseStatusCode = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let pageName1 = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let pageNewQueryData = getPageDetails(pageQueryDataList, pageName1);
                    if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                      getAttr = pageNewQueryData['PAGE_ID'] + `:-:` + pageNewQueryData['PAGE_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<Page Name 1>',
                        function () {
                          let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                          return `'` + Datawithbackslash + `'`;
                        }
                      );
                    }
                  }
                  break;
                case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
                  {
                    let uiElementState = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let timeOot = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let testSetScope = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let functionIds = getFunctionDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']
                    );
                    if (functionIds) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                        'PRIMARYSPRINGFM',
                        functionQuery,
                        input
                      );
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
                    let testCaseScope = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let functionIds = getFunctionDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']
                    );
                    if (functionIds) {
                      let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                      let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                        'PRIMARYSPRINGFM',
                        functionQuery,
                        input
                      );
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
                  let timeInterval = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let attempts = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                    let uiElementName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<Column Header>',
                        function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                          return `'` + Datawithbackslash + `'`;
                        }
                      );
                    }
                  }
                  break;
                case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                  let cellValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let rowNumber = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                    let uiElementName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let uiElementName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      getAttr = uiElementQueryData['UI_ELEMENT_ID'] + `:-:` + uiElementQueryData['UI_ELEMENT_NAME'];
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<Column Header 1>',
                        function () {
                          let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                          return `'` + Datawithbackslash + `'`;
                        }
                      );
                    }
                  }
                  break;
                case 'ba1ef281-412a-4544-b615-7767b06eb489':
                  let cellValue1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let columnNumber = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                    let fileFullPath = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
          delete data['API_UUID'];
          delete data['TEST_CASE_EXECUTON_TYPE'];
          delete data['PLAYWRITE_STEP_CODE'];
          delete data['CHILD_ATTRIBUTE_TABLE_NAME'];
          delete data['CHILD_ATTRIBUTE_DATA'];
          delete data['PRIMARY_COLUMN_NAME'];
          delete data['PRIMARY_COLUMN_VALUE'];
          delete data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
        } else if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Recorded') {
          let inputStepType =
            data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data'
              ? 'Given'
              : data['Test Case Step Type'];
          data['Test Case Step Type'] = inputStepType;
          data['Step Definition Template'] = data['PLAYWRITE_STEP_CODE'];
          if (data['API_UUID']) {
            apiList.push(data['API_UUID']);
          }
          delete data['API_UUID'];
          delete data['TEST_CASE_EXECUTON_TYPE'];
          delete data['PLAYWRITE_STEP_CODE'];
          delete data['CHILD_ATTRIBUTE_TABLE_NAME'];
          delete data['CHILD_ATTRIBUTE_DATA'];
          delete data['PRIMARY_COLUMN_NAME'];
          delete data['PRIMARY_COLUMN_VALUE'];
          delete data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
        }
      }
    }
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
    let originalList = generateExcelData(testCaseStepNormalQueryData);
    let dupList = [];
    let index = 0;
    if (originalList && originalList.length) {
      if (originalList[0].length) {
        let firstvalue = originalList[0][1];
        for (let i = 0; i < originalList.length; i++) {
          if (firstvalue == originalList[i][1]) {
            let mng = originalList[i];
            index = index + 1;
            originalList[i][3] = index;
            dupList.push(mng);
          } else {
            firstvalue = originalList[i][1];
            let mng = originalList[i];
            index = 1;
            originalList[i][3] = index;
            dupList.push(mng);
          }
        }
      }
    }
    testCaseStepTabList.push(...dupList);
    let currentPageIds = '';
    if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
      currentPageIds = testCaseStepNormalQueryData
        .map((item) => item['Page ID'])
        .filter((id) => id !== undefined && id !== null && id !== '')
        .map((id) => `'` + id + `'`)
        .join(',');
    }
    let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID' FROM PAGE WHERE PAGE_UUID in(${
      attributeIds ? attributeIds : `''`
    }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
    let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
    ConcatinateURL(pageNewQueryData);
    if (pageNewQueryData && pageNewQueryData.length) {
      pageTabList.push(...pageNewQueryData);
    }
    let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
    let uiElementQuery = `SELECT PAGE_ID as 'Page ID', UI_ELEMENT_ID as 'UI ELement ID',UI_ELEMENT_NAME as 'UI Element Name',(SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID=UI_ELEMENT.UI_ELEMENT_TYPE) as 'Element Type',LOCATOR_TYPE as 'Locator Type', LOCATOR_VALUE as 'Locator Value',CASE WHEN (IFNULL(IS_PAGE_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_IDENTIFIER END AS 'Is Page Identifier','Active' as Status, 'No Action' as Actions, EVENT_NAME as 'Event Name',UI_ELEMENT_UUID as 'UI Element UUID' FROM UI_ELEMENT ,PAGE WHERE PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID and UI_ELEMENT.PAGE_NEW_UUID in(${
      pageList ? pageList : `''`
    }) AND UI_ELEMENT.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by UI_ELEMENT_ID asc`;
    let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      uiElementQuery,
      input
    );
    if (uiElementQueryData && uiElementQueryData.length) {
      uiElementTabList.push(...uiElementQueryData);
    }
    let currentApiIds = '';
    if (apiList && apiList.length) {
      currentApiIds = apiList.map((item) => `'` + item + `'`).join(',');
    }
    let apiQuery = `SELECT distinct API_ID as 'API ID',API_NAME as 'API Name',API_URL as 'API URL',API_HEADER as 'API Header',API_AUTH as 'API Auth','Active' as 'status','No Action' as actions,API_UUID as 'API UUID' FROM API_NEW WHERE API_UUID in(${
      currentApiIds ? currentApiIds : `''`
    }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by API_ID asc`;
    let apiQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
    if (apiQueryData && apiQueryData.length) {
      apiTabList.push(...apiQueryData);
    }
    let apiAttributeQuery = `SELECT API_ID as 'API ID',API_ATTRIBUTE_ID as 'API Attribute ID',ATTRIBUTE_NAME as 'Attribute Name',ATTRIBUTE_TYPE as 'Attribute Type',ATTRIBUTE_LOCATOR_TYPE as 'Attribute Locator Type',ATTRIBUTE_LOCATOR_VALUE as 'Attribute Locator Value','Active' as status, 'No Action' as actions,API_ATTRIBUTE_UUID as 'API Attribute UUID' FROM API_ATTRIBUTE ,API_NEW WHERE API_NEW.API_UUID = API_ATTRIBUTE.API_UUID and API_ATTRIBUTE.API_UUID in(${
      currentApiIds ? currentApiIds : `''`
    }) order by API_ATTRIBUTE_ID asc`;
    let apiAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      apiAttributeQuery,
      input
    );
    if (apiAttributeQueryData && apiAttributeQueryData.length) {
      apiAttributeTabList.push(...apiAttributeQueryData);
    }
  }
  let filteredPageData = Object.values(
    pageTabList.reduce((acc, cur) => Object.assign(acc, { [cur['Page ID']]: cur }), {})
  );
  let filteredUIElementGroupData = Object.values(
    uiElementTabList.reduce((acc, cur) => Object.assign(acc, { [cur['UI ELement ID']]: cur }), {})
  );
  if (filteredUIElementGroupData && filteredUIElementGroupData.length) {
    filteredUIElementGroupData.sort((a, b) => {
      let afield1 = a['Page ID'];
      let bfield1 = b['Page ID'];
      let afield2 = a['UI ELement ID'];
      let bfield2 = b['UI ELement ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  let filteredAPIData = Object.values(
    apiTabList.reduce((acc, cur) => Object.assign(acc, { [cur['API ID']]: cur }), {})
  );
  let filteredAPIAttributeData = Object.values(
    apiAttributeTabList.reduce((acc, cur) => Object.assign(acc, { [cur['API Attribute ID']]: cur }), {})
  );
  if (filteredAPIAttributeData && filteredAPIAttributeData.length) {
    filteredAPIAttributeData.sort((a, b) => {
      let afield1 = a['API ID'];
      let bfield1 = b['API ID'];
      let afield2 = a['API Attribute ID'];
      let bfield2 = b['API Attribute ID'];
      return (afield1 && bfield1 && afield1 - bfield1) || (afield2 && bfield2 && afield2 - bfield2);
    });
  }
  objectData['Test Set'] = testSetTabList;
  objectData['Test Case'] = testCaseTabList;
  objectData['Test Case Step'] = testCaseStepTabList;
  objectData['Page'] = generateExcelData(filteredPageData);
  objectData['UI Element'] = generateExcelData(filteredUIElementGroupData);
  objectData['API'] = generateExcelData(filteredAPIData);
  objectData['API Attribute'] = generateExcelData(filteredAPIAttributeData);
  Object.assign(msg.payload.documentData, objectData);
  msg.payload.result.message = 'Document Downloaded';
  if (input['AUTOMATION_TYPE'] == 'Recorded') {
    msg.payload.templateFile = 'Feature_Management_Recorded_Test_Case_Template.xlsm';
  } else {
    msg.payload.templateFile = 'Feature_Management_Test_Suite_Template.xlsm';
  }
  node.send(msg);
} else if (
  input.APPLICATION_ENVIRONMENT_BASE_URL &&
  input.VIEW_UUID &&
  input.PAGE_UUID &&
  input.VIEW_NAME &&
  input.GRID_NAME == 'View Navigation Step By View Navigation'
) {
  msg.payload.result = {};
  let versionIdquery = `SELECT MASTER_CODE_VERSION_ID FROM AUTOMATION_CODE_VERSION WHERE VERSION_STATUS='Active' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let versionIdqueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', versionIdquery, input);
  let versionMaster =
    versionIdqueryData && versionIdqueryData.length ? versionIdqueryData[0]['MASTER_CODE_VERSION_ID'] : null;
  input['MASTER_CODE_VERSION_ID'] = versionMaster;
  let functionalAreaQuery = `SELECT FUNCTIONAL_AREA_ID as 'App ID',FUNCTIONAL_AREA_NAME as 'App Name','Active' as Status, 'No Action' as Actions,FUNCTIONAL_AREA_UUID as 'App UUID', :APP_LOGGED_IN_USER_ID as 'User UUID',:MASTER_CODE_VERSION_ID as 'Version Number' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    functionalAreaQuery,
    input
  );
  msg.payload.documentData = {};
  let objectData = {};
  objectData['Application'] = generateExcelData(functionalAreaQueryData);
  let testSetQuery = `SELECT PAGE_ID as 'Test Set ID',PAGE_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,PAGE_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM PAGE,FUNCTIONAL_AREA WHERE PAGE_UUID=:PAGE_UUID AND PAGE.FUNCTIONAL_AREA_UUID=FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
  let maxLength = 200;
  let documentName = testSetQueryData[0]['Test Set Name']
    ? testSetQueryData[0]['Test Set Name'].replaceAll(/[^A-Z0-9-]+/gi, '_')
    : 'GeneratedFunction';
  msg.payload.result.documentName =
    documentName && documentName.length > maxLength ? documentName.substring(0, maxLength) : documentName;
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetQueryData = JSON.parse(JSON.stringify(testSetQueryData));
    testSetQueryData = testSetQueryData.map((testSet) => {
      return { ...testSet, 'Test Set Name': testSet['Test Set Name'].substring(0, 200) };
    });
  }
  objectData['Test Set'] = generateExcelData(testSetQueryData);
  let functionQuery = `SELECT PAGE_ID as 'Test Set ID',PAGE_ID as 'Test Case ID','1' as 'Test Case Seq ID',PAGE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,PAGE_UUID as 'Test Case UUID' FROM PAGE,FUNCTIONAL_AREA WHERE PAGE_UUID=:PAGE_UUID AND PAGE.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let functionQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
  objectData['Test Case'] = generateExcelData(functionQueryData);
  let functionStepNormalQuery = `SELECT PAGE_ID as 'Test Set ID', VIEW_ID as 'Test Case ID', VIEW_NAVIGATION_STEP_ID as 'Test Case Step ID', VIEW_NAVIGATION_STEP_SEQ_ID as 'Test Case Step Seq ID', VIEW_NAVIGATION_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, '' as 'Test Case Sep Group Name', '' as reserved2, CASE WHEN vns.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = vns.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' as Status, VIEW_NAVIGATION_STEP_UUID as 'Test Case Step UUID', 'VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW vn, PAGE p WHERE vn.VIEW_UUID = vns.VIEW_UUID AND vn.PAGE_UUID = p.PAGE_UUID AND vns.FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND vn.PAGE_UUID =:PAGE_UUID AND vn.VIEW_UUID =:VIEW_UUID ORDER BY VIEW_NAVIGATION_STEP_ID, VIEW_NAVIGATION_STEP_SEQ_ID asc`;
  let functionStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    functionStepNormalQuery,
    input
  );
  queryListMap.push(
    viewNavigationStepQueryObject(
      [...new Set(functionStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))]
        .map((uuid) => `'${uuid}'`)
        .join(', ')
    )
  );
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
      if (data && Object.keys(data).length) {
        let inputStepType = data['Test Case Step Type'];
        let stepDefAttributeQueryData = getStepAttributeData(
          stepDefAttributeQueryDataList,
          data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']
        );
        let stepDefTemplateVerbiageQueryData = getStepVerbiageData(
          stepDefTemplateVerbiageQueryDataList,
          data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']
        );
        let stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length
            ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME']
            : '';
        data['Step Definition Template'] = stepDefTemplateVerbiageName;
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
          let attributeValueQueryData = getChildAttributeData(
            attributeDataObject.attributeValueQueryDataEntries,
            data.PRIMARY_COLUMN_VALUE,
            data.PRIMARY_COLUMN_NAME
          );
          let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
          let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
          for (let codeDesc of stepDefAttributeQueryData) {
            let id = '';
            let name = '';
            switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
              case '57b76ab3-8112-4343-af0f-49643c808bf7':
                {
                  let pageName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let pageNewQueryData = getPageDetails(pageQueryDataList, pageName);
                  if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                    id = pageNewQueryData['PAGE_ID'];
                    name = pageNewQueryData['PAGE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(pageNewQueryData['PAGE_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
                {
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    id = uiElementQueryData['UI_ELEMENT_ID'];
                    name = uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '7f855066-ad39-4325-8108-30befb2447e6':
                {
                  let uiElementTypeQueryData = getUIElementType(
                    uiElementDataList,
                    uiElementTypeQueryDataList,
                    actualUIElementUUID
                  );
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    name = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Type>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
                {
                  let uiElementValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = uiElementValue;
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
                  let keyNameInKeyPad = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = keyNameInKeyPad;
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Key Name in Keypad>',
                    function () {
                      let Datawithbackslash = escapeSingleQuote(keyNameInKeyPad);
                      return `'` + Datawithbackslash + `'`;
                    }
                  );
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
                let confirmUIElementValue = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
                name = confirmUIElementValue;
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
                  let functionName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                  if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                    id = functionNameQueryData['FUNCTION_ID'];
                    name = functionNameQueryData['FUNCTION_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Function Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(functionNameQueryData['FUNCTION_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementName1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    id = uiElementQueryData['UI_ELEMENT_ID'];
                    name = uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Name 1>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
                {
                  let uiElementValue1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = uiElementValue1;
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
                  let userActionName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    id = uiElementQueryData['UI_ELEMENT_ID'];
                    name = uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<User Action Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
                {
                  let uiElementTypeQueryData = getUIElementType(
                    uiElementDataList,
                    uiElementTypeQueryDataList,
                    actualUIElementUUID
                  );
                  if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                    name = uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<User Action Type>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
                {
                  let uiElementGroupName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementGroupStepQueryData = getUIElementGroupDetails(
                    uiElementGroupQueryDataList,
                    uiElementGroupName
                  );
                  if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                    id = uiElementGroupStepQueryData['UI_ELEMENT_GROUP_ID'];
                    name = uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Group Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
                {
                  let pageNumber = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = pageNumber;
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
                  let dataKey = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = dataKey;
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
                  let dataValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = dataValue;
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
                  let fileName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = fileName;
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
                  let downloadParserName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = downloadParserName;
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
                  let apiName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let apiQueryData = getApiDetails(apiQueryDataList, apiName);
                  if (apiQueryData && Object.keys(apiQueryData).length) {
                    id = apiQueryData['API_ID'];
                    name = apiQueryData['API_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(apiQueryData['API_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '46136260-2e33-11ef-b3ef-e52f192c3af0':
                {
                  let apiAttributeName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                  if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                    id = apiAttributeQueryData['API_ATTRIBUTE_ID'];
                    name = apiAttributeQueryData['ATTRIBUTE_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<API Attribute Name>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(apiAttributeQueryData['ATTRIBUTE_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
                {
                  let apiAttributeValue = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = apiAttributeValue;
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
                  let responseStatusCode = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = responseStatusCode;
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
                  let pageName1 = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
                  let uiElementState = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = uiElementState;
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
                  let timeOot = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  name = timeOot;
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
                  let testSetScope = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let functionIds = getFunctionDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']
                  );
                  if (functionIds) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                      'PRIMARYSPRINGFM',
                      functionQuery,
                      input
                    );
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
                  let testCaseScope = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let functionIds = getFunctionDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']
                  );
                  if (functionIds) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                      'PRIMARYSPRINGFM',
                      functionQuery,
                      input
                    );
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
                let timeInterval = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let attempts = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    id = uiElementQueryData['UI_ELEMENT_ID'];
                    name = uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Column Header>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case '75b16425-1531-4cee-8c09-30f5be70c4b0':
                let cellValue = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let rowNumber = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    id = uiElementQueryData['UI_ELEMENT_ID'];
                    name = uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Table Name>', function () {
                      let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                      return `'` + Datawithbackslash + `'`;
                    });
                  }
                }
                break;
              case '078e6534-f38f-4aad-b89d-cad8216ad86b':
                {
                  let uiElementName = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
                  let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                  if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                    id = uiElementQueryData['UI_ELEMENT_ID'];
                    name = uiElementQueryData['UI_ELEMENT_NAME'];
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Column Header 1>',
                      function () {
                        let Datawithbackslash = escapeSingleQuote(uiElementQueryData['UI_ELEMENT_NAME']);
                        return `'` + Datawithbackslash + `'`;
                      }
                    );
                  }
                }
                break;
              case 'ba1ef281-412a-4544-b615-7767b06eb489':
                let cellValue1 = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                let columnNumber = getDataFromAttributeValue(
                  attributeValueQueryData,
                  codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  data['CHILD_ATTRIBUTE_DATA']
                );
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
                  let fileFullPath = getDataFromAttributeValue(
                    attributeValueQueryData,
                    codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    data['CHILD_ATTRIBUTE_DATA']
                  );
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
            data[valueColumnName] = id ? id + `:-:` + name : name;
          }
        }
        let getKeywordByStepType = inputStepType ? inputStepType + ' ' : '';
        data['Test Case Step Name'] = getKeywordByStepType + stepDefTemplateVerbiageName;
        delete data['CHILD_ATTRIBUTE_TABLE_NAME'];
        delete data['CHILD_ATTRIBUTE_DATA'];
        delete data['PRIMARY_COLUMN_NAME'];
        delete data['PRIMARY_COLUMN_VALUE'];
        delete data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
      }
    }
    functionStepNormalQueryData.sort((a, b) => {
      let afield1 = a['Test Case ID'];
      let bfield1 = b['Test Case ID'];
      let adata = a['Test Case Step ID'].toString().split('-');
      let bdata = b['Test Case Step ID'].toString().split('-');
      let afield2 = a['Test Case Step Seq ID'];
      let bfield2 = b['Test Case Step Seq ID'];
      let afield3 = adata[1];
      let bfield3 = bdata[1];
      let afield4 = adata[2];
      let bfield4 = bdata[2];
      return (
        (afield1 && bfield1 && afield1 - bfield1) ||
        (afield2 && bfield2 && afield2 - bfield2) ||
        (afield3 && bfield3 && afield3 - bfield3) ||
        (afield4 && bfield4 && afield4 - bfield4)
      );
    });
  }
  let originalList = generateExcelData(functionStepNormalQueryData);
  let dupList = [];
  let index = 0;
  if (originalList && originalList.length) {
    if (originalList[0].length) {
      let firstvalue = originalList[0][1];
      for (let i = 0; i < originalList.length; i++) {
        if (firstvalue == originalList[i][1]) {
          let mng = originalList[i];
          index = index + 1;
          originalList[i][2] = originalList[i][2] ? originalList[i][2] : index;
          originalList[i][3] = index;
          dupList.push(mng);
        } else {
          firstvalue = originalList[i][1];
          let mng = originalList[i];
          index = 1;
          originalList[i][2] = originalList[i][2] ? originalList[i][2] : index;
          originalList[i][3] = index;
          dupList.push(mng);
        }
      }
    }
  }
  objectData['Test Case Step'] = dupList;
  let currentPageIds = '';
  if (functionStepNormalQueryData && functionStepNormalQueryData.length) {
    currentPageIds = functionStepNormalQueryData
      .map((item) => item['Page ID'])
      .filter((id) => id !== undefined && id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',PAGE_ACCESS_RELATIVE_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID' FROM PAGE WHERE PAGE_UUID in(${
    attributeIds ? attributeIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNewQuery, input);
  ConcatinateURL(pageNewQueryData);
  objectData['Page'] = generateExcelData(pageNewQueryData);
  let pageList = pageNewQueryData.map((item) => `'` + item['Page UUID'] + `'`).join(',');
  let uiElementQuery = `SELECT PAGE.PAGE_ID AS 'Page ID', UI_ELEMENT.UI_ELEMENT_ID AS 'UI Element ID', UI_ELEMENT.UI_ELEMENT_NAME AS 'UI Element Name', (SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID = UI_ELEMENT.UI_ELEMENT_TYPE) AS 'Element Type', UI_ELEMENT.LOCATOR_TYPE AS 'Locator Type', UI_ELEMENT.LOCATOR_VALUE AS 'Locator Value', CASE WHEN (IFNULL(UI_ELEMENT.IS_PAGE_IDENTIFIER, '') = '') THEN 'No' ELSE UI_ELEMENT.IS_PAGE_IDENTIFIER END AS 'Is Page Identifier', 'Active' AS Status, 'No Action' AS Actions, UI_ELEMENT.EVENT_NAME AS 'Event Name', UI_ELEMENT.UI_ELEMENT_UUID AS 'UI Element UUID' FROM UI_ELEMENT JOIN PAGE ON PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID WHERE UI_ELEMENT.PAGE_NEW_UUID IN (${
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
  objectData['UI Element'] = generateExcelData(uiElementQueryData);
  Object.assign(msg.payload.documentData, objectData);
  msg.payload.result.message = 'Document Downloaded';
  msg.payload.templateFile = 'Feature_Management_Test_Case_Template.xlsm';
  node.send(msg);
}
