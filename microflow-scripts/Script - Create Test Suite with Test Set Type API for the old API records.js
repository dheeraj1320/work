try {
  function formatDateToSQL(date) {
    if (!(date instanceof Date)) return null;
    return date.toISOString().slice(0, 23).replace('T', ' ');
  }
  const getInsertQuery = (auditObj, auditTable) => {
    const fields = Object.keys(auditObj);
    const values = fields.map((field) => `:${field}`);
    return `INSERT INTO ${auditTable} (${fields.join(', ')}) VALUES (${values.join(', ')});`;
  };
  const AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let input = msg.payload.apiRequestBody.baseEntity.records[0];
  const USER_ID = input.APP_LOGGED_IN_USER_ID;
  let mode = { mode: 'Enable Message', message: 'Data Sync Completed.' };
  const updateSequence = async (tableName, newId) => {
    const updateSeqQuery = `UPDATE SEQUENCE SET MAX_TABLE_SEQ_ID = ${newId} WHERE TABLE_NAME = '${tableName}'`;
    await serviceOrchestrator.update(updateSeqQuery, {}, 'PRIMARYSPRINGFM');
  };

  const getOrInitializeSequence = async (tableName) => {
    const seqQuery = `SELECT TABLE_NAME, MAX_TABLE_SEQ_ID FROM SEQUENCE WHERE TABLE_NAME = '${tableName}'`;
    const seqData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, seqQuery, input);
    if (seqData.length > 0) {
      console.log('Got sequence for table: ✅ ', tableName);
      return Number(result[0]['MAX_TABLE_SEQ_ID']);
    } else {
      console.log('Initializing sequence for table: ✨ ', tableName);
      const obj = {
        TABLE_NAME: tableName,
        MAX_TABLE_SEQ_ID: 0,
        AE_INSERT_ID: USER_ID,
        AE_INSERT_TS: formatDateToSQL(new Date())
      };
      await serviceOrchestrator.insert(getInsertQuery(obj), obj, 'PRIMARYSPRINGFM', 'TABLE_NAME');
      return 0;
    }
  };
  async function getNewUUID() {
    const uuidQuery = `SELECT uuid() AS UNIQUE_UUID;`;
    const uuidData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, uuidQuery, input);
    return uuidData[0].UNIQUE_UUID;
  }
  async function createAuditObject(newObject, operationType = 'Insert', oldObject = null, operationPerformedBy = USER_ID) {
    const auditObj = { ...newObject };
    let auditDetails = {};
    if (operationType === 'Insert') {
      for (let key of Object.keys(newObject)) {
        auditDetails[key] = { oldValue: null, newValue: newObject[key] };
      }
    } else if (operationType === 'Update') {
      if (!oldObject) throw new Error('oldObject must be provided for Update operation.');
      for (let key of Object.keys(newObject)) {
        const oldVal = oldObject[key];
        const newVal = newObject[key];
        if (oldVal !== newVal) {
          auditDetails[key] = { oldValue: oldVal, newValue: newVal };
        }
      }
    }
    auditObj.AE_OLD_NEW_COMPARISION_DETAILS = JSON.stringify(auditDetails);
    auditObj.AE_AUDIT_UUID = await getNewUUID();
    auditObj.AE_OPERATION_TYPE = operationType;
    auditObj.AE_TIMESTAMP = formatDateToSQL(new Date());
    auditObj.OPERATION_PERFORMED_BY = operationPerformedBy;
    return auditObj;
  }
  const selectedFunctionalAreas = input.SELECTED_FUNCTIONAL_AREAS
    ? input.SELECTED_FUNCTIONAL_AREAS.split(',')
        .map((area) => `'${area.trim()}'`)
        .join(',')
    : `''`;

  const funcAreaArr = input.SELECTED_FUNCTIONAL_AREAS ? input.SELECTED_FUNCTIONAL_AREAS.split(',').map((area) => area.trim()) : [];

  const existingSuitesQuery = `SELECT TEST_SUITE_UUID, FUNCTIONAL_AREA_UUID FROM TEST_SUITE WHERE TEST_SUITE_CREATION_TYPE = 'System' AND TEST_SUITE_TYPE = 'API' AND FUNCTIONAL_AREA_UUID IN (${selectedFunctionalAreas})`;
  const existingSuites = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', existingSuitesQuery, input);

  let suiteId = await getOrInitializeSequence('TEST_SUITE');
  let setId = await getOrInitializeSequence('TEST_SET');
  let testSuiteTestSetId = await getOrInitializeSequence('TEST_SUITE_TEST_SET');

  for (const funcAreaId of funcAreaArr) {
    const currSuite = existingSuites.find((sui) => sui.FUNCTIONAL_AREA_UUID == funcAreaId);
    let currentSuiteUUID;
    if (!currSuite) {
      console.log('Creating API Test Suite for Functional Area:', funcAreaId);
      currentSuiteUUID = await getNewUUID();
      const newSuite = {
        TEST_SUITE_UUID: currentSuiteUUID,
        TEST_SUITE_ID: ++suiteId,
        TEST_SUITE_NAME: 'API Test Suite',
        FUNCTIONAL_AREA_UUID: funcAreaId,
        TEST_SUITE_CREATION_TYPE: 'System',
        TEST_SUITE_TYPE: 'API',
        AE_INSERT_ID: USER_ID,
        AE_INSERT_TS: formatDateToSQL(new Date()),
        AE_UPDATE_ID: USER_ID,
        AE_UPDATE_TS: formatDateToSQL(new Date()),
        AE_TRANSACTION_ID: await getNewUUID()
      };
      await serviceOrchestrator.insert(
        `INSERT INTO TEST_SUITE (${Object.keys(newSuite).join(', ')}) VALUES (${Object.keys(newSuite)
          .map((k) => `:${k}`)
          .join(', ')})`,
        newSuite,
        'PRIMARYSPRINGFM',
        'TEST_SUITE_UUID'
      );

      const suiteAudit = await createAuditObject(newSuite, 'Insert', null, USER_ID);
      await serviceOrchestrator.insert(getInsertQuery(suiteAudit, 'TEST_SUITE_AUDIT'), suiteAudit, 'PRIMARYSPRINGFM_AUDIT', 'AE_AUDIT_UUID');
    } else {
      currentSuiteUUID = currSuite.TEST_SUITE_UUID;
    }

    const apiQuery = `SELECT API_UUID, API_NAME, FUNCTIONAL_AREA_UUID FROM API_NEW WHERE FUNCTIONAL_AREA_UUID IN (${selectedFunctionalAreas})`;
    const apiData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', apiQuery, input);
    for (const api of apiData) {
      const { API_UUID, API_NAME, FUNCTIONAL_AREA_UUID } = api;
      const testSetQuery = `SELECT * FROM TEST_SET WHERE API_UUID = '${api.API_UUID}' AND TEST_SET_TYPE = 'API' `;
      const testSetData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testSetQuery, input);
      let TEST_SET_UUID;
      let newTestSet = null;
      if (testSetData && testSetData.length > 0) {
        TEST_SET_UUID = testSetData[0].TEST_SET_UUID;
        console.log(`TEST_SET already exists for API (${API_NAME})`);
      } else {
        TEST_SET_UUID = await getNewUUID();
        newTestSet = {
          TEST_SET_UUID,
          TEST_SET_ID: ++setId,
          TEST_SET_NAME: API_NAME,
          TEST_SET_TYPE: 'API',
          API_UUID,
          FUNCTIONAL_AREA_UUID: funcAreaId,
          AE_INSERT_ID: USER_ID,
          AE_INSERT_TS: formatDateToSQL(new Date()),
          AE_TRANSACTION_ID: await getNewUUID()
        };
        await serviceOrchestrator.insert(
          `INSERT INTO TEST_SET (${Object.keys(newTestSet).join(', ')}) VALUES (${Object.keys(newTestSet)
            .map((k) => `:${k}`)
            .join(', ')})`,
          newTestSet,
          'PRIMARYSPRINGFM',
          'TEST_SET_UUID'
        );

        const testSetAudit = await createAuditObject(newTestSet, 'Insert', null, USER_ID);
        await serviceOrchestrator.insert(getInsertQuery(testSetAudit, 'TEST_SET_AUDIT'), testSetAudit, 'PRIMARYSPRINGFM_AUDIT', 'AE_AUDIT_UUID');
      }

      const suiteTestSetQuery = ` SELECT * FROM TEST_SUITE_TEST_SET WHERE TEST_SUITE_UUID = '${currentSuiteUUID}' AND TEST_SET_UUID = '${TEST_SET_UUID}' `;
      const suiteTestSetData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', suiteTestSetQuery, input);
      if (suiteTestSetData && suiteTestSetData.length > 0) {
        console.log(`TEST_SUITE_TEST_SET already exists for TEST_SET: ${API_NAME}, skipping mapping.`);
      } else {
        console.log(`Inserted TEST_SUITE_TEST_SET for API: ${API_NAME}`);

        const testSuiteTestSet = {
          TEST_SUITE_TEST_SET_UUID:  await getNewUUID(),
          TEST_SUITE_TEST_SET_ID: ++testSuiteTestSetId,
          TEST_SUITE_UUID: currentSuiteUUID,
          TEST_SET_UUID,
          FUNCTIONAL_AREA_UUID: funcAreaId,
          AE_INSERT_ID: USER_ID,
          AE_INSERT_TS: formatDateToSQL(new Date()),
          AE_TRANSACTION_ID: await getNewUUID()
        };
        await serviceOrchestrator.insert(
          `INSERT INTO TEST_SUITE_TEST_SET (${Object.keys(testSuiteTestSet).join(', ')}) VALUES (${Object.keys(testSuiteTestSet)
            .map((k) => `:${k}`)
            .join(', ')})`,
          testSuiteTestSet,
          'PRIMARYSPRINGFM',
          'TEST_SUITE_TEST_SET_UUID'
        );
        const suiteAudit = await createAuditObject(testSuiteTestSet, 'Insert', null, USER_ID);
        await serviceOrchestrator.insert(getInsertQuery(suiteAudit, 'TEST_SUITE_TEST_SET_AUDIT'), suiteAudit, 'PRIMARYSPRINGFM_AUDIT', 'AE_AUDIT_UUID');
      }
    }
  }

  await updateSequence('TEST_SUITE', suiteId);
  await updateSequence('TEST_SET', setId);
  await updateSequence('TEST_SUITE_TEST_SET', testSuiteTestSetId);

  console.log('Test Suite and Test Set creation completed successfully. ✅✅✅✅✅');
  msg.payload['result'] = mode;
  node.send(msg);
} catch (t) {
  console.log('Error Occurred', t.message);
  return;
}
