try {
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let queryData = [];
  let input = Object.assign(msg.payload.apiRequestBody, msg.payload.referenceData);
  let selectQuery;
  const getFirstCoverStepDetails = (group) => {
    if (group.includes('Function')) {
      const funcArr = group.split(' - ');
      const functionName = funcArr[0].trim().slice(0, -8).trim();
      return { name: `Call '${functionName}' Function`, type: 'Function' };
    } else if (group.includes('Navigation Step')) {
      const pageArr = group.split(' - ');
      const pageName = pageArr[pageArr.length - 2].trim().slice(0, -4).trim();
      return { name: `User is on '${pageName}' Page`, type: 'Navigation Step' };
    } else if (group.includes('UI Element Group')) {
      const uiElementGroupArr = group.split(' - ');
      const uiElementGroup = uiElementGroupArr[uiElementGroupArr.length - 1].trim().slice(0, -16).trim();
      return { name: `Call '${uiElementGroup}' UI Element Group`, type: 'UI Element Group' };
    }
    return { name: '', type: '' };
  };
  const getSecondCoverStepDetails = (group) => {
    if (group.includes('Navigation Step')) {
      const pageArr = group.split(' - ');
      const pageName = pageArr[pageArr.length - 2].trim().slice(0, -4).trim();
      return { name: `User is on '${pageName}' Page`, type: 'Navigation Step' };
    } else if (group.includes('UI Element Group')) {
      const uiElementGroupArr = group.split(' - ');
      const uiElementGroup = uiElementGroupArr[uiElementGroupArr.length - 1].trim().slice(0, -16).trim();
      return { name: `Call '${uiElementGroup}' UI Element Group`, type: 'UI Element Group' };
    }
    return { name: '', type: '' };
  };
  const getPath = (path, level) => {
    if (path?.includes('-')) {
      return path.split('-')[level]?.trim();
    }
    return path;
  };
  const updateDuration = (timeMap, path, duration) => {
    let time = timeMap.get(path) ?? 0;
    time += Number(duration);
    timeMap.set(path, time);
  };
  if (input['PARENT_GRID_NAME'] === 'TEST_CASE') {
    selectQuery = `SELECT 'TEST_CASE_STEP' as GRID_NAME, 'TEST_EXECUTION_DETAIL' as TABLE_NAME, 'TEST_EXECUTION_DETAIL_UUID' as KEY_NAME, TEST_EXECUTION_DETAIL_UUID as KEY_VALUE, uuid() as DATA_UNIQUE_UUID, TEST_CASE_STEP_UUID, TEST_EXECUTION_DETAIL_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, CONCAT(ROUND(TEST_CASE_STEP_DURATION / 1000.0, 3), ' sec.') as TEST_CASE_STEP_DURATION, ROUND(TEST_CASE_STEP_DURATION / 1000.0, 3) as TEST_CASE_STEP_DURATION_RAW, TEST_SET_UUID, TEST_CASE_UUID, TEST_CASE_STEP_GROUP_NAME, TEST_CASE_STEP_PATH FROM TEST_EXECUTION_DETAIL WHERE TEST_RUN_UUID = :TEST_RUN_UUID AND TEST_SUITE_UUID = :TEST_SUITE_UUID AND TEST_SET_UUID = :TEST_SET_UUID AND TEST_CASE_UUID = :TEST_CASE_UUID group by TEST_CASE_STEP_UUID, TEST_EXECUTION_DETAIL_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, TEST_CASE_STEP_DURATION, TEST_SET_UUID, TEST_CASE_UUID, TEST_CASE_STEP_GROUP_NAME, TEST_CASE_STEP_PATH order by TEST_CASE_STEP_EXECUTION_DATE ASC, TEST_CASE_STEP_SEQ_ID ASC;`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
    const pathSet = new Set();
    const timeMap = new Map();
    const statusMap = {};
    const filteredData = queryData
      .filter((data) => {
        const path = data.TEST_CASE_STEP_PATH;
        if (!path || !path.trim() || !path.includes('-')) return true;
        const parentPath = getPath(path, 0) + '-';
        updateDuration(timeMap, parentPath, data.TEST_CASE_STEP_DURATION_RAW);
        if (!statusMap[parentPath]) statusMap[parentPath] = [];
        statusMap[parentPath].push(data.TEST_CASE_STEP_EXECUTION_STATUS);
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
          const groupDetails = getFirstCoverStepDetails(data.TEST_CASE_STEP_GROUP_NAME);
          const stepStatuses = statusMap[parentPath] || [];
          const groupStatus = stepStatuses.some((status) => status !== 'Passed') ? 'Failed' : 'Passed';
          return {
            ...data,
            TEST_CASE_STEP_DURATION: duration,
            TEST_CASE_STEP_PATH: parentPath,
            TEST_CASE_STEP_NAME: groupDetails.name,
            CHILD_STEP_TYPE: groupDetails.type,
            TEST_CASE_STEP_EXECUTION_STATUS: groupStatus
          };
        }
        return { ...data, TEST_CASE_STEP_DURATION: Number(data.TEST_CASE_STEP_DURATION_RAW).toFixed(3) + ' sec.', CHILD_STEP_TYPE: null };
      });
    queryData = filteredData;
  } else if (input['PARENT_GRID_NAME'] === 'TEST_CASE_STEP') {
    selectQuery = `SELECT 'TEST_CASE_STEP_CHILD' as GRID_NAME, 'TEST_EXECUTION_DETAIL' as TABLE_NAME, 'TEST_EXECUTION_DETAIL_UUID' as KEY_NAME, TEST_EXECUTION_DETAIL_UUID as KEY_VALUE, uuid() as DATA_UNIQUE_UUID, TEST_CASE_STEP_UUID, TEST_EXECUTION_DETAIL_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, CONCAT(ROUND(TEST_CASE_STEP_DURATION / 1000.0, 3), ' sec.') as TEST_CASE_STEP_DURATION, ROUND(TEST_CASE_STEP_DURATION / 1000.0, 3) as TEST_CASE_STEP_DURATION_RAW, TEST_SET_UUID, TEST_CASE_UUID, TEST_CASE_STEP_GROUP_NAME, TEST_CASE_STEP_PATH FROM TEST_EXECUTION_DETAIL WHERE TEST_RUN_UUID = :TEST_RUN_UUID AND TEST_SUITE_UUID = :TEST_SUITE_UUID AND TEST_SET_UUID = :TEST_SET_UUID AND TEST_CASE_UUID = :TEST_CASE_UUID AND TEST_CASE_STEP_PATH like '${input['PARENT_TEST_CASE_STEP_PATH']}%' group by TEST_CASE_STEP_UUID, TEST_EXECUTION_DETAIL_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, TEST_CASE_STEP_DURATION, TEST_SET_UUID, TEST_CASE_UUID, TEST_CASE_STEP_GROUP_NAME, TEST_CASE_STEP_PATH order by TEST_CASE_STEP_EXECUTION_DATE ASC, TEST_CASE_STEP_SEQ_ID ASC;`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
    const pathSet = new Set();
    const timeMap = new Map();
    const statusMap = {};
    const filteredData = queryData
      .filter((data) => {
        const path = data.TEST_CASE_STEP_PATH;
        if (path && path.split('-').length <= 2) return true;
        const parentPathArr = data.TEST_CASE_STEP_PATH.trim().split('-');
        const parentPath = parentPathArr[0] + '-' + parentPathArr[1] + '-';
        updateDuration(timeMap, parentPath, data.TEST_CASE_STEP_DURATION_RAW);
        if (!statusMap[parentPath]) statusMap[parentPath] = [];
        statusMap[parentPath].push(data.TEST_CASE_STEP_EXECUTION_STATUS);
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
          const groupDetails = getSecondCoverStepDetails(data.TEST_CASE_STEP_GROUP_NAME);
          const stepStatuses = statusMap[parentPath] || [];
          const groupStatus = stepStatuses.some((status) => status !== 'Passed') ? 'Failed' : 'Passed';
          return {
            ...data,
            TEST_CASE_STEP_DURATION: duration,
            TEST_CASE_STEP_PATH: parentPath,
            TEST_CASE_STEP_NAME: groupDetails.name,
            CHILD_STEP_TYPE: groupDetails.type,
            TEST_CASE_STEP_EXECUTION_STATUS: groupStatus
          };
        }
        return { ...data, TEST_CASE_STEP_DURATION: Number(data.TEST_CASE_STEP_DURATION_RAW).toFixed(3) + ' sec.', CHILD_STEP_TYPE: null };
      });
    queryData = filteredData;
  } else if (input['PARENT_GRID_NAME'] === 'TEST_CASE_STEP_CHILD') {
    selectQuery = `SELECT 'TEST_CASE_STEP_LAST_CHILD' as GRID_NAME, 'TEST_EXECUTION_DETAIL' as TABLE_NAME, 'TEST_EXECUTION_DETAIL_UUID' as KEY_NAME, TEST_EXECUTION_DETAIL_UUID as KEY_VALUE, uuid() as DATA_UNIQUE_UUID, TEST_CASE_STEP_UUID, TEST_EXECUTION_DETAIL_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, CONCAT(ROUND(TEST_CASE_STEP_DURATION / 1000.0, 3), ' sec.') as TEST_CASE_STEP_DURATION, ROUND(TEST_CASE_STEP_DURATION / 1000.0, 3) as TEST_CASE_STEP_DURATION_RAW, TEST_SET_UUID, TEST_CASE_UUID, '' as TEST_CASE_STEP_GROUP_NAME, TEST_CASE_STEP_PATH FROM TEST_EXECUTION_DETAIL WHERE TEST_RUN_UUID = :TEST_RUN_UUID AND TEST_SUITE_UUID = :TEST_SUITE_UUID AND TEST_SET_UUID = :TEST_SET_UUID AND TEST_CASE_UUID = :TEST_CASE_UUID AND TEST_CASE_STEP_PATH like '${input['PARENT_TEST_CASE_STEP_PATH']}%' group by TEST_CASE_STEP_UUID, TEST_EXECUTION_DETAIL_UUID, TEST_CASE_STEP_SEQ_ID, TEST_RUN_UUID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_EXECUTION_DATE, TEST_SUITE_UUID, TEST_CASE_STEP_EXECUTION_STATUS, TEST_CASE_STEP_DURATION, TEST_SET_UUID, TEST_CASE_UUID, TEST_CASE_STEP_PATH order by TEST_CASE_STEP_EXECUTION_DATE ASC, TEST_CASE_STEP_SEQ_ID ASC;`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, selectQuery, input);
    const filteredData = queryData.map((data) => {
      return { ...data, TEST_CASE_STEP_PATH_ID: getPath(data.TEST_CASE_STEP_PATH, 2), TEST_CASE_STEP_DURATION: Number(data.TEST_CASE_STEP_DURATION_RAW).toFixed(3) + ' sec.', CHILD_STEP_TYPE: null };
    });
    queryData = filteredData;
  }
  msg.payload.result = { gridData: queryData };
  node.send(msg);
} catch (error) {
  console.log('Error Occurred: Process and Send Data to UI', error.message);
}
return;
