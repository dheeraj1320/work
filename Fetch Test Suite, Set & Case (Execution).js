try {
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let queryData = [];
  let input = Object.assign(msg.payload.apiRequestBody, msg.payload.referenceData);
  let selectQuery;

  if (input['PARENT_GRID_NAME'] == 'TEST_RUN') {
    console.log('running TEST_SUITE query ==================');
    selectQuery = `SELECT 'TEST_SUITE' AS GRID_NAME, ted.TEST_RUN_UUID, ts.TEST_SUITE_UUID, ts.TEST_SUITE_ID, ts.TEST_SUITE_NAME, ted.TEST_SUITE_EXECUTION_DATE, ROUND(ted.TEST_SUITE_DURATION / 1000.0, 3) AS TEST_SUITE_DURATION, ted.TEST_SUITE_EXECUTION_STATUS FROM TEST_EXECUTION_DETAIL ted JOIN TEST_SUITE ts ON ted.TEST_SUITE_UUID = ts.TEST_SUITE_UUID WHERE ted.TEST_RUN_UUID = :TEST_RUN_UUID GROUP BY ted.TEST_RUN_UUID, ts.TEST_SUITE_UUID, ts.TEST_SUITE_ID, ts.TEST_SUITE_NAME, ted.TEST_SUITE_EXECUTION_DATE, ted.TEST_SUITE_DURATION, ted.TEST_SUITE_EXECUTION_STATUS ORDER BY ted.TEST_SUITE_EXECUTION_DATE ASC;`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
    const filteredData = queryData.map((data) => {
      return {
        ...data,
        TEST_SUITE_DURATION: Number(data.TEST_SUITE_DURATION).toFixed(3) + ' sec.',
      };
    });
    queryData = filteredData;
  } else if (input['PARENT_GRID_NAME'] == 'TEST_SUITE') {
    console.log('running TEST_SET query =================== ');

    selectQuery = `SELECT 'TEST_SET' AS GRID_NAME, ts.TEST_SET_UUID, ts.TEST_SET_ID, ted.TEST_RUN_UUID, ts.TEST_SET_NAME, ted.TEST_SET_EXECUTION_DATE, ted.TEST_SUITE_UUID, ted.TEST_SET_EXECUTION_STATUS, ROUND(ted.TEST_SET_DURATION / 1000.0, 3) AS TEST_SET_DURATION FROM TEST_EXECUTION_DETAIL ted JOIN TEST_SET ts ON ted.TEST_SET_UUID = ts.TEST_SET_UUID WHERE ted.TEST_RUN_UUID = :TEST_RUN_UUID AND ted.TEST_SUITE_UUID = :TEST_SUITE_UUID GROUP BY ts.TEST_SET_UUID, ts.TEST_SET_ID, ted.TEST_RUN_UUID, ts.TEST_SET_NAME, ted.TEST_SET_EXECUTION_DATE, ted.TEST_SUITE_UUID, ted.TEST_SET_EXECUTION_STATUS, ted.TEST_SET_DURATION ORDER BY ted.TEST_SET_EXECUTION_DATE ASC;`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
    const filteredData = queryData.map((data) => {
      return {
        ...data,
        TEST_SET_DURATION: Number(data.TEST_SET_DURATION).toFixed(3) + ' sec.',
      };
    });
    queryData = filteredData;
  } else if (input['PARENT_GRID_NAME'] == 'TEST_SET') {
    console.log('running TEST_CASE query =================== ');

    selectQuery = `SELECT 'TEST_CASE' AS GRID_NAME, tc.TEST_CASE_UUID, tc.TEST_CASE_ID, ted.TEST_RUN_UUID, tc.TEST_CASE_NAME, ted.TEST_CASE_EXECUTION_DATE, ted.TEST_SUITE_UUID, ted.TEST_CASE_EXECUTION_STATUS, ROUND(ted.TEST_CASE_DURATION / 1000.0, 3) AS TEST_CASE_DURATION, ted.TEST_SET_UUID FROM TEST_EXECUTION_DETAIL ted JOIN TEST_CASE tc ON ted.TEST_CASE_UUID = tc.TEST_CASE_UUID WHERE ted.TEST_RUN_UUID = :TEST_RUN_UUID AND ted.TEST_SUITE_UUID = :TEST_SUITE_UUID AND ted.TEST_SET_UUID = :TEST_SET_UUID GROUP BY tc.TEST_CASE_UUID, tc.TEST_CASE_ID, ted.TEST_RUN_UUID, tc.TEST_CASE_NAME, ted.TEST_CASE_EXECUTION_DATE, ted.TEST_SUITE_UUID, ted.TEST_CASE_EXECUTION_STATUS, ted.TEST_CASE_DURATION, ted.TEST_SET_UUID ORDER BY ted.TEST_CASE_EXECUTION_DATE ASC;`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
    const filteredData = queryData.map((data) => {
      return {
        ...data,
        TEST_CASE_DURATION: Number(data.TEST_CASE_DURATION).toFixed(3) + ' sec.',
      };
    });
    queryData = filteredData;
  }

  console.log('input data ============ ', input);
  msg.payload.result = { gridData: queryData };
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
