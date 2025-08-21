if (input.compositeEntityAction != "UploadAttachment") {
     input["TEST_CASE_STATUS"] = input.compositeEntityAction == "Insert" ? "DRAFT" : input.compositeEntityAction == "Commit" ? "COMMITTED" : input.compositeEntityAction == "Checkout" ? "CHECKEDOUT" : input.compositeEntityAction == "Check In" ? "COMMITTED" : input["TEST_CASE_STATUS"];

  let testCaseList = [];
  let testCaseStepList = [];
  let testCaseRequirmentList = [];
  let testCaseStepAttributeValueList = [];
  let testCaseFunctionStepList = [];
  let testCaseFunctionStepAttributeValueList = [];
  let testCaseFunctionUIElementGroupStepList = [];
  let testCaseFunctionUIElementGroupStepAttributeList = [];
  let testCaseUIElementGroupStepList = [];
  let testCaseUIElementGroupStepAttributeList = [];
  let functionList = [];
  let functionStepList = [];
  let functionStepAttributeValueList = [];
  let testCaseDescriptionList = [];
  let functionUIElementGroupStepList = [];
  let functionUIElementGroupStepAttributeList = [];
  let testCaseViewNavigationList = [];
  let testCaseViewNavigationAttributeValueList = [];
  let functionViewNavigationList = [];
  let functionViewNavigationAttributeValueList = [];
  let testDataSet = [];
  let testData = [];

  let viewNavigationStepList = [];
  let viewNavigationStepAttributeList = [];

  const stepDefAttributeQueryList = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
  let stepDefAttributeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefAttributeQueryList, input);

  const isDestinationTestSet = (tsType) => ['Personal', 'User Action', 'Functional', 'API', 'UI Locator Verification'].includes(tsType);

  async function setAttributeValue(attributeId, attributeData) {
    if (attributeId) {
      let query = `SELECT TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_STEP_ATTRIBUTE_DATA AS NAME,'Test Case' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID UNION SELECT TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA AS NAME,'Function' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID UNION SELECT FUNCTION_STEP_ATTRIBUTE_VALUE_UUID AS ID, FUNCTION_STEP_ATTRIBUTE_DATA AS NAME,'Function' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM FUNCTION_STEP_ATTRIBUTE_VALUE WHERE FUNCTION_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      let res = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', query, input);
      return res && res.length ? res[0]['NAME'] : attributeData;
    } else {
      return attributeData;
    }
  }

  function deleteRecords(key, value, deleteType) {
    const deleteParamenter = {};
    deleteParamenter[key] = value;
    deleteParamenter['compositeEntityAction'] = 'Delete';
    if (deleteType === 'TEST_CASE_STEP') {
      testCaseStepList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_REQUIREMENT') {
      testCaseRequirmentList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_STEP_ATTRIBUTE_VALUE') {
      testCaseStepAttributeValueList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE') {
      testCaseFunctionStepAttributeValueList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_FUNCTION_STEP') {
      testCaseFunctionStepList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE') {
      testCaseUIElementGroupStepAttributeList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_UI_ELEMENT_GROUP_STEP') {
      testCaseUIElementGroupStepList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE') {
      testCaseFunctionUIElementGroupStepAttributeList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP') {
      testCaseFunctionUIElementGroupStepList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_VIEW_NAVIGATION_STEP') {
      testCaseViewNavigationList.push(deleteParamenter);
    } else if (deleteType === 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE') {
      testCaseViewNavigationAttributeValueList.push(deleteParamenter);
    }
  }
  async function deleteTestCaseStepData(testCaseStepStr) {
    deleteRecords('TEST_CASE_STEP_UUID', testCaseStepStr, 'TEST_CASE_STEP');
  }
  async function deleteTestCaseRequirmentData(testCaseRequirmentStr) {
    deleteRecords('TEST_CASE_REQUIREMENT_UUID', testCaseRequirmentStr, 'TEST_CASE_REQUIREMENT');
  }
  async function deleteTestCaseStepAttributeData(testCaseStepStr) {
    const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepAttributeValueQuery, input);
    for (let attributeData of testCaseStepAttributeValueQueryData) {
      deleteRecords('TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_STEP_ATTRIBUTE_VALUE');
    }
  }
  async function deleteTestCaseFunctionStepData(testCaseFunctionStepStr) {
    const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${
      testCaseFunctionStepStr ? testCaseFunctionStepStr : `''`
    }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
    if (testCaseFunctionStepData && testCaseFunctionStepData.length) {
      for (let data of testCaseFunctionStepData) {
        deleteRecords('TEST_CASE_FUNCTION_STEP_UUID', data['TEST_CASE_FUNCTION_STEP_UUID'], 'TEST_CASE_FUNCTION_STEP');
      }
    }
  }
  async function deleteTestCaseFunctionStepAttributeData(testCaseFunctionStepStr) {
    const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input);
    for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
      deleteRecords('TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE');
    }
  }
  async function deleteTestCaseUIElementGroupStepData(testCaseStepStr) {
    const testCaseUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementGroupStepQuery, input);
    for (let data of testCaseUIElementGroupStepQueryData) {
      deleteRecords('TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP');
    }
  }
  async function deleteTestCaseUIElementGroupStepAttributeData(testCaseStepStr) {
    const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input);
    for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
      deleteRecords('TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
    }
  }
  async function deleteTestCaseFunctionUIElementGroupStepData(testCaseFunctionStepStr) {
    const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input);
    for (let data of testCaseFunctionUIElementGroupStepQueryData) {
      deleteRecords('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP');
    }
  }
  async function deleteTestCaseFunctionUIElementGroupStepAttributeData(testCaseFunctionStepStr) {
    const testCaseFunctionUIElementGroupStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepAttributeValueQuery, input);
    for (let attributeData of testCaseFunctionUIElementGroupStepAttributeValueQueryData) {
      deleteRecords(
        'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID',
        attributeData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
        'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'
      );
    }
  }
  async function checkUIElementValueExist(data) {
    let result = null;
    const stepDefAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID='${data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']}' order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
    let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefAttributeQuery, input);
    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
      let getUIElementStepDefAttributeUUID = stepDefAttributeQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '74da67d2-41c9-4cf7-9eea-715243e5fcdc');
      if (getUIElementStepDefAttributeUUID && getUIElementStepDefAttributeUUID.length) {
        result = 'Yes';
      } else {
        result = null;
      }
    } else {
      result = null;
    }
    return result;
  }
  async function checkApiAttributeValueExist(data) {
    let result = null;
    const stepDefAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID='${data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']}' order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
    let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefAttributeQuery, input);
    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
      let getUIElementStepDefAttributeUUID = stepDefAttributeQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7182ebf0-2e33-11ef-9033-4bb93e602d01');
      if (getUIElementStepDefAttributeUUID && getUIElementStepDefAttributeUUID.length) {
        result = 'Yes';
      } else {
        result = null;
      }
    } else {
      result = null;
    }
    return result;
  }
  async function getFunctionByPosition() {
    let functionStepQuery = '';
    if (input['DESTINATION_STEP_POSITION'] == 'First Test Case Step') {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP where FUNCTION_UUID=:DESTINATION_FUNCTION and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_STEP_SEQ_ID asc`;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Last Test Case Step') {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP where FUNCTION_UUID=:DESTINATION_FUNCTION and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_STEP_SEQ_ID asc`;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Intermediate Test Case Step') {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP where FUNCTION_UUID=:DESTINATION_FUNCTION and FUNCTION_STEP_SEQ_ID>:DESTINATION_AFTER_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_STEP_SEQ_ID asc`;
    }
    let functionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionStepQuery, input);
    return functionStepQueryData && functionStepQueryData.length ? functionStepQueryData : [];
  }
  async function getViewByPosition() {
    let functionStepQuery = '';
    if (input['DESTINATION_STEP_POSITION'] == 'First Test Case Step') {
      functionStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:DESTINATION_VIEW and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by VIEW_NAVIGATION_STEP_SEQ_ID asc`;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Last Test Case Step') {
      functionStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:DESTINATION_VIEW and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by VIEW_NAVIGATION_STEP_SEQ_ID asc`;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Intermediate Test Case Step') {
      functionStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP where VIEW_UUID=:DESTINATION_VIEW and VIEW_NAVIGATION_STEP_SEQ_ID>:DESTINATION_AFTER_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by VIEW_NAVIGATION_STEP_SEQ_ID asc`;
    }
    let functionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionStepQuery, input);
    return functionStepQueryData && functionStepQueryData.length ? functionStepQueryData : [];
  }
  async function getTestCaseStepByPosition() {
    let testCaseStepQuery = '';
    if (input['DESTINATION_STEP_POSITION'] == 'First Test Case Step') {
      testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:DESTINATION_TEST_CASE and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Last Test Case Step') {
      testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:DESTINATION_TEST_CASE and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Intermediate Test Case Step') {
      testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:DESTINATION_TEST_CASE and TEST_CASE_STEP_SEQ_ID>:DESTINATION_AFTER_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
    }
    let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepQuery, input);
    return testCaseStepQueryData && testCaseStepQueryData.length ? testCaseStepQueryData : [];
  }
  async function getSequinceBasedOnPosition() {
    let object = {};
    if (input['DESTINATION_STEP_POSITION'] == 'First Test Case Step') {
      object['seqId'] = 1;
      let testCaseStepQueryData = await getTestCaseStepByPosition();
      object['testCaseStepQueryData'] = testCaseStepQueryData;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Last Test Case Step') {
      let testCaseStepQueryData = await getTestCaseStepByPosition();
      object['testCaseStepQueryData'] = testCaseStepQueryData;
      object['seqId'] = testCaseStepQueryData.length + 1;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Intermediate Test Case Step') {
      let testCaseStepQueryData = await getTestCaseStepByPosition();
      object['testCaseStepQueryData'] = testCaseStepQueryData;
      object['seqId'] = input['DESTINATION_AFTER_STEP'] + 1;
    }
    return object;
  }
  async function getSequinceBasedOnPositionForFunction() {
    let object = {};
    if (input['DESTINATION_STEP_POSITION'] == 'First Test Case Step') {
      object['seqId'] = 1;
      let functionStepQueryData = await getFunctionByPosition();
      object['functionStepQueryData'] = functionStepQueryData;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Last Test Case Step') {
      let functionStepQueryData = await getFunctionByPosition();
      object['functionStepQueryData'] = functionStepQueryData;
      object['seqId'] = functionStepQueryData.length + 1;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Intermediate Test Case Step') {
      let functionStepQueryData = await getFunctionByPosition();
      object['functionStepQueryData'] = functionStepQueryData;
      object['seqId'] = input['DESTINATION_AFTER_STEP'] + 1;
    }
    return object;
  }
  async function getSequinceBasedOnPositionForNavigation() {
    let object = {};
    if (input['DESTINATION_STEP_POSITION'] == 'First Test Case Step') {
      object['seqId'] = 1;
      let navQueryData = await getViewByPosition();
      object['navQueryData'] = navQueryData;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Last Test Case Step') {
      let navQueryData = await getViewByPosition();
      object['navQueryData'] = navQueryData;
      object['seqId'] = navQueryData.length + 1;
    } else if (input['DESTINATION_STEP_POSITION'] == 'Intermediate Test Case Step') {
      let navQueryData = await getViewByPosition();
      object['navQueryData'] = navQueryData;
      object['seqId'] = input['DESTINATION_AFTER_STEP'] + 1;
    }
    return object;
  }
  function reorderTestCaseStep(latestCount, testCaseStepQueryData) {
    for (let testCaseStep of testCaseStepQueryData) {
      let testCaseStepObject = {};
      testCaseStepObject['TEST_CASE_STEP_UUID'] = testCaseStep['TEST_CASE_STEP_UUID'];
      testCaseStepObject['TEST_CASE_UUID'] = testCaseStep['TEST_CASE_UUID'];
      testCaseStepObject['TEST_SET_UUID'] = testCaseStep['TEST_SET_UUID'];
      testCaseStepObject['TEST_CASE_STEP_SEQ_ID'] = latestCount;
      testCaseStepObject['compositeEntityAction'] = 'Update';
      latestCount++;
      testCaseStepList.push(testCaseStepObject);
    }
  }
  function reorderFunctionStep(latestCount, functionStepQueryData) {
    for (let functionStep of functionStepQueryData) {
      let functionStepObject = {};
      functionStepObject['FUNCTION_STEP_UUID'] = functionStep['FUNCTION_STEP_UUID'];
      functionStepObject['FUNCTION_STEP_SEQ_ID'] = latestCount;
      functionStepObject['compositeEntityAction'] = 'Update';
      latestCount++;
      functionStepList.push(functionStepObject);
    }
  }
  function reorderNavigationStep(latestCount, navStepData) {
    for (let navStep of navStepData) {
      let navStepObj = {};
      navStepObj['VIEW_NAVIGATION_STEP_UUID'] = navStep['VIEW_NAVIGATION_STEP_UUID'];
      navStepObj['VIEW_NAVIGATION_STEP_SEQ_ID'] = latestCount;
      navStepObj['compositeEntityAction'] = 'Update';
      latestCount++;
      viewNavigationStepList.push(navStepObj);
    }
  }
  function confirmEnding(string, target) {
    let splitedData;
    if (string.substr(-target.length) === target) {
      splitedData = string.split('- Copy ');
      return splitedData[0].trim() + ' - Copy ';
    } else {
      splitedData = string.split('- Copy ');
      return splitedData[0].trim() + ' - Copy ';
    }
  }

  function getStepAttributeData(list, verbiageId) {
    if (list && list.length) {
      return list.filter((item) => item.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID == verbiageId);
    } else {
      return [];
    }
  }

  function getStepAttributeDataByPK(list, id) {
    if (list && list.length) {
      return list.filter((item) => item.STEP_DEFINITION_ATTRIBUTE_UUID == id);
    } else {
      return [];
    }
  }

  function getStepVerbiageData(list, verbiageId) {
    if (list && list.length) {
      let data = list.filter((item) => item.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID == verbiageId);
      if (data && data.length) {
        return data[0];
      } else {
        return {};
      }
    } else {
      return {};
    }
  }

  function isParentScopeExists(scopeId, testCaseStepAttributeList, testCaseStepAttributeKey, testCaseFunctionStepAttributeList, testCaseFunctionStepAttributeKey) {
    let testCaseStepResult = testCaseStepAttributeList.filter((item) => item[testCaseStepAttributeKey] == scopeId);
    let testCaseFunctionStepResult = testCaseFunctionStepAttributeList.filter((item) => item[testCaseFunctionStepAttributeKey] == scopeId);
    if (testCaseStepResult && testCaseStepResult.length == 0 && testCaseFunctionStepResult && testCaseFunctionStepResult.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  function updateSourceUUIDBasedOnTestSetAndTestCase(isSimilarTestSet, isSimilarTestCase) {
    let copyTestCaseStepAttributeValueList = testCaseStepAttributeValueList;
    let copyTestCaseUIElementGroupStepAttributeList = testCaseUIElementGroupStepAttributeList;
    let copyTestCaseViewNavigationAttributeValueList = testCaseViewNavigationAttributeValueList;
    let copytestCaseFunctionStepAttributeValueList = testCaseFunctionStepAttributeValueList;
    let copytestCaseFunctionUIElementGroupStepAttributeList = testCaseFunctionUIElementGroupStepAttributeList;
    for (let copiedData of copyTestCaseStepAttributeValueList) {
      if (copiedData && copiedData['SCOPE_VARIABLE_UUID']) {
        let isParentScopeUUIDExists = isParentScopeExists(
          copiedData['SCOPE_VARIABLE_UUID'],
          testCaseStepAttributeValueList,
          'EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID',
          testCaseFunctionStepAttributeValueList,
          'EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'
        );
        if (!isParentScopeUUIDExists) {
          copiedData['FUNCTION_UUID'] = null;
          copiedData['SCOPE_VARIABLE_UUID'] = null;
        }
        for (let attribute of testCaseStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
        for (let attribute of testCaseFunctionStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
      }
    }
    for (let copiedData of copyTestCaseUIElementGroupStepAttributeList) {
      if (copiedData && copiedData['SCOPE_VARIABLE_UUID']) {
        let isParentScopeUUIDExists = isParentScopeExists(
          copiedData['SCOPE_VARIABLE_UUID'],
          testCaseStepAttributeValueList,
          'EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID',
          testCaseFunctionStepAttributeValueList,
          'EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'
        );
        if (!isParentScopeUUIDExists) {
          copiedData['FUNCTION_UUID'] = null;
          copiedData['SCOPE_VARIABLE_UUID'] = null;
        }
        for (let attribute of testCaseStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
        for (let attribute of testCaseFunctionStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
      }
    }
    for (let copiedData of copyTestCaseViewNavigationAttributeValueList) {
      if (copiedData && copiedData['SCOPE_VARIABLE_UUID']) {
        let isParentScopeUUIDExists = isParentScopeExists(
          copiedData['SCOPE_VARIABLE_UUID'],
          testCaseStepAttributeValueList,
          'EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID',
          testCaseFunctionStepAttributeValueList,
          'EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'
        );
        if (!isParentScopeUUIDExists) {
          copiedData['FUNCTION_UUID'] = null;
          copiedData['SCOPE_VARIABLE_UUID'] = null;
        }
        for (let attribute of testCaseStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
        for (let attribute of testCaseFunctionStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
      }
    }
    for (let copiedData of copytestCaseFunctionStepAttributeValueList) {
      if (copiedData && copiedData['SCOPE_VARIABLE_UUID']) {
        let isParentScopeUUIDExists = isParentScopeExists(
          copiedData['SCOPE_VARIABLE_UUID'],
          testCaseStepAttributeValueList,
          'EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID',
          testCaseFunctionStepAttributeValueList,
          'EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'
        );
        if (!isParentScopeUUIDExists) {
          copiedData['FUNCTION_UUID'] = null;
          copiedData['SCOPE_VARIABLE_UUID'] = null;
        }
        for (let attribute of testCaseStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
        for (let attribute of testCaseFunctionStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
      }
    }
    for (let copiedData of copytestCaseFunctionUIElementGroupStepAttributeList) {
      if (copiedData && copiedData['SCOPE_VARIABLE_UUID']) {
        let isParentScopeUUIDExists = isParentScopeExists(
          copiedData['SCOPE_VARIABLE_UUID'],
          testCaseStepAttributeValueList,
          'EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID',
          testCaseFunctionStepAttributeValueList,
          'EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'
        );
        if (!isParentScopeUUIDExists) {
          copiedData['FUNCTION_UUID'] = null;
          copiedData['SCOPE_VARIABLE_UUID'] = null;
        }
        for (let attribute of testCaseStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
        for (let attribute of testCaseFunctionStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
      }
    }
    testCaseStepAttributeValueList = copyTestCaseStepAttributeValueList;
    testCaseUIElementGroupStepAttributeList = copyTestCaseUIElementGroupStepAttributeList;
    testCaseViewNavigationAttributeValueList = copyTestCaseViewNavigationAttributeValueList;
    testCaseFunctionStepAttributeValueList = copytestCaseFunctionStepAttributeValueList;
    testCaseFunctionUIElementGroupStepAttributeList = copytestCaseFunctionUIElementGroupStepAttributeList;
  }

  function updateSourceUUIDBasedOnFunctionTestSetAndTestCase(isSimilarTestSet, isSimilarTestCase) {
    let copyTestCaseStepAttributeValueList = testCaseStepAttributeValueList;
    let copyTestCaseUIElementGroupStepAttributeList = testCaseUIElementGroupStepAttributeList;
    let copyTestCaseViewNavigationAttributeValueList = testCaseViewNavigationAttributeValueList;
    for (let copiedData of copyTestCaseStepAttributeValueList) {
      if (copiedData && copiedData['SCOPE_VARIABLE_UUID']) {
        let isParentScopeUUIDExists = isParentScopeExists(copiedData['SCOPE_VARIABLE_UUID'], testCaseStepAttributeValueList, 'EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID', [], '');
        if (!isParentScopeUUIDExists) {
          copiedData['FUNCTION_UUID'] = null;
          copiedData['SCOPE_VARIABLE_UUID'] = null;
        }
        for (let attribute of testCaseStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
      }
    }
    for (let copiedData of copyTestCaseUIElementGroupStepAttributeList) {
      if (copiedData && copiedData['SCOPE_VARIABLE_UUID']) {
        let isParentScopeUUIDExists = isParentScopeExists(copiedData['SCOPE_VARIABLE_UUID'], testCaseStepAttributeValueList, 'EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID', [], '');
        if (!isParentScopeUUIDExists) {
          copiedData['FUNCTION_UUID'] = null;
          copiedData['SCOPE_VARIABLE_UUID'] = null;
        }
        for (let attribute of testCaseStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
      }
    }
    for (let copiedData of copyTestCaseViewNavigationAttributeValueList) {
      if (copiedData && copiedData['SCOPE_VARIABLE_UUID']) {
        let isParentScopeUUIDExists = isParentScopeExists(copiedData['SCOPE_VARIABLE_UUID'], testCaseStepAttributeValueList, 'EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID', [], '');
        if (!isParentScopeUUIDExists) {
          copiedData['FUNCTION_UUID'] = null;
          copiedData['SCOPE_VARIABLE_UUID'] = null;
        }
        for (let attribute of testCaseStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
      }
    }
    testCaseStepAttributeValueList = copyTestCaseStepAttributeValueList;
    testCaseUIElementGroupStepAttributeList = copyTestCaseUIElementGroupStepAttributeList;
    testCaseViewNavigationAttributeValueList = copyTestCaseViewNavigationAttributeValueList;
  }

  function updateSourceUUIDBasedOnTestSetAndTestCaseWhileCreateFuncting(isSimilarTestSet, isSimilarTestCase) {
    let copyFunctionStepAttributeValueList = functionStepAttributeValueList;
    let copyFunctionUIElementGroupStepAttributeList = functionUIElementGroupStepAttributeList;
    let copyFunctionViewNavigationAttributeValueList = functionViewNavigationAttributeValueList;
    for (let copiedData of copyFunctionStepAttributeValueList) {
      if (copiedData && copiedData['SCOPE_VARIABLE_UUID']) {
        let isParentScopeUUIDExists = isParentScopeExists(copiedData['SCOPE_VARIABLE_UUID'], functionStepAttributeValueList, 'EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID', [], '');
        if (!isParentScopeUUIDExists) {
          copiedData['SCOPE_VARIABLE_UUID'] = null;
        }
        for (let attribute of functionStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
      }
    }
    for (let copiedData of copyFunctionUIElementGroupStepAttributeList) {
      if (copiedData && copiedData['SCOPE_VARIABLE_UUID']) {
        let isParentScopeUUIDExists = isParentScopeExists(copiedData['SCOPE_VARIABLE_UUID'], functionStepAttributeValueList, 'EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID', [], '');
        if (!isParentScopeUUIDExists) {
          copiedData['SCOPE_VARIABLE_UUID'] = null;
        }
        for (let attribute of functionStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
      }
    }
    for (let copiedData of copyFunctionViewNavigationAttributeValueList) {
      if (copiedData && copiedData['SCOPE_VARIABLE_UUID']) {
        let isParentScopeUUIDExists = isParentScopeExists(copiedData['SCOPE_VARIABLE_UUID'], functionStepAttributeValueList, 'EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID', [], '');
        if (!isParentScopeUUIDExists) {
          copiedData['SCOPE_VARIABLE_UUID'] = null;
        }
        for (let attribute of functionStepAttributeValueList) {
          let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute['STEP_DEFINITION_ATTRIBUTE_UUID']);
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '7c7a43c8-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestSet == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
          if (
            stepDefAttributeQueryData &&
            stepDefAttributeQueryData.length &&
            stepDefAttributeQueryData[0]['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] == '842981e7-e484-11ef-904e-02c8cad0208d' &&
            isSimilarTestCase == 'No'
          ) {
            if (copiedData['SCOPE_VARIABLE_UUID'] == attribute['EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']) {
              copiedData['SCOPE_VARIABLE_UUID'] = attribute['FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
            }
          }
        }
      }
    }
    functionStepAttributeValueList = copyFunctionStepAttributeValueList;
    functionUIElementGroupStepAttributeList = copyFunctionUIElementGroupStepAttributeList;
    functionViewNavigationAttributeValueList = copyFunctionViewNavigationAttributeValueList;
  }
  if (input.compositeEntityAction == 'Insert') {
    if (!input['TEST_CASE_EXECUTON_TYPE']) {
      input['TEST_CASE_EXECUTON_TYPE'] = 'Manual';
    }
    input['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE'] = 'Yes';
    if (input['PARENT_GRID_NAME'] == 'Personal Test Set') {
      input['TEST_CASE_OWNER'] = input['APP_LOGGED_IN_USER_ID'];
    } else if (input['PARENT_GRID_NAME'] == 'Unit Functional Test Set' || input['PARENT_GRID_NAME'] == 'Orphan Test Set') {
      input['TEST_CASE_OWNER'] = input['APP_LOGGED_IN_USER_ID'];
    } else if (input['PARENT_GRID_NAME'] == 'Test Set') {
      input['TEST_CASE_OWNER'] = input['APP_LOGGED_IN_USER_ID'];
    } else if (input['PARENT_GRID_NAME'] == 'Personal - Unit Functional Test Set') {
      input['TEST_CASE_OWNER'] = input['APP_LOGGED_IN_USER_ID'];
    } else if (input['PARENT_GRID_NAME'] == 'Personal - Regular Test Set') {
      input['TEST_CASE_OWNER'] = input['APP_LOGGED_IN_USER_ID'];
    } else if (input['PARENT_GRID_NAME'] == 'Personal - Orphan Test Set') {
      input['TEST_CASE_OWNER'] = input['APP_LOGGED_IN_USER_ID'];
    } else {
      input['TEST_CASE_OWNER'] = input['APP_LOGGED_IN_USER_ID'];
    }
    let testCaseDescUUID = uuid();
    input['TEST_CASE_DESCRIPTION_UUID'] = testCaseDescUUID;
    let testCaseDesc = {};
    testCaseDesc['TEST_CASE_DESCRIPTION_UUID'] = testCaseDescUUID;
    testCaseDescriptionList.push(testCaseDesc);
    input['AppEngChildEntity:TEST_CASE_DESCRIPTION'] = testCaseDescriptionList;
  }
  async function updateTestCaseStepAndItsAttribute() {
    const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
    let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepQuery, input);
    for (let testCaseStep of testCaseStepQueryData) {
      let testCaseStepObject = {};
      testCaseStepObject['TEST_SET_UUID'] = input['DEST_TEST_SET'];
      testCaseStepObject['TEST_CASE_STEP_UUID'] = testCaseStep['TEST_CASE_STEP_UUID'];
      testCaseStepList.push(testCaseStepObject);
      let existingTestCaseStepId = "'" + testCaseStep['TEST_CASE_STEP_UUID'] + "'";
      const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepAttributeValueQuery, input);
      for (let attribute of testCaseStepAttributeValueQueryData) {
        let testCaseStepAttributeObject = {};
        testCaseStepAttributeObject['TEST_SET_UUID'] = input['DEST_TEST_SET'];
        testCaseStepAttributeObject['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'] = attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'];
        testCaseStepAttributeObject['TEST_CASE_STEP_UUID'] = attribute['TEST_CASE_STEP_UUID'];
        testCaseStepAttributeValueList.push(testCaseStepAttributeObject);
      }
    }
  }
  if (input.compositeEntityAction == 'Commit') {
    if (input['PARENT_GRID_NAME'] == 'Personal Test Set') {
      input['TEST_CASE_OWNER'] = null;
      input['TEST_SET_UUID'] = input['DEST_TEST_SET'];
      await updateTestCaseStepAndItsAttribute();
    } else if (input['PARENT_GRID_NAME'] == 'Personal - Unit Functional Test Set') {
      input['TEST_CASE_OWNER'] = null;
    } else if (input['PARENT_GRID_NAME'] == 'Personal - Regular Test Set') {
      input['TEST_CASE_OWNER'] = null;
    } else if (input['PARENT_GRID_NAME'] == 'Personal - Orphan Test Set') {
      input['TEST_CASE_OWNER'] = null;
    } else if (input['PARENT_GRID_NAME'] == 'Personal - API Test Set') {
      input['TEST_CASE_OWNER'] = null;
    } else {
      input['TEST_CASE_OWNER'] = null;
    }
  }
  if (input.compositeEntityAction == 'Delete') {
    const testDataSetQuery = `SELECT * FROM TEST_DATA_SET WHERE PARENT_UUID = :TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testDataSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testDataSetQuery, input);
    if (testDataSetQueryData && testDataSetQueryData.length) {
      for (let index = 0; index < testDataSetQueryData.length; index++) {
        const element = testDataSetQueryData[index];
        testDataSet.push({
          PARENT_TYPE: 'Test_Case',
          TEST_DATA_SET_UUID: element.TEST_DATA_SET_UUID,
          compositeEntityAction: 'Delete'
        });
      }
    }
    let testDataQuery = `SELECT * FROM TEST_DATA where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testDataQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testDataQuery, input);
    console.log('test Data Query Data', testDataQueryData);
    if (testDataQueryData && testDataQueryData.length > 0) {
      for (let index = 0; index < testDataQueryData.length; index++) {
        const element = testDataQueryData[index];
        testData.push({
          TEST_DATA_UUID: element.TEST_DATA_UUID,
          compositeEntityAction: 'Delete'
        });
      }
    }
    const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepQuery, input);
    const testCaseRequirmentQuery = `SELECT * FROM TEST_CASE_REQUIREMENT where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseRequirmentQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseRequirmentQuery, input);
    if (testCaseRequirmentQueryData && testCaseRequirmentQueryData.length) {
      for (let requirmentData of testCaseRequirmentQueryData) {
        deleteTestCaseRequirmentData(requirmentData['TEST_CASE_REQUIREMENT_UUID']);
      }
    }
    for (let data of testCaseStepQueryData) {
      deleteTestCaseStepData(data['TEST_CASE_STEP_UUID']);
      deleteTestCaseStepAttributeData("'" + data['TEST_CASE_STEP_UUID'] + "'");
      if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes' && data['IS_FUNCTION_STEP'] == 'No') {
        deleteTestCaseUIElementGroupStepData("'" + data['TEST_CASE_STEP_UUID'] + "'");
        deleteTestCaseUIElementGroupStepAttributeData("'" + data['TEST_CASE_STEP_UUID'] + "'");
      } else if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'No' && data['IS_FUNCTION_STEP'] == 'Yes') {
        const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in('${
          data['TEST_CASE_STEP_UUID'] ? data['TEST_CASE_STEP_UUID'] : `''`
        }') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
        let functionStepCount = 1;
        if (testCaseFunctionStepData && testCaseFunctionStepData.length) {
          for (let functionStepData of testCaseFunctionStepData) {
            if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'No') {
              deleteTestCaseFunctionStepData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'");
              deleteTestCaseFunctionStepAttributeData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'");
            } else if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
              deleteTestCaseFunctionStepData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'");
              deleteTestCaseFunctionStepAttributeData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'");
              deleteTestCaseFunctionUIElementGroupStepData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'");
              deleteTestCaseFunctionUIElementGroupStepAttributeData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'");
            }
          }
        }
      }
      if (data['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
        const viewNavigationDataQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP WHERE TEST_CASE_STEP_UUID = :TEST_CASE_STEP_UUID AND FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
        const viewNavigationData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewNavigationDataQuery, {
          TEST_CASE_STEP_UUID: data['TEST_CASE_STEP_UUID'],
          APP_LOGGED_IN_FUNTIONAL_AREA_ID: input.APP_LOGGED_IN_FUNTIONAL_AREA_ID
        });
        for (const [index, viewNavigation] of viewNavigationData.entries()) {
          deleteRecords('TEST_CASE_VIEW_NAVIGATION_STEP_UUID', viewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'], 'TEST_CASE_VIEW_NAVIGATION_STEP');
          const viewNavAttributeQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_VIEW_NAVIGATION_STEP_UUID = '${viewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_UUID']}'`;
          const viewNavAttributeData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewNavAttributeQuery, input);
          for (const attrData of viewNavAttributeData) {
            deleteRecords('TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', attrData['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE');
          }
        }
      }
    }
  } else if (input.compositeEntityAction == 'Function' || input.compositeEntityAction == 'Create Function') {
    let generatedFunctionId = uuid();
    let copyCount = 0;
    let testCaseName = confirmEnding(input['TEST_CASE_NAME'], 'Copy ');
    let spilData = testCaseName.split('- Copy');
    let serchedData = spilData[0].trim();
    if (serchedData.includes("'")) {
      serchedData = serchedData.split("'").join("''");
    }
    const functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION where FUNCTION_NAME LIKE '%${serchedData}%' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let functionQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionQuery, input);
    copyCount = functionQueryData.length > 1 ? functionQueryData.length - 1 : '';
    let modifiedTestCaseName = functionQueryData.length != 0 ? testCaseName + copyCount : input['TEST_CASE_NAME'];
    let testCaseStepQuery = ``;
    if (input['STEP_SELECTION_TYPE'] == 'Copy Selected Test Case Steps' && input['START_STEP'] && input['END_STEP']) {
      testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and TEST_CASE_STEP_SEQ_ID>=:START_STEP and TEST_CASE_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
    } else if (input['STEP_SELECTION_TYPE'] == 'Copy Selected Test Case Steps' && input['START_STEP'] && !input['END_STEP']) {
      testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and TEST_CASE_STEP_SEQ_ID>=:START_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
    } else if (input['STEP_SELECTION_TYPE'] == 'Copy All Test Case Steps') {
      testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
    }
    let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepQuery, input);
    let startPage = '';
    let isIntermediate = 'No';
    if (input['STEP_SELECTION_TYPE'] == 'Copy Selected Test Case Steps') {
      let fileredCurrentData = testCaseStepQueryData.filter((item) => item['TEST_CASE_STEP_SEQ_ID'] == input['START_STEP']);
      if (fileredCurrentData && fileredCurrentData.length > 0) {
        let fileredData = fileredCurrentData[0];
        let currentTestCaseStepId = "'" + fileredData['TEST_CASE_STEP_UUID'] + "'";
        const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${currentTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', testCaseStepAttributeValueQuery, input);
        let currentAttributeDataId =
          testCaseStepAttributeValueQueryData && Object.keys(testCaseStepAttributeValueQueryData).length ? "'" + testCaseStepAttributeValueQueryData['TEST_CASE_STEP_ATTRIBUTE_DATA'] + "'" : "' '";
        if (fileredData['IS_UI_ELEMENT_GROUP_STEP'] == 'No' && fileredData['IS_FUNCTION_STEP'] == 'Yes') {
          const functionQuery_1 = `SELECT * FROM featuremanagement_app.FUNCTION where FUNCTION_UUID in(${currentAttributeDataId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let functionQueryData_1 = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery_1, input);
          startPage = functionQueryData_1 && Object.keys(functionQueryData_1).length && functionQueryData_1['START_PAGE_NAME'] ? functionQueryData_1['START_PAGE_NAME'] : null;
          isIntermediate = startPage ? 'Yes' : 'No';
        } else if (fileredData['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes' && fileredData['IS_FUNCTION_STEP'] == 'No') {
          const uiElementGroup = `SELECT * FROM UI_ELEMENT_GROUP where UI_ELEMENT_GROUP_UUID in(${currentAttributeDataId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let uiElementGroupData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementGroup, input);
          startPage = uiElementGroupData && Object.keys(uiElementGroupData).length && uiElementGroupData['PAGE_UUID'] ? uiElementGroupData['PAGE_UUID'] : null;
          isIntermediate = startPage ? 'Yes' : 'No';
        } else {
          startPage = null;
          isIntermediate = 'No';
        }
      }
    } else {
      startPage = null;
      isIntermediate = 'No';
    }
    let functionObject = {
      FUNCTION_UUID: generatedFunctionId,
      FUNCTION_NAME: modifiedTestCaseName,
      IS_INTERMEDIATE_FUNCTION: isIntermediate,
      START_PAGE_NAME: startPage,
      SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE: input['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE']
    };
    functionList.push(functionObject);
    for (let data of testCaseStepQueryData) {
      let existingTestCaseStepId = "'" + data['TEST_CASE_STEP_UUID'] + "'";
      if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'No' && data['IS_FUNCTION_STEP'] == 'No') {
        let generatedFunctionStepId = uuid();
        let functionStepObject = {
          FUNCTION_STEP_UUID: generatedFunctionStepId,
          FUNCTION_UUID: generatedFunctionId,
          FUNCTION_STEP_NAME: data['TEST_CASE_STEP_NAME'],
          STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
          CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
          FUNCTION_STEP_TYPE: data['TEST_CASE_STEP_TYPE'] && data['TEST_CASE_STEP_TYPE'] == 'Data' ? 'Given' : data['TEST_CASE_STEP_TYPE'],
          NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
          VIEW_UUID: data['VIEW_UUID'],
          IS_UI_ELEMENT_GROUP_STEP: data['IS_UI_ELEMENT_GROUP_STEP'],
          IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT: await checkUIElementValueExist(data),
          IS_PURE_NAVIGATION_STEP: data['IS_PURE_NAVIGATION_STEP'],
          IS_API_ATTRIBUTE_VALUE_PRESENT: await checkApiAttributeValueExist(data),
          API_UUID: data['API_UUID'],
          UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID']
        };
        functionStepList.push(functionStepObject);
        const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepAttributeValueQuery, input);
        for (let attribute of testCaseStepAttributeValueQueryData) {
          let generatedFunctionStepAttributeId = uuid();
          let functionStepAttributeObject = {
            FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedFunctionStepAttributeId,
            STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
            FUNCTION_STEP_ATTRIBUTE_DATA: attribute['TEST_CASE_STEP_ATTRIBUTE_DATA'],
            FUNCTION_UUID: generatedFunctionId,
            FUNCTION_STEP_UUID: generatedFunctionStepId,
            PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
            SCOPE_VARIABLE_TYPE: attribute['SCOPE_VARIABLE_TYPE'],
            SCOPE_VARIABLE_UUID: attribute['SCOPE_VARIABLE_UUID'],
            EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']
          };
          functionStepAttributeValueList.push(functionStepAttributeObject);
        }
        if (data['IS_PURE_NAVIGATION_STEP'] && data['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
          const testCaseNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NULL AND FUNCTION_STEP_UUID IS NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
          let testCaseNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationQuery, input);
          let navigationCount = 1;
          for (let testCaseViewNavigation of testCaseNavigationQueryData) {
            let functionViewNavigationStepId = uuid();
            let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] + "'";
            let testCaseViewNavigationObject = {
              FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
              VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation['VIEW_NAVIGATION_STEP_UUID'],
              FUNCTION_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'],
              STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
              FUNCTION_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'],
              FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
              CURRENT_PAGE_CONTEXT: testCaseViewNavigation['CURRENT_PAGE_CONTEXT'],
              NEXT_PAGE_CONTEXT: testCaseViewNavigation['NEXT_PAGE_CONTEXT'],
              VIEW_UUID: testCaseViewNavigation['VIEW_UUID'],
              FUNCTION_UUID: generatedFunctionId,
              FUNCTION_STEP_UUID: generatedFunctionStepId,
              IS_ANY_VALUE_CHANGED: 'Yes'
            };
            functionViewNavigationList.push(testCaseViewNavigationObject);
            navigationCount++;
            const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationAttributeQuery, input);
            for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
              let testCaseViewNavigationAttributeId = uuid();
              let testCaseViewNavigationAttributeObject = {
                FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                VIEW_UUID: viewNavigationAttribute['VIEW_UUID'],
                PRE_DEFINED_VALUES_UUID: viewNavigationAttribute['PRE_DEFINED_VALUES_UUID'],
                FUNCTION_UUID: viewNavigationAttribute['FUNCTION_UUID'],
                SCOPE_VARIABLE_TYPE: viewNavigationAttribute['SCOPE_VARIABLE_TYPE'],
                SCOPE_VARIABLE_UUID: viewNavigationAttribute['SCOPE_VARIABLE_UUID'],
                EXISTING_FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'],
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              functionViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
            }
          }
        }
      }
      if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'No' && data['IS_FUNCTION_STEP'] == 'Yes') {
        const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${
          existingTestCaseStepId ? existingTestCaseStepId : `''`
        }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
        let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
        if (testCaseFunctionStepData && testCaseFunctionStepData.length) {
          for (let functionStepData of testCaseFunctionStepData) {
            let generatedFunctionStepId = uuid();
            let existingTestCaseFunctionStepId = "'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'";
            let functionStepObject = {
              FUNCTION_STEP_UUID: generatedFunctionStepId,
              FUNCTION_UUID: generatedFunctionId,
              FUNCTION_STEP_NAME: functionStepData['TEST_CASE_FUNCTION_STEP_NAME'],
              STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
              CURRENT_PAGE_CONTEXT: functionStepData['CURRENT_PAGE_CONTEXT'],
              FUNCTION_STEP_TYPE: functionStepData['TEST_CASE_FUNCTION_STEP_TYPE'],
              NEXT_PAGE_CONTEXT: functionStepData['NEXT_PAGE_CONTEXT'],
              IS_UI_ELEMENT_GROUP_STEP: functionStepData['IS_UI_ELEMENT_GROUP_STEP'],
              IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT: await checkUIElementValueExist(functionStepData),
              IS_PURE_NAVIGATION_STEP: functionStepData['IS_PURE_NAVIGATION_STEP'],
              IS_API_ATTRIBUTE_VALUE_PRESENT: await checkApiAttributeValueExist(functionStepData),
              API_UUID: functionStepData['API_UUID'],
              VIEW_UUID: functionStepData['VIEW_UUID'],
              UI_ELEMENT_GROUP_UUID: functionStepData['UI_ELEMENT_GROUP_UUID']
            };
            functionStepList.push(functionStepObject);
            const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input);
            for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
              let generatedFunctionStepAttributeId = uuid();
              let functionStepAttributeObject = {
                FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedFunctionStepAttributeId,
                STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData['STEP_DEFINITION_ATTRIBUTE_UUID'],
                FUNCTION_STEP_ATTRIBUTE_DATA: functionStepAttributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'],
                FUNCTION_STEP_UUID: generatedFunctionStepId,
                FUNCTION_UUID: generatedFunctionId,
                PRE_DEFINED_VALUES_UUID: functionStepAttributeData['PRE_DEFINED_VALUES_UUID'],
                SCOPE_VARIABLE_TYPE: functionStepAttributeData['SCOPE_VARIABLE_TYPE'],
                SCOPE_VARIABLE_UUID: functionStepAttributeData['SCOPE_VARIABLE_UUID'],
                EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']
              };
              functionStepAttributeValueList.push(functionStepAttributeObject);
            }
            if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
              const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
              let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input);
              for (let functionStepUIElementGroupStepData of testCaseFunctionUIElementGroupStepQueryData) {
                let generatedFunctionUIElementGroupStepId = uuid();
                let existingTestCaseFunctionUIElementGroupStepId = "'" + functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] + "'";
                let functionUIElementGroupStepObject = {
                  FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                  FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepUIElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  CURRENT_PAGE_CONTEXT: functionStepUIElementGroupStepData['CURRENT_PAGE_CONTEXT'],
                  FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
                  FUNCTION_STEP_UUID: generatedFunctionStepId,
                  FUNCTION_UUID: generatedFunctionId,
                  UI_ELEMENT_GROUP_UUID: functionStepUIElementGroupStepData['UI_ELEMENT_GROUP_UUID'],
                  UI_ELEMENT_GROUP_STEP_UUID: functionStepUIElementGroupStepData['UI_ELEMENT_GROUP_STEP_UUID'],
                  FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                functionUIElementGroupStepList.push(functionUIElementGroupStepObject);
                const testCaseFunctionUIElementGroupStepAttributeQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseFunctionUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseFunctionUIElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
                  'PRIMARYSPRINGFM',
                  testCaseFunctionUIElementGroupStepAttributeQuery,
                  input
                );
                for (let testCaseFunctionUIElementGroupStepAttribute of testCaseFunctionUIElementGroupStepAttributeQueryData) {
                  let functionUIElementGroupStepAttributeValueId = uuid();
                  let functionUIElementGroupStepAttributeObject = {
                    FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionUIElementGroupStepAttributeValueId,
                    STEP_DEFINITION_ATTRIBUTE_UUID: testCaseFunctionUIElementGroupStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: testCaseFunctionUIElementGroupStepAttribute['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                    FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                    FUNCTION_STEP_UUID: generatedFunctionStepId,
                    FUNCTION_UUID: generatedFunctionId,
                    PRE_DEFINED_VALUES_UUID: testCaseFunctionUIElementGroupStepAttribute['PRE_DEFINED_VALUES_UUID'],
                    SCOPE_VARIABLE_TYPE: testCaseFunctionUIElementGroupStepAttribute['SCOPE_VARIABLE_TYPE'],
                    SCOPE_VARIABLE_UUID: testCaseFunctionUIElementGroupStepAttribute['SCOPE_VARIABLE_UUID'],
                    EXISTING_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: testCaseFunctionUIElementGroupStepAttribute['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  functionUIElementGroupStepAttributeList.push(functionUIElementGroupStepAttributeObject);
                }
              }
            }
            if (functionStepData['IS_PURE_NAVIGATION_STEP'] && functionStepData['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
              const testCaseNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NOT NULL AND FUNCTION_STEP_UUID IS NOT NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
              let testCaseNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationQuery, input);
              let navigationCount = 1;
              for (let testCaseViewNavigation of testCaseNavigationQueryData) {
                let functionViewNavigationStepId = uuid();
                let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] + "'";
                let testCaseViewNavigationObject = {
                  FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                  VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation['VIEW_NAVIGATION_STEP_UUID'],
                  FUNCTION_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  FUNCTION_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'],
                  FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                  CURRENT_PAGE_CONTEXT: testCaseViewNavigation['CURRENT_PAGE_CONTEXT'],
                  NEXT_PAGE_CONTEXT: testCaseViewNavigation['NEXT_PAGE_CONTEXT'],
                  VIEW_UUID: testCaseViewNavigation['VIEW_UUID'],
                  FUNCTION_UUID: generatedFunctionId,
                  FUNCTION_STEP_UUID: generatedFunctionStepId,
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                functionViewNavigationList.push(testCaseViewNavigationObject);
                navigationCount++;
                const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationAttributeQuery, input);
                for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
                  let testCaseViewNavigationAttributeId = uuid();
                  let testCaseViewNavigationAttributeObject = {
                    FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                    STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                    FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                    VIEW_UUID: viewNavigationAttribute['VIEW_UUID'],
                    PRE_DEFINED_VALUES_UUID: viewNavigationAttribute['PRE_DEFINED_VALUES_UUID'],
                    FUNCTION_UUID: viewNavigationAttribute['FUNCTION_UUID'],
                    SCOPE_VARIABLE_TYPE: viewNavigationAttribute['SCOPE_VARIABLE_TYPE'],
                    SCOPE_VARIABLE_UUID: viewNavigationAttribute['SCOPE_VARIABLE_UUID'],
                    EXISTING_FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  functionViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                }
              }
            }
          }
        }
      } else if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes' && data['IS_FUNCTION_STEP'] == 'No') {
        let generatedFunctionStepId = uuid();
        let functionStepObject = {
          FUNCTION_STEP_UUID: generatedFunctionStepId,
          FUNCTION_UUID: generatedFunctionId,
          FUNCTION_STEP_NAME: data['TEST_CASE_STEP_NAME'],
          STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
          CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
          FUNCTION_STEP_TYPE: data['TEST_CASE_STEP_TYPE'] && data['TEST_CASE_STEP_TYPE'] == 'Data' ? 'Given' : data['TEST_CASE_STEP_TYPE'],
          NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
          IS_UI_ELEMENT_GROUP_STEP: data['IS_UI_ELEMENT_GROUP_STEP'],
          IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT: await checkUIElementValueExist(data),
          IS_PURE_NAVIGATION_STEP: data['IS_PURE_NAVIGATION_STEP'],
          IS_API_ATTRIBUTE_VALUE_PRESENT: await checkApiAttributeValueExist(data),
          API_UUID: data['API_UUID'],
          UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID'],
          VIEW_UUID: data['VIEW_UUID']
        };
        functionStepList.push(functionStepObject);
        const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepAttributeValueQuery, input);
        for (let attribute of testCaseStepAttributeValueQueryData) {
          let generatedFunctionStepAttributeId = uuid();
          let functionStepAttributeObject = {
            FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedFunctionStepAttributeId,
            STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
            FUNCTION_STEP_ATTRIBUTE_DATA: attribute['TEST_CASE_STEP_ATTRIBUTE_DATA'],
            FUNCTION_UUID: generatedFunctionId,
            FUNCTION_STEP_UUID: generatedFunctionStepId,
            PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
            SCOPE_VARIABLE_TYPE: attribute['SCOPE_VARIABLE_TYPE'],
            SCOPE_VARIABLE_UUID: attribute['SCOPE_VARIABLE_UUID'],
            EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']
          };
          functionStepAttributeValueList.push(functionStepAttributeObject);
        }
        const testCaseUIElementStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
        let testCaseUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementStepQuery, input);
        for (let uiElementGroupStepData of testCaseUIElementStepQueryData) {
          let generatedFunctionUIElementGroupStepId = uuid();
          let existingTestCaseUIElementGroupStepId = "'" + uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'] + "'";
          let functionUIElementGroupStepObject = {
            FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
            FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME'],
            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
            CURRENT_PAGE_CONTEXT: uiElementGroupStepData['CURRENT_PAGE_CONTEXT'],
            FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE'],
            FUNCTION_STEP_UUID: generatedFunctionStepId,
            FUNCTION_UUID: generatedFunctionId,
            UI_ELEMENT_GROUP_UUID: uiElementGroupStepData['UI_ELEMENT_GROUP_UUID'],
            UI_ELEMENT_GROUP_STEP_UUID: uiElementGroupStepData['UI_ELEMENT_GROUP_STEP_UUID'],
            FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID'],
            IS_ANY_VALUE_CHANGED: 'Yes'
          };
          functionUIElementGroupStepList.push(functionUIElementGroupStepObject);
          const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input);
          for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
            let functionUIElementGroupStepAttributeValueId = uuid();
            let functionUIElementGroupStepAttributeObject = {
              FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionUIElementGroupStepAttributeValueId,
              STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData['STEP_DEFINITION_ATTRIBUTE_UUID'],
              FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: functionStepAttributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
              FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
              FUNCTION_STEP_UUID: generatedFunctionStepId,
              FUNCTION_UUID: generatedFunctionId,
              PRE_DEFINED_VALUES_UUID: functionStepAttributeData['PRE_DEFINED_VALUES_UUID'],
              SCOPE_VARIABLE_TYPE: functionStepAttributeData['SCOPE_VARIABLE_TYPE'],
              SCOPE_VARIABLE_UUID: functionStepAttributeData['SCOPE_VARIABLE_UUID'],
              EXISTING_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
              IS_ANY_VALUE_CHANGED: 'Yes'
            };
            functionUIElementGroupStepAttributeList.push(functionUIElementGroupStepAttributeObject);
          }
        }
      }
    }
    if (functionStepList && functionStepList.length > 0) {
      let SeqId = 1;
      for (let functionStepListData of functionStepList) {
        functionStepListData['FUNCTION_STEP_SEQ_ID'] = SeqId;
        SeqId++;
      }
    }
    updateSourceUUIDBasedOnTestSetAndTestCaseWhileCreateFuncting('No', 'No');
  } else if ((input.compositeEntityAction == 'Copy' || input.compositeEntityAction == 'Copy Test Case') && input['FORM_TYPE'] == 'Copy Test Case Steps') {
    if (input['SOURCE_TYPE'] == 'TEST_CASE') {
      const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:ORIGINAL_TEST_CASE_UUID and TEST_CASE_STEP_SEQ_ID>=:START_STEP and TEST_CASE_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
      let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepQuery, input);

      // From Test Case Step to Test Case Step   
      if (isDestinationTestSet(input['TEST_SET_TYPE'])) {
        // Inserting test case steps to destination test set
        let testCaseStepDetailsWithSeq = await getSequinceBasedOnPosition();
        let count = testCaseStepDetailsWithSeq['seqId'];
        for (let data of testCaseStepQueryData) {
          let generatedTestCaseStepId = uuid();
          let testCaseStepObject = {
            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
            TEST_CASE_UUID: input['DESTINATION_TEST_CASE'],
            TEST_SET_UUID: input['TEST_SET_UUID'],
            TEST_CASE_STEP_NAME: data['TEST_CASE_STEP_NAME'],
            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
            CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
            VIEW_UUID: data['VIEW_UUID'],
            TEST_CASE_STEP_SEQ_ID: count,
            TEST_CASE_STEP_TYPE: data['TEST_CASE_STEP_TYPE'],
            NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
            IS_UI_ELEMENT_GROUP_STEP: data['IS_UI_ELEMENT_GROUP_STEP'],
            IS_FUNCTION_STEP: data['IS_FUNCTION_STEP'],
            IS_PURE_NAVIGATION_STEP: data['IS_PURE_NAVIGATION_STEP'],
            PLAYWRITE_STEP_CODE: data['PLAYWRITE_STEP_CODE'],
            API_UUID: data['API_UUID'],
            FUNCTION_UUID: data['FUNCTION_UUID'],
            UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID']
          };
          testCaseStepList.push(testCaseStepObject);
          count++;
          let existingTestCaseStepId = "'" + data['TEST_CASE_STEP_UUID'] + "'";
          const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepAttributeValueQuery, input);
          for (let attribute of testCaseStepAttributeValueQueryData) {
            let generatedTestCaseStepAttributeId = uuid();
            let testCaseStepAttributeObject = {
              TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseStepAttributeId,
              STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
              TEST_CASE_STEP_ATTRIBUTE_DATA: attribute['TEST_CASE_STEP_ATTRIBUTE_DATA'],
              TEST_SET_UUID: input['TEST_SET_UUID'],
              TEST_CASE_UUID: input['DESTINATION_TEST_CASE'],
              TEST_CASE_STEP_UUID: generatedTestCaseStepId,
              PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
              FUNCTION_UUID: attribute['FUNCTION_UUID'],
              SCOPE_VARIABLE_TYPE: attribute['SCOPE_VARIABLE_TYPE'],
              SCOPE_VARIABLE_UUID: attribute['SCOPE_VARIABLE_UUID'],
              EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']
            };
            testCaseStepAttributeValueList.push(testCaseStepAttributeObject);
          }
          if (data['IS_PURE_NAVIGATION_STEP'] && data['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
            const testCaseViewNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NULL AND FUNCTION_STEP_UUID IS NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
            let testCaseViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationQuery, input);
            let navigationCount = 1;
            for (let testCaseViewNavigation of testCaseViewNavigationQueryData) {
              let testCaseViewNavigationStepId = uuid();
              let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] + "'";
              let testCaseViewNavigationObject = {
                TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation['VIEW_NAVIGATION_STEP_UUID'],
                TEST_CASE_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'],
                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                TEST_CASE_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'],
                TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                CURRENT_PAGE_CONTEXT: testCaseViewNavigation['CURRENT_PAGE_CONTEXT'],
                NEXT_PAGE_CONTEXT: testCaseViewNavigation['NEXT_PAGE_CONTEXT'],
                VIEW_UUID: testCaseViewNavigation['VIEW_UUID'],
                TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                FUNCTION_UUID: testCaseViewNavigation['FUNCTION_UUID'],
                FUNCTION_STEP_UUID: testCaseViewNavigation['FUNCTION_STEP_UUID'],
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              testCaseViewNavigationList.push(testCaseViewNavigationObject);
              navigationCount++;
              const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationAttributeQuery, input);
              for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
                let testCaseViewNavigationAttributeId = uuid();
                let testCaseViewNavigationAttributeObject = {
                  TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                  STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                  TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                  VIEW_UUID: viewNavigationAttribute['VIEW_UUID'],
                  PRE_DEFINED_VALUES_UUID: viewNavigationAttribute['PRE_DEFINED_VALUES_UUID'],
                  FUNCTION_UUID: viewNavigationAttribute['FUNCTION_UUID'],
                  SCOPE_VARIABLE_TYPE: viewNavigationAttribute['SCOPE_VARIABLE_TYPE'],
                  SCOPE_VARIABLE_UUID: viewNavigationAttribute['SCOPE_VARIABLE_UUID'],
                  EXISTING_TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                testCaseViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
              }
            }
          }
          if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'No' && data['IS_FUNCTION_STEP'] == 'Yes') {
            const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${
              existingTestCaseStepId ? existingTestCaseStepId : `''`
            }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
            let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
            let functionStepCount = 1;
            if (testCaseFunctionStepData && testCaseFunctionStepData.length) {
              for (let functionStepData of testCaseFunctionStepData) {
                let generatedTestCaseFunctionStepId = uuid();
                let testCaseFunctionStepObject = {
                  TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                  TEST_CASE_FUNCTION_STEP_NAME: functionStepData['TEST_CASE_FUNCTION_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  CURRENT_PAGE_CONTEXT: functionStepData['CURRENT_PAGE_CONTEXT'],
                  NEXT_PAGE_CONTEXT: functionStepData['NEXT_PAGE_CONTEXT'],
                  VIEW_UUID: functionStepData['VIEW_UUID'],
                  TEST_CASE_FUNCTION_STEP_TYPE: functionStepData['TEST_CASE_FUNCTION_STEP_TYPE'],
                  TEST_CASE_FUNCTION_STEP_SEQ_ID: functionStepCount,
                  TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                  IS_UI_ELEMENT_GROUP_STEP: functionStepData['IS_UI_ELEMENT_GROUP_STEP'],
                  FUNCTION_UUID: functionStepData['FUNCTION_UUID'],
                  FUNCTION_STEP_UUID: functionStepData['FUNCTION_STEP_UUID'],
                  IS_PURE_NAVIGATION_STEP: functionStepData['IS_PURE_NAVIGATION_STEP'],
                  API_UUID: functionStepData['API_UUID'],
                  UI_ELEMENT_GROUP_UUID: functionStepData['UI_ELEMENT_GROUP_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                testCaseFunctionStepList.push(testCaseFunctionStepObject);
                functionStepCount++;
                let existingTestCaseFunctionStepId = "'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'";
                const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input);
                for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
                  let generatedTestCaseFunctionStepAttributeId = uuid();
                  let testCaseFunctionStepAttributeObject = {
                    TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseFunctionStepAttributeId,
                    STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA: functionStepAttributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'],
                    TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                    TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                    FUNCTION_UUID: functionStepAttributeData['FUNCTION_UUID'],
                    PRE_DEFINED_VALUES_UUID: functionStepAttributeData['PRE_DEFINED_VALUES_UUID'],
                    SCOPE_VARIABLE_TYPE: functionStepAttributeData['SCOPE_VARIABLE_TYPE'],
                    SCOPE_VARIABLE_UUID: functionStepAttributeData['SCOPE_VARIABLE_UUID'],
                    EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  testCaseFunctionStepAttributeValueList.push(testCaseFunctionStepAttributeObject);
                }
                if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
                  const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
                  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input);
                  for (let functionStepUIElementGroupStepData of testCaseFunctionUIElementGroupStepQueryData) {
                    let generatedTestCaseFunctionUIElementGroupStepId = uuid();
                    let testCaseFunctionUIElementGroupStepObject = {
                      TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseFunctionUIElementGroupStepId,
                      TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
                      STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepUIElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                      CURRENT_PAGE_CONTEXT: functionStepUIElementGroupStepData['CURRENT_PAGE_CONTEXT'],
                      TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
                      TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                      TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                      UI_ELEMENT_GROUP_UUID: functionStepUIElementGroupStepData['UI_ELEMENT_GROUP_UUID'],
                      UI_ELEMENT_GROUP_STEP_UUID: functionStepUIElementGroupStepData['UI_ELEMENT_GROUP_STEP_UUID'],
                      FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: functionStepUIElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'],
                      TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID'],
                      FUNCTION_STEP_UUID: functionStepUIElementGroupStepData['FUNCTION_STEP_UUID'],
                      FUNCTION_UUID: functionStepUIElementGroupStepData['FUNCTION_UUID'],
                      IS_ANY_VALUE_CHANGED: 'Yes'
                    };
                    testCaseFunctionUIElementGroupStepList.push(testCaseFunctionUIElementGroupStepObject);
                    let existingTestCaseFunctionUIElementGroupStepId = "'" + functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] + "'";
                    const testCaseFunctionUIElementGroupStepAttributeQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseFunctionUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let testCaseFunctionUIElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
                      'PRIMARYSPRINGFM',
                      testCaseFunctionUIElementGroupStepAttributeQuery,
                      input
                    );
                    for (let testCaseFunctionUIElementGroupStepAttribute of testCaseFunctionUIElementGroupStepAttributeQueryData) {
                      let generatedTestCaseFunctionUIElementGroupStepAttributeId = uuid();
                      let testCaseFunctionUIelementGroupAttributeObject = {
                        TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseFunctionUIElementGroupStepAttributeId,
                        STEP_DEFINITION_ATTRIBUTE_UUID: testCaseFunctionUIElementGroupStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: testCaseFunctionUIElementGroupStepAttribute['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                        TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseFunctionUIElementGroupStepId,
                        TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                        UI_ELEMENT_GROUP_UUID: testCaseFunctionUIElementGroupStepAttribute['UI_ELEMENT_GROUP_UUID'],
                        TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                        PRE_DEFINED_VALUES_UUID: testCaseFunctionUIElementGroupStepAttribute['PRE_DEFINED_VALUES_UUID'],
                        FUNCTION_UUID: testCaseFunctionUIElementGroupStepAttribute['FUNCTION_UUID'],
                        SCOPE_VARIABLE_TYPE: testCaseFunctionUIElementGroupStepAttribute['SCOPE_VARIABLE_TYPE'],
                        SCOPE_VARIABLE_UUID: testCaseFunctionUIElementGroupStepAttribute['SCOPE_VARIABLE_UUID'],
                        EXISTING_TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID:
                          testCaseFunctionUIElementGroupStepAttribute['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      testCaseFunctionUIElementGroupStepAttributeList.push(testCaseFunctionUIelementGroupAttributeObject);
                    }
                  }
                }
                if (functionStepData['IS_PURE_NAVIGATION_STEP'] && functionStepData['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
                  const testCaseFunctionViewNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NOT NULL AND FUNCTION_STEP_UUID IS NOT NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                  let testCaseFunctionViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionViewNavigationQuery, input);
                  let functionNavigationCount = 1;
                  for (let testCaseViewNavigation of testCaseFunctionViewNavigationQueryData) {
                    let testCaseViewNavigationStepId = uuid();
                    let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] + "'";
                    let testCaseViewNavigationObject = {
                      TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                      VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation['VIEW_NAVIGATION_STEP_UUID'],
                      TEST_CASE_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'],
                      STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                      TEST_CASE_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'],
                      TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID: functionNavigationCount,
                      CURRENT_PAGE_CONTEXT: testCaseViewNavigation['CURRENT_PAGE_CONTEXT'],
                      NEXT_PAGE_CONTEXT: testCaseViewNavigation['NEXT_PAGE_CONTEXT'],
                      VIEW_UUID: testCaseViewNavigation['VIEW_UUID'],
                      TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                      FUNCTION_UUID: testCaseViewNavigation['FUNCTION_UUID'],
                      FUNCTION_STEP_UUID: testCaseViewNavigation['FUNCTION_STEP_UUID'],
                      IS_ANY_VALUE_CHANGED: 'Yes'
                    };
                    testCaseViewNavigationList.push(testCaseViewNavigationObject);
                    functionNavigationCount++;
                    const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationAttributeQuery, input);
                    for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
                      let testCaseViewNavigationAttributeId = uuid();
                      let testCaseViewNavigationAttributeObject = {
                        TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                        STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                        TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                        TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                        VIEW_UUID: viewNavigationAttribute['VIEW_UUID'],
                        PRE_DEFINED_VALUES_UUID: viewNavigationAttribute['PRE_DEFINED_VALUES_UUID'],
                        FUNCTION_UUID: viewNavigationAttribute['FUNCTION_UUID'],
                        SCOPE_VARIABLE_TYPE: viewNavigationAttribute['SCOPE_VARIABLE_TYPE'],
                        SCOPE_VARIABLE_UUID: viewNavigationAttribute['SCOPE_VARIABLE_UUID'],
                        EXISTING_TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'],
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      testCaseViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                    }
                  }
                }
              }
            }
          } else if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes' && data['IS_FUNCTION_STEP'] == 'No') {
            const testCaseUIElementStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
            let testCaseUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementStepQuery, input);
            for (let uiElementGroupStepData of testCaseUIElementStepQueryData) {
              let generatedTestCaseUIElementGroupStepId = uuid();
              let testCaseUIElementGroupStepObject = {
                TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
                TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME: uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME'],
                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                CURRENT_PAGE_CONTEXT: uiElementGroupStepData['CURRENT_PAGE_CONTEXT'],
                TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE: uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE'],
                TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                UI_ELEMENT_GROUP_UUID: uiElementGroupStepData['UI_ELEMENT_GROUP_UUID'],
                UI_ELEMENT_GROUP_STEP_UUID: uiElementGroupStepData['UI_ELEMENT_GROUP_STEP_UUID'],
                TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID: uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID'],
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              testCaseUIElementGroupStepList.push(testCaseUIElementGroupStepObject);
              let existingTestCaseUIElementGroupStepId = "'" + uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'] + "'";
              const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input);
              for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
                let generatedTestCaseUIElementGroupStepAttributeId = uuid();
                let testCaseUIElementGroupStepAttributeobject = {
                  TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseUIElementGroupStepAttributeId,
                  STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: functionStepAttributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                  TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
                  TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                  UI_ELEMENT_GROUP_UUID: functionStepAttributeData['UI_ELEMENT_GROUP_UUID'],
                  FUNCTION_UUID: functionStepAttributeData['FUNCTION_UUID'],
                  PRE_DEFINED_VALUES_UUID: functionStepAttributeData['PRE_DEFINED_VALUES_UUID'],
                  SCOPE_VARIABLE_TYPE: functionStepAttributeData['SCOPE_VARIABLE_TYPE'],
                  SCOPE_VARIABLE_UUID: functionStepAttributeData['SCOPE_VARIABLE_UUID'],
                  EXISTING_TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                testCaseUIElementGroupStepAttributeList.push(testCaseUIElementGroupStepAttributeobject);
              }
            }
          }
        }
        if (['First Test Case Step', 'Intermediate Test Case Step'].includes(input['DESTINATION_STEP_POSITION'])) {
          reorderTestCaseStep(count, testCaseStepDetailsWithSeq['testCaseStepQueryData']);
        }
        if (input['ORIGINAL_TEST_SET_UUID'] == input['TEST_SET_UUID']) {
          if (input['ORIGINAL_TEST_CASE_UUID'] == input['DESTINATION_TEST_CASE']) {
            updateSourceUUIDBasedOnTestSetAndTestCase('Yes', 'Yes');
          } else if (input['ORIGINAL_TEST_CASE_UUID'] != input['DESTINATION_TEST_CASE']) {
            updateSourceUUIDBasedOnTestSetAndTestCase('Yes', 'No');
          }
        } else if (input['ORIGINAL_TEST_SET_UUID'] != input['TEST_SET_UUID']) {
          updateSourceUUIDBasedOnTestSetAndTestCase('No', 'No');
        }
      } 
      // From Test Case Step to Function Step   
      else if (input['TEST_SET_TYPE'] == 'Function') {

        let functionStepDetailsWithSeq = await getSequinceBasedOnPositionForFunction();
        let count = functionStepDetailsWithSeq['seqId'];
        const generatedFunctionId = input['DESTINATION_FUNCTION'];

        for (let data of testCaseStepQueryData) {
          let existingTestCaseStepId = "'" + data['TEST_CASE_STEP_UUID'] + "'";
          if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'No' && data['IS_FUNCTION_STEP'] == 'No') {
            let generatedFunctionStepId = uuid();
            let functionStepObject = {
              FUNCTION_STEP_UUID: generatedFunctionStepId,
              FUNCTION_UUID: generatedFunctionId,
              FUNCTION_STEP_NAME: data['TEST_CASE_STEP_NAME'],
              STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
              CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
              FUNCTION_STEP_TYPE: data['TEST_CASE_STEP_TYPE'] && data['TEST_CASE_STEP_TYPE'] == 'Data' ? 'Given' : data['TEST_CASE_STEP_TYPE'],
              NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
              VIEW_UUID: data['VIEW_UUID'],
              IS_UI_ELEMENT_GROUP_STEP: data['IS_UI_ELEMENT_GROUP_STEP'],
              IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT: await checkUIElementValueExist(data),
              IS_PURE_NAVIGATION_STEP: data['IS_PURE_NAVIGATION_STEP'],
              IS_API_ATTRIBUTE_VALUE_PRESENT: await checkApiAttributeValueExist(data),
              API_UUID: data['API_UUID'],
              UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID'],
              FUNCTION_STEP_SEQ_ID: count,
              IS_ANY_VALUE_CHANGED: 'Yes'
            };
            count++;
            functionStepList.push(functionStepObject);

            const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepAttributeValueQuery, input);
            for (let attribute of testCaseStepAttributeValueQueryData) {
              let generatedFunctionStepAttributeId = uuid();
              let functionStepAttributeObject = {
                FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedFunctionStepAttributeId,
                STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                FUNCTION_STEP_ATTRIBUTE_DATA: attribute['TEST_CASE_STEP_ATTRIBUTE_DATA'],
                FUNCTION_UUID: generatedFunctionId,
                FUNCTION_STEP_UUID: generatedFunctionStepId,
                PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
                SCOPE_VARIABLE_TYPE: attribute['SCOPE_VARIABLE_TYPE'],
                SCOPE_VARIABLE_UUID: attribute['SCOPE_VARIABLE_UUID'],
                EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'],
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              functionStepAttributeValueList.push(functionStepAttributeObject);
            }
            if (data['IS_PURE_NAVIGATION_STEP'] && data['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
              const testCaseNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NULL AND FUNCTION_STEP_UUID IS NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
              let testCaseNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationQuery, input);

              // TODO:

              let navigationCount = 1;
              for (let overridenViewNav of testCaseNavigationQueryData) {
                let functionViewNavigationStepId = uuid();
                let testNavStepUUID = `'${overridenViewNav.TEST_CASE_VIEW_NAVIGATION_STEP_UUID}'`;

                let testCaseViewNavigationObject = {
                  FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                  VIEW_NAVIGATION_STEP_UUID: overridenViewNav['VIEW_NAVIGATION_STEP_UUID'],
                  FUNCTION_VIEW_NAVIGATION_STEP_NAME: overridenViewNav['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: overridenViewNav['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  FUNCTION_VIEW_NAVIGATION_STEP_TYPE: overridenViewNav['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'],
                  FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                  CURRENT_PAGE_CONTEXT: overridenViewNav['CURRENT_PAGE_CONTEXT'],
                  NEXT_PAGE_CONTEXT: overridenViewNav['NEXT_PAGE_CONTEXT'],
                  VIEW_UUID: overridenViewNav['VIEW_UUID'],
                  FUNCTION_UUID: generatedFunctionId,
                  FUNCTION_STEP_UUID: generatedFunctionStepId,
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                functionViewNavigationList.push(testCaseViewNavigationObject);

                navigationCount++;

                const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${testNavStepUUID}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationAttributeQuery, input);

                for (let existingAttri of testCaseViewNavigationAttributeQueryData) {
                  let testCaseViewNavigationAttributeId = uuid();

                  let testCaseViewNavigationAttributeObject = {
                    FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                    STEP_DEFINITION_ATTRIBUTE_UUID: existingAttri['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: existingAttri['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                    FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                    VIEW_UUID: existingAttri['VIEW_UUID'],
                    PRE_DEFINED_VALUES_UUID: existingAttri['PRE_DEFINED_VALUES_UUID'],
                    FUNCTION_UUID: existingAttri['FUNCTION_UUID'],
                    SCOPE_VARIABLE_TYPE: existingAttri['SCOPE_VARIABLE_TYPE'],
                    SCOPE_VARIABLE_UUID: existingAttri['SCOPE_VARIABLE_UUID'],
                    EXISTING_FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: existingAttri['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  functionViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                }
              }
            }
          } else if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'No' && data['IS_FUNCTION_STEP'] == 'Yes') {
            const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${
              existingTestCaseStepId ? existingTestCaseStepId : `''`
            }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
            let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);

            const functionStepQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID = '${data['FUNCTION_UUID']}'`;
            const functionStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionStepQuery, input);

            if (functionStepData && functionStepData.length) {
              for (let fsData of functionStepData) {
                let generatedFunctionStepId = uuid();

                const existingFunctionStep = testCaseFunctionStepData.find((step) => step.FUNCTION_STEP_UUID === fsData['FUNCTION_STEP_UUID']);

                let existingFuncStepId = `'${fsData['FUNCTION_STEP_UUID']}'`;
                let existingTestCaseFunctionStepId = existingFunctionStep ? `'${existingFunctionStep['TEST_CASE_FUNCTION_STEP_UUID']}'` : '';

                if (existingFunctionStep && existingFunctionStep['TEST_CASE_FUNCTION_STEP_UUID']) {
                  let functionStepObject = {
                    FUNCTION_STEP_UUID: generatedFunctionStepId,
                    FUNCTION_UUID: generatedFunctionId,
                    FUNCTION_STEP_NAME: existingFunctionStep['TEST_CASE_FUNCTION_STEP_NAME'],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: existingFunctionStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                    CURRENT_PAGE_CONTEXT: existingFunctionStep['CURRENT_PAGE_CONTEXT'],
                    FUNCTION_STEP_TYPE: existingFunctionStep['TEST_CASE_FUNCTION_STEP_TYPE'],
                    NEXT_PAGE_CONTEXT: existingFunctionStep['NEXT_PAGE_CONTEXT'],
                    IS_UI_ELEMENT_GROUP_STEP: existingFunctionStep['IS_UI_ELEMENT_GROUP_STEP'],
                    IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT: await checkUIElementValueExist(existingFunctionStep),
                    IS_PURE_NAVIGATION_STEP: existingFunctionStep['IS_PURE_NAVIGATION_STEP'],
                    IS_API_ATTRIBUTE_VALUE_PRESENT: await checkApiAttributeValueExist(existingFunctionStep),
                    API_UUID: existingFunctionStep['API_UUID'],
                    VIEW_UUID: existingFunctionStep['VIEW_UUID'],
                    UI_ELEMENT_GROUP_UUID: existingFunctionStep['UI_ELEMENT_GROUP_UUID'],
                    FUNCTION_STEP_SEQ_ID: count,
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  functionStepList.push(functionStepObject);
                } else {
                  let functionStepObject = {
                    FUNCTION_STEP_UUID: generatedFunctionStepId,
                    FUNCTION_UUID: generatedFunctionId,
                    FUNCTION_STEP_NAME: fsData['FUNCTION_STEP_NAME'],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: fsData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                    CURRENT_PAGE_CONTEXT: fsData['CURRENT_PAGE_CONTEXT'],
                    FUNCTION_STEP_TYPE: fsData['FUNCTION_STEP_TYPE'],
                    NEXT_PAGE_CONTEXT: fsData['NEXT_PAGE_CONTEXT'],
                    IS_UI_ELEMENT_GROUP_STEP: fsData['IS_UI_ELEMENT_GROUP_STEP'],
                    IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT: await checkUIElementValueExist(fsData),
                    IS_PURE_NAVIGATION_STEP: fsData['IS_PURE_NAVIGATION_STEP'],
                    IS_API_ATTRIBUTE_VALUE_PRESENT: await checkApiAttributeValueExist(fsData),
                    API_UUID: fsData['API_UUID'],
                    VIEW_UUID: fsData['VIEW_UUID'],
                    UI_ELEMENT_GROUP_UUID: fsData['UI_ELEMENT_GROUP_UUID'],
                    FUNCTION_STEP_SEQ_ID: count,
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  functionStepList.push(functionStepObject);
                }
                count++;

                // * ---------------------------------------------------------------------------------------------------------------------------------------------

                const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in (${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseFunctionStepAttributeValueQueryData = existingTestCaseFunctionStepId
                  ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input)
                  : [];

                const funcStepAttributeQuery = `SELECT * FROM FUNCTION_STEP_ATTRIBUTE_VALUE WHERE FUNCTION_STEP_UUID IN (${existingFuncStepId})`;
                const funcStepAttributeData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', funcStepAttributeQuery, input);

                for (let fsAttrData of funcStepAttributeData) {
                  let generatedFunctionStepAttributeId = uuid();

                  const existingAttri = testCaseFunctionStepAttributeValueQueryData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID === fsAttrData.STEP_DEFINITION_ATTRIBUTE_UUID);

                  if (existingAttri) {
                    let functionStepAttributeObject = {
                      FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedFunctionStepAttributeId,
                      STEP_DEFINITION_ATTRIBUTE_UUID: existingAttri['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      FUNCTION_STEP_ATTRIBUTE_DATA: existingAttri['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'],
                      FUNCTION_STEP_UUID: generatedFunctionStepId,
                      FUNCTION_UUID: generatedFunctionId,
                      PRE_DEFINED_VALUES_UUID: existingAttri['PRE_DEFINED_VALUES_UUID'],
                      SCOPE_VARIABLE_TYPE: existingAttri['SCOPE_VARIABLE_TYPE'],
                      SCOPE_VARIABLE_UUID: existingAttri['SCOPE_VARIABLE_UUID'],
                      EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: existingAttri['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'],
                      IS_ANY_VALUE_CHANGED: 'Yes'
                    };
                    functionStepAttributeValueList.push(functionStepAttributeObject);
                  } else {
                    let functionStepAttributeObject = {
                      FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedFunctionStepAttributeId,
                      STEP_DEFINITION_ATTRIBUTE_UUID: fsAttrData['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      FUNCTION_STEP_ATTRIBUTE_DATA: fsAttrData['FUNCTION_STEP_ATTRIBUTE_DATA'],
                      FUNCTION_STEP_UUID: generatedFunctionStepId,
                      FUNCTION_UUID: generatedFunctionId,
                      PRE_DEFINED_VALUES_UUID: fsAttrData['PRE_DEFINED_VALUES_UUID'],
                      SCOPE_VARIABLE_TYPE: fsAttrData['SCOPE_VARIABLE_TYPE'],
                      SCOPE_VARIABLE_UUID: fsAttrData['SCOPE_VARIABLE_UUID'],
                      EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: fsAttrData['FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'],
                      IS_ANY_VALUE_CHANGED: 'Yes'
                    };
                    functionStepAttributeValueList.push(functionStepAttributeObject);
                  }
                }

                if (fsData['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
                  // TODO: TCS & FS CHCEK

                  const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
                  let testCaseFunctionUIElementGroupStepQueryData = existingTestCaseFunctionStepId
                    ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input)
                    : [];

                  // TODO: UIEL GRP CHCEK
                  // 3 IF ELSE
                  const funcUiEleGrpStepQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP where FUNCTION_STEP_UUID in (${existingFuncStepId})`;
                  const funcUiEleGrpStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', funcUiEleGrpStepQuery, input);

                  for (let fugs of funcUiEleGrpStepData) {
                    let generatedFunctionUIElementGroupStepId = uuid();

                    const existingTcfugs = testCaseFunctionUIElementGroupStepQueryData.find((tcFugs) => tcFugs.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID === fugs.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID);

                    let existingTcFugsId = existingTcfugs ? `'${fugs['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID']}'` : '';
                    let existingFugsId = `'${fugs['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID']}'`;

                    if (existingTcfugs) {
                      let functionUIElementGroupStepObject = {
                        FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                        FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: existingTcfugs['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: existingTcfugs['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                        CURRENT_PAGE_CONTEXT: existingTcfugs['CURRENT_PAGE_CONTEXT'],
                        FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: existingTcfugs['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
                        FUNCTION_STEP_UUID: generatedFunctionStepId,
                        FUNCTION_UUID: generatedFunctionId,
                        UI_ELEMENT_GROUP_UUID: existingTcfugs['UI_ELEMENT_GROUP_UUID'],
                        UI_ELEMENT_GROUP_STEP_UUID: existingTcfugs['UI_ELEMENT_GROUP_STEP_UUID'],
                        FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: existingTcfugs['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID'],
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      functionUIElementGroupStepList.push(functionUIElementGroupStepObject);
                    } else {
                      let functionUIElementGroupStepObject = {
                        FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                        FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: fugs['FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: fugs['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                        CURRENT_PAGE_CONTEXT: fugs['CURRENT_PAGE_CONTEXT'],
                        FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: fugs['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
                        FUNCTION_STEP_UUID: generatedFunctionStepId,
                        FUNCTION_UUID: generatedFunctionId,
                        UI_ELEMENT_GROUP_UUID: fugs['UI_ELEMENT_GROUP_UUID'],
                        UI_ELEMENT_GROUP_STEP_UUID: fugs['UI_ELEMENT_GROUP_STEP_UUID'],
                        FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: fugs['FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID'],
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      functionUIElementGroupStepList.push(functionUIElementGroupStepObject);
                    }

                    const fugsAttrQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingFugsId})`;
                    const fugsAttrData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fugsAttrQuery, input);

                    const testCaseFunctionUIElementGroupStepAttributeQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTcFugsId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let testCaseFunctionUIElementGroupStepAttributeQueryData = existingTcFugsId
                      ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepAttributeQuery, input)
                      : [];

                    for (let fugsAttr of fugsAttrData) {
                      let functionUIElementGroupStepAttributeValueId = uuid();

                      const existingTcFugsAttri = testCaseFunctionUIElementGroupStepAttributeQueryData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID === fugsAttr.STEP_DEFINITION_ATTRIBUTE_UUID);

                      if (existingTcFugsAttri) {
                        let functionUIElementGroupStepAttributeObject = {
                          FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionUIElementGroupStepAttributeValueId,
                          STEP_DEFINITION_ATTRIBUTE_UUID: existingTcFugsAttri['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: existingTcFugsAttri['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                          FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                          FUNCTION_STEP_UUID: generatedFunctionStepId,
                          FUNCTION_UUID: generatedFunctionId,
                          PRE_DEFINED_VALUES_UUID: existingTcFugsAttri['PRE_DEFINED_VALUES_UUID'],
                          SCOPE_VARIABLE_TYPE: existingTcFugsAttri['SCOPE_VARIABLE_TYPE'],
                          SCOPE_VARIABLE_UUID: existingTcFugsAttri['SCOPE_VARIABLE_UUID'],
                          EXISTING_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: existingTcFugsAttri['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
                          IS_ANY_VALUE_CHANGED: 'Yes'
                        };
                        functionUIElementGroupStepAttributeList.push(functionUIElementGroupStepAttributeObject);
                      } else {
                        let functionUIElementGroupStepAttributeObject = {
                          FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionUIElementGroupStepAttributeValueId,
                          STEP_DEFINITION_ATTRIBUTE_UUID: fugsAttr['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: fugsAttr['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                          FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                          FUNCTION_STEP_UUID: generatedFunctionStepId,
                          FUNCTION_UUID: generatedFunctionId,
                          PRE_DEFINED_VALUES_UUID: fugsAttr['PRE_DEFINED_VALUES_UUID'],
                          SCOPE_VARIABLE_TYPE: fugsAttr['SCOPE_VARIABLE_TYPE'],
                          SCOPE_VARIABLE_UUID: fugsAttr['SCOPE_VARIABLE_UUID'],
                          EXISTING_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: fugsAttr['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
                          IS_ANY_VALUE_CHANGED: 'Yes'
                        };
                        functionUIElementGroupStepAttributeList.push(functionUIElementGroupStepAttributeObject);
                      }
                    }
                  }
                }
                if (fsData['IS_PURE_NAVIGATION_STEP'] && fsData['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
                  // TODO: FS ID
                  const testCaseNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NOT NULL AND FUNCTION_STEP_UUID IS NOT NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                  let testCaseNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationQuery, input);

                  const fViewNavQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP WHERE FUNCTION_STEP_UUID = '${fsData['FUNCTION_STEP_UUID']}' `;
                  let fViewNavData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fViewNavQuery, input);

                  const viewNavQuery = `SELECT * FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID = '${fsData['VIEW_UUID']}'`;
                  let viewNavData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewNavQuery, input);

                  let navigationCount = 1;

                  for (let viewNav of viewNavData) {
                    let functionViewNavigationStepId = uuid();

                    const existingTestCaseViewNav = testCaseNavigationQueryData.find((nav) => nav.VIEW_NAVIGATION_STEP_UUID === viewNav.VIEW_NAVIGATION_STEP_UUID);
                    const existingFViewNav = fViewNavData.find((nav) => nav.VIEW_NAVIGATION_STEP_UUID === viewNav.VIEW_NAVIGATION_STEP_UUID);

                    let existinTestCaseViewNavigationStepId = existingTestCaseViewNav ? `'${existingTestCaseViewNav['TEST_CASE_VIEW_NAVIGATION_STEP_UUID']}'` : '';
                    let existingFViewNavId = existingFViewNav ? `'${existingFViewNav['FUNCTION_VIEW_NAVIGATION_STEP_UUID']}'` : '';
                    let existingViewNavId = viewNav['VIEW_NAVIGATION_STEP_UUID'];

                    if (existinTestCaseViewNavigationStepId) {
                      let testCaseViewNavigationObject = {
                        FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                        VIEW_NAVIGATION_STEP_UUID: existingTestCaseViewNav['VIEW_NAVIGATION_STEP_UUID'],
                        FUNCTION_VIEW_NAVIGATION_STEP_NAME: existingTestCaseViewNav['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: existingTestCaseViewNav['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                        FUNCTION_VIEW_NAVIGATION_STEP_TYPE: existingTestCaseViewNav['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'],
                        FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                        CURRENT_PAGE_CONTEXT: existingTestCaseViewNav['CURRENT_PAGE_CONTEXT'],
                        NEXT_PAGE_CONTEXT: existingTestCaseViewNav['NEXT_PAGE_CONTEXT'],
                        VIEW_UUID: existingTestCaseViewNav['VIEW_UUID'],
                        FUNCTION_UUID: generatedFunctionId,
                        FUNCTION_STEP_UUID: generatedFunctionStepId,
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      functionViewNavigationList.push(testCaseViewNavigationObject);
                    } else if (existingFViewNavId) {
                      let testCaseViewNavigationObject = {
                        FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                        VIEW_NAVIGATION_STEP_UUID: existingFViewNav['VIEW_NAVIGATION_STEP_UUID'],
                        FUNCTION_VIEW_NAVIGATION_STEP_NAME: existingFViewNav['FUNCTION_VIEW_NAVIGATION_STEP_NAME'],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: existingFViewNav['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                        FUNCTION_VIEW_NAVIGATION_STEP_TYPE: existingFViewNav['FUNCTION_VIEW_NAVIGATION_STEP_TYPE'],
                        FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                        CURRENT_PAGE_CONTEXT: existingFViewNav['CURRENT_PAGE_CONTEXT'],
                        NEXT_PAGE_CONTEXT: existingFViewNav['NEXT_PAGE_CONTEXT'],
                        VIEW_UUID: existingFViewNav['VIEW_UUID'],
                        FUNCTION_UUID: generatedFunctionId,
                        FUNCTION_STEP_UUID: generatedFunctionStepId,
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      functionViewNavigationList.push(testCaseViewNavigationObject);
                    } else {
                      let testCaseViewNavigationObject = {
                        FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                        VIEW_NAVIGATION_STEP_UUID: viewNav['VIEW_NAVIGATION_STEP_UUID'],
                        FUNCTION_VIEW_NAVIGATION_STEP_NAME: viewNav['VIEW_NAVIGATION_STEP_NAME'],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: viewNav['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                        FUNCTION_VIEW_NAVIGATION_STEP_TYPE: viewNav['VIEW_NAVIGATION_STEP_TYPE'],
                        FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                        CURRENT_PAGE_CONTEXT: viewNav['CURRENT_PAGE_CONTEXT'],
                        NEXT_PAGE_CONTEXT: viewNav['NEXT_PAGE_CONTEXT'],
                        VIEW_UUID: viewNav['VIEW_UUID'],
                        FUNCTION_UUID: generatedFunctionId,
                        FUNCTION_STEP_UUID: generatedFunctionStepId,
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      functionViewNavigationList.push(testCaseViewNavigationObject);
                    }
                    navigationCount++;

                    const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in (${existinTestCaseViewNavigationStepId})`;
                    let testCaseViewNavigationAttributeQueryData = existinTestCaseViewNavigationStepId
                      ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationAttributeQuery, input)
                      : [];

                    const testCaseFvnAttrQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where FUNCTION_VIEW_NAVIGATION_STEP_UUID in (${existingFViewNavId})`;
                    let testCaseFvnAttrData = existingFViewNavId ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFvnAttrQuery, input) : [];

                    const vnsAttrQuery = `SELECT * FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where VIEW_NAVIGATION_STEP_UUID in (${existingViewNavId})`;
                    let vnsAttrData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', vnsAttrQuery, input);

                    for (let vnsAttr of vnsAttrData) {
                      let testCaseViewNavigationAttributeId = uuid();

                      const existingTcvnsAttri = testCaseViewNavigationAttributeQueryData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID === vnsAttr.STEP_DEFINITION_ATTRIBUTE_UUID);

                      const existingFvnsAttri = testCaseFvnAttrData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID === vnsAttr.STEP_DEFINITION_ATTRIBUTE_UUID);

                      if (existingTcvnsAttri) {
                        let testCaseViewNavigationAttributeObject = {
                          FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                          STEP_DEFINITION_ATTRIBUTE_UUID: existingTcvnsAttri['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: existingTcvnsAttri['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                          FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                          VIEW_UUID: existingTcvnsAttri['VIEW_UUID'],
                          PRE_DEFINED_VALUES_UUID: existingTcvnsAttri['PRE_DEFINED_VALUES_UUID'],
                          FUNCTION_UUID: existingTcvnsAttri['FUNCTION_UUID'],
                          SCOPE_VARIABLE_TYPE: existingTcvnsAttri['SCOPE_VARIABLE_TYPE'],
                          SCOPE_VARIABLE_UUID: existingTcvnsAttri['SCOPE_VARIABLE_UUID'],
                          EXISTING_FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: existingTcvnsAttri['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'],
                          IS_ANY_VALUE_CHANGED: 'Yes'
                        };
                        functionViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                      } else if (existingFvnsAttri) {
                        let testCaseViewNavigationAttributeObject = {
                          FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                          STEP_DEFINITION_ATTRIBUTE_UUID: existingFvnsAttri['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: existingFvnsAttri['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                          FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                          VIEW_UUID: existingFvnsAttri['VIEW_UUID'],
                          PRE_DEFINED_VALUES_UUID: existingFvnsAttri['PRE_DEFINED_VALUES_UUID'],
                          FUNCTION_UUID: existingFvnsAttri['FUNCTION_UUID'],
                          SCOPE_VARIABLE_TYPE: existingFvnsAttri['SCOPE_VARIABLE_TYPE'],
                          SCOPE_VARIABLE_UUID: existingFvnsAttri['SCOPE_VARIABLE_UUID'],
                          EXISTING_FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: existingFvnsAttri['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'],
                          IS_ANY_VALUE_CHANGED: 'Yes'
                        };
                        functionViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                      } else {
                        let testCaseViewNavigationAttributeObject = {
                          FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                          STEP_DEFINITION_ATTRIBUTE_UUID: vnsAttr['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: vnsAttr['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                          FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                          VIEW_UUID: vnsAttr['VIEW_UUID'],
                          PRE_DEFINED_VALUES_UUID: vnsAttr['PRE_DEFINED_VALUES_UUID'],
                          FUNCTION_UUID: vnsAttr['FUNCTION_UUID'],
                          EXISTING_FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: vnsAttr['VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'],
                          IS_ANY_VALUE_CHANGED: 'Yes'
                        };
                        functionViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                      }
                    }
                  }
                }
              }
            }
          } else if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes' && data['IS_FUNCTION_STEP'] == 'No') {
            let generatedFunctionStepId = uuid();
            let functionStepObject = {
              FUNCTION_STEP_UUID: generatedFunctionStepId,
              FUNCTION_UUID: generatedFunctionId,
              FUNCTION_STEP_NAME: data['TEST_CASE_STEP_NAME'],
              STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
              CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
              FUNCTION_STEP_TYPE: data['TEST_CASE_STEP_TYPE'] && data['TEST_CASE_STEP_TYPE'] == 'Data' ? 'Given' : data['TEST_CASE_STEP_TYPE'],
              NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
              IS_UI_ELEMENT_GROUP_STEP: data['IS_UI_ELEMENT_GROUP_STEP'],
              IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT: await checkUIElementValueExist(data),
              IS_PURE_NAVIGATION_STEP: data['IS_PURE_NAVIGATION_STEP'],
              IS_API_ATTRIBUTE_VALUE_PRESENT: await checkApiAttributeValueExist(data),
              API_UUID: data['API_UUID'],
              UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID'],
              VIEW_UUID: data['VIEW_UUID'],
              FUNCTION_STEP_SEQ_ID: count
            };
            count++;
            functionStepList.push(functionStepObject);

            const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepAttributeValueQuery, input);

            for (let attribute of testCaseStepAttributeValueQueryData) {
              let generatedFunctionStepAttributeId = uuid();
              let functionStepAttributeObject = {
                FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedFunctionStepAttributeId,
                STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                FUNCTION_STEP_ATTRIBUTE_DATA: attribute['TEST_CASE_STEP_ATTRIBUTE_DATA'],
                FUNCTION_UUID: generatedFunctionId,
                FUNCTION_STEP_UUID: generatedFunctionStepId,
                PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
                SCOPE_VARIABLE_TYPE: attribute['SCOPE_VARIABLE_TYPE'],
                SCOPE_VARIABLE_UUID: attribute['SCOPE_VARIABLE_UUID'],
                EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']
              };
              functionStepAttributeValueList.push(functionStepAttributeObject);
            }

            const testCaseUIElementStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
            let testCaseUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementStepQuery, input);

            const uiElStepQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP WHERE UI_ELEMENT_GROUP_UUID = '${data['UI_ELEMENT_GROUP_UUID']}'`;
            const uiElStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElStepQuery, input);

            for (let uiElStep of uiElStepData) {
              let generatedFunctionUIElementGroupStepId = uuid();

              const existingTestCaseUIElementGroupStep = testCaseUIElementStepQueryData.find((tcUiElStep) => tcUiElStep.UI_ELEMENT_GROUP_STEP_UUID == uiElStep.UI_ELEMENT_GROUP_STEP_UUID);

              let existingTestCaseUIElementGroupStepId = `'${existingTestCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID']}'`;
              let existingUIElementGroupStepId = `'${uiElStep['UI_ELEMENT_GROUP_STEP_UUID']}'`;

              if (existingTestCaseUIElementGroupStep) {
                let functionUIElementGroupStepObject = {
                  FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                  FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: existingTestCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: existingTestCaseUIElementGroupStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  CURRENT_PAGE_CONTEXT: existingTestCaseUIElementGroupStep['CURRENT_PAGE_CONTEXT'],
                  FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: existingTestCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE'],
                  FUNCTION_STEP_UUID: generatedFunctionStepId,
                  FUNCTION_UUID: generatedFunctionId,
                  UI_ELEMENT_GROUP_UUID: existingTestCaseUIElementGroupStep['UI_ELEMENT_GROUP_UUID'],
                  UI_ELEMENT_GROUP_STEP_UUID: existingTestCaseUIElementGroupStep['UI_ELEMENT_GROUP_STEP_UUID'],
                  FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: existingTestCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                functionUIElementGroupStepList.push(functionUIElementGroupStepObject);
              } else {
                let functionUIElementGroupStepObject = {
                  FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                  FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: uiElStep['UI_ELEMENT_GROUP_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  CURRENT_PAGE_CONTEXT: uiElStep['CURRENT_PAGE_CONTEXT'],
                  FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: uiElStep['STEP_TYPE'],
                  FUNCTION_STEP_UUID: generatedFunctionStepId,
                  FUNCTION_UUID: generatedFunctionId,
                  UI_ELEMENT_GROUP_UUID: uiElStep['UI_ELEMENT_GROUP_UUID'],
                  UI_ELEMENT_GROUP_STEP_UUID: uiElStep['UI_ELEMENT_GROUP_STEP_UUID'],
                  FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: uiElStep['UI_ELEMENT_GROUP_STEP_SEQ_ID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                functionUIElementGroupStepList.push(functionUIElementGroupStepObject);
              }

              const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input);

              const uiElStepAttrQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where UI_ELEMENT_GROUP_STEP_UUID in(${existingUIElementGroupStepId})`;
              let uiElStepAttrData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElStepAttrQuery, input);

              for (let uiElStepAttr of uiElStepAttrData) {
                let functionUIElementGroupStepAttributeValueId = uuid();

                const existingTcuiElAttr = testCaseFunctionStepAttributeValueQueryData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID === uiElStepAttr.STEP_DEFINITION_ATTRIBUTE_UUID);

                if (existingTcuiElAttr) {
                  let functionUIElementGroupStepAttributeObject = {
                    FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionUIElementGroupStepAttributeValueId,
                    STEP_DEFINITION_ATTRIBUTE_UUID: existingTcuiElAttr['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: existingTcuiElAttr['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                    FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                    FUNCTION_STEP_UUID: generatedFunctionStepId,
                    FUNCTION_UUID: generatedFunctionId,
                    PRE_DEFINED_VALUES_UUID: existingTcuiElAttr['PRE_DEFINED_VALUES_UUID'],
                    SCOPE_VARIABLE_TYPE: existingTcuiElAttr['SCOPE_VARIABLE_TYPE'],
                    SCOPE_VARIABLE_UUID: existingTcuiElAttr['SCOPE_VARIABLE_UUID'],
                    EXISTING_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: existingTcuiElAttr['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  functionUIElementGroupStepAttributeList.push(functionUIElementGroupStepAttributeObject);
                } else {
                  let functionUIElementGroupStepAttributeObject = {
                    FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionUIElementGroupStepAttributeValueId,
                    STEP_DEFINITION_ATTRIBUTE_UUID: uiElStepAttr['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: uiElStepAttr['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                    FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                    FUNCTION_STEP_UUID: generatedFunctionStepId,
                    FUNCTION_UUID: generatedFunctionId,
                    PRE_DEFINED_VALUES_UUID: uiElStepAttr['PRE_DEFINED_VALUES_UUID'],
                    EXISTING_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: uiElStepAttr['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  functionUIElementGroupStepAttributeList.push(functionUIElementGroupStepAttributeObject);
                }
              }
            }
          }
        }

        if (['First Test Case Step', 'Intermediate Test Case Step'].includes(input['DESTINATION_STEP_POSITION'])) {
          reorderFunctionStep(count, functionStepDetailsWithSeq['functionStepQueryData']);
        }

        // ! SUPPORT FOR OLD DATA RELATED TO SCOPE
      } else if (input['TEST_SET_TYPE'] == 'Page View Navigation') {
        // Inserting test case steps to destination Page View
        let navigationStepWithSequence = await getSequinceBasedOnPositionForNavigation();
        let count = navigationStepWithSequence['seqId'];
        const destinationViewId = input['DESTINATION_VIEW'];

        for (let data of testCaseStepQueryData) {
          let existingTestCaseStepId = "'" + data['TEST_CASE_STEP_UUID'] + "'";

          if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'No' && data['IS_FUNCTION_STEP'] == 'No') {
            let viewNavStepId = uuid();

            let viewNavStepObj = {
              VIEW_NAVIGATION_STEP_UUID: viewNavStepId,
              VIEW_NAVIGATION_STEP_NAME: data['TEST_CASE_STEP_NAME'],
              STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
              VIEW_NAVIGATION_STEP_TYPE: data['TEST_CASE_STEP_TYPE'] && data['TEST_CASE_STEP_TYPE'] == 'Data' ? 'Given' : data['TEST_CASE_STEP_TYPE'],
              VIEW_NAVIGATION_STEP_SEQ_ID: count,
              CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
              NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
              VIEW_UUID: destinationViewId,
              FUNCTIONAL_AREA_UUID: data['FUNCTIONAL_AREA_UUID'],
              IS_ANY_VALUE_CHANGED: 'Yes'
            };
            count++;
            viewNavigationStepList.push(viewNavStepObj);

            const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepAttributeValueQuery, input);

            for (let attribute of testCaseStepAttributeValueQueryData) {
              let viewNavStepAttrId = uuid();

              let viewNavStepAttrObject = {
                VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId,
                STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: attribute['TEST_CASE_STEP_ATTRIBUTE_DATA'],
                VIEW_NAVIGATION_STEP_UUID: viewNavStepId,
                VIEW_UUID: destinationViewId,
                FUNCTIONAL_AREA_UUID: attribute['FUNCTIONAL_AREA_UUID'],
                PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
                EXISTING_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'],
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              viewNavigationStepAttributeList.push(viewNavStepAttrObject);
            }

            if (data['IS_PURE_NAVIGATION_STEP'] && data['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
              const testCaseNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NULL AND FUNCTION_STEP_UUID IS NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
              let testCaseNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationQuery, input);

              let viewNavQuery = `SELECT * FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID = '${data['VIEW_UUID']}'`;
              let viewNavData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewNavQuery, input);

              for (let viewNav of viewNavData) {
                const overridenViewNav = testCaseNavigationQueryData.find((nav) => nav.VIEW_NAVIGATION_STEP_UUID === viewNav.VIEW_NAVIGATION_STEP_UUID);

                let viewNavStepId2 = uuid();
                let navStepUUID = `'${viewNav['VIEW_NAVIGATION_STEP_UUID']}'`;
                let testNavStepUUID = overridenViewNav ? `'${overridenViewNav.TEST_CASE_VIEW_NAVIGATION_STEP_UUID}'` : '';

                if (overridenViewNav && overridenViewNav.TEST_CASE_VIEW_NAVIGATION_STEP_UUID) {
                  let viewNavObject2 = {
                    VIEW_NAVIGATION_STEP_UUID: viewNavStepId2,
                    VIEW_NAVIGATION_STEP_NAME: overridenViewNav['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: overridenViewNav['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                    VIEW_NAVIGATION_STEP_TYPE: overridenViewNav['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'],
                    VIEW_NAVIGATION_STEP_SEQ_ID: count,
                    CURRENT_PAGE_CONTEXT: overridenViewNav['CURRENT_PAGE_CONTEXT'],
                    NEXT_PAGE_CONTEXT: overridenViewNav['NEXT_PAGE_CONTEXT'],
                    VIEW_UUID: destinationViewId,
                    FUNCTIONAL_AREA_UUID: overridenViewNav['FUNCTIONAL_AREA_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  viewNavigationStepList.push(viewNavObject2);
                } else {
                  let viewNavObject2 = {
                    VIEW_NAVIGATION_STEP_UUID: viewNavStepId2,
                    VIEW_NAVIGATION_STEP_NAME: viewNav['VIEW_NAVIGATION_STEP_NAME'],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: viewNav['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                    VIEW_NAVIGATION_STEP_TYPE: viewNav['VIEW_NAVIGATION_STEP_TYPE'],
                    VIEW_NAVIGATION_STEP_SEQ_ID: count,
                    CURRENT_PAGE_CONTEXT: viewNav['CURRENT_PAGE_CONTEXT'],
                    NEXT_PAGE_CONTEXT: viewNav['NEXT_PAGE_CONTEXT'],
                    VIEW_UUID: destinationViewId,
                    FUNCTIONAL_AREA_UUID: viewNav['FUNCTIONAL_AREA_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  viewNavigationStepList.push(viewNavObject2);
                }
                count++;

                const viewNavAttributeQuery = `SELECT * FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE VIEW_NAVIGATION_STEP_UUID in (${navStepUUID}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let viewNavAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewNavAttributeQuery, input);

                const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${testNavStepUUID}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseViewNavigationAttributeQueryData = testNavStepUUID ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationAttributeQuery, input) : [];

                for (let viewNavigationAttribute of viewNavAttributeQueryData) {
                  let viewNavAttriId2 = uuid();

                  const existingAttri = testCaseViewNavigationAttributeQueryData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID === viewNavigationAttribute.STEP_DEFINITION_ATTRIBUTE_UUID);

                  if (existingAttri) {
                    let viewNavAttriObject2 = {
                      VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavAttriId2,
                      STEP_DEFINITION_ATTRIBUTE_UUID: existingAttri['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: existingAttri['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                      VIEW_NAVIGATION_STEP_UUID: viewNavStepId2,
                      VIEW_UUID: destinationViewId,
                      FUNCTIONAL_AREA_UUID: existingAttri['FUNCTIONAL_AREA_UUID'],
                      PRE_DEFINED_VALUES_UUID: existingAttri['PRE_DEFINED_VALUES_UUID'],
                      IS_ANY_VALUE_CHANGED: 'Yes'
                    };
                    viewNavigationStepAttributeList.push(viewNavAttriObject2);
                  } else {
                    let viewNavAttriObject2 = {
                      VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavAttriId2,
                      STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                      VIEW_NAVIGATION_STEP_UUID: viewNavStepId2,
                      VIEW_UUID: destinationViewId,
                      FUNCTIONAL_AREA_UUID: viewNavigationAttribute['FUNCTIONAL_AREA_UUID'],
                      PRE_DEFINED_VALUES_UUID: viewNavigationAttribute['PRE_DEFINED_VALUES_UUID'],
                      IS_ANY_VALUE_CHANGED: 'Yes'
                    };
                    viewNavigationStepAttributeList.push(viewNavAttriObject2);
                  }
                }
              }
            }
          } else if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'No' && data['IS_FUNCTION_STEP'] == 'Yes') {
            const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${
              existingTestCaseStepId ? existingTestCaseStepId : `''`
            }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
            let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);

            const functionStepQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID = '${data['FUNCTION_UUID']}'`;
            const functionStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionStepQuery, input);

            if (functionStepData && functionStepData.length) {
              for (let fsData of functionStepData) {
                let viewNavStepId3 = uuid();

                const existingFunctionStep = testCaseFunctionStepData.find((step) => step.FUNCTION_STEP_UUID === fsData['FUNCTION_STEP_UUID']);

                let existingFuncStepId = `'${fsData['FUNCTION_STEP_UUID']}'`;
                let existingTestCaseFunctionStepId = existingFunctionStep ? `'${existingFunctionStep['TEST_CASE_FUNCTION_STEP_UUID']}'` : '';

                if (existingFunctionStep && existingFunctionStep['TEST_CASE_FUNCTION_STEP_UUID']) {
                  let viewNavStepObj3 = {
                    VIEW_NAVIGATION_STEP_UUID: viewNavStepId3,
                    VIEW_UUID: destinationViewId,
                    VIEW_NAVIGATION_STEP_NAME: existingFunctionStep['TEST_CASE_FUNCTION_STEP_NAME'],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: existingFunctionStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                    CURRENT_PAGE_CONTEXT: existingFunctionStep['CURRENT_PAGE_CONTEXT'],
                    VIEW_NAVIGATION_STEP_TYPE: existingFunctionStep['TEST_CASE_FUNCTION_STEP_TYPE'],
                    NEXT_PAGE_CONTEXT: existingFunctionStep['NEXT_PAGE_CONTEXT'],
                    VIEW_NAVIGATION_STEP_SEQ_ID: count,
                    FUNCTIONAL_AREA_UUID: existingFunctionStep['FUNCTIONAL_AREA_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  viewNavigationStepList.push(viewNavStepObj3);
                } else {
                  let viewNavStepObj3 = {
                    VIEW_NAVIGATION_STEP_UUID: viewNavStepId3,
                    VIEW_UUID: destinationViewId,
                    VIEW_NAVIGATION_STEP_NAME: fsData['FUNCTION_STEP_NAME'],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: fsData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                    CURRENT_PAGE_CONTEXT: fsData['CURRENT_PAGE_CONTEXT'],
                    VIEW_NAVIGATION_STEP_TYPE: fsData['FUNCTION_STEP_TYPE'],
                    NEXT_PAGE_CONTEXT: fsData['NEXT_PAGE_CONTEXT'],
                    VIEW_NAVIGATION_STEP_SEQ_ID: count,
                    FUNCTIONAL_AREA_UUID: fsData['FUNCTIONAL_AREA_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  viewNavigationStepList.push(viewNavStepObj3);
                }
                count++;

                const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in (${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseFunctionStepAttributeValueQueryData = existingTestCaseFunctionStepId
                  ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input)
                  : [];

                const funcStepAttributeQuery = `SELECT * FROM FUNCTION_STEP_ATTRIBUTE_VALUE WHERE FUNCTION_STEP_UUID IN (${existingFuncStepId})`;
                const funcStepAttributeData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', funcStepAttributeQuery, input);

                for (let fsAttrData of funcStepAttributeData) {
                  let viewNavStepAttrId3 = uuid();

                  const existingAttri = testCaseFunctionStepAttributeValueQueryData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID === viewNavigationAttribute.STEP_DEFINITION_ATTRIBUTE_UUID);

                  if (existingAttri) {
                    let viewNavStepAttrObject3 = {
                      VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId3,
                      STEP_DEFINITION_ATTRIBUTE_UUID: existingAttri['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: existingAttri['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'],
                      VIEW_NAVIGATION_STEP_UUID: viewNavStepId3,
                      VIEW_UUID: destinationViewId,
                      PRE_DEFINED_VALUES_UUID: existingAttri['PRE_DEFINED_VALUES_UUID'],
                      FUNCTIONAL_AREA_UUID: existingAttri['FUNCTIONAL_AREA_UUID'],
                      IS_ANY_VALUE_CHANGED: 'Yes'
                    };
                    viewNavigationStepAttributeList.push(viewNavStepAttrObject3);
                  } else {
                    let viewNavStepAttrObject3 = {
                      VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId3,
                      STEP_DEFINITION_ATTRIBUTE_UUID: fsAttrData['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: fsAttrData['FUNCTION_STEP_ATTRIBUTE_DATA'],
                      VIEW_NAVIGATION_STEP_UUID: viewNavStepId3,
                      VIEW_UUID: destinationViewId,
                      PRE_DEFINED_VALUES_UUID: fsAttrData['PRE_DEFINED_VALUES_UUID'],
                      FUNCTIONAL_AREA_UUID: fsAttrData['FUNCTIONAL_AREA_UUID'],
                      IS_ANY_VALUE_CHANGED: 'Yes'
                    };
                    viewNavigationStepAttributeList.push(viewNavStepAttrObject3);
                  }
                }

                if (fsData['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
                    // WHERE CLAUSE
                  const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
                  let testCaseFunctionUIElementGroupStepQueryData = existingTestCaseFunctionStepId
                    ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input)
                    : [];

                  const funcUiEleGrpStepQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP where FUNCTION_STEP_UUID in (${existingFuncStepId})`;
                  const funcUiEleGrpStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', funcUiEleGrpStepQuery, input);
                //   TODO: 3 LAYER
                
                //   
                
                for (let fugs of funcUiEleGrpStepData) {
                    let viewNavStepId4 = uuid();
                    
                    //   TODO: 3 LAYER UI_EL_FILTER  FSTEP
                    const existingTcfugs = testCaseFunctionUIElementGroupStepQueryData.find((tcFugs) => tcFugs.UI_ELEMENT_GROUP_STEP_UUID === fugs.FUNCTION_UI_ELEMENT_GROUP_STEP_UUID &&  tcFugs.FUNCTION_STEP_UUID === fugs.FUNCTION_STEP_UUID);

                    let existingTcFugsId = existingTcfugs ? `'${fugs['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID']}'` : '';
                    let existingFugsId = `'${fugs['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID']}'`;

                    if (existingTcfugs) {
                      let viewNavStepObj4 = {
                        VIEW_NAVIGATION_STEP_UUID: viewNavStepId4,
                        VIEW_NAVIGATION_STEP_NAME: existingTcfugs['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: existingTcfugs['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                        CURRENT_PAGE_CONTEXT: existingTcfugs['CURRENT_PAGE_CONTEXT'],
                        VIEW_NAVIGATION_STEP_TYPE: existingTcfugs['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
                        VIEW_NAVIGATION_STEP_SEQ_ID: count,
                        NEXT_PAGE_CONTEXT: existingTcfugs['NEXT_PAGE_CONTEXT'],
                        VIEW_UUID: destinationViewId,
                        FUNCTIONAL_AREA_UUID: existingTcfugs['FUNCTIONAL_AREA_UUID'],
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      viewNavigationStepList.push(viewNavStepObj4);
                    } else {
                      let viewNavStepObj4 = {
                        VIEW_NAVIGATION_STEP_UUID: viewNavStepId4,
                        VIEW_NAVIGATION_STEP_NAME: fugs['FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: fugs['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                        CURRENT_PAGE_CONTEXT: fugs['CURRENT_PAGE_CONTEXT'],
                        VIEW_NAVIGATION_STEP_TYPE: fugs['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
                        VIEW_NAVIGATION_STEP_SEQ_ID: count,
                        NEXT_PAGE_CONTEXT: fugs['NEXT_PAGE_CONTEXT'],
                        VIEW_UUID: destinationViewId,
                        FUNCTIONAL_AREA_UUID: fugs['FUNCTIONAL_AREA_UUID'],
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      viewNavigationStepList.push(viewNavStepObj4);
                    }
                    count++;

                    const fugsAttrQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingFugsId})`;
                    const fugsAttrData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fugsAttrQuery, input);

                    const testCaseFunctionUIElementGroupStepAttributeQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTcFugsId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let testCaseFunctionUIElementGroupStepAttributeQueryData = existingTcFugsId
                      ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepAttributeQuery, input)
                      : [];

                    for (let fugsAttr of fugsAttrData) {
                      let viewNavStepAttrId4 = uuid();

                      const existingTcFugsAttri = testCaseFunctionUIElementGroupStepAttributeQueryData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID === fugsAttr.STEP_DEFINITION_ATTRIBUTE_UUID);

                      if (existingTcFugsAttri) {
                        let viewNavStepAttrObject4 = {
                          VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId4,
                          STEP_DEFINITION_ATTRIBUTE_UUID: existingTcFugsAttri['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: existingTcFugsAttri['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                          VIEW_NAVIGATION_STEP_UUID: viewNavStepId4,
                          VIEW_UUID: destinationViewId,
                          FUNCTIONAL_AREA_UUID: existingTcFugsAttri['FUNCTIONAL_AREA_UUID'],
                          PRE_DEFINED_VALUES_UUID: existingTcFugsAttri['PRE_DEFINED_VALUES_UUID'],
                          IS_ANY_VALUE_CHANGED: 'Yes'
                        };
                        viewNavigationStepAttributeList.push(viewNavStepAttrObject4);
                      } else {
                        let viewNavStepAttrObject4 = {
                          FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId4,
                          STEP_DEFINITION_ATTRIBUTE_UUID: fugsAttr['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: fugsAttr['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                          VIEW_NAVIGATION_STEP_UUID: viewNavStepId4,
                          VIEW_UUID: destinationViewId,
                          FUNCTIONAL_AREA_UUID: fugsAttr['FUNCTIONAL_AREA_UUID'],
                          PRE_DEFINED_VALUES_UUID: fugsAttr['PRE_DEFINED_VALUES_UUID'],
                          IS_ANY_VALUE_CHANGED: 'Yes'
                        };
                        viewNavigationStepAttributeList.push(viewNavStepAttrObject4);
                      }
                    }
                  }
                }
                if (fsData['IS_PURE_NAVIGATION_STEP'] && fsData['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
                  const testCaseNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NOT NULL AND FUNCTION_STEP_UUID IS NOT NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                  let testCaseNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseNavigationQuery, input);

                  const fViewNavQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP WHERE FUNCTION_STEP_UUID = '${fsData['FUNCTION_STEP_UUID']}' `;
                  let fViewNavData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fViewNavQuery, input);

                  const viewNavQuery = `SELECT * FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID = '${fsData['VIEW_UUID']}'`;
                  let viewNavData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewNavQuery, input);

                  for (let viewNav of viewNavData) {
                    let viewNavStepId5 = uuid();
// FILTER
                    const existingTestCaseViewNav = testCaseNavigationQueryData.find((nav) => nav.VIEW_NAVIGATION_STEP_UUID === viewNav.VIEW_NAVIGATION_STEP_UUID);
                    const existingFViewNav = fViewNavData.find((nav) => nav.VIEW_NAVIGATION_STEP_UUID === viewNav.VIEW_NAVIGATION_STEP_UUID);

                    let existinTestCaseViewNavigationStepId = existingTestCaseViewNav ? `'${existingTestCaseViewNav['TEST_CASE_VIEW_NAVIGATION_STEP_UUID']}'` : '';
                    let existingFViewNavId = existingFViewNav ? `'${existingFViewNav['FUNCTION_VIEW_NAVIGATION_STEP_UUID']}'` : '';
                    let existingViewNavId = viewNav['VIEW_NAVIGATION_STEP_UUID'];

                    if (existinTestCaseViewNavigationStepId) {
                      let viewNavStepObj5 = {
                        VIEW_NAVIGATION_STEP_UUID: viewNavStepId5,
                        VIEW_NAVIGATION_STEP_NAME: existingTestCaseViewNav['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: existingTestCaseViewNav['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                        VIEW_NAVIGATION_STEP_TYPE: existingTestCaseViewNav['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'],
                        VIEW_NAVIGATION_STEP_SEQ_ID: count,
                        CURRENT_PAGE_CONTEXT: existingTestCaseViewNav['CURRENT_PAGE_CONTEXT'],
                        NEXT_PAGE_CONTEXT: existingTestCaseViewNav['NEXT_PAGE_CONTEXT'],
                        VIEW_UUID: destinationViewId,
                        FUNCTIONAL_AREA_UUID: existingTestCaseViewNav['FUNCTIONAL_AREA_UUID'],
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      viewNavigationStepList.push(viewNavStepObj5);
                    } else if (existingFViewNavId) {
                      let viewNavStepObj5 = {
                        VIEW_NAVIGATION_STEP_UUID: viewNavStepId5,
                        VIEW_NAVIGATION_STEP_NAME: existingFViewNav['FUNCTION_VIEW_NAVIGATION_STEP_NAME'],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: existingFViewNav['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                        VIEW_NAVIGATION_STEP_TYPE: existingFViewNav['FUNCTION_VIEW_NAVIGATION_STEP_TYPE'],
                        VIEW_NAVIGATION_STEP_SEQ_ID: count,
                        CURRENT_PAGE_CONTEXT: existingFViewNav['CURRENT_PAGE_CONTEXT'],
                        NEXT_PAGE_CONTEXT: existingFViewNav['NEXT_PAGE_CONTEXT'],
                        VIEW_UUID: destinationViewId,
                        FUNCTIONAL_AREA_UUID: existingFViewNav['FUNCTIONAL_AREA_UUID'],
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      viewNavigationStepList.push(viewNavStepObj5);
                    } else {
                      let viewNavStepObj5 = {
                        VIEW_NAVIGATION_STEP_UUID: viewNavStepId5,
                        VIEW_NAVIGATION_STEP_NAME: viewNav['VIEW_NAVIGATION_STEP_NAME'],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: viewNav['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                        VIEW_NAVIGATION_STEP_TYPE: viewNav['VIEW_NAVIGATION_STEP_TYPE'],
                        VIEW_NAVIGATION_STEP_SEQ_ID: count,
                        CURRENT_PAGE_CONTEXT: viewNav['CURRENT_PAGE_CONTEXT'],
                        NEXT_PAGE_CONTEXT: viewNav['NEXT_PAGE_CONTEXT'],
                        VIEW_UUID: destinationViewId,
                        FUNCTIONAL_AREA_UUID: viewNav['FUNCTIONAL_AREA_UUID'],
                        IS_ANY_VALUE_CHANGED: 'Yes'
                      };
                      viewNavigationStepList.push(viewNavStepObj5);
                    }
                    count++;

                    const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in (${existinTestCaseViewNavigationStepId})`;
                    let testCaseViewNavigationAttributeQueryData = existinTestCaseViewNavigationStepId
                      ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationAttributeQuery, input)
                      : [];

                    const testCaseFvnAttrQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where FUNCTION_VIEW_NAVIGATION_STEP_UUID in (${existingFViewNavId})`;
                    let testCaseFvnAttrData = existingFViewNavId ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFvnAttrQuery, input) : [];

                    const vnsAttrQuery = `SELECT * FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where VIEW_NAVIGATION_STEP_UUID in (${existingViewNavId})`;
                    let vnsAttrData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', vnsAttrQuery, input);

                    for (let vnsAttr of vnsAttrData) {
                      let viewNavStepAttrId5 = uuid();

                      const existingTcvnsAttri = testCaseViewNavigationAttributeQueryData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID === vnsAttr.STEP_DEFINITION_ATTRIBUTE_UUID);

                      const existingFvnsAttri = testCaseFvnAttrData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID === vnsAttr.STEP_DEFINITION_ATTRIBUTE_UUID);

                      if (existingTcvnsAttri) {
                        let viewNavStepAttrObject5 = {
                          VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId5,
                          STEP_DEFINITION_ATTRIBUTE_UUID: existingTcvnsAttri['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: existingTcvnsAttri['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                          VIEW_NAVIGATION_STEP_UUID: viewNavStepId5,
                          VIEW_UUID: destinationViewId,
                          FUNCTIONAL_AREA_UUID: existingTcvnsAttri['FUNCTIONAL_AREA_UUID'],
                          PRE_DEFINED_VALUES_UUID: existingTcvnsAttri['PRE_DEFINED_VALUES_UUID'],
                          IS_ANY_VALUE_CHANGED: 'Yes'
                        };
                        viewNavigationStepAttributeList.push(viewNavStepAttrObject5);
                      } else if (existingFvnsAttri) {
                        let viewNavStepAttrObject5 = {
                          VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId5,
                          STEP_DEFINITION_ATTRIBUTE_UUID: existingFvnsAttri['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: existingFvnsAttri['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                          VIEW_NAVIGATION_STEP_UUID: viewNavStepId5,
                          VIEW_UUID: destinationViewId,
                          FUNCTIONAL_AREA_UUID: existingFvnsAttri['FUNCTIONAL_AREA_UUID'],
                          PRE_DEFINED_VALUES_UUID: existingFvnsAttri['PRE_DEFINED_VALUES_UUID'],
                          IS_ANY_VALUE_CHANGED: 'Yes'
                        };
                        viewNavigationStepAttributeList.push(viewNavStepAttrObject5);
                      } else {
                        let viewNavStepAttrObject5 = {
                          VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId5,
                          STEP_DEFINITION_ATTRIBUTE_UUID: vnsAttr['STEP_DEFINITION_ATTRIBUTE_UUID'],
                          VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: vnsAttr['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                          VIEW_NAVIGATION_STEP_UUID: viewNavStepId5,
                          VIEW_UUID: destinationViewId,
                          FUNCTIONAL_AREA_UUID: vnsAttr['FUNCTIONAL_AREA_UUID'],
                          PRE_DEFINED_VALUES_UUID: vnsAttr['PRE_DEFINED_VALUES_UUID'],
                          IS_ANY_VALUE_CHANGED: 'Yes'
                        };
                        viewNavigationStepAttributeList.push(viewNavStepAttrObject5);
                      }
                    }
                  }
                }
              }
            }
          } else if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes' && data['IS_FUNCTION_STEP'] == 'No') {
            // let viewNavStepId6 = uuid();
            // let viewNavStepObj6 = {
            //   VIEW_NAVIGATION_STEP_UUID: viewNavStepId6,
            //   VIEW_NAVIGATION_STEP_NAME: data['TEST_CASE_STEP_NAME'],
            //   STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
            //   CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
            //   VIEW_NAVIGATION_STEP_TYPE: data['TEST_CASE_STEP_TYPE'] && data['TEST_CASE_STEP_TYPE'] == 'Data' ? 'Given' : data['TEST_CASE_STEP_TYPE'],
            //   NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
            //   VIEW_NAVIGATION_STEP_SEQ_ID: count,
            //   VIEW_UUID: destinationViewId,
            //   FUNCTIONAL_AREA_UUID: data['FUNCTIONAL_AREA_UUID'],
            //   IS_ANY_VALUE_CHANGED: 'Yes'
            // };
            // count++;
            // viewNavigationStepList.push(viewNavStepObj6);

            // const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            // let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepAttributeValueQuery, input);

            // for (let attribute of testCaseStepAttributeValueQueryData) {
            //   let viewNavStepAttrId6 = uuid();

            //   let viewNavStepAttrObject6 = {
            //     VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId6,
            //     STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
            //     VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: attribute['TEST_CASE_STEP_ATTRIBUTE_DATA'],
            //     VIEW_NAVIGATION_STEP_UUID: viewNavStepId6,
            //     VIEW_UUID: destinationViewId,
            //     FUNCTIONAL_AREA_UUID: attribute['FUNCTIONAL_AREA_UUID'],
            //     PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
            //     IS_ANY_VALUE_CHANGED: 'Yes'
            //   };
            //   viewNavigationStepAttributeList.push(viewNavStepAttrObject6);
            // }

            const testCaseUIElementStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
            let testCaseUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementStepQuery, input);

            const uiElStepQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP WHERE UI_ELEMENT_GROUP_UUID = '${data['UI_ELEMENT_GROUP_UUID']}'`;
            const uiElStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElStepQuery, input);

            for (let uiElStep of uiElStepData) {
              let viewNavStepId7 = uuid();

              const existingTestCaseUIElementGroupStep = testCaseUIElementStepQueryData.find((tcUiElStep) => tcUiElStep.UI_ELEMENT_GROUP_STEP_UUID == uiElStep.UI_ELEMENT_GROUP_STEP_UUID);

              let existingTestCaseUIElementGroupStepId = `'${existingTestCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID']}'`;
              let existingUIElementGroupStepId = `'${uiElStep['UI_ELEMENT_GROUP_STEP_UUID']}'`;

              if (existingTestCaseUIElementGroupStep) {
                let viewNavStepObj7 = {
                  VIEW_NAVIGATION_STEP_UUID: viewNavStepId7,
                  VIEW_NAVIGATION_STEP_NAME: existingTestCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: existingTestCaseUIElementGroupStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  CURRENT_PAGE_CONTEXT: existingTestCaseUIElementGroupStep['CURRENT_PAGE_CONTEXT'],
                  VIEW_NAVIGATION_STEP_TYPE: existingTestCaseUIElementGroupStep['TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE'],

                  VIEW_NAVIGATION_STEP_SEQ_ID: count,
                  NEXT_PAGE_CONTEXT: existingTestCaseUIElementGroupStep['NEXT_PAGE_CONTEXT'],
                  VIEW_UUID: destinationViewId,
                  FUNCTIONAL_AREA_UUID: existingTestCaseUIElementGroupStep['FUNCTIONAL_AREA_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                viewNavigationStepList.push(viewNavStepObj7);
              } else {
                let viewNavStepObj7 = {
                  VIEW_NAVIGATION_STEP_UUID: viewNavStepId7,
                  VIEW_NAVIGATION_STEP_NAME: uiElStep['UI_ELEMENT_GROUP_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  CURRENT_PAGE_CONTEXT: uiElStep['CURRENT_PAGE_CONTEXT'],
                  VIEW_NAVIGATION_STEP_TYPE: uiElStep['STEP_TYPE'],

                  VIEW_NAVIGATION_STEP_SEQ_ID: count,
                  NEXT_PAGE_CONTEXT: uiElStep['NEXT_PAGE_CONTEXT'],
                  VIEW_UUID: destinationViewId,
                  FUNCTIONAL_AREA_UUID: uiElStep['FUNCTIONAL_AREA_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                viewNavigationStepList.push(viewNavStepObj7);
              }
              count++;

              const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input);

              const uiElStepAttrQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where UI_ELEMENT_GROUP_STEP_UUID in(${existingUIElementGroupStepId})`;
              let uiElStepAttrData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElStepAttrQuery, input);

              for (let uiElStepAttr of uiElStepAttrData) {
                let viewNavStepAttrId7 = uuid();

                const existingTcuiElAttr = testCaseFunctionStepAttributeValueQueryData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID === uiElStepAttr.STEP_DEFINITION_ATTRIBUTE_UUID);

                if (existingTcuiElAttr) {
                  let viewNavStepAttrObject7 = {
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId7,
                    STEP_DEFINITION_ATTRIBUTE_UUID: existingTcuiElAttr['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: existingTcuiElAttr['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                    VIEW_NAVIGATION_STEP_UUID: viewNavStepId7,
                    VIEW_UUID: destinationViewId,
                    FUNCTIONAL_AREA_UUID: existingTcuiElAttr['FUNCTIONAL_AREA_UUID'],
                    PRE_DEFINED_VALUES_UUID: existingTcuiElAttr['PRE_DEFINED_VALUES_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  viewNavigationStepAttributeList.push(viewNavStepAttrObject7);
                } else {
                  let viewNavStepAttrObject7 = {
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId7,
                    STEP_DEFINITION_ATTRIBUTE_UUID: uiElStepAttr['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: uiElStepAttr['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                    VIEW_NAVIGATION_STEP_UUID: viewNavStepId7,
                    VIEW_UUID: destinationViewId,
                    FUNCTIONAL_AREA_UUID: uiElStepAttr['FUNCTIONAL_AREA_UUID'],
                    PRE_DEFINED_VALUES_UUID: uiElStepAttr['PRE_DEFINED_VALUES_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  viewNavigationStepAttributeList.push(viewNavStepAttrObject7);
                }
              }
            }
          }
        }

        if (['First Test Case Step', 'Intermediate Test Case Step'].includes(input['DESTINATION_STEP_POSITION'])) {
          reorderNavigationStep(count, navigationStepWithSequence['navQueryData']);
        }

        // ! SUPPORT FOR OLD DATA RELATED TO SCOPE
      }
    } else if (input['SOURCE_TYPE'] == 'FUNCTION') {
      const functionStepQuery = `SELECT * FROM FUNCTION_STEP where FUNCTION_UUID=:FUNCTION_UUID and FUNCTION_STEP_SEQ_ID>=:START_STEP and FUNCTION_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_STEP_SEQ_ID asc`;
      let functionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionStepQuery, input);

      if (isDestinationTestSet(input['TEST_SET_TYPE'])) {
        let testCaseStepDetailsWithSeq = await getSequinceBasedOnPosition();
        let count = testCaseStepDetailsWithSeq['seqId'];
        for (let data of functionStepQueryData) {
          let generatedTestCaseStepId = uuid();
          let testCaseStepObject = {
            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
            TEST_CASE_UUID: input['DESTINATION_TEST_CASE'],
            TEST_SET_UUID: input['TEST_SET_UUID'],
            TEST_CASE_STEP_NAME: data['FUNCTION_STEP_NAME'],
            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
            CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
            VIEW_UUID: data['VIEW_UUID'],
            TEST_CASE_STEP_SEQ_ID: count,
            TEST_CASE_STEP_TYPE: data['FUNCTION_STEP_TYPE'],
            NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
            IS_UI_ELEMENT_GROUP_STEP: data['IS_UI_ELEMENT_GROUP_STEP'],
            IS_FUNCTION_STEP: 'No',
            IS_PURE_NAVIGATION_STEP: data['IS_PURE_NAVIGATION_STEP'],
            PLAYWRITE_STEP_CODE: null,
            UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID'],
            VIEW_UUID: data['VIEW_UUID']
          };
          testCaseStepList.push(testCaseStepObject);
          count++;
          let existingFunctionStepId = "'" + data['FUNCTION_STEP_UUID'] + "'";
          const functionAttributeValueQuery = `SELECT * FROM FUNCTION_STEP_ATTRIBUTE_VALUE where FUNCTION_STEP_UUID in(${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let functionAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionAttributeValueQuery, input);
          for (let attribute of functionAttributeValueQueryData) {
            let generatedTestCaseStepAttributeId = uuid();
            let testCaseStepAttributeObject = {
              TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseStepAttributeId,
              STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
              TEST_CASE_STEP_ATTRIBUTE_DATA: attribute['FUNCTION_STEP_ATTRIBUTE_DATA'],
              TEST_SET_UUID: input['TEST_SET_UUID'],
              TEST_CASE_UUID: input['DESTINATION_TEST_CASE'],
              TEST_CASE_STEP_UUID: generatedTestCaseStepId,
              PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
              SCOPE_VARIABLE_TYPE: attribute['SCOPE_VARIABLE_TYPE'],
              SCOPE_VARIABLE_UUID: attribute['SCOPE_VARIABLE_UUID'],
              EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: attribute['FUNCTION_STEP_ATTRIBUTE_VALUE_UUID']
            };
            testCaseStepAttributeValueList.push(testCaseStepAttributeObject);
          }
          if (data['IS_PURE_NAVIGATION_STEP'] && data['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
            const functionViewNavigationQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP where FUNCTION_STEP_UUID in(${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
            let functionViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionViewNavigationQuery, input);
            let navigationCount = 1;
            for (let functionViewNavigation of functionViewNavigationQueryData) {
              let testCaseViewNavigationStepId = uuid();
              let existinTestCaseViewNavigationStepId = "'" + functionViewNavigation['FUNCTION_VIEW_NAVIGATION_STEP_UUID'] + "'";
              let testCaseViewNavigationObject = {
                TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                VIEW_NAVIGATION_STEP_UUID: functionViewNavigation['VIEW_NAVIGATION_STEP_UUID'],
                TEST_CASE_VIEW_NAVIGATION_STEP_NAME: functionViewNavigation['FUNCTION_VIEW_NAVIGATION_STEP_NAME'],
                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionViewNavigation['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                TEST_CASE_VIEW_NAVIGATION_STEP_TYPE: functionViewNavigation['FUNCTION_VIEW_NAVIGATION_STEP_TYPE'],
                TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                CURRENT_PAGE_CONTEXT: functionViewNavigation['CURRENT_PAGE_CONTEXT'],
                NEXT_PAGE_CONTEXT: functionViewNavigation['NEXT_PAGE_CONTEXT'],
                VIEW_UUID: functionViewNavigation['VIEW_UUID'],
                TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                FUNCTION_UUID: null,
                FUNCTION_STEP_UUID: null,
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              testCaseViewNavigationList.push(testCaseViewNavigationObject);
              navigationCount++;
              const functionViewNavigationAttributeQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where FUNCTION_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let functionViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionViewNavigationAttributeQuery, input);
              for (let viewNavigationAttribute of functionViewNavigationAttributeQueryData) {
                let testCaseViewNavigationAttributeId = uuid();
                let testCaseViewNavigationAttributeObject = {
                  TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                  STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                  TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                  VIEW_UUID: viewNavigationAttribute['VIEW_UUID'],
                  PRE_DEFINED_VALUES_UUID: viewNavigationAttribute['PRE_DEFINED_VALUES_UUID'],
                  FUNCTION_UUID: null,
                  SCOPE_VARIABLE_TYPE: viewNavigationAttribute['SCOPE_VARIABLE_TYPE'],
                  SCOPE_VARIABLE_UUID: viewNavigationAttribute['SCOPE_VARIABLE_UUID'],
                  EXISTING_TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                testCaseViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
              }
            }
          }
          if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
            const functionUIElementStepQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP where FUNCTION_STEP_UUID in(${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
            let functionUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionUIElementStepQuery, input);
            for (let uiElementGroupStepData of functionUIElementStepQueryData) {
              let generatedTestCaseUIElementGroupStepId = uuid();
              let testCaseUIElementGroupStepObject = {
                TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
                TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME: uiElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                CURRENT_PAGE_CONTEXT: uiElementGroupStepData['CURRENT_PAGE_CONTEXT'],
                TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE: uiElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
                TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                UI_ELEMENT_GROUP_UUID: uiElementGroupStepData['UI_ELEMENT_GROUP_UUID'],
                UI_ELEMENT_GROUP_STEP_UUID: uiElementGroupStepData['UI_ELEMENT_GROUP_STEP_UUID'],
                TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID: uiElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID'],
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              testCaseUIElementGroupStepList.push(testCaseUIElementGroupStepObject);
              let existingTestCaseUIElementGroupStepId = "'" + uiElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] + "'";
              const functionUIElementGroupStepAttributeValueQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let functionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionUIElementGroupStepAttributeValueQuery, input);
              for (let functionUIElementGroupStepData of functionUIElementGroupStepAttributeValueQueryData) {
                let generatedTestCaseUIElementGroupStepAttributeId = uuid();
                let testCaseUIElementGroupStepAttributeobject = {
                  TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseUIElementGroupStepAttributeId,
                  STEP_DEFINITION_ATTRIBUTE_UUID: functionUIElementGroupStepData['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: functionUIElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                  TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
                  TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                  UI_ELEMENT_GROUP_UUID: functionUIElementGroupStepData['UI_ELEMENT_GROUP_UUID'],
                  PRE_DEFINED_VALUES_UUID: functionUIElementGroupStepData['PRE_DEFINED_VALUES_UUID'],
                  SCOPE_VARIABLE_TYPE: functionUIElementGroupStepData['SCOPE_VARIABLE_TYPE'],
                  SCOPE_VARIABLE_UUID: functionUIElementGroupStepData['SCOPE_VARIABLE_UUID'],
                  EXISTING_TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionUIElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                testCaseUIElementGroupStepAttributeList.push(testCaseUIElementGroupStepAttributeobject);
              }
            }
          }
        }
        if (['First Test Case Step', 'Intermediate Test Case Step'].includes(input['DESTINATION_STEP_POSITION'])) {
          reorderTestCaseStep(count, testCaseStepDetailsWithSeq['testCaseStepQueryData']);
        }
        updateSourceUUIDBasedOnFunctionTestSetAndTestCase('No', 'No');
      } else if (input['TEST_SET_TYPE'] == 'Function') {
        let functionStepDetailsWSeq = await getSequinceBasedOnPositionForFunction();
        let count = functionStepDetailsWSeq['seqId'];

        const funcId = input['DESTINATION_FUNCTION'];

        for (let data of functionStepQueryData) {
          let funcStepId1 = uuid();
          let funcStepObj1 = {
            FUNCTION_STEP_UUID: funcStepId1,
            FUNCTION_UUID: funcId,
            FUNCTIONAL_AREA_UUID: data['FUNCTIONAL_AREA_UUID'],
            FUNCTION_STEP_NAME: data['FUNCTION_STEP_NAME'],
            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
            CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
            FUNCTION_STEP_SEQ_ID: count,
            FUNCTION_STEP_TYPE: data['FUNCTION_STEP_TYPE'],
            NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
            IS_OVERIDE_UI_ELEMENT_VALUE_ALLOWED: data['IS_OVERIDE_UI_ELEMENT_VALUE_ALLOWED'],
            IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT: data['IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT'],
            IS_UI_ELEMENT_GROUP_STEP: data['IS_UI_ELEMENT_GROUP_STEP'],
            API_UUID: data['API_UUID'],
            IS_API_ATTRIBUTE_VALUE_PRESENT: data['IS_API_ATTRIBUTE_VALUE_PRESENT'],
            IS_PURE_NAVIGATION_STEP: data['IS_PURE_NAVIGATION_STEP'],
            VIEW_UUID: data['VIEW_UUID'],
            UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID']
          };
          functionStepList.push(funcStepObj1);
          count++;

          let existingFunctionStepId = `'${data['FUNCTION_STEP_UUID']}'`;
          const functionAttributeValueQuery = `SELECT * FROM FUNCTION_STEP_ATTRIBUTE_VALUE where FUNCTION_STEP_UUID in(${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let functionAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionAttributeValueQuery, input);

          for (let attribute of functionAttributeValueQueryData) {
            let funcStepAttrId1 = uuid();

            let functionStepAttrObj1 = {
              FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: funcStepAttrId1,
              STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
              FUNCTION_STEP_ATTRIBUTE_DATA: attribute['FUNCTION_STEP_ATTRIBUTE_DATA'],
              FUNCTION_UUID: funcId,
              FUNCTION_STEP_UUID: funcStepId1,
              FUNCTIONAL_AREA_UUID: attribute['FUNCTIONAL_AREA_UUID'],
              PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
              SCOPE_VARIABLE_TYPE: attribute['SCOPE_VARIABLE_TYPE'],
              SCOPE_VARIABLE_UUID: attribute['SCOPE_VARIABLE_UUID']
            };
            functionStepAttributeValueList.push(functionStepAttrObj1);
          }

          if (data['IS_PURE_NAVIGATION_STEP'] && data['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
            const functionViewNavigationQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP where FUNCTION_STEP_UUID in(${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
            let functionViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionViewNavigationQuery, input);

            // ! TODO: not using nav step

            let navigationCount = 1;
            for (let functionViewNavigation of functionViewNavigationQueryData) {
              let functionViewNavId = uuid();
              let existinTestCaseViewNavigationStepId = "'" + functionViewNavigation['FUNCTION_VIEW_NAVIGATION_STEP_UUID'] + "'";

              let functionViewNavObj = {
                FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavId,
                FUNCTION_UUID: funcId,
                FUNCTION_STEP_UUID: funcStepId1,
                FUNCTIONAL_AREA_UUID: functionViewNavigation['FUNCTIONAL_AREA_UUID'],
                VIEW_UUID: functionViewNavigation['VIEW_UUID'],
                VIEW_NAVIGATION_STEP_UUID: functionViewNavigation['VIEW_NAVIGATION_STEP_UUID'],
                FUNCTION_VIEW_NAVIGATION_STEP_NAME: functionViewNavigation['FUNCTION_VIEW_NAVIGATION_STEP_NAME'],
                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionViewNavigation['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                FUNCTION_VIEW_NAVIGATION_STEP_TYPE: functionViewNavigation['FUNCTION_VIEW_NAVIGATION_STEP_TYPE'],
                FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                CURRENT_PAGE_CONTEXT: functionViewNavigation['CURRENT_PAGE_CONTEXT'],
                NEXT_PAGE_CONTEXT: functionViewNavigation['NEXT_PAGE_CONTEXT']
              };
              functionViewNavigationList.push(functionViewNavObj);
              navigationCount++;

              const functionViewNavigationAttributeQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where FUNCTION_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let functionViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionViewNavigationAttributeQuery, input);

              for (let viewNavigationAttribute of functionViewNavigationAttributeQueryData) {
                let functionViewNavStepAtt = uuid();

                let functionViewNavStepAttObj = {
                  FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: functionViewNavStepAtt,
                  FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavId,
                  STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                  VIEW_UUID: viewNavigationAttribute['VIEW_UUID'],
                  FUNCTIONAL_AREA_UUID: viewNavigationAttribute['FUNCTIONAL_AREA_UUID'],
                  FUNCTION_UUID: funcId,
                  PRE_DEFINED_VALUES_UUID: viewNavigationAttribute['PRE_DEFINED_VALUES_UUID'],
                  SCOPE_VARIABLE_TYPE: viewNavigationAttribute['SCOPE_VARIABLE_TYPE'],
                  SCOPE_VARIABLE_UUID: viewNavigationAttribute['SCOPE_VARIABLE_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                functionViewNavigationAttributeValueList.push(functionViewNavStepAttObj);
              }
            }
          }
          if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
            const functionUIElementStepQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP where FUNCTION_STEP_UUID in (${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
            let functionUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionUIElementStepQuery, input);

            for (let uiElementGroupStepData of functionUIElementStepQueryData) {
              let funcUIEleGroupStepId = uuid();

              let funcUiElGroupStepObj = {
                FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: funcUIEleGroupStepId,
                FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: uiElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                CURRENT_PAGE_CONTEXT: uiElementGroupStepData['CURRENT_PAGE_CONTEXT'],
                FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: uiElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
                FUNCTION_STEP_UUID: funcStepId1,
                FUNCTION_UUID: funcId,
                UI_ELEMENT_GROUP_UUID: uiElementGroupStepData['UI_ELEMENT_GROUP_UUID'],
                FUNCTIONAL_AREA_UUID: uiElementGroupStepData['FUNCTIONAL_AREA_UUID'],
                UI_ELEMENT_GROUP_STEP_UUID: uiElementGroupStepData['UI_ELEMENT_GROUP_STEP_UUID'],
                FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: uiElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID'],
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              functionUIElementGroupStepList.push(funcUiElGroupStepObj);

              let existingTestCaseUIElementGroupStepId = "'" + uiElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] + "'";

              const functionUIElementGroupStepAttributeValueQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let functionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionUIElementGroupStepAttributeValueQuery, input);

              for (let functionUIElementGroupStepData of functionUIElementGroupStepAttributeValueQueryData) {
                let functionUiElGroupStepAttr = {
                  FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: uuid(),
                  STEP_DEFINITION_ATTRIBUTE_UUID: functionUIElementGroupStepData['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: functionUIElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                  FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: functionUIElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'],
                  FUNCTION_STEP_UUID: funcStepId1,
                  FUNCTION_UUID: funcId,
                  FUNCTIONAL_AREA_UUID: functionUIElementGroupStepData['FUNCTIONAL_AREA_UUID'],

                  PRE_DEFINED_VALUES_UUID: functionUIElementGroupStepData['PRE_DEFINED_VALUES_UUID'],
                  SCOPE_VARIABLE_TYPE: functionUIElementGroupStepData['SCOPE_VARIABLE_TYPE'],
                  SCOPE_VARIABLE_UUID: functionUIElementGroupStepData['SCOPE_VARIABLE_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                functionUIElementGroupStepAttributeList.push(functionUiElGroupStepAttr);
              }
            }
          }
        }
        if (['First Test Case Step', 'Intermediate Test Case Step'].includes(input['DESTINATION_STEP_POSITION'])) {
          reorderFunctionStep(count, functionStepDetailsWSeq['functionStepQueryData']);
        }

        // ! SUPPORT FOR OLD DATA RELATED TO SCOPE
      } else if (input['TEST_SET_TYPE'] == 'Page View Navigation') {
        // ! checkmark ----------------

        let navigationStepWithSequence = await getSequinceBasedOnPositionForNavigation();
        let count = navigationStepWithSequence['seqId'];
        const destinationViewId = input['DESTINATION_VIEW'];

        for (let data of functionStepQueryData) {
          let existingFunctionStepId = `'${data['FUNCTION_STEP_UUID']}'`;

          
          if (data['IS_PURE_NAVIGATION_STEP'] && data['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
            const functionViewNavigationQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP where FUNCTION_STEP_UUID in(${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
            let functionViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionViewNavigationQuery, input);

            let viewNavQuery = `SELECT * FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID = '${data['VIEW_UUID']}'`;
            let viewNavData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewNavQuery, input);
            // ! TODO: not using nav step

            let count = 1;
            for (let navData of viewNavData) {
              let navId2 = uuid();

              let functionViewNavigation = functionViewNavigationQueryData.find((st) => st.VIEW_NAVIGATION_STEP_UUID == navData.VIEW_NAVIGATION_STEP_UUID);

              let existinTestCaseViewNavigationStepId = functionViewNavigation ? `'${functionViewNavigation['FUNCTION_VIEW_NAVIGATION_STEP_UUID']}'` : '';
              let existingViewNavigationStepId = `'${navData['VIEW_NAVIGATION_STEP_UUID']}'`;

              if (functionViewNavigation) {
                let viewNavStepObj2 = {
                  VIEW_NAVIGATION_STEP_UUID: navId2,
                  VIEW_NAVIGATION_STEP_NAME: functionViewNavigation['FUNCTION_VIEW_NAVIGATION_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionViewNavigation['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  VIEW_NAVIGATION_STEP_TYPE: functionViewNavigation['FUNCTION_VIEW_NAVIGATION_STEP_TYPE'],
                  VIEW_NAVIGATION_STEP_SEQ_ID: count,
                  CURRENT_PAGE_CONTEXT: functionViewNavigation['CURRENT_PAGE_CONTEXT'],
                  NEXT_PAGE_CONTEXT: functionViewNavigation['NEXT_PAGE_CONTEXT'],
                  VIEW_UUID: destinationViewId,
                  FUNCTIONAL_AREA_UUID: functionViewNavigation['FUNCTIONAL_AREA_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                viewNavigationStepList.push(viewNavStepObj2);
              } else {
                let viewNavStepObj2 = {
                  VIEW_NAVIGATION_STEP_UUID: navId2,
                  VIEW_NAVIGATION_STEP_NAME: navData['VIEW_NAVIGATION_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: navData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  VIEW_NAVIGATION_STEP_TYPE: navData['VIEW_NAVIGATION_STEP_TYPE'],
                  VIEW_NAVIGATION_STEP_SEQ_ID: count,
                  CURRENT_PAGE_CONTEXT: navData['CURRENT_PAGE_CONTEXT'],
                  NEXT_PAGE_CONTEXT: navData['NEXT_PAGE_CONTEXT'],
                  VIEW_UUID: destinationViewId,
                  FUNCTIONAL_AREA_UUID: navData['FUNCTIONAL_AREA_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                viewNavigationStepList.push(viewNavStepObj2);
              }
              count++;

              const functionViewNavigationAttributeQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where FUNCTION_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let functionViewNavigationAttributeQueryData = existinTestCaseViewNavigationStepId
                ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionViewNavigationAttributeQuery, input)
                : [];

              const navStepAttrQuery = `SELECT * FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where VIEW_NAVIGATION_STEP_UUID in(${existingViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              const navStepAttrData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', navStepAttrQuery, input);

              for (let navStepAttr of navStepAttrData) {
                let functionViewNavStepAtt = uuid();

                const existingFuncNavStepAttr = functionViewNavigationAttributeQueryData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID == navStepAttr.STEP_DEFINITION_ATTRIBUTE_UUID);

                if (existingFuncNavStepAttr) {
                  let viewNavAttriObject2 = {
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: functionViewNavStepAtt,
                    VIEW_NAVIGATION_STEP_UUID: navId2,
                    STEP_DEFINITION_ATTRIBUTE_UUID: existingFuncNavStepAttr['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: existingFuncNavStepAttr['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                    VIEW_UUID: destinationViewId,
                    FUNCTIONAL_AREA_UUID: existingFuncNavStepAttr['FUNCTIONAL_AREA_UUID'],
                    PRE_DEFINED_VALUES_UUID: existingFuncNavStepAttr['PRE_DEFINED_VALUES_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  viewNavigationStepAttributeList.push(viewNavAttriObject2);
                } else {
                  let viewNavAttriObject2 = {
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: functionViewNavStepAtt,
                    VIEW_NAVIGATION_STEP_UUID: navId2,
                    STEP_DEFINITION_ATTRIBUTE_UUID: navStepAttr['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: navStepAttr['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                    VIEW_UUID: destinationViewId,
                    FUNCTIONAL_AREA_UUID: navStepAttr['FUNCTIONAL_AREA_UUID'],
                    PRE_DEFINED_VALUES_UUID: navStepAttr['PRE_DEFINED_VALUES_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  viewNavigationStepAttributeList.push(viewNavAttriObject2);
                }
              }
            }
          }
          else if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
            const functionUIElementStepQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP where FUNCTION_STEP_UUID in (${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
            let functionUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionUIElementStepQuery, input);

            const uiElGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP WHERE UI_ELEMENT_GROUP_UUID = '${data['UI_ELEMENT_GROUP_UUID']}'`;
            const uiElGroupStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElGroupStepQuery, input);

            for (let uiElGroupStep of uiElGroupStepData) {
              let navId3 = uuid();

              const existingUiElStep = functionUIElementStepQueryData.find((st) => st.UI_ELEMENT_GROUP_STEP_UUID == uiElGroupStep.UI_ELEMENT_GROUP_STEP_UUID);

              if (existingUiElStep) {
                let viewNavStepObj3 = {
                  VIEW_NAVIGATION_STEP_UUID: navId3,
                  VIEW_NAVIGATION_STEP_NAME: existingUiElStep['FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: existingUiElStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  VIEW_NAVIGATION_STEP_TYPE: existingUiElStep['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
                  VIEW_NAVIGATION_STEP_SEQ_ID: count,
                  CURRENT_PAGE_CONTEXT: existingUiElStep['CURRENT_PAGE_CONTEXT'],
                  NEXT_PAGE_CONTEXT: existingUiElStep['NEXT_PAGE_CONTEXT'],
                  VIEW_UUID: destinationViewId,
                  FUNCTIONAL_AREA_UUID: existingUiElStep['FUNCTIONAL_AREA_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                viewNavigationStepList.push(viewNavStepObj3);
              } else {
                let viewNavStepObj3 = {
                  VIEW_NAVIGATION_STEP_UUID: navId3,
                  VIEW_NAVIGATION_STEP_NAME: uiElGroupStep['UI_ELEMENT_GROUP_STEP_NAME'],
                  STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElGroupStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                  VIEW_NAVIGATION_STEP_TYPE: uiElGroupStep['STEP_TYPE'],
                  VIEW_NAVIGATION_STEP_SEQ_ID: count,
                  CURRENT_PAGE_CONTEXT: uiElGroupStep['CURRENT_PAGE_CONTEXT'],
                  NEXT_PAGE_CONTEXT: uiElGroupStep['NEXT_PAGE_CONTEXT'],
                  VIEW_UUID: destinationViewId,
                  FUNCTIONAL_AREA_UUID: uiElGroupStep['FUNCTIONAL_AREA_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                viewNavigationStepList.push(viewNavStepObj3);
              }
              count++;

              let existingTestCaseUIElementGroupStepId = existingUiElStep ? `'${existingUiElStep['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID']}'` : '';
              let existingUIElemenGrpStepId = `'${uiElGroupStep.UI_ELEMENT_GROUP_STEP_UUID}'`;

            //   todo
              const functionUIElementGroupStepAttributeValueQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let functionUIElementGroupStepAttributeValueQueryData = existingTestCaseUIElementGroupStepId
                ? await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionUIElementGroupStepAttributeValueQuery, input)
                : [];

              const uiElementGroupStepAttributeValueQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where UI_ELEMENT_GROUP_STEP_UUID in(${existingUIElemenGrpStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              const uiElementGroupStepAttributeValueData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepAttributeValueQuery, input);

              for (let uiegsAttr of uiElementGroupStepAttributeValueData) {
                const existingFugs = functionUIElementGroupStepAttributeValueQueryData.find((attr) => attr.STEP_DEFINITION_ATTRIBUTE_UUID == uiegsAttr.STEP_DEFINITION_ATTRIBUTE_UUID);

                if (existingFugs) {
                  let viewNavStepObj3 = {
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: uuid(),
                    VIEW_NAVIGATION_STEP_UUID: navId3,
                    STEP_DEFINITION_ATTRIBUTE_UUID: existingFugs['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: existingFugs['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                    VIEW_UUID: destinationViewId,
                    FUNCTIONAL_AREA_UUID: existingFugs['FUNCTIONAL_AREA_UUID'],
                    PRE_DEFINED_VALUES_UUID: existingFugs['PRE_DEFINED_VALUES_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  viewNavigationStepAttributeList.push(viewNavStepObj3);
                } else {
                  let viewNavStepObj3 = {
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: uuid(),
                    VIEW_NAVIGATION_STEP_UUID: navId3,
                    STEP_DEFINITION_ATTRIBUTE_UUID: uiegsAttr['STEP_DEFINITION_ATTRIBUTE_UUID'],
                    VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: uiegsAttr['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                    VIEW_UUID: destinationViewId,
                    FUNCTIONAL_AREA_UUID: uiegsAttr['FUNCTIONAL_AREA_UUID'],
                    PRE_DEFINED_VALUES_UUID: uiegsAttr['PRE_DEFINED_VALUES_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  viewNavigationStepAttributeList.push(viewNavStepObj3);
                }
              }
            }
          }
          else {
            let navId1 = uuid();
            let viewNavStepObj1 = {
              VIEW_NAVIGATION_STEP_UUID: navId1,
              VIEW_NAVIGATION_STEP_NAME: data['FUNCTION_STEP_NAME'],
              STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
              VIEW_NAVIGATION_STEP_TYPE: data['FUNCTION_STEP_TYPE'] && data['FUNCTION_STEP_TYPE'] == 'Data' ? 'Given' : data['FUNCTION_STEP_TYPE'],
              VIEW_NAVIGATION_STEP_SEQ_ID: count,
              CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
              NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
              VIEW_UUID: destinationViewId,
              FUNCTIONAL_AREA_UUID: data['FUNCTIONAL_AREA_UUID'],
              IS_ANY_VALUE_CHANGED: 'Yes'
            };
            viewNavigationStepList.push(viewNavStepObj1);
            count++;

            const functionAttributeValueQuery = `SELECT * FROM FUNCTION_STEP_ATTRIBUTE_VALUE where FUNCTION_STEP_UUID in(${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let functionAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', functionAttributeValueQuery, input);

            for (let attribute of functionAttributeValueQueryData) {
              let viewNavStepAttrId1 = uuid();
// TODO: USE setAttributeValue EVERYWHERE
              let viewNavStepAttrObject = {
                VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavStepAttrId1,
                STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: setAttributeValue(attribute['SCOPE_VARIABLE_UUID'], attribute['FUNCTION_STEP_ATTRIBUTE_DATA']),
                VIEW_NAVIGATION_STEP_UUID: navId1,
                VIEW_UUID: destinationViewId,
                FUNCTIONAL_AREA_UUID: attribute['FUNCTIONAL_AREA_UUID'],
                PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
                EXISTING_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'],
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              viewNavigationStepAttributeList.push(viewNavStepAttrObject);
            }
          }
        }
        if (['First Test Case Step', 'Intermediate Test Case Step'].includes(input['DESTINATION_STEP_POSITION'])) {
          reorderNavigationStep(count, navigationStepWithSequence['navQueryData']);
        }

      }
    } else if (input['SOURCE_TYPE'] == 'UI_ELEMENT_GROUP') {
      input['SOURCE_UI_ELEMENT_GROUP_STEP_UUIDS'] = input['SOURCE_UI_ELEMENT_GROUP_STEP_UUIDS'] && input['SOURCE_UI_ELEMENT_GROUP_STEP_UUIDS'].split(',');
      let ids = input['SOURCE_UI_ELEMENT_GROUP_STEP_UUIDS'].map((id) => `'` + id + `'`).join(',');
      const uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP where UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID and UI_ELEMENT_GROUP_STEP_UUID in(${
        ids ? ids : `''`
      }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by UI_ELEMENT_GROUP_STEP_ID asc`;
      let uiElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input);

      if (isDestinationTestSet(input['TEST_SET_TYPE'])) {
        let testCaseStepDetailsWithSeq = await getSequinceBasedOnPosition();
        let count = testCaseStepDetailsWithSeq['seqId'];
        for (let data of uiElementGroupStepQueryData) {
          let generatedTestCaseStepId = uuid();
          let testCaseStepObject = {
            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
            TEST_CASE_UUID: input['DESTINATION_TEST_CASE'],
            TEST_SET_UUID: input['TEST_SET_UUID'],
            TEST_CASE_STEP_NAME: data['UI_ELEMENT_GROUP_STEP_NAME'],
            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
            CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
            VIEW_UUID: data['VIEW_UUID'],
            TEST_CASE_STEP_SEQ_ID: count,
            TEST_CASE_STEP_TYPE: data['STEP_TYPE'],
            NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
            IS_UI_ELEMENT_GROUP_STEP: 'No',
            IS_FUNCTION_STEP: 'No',
            IS_PURE_NAVIGATION_STEP: null,
            PLAYWRITE_STEP_CODE: null
          };
          testCaseStepList.push(testCaseStepObject);
          count++;
          let existingUIElementGroupStepId = "'" + data['UI_ELEMENT_GROUP_STEP_UUID'] + "'";
          const uiElementGroupStepAttributeValueQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where UI_ELEMENT_GROUP_STEP_UUID in(${existingUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let uiElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepAttributeValueQuery, input);
          for (let attribute of uiElementGroupStepAttributeValueQueryData) {
            let generatedTestCaseStepAttributeId = uuid();
            let testCaseStepAttributeObject = {
              TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseStepAttributeId,
              STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
              TEST_CASE_STEP_ATTRIBUTE_DATA: attribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
              TEST_SET_UUID: input['TEST_SET_UUID'],
              TEST_CASE_UUID: input['DESTINATION_TEST_CASE'],
              TEST_CASE_STEP_UUID: generatedTestCaseStepId,
              PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID']
            };
            testCaseStepAttributeValueList.push(testCaseStepAttributeObject);
          }
        }
        if (['First Test Case Step', 'Intermediate Test Case Step'].includes(input['DESTINATION_STEP_POSITION'])) {
          reorderTestCaseStep(count, testCaseStepDetailsWithSeq['testCaseStepQueryData']);
        }
      } else if (input['TEST_SET_TYPE'] == 'Function') {
        let functionStepsWithSeq = await getSequinceBasedOnPositionForFunction();
        let count = functionStepsWithSeq['seqId'];

        const funcId = input['DESTINATION_FUNCTION'];

        for (let data of uiElementGroupStepQueryData) {
          let funcStepId1 = uuid();
          let funcStepObj1 = {
            FUNCTION_STEP_UUID: funcStepId1,
            FUNCTION_UUID: funcId,
            FUNCTIONAL_AREA_UUID: data['FUNCTIONAL_AREA_UUID'],
            FUNCTION_STEP_NAME: data['UI_ELEMENT_GROUP_STEP_NAME'],
            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
            CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
            FUNCTION_STEP_SEQ_ID: count,
            FUNCTION_STEP_TYPE: data['STEP_TYPE'],
            NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
            UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID']
          };
          functionStepList.push(funcStepObj1);
          count++;

          let existingUIElementGroupStepId = "'" + data['UI_ELEMENT_GROUP_STEP_UUID'] + "'";
          const uiElementGroupStepAttributeValueQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where UI_ELEMENT_GROUP_STEP_UUID in(${existingUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let uiElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepAttributeValueQuery, input);

          for (let attribute of uiElementGroupStepAttributeValueQueryData) {
            let funcStepAttrId1 = uuid();

            let functionStepAttrObj1 = {
              FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: funcStepAttrId1,
              STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
              FUNCTION_STEP_ATTRIBUTE_DATA: attribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
              FUNCTION_UUID: funcId,
              FUNCTION_STEP_UUID: funcStepId1,
              FUNCTIONAL_AREA_UUID: attribute['FUNCTIONAL_AREA_UUID'],
              PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID']
            };
            functionStepAttributeValueList.push(functionStepAttrObj1);
          }
        }
        if (['First Test Case Step', 'Intermediate Test Case Step'].includes(input['DESTINATION_STEP_POSITION'])) {
          reorderFunctionStep(count, functionStepsWithSeq['functionStepQueryData']);
        }
      } else if (input['TEST_SET_TYPE'] == 'Page View Navigation') {
        let viewNavigationStepsWithSeq = await getSequinceBasedOnPositionForNavigation();
        let count = viewNavigationStepsWithSeq['seqId'];
        const destinationViewId = input['DESTINATION_VIEW'];

        for (let data of uiElementGroupStepQueryData) {
          let navId2 = uuid();

          let viewNavStepObj2 = {
            VIEW_NAVIGATION_STEP_UUID: navId2,
            VIEW_NAVIGATION_STEP_NAME: data['UI_ELEMENT_GROUP_STEP_NAME'],
            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
            VIEW_NAVIGATION_STEP_TYPE: data['STEP_TYPE'],
            VIEW_NAVIGATION_STEP_SEQ_ID: count,
            CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
            NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
            VIEW_UUID: destinationViewId,
            FUNCTIONAL_AREA_UUID: data['FUNCTIONAL_AREA_UUID'],
            IS_ANY_VALUE_CHANGED: 'Yes'
          };
          viewNavigationStepList.push(viewNavStepObj2);
          count++;

          let existingUIElementGroupStepId = "'" + data['UI_ELEMENT_GROUP_STEP_UUID'] + "'";
          const uiElementGroupStepAttributeValueQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where UI_ELEMENT_GROUP_STEP_UUID in(${existingUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let uiElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepAttributeValueQuery, input);

          for (let attribute of uiElementGroupStepAttributeValueQueryData) {
            let generatedTestCaseStepAttributeId = uuid();

            let viewNavAttriObject2 = {
              VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseStepAttributeId,
              VIEW_NAVIGATION_STEP_UUID: navId2,
              STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
              VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: attribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
              VIEW_UUID: destinationViewId,
              FUNCTIONAL_AREA_UUID: attribute['FUNCTIONAL_AREA_UUID'],
              PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
              IS_ANY_VALUE_CHANGED: 'Yes'
            };
            viewNavigationStepAttributeList.push(viewNavAttriObject2);
          }
        }

        if (['First Test Case Step', 'Intermediate Test Case Step'].includes(input['DESTINATION_STEP_POSITION'])) {
          reorderNavigationStep(count, viewNavigationStepsWithSeq['navQueryData']);
        }
      }
    }
  } else {
    if (input.compositeEntityAction == 'Copy' || input.compositeEntityAction == 'Copy Test Case') {
      let generatedTestCaseId = uuid();
      let testCaseDescriptionUUID = uuid();
      let copyCount = 0;
      let testCaseName = confirmEnding(input['TEST_CASE_NAME'], 'Copy ');
      let spilData = testCaseName.split('- Copy');
      let serchedData = spilData[0].trim();
      if (serchedData.includes("'")) {
        serchedData = serchedData.split("'").join("''");
      }
      const testCaseQuery = `SELECT * FROM TEST_CASE where TEST_CASE_NAME LIKE '%${serchedData}%' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_SET_UUID=:TEST_SET_UUID`;
      let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseQuery, input);
      if (input['ORIGINAL_TEST_SET_UUID'] == input['TEST_SET_UUID']) {
        copyCount = testCaseQueryData.length != 0 ? testCaseQueryData.length - 1 : '';
        copyCount = testCaseQueryData.length == 1 ? '' : testCaseQueryData.length - 1;
      } else {
        copyCount = testCaseQueryData.length == 0 ? '' : testCaseQueryData.length;
      }
      let modifiedTestCaseName = testCaseName + copyCount;
      let testCaseObject = {
        TEST_CASE_UUID: generatedTestCaseId,
        TEST_CASE_NAME: input['TEST_CASE_NAME'],
        TEST_SET_UUID: input['TEST_SET_UUID'],
        TEST_CASE_EXECUTON_TYPE: input['TEST_CASE_EXECUTON_TYPE'],
        TEST_CASE_STATUS: 'DRAFT',
        TEST_CASE_DESCRIPTION_UUID: testCaseDescriptionUUID,
        TEST_CASE_OWNER: input['APP_LOGGED_IN_USER_ID'],
        SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE: input['SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE']
      };
      let testCaseDescQuery = 'SELECT * FROM TEST_CASE_DESCRIPTION where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;';
      let testCaseDescQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', testCaseDescQuery, input);
      if (testCaseDescQueryData) {
        let testCaseDescriptionObject = {
          TEST_CASE_DESCRIPTION_UUID: testCaseDescriptionUUID,
          TEST_CASE_DESCRIPTION_DATA: testCaseDescQueryData['TEST_CASE_DESCRIPTION_DATA'],
          TEST_CASE_PRE_CONDITION: testCaseDescQueryData['TEST_CASE_PRE_CONDITION'],
          TEST_CASE_USER_INPUT: testCaseDescQueryData['TEST_CASE_USER_INPUT'],
          TEST_CASE_EXPECTED_RESULT: testCaseDescQueryData['TEST_CASE_EXPECTED_RESULT'],
          TEST_CASE_ACTUAL_RESULT: testCaseDescQueryData['TEST_CASE_ACTUAL_RESULT'],
          TEST_CASE_PRE_EXISTING_DATA: testCaseDescQueryData['TEST_CASE_PRE_EXISTING_DATA'],
          TEST_CASE_UUID: generatedTestCaseId
        };
        testCaseDescriptionList.push(testCaseDescriptionObject);
        input['AppEngChildEntity:TEST_CASE_DESCRIPTION'] = testCaseDescriptionList;
      }
      testCaseList.push(testCaseObject);
      const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
      let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepQuery, input);
      let count = 1;
      for (let data of testCaseStepQueryData) {
        let generatedTestCaseStepId = uuid();
        let testCaseStepObject = {
          TEST_CASE_STEP_UUID: generatedTestCaseStepId,
          TEST_CASE_UUID: generatedTestCaseId,
          TEST_SET_UUID: input['TEST_SET_UUID'],
          TEST_CASE_STEP_NAME: data['TEST_CASE_STEP_NAME'],
          STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
          CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
          VIEW_UUID: data['VIEW_UUID'],
          TEST_CASE_STEP_SEQ_ID: count,
          TEST_CASE_STEP_TYPE: data['TEST_CASE_STEP_TYPE'],
          NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
          IS_UI_ELEMENT_GROUP_STEP: data['IS_UI_ELEMENT_GROUP_STEP'],
          IS_FUNCTION_STEP: data['IS_FUNCTION_STEP'],
          IS_PURE_NAVIGATION_STEP: data['IS_PURE_NAVIGATION_STEP'],
          PLAYWRITE_STEP_CODE: data['PLAYWRITE_STEP_CODE'],
          API_UUID: data['API_UUID'],
          FUNCTION_UUID: data['FUNCTION_UUID'],
          UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID']
        };
        testCaseStepList.push(testCaseStepObject);
        count++;
        let existingTestCaseStepId = "'" + data['TEST_CASE_STEP_UUID'] + "'";
        const encryptedDBCode = 'TEST_CASE_STEP_ATTRIBUTE_DATA';
        const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseStepAttributeValueQuery, input, undefined, encryptedDBCode);
        for (let attribute of testCaseStepAttributeValueQueryData) {
          let generatedTestCaseStepAttributeId = uuid();
          let testCaseStepAttributeObject = {
            TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseStepAttributeId,
            STEP_DEFINITION_ATTRIBUTE_UUID: attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
            TEST_CASE_STEP_ATTRIBUTE_DATA: attribute['TEST_CASE_STEP_ATTRIBUTE_DATA'],
            TEST_SET_UUID: input['TEST_SET_UUID'],
            TEST_CASE_UUID: generatedTestCaseId,
            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
            PRE_DEFINED_VALUES_UUID: attribute['PRE_DEFINED_VALUES_UUID'],
            FUNCTION_UUID: attribute['FUNCTION_UUID'],
            SCOPE_VARIABLE_TYPE: attribute['SCOPE_VARIABLE_TYPE'],
            SCOPE_VARIABLE_UUID: attribute['SCOPE_VARIABLE_UUID'],
            EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: attribute['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID']
          };
          testCaseStepAttributeValueList.push(testCaseStepAttributeObject);
        }
        if (data['IS_PURE_NAVIGATION_STEP'] && data['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
          const testCaseViewNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NULL AND FUNCTION_STEP_UUID IS NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
          let testCaseViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationQuery, input);
          let navigationCount = 1;
          for (let testCaseViewNavigation of testCaseViewNavigationQueryData) {
            let testCaseViewNavigationStepId = uuid();
            let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] + "'";
            let testCaseViewNavigationObject = {
              TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
              VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation['VIEW_NAVIGATION_STEP_UUID'],
              TEST_CASE_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'],
              STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
              TEST_CASE_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'],
              TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
              CURRENT_PAGE_CONTEXT: testCaseViewNavigation['CURRENT_PAGE_CONTEXT'],
              NEXT_PAGE_CONTEXT: testCaseViewNavigation['NEXT_PAGE_CONTEXT'],
              VIEW_UUID: testCaseViewNavigation['VIEW_UUID'],
              TEST_CASE_STEP_UUID: generatedTestCaseStepId,
              FUNCTION_UUID: testCaseViewNavigation['FUNCTION_UUID'],
              FUNCTION_STEP_UUID: testCaseViewNavigation['FUNCTION_STEP_UUID'],
              IS_ANY_VALUE_CHANGED: 'Yes'
            };
            testCaseViewNavigationList.push(testCaseViewNavigationObject);
            navigationCount++;
            const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationAttributeQuery, input);
            for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
              let testCaseViewNavigationAttributeId = uuid();
              let testCaseViewNavigationAttributeObject = {
                TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                VIEW_UUID: viewNavigationAttribute['VIEW_UUID'],
                PRE_DEFINED_VALUES_UUID: viewNavigationAttribute['PRE_DEFINED_VALUES_UUID'],
                FUNCTION_UUID: viewNavigationAttribute['FUNCTION_UUID'],
                SCOPE_VARIABLE_TYPE: viewNavigationAttribute['SCOPE_VARIABLE_TYPE'],
                SCOPE_VARIABLE_UUID: viewNavigationAttribute['SCOPE_VARIABLE_UUID'],
                EXISTING_TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'],
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              testCaseViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
            }
          }
        }
        if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'No' && data['IS_FUNCTION_STEP'] == 'Yes') {
          const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${
            existingTestCaseStepId ? existingTestCaseStepId : `''`
          }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
          let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepQuery, input);
          let functionStepCount = 1;
          if (testCaseFunctionStepData && testCaseFunctionStepData.length) {
            for (let functionStepData of testCaseFunctionStepData) {
              let generatedTestCaseFunctionStepId = uuid();
              let testCaseFunctionStepObject = {
                TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                TEST_CASE_FUNCTION_STEP_NAME: functionStepData['TEST_CASE_FUNCTION_STEP_NAME'],
                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                CURRENT_PAGE_CONTEXT: functionStepData['CURRENT_PAGE_CONTEXT'],
                NEXT_PAGE_CONTEXT: functionStepData['NEXT_PAGE_CONTEXT'],
                VIEW_UUID: functionStepData['VIEW_UUID'],
                TEST_CASE_FUNCTION_STEP_TYPE: functionStepData['TEST_CASE_FUNCTION_STEP_TYPE'],
                TEST_CASE_FUNCTION_STEP_SEQ_ID: functionStepCount,
                TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                IS_UI_ELEMENT_GROUP_STEP: functionStepData['IS_UI_ELEMENT_GROUP_STEP'],
                FUNCTION_UUID: functionStepData['FUNCTION_UUID'],
                FUNCTION_STEP_UUID: functionStepData['FUNCTION_STEP_UUID'],
                IS_PURE_NAVIGATION_STEP: functionStepData['IS_PURE_NAVIGATION_STEP'],
                API_UUID: functionStepData['API_UUID'],
                UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID'],
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              testCaseFunctionStepList.push(testCaseFunctionStepObject);
              functionStepCount++;
              let existingTestCaseFunctionStepId = "'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'";
              const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
              let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input);
              for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
                let generatedTestCaseFunctionStepAttributeId = uuid();
                let testCaseFunctionStepAttributeObject = {
                  TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseFunctionStepAttributeId,
                  STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData['STEP_DEFINITION_ATTRIBUTE_UUID'],
                  TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA: functionStepAttributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'],
                  TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                  TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                  FUNCTION_UUID: functionStepAttributeData['FUNCTION_UUID'],
                  PRE_DEFINED_VALUES_UUID: functionStepAttributeData['PRE_DEFINED_VALUES_UUID'],
                  SCOPE_VARIABLE_TYPE: functionStepAttributeData['SCOPE_VARIABLE_TYPE'],
                  SCOPE_VARIABLE_UUID: functionStepAttributeData['SCOPE_VARIABLE_UUID'],
                  EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'],
                  IS_ANY_VALUE_CHANGED: 'Yes'
                };
                testCaseFunctionStepAttributeValueList.push(testCaseFunctionStepAttributeObject);
              }
              if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
                const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
                let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionUIElementGroupStepQuery, input);
                for (let functionStepUIElementGroupStepData of testCaseFunctionUIElementGroupStepQueryData) {
                  let generatedTestCaseFunctionUIElementGroupStepId = uuid();
                  let testCaseFunctionUIElementGroupStepObject = {
                    TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseFunctionUIElementGroupStepId,
                    TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepUIElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                    CURRENT_PAGE_CONTEXT: functionStepUIElementGroupStepData['CURRENT_PAGE_CONTEXT'],
                    TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
                    TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                    TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                    UI_ELEMENT_GROUP_UUID: functionStepUIElementGroupStepData['UI_ELEMENT_GROUP_UUID'],
                    UI_ELEMENT_GROUP_STEP_UUID: functionStepUIElementGroupStepData['UI_ELEMENT_GROUP_STEP_UUID'],
                    FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: functionStepUIElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'],
                    TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID'],
                    FUNCTION_STEP_UUID: functionStepUIElementGroupStepData['FUNCTION_STEP_UUID'],
                    FUNCTION_UUID: functionStepUIElementGroupStepData['FUNCTION_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  testCaseFunctionUIElementGroupStepList.push(testCaseFunctionUIElementGroupStepObject);
                  let existingTestCaseFunctionUIElementGroupStepId = "'" + functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] + "'";
                  const testCaseFunctionUIElementGroupStepAttributeQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseFunctionUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let testCaseFunctionUIElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
                    'PRIMARYSPRINGFM',
                    testCaseFunctionUIElementGroupStepAttributeQuery,
                    input
                  );
                  for (let testCaseFunctionUIElementGroupStepAttribute of testCaseFunctionUIElementGroupStepAttributeQueryData) {
                    let generatedTestCaseFunctionUIElementGroupStepAttributeId = uuid();
                    let testCaseFunctionUIelementGroupAttributeObject = {
                      TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseFunctionUIElementGroupStepAttributeId,
                      STEP_DEFINITION_ATTRIBUTE_UUID: testCaseFunctionUIElementGroupStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: testCaseFunctionUIElementGroupStepAttribute['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                      TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseFunctionUIElementGroupStepId,
                      TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                      UI_ELEMENT_GROUP_UUID: testCaseFunctionUIElementGroupStepAttribute['UI_ELEMENT_GROUP_UUID'],
                      TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                      PRE_DEFINED_VALUES_UUID: testCaseFunctionUIElementGroupStepAttribute['PRE_DEFINED_VALUES_UUID'],
                      FUNCTION_UUID: testCaseFunctionUIElementGroupStepAttribute['FUNCTION_UUID'],
                      SCOPE_VARIABLE_TYPE: testCaseFunctionUIElementGroupStepAttribute['SCOPE_VARIABLE_TYPE'],
                      SCOPE_VARIABLE_UUID: testCaseFunctionUIElementGroupStepAttribute['SCOPE_VARIABLE_UUID'],
                      EXISTING_TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID:
                        testCaseFunctionUIElementGroupStepAttribute['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
                      IS_ANY_VALUE_CHANGED: 'Yes'
                    };
                    testCaseFunctionUIElementGroupStepAttributeList.push(testCaseFunctionUIelementGroupAttributeObject);
                  }
                }
              }
              if (functionStepData['IS_PURE_NAVIGATION_STEP'] && functionStepData['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
                const testCaseFunctionViewNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NOT NULL AND FUNCTION_STEP_UUID IS NOT NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                let testCaseFunctionViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionViewNavigationQuery, input);
                let functionNavigationCount = 1;
                for (let testCaseViewNavigation of testCaseFunctionViewNavigationQueryData) {
                  let testCaseViewNavigationStepId = uuid();
                  let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] + "'";
                  let testCaseViewNavigationObject = {
                    TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                    VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation['VIEW_NAVIGATION_STEP_UUID'],
                    TEST_CASE_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_NAME'],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                    TEST_CASE_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation['TEST_CASE_VIEW_NAVIGATION_STEP_TYPE'],
                    TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID: functionNavigationCount,
                    CURRENT_PAGE_CONTEXT: testCaseViewNavigation['CURRENT_PAGE_CONTEXT'],
                    NEXT_PAGE_CONTEXT: testCaseViewNavigation['NEXT_PAGE_CONTEXT'],
                    VIEW_UUID: testCaseViewNavigation['VIEW_UUID'],
                    TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                    FUNCTION_UUID: testCaseViewNavigation['FUNCTION_UUID'],
                    FUNCTION_STEP_UUID: testCaseViewNavigation['FUNCTION_STEP_UUID'],
                    IS_ANY_VALUE_CHANGED: 'Yes'
                  };
                  testCaseViewNavigationList.push(testCaseViewNavigationObject);
                  functionNavigationCount++;
                  const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                  let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseViewNavigationAttributeQuery, input);
                  for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
                    let testCaseViewNavigationAttributeId = uuid();
                    let testCaseViewNavigationAttributeObject = {
                      TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                      STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                      TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                      TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                      VIEW_UUID: viewNavigationAttribute['VIEW_UUID'],
                      PRE_DEFINED_VALUES_UUID: viewNavigationAttribute['PRE_DEFINED_VALUES_UUID'],
                      FUNCTION_UUID: viewNavigationAttribute['FUNCTION_UUID'],
                      SCOPE_VARIABLE_TYPE: viewNavigationAttribute['SCOPE_VARIABLE_TYPE'],
                      SCOPE_VARIABLE_UUID: viewNavigationAttribute['SCOPE_VARIABLE_UUID'],
                      EXISTING_TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'],
                      IS_ANY_VALUE_CHANGED: 'Yes'
                    };
                    testCaseViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                  }
                }
              }
            }
          }
        } else if (data['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes' && data['IS_FUNCTION_STEP'] == 'No') {
          const testCaseUIElementStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
          let testCaseUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseUIElementStepQuery, input);
          for (let uiElementGroupStepData of testCaseUIElementStepQueryData) {
            let generatedTestCaseUIElementGroupStepId = uuid();
            let testCaseUIElementGroupStepObject = {
              TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
              TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME: uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME'],
              STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
              CURRENT_PAGE_CONTEXT: uiElementGroupStepData['CURRENT_PAGE_CONTEXT'],
              TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE: uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE'],
              TEST_CASE_STEP_UUID: generatedTestCaseStepId,
              UI_ELEMENT_GROUP_UUID: uiElementGroupStepData['UI_ELEMENT_GROUP_UUID'],
              UI_ELEMENT_GROUP_STEP_UUID: uiElementGroupStepData['UI_ELEMENT_GROUP_STEP_UUID'],
              TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID: uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID'],
              IS_ANY_VALUE_CHANGED: 'Yes'
            };
            testCaseUIElementGroupStepList.push(testCaseUIElementGroupStepObject);
            let existingTestCaseUIElementGroupStepId = "'" + uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'] + "'";
            const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', testCaseFunctionStepAttributeValueQuery, input);
            for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
              let generatedTestCaseUIElementGroupStepAttributeId = uuid();
              let testCaseUIElementGroupStepAttributeobject = {
                TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseUIElementGroupStepAttributeId,
                STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData['STEP_DEFINITION_ATTRIBUTE_UUID'],
                TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: functionStepAttributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
                TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                UI_ELEMENT_GROUP_UUID: functionStepAttributeData['UI_ELEMENT_GROUP_UUID'],
                PRE_DEFINED_VALUES_UUID: functionStepAttributeData['PRE_DEFINED_VALUES_UUID'],
                FUNCTION_UUID: functionStepAttributeData['FUNCTION_UUID'],
                SCOPE_VARIABLE_TYPE: functionStepAttributeData['SCOPE_VARIABLE_TYPE'],
                SCOPE_VARIABLE_UUID: functionStepAttributeData['SCOPE_VARIABLE_UUID'],
                EXISTING_TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'],
                IS_ANY_VALUE_CHANGED: 'Yes'
              };
              testCaseUIElementGroupStepAttributeList.push(testCaseUIElementGroupStepAttributeobject);
            }
          }
        }
      }
      if (input['ORIGINAL_TEST_SET_UUID'] == input['TEST_SET_UUID']) {
        updateSourceUUIDBasedOnTestSetAndTestCase('Yes', 'No');
      } else if (input['ORIGINAL_TEST_SET_UUID'] != input['TEST_SET_UUID']) {
        updateSourceUUIDBasedOnTestSetAndTestCase('No', 'No');
      }
    }
  }
  input['AppEngChildEntity:TEST_CASE_CHILD_OF_TEST_CASE'] = testCaseList;
  input['AppEngChildEntity:TEST_CASE_STEP_NEW'] = testCaseStepList;
  input['AppEngChildEntity:TEST_DATA_SET'] = testDataSet;
  input['AppEngChildEntity:TEST_DATA'] = testData;
  input['AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT'] = testCaseRequirmentList;
  input['AppEngChildEntity:TEST_CASE_STEP_ATTRIBUTE_VALUE'] = testCaseStepAttributeValueList;
  input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP'] = testCaseFunctionStepList;
  input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE'] = testCaseFunctionStepAttributeValueList;
  input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP'] = testCaseFunctionUIElementGroupStepList;
  input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseFunctionUIElementGroupStepAttributeList;
  input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP'] = testCaseUIElementGroupStepList;
  input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseUIElementGroupStepAttributeList;
  input['AppEngChildEntity:FUNCTION'] = functionList;
  input['AppEngChildEntity:FUNCTION_STEP'] = functionStepList;
  input['AppEngChildEntity:FUNCTION_STEP_ATTRIBUTE_VALUE'] = functionStepAttributeValueList;
  input['AppEngChildEntity:FUNCTION_UI_ELEMENT_GROUP_STEP'] = functionUIElementGroupStepList;
  input['AppEngChildEntity:FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = functionUIElementGroupStepAttributeList;
  input['AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP'] = testCaseViewNavigationList;
  input['AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'] = testCaseViewNavigationAttributeValueList;
  input['AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP'] = functionViewNavigationList;
  input['AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'] = functionViewNavigationAttributeValueList;

  input['AppEngChildEntity:VIEW_NAVIGATION_STEP'] = viewNavigationStepList;
  input['AppEngChildEntity:VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE'] = viewNavigationStepAttributeList;
}
