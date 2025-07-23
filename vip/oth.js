try {
  function formatDateToSQL(date) {
    if (!(date instanceof Date)) return null;
    return date.toISOString().slice(0, 23).replace('T', ' ');
  }
  const getInsertAuditQuery = (auditObj, auditTable) => {
    const fields = Object.keys(auditObj);
    const values = fields.map((field) => `:${field}`);
    return `INSERT INTO ${auditTable} (${fields.join(', ')}) VALUES (${values.join(', ')});`;
  };
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
  /* main Scripts starts from heree */ const selectedFunctionalAreas = input.SELECTED_FUNCTIONAL_AREAS
    ? input.SELECTED_FUNCTIONAL_AREAS.split(',')
        .map((area) => `'${area.trim()}'`)
        .join(',')
    : `''`;
  const tableConfigs = {
    TEST_CASE_STEP: {
      mainTable: 'TEST_CASE_STEP',
      mainPK: 'TEST_CASE_STEP_UUID',
      attrTable: 'TEST_CASE_STEP_ATTRIBUTE_VALUE',
      attrPK: 'TEST_CASE_STEP_UUID',
      attrDataCol: 'TEST_CASE_STEP_ATTRIBUTE_DATA',
      auditTable: 'TEST_CASE_STEP_AUDIT'
    },
    FUNCTION_STEP: {
      mainTable: 'FUNCTION_STEP',
      mainPK: 'FUNCTION_STEP_UUID',
      attrTable: 'FUNCTION_STEP_ATTRIBUTE_VALUE',
      attrPK: 'FUNCTION_STEP_UUID',
      attrDataCol: 'FUNCTION_STEP_ATTRIBUTE_DATA',
      auditTable: 'FUNCTION_STEP_AUDIT'
    },
    TEST_CASE_FUNCTION_STEP: {
      mainTable: 'TEST_CASE_FUNCTION_STEP',
      mainPK: 'TEST_CASE_FUNCTION_STEP_UUID',
      attrTable: 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE',
      attrPK: 'TEST_CASE_FUNCTION_STEP_UUID',
      attrDataCol: 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA',
      auditTable: 'TEST_CASE_FUNCTION_STEP_AUDIT'
    }
  };
  for (const selectedTable of Object.keys(tableConfigs)) {
    const cfg = tableConfigs[selectedTable];
    let mainQuery = ` SELECT * FROM ${cfg.mainTable} WHERE FUNCTIONAL_AREA_UUID IN (${selectedFunctionalAreas || `''`}) ORDER BY AE_INSERT_TS ASC LIMIT 5 `;
    console.log(`[${selectedTable}] Running main query:========>`, mainQuery);
    const mainData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, mainQuery, input);
    const mainUUIDs = mainData.length > 0 ? mainData.map((s) => `'${s[cfg.mainPK]}'`).join(',') : `''`;
    const attrQuery = ` SELECT ${cfg.attrPK}, ${cfg.attrDataCol} FROM ${cfg.attrTable} WHERE ${cfg.attrPK} IN (${mainUUIDs}) AND ${cfg.attrDataCol} `;
    console.log(`[${selectedTable}] Running attr query:======>`, attrQuery);
    const attrData = await serviceOrchestrator.selectRecordsUsingQuery(`PRIMARYSPRINGFM`, attrQuery, input);
    const attrMap = new Map();
    (attrData || []).forEach((attr) => attrMap.set(attr[cfg.attrPK], attr[cfg.attrDataCol]?.trim()));
    for (const row of mainData) {
      const rowUUID = row[cfg.mainPK];
      const newValue = attrMap.get(rowUUID);
      let updated = false;
      let updateFields = {};
      if (selectedTable === 'TEST_CASE_STEP') {
        if ((row.IS_FUNCTION_STEP || '') === 'Yes' && (!row.FUNCTION_UUID || row.FUNCTION_UUID.trim() === '') && newValue !== row.FUNCTION_UUID) {
          updateFields.FUNCTION_UUID = newValue;
          updated = true;
        }
        if ((row.IS_UI_ELEMENT_GROUP_STEP || '') === 'Yes' && (!row.UI_ELEMENT_GROUP_UUID || row.UI_ELEMENT_GROUP_UUID.trim() === '') && newValue !== row.UI_ELEMENT_GROUP_UUID) {
          updateFields.UI_ELEMENT_GROUP_UUID = newValue;
          updated = true;
        }
      } else {
        if ((row.IS_UI_ELEMENT_GROUP_STEP || '') === 'Yes' && (!row.UI_ELEMENT_GROUP_UUID || row.UI_ELEMENT_GROUP_UUID.trim() === '') && newValue !== row.UI_ELEMENT_GROUP_UUID) {
          updateFields.UI_ELEMENT_GROUP_UUID = newValue;
          updated = true;
        }
      }
      if (updated) {
        updateFields.AE_UPDATE_ID = USER_ID;
        updateFields.AE_UPDATE_TS = formatDateToSQL(new Date());
        const updateQuery = ` UPDATE ${cfg.mainTable} SET ${Object.keys(updateFields)
          .map((f) => `${f} = :${f}`)
          .join(', ')} WHERE ${cfg.mainPK} = '${rowUUID}' `;
        await serviceOrchestrator.update(updateQuery, updateFields, 'PRIMARYSPRINGFM');
        const updatedRow = { ...row, ...updateFields };
        const auditObj = await createAuditObject({ ...updatedRow }, 'Update', row, USER_ID, cfg.auditTable);
        await serviceOrchestrator.insert(getInsertAuditQuery(auditObj, cfg.auditTable), auditObj, 'PRIMARYSPRINGFM_AUDIT', 'AE_AUDIT_UUID');
        console.log(`[${selectedTable}] Audit inserted for row=====> ${rowUUID}`);
      }
    }
  }
  msg.payload['result'] = mode;
  node.send(msg);
} catch (t) {
  console.log('Error Occurred', t.message);
  return;
}
