if (input.compositeEntityAction == "Update") {
  
  console.log('NodeBusinessRule Started');
  let VIEW_NAVIGATION_STEP = [];
  let VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE = [];

  function deleteRecord(
      primarykey,
      primarykeyvalue,
      tablename,
      functionalareauuid
  ) {
      let deleteTableData = {};
      deleteTableData[primarykey] = primarykeyvalue;
      deleteTableData["compositeEntityAction"] = "Delete";
      deleteTableData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;

      if (tablename == "VIEW_NAVIGATION_STEP") {
          VIEW_NAVIGATION_STEP.push(deleteTableData);
      } else if (tablename == "VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE") {
          VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE.push(deleteTableData);
      }
  }

  // Delete Records
  input["Informational_label"] = "";
  if (input["PAGE_ACCESS_RELATIVE_URL"]) {
      //for VIEW_NAVIGATION_STEP
      let QuerytoFetchNavigationStep = `select VIEW_NAVIGATION_STEP_UUID from VIEW_NAVIGATION_STEP where VIEW_UUID in (select VIEW_UUID from PAGE_VIEW where PAGE_UUID=:PAGE_UUID AND IS_DEFAULT_VIEW = 'Yes') AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      let QuerytoFetchNavigationStepData =
          await serviceOrchestrator.selectRecordsUsingQuery(
              "PRIMARYSPRINGFM",
              QuerytoFetchNavigationStep,
              input
          );
      let QuerytoFetchNavigationStepRecords = JSON.parse(
          JSON.stringify(QuerytoFetchNavigationStepData),
      );

      //for VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE table
      let QuerytoFetchNavigationStepAttribute = `select VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID from  VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where VIEW_UUID in (select VIEW_UUID from PAGE_VIEW where PAGE_UUID=:PAGE_UUID AND IS_DEFAULT_VIEW = 'Yes') AND FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      let QuerytoFetchNavigationStepAttributeData =
          await serviceOrchestrator.selectRecordsUsingQuery(
              "PRIMARYSPRINGFM",
              QuerytoFetchNavigationStepAttribute,
              input
          );
      let QuerytoFetchNavigationStepAttributeDataRecords = JSON.parse(JSON.stringify(QuerytoFetchNavigationStepAttributeData));

      if (QuerytoFetchNavigationStepRecords.length > 0) {
          for (let key in QuerytoFetchNavigationStepRecords) {
              deleteRecord("VIEW_NAVIGATION_STEP_UUID",QuerytoFetchNavigationStepRecords[key].VIEW_NAVIGATION_STEP_UUID,"VIEW_NAVIGATION_STEP",input["APP_LOGGED_IN_FUNTIONAL_AREA_ID"]);
          }
      }

      if (QuerytoFetchNavigationStepAttributeDataRecords.length > 0) {
          for (let key in QuerytoFetchNavigationStepAttributeDataRecords) {
              deleteRecord(
                  "VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID",
                  QuerytoFetchNavigationStepAttributeDataRecords[key].VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID,
                  "VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE",
                  input["APP_LOGGED_IN_FUNTIONAL_AREA_ID"]
              );
          }
      }

      // Update IS_PURE_NAVIGATION_STEP for TEST_CASE_STEP
      let QueryToFetchTestCaseStep = `select tcs.* from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_STEP tcs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

      let QueryToFetchTestCaseStepData =
          await serviceOrchestrator.selectRecordsUsingQuery(
              "PRIMARYSPRINGFM",
              QueryToFetchTestCaseStep,
              input
          );
      let QuerytoFetchTestCaseStepRecords = JSON.parse(JSON.stringify(QueryToFetchTestCaseStepData));

      let TestCaseStep = [];
      for (let key in QuerytoFetchTestCaseStepRecords) {
          let data = {};

          data["TEST_CASE_STEP_UUID"] =
              QuerytoFetchTestCaseStepRecords[key].TEST_CASE_STEP_UUID;
          data["IS_PURE_NAVIGATION_STEP"] = "No";

          TestCaseStep.push(data);
      }

      // Update IS_PURE_NAVIGATION_STEP for TEST_CASE_FUNCTION_STEP
      let QueryToFetchTestCaseFunctionStep = `
          select tcfs.TEST_CASE_FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_FUNCTION_STEP tcfs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcfs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

      let QueryToFetchTestCaseFunctionStepData =
          await serviceOrchestrator.selectRecordsUsingQuery(
              "PRIMARYSPRINGFM",
              QueryToFetchTestCaseFunctionStep,
              input
          );
      let QuerytoFetchTestCaseFunctionStepRecords = JSON.parse(JSON.stringify(QueryToFetchTestCaseFunctionStepData));

      let TestCaseFunctionStep = [];

      for (let key in QuerytoFetchTestCaseFunctionStepRecords) {
          let data = {};
          data["TEST_CASE_FUNCTION_STEP_UUID"] =
              QuerytoFetchTestCaseFunctionStepRecords[
                  key
              ].TEST_CASE_FUNCTION_STEP_UUID;
          data["IS_PURE_NAVIGATION_STEP"] = "No";

          TestCaseFunctionStep.push(data);
      }

      // Update IS_PURE_NAVIGATION_STEP for FUNCTION_STEP
      let QueryToFetchFunctionStep = `
      select fs.FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv 
      join FUNCTION_STEP fs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = fs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where fs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

      let QueryToFetchFunctionStepData =
          await serviceOrchestrator.selectRecordsUsingQuery(
              "PRIMARYSPRINGFM",
              QueryToFetchFunctionStep,
              input
          );
      let QuerytoFetchFunctionStepRecords = JSON.parse(JSON.stringify(QueryToFetchFunctionStepData));

      let FunctionStep = [];

      for (let key in QuerytoFetchFunctionStepRecords) {
          let data = {};
          data["FUNCTION_STEP_UUID"] =
              QuerytoFetchFunctionStepRecords[key].FUNCTION_STEP_UUID;
          data["IS_PURE_NAVIGATION_STEP"] = "No";

          FunctionStep.push(data);
      }

      input["AppEngChildEntity:TEST_CASE_STEP_NEW"] = TestCaseStep;
      input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP"] = TestCaseFunctionStep;
      input["AppEngChildEntity:FUNCTION_STEP"] = FunctionStep;
  } else {
      // Update IS_PURE_NAVIGATION_STEP for TEST_CASE_STEP
      let QueryToFetchTestCaseStep = `select tcs.TEST_CASE_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_STEP tcs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

      let QueryToFetchTestCaseStepData =
          await serviceOrchestrator.selectRecordsUsingQuery(
              "PRIMARYSPRINGFM",
              QueryToFetchTestCaseStep,
              input
          );
      let QuerytoFetchTestCaseStepRecords = JSON.parse(
          JSON.stringify(QueryToFetchTestCaseStepData),
      );

      let TestCaseStep = [];

      for (let key in QuerytoFetchTestCaseStepRecords) {
          let data = {};
          data["TEST_CASE_STEP_UUID"] =
              QuerytoFetchTestCaseStepRecords[key].TEST_CASE_STEP_UUID;
          data["IS_PURE_NAVIGATION_STEP"] = "Yes";

          TestCaseStep.push(data);
      }

      // Update IS_PURE_NAVIGATION_STEP for TEST_CASE_FUNCTION_STEP
      let QueryToFetchTestCaseFunctionStep = `
          select tcfs.TEST_CASE_FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_FUNCTION_STEP tcfs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcfs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

      let QueryToFetchTestCaseFunctionStepData =
          await serviceOrchestrator.selectRecordsUsingQuery(
              "PRIMARYSPRINGFM",
              QueryToFetchTestCaseFunctionStep,
              input
          );
      let QuerytoFetchTestCaseFunctionStepRecords = JSON.parse(
          JSON.stringify(QueryToFetchTestCaseFunctionStepData),
      );

      let TestCaseFunctionStep = [];

      for (let key in QuerytoFetchTestCaseFunctionStepRecords) {
          let data = {};
          data["TEST_CASE_FUNCTION_STEP_UUID"] =
              QuerytoFetchTestCaseFunctionStepRecords[
                  key
              ].TEST_CASE_FUNCTION_STEP_UUID;
          data["IS_PURE_NAVIGATION_STEP"] = "Yes";

          TestCaseFunctionStep.push(data);
      }

      // Update IS_PURE_NAVIGATION_STEP for FUNCTION_STEP
      let QueryToFetchFunctionStep = `
      select fs.FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv 
      join FUNCTION_STEP fs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = fs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where fs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes' `;

      let QueryToFetchFunctionStepData =
          await serviceOrchestrator.selectRecordsUsingQuery(
              "PRIMARYSPRINGFM",
              QueryToFetchFunctionStep,
              input
          );
      let QuerytoFetchFunctionStepRecords = JSON.parse(
          JSON.stringify(QueryToFetchFunctionStepData),
      );

      let FunctionStep = [];

      for (let key in QuerytoFetchFunctionStepRecords) {
          let data = {};
          data["FUNCTION_STEP_UUID"] =
              QuerytoFetchFunctionStepRecords[key].FUNCTION_STEP_UUID;
          data["IS_PURE_NAVIGATION_STEP"] = "Yes";

          FunctionStep.push(data);
      }

      input["AppEngChildEntity:TEST_CASE_STEP_NEW"] = TestCaseStep;
      input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP"] = TestCaseFunctionStep;
      input["AppEngChildEntity:FUNCTION_STEP"] = FunctionStep;
  }

  input["AppEngChildEntity:VIEW_NAVIGATION_STEP"] = VIEW_NAVIGATION_STEP;
  input["AppEngChildEntity:VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE"] = VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE;
}