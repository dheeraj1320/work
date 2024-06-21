function generateExcelData(inputData) {
  let mainArray = [];
  for (let data of inputData) {
    let dataArray = [];
    for (let key in data) {
      dataArray.push(data[key]);
    }
    mainArray.push(dataArray);
  }
  return mainArray;
}


try {
  msg.payload.result = {};
  let input = msg.payload.apiRequestBody.baseEntity.records[0];
  msg.payload.result.documentName = input.TEST_CASE_NAME
    ? input.TEST_CASE_NAME.replaceAll(" ", "_")
    : "GeneratedTestCase";
  AppengProcessConfig = global.get("AppengProcessConfig");
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let functionalAreaQuery = `SELECT FUNCTIONAL_AREA_ID as 'App ID',FUNCTIONAL_AREA_NAME as 'App Name','Active' as Status, 'No Action' as Actions,FUNCTIONAL_AREA_UUID as 'App UUID' FROM FUNCTIONAL_AREA WHERE FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
  let functionalAreaQueryData =
    await serviceOrchestrator.selectRecordsUsingQuery(
      "PRIMARYSPRINGFM",
      functionalAreaQuery,
      input
    );
  msg.payload.documentData = {};
  let objectData = {};
  const paramsPattern = /[^{}]+(?=})/g;
  objectData["Application"] = generateExcelData(functionalAreaQueryData);
  let testSetQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_SET_NAME as 'Test Set Name','Active' as Status, 'No Action' as Actions,TEST_SET_UUID as 'Test Set UUID',FUNCTIONAL_AREA_ID as 'App ID' FROM TEST_SET,FUNCTIONAL_AREA WHERE TEST_SET_UUID=:TEST_SET_UUID AND TEST_SET.FUNCTIONAL_AREA_UUID = FUNCTIONAL_AREA.FUNCTIONAL_AREA_UUID`;
  let testSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    "PRIMARYSPRINGFM",
    testSetQuery,
    input
  );
  objectData["Test Set"] = generateExcelData(testSetQueryData);
  let testCaseQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_SEQ_ID as 'Test Case Seq ID',TEST_CASE_NAME as 'Test Case Name','Active' as Status, 'No Action' as Actions,TEST_CASE_UUID as 'Test Case UUID' FROM TEST_CASE,TEST_SET WHERE TEST_CASE.TEST_SET_UUID = TEST_SET.TEST_SET_UUID and TEST_CASE.TEST_CASE_UUID =:TEST_CASE_UUID order by TEST_CASE_SEQ_ID asc`;
  let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    "PRIMARYSPRINGFM",
    testCaseQuery,
    input
  );
  objectData["Test Case"] = generateExcelData(testCaseQueryData);
  let testCaseStepNormalQuery = `SELECT TEST_SET_ID as 'Test Set ID',TEST_CASE_ID as 'Test Case ID',TEST_CASE_STEP_ID as 'Test Case Step ID',TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID',TEST_CASE_STEP_TYPE as 'Test Case Step Type','' as 'Test Case Step Name','' as 'Step Definition Template','' as v1,'' as v2,'' as v3,'' as v4, '' as v5,'' as 'Test Case Sep Group Name','' as reserved2,(if(!isnull(tcs.NEXT_PAGE_CONTEXT),(SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.NEXT_PAGE_CONTEXT ),( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcs.CURRENT_PAGE_CONTEXT))) as 'Page ID','Active' as Status,TEST_CASE_STEP_UUID as 'Test Case Step UUID',TEST_CASE_STEP_ATTRIBUTE_KEYS as 'ATTRIBUTE_KEYS' FROM TEST_CASE_STEP tcs ,TEST_CASE tc,TEST_SET ts WHERE tc.TEST_CASE_UUID=tcs.TEST_CASE_UUID and ts.TEST_SET_UUID=tcs.TEST_SET_UUID and tc.TEST_CASE_UUID=:TEST_CASE_UUID AND IS_UI_ELEMENT_GROUP_STEP='No' and IS_FUNCTION_STEP ='No' ORDER BY TEST_CASE_STEP_ID,TEST_CASE_STEP_SEQ_ID asc`;
  let testCaseStepNormalQueryData =
    await serviceOrchestrator.selectRecordsUsingQuery(
      "PRIMARYSPRINGFM",
      testCaseStepNormalQuery,
      input
    );
  let testCaseFunctionStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat(TEST_CASE_STEP_ID ,'-',TEST_CASE_FUNCTION_STEP_ID) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_FUNCTION_STEP_TYPE as 'Test Case Step Type','' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function' ) as 'Test Case Step Group Name', '' as reserved2, ( if( ! isnull(tcfs.NEXT_PAGE_CONTEXT), ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.NEXT_PAGE_CONTEXT ), ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfs.CURRENT_PAGE_CONTEXT ) ) ) as 'Page ID', 'Active' as Status, TEST_CASE_FUNCTION_STEP_UUID as 'Test Case Step UUID',TEST_CASE_FUNCTION_STEP_ATTRIBUTE_KEYS as 'ATTRIBUTE_KEYS' FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and tc.TEST_CASE_UUID =:TEST_CASE_UUID and tcs.IS_FUNCTION_STEP = 'Yes' and tcfs.IS_UI_ELEMENT_GROUP_STEP = 'No' ORDER BY TEST_CASE_STEP_ID, TEST_CASE_FUNCTION_STEP_ID asc`;
  let testCaseFunctionStepQueryData =
    await serviceOrchestrator.selectRecordsUsingQuery(
      "PRIMARYSPRINGFM",
      testCaseFunctionStepQuery,
      input
    );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(
    testCaseFunctionStepQueryData
  );
  let testCaseFunctionUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat(TEST_CASE_STEP_ID ,'-',TEST_CASE_FUNCTION_STEP_ID,'-',TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type','' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat(( SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION f WHERE f.FUNCTION_UUID = tcfs.FUNCTION_UUID ), ' Function - ',( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcfuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group') as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcfuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID',TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS as 'ATTRIBUTE_KEYS' FROM TEST_CASE_STEP tcs, TEST_CASE_FUNCTION_STEP tcfs, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP tcfuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcfs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and tcfs.TEST_CASE_FUNCTION_STEP_UUID = tcfuegs.TEST_CASE_FUNCTION_STEP_UUID and tc.TEST_CASE_UUID =:TEST_CASE_UUID and tcs.IS_FUNCTION_STEP = 'Yes' and tcfs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID asc, TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
  let testCaseFunctionUIElementGroupStepQueryData =
    await serviceOrchestrator.selectRecordsUsingQuery(
      "PRIMARYSPRINGFM",
      testCaseFunctionUIElementGroupStepQuery,
      input
    );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(
    testCaseFunctionUIElementGroupStepQueryData
  );
  let testCaseUIElementGroupStepQuery = `SELECT TEST_SET_ID as 'Test Set ID', TEST_CASE_ID as 'Test Case ID', concat(TEST_CASE_STEP_ID ,'-',TEST_CASE_UI_ELEMENT_GROUP_STEP_ID) as 'Test Case Step ID', TEST_CASE_STEP_SEQ_ID as 'Test Case Step Seq ID', TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE as 'Test Case Step Type','' as 'Test Case Step Name', '' as 'Step Definition Template', '' as v1, '' as v2, '' as v3, '' as v4, '' as v5, concat( ( SELECT UI_ELEMENT_GROUP_NAME FROM UI_ELEMENT_GROUP ueg WHERE ueg.UI_ELEMENT_GROUP_UUID = tcuegs.UI_ELEMENT_GROUP_UUID ), ' UI Element Group' ) as 'Test Case Step Group Name', '' as reserved2, ( SELECT PAGE_ID FROM PAGE pn WHERE pn.PAGE_UUID = tcuegs.CURRENT_PAGE_CONTEXT ) as 'Page ID', 'Active' as Status, TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID as 'Test Case Step UUID',TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS as 'ATTRIBUTE_KEYS' FROM TEST_CASE_STEP tcs, TEST_CASE_UI_ELEMENT_GROUP_STEP tcuegs, TEST_CASE tc, TEST_SET ts WHERE tc.TEST_CASE_UUID = tcs.TEST_CASE_UUID and ts.TEST_SET_UUID = tcs.TEST_SET_UUID and tcuegs.TEST_CASE_STEP_UUID = tcs.TEST_CASE_STEP_UUID and tc.TEST_CASE_UUID =:TEST_CASE_UUID and tcs.IS_UI_ELEMENT_GROUP_STEP = 'Yes' ORDER BY TEST_CASE_STEP_ID, TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
  let testCaseUIElementGroupStepQueryData =
    await serviceOrchestrator.selectRecordsUsingQuery(
      "PRIMARYSPRINGFM",
      testCaseUIElementGroupStepQuery,
      input
    );
  testCaseStepNormalQueryData = testCaseStepNormalQueryData.concat(
    testCaseUIElementGroupStepQueryData
  );
  for (let data of testCaseStepNormalQueryData) {
    if (data && data["ATTRIBUTE_KEYS"]) {
      let attributeKeysList = data["ATTRIBUTE_KEYS"]
        ? JSON.parse(data["ATTRIBUTE_KEYS"])
        : [];
      let inputStepType = data["Test Case Step Type"];
      let firstIndexValue = attributeKeysList.shift();
      let firstKeyValue = firstIndexValue
        ? firstIndexValue.match(paramsPattern)
        : [];
      let stepDefinitionVerbiageList = firstKeyValue.length
        ? firstKeyValue[0].split("@#$")
        : [];
      let stepDefTemplateVerbiageName = "";
      if (stepDefinitionVerbiageList.length) {
        const stepDefTemplateVerbiageQuery = `SELECT STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME FROM STEP_DEFINITION_TEMPLATE_VERBIAGE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID in(${stepDefinitionVerbiageList[1]})`;
        let stepDefTemplateVerbiageQueryData =
          await serviceOrchestrator.selectSingleRecordUsingQuery(
            `PRIMARYSPRINGFM`,
            stepDefTemplateVerbiageQuery,
            input
          );
        stepDefTemplateVerbiageName =
          stepDefTemplateVerbiageQueryData[
            "STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME"
          ];
        if (attributeKeysList && attributeKeysList.length) {
          for (let attribute of attributeKeysList) {
            let extractParams = attribute.match(paramsPattern);
            let keyValue = extractParams[0].split("@#$");
            switch (keyValue[0]) {
              case "PageName":
                {
                  const pageNewQuery = `SELECT PAGE_NAME FROM PAGE WHERE PAGE_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
                  let pageNewQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      pageNewQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<Page Name>",
                      function () {
                        return `'` + pageNewQueryData["PAGE_NAME"] + `'`;
                      }
                    );
                }
                break;
              case "UIElementName":
                {
                  const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
                  let uiElementQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      uiElementQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<UI Element Name>",
                      function () {
                        return (
                          `'` + uiElementQueryData["UI_ELEMENT_NAME"] + `'`
                        );
                      }
                    );
                }
                break;
              case "UIElementType":
                {
                  const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID in(${keyValue[1]})`;
                  let uiElementTypeQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      uiElementTypeQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<UI Element Type>",
                      function () {
                        return (
                          `'` +
                          uiElementTypeQueryData["UI_ELEMENT_TYPE_NAME"] +
                          `'`
                        );
                      }
                    );
                }
                break;
              case "UIElementValue":
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<UI Element Value>",
                      keyValue[1]
                        ? function () {
                            return keyValue[1];
                          }
                        : `' '`
                    );
                }
                break;
              case "KeyNameinKeypad":
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<Key Name in Keypad>",
                      function () {
                        return keyValue[1];
                      }
                    );
                }
                break;
              case "EventName":
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<Event Name>",
                      keyValue[1]
                        ? function () {
                            return keyValue[1];
                          }
                        : `' '`
                    );
                }
                break;
              case "ConfirmUIElementValue":
                stepDefTemplateVerbiageName =
                  stepDefTemplateVerbiageName.replaceAll(
                    "<Confirm UI Element Value>",
                    keyValue[1]
                      ? function () {
                          return keyValue[1];
                        }
                      : `' '`
                  );
                break;
              case "FunctionName":
                {
                  const functionNameQuery = `SELECT FUNCTION_NAME FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID in(${keyValue[1]})`;
                  let functionNameQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      functionNameQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<Function Name>",
                      function () {
                        return (
                          `'` + functionNameQueryData["FUNCTION_NAME"] + `'`
                        );
                      }
                    );
                }
                break;
              case "UIElementName1":
                {
                  const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
                  let uiElementQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      uiElementQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<UI Element Name 1>",
                      function () {
                        return (
                          `'` + uiElementQueryData["UI_ELEMENT_NAME"] + `'`
                        );
                      }
                    );
                }
                break;
              case "UIElementValue1":
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<UI Element Value 1>",
                      keyValue[1]
                        ? function () {
                            return keyValue[1];
                          }
                        : `' '`
                    );
                }
                break;
              case "UserActionName":
                {
                  const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID in(${keyValue[1]}) AND FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
                  let uiElementQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      uiElementQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<User Action Name>",
                      function () {
                        return (
                          `'` + uiElementQueryData["UI_ELEMENT_NAME"] + `'`
                        );
                      }
                    );
                }
                break;
              case "UserActionType":
                {
                  const uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID in(${keyValue[1]})`;
                  let uiElementTypeQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      `PRIMARYSPRINGFM`,
                      uiElementTypeQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<User Action Type>",
                      function () {
                        return (
                          `'` +
                          uiElementTypeQueryData["UI_ELEMENT_TYPE_NAME"] +
                          `'`
                        );
                      }
                    );
                }
                break;
              case "UIElementGroupName":
                {
                  let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP WHERE UI_ELEMENT_GROUP_UUID in(${keyValue[1]}) and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID`;
                  let uiElementGroupStepQueryData =
                    await serviceOrchestrator.selectSingleRecordUsingQuery(
                      "PRIMARYSPRINGFM",
                      uiElementGroupStepQuery,
                      input
                    );
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<UI Element Group Name>",
                      function () {
                        return (
                          `'` +
                          uiElementGroupStepQueryData["UI_ELEMENT_GROUP_NAME"] +
                          `'`
                        );
                      }
                    );
                }
                break;
              case "PageNumber":
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<Page Number>",
                      keyValue[1]
                        ? function () {
                            return keyValue[1];
                          }
                        : `' '`
                    );
                }
                break;
              case "DataKey":
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<Data Key>",
                      keyValue[1]
                        ? function () {
                            return keyValue[1];
                          }
                        : `' '`
                    );
                }
                break;
              case "DataValue":
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<Data Value>",
                      keyValue[1]
                        ? function () {
                            return keyValue[1];
                          }
                        : `' '`
                    );
                }
                break;
              case "FileName":
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<File Name>",
                      keyValue[1]
                        ? function () {
                            return keyValue[1];
                          }
                        : `' '`
                    );
                }
                break;
              case "DocumentParserName":
                {
                  stepDefTemplateVerbiageName =
                    stepDefTemplateVerbiageName.replaceAll(
                      "<Document Parser Name>",
                      keyValue[1]
                        ? function () {
                            return keyValue[1];
                          }
                        : `' '`
                    );
                }
                break;
            }
          }
        }
      }
      let getKeywordByStepType =
        inputStepType === "Pre Condition"
          ? "Given "
          : inputStepType === "User Input"
          ? "When "
          : inputStepType === "Expected Result"
          ? "Then "
          : "";
      data["Test Case Step Name"] = stepDefinitionVerbiageList.length
        ? getKeywordByStepType + stepDefTemplateVerbiageName
        : "";
      delete data["ATTRIBUTE_KEYS"];
    }
  }
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    testCaseStepNormalQueryData.sort((a, b) => {
      let afield1 = a["Test Case ID"];
      let bfield1 = b["Test Case ID"];
      let adata = a["Test Case Step ID"].toString().split("-");
      let bdata = b["Test Case Step ID"].toString().split("-");
      let afield2 = a["Test Case Step Seq ID"];
      let bfield2 = b["Test Case Step Seq ID"];
      let afield3 = adata[1];
      let bfield3 = bdata[1];
      let afield4 = adata[2];
      let bfield4 = bdata[2];
      return (
        (afield1 && bfield1 && afield1 - bfield1) ||
        (afield2 && bfield2 && afield2 - bfield2) ||
        (afield3 && bfield3 && afield3 - bfield3) ||
        (afield4 && bfield4 && afield4 - bfield4)
      );
    });
  }
  let originalList = generateExcelData(testCaseStepNormalQueryData);
  let dupList = [];
  let index = 0;
  if (originalList.length) {
    if (originalList[0].length) {
      let firstvalue = originalList[0][1];
      for (let i = 0; i < originalList.length; i++) {
        if (firstvalue == originalList[i][1]) {
          let mng = originalList[i];
          index = index + 1;
          originalList[i][3] = index;
          dupList.push(mng);
        } else {
          firstvalue = originalList[i][1];
          let mng = originalList[i];
          index = 1;
          originalList[i][3] = index;
          dupList.push(mng);
        }
      }
    }
  }
  console.log(dupList);
  objectData["Test Case Step"] = dupList;
  let currentPageIds = "";
  if (testCaseStepNormalQueryData && testCaseStepNormalQueryData.length) {
    currentPageIds = testCaseStepNormalQueryData
      .map((item) => `'` + item["Page ID"] + `'`)
      .join(",");
  }
  let pageNewQuery = `SELECT distinct PAGE_ID as 'Page ID',PAGE_NAME as 'Page Name',DIRECT_ACCESS_URL as 'Page Direct Access URL','Active' as Status,'No Action' as Actions,PAGE.PAGE_UUID as 'Page UUID' FROM PAGE WHERE PAGE_ID in(${
    currentPageIds ? currentPageIds : `''`
  }) and FUNCTIONAL_AREA_UUID=:FUNCTIONAL_AREA_UUID order by PAGE_ID asc`;
  let pageNewQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    "PRIMARYSPRINGFM",
    pageNewQuery,
    input
  );
  objectData["Page"] = generateExcelData(pageNewQueryData);
  let pageList = pageNewQueryData
    .map((item) => `'` + item["Page UUID"] + `'`)
    .join(",");
  let uiElementQuery = `SELECT PAGE_ID as 'Page ID',UI_ELEMENT_ID as 'UI ELement ID',UI_ELEMENT_NAME as 'UI Element Name',(SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_MASTER.UI_ELEMENT_TYPE_UUID=UI_ELEMENT.UI_ELEMENT_TYPE) as 'Element Type',LOCATOR_TYPE as 'Locator Type', LOCATOR_VALUE as 'Locator Value',if((isnull(IS_PAGE_IDENTIFIER) or IS_PAGE_IDENTIFIER =''),'No',IS_PAGE_IDENTIFIER) as 'Is Page Identifier','Active' as Status, 'No Action' as Actions, EVENT_NAME as 'Event Name',UI_ELEMENT_UUID as 'UI Element UUID' FROM UI_ELEMENT ,PAGE WHERE PAGE.PAGE_UUID = UI_ELEMENT.PAGE_NEW_UUID and UI_ELEMENT.PAGE_NEW_UUID in(${
    pageList ? pageList : `''`
  }) order by UI_ELEMENT_ID asc`;
  let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    "PRIMARYSPRINGFM",
    uiElementQuery,
    input
  );
  if (uiElementQueryData && uiElementQueryData.length) {
    uiElementQueryData.sort((a, b) => {
      let afield1 = a["Page ID"];
      let bfield1 = b["Page ID"];
      let afield2 = a["UI ELement ID"];
      let bfield2 = b["UI ELement ID"];
      return (
        (afield1 && bfield1 && afield1 - bfield1) ||
        (afield2 && bfield2 && afield2 - bfield2)
      );
    });
  }
  objectData["UI Element"] = generateExcelData(uiElementQueryData);
  Object.assign(msg.payload.documentData, objectData);
  msg.payload.result.message = "Document Downloaded";
  msg.payload.templateFile = "Feature_Management_Test_Case_Template.xlsm";
  node.send(msg);
} catch (t) {
  console.log("Errorr Occured", t.message);
  return;
}
