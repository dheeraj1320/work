debugger;
try {
  let input = Object.assign(
    msg.payload.apiRequestBody?.baseEntity?.records[0]
      ? msg.payload.apiRequestBody?.baseEntity?.records[0]
      : msg.payload.apiRequestBody,
    msg.payload.referenceData
  );
  let sourceType = input.SOURCE_TYPE;
  let testUUUID = '';
  switch (sourceType) {
    case 'TEST_CASE':
      testUUUID = input['TEST_CASE_UUID'];
      break;
    case 'TEST_SET':
      testUUUID = input['TEST_SET_UUID'];
      break;
    case 'FUNCTION':
      testUUUID = input['FUNCTION_UUID'];
      break;
    case 'TEST_SUITE':
      testUUUID = input['TEST_SUITE_UUID'];
      break;
    case 'MULTIPLE_TEST_SET':
      testUUUID = input['TEST_SET_UUID'];
      break;
    case 'NAVIGATION_STEPS':
      testUUUID = input['VIEW_UUID'];
      break;
    default:
      throw new Error(`Unsupported SOURCE_TYPE: ${sourceType}`);
  }
  let data = {
    Type: input.SOURCE_TYPE,
    APP_LOGGED_IN_FUNTIONAL_AREA_ID: input.APP_LOGGED_IN_FUNTIONAL_AREA_ID,
    APPLICATION_ENVIRONMENT_BASE_URL: input.APPLICATION_ENVIRONMENT_BASE_URL,
    TEST_UUID: testUUUID,
    APP_LOGGED_IN_USER_ID: input.APP_LOGGED_IN_USER_ID,
    ASSERT_TIMEOUT: input.ASSERT_TIMEOUT,
    MAX_TIMEOUT: input.MAX_TIMEOUT,
    API_POLL_INTERVAL: input.API_POLL_INTERVAL,
    TEST_RUN_UUID: input.TEST_RUN_UUID,
  };
  const url = env.get('AUTOMATION_URL');
  msg.payload.connectorType = 'rally';
  msg.payload.methodType = 'update';
  msg.payload.url = url;
  msg.payload.data = { data: data };
  node.send(msg);
} catch (t) {
  console.log('Errorr Occured', t.message);
  return;
}

// --------------------------

try {
  let input = Object.assign(msg.payload, msg.payload.referenceData);
  if (input.responseFromThirdPartyAPI?.response?.message) {
    msg.payload.result = { mode: 'closeModal', message: input.responseFromThirdPartyAPI.response.message };
  } else if (input.responseFromThirdPartyAPI?.response?.error) {
    msg.payload.result = { mode: 'closeModal', message: input.responseFromThirdPartyAPI.response.error };
  }
  node.send(msg);
} catch (error) {
  console.log('Error Occurred:', error.message);
  return;
}
