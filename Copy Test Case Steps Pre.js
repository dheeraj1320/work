if (input[0].TEST_CASE_UUID && !input[0].HAS_FORM_RENDERED) {
  console.log('query fired ==========================');
  const stepQuery = `SELECT TEST_CASE_STEP_UUID FROM TEST_CASE_STEP WHERE TEST_CASE_UUID = :TEST_CASE_UUID`;
  const stepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepQuery, input[0]);

  if (stepQueryData.length == 0) {
    input[0].WARNING_MESSAGE = 'No Test Case Steps Found for this Test Case.';
  } else {
    input[0].WARNING_MESSAGE = '';
  }
  input[0].HAS_FORM_RENDERED = 'Yes';
}

