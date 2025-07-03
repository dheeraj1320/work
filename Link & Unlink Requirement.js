console.log('inside nbr for All Feature Requirement for unit functional testing ', input);

const INTEGRATION_TEST_CASE = [];
const INTEGRATION_TEST_CASE_REQUIREMENT_CHILD = [];

const getUserStoryForRequirement = async () => {
  const userStoryQuery = `SELECT ius.IMPACTED_USER_STORY_UUID, ius.USER_STORY_UUID, us.USER_STORY_NAME, us.USER_STORY_STATUS  FROM IMPACTED_USER_STORY ius JOIN USER_STORY us ON ius.USER_STORY_UUID = us.USER_STORY_UUID where ius.REQUIREMENT_UUID = :REQUIREMENT_UUID;`;
  return await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', userStoryQuery, input);
};

const checkIfOtherLinkingExists = async (testCaseUUID, userStoryUUID, testCaseRequirementUUID) => {

  const otherRequirementsForThisTestCase = `SELECT TEST_CASE_UUID, REQUIREMENT_UUID FROM TEST_CASE_REQUIREMENT WHERE TEST_CASE_UUID = '${testCaseUUID}' and TEST_CASE_REQUIREMENT_UUID != '${testCaseRequirementUUID}'`;
  const otherRequirementsForThisTestCaseData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', otherRequirementsForThisTestCase, input);

  for(const otherReq of otherRequirementsForThisTestCaseData) {
    const iusQuery = `SELECT USER_STORY_UUID FROM IMPACTED_USER_STORY WHERE REQUIREMENT_UUID = '${otherReq['REQUIREMENT_UUID']}' AND USER_STORY_UUID = '${userStoryUUID}'`;
    const iusData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', iusQuery, input);
    if (iusData && iusData.length > 0) {
      return true; // Found another linking
    }
  }
  return false; // No other linking found
};

// const checkIfOtherLinkingExists = async (testCaseUUID, userStoryUUID, impactedUserStoryUUID) => {
//   // Checking if this user story is related to the test case via any other requirement
//   const iusQuery = `SELECT REQUIREMENT_UUID, USER_STORY_UUID FROM IMPACTED_USER_STORY where USER_STORY_UUID = '${userStoryUUID}' AND IMPACTED_USER_STORY_UUID != '${impactedUserStoryUUID}'`;
//   const iusData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', iusQuery, input);

//   for (const ius of iusData) {
//     const testCaseReqForThisReq = `SELECT TEST_CASE_UUID, REQUIREMENT_UUID FROM TEST_CASE_REQUIREMENT WHERE REQUIREMENT_UUID = '${ius['REQUIREMENT_UUID']}' and TEST_CASE_UUID = '${testCaseUUID}'`;
//     const testCaseReqData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseReqForThisReq, input);
//     if (testCaseReqData && testCaseReqData.length > 0) {
//       return true; // Found another linking
//     }
//   }

//   return false; // No other linking found
// };

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
      const foundOtherLinking = await checkIfOtherLinkingExists(input['TEST_CASE_UUID'], data.USER_STORY_UUID, input['TEST_CASE_REQUIREMENT_UUID']);

      if (!foundOtherLinking) {
        existingUUIDs.delete(data.USER_STORY_UUID);
        changed = true;
      }
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
