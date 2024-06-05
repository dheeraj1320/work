input['TEST_CASE_STATUS'] = input.compositeEntityAction == 'Insert' ? 'DRAFT' : input.compositeEntityAction == 'Commit' ? 'COMMITED' : input.compositeEntityAction == 'Checkout' ? 'CHECKEDOUT' : input.compositeEntityAction == 'Check In' ? 'COMMITED' : input['TEST_CASE_STATUS'];
console.log('my input test case  :::::::::::::::::::::::::', input);
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

function deleteRecords(key, value, deleteType) {
  const deleteParamenter = {};
  deleteParamenter[key] = value;
  deleteParamenter["compositeEntityAction"] = "Delete";
  if (deleteType === "TEST_CASE_STEP") {
    testCaseStepList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_REQUIREMENT") {
    testCaseRequirmentList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_STEP_ATTRIBUTE_VALUE") {
    testCaseStepAttributeValueList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE") {
    testCaseFunctionStepAttributeValueList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_FUNCTION_STEP") {
    testCaseFunctionStepList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE") {
    testCaseUIElementGroupStepAttributeList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_UI_ELEMENT_GROUP_STEP") {
    testCaseUIElementGroupStepList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE") {
    testCaseFunctionUIElementGroupStepAttributeList.push(deleteParamenter);
  } else if (deleteType === "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP") {
    testCaseFunctionUIElementGroupStepList.push(deleteParamenter);
  }
}

async function deleteTestCaseStepData(testCaseStepStr) {
  deleteRecords('TEST_CASE_STEP_UUID', testCaseStepStr, 'TEST_CASE_STEP');
}

async function deleteTestCaseRequirmentData(testCaseRequirmentStr) {
  deleteRecords('TEST_CASE_REQUIREMENT_UUID', testCaseRequirmentStr, 'TEST_CASE_REQUIREMENT');
}

async function deleteTestCaseStepAttributeData(testCaseStepStr) {
  // firing the query to get all the test case step attribute value for that particulat test case step
  const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input);

  for (let attributeData of testCaseStepAttributeValueQueryData) {
    deleteRecords('TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_STEP_ATTRIBUTE_VALUE');
  }
}

async function deleteTestCaseFunctionStepData(testCaseFunctionStepStr) {
  // firing the query to get all the test case function step  for that particulat test case step
  const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);

  for (let data of testCaseFunctionStepData) {
    deleteRecords('TEST_CASE_FUNCTION_STEP_UUID', data['TEST_CASE_FUNCTION_STEP_UUID'], 'TEST_CASE_FUNCTION_STEP');
  }
}
async function deleteTestCaseFunctionStepAttributeData(testCaseFunctionStepStr) {
  // firing the query to get all the test case function step attribute value for that particulat test case step
  const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);

  for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
    deleteRecords('TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE');
  }
}

async function deleteTestCaseUIElementGroupStepData(testCaseStepStr) {
  // firing the query to get all the test case function step  for that particulat test case step
  const testCaseUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementGroupStepQuery, input);

  for (let data of testCaseUIElementGroupStepQueryData) {
    deleteRecords('TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP');
  }
}

async function deleteTestCaseUIElementGroupStepAttributeData(testCaseStepStr) {
  // firing the query to get all the test case function step attribute value for that particulat test case step
  const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);

  for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
    deleteRecords('TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
  }
}

async function deleteTestCaseFunctionUIElementGroupStepData(testCaseFunctionStepStr) {
  // firing the query to get all the test case function step  for that particular test case step
  const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);

  for (let data of testCaseFunctionUIElementGroupStepQueryData) {
    deleteRecords('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID', data['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP');
  }
}

async function deleteTestCaseFunctionUIElementGroupStepAttributeData(testCaseFunctionStepStr) {
  // firing the query to get all the test case function step attribute value for that particulat test case step
  const testCaseFunctionUIElementGroupStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseFunctionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeValueQuery, input);

  for (let attributeData of testCaseFunctionUIElementGroupStepAttributeValueQueryData) {
    deleteRecords('TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID', attributeData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID'], 'TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE');
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

if (input.compositeEntityAction == 'Copy' || input.compositeEntityAction == 'Copy Test Case') {
  let generatedTestCaseId = uuid();
  // let testCaseName = input['TEST_CASE_NAME'];
  let copyCount = 0;

  let testCaseName = confirmEnding(input['TEST_CASE_NAME'], 'Copy ');

  let spilData = testCaseName.split('- Copy');
  let serchedData = spilData[0].trim();

  const testCaseQuery = `SELECT * FROM TEST_CASE where TEST_CASE_NAME LIKE ${"'%" + serchedData + "%'"} and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_SET_UUID=:TEST_SET_UUID`;
  let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseQuery, input);

  if(input['ORIGINAL_TEST_SET_UUID'] == input['TEST_SET_UUID']){
    // copied in same test set
    copyCount = testCaseQueryData.length != 0 ? testCaseQueryData.length - 1 : ''
    copyCount = testCaseQueryData.length == 1 ? '' : testCaseQueryData.length - 1;
  } else {
    // copied in another test set
    copyCount = testCaseQueryData.length == 0 ? '' : testCaseQueryData.length;
  }

  let modifiedTestCaseName = testCaseName + copyCount;

  let testCaseObject = {
    "TEST_CASE_UUID": generatedTestCaseId,
    "TEST_CASE_NAME": modifiedTestCaseName,
    "TEST_SET_UUID": input['TEST_SET_UUID']
  };
  testCaseList.push(testCaseObject);
  const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
  let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
  let count = 1;
  for (let data of testCaseStepQueryData) {
    let generatedTestCaseStepId = uuid();
    let testCaseStepObject = {
      "TEST_CASE_STEP_UUID": generatedTestCaseStepId,
      "TEST_CASE_UUID": generatedTestCaseId,
      "TEST_SET_UUID": input['TEST_SET_UUID'],
      "TEST_CASE_STEP_NAME": data["TEST_CASE_STEP_NAME"],
      "STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID": data["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
      "CURRENT_PAGE_CONTEXT": data["CURRENT_PAGE_CONTEXT"],
      "TEST_CASE_STEP_SEQ_ID": count,
      "TEST_CASE_STEP_TYPE": data["TEST_CASE_STEP_TYPE"],
      "NEXT_PAGE_CONTEXT": data["NEXT_PAGE_CONTEXT"],
      "IS_UI_ELEMENT_GROUP_STEP": data["IS_UI_ELEMENT_GROUP_STEP"],
      "IS_FUNCTION_STEP": data["IS_FUNCTION_STEP"],
      "TEST_CASE_STEP_ATTRIBUTE_KEYS": data["TEST_CASE_STEP_ATTRIBUTE_KEYS"]
    };
    testCaseStepList.push(testCaseStepObject);
    count++;
    let existingTestCaseStepId = "'" + data["TEST_CASE_STEP_UUID"] + "'";
    const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input);
    for (let attribute of testCaseStepAttributeValueQueryData) {
      let generatedTestCaseStepAttributeId = uuid();
      let testCaseStepAttributeObject = {
        "TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID": generatedTestCaseStepAttributeId,
        "STEP_DEFINITION_ATTRIBUTE_UUID": attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
        "TEST_CASE_STEP_ATTRIBUTE_DATA": attribute['TEST_CASE_STEP_ATTRIBUTE_DATA'],
        "TEST_SET_UUID": input['TEST_SET_UUID'],
        "TEST_CASE_UUID": generatedTestCaseId,
        "TEST_CASE_STEP_UUID": generatedTestCaseStepId
      }
      testCaseStepAttributeValueList.push(testCaseStepAttributeObject);
    }

    if (data["IS_UI_ELEMENT_GROUP_STEP"] == 'No' && data["IS_FUNCTION_STEP"] == 'Yes') {
      const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_STEP_ID asc`;
      let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
      let functionStepCount = 1;
      for (let functionStepData of testCaseFunctionStepData) {
        let generatedTestCaseFunctionStepId = uuid();
        let testCaseFunctionStepObject = {
          "TEST_CASE_FUNCTION_STEP_UUID": generatedTestCaseFunctionStepId,
          "TEST_CASE_FUNCTION_STEP_NAME": functionStepData['TEST_CASE_FUNCTION_STEP_NAME'],
          "STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID": functionStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
          "CURRENT_PAGE_CONTEXT": functionStepData['CURRENT_PAGE_CONTEXT'],
          "NEXT_PAGE_CONTEXT": functionStepData['NEXT_PAGE_CONTEXT'],
          "TEST_CASE_FUNCTION_STEP_TYPE": functionStepData['TEST_CASE_FUNCTION_STEP_TYPE'],
          "TEST_CASE_FUNCTION_STEP_SEQ_ID": functionStepCount,
          "TEST_CASE_STEP_UUID": generatedTestCaseStepId,
          "IS_UI_ELEMENT_GROUP_STEP": functionStepData['IS_UI_ELEMENT_GROUP_STEP'],
          "FUNCTION_UUID": functionStepData['FUNCTION_UUID'],
          "FUNCTION_STEP_UUID": functionStepData['FUNCTION_STEP_UUID'],
          "TEST_CASE_FUNCTION_STEP_ATTRIBUTE_KEYS": functionStepData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_KEYS']
        }
        testCaseFunctionStepList.push(testCaseFunctionStepObject);
        functionStepCount++;
        let existingTestCaseFunctionStepId = "'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'";
        const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);

        for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
          let generatedTestCaseFunctionStepAttributeId = uuid();
          let testCaseFunctionStepAttributeObject = {
            "TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID": generatedTestCaseFunctionStepAttributeId,
            "STEP_DEFINITION_ATTRIBUTE_UUID": functionStepAttributeData['STEP_DEFINITION_ATTRIBUTE_UUID'],
            "TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA": functionStepAttributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'],
            "TEST_CASE_STEP_UUID": generatedTestCaseStepId,
            "TEST_CASE_FUNCTION_STEP_UUID": generatedTestCaseFunctionStepId,
            "FUNCTION_UUID": functionStepAttributeData['FUNCTION_UUID']
          }
          testCaseFunctionStepAttributeValueList.push(testCaseFunctionStepAttributeObject);
        }
        if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
          const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
          let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);

          for (let functionStepUIElementGroupStepData of testCaseFunctionUIElementGroupStepQueryData) {
            let generatedTestCaseFunctionUIElementGroupStepId = uuid();
            let testCaseFunctionUIElementGroupStepObject = {
              "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID": generatedTestCaseFunctionUIElementGroupStepId,
              "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME": functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
              "STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID": functionStepUIElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
              "CURRENT_PAGE_CONTEXT": functionStepUIElementGroupStepData['CURRENT_PAGE_CONTEXT'],
              "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE": functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
              "TEST_CASE_STEP_UUID": generatedTestCaseStepId,
              "TEST_CASE_FUNCTION_STEP_UUID": generatedTestCaseFunctionStepId,
              "UI_ELEMENT_GROUP_UUID": functionStepUIElementGroupStepData['UI_ELEMENT_GROUP_UUID'],
              "FUNCTION_UI_ELEMENT_GROUP_STEP_UUID": functionStepUIElementGroupStepData['FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'],
              "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS": functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'],
            }
            testCaseFunctionUIElementGroupStepList.push(testCaseFunctionUIElementGroupStepObject);
            let existingTestCaseFunctionUIElementGroupStepId = "'" + functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] + "'";
            const testCaseFunctionUIElementGroupStepAttributeQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseFunctionUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let testCaseFunctionUIElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeQuery, input);

            for (let testCaseFunctionUIElementGroupStepAttribute of testCaseFunctionUIElementGroupStepAttributeQueryData) {
              let generatedTestCaseFunctionUIElementGroupStepAttributeId = uuid();
              let testCaseFunctionUIelementGroupAttributeObject = {
                "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID": generatedTestCaseFunctionUIElementGroupStepAttributeId,
                "STEP_DEFINITION_ATTRIBUTE_UUID": testCaseFunctionUIElementGroupStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA": testCaseFunctionUIElementGroupStepAttribute['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID": generatedTestCaseFunctionUIElementGroupStepId,
                "TEST_CASE_STEP_UUID": generatedTestCaseStepId,
                "UI_ELEMENT_GROUP_UUID": testCaseFunctionUIElementGroupStepAttribute['UI_ELEMENT_GROUP_UUID'],
                "TEST_CASE_FUNCTION_STEP_UUID": generatedTestCaseFunctionStepId
              }
              testCaseFunctionUIElementGroupStepAttributeList.push(testCaseFunctionUIelementGroupAttributeObject);
            }
          }
        }
      }
    } else if (data["IS_UI_ELEMENT_GROUP_STEP"] == 'Yes' && data["IS_FUNCTION_STEP"] == 'No') {
      const testCaseUIElementStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
      let testCaseUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementStepQuery, input);
      for (let uiElementGroupStepData of testCaseUIElementStepQueryData) {
        let generatedTestCaseUIElementGroupStepId = uuid();
        let testCaseUIElementGroupStepObject = {
          "TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID": generatedTestCaseUIElementGroupStepId,
          "TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME": uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME'],
          "STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID": uiElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
          "CURRENT_PAGE_CONTEXT": uiElementGroupStepData['CURRENT_PAGE_CONTEXT'],
          "TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE": uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE'],
          "TEST_CASE_STEP_UUID": generatedTestCaseStepId,
          "UI_ELEMENT_GROUP_UUID": uiElementGroupStepData['UI_ELEMENT_GROUP_UUID'],
          "TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS": uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS']
        }
        testCaseUIElementGroupStepList.push(testCaseUIElementGroupStepObject);
        let existingTestCaseUIElementGroupStepId = "'" + uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'] + "'";
        const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
        for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
          let generatedTestCaseUIElementGroupStepAttributeId = uuid();
          let testCaseUIElementGroupStepAttributeobject = {
            "TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID": generatedTestCaseUIElementGroupStepAttributeId,
            "STEP_DEFINITION_ATTRIBUTE_UUID": functionStepAttributeData['STEP_DEFINITION_ATTRIBUTE_UUID'],
            "TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA": functionStepAttributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
            "TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID": generatedTestCaseUIElementGroupStepId,
            "TEST_CASE_STEP_UUID": generatedTestCaseStepId,
            "UI_ELEMENT_GROUP_UUID": functionStepAttributeData['UI_ELEMENT_GROUP_UUID']
          }
          testCaseUIElementGroupStepAttributeList.push(testCaseUIElementGroupStepAttributeobject);
        }
      }
    }
  }
} else if (input.compositeEntityAction == 'Delete') {
  const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
  const testCaseRequirmentQuery = `SELECT * FROM TEST_CASE_REQUIREMENT where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let testCaseRequirmentQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseRequirmentQuery, input);
  if (testCaseRequirmentQueryData && testCaseRequirmentQueryData.length) {
    for (let requirmentData of testCaseRequirmentQueryData) {
      deleteTestCaseRequirmentData(requirmentData['TEST_CASE_REQUIREMENT_UUID']);
    }
  }
  for (let data of testCaseStepQueryData) {
    deleteTestCaseStepData(data['TEST_CASE_STEP_UUID']);
    deleteTestCaseStepAttributeData("'" + data['TEST_CASE_STEP_UUID'] + "'");
    if (data["IS_UI_ELEMENT_GROUP_STEP"] == 'Yes' && data["IS_FUNCTION_STEP"] == 'No') {
      deleteTestCaseUIElementGroupStepData("'" + data['TEST_CASE_STEP_UUID'] + "'");
      deleteTestCaseUIElementGroupStepAttributeData("'" + data['TEST_CASE_STEP_UUID'] + "'");
    } else if (data["IS_UI_ELEMENT_GROUP_STEP"] == 'No' && data["IS_FUNCTION_STEP"] == 'Yes') {
      const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in('${data['TEST_CASE_STEP_UUID']}') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
      let functionStepCount = 1;
      for (let functionStepData of testCaseFunctionStepData) {
        if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'No') {
          deleteTestCaseFunctionStepData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'")
          deleteTestCaseFunctionStepAttributeData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'")
        } else if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
          deleteTestCaseFunctionStepData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'")
          deleteTestCaseFunctionStepAttributeData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'")
          deleteTestCaseFunctionUIElementGroupStepData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'")
          deleteTestCaseFunctionUIElementGroupStepAttributeData("'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'");
        }
      }
    }
  }
} else if (input.compositeEntityAction == 'Function' || input.compositeEntityAction == 'Create Function') {
  let generatedFunctionId = uuid();
  // let testCaseName = input['TEST_CASE_NAME'];
  let copyCount = 0;
  let testCaseName = confirmEnding(input['TEST_CASE_NAME'], 'Copy ');
  let spilData = testCaseName.split('- Copy');
  let serchedData = spilData[0].trim();
  const functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION where FUNCTION_NAME LIKE ${"'%" + serchedData + "%'"} and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
  let functionQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionQuery, input);
  // copyCount = functionQueryData.length != 0 ? functionQueryData.length - 1 : ''
  copyCount = functionQueryData.length == 0 ? '' : functionQueryData.length;
  let modifiedTestCaseName = testCaseName + copyCount;
  let functionObject = {
    "FUNCTION_UUID": generatedFunctionId,
    "FUNCTION_NAME": modifiedTestCaseName,
  };
  functionList.push(functionObject);
  const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
  let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
  for (let data of testCaseStepQueryData) {
    let existingTestCaseStepId = "'" + data["TEST_CASE_STEP_UUID"] + "'";
    if (data["IS_UI_ELEMENT_GROUP_STEP"] == 'No' && data["IS_FUNCTION_STEP"] == 'No') {
      let generatedFunctionStepId = uuid();
      let functionStepObject = {
        "FUNCTION_STEP_UUID": generatedFunctionStepId,
        "FUNCTION_UUID": generatedFunctionId,
        "FUNCTION_STEP_NAME": data["TEST_CASE_STEP_NAME"],
        "STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID": data["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
        "CURRENT_PAGE_CONTEXT": data["CURRENT_PAGE_CONTEXT"],
        "FUNCTION_STEP_TYPE": data["TEST_CASE_STEP_TYPE"],
        "NEXT_PAGE_CONTEXT": data["NEXT_PAGE_CONTEXT"],
        "IS_UI_ELEMENT_GROUP_STEP": data["IS_UI_ELEMENT_GROUP_STEP"],
        "FUNCTION_STEP_ATTRIBUTE_KEYS": data["TEST_CASE_STEP_ATTRIBUTE_KEYS"],
        "IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT": data["TEST_CASE_STEP_ATTRIBUTE_KEYS"] && data["TEST_CASE_STEP_ATTRIBUTE_KEYS"].includes('UIElementValue') ? "Yes" : null,
      };
      functionStepList.push(functionStepObject);
      const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input);
      for (let attribute of testCaseStepAttributeValueQueryData) {
        let generatedFunctionStepAttributeId = uuid();
        let functionStepAttributeObject = {
          "FUNCTION_STEP_ATTRIBUTE_VALUE_UUID": generatedFunctionStepAttributeId,
          "STEP_DEFINITION_ATTRIBUTE_UUID": attribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
          "FUNCTION_STEP_ATTRIBUTE_DATA": attribute['TEST_CASE_STEP_ATTRIBUTE_DATA'],
          "FUNCTION_UUID": generatedFunctionId,
          "FUNCTION_STEP_UUID": generatedFunctionStepId
        }
        functionStepAttributeValueList.push(functionStepAttributeObject);
      }
    } if (data["IS_UI_ELEMENT_GROUP_STEP"] == 'No' && data["IS_FUNCTION_STEP"] == 'Yes') {
      const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_STEP_ID asc`;
      let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
      for (let functionStepData of testCaseFunctionStepData) {
        let generatedFunctionStepId = uuid();
        let existingTestCaseFunctionStepId = "'" + functionStepData['TEST_CASE_FUNCTION_STEP_UUID'] + "'";
        if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'No') {
          let functionStepObject = {
            "FUNCTION_STEP_UUID": generatedFunctionStepId,
            "FUNCTION_UUID": generatedFunctionId,
            "FUNCTION_STEP_NAME": functionStepData['TEST_CASE_FUNCTION_STEP_NAME'],
            "STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID": functionStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
            "CURRENT_PAGE_CONTEXT": functionStepData['CURRENT_PAGE_CONTEXT'],
            "FUNCTION_STEP_TYPE": functionStepData['TEST_CASE_FUNCTION_STEP_TYPE'],
            "NEXT_PAGE_CONTEXT": functionStepData['NEXT_PAGE_CONTEXT'],
            "IS_UI_ELEMENT_GROUP_STEP": functionStepData['IS_UI_ELEMENT_GROUP_STEP'],
            "FUNCTION_STEP_ATTRIBUTE_KEYS": functionStepData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_KEYS'],
            "IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT": functionStepData["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_KEYS"] && functionStepData["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_KEYS"].includes('UIElementValue') ? "Yes" : null
          }
          functionStepList.push(functionStepObject);
          const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
          let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
          for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
            let generatedFunctionStepAttributeId = uuid();
            let functionStepAttributeObject = {
              "FUNCTION_STEP_ATTRIBUTE_VALUE_UUID": generatedFunctionStepAttributeId,
              "STEP_DEFINITION_ATTRIBUTE_UUID": functionStepAttributeData['STEP_DEFINITION_ATTRIBUTE_UUID'],
              "FUNCTION_STEP_ATTRIBUTE_DATA": functionStepAttributeData['TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA'],
              "FUNCTION_STEP_UUID": generatedFunctionStepId,
              "FUNCTION_UUID": generatedFunctionId
            }
            functionStepAttributeValueList.push(functionStepAttributeObject);
          }
        } else if (functionStepData['IS_UI_ELEMENT_GROUP_STEP'] == 'Yes') {
          const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
          let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);
          for (let functionStepUIElementGroupStepData of testCaseFunctionUIElementGroupStepQueryData) {
            let generatedFunctionStepId = uuid();
            let existingTestCaseFunctionUIElementGroupStepId = "'" + functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID'] + "'";
            let functionStepObject = {
              "FUNCTION_STEP_UUID": generatedFunctionStepId,
              "FUNCTION_UUID": generatedFunctionId,
              "FUNCTION_STEP_NAME": functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME'],
              "STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID": functionStepUIElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
              "CURRENT_PAGE_CONTEXT": functionStepUIElementGroupStepData['CURRENT_PAGE_CONTEXT'],
              "FUNCTION_STEP_TYPE": functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE'],
              "NEXT_PAGE_CONTEXT": null,
              "IS_UI_ELEMENT_GROUP_STEP": "No",
              "FUNCTION_STEP_ATTRIBUTE_KEYS": functionStepUIElementGroupStepData['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'],
              "IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT": functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS"] && functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS"].includes('UIElementValue') ? "Yes" : null
            }
            functionStepList.push(functionStepObject);
            const testCaseFunctionUIElementGroupStepAttributeQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseFunctionUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let testCaseFunctionUIElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeQuery, input);
            for (let testCaseFunctionUIElementGroupStepAttribute of testCaseFunctionUIElementGroupStepAttributeQueryData) {
              let generatedFunctionStepAttributeId = uuid();
              let functionStepAttributeObject = {
                "FUNCTION_STEP_ATTRIBUTE_VALUE_UUID": generatedFunctionStepAttributeId,
                "STEP_DEFINITION_ATTRIBUTE_UUID": testCaseFunctionUIElementGroupStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                "FUNCTION_STEP_ATTRIBUTE_DATA": testCaseFunctionUIElementGroupStepAttribute['TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
                "FUNCTION_STEP_UUID": generatedFunctionStepId,
                "FUNCTION_UUID": generatedFunctionId
              }
              functionStepAttributeValueList.push(functionStepAttributeObject);
            }
          }
        }
      }
    } else if (data["IS_UI_ELEMENT_GROUP_STEP"] == 'Yes' && data["IS_FUNCTION_STEP"] == 'No') {
      const testCaseUIElementStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
      let testCaseUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementStepQuery, input);
      for (let uiElementGroupStepData of testCaseUIElementStepQueryData) {
        let generatedFunctionStepId = uuid();
        let existingTestCaseUIElementGroupStepId = "'" + uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID'] + "'";
        let functionStepObject = {
          "FUNCTION_STEP_UUID": generatedFunctionStepId,
          "FUNCTION_UUID": generatedFunctionId,
          "FUNCTION_STEP_NAME": uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME'],
          "STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID": uiElementGroupStepData['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
          "CURRENT_PAGE_CONTEXT": uiElementGroupStepData['CURRENT_PAGE_CONTEXT'],
          "FUNCTION_STEP_TYPE": uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE'],
          "IS_UI_ELEMENT_GROUP_STEP": "No",
          "FUNCTION_STEP_ATTRIBUTE_KEYS": uiElementGroupStepData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS'],
          "IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT": uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS"] && uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_KEYS"].includes('UIElementValue') ? "Yes" : null,
        }
        functionStepList.push(functionStepObject);

        const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
        for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
          let generatedTestCaseUIElementGroupStepAttributeId = uuid();
          let functionStepAttributeObject = {
            "FUNCTION_STEP_ATTRIBUTE_VALUE_UUID": generatedTestCaseUIElementGroupStepAttributeId,
            "STEP_DEFINITION_ATTRIBUTE_UUID": functionStepAttributeData['STEP_DEFINITION_ATTRIBUTE_UUID'],
            "FUNCTION_STEP_ATTRIBUTE_DATA": functionStepAttributeData['TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA'],
            "FUNCTION_UUID": generatedFunctionId,
            "FUNCTION_STEP_UUID": generatedFunctionStepId
          }
          functionStepAttributeValueList.push(functionStepAttributeObject);
        }
      }
    }
  }
}


input["AppEngChildEntity:TEST_CASE_CHILD_OF_TEST_CASE"] = testCaseList;
input["AppEngChildEntity:TEST_CASE_STEP_NEW"] = testCaseStepList;
input["AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT"] = testCaseRequirmentList;
input["AppEngChildEntity:TEST_CASE_STEP_ATTRIBUTE_VALUE"] = testCaseStepAttributeValueList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_STEP'] = testCaseFunctionStepList;
input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE"] = testCaseFunctionStepAttributeValueList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP'] = testCaseFunctionUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseFunctionUIElementGroupStepAttributeList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP'] = testCaseUIElementGroupStepList;
input['AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE'] = testCaseUIElementGroupStepAttributeList;
input["AppEngChildEntity:FUNCTION"] = functionList;
input["AppEngChildEntity:FUNCTION_STEP"] = functionStepList;
input["AppEngChildEntity:FUNCTION_STEP_ATTRIBUTE_VALUE"] = functionStepAttributeValueList;