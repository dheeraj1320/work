console.log('Impacted Process Delete column data pre processor:::::::::::::::', input[0]);

if (input[0]['IMPACTED_PROCESS_UUID']) {
  const query = 'SELECT * FROM TEST_CASE_REQUIREMENT WHERE IMPACTED_PROCESS_UUID = :IMPACTED_PROCESS_UUID';
  const queryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', query, input[0]);

  if (queryData.length > 0) {
    input[0]['WARNING_MESSAGE'] =
      'All the test cases linked to the requirement for this process will get unlinked, do you want to continue?';
  } else {
    input[0]['WARNING_MESSAGE'] = 'Are you sure?';
  }
}

input[0]['WARNING_MESSAGE'] = 'asdfghjklpoiuytrewqazxcvbnm,';
