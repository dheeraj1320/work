try {
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let queryData = [];
  let attributeKeysList = [];
  let input = Object.assign(
    msg.payload.apiRequestBody,
    msg.payload.referenceData
  );
  console.log('input ::::::::::::::::::::::::::: 6666666', input);
  let inputStepType;
  let isFunctionOrUIElementGroup = false;
  if (input && input.GRID_NAME == 'Test Case') {
    const selectQuery = `SELECT TEST_CASE_STEP_UUID, TEST_CASE_STEP_ID, TEST_CASE_UUID, TEST_SET_UUID, AE_INSERT_ID, AE_UPDATE_ID, AE_INSERT_TS, AE_UPDATE_TS, AE_TRANSACTION_ID, FUNCTIONAL_AREA_UUID, TEST_CASE_STEP_NAME, PAGE_UUID, VIEW_UUID, PROCESS_UUID, USER_ACTION_UUID, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, CURRENT_PAGE_CONTEXT as PAGE_NAME, TEST_CASE_STEP_SEQ_ID, TEST_CASE_STEP_TYPE, NEXT_PAGE_CONTEXT, IS_UI_ELEMENT_GROUP_STEP, IS_FUNCTION_STEP, 'Test Case Step' as GRID_NAME, TEST_CASE_STEP_ATTRIBUTE_KEYS FROM TEST_CASE_STEP WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_UUID=:TEST_CASE_UUID order by TEST_CASE_STEP_SEQ_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (input && input.GRID_NAME == 'UI Element Group') {
    const selectQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP WHERE UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY UI_ELEMENT_GROUP_STEP_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.GRID_NAME == 'Test Case Step' &&
    input.IS_UI_ELEMENT_GROUP_STEP == 'Yes' &&
    input.IS_FUNCTION_STEP == 'No'
  ) {
    const selectQuery = `SELECT TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID,TEST_CASE_UI_ELEMENT_GROUP_STEP_ID,TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME,AE_INSERT_ID,AE_UPDATE_ID,AE_TRANSACTION_ID,AE_INSERT_TS,AE_UPDATE_TS,CURRENT_PAGE_CONTEXT as PAGE_NAME,TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS,TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE FROM TEST_CASE_UI_ELEMENT_GROUP_STEP WHERE TEST_CASE_STEP_UUID=:TEST_CASE_STEP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.FIRST_CHILD_GRID_NAME == 'Function Step By Function'
  ) {
    const selectQuery = `SELECT CURRENT_PAGE_CONTEXT as PAGE_NAME,FUNCTION_STEP_ID,FUNCTION_STEP_NAME,FUNCTION_STEP_UUID,NEXT_PAGE_CONTEXT, CURRENT_PAGE_CONTEXT,IS_OVERIDE_UI_ELEMENT_VALUE_ALLOWED,IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT,IS_UI_ELEMENT_GROUP_STEP,FUNCTION_STEP_ATTRIBUTE_KEYS,'Function Step' as GRID_NAME,FUNCTION_STEP_TYPE,API_UUID,IS_API_ATTRIBUTE_VALUE_PRESENT FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY FUNCTION_STEP_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (input && input.GRID_NAME == 'Function Step') {
    const selectQuery = `SELECT FUNCTION_UI_ELEMENT_GROUP_STEP_UUID,FUNCTION_UI_ELEMENT_GROUP_STEP_ID,FUNCTION_UI_ELEMENT_GROUP_STEP_NAME,AE_INSERT_ID,AE_UPDATE_ID,AE_TRANSACTION_ID,AE_INSERT_TS,AE_UPDATE_TS,STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID,CURRENT_PAGE_CONTEXT,FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE,FUNCTION_STEP_UUID,FUNCTION_UUID,UI_ELEMENT_GROUP_UUID,FUNCTIONAL_AREA_UUID,FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS,CURRENT_PAGE_CONTEXT as PAGE_NAME FROM FUNCTION_UI_ELEMENT_GROUP_STEP WHERE FUNCTION_STEP_UUID=:FUNCTION_STEP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.GRID_NAME == 'Test Case Step' &&
    input.IS_UI_ELEMENT_GROUP_STEP == 'No' &&
    input.IS_FUNCTION_STEP == 'Yes'
  ) {
    const selectQuery = `SELECT CURRENT_PAGE_CONTEXT as PAGE_NAME,TEST_CASE_FUNCTION_STEP_UUID,TEST_CASE_FUNCTION_STEP_ID,TEST_CASE_FUNCTION_STEP_NAME,STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID,CURRENT_PAGE_CONTEXT,NEXT_PAGE_CONTEXT,TEST_CASE_FUNCTION_STEP_TYPE,TEST_CASE_FUNCTION_STEP_SEQ_ID,TEST_CASE_STEP_UUID,AE_INSERT_ID,AE_UPDATE_ID,AE_TRANSACTION_ID,AE_INSERT_TS,AE_UPDATE_TS,FUNCTIONAL_AREA_UUID,FUNCTION_UUID,FUNCTION_STEP_UUID,IS_UI_ELEMENT_GROUP_STEP,TEST_CASE_FUNCTION_STEP_ATTRIBUTE_KEYS,'Test Case Function Step' as GRID_NAME FROM TEST_CASE_FUNCTION_STEP WHERE TEST_CASE_STEP_UUID=:TEST_CASE_STEP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_STEP_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (input && input.GRID_NAME == 'Test Case Function Step') {
    const selectQuery = `SELECT TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID,TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID,TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME,AE_INSERT_ID,AE_UPDATE_ID,AE_TRANSACTION_ID,AE_INSERT_TS,AE_UPDATE_TS,CURRENT_PAGE_CONTEXT as PAGE_NAME,TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS,TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID=:TEST_CASE_FUNCTION_STEP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (input && input.FIRST_CHILD_GRID_NAME == 'Test Case Step By Page') {
    const selectQuery = `Select CONCAT(TEST_SET_ID,' - ',TEST_SET_NAME) as TEST_SET_UUID,CONCAT(TEST_CASE_ID,' - ',TEST_CASE_NAME) as TEST_CASE_UUID, TEST_CASE_STEP_ID, TEST_CASE_STEP_NAME,TEST_CASE_STEP_ATTRIBUTE_KEYS,TEST_CASE_STEP_TYPE, NEXT_PAGE_CONTEXT from TEST_CASE_STEP tsc, TEST_SET ts, TEST_CASE tc,TEST_CASE_STEP_ATTRIBUTE_VALUE tcsv where tsc.TEST_CASE_STEP_UUID=tcsv.TEST_CASE_STEP_UUID and tsc.TEST_SET_UUID=ts.TEST_SET_UUID and tsc.TEST_CASE_UUID=tc.TEST_CASE_UUID and tcsv.TEST_CASE_STEP_ATTRIBUTE_DATA=:PAGE_UUID and tsc.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_SET_ID,TEST_CASE_ID,TEST_CASE_STEP_SEQ_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.SECOND_CHILD_GRID_NAME == 'Test Case Step By UI Element'
  ) {
    const selectQuery = `Select CONCAT(TEST_SET_ID,' - ',TEST_SET_NAME) as TEST_SET_UUID, CONCAT(TEST_CASE_ID,' - ',TEST_CASE_NAME) as TEST_CASE_UUID, TEST_CASE_STEP_ID, TEST_CASE_STEP_NAME,TEST_CASE_STEP_ATTRIBUTE_KEYS,TEST_CASE_STEP_TYPE from TEST_CASE_STEP tsc, TEST_SET ts, TEST_CASE tc, TEST_CASE_STEP_ATTRIBUTE_VALUE tcsv where tsc.TEST_CASE_STEP_UUID=tcsv.TEST_CASE_STEP_UUID and tsc.TEST_SET_UUID=ts.TEST_SET_UUID and tsc.TEST_CASE_UUID=tc.TEST_CASE_UUID and tcsv.TEST_CASE_STEP_ATTRIBUTE_DATA=:UI_ELEMENT_UUID and tsc.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_ID desc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.SECOND_CHILD_GRID_NAME == 'Test Case Step By Function'
  ) {
    const selectQuery = `Select CONCAT(TEST_SET_ID,' - ',TEST_SET_NAME) as TEST_SET_UUID, CONCAT(TEST_CASE_ID,' - ',TEST_CASE_NAME) as TEST_CASE_UUID, TEST_CASE_STEP_ID,TEST_CASE_STEP_TYPE,TEST_CASE_STEP_ATTRIBUTE_KEYS from TEST_CASE_STEP tsc, TEST_SET ts, TEST_CASE tc, TEST_CASE_STEP_ATTRIBUTE_VALUE tcsv where tsc.TEST_CASE_STEP_UUID=tcsv.TEST_CASE_STEP_UUID and tsc.TEST_SET_UUID=ts.TEST_SET_UUID and tsc.TEST_CASE_UUID=tc.TEST_CASE_UUID and tcsv.TEST_CASE_STEP_ATTRIBUTE_DATA=:FUNCTION_UUID and ts.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_SET_ID,TEST_CASE_ID,TEST_CASE_STEP_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.SECOND_CHILD_GRID_NAME == 'Function Step Under Page'
  ) {
    const selectQuery = `SELECT CONCAT(FUNCTION_ID, ' - ', FUNCTION_NAME) AS FUNCTION_UUID, '' AS FUNCTION_STEP_ID, '' AS FUNCTION_STEP_NAME, '' AS FUNCTION_STEP_ATTRIBUTE_KEYS, '' AS FUNCTIONAL_AREA_UUID, '' AS FUNCTION_STEP_TYPE FROM featuremanagement_app.FUNCTION WHERE START_PAGE_NAME=:PAGE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID UNION SELECT CONCAT(f.FUNCTION_ID, ' - ', f.FUNCTION_NAME) AS FUNCTION_UUID, fs.FUNCTION_STEP_ID, fs.FUNCTION_STEP_NAME, fs.FUNCTION_STEP_ATTRIBUTE_KEYS, fs.FUNCTIONAL_AREA_UUID, fs.FUNCTION_STEP_TYPE FROM FUNCTION_STEP fs JOIN featuremanagement_app.FUNCTION f ON fs.FUNCTION_UUID = f.FUNCTION_UUID WHERE fs.CURRENT_PAGE_CONTEXT=:PAGE_UUID AND fs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY FUNCTION_STEP_ID DESC `;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.FIRST_CHILD_GRID_NAME == 'Function Step Under UI Element'
  ) {
    const selectQuery = `SELECT CONCAT(f.FUNCTION_ID, ' - ', f.FUNCTION_NAME) AS FUNCTION_UUID, fs.FUNCTION_STEP_ID, fs.FUNCTION_STEP_NAME, fs.FUNCTION_STEP_ATTRIBUTE_KEYS, fs.FUNCTIONAL_AREA_UUID, fs.FUNCTION_STEP_TYPE FROM FUNCTION_STEP fs JOIN featuremanagement_app.FUNCTION f ON fs.FUNCTION_UUID = f.FUNCTION_UUID JOIN featuremanagement_app.FUNCTION_STEP_ATTRIBUTE_VALUE fsa ON fs.FUNCTION_STEP_UUID = fsa.FUNCTION_STEP_UUID WHERE fsa.FUNCTION_STEP_ATTRIBUTE_DATA=:UI_ELEMENT_UUID AND fs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY FUNCTION_STEP_ID desc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.THIRD_CHILD_GRID_NAME == 'UI Element Group Step Under UI Element'
  ) {
    const selectQuery = `SELECT DISTINCT CONCAT(UI_ELEMENT_GROUP_ID, ' - ', UI_ELEMENT_GROUP_NAME) as UI_ELEMENT_GROUP_UUID, UI_ELEMENT_GROUP_STEP_ID, UI_ELEMENT_GROUP_STEP_NAME, UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS, STEP_TYPE FROM UI_ELEMENT_GROUP_STEP ues JOIN UI_ELEMENT_GROUP us ON ues.UI_ELEMENT_GROUP_UUID = us.UI_ELEMENT_GROUP_UUID JOIN UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE ueas ON ues.UI_ELEMENT_GROUP_STEP_UUID = ueas.UI_ELEMENT_GROUP_STEP_UUID WHERE ues.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ueas.UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA=:UI_ELEMENT_UUID ORDER BY UI_ELEMENT_GROUP_STEP_ID desc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.THIRD_CHILD_GRID_NAME == 'UI Element Group Step Under Page'
  ) {
    const selectQuery = `SELECT DISTINCT CONCAT(UI_ELEMENT_GROUP_ID, ' - ', UI_ELEMENT_GROUP_NAME) as UI_ELEMENT_GROUP_UUID, '' as UI_ELEMENT_GROUP_STEP_ID, '' as UI_ELEMENT_GROUP_STEP_NAME, '' as UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS, '' as STEP_TYPE FROM UI_ELEMENT_GROUP WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND PAGE_UUID=:PAGE_UUID UNION SELECT DISTINCT CONCAT(us.UI_ELEMENT_GROUP_ID, ' - ', us.UI_ELEMENT_GROUP_NAME) as UI_ELEMENT_GROUP_UUID, ues.UI_ELEMENT_GROUP_STEP_ID, ues.UI_ELEMENT_GROUP_STEP_NAME, ues.UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS, ues.STEP_TYPE FROM UI_ELEMENT_GROUP_STEP ues JOIN UI_ELEMENT_GROUP us ON ues.UI_ELEMENT_GROUP_UUID = us.UI_ELEMENT_GROUP_UUID WHERE ues.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND ues.CURRENT_PAGE_CONTEXT=:PAGE_UUID ORDER BY UI_ELEMENT_GROUP_STEP_ID DESC`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.SECOND_CHILD_GRID_NAME == 'Test Case Step Under API'
  ) {
    const selectQuery = `Select CONCAT(TEST_SET_ID, ' - ', TEST_SET_NAME) as TEST_SET_UUID, CONCAT(TEST_CASE_ID, ' - ', TEST_CASE_NAME) as TEST_CASE_UUID, TEST_CASE_STEP_ID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_ATTRIBUTE_KEYS, TEST_CASE_STEP_TYPE, NEXT_PAGE_CONTEXT from TEST_CASE_STEP tsc, TEST_SET ts, TEST_CASE tc where tsc.TEST_SET_UUID = ts.TEST_SET_UUID and tsc.TEST_CASE_UUID = tc.TEST_CASE_UUID and tsc.API_UUID =:API_UUID and tsc.FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_SET_ID, TEST_CASE_ID, TEST_CASE_STEP_SEQ_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
    console.log('iuaieudiddd', queryData);
  } else if (
    input &&
    input.FIRST_CHILD_GRID_NAME == 'Test Case Step Under API Attribute'
  ) {
    const selectQuery = `Select CONCAT(TEST_SET_ID, ' - ', TEST_SET_NAME) as TEST_SET_UUID, CONCAT(TEST_CASE_ID, ' - ', TEST_CASE_NAME) as TEST_CASE_UUID, TEST_CASE_STEP_ID, TEST_CASE_STEP_NAME, TEST_CASE_STEP_ATTRIBUTE_KEYS, TEST_CASE_STEP_TYPE, NEXT_PAGE_CONTEXT from TEST_CASE_STEP tsc, TEST_SET ts, TEST_CASE tc, TEST_CASE_STEP_ATTRIBUTE_VALUE tcsv where tsc.TEST_CASE_STEP_UUID = tcsv.TEST_CASE_STEP_UUID and tsc.TEST_SET_UUID = ts.TEST_SET_UUID and tsc.TEST_CASE_UUID = tc.TEST_CASE_UUID and tcsv.TEST_CASE_STEP_ATTRIBUTE_DATA=:API_ATTRIBUTE_UUID and tsc.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_SET_ID, TEST_CASE_ID, TEST_CASE_STEP_SEQ_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.THIRD_CHILD_GRID_NAME == 'Function Step Under API'
  ) {
    const selectQuery = `SELECT CONCAT(FUNCTION_ID, ' - ', FUNCTION_NAME) AS FUNCTION_UUID, '' AS FUNCTION_STEP_ID, '' AS FUNCTION_STEP_NAME, '' AS FUNCTION_STEP_ATTRIBUTE_KEYS, '' AS FUNCTIONAL_AREA_UUID, '' AS FUNCTION_STEP_TYPE FROM featuremanagement_app.FUNCTION WHERE START_PAGE_NAME=:PAGE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID UNION SELECT CONCAT(f.FUNCTION_ID, ' - ', f.FUNCTION_NAME) AS FUNCTION_UUID, fs.FUNCTION_STEP_ID, fs.FUNCTION_STEP_NAME, fs.FUNCTION_STEP_ATTRIBUTE_KEYS, fs.FUNCTIONAL_AREA_UUID, fs.FUNCTION_STEP_TYPE FROM FUNCTION_STEP fs JOIN featuremanagement_app.FUNCTION f ON fs.FUNCTION_UUID = f.FUNCTION_UUID WHERE fs.CURRENT_PAGE_CONTEXT=:API_UUID AND fs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY FUNCTION_STEP_ID DESC`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.SECOND_CHILD_GRID_NAME == 'Function Step Under API Attribute'
  ) {
    const selectQuery = `SELECT CONCAT(f.FUNCTION_ID, ' - ', f.FUNCTION_NAME) AS FUNCTION_UUID, fs.FUNCTION_STEP_ID, fs.FUNCTION_STEP_NAME, fs.FUNCTION_STEP_ATTRIBUTE_KEYS, fs.FUNCTIONAL_AREA_UUID, fs.FUNCTION_STEP_TYPE FROM FUNCTION_STEP fs JOIN featuremanagement_app.FUNCTION f ON fs.FUNCTION_UUID = f.FUNCTION_UUID JOIN featuremanagement_app.FUNCTION_STEP_ATTRIBUTE_VALUE fsa ON fs.FUNCTION_STEP_UUID = fsa.FUNCTION_STEP_UUID WHERE fsa.FUNCTION_STEP_ATTRIBUTE_DATA=:API_ATTRIBUTE_UUID AND fs.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY FUNCTION_STEP_ID desc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  } else if (
    input &&
    input.GRID_NAME == 'View Navigation Step By View Navigation'
  ) {
    const selectQuery = `SELECT VIEW_NAVIGATION_STEP_UUID,VIEW_NAVIGATION_STEP_ID,VIEW_NAVIGATION_STEP_NAME,STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID,VIEW_NAVIGATION_STEP_TYPE,VIEW_NAVIGATION_STEP_SEQ_ID,CURRENT_PAGE_CONTEXT,NEXT_PAGE_CONTEXT,VIEW_NAVIGATION_STEP_ATTRIBUTE_KEYS,VIEW_NAVIGATION_UUID,AE_INSERT_ID,AE_UPDATE_ID,AE_TRANSACTION_ID,AE_INSERT_TS,AE_UPDATE_TS FROM VIEW_NAVIGATION_STEP WHERE VIEW_NAVIGATION_UUID=:VIEW_NAVIGATION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY VIEW_NAVIGATION_STEP_SEQ_ID asc`;
    queryData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      selectQuery,
      input
    );
  }
  for (let data of queryData) {
    if (data && Object.keys(data).length) {
      if (input && input.GRID_NAME == 'Test Case') {
        attributeKeysList = data['TEST_CASE_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['TEST_CASE_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['TEST_CASE_STEP_TYPE'];
        if (
          data['IS_FUNCTION_STEP'] == 'Yes' ||
          data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes'
        ) {
          isFunctionOrUIElementGroup = true;
        } else {
          isFunctionOrUIElementGroup = false;
        }
      } else if (input && input.GRID_NAME == 'UI Element Group') {
        attributeKeysList = data['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['UI_ELEMENT_STEP_FILTER_TYPE'];
      } else if (
        input &&
        input.GRID_NAME == 'Test Case Step' &&
        input.IS_UI_ELEMENT_GROUP_STEP == 'Yes' &&
        input.IS_FUNCTION_STEP == 'No'
      ) {
        attributeKeysList = data[
          'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'
        ]
          ? JSON.parse(data['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE'];
      } else if (
        input &&
        input.FIRST_CHILD_GRID_NAME == 'Function Step By Function'
      ) {
        attributeKeysList = data['FUNCTION_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['FUNCTION_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['FUNCTION_STEP_TYPE'];
        if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
          isFunctionOrUIElementGroup = true;
        } else {
          isFunctionOrUIElementGroup = false;
        }
      } else if (input && input.GRID_NAME == 'Function Step') {
        attributeKeysList = data[
          'FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'
        ]
          ? JSON.parse(data['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'];
      } else if (
        input &&
        input.GRID_NAME == 'Test Case Step' &&
        input.IS_UI_ELEMENT_GROUP_STEP == 'No' &&
        input.IS_FUNCTION_STEP == 'Yes'
      ) {
        attributeKeysList = data['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['TEST_CASE_FUNCTION_STEP_TYPE'];
        if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
          isFunctionOrUIElementGroup = true;
        } else {
          isFunctionOrUIElementGroup = false;
        }
      } else if (input && input.GRID_NAME == 'Test Case Function Step') {
        attributeKeysList = data[
          'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'
        ]
          ? JSON.parse(
              data['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS']
            )
          : [];
        inputStepType = data['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'];
      } else if (
        input &&
        input.FIRST_CHILD_GRID_NAME == 'Test Case Step By Page'
      ) {
        attributeKeysList = data['TEST_CASE_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['TEST_CASE_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['TEST_CASE_STEP_TYPE'];
      } else if (
        input &&
        input.SECOND_CHILD_GRID_NAME == 'Test Case Step By UI Element'
      ) {
        attributeKeysList = data['TEST_CASE_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['TEST_CASE_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['TEST_CASE_STEP_TYPE'];
      } else if (
        input &&
        input.SECOND_CHILD_GRID_NAME == 'Test Case Step By Function'
      ) {
        attributeKeysList = data['TEST_CASE_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['TEST_CASE_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['TEST_CASE_STEP_TYPE'];
      } else if (
        input &&
        input.SECOND_CHILD_GRID_NAME == 'Function Step Under Page'
      ) {
        attributeKeysList = data['FUNCTION_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['FUNCTION_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['FUNCTION_STEP_TYPE'];
      } else if (
        input &&
        input.FIRST_CHILD_GRID_NAME == 'Function Step Under UI Element'
      ) {
        attributeKeysList = data['FUNCTION_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['FUNCTION_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['FUNCTION_STEP_TYPE'];
      } else if (
        input &&
        input.THIRD_CHILD_GRID_NAME == 'UI Element Group Step Under UI Element'
      ) {
        attributeKeysList = data['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['STEP_TYPE'];
      } else if (
        input &&
        input.THIRD_CHILD_GRID_NAME == 'UI Element Group Step Under Page'
      ) {
        attributeKeysList = data['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['STEP_TYPE'];
      } else if (
        input &&
        input.SECOND_CHILD_GRID_NAME == 'Test Case Step Under API'
      ) {
        attributeKeysList = data['TEST_CASE_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['TEST_CASE_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['TEST_CASE_STEP_TYPE'];
      } else if (
        input &&
        input.FIRST_CHILD_GRID_NAME == 'Test Case Step Under API Attribute'
      ) {
        attributeKeysList = data['TEST_CASE_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['TEST_CASE_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['TEST_CASE_STEP_TYPE'];
      } else if (
        input &&
        input.THIRD_CHILD_GRID_NAME == 'Function Step Under API'
      ) {
        attributeKeysList = data['FUNCTION_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['FUNCTION_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['FUNCTION_STEP_TYPE'];
      } else if (
        input &&
        input.SECOND_CHILD_GRID_NAME == 'Function Step Under API Attribute'
      ) {
        attributeKeysList = data['FUNCTION_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['FUNCTION_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['FUNCTION_STEP_TYPE'];
      } else if (
        input &&
        input.GRID_NAME == 'View Navigation Step By View Navigation'
      ) {
        attributeKeysList = data['VIEW_NAVIGATION_STEP_ATTRIBUTE_KEYS']
          ? JSON.parse(data['VIEW_NAVIGATION_STEP_ATTRIBUTE_KEYS'])
          : [];
        inputStepType = data['VIEW_NAVIGATION_STEP_TYPE'];
      }
      const paramsPattern = /[^{}]+(?=})/g;
      let firstIndexValue = attributeKeysList.shift();
      let firstKeyValue = firstIndexValue
        ? firstIndexValue.match(paramsPattern)
        : [];
      let stepDefinitionVerbiageList = firstKeyValue.length
        ? firstKeyValue[0].split('@#$')
        : [];
      let stepDefTemplateVerbiageName = '';
      if (stepDefinitionVerbiageList.length) {
        const stepDefTemplateVerbiageQuery = `SELECT STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME FROM STEP_DEFINITION_TEMPLATE_VERBIAGE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID in(${stepDefinitionVerbiageList[1]})`;
        let stepDefTemplateVerbiageQueryData =
          await serviceOrchestrator.selectSingleRecordUsingQuery(
            `PRIMARYSPRINGFM`,
            stepDefTemplateVerbiageQuery,
            input
          );
        stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData[
            'STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'
          ];
        if (attributeKeysList && attributeKeysList.length) {
          for (let attribute of attributeKeysList) {
            let extractParams = attribute.match(paramsPattern);
            let keyValue = extractParams[0].split('@#$');
            switch (keyValue[0]) {
              case 'PageName':
                {
                  const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let pageNewQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      pageNewQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<Page Name>',
                      function () {
                        return `'` + pageNewQueryData['PAGE_NAME'] + `'`;
                      }
                    );
                }
                break;
              case 'UIElementName':
                {
                  const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let uiElementQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      uiElementQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Name>',
                      function () {
                        return (
                          `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`
                        );
                      }
                    );
                }
                break;
              case 'UIElementType':
                {
                  const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID in(${keyValue[1]})`;
                  let uiElementTypeQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      uiElementTypeQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Type>',
                      function () {
                        return (
                          `'` +
                          uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] +
                          `'`
                        );
                      }
                    );
                }
                break;
              case 'UIElementValue':
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
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
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<Key Name in Keypad>',
                      function () {
                        return keyValue[1];
                      }
                    );
                }
                break;
              case 'EventName':
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<Event Name>',
                      keyValue[1]
                        ? function () {
                            return keyValue[1];
                          }
                        : `' '`
                    );
                }
                break;
              case 'ConfirmUIElementValue':
                stepDefTemplateVerbiageName =
                  stepDefTemplateVerbiageName.replaceAll(
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
                  let functionNameQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      functionNameQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<Function Name>',
                      function () {
                        return (
                          `'` + functionNameQueryData['FUNCTION_NAME'] + `'`
                        );
                      }
                    );
                }
                break;
              case 'UIElementName1':
                {
                  const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let uiElementQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      uiElementQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Name 1>',
                      function () {
                        return (
                          `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`
                        );
                      }
                    );
                }
                break;
              case 'UIElementValue1':
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
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
                  let uiElementQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      uiElementQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<User Action Name>',
                      function () {
                        return (
                          `'` + uiElementQueryData['UI_ELEMENT_NAME'] + `'`
                        );
                      }
                    );
                }
                break;
              case 'UserActionType':
                {
                  const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID in(${keyValue[1]})`;
                  let uiElementTypeQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      uiElementTypeQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<User Action Type>',
                      function () {
                        return (
                          `'` +
                          uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] +
                          `'`
                        );
                      }
                    );
                }
                break;
              case 'UIElementGroupName':
                {
                  let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP WHERE UI_ELEMENT_GROUP_UUID in(${keyValue[1]}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let uiElementGroupStepQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      'PRIMARYSPRINGFM',
                      uiElementGroupStepQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<UI Element Group Name>',
                      function () {
                        return (
                          `'` +
                          uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] +
                          `'`
                        );
                      }
                    );
                }
                break;
              case 'PageNumber':
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
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
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
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
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
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
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
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
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
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
                  const apiQuery = `SELECT API_NAME FROM API_NEW WHERE API_UUID in(${keyValue[1]}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let apiQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      apiQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<API Name>',
                      function () {
                        return `'` + apiQueryData['API_NAME'] + `'`;
                      }
                    );
                }
                break;
              case 'APIAttributeName':
                {
                  const apiAttributeQuery = `SELECT ATTRIBUTE_NAME FROM API_ATTRIBUTE WHERE API_ATTRIBUTE_UUID in(${keyValue[1]}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let apiAttributeQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      apiAttributeQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<API Attribute Name>',
                      function () {
                        return (
                          `'` + apiAttributeQueryData['ATTRIBUTE_NAME'] + `'`
                        );
                      }
                    );
                }
                break;
              case 'APIAttributeValue':
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<API Attribute Value>',
                      keyValue[1]
                        ? function () {
                            return keyValue[1];
                          }
                        : `' '`
                    );
                }
                break;
              case 'ResponseCodeValue':
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      '<Response Code Value>',
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
        !isFunctionOrUIElementGroup && inputStepType === 'Pre Condition'
          ? 'Given '
          : !isFunctionOrUIElementGroup && inputStepType === 'User Input'
          ? 'When '
          : !isFunctionOrUIElementGroup && inputStepType === 'Expected Result'
          ? 'Then '
          : '';
      data['ATTRIBUTE_KEYS'] = stepDefinitionVerbiageList.length
        ? getKeywordByStepType + stepDefTemplateVerbiageName
        : '';
      if (input && input.FIRST_CHILD_GRID_NAME == 'Test Case Step By Page') {
        data['ATTRIBUTE_KEY'] =
          data['TEST_CASE_STEP_ID'] + ' - ' + data['ATTRIBUTE_KEYS'];
      } else if (
        input &&
        input.SECOND_CHILD_GRID_NAME == 'Test Case Step By UI Element'
      ) {
        data['ATTRIBUTE_KEY'] =
          data['TEST_CASE_STEP_ID'] + ' - ' + data['ATTRIBUTE_KEYS'];
      } else if (
        input &&
        input.SECOND_CHILD_GRID_NAME == 'Test Case Step By Function'
      ) {
        data['ATTRIBUTE_KEY'] =
          data['TEST_CASE_STEP_ID'] + ' - ' + data['ATTRIBUTE_KEYS'];
      } else if (
        input &&
        input.SECOND_CHILD_GRID_NAME === 'Function Step Under Page'
      ) {
        if (data['FUNCTION_STEP_ID'] && data['ATTRIBUTE_KEYS']) {
          data['ATTRIBUTE_KEY'] =
            data['FUNCTION_STEP_ID'] + ' - ' + data['ATTRIBUTE_KEYS'];
        } else {
          data['ATTRIBUTE_KEY'] = ' ';
        }
      } else if (
        input &&
        input.FIRST_CHILD_GRID_NAME == 'Function Step Under UI Element'
      ) {
        data['ATTRIBUTE_KEY'] =
          data['FUNCTION_STEP_ID'] + ' - ' + data['ATTRIBUTE_KEYS'];
      } else if (
        input &&
        input.THIRD_CHILD_GRID_NAME == 'UI Element Group Step Under UI Element'
      ) {
        data['ATTRIBUTE_KEY'] =
          data['UI_ELEMENT_GROUP_STEP_ID'] + ' - ' + data['ATTRIBUTE_KEYS'];
      } else if (
        input &&
        input.THIRD_CHILD_GRID_NAME == 'UI Element Group Step Under Page'
      ) {
        if (data['UI_ELEMENT_GROUP_STEP_ID'] && data['ATTRIBUTE_KEYS']) {
          data['ATTRIBUTE_KEY'] =
            data['UI_ELEMENT_GROUP_STEP_ID'] + ' - ' + data['ATTRIBUTE_KEYS'];
        } else {
          data['ATTRIBUTE_KEY'] = ' ';
        }
      } else if (
        input &&
        input.SECOND_CHILD_GRID_NAME == 'Test Case Step Under API'
      ) {
        data['ATTRIBUTE_KEY'] =
          data['TEST_CASE_STEP_ID'] + ' - ' + data['ATTRIBUTE_KEYS'];
      } else if (
        input &&
        input.FIRST_CHILD_GRID_NAME == 'Test Case Step Under API Attribute'
      ) {
        data['ATTRIBUTE_KEY'] =
          data['TEST_CASE_STEP_ID'] + ' - ' + data['ATTRIBUTE_KEYS'];
      } else if (
        input &&
        input.THIRD_CHILD_GRID_NAME === 'Function Step Under API'
      ) {
        if (data['FUNCTION_STEP_ID'] && data['ATTRIBUTE_KEYS']) {
          data['ATTRIBUTE_KEY'] =
            data['FUNCTION_STEP_ID'] + ' - ' + data['ATTRIBUTE_KEYS'];
        } else {
          data['ATTRIBUTE_KEY'] = ' ';
        }
      } else if (
        input &&
        input.SECOND_CHILD_GRID_NAME == 'Function Step Under API Attribute'
      ) {
        data['ATTRIBUTE_KEY'] =
          data['FUNCTION_STEP_ID'] + ' - ' + data['ATTRIBUTE_KEYS'];
      }
    }
  }
  msg.payload.result = { gridData: queryData };
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
