// For add
const query = `SELECT COUNT(APPLICATION_ENVIRONMENT_UUID) as RECORD_COUNT FROM APPLICATION_ENVIRONMENT WHERE FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
const queryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', query, input[0]);

if (queryData && queryData[0].RECORD_COUNT == 0) {
  input[0].IS_DEFAULT_DROPDOWN_EDITABLE = 'No';
  input[0].IS_DEFAULT_APPLICATION_ENVIRONMENT = 'Yes';
} else {
  input[0].IS_DEFAULT_DROPDOWN_EDITABLE = 'Yes';
}

// For edit
const queri = `SELECT COUNT(APPLICATION_ENVIRONMENT_UUID) AS RECORD_COUNT FROM APPLICATION_ENVIRONMENT WHERE FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
const queriData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', queri, input[0]);

if (queriData && queriData[0].RECORD_COUNT == 1 && input[0].IS_DEFAULT_APPLICATION_ENVIRONMENT == 'Yes') {
  input[0].IS_DEFAULT_DROPDOWN_EDITABLE = 'No';
} else {
  input[0].IS_DEFAULT_DROPDOWN_EDITABLE = 'Yes';
}
