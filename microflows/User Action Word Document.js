function formatDataToArray(nodes, parentKey = null, depth = 0, result = []) {
  nodes.forEach((node) => {
    if (node.parentNodeID === parentKey) {
      result.push(' '.repeat(depth) + node.title);
      if (node.children && node.children.length > 0) {
        formatDataToArray(node.children, node.primaryKey, depth + 1, result);
      }
    } else if (!node.parentNodeID) {
      result.push(' '.repeat(depth) + node.title);
      if (node.children && node.children.length > 0) {
        formatDataToArray(node.children, node.primaryKey, depth + 1, result);
      }
    }
  });
  return result;
}
function generateBusinessRequirement(requirements) {
  let businessRequirements = '';
  const combinedRequirements = {};
  requirements.forEach((req, i) => {
    let title = req['Requirement Title']
      ? 'BOLDTAG' + req['Requirement Title']
      : req['Requirement Sub-Title']
      ? 'BOLDTAG' + req['Requirement Sub-Title']
      : req['Requirement'];
    let subtitle = req['Requirement Sub-Title'] ? 'BOLDTAG' + req['Requirement Sub-Title'] : req['Requirement'];
    let requirement = req['Requirement Title'] ? (req['Requirement'] || '').trim() : '';
    let cos = req['Condition Of Satisfaction/Acceptance Criteria']
      ? req['Condition Of Satisfaction/Acceptance Criteria']
      : '';
    const typ = req['ASSOC_TYPE'] === 'Linked' ? ' - (Linked ' + req['TestCaseID'] + ')' : '';
    if (cos && typ) {
      cos = cos + ' ' + typ;
    } else if (!cos && requirement && typ) {
      requirement = requirement + ' ' + typ;
    } else if (!cos && !requirement && title && typ) {
      title = title + ' ' + typ;
    }
    let combinedEntry = `${requirement}$$2S${cos}`;
    if (combinedRequirements[title]) {
      combinedRequirements[title].push(combinedEntry);
    } else {
      combinedRequirements[title] = [combinedEntry];
    }
  });
  Object.keys(combinedRequirements).forEach((title) => {
    const entries = combinedRequirements[title];
    const combinedString = entries.join(`$$1S`);
    let businessRequirement = `${title}$$1S${combinedString}`;
    businessRequirements = `${businessRequirements}${businessRequirement}$$`;
  });
  businessRequirements = businessRequirements.replaceAll('2S', '                    ');
  businessRequirements = businessRequirements.replaceAll('1S', '          ');
  let businessRequirementList = businessRequirements.split('$$');
  let filteredList = businessRequirementList.filter(
    (item) => item !== null && item !== undefined && item.trim() !== ''
  );
  return filteredList;
}
msg.payload.result = {};
msg.payload.documentData = { documentHeader: '', documentDetails: [] };
let input =
  msg.payload.apiRequestBody.baseEntity && msg.payload.apiRequestBody.baseEntity.records[0]
    ? msg.payload.apiRequestBody.baseEntity.records[0]
    : msg.payload.apiRequestBody;
msg.payload.result.documentName = input.USER_ACTION_ID
  ? input.USER_ACTION_NAME
  : input.TEST_SET_NAME
  ? input.TEST_SET_NAME
  : 'User Action/Test Set';
AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
msg.payload.documentData.documentHeader = input['USER_ACTION_ID']
  ? 'User Action :' + input['USER_ACTION_ID'] + ' – ' + input['USER_ACTION_NAME']
  : input['TEST_SET_NAME']
  ? 'Test Set :' + input['TEST_SET_ID'] + ' – ' + input['TEST_SET_NAME']
  : 'Document';
let processDataQuery = `SELECT USER_ACTION_DESCRIPTION FROM USER_ACTION_LONGTEXT where USER_ACTION_UUID=:USER_ACTION_UUID`;
let processDataQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
  'PRIMARYSPRINGFM',
  processDataQuery,
  input
);
let headerMap = {};
headerMap['Header'] = '1. Introduction';
if (processDataQueryData.PROCESS_DESCRIPTION) {
  headerMap['ChildrenList'] = processDataQueryData.PROCESS_DESCRIPTION;
}
let processAttachmentQuery = `SELECT atcinfo.INFO_4 AS 'Attachment', atc.ATCHD_FILE_NM as 'File_Name' FROM ATTACHMENT atc INNER JOIN ATTACHMENTINFO atcinfo ON atc.ATCHMT_ID = atcinfo.INFO_1 WHERE atc.TBL_RW_ID =:USER_ACTION_UUID AND atc.KEY_NM = 'USER_ACTION_UUID' AND atc.isDeleted = 0 order by atc.ATCHD_FILE_NM asc;`;
let processAttachmentQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
  'PRIMARYSPRINGFM',
  processAttachmentQuery,
  input
);
if (processAttachmentQueryData && processAttachmentQueryData.length > 0) {
  let attachmentArray = [];
  for (let attachment of processAttachmentQueryData) {
    if (
      !(
        attachment['File_Name'].endsWith('.png') ||
        attachment['File_Name'].endsWith('.jpeg') ||
        attachment['File_Name'].endsWith('.svg') ||
        attachment['File_Name'].endsWith('.jpg')
      )
    ) {
      let newAttachment = {};
      newAttachment[attachment['File_Name']] = attachment['Attachment'];
      attachmentArray.push(newAttachment);
    }
  }
  headerMap['LinkChildList'] = attachmentArray;
  headerMap['attachmentParentKeyList'] = [input.USER_ACTION_UUID];
}
msg.payload.documentData.documentDetails.push(headerMap);
let headerOneMap = {};
headerOneMap['Header'] = '2. Requirements ';
headerOneMap['ChildrenMapList'] = [];
let dataOneObject = {};
dataOneObject['ChildrenMap'] = [];
let innerCount = 1;
let busiReqUery = `SELECT rt.REQUIREMENT_TITLE AS 'Requirement Title', R.REQUIREMENT_TEXT AS 'Requirement', COS.CONDITION_SATISFACTION_NAME AS 'Condition Of Satisfaction/Acceptance Criteria', 'Linked' AS ASSOC_TYPE, CONCAT('TC - ', stepUser.TEST_CASE_ID) AS TestCaseID FROM TEST_CASE_REQUIREMENT tcr INNER JOIN TEST_CASE stepUser ON tcr.TEST_CASE_UUID = stepUser.TEST_CASE_UUID INNER JOIN TEST_SET ts ON ts.TEST_SET_UUID = stepUser.TEST_SET_UUID INNER JOIN IMPACTED_PROCESS ip ON stepUser.TEST_CASE_UUID = tcr.TEST_CASE_UUID LEFT JOIN REQUIREMENT_TITLE rt ON tcr.REQUIREMENT_TITLE_UUID = rt.REQUIREMENT_TITLE_UUID LEFT JOIN REQUIREMENT R ON R.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID LEFT JOIN CONDITION_SATISFACTION COS ON tcr.CONDITION_SATISFACTION_UUID = COS.CONDITION_SATISFACTION_UUID WHERE tcr.IMPACTED_PROCESS_UUID = ip.IMPACTED_PROCESS_UUID AND ts.USER_ACTION_UUID='${input['USER_ACTION_UUID']}' and ts.PROCESS_UUID='${input['PROCESS_UUID']}' UNION SELECT rt.REQUIREMENT_TITLE AS 'Requirement Title', R.REQUIREMENT_TEXT AS 'Requirement', COS.CONDITION_SATISFACTION_NAME AS 'Condition Of Satisfaction/Acceptance Criteria', 'Not Linked' AS ASSOC_TYPE, (SELECT CONCAT('TC - ', tca.TEST_CASE_ID) FROM TEST_CASE_REQUIREMENT tcrq JOIN TEST_CASE tca ON tcrq.TEST_CASE_UUID = tca.TEST_CASE_UUID AND tcrq.REQUIREMENT_UUID = R.REQUIREMENT_UUID) AS TestCaseID FROM IMPACTED_PROCESS process INNER JOIN TEST_SET tset ON tset.USER_ACTION_UUID = process.USER_ACTION_UUID LEFT JOIN REQUIREMENT R ON R.REQUIREMENT_UUID = process.REQUIREMENT_UUID LEFT JOIN REQUIREMENT_TITLE rt ON R.REQUIREMENT_ASSOCIATION_UUID = rt.REQUIREMENT_TITLE_UUID LEFT JOIN CONDITION_SATISFACTION COS ON process.CONDITION_SATISFACTION_UUID = COS.CONDITION_SATISFACTION_UUID WHERE tset.USER_ACTION_UUID='${input['USER_ACTION_UUID']}' and tset.PROCESS_UUID='${input['PROCESS_UUID']}' AND process.IMPACTED_PROCESS_UUID NOT IN (SELECT process.IMPACTED_PROCESS_UUID FROM IMPACTED_PROCESS process, TEST_CASE_REQUIREMENT tcr, TEST_CASE tc, TEST_SET ts WHERE process.IMPACTED_PROCESS_UUID = tcr.IMPACTED_PROCESS_UUID AND tcr.TEST_CASE_UUID = tc.TEST_CASE_UUID AND tc.TEST_SET_UUID = ts.TEST_SET_UUID AND ts.USER_ACTION_UUID='${input['USER_ACTION_UUID']}' and ts.PROCESS_UUID='${input['PROCESS_UUID']}');`;
let busiReqUeryDataList = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', busiReqUery, input);
if (busiReqUeryDataList.length > 0) {
  let businessReq = { HEADING3: '2.1 Feature Requirement' };
  businessReq['ChildrenList'] = generateBusinessRequirement(busiReqUeryDataList);
  dataOneObject['ChildrenMap'].push(businessReq);
  innerCount++;
}
let userActionTreeQuery = `SELECT USER_ACTION_REQUIREMENT_TREE FROM USER_ACTION_REQUIREMENT_TREE where USER_ACTION_UUID='${input['USER_ACTION_UUID']}'`;
let userActionTreeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
  'PRIMARYSPRINGFM',
  userActionTreeQuery,
  input
);
if (userActionTreeQueryData && userActionTreeQueryData.USER_ACTION_REQUIREMENT_TREE) {
  let pageEventReq = { HEADING3: '1.' + innerCount + ' Page-Event Requirement' };
  pageEventReq['ChildrenList'] = formatDataToArray(
    JSON.parse(userActionTreeQueryData.USER_ACTION_REQUIREMENT_TREE),
    null
  );
  dataOneObject['ChildrenMap'].push(pageEventReq);
  innerCount++;
}
headerOneMap['ChildrenMapList'].push(dataOneObject);
msg.payload.documentData.documentDetails.push(headerOneMap);
let headerTwoMap = {};
headerTwoMap['Header'] = '3. Implementation Details ';
headerTwoMap['ChildrenMapList'] = [];
let dataObject = {};
dataObject['ChildrenMap'] = [];
let inner_Count = 1;
let pseudoCodeQuery = `SELECT * FROM USER_ACTION_LONGTEXT where USER_ACTION_UUID='${input['USER_ACTION_UUID']}'`;
let pseudoCodeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
  'PRIMARYSPRINGFM',
  pseudoCodeQuery,
  input
);
if (pseudoCodeQueryData && pseudoCodeQueryData.USER_ACTION_PSEUDO_CODE) {
  let pseudoCode = { HEADING3: '3.' + inner_Count + ' Pseudo Code' };
  pseudoCode['ChildrenList'] = [];
  pseudoCode['ChildrenList'].push(pseudoCodeQueryData.USER_ACTION_PSEUDO_CODE);
  dataObject['ChildrenMap'].push(pseudoCode);
  inner_Count++;
}
if (pseudoCodeQueryData && pseudoCodeQueryData.USER_ACTION_TECH_IMPLEMENTATION_DETAIL) {
  let techCode = { HEADING3: '3.' + inner_Count + ' Technical Implementation Details' };
  techCode['ChildrenList'] = [];
  techCode['ChildrenList'].push(pseudoCodeQueryData.USER_ACTION_TECH_IMPLEMENTATION_DETAIL);
  dataObject['ChildrenMap'].push(techCode);
  inner_Count++;
}
headerTwoMap['ChildrenMapList'].push(dataObject);
msg.payload.documentData.documentDetails.push(headerTwoMap);
let testSetQuery = `SELECT tc.TEST_CASE_UUID FROM TEST_SET tsS, TEST_CASE tc where tc.TEST_SET_UUID = tsS.TEST_SET_UUID and USER_ACTION_UUID='${input['USER_ACTION_UUID']}' AND PROCESS_UUID=:PROCESS_UUID AND tsS.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
if (testSetQueryData && testSetQueryData.length > 0) {
  let headerTestCase = {};
  headerTestCase['Header'] = '4. Test Cases';
  headerTestCase['ChildrenMapList'] = [];
  let testCaseIds = [...new Set(testSetQueryData.map((item) => `'${item.TEST_CASE_UUID}'`))].join(',');
  const paramsPattern = /[^{}]+(?=})/g;
  let testCaseQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_SEQ_ID as 'Test Case Seq ID',TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,TEST_CASE_UUID as 'Test Case UUID', TEST_CASE_EXECUTON_TYPE as 'Test Case Execution Type' FROM TEST_CASE,TEST_SET WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID and TEST_CASE.TEST_CASE_UUID in (${testCaseIds}) order by TEST_CASE_SEQ_ID asc`;
  let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
  let testCaseStepNormalQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step ID', tcs.TEST_CASE_STEP_SEQ_ID AS 'Test Case Step Seq ID', tcs.TEST_CASE_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', tcs.TEST_CASE_STEP_UUID AS 'Test Case Step UUID', tcs.TEST_CASE_STEP_ATTRIBUTE_KEYS AS 'ATTRIBUTE_KEYS', tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts, STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tc.TEST_CASE_UUID in (${testCaseIds}) AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND ((tcs.IS_PURE_NAVIGATION_STEP = 'No' OR tcs.IS_PURE_NAVIGATION_STEP is null ) OR (tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM VIEW_NAVIGATION_STEP vns JOIN PAGE_VIEW pv ON pv.VIEW_UUID = vns.VIEW_UUID WHERE pv.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT))) ORDER BY tcs.TEST_CASE_STEP_ID , tcs.TEST_CASE_STEP_SEQ_ID ASC;`;
  let testCaseStepNormalQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseStepNormalQuery,
    input
  );
  let testCaseNavigationStepQuery = `SELECT ts.TEST_SET_ID AS 'Test Set ID', tc.TEST_CASE_ID AS 'Test Case ID', CONCAT( tcs.TEST_CASE_STEP_SEQ_ID, '-', vns.VIEW_NAVIGATION_STEP_SEQ_ID ) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', vns.VIEW_NAVIGATION_STEP_ATTRIBUTE_KEYS AS 'ATTRIBUTE_KEYS', tc.TEST_CASE_UUID as 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW view, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcs.CURRENT_PAGE_CONTEXT = view.PAGE_UUID AND view.VIEW_UUID = vns.VIEW_UUID AND tc.TEST_CASE_UUID in (${testCaseIds}) AND tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcs.IS_FUNCTION_STEP = 'No' AND tcs.IS_PURE_NAVIGATION_STEP = 'Yes' AND EXISTS( SELECT 1 FROM VIEW_NAVIGATION_STEP vns JOIN PAGE_VIEW pv ON pv.VIEW_UUID = vns.VIEW_UUID WHERE pv.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT ) ORDER BY vns.VIEW_NAVIGATION_STEP_ID, vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseNavigationStepQuery,
    input
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseNavigationStepQueryData);
  let testCaseFunctionStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat(TEST_CASE_STEP_SEQ_ID ,'-',TEST_CASE_FUNCTION_STEP_SEQ_ID) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_FUNCTION_STEP_TYPE as 'Test Case Step Type', '' as 'Test Case Step Name', TEST_CASE_FUNCTION_STEP_UUID as 'Test Case Step UUID',TEST_CASE_FUNCTION_STEP_ATTRIBUTE_KEYS as 'ATTRIBUTE_KEYS',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and tc.TEST_CASE_UUID in (${testCaseIds}) and tcs.IS_FUNCTION_STEP = 'Yes' and tcs.IS_UI_ELEMENT_GROUP_STEP = 'No' and tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND ((tcfs.IS_PURE_NAVIGATION_STEP = 'No' OR tcfs.IS_PURE_NAVIGATION_STEP is null ) OR (tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND NOT EXISTS( SELECT 1 FROM VIEW_NAVIGATION_STEP vns JOIN PAGE_VIEW pv ON pv.VIEW_UUID = vns.VIEW_UUID WHERE pv.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT))) ORDER BY TEST_CASE_STEP_ID, TEST_CASE_FUNCTION_STEP_ID asc`;
  let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseFunctionStepQuery,
    input
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionStepQueryData);
  let testCaseFunctionNavigationStepQuery = `SELECT TEST_SET_ID AS 'Test Set ID', TEST_CASE_ID AS 'Test Case ID', CONCAT(TEST_CASE_STEP_SEQ_ID,'-',TEST_CASE_FUNCTION_STEP_SEQ_ID,'-',vns.VIEW_NAVIGATION_STEP_SEQ_ID) AS 'Test Case Step ID', vns.VIEW_NAVIGATION_STEP_SEQ_ID AS 'Test Case Step Seq ID', vns.VIEW_NAVIGATION_STEP_TYPE AS 'Test Case Step Type', '' AS 'Test Case Step Name', vns.VIEW_NAVIGATION_STEP_UUID AS 'Test Case Step UUID', vns.VIEW_NAVIGATION_STEP_ATTRIBUTE_KEYS AS 'ATTRIBUTE_KEYS', tc.TEST_CASE_UUID AS 'Test Case UUID' FROM VIEW_NAVIGATION_STEP vns, PAGE_VIEW pv, TEST_CASE_FUNCTION_STEP tcfs, STEP_DEFINITION_TEMPLATE_VERBIAGE tcsd, TEST_CASE_STEP tcs, TEST_CASE tc, TEST_SET ts WHERE ts.TEST_SET_UUID = tcs.TEST_SET_UUID AND tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID AND tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID AND vns.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcsd.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID AND tc.TEST_CASE_UUID in (${testCaseIds}) AND tcfs.CURRENT_PAGE_CONTEXT = pv.PAGE_UUID AND pv.VIEW_UUID = vns.VIEW_UUID AND tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' AND tcfs.IS_PURE_NAVIGATION_STEP = 'Yes' AND EXISTS( SELECT 1 FROM VIEW_NAVIGATION_STEP vns JOIN PAGE_VIEW view ON view.VIEW_UUID = vns.VIEW_UUID WHERE view.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT) ORDER BY vns.VIEW_NAVIGATION_STEP_ID , vns.VIEW_NAVIGATION_STEP_SEQ_ID ASC;`;
  let testCaseFunctionNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseFunctionNavigationStepQuery,
    input
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionNavigationStepQueryData);
  let testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat(TEST_CASE_STEP_SEQ_ID ,'-',TEST_CASE_FUNCTION_STEP_SEQ_ID,'-',TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type','' as 'Test Case Step Name', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID',TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS as 'ATTRIBUTE_KEYS',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and tcfs.TEST_CASE_FUNCTION_STEP_UUID = tcfuegs.TEST_CASE_FUNCTION_STEP_UUID and tc.TEST_CASE_UUID in (${testCaseIds}) and tcs.IS_FUNCTION_STEP = 'Yes' and tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID asc, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseFunctionUIElementGroupStepQuery,
    input
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseFunctionUIElementGroupStepQueryData);
  let testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat(TEST_CASE_STEP_SEQ_ID ,'-',TEST_CASE_UI_ELEMENT_GROUP_STEP_ID) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type','' as 'Test Case Step Name', TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID',TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS as 'ATTRIBUTE_KEYS',tc.TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE_STEP tcs, TEST_CASE_UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcuegs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and tc.TEST_CASE_UUID in (${testCaseIds}) and tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID, TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
  let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseUIElementGroupStepQuery,
    input
  );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(testCaseUIElementGroupStepQueryData);
  for (let data of testCaseStepNormalQueryData) {
    if (data && data['ATTRIBUTE_KEYS']) {
      let attributeKeysList = data['ATTRIBUTE_KEYS'] ? JSON.parse(data['ATTRIBUTE_KEYS']) : [];
      let inputStepType = data['Test Case Step Type'];
      let firstIndexValue = attributeKeysList.shift();
      let firstKeyValue = firstIndexValue ? firstIndexValue.match(paramsPattern) : [];
      let stepDefinitionVerbiageList = firstKeyValue.length ? firstKeyValue[0].split('@#$') : [];
      let stepDefTemplateVerbiageName = '';
      if (stepDefinitionVerbiageList.length) {
        const stepDefTemplateVerbiageQuery = `SELECT STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME FROM STEP_DEFINITION_TEMPLATE_VERBIAGE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID in(${stepDefinitionVerbiageList[1]})`;
        let stepDefTemplateVerbiageQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
          `PRIMARYSPRINGFM`,
          stepDefTemplateVerbiageQuery,
          input
        );
        stepDefTemplateVerbiageName = stepDefTemplateVerbiageQueryData['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'];
        if (attributeKeysList && attributeKeysList.length) {
          for (let attribute of attributeKeysList) {
            let extractParams = attribute.match(paramsPattern);
            let keyValue = extractParams[0].split('@#$');
            switch (keyValue[0]) {
              case 'PageName':
                {
                  const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                    `PRIMARYSPRINGFM`,
                    pageNewQuery,
                    input
                  );
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name>', function () {
                    return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
                  });
                }
                break;
              case 'UIElementName':
                {
                  const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                    `PRIMARYSPRINGFM`,
                    uiElementQuery,
                    input
                  );
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element Name>',
                    function () {
                      return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                    }
                  );
                }
                break;
              case 'UIElementType':
                {
                  const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID in(${keyValue[1]})`;
                  let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                    `PRIMARYSPRINGFM`,
                    uiElementTypeQuery,
                    input
                  );
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element Type>',
                    function () {
                      return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
                    }
                  );
                }
                break;
              case 'UIElementValue':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element Value>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
              case 'KeyNameinKeypad':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Key Name in Keypad>',
                    function () {
                      return keyValue[1];
                    }
                  );
                }
                break;
              case 'EventType':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Event Type>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
              case 'ConfirmUIElementValue':
                stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                  '<Confirm UI Element Value>',
                  keyValue[1]
                    ? function () {
                        return keyValue[1];
                      }
                    : `' '`
                );
                break;
              case 'FunctionName':
                {
                  const functionNameQuery = `SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in(${keyValue[1]})`;
                  let functionNameQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                    `PRIMARYSPRINGFM`,
                    functionNameQuery,
                    input
                  );
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Function Name>', function () {
                    return `'` + functionNameQueryData['FUNCTION_NAME'] + `'`;
                  });
                }
                break;
              case 'UIElementName1':
                {
                  const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                    `PRIMARYSPRINGFM`,
                    uiElementQuery,
                    input
                  );
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element Name 1>',
                    function () {
                      return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                    }
                  );
                }
                break;
              case 'UIElementValue1':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element Value 1>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
              case 'UserActionName':
                {
                  const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                    `PRIMARYSPRINGFM`,
                    uiElementQuery,
                    input
                  );
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<User Action Name>',
                    function () {
                      return `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`;
                    }
                  );
                }
                break;
              case 'UserActionType':
                {
                  const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID in(${keyValue[1]})`;
                  let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                    `PRIMARYSPRINGFM`,
                    uiElementTypeQuery,
                    input
                  );
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<User Action Type>',
                    function () {
                      return `'` + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + `'`;
                    }
                  );
                }
                break;
              case 'UIElementGroupName':
                {
                  let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP WHERE UI_ELEMENT_GROUP_UUID in(${keyValue[1]}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let uiElementGroupStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                    'PRIMARYSPRINGFM',
                    uiElementGroupStepQuery,
                    input
                  );
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element Group Name>',
                    function () {
                      return `'` + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + `'`;
                    }
                  );
                }
                break;
              case 'PageNumber':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Page Number>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
              case 'DataKey':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Key>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
              case 'DataValue':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Data Value>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
              case 'FileName':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<File Name>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
              case 'DocumentParserName':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Document Parser Name>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
              case 'APIName':
                {
                  const apiQuery = `SELECT API_ID,API_NAME FROM API_NEW WHERE API_UUID in(${keyValue[1]}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let apiQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                    `PRIMARYSPRINGFM`,
                    apiQuery,
                    input
                  );
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<API Name>', function () {
                    return `'` + apiQueryData['API_NAME'] + `'`;
                  });
                }
                break;
              case 'APIAttributeName':
                {
                  const apiAttributeQuery = `SELECT ATTRIBUTE_ID,ATTRIBUTE_NAME FROM API_ATTRIBUTE WHERE API_ATTRIBUTE_UUID in(${keyValue[1]}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let apiAttributeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                    `PRIMARYSPRINGFM`,
                    apiAttributeQuery,
                    input
                  );
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<API Attribute Name>',
                    function () {
                      return `'` + apiAttributeQueryData['ATTRIBUTE_NAME'] + `'`;
                    }
                  );
                }
                break;
              case 'APIAttributeValue':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<API Attribute Value>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
              case 'ResponseStatusCode':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Response Status Code>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
              case 'PageName1':
                {
                  const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
                    `PRIMARYSPRINGFM`,
                    pageNewQuery,
                    input
                  );
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll('<Page Name 1>', function () {
                    return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
                  });
                }
                break;
              case 'UIElementState':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<UI Element State>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
              case 'Timeout':
                {
                  stepDefTemplateVerbiageName = stepDefTemplateVerbiageName.replaceAll(
                    '<Timeout>',
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                }
                break;
            }
          }
        }
      }
      let getKeywordByStepType =
        inputStepType === 'Pre Condition'
          ? 'Given '
          : inputStepType === 'User Input'
          ? 'When '
          : inputStepType === 'Expected Result'
          ? 'Then '
          : '';
      data['Test Case Step Name'] = stepDefinitionVerbiageList.length
        ? getKeywordByStepType + stepDefTemplateVerbiageName
        : '';
      delete data['ATTRIBUTE_KEYS'];
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
  let requirementQuery = `SELECT tc.TEST_CASE_UUID AS 'Test Case UUID', rt.REQUIREMENT_TITLE AS 'Requirement Title',R.REQUIREMENT_TEXT as 'Requirement', COS.CONDITION_SATISFACTION_NAME as 'Condition Of Satisfaction/Acceptance Criteria' FROM TEST_CASE tc INNER JOIN TEST_CASE_REQUIREMENT tcr ON tc.TEST_CASE_UUID = tcr.TEST_CASE_UUID LEFT JOIN REQUIREMENT_TITLE rt ON tcr.REQUIREMENT_TITLE_UUID = rt.REQUIREMENT_TITLE_UUID LEFT JOIN REQUIREMENT R ON R.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID LEFT JOIN CONDITION_SATISFACTION COS ON tcr.CONDITION_SATISFACTION_UUID = COS.CONDITION_SATISFACTION_UUID WHERE tc.TEST_CASE_UUID in (${testCaseIds}) AND tc.FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let requirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    requirementQuery,
    input
  );
  let testCaseDescriptionQuery = `SELECT tc.TEST_CASE_UUID AS 'Test Case UUID', tcd.TEST_CASE_DESCRIPTION_DATA, tcd.TEST_CASE_PRE_CONDITION, tcd.TEST_CASE_USER_INPUT, tcd.TEST_CASE_EXPECTED_RESULT, tcd.TEST_CASE_ACTUAL_RESULT FROM TEST_CASE tc INNER JOIN TEST_CASE_DESCRIPTION tcd ON tc.TEST_CASE_UUID = tcd.TEST_CASE_UUID WHERE tc.TEST_CASE_UUID in (${testCaseIds});`;
  let testCaseDescriptionQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseDescriptionQuery,
    input
  );
  let testCaseAttachmentQuery = `SELECT tc.TEST_CASE_UUID AS 'Test Case UUID', atcinfo.INFO_4 AS 'Attachment', atc.ATCHD_FILE_NM as 'File_Name' FROM TEST_CASE tc INNER JOIN ATTACHMENT atc ON tc.TEST_CASE_UUID = atc.TBL_RW_ID INNER JOIN ATTACHMENTINFO atcinfo ON atc.ATCHMT_ID = atcinfo.INFO_1 WHERE tc.TEST_CASE_UUID in (${testCaseIds}) AND atc.KEY_NM = 'TEST_CASE_UUID' AND atc.isDeleted = 0 order by atc.ATCHD_FILE_NM asc;`;
  let testCaseAttachmentQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    testCaseAttachmentQuery,
    input
  );
  testCaseQueryData.map((testCaseDetail, i) => {
    let parentKeyList = [];
    parentKeyList.push(testCaseDetail['Test Case UUID']);
    let dataObject1 = {};
    let testCaseStepNameArray = [];
    let testCaseDescriptionArray = [];
    let preConditionpArray = [];
    let userInputpArray = [];
    let exectedResultpArray = [];
    let actulResultArray = [];
    var attachmentArray = [];
    let reqNameArray = [];
    dataObject1['HEADING2'] =
      '4' +
      '.' +
      (i + 1) +
      ' TS' +
      testCaseDetail['Test Set ID'] +
      ' - TC' +
      testCaseDetail['Test Case ID'] +
      ' : ' +
      testCaseDetail['Test Case Name'];
    dataObject1['ChildrenMap'] = [];
    for (let testCaseStepDetail of testCaseStepNormalQueryData) {
      if (testCaseDetail['Test Case UUID'] == testCaseStepDetail['Test Case UUID']) {
        testCaseStepNameArray.push(testCaseStepDetail['Test Case Step Name']);
      }
    }
    for (let attachment of testCaseAttachmentQueryData) {
      if (
        testCaseDetail['Test Case UUID'] == attachment['Test Case UUID'] &&
        !(
          attachment['File_Name'].endsWith('.png') ||
          attachment['File_Name'].endsWith('.jpeg') ||
          attachment['File_Name'].endsWith('.svg') ||
          attachment['File_Name'].endsWith('.jpg')
        )
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
      }
    }
    for (let req of requirementQueryData) {
      if (testCaseDetail['Test Case UUID'] == req['Test Case UUID']) {
        reqNameArray.push(req);
      }
    }
    let dataIndex = 1;
    if (reqNameArray && reqNameArray.length > 0) {
      let subObjectREQ = { HEADING3: dataIndex + '. Linked Requirement' };
      subObjectREQ['ChildrenList'] = generateBusinessRequirement(reqNameArray);
      dataObject1['ChildrenMap'].push(subObjectREQ);
      dataIndex++;
    }
    if (testCaseDescriptionArray && testCaseDescriptionArray.length > 0) {
      let subObjectDesc = { HEADING3: dataIndex + '. Test Case Description' };
      subObjectDesc['ChildrenList'] = testCaseDescriptionArray;
      dataObject1['ChildrenMap'].push(subObjectDesc);
      dataIndex++;
    }
    if (preConditionpArray && preConditionpArray.length > 0) {
      let subObjectPreConditon = { HEADING3: dataIndex + '. Pre Condition' };
      subObjectPreConditon['ChildrenList'] = preConditionpArray;
      dataObject1['ChildrenMap'].push(subObjectPreConditon);
      dataIndex++;
    }
    if (userInputpArray && userInputpArray.length > 0) {
      let subObjectUserInput = { HEADING3: dataIndex + '. User Input' };
      subObjectUserInput['ChildrenList'] = userInputpArray;
      dataObject1['ChildrenMap'].push(subObjectUserInput);
      dataIndex++;
    }
    if (exectedResultpArray && exectedResultpArray.length > 0) {
      let subObjectExpectedResult = { HEADING3: dataIndex + '. Expected Result' };
      subObjectExpectedResult['ChildrenList'] = exectedResultpArray;
      dataObject1['ChildrenMap'].push(subObjectExpectedResult);
      dataIndex++;
    }
    if (actulResultArray && actulResultArray.length > 0) {
      let subObjectActualResult = { HEADING3: dataIndex + '. Actual Result' };
      subObjectActualResult['ChildrenList'] = actulResultArray;
      dataObject1['ChildrenMap'].push(subObjectActualResult);
      dataIndex++;
    }
    if (testCaseStepNameArray && testCaseStepNameArray.length > 0) {
      let subObjectStep = { HEADING3: dataIndex + '. Test Case Steps' };
      subObjectStep['ChildrenList'] = testCaseStepNameArray;
      dataObject1['ChildrenMap'].push(subObjectStep);
      dataIndex++;
    }
    if (testCaseAttachmentQueryData && testCaseAttachmentQueryData.length > 0) {
      let subObjectAttachment = { HEADING3: dataIndex + '. Attachments' };
      subObjectAttachment['LinkChildList'] = attachmentArray;
      subObjectAttachment['attachmentParentKeyList'] = parentKeyList;
      dataObject1['ChildrenMap'].push(subObjectAttachment);
      dataIndex++;
    }
    headerTestCase['ChildrenMapList'].push(dataObject1);
  });
  msg.payload.documentData.documentDetails.push(headerTestCase);
}
msg.payload.result.message = 'Document Downloaded';
msg.payload.templateFile = '';
node.send(msg);
