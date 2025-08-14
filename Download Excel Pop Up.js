input[0]['IS_DISPLAY_AUTOMATION_TYPE_FIELD'] = 'No';
input[0]['showMessage'] = '';
input[0]['isErrorOccured'] = false;
const sourceType = input[0]['SOURCE_TYPE'];
let runQuery = '';
let testCaseIds = '';
let testSetIds = '';
let testCaseQueryData;
debugger;

if (input[0]['CREATE_ZIP'] && input[0]['CREATE_ZIP'].toUpperCase().trim() === 'NO') {
  input[0]['OUTPUT_MODE'] = 'NO_ZIP';
} else if (input[0]['CREATE_ZIP'] && input[0]['CREATE_ZIP'].toUpperCase().trim() === 'YES') {
  const attachImage = input[0]['ATTACH_IMAGE']?.toLowerCase().trim();
  input[0]['OUTPUT_MODE'] = attachImage === 'all test cases' ? 'ZIP_ALL' : 'ZIP_FAILED';
}

if (['Orphan Test Set', 'Unit Functional Test Set', 'Test Set', 'Page Navigation Test Set', 'User Story Test Set', 'API Test Set'].includes(input[0]['GRID_NAME'])) {
  let testCaseQuery;
  if (input[0]['GRID_NAME'] == 'User Story Test Set') {
    testCaseQuery = `SELECT TEST_CASE_UUID, TEST_CASE_EXECUTON_TYPE FROM TEST_CASE WHERE USER_STORY_UUID LIKE '%${input[0]['TEST_SET_USER_STORY_UUID']}%'`;
  } else {
    testCaseQuery = `SELECT TEST_CASE_EXECUTON_TYPE FROM TEST_CASE WHERE TEST_SET_UUID = :TEST_SET_UUID AND TEST_CASE_EXECUTON_TYPE IN ('Automated', 'Recorded') AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY TEST_CASE_SEQ_ID ASC`;
  }

  testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input[0]);
  const filteredAutomationData = testCaseQueryData.filter((item) => item.TEST_CASE_EXECUTON_TYPE === 'Automated');
  const filteredRecordedData = testCaseQueryData.filter((item) => item.TEST_CASE_EXECUTON_TYPE === 'Recorded');
  if (filteredAutomationData && filteredAutomationData.length && filteredRecordedData && filteredRecordedData.length) {
    input[0]['IS_DISPLAY_AUTOMATION_TYPE_FIELD'] = 'Yes';
  } else if (filteredAutomationData && filteredAutomationData.length) {
    input[0]['IS_DISPLAY_AUTOMATION_TYPE_FIELD'] = 'No';
    input[0]['AUTOMATION_TYPE'] = 'Automated';
  } else if (filteredRecordedData && filteredRecordedData.length) {
    input[0]['IS_DISPLAY_AUTOMATION_TYPE_FIELD'] = 'No';
    input[0]['AUTOMATION_TYPE'] = 'Recorded';
  }
} else if (['Feature Test Set'].includes(input[0]['GRID_NAME'])) {
  let testCaseQuery = `SELECT TEST_CASE_EXECUTON_TYPE FROM TEST_CASE,TEST_SET,TEST_CASE_REQUIREMENT tcr WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID and TEST_CASE.TEST_CASE_UUID=tcr.TEST_CASE_UUID and tcr.REQUIREMENT_TITLE_UUID=:FEATURE_UUID and TEST_CASE.TEST_CASE_EXECUTON_TYPE in('Automated','Recorded') AND TEST_CASE.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY TEST_CASE_SEQ_ID asc`;
  testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input[0]);
  const filteredAutomationData = testCaseQueryData.filter((item) => item.TEST_CASE_EXECUTON_TYPE === 'Automated');
  const filteredRecordedData = testCaseQueryData.filter((item) => item.TEST_CASE_EXECUTON_TYPE === 'Recorded');
  if (filteredAutomationData && filteredAutomationData.length && filteredRecordedData && filteredRecordedData.length) {
    input[0]['IS_DISPLAY_AUTOMATION_TYPE_FIELD'] = 'Yes';
  } else if (filteredAutomationData && filteredAutomationData.length) {
    input[0]['IS_DISPLAY_AUTOMATION_TYPE_FIELD'] = 'No';
    input[0]['AUTOMATION_TYPE'] = 'Automated';
  } else if (filteredRecordedData && filteredRecordedData.length) {
    input[0]['IS_DISPLAY_AUTOMATION_TYPE_FIELD'] = 'No';
    input[0]['AUTOMATION_TYPE'] = 'Recorded';
  }
} else if (['Test Suite'].includes(input[0]['GRID_NAME'])) {
  let fetchTestSetsIds = `select TEST_SET_UUID from TEST_SUITE_TEST_SET where TEST_SUITE_UUID=:TEST_SUITE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
  let testSetIdsData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fetchTestSetsIds, input[0]);

  let currentTagsIds = '';
  if (testSetIdsData && testSetIdsData.length) {
    currentTagsIds = testSetIdsData
      .map((item) => item['TEST_SET_UUID'])
      .filter((id) => id !== null && id !== '')
      .map((id) => `'` + id + `'`)
      .join(',');
  }

  let testCaseQuery = `SELECT TEST_CASE_EXECUTON_TYPE FROM TEST_CASE WHERE TEST_CASE_EXECUTON_TYPE in('Automated','Recorded') AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND TEST_SET_UUID in(${
    currentTagsIds ? currentTagsIds : `''`
  })`;
  testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input[0]);

  const filteredAutomationData = testCaseQueryData.filter((item) => item.TEST_CASE_EXECUTON_TYPE === 'Automated');
  const filteredRecordedData = testCaseQueryData.filter((item) => item.TEST_CASE_EXECUTON_TYPE === 'Recorded');

  if (filteredAutomationData && filteredAutomationData.length && filteredRecordedData && filteredRecordedData.length) {
    input[0]['IS_DISPLAY_AUTOMATION_TYPE_FIELD'] = 'Yes';
  } else if (filteredAutomationData && filteredAutomationData.length) {
    input[0]['IS_DISPLAY_AUTOMATION_TYPE_FIELD'] = 'No';
    input[0]['AUTOMATION_TYPE'] = 'Automated';
  } else if (filteredRecordedData && filteredRecordedData.length) {
    input[0]['IS_DISPLAY_AUTOMATION_TYPE_FIELD'] = 'No';
    input[0]['AUTOMATION_TYPE'] = 'Recorded';
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
switch (sourceType) {
  case 'TEST_CASE':
    input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['TEST_CASE_UUID'];
    runQuery = `SELECT * FROM TEST_CASE_STEP WHERE TEST_CASE_UUID=:TEST_CASE_UUID; `;
    break;
  case 'TEST_SET':
    input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['TEST_SET_UUID'];
    runQuery = `SELECT * FROM TEST_CASE_STEP tcs JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID WHERE tc.TEST_CASE_EXECUTON_TYPE='Automated' AND tc.TEST_SET_UUID=:TEST_SET_UUID; `;
    testSetIds = `'${input[0]['TEST_SET_UUID']}'`;
    break;
  case 'PERSONAL_TEST_SET':
    input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['TEST_SET_UUID'];
    runQuery = `SELECT * FROM TEST_CASE_STEP tcs JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID WHERE tc.TEST_CASE_EXECUTON_TYPE='Automated' AND tc.TEST_SET_UUID=:TEST_SET_UUID AND tc.TEST_CASE_STATUS='DRAFT'; `;
    testSetIds = `'${input[0]['TEST_SET_UUID']}'`;
    break;
  case 'FUNCTION':
    input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['FUNCTION_UUID'];
    runQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID; `;
    break;
  case 'TEST_SUITE':
    input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['TEST_SUITE_UUID'];
    let testSetID = '';
    let fetchTestSetsIds = `select TEST_SET_UUID from TEST_SUITE_TEST_SET where TEST_SUITE_UUID=:TEST_SUITE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_SUITE_TEST_SET_ID asc;`;
    let testSetIdsData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fetchTestSetsIds, input[0]);
    if (testSetIdsData && testSetIdsData.length) {
      testSetID = [...new Set(testSetIdsData.map((item) => item.TEST_SET_UUID).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ');

      if (input[0]['TEST_SUITE_TYPE'] == 'Release') {
        runQuery = `SELECT tc.* FROM TEST_CASE tc JOIN TEST_SET ts ON tc.USER_STORY_UUID LIKE CONCAT('%', ts.USER_STORY_UUID, '%') JOIN TEST_CASE_STEP tsc ON tc.TEST_CASE_UUID = tsc.TEST_CASE_UUID WHERE ts.TEST_SET_UUID in (${testSetID}) ORDER BY tc.TEST_CASE_SEQ_ID ASC;`;
      } else {
        runQuery = `SELECT * FROM TEST_CASE_STEP WHERE TEST_SET_UUID in (${testSetID}); `;
      }
    }

    break;
  case 'MULTIPLE_TEST_SET':
    input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['TEST_SET_UUID'];
    let testSetList = input[0]['TEST_SET_UUID'].split(',');
    let testSetID1 = [...new Set(testSetList.map((item) => item).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ');
    runQuery = `SELECT * FROM TEST_CASE_STEP tcs JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID WHERE tc.TEST_CASE_EXECUTON_TYPE='Automated' AND tc.TEST_SET_UUID in (${testSetID1}); `;
    testSetIds = testSetID1;
    break;
  case 'NAVIGATION_STEPS':
    input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['VIEW_UUID'];
    runQuery = `SELECT * FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID=:VIEW_UUID; `;
    break;
  case 'FEATURE_TEST_SET':
    input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['TEST_SET_UUID'];
    let featureTestCaseQuery = `select tc.TEST_CASE_UUID from TEST_CASE tc, TEST_CASE_REQUIREMENT tcr where tc.TEST_CASE_UUID=tcr.TEST_CASE_UUID and REQUIREMENT_TITLE_UUID=:FEATURE_UUID and tc.TEST_CASE_EXECUTON_TYPE='Automated'; `;
    let testSetIdsDataFeature = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', featureTestCaseQuery, input[0]);
    testCaseIds = "'" + testSetIdsDataFeature.map((data) => data.TEST_CASE_UUID).join("','") + "'";
    runQuery = `SELECT * FROM TEST_CASE_STEP WHERE TEST_CASE_UUID IN (${testCaseIds}); `;
    break;
  case 'USER_STORY_TEST_SET':
    input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['TEST_SET_UUID'];
    const testCaseQuery = `SELECT TEST_CASE_UUID FROM TEST_CASE WHERE TEST_CASE_EXECUTON_TYPE='Automated' AND USER_STORY_UUID LIKE '%${input[0].TEST_SET_USER_STORY_UUID}%'`;
    let tcQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input[0]);
    testCaseIds = "'" + tcQueryData.map((data) => data.TEST_CASE_UUID).join("','") + "'";
    runQuery = `SELECT * FROM TEST_CASE_STEP WHERE TEST_CASE_UUID IN (${testCaseIds}); `;
    break;
  default:
    throw new Error(`Unsupported SOURCE_TYPE: ${sourceType}`);
}

if (runQuery) {
  let runQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', runQuery, input[0]);
  if (runQueryData && runQueryData.length == 0) {
    switch (sourceType) {
      case 'TEST_CASE':
      case 'TEST_SET':
      case 'PERSONAL_TEST_SET':
      case 'FEATURE_TEST_SET':
      case 'TEST_SUITE':
      case 'MULTIPLE_TEST_SET':
      case 'USER_STORY_TEST_SET':
        input[0]['showMessage'] = 'Cannot perform this action! There are no Automated Test Case Step to be executed.';
        break;
      case 'FUNCTION':
        input[0]['showMessage'] = 'Cannot perform this action! There are no Function Step to be executed.';
        break;
      case 'NAVIGATION_STEPS':
        input[0]['showMessage'] = 'Cannot perform this action! There are no Navigation Step to be executed.';
        break;
      default:
        input[0]['showMessage'] = 'Cannot perform this action! There are no Automated Test Case Step to be executed.';
    }
    input[0]['isErrorOccured'] = true;
  }

  if (testSetIds) {
    let testcaseQuery = '';
    if (sourceType == 'TEST_SET') {
      testcaseQuery = `SELECT count(*) as count FROM TEST_CASE WHERE TEST_CASE_EXECUTON_TYPE = 'Automated' AND TEST_SET_UUID in (${testSetIds});`;
    } else if (sourceType == 'MULTIPLE_TEST_SET') {
      testcaseQuery = `SELECT count(*) as count FROM TEST_CASE WHERE TEST_CASE_EXECUTON_TYPE = 'Automated' AND TEST_SET_UUID in (${testSetIds});`;
    } else if (sourceType == 'PERSONAL_TEST_SET') {
      testcaseQuery = `SELECT count(*) as count FROM TEST_CASE WHERE TEST_CASE_EXECUTON_TYPE = 'Automated' AND TEST_SET_UUID in (${testSetIds}) AND TEST_CASE_STATUS='DRAFT'`;
    }

    let testcaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testcaseQuery, input[0]);
    if (testcaseQueryData && testcaseQueryData[0]['count'] == '0') {
      input[0]['showMessage'] = 'Cannot perform this action! There are no Automated Test Cases to be executed.';
      input[0]['isErrorOccured'] = true;
    }
  }

  if (testCaseIds) {
    let testcaseQuery = `SELECT count(*) as count FROM TEST_CASE WHERE TEST_CASE_EXECUTON_TYPE = 'Automated' AND TEST_CASE_UUID in (${testCaseIds})`;
    let testcaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testcaseQuery, input[0]);
    if (testcaseQueryData && testcaseQueryData[0]['count'] == '0') {
      input[0]['showMessage'] = 'Cannot perform this action! There are no Automated Test Cases to be executed.';
      input[0]['isErrorOccured'] = true;
    }
  }
}
