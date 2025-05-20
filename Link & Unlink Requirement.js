console.log('inside nbr for All Feature Requirement for unit functional testing ', input);

const INTEGRATION_TEST_CASE = [];
const INTEGRATION_TEST_CASE_REQUIREMENT_CHILD = [];

const getUserStoryForRequirement = async () => {
  const userStoryQuery = `SELECT ius.USER_STORY_UUID, us.USER_STORY_NAME, us.USER_STORY_STATUS  FROM IMPACTED_USER_STORY ius JOIN USER_STORY us ON ius.USER_STORY_UUID = us.USER_STORY_UUID where ius.REQUIREMENT_UUID = :REQUIREMENT_UUID;`;
  return await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', userStoryQuery, input);
};

if (input['compositeEntityAction'] == 'Link') {
  const userStoryData = await getUserStoryForRequirement();

  let newUUIDs = input['TEST_CASE_USER_STORY_UUID'];
  for (const data of userStoryData) {
    if (
      ['Draft', 'In-Progress'].includes(data.USER_STORY_STATUS) &&
      !newUUIDs.split(',').includes(data.USER_STORY_UUID)
    ) {
      console.log('Adding user story to test case : ', data.USER_STORY_NAME);
      newUUIDs += ',' + data.USER_STORY_UUID;
    }
  }
  if (input['TEST_CASE_USER_STORY_UUID'] != newUUIDs) {
    const testCaseObj = {
      TEST_CASE_UUID: input['TEST_CASE_UUID'],
      USER_STORY_UUID: newUUIDs,
    };
    INTEGRATION_TEST_CASE.push(testCaseObj);
  }
} else if (input['compositeEntityAction'] == 'Unlink' || input['compositeEntityAction'] == 'UnLink') {
  // Deleting test case requirement
  const testCaseRequirementObj = {
    compositeEntityAction: 'Delete',
    TEST_CASE_REQUIREMENT_UUID: input['TEST_CASE_REQUIREMENT_UUID'],
  };
  INTEGRATION_TEST_CASE_REQUIREMENT_CHILD.push(testCaseRequirementObj);

  const userStoryData = await getUserStoryForRequirement();

  for (const data of userStoryData) {
    if (input['TEST_CASE_USER_STORY_UUID'] && input['TEST_CASE_USER_STORY_UUID'].includes(data.USER_STORY_UUID)) {
      console.log('Removing user story from test case : ', data.USER_STORY_NAME);

      let ids = input['TEST_CASE_USER_STORY_UUID'].split(',');

      let index = ids.indexOf(data.USER_STORY_UUID);
      if (index !== -1) ids.splice(index, 1);

      let finalIds = ids.join(',');
      console.log('Final ids ==== ', finalIds);

      const testCaseObj = {
        compositeEntityAction: 'Update',
        TEST_CASE_UUID: input['TEST_CASE_UUID'],
        USER_STORY_UUID: finalIds,
      };
      INTEGRATION_TEST_CASE.push(testCaseObj);
    }
  }
}

input['AppEngChildEntity:INTEGRATION_TEST_CASE'] = INTEGRATION_TEST_CASE;
input['AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT CHILD'] = INTEGRATION_TEST_CASE_REQUIREMENT_CHILD;
