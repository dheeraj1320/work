function escapeSingleQuote(inpt) {
  return inpt;
}
AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
let input = Object.assign(msg.payload.apiRequestBody, msg.payload.referenceData);
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
function getFunctionDataFromAttributeValue(attributeValueQueryData, stepDefArrributeId) {
  let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
  if (result && result.length) {
    return result[0]['FUNCTION_UUID'];
  } else {
    return '';
  }
}
function generateExcelData(inputData, inputHeader) {
  let mainArray = [inputHeader];
  for (let data of inputData) {
    let dataArray = [];
    for (let key in data) {
      dataArray.push(data[key]);
    }
    mainArray.push(dataArray);
  }
  return mainArray;
}
function getDataFromAttributeValue(attributeValueQueryData, stepDefArrributeId, attributeData) {
  let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
  if (result && result.length) {
    return result[0][attributeData] ? result[0][attributeData] : '';
  } else {
    return '';
  }
}
function groupedByTitleAndRequirement(data) {
  if (data && data.length) {
    let groupedData = data.reduce((acc, item) => {
      const title = item.RequirementTitle;
      const group = item.RequirementGroup;
      const name = item.RequirementName;
      if (!acc[title]) {
        acc[title] = {};
      }
      if (!acc[title][group]) {
        acc[title][group] = {};
      }
      if (!acc[title][group][name]) {
        acc[title][group][name] = [];
      }
      if (item.ConditionOfSatisfaction) {
        acc[title][group][name].push(item.ConditionOfSatisfaction || 'N/A');
      }
      return acc;
    }, {});
    let htmlString = '';
    for (const title in groupedData) {
      htmlString += title == 'null' || !title ? `` : `<p>${title}</p>`;
      for (const group in groupedData[title]) {
        if ((title == 'null' && group == 'null') || (!title && !group)) {
          htmlString += ``;
        } else if ((title != 'null' && group != 'null') || (title && group && group != 'null')) {
          htmlString += `<p>&nbsp;&nbsp;${group}</p>`;
        } else if ((title == 'null' && group != 'null') || (!title && group)) {
          htmlString += `<p>${group}</p>`;
        }
        for (const name in groupedData[title][group]) {
          if ((title == 'null' && group == 'null') || (!title && !group)) {
            htmlString += `<p>${name}</p>`;
          } else if ((title != 'null' && group != 'null') || (title && group)) {
            htmlString += `<p>&nbsp;&nbsp;&nbsp;&nbsp;${name}</p>`;
          } else if ((title == 'null' && group != 'null') || (!title && group)) {
            htmlString += `<p>&nbsp;&nbsp;${name}</p>`;
          }
          groupedData[title][group][name].forEach((condition) => {
            if ((title == 'null' && group == 'null') || (!title && !group)) {
              htmlString += `<p>&nbsp;&nbsp;${condition}</p>`;
            } else if ((title != 'null' && group != 'null') || (title && group)) {
              htmlString += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${condition}</p>`;
            } else if ((title == 'null' && group != 'null') || (!title && group)) {
              htmlString += `<p>&nbsp;&nbsp;&nbsp;&nbsp;${condition}</p>`;
            }
          });
        }
      }
    }
    return htmlString;
  }
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
try {
  let objectData = {};
  msg.payload.result = {};
  let maxLength = 200;
  let queryListMap = [];
  let documentName = msg.payload.apiRequestBody.USER_STORY_NAME
    ? msg.payload.apiRequestBody.USER_STORY_NAME.replaceAll(/[^A-Z0-9-]+/gi, '_')
    : 'GeneratedUserStory';
  documentName =
    msg.payload.apiRequestBody.USER_STORY_ID +
    ' - ' +
    (msg.payload.apiRequestBody.USER_STORY_SOURCE_ID
      ? msg.payload.apiRequestBody.USER_STORY_SOURCE_ID + ' - ' + documentName + '_Test_Cases'
      : documentName + '_Test_Cases');
  msg.payload.result.documentName =
    documentName.length > maxLength ? documentName.substring(0, maxLength) : documentName;
  msg.payload.result.navigation = {};
  msg.payload.result.navigation.operationType = 'GenerateCSVDocument';
  let testCaseImpactedUserStoryQuery = ` SELECT uuid() as uuid, 'Test Case' as 'Object Type', '' as 'Unique ID', concat(tc.TEST_CASE_ID, ' - ', tc.TEST_CASE_NAME) as Name, 'Functional' as Type, '' as Priority, tc.TEST_CASE_EXECUTON_TYPE as Method, '' as 'Last Build', '' as 'Last Run', '' as 'Work Product', '' as Description, '' as Notes, '' as Objective, tcd.TEST_CASE_PRE_CONDITION as 'Pre Conditions', tcd.TEST_CASE_USER_INPUT as 'Validation Input', tcd.TEST_CASE_EXPECTED_RESULT as 'Validation Expected Result', tcd.TEST_CASE_ACTUAL_RESULT as 'Post Conditions', ius.REQUIREMENT_TITLE_UUID, ius.REQUIREMENT_UUID, ius.CONDITION_SATISFACTION_UUID, tcr.TEST_CASE_UUID, tc.FUNCTIONAL_AREA_UUID FROM IMPACTED_USER_STORY ius JOIN TEST_CASE_REQUIREMENT tcr ON ius.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcr.TEST_CASE_UUID JOIN TEST_CASE_DESCRIPTION tcd ON tc.TEST_CASE_UUID = tcd.TEST_CASE_UUID WHERE ius.USER_STORY_UUID=:USER_STORY_UUID GROUP BY tc.TEST_CASE_UUID, tc.TEST_CASE_ID, tc.TEST_CASE_NAME, tc.TEST_CASE_EXECUTON_TYPE, tc.FUNCTIONAL_AREA_UUID, tcd.TEST_CASE_PRE_CONDITION, tcd.TEST_CASE_USER_INPUT, tcd.TEST_CASE_EXPECTED_RESULT, tcd.TEST_CASE_ACTUAL_RESULT, ius.REQUIREMENT_TITLE_UUID, ius.REQUIREMENT_UUID, ius.CONDITION_SATISFACTION_UUID, tcr.TEST_CASE_UUID;`;
  let testCaseImpactedUserStoryQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseImpactedUserStoryQuery,
    input
  );
  for (let testCase of testCaseImpactedUserStoryQueryData) {
    let testCaseId = `'` + testCase['TEST_CASE_UUID'] + `'`;
    msg.payload.result.documentData = {};
    let testCaseStepNormalQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', TEST_CASE_STEP_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, '' AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_STEP_UUID' as PRIMARY_COLUMN_NAME, tcs.TEST_CASE_STEP_UUID as PRIMARY_COLUMN_VALUE, tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tc.TEST_CASE_UUID = ${testCaseId} AND ( ( tcs.IS_PURE_NAVIGATION_STEP = 'No' or tcs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and ( vns.FUNCTION_STEP_UUID IS NULL or vns.FUNCTION_STEP_UUID = '' ) and ( vns.FUNCTION_UUID IS NULL or vns.FUNCTION_UUID = '' ) ) ) ) ORDER BY tcs.TEST_CASE_STEP_ID, tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
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
    let testCaseNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ), ' Page - ', ' Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) AS PageID, 'Active' AS Status, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcs.TEST_CASE_UUID = ${testCaseId} AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND EXISTS ( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NULL or vns.FUNCTION_STEP_UUID = '' and vns.FUNCTION_UUID IS NULL or vns.FUNCTION_UUID = '' ) ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
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
    let testCaseFunctionStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_STEP_SEQ_ID ) AS 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', TEST_CASE_FUNCTION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function' ) AS 'Test Case Step Group Name', '' AS reserved2, CASE WHEN tcfs.NEXT_PAGE_CONTEXT IS NOT NULL THEN ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.NEXT_PAGE_CONTEXT ) ELSE ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) END AS 'Page ID', 'Active' AS Status, TEST_CASE_FUNCTION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfs.TEST_CASE_FUNCTION_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE tc, TEST_SET ts, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND tcs.TEST_CASE_UUID = ${testCaseId} AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND ( ( tcfs.IS_PURE_NAVIGATION_STEP = 'No' or tcfs.IS_PURE_NAVIGATION_STEP is null ) OR ( tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NOT NULL and vns.FUNCTION_STEP_UUID != '' and vns.FUNCTION_UUID IS NOT NULL and vns.FUNCTION_UUID != '' ) ) ) ORDER BY TEST_CASE_STEP_ID, TEST_CASE_FUNCTION_STEP_ID ASC`;
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
    let testCaseFunctionNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', tcfs.TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.TEST_CASE_VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME AS 'Test Case Step Name', '' AS 'Step Definition Template', '' AS v1, '' AS v2, '' AS v3, '' AS v4, '' AS v5, CONCAT( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT PAGE_NAME FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ), ' Page - ', 'Navigation Step' ) AS 'Test Case Step Group Name', '' AS reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) AS PageID, 'Active' AS Status, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, tcs.API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_VIEW_NAVIGATION_STEP_UUID' as PRIMARY_COLUMN_NAME, vns.TEST_CASE_VIEW_NAVIGATION_STEP_UUID as PRIMARY_COLUMN_VALUE, vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tcs.TEST_CASE_UUID = ${testCaseId} AND tcfs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND EXISTS( SELECT 1 FROM TEST_CASE_VIEW_NAVIGATION_STEP vns WHERE vns.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and vns.FUNCTION_STEP_UUID IS NOT NULL and vns.FUNCTION_STEP_UUID != '' and vns.FUNCTION_UUID IS NOT NULL and vns.FUNCTION_UUID != '' ) ORDER BY vns.TEST_CASE_VIEW_NAVIGATION_STEP_ID, vns.TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
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
    let testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_STEP_SEQ_ID, '-', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ', ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcfuegs.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcfuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND tcfs.TEST_CASE_FUNCTION_STEP_UUID = tcfuegs.TEST_CASE_FUNCTION_STEP_UUID AND tcs.TEST_CASE_UUID = ${testCaseId} AND tcs.IS_FUNCTION_STEP = 'Yes' AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID asc, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
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
    let testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat( TEST_CASE_STEP_SEQ_ID, '-', TEST_CASE_UI_ELEMENT_GROUP_STEP_ID ) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID', '' as actions, '' AS v6,'' AS v7,'' AS v8,'' AS v9,'' AS v10,'' AS v11,'' AS v12, API_UUID, tcs.PLAYWRITE_STEP_CODE, tc.TEST_CASE_EXECUTON_TYPE, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE' as CHILD_ATTRIBUTE_TABLE_NAME, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA' as CHILD_ATTRIBUTE_DATA, 'TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID' as PRIMARY_COLUMN_NAME, tcuegs.TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as PRIMARY_COLUMN_VALUE, tcuegs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID FROM TEST_CASE_STEP tcs, TEST_CASE_UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcuegs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND tcs.TEST_CASE_UUID = ${testCaseId} AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID, TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
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
        let inc = 0;
        if (data && data['TEST_CASE_EXECUTON_TYPE'] != 'Recorded') {
          let inputStepType =
            data['Test Case Step Type'] && data['Test Case Step Type'] == 'Data'
              ? 'Given'
              : data['Test Case Step Type'];
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
            let isDataElementNameTypePassword = false;
            let isDataElementName1TypePassword = false;
            for (let codeDesc of stepDefAttributeQueryData) {
              input['FUNCTIONAL_AREA_UUID'] = testCase['FUNCTIONAL_AREA_UUID'];
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
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                        return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
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
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<UI Element Name>',
                        function () {
                          return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                        }
                      );
                      if (
                        uiElementQueryData['UI_ELEMENT_NAME'] &&
                        uiElementQueryData['UI_ELEMENT_NAME'].toUpperCase() == 'PASSWORD'
                      ) {
                        isDataElementNameTypePassword = true;
                      }
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
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<UI Element Type>',
                        function () {
                          return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
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
                    let keyNameInKeyPad = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                      '<Key Name in Keypad>',
                      function () {
                        return `'` + keyNameInKeyPad + `'`;
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
                    let functionName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let functionNameQueryData = getFunctionDetails(functionQueryDataList, functionName);
                    if (functionNameQueryData && Object.keys(functionNameQueryData).length) {
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<Function Name>',
                        function () {
                          return `'` + functionNameQueryData['FUNCTION_NAME'] + `'`;
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
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<UI Element Name 1>',
                        function () {
                          return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                        }
                      );
                      if (
                        uiElementQueryData['UI_ELEMENT_NAME'] &&
                        uiElementQueryData['UI_ELEMENT_NAME'].toUpperCase() == 'PASSWORD'
                      ) {
                        isDataElementName1TypePassword = true;
                      }
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
                    let userActionName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let uiElementQueryData = getUIElementDetails(uiElementDataList, userActionName);
                    if (uiElementQueryData && Object.keys(uiElementQueryData).length) {
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<User Action Name>',
                        function () {
                          return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
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
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<User Action Type>',
                        function () {
                          return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
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
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<UI Element Group Name>',
                        function () {
                          return `'` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + `'`;
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
                    let dataKey = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let dataValue = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let fileName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let downloadParserName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let apiName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let apiAttributeName = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let apiAttributeQueryData = getApiAttributeDetails(apiAttributeQueryDataList, apiAttributeName);
                    if (apiAttributeQueryData && Object.keys(apiAttributeQueryData).length) {
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<API Attribute Name>',
                        function () {
                          return `'` + apiAttributeQueryData['ATTRIBUTE_NAME'] + `'`;
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
                    let responseStatusCode = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
                    let pageName1 = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
                    let pageNewQueryData = getPageDetails(pageQueryDataList, pageName1);
                    if (pageNewQueryData && Object.keys(pageNewQueryData).length) {
                      stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                        '<Page Name 1>',
                        function () {
                          return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
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
                    let timeOot = getDataFromAttributeValue(
                      attributeValueQueryData,
                      codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      data['CHILD_ATTRIBUTE_DATA']
                    );
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
            }
          }
          let getKeywordByStepType = inputStepType ? inputStepType + ' ' : '';
          data['Test Case Step Name'] = getKeywordByStepType + stepDefTemplateVerbiageName;
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
        for (let i = 0; i < Math.max(keyA.length, keyB.length); i++) {
          if (keyA[i] !== keyB[i]) {
            return (keyA[i] || 0) - (keyB[i] || 0);
          }
        }
        return 0;
      });
    }
    let testCaseStepStr = '';
    for (let testCaseStep of testCaseStepNormalQueryData) {
      testCaseStepStr = testCaseStepStr + '<p>' + testCaseStep['Test Case Step Name'] + '</p>';
    }
    testCase['Notes'] = testCaseStepStr;
    delete testCase['uuid'];
    delete testCase['REQUIREMENT_TITLE_UUID'];
    delete testCase['REQUIREMENT_UUID'];
    delete testCase['CONDITION_SATISFACTION_UUID'];
    delete testCase['TEST_CASE_UUID'];
    delete testCase['FUNCTIONAL_AREA_UUID'];
    let linkedTestCaseRequirementQuery = `SELECT(SELECT CONCAT(REQUIREMENT_TITLE_ID, ' - ', REQUIREMENT_TITLE) FROM REQUIREMENT_TITLE WHERE REQUIREMENT_TITLE_UUID = tcr.REQUIREMENT_TITLE_UUID limit 1) as RequirementTitle, (SELECT CONCAT(REQUIREMENT_SET_ID, ' - ', REQUIREMENT_SET_NAME) FROM REQUIREMENT_SET rs, REQUIREMENT r WHERE rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID AND r.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID limit 1) as RequirementGroup, (SELECT CONCAT(REQUIREMENT_ID, ' - ', REQUIREMENT_TEXT) FROM REQUIREMENT WHERE REQUIREMENT_UUID = tcr.REQUIREMENT_UUID limit 1) as RequirementName, (SELECT CONCAT(CONDITION_SATISFACTION_ID, ' - ', CONDITION_SATISFACTION_NAME) FROM CONDITION_SATISFACTION WHERE CONDITION_SATISFACTION_UUID = tcr.CONDITION_SATISFACTION_UUID limit 1) as ConditionOfSatisfaction, tcr.TEST_CASE_REQUIREMENT_ID, ip.ASSOCIATION_TYPE, ip.PROCESS_UUID, ip.PAGE_UUID, ip.USER_ACTION_UUID, tcr.REQUIREMENT_TITLE_UUID, tcr.REQUIREMENT_UUID, tcr.CONDITION_SATISFACTION_UUID, ip.FUNCTIONAL_AREA_UUID FROM TEST_CASE_REQUIREMENT tcr JOIN IMPACTED_PROCESS ip ON tcr.IMPACTED_PROCESS_UUID = ip.IMPACTED_PROCESS_UUID WHERE tcr.TEST_CASE_UUID in (${testCaseId}) AND ip.ASSOCIATION_TYPE IN('FEATURE') UNION SELECT(SELECT CONCAT(pro.PROCESS_ID, ' - ', pro.PROCESS_NAME, ' , ', pg.PAGE_ID, ' - ', pg.PAGE_NAME, ' , ', ua.USER_ACTION_ID, ' - ', ua.USER_ACTION_NAME) FROM PROCESS pro JOIN PROCESS_PAGE pp ON pro.PROCESS_UUID = pp.PROCESS_UUID JOIN PAGE pg ON pp.PAGE_UUID = pg.PAGE_UUID JOIN VIEW_USER_ACTION ua ON pro.PROCESS_UUID = ua.PROCESS_UUID AND pg.PAGE_UUID = ua.PAGE_UUID WHERE pp.PROCESS_UUID = pro.PROCESS_UUID AND pp.PAGE_UUID = pg.PAGE_UUID AND pro.PROCESS_UUID = ip.PROCESS_UUID AND pg.PAGE_UUID = ip.PAGE_UUID AND ua.USER_ACTION_UUID = ip.USER_ACTION_UUID limit 1) as RequirementTitle, (SELECT CONCAT(REQUIREMENT_SET_ID, ' - ', REQUIREMENT_SET_NAME) FROM REQUIREMENT_SET rs, REQUIREMENT r WHERE rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID AND r.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID limit 1) as RequirementGroup, (SELECT CONCAT(REQUIREMENT_ID, ' - ', REQUIREMENT_TEXT) FROM REQUIREMENT WHERE REQUIREMENT_UUID = tcr.REQUIREMENT_UUID limit 1) as RequirementName, (SELECT CONCAT(CONDITION_SATISFACTION_ID, ' - ', CONDITION_SATISFACTION_NAME) FROM CONDITION_SATISFACTION WHERE CONDITION_SATISFACTION_UUID = tcr.CONDITION_SATISFACTION_UUID limit 1) as ConditionOfSatisfaction, tcr.TEST_CASE_REQUIREMENT_ID, ip.ASSOCIATION_TYPE, ip.PROCESS_UUID, ip.PAGE_UUID, ip.USER_ACTION_UUID, tcr.REQUIREMENT_TITLE_UUID, tcr.REQUIREMENT_UUID, tcr.CONDITION_SATISFACTION_UUID, ip.FUNCTIONAL_AREA_UUID FROM TEST_CASE_REQUIREMENT tcr JOIN IMPACTED_PROCESS ip ON tcr.IMPACTED_PROCESS_UUID = ip.IMPACTED_PROCESS_UUID WHERE tcr.TEST_CASE_UUID in (${testCaseId}) AND ip.ASSOCIATION_TYPE IN('PAGE-EVENT')`;
    let linkedTestCaseRequirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      linkedTestCaseRequirementQuery,
      input
    );
    let htmlObjectiveData = groupedByTitleAndRequirement(linkedTestCaseRequirementQueryData);
    testCase['Objective'] = htmlObjectiveData;
    const testSetDetailQuery = `SELECT PROCESS_UUID,PAGE_UUID,USER_ACTION_UUID,tc.TEST_SET_UUID FROM TEST_SET ts,TEST_CASE tc where ts.TEST_SET_UUID=tc.TEST_SET_UUID and tc.TEST_CASE_UUID in(${testCaseId})`;
    let testSetDetailQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
      `PRIMARYSPRINGFM`,
      testSetDetailQuery,
      input
    );
    let userActionId = '';
    if (testSetDetailQueryData && Object.keys(testSetDetailQueryData).length) {
      input['PROCESS_UUID'] = testSetDetailQueryData['PROCESS_UUID'];
      input['PAGE_UUID'] = testSetDetailQueryData['PAGE_UUID'];
      input['USER_ACTION_UUID'] = testSetDetailQueryData['USER_ACTION_UUID'];
      userActionId = `'` + testSetDetailQueryData['USER_ACTION_UUID'] + `'`;
    }
    let allinkedTestCaseRequirementQuery = `SELECT ( SELECT CONCAT( REQUIREMENT_TITLE_ID, ' - ', REQUIREMENT_TITLE ) FROM REQUIREMENT_TITLE WHERE REQUIREMENT_TITLE_UUID = ip.REQUIREMENT_TITLE_UUID limit 1 ) as RequirementTitle, ( SELECT CONCAT( REQUIREMENT_SET_ID, ' - ', REQUIREMENT_SET_NAME ) FROM REQUIREMENT_SET rs, REQUIREMENT r WHERE rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID AND r.REQUIREMENT_UUID = ip.REQUIREMENT_UUID limit 1 ) as RequirementGroup, ( SELECT CONCAT( REQUIREMENT_ID, ' - ', REQUIREMENT_TEXT ) FROM REQUIREMENT WHERE REQUIREMENT_UUID = ip.REQUIREMENT_UUID limit 1 ) as RequirementName, ( SELECT CONCAT( CONDITION_SATISFACTION_ID, ' - ', CONDITION_SATISFACTION_NAME ) FROM CONDITION_SATISFACTION WHERE CONDITION_SATISFACTION_UUID = ip.CONDITION_SATISFACTION_UUID limit 1 ) as ConditionOfSatisfaction, ip.ASSOCIATION_TYPE, ip.PROCESS_UUID, ip.PAGE_UUID, ip.USER_ACTION_UUID, ip.REQUIREMENT_TITLE_UUID, ip.REQUIREMENT_UUID, ip.CONDITION_SATISFACTION_UUID, ip.FUNCTIONAL_AREA_UUID from IMPACTED_PROCESS ip, TEST_CASE tc, REQUIREMENT req, IMPACTED_USER_STORY ius where req.REQUIREMENT_UUID = ip.REQUIREMENT_UUID and tc.TEST_CASE_UUID = ${testCaseId} and ip.USER_ACTION_UUID = ${userActionId} and ius.REQUIREMENT_UUID = ip.REQUIREMENT_UUID and ius.USER_STORY_UUID=:USER_STORY_UUID and ip.ASSOCIATION_TYPE in ( 'FEATURE' ) and ip.IMPACTED_PROCESS_UUID not in ( SELECT ip.IMPACTED_PROCESS_UUID FROM IMPACTED_PROCESS ip, TEST_CASE_REQUIREMENT tcr where ip.IMPACTED_PROCESS_UUID = tcr.IMPACTED_PROCESS_UUID and tcr.TEST_CASE_UUID = ${testCaseId} ) union SELECT ( SELECT CONCAT( pro.PROCESS_ID, ' - ', pro.PROCESS_NAME, ' , ', pg.PAGE_ID, ' - ', pg.PAGE_NAME, ' , ', ua.USER_ACTION_ID, ' - ', ua.USER_ACTION_NAME ) FROM PROCESS pro JOIN PROCESS_PAGE pp ON pro.PROCESS_UUID = pp.PROCESS_UUID JOIN PAGE pg ON pp.PAGE_UUID = pg.PAGE_UUID JOIN VIEW_USER_ACTION ua ON pro.PROCESS_UUID = ua.PROCESS_UUID AND pg.PAGE_UUID = ua.PAGE_UUID WHERE pp.PROCESS_UUID = pro.PROCESS_UUID AND pp.PAGE_UUID = pg.PAGE_UUID AND pro.PROCESS_UUID = ip.PROCESS_UUID AND pg.PAGE_UUID = ip.PAGE_UUID AND ua.USER_ACTION_UUID = ip.USER_ACTION_UUID limit 1 ) as RequirementTitle, ( SELECT CONCAT( REQUIREMENT_SET_ID, ' - ', REQUIREMENT_SET_NAME ) FROM REQUIREMENT_SET rs, REQUIREMENT r WHERE rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID AND r.REQUIREMENT_UUID = ip.REQUIREMENT_UUID limit 1 ) as RequirementGroup, ( SELECT CONCAT( REQUIREMENT_ID, ' - ', REQUIREMENT_TEXT ) FROM REQUIREMENT WHERE REQUIREMENT_UUID = ip.REQUIREMENT_UUID limit 1 ) as RequirementName, ( SELECT CONCAT( CONDITION_SATISFACTION_ID, ' - ', CONDITION_SATISFACTION_NAME ) FROM CONDITION_SATISFACTION WHERE CONDITION_SATISFACTION_UUID = ip.CONDITION_SATISFACTION_UUID limit 1 ) as ConditionOfSatisfaction, ip.ASSOCIATION_TYPE, ip.PROCESS_UUID, ip.PAGE_UUID, ip.USER_ACTION_UUID, ip.REQUIREMENT_TITLE_UUID, ip.REQUIREMENT_UUID, ip.CONDITION_SATISFACTION_UUID, ip.FUNCTIONAL_AREA_UUID from IMPACTED_PROCESS ip, TEST_CASE tc, REQUIREMENT req, IMPACTED_USER_STORY ius where req.REQUIREMENT_UUID = ip.REQUIREMENT_UUID and tc.TEST_CASE_UUID = ${testCaseId} and ip.USER_ACTION_UUID = ${userActionId} and ius.REQUIREMENT_UUID = ip.REQUIREMENT_UUID and ius.USER_STORY_UUID=:USER_STORY_UUID and ip.ASSOCIATION_TYPE in ( 'PAGE-EVENT' ) and ip.IMPACTED_PROCESS_UUID not in ( SELECT ip.IMPACTED_PROCESS_UUID FROM IMPACTED_PROCESS ip, TEST_CASE_REQUIREMENT tcr where ip.IMPACTED_PROCESS_UUID = tcr.IMPACTED_PROCESS_UUID and tcr.TEST_CASE_UUID = ${testCaseId} ) union SELECT ( SELECT CONCAT( REQUIREMENT_TITLE_ID, ' - ', REQUIREMENT_TITLE ) FROM REQUIREMENT_TITLE WHERE REQUIREMENT_TITLE_UUID = tcr.REQUIREMENT_TITLE_UUID limit 1 ) as RequirementTitle, ( SELECT CONCAT( REQUIREMENT_SET_ID, ' - ', REQUIREMENT_SET_NAME ) FROM REQUIREMENT_SET rs, REQUIREMENT r WHERE rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID AND r.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID limit 1 ) as RequirementGroup, ( SELECT CONCAT( REQUIREMENT_ID, ' - ', REQUIREMENT_TEXT ) FROM REQUIREMENT WHERE REQUIREMENT_UUID = tcr.REQUIREMENT_UUID limit 1 ) as RequirementName, ( SELECT CONCAT( CONDITION_SATISFACTION_ID, ' - ', CONDITION_SATISFACTION_NAME ) FROM CONDITION_SATISFACTION WHERE CONDITION_SATISFACTION_UUID = tcr.CONDITION_SATISFACTION_UUID limit 1 ) as ConditionOfSatisfaction, ip.ASSOCIATION_TYPE, ip.PROCESS_UUID, ip.PAGE_UUID, ip.USER_ACTION_UUID, tcr.REQUIREMENT_TITLE_UUID, tcr.REQUIREMENT_UUID, tcr.CONDITION_SATISFACTION_UUID, ip.FUNCTIONAL_AREA_UUID from TEST_CASE_REQUIREMENT tcr, TEST_CASE tc, IMPACTED_PROCESS ip, REQUIREMENT req, IMPACTED_USER_STORY ius where req.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID and tcr.IMPACTED_PROCESS_UUID = ip.IMPACTED_PROCESS_UUID and tc.TEST_CASE_UUID = tcr.TEST_CASE_UUID and tcr.TEST_CASE_UUID = ${testCaseId} and tcr.USER_ACTION_UUID = ${userActionId} and ius.REQUIREMENT_UUID = ip.REQUIREMENT_UUID and ius.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID and ius.USER_STORY_UUID=:USER_STORY_UUID and ip.ASSOCIATION_TYPE in ( 'FEATURE' ) union SELECT ( SELECT CONCAT( pro.PROCESS_ID, ' - ', pro.PROCESS_NAME, ' , ', pg.PAGE_ID, ' - ', pg.PAGE_NAME, ' , ', ua.USER_ACTION_ID, ' - ', ua.USER_ACTION_NAME ) FROM PROCESS pro JOIN PROCESS_PAGE pp ON pro.PROCESS_UUID = pp.PROCESS_UUID JOIN PAGE pg ON pp.PAGE_UUID = pg.PAGE_UUID JOIN VIEW_USER_ACTION ua ON pro.PROCESS_UUID = ua.PROCESS_UUID AND pg.PAGE_UUID = ua.PAGE_UUID WHERE pp.PROCESS_UUID = pro.PROCESS_UUID AND pp.PAGE_UUID = pg.PAGE_UUID AND pro.PROCESS_UUID = ip.PROCESS_UUID AND pg.PAGE_UUID = ip.PAGE_UUID AND ua.USER_ACTION_UUID = ip.USER_ACTION_UUID limit 1 ) as RequirementTitle, ( SELECT CONCAT( REQUIREMENT_SET_ID, ' - ', REQUIREMENT_SET_NAME ) FROM REQUIREMENT_SET rs, REQUIREMENT r WHERE rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID AND r.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID limit 1 ) as RequirementGroup, ( SELECT CONCAT( REQUIREMENT_ID, ' - ', REQUIREMENT_TEXT ) FROM REQUIREMENT WHERE REQUIREMENT_UUID = tcr.REQUIREMENT_UUID limit 1 ) as RequirementName, ( SELECT CONCAT( CONDITION_SATISFACTION_ID, ' - ', CONDITION_SATISFACTION_NAME ) FROM CONDITION_SATISFACTION WHERE CONDITION_SATISFACTION_UUID = tcr.CONDITION_SATISFACTION_UUID limit 1 ) as ConditionOfSatisfaction, ip.ASSOCIATION_TYPE, ip.PROCESS_UUID, ip.PAGE_UUID, ip.USER_ACTION_UUID, tcr.REQUIREMENT_TITLE_UUID, tcr.REQUIREMENT_UUID, tcr.CONDITION_SATISFACTION_UUID, ip.FUNCTIONAL_AREA_UUID from TEST_CASE_REQUIREMENT tcr, TEST_CASE tc, IMPACTED_PROCESS ip, REQUIREMENT req, IMPACTED_USER_STORY ius where req.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID and tcr.IMPACTED_PROCESS_UUID = ip.IMPACTED_PROCESS_UUID and tc.TEST_CASE_UUID = tcr.TEST_CASE_UUID and tcr.TEST_CASE_UUID = ${testCaseId} and tcr.USER_ACTION_UUID = ${userActionId} and ius.REQUIREMENT_UUID = ip.REQUIREMENT_UUID and ius.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID and ius.USER_STORY_UUID=:USER_STORY_UUID and ip.ASSOCIATION_TYPE in ( 'PAGE-EVENT' )`;
    let allinkedTestCaseRequirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      allinkedTestCaseRequirementQuery,
      input
    );
    let htmlDescriptionData = groupedByTitleAndRequirement(allinkedTestCaseRequirementQueryData);
    testCase['Description'] = htmlDescriptionData;
  }
  msg.payload.result['mode'] = 'Enable Message';
  objectData['Test Case'] = generateExcelData(testCaseImpactedUserStoryQueryData, [
    'Object Type',
    'Unique ID',
    'Name',
    'Type',
    'Priority',
    'Method',
    'Last Build',
    'Last Run',
    'Work Product',
    'Description',
    'Notes',
    'Objective',
    'Pre Conditions',
    'Validation Input',
    'Validation Expected Result',
    'Post Conditions',
  ]);
  msg.payload.result.documentData = msg.payload.result.documentData || {};
  objectData = objectData || {};
  Object.assign(msg.payload.result.documentData, objectData);
  msg.payload.result.message = 'Document Downloaded';
  node.send(msg);
} catch (t) {
  console.log('Errorr Occured', t.message);
  return;
}
