console.log('USER_ACTION composite entity running :::::+++=================== >>>>>>>>>>>>>>>>>>> ');

const TEST_SET = [];
const USER_ACTION_OUTCOME = [];

if ((input.compositeEntityAction == 'Insert' || input.ActionName == 'Insert') && input.className !== 'OUTCOME') {
  let UiElenemtNameQuery =
    'Select UI_ELEMENT_NAME From UI_ELEMENT Where UI_ELEMENT_UUID=:UI_ELEMENT_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID';
  let UiElenemtNameQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    UiElenemtNameQuery,
    input
  );
  UiElenemtNameData = JSON.parse(JSON.stringify(UiElenemtNameQueryData));
  input['USER_ACTION_NAME'] = UiElenemtNameData[0]['UI_ELEMENT_NAME'];
  input['USER_ACTION_LONGTEXT_UUID'] = uuid();

  if (input.className == 'USER_ACTION' && input.ActionName == 'Insert') {
    let pageViewQuery =
      "select VIEW_UUID From PAGE_VIEW where PAGE_UUID=:PAGE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND IS_DEFAULT_VIEW='Yes'";
    let pageViewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
      'PRIMARYSPRINGFM',
      pageViewQuery,
      input
    );

    console.log('pageViewQueryData :::::::::::::::::::::', pageViewQueryData);
    if (pageViewQueryData && Object.keys(pageViewQueryData).length) {
      input['VIEW_UUID'] = pageViewQueryData['VIEW_UUID'];
    }
  }

  const pageNameQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID = '${input.PAGE_UUID}'`;
  const pageNameData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageNameQuery, input);

  const processNameQuery = `SELECT PROCESS_NAME FROM PROCESS WHERE PROCESS_UUID = '${input.PROCESS_UUID}'`;
  const processNameData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', processNameQuery, input);

  const testSetName = `${processNameData[0].PROCESS_NAME} - ${pageNameData[0].PAGE_NAME} - ${UiElenemtNameData[0].UI_ELEMENT_NAME}`;

  const testSetQuery = `SELECT TEST_SET_UUID FROM TEST_SET WHERE TEST_SET_NAME = '${testSetName}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);

  const testSetObj = {};
  if (testSetQueryData && testSetQueryData.length > 0) {
    testSetObj.TEST_SET_UUID = testSetQueryData[0].TEST_SET_UUID;
  }
  // Setting tags uuid to unit functional test case
  testSetObj.TAGS_UUID = '1b763b10-f81c-11ee-8c09-9376aaa8e4da';
  testSetObj.USER_ACTION_UUID = input.USER_ACTION_UUID;
  testSetObj.VIEW_UUID = input.VIEW_UUID;
  testSetObj.PAGE_UUID = input.PAGE_UUID;
  testSetObj.PROCESS_UUID = input.PROCESS_UUID;
  testSetObj.FUNCTIONAL_AREA_UUID = input.APP_LOGGED_IN_FUNTIONAL_AREA_ID;
  testSetObj.TEST_SET_NAME = testSetName;

  TEST_SET.push(testSetObj);

} else if(input.className === 'OUTCOME'){

  const userActionQuery = `SELECT * FROM VIEW_USER_ACTION WHERE USER_ACTION_UUID = '${input.USER_ACTION_UUID}'`;
  const userActionData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', userActionQuery, input);

  const outcomeObj = {};
  outcomeObj.PROCESS_UUID = userActionData[0].PROCESS_UUID;
  outcomeObj.PAGE_UUID = userActionData[0].PAGE_UUID;
  outcomeObj.USER_ACTION_UUID = userActionData[0].USER_ACTION_UUID;
  outcomeObj.FUNCTIONAL_AREA_UUID = userActionData[0].FUNCTIONAL_AREA_UUID;
  outcomeObj.OUTCOME_NAME = 'Outcome';

  USER_ACTION_OUTCOME.push(outcomeObj);
}

console.log('input :::::::::::::::::::::', input);

input['AppEngChildEntity:TEST_SET_NEW'] = TEST_SET;
input['AppEngChildEntity:USER_ACTION_OUTCOME'] = USER_ACTION_OUTCOME;