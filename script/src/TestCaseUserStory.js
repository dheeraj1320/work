import { v4 as uuidv4 } from 'uuid';
const MY_ID = '622e9c89-cb3a-4012-9e95-67095f3bb694';
import chalk from 'chalk';

function createAuditObject(newObject, operationType = 'Insert', oldObject = null, operationPerformedBy = MY_ID) {
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
  auditObj.OPERATION_PERFORMED_BY = operationPerformedBy;

  return auditObj;
}

const getMssqlKnex = (knex, schemaName) => {
  return tableName => knex(tableName).withSchema(schemaName);
};

const setToCSV = set => Array.from(set).join(',');

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
    if (!knex || !auditknexobj, !schemaName) {
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
    let testSetSeq = await getOrInitializeSequence(mainKnex, 'TEST_SET');
    const userStories = await mainKnex('USER_STORY').select('*').orderBy('USER_STORY_ID', 'asc');

    console.log(chalk.bgCyan(`Creating Test Set for ${userStories.length} User Stories...`));

    for (const userStory of userStories) {
      const existingTestSet = await mainKnex('TEST_SET').where({ USER_STORY_UUID: userStory['USER_STORY_UUID'] });

      if (existingTestSet.length > 0) {
        console.log(chalk.yellowBright('SKIPPING - Test Set already exists for User Story: ', userStory['USER_STORY_NAME']));
        continue;
      }
      console.log('Creating Test Set for User Story: ', userStory['USER_STORY_NAME']);

      const testSet = {
        TEST_SET_UUID: uuidv4(),
        TEST_SET_ID: ++testSetSeq,
        TEST_SET_NAME: userStory['USER_STORY_NAME'],
        TEST_SET_TYPE: 'User Story',
        USER_STORY_UUID: userStory['USER_STORY_UUID'],
        AE_INSERT_ID: userStory['AE_INSERT_ID'],
        AE_INSERT_TS: new Date(),
        AE_TRANSACTION_ID: uuidv4(),
        FUNCTIONAL_AREA_UUID: userStory['FUNCTIONAL_AREA_UUID']
      };

      await mainKnex('TEST_SET').insert(testSet);

      const testSetAudit = createAuditObject(testSet, 'Insert', null, userStory['AE_INSERT_ID']);
      await auditKnex('TEST_SET_AUDIT').insert(testSetAudit);
    }

    await updateSequence(mainKnex, 'TEST_SET', testSetSeq);
    console.log(chalk.bgGreenBright('Test Set created for each User Story: ✅'));

    // ^ Updating Test Cases with USER_STORY_UUID
    const testCases = await mainKnex('TEST_CASE').select('*').orderBy('TEST_CASE_ID', 'asc');

    console.log(chalk.bgCyan(`Updating ${testCases.length} Test Cases with USER_STORY_UUID...`));

    for (const tcase of testCases) {
      const testCaseRequirements = await mainKnex('TEST_CASE_REQUIREMENT').select('*').where({ TEST_CASE_UUID: tcase['TEST_CASE_UUID'] });

      if (testCaseRequirements.length === 0) {
        console.log(chalk.yellowBright('SKIPPING - No requirements found for Test Case Number: ', tcase['TEST_CASE_ID']));
        continue;
      }
      console.log(chalk.yellowBright('VIEWING TEST CASE NUMBER... ', tcase['TEST_CASE_ID']));

      let hasSetChanged = false;
      const existingUSUUIDs = new Set(
        (tcase['USER_STORY_UUID'] || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean)
      );


      for (const tcReq of testCaseRequirements) {
        const userStories = await mainKnex('IMPACTED_USER_STORY as ius')
          .join('USER_STORY as us', 'ius.USER_STORY_UUID', 'us.USER_STORY_UUID')
          .select(
            'ius.*', // all columns from IMPACTED_USER_STORY
            'us.USER_STORY_STATUS' // additional field from USER_STORY
          )
          .where({ 'ius.REQUIREMENT_UUID': tcReq['REQUIREMENT_UUID'] });

        for (const userStory of userStories) {
          if (['Draft', 'In-Progress'].includes(userStory['USER_STORY_STATUS']) && !existingUSUUIDs.has(userStory['USER_STORY_UUID'])) {
            existingUSUUIDs.add(userStory['USER_STORY_UUID']);
            hasSetChanged = true;
          }
        }
      }

      console.log(chalk.cyanBright('Final US UUIDs: ', setToCSV(existingUSUUIDs)));

      if (hasSetChanged) {
        const updatedFields = {
          USER_STORY_UUID: setToCSV(existingUSUUIDs),
          AE_UPDATE_TS: new Date()
        };

        await mainKnex('TEST_CASE').where({ TEST_CASE_UUID: tcase['TEST_CASE_UUID'] }).update(updatedFields);
        console.log(chalk.greenBright('Test Case updated: ', tcase['TEST_CASE_NAME']));

        const { PRE_EXISTING_DATA_JSON, USER_INPUT_JSON, EXPECTED_RESULT_JSON, ...tcaseSanitized } = tcase;

        const testCaseAudit = createAuditObject({ ...tcaseSanitized, ...updatedFields }, 'Update', tcaseSanitized, tcase['AE_INSERT_ID']);
        await auditKnex('TEST_CASE_AUDIT').insert(testCaseAudit);
      }
    }

    console.log(chalk.bgMagentaBright('Script ran successfully! ✅✅✅'));
    res.status(200).json({ message: 'Script ran successfully! ✅✅✅' });
  } catch (e) {
    console.log(chalk.redBright('Error in dataFixForTestCaseAndUserStory: ', e));
    return res.status(500).json({ message: 'ERROR OCCURED IN SCRIPT ' + e });
  }
};
