import { v4 as uuidv4 } from 'uuid';
const MY_ID = '622e9c89-cb3a-4012-9e95-67095f3bb694';
import chalk from 'chalk';

function createAuditObject(newObject, operationType = 'Insert', oldObject = null) {
  const auditObj = { ...newObject };

  let auditDetails = {};

  if (operationType === 'Insert') {
    for (let key of Object.keys(newObject)) {
      auditDetails[key] = {
        oldValue: null,
        newValue: newObject[key]
      };
    }
  } else if (operationType === 'Update') {
    if (!oldObject) {
      throw new Error("oldObject must be provided for 'Update' operation.");
    }

    for (let key of Object.keys(newObject)) {
      const oldVal = oldObject[key];
      const newVal = newObject[key];

      // Only include keys where value actually changed
      if (oldVal !== newVal) {
        auditDetails[key] = {
          oldValue: oldVal,
          newValue: newVal
        };
      }
    }
  }

  auditObj.AE_OLD_NEW_COMPARISION_DETAILS = JSON.stringify(auditDetails);
  auditObj.AE_AUDIT_UUID = uuidv4();
  auditObj.AE_OPERATION_TYPE = operationType;
  auditObj.AE_TIMESTAMP = new Date();
  auditObj.OPERATION_PERFORMED_BY = MY_ID;

  return auditObj;
}

const getMssqlKnex = (knex, schemaName) => {
  return tableName => knex(tableName).withSchema(schemaName);
};

const updateSequence = async (mainKnex, tableName, newId) => {
  await mainKnex('SEQUENCE').where({ TABLE_NAME: tableName }).update({ MAX_TABLE_SEQ_ID: newId });
};

const getOrInitializeSequence = async (mainKnex, tableName) => {
  const result = await mainKnex('SEQUENCE').where({ TABLE_NAME: tableName });

  if (result.length > 0) {
    console.log('Got sequence for table: ✅ ', tableName);
    return Number(result[0]['MAX_TABLE_SEQ_ID']);
  } else {
    console.log('Initializing sequence for table: ✨ ', tableName);
    await mainKnex('SEQUENCE').insert({
      TABLE_NAME: tableName,
      MAX_TABLE_SEQ_ID: 0,
      AE_INSERT_ID: MY_ID,
      AE_INSERT_TS: new Date()
    });
    return 0;
  }
};

export const dataFixForTestCaseAndUserStory = async (req, res, knex, auditknexobj, schemaName) => {
  try {
    // schemaName is also required for mssql
    if (!knex || !auditknexobj) {
      console.log(' some inputs are missing');
      return res.status(400).json({ message: 'some inputs are missing' });
    }
    // UNCOMMENT THIS FOR MSSQL
    // const mainKnex = getMssqlKnex(knex, schemaName);
    // const auditKnex = getMssqlKnex(auditknexobj, schemaName);

    // UNCOMMENT THIS FOR MYSQL
    const mainKnex = knex;
    const auditKnex = auditknexobj;

    // ^ Creating Test Set for each User Story
    const testSetSeq = await getOrInitializeSequence(mainKnex, 'TEST_SET');
    const userStories = await mainKnex('USER_STORY').select('*').orderBy('USER_STORY_ID', 'asc');

    for (const userStory of userStories) {
      const existingTestSet = await mainKnex('TEST_SET').where({ USER_STORY_UUID: userStory['USER_STORY_UUID'] });

      if (existingTestSet.length > 0) {
        console.log(chalk.yellowBright('SKIPPING - Test Set already exists for User Story: ', userStory['USER_STORY_NAME']));
        continue;
      }

      const testSet = {
        TEST_SET_UUID: uuidv4(),
        TEST_SET_ID: ++testSetSeq,
        TEST_SET_NAME: userStory['USER_STORY_NAME'],
        TEST_SET_TYPE: 'User Story',
        USER_STORY_UUID: userStory['USER_STORY_UUID'],
        AE_INSERT_ID: MY_ID,
        AE_INSERT_TS: new Date(),
        AE_TRANSACTION_ID: uuidv4(),
        FUNCTIONAL_AREA_UUID: userStory['FUNCTIONAL_AREA_UUID']
      };

      await mainKnex('TEST_SET').insert(testSet);

      const testSetAudit = createAuditObject(testSet, 'Insert', null);
      await auditKnex('TEST_SET_AUDIT').insert(testSetAudit);
    }

    await updateSequence(mainKnex, 'TEST_SET', testSetSeq);
    console.log(chalk.greenBright('Test Set created for each User Story: ✅'));

    // ^ Updating Test Cases with USER_STORY_UUID
    const testCases = await mainKnex('TEST_CASE').select('*').orderBy('TEST_CASE_ID', 'desc');

    for (const tcase of testCases) {
      const testCaseRequirements = await mainKnex('TEST_CASE_REQUIREMENT').select('*').where({ TEST_CASE_UUID: tcase['TEST_CASE_UUID'] });

      if (testCaseRequirements.length === 0) {
        continue;
      }
      console.log(chalk.yellowBright('UPDATING TEST CASE... ', tcase['TEST_CASE_NAME']));

      let hasSetChanged = false;
      const existingUSUUIDs = new Set(
        (tcase['USER_STORY_UUID'] || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      );

      console.log(chalk.cyanBright('Existing US UUIDs: ', existingUSUUIDs));

      for (const tcReq of testCaseRequirements) {
        const userStory = await mainKnex('USER_STORY').select('*').where({ USER_STORY_UUID: tcReq['USER_STORY_UUID'] });
        if (userStory.length > 0) {
          if (['Draft', 'In-Progress'].includes(userStory[0]['USER_STORY_STATUS']) && !existingUSUUIDs.has(userStory[0]['USER_STORY_UUID'])) {
            existingUSUUIDs.add(userStory[0]['USER_STORY_UUID']);
            hasSetChanged = true;
          }
        }
      }

      console.log(chalk.cyanBright('Final US UUIDs: ', existingUSUUIDs));

      if (hasSetChanged) {
        const testCaseObj = {
          TEST_CASE_UUID: tcase['TEST_CASE_UUID'],
          TEST_CASE_ID: tcase['TEST_CASE_ID'],
          TEST_CASE_NAME: tcase['TEST_CASE_NAME'],
          AE_INSERT_ID: tcase['AE_INSERT_ID'],
          AE_UPDATE_ID: MY_ID,
          AE_INSERT_TS: tcase['AE_INSERT_TS'],
          AE_UPDATE_TS: new Date(),
          AE_TRANSACTION_ID: tcase['AE_TRANSACTION_ID'],
          FUNCTIONAL_AREA_UUID: tcase['FUNCTIONAL_AREA_UUID'],
          PRE_EXISTING_DATA_JSON: tcase['PRE_EXISTING_DATA_JSON'],
          USER_INPUT_JSON: tcase['USER_INPUT_JSON'],
          EXPECTED_RESULT_JSON: tcase['EXPECTED_RESULT_JSON'],
          TEST_SET_UUID: tcase['TEST_SET_UUID'],
          TEST_CASE_SEQ_ID: tcase['TEST_CASE_SEQ_ID'],
          TEST_CASE_STATUS: tcase['TEST_CASE_STATUS'],
          TEST_CASE_EXECUTON_TYPE: tcase['TEST_CASE_EXECUTON_TYPE'],
          TEST_CASE_DESCRIPTION_UUID: tcase['TEST_CASE_DESCRIPTION_UUID'],
          USER_STORY_VERSION_UUID: tcase['USER_STORY_VERSION_UUID'],
          DEVELOPMENT_ACCEPTED_TS: tcase['DEVELOPMENT_ACCEPTED_TS'],
          TEST_CASE_OWNER: tcase['TEST_CASE_OWNER'],
          ASSOCIATED_VIEW_UUID: tcase['ASSOCIATED_VIEW_UUID'],
          USER_STORY_UUID: Array.from(existingUSUUIDs).join(','),
          SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE: tcase['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE']
        };

        await mainKnex('TEST_CASE').where({ TEST_CASE_UUID: tcase['TEST_CASE_UUID'] }).update({USER_STORY_UUID: Array.from(existingUSUUIDs).join(',')});
        console.log(chalk.greenBright('Test Case updated: ', tcase['TEST_CASE_NAME']));

        const testCaseAudit = createAuditObject(testCaseObj, 'Update', tcase);
        await auditKnex('TEST_CASE_AUDIT').insert(testCaseAudit);
      }
    }
  } catch (e) {
    console.log(chalk.redBright('Error in dataFixForTestCaseAndUserStory: ', e));
    return res.status(500).json({ message: 'ERROR OCCURED IN SCRIPT ' + e });
  }
};
