try {
  function formatDateToSQL(date) {
    if (!(date instanceof Date)) return null;
    return date.toISOString().slice(0, 23).replace('T', ' ');
  }
  const getInsertAuditQuery = (auditObj) => {
    const fields = Object.keys(auditObj);
    const values = fields.map((field) => `:${field}`);
    return `INSERT INTO TEST_CASE_AUDIT (${fields.join(', ')}) VALUES (${values.join(', ')});`;
  };
  debugger;
  msg.payload.result = {};
  const AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let input = msg.payload.apiRequestBody.baseEntity.records[0];
  const USER_ID = input.APP_LOGGED_IN_USER_ID;
  let mode = { mode: 'Enable Message', message: 'Data Sync Completed.' };
  async function createAuditObject(newObject, operationType = 'Insert', oldObject = null, operationPerformedBy = USER_ID) {
    const auditObj = { ...newObject };
    let auditDetails = {};
    if (operationType === 'Insert') {
      for (let key of Object.keys(newObject)) {
        auditDetails[key] = { oldValue: null, newValue: newObject[key] };
      }
    } else if (operationType === 'Update') {
      if (!oldObject) {
        throw new Error('oldObject must be provided for Update operation.');
      }
      for (let key of Object.keys(newObject)) {
        const oldVal = oldObject[key];
        const newVal = newObject[key];
        if (oldVal !== newVal) {
          auditDetails[key] = { oldValue: oldVal, newValue: newVal };
        }
      }
    }
    auditObj.AE_OLD_NEW_COMPARISION_DETAILS = JSON.stringify(auditDetails);
    const uuidQuery = `SELECT uuid() AS UNIQUE_UUID;`;
    const uuidData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, uuidQuery, input);
    auditObj.AE_AUDIT_UUID = uuidData[0].UNIQUE_UUID;
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
  /* Actual Script starts here */ const pageQuery = `SELECT PAGE_NAME, PAGE_UUID FROM PAGE WHERE FUNCTIONAL_AREA_UUID IN (${selectedFunctionalAreas}) ORDER BY PAGE_ID DESC;`;
  const pageData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, pageQuery, input);
  for (const page of pageData) {
    console.log('Processing page:', page.PAGE_NAME);
    const viewQuery = `SELECT VIEW_UUID, VIEW_NAME FROM PAGE_VIEW WHERE PAGE_UUID='${page.PAGE_UUID}';`;
    const viewData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, viewQuery, input);
    for (const view of viewData) {
      const updatedTcName = `${page.PAGE_NAME} - ${view.VIEW_NAME}`;
      const testCaseQuery = `SELECT * FROM TEST_CASE WHERE ASSOCIATED_VIEW_UUID='${view.VIEW_UUID}';`;
      const testCaseData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, testCaseQuery, input);
      if (testCaseData && testCaseData.length > 0) {
        if (testCaseData[0].TEST_CASE_NAME == updatedTcName) {
          console.log('Test case name already starts with page name, skipping update for:', testCaseData[0].TEST_CASE_NAME);
        } else {
          console.log('::::::::::::: Updating test case name from ', testCaseData[0].TEST_CASE_NAME, ' to ', updatedTcName);
          const oldData = { ...testCaseData[0] };
          const updateTcQuery = `UPDATE TEST_CASE SET TEST_CASE_NAME = '${updatedTcName}', AE_UPDATE_ID = '${USER_ID}', AE_UPDATE_TS= :curr_dt WHERE TEST_CASE_UUID = '${oldData.TEST_CASE_UUID}'`;
          await serviceOrchestrator.update(updateTcQuery, { curr_dt: formatDateToSQL(new Date()) }, 'PRIMARYSPRINGFM');
          const auditObj = await createAuditObject({ ...oldData, TEST_CASE_NAME: updatedTcName, AE_UPDATE_ID: USER_ID, AE_UPDATE_TS: formatDateToSQL(new Date()) }, 'Update', oldData, USER_ID);
          const { PRE_EXISTING_DATA_JSON, USER_INPUT_JSON, EXPECTED_RESULT_JSON, ...finalAuditObj } = auditObj;
          await serviceOrchestrator.insert(getInsertAuditQuery(finalAuditObj), finalAuditObj, 'PRIMARYSPRINGFM_AUDIT', 'AE_AUDIT_UUID');
        }
      }
    }
  }
  msg.payload['result'] = mode;
  node.send(msg);
} catch (t) {
  console.log('Error Occurred', t.message);
  return;
}

// -------------------------------
// -------------------------------

debugger;
msg.payload.result = { mode: 'Enable Message', message: 'Data Sync Completed.' };
node.send(msg);
