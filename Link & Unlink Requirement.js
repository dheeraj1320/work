console.log('inside nbr for All Feature Requirement for unit functional testing ', input);

const INTEGRATION_TEST_CASE = [];
const INTEGRATION_TEST_CASE_REQUIREMENT_CHILD = [];

const getUserStoryForRequirement = async () => {
  const userStoryQuery = `SELECT ius.USER_STORY_UUID, us.USER_STORY_NAME, us.USER_STORY_STATUS  FROM IMPACTED_USER_STORY ius JOIN USER_STORY us ON ius.USER_STORY_UUID = us.USER_STORY_UUID where ius.REQUIREMENT_UUID = :REQUIREMENT_UUID;`;
  return await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', userStoryQuery, input);
};

if (input['compositeEntityAction'] === 'Link') {
  const userStoryData = await getUserStoryForRequirement();

  // Set to keep track of existing UUIDs (avoid duplicates)
  const existingUUIDs = new Set(
    (input['TEST_CASE_USER_STORY_UUID'] || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );

  let added = false;

  for (const data of userStoryData) {
    if (['Draft', 'In-Progress'].includes(data.USER_STORY_STATUS) && !existingUUIDs.has(data.USER_STORY_UUID)) {
      console.log('Adding user story to test case :', data.USER_STORY_NAME);
      existingUUIDs.add(data.USER_STORY_UUID);
      added = true;
    }
  }

  if (added) {
    const testCaseObj = {
      compositeEntityAction: 'Update',
      TEST_CASE_UUID: input['TEST_CASE_UUID'],
      USER_STORY_UUID: Array.from(existingUUIDs).join(','),
    };
    INTEGRATION_TEST_CASE.push(testCaseObj);
  }
} else if (input['compositeEntityAction'] === 'Unlink' || input['compositeEntityAction'] === 'UnLink') {
  // Deleting test case requirement
  const testCaseRequirementObj = {
    compositeEntityAction: 'Delete',
    TEST_CASE_REQUIREMENT_UUID: input['TEST_CASE_REQUIREMENT_UUID'],
  };
  INTEGRATION_TEST_CASE_REQUIREMENT_CHILD.push(testCaseRequirementObj);

  const userStoryData = await getUserStoryForRequirement();

  // Create a Set of current UUIDs
  const existingUUIDs = new Set(
    (input['TEST_CASE_USER_STORY_UUID'] || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  );

  let changed = false;

  for (const data of userStoryData) {
    if (existingUUIDs.has(data.USER_STORY_UUID)) {
      console.log('Removing user story from test case :', data.USER_STORY_NAME);
      existingUUIDs.delete(data.USER_STORY_UUID);
      changed = true;
    }
  }

  if (changed) {
    const finalIds = Array.from(existingUUIDs).join(',');
    console.log('Final ids ==== ', finalIds);

    const testCaseObj = {
      compositeEntityAction: 'Update',
      TEST_CASE_UUID: input['TEST_CASE_UUID'],
      USER_STORY_UUID: finalIds,
    };

    INTEGRATION_TEST_CASE.push(testCaseObj);
  }
}

input['AppEngChildEntity:INTEGRATION_TEST_CASE'] = INTEGRATION_TEST_CASE;
input['AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT CHILD'] = INTEGRATION_TEST_CASE_REQUIREMENT_CHILD;
