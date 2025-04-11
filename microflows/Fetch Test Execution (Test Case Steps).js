try {
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let queryData = [];
  let input = Object.assign(msg.payload.apiRequestBody, msg.payload.referenceData);
  let selectQuery;
  const getFirstCoverStep = (group) => {
    if (group.includes('Function')) {
      const funcArr = group.split(' - ');
      const functionName = funcArr[0].trim().slice(0, -8).trim();
      return `Call '${functionName}' Function`;
    } else if (group.includes('Navigation Step')) {
      const pageArr = group.split(' - ');
      const pageName = pageArr[pageArr.length - 2].trim().slice(0, -4).trim();
      return `User is on '${pageName}' Page`;
    } else if (group.includes('UI Element Group')) {
      const uiElementGroupArr = group.split(' - ');
      const uiElementGroup = uiElementGroupArr[uiElementGroupArr.length - 1].trim().slice(0, -16).trim();
      return `Call '${uiElementGroup}' UI Element Group`;
    }
    return '';
  };
  const getSecondCoverStep = (group) => {
    if (group.includes('Navigation Step')) {
      const pageArr = group.split(' - ');
      const pageName = pageArr[pageArr.length - 2].trim().slice(0, -4).trim();
      return `User is on '${pageName}' Page`;
    } else if (group.includes('UI Element Group')) {
      const uiElementGroupArr = group.split(' - ');
      const uiElementGroup = uiElementGroupArr[uiElementGroupArr.length - 1].trim().slice(0, -16).trim();
      return `Call '${uiElementGroup}' UI Element Group`;
    }
    return '';
  };
  const getPath = (path, level) => {
    console.log('getting path for path ', path, 'and level ', level);
    if (path?.includes('-')) {
      console.log('getting path for path includessssssssssssssssssssssssssssss =================== ');
      return path.split('-')[level]?.trim();
    }
    return path;
  };
  const updateDuration = (timeMap, path, duration) => {
    let time = timeMap.get(path) ?? 0;
    time += Number(duration);
    timeMap.set(path, time);
  };
  if (input['PARENT_GRID_NAME'] == 'TEST_CASE') {
    selectQuery = `SELECT 'TEST_CASE_STEP' as GRID_NAME, TEST_CASE_STEP_UUID, TEST_EXECUTION_DETAIL_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, CONCAT(ROUND(TEST_CASE_STEP_DURATION / 1000, 3), ' sec.') as TEST_CASE_STEP_DURATION, ROUND(TEST_CASE_STEP_DURATION / 1000, 3) as TEST_CASE_STEP_DURATION_RAW, TEST_SET_UUID, TEST_CASE_UUID, TEST_CASE_STEP_GROUP_NAME, TEST_CASE_STEP_PATH FROM TEST_EXECUTION_DETAIL WHERE TEST_RUN_UUID = :TEST_RUN_UUID AND TEST_SUITE_UUID = :TEST_SUITE_UUID AND TEST_SET_UUID = :TEST_SET_UUID AND TEST_CASE_UUID = :TEST_CASE_UUID group by TEST_CASE_STEP_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, TEST_CASE_STEP_DURATION, TEST_SET_UUID, TEST_CASE_UUID order by TEST_CASE_STEP_EXECUTION_DATE ASC, TEST_CASE_STEP_SEQ_ID ASC;`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
    const pathSet = new Set();
    const timeMap = new Map();
    try {
      const filteredData = queryData
        .filter((data) => {
          let path = data.TEST_CASE_STEP_PATH;
          if (!path || !path.trim() || !path.includes('-')) return true;
          const parentPath = getPath(path, 0) + '-';
          updateDuration(timeMap, parentPath, data.TEST_CASE_STEP_DURATION_RAW);
          if (!pathSet.has(parentPath)) {
            pathSet.add(parentPath);
            return true;
          }
          return false;
        })
        .map((data) => {
          const parentPath = getPath(data.TEST_CASE_STEP_PATH, 0) + '-';
          data.TEST_CASE_STEP_PATH_ID = getPath(data.TEST_CASE_STEP_PATH, 0);
          const duration = Number(timeMap.get(parentPath)).toFixed(3) + ' sec.';
          if (data.TEST_CASE_STEP_PATH && data.TEST_CASE_STEP_PATH.includes('-')) {
            return {
              ...data,
              TEST_CASE_STEP_DURATION: duration,
              TEST_CASE_STEP_PATH: parentPath,
              TEST_CASE_STEP_NAME: getFirstCoverStep(data.TEST_CASE_STEP_GROUP_NAME),
            };
          }
          return { ...data, TEST_CASE_STEP_DURATION: Number(data.TEST_CASE_STEP_DURATION_RAW).toFixed(3) + ' sec.' };
        });
      queryData = filteredData;
    } catch (e) {
      console.log('Error occured in parsing fetched data', e);
    }
  } else if (input['PARENT_GRID_NAME'] == 'TEST_CASE_STEP') {
    selectQuery = `SELECT 'TEST_CASE_STEP_CHILD' as GRID_NAME, TEST_CASE_STEP_UUID, TEST_EXECUTION_DETAIL_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, CONCAT(ROUND(TEST_CASE_STEP_DURATION / 1000, 3), ' sec.') as TEST_CASE_STEP_DURATION, ROUND(TEST_CASE_STEP_DURATION / 1000, 3) as TEST_CASE_STEP_DURATION_RAW, TEST_SET_UUID, TEST_CASE_UUID, TEST_CASE_STEP_GROUP_NAME, TEST_CASE_STEP_PATH FROM TEST_EXECUTION_DETAIL WHERE TEST_RUN_UUID = :TEST_RUN_UUID AND TEST_SUITE_UUID = :TEST_SUITE_UUID AND TEST_SET_UUID = :TEST_SET_UUID AND TEST_CASE_UUID = :TEST_CASE_UUID AND TEST_CASE_STEP_PATH like '${input['PARENT_TEST_CASE_STEP_PATH']}%' group by TEST_CASE_STEP_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, TEST_CASE_STEP_DURATION, TEST_SET_UUID, TEST_CASE_UUID order by TEST_CASE_STEP_EXECUTION_DATE ASC, TEST_CASE_STEP_SEQ_ID ASC;`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
    try {
      const pathSet = new Set();
      const timeMap = new Map();
      const filteredData = queryData
        .filter((data) => {
          const path = data.TEST_CASE_STEP_PATH;
          if (path && path.split('-').length <= 2) return true;
          const parentPathArr = data.TEST_CASE_STEP_PATH.trim().split('-');
          const parentPath = parentPathArr[0] + '-' + parentPathArr[1] + '-';
          updateDuration(timeMap, parentPath, data.TEST_CASE_STEP_DURATION_RAW);
          if (!pathSet.has(parentPath)) {
            pathSet.add(parentPath);
            return true;
          }
          return false;
        })
        .map((data) => {
          data.TEST_CASE_STEP_PATH_ID = getPath(data.TEST_CASE_STEP_PATH, 1);
          if (data.TEST_CASE_STEP_PATH && data.TEST_CASE_STEP_PATH.split('-').length > 2) {
            const parentPathArr = data.TEST_CASE_STEP_PATH.trim().split('-');
            const parentPath = parentPathArr[0] + '-' + parentPathArr[1] + '-';
            const duration = Number(timeMap.get(parentPath)).toFixed(3) + ' sec.';
            return {
              ...data,
              TEST_CASE_STEP_DURATION: duration,
              TEST_CASE_STEP_PATH: parentPath,
              TEST_CASE_STEP_NAME: getSecondCoverStep(data.TEST_CASE_STEP_GROUP_NAME),
            };
          }
          return { ...data, TEST_CASE_STEP_DURATION: Number(data.TEST_CASE_STEP_DURATION_RAW).toFixed(3) + ' sec.' };
        });
      queryData = filteredData;
    } catch (e) {
      console.log('Error occured in parsing fetched data', e);
    }
  } else if (input['PARENT_GRID_NAME'] == 'TEST_CASE_STEP_CHILD') {
    selectQuery = `SELECT 'TEST_CASE_STEP_LAST_CHILD' as GRID_NAME, TEST_CASE_STEP_UUID, TEST_EXECUTION_DETAIL_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, CONCAT(ROUND(TEST_CASE_STEP_DURATION / 1000, 3), ' sec.') as TEST_CASE_STEP_DURATION, ROUND(TEST_CASE_STEP_DURATION / 1000, 3) as TEST_CASE_STEP_DURATION_RAW, TEST_SET_UUID, TEST_CASE_UUID, '' as TEST_CASE_STEP_GROUP_NAME, TEST_CASE_STEP_PATH FROM TEST_EXECUTION_DETAIL WHERE TEST_RUN_UUID = :TEST_RUN_UUID AND TEST_SUITE_UUID = :TEST_SUITE_UUID AND TEST_SET_UUID = :TEST_SET_UUID AND TEST_CASE_UUID = :TEST_CASE_UUID AND TEST_CASE_STEP_PATH like '${input['PARENT_TEST_CASE_STEP_PATH']}%' group by TEST_CASE_STEP_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, TEST_CASE_STEP_DURATION, TEST_SET_UUID, TEST_CASE_UUID order by TEST_CASE_STEP_EXECUTION_DATE ASC, TEST_CASE_STEP_SEQ_ID ASC;`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
    try {
      const filteredData = queryData.map((data) => {
        return {
          ...data,
          TEST_CASE_STEP_PATH_ID: getPath(data.TEST_CASE_STEP_PATH, 2),
          TEST_CASE_STEP_DURATION: Number(data.TEST_CASE_STEP_DURATION_RAW).toFixed(3) + ' sec.',
        };
      });
      queryData = filteredData;
    } catch (e) {
      console.log('Error occured in parsing fetched data', e);
    }
  }
  console.log('input data ============ ', input);
  msg.payload.result = { gridData: queryData };
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
