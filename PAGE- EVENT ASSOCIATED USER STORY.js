const INTEGRATION_TEST_CASE = [];

if (input['ASSOCIATION_TYPE'] == 'USER_ACTION') {
  if (input['IS_SOLO_REQUIREMENT'] == 'Yes' && (!input['CONDITION_SATISFACTION_UUID'] || input['CONDITION_SATISFACTION_UUID'] == 'null')) {
    input['ASSOCIATION_TYPE'] = 'PAGE-EVENT';
    input['CONDITION_SATISFACTION_UUID'] = null;
  } else if (input['IS_SOLO_REQUIREMENT'] == 'No' && input['CONDITION_SATISFACTION_UUID']) {
    input['ASSOCIATION_TYPE'] = 'PAGE-EVENT';
  }
}
if (input['ASSOCIATION_TYPE'] == 'REQUIREMENT_TITLE') {
  if (input['IS_SOLO_REQUIREMENT'] == 'Yes' && (!input['CONDITION_SATISFACTION_UUID'] || input['CONDITION_SATISFACTION_UUID'] == 'null')) {
    input['ASSOCIATION_TYPE'] = 'FEATURE';
    input['CONDITION_SATISFACTION_UUID'] = null;
  } else if (input['CONDITION_SATISFACTION_UUID']) {
    input['ASSOCIATION_TYPE'] = 'FEATURE';
  }
}

const getTestCaseForRequirement = async () => {
  const requirementQuery = `SELECT tc.TEST_CASE_UUID, tc.USER_STORY_UUID FROM TEST_CASE_REQUIREMENT tcr JOIN TEST_CASE tc ON tcr.TEST_CASE_UUID = tc.TEST_CASE_UUID WHERE REQUIREMENT_UUID = :REQUIREMENT_UUID`;
  return await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', requirementQuery, input);
};

if (input['compositeEntityAction'] == 'Save' || input['compositeEntityAction'] == 'Insert') {
  // Updating Test Case Steps
  const userStoryQuery = `SELECT USER_STORY_STATUS FROM USER_STORY WHERE USER_STORY_UUID = :USER_STORY_UUID`;
  const userStoryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', userStoryQuery, input);

  if (userStoryData && userStoryData.length > 0 && ['Draft', 'In-Progress'].includes(userStoryData[0].USER_STORY_STATUS)) {
    const requirementData = await getTestCaseForRequirement();

    for (const data of requirementData) {
      const existingUUIDs = new Set(
        (data['USER_STORY_UUID'] || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      );

      if (!existingUUIDs.has(input['USER_STORY_UUID'])) {
        console.log('Adding user story to test case :', data['TEST_CASE_UUID']);
        existingUUIDs.add(input['USER_STORY_UUID']);
        const testCaseObj = {
          compositeEntityAction: 'Update',
          TEST_CASE_UUID: data['TEST_CASE_UUID'],
          USER_STORY_UUID: Array.from(existingUUIDs).join(',')
        };
        INTEGRATION_TEST_CASE.push(testCaseObj);
      }
    }
  }
} else if (input['compositeEntityAction'] == 'Update' && input['OLD_USER_STORY_UUID'] != input['USER_STORY_UUID']) {
  const userStoryQuery = `SELECT USER_STORY_STATUS FROM USER_STORY WHERE USER_STORY_UUID = :USER_STORY_UUID`;
  const userStoryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', userStoryQuery, input);

  if (userStoryData && userStoryData.length > 0 && ['Draft', 'In-Progress'].includes(userStoryData[0].USER_STORY_STATUS)) {
    const requirementData = await getTestCaseForRequirement();

    for (const data of requirementData) {
      const existingUUIDs = new Set(
        (data['USER_STORY_UUID'] || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      );
      let changed = false;

      if (existingUUIDs.has(input['OLD_USER_STORY_UUID'])) {
        existingUUIDs.delete(input['OLD_USER_STORY_UUID']);
        changed = true;
      }

      if (!existingUUIDs.has(input['USER_STORY_UUID'])) {
        existingUUIDs.add(input['USER_STORY_UUID']);
        changed = true;
      }

      if (changed) {
        const testCaseObj = {
          compositeEntityAction: 'Update',
          TEST_CASE_UUID: data['TEST_CASE_UUID'],
          USER_STORY_UUID: Array.from(existingUUIDs).join(',')
        };
        INTEGRATION_TEST_CASE.push(testCaseObj);
      }
    }
  }
} else if (input['compositeEntityAction'] == 'Delete') {
  const requirementData = await getTestCaseForRequirement();

  for (const data of requirementData) {
    const existingUUIDs = new Set(
      (data['USER_STORY_UUID'] || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    );

    if (existingUUIDs.has(input['USER_STORY_UUID'])) {
      existingUUIDs.delete(input['USER_STORY_UUID']);
      const testCaseObj = {
        compositeEntityAction: 'Update',
        TEST_CASE_UUID: data['TEST_CASE_UUID'],
        USER_STORY_UUID: Array.from(existingUUIDs).join(',')
      };
      INTEGRATION_TEST_CASE.push(testCaseObj);
    }
  }
}

input['AppEngChildEntity:INTEGRATION_TEST_CASE'] = INTEGRATION_TEST_CASE;
