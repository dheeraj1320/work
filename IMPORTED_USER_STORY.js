const TEST_SET_NEW = [];

if (input.compositeEntityAction == 'Import User Story') {
  input['USER_STORY_SOURCE_ID'] = input['ID'];
  input['USER_STORY_NAME'] = input['Name'];
  input['USER_STORY_STATUS'] = 'Draft';
  input['USER_STORY_SOURCE_TYPE'] = 'Rally';

  const testSetObj = {};
  testSetObj['TEST_SET_NAME'] = input['USER_STORY_NAME'];
  testSetObj['TEST_SET_TYPE'] = 'User Story';
  testSetObj['FUNCTIONAL_AREA_UUID'] = input['APP_LOGGED_IN_FUNTIONAL_AREA_ID'];
  testSetObj['USER_STORY_UUID'] = input['USER_STORY_UUID'];
  TEST_SET_NEW.push(testSetObj);
}

input['AppEngChildEntity:TEST_SET_NEW'] = TEST_SET_NEW;

