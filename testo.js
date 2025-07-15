try {
  function formatDateToSQL(date) {
    return date.toISOString().slice(0, 23).replace("T", " ");
  }
  const getInsertAuditQuery = (auditObj, auditTable) => {
    const fields = Object.keys(auditObj);
    const values = fields.map((field) => `:${field}`);
    return `INSERT INTO ${auditTable} (${fields.join(", ")}) VALUES (${values.join(", ")});`;
  };

  async function getNewUUID() {
    const uuidQuery = `SELECT UUID() AS UNIQUE_UUID;`;
    const uuidData = await serviceOrchestrator.selectRecordsUsingQuery(
      `PRIMARYSPRINGFM`,
      uuidQuery,
      input
    );
    return uuidData[0].UNIQUE_UUID;
  }

  msg.payload.result = {};
  const AppengProcessConfig = global.get("AppengProcessConfig");
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let input = msg.payload.apiRequestBody.baseEntity.records[0];
  const USER_ID = input.APP_LOGGED_IN_USER_ID;
  const TARGET_TEST_SUITE_UUID = "46079dda-4ddc-11f0-a5ca-02a48541b261";
  const now = formatDateToSQL(new Date());
  let mode = { mode: "Enable Message", message: "Data Sync Completed." };

  async function createAuditObject(
    newObject,
    operationType = "Insert",
    oldObject = null,
    operationPerformedBy = USER_ID
  ) {
    const auditObj = { ...newObject };
    let auditDetails = {};
    if (operationType === "Insert") {
      for (let key of Object.keys(newObject)) {
        auditDetails[key] = { oldValue: null, newValue: newObject[key] };
      }
    } else if (operationType === "Update") {
      if (!oldObject) throw new Error("oldObject must be provided for Update operation.");
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
    ? input.SELECTED_FUNCTIONAL_AREAS.split(",").map((area) => `'${area.trim()}'`).join(",")
    : `''`;

  const apiQuery = `
    SELECT API_UUID, API_NAME, FUNCTIONAL_AREA_UUID
    FROM API_NEW
    WHERE FUNCTIONAL_AREA_UUID IN (${selectedFunctionalAreas})
  `;

  const apis = await serviceOrchestrator.selectRecordsUsingQuery(
    "PRIMARYSPRINGFM",
    apiQuery,
    input
  );

  console.log(`Found ${apis.length} APIs for selected functional areas.`);
  let insertCount = 0;
  for (const api of apis) {
    const { API_UUID, API_NAME, FUNCTIONAL_AREA_UUID } = api;
    const testSetQuery = `
      SELECT * FROM TEST_SET
      WHERE API_UUID = '${API_UUID}' AND TEST_SET_TYPE = 'API'
    `;
    const existingTestSetArr = await serviceOrchestrator.selectRecordsUsingQuery(
      "PRIMARYSPRINGFM",
      testSetQuery,
      input
    );

    if (existingTestSetArr && existingTestSetArr.length > 0) {
      console.log(`✅ TEST_SET already exists for API_UUID: ${API_UUID} (${API_NAME}), skipping.`);
      continue;
    }

    const TEST_SET_UUID = await getNewUUID();
    const API_TRANSACTION_ID = await getNewUUID();
    const TEST_SUITE_TEST_SET_UUID = await getNewUUID();
    const SUITE_MAPPING_TRANSACTION_ID = await getNewUUID();

    const maxTestSetIdArr = await serviceOrchestrator.selectRecordsUsingQuery(
      "PRIMARYSPRINGFM",
      "SELECT COALESCE(MAX(TEST_SET_ID),0) AS maxId FROM TEST_SET;",
      input
    );
    const TEST_SET_ID = Number(maxTestSetIdArr[0].maxId) + 1;

    const newTestSet = {
      TEST_SET_UUID,
      TEST_SET_ID,
      TEST_SET_NAME: API_NAME,
      TEST_SET_TYPE: "API",
      API_UUID,
      FUNCTIONAL_AREA_UUID,
      AE_INSERT_ID: USER_ID,
      AE_INSERT_TS: now,
      AE_UPDATE_ID: USER_ID,
      AE_UPDATE_TS: now,
      AE_TRANSACTION_ID: API_TRANSACTION_ID,
    };

    await serviceOrchestrator.insert(
      `INSERT INTO TEST_SET (${Object.keys(newTestSet).join(", ")}) VALUES (${Object.keys(newTestSet).map(k => `:${k}`).join(", ")})`,
      newTestSet,
      "PRIMARYSPRINGFM",
      "TEST_SET_UUID"
    );
    console.log(`🟢 Inserted TEST_SET for API: ${API_NAME} (${API_UUID})`);

    const testSetAudit = await createAuditObject(
      newTestSet,
      "Insert",
      null,
      USER_ID
    );
    await serviceOrchestrator.insert(
      getInsertAuditQuery(testSetAudit, "TEST_SET_AUDIT"),
      testSetAudit,
      "PRIMARYSPRINGFM_AUDIT",
      "AE_AUDIT_UUID"
    );
    console.log(`🟢 Inserted TEST_SET_AUDIT for API: ${API_NAME}`);

    const suiteTestSetQuery = `
      SELECT * FROM TEST_SUITE_TEST_SET
      WHERE TEST_SUITE_UUID = '${TARGET_TEST_SUITE_UUID}' AND TEST_SET_UUID = '${TEST_SET_UUID}'
    `;
    const existingSuiteTestSetArr = await serviceOrchestrator.selectRecordsUsingQuery(
      "PRIMARYSPRINGFM",
      suiteTestSetQuery,
      input
    );
    if (existingSuiteTestSetArr && existingSuiteTestSetArr.length > 0) {
      console.log(`✅ TEST_SUITE_TEST_SET already exists for TEST_SET_UUID: ${TEST_SET_UUID}, skipping.`);
      continue;
    }

    const maxSuiteTestSetIdArr = await serviceOrchestrator.selectRecordsUsingQuery(
      "PRIMARYSPRINGFM",
      "SELECT COALESCE(MAX(TEST_SUITE_TEST_SET_ID),0) AS maxId FROM TEST_SUITE_TEST_SET;",
      input
    );
    const TEST_SUITE_TEST_SET_ID = Number(maxSuiteTestSetIdArr[0].maxId) + 1;

    const testSuiteTestSet = {
      TEST_SUITE_TEST_SET_UUID,
      TEST_SUITE_TEST_SET_ID,
      TEST_SUITE_UUID: TARGET_TEST_SUITE_UUID,
      TEST_SET_UUID,
      FUNCTIONAL_AREA_UUID,
      AE_INSERT_ID: USER_ID,
      AE_INSERT_TS: now,
      AE_UPDATE_ID: USER_ID,
      AE_UPDATE_TS: now,
      AE_TRANSACTION_ID: SUITE_MAPPING_TRANSACTION_ID,
    };

    await serviceOrchestrator.insert(
      `INSERT INTO TEST_SUITE_TEST_SET (${Object.keys(testSuiteTestSet).join(", ")}) VALUES (${Object.keys(testSuiteTestSet).map(k => `:${k}`).join(", ")})`,
      testSuiteTestSet,
      "PRIMARYSPRINGFM",
      "TEST_SUITE_TEST_SET_UUID"
    );
    console.log(`🟢 Inserted TEST_SUITE_TEST_SET for API: ${API_NAME}`);
    const suiteAudit = await createAuditObject(
      testSuiteTestSet,
      "Insert",
      null,
      USER_ID
    );
    await serviceOrchestrator.insert(
      getInsertAuditQuery(suiteAudit, "TEST_SUITE_TEST_SET_AUDIT"),
      suiteAudit,
      "PRIMARYSPRINGFM_AUDIT",
      "AE_AUDIT_UUID"
    );
    console.log(`🟢 Inserted TEST_SUITE_TEST_SET_AUDIT for API: ${API_NAME}`);
    insertCount++;
  }

  msg.payload["result"] = mode;
  node.send(msg);
} catch (t) {
  console.log("Error Occurred", t.message);
  return;
}