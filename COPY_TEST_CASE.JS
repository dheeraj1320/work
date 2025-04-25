const setErrorAndRenderFlag = (data, message) => {
  input[0].ERROR_MESSAGE = data.length === 0 ? message : '';
  input[0].HAS_FORM_RENDERED = 'Yes';
};

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
    console.log('query fired ==========================');
    const stepQuery = `SELECT TEST_CASE_STEP_UUID FROM TEST_CASE_STEP WHERE TEST_CASE_UUID = :ORIGINAL_TEST_CASE_UUID`;
    const stepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepQuery, input[0]);

    setErrorAndRenderFlag(stepQueryData, 'No Test Case Steps found for this Test Case.');
  } else if (input[0].SOURCE_TYPE == 'FUNCTION') {
    if (!input[0].HAS_FORM_RENDERED) {
      console.log('query fired ==========================');
      const funcQuery = `SELECT FUNCTION_STEP_UUID FROM FUNCTION_STEP WHERE FUNCTION_UUID = :FUNCTION_UUID`;
      const funcQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', funcQuery, input[0]);

      setErrorAndRenderFlag(funcQueryData, 'No Function Steps found for this Function.');
    }
  } else if (input[0].SOURCE_TYPE == 'UI_ELEMENT_GROUP') {
    if (!input[0].HAS_FORM_RENDERED) {
      console.log('query fired ==========================');
      const uielQuery = `SELECT UI_ELEMENT_GROUP_STEP_UUID FROM UI_ELEMENT_GROUP_STEP WHERE UI_ELEMENT_GROUP_UUID = :UI_ELEMENT_GROUP_UUID`;
      const uielQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uielQuery, input[0]);

      setErrorAndRenderFlag(uielQueryData, 'No UI Element Group Steps found for this UI Element Group.');
    }

    if (input[0].START_STEP && input[0].END_STEP) {
      console.log('query fired ==========================');

      const uiElGrQuery = `SELECT UI_ELEMENT_GROUP_STEP_UUID FROM UI_ELEMENT_GROUP_STEP WHERE UI_ELEMENT_GROUP_UUID = :UI_ELEMENT_GROUP_UUID AND UI_ELEMENT_GROUP_STEP_ID >= :START_STEP AND UI_ELEMENT_GROUP_STEP_ID <= :END_STEP`;
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


if(!input[0].ERROR_MESSAGE){
  input[0].ERROR_MESSAGE = '';
}

if(input[0].DESTINATION_STEP_POSITION && input[0].DESTINATION_STEP_POSITION != 'Intermediate Test Case Step'){
  input[0].DESTINATION_AFTER_STEP = null;
}