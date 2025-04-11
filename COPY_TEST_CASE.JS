if (input[0].FORM_TYPE != 'Copy Test Case Steps') {
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
  if (input[0].ORIGINAL_TEST_CASE_UUID && !input[0].HAS_FORM_RENDERED && input[0].SOURCE_TYPE == 'TEST_CASE' ) {
    console.log('query fired ==========================');
    const stepQuery = `SELECT TEST_CASE_STEP_UUID FROM TEST_CASE_STEP WHERE TEST_CASE_UUID = :ORIGINAL_TEST_CASE_UUID`;
    const stepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepQuery, input[0]);

    if (stepQueryData.length == 0) {
      input[0].ERROR_MESSAGE = 'No Test Case Steps found for this Test Case.';
    } else {
      input[0].ERROR_MESSAGE = '';
    }
    input[0].HAS_FORM_RENDERED = 'Yes';
  }
  else if (input[0].SOURCE_TYPE == 'FUNCTION') {
    if(!input[0].HAS_FORM_RENDERED ){
    console.log('query fired ==========================');
    const funcQuery = `SELECT FUNCTION_STEP_UUID FROM FUNCTION_STEP WHERE FUNCTION_UUID = :FUNCTION_UUID`;
    const funcQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', funcQuery, input[0]);

    if (funcQueryData.length == 0) {
      input[0].ERROR_MESSAGE = 'No Function Steps found for this Function.';
    } else {
      input[0].ERROR_MESSAGE = '';
    }
    input[0].HAS_FORM_RENDERED = 'Yes';
}
  } else if (input[0].SOURCE_TYPE == 'UI_ELEMENT_GROUP'){
    if(!input[0].HAS_FORM_RENDERED ){

        console.log('query fired ==========================');
        const uielQuery = `SELECT UI_ELEMENT_GROUP_STEP_UUID FROM UI_ELEMENT_GROUP_STEP WHERE UI_ELEMENT_GROUP_UUID = :UI_ELEMENT_GROUP_UUID`;
        const uielQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uielQuery, input[0]);
    
        if (uielQueryData.length == 0) {
          input[0].ERROR_MESSAGE = 'No UI Element Group Steps found for this UI Element Group.';
        } else {
          input[0].ERROR_MESSAGE = '';
        }
        input[0].HAS_FORM_RENDERED = 'Yes';
    }

    if(input[0].START_STEP && input[0].END_STEP){
        const uiElGrQuery = `SELECT UI_ELEMENT_GROUP_STEP_UUID FROM UI_ELEMENT_GROUP_STEP WHERE UI_ELEMENT_GROUP_UUID = :UI_ELEMENT_GROUP_UUID AND UI_ELEMENT_GROUP_STEP_ID >= :START_STEP AND UI_ELEMENT_GROUP_STEP_ID <= :END_STEP`;
        const uiElGrQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElGrQuery, input[0]);
        if (uiElGrQueryData.length > 0) {
            const str = uiElGrQueryData.map((item) => item.UI_ELEMENT_GROUP_STEP_UUID).join(',');
            input[0].SOURCE_UI_ELEMENT_GROUP_STEP_UUIDS = str;
        }


    }
  }
}
