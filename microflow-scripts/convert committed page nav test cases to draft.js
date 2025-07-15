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
    const uuidQuery = `SELECT UUID() AS UNIQUE_UUID;`;
    const uuidData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, uuidQuery, input);
    auditObj.AE_AUDIT_UUID = uuidData[0].UNIQUE_UUID;
    auditObj.AE_OPERATION_TYPE = operationType;
    auditObj.AE_TIMESTAMP = formatDateToSQL(new Date());
    auditObj.OPERATION_PERFORMED_BY = operationPerformedBy;
    return auditObj;
  }
  /* Actual Script starts here */ const selectedFunctionalAreas = input.SELECTED_FUNCTIONAL_AREAS
    ? input.SELECTED_FUNCTIONAL_AREAS.split(',')
        .map((area) => `'${area.trim()}'`)
        .join(',')
    : `''`;
  const testCaseQuery = `SELECT tc.TEST_CASE_UUID , tc.TEST_CASE_ID , tc.TEST_CASE_NAME , tc.AE_INSERT_ID , tc.AE_UPDATE_ID , tc.AE_INSERT_TS , tc.AE_UPDATE_TS , tc.AE_TRANSACTION_ID , tc.FUNCTIONAL_AREA_UUID , tc.PRE_EXISTING_DATA_JSON , tc.USER_INPUT_JSON , tc.EXPECTED_RESULT_JSON , tc.TEST_SET_UUID , tc.TEST_CASE_SEQ_ID , tc.TEST_CASE_STATUS , tc.TEST_CASE_EXECUTON_TYPE , tc.TEST_CASE_DESCRIPTION_UUID , tc.USER_STORY_VERSION_UUID , tc.DEVELOPMENT_ACCEPTED_TS , tc.TEST_CASE_OWNER , tc.ASSOCIATED_VIEW_UUID , tc.USER_STORY_UUID , tc.SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE FROM TEST_CASE tc JOIN TEST_SET ts ON tc.TEST_SET_UUID = ts.TEST_SET_UUID WHERE ts.TEST_SET_TYPE = 'Page Navigation' AND tc.TEST_CASE_STATUS != 'DRAFT' AND ts.FUNCTIONAL_AREA_UUID IN (${selectedFunctionalAreas}) AND tc.FUNCTIONAL_AREA_UUID IN (${selectedFunctionalAreas});`;
  const testCaseData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, testCaseQuery, input);
  for (const testCase of testCaseData) {
    console.log('Processing page:', testCase.TEST_CASE_NAME);
    const oldData = { ...testCase };
    const updateTcQuery = `UPDATE TEST_CASE SET TEST_CASE_STATUS = 'DRAFT', AE_UPDATE_ID = '${USER_ID}', AE_UPDATE_TS= :curr_dt WHERE TEST_CASE_UUID = '${oldData.TEST_CASE_UUID}'`;
    await serviceOrchestrator.update(updateTcQuery, { curr_dt: formatDateToSQL(new Date()) }, 'PRIMARYSPRINGFM');
    const auditObj = await createAuditObject({ ...oldData, AE_UPDATE_ID: USER_ID, AE_UPDATE_TS: formatDateToSQL(new Date()), TEST_CASE_STATUS: 'DRAFT'}, 'Update', oldData, USER_ID);
    const { PRE_EXISTING_DATA_JSON, USER_INPUT_JSON, ...finalAuditObj } = auditObj;
    await serviceOrchestrator.insert(getInsertAuditQuery(finalAuditObj), finalAuditObj, 'PRIMARYSPRINGFM_AUDIT', 'AE_AUDIT_UUID');
  }
  msg.payload['result'] = mode;
  node.send(msg);
} catch (t) {
  console.log('Error Occurred', t.message);
  return;
}
