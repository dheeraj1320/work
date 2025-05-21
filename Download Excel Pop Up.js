input[0]['IS_DISPLAY_AUTOMATION_TYPE_FIELD'] = 'No';
input[0]['showMessage'] = '';
input[0]['isErrorOccured'] = false;
const sourceType = input[0]['SOURCE_TYPE'];
let runQuery = '';


if (['Orphan Test Set', 'Unit Functional Test Set', 'Test Set'].includes(input[0]['GRID_NAME'])) {
    let testCaseQuery = `SELECT TEST_CASE_EXECUTON_TYPE FROM TEST_CASE,TEST_SET WHERE TEST_CASE.TEST_SET_UUID=TEST_SET.TEST_SET_UUID AND TEST_CASE.TEST_SET_UUID=:TEST_SET_UUID AND TEST_CASE.TEST_CASE_EXECUTON_TYPE in('Automated','Recorded') AND TEST_CASE.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY TEST_CASE_SEQ_ID asc`;
    let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input[0]);
    const filteredAutomationData = testCaseQueryData.filter(item => item.TEST_CASE_EXECUTON_TYPE === "Automated");
    const filteredRecordedData = testCaseQueryData.filter(item => item.TEST_CASE_EXECUTON_TYPE === "Recorded");
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
else if(['Feature Test Set'].includes(input[0]['GRID_NAME'])){
   let testCaseQuery = `SELECT TEST_CASE_EXECUTON_TYPE FROM TEST_CASE,TEST_SET,TEST_CASE_REQUIREMENT tcr WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID and TEST_CASE.TEST_CASE_UUID=tcr.TEST_CASE_UUID and tcr.REQUIREMENT_TITLE_UUID=:FEATURE_UUID and TEST_CASE.TEST_CASE_EXECUTON_TYPE in('Automated','Recorded') AND TEST_CASE.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY TEST_CASE_SEQ_ID asc`;
    let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input[0]);
    const filteredAutomationData = testCaseQueryData.filter(item => item.TEST_CASE_EXECUTON_TYPE === "Automated");
    const filteredRecordedData = testCaseQueryData.filter(item => item.TEST_CASE_EXECUTON_TYPE === "Recorded");
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

else if (['Test Suite'].includes(input[0]['GRID_NAME'])) {

    let fetchTestSetsIds = `select TEST_SET_UUID from TEST_SUITE_TEST_SET where TEST_SUITE_UUID=:TEST_SUITE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
    let testSetIdsData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fetchTestSetsIds, input[0]);

    let currentTagsIds = '';
    if (testSetIdsData && testSetIdsData.length) {
        currentTagsIds = testSetIdsData.map((item) => item['TEST_SET_UUID']).filter((id) => id !== null && id !== '').map((id) => `'` + id + `'`).join(',');
    }

    let testCaseQuery = `SELECT TEST_CASE_EXECUTON_TYPE FROM TEST_CASE WHERE TEST_CASE_EXECUTON_TYPE in('Automated','Recorded') AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND TEST_SET_UUID in(${currentTagsIds ? currentTagsIds : `''`})`;
    let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input[0]);

    const filteredAutomationData = testCaseQueryData.filter(item => item.TEST_CASE_EXECUTON_TYPE === "Automated");
    const filteredRecordedData = testCaseQueryData.filter(item => item.TEST_CASE_EXECUTON_TYPE === "Recorded");

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
        runQuery = `SELECT * FROM TEST_CASE_STEP WHERE TEST_SET_UUID=:TEST_SET_UUID; `;
        break;
    case 'FEATURE_TEST_SET':
        input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['TEST_SET_UUID'];
        runQuery = `select * from TEST_CASE_STEP tscp, TEST_CASE tc, TEST_CASE_REQUIREMENT tcr where tscp.TEST_CASE_UUID=tc.TEST_CASE_UUID and tc.TEST_CASE_UUID=tcr.TEST_CASE_UUID and REQUIREMENT_TITLE_UUID=:FEATURE_UUID; `;
        break;
    case 'PERSONAL_TEST_SET':
        input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['TEST_SET_UUID'];
        runQuery = `SELECT * FROM TEST_CASE_STEP WHERE TEST_SET_UUID=:TEST_SET_UUID; `;
        break;
    case 'FUNCTION':
        input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['FUNCTION_UUID'];
        runQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID; `;
        break;
    case 'TEST_SUITE':
        input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['TEST_SUITE_UUID'];
        let fetchTestSetsIds = `select TEST_SET_UUID from TEST_SUITE_TEST_SET where TEST_SUITE_UUID=:TEST_SUITE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_SUITE_TEST_SET_ID asc;`;
        let testSetIdsData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fetchTestSetsIds, input[0]);
        let testSetID = '';
        if (testSetIdsData && testSetIdsData.length) {
            testSetID = [...new Set(testSetIdsData.map(item => item.TEST_SET_UUID).filter(isValidUUID))].map(uuid => `'${uuid}'`).join(', ');
        }
        runQuery = `SELECT * FROM TEST_CASE_STEP WHERE TEST_SET_UUID in (${testSetID}); `;
        break;
    case 'MULTIPLE_TEST_SET':
        input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['TEST_SET_UUID'];
        let testSetList = input[0]['TEST_SET_UUID'].split(',');
        let testSetID1 = [...new Set(testSetList.map((item) => item).filter(isValidUUID))].map((uuid) => `'${uuid}'`).join(', ');
        runQuery = `SELECT * FROM TEST_CASE_STEP WHERE TEST_SET_UUID in (${testSetID1}); `;
        break;
    case 'NAVIGATION_STEPS':
        input[0]['RUN_AUTOMATION_SOURCE_UUID'] = input[0]['VIEW_UUID'];
        runQuery = `SELECT * FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID=:VIEW_UUID; `;
        break;
    default:
        break;
}

if (runQuery) {
    let runQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', runQuery, input[0]);
    if (runQueryData && runQueryData.length == 0) {
        switch (sourceType) {
            case 'TEST_CASE':
                input[0]['showMessage'] = 'Cannot Perfom Action! No Test Case Step Found ';
                break;
            case 'TEST_SET':
                input[0]['showMessage'] = 'Cannot Perfom Action! No Test Case Step Found ';
                break;
            case 'PERSONAL_TEST_SET':
                input[0]['showMessage'] = 'Cannot Perfom Action! No Test Case Step Found ';
                break;
            case 'FEATURE_TEST_SET':
                input[0]['showMessage'] = 'Cannot Perfom Action! No Test Case Step Found ';
                break;
            case 'FUNCTION':
                input[0]['showMessage'] = 'Cannot Perfom Action! No Function Step Found ';
                break;
            case 'TEST_SUITE':
                input[0]['showMessage'] = 'Cannot Perfom Action! No Test Case Step Found ';
                break;
            case 'MULTIPLE_TEST_SET':
                input[0]['showMessage'] = 'Cannot Perfom Action! No Test Case Step Found ';
                break;
            case 'NAVIGATION_STEPS':
                input[0]['showMessage'] = 'Cannot Perfom Action! No Navigation Step Found ';
                break;
            default:
                input[0]['showMessage'] = 'Cannot Perfom Action! No Step Found ';
        }
        input[0]['isErrorOccured'] = true;
    }
}
