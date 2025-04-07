let functionStepAttributeValueArray = [];
let functionStepList = [];
let functionUIElementGroupStepList = [];
let functionUIElementGroupStepAttributeList = [];
let testCaseFunctionStepArray = [];
let testCaseFunctionStepAttributeValueArray = [];
let testCaseFunctionUIElementGroupStepList = [];
let testCaseFunctionUIElementGroupStepAttributeList = [];
let functionViewNavigationStepList = [];
let functionViewNavigationStepAttributeList = [];
let testCaseViewNavigationStepList = [];
let testCaseViewNavigationStepAttributeList = [];
function isDataAvailable(str) {
  if (str === null || str === undefined || str.trim() === '' || str === 'null' || str === "' '" || str === 'undefined') {
    return false;
  } else {
    return true;
  }
}

// firing query to get all the step definition for particular stap def name (verbiage)
async function fetchStepDefinitionTemplateVerbiage(stepDefTemplateVerbiageId) {
  let result = [];
  // firing query to get all the step definition for particular stap def name (verbiage)
  const stepDefAttributeQuery = `SELECT sda.STEP_DEFINITION_ATTRIBUTE_UUID,sda.STEP_DEFINITION_ATTRIBUTE_MASTER_UUID,sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME,sdtv.IS_PURE_NAVIGATION_STEP FROM STEP_DEFINITION_ATTRIBUTE sda,STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv where sda.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID=sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID and sda.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID in(${stepDefTemplateVerbiageId}) order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
  let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input);
  if (stepDefAttributeQueryData.length) {
    result = stepDefAttributeQueryData;
  } else {
    const stepDefQuery = `SELECT STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME,IS_PURE_NAVIGATION_STEP FROM STEP_DEFINITION_TEMPLATE_VERBIAGE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID in(${stepDefTemplateVerbiageId})`;
    let stepDefQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefQuery, input);
    if (stepDefQueryData.length) {
      result = stepDefQueryData;
    }
  }
  return result;
}

function getDataFromAttributeUUID(attributeValueQueryData, stepDefArrributeId) {
  let result = attributeValueQueryData.filter((item) => item['STEP_DEFINITION_ATTRIBUTE_UUID'] == stepDefArrributeId);
  if (result && result.length) {
      return result[0]['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'];
  } else {
      return '';
  }
}

function updateTestCaseFunctionStepAttributeValue(testCaseFunctionStep,stepDefAttributeData,testCaseFunctionStepAttributeValueQueryData) {
  for (let codeDesc of stepDefAttributeData) {
    if (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] && codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']) {
      let object = {...testCaseFunctionStep};
      object['compositeEntityAction'] = "Update";
      object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
      object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'] = getDataFromAttributeUUID(testCaseFunctionStepAttributeValueQueryData, codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']);
      switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
        case '57b76ab3-8112-4343-af0f-49643c808bf7':
          let currentPage = input['isMoreThanOneAttribute'] && input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = currentPage;
          break;

        case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME'];
          break;

        case '7f855066-ad39-4325-8108-30befb2447e6':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_TYPE'];
          break;

        case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE'];
          if (input['PRE_DEFINED_VALUES_UUID'] && input['PRE_DEFINED_VALUES_UUID'] != 'a1112471-fd9e-11ef-ba34-02a48541b261') {
            object['PRE_DEFINED_VALUES_UUID'] = input['PRE_DEFINED_VALUES_UUID']
          }
          break;

        case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['KEY_NAME_IN_KEY_PAD'];
          break;

        case '005d158d-428c-4bca-ae2d-1c3f9630b549':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['EVENT_NAME'];
          break;

        case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['CONFIRM_UI_ELEMENT_VALUE'];
          break;

        case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a': {
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME_1'];
        }
          break;

        case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a': {
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE_1'];
          if (input['PRE_DEFINED_VALUES_UUID_1'] && input['PRE_DEFINED_VALUES_UUID_1'] != 'a1112471-fd9e-11ef-ba34-02a48541b261') {
            object['PRE_DEFINED_VALUES_UUID'] = input['PRE_DEFINED_VALUES_UUID_1']
          }
        }
          break;

        // user action name
        case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['USER_ACTION_NAME'];
          break;
        // user action type
        case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['USER_ACTION_TYPE'];
          break;

        case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_GROUP_UUID'];
          break;

        // page number
        case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['PAGE_NUMBER'];
          break;

        case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['DATA_VALUE'];
          break;

        case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['DATA_KEY'];
          break;

        case 'ceb66327-216f-42fd-845b-9f4543c62baa':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['FILE_NAME'];
          break;

        case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['DOCUMENT_PARSER_NAME'];
          break;

        case '36880b70-2e33-11ef-b3ef-e52f192c3af0':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['API_UUID'];
          break;

        case '46136260-2e33-11ef-b3ef-e52f192c3af0':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['API_ATTRIBUTE_NAME'];
          break;

        case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['API_ATTRIBUTE_VALUE'];
          break;

        case '833eb770-2e33-11ef-9033-4bb93e602d01':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['RESPONSE_CODE_VALUE'];
          break;

        case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd': {
          let currentPage = input['NEXT_PAGE_CONTEXT'];
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = currentPage;
        }
          break;

        case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_STATE'];
          break;

        case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['TIMEOUT'];;
          break;

        case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['TEST_SET_SCOPE_VARIABLE'];
          break;

        case '842981e7-e484-11ef-904e-02c8cad0208d':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['TEST_CASE_SCOPE_VARIABLE'];
          break;

        case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['TIME_INTERVAL'];
          break;

        case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['ATTEMPTS'];
          break;

        case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['COLUMN_HEADER'];
          break;

        case '75b16425-1531-4cee-8c09-30f5be70c4b0':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['CELL_VALUE'];
          break;

        case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['ROW_NUMBER'];
          break;

        case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['TABLE_NAME'];
          break;

        case '078e6534-f38f-4aad-b89d-cad8216ad86b':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['COLUMN_HEADER_1'];
          break;

        case 'ba1ef281-412a-4544-b615-7767b06eb489':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['CELL_VALUE_1'];
          break;

        case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['COLUMN_NUMBER'];
          break;

        case '28058e26-fa09-42fb-868a-1988bd0a746c':
          object['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = input['FILE_FULL_PATH'];
          break;

        default: null
      }

      if (!['005d158d-428c-4bca-ae2d-1c3f9630b549', '7f855066-ad39-4325-8108-30befb2447e6'].includes(codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'])) {
        testCaseFunctionStepAttributeValueArray.push(object);
      }
    }
  }
}

async function updateTestCaseFunctionStepAttributeData() {
  let testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where FUNCTION_STEP_UUID=:FUNCTION_STEP_UUID  and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
  for (let testCaseFunctionStep of testCaseFunctionStepQueryData) {
    let testCaseFunctionStepId = "'" + testCaseFunctionStep['TEST_CASE_FUNCTION_STEP_UUID'] + "'";

    let testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);

    updateTestCaseFunctionStepAttributeValue(testCaseFunctionStep,stepDefAttributeQueryData,testCaseFunctionStepAttributeValueQueryData);
   
   // await deleteTestCaseFunctionStepAttributeData(testCaseFunctionStepId);
  }
}


let stepDefAttributeQueryData = await fetchStepDefinitionTemplateVerbiage("'" + input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] + "'");
let stepDefVerbiageStr = stepDefAttributeQueryData && stepDefAttributeQueryData.length ? stepDefAttributeQueryData[0]['STEP_DEFINITION_TEMPLATE_VERBIAGE_NAME'] : '';

// this createFunctionStepAttributeValue function is responsible to create the record for function step attribute value table and also responsible to generete the actual step definition based on selected verbiage
async function createFunctionStepAttributeValue(stepDefAttributeData) {
  for (let codeDesc of stepDefAttributeData) {
    if (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'] && codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID']) {
      let object = {};
      object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
      object['FUNCTION_UUID'] = input['FUNCTION_UUID'];
      switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
        case '57b76ab3-8112-4343-af0f-49643c808bf7':
          let currentPage = input['isMoreThanOneAttribute'] && input['NEXT_PAGE_CONTEXT'] ? input['NEXT_PAGE_CONTEXT'] : input['CURRENT_PAGE_CONTEXT'];
          // input['CURRENT_PAGE_CONTEXT'] = currentPage;
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = currentPage;
          let pageNewQuery = `SELECT PAGE_NAME,PAGE_ACCESS_RELATIVE_URL FROM PAGE WHERE PAGE_UUID=${"'" + currentPage + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", pageNewQuery, input);
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Page Name>', function () { return "'" + pageNewQueryData['PAGE_NAME'] + "'" });

          const stepDefQuery = `SELECT IS_PURE_NAVIGATION_STEP FROM STEP_DEFINITION_TEMPLATE_VERBIAGE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = '${input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID']}'`;
          let stepDefQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", stepDefQuery, input);
          if (stepDefQueryData['IS_PURE_NAVIGATION_STEP'] == 'Yes' && !pageNewQueryData['PAGE_ACCESS_RELATIVE_URL']) {
            input['IS_PURE_NAVIGATION_STEP'] = 'Yes';
          } else {
            input['IS_PURE_NAVIGATION_STEP'] = 'No';
          }

          break;

        case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME'];
          let uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element Name>', function () { return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'" });
          break;

        case '7f855066-ad39-4325-8108-30befb2447e6':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_TYPE'];
          let uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID=:UI_ELEMENT_TYPE`;
          let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input);
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element Type>', function () { return "'" + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + "'" });
          break;

        case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element Value>', input['UI_ELEMENT_VALUE'] ? function () { return "'" + input['UI_ELEMENT_VALUE'] + "'" } : "' '");
          if (input['PRE_DEFINED_VALUES_UUID'] && input['PRE_DEFINED_VALUES_UUID'] != 'a1112471-fd9e-11ef-ba34-02a48541b261') {
            object['PRE_DEFINED_VALUES_UUID'] = input['PRE_DEFINED_VALUES_UUID']
          }
          break;

        case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['KEY_NAME_IN_KEY_PAD'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Key Name in Keypad>', function () { return "'" + input['KEY_NAME_IN_KEY_PAD'] + "'" });
          break;

        case '005d158d-428c-4bca-ae2d-1c3f9630b549':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['EVENT_NAME'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Event Type>', input['EVENT_NAME'] ? function () { return "'" + input['EVENT_NAME'] + "'" } : "' '");
          break;

        case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['CONFIRM_UI_ELEMENT_VALUE'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Confirm UI Element Value>', input['CONFIRM_UI_ELEMENT_VALUE'] ? function () { return "'" + input['CONFIRM_UI_ELEMENT_VALUE'] + "'" } : "' '");
          break;

        case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a': {
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_NAME_1'];
          let uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:UI_ELEMENT_NAME_1 AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element Name 1>', function () { return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'" });
        }
          break;

        case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a': {
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_VALUE_1'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element Value 1>', input['UI_ELEMENT_VALUE_1'] ? function () { return "'" + input['UI_ELEMENT_VALUE_1'] + "'" } : "' '");
          if (input['PRE_DEFINED_VALUES_UUID_1'] && input['PRE_DEFINED_VALUES_UUID_1'] != 'a1112471-fd9e-11ef-ba34-02a48541b261') {
            object['PRE_DEFINED_VALUES_UUID'] = input['PRE_DEFINED_VALUES_UUID_1']
          }
        }
          break;

        // user action name
        case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
          {
            object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['USER_ACTION_NAME'];
            let uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:USER_ACTION_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
            stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<User Action Name>', function () { return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'" });
          }

          break;
        // user action type
        case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
          {
            object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['USER_ACTION_TYPE'];
            let uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID=:USER_ACTION_TYPE`;
            let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementTypeQuery, input);
            stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<User Action Type>', function () { return "'" + uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] + "'" });
          }
          break;

        case '5c3edc60-f290-11ee-a7a7-c7f3437be2cf':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_GROUP_UUID'];
          let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP  WHERE UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let uiElementGroupStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input);
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element Group Name>', function () {
            return "'" + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + "'"
          });
          break;

        // page number
        case '2dc3a50e-004d-4dec-8270-c7ec5d36cb2c':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['PAGE_NUMBER'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Page Number>', input['PAGE_NUMBER'] ? function () {
            return "'" + input['PAGE_NUMBER'] + "'"
          } : "' '");
          break;

        case '3aff7b0e-472c-4393-b6b2-5a61b07cfbff':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['DATA_VALUE'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Data Value>', input['DATA_VALUE'] ? function () {
            return "'" + input['DATA_VALUE'] + "'"
          } : "' '");
          break;

        case 'bca9a7f7-1948-407c-9953-2d01356bbd15':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['DATA_KEY'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Data Key>', input['DATA_KEY'] ? function () {
            return "'" + input['DATA_KEY'] + "'"
          } : "' '");
          break;

        case 'ceb66327-216f-42fd-845b-9f4543c62baa':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['FILE_NAME'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<File Name>', input['FILE_NAME'] ? function () {
            return "'" + input['FILE_NAME'] + "'"
          } : "' '");
          break;

        case 'd20f4347-d4d0-47a1-96f6-190d3b5e4a90':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['DOCUMENT_PARSER_NAME'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Document Parser Name>', input['DOCUMENT_PARSER_NAME'] ? function () {
            return "'" + input['DOCUMENT_PARSER_NAME'] + "'"
          } : "' '");
          break;

        case '36880b70-2e33-11ef-b3ef-e52f192c3af0': {
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['API_UUID'];
          const apiQuery = `SELECT API_NAME FROM API_NEW WHERE API_UUID=:API_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let apiQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", apiQuery, input);
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<API Name>', function () {
            return "'" + apiQueryData['API_NAME'] + "'"
          });
        }
          break;
        case '46136260-2e33-11ef-b3ef-e52f192c3af0': {
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['API_ATTRIBUTE_NAME'];
          const apiAttributeQuery = `SELECT ATTRIBUTE_NAME FROM API_ATTRIBUTE WHERE API_ATTRIBUTE_UUID=:API_ATTRIBUTE_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let apiAttributeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", apiAttributeQuery, input);
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<API Attribute Name>', function () {
            return "'" + apiAttributeQueryData['ATTRIBUTE_NAME'] + "'"
          });
        }
          break;
        case '7182ebf0-2e33-11ef-9033-4bb93e602d01':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['API_ATTRIBUTE_VALUE'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<API Attribute Value>', input['API_ATTRIBUTE_VALUE'] ? function () {
            return "'" + input['API_ATTRIBUTE_VALUE'] + "'"
          } : "' '");
          break;

        case '833eb770-2e33-11ef-9033-4bb93e602d01':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['RESPONSE_CODE_VALUE'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Response Status Code>', input['RESPONSE_CODE_VALUE'] ? function () {
            return "'" + input['RESPONSE_CODE_VALUE'] + "'"
          } : "' '");
          break;

        case 'c53a65a0-613e-11ef-81c7-b59b0b9089cd': {
          let currentPage = input['NEXT_PAGE_CONTEXT'];
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = currentPage;
          let pageNewQuery = `SELECT PAGE_NAME,PAGE_ACCESS_RELATIVE_URL FROM PAGE WHERE PAGE_UUID=${"'" + currentPage + "'"} AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let pageNewQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", pageNewQuery, input);
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Page Name 1>', function () { return "'" + pageNewQueryData['PAGE_NAME'] + "'" });
        }
          break;

        case 'ccd0b030-613e-11ef-81c7-b59b0b9089cd':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['UI_ELEMENT_STATE'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element State>', input['UI_ELEMENT_STATE'] ? function () { return "'" + input['UI_ELEMENT_STATE'] + "'" } : "' '");
          break;

        case '2afdf3ea-2d25-42c6-ab5e-9f5a6b15e0f8':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['TIMEOUT'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Timeout>', input['TIMEOUT'] ? function () {
            return "'" + input['TIMEOUT'] + "'"
          } : "' '");
          break;

        case '7c7a43c8-e484-11ef-904e-02c8cad0208d':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['TEST_SET_SCOPE_VARIABLE'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Test Set Scope Variable>', input['TEST_SET_SCOPE_VARIABLE'] ? function () {
            return "'" + input['TEST_SET_SCOPE_VARIABLE'] + "'"
          } : "' '");
          break;

        case '842981e7-e484-11ef-904e-02c8cad0208d':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['TEST_CASE_SCOPE_VARIABLE'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Test Case Scope Variable>', input['TEST_CASE_SCOPE_VARIABLE'] ? function () {
            return "'" + input['TEST_CASE_SCOPE_VARIABLE'] + "'"
          } : "' '");
          break;

        case 'e0568059-ce39-4a69-aadd-6a0dccba696d':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['TIME_INTERVAL'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Time Interval>', input['TIME_INTERVAL'] ? function () {
            return "'" + input['TIME_INTERVAL'] + "'"
          } : "' '");
          break;

        case '9d27f361-ac8b-4673-82fe-66c40b2cb634':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['ATTEMPTS'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Attempts>', input['ATTEMPTS'] ? function () {
            return "'" + input['ATTEMPTS'] + "'"
          } : "' '");
          break;




        case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5': {
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['COLUMN_HEADER'];
          const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:COLUMN_HEADER AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Column Header>', function () {
            return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
          });
        }
          break;

        case '75b16425-1531-4cee-8c09-30f5be70c4b0':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['CELL_VALUE'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Cell Value>', input['CELL_VALUE'] ? function () {
            return "'" + input['CELL_VALUE'] + "'"
          } : "' '");
          break;

        case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['ROW_NUMBER'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Row Number>', input['ROW_NUMBER'] ? function () {
            return "'" + input['ROW_NUMBER'] + "'"
          } : "' '");
          break;

        case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab': {
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['TABLE_NAME'];
          const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:TABLE_NAME AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Table Name>', function () {
            return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
          });
        }
          break;

        case '078e6534-f38f-4aad-b89d-cad8216ad86b': {
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['COLUMN_HEADER_1'];
          const uiElementQuery = `SELECT UI_ELEMENT_NAME FROM UI_ELEMENT WHERE UI_ELEMENT_UUID=:COLUMN_HEADER_1 AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let uiElementQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementQuery, input);
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Column Header 1>', function () {
            return "'" + uiElementQueryData['UI_ELEMENT_NAME'] + "'"
          });
        }
          break;

        case 'ba1ef281-412a-4544-b615-7767b06eb489':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['CELL_VALUE_1'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Cell Value 1>', input['CELL_VALUE_1'] ? function () {
            return "'" + input['CELL_VALUE_1'] + "'"
          } : "' '");
          break;

        case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['COLUMN_NUMBER'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<Column Number>', input['COLUMN_NUMBER'] ? function () {
            return "'" + input['COLUMN_NUMBER'] + "'"
          } : "' '");
          break;

        case '28058e26-fa09-42fb-868a-1988bd0a746c': {
          object['FUNCTION_STEP_ATTRIBUTE_DATA'] = input['FILE_FULL_PATH'];
          stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<File Full Path>', input['FILE_FULL_PATH'] ? function () {
            return "'" + input['FILE_FULL_PATH'] + "'"
          } : "' '");
        }
          break;

        default: null
      }

      if (!['005d158d-428c-4bca-ae2d-1c3f9630b549', '7f855066-ad39-4325-8108-30befb2447e6'].includes(codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'])) {
        functionStepAttributeValueArray.push(object);
      }
    }
  }
}

async function modifyFunctionNameStep() {
  let modifiedString = '';
  let uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP  WHERE UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let uiElementGroupStepQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input);
  modifiedString = stepDefVerbiageStr.replaceAll('<UI Element Group Name>', function () { return "'" + uiElementGroupStepQueryData['UI_ELEMENT_GROUP_NAME'] + "'" });
  return modifiedString;
}

async function createFunctionUIElementGroupStep() {
  let uiElementGroupStepQuery = `SELECT UI_ELEMENT_GROUP_STEP_UUID,UI_ELEMENT_GROUP_NAME,STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID,UI_ELEMENT_GROUP_STEP_NAME,ueg.UI_ELEMENT_GROUP_UUID,UI_ELEMENT_STEP_FILTER_TYPE,STEP_TYPE,CURRENT_PAGE_CONTEXT FROM UI_ELEMENT_GROUP ueg ,UI_ELEMENT_GROUP_STEP uegs WHERE ueg.UI_ELEMENT_GROUP_UUID=uegs.UI_ELEMENT_GROUP_UUID and ueg.UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID and ueg.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by UI_ELEMENT_GROUP_STEP_ID asc`;
  let uiElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepQuery, input);

  if (uiElementGroupStepQueryData && uiElementGroupStepQueryData.length) {
    // stepDefVerbiageStr = stepDefVerbiageStr.replaceAll('<UI Element Group Name>', "'" + uiElementGroupStepQueryData[0]['UI_ELEMENT_GROUP_NAME'] + "'");

    for (let data of uiElementGroupStepQueryData) {
      let functionUIElementGroupStepId = uuid();
      let getKeywordForStepType = data['STEP_TYPE'] ? data['STEP_TYPE'] + ' ' : '';
      let functionUIElementGroupStep = {
        FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: functionUIElementGroupStepId,
        FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: getKeywordForStepType + data['UI_ELEMENT_GROUP_STEP_NAME'],
        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
        CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
        FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: data['STEP_TYPE'] ? data['STEP_TYPE'] : '',
        FUNCTION_UUID: input['FUNCTION_UUID'],
        UI_ELEMENT_GROUP_UUID: data['UI_ELEMENT_GROUP_UUID'],
        UI_ELEMENT_GROUP_STEP_UUID: data['UI_ELEMENT_GROUP_STEP_UUID']
      };
      let uiElementGroupStepId = `'` + data['UI_ELEMENT_GROUP_STEP_UUID'] + `'`;
      let uiElementGroupStepAttributeQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where UI_ELEMENT_GROUP_STEP_UUID in(${uiElementGroupStepId})`;
      let uiElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', uiElementGroupStepAttributeQuery, input);
      for (let uiElementGroupStepAttribute of uiElementGroupStepAttributeQueryData) {
        let stepDefArttributeId = `'` + uiElementGroupStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'] + `'`;
        let stepDefinitionAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_ATTRIBUTE_UUID in(${stepDefArttributeId}) order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
        let stepDefinitionAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', stepDefinitionAttributeQuery, input);
        for (let codeDesc of stepDefinitionAttributeQueryData) {
          let object = {};
          object['STEP_DEFINITION_ATTRIBUTE_UUID'] = codeDesc['STEP_DEFINITION_ATTRIBUTE_UUID'];
          object['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] = functionUIElementGroupStepId;
          object['FUNCTION_UUID'] = input['FUNCTION_UUID'];
          object['PRE_DEFINED_VALUES_UUID'] = uiElementGroupStepAttribute['PRE_DEFINED_VALUES_UUID'];
          switch (codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID']) {
            //page
            case '57b76ab3-8112-4343-af0f-49643c808bf7':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;
            // ui element
            case 'adcf6e25-f890-476c-bdcf-e723c6d7894c':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;
            // ui element type
            case '7f855066-ad39-4325-8108-30befb2447e6':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;
            // ui element value
            case '74da67d2-41c9-4cf7-9eea-715243e5fcdc':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;

            // key name in key pad
            case '235dfa3a-a897-4076-b9bc-ed813ec7c39f':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;
            // event name
            case '005d158d-428c-4bca-ae2d-1c3f9630b549':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;
            //confitm 
            case 'afe5f489-b9b3-11ee-a0ed-12e85c8c3755':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;
            //function 
            case '6c698ae8-6305-4bb6-8c23-3a938e7234bd':
              break;
            // ui element name 1
            case '2b7e3ad0-f3e4-11ee-9a12-6fc3e771212a':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;
            // ui element value 1
            case '3f50ff70-f3e4-11ee-9a12-6fc3e771212a':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;
            // user action name
            case '903cf3b0-f8a5-11ee-a163-cdf5a57b7d43':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;
            // user action type
            case '99cf0e40-f8a5-11ee-a163-cdf5a57b7d43':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;

            case 'd797acb4-5e5c-447b-b0c5-60dad38e39a5':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;

            case '75b16425-1531-4cee-8c09-30f5be70c4b0':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;

            case 'ed2ebd4b-9267-4e41-8f56-d5a61abe7ba5':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;

            case 'd25a4d7f-5c5d-4117-b325-1c669b9a42ab':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;

            case '078e6534-f38f-4aad-b89d-cad8216ad86b':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;

            case 'ba1ef281-412a-4544-b615-7767b06eb489':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;

            case 'f7b6ba5d-74a7-4d36-82cd-222d57b2ce83':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;

            case '28058e26-fa09-42fb-868a-1988bd0a746c':
              object['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = uiElementGroupStepAttribute['UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
              break;

            default: null
          }

          if (!['005d158d-428c-4bca-ae2d-1c3f9630b549', '7f855066-ad39-4325-8108-30befb2447e6'].includes(codeDesc['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'])) {
            functionUIElementGroupStepAttributeList.push(object);
          }
        }
      }
      functionUIElementGroupStepList.push(functionUIElementGroupStep);
    }
  }
}

async function createFunctionViewNavigationStep() {
  let viewNavigationStepQuery = `SELECT VIEW_NAVIGATION_STEP_UUID, VIEW_NAVIGATION_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, VIEW_NAVIGATION_STEP_TYPE, VIEW_NAVIGATION_STEP_SEQ_ID, CURRENT_PAGE_CONTEXT, NEXT_PAGE_CONTEXT, VIEW_UUID FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID = :VIEW_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by VIEW_NAVIGATION_STEP_SEQ_ID asc`;
  let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewNavigationStepQuery, input);

  if (viewNavigationStepQueryData && viewNavigationStepQueryData.length) {
    for (let data of viewNavigationStepQueryData) {
      let functionViewNavigationStepId = uuid();
      let getKeywordForStepType = data['STEP_TYPE'] ? data['STEP_TYPE'] + ' ' : '';
      let functionViewNavigationStep = {
        FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
        FUNCTION_UUID: input['FUNCTION_UUID'],
        FUNCTION_VIEW_NAVIGATION_STEP_NAME: getKeywordForStepType + data['VIEW_NAVIGATION_STEP_NAME'],
        FUNCTION_STEP_UUID: input['FUNCTION_STEP_UUID'],
        VIEW_UUID: input['VIEW_UUID'],
        VIEW_NAVIGATION_STEP_UUID: data['VIEW_NAVIGATION_STEP_UUID'],
        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
        FUNCTION_VIEW_NAVIGATION_STEP_TYPE: data['VIEW_NAVIGATION_STEP_TYPE'],
        FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID: data['VIEW_NAVIGATION_STEP_SEQ_ID'],
        CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
        NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT']
      };
      functionViewNavigationStepList.push(functionViewNavigationStep);

      let ViewNavigationStepId = `'` + data['VIEW_NAVIGATION_STEP_UUID'] + `'`;
      let ViewNavigationStepAttributeQuery = `SELECT * FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where VIEW_NAVIGATION_STEP_UUID in(${ViewNavigationStepId})`;
      let ViewNavigationStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', ViewNavigationStepAttributeQuery, input);
      for (let ViewNavigationStepAttribute of ViewNavigationStepAttributeQueryData) {
        let object = {};
        object['STEP_DEFINITION_ATTRIBUTE_UUID'] = ViewNavigationStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'];
        object['FUNCTION_VIEW_NAVIGATION_STEP_UUID'] = functionViewNavigationStepId;
        object['FUNCTION_UUID'] = input['FUNCTION_UUID'];
        object['PRE_DEFINED_VALUES_UUID'] = ViewNavigationStepAttribute['PRE_DEFINED_VALUES_UUID'];
        object['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = ViewNavigationStepAttribute['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'];
        object['VIEW_UUID'] = input['VIEW_UUID'];
        functionViewNavigationStepAttributeList.push(object);
      }

    }
  }
}
function deleteRecords(key, value, deleteType) {
  let deleteParamenter = {};
  deleteParamenter[key] = value;
  deleteParamenter["compositeEntityAction"] = "Delete";
  if (deleteType === "FUNCTION_STEP") {
    functionStepList.push(deleteParamenter);
  } else if (deleteType === "FUNCTION_STEP_ATTRIBUTE_VALUE") {
    functionStepAttributeValueArray.push(deleteParamenter);
  } else if (deleteType === "FUNCTION_UI_ELEMENT_GROUP_STEP") {
    functionUIElementGroupStepList.push(deleteParamenter);
  } else if (deleteType === "FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE") {
    functionUIElementGroupStepAttributeList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_FUNCTION_STEP") {
    testCaseFunctionStepArray.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE") {
    testCaseFunctionStepAttributeValueArray.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP") {
    testCaseFunctionUIElementGroupStepList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE") {
    testCaseFunctionUIElementGroupStepAttributeList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_VIEW_NAVIGATION_STEP") {
    testCaseViewNavigationStepList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE") {
    testCaseViewNavigationStepAttributeList.push(deleteParamenter);
  } else if (deleteType === "FUNCTION_VIEW_NAVIGATION_STEP") {
    functionViewNavigationStepList.push(deleteParamenter);
  } else if (deleteType === "FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE") {
    functionViewNavigationStepAttributeList.push(deleteParamenter);
  }
}

async function changeTestCaseFunctionStepSequence(testCaseFunctionStepData) {
  for (let testCaseFunctionData of testCaseFunctionStepData) {
    let seqId = '';
    let testCaseFunctionStepQuery = '';
    const commonCondition = input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] === 'No' && input['IS_API_EXIST_FOR_STEP_DEFINITION'] === 'No';
    if (input.compositeEntityAction == "Save") {
      seqId = input['FUNCTION_STEP_SEQ_ID'] + 1;
      if ((input['FUNCTION_STEP_POSITION'] === 'First Function Step' && input['isFirstRecord'] === 'No' && commonCondition) ||
        (input['FUNCTION_STEP_POSITION'] === 'Intermediate Function Step' && commonCondition) ||
        (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] === 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] === 'Yes') && input['STEP_SELECTION_TYPE'] === 'Do not delete subsequent steps') {
        testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID='${testCaseFunctionData['TEST_CASE_STEP_UUID']}' and FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_FUNCTION_STEP_SEQ_ID >=:FUNCTION_STEP_SEQ_ID ORDER BY TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
      } else if ((input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] === 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] === 'Yes') &&
        (input['STEP_SELECTION_TYPE'] === 'Delete selected steps' || input['STEP_SELECTION_TYPE'] === 'Select Steps for Deletion')) {
        testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID='${testCaseFunctionData['TEST_CASE_STEP_UUID']}'  and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_FUNCTION_STEP_SEQ_ID >=:FUNCTION_STEP_SEQ_ID and TEST_CASE_FUNCTION_STEP_SEQ_ID <:START_STEP union SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID='${testCaseFunctionData['TEST_CASE_STEP_UUID']}'  and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_FUNCTION_STEP_SEQ_ID >:END_STEP ORDER BY TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
      } else if (input['FUNCTION_STEP_POSITION'] === 'Last Function Step' && commonCondition) {
        testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID='${testCaseFunctionData['TEST_CASE_STEP_UUID']}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_FUNCTION_STEP_SEQ_ID >:FUNCTION_STEP_SEQ_ID ORDER BY TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
      }
    } else if (input.compositeEntityAction == "Delete") {
      seqId = input['FUNCTION_STEP_SEQ_ID'];

      if ((input['FUNCTION_STEP_POSITION'] === 'First Function Step' && input['isFirstRecord'] === 'No' && commonCondition) ||
        (input['FUNCTION_STEP_POSITION'] === 'Intermediate Function Step' && commonCondition) ||
        (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] === 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] === 'Yes') && input['STEP_SELECTION_TYPE'] === 'Do not delete subsequent steps') {
        testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID='${testCaseFunctionData['TEST_CASE_STEP_UUID']}' and FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_FUNCTION_STEP_SEQ_ID >:FUNCTION_STEP_SEQ_ID ORDER BY TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
      } else if ((input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] === 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] === 'Yes') &&
        (input['STEP_SELECTION_TYPE'] === 'Delete selected steps' || input['STEP_SELECTION_TYPE'] === 'Select Steps for Deletion') && input['isStepExistsAfterCurrentStep'] == 'Yes') {
        testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID='${testCaseFunctionData['TEST_CASE_STEP_UUID']}'  and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_FUNCTION_STEP_SEQ_ID >=:FUNCTION_STEP_SEQ_ID and TEST_CASE_FUNCTION_STEP_SEQ_ID <:START_STEP union SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID='${testCaseFunctionData['TEST_CASE_STEP_UUID']}'  and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_FUNCTION_STEP_SEQ_ID >:END_STEP ORDER BY TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
      } else if (input['FUNCTION_STEP_POSITION'] === 'Last Function Step' && commonCondition) {
        testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID='${testCaseFunctionData['TEST_CASE_STEP_UUID']}' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_CASE_FUNCTION_STEP_SEQ_ID >:FUNCTION_STEP_SEQ_ID ORDER BY TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
      }
    }
    if (testCaseFunctionStepQuery) {
      let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
      if (testCaseFunctionStepQueryData && testCaseFunctionStepQueryData.length) {
        for (let data of testCaseFunctionStepQueryData) {
          let changedSeqID = {}
          changedSeqID["compositeEntityAction"] = "Update";
          changedSeqID['TEST_CASE_FUNCTION_STEP_UUID'] = data['TEST_CASE_FUNCTION_STEP_UUID'];
          changedSeqID['FUNCTION_STEP_UUID'] = data['FUNCTION_STEP_UUID'];
          changedSeqID['FUNCTION_UUID'] = data['FUNCTION_UUID'];
          changedSeqID['TEST_CASE_FUNCTION_STEP_SEQ_ID'] = seqId;
          seqId++;
          testCaseFunctionStepArray.push(changedSeqID)
        }
      }
    }
  }
}

async function changeFunctionStepSequence() {
  let seqId = '';
  let functionStepQuery = '';
  const commonCondition = input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] === 'No' && input['IS_API_EXIST_FOR_STEP_DEFINITION'] === 'No';

  if (input.compositeEntityAction == "Save") {
    seqId = input['FUNCTION_STEP_SEQ_ID'] + 1;
    if ((input['FUNCTION_STEP_POSITION'] === 'First Function Step' && input['isFirstRecord'] === 'No' && commonCondition) ||
      (input['FUNCTION_STEP_POSITION'] === 'Intermediate Function Step' && commonCondition) ||
      (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] === 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] === 'Yes') && input['STEP_SELECTION_TYPE'] === 'Do not delete subsequent steps') {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_STEP_SEQ_ID >=:FUNCTION_STEP_SEQ_ID ORDER BY FUNCTION_STEP_SEQ_ID ASC`;
    } else if ((input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] === 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] === 'Yes') &&
      (input['STEP_SELECTION_TYPE'] === 'Delete selected steps' || input['STEP_SELECTION_TYPE'] === 'Select Steps for Deletion')) {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_STEP_SEQ_ID >=:FUNCTION_STEP_SEQ_ID AND FUNCTION_STEP_SEQ_ID <:START_STEP UNION SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_STEP_SEQ_ID >:END_STEP ORDER BY FUNCTION_STEP_SEQ_ID ASC`;
    } else if (input['FUNCTION_STEP_POSITION'] === 'Last Function Step' && commonCondition) {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_STEP_SEQ_ID >:FUNCTION_STEP_SEQ_ID ORDER BY FUNCTION_STEP_SEQ_ID ASC`;
    }
  } else if (input.compositeEntityAction == "Delete") {
    seqId = input['FUNCTION_STEP_SEQ_ID'];

    if ((input['FUNCTION_STEP_POSITION'] === 'First Function Step' && input['isFirstRecord'] === 'No' && commonCondition) ||
      (input['FUNCTION_STEP_POSITION'] === 'Intermediate Function Step' && commonCondition) ||
      (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] === 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] === 'Yes') && input['STEP_SELECTION_TYPE'] === 'Do not delete subsequent steps') {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_STEP_SEQ_ID >:FUNCTION_STEP_SEQ_ID ORDER BY FUNCTION_STEP_SEQ_ID ASC`;
    } else if ((input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] === 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] === 'Yes') &&
      (input['STEP_SELECTION_TYPE'] === 'Delete selected steps' || input['STEP_SELECTION_TYPE'] === 'Select Steps for Deletion') && input['isStepExistsAfterCurrentStep'] == 'Yes') {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_STEP_SEQ_ID >=:FUNCTION_STEP_SEQ_ID AND FUNCTION_STEP_SEQ_ID <:START_STEP UNION SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_STEP_SEQ_ID >:END_STEP ORDER BY FUNCTION_STEP_SEQ_ID ASC`;
    } else if ((input['FUNCTION_STEP_POSITION'] === 'Last Function Step' && commonCondition)) {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP WHERE FUNCTION_UUID=:FUNCTION_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_STEP_SEQ_ID >:FUNCTION_STEP_SEQ_ID ORDER BY FUNCTION_STEP_SEQ_ID ASC`;
    }
  }
  if (functionStepQuery) {
    let functionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepQuery, input);
    if (functionStepQueryData && functionStepQueryData.length) {
      for (let data of functionStepQueryData) {
        let changedSeqID = {}
        changedSeqID["compositeEntityAction"] = "Update";
        changedSeqID['FUNCTION_STEP_UUID'] = data['FUNCTION_STEP_UUID'];
        changedSeqID['FUNCTION_STEP_SEQ_ID'] = seqId;
        seqId++;
        functionStepList.push(changedSeqID)
      }
    }
  }

}

async function deleteFunctionViewNavigationStepData(functionStepStr) {
  // firing the query to get all the function ui element group step  for that particular function step
  let functionViewNavigationStepQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP where FUNCTION_STEP_UUID in(${functionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let functionViewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionViewNavigationStepQuery, input);

  for (let data of functionViewNavigationStepQueryData) {
    deleteRecords('FUNCTION_VIEW_NAVIGATION_STEP_UUID', data['FUNCTION_VIEW_NAVIGATION_STEP_UUID'], 'FUNCTION_VIEW_NAVIGATION_STEP');
    deleteFunctionViewNavigationStepAttributeData("'" + data.FUNCTION_VIEW_NAVIGATION_STEP_UUID + "'")
  }
}

async function deleteFunctionViewNavigationStepAttributeData(functionStepStr) {
  // firing the query to get all the  function ui element group step attribute value for that particulat function step
  let functionViewNavigationStepAttributeValueQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where FUNCTION_VIEW_NAVIGATION_STEP_UUID in(${functionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let functionViewNavigationStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionViewNavigationStepAttributeValueQuery, input);

  for (let attributeData of functionViewNavigationStepAttributeQueryData) {
    deleteRecords('FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', attributeData['FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE');
  }
}

async function deletefunctionStepAttributeData(functionStepStr) {
  let functionStepAttributeValueQuery = `SELECT * FROM FUNCTION_STEP_ATTRIBUTE_VALUE where FUNCTION_STEP_UUID in(${functionStepStr})  and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let functionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepAttributeValueQuery, input);

  for (let attributeData of functionStepAttributeValueQueryData) {
    deleteRecords('FUNCTION_STEP_ATTRIBUTE_VALUE_UUID', attributeData['FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'], 'FUNCTION_STEP_ATTRIBUTE_VALUE');
  }
}

async function deleteFunctionUIElementGroupStepData(functionStepStr) {
  // firing the query to get all the function ui element group step  for that particular function step
  let functionUiElementGroupStepQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP where FUNCTION_STEP_UUID in(${functionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let functionUiElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionUiElementGroupStepQuery, input);

  for (let data of functionUiElementGroupStepQueryData) {
    deleteRecords('FUNCTION_UI_ELEMENT_GROUP_STEP_UUID', data['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'], 'FUNCTION_UI_ELEMENT_GROUP_STEP');
  }
}

async function deleteFunctionUIElementGroupStepAttributeData(functionStepStr) {
  // firing the query to get all the  function ui element group step attribute value for that particulat function step
  let functionUiElementGroupStepAttributeValueQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where FUNCTION_STEP_UUID in(${functionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let functionUiElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionUiElementGroupStepAttributeValueQuery, input);

  for (let attributeData of functionUiElementGroupStepAttributeQueryData) {
    deleteRecords('FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
  }
}


async function deleteTestCaseFunctionStepAttributeData(testCaseFunctionStepId) {
  // firing the query to get all the test case function step attribute value for that particulat test case step
  let testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);

  for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
    deleteRecords('TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE');
  }
}

async function deleteTestCaseFunctionUIElementGroupStepAttributeData(testCaseFunctionUIElementGroupStepId) {
  // firing the query to get all the test case function step attribute value for that particulat test case step
  let testCaseFunctionUIElementGroupStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${testCaseFunctionUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeValueQuery, input);

  for (let attributeData of testCaseFunctionUIElementGroupStepAttributeValueQueryData) {
    deleteRecords('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
  }
}

async function deleteTestCaseFunctionUIElementGroupStepData(testCaseFunctionStepId) {
  // firing the query to get all the test case function step  for that particular test case step
  let testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);

  for (let data of testCaseFunctionUIElementGroupStepQueryData) {
    deleteRecords('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP');
    await deleteTestCaseFunctionUIElementGroupStepAttributeData("'" + data.TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID + "'");
  }
}

async function deleteTestCaseViewNavigationStepData(testCaseFunctionStepId) {
  // firing the query to get all the test case function step  for that particular test case step
  let testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${testCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);

  for (let data of testCaseFunctionUIElementGroupStepQueryData) {
    deleteRecords('TEST_CASE_VIEW_NAVIGATION_STEP_UUID', data['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'], 'TEST_CASE_VIEW_NAVIGATION_STEP');
    await deleteTestCaseViewNavigationStepAttributeData("'" + data.TEST_CASE_VIEW_NAVIGATION_STEP_UUID + "'");
  }
}
async function deleteTestCaseViewNavigationStepAttributeData(testCaseViewNavigationStepId) {
  // firing the query to get all the test case function step attribute value for that particulat test case step
  let testCaseFunctionUIElementGroupStepAttributeValueQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${testCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeValueQuery, input);

  for (let attributeData of testCaseFunctionUIElementGroupStepAttributeValueQueryData) {
    deleteRecords('TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE');
  }
}

async function deleteTestCaseFunctionStepData(testCaseFunctionStepData) {
  if (testCaseFunctionStepData.length) {
    for (let data of testCaseFunctionStepData) {
      deleteRecords('TEST_CASE_FUNCTION_STEP_UUID', data['TEST_CASE_FUNCTION_STEP_UUID'], 'TEST_CASE_FUNCTION_STEP');
      await deleteTestCaseFunctionStepAttributeData("'" + data['TEST_CASE_FUNCTION_STEP_UUID'] + "'");

      if (data.IS_UI_ELEMENT_GROUP_STEP == 'Yes') {
        await deleteTestCaseFunctionUIElementGroupStepData("'" + data['TEST_CASE_FUNCTION_STEP_UUID'] + "'");
      }
      if (stepDefAttributeQueryData[0]['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
        await deleteTestCaseViewNavigationStepData("'" + data['TEST_CASE_STEP_UUID'] + "'");
      }
    }
  }
}

async function deleteLinkedTestCaseStepAndChild() {
  if ((input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] == 'Yes') && input['isStepExistsAfterCurrentStep'] == 'Yes') {
    if (input['STEP_SELECTION_TYPE'] == 'Select Steps for Deletion' || input['STEP_SELECTION_TYPE'] == 'Delete selected steps') {
      let testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where FUNCTION_UUID in(${"'" + input.FUNCTION_UUID + "'"}) AND  FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND TEST_CASE_FUNCTION_STEP_SEQ_ID>=:START_STEP and TEST_CASE_FUNCTION_STEP_SEQ_ID<=:END_STEP order by TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
      let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
      await deleteTestCaseFunctionStepData(testCaseFunctionStepData);
      let testCaseFunctionStepGroupedQuery = `Select TEST_CASE_UUID, TEST_SET_UUID, TEST_CASE_STEP_UUID From TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_ATTRIBUTE_DATA='${input['FUNCTION_UUID']}';`;
      let testCaseFunctionStepGroupedQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepGroupedQuery, input);
      if (testCaseFunctionStepGroupedQueryData && testCaseFunctionStepGroupedQueryData.length > 0) {
        await changeTestCaseFunctionStepSequence(testCaseFunctionStepGroupedQueryData);
      }
    } else if (input['STEP_SELECTION_TYPE'] == 'Delete all Subsequent Steps' || input['STEP_SELECTION_TYPE'] == 'Delete subsequent steps') {
      let testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where FUNCTION_UUID in(${"'" + input.FUNCTION_UUID + "'"}) AND  FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND TEST_CASE_FUNCTION_STEP_SEQ_ID>=:FUNCTION_STEP_SEQ_ID`;
      let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
      await deleteTestCaseFunctionStepData(testCaseFunctionStepData);
    }
  } else if ((input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No' && input['IS_API_EXIST_FOR_STEP_DEFINITION'] == 'No') || input['isStepExistsAfterCurrentStep'] == 'No') {
    let testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where FUNCTION_UUID in(${"'" + input.FUNCTION_UUID + "'"}) and FUNCTION_STEP_UUID in(${"'" + input.FUNCTION_STEP_UUID + "'"}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
    await deleteTestCaseFunctionStepData(testCaseFunctionStepData);
    await changeTestCaseFunctionStepSequence(testCaseFunctionStepData);
  }
}

async function createTestCaseFunctionStep(testcase) {
  let testCaseFunctionStepObject = {}
  testCaseFunctionStepObject['TEST_CASE_FUNCTION_STEP_UUID'] = uuid();
  testCaseFunctionStepObject['TEST_CASE_FUNCTION_STEP_NAME'] = input['FUNCTION_STEP_NAME'];
  testCaseFunctionStepObject['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = input['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
  testCaseFunctionStepObject['CURRENT_PAGE_CONTEXT'] = input['CURRENT_PAGE_CONTEXT'];
  testCaseFunctionStepObject['NEXT_PAGE_CONTEXT'] = input['NEXT_PAGE_CONTEXT'];
  testCaseFunctionStepObject['TEST_CASE_FUNCTION_STEP_TYPE'] = input['FUNCTION_STEP_TYPE'];
  testCaseFunctionStepObject['TEST_CASE_FUNCTION_STEP_SEQ_ID'] = input['FUNCTION_STEP_SEQ_ID'];
  testCaseFunctionStepObject['TEST_CASE_STEP_UUID'] = testcase['TEST_CASE_STEP_UUID'];
  testCaseFunctionStepObject['IS_UI_ELEMENT_GROUP_STEP'] = input['IS_UI_ELEMENT_GROUP_STEP'];
  testCaseFunctionStepObject['FUNCTION_UUID'] = input['FUNCTION_UUID'];
  testCaseFunctionStepObject['FUNCTION_STEP_UUID'] = input['FUNCTION_STEP_UUID'];
  testCaseFunctionStepObject['IS_PURE_NAVIGATION_STEP'] = input['IS_PURE_NAVIGATION_STEP'];
  testCaseFunctionStepObject['VIEW_UUID'] = input['VIEW_UUID'];
  testCaseFunctionStepArray.push(testCaseFunctionStepObject);
  await createTestCaseFunctionAttributeValue(testCaseFunctionStepObject);
}

async function createTestCaseFunctionAttributeValue(testCaseFunctionStepObject) {
  if (functionStepAttributeValueArray && functionStepAttributeValueArray.length) {
    for (let attribute of functionStepAttributeValueArray) {
      let testCaseFunctionAttributeValueObject = {};
      // let stepDefinitionAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_ATTRIBUTE_UUID in('${attribute['STEP_DEFINITION_ATTRIBUTE_UUID']}')`;
      // let stepDefinitionAttributeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', stepDefinitionAttributeQuery, input);

      // if (['7c7a43c8-e484-11ef-904e-02c8cad0208d','842981e7-e484-11ef-904e-02c8cad0208d'].includes(stepDefinitionAttributeQueryData['STEP_DEFINITION_ATTRIBUTE_MASTER_UUID'])) {
      //     let functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION WHERE FUNCTION_UUID=:FUNCTION_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      //     let functionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', functionQuery, input);

      //     testCaseFunctionAttributeValueObject['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = functionQueryData['FUNCTION_NAME'] + ' : ' + attribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
      // } else {
      //     testCaseFunctionAttributeValueObject['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = attribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
      // }

      testCaseFunctionAttributeValueObject['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'] = attribute['FUNCTION_STEP_ATTRIBUTE_DATA'];
      testCaseFunctionAttributeValueObject['STEP_DEFINITION_ATTRIBUTE_UUID'] = attribute['STEP_DEFINITION_ATTRIBUTE_UUID'];
      testCaseFunctionAttributeValueObject['TEST_CASE_FUNCTION_STEP_UUID'] = testCaseFunctionStepObject['TEST_CASE_FUNCTION_STEP_UUID'];
      testCaseFunctionAttributeValueObject['FUNCTION_UUID'] = testCaseFunctionStepObject['FUNCTION_UUID'];
      testCaseFunctionAttributeValueObject['TEST_CASE_STEP_UUID'] = testCaseFunctionStepObject['TEST_CASE_STEP_UUID'];
      testCaseFunctionAttributeValueObject['FUNCTIONAL_AREA_UUID'] = input['FUNCTIONAL_AREA_UUID'];
      testCaseFunctionAttributeValueObject['PRE_DEFINED_VALUES_UUID'] = attribute['PRE_DEFINED_VALUES_UUID'];
      testCaseFunctionStepAttributeValueArray.push(testCaseFunctionAttributeValueObject);
    }
  }
}

async function createTestCaseFunctionUIElementGroupStep(testcase) {

  for (let functionUIElementGroupStep of functionUIElementGroupStepList) {
    let testCaseFunctionUIElementGroupStepObject = {}
    testCaseFunctionUIElementGroupStepObject['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] = uuid();
    testCaseFunctionUIElementGroupStepObject['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'] = functionUIElementGroupStep['FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'];
    testCaseFunctionUIElementGroupStepObject['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = functionUIElementGroupStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'];
    testCaseFunctionUIElementGroupStepObject['CURRENT_PAGE_CONTEXT'] = functionUIElementGroupStep['CURRENT_PAGE_CONTEXT'];
    testCaseFunctionUIElementGroupStepObject['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'] = functionUIElementGroupStep['FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'];
    testCaseFunctionUIElementGroupStepObject['TEST_CASE_STEP_UUID'] = testcase['TEST_CASE_STEP_UUID'];
    testCaseFunctionUIElementGroupStepObject['UI_ELEMENT_GROUP_UUID'] = functionUIElementGroupStep['UI_ELEMENT_GROUP_UUID'];
    testCaseFunctionUIElementGroupStepObject['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] = functionUIElementGroupStep['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'];
    testCaseFunctionUIElementGroupStepObject['UI_ELEMENT_GROUP_STEP_UUID'] = functionUIElementGroupStep['UI_ELEMENT_GROUP_STEP_UUID'];
    for (let testCaseFunctionStep of testCaseFunctionStepArray) {
      if (testCaseFunctionStep['TEST_CASE_STEP_UUID'] == testcase['TEST_CASE_STEP_UUID']) {
        testCaseFunctionUIElementGroupStepObject['TEST_CASE_FUNCTION_STEP_UUID'] = testCaseFunctionStep['TEST_CASE_FUNCTION_STEP_UUID'];
      }
    }
    testCaseFunctionUIElementGroupStepList.push(testCaseFunctionUIElementGroupStepObject);
    await createTestCaseFunctionUIElementGroupStepAttributeValue(testCaseFunctionUIElementGroupStepObject);
  }

}

async function createTestCaseFunctionUIElementGroupStepAttributeValue(testCaseFunctionUIElementGroupStepObject) {

  for (let attribute of functionUIElementGroupStepAttributeList) {
    let testCaseFunctionUIElementGroupAttributeValue = {};
    testCaseFunctionUIElementGroupAttributeValue['STEP_DEFINITION_ATTRIBUTE_UUID'] = attribute['STEP_DEFINITION_ATTRIBUTE_UUID'];
    testCaseFunctionUIElementGroupAttributeValue['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'] = attribute['FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'];
    testCaseFunctionUIElementGroupAttributeValue['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] = testCaseFunctionUIElementGroupStepObject['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'];
    testCaseFunctionUIElementGroupAttributeValue['TEST_CASE_STEP_UUID'] = testCaseFunctionUIElementGroupStepObject['TEST_CASE_STEP_UUID'];
    testCaseFunctionUIElementGroupAttributeValue['UI_ELEMENT_GROUP_UUID'] = testCaseFunctionUIElementGroupStepObject['UI_ELEMENT_GROUP_UUID'];
    testCaseFunctionUIElementGroupAttributeValue['TEST_CASE_FUNCTION_STEP_UUID'] = testCaseFunctionUIElementGroupStepObject['TEST_CASE_FUNCTION_STEP_UUID'];
    testCaseFunctionUIElementGroupAttributeValue['PRE_DEFINED_VALUES_UUID'] = attribute['PRE_DEFINED_VALUES_UUID'];
    testCaseFunctionUIElementGroupStepAttributeList.push(testCaseFunctionUIElementGroupAttributeValue);
  }
}

async function createTestCaseViewNavigationStep(testcase) {

  let viewNavigationStepQuery = `SELECT VIEW_NAVIGATION_STEP_UUID, VIEW_NAVIGATION_STEP_NAME, STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID, VIEW_NAVIGATION_STEP_TYPE, VIEW_NAVIGATION_STEP_SEQ_ID, CURRENT_PAGE_CONTEXT, NEXT_PAGE_CONTEXT, VIEW_UUID FROM VIEW_NAVIGATION_STEP WHERE VIEW_UUID = :VIEW_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by VIEW_NAVIGATION_STEP_SEQ_ID asc`;
  let viewNavigationStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', viewNavigationStepQuery, input);

  if (viewNavigationStepQueryData && viewNavigationStepQueryData.length) {
    for (let data of viewNavigationStepQueryData) {
      let testCaseViewNavigationStepId = uuid();
      let getKeywordForStepType = data['STEP_TYPE'] ? data['STEP_TYPE'] + ' ' : '';
      let testCaseViewNavigationStepIdViewNavigationStep = {
        TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
        FUNCTION_UUID: input['FUNCTION_UUID'],
        TEST_CASE_VIEW_NAVIGATION_STEP_NAME: getKeywordForStepType + data['VIEW_NAVIGATION_STEP_NAME'],
        FUNCTION_STEP_UUID: input['FUNCTION_STEP_UUID'],
        VIEW_UUID: input['VIEW_UUID'],
        VIEW_NAVIGATION_STEP_UUID: data['VIEW_NAVIGATION_STEP_UUID'],
        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
        TEST_CASE_VIEW_NAVIGATION_STEP_TYPE: data['VIEW_NAVIGATION_STEP_TYPE'],
        TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID: data['VIEW_NAVIGATION_STEP_SEQ_ID'],
        CURRENT_PAGE_CONTEXT: data['CURRENT_PAGE_CONTEXT'],
        NEXT_PAGE_CONTEXT: data['NEXT_PAGE_CONTEXT'],
        TEST_CASE_STEP_UUID: testcase['TEST_CASE_STEP_UUID']
      };
      testCaseViewNavigationStepList.push(testCaseViewNavigationStepIdViewNavigationStep);

      let ViewNavigationStepId = `'` + data['VIEW_NAVIGATION_STEP_UUID'] + `'`;
      let ViewNavigationStepAttributeQuery = `SELECT * FROM VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where VIEW_NAVIGATION_STEP_UUID in(${ViewNavigationStepId})`;
      let ViewNavigationStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', ViewNavigationStepAttributeQuery, input);
      for (let ViewNavigationStepAttribute of ViewNavigationStepAttributeQueryData) {
        let object = {};
        object['STEP_DEFINITION_ATTRIBUTE_UUID'] = ViewNavigationStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'];
        object['TEST_CASE_VIEW_NAVIGATION_STEP_UUID'] = testCaseViewNavigationStepId;
        object['FUNCTION_UUID'] = input['FUNCTION_UUID'];
        object['PRE_DEFINED_VALUES_UUID'] = ViewNavigationStepAttribute['PRE_DEFINED_VALUES_UUID'];
        object['TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'] = ViewNavigationStepAttribute['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'];
        object['VIEW_UUID'] = input['VIEW_UUID'];
        testCaseViewNavigationStepAttributeList.push(object);
      }

    }
  }
}

// modifying the step definition with actual detail
let getKeywordByStepType = input['FUNCTION_STEP_TYPE'] ? input['FUNCTION_STEP_TYPE'] + ' ' : '';

// the below if block will execte when action is save
async function createFunctionStep() {
  if (!input['UI_ELEMENT_GROUP_UUID']) {
    // calling the below function to generate the records for function step attribute value table
    await createFunctionStepAttributeValue(stepDefAttributeQueryData);
  } else if (input['UI_ELEMENT_GROUP_UUID']) {
    await createFunctionStepAttributeValue(stepDefAttributeQueryData)
    await createFunctionUIElementGroupStep();
  }
  if (stepDefAttributeQueryData[0]['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
    await createFunctionViewNavigationStep();
  }
  //let modifiedFunctionStep = await modifyFunctionNameStep();

  input['FUNCTION_STEP_NAME'] = getKeywordByStepType + stepDefVerbiageStr;

  let testCaseQuery = `Select TEST_CASE_UUID, TEST_SET_UUID, TEST_CASE_STEP_UUID From TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_ATTRIBUTE_DATA='${input['FUNCTION_UUID']}';`;
  let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseQuery, input);
  if (testCaseQueryData && testCaseQueryData.length > 0) {
    for (let testcase of testCaseQueryData) {
      await createTestCaseFunctionStep(testcase);
      if (input['UI_ELEMENT_GROUP_UUID']) {
        await createTestCaseFunctionUIElementGroupStep(testcase);
      }
      if (stepDefAttributeQueryData[0]['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
        await createTestCaseViewNavigationStep(testcase);
      }
    }
  }
}
async function checkForDelete() {
  if (input['STEP_SELECTION_TYPE'] !== 'Do not delete subsequent steps') {
    let functionStepQuery = '';
    if (input['STEP_SELECTION_TYPE'] == 'Delete selected steps' && input['START_STEP'] && input['END_STEP']) {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP where FUNCTION_UUID=:FUNCTION_UUID and FUNCTION_STEP_SEQ_ID>=:START_STEP and FUNCTION_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_STEP_SEQ_ID asc`;
    } else if (input['STEP_SELECTION_TYPE'] == 'Delete subsequent steps') {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP where FUNCTION_UUID=:FUNCTION_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and FUNCTION_STEP_SEQ_ID > :SELECTED_FUNCTION_STEP_SEQ_ID`;
    }
    let functionStepQueryDataa = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepQuery, input);
    // iterating the function step to delete the sub sequent function step
    for (let data of functionStepQueryDataa) {
      deleteRecords('FUNCTION_STEP_UUID', data['FUNCTION_STEP_UUID'], 'FUNCTION_STEP');
      await deletefunctionStepAttributeData("'" + data.FUNCTION_STEP_UUID + "'");
      if (data.IS_UI_ELEMENT_GROUP_STEP == 'Yes') {
        await deleteFunctionUIElementGroupStepData("'" + data.FUNCTION_STEP_UUID + "'");
        await deleteFunctionUIElementGroupStepAttributeData("'" + data.FUNCTION_STEP_UUID + "'");
      }
      if (stepDefAttributeQueryData[0]['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
        await deleteFunctionViewNavigationStepData("'" + data.FUNCTION_STEP_UUID + "'");
      }
    }
    await deleteLinkedTestCaseStepAndChild();
  } else if (input['STEP_SELECTION_TYPE'] == 'Do not delete subsequent steps') {
    let testCaseFunctionStepGroupedQuery = `Select TEST_CASE_UUID, TEST_SET_UUID, TEST_CASE_STEP_UUID From TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_ATTRIBUTE_DATA='${input['FUNCTION_UUID']}';`;
    let testCaseFunctionStepGroupedQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepGroupedQuery, input);

    if (testCaseFunctionStepGroupedQueryData && testCaseFunctionStepGroupedQueryData.length > 0) {
      await changeTestCaseFunctionStepSequence(testCaseFunctionStepGroupedQueryData);
    }
  }
}
if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && input.compositeEntityAction == 'Save') {
  input['FUNCTION_STEP_UUID'] = uuid();
  if ((input['FUNCTION_STEP_POSITION'] == 'First Function Step' && input['isFirstRecord'] == 'Yes') || input['FUNCTION_STEP_POSITION'] == 'Last Function Step') {
    await createFunctionStep();
  }
  if (input['FUNCTION_STEP_POSITION'] == 'First Function Step' && input['isFirstRecord'] == 'No' && input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No' && input['IS_API_EXIST_FOR_STEP_DEFINITION'] == 'No') {
    await createFunctionStep();
    await changeFunctionStepSequence();
    let testCaseFunctionStepGroupedQuery = `SELECT TEST_CASE_STEP_UUID, MIN(TEST_CASE_FUNCTION_STEP_SEQ_ID) AS MIN_SEQ_ID FROM TEST_CASE_FUNCTION_STEP WHERE FUNCTION_UUID IN (${"'" + input.FUNCTION_UUID + "'"}) GROUP BY TEST_CASE_STEP_UUID ORDER BY MIN_SEQ_ID ASC;`;
    let testCaseFunctionStepGroupedQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepGroupedQuery, input);
    await changeTestCaseFunctionStepSequence(testCaseFunctionStepGroupedQueryData);
  }
  if (input['FUNCTION_STEP_POSITION'] == 'First Function Step' && input['isFirstRecord'] == 'No' && (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] == 'Yes')) {
    await createFunctionStep();
    await changeFunctionStepSequence();
    await checkForDelete();
  }
  if (input['FUNCTION_STEP_POSITION'] == 'Intermediate Function Step' && input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No' && input['IS_API_EXIST_FOR_STEP_DEFINITION'] == 'No') {
    await createFunctionStep();
    await changeFunctionStepSequence();
    let testCaseFunctionStepGroupedQuery = `SELECT DISTINCT * FROM TEST_CASE_FUNCTION_STEP WHERE FUNCTION_UUID IN (${"'" + input.FUNCTION_UUID + "'"}) AND TEST_CASE_FUNCTION_STEP_SEQ_ID >= :FUNCTION_STEP_SEQ_ID ORDER BY TEST_CASE_FUNCTION_STEP_SEQ_ID ASC;
`;
    let testCaseFunctionStepGroupedQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepGroupedQuery, input);
    await changeTestCaseFunctionStepSequence(testCaseFunctionStepGroupedQueryData);
  }
  if (input['FUNCTION_STEP_POSITION'] == 'Intermediate Function Step' && (input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] == 'Yes')) {
    await createFunctionStep();
    await changeFunctionStepSequence();
    await checkForDelete();
  }
} else if (input.compositeEntityAction == 'Update' && input['isRegularEvent']) {// the below else if block will execute when action is update .
  if (!input['UI_ELEMENT_GROUP_UUID']) {
    // the below function will delete the existing function step attribute value for the particular function step.
    await deletefunctionStepAttributeData("'" + input.FUNCTION_STEP_UUID + "'");
    // creating the new records in function step attribute value table with new value
    await createFunctionStepAttributeValue(stepDefAttributeQueryData);
    // preparing the fucntion step and storing the value aganist the function step name
    input['FUNCTION_STEP_NAME'] = getKeywordByStepType + stepDefVerbiageStr;

    if (input['IS_VALUE_CHANGED'].length > 0) {
      await updateTestCaseFunctionStepAttributeData(stepDefAttributeQueryData);
    }

  } else if (input['UI_ELEMENT_GROUP_UUID']) {
    if (input['isUIElementGroupChanged']) {
      await deletefunctionStepAttributeData("'" + input.FUNCTION_STEP_UUID + "'");
      await deleteFunctionUIElementGroupStepData("'" + input.FUNCTION_STEP_UUID + "'");
      await deleteFunctionUIElementGroupStepAttributeData("'" + input.FUNCTION_STEP_UUID + "'");
      await createFunctionUIElementGroupStep();
      await createFunctionStepAttributeValue(stepDefAttributeQueryData);
    }
    let modifiedFunctionStep = await modifyFunctionNameStep();
    input['FUNCTION_STEP_NAME'] = getKeywordByStepType + modifiedFunctionStep;
  }
} else if (input.compositeEntityAction == 'Update' && !input['isRegularEvent']) {// the below else if block will execute when action is update from inline Grid .
  let modifiedFunctionStep = await modifyFunctionNameStep();
  input['FUNCTION_STEP_NAME'] = getKeywordByStepType + modifiedFunctionStep;
} else if (input.compositeEntityAction == 'Delete') {
  if (((input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'Yes' || input['IS_API_EXIST_FOR_STEP_DEFINITION'] == 'Yes')) && input['isStepExistsAfterCurrentStep'] == 'Yes') {
    // this else if will gets executed with user step definition name contain page name and action is delete
    await deletefunctionStepAttributeData("'" + input['FUNCTION_STEP_UUID'] + "'");
    let functionStepIds = '';
    let functionStepQuery = ''
    if (input['STEP_SELECTION_TYPE'] == 'Select Steps for Deletion' && input['START_STEP'] && input['END_STEP']) {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP where FUNCTION_UUID=:FUNCTION_UUID and FUNCTION_STEP_SEQ_ID>:START_STEP and FUNCTION_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_STEP_SEQ_ID asc`;
      await changeFunctionStepSequence();
    } else if (input['STEP_SELECTION_TYPE'] == 'Delete all Subsequent Steps') {
      functionStepQuery = `SELECT * FROM FUNCTION_STEP where FUNCTION_UUID=:FUNCTION_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and FUNCTION_STEP_SEQ_ID > :FUNCTION_STEP_SEQ_ID`;
    }
    await deleteLinkedTestCaseStepAndChild();
    let functionStepQueryDataa = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepQuery, input);
    // iterating the function step to delete the sub sequent function step
    for (let data of functionStepQueryDataa) {

      if (functionStepQueryDataa && functionStepQueryDataa.length > 0) {
        deleteRecords('FUNCTION_STEP_UUID', data['FUNCTION_STEP_UUID'], 'FUNCTION_STEP');
      }

      await deletefunctionStepAttributeData("'" + data.FUNCTION_STEP_UUID + "'");
      if (data.IS_UI_ELEMENT_GROUP_STEP == 'Yes') {
        await deleteFunctionUIElementGroupStepData("'" + data.FUNCTION_STEP_UUID + "'");
        await deleteFunctionUIElementGroupStepAttributeData("'" + data.FUNCTION_STEP_UUID + "'");
      }
      if (stepDefAttributeQueryData[0]['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
        await deleteFunctionViewNavigationStepData("'" + data.FUNCTION_STEP_UUID + "'");
      }

    }
  } else if ((input['IS_PAGE_EXIST_FOR_STEP_DEFINITION'] == 'No' && input['IS_API_EXIST_FOR_STEP_DEFINITION'] == 'No') || input['isStepExistsAfterCurrentStep'] == 'No') {
    if (input['IS_UI_ELEMENT_GROUP_STEP'] == 'No') {
      // the below function will delete the existing function step attribute value for the particular function step
      await deletefunctionStepAttributeData("'" + input.FUNCTION_STEP_UUID + "'");
    } else if (input['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
      // the below function will delete the existing function step attribute value for the particular function step
      await deletefunctionStepAttributeData("'" + input.FUNCTION_STEP_UUID + "'");
      await deleteFunctionUIElementGroupStepData("'" + input.FUNCTION_STEP_UUID + "'");
      await deleteFunctionUIElementGroupStepAttributeData("'" + input.FUNCTION_STEP_UUID + "'");
    } else if (input['isStepExistsAfterCurrentStep'] == 'No') {
      await deletefunctionStepAttributeData("'" + input.FUNCTION_STEP_UUID + "'");
    } if (stepDefAttributeQueryData[0]['IS_PURE_NAVIGATION_STEP'] == 'Yes') {
      await deleteFunctionViewNavigationStepData("'" + input.FUNCTION_STEP_UUID + "'");
    }
    await deleteLinkedTestCaseStepAndChild();
    await changeFunctionStepSequence();
  }
}

input["AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE"] = functionViewNavigationStepAttributeList;
input["AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP"] = functionViewNavigationStepList;
input["AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE"] = testCaseViewNavigationStepAttributeList;
input["AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP"] = testCaseViewNavigationStepList;
input["AppEngChildEntity:FUNCTION_STEP_AS_CHILD_OF_FUNCTION_STEP"] = functionStepList;
input["AppEngChildEntity:FUNCTION_STEP_ATTRIBUTE_VALUE"] = functionStepAttributeValueArray;
input["AppEngChildEntity:FUNCTION_UI_ELEMENT_GROUP_STEP"] = functionUIElementGroupStepList;
input["AppEngChildEntity:FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE"] = functionUIElementGroupStepAttributeList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP'] = testCaseFunctionStepArray;
input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE"] = testCaseFunctionStepAttributeValueArray;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP'] = testCaseFunctionUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseFunctionUIElementGroupStepAttributeList;