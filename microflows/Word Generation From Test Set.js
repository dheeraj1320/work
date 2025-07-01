debugger;
function escapeSingleQuote(inpt) {
  return inpt;
}
AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
let input = msg.payload.apiRequestBody.baseEntity?.records[0] ? msg.payload.apiRequestBody.baseEntity?.records[0] : msg.payload.apiRequestBody;
input = Object.assign(input, msg.payload.referenceData);
const stepDefAttributeQueryList = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
let stepDefAttributeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefAttributeQueryList, input);
const stepDefTemplateVerbiageQueryList = `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE`;
let stepDefTemplateVerbiageQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, stepDefTemplateVerbiageQueryList, input);
const uiElementTypeQuery = `SELECT * FROM UI_ELEMENT_TYPE_MASTER`;
let uiElementTypeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, uiElementTypeQuery, input);
async function getAllRequirementSet(req, reqSets) {
  if (req['PARENT_REQUIREMENT_SET_UUID']) {
    let reqSetQuery = `Select REQUIREMENT_SET_UUID,REQUIREMENT_SET_ID,REQUIREMENT_SET_NAME, PARENT_REQUIREMENT_SET_UUID From REQUIREMENT_SET where REQUIREMENT_SET_UUID = '${req['PARENT_REQUIREMENT_SET_UUID']}'`;
    let reqSetData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', reqSetQuery, input);
    reqSets.push(reqSetData);
    if (reqSetData['PARENT_REQUIREMENT_SET_UUID']) {
      await getAllRequirementSet(reqSetData, reqSets);
    }
  }
}
function getFunctionDataFromAttributeValue(attributeValueQueryData, stepDefArrributeId) {
  let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
  if (result && result.length) {
    return result[0]['FUNCTION_UUID'];
  } else {
    return '';
  }
}
function getDataFromAttributeValue(attributeValueQueryData, stepDefArrributeId, attributeData) {
  let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
  if (result && result.length) {
    return result[0][attributeData] ? result[0][attributeData] : '';
  } else {
    return '';
  }
}
async function formatRequirements(data, showLinked) {
  const seenTitles = new Set();
  const seenSubTitles = new Set();
  const seenRequirements = new Set();
  for (let req of data) {
    let reqSets = [];
    if (req['PARENT_REQUIREMENT_SET_UUID']) {
      await getAllRequirementSet(req, reqSets);
      reqSets.forEach((item, index) => {
        req[`Requirement Sub-Title`] = item.REQUIREMENT_SET_NAME + ' >> ' + req[`Requirement Sub-Title`];
      });
    }
  }
  return data.flatMap((req) => {
    const result = [];
    let startIndentIndex = 0;
    if (req['Requirement Title'] && !seenTitles.has(req['REQUIREMENT_TITLE_UUID'])) {
      result.push(req['Requirement Title']);
      seenTitles.add(req['REQUIREMENT_TITLE_UUID']);
      startIndentIndex = 0;
    } else {
      startIndentIndex = 1;
    }
    if (req['Requirement Sub-Title'] && !seenSubTitles.has(req['REQUIREMENT_SET_UUID'])) {
      result.push('$$' + req['Requirement Sub-Title']);
      seenSubTitles.add(req['REQUIREMENT_SET_UUID']);
    } else if (req['Requirement Sub-Title']) {
      startIndentIndex = Math.max(startIndentIndex, 2);
    }
    if (req.Requirement && !seenRequirements.has(req.Requirement)) {
      result.push('$$' + req.Requirement + (req.TestCaseID && showLinked ? ' - (Linked ' + req['TestCaseID'] + ')' : ''));
      seenRequirements.add(req.Requirement);
    }
    if (req['Condition Of Satisfaction/Acceptance Criteria']) {
      result.push('$$' + req['Condition Of Satisfaction/Acceptance Criteria']);
    }
    return result.map((item, index) => {
      const adjustedIndex = startIndentIndex + index;
      const spaces = ' '.repeat(adjustedIndex * 6);
      return item.replace('$$', spaces);
    });
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
  object['PRIMARY_COLUMN_NAME'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA';
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
  object['PRIMARY_COLUMN_NAME'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID';
  object['CHILD_ATTRIBUTE_TABLE_NAME'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE';
  object['CHILD_ATTRIBUTE_DATA'] = 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA';
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
async function getAttributeValueDetails(attributeId, type) {
  let query = `SELECT '' AS ID, '' AS NAME,'Test Case' as SOURCE_TYPE,'' AS STEP_DEFINITION_ATTRIBUTE_UUID`;
  if (
    [
      'TEST_CASE_STEP_ATTRIBUTE_DATA',
      'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA',
      'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA',
      'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA',
      'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'
    ].includes(type)
  ) {
    query = `SELECT TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_STEP_ATTRIBUTE_DATA AS NAME,'Test Case' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}' UNION SELECT TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA AS NAME,'Function' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}'`;
  } else if (['FUNCTION_STEP_ATTRIBUTE_DATA', 'FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA', 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'].includes(type)) {
    query = `SELECT FUNCTION_STEP_ATTRIBUTE_VALUE_UUID AS ID, FUNCTION_STEP_ATTRIBUTE_DATA AS NAME, 'Test Case' as SOURCE_TYPE, STEP_DEFINITION_ATTRIBUTE_UUID FROM FUNCTION_STEP_ATTRIBUTE_VALUE WHERE FUNCTION_STEP_ATTRIBUTE_VALUE_UUID = '${attributeId}'`;
  }
  let res = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', query, input);
  return res && res.length ? res[0] : '';
}
let queryListMap = [];
msg.payload.result = {};
msg.payload.documentData = { documentHeader: '', documentDetails: [] };
msg.payload.result.documentName = input.TEST_SET_NAME ? input.TEST_SET_ID + ' - ' + input.TEST_SET_NAME + '_Test_Set' : 'GeneratedTestCase';
let headerThreeMap = {};
headerThreeMap['Header'] = '3. Test Cases';
headerThreeMap['ChildrenMapList'] = [];
const paramsPattern = /[^{}]+(?=})/g;
let testSetQuery = `SELECT * FROM TEST_SET WHERE TEST_SET_UUID=:TEST_SET_UUID AND TEST_SET.FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
let testSetQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
let testCaseQuery;
if (input.GRID_NAME === 'User Story Test Set') {
  testCaseQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_SEQ_ID as 'Test Case Seq ID',TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,TEST_CASE_UUID as 'Test Case UUID', TEST_CASE_EXECUTON_TYPE as 'Test Case Execution Type' FROM TEST_CASE,TEST_SET WHERE TEST_CASE.USER_STORY_UUID LIKE CONCAT('%', :USER_STORY_UUID, '%') AND TEST_SET.USER_STORY_UUID = :USER_STORY_UUID order by TEST_CASE_SEQ_ID asc`;
} else {
  testCaseQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_SEQ_ID as 'Test Case Seq ID',TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,TEST_CASE_UUID as 'Test Case UUID', TEST_CASE_EXECUTON_TYPE as 'Test Case Execution Type' FROM TEST_CASE,TEST_SET WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID and TEST_CASE.TEST_SET_UUID=:TEST_SET_UUID and ( TEST_CASE.TEST_CASE_STATUS = 'COMMITTED' OR (TEST_CASE.TEST_CASE_STATUS = 'DRAFT' AND TEST_CASE.TEST_CASE_OWNER=:APP_LOGGED_IN_USER_ID) ) order by TEST_CASE_SEQ_ID asc`;
}
let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
let testCaseStepNormalQuery;
if (input.GRID_NAME === 'User Story Test Set') {
  testCaseStepNormalQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', tc.TEST_CASE_UUID AS 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID JOIN TEST_SET ts ON tc.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') WHERE ts.TEST_SET_UUID = :TEST_SET_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND ( (tcs.IS_PURE_NAVIGATION_STEP = 'No' OR tcs.IS_PURE_NAVIGATION_STEP IS NULL) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND ( vns.FUNCTION_STEP_UUID IS NULL OR vns.FUNCTION_STEP_UUID = '') AND (vns.FUNCTION_UUID IS NULL OR vns.FUNCTION_UUID = '' ) ) ) ) ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
} else {
  testCaseStepNormalQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', tc.TEST_CASE_UUID as 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' OR tcs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS(SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NULL or vns.FUNCTION_STEP_UUID = '' and vns.FUNCTION_UUID IS NULL or vns.FUNCTION_UUID = '' ) )) ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
}
debugger;
let testCaseStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepNormalQuery, input);
queryListMap.push(testCaseStepNormalQueryObject([...new Set(testCaseStepNormalQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
let testCaseNavigationStepQuery;
if (input.GRID_NAME === 'User Story Test Set') {
  testCaseNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT(tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', tc.TEST_CASE_UUID AS 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' AS PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns JOIN PAGE_VIEW vs ON vs.VIEW_UUID = vns.VIEW_UUID JOIN TEST_CASE_STEP tcs ON vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID JOIN TEST_SET ts ON tc.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') WHERE ts.TEST_SET_UUID = :TEST_SET_UUID AND tcs.CURRENT_PAGE_CONTEXT = vs.PAGE_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND EXISTS ( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns2 WHERE vns2.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND ( vns2.FUNCTION_STEP_UUID IS NULL OR vns2.FUNCTION_STEP_UUID = '' ) AND ( vns2.FUNCTION_UUID IS NULL OR vns2.FUNCTION_UUID = '' ) ) ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
} else {
  testCaseNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', tc.TEST_CASE_UUID as 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns, PAGE_VIEW vs, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.CURRENT_PAGE_CONTEXT = vs.PAGE_UUID AND vs.VIEW_UUID = vns.VIEW_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NULL or vns.FUNCTION_STEP_UUID = '' and vns.FUNCTION_UUID IS NULL or vns.FUNCTION_UUID = '' ) ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
}
let testCaseNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationStepQuery, input);
queryListMap.push(testCaseNavigationStepQueryObject([...new Set(testCaseNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseNavigationStepQueryData);
let testCaseFunctionStepQuery;
if (input.GRID_NAME === 'User Story Test Set') {
  testCaseFunctionStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT(tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.TEST_CASE_FUNCTION_STEP_SEQ_ID) AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcfs.TEST_CASE_FUNCTION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', tcfs.TEST_CASE_FUNCTION_STEP_UUID AS 'Test Case Step UUID', tc.TEST_CASE_UUID AS 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcfs.TEST_CASE_FUNCTION_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs JOIN TEST_CASE_FUNCTION_STEP tcfs ON tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID JOIN TEST_SET ts ON tc.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') WHERE ts.TEST_SET_UUID = :TEST_SET_UUID AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' OR tcfs.IS_PURE_NAVIGATION_STEP IS NULL OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS ( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND vns.FUNCTION_STEP_UUID IS NOT NULL AND vns.FUNCTION_STEP_UUID != '' AND vns.FUNCTION_UUID IS NOT NULL AND vns.FUNCTION_UUID != '' ) ) ) ORDER BY tcs.TEST_CASE_STEP_ID, tcfs.TEST_CASE_FUNCTION_STEP_ID ASC;`;
} else {
  testCaseFunctionStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_STEP_SEQ_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_FUNCTION_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', TEST_CASE_FUNCTION_STEP_UUID as 'Test Case Step UUID', tc.TEST_CASE_UUID as 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfs.TEST_CASE_FUNCTION_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and tcs.TEST_SET_UUID=:TEST_SET_UUID and tcs.IS_FUNCTION_STEP = 'Yes' and tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' and tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND ( ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' OR tcfs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NOT NULL and vns.FUNCTION_STEP_UUID != '' and vns.FUNCTION_UUID IS NOT NULL and vns.FUNCTION_UUID != '' ) ) ) ORDER BY TEST_CASE_STEP_ID, TEST_CASE_FUNCTION_STEP_ID asc`;
}
let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
queryListMap.push(testCaseFunctionStepQueryObject([...new Set(testCaseFunctionStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')));
testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionStepQueryData);
let testCaseFunctionNavigationStepQuery;
if (input.GRID_NAME === 'User Story Test Set') {
  testCaseFunctionNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', tc.TEST_CASE_UUID AS 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' AS PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns JOIN PAGE_VIEW pv ON pv.VIEW_UUID = vns.VIEW_UUID JOIN TEST_CASE_FUNCTION_STEP tcfs ON tcfs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID JOIN TEST_CASE_STEP tcs ON tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID JOIN TEST_SET ts ON tc.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') JOIN STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd ON vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID WHERE ts.TEST_SET_UUID = :TEST_SET_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND EXISTS ( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns2 WHERE vns2.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND vns2.FUNCTION_STEP_UUID IS NOT NULL AND vns2.FUNCTION_STEP_UUID != '' AND vns2.FUNCTION_UUID IS NOT NULL AND vns2.FUNCTION_UUID != '' ) ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
} else {
  testCaseFunctionNavigationStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', tc.TEST_CASE_UUID AS 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcs.TEST_SET_UUID=:TEST_SET_UUID AND tcfs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND EXISTS(SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NOT NULL and vns.FUNCTION_STEP_UUID != '' and vns.FUNCTION_UUID IS NOT NULL and vns.FUNCTION_UUID != '' ) ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
}
let testCaseFunctionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionNavigationStepQuery, input);
queryListMap.push(
  testCaseFunctionNavigationStepQueryObject([...new Set(testCaseFunctionNavigationStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
);
testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionNavigationStepQueryData);
let testCaseFunctionUIElementGroupStepQuery;
if (input.GRID_NAME === 'User Story Test Set') {
  testCaseFunctionUIElementGroupStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', tcfuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID ) AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcfuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', tcfuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID AS 'Test Case Step UUID', tc.TEST_CASE_UUID AS 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcfuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs JOIN TEST_CASE_FUNCTION_STEP tcfs ON tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID JOIN TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP tcfuegs ON tcfs.TEST_CASE_FUNCTION_STEP_UUID = tcfuegs.TEST_CASE_FUNCTION_STEP_UUID JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID JOIN TEST_SET ts ON tc.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') WHERE ts.TEST_SET_UUID = :TEST_SET_UUID AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY tcs.TEST_CASE_STEP_ID ASC, tcfuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID ASC;`;
} else {
  testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', tc.TEST_CASE_UUID as 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and tcfs.TEST_CASE_FUNCTION_STEP_UUID = tcfuegs.TEST_CASE_FUNCTION_STEP_UUID and tcs.TEST_SET_UUID=:TEST_SET_UUID and tcs.IS_FUNCTION_STEP = 'Yes' and tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID asc, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
}
let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input);
queryListMap.push(
  testCaseFunctionUIElementGroupStepQueryObject(
    [...new Set(testCaseFunctionUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ')
  )
);
testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionUIElementGroupStepQueryData);
let testCaseUIElementGroupStepQuery;
if (input.GRID_NAME === 'User Story Test Set') {
  testCaseUIElementGroupStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT(tcs.TEST_CASE_STEP_SEQ_ID, '-', tcuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_ID) AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', tcuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID AS 'Test Case Step UUID', tc.TEST_CASE_UUID AS 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' AS CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' AS CHILD_ATTRIBUTE_DATA, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID' AS PRIMARY_COLUMN_NAME, tcuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID AS PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs JOIN TEST_CASE_UI_ELEMENT_GROUP_STEP tcuegs ON tcuegs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID JOIN TEST_SET ts ON tc.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') WHERE ts.TEST_SET_UUID = :TEST_SET_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY tcs.TEST_CASE_STEP_ID, tcuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_ID ASC;`;
} else {
  testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_UI_ELEMENT_GROUP_STEP_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', tc.TEST_CASE_UUID as 'Test Case UUID', tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcuegs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and tcs.TEST_SET_UUID=:TEST_SET_UUID and tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID, TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
}
let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementGroupStepQuery, input);
queryListMap.push(
  testCaseUIElementGroupStepQueryObject([...new Set(testCaseUIElementGroupStepQueryData.map((item) => item.PRIMARY_COLUMN_VALUE).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', '))
);
testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseUIElementGroupStepQueryData);
if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
  let attributeDataObject = await fetchChildAttributeFromAttributeTable(queryListMap);
  let attributeIds = attributeDataObject.attrValues
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
    if (data && data['TEST_CASE_EXECUTON_TYPE'] != 'Recorded') {
      let inputStepType = data['Test Case Step Type'];
      let stepDefAttributeQueryData = getStepAttributeData(stepDefAttributeQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
      let stepDefTemplateVerbiageQueryData = getStepVerbiageData(stepDefTemplateVerbiageQueryDataList, data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']);
      let stepDefTemplateVerbiageName =
        stepDefTemplateVerbiageQueryData && Object.keys(stepDefTemplateVerbiageQueryData).length ? stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';
      data['Step Definition Template'] = stepDefTemplateVerbiageName;
      if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
        let attributeValueQueryData = getChildAttributeData(attributeDataObject.attributeValueQueryDataEntries, data.PRIMARY_COLUMN_VALUE, data.PRIMARY_COLUMN_NAME);
        let actualUIElementUUID = getUIElementData(stepDefAttributeQueryData, attributeValueQueryData, data);
        let actualColumnHeaderUUID = getColumnHeaderData(stepDefAttributeQueryData, attributeValueQueryData, data);
        let isDataElementNameTypePassword = false;
        let isDataElementName1TypePassword = false;
        for (let codeDesc of stepDefAttributeQueryData) {
          switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
            case '57b76ab3-8112-4343-af0f-49643c808bf7':
              {
                let pageName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let pageNewQueryData = getPageDetails(pageQueryDataList, pageName);
                if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                    return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
                  });
                }
              }
              break;
            case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
              {
                let uiElementName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName);
                if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name>', function () {
                    return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                  });
                  if (uiElementQueryData['UI_ELEMENT_NAME'] && uiElementQueryData['UI_ELEMENT_NAME'].toUpperCase() == 'PASSWORD') {
                    isDataElementNameTypePassword = true;
                  }
                }
              }
              break;
            case '7f855066-ad39-4325-8108-30befb2447e6':
              {
                let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Type>', function () {
                    return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
                  });
                }
              }
              break;
            case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
              {
                let uiElementValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                if (uiElementValueData && Object.keys(uiElementValueData).length && uiElementValueData['SCOPE_VARIABLE_UUID']) {
                  let selectedAttributeDetails = await getAttributeValueDetails(uiElementValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  if (
                    selectedAttributeDetails &&
                    Object.keys(selectedAttributeDetails).length &&
                    uiElementValueData['FUNCTION_UUID'] &&
                    Object.keys(selectedAttributeDetails).length &&
                    uiElementValueData['FUNCTION_UUID'] &&
                    [
                      'TEST_CASE_STEP_ATTRIBUTE_DATA',
                      'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA',
                      'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA',
                      'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA',
                      'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'
                    ].includes(data['CHILD_ATTRIBUTE_DATA'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${uiElementValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    uiElementValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                  } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                    uiElementValue = selectedAttributeDetails['NAME'];
                  }
                }
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
                let keyNameInKeyPad = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
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
                let uiElementQueryData = getUIElementDetails(uiElementDataList, selectedUIElement);
                if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
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
                let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                    return `'` + functionNameQueryData['FUNCTION_NAME'] + `'`;
                  });
                }
              }
              break;
            case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
              {
                let uiElementName1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementQueryData = getUIElementDetails(uiElementDataList, uiElementName1);
                if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Name 1>', function () {
                    return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                  });
                  if (uiElementQueryData['UI_ELEMENT_NAME'] && uiElementQueryData['UI_ELEMENT_NAME'].toUpperCase() == 'PASSWORD') {
                    isDataElementName1TypePassword = true;
                  }
                }
              }
              break;
            case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
              {
                let uiElementValue1 = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
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
                let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Name>', function () {
                    return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                  });
                }
              }
              break;
            case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
              {
                let uiElementTypeQueryData = getUIElementType(uiElementDataList, uiElementTypeQueryDataList, actualUIElementUUID);
                if (uiElementTypeQueryData && Object.keys(uiElementTypeQueryData).length) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<User Action Type>', function () {
                    return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
                  });
                }
              }
              break;
            case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
              {
                let uiElementGroupName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let uiElementGroupStepQueryData = getUIElementGroupDetails(uiElementGroupQueryDataList, uiElementGroupName);
                if (uiElementGroupStepQueryData && Object.keys(uiElementGroupStepQueryData).length) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<UI Element Group Name>', function () {
                    return `'` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + `'`;
                  });
                }
              }
              break;
            case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
              {
                let pageNumber = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
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
                let apiQueryData = getApiDetails(apiQueryDataList, apiName);
                if (apiQueryData && Object.keys(apiQueryData).length) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                    return `'` + apiQueryData['API_NAME'] + `'`;
                  });
                }
              }
              break;
            case '46136260-2e33-11ef-b3ef-e52f192c3af0':
              {
                let apiAttributeName = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Attribute Name>', function () {
                    return `'` + apiAttributeQueryData['ATTRIBUTE_NAME'] + `'`;
                  });
                }
              }
              break;
            case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
              {
                let apiAttributeValue = '';
                apiAttributeValue = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let apiAttributeValueData = getUIElementValueAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                if (apiAttributeValueData && Object.keys(apiAttributeValueData).length && apiAttributeValueData['SCOPE_VARIABLE_UUID']) {
                  let selectedAttributeDetails = await getAttributeValueDetails(apiAttributeValueData['SCOPE_VARIABLE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                  if (
                    selectedAttributeDetails &&
                    Object.keys(selectedAttributeDetails).length &&
                    apiAttributeValueData['FUNCTION_UUID'] &&
                    ['TEST_CASE_STEP_ATTRIBUTE_DATA', 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'].includes(data['CHILD_ATTRIBUTE_DATA'])
                  ) {
                    let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${apiAttributeValueData['FUNCTION_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                    apiAttributeValue = functionQueryData['FUNCTION_NAME'] + ' $ ' + selectedAttributeDetails['NAME'];
                  } else if (selectedAttributeDetails && Object.keys(selectedAttributeDetails).length) {
                    apiAttributeValue = selectedAttributeDetails['NAME'];
                  }
                }
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
                let pageNewQueryData = getPageDetails(pageQueryDataList, pageName1);
                if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                    return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
                  });
                }
              }
              break;
            case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
              {
                let uiElementState = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
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
                let timeOot = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
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
                let testSetScope = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
                let functionIds = getFunctionDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
                if (
                  functionIds &&
                  !['FUNCTION_STEP_ATTRIBUTE_DATA', 'VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA', 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA', 'FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'].includes(
                    data['CHILD_ATTRIBUTE_DATA']
                  )
                ) {
                  let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                  testSetScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testSetScope;
                }
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Test Set Scope Variable>',
                  testSetScope
                    ? function () {
                        return `'` + testSetScope + `'`;
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
                  let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in('${functionIds}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
                  testCaseScope = functionQueryData['FUNCTION_NAME'] + ' $ ' + testCaseScope;
                }
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Test Case Scope Variable>',
                  testCaseScope
                    ? function () {
                        return `'` + testCaseScope + `'`;
                      }
                    : `' '`
                );
              }
              break;
            case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
              let timeInterval = getDataFromAttributeValue(attributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'], data['CHILD_ATTRIBUTE_DATA']);
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
        }
      }
      let getKeywordByStepType = inputStepType ? inputStepType + ' ' : '';
      data['Test Case Step Name'] = getKeywordByStepType + stepDefTemplateVerbiageName;
      delete data['TEST_CASE_EXECUTON_TYPE'];
      delete data['PLAYWRITE_STEP_CODE'];
      delete data['CHILD_ATTRIBUTE_TABLE_NAME'];
      delete data['CHILD_ATTRIBUTE_DATA'];
      delete data['PRIMARY_COLUMN_NAME'];
      delete data['PRIMARY_COLUMN_VALUE'];
      delete data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
    } else if (data && data['TEST_CASE_EXECUTON_TYPE'] == 'Recorded') {
      data['Test Case Step Name'] = data['Test Case Step Type'] + ' ' + data['Test Case Step Name'];
      data['Step Definition Template'] = data['PLAYWRITE_STEP_CODE'];
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
    for (let i = 0; i < Math.max(keyA.length, keyB.length); i++) {
      if (keyA[i] !== keyB[i]) {
        return (keyA[i] || 0) - (keyB[i] || 0);
      }
    }
    return 0;
  });
}
let requirementQuery;
if (input.GRID_NAME === 'User Story Test Set') {
  requirementQuery = `SELECT tcr.TEST_CASE_UUID AS 'Test Case UUID', rs.REQUIREMENT_SET_UUID, rs.PARENT_REQUIREMENT_SET_UUID, rt.REQUIREMENT_TITLE_UUID, r.REQUIREMENT_UUID, ius.USER_ACTION_UUID, p.PROCESS_UUID, rt.REQUIREMENT_TITLE AS 'Requirement Title', rs.REQUIREMENT_SET_NAME AS 'Requirement Sub-Title', r.REQUIREMENT_TEXT AS 'Requirement', cos.CONDITION_SATISFACTION_NAME AS 'Condition Of Satisfaction/Acceptance Criteria', p.PROCESS_NAME, pg.PAGE_NAME, vua.USER_ACTION_NAME, ius.ASSOCIATION_TYPE FROM IMPACTED_PROCESS ius LEFT JOIN REQUIREMENT_TITLE rt ON rt.REQUIREMENT_TITLE_UUID = ius.REQUIREMENT_TITLE_UUID JOIN REQUIREMENT r ON r.REQUIREMENT_UUID = ius.REQUIREMENT_UUID LEFT JOIN CONDITION_SATISFACTION cos ON cos.CONDITION_SATISFACTION_UUID = ius.CONDITION_SATISFACTION_UUID LEFT JOIN REQUIREMENT_SET rs ON ( rs.REQUIREMENT_SET_ASSOCIATION_UUID = rt.REQUIREMENT_TITLE_UUID OR rs.REQUIREMENT_SET_ASSOCIATION_UUID = ius.USER_ACTION_UUID ) AND r.REQUIREMENT_SET_UUID = rs.REQUIREMENT_SET_UUID LEFT JOIN PROCESS p ON p.PROCESS_UUID = ius.PROCESS_UUID LEFT JOIN PAGE pg ON pg.PAGE_UUID = ius.PAGE_UUID LEFT JOIN VIEW_USER_ACTION vua ON vua.USER_ACTION_UUID = ius.USER_ACTION_UUID LEFT JOIN TEST_CASE_REQUIREMENT tcr ON tcr.REQUIREMENT_UUID = r.REQUIREMENT_UUID LEFT JOIN TEST_CASE stepUser ON tcr.TEST_CASE_UUID = stepUser.TEST_CASE_UUID JOIN TEST_SET ts ON stepUser.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') WHERE ts.TEST_SET_UUID = :TEST_SET_UUID AND tcr.FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( ius.CONDITION_SATISFACTION_UUID IS NOT NULL OR NOT EXISTS ( SELECT 1 FROM IMPACTED_PROCESS sub_ius WHERE sub_ius.REQUIREMENT_UUID = ius.REQUIREMENT_UUID AND sub_ius.CONDITION_SATISFACTION_UUID IS NOT NULL ) );`;
} else {
  requirementQuery = `SELECT tcr.TEST_CASE_UUID AS 'Test Case UUID', rs.REQUIREMENT_SET_UUID, rs.PARENT_REQUIREMENT_SET_UUID, rt.REQUIREMENT_TITLE_UUID, r.REQUIREMENT_UUID, ius.USER_ACTION_UUID, p.PROCESS_UUID, rt.REQUIREMENT_TITLE AS 'Requirement Title', rs.REQUIREMENT_SET_NAME AS 'Requirement Sub-Title', r.REQUIREMENT_TEXT AS 'Requirement', cos.CONDITION_SATISFACTION_NAME AS 'Condition Of Satisfaction/Acceptance Criteria', p.PROCESS_NAME, pg.PAGE_NAME, vua.USER_ACTION_NAME, ius.ASSOCIATION_TYPE FROM IMPACTED_PROCESS ius LEFT JOIN REQUIREMENT_TITLE rt ON rt.REQUIREMENT_TITLE_UUID = ius.REQUIREMENT_TITLE_UUID JOIN REQUIREMENT r ON r.REQUIREMENT_UUID = ius.REQUIREMENT_UUID LEFT JOIN CONDITION_SATISFACTION cos ON cos.CONDITION_SATISFACTION_UUID = ius.CONDITION_SATISFACTION_UUID LEFT JOIN REQUIREMENT_SET rs ON (rs.REQUIREMENT_SET_ASSOCIATION_UUID = rt.REQUIREMENT_TITLE_UUID OR rs.REQUIREMENT_SET_ASSOCIATION_UUID = ius.USER_ACTION_UUID) AND r.REQUIREMENT_SET_UUID = rs.REQUIREMENT_SET_UUID LEFT JOIN PROCESS p ON p.PROCESS_UUID = ius.PROCESS_UUID LEFT JOIN PAGE pg ON pg.PAGE_UUID = ius.PAGE_UUID LEFT JOIN VIEW_USER_ACTION vua ON vua.USER_ACTION_UUID = ius.USER_ACTION_UUID LEFT JOIN TEST_CASE_REQUIREMENT tcr ON tcr.REQUIREMENT_UUID = r.REQUIREMENT_UUID LEFT JOIN TEST_CASE stepUser ON tcr.TEST_CASE_UUID = stepUser.TEST_CASE_UUID WHERE stepUser.TEST_SET_UUID=:TEST_SET_UUID AND tcr.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ( ius.CONDITION_SATISFACTION_UUID IS NOT NULL OR NOT EXISTS ( SELECT 1 FROM IMPACTED_PROCESS sub_ius WHERE sub_ius.REQUIREMENT_UUID = ius.REQUIREMENT_UUID AND sub_ius.CONDITION_SATISFACTION_UUID IS NOT NULL ) );`;
}
let requirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', requirementQuery, input);
let testCaseDescriptionQuery;
if (input.GRID_NAME === 'User Story Test Set') {
  testCaseDescriptionQuery = `SELECT tc.TEST_CASE_UUID AS 'Test Case UUID', tcd.TEST_CASE_DESCRIPTION_DATA, tcd.TEST_CASE_PRE_CONDITION, tcd.TEST_CASE_PRE_EXISTING_DATA, tcd.TEST_CASE_USER_INPUT, tcd.TEST_CASE_EXPECTED_RESULT, tcd.TEST_CASE_ACTUAL_RESULT FROM TEST_SET ts JOIN TEST_CASE tc ON tc.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') JOIN TEST_CASE_DESCRIPTION tcd ON tc.TEST_CASE_UUID = tcd.TEST_CASE_UUID WHERE ts.TEST_SET_UUID = :TEST_SET_UUID;`;
} else {
  testCaseDescriptionQuery = `SELECT tc.TEST_CASE_UUID AS 'Test Case UUID', tcd.TEST_CASE_DESCRIPTION_DATA, tcd.TEST_CASE_PRE_CONDITION,tcd.TEST_CASE_PRE_EXISTING_DATA,tcd.TEST_CASE_USER_INPUT, tcd.TEST_CASE_EXPECTED_RESULT, tcd.TEST_CASE_ACTUAL_RESULT FROM TEST_SET ts INNER JOIN TEST_CASE tc ON ts.TEST_SET_UUID = tc.TEST_SET_UUID INNER JOIN TEST_CASE_DESCRIPTION tcd ON tc.TEST_CASE_UUID = tcd.TEST_CASE_UUID WHERE ts.TEST_SET_UUID=:TEST_SET_UUID;`;
}
let testCaseDescriptionQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseDescriptionQuery, input);
let testCaseAttachmentQuery;
if (input.GRID_NAME === 'User Story Test Set') {
  testCaseAttachmentQuery = `SELECT tc.TEST_CASE_UUID AS 'Test Case UUID', atcinfo.INFO_4 AS 'Attachment', atc.ATCHD_FILE_NM AS 'File_Name' FROM TEST_SET ts INNER JOIN TEST_CASE tc ON tc.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') INNER JOIN ATTACHMENT atc ON tc.TEST_CASE_UUID = atc.TBL_RW_ID INNER JOIN ATTACHMENTINFO atcinfo ON atc.ATCHMT_ID = atcinfo.INFO_1 WHERE ts.TEST_SET_UUID = :TEST_SET_UUID AND atc.KEY_NM = 'TEST_CASE_UUID' AND atc.isDeleted = 0 ORDER BY atc.ATCHD_FILE_NM ASC;`;
} else {
  testCaseAttachmentQuery = `SELECT tc.TEST_CASE_UUID AS 'Test Case UUID', atcinfo.INFO_4 AS 'Attachment', atc.ATCHD_FILE_NM as 'File_Name' FROM TEST_SET ts INNER JOIN TEST_CASE tc ON ts.TEST_SET_UUID = tc.TEST_SET_UUID INNER JOIN ATTACHMENT atc ON tc.TEST_CASE_UUID = atc.TBL_RW_ID INNER JOIN ATTACHMENTINFO atcinfo ON atc.ATCHMT_ID = atcinfo.INFO_1 WHERE ts.TEST_SET_UUID=:TEST_SET_UUID AND atc.KEY_NM = 'TEST_CASE_UUID' AND atc.isDeleted = 0 order by atc.ATCHD_FILE_NM asc;`;
}
let testCaseAttachmentQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseAttachmentQuery, input);
for (const [index, testCaseDetail] of testCaseQueryData.entries()) {
  let parentKeyList = [];
  parentKeyList.push(testCaseDetail['Test Case UUID']);
  let dataObject = {};
  let testCaseStepNameArray = [];
  let testCaseDescriptionArray = [];
  let preConditionpArray = [];
  let preExistingArray = [];
  let userInputpArray = [];
  let exectedResultpArray = [];
  let actulResultArray = [];
  var attachmentArray = [];
  let reqNameArray = [];
  dataObject['HEADING2'] =
    '3.' +
    (index + 1) +
    ' TS' +
    testCaseDetail['Test Set ID'] +
    ' - TC' +
    testCaseDetail['Test Case ID'] +
    ' : ' +
    testCaseDetail['Test Case Name'] +
    ' - ' +
    testCaseDetail['Test Case Execution Type'];
  dataObject['ChildrenMap'] = [];
  for (let testCaseStepDetail of testCaseStepNormalQueryData) {
    if (testCaseDetail['Test Case UUID'] == testCaseStepDetail['Test Case UUID']) {
      testCaseStepNameArray.push(testCaseStepDetail['Test Case Step Name']);
    }
  }
  for (let attachment of testCaseAttachmentQueryData) {
    if (
      testCaseDetail['Test Case UUID'] == attachment['Test Case UUID'] &&
      !(attachment['File_Name'].endsWith('.png') || attachment['File_Name'].endsWith('.jpeg') || attachment['File_Name'].endsWith('.svg') || attachment['File_Name'].endsWith('.jpg'))
    ) {
      let newAttachment = {};
      newAttachment[attachment['File_Name']] = attachment['Attachment'];
      attachmentArray.push(newAttachment);
    }
  }
  for (let descriptions of testCaseDescriptionQueryData) {
    if (testCaseDetail['Test Case UUID'] == descriptions['Test Case UUID']) {
      if (descriptions['TEST_CASE_DESCRIPTION_DATA']) {
        testCaseDescriptionArray.push(descriptions['TEST_CASE_DESCRIPTION_DATA']);
      }
      if (descriptions['TEST_CASE_PRE_CONDITION']) {
        preConditionpArray.push(descriptions['TEST_CASE_PRE_CONDITION']);
      }
      if (descriptions['TEST_CASE_USER_INPUT']) {
        userInputpArray.push(descriptions['TEST_CASE_USER_INPUT']);
      }
      if (descriptions['TEST_CASE_EXPECTED_RESULT']) {
        exectedResultpArray.push(descriptions['TEST_CASE_EXPECTED_RESULT']);
      }
      if (descriptions['TEST_CASE_ACTUAL_RESULT']) {
        actulResultArray.push(descriptions['TEST_CASE_ACTUAL_RESULT']);
      }
      if (descriptions['TEST_CASE_PRE_EXISTING_DATA']) {
        preExistingArray.push(descriptions['TEST_CASE_PRE_EXISTING_DATA']);
      }
    }
  }
  for (let req of requirementQueryData) {
    if (testCaseDetail['Test Case UUID'] == req['Test Case UUID']) {
      reqNameArray.push(req);
    }
  }
  let dataIndex = 1;
  if (reqNameArray && reqNameArray.length > 0) {
    let subObjectREQ = {};
    let heading = 'BOLDTAG' + dataIndex + '. Linked Requirement';
    subObjectREQ['ChildrenList'] = await formatRequirements(reqNameArray, false);
    subObjectREQ['ChildrenList'].unshift(heading);
    dataObject['ChildrenMap'].push(subObjectREQ);
    dataIndex++;
  }
  if (testCaseDescriptionArray && testCaseDescriptionArray.length > 0) {
    let subObjectDesc = {};
    let heading = 'BOLDTAG' + dataIndex + '. Test Case Description';
    subObjectDesc['ChildrenList'] = testCaseDescriptionArray;
    subObjectDesc['ChildrenList'].unshift(heading);
    dataObject['ChildrenMap'].push(subObjectDesc);
    dataIndex++;
  }
  if (preExistingArray && preExistingArray.length > 0) {
    let subObjectPreExisting = {};
    let heading = 'BOLDTAG' + dataIndex + '. Pre-Existing Data';
    subObjectPreExisting['ChildrenList'] = preExistingArray;
    subObjectPreExisting['ChildrenList'].unshift(heading);
    dataObject['ChildrenMap'].push(subObjectPreExisting);
    dataIndex++;
  }
  if (preConditionpArray && preConditionpArray.length > 0) {
    let subObjectPreConditon = {};
    let heading = 'BOLDTAG' + dataIndex + '. Pre Condition';
    subObjectPreConditon['ChildrenList'] = preConditionpArray;
    subObjectPreConditon['ChildrenList'].unshift(heading);
    dataObject['ChildrenMap'].push(subObjectPreConditon);
    dataIndex++;
  }
  if (userInputpArray && userInputpArray.length > 0) {
    let subObjectUserInput = {};
    let heading = 'BOLDTAG' + dataIndex + '. User Input';
    subObjectUserInput['ChildrenList'] = userInputpArray;
    subObjectUserInput['ChildrenList'].unshift(heading);
    dataObject['ChildrenMap'].push(subObjectUserInput);
    dataIndex++;
  }
  if (exectedResultpArray && exectedResultpArray.length > 0) {
    let subObjectExpectedResult = {};
    let heading = 'BOLDTAG' + dataIndex + '. Expected Result';
    subObjectExpectedResult['ChildrenList'] = exectedResultpArray;
    subObjectExpectedResult['ChildrenList'].unshift(heading);
    dataObject['ChildrenMap'].push(subObjectExpectedResult);
    dataIndex++;
  }
  if (actulResultArray && actulResultArray.length > 0) {
    let subObjectActualResult = {};
    let heading = 'BOLDTAG' + dataIndex + '. Actual Result';
    subObjectActualResult['ChildrenList'] = actulResultArray;
    subObjectActualResult['ChildrenList'].unshift(heading);
    dataObject['ChildrenMap'].push(subObjectActualResult);
    dataIndex++;
  }
  if (testCaseStepNameArray && testCaseStepNameArray.length > 0) {
    let subObjectStep = {};
    let heading = 'BOLDTAG' + dataIndex + '. Automated Test Case Steps';
    subObjectStep['ChildrenList'] = testCaseStepNameArray;
    subObjectStep['ChildrenList'].unshift(heading);
    dataObject['ChildrenMap'].push(subObjectStep);
    dataIndex++;
  }
  if (testCaseAttachmentQueryData && testCaseAttachmentQueryData.length > 0) {
    let subObjectAttachment = {};
    let heading = 'BOLDTAG' + dataIndex + '. Attachments';
    subObjectAttachment['ChildrenList'] = [heading];
    subObjectAttachment['LinkChildList'] = attachmentArray;
    subObjectAttachment['attachmentParentKeyList'] = parentKeyList;
    dataObject['ChildrenMap'].push(subObjectAttachment);
    dataIndex++;
  }
  headerThreeMap['ChildrenMapList'].push(dataObject);
}
let requirementprocessQuery;
if (input.GRID_NAME === 'User Story Test Set') {
  requirementprocessQuery = `SELECT rs.REQUIREMENT_SET_UUID, rs.PARENT_REQUIREMENT_SET_UUID, rt.REQUIREMENT_TITLE_UUID, r.REQUIREMENT_UUID, ius.USER_ACTION_UUID, p.PROCESS_UUID, rt.REQUIREMENT_TITLE AS 'Requirement Title', rs.REQUIREMENT_SET_NAME AS 'Requirement Sub-Title', r.REQUIREMENT_TEXT AS 'Requirement', cos.CONDITION_SATISFACTION_NAME AS 'Condition Of Satisfaction/Acceptance Criteria', CONCAT(p.PROCESS_NAME, ' - Screen') AS PROCESS_NAME, CONCAT(pg.PAGE_NAME, ' - Page') AS PAGE_NAME, ( SELECT CONCAT('On ', EVENT_NAME, ' of ', vua.USER_ACTION_NAME, ' ', uitm.UI_ELEMENT_TYPE_NAME) FROM UI_ELEMENT ue, UI_ELEMENT_TYPE_MASTER uitm WHERE ue.UI_ELEMENT_TYPE = uitm.UI_ELEMENT_TYPE_UUID AND ue.UI_ELEMENT_UUID = vua.UI_ELEMENT_UUID ) AS USER_ACTION_NAME, ius.ASSOCIATION_TYPE, GROUP_CONCAT(DISTINCT CONCAT('TC - ', stepUser.TEST_CASE_ID) SEPARATOR ', ') AS TestCaseID FROM IMPACTED_PROCESS ius LEFT JOIN REQUIREMENT_TITLE rt ON rt.REQUIREMENT_TITLE_UUID = ius.REQUIREMENT_TITLE_UUID JOIN REQUIREMENT r ON r.REQUIREMENT_UUID = ius.REQUIREMENT_UUID LEFT JOIN CONDITION_SATISFACTION cos ON cos.CONDITION_SATISFACTION_UUID = ius.CONDITION_SATISFACTION_UUID LEFT JOIN REQUIREMENT_SET rs ON ( rs.REQUIREMENT_SET_ASSOCIATION_UUID = rt.REQUIREMENT_TITLE_UUID OR rs.REQUIREMENT_SET_ASSOCIATION_UUID = ius.USER_ACTION_UUID ) AND r.REQUIREMENT_SET_UUID = rs.REQUIREMENT_SET_UUID LEFT JOIN PROCESS p ON p.PROCESS_UUID = ius.PROCESS_UUID LEFT JOIN PAGE pg ON pg.PAGE_UUID = ius.PAGE_UUID LEFT JOIN VIEW_USER_ACTION vua ON vua.USER_ACTION_UUID = ius.USER_ACTION_UUID LEFT JOIN TEST_CASE_REQUIREMENT tcr ON tcr.REQUIREMENT_UUID = r.REQUIREMENT_UUID LEFT JOIN TEST_CASE stepUser ON tcr.TEST_CASE_UUID = stepUser.TEST_CASE_UUID JOIN TEST_SET ts ON stepUser.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') WHERE tcr.IMPACTED_PROCESS_UUID = ius.IMPACTED_PROCESS_UUID AND ts.TEST_SET_UUID = :TEST_SET_UUID GROUP BY rs.REQUIREMENT_SET_UUID, rs.PARENT_REQUIREMENT_SET_UUID, rt.REQUIREMENT_TITLE_UUID, r.REQUIREMENT_UUID, ius.USER_ACTION_UUID, p.PROCESS_UUID, rt.REQUIREMENT_TITLE, rs.REQUIREMENT_SET_NAME, r.REQUIREMENT_TEXT, cos.CONDITION_SATISFACTION_NAME, p.PROCESS_NAME, pg.PAGE_NAME, vua.USER_ACTION_NAME, ius.ASSOCIATION_TYPE, vua.UI_ELEMENT_UUID;`;
} else {
  requirementprocessQuery = `SELECT rs.REQUIREMENT_SET_UUID, rs.PARENT_REQUIREMENT_SET_UUID, rt.REQUIREMENT_TITLE_UUID, r.REQUIREMENT_UUID, ius.USER_ACTION_UUID, p.PROCESS_UUID, rt.REQUIREMENT_TITLE AS 'Requirement Title', rs.REQUIREMENT_SET_NAME AS 'Requirement Sub-Title', r.REQUIREMENT_TEXT AS 'Requirement', cos.CONDITION_SATISFACTION_NAME AS 'Condition Of Satisfaction/Acceptance Criteria', CONCAT(p.PROCESS_NAME, ' - Screen') AS PROCESS_NAME, CONCAT(pg.PAGE_NAME, ' - Page') AS PAGE_NAME,( SELECT CONCAT( 'On ', EVENT_NAME, ' of ', vua.USER_ACTION_NAME, ' ', uitm.UI_ELEMENT_TYPE_NAME) FROM UI_ELEMENT ue, UI_ELEMENT_TYPE_MASTER uitm WHERE ue.UI_ELEMENT_TYPE = uitm.UI_ELEMENT_TYPE_UUID AND ue.UI_ELEMENT_UUID = vua.UI_ELEMENT_UUID ) AS USER_ACTION_NAME, ius.ASSOCIATION_TYPE, GROUP_CONCAT( DISTINCT concat('TC - ', stepUser.TEST_CASE_ID) SEPARATOR ', ' ) AS TestCaseID FROM IMPACTED_PROCESS ius LEFT JOIN REQUIREMENT_TITLE rt ON rt.REQUIREMENT_TITLE_UUID = ius.REQUIREMENT_TITLE_UUID JOIN REQUIREMENT r ON r.REQUIREMENT_UUID = ius.REQUIREMENT_UUID LEFT JOIN CONDITION_SATISFACTION cos ON cos.CONDITION_SATISFACTION_UUID = ius.CONDITION_SATISFACTION_UUID LEFT JOIN REQUIREMENT_SET rs ON ( rs.REQUIREMENT_SET_ASSOCIATION_UUID = rt.REQUIREMENT_TITLE_UUID OR rs.REQUIREMENT_SET_ASSOCIATION_UUID = ius.USER_ACTION_UUID ) AND r.REQUIREMENT_SET_UUID = rs.REQUIREMENT_SET_UUID LEFT JOIN PROCESS p ON p.PROCESS_UUID = ius.PROCESS_UUID LEFT JOIN PAGE pg ON pg.PAGE_UUID = ius.PAGE_UUID LEFT JOIN VIEW_USER_ACTION vua ON vua.USER_ACTION_UUID = ius.USER_ACTION_UUID LEFT JOIN TEST_CASE_REQUIREMENT tcr ON tcr.REQUIREMENT_UUID = r.REQUIREMENT_UUID LEFT JOIN TEST_CASE stepUser ON tcr.TEST_CASE_UUID = stepUser.TEST_CASE_UUID where tcr.IMPACTED_PROCESS_UUID = ius.IMPACTED_PROCESS_UUID and stepUser.TEST_SET_UUID=:TEST_SET_UUID GROUP BY rs.REQUIREMENT_SET_UUID, rs.PARENT_REQUIREMENT_SET_UUID, rt.REQUIREMENT_TITLE_UUID, r.REQUIREMENT_UUID, ius.USER_ACTION_UUID, p.PROCESS_UUID, rt.REQUIREMENT_TITLE, rs.REQUIREMENT_SET_NAME, r.REQUIREMENT_TEXT, cos.CONDITION_SATISFACTION_NAME, p.PROCESS_NAME, pg.PAGE_NAME, vua.USER_ACTION_NAME, ius.ASSOCIATION_TYPE,vua.UI_ELEMENT_UUID`;
}
let requirementprocessQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', requirementprocessQuery, input);
if (testSetQueryData && Object.keys(testSetQueryData).length) {
  msg.payload.documentData.documentHeader = 'Test Set - ' + testSetQueryData['TEST_SET_ID'] + ' – ' + testSetQueryData['TEST_SET_NAME'];
  let processId = testSetQueryData['PROCESS_UUID'] ? `'` + testSetQueryData['PROCESS_UUID'] + `'` : `''`;
  const processQuery = `SELECT PROCESS_NAME FROM PROCESS WHERE PROCESS_UUID in(${processId}) AND FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
  let processQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, processQuery, input);
  let pageId = testSetQueryData['PAGE_UUID'] ? `'` + testSetQueryData['PAGE_UUID'] + `'` : `''`;
  const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID in(${pageId}) AND FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
  let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, pageNewQuery, input);
  let userActionId = testSetQueryData['USER_ACTION_UUID'] ? `'` + testSetQueryData['USER_ACTION_UUID'] + `'` : `''`;
  const userActionQuery = `SELECT * FROM VIEW_USER_ACTION WHERE USER_ACTION_UUID in(${userActionId}) AND FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
  let userActionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(`PRIMARYSPRINGFM`, userActionQuery, input);
  let tagsStr = testSetQueryData['TAGS_UUID'] ? testSetQueryData['TAGS_UUID'] : `''`;
  let tagList = tagsStr.split(',');
  let result = tagList.map((item) => `'` + item + `'`).join();
  const tagsQuery = `SELECT * FROM TAGS WHERE TAGS_UUID in(${result})`;
  let tagsQueryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, tagsQuery, input);
  let tagRes = tagsQueryData.map((item) => item['TAGS_NAME']).join(',');
  let headerOneMap = {};
  headerOneMap['Header'] = '1. Introduction';
  headerOneMap['ChildrenKeyValueMap'] = [
    { Key: 'Test Set Name', Value: testSetQueryData['TEST_SET_ID'] + ' - ' + testSetQueryData['TEST_SET_NAME'] },
    { Key: 'Process Name', Value: processQueryData['PROCESS_NAME'] ? processQueryData['PROCESS_NAME'] : '' },
    { Key: 'Page Name', Value: pageNewQueryData['PAGE_NAME'] ? pageNewQueryData['PAGE_NAME'] : '' },
    { Key: 'User Action Name', Value: userActionQueryData['USER_ACTION_NAME'] ? userActionQueryData['USER_ACTION_NAME'] : '' },
    { Key: 'Tag Name', Value: tagRes }
  ];
  msg.payload.documentData.documentDetails.push(headerOneMap);
  let headerTwoMap = {};
  headerTwoMap['Header'] = '2. Requirements';
  headerTwoMap['ChildrenList'] = await formatRequirements(requirementprocessQueryData, true);
  msg.payload.documentData.documentDetails.push(headerTwoMap);
  msg.payload.documentData.documentDetails.push(headerThreeMap);
}
msg.payload.result.message = 'Document Downloaded';
msg.payload.templateFile = '';
node.send(msg);
