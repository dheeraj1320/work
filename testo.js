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
input[0]['showMessage'] = '';
input[0]['isErrorOccured'] = false;
input[0]['TEST_RUN_START_TIME'] = new Date();
input[0]['RUN_TRIGGER_TYPE'] = 'Manual';
input[0]['RUN_AUTOMATION_TYPE'] = 'WebApp';
input[0]['TEST_RUN_STATUS'] = 'In-Queue';
const sourceType = input[0]['SOURCE_TYPE'];
input[0]['RUN_AUTOMATION_SOURCE_TYPE'] = sourceType;
let runQuery = '';
let testSetIds = '';
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
        runQuery = `SELECT * FROM TEST_CASE_STEP tcs JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID WHERE tc.TEST_CASE_EXECUTON_TYPE='Automated' AND tc.TEST_SET_UUID=:TEST_SET_UUID; `;
        testSetIds = `'${input[0]['TEST_SET_UUID']}'`;
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
        runQuery = `SELECT * FROM TEST_CASE_STEP tcs JOIN TEST_CASE tc ON tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID WHERE tc.TEST_CASE_EXECUTON_TYPE='Automated' AND tc.TEST_SET_UUID in (${testSetID}); `;
        testSetIds = testSetID;
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
        runQuery = `select * from TEST_CASE_STEP tscp, TEST_CASE tc, TEST_CASE_REQUIREMENT tcr where tscp.TEST_CASE_UUID=tc.TEST_CASE_UUID and tc.TEST_CASE_UUID=tcr.TEST_CASE_UUID and REQUIREMENT_TITLE_UUID=:FEATURE_UUID and tc.TEST_CASE_EXECUTON_TYPE='Automated'; `;
        let testSetIdsDataFeature = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', runQuery, input[0]);
        let testSetID_Feature= '';
        if (testSetIdsDataFeature && testSetIdsDataFeature.length) {
            testSetID_Feature = [...new Set(testSetIdsDataFeature.map(item => item.TEST_SET_UUID).filter(isValidUUID))].map(uuid => `'${uuid}'`).join(', ');
        }
        testSetIds = testSetID_Feature;
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
                input[0]['showMessage'] = 'Cannot perform this action! There are no Automated Test Cases to be executed.';
                break;
            case 'FUNCTION':
                input[0]['showMessage'] = 'Cannot perform this action! There are no Function Step to be executed.';
                break;
            case 'NAVIGATION_STEPS':
                input[0]['showMessage'] = 'Cannot perform this action! There are no Navigation Step to be executed.';
                break;
            default:
                input[0]['showMessage'] = 'Cannot perform this action! There are no Automated Test Cases to be executed.';
        }
        input[0]['isErrorOccured'] = true;
    }
    let testRunQuery = `SELECT * FROM TEST_RUN WHERE TEST_RUN_STATUS = 'Running'`;
    let testRunQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testRunQuery, input[0]);
    if (testRunQueryData && testRunQueryData.length > 9) {
        input[0]['showMessage'] = 'All Automation Agents are busy serving other Test Run Request. Please try after some time.';
        input[0]['isErrorOccured'] = true;
    }
    if (testSetIds) {
        let testcaseQuery = `SELECT count(*) as count FROM TEST_CASE WHERE TEST_CASE_EXECUTON_TYPE = 'Automated' AND TEST_SET_UUID in (${testSetIds})`;
        let testcaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testcaseQuery, input[0]);
        if (testcaseQueryData && testcaseQueryData[0]['count'] == '0' ) {
            input[0]['showMessage'] = 'Cannot perform this action! There are no automated test cases to be executed.';
            input[0]['isErrorOccured'] = true;
        }
    }

}
