const setErrorAndRenderFlag = (data, message) => {
  input[0].ERROR_MESSAGE = data.length === 0 ? message : '';
  input[0].HAS_FORM_RENDERED = 'Yes';
};

console.log("input check ------Pre-pro>>>> ", input[0]);

input[0]['SCOPE_INFO_MESSAGE'] = '';
function getStepVerbiageData(list, verbiageId) {
  if (list && list.length) {
    let data = list.filter(item => item.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID == verbiageId);
    if (data && data.length) {
      return data[0];
    } else {
      return {};
    }
  } else {
    return {};
  }
}

if (input[0].FORM_TYPE != 'Copy Test Case Steps') {
  input[0].FORM_TYPE = 'Copy Test Case';
  if (!input[0]['ORIGINAL_TEST_SET_UUID']) {
    input[0]['ORIGINAL_TEST_SET_UUID'] = input[0]['TEST_SET_UUID'];
  }

  if (input[0]['TEST_CASE_UUID']) {
    input[0]['ORIGINAL_TEST_CASE_UUID'] = input[0]['TEST_CASE_UUID'];
  }

  if (input[0]['PARENT_GRID_NAME'] == 'Personal Test Set') {
    input[0]['SRC_TEST_SET_TYPE'] = 'Personal';
  } else if (
    [
      'Unit Functional Test Set',
      'Personal - Unit Functional Test Set',
      'Personal - Orphan Test Set',
      'Orphan Test Set',
    ].includes(input[0]['PARENT_GRID_NAME'])
  ) {
    input[0]['SRC_TEST_SET_TYPE'] = 'User Action';
  } else if (['Test Set', 'Personal - Regular Test Set'].includes(input[0]['PARENT_GRID_NAME'])) {
    input[0]['SRC_TEST_SET_TYPE'] = 'Functional';
  }

  if (!input[0]['TEST_SET_TYPE']) {
    input[0]['TEST_SET_TYPE'] = null;
    input[0]['TEST_SET_UUID'] = null;
  }

  input[0]['IS_COPY_MAIN_PAGE'] = 'Yes';
} else {
  input[0].TEST_CASE_NAME = uuid();

  if (input[0].ORIGINAL_TEST_CASE_UUID && !input[0].HAS_FORM_RENDERED && input[0].SOURCE_TYPE == 'TEST_CASE') {
    const stepQuery = `SELECT TEST_CASE_STEP_UUID FROM TEST_CASE_STEP WHERE TEST_CASE_UUID = :ORIGINAL_TEST_CASE_UUID`;
    const stepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepQuery, input[0]);
    setErrorAndRenderFlag(stepQueryData, 'No Test Case Steps found for this Test Case.');
  } else if (input[0].SOURCE_TYPE == 'TEST_CASE' && input[0]['START_STEP'] && input[0]['END_STEP']) {
    const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:ORIGINAL_TEST_CASE_UUID and TEST_CASE_STEP_SEQ_ID>=:START_STEP and TEST_CASE_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
    let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input[0]);

    let testCaseStepStr = testCaseStepQueryData.map((item) => `'${item['TEST_CASE_STEP_UUID']}'`).join(',');

    const testCaseStepAttributeQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;

    let testCaseStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeQuery, input[0]);

    let isScopeExists = testCaseStepAttributeQueryData.filter((item) => item['SCOPE_VARIABLE_UUID'] !== undefined && item['SCOPE_VARIABLE_UUID'] !== null && item['SCOPE_VARIABLE_UUID'] !== '');

    if (isScopeExists && isScopeExists.length) {
      input[0]['SCOPE_INFO_MESSAGE'] = 'If Step that creates Scope variable is not included, Steps that uses the scope variable will be set to blank.';
      input[0]['SKIP_SCOPE_STEP_INFO_MES'] = 'Scope steps are not allowed in page view navigation and those steps will be removed.';
    }
  } else if (input[0].SOURCE_TYPE == 'FUNCTION' && !input[0].HAS_FORM_RENDERED) {
    const funcQuery = `SELECT FUNCTION_STEP_UUID FROM FUNCTION_STEP WHERE FUNCTION_UUID = :FUNCTION_UUID`;
    const funcQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', funcQuery, input[0]);
    setErrorAndRenderFlag(funcQueryData, 'No Function Steps found for this Function.');
  } else if (input[0].SOURCE_TYPE == 'FUNCTION' && input[0]['START_STEP'] && input[0]['END_STEP']) {
    const functionStepQuery = `SELECT * FROM FUNCTION_STEP where FUNCTION_UUID=:FUNCTION_UUID and FUNCTION_STEP_SEQ_ID>=:START_STEP and FUNCTION_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_STEP_SEQ_ID asc`;
    let functionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepQuery, input[0]);
    let functionStepStr = functionStepQueryData.map((item) => `'${item['FUNCTION_STEP_UUID']}'`).join(',');
    const functionStepAttributeQuery = `SELECT * FROM FUNCTION_STEP_ATTRIBUTE_VALUE WHERE FUNCTION_STEP_UUID in(${functionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let functionStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepAttributeQuery, input[0]);
    let isScopeExists = functionStepAttributeQueryData.filter((item) => item['SCOPE_VARIABLE_UUID'] !== undefined && item['SCOPE_VARIABLE_UUID'] !== null && item['SCOPE_VARIABLE_UUID'] !== '');
    if (isScopeExists && isScopeExists.length) {
      input[0]['SCOPE_INFO_MESSAGE'] = 'If Step that creates Scope variable is not included, Steps that uses the scope variable will be set to blank.';
      input[0]['SKIP_SCOPE_STEP_INFO_MES'] = 'Scope steps are not allowed in page view navigation and those steps will be removed.';
    }
  } else if (input[0].SOURCE_TYPE == 'UI_ELEMENT_GROUP') {
    if (!input[0].HAS_FORM_RENDERED) {
      const uielQuery = `SELECT UI_ELEMENT_GROUP_STEP_UUID FROM UI_ELEMENT_GROUP_STEP WHERE UI_ELEMENT_GROUP_UUID = :UI_ELEMENT_GROUP_UUID`;
      const uielQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uielQuery, input[0]);
      setErrorAndRenderFlag(uielQueryData, 'No UI Element Group Steps found for this UI Element Group.');
    }
    if (input[0].START_STEP && input[0].END_STEP) {
      const uiElGrQuery = `SELECT UI_ELEMENT_GROUP_STEP_UUID FROM UI_ELEMENT_GROUP_STEP WHERE UI_ELEMENT_GROUP_UUID = :UI_ELEMENT_GROUP_UUID AND UI_ELEMENT_GROUP_STEP_SEQ_ID >= :START_STEP AND UI_ELEMENT_GROUP_STEP_SEQ_ID <= :END_STEP`;
      const uiElGrQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
        'PRIMARYSPRINGFM',
        uiElGrQuery,
        input[0]
      );
      if (uiElGrQueryData.length > 0) {
        const str = uiElGrQueryData.map((item) => item.UI_ELEMENT_GROUP_STEP_UUID).join(',');
        input[0].SOURCE_UI_ELEMENT_GROUP_STEP_UUIDS = str;
      }
    }
  }
}


if (!input[0].ERROR_MESSAGE) {
  input[0].ERROR_MESSAGE = '';
}

if (input[0].DESTINATION_STEP_POSITION && input[0].DESTINATION_STEP_POSITION != 'Intermediate Test Case Step') {
  input[0].DESTINATION_AFTER_STEP = null;
}