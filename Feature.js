let test_set = [];
let INTEGRATION_TEST_CASE = [];

let test_set_obj = {};

const getTestCaseForRequirement = async () => {
  const requirementQuery = `SELECT tc.TEST_CASE_UUID, tc.USER_STORY_UUID FROM TEST_CASE_REQUIREMENT tcr JOIN TEST_CASE tc ON tcr.TEST_CASE_UUID = tc.TEST_CASE_UUID WHERE REQUIREMENT_UUID = :REQUIREMENT_UUID`;
  return await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', requirementQuery, input);
};

if (input.compositeEntityAction == 'Insert') {
  test_set_obj['TEST_SET_UUID'] = uuid();
  test_set_obj['TEST_SET_NAME'] = input['REQUIREMENT_TITLE'];
  test_set_obj['TEST_SET_TYPE'] = 'Feature';
  test_set_obj['FEATURE_UUID'] = input['REQUIREMENT_TITLE_UUID'];
  test_set.push(test_set_obj);
}
if (input.compositeEntityAction == 'Update' || input.compositeEntityAction == 'Delete') {
  let QuerytoFetch = `select TEST_SET_UUID from TEST_SET where FEATURE_UUID=:REQUIREMENT_TITLE_UUID`;
  let QuerytoFetchData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', QuerytoFetch, input);
  let QuerytoFetchRecords = JSON.parse(JSON.stringify(QuerytoFetchData));

  test_set_obj['TEST_SET_UUID'] = QuerytoFetchRecords[0].TEST_SET_UUID;
  if (input.compositeEntityAction == 'Update') {
    test_set_obj['TEST_SET_NAME'] = input['REQUIREMENT_TITLE'];
  }
  test_set.push(test_set_obj);
}

if (input.compositeEntityAction == 'Delete') {
  const testCaseData = await getTestCaseForRequirement();

  for (const data of testCaseData) {
    const existingUUIDs = new Set(
      (data['USER_STORY_UUID'] || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }
}

input['AppEngChildEntity:TEST_SET_NEW'] = test_set;
input['AppEngChildEntity:INTEGRATION_TEST_CASE'] = INTEGRATION_TEST_CASE;
