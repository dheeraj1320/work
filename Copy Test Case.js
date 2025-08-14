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
    const stepDefAttributeQueryList = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
    let stepDefAttributeQueryDataList = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQueryList, input);
    async function setAttributeValue(attributeId, attributeData) {
        if (attributeId) {
            let query = `SELECT TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_STEP_ATTRIBUTE_DATA AS NAME,'Test Case' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID UNION SELECT TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA AS NAME,'Function' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID UNION SELECT TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID AS ID, TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA AS NAME,'View Navigation' as SOURCE_TYPE,STEP_DEFINITION_ATTRIBUTE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID='${attributeId}' AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let res = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", query, input);
            return res && res.length ? res[0]["NAME"] : attributeData;
        } else {
            return attributeData;
        }
    }

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
        } else if (deleteType === "TEST_CASE_VIEW_NAVIGATION_STEP") {
            testCaseViewNavigationList.push(deleteParamenter);
        } else if (deleteType === "TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE") {
            testCaseViewNavigationAttributeValueList.push(deleteParamenter);
        }
    }
    async function deleteTestCaseStepData(testCaseStepStr) {
        deleteRecords("TEST_CASE_STEP_UUID", testCaseStepStr, "TEST_CASE_STEP");
    }
    async function deleteTestCaseRequirmentData(testCaseRequirmentStr) {
        deleteRecords("TEST_CASE_REQUIREMENT_UUID", testCaseRequirmentStr, "TEST_CASE_REQUIREMENT");
    }
    async function deleteTestCaseStepAttributeData(testCaseStepStr) {
        const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input);
        for (let attributeData of testCaseStepAttributeValueQueryData) {
            deleteRecords("TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID", attributeData["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"], "TEST_CASE_STEP_ATTRIBUTE_VALUE");
        }
    }
    async function deleteTestCaseFunctionStepData(testCaseFunctionStepStr) {
        const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${ testCaseFunctionStepStr ? testCaseFunctionStepStr : `''` }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
        if (testCaseFunctionStepData && testCaseFunctionStepData.length) {
            for (let data of testCaseFunctionStepData) {
                deleteRecords("TEST_CASE_FUNCTION_STEP_UUID", data["TEST_CASE_FUNCTION_STEP_UUID"], "TEST_CASE_FUNCTION_STEP");
            }
        }
    }
    async function deleteTestCaseFunctionStepAttributeData(testCaseFunctionStepStr) {
        const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
        for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
            deleteRecords("TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID", attributeData["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"], "TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE");
        }
    }
    async function deleteTestCaseUIElementGroupStepData(testCaseStepStr) {
        const testCaseUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementGroupStepQuery, input);
        for (let data of testCaseUIElementGroupStepQueryData) {
            deleteRecords("TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID", data["TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID"], "TEST_CASE_UI_ELEMENT_GROUP_STEP");
        }
    }
    async function deleteTestCaseUIElementGroupStepAttributeData(testCaseStepStr) {
        const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${testCaseStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
        for (let attributeData of testCaseFunctionStepAttributeValueQueryData) {
            deleteRecords("TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID", attributeData["TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID"], "TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE");
        }
    }
    async function deleteTestCaseFunctionUIElementGroupStepData(testCaseFunctionStepStr) {
        const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);
        for (let data of testCaseFunctionUIElementGroupStepQueryData) {
            deleteRecords("TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID", data["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID"], "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP");
        }
    }
    async function deleteTestCaseFunctionUIElementGroupStepAttributeData(testCaseFunctionStepStr) {
        const testCaseFunctionUIElementGroupStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${testCaseFunctionStepStr}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseFunctionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeValueQuery, input);
        for (let attributeData of testCaseFunctionUIElementGroupStepAttributeValueQueryData) {
            deleteRecords("TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID", attributeData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID"], "TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE");
        }
    }
    async function checkUIElementValueExist(data) {
        let result = null;
        const stepDefAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID='${data["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"]}' order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
        let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input);
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
            let getUIElementStepDefAttributeUUID = stepDefAttributeQueryData.filter((item) => item["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "74da67d2-41c9-4cf7-9eea-715243e5fcdc");
            if (getUIElementStepDefAttributeUUID && getUIElementStepDefAttributeUUID.length) {
                result = "Yes";
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
        const stepDefAttributeQuery = `SELECT * FROM STEP_DEFINITION_ATTRIBUTE where STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID='${data["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"]}' order by STEP_DEFINITION_ATTRIBUTE_ID asc`;
        let stepDefAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", stepDefAttributeQuery, input);
        if (stepDefAttributeQueryData && stepDefAttributeQueryData.length) {
            let getUIElementStepDefAttributeUUID = stepDefAttributeQueryData.filter((item) => item["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7182ebf0-2e33-11ef-9033-4bb93e602d01");
            if (getUIElementStepDefAttributeUUID && getUIElementStepDefAttributeUUID.length) {
                result = "Yes";
            } else {
                result = null;
            }
        } else {
            result = null;
        }
        return result;
    }
    async function getTestCaseStepByPosition() {
        let testCaseStepQuery = "";
        if (input["DESTINATION_STEP_POSITION"] == "First Test Case Step") {
            testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:DESTINATION_TEST_CASE and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
        } else if (input["DESTINATION_STEP_POSITION"] == "Last Test Case Step") {
            testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:DESTINATION_TEST_CASE and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
        } else if (input["DESTINATION_STEP_POSITION"] == "Intermediate Test Case Step") {
            testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:DESTINATION_TEST_CASE and TEST_CASE_STEP_SEQ_ID>:DESTINATION_AFTER_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
        }
        let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
        return testCaseStepQueryData && testCaseStepQueryData.length ? testCaseStepQueryData : [];
    }
    async function getSequinceBasedOnPosition() {
        let object = {};
        if (input["DESTINATION_STEP_POSITION"] == "First Test Case Step") {
            object["seqId"] = 1;
            let testCaseStepQueryData = await getTestCaseStepByPosition();
            object["testCaseStepQueryData"] = testCaseStepQueryData;
        } else if (input["DESTINATION_STEP_POSITION"] == "Last Test Case Step") {
            let testCaseStepQueryData = await getTestCaseStepByPosition();
            object["testCaseStepQueryData"] = testCaseStepQueryData;
            object["seqId"] = testCaseStepQueryData.length + 1;
        } else if (input["DESTINATION_STEP_POSITION"] == "Intermediate Test Case Step") {
            let testCaseStepQueryData = await getTestCaseStepByPosition();
            object["testCaseStepQueryData"] = testCaseStepQueryData;
            object["seqId"] = input["DESTINATION_AFTER_STEP"] + 1;
        }
        return object;
    }

    function reorderTestCaseStep(latestCount, testCaseStepQueryData) {
        for (let testCaseStep of testCaseStepQueryData) {
            let testCaseStepObject = {};
            testCaseStepObject["TEST_CASE_STEP_UUID"] = testCaseStep["TEST_CASE_STEP_UUID"];
            testCaseStepObject["TEST_CASE_UUID"] = testCaseStep["TEST_CASE_UUID"];
            testCaseStepObject["TEST_SET_UUID"] = testCaseStep["TEST_SET_UUID"];
            testCaseStepObject["TEST_CASE_STEP_SEQ_ID"] = latestCount;
            testCaseStepObject["compositeEntityAction"] = "Update";
            latestCount++;
            testCaseStepList.push(testCaseStepObject);
        }
    }

    function confirmEnding(string, target) {
        let splitedData;
        if (string.substr(-target.length) === target) {
            splitedData = string.split("- Copy ");
            return splitedData[0].trim() + " - Copy ";
        } else {
            splitedData = string.split("- Copy ");
            return splitedData[0].trim() + " - Copy ";
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
            if (copiedData && copiedData["SCOPE_VARIABLE_UUID"]) {
                let isParentScopeUUIDExists = isParentScopeExists(copiedData["SCOPE_VARIABLE_UUID"], testCaseStepAttributeValueList, "EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID", testCaseFunctionStepAttributeValueList, "EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID");
                if (!isParentScopeUUIDExists) {
                    copiedData["FUNCTION_UUID"] = null;
                    copiedData["SCOPE_VARIABLE_UUID"] = null;
                }
                for (let attribute of testCaseStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
                for (let attribute of testCaseFunctionStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
            }
        }
        for (let copiedData of copyTestCaseUIElementGroupStepAttributeList) {
            if (copiedData && copiedData["SCOPE_VARIABLE_UUID"]) {
                let isParentScopeUUIDExists = isParentScopeExists(copiedData["SCOPE_VARIABLE_UUID"], testCaseStepAttributeValueList, "EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID", testCaseFunctionStepAttributeValueList, "EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID");
                if (!isParentScopeUUIDExists) {
                    copiedData["FUNCTION_UUID"] = null;
                    copiedData["SCOPE_VARIABLE_UUID"] = null;
                }
                for (let attribute of testCaseStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
                for (let attribute of testCaseFunctionStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
            }
        }
        for (let copiedData of copyTestCaseViewNavigationAttributeValueList) {
            if (copiedData && copiedData["SCOPE_VARIABLE_UUID"]) {
                let isParentScopeUUIDExists = isParentScopeExists(copiedData["SCOPE_VARIABLE_UUID"], testCaseStepAttributeValueList, "EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID", testCaseFunctionStepAttributeValueList, "EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID");
                if (!isParentScopeUUIDExists) {
                    copiedData["FUNCTION_UUID"] = null;
                    copiedData["SCOPE_VARIABLE_UUID"] = null;
                }
                for (let attribute of testCaseStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
                for (let attribute of testCaseFunctionStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
            }
        }
        for (let copiedData of copytestCaseFunctionStepAttributeValueList) {
            if (copiedData && copiedData["SCOPE_VARIABLE_UUID"]) {
                let isParentScopeUUIDExists = isParentScopeExists(copiedData["SCOPE_VARIABLE_UUID"], testCaseStepAttributeValueList, "EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID", testCaseFunctionStepAttributeValueList, "EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID");
                if (!isParentScopeUUIDExists) {
                    copiedData["FUNCTION_UUID"] = null;
                    copiedData["SCOPE_VARIABLE_UUID"] = null;
                }
                for (let attribute of testCaseStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
                for (let attribute of testCaseFunctionStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
            }
        }
        for (let copiedData of copytestCaseFunctionUIElementGroupStepAttributeList) {
            if (copiedData && copiedData["SCOPE_VARIABLE_UUID"]) {
                let isParentScopeUUIDExists = isParentScopeExists(copiedData["SCOPE_VARIABLE_UUID"], testCaseStepAttributeValueList, "EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID", testCaseFunctionStepAttributeValueList, "EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID");
                if (!isParentScopeUUIDExists) {
                    copiedData["FUNCTION_UUID"] = null;
                    copiedData["SCOPE_VARIABLE_UUID"] = null;
                }
                for (let attribute of testCaseStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
                for (let attribute of testCaseFunctionStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
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
            if (copiedData && copiedData["SCOPE_VARIABLE_UUID"]) {
                let isParentScopeUUIDExists = isParentScopeExists(copiedData["SCOPE_VARIABLE_UUID"], testCaseStepAttributeValueList, "EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID", [], "");
                if (!isParentScopeUUIDExists) {
                    copiedData["FUNCTION_UUID"] = null;
                    copiedData["SCOPE_VARIABLE_UUID"] = null;
                }
                for (let attribute of testCaseStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
            }
        }
        for (let copiedData of copyTestCaseUIElementGroupStepAttributeList) {
            if (copiedData && copiedData["SCOPE_VARIABLE_UUID"]) {
                let isParentScopeUUIDExists = isParentScopeExists(copiedData["SCOPE_VARIABLE_UUID"], testCaseStepAttributeValueList, "EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID", [], "");
                if (!isParentScopeUUIDExists) {
                    copiedData["FUNCTION_UUID"] = null;
                    copiedData["SCOPE_VARIABLE_UUID"] = null;
                }
                for (let attribute of testCaseStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
            }
        }
        for (let copiedData of copyTestCaseViewNavigationAttributeValueList) {
            if (copiedData && copiedData["SCOPE_VARIABLE_UUID"]) {
                let isParentScopeUUIDExists = isParentScopeExists(copiedData["SCOPE_VARIABLE_UUID"], testCaseStepAttributeValueList, "EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID", [], "");
                if (!isParentScopeUUIDExists) {
                    copiedData["FUNCTION_UUID"] = null;
                    copiedData["SCOPE_VARIABLE_UUID"] = null;
                }
                for (let attribute of testCaseStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
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
            if (copiedData && copiedData["SCOPE_VARIABLE_UUID"]) {
                let isParentScopeUUIDExists = isParentScopeExists(copiedData["SCOPE_VARIABLE_UUID"], functionStepAttributeValueList, "EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID", [], "");
                if (!isParentScopeUUIDExists) {
                    copiedData["SCOPE_VARIABLE_UUID"] = null;
                }
                for (let attribute of functionStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
            }
        }
        for (let copiedData of copyFunctionUIElementGroupStepAttributeList) {
            if (copiedData && copiedData["SCOPE_VARIABLE_UUID"]) {
                let isParentScopeUUIDExists = isParentScopeExists(copiedData["SCOPE_VARIABLE_UUID"], functionStepAttributeValueList, "EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID", [], "");
                if (!isParentScopeUUIDExists) {
                    copiedData["SCOPE_VARIABLE_UUID"] = null;
                }
                for (let attribute of functionStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
            }
        }
        for (let copiedData of copyFunctionViewNavigationAttributeValueList) {
            if (copiedData && copiedData["SCOPE_VARIABLE_UUID"]) {
                let isParentScopeUUIDExists = isParentScopeExists(copiedData["SCOPE_VARIABLE_UUID"], functionStepAttributeValueList, "EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID", [], "");
                if (!isParentScopeUUIDExists) {
                    copiedData["SCOPE_VARIABLE_UUID"] = null;
                }
                for (let attribute of functionStepAttributeValueList) {
                    let stepDefAttributeQueryData = getStepAttributeDataByPK(stepDefAttributeQueryDataList, attribute["STEP_DEFINITION_ATTRIBUTE_UUID"]);
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "7c7a43c8-e484-11ef-904e-02c8cad0208d" && isSimilarTestSet == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                    if (stepDefAttributeQueryData && stepDefAttributeQueryData.length && stepDefAttributeQueryData[0]["STEP_DEFINITION_ATTRIBUTE_MASTER_UUID"] == "842981e7-e484-11ef-904e-02c8cad0208d" && isSimilarTestCase == "No") {
                        if (copiedData["SCOPE_VARIABLE_UUID"] == attribute["EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"]) {
                            copiedData["SCOPE_VARIABLE_UUID"] = attribute["FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"];
                        }
                    }
                }
            }
        }
        functionStepAttributeValueList = copyFunctionStepAttributeValueList;
        functionUIElementGroupStepAttributeList = copyFunctionUIElementGroupStepAttributeList;
        functionViewNavigationAttributeValueList = copyFunctionViewNavigationAttributeValueList;
    }
    if (input.compositeEntityAction == "Insert") {
        if (!input["TEST_CASE_EXECUTON_TYPE"]) {
            input["TEST_CASE_EXECUTON_TYPE"] = "Manual";
        }
        input["SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE"] = "Yes";
        if (input["PARENT_GRID_NAME"] == "Personal Test Set") {
            input["TEST_CASE_OWNER"] = input["APP_LOGGED_IN_USER_ID"];
        } else if (input["PARENT_GRID_NAME"] == "Unit Functional Test Set" || input["PARENT_GRID_NAME"] == "Orphan Test Set") {
            input["TEST_CASE_OWNER"] = input["APP_LOGGED_IN_USER_ID"];
        } else if (input["PARENT_GRID_NAME"] == "Test Set") {
            input["TEST_CASE_OWNER"] = input["APP_LOGGED_IN_USER_ID"];
        } else if (input["PARENT_GRID_NAME"] == "Personal - Unit Functional Test Set") {
            input["TEST_CASE_OWNER"] = input["APP_LOGGED_IN_USER_ID"];
        } else if (input["PARENT_GRID_NAME"] == "Personal - Regular Test Set") {
            input["TEST_CASE_OWNER"] = input["APP_LOGGED_IN_USER_ID"];
        } else if (input["PARENT_GRID_NAME"] == "Personal - Orphan Test Set") {
            input["TEST_CASE_OWNER"] = input["APP_LOGGED_IN_USER_ID"];
        }else {
        input["TEST_CASE_OWNER"] = input["APP_LOGGED_IN_USER_ID"];
    }
        let testCaseDescUUID = uuid();
        input["TEST_CASE_DESCRIPTION_UUID"] = testCaseDescUUID;
        let testCaseDesc = {};
        testCaseDesc["TEST_CASE_DESCRIPTION_UUID"] = testCaseDescUUID;
        testCaseDescriptionList.push(testCaseDesc);
        input["AppEngChildEntity:TEST_CASE_DESCRIPTION"] = testCaseDescriptionList;
    }
    async function updateTestCaseStepAndItsAttribute() {
        const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
        let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
        for (let testCaseStep of testCaseStepQueryData) {
            let testCaseStepObject = {};
            testCaseStepObject["TEST_SET_UUID"] = input["DEST_TEST_SET"];
            testCaseStepObject["TEST_CASE_STEP_UUID"] = testCaseStep["TEST_CASE_STEP_UUID"];
            testCaseStepList.push(testCaseStepObject);
            let existingTestCaseStepId = "'" + testCaseStep["TEST_CASE_STEP_UUID"] + "'";
            const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input);
            for (let attribute of testCaseStepAttributeValueQueryData) {
                let testCaseStepAttributeObject = {};
                testCaseStepAttributeObject["TEST_SET_UUID"] = input["DEST_TEST_SET"];
                testCaseStepAttributeObject["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"] = attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"];
                testCaseStepAttributeObject["TEST_CASE_STEP_UUID"] = attribute["TEST_CASE_STEP_UUID"];
                testCaseStepAttributeValueList.push(testCaseStepAttributeObject);
            }
        }
    }
    if (input.compositeEntityAction == "Commit") {
        if (input["PARENT_GRID_NAME"] == "Personal Test Set") {
            input["TEST_CASE_OWNER"] = null;
            input["TEST_SET_UUID"] = input["DEST_TEST_SET"];
            await updateTestCaseStepAndItsAttribute();
        } else if (input["PARENT_GRID_NAME"] == "Personal - Unit Functional Test Set") {
            input["TEST_CASE_OWNER"] = null;
        } else if (input["PARENT_GRID_NAME"] == "Personal - Regular Test Set") {
            input["TEST_CASE_OWNER"] = null;
        } else if (input["PARENT_GRID_NAME"] == "Personal - Orphan Test Set") {
            input["TEST_CASE_OWNER"] = null;
        } else if (input["PARENT_GRID_NAME"] == "Personal - API Test Set") {
            input["TEST_CASE_OWNER"] = null;
        } else {
            input["TEST_CASE_OWNER"] = null;
        }
    }
    if (input.compositeEntityAction == "Delete") {
        const testDataSetQuery = `SELECT * FROM TEST_DATA_SET WHERE PARENT_UUID = :TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testDataSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testDataSetQuery, input);
        if (testDataSetQueryData && testDataSetQueryData.length) {
            for (let index = 0; index < testDataSetQueryData.length; index++) {
                const element = testDataSetQueryData[index];
                testDataSet.push({
                    PARENT_TYPE: "Test_Case",
                    TEST_DATA_SET_UUID: element.TEST_DATA_SET_UUID,
                    compositeEntityAction: "Delete",
                });
            }
        }
        let testDataQuery = `SELECT * FROM TEST_DATA where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testDataQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testDataQuery, input);
        console.log("test Data Query Data", testDataQueryData);
        if (testDataQueryData && testDataQueryData.length > 0) {
            for (let index = 0; index < testDataQueryData.length; index++) {
                const element = testDataQueryData[index];
                testData.push({
                    TEST_DATA_UUID: element.TEST_DATA_UUID,
                    compositeEntityAction: "Delete",
                });
            }
        }
        const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
        const testCaseRequirmentQuery = `SELECT * FROM TEST_CASE_REQUIREMENT where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let testCaseRequirmentQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseRequirmentQuery, input);
        if (testCaseRequirmentQueryData && testCaseRequirmentQueryData.length) {
            for (let requirmentData of testCaseRequirmentQueryData) {
                deleteTestCaseRequirmentData(requirmentData["TEST_CASE_REQUIREMENT_UUID"]);
            }
        }
        for (let data of testCaseStepQueryData) {
            deleteTestCaseStepData(data["TEST_CASE_STEP_UUID"]);
            deleteTestCaseStepAttributeData("'" + data["TEST_CASE_STEP_UUID"] + "'");
            if (data["IS_UI_ELEMENT_GROUP_STEP"] == "Yes" && data["IS_FUNCTION_STEP"] == "No") {
                deleteTestCaseUIElementGroupStepData("'" + data["TEST_CASE_STEP_UUID"] + "'");
                deleteTestCaseUIElementGroupStepAttributeData("'" + data["TEST_CASE_STEP_UUID"] + "'");
            } else if (data["IS_UI_ELEMENT_GROUP_STEP"] == "No" && data["IS_FUNCTION_STEP"] == "Yes") {
                const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in('${ data["TEST_CASE_STEP_UUID"] ? data["TEST_CASE_STEP_UUID"] : `''` }') and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
                let functionStepCount = 1;
                if (testCaseFunctionStepData && testCaseFunctionStepData.length) {
                    for (let functionStepData of testCaseFunctionStepData) {
                        if (functionStepData["IS_UI_ELEMENT_GROUP_STEP"] == "No") {
                            deleteTestCaseFunctionStepData("'" + functionStepData["TEST_CASE_FUNCTION_STEP_UUID"] + "'");
                            deleteTestCaseFunctionStepAttributeData("'" + functionStepData["TEST_CASE_FUNCTION_STEP_UUID"] + "'");
                        } else if (functionStepData["IS_UI_ELEMENT_GROUP_STEP"] == "Yes") {
                            deleteTestCaseFunctionStepData("'" + functionStepData["TEST_CASE_FUNCTION_STEP_UUID"] + "'");
                            deleteTestCaseFunctionStepAttributeData("'" + functionStepData["TEST_CASE_FUNCTION_STEP_UUID"] + "'");
                            deleteTestCaseFunctionUIElementGroupStepData("'" + functionStepData["TEST_CASE_FUNCTION_STEP_UUID"] + "'");
                            deleteTestCaseFunctionUIElementGroupStepAttributeData("'" + functionStepData["TEST_CASE_FUNCTION_STEP_UUID"] + "'");
                        }
                    }
                }
            }
            if (data["IS_PURE_NAVIGATION_STEP"] == "Yes") {
                const viewNavigationDataQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP WHERE TEST_CASE_STEP_UUID = :TEST_CASE_STEP_UUID AND FUNCTIONAL_AREA_UUID =:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
                const viewNavigationData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavigationDataQuery, {
                    TEST_CASE_STEP_UUID: data["TEST_CASE_STEP_UUID"],
                    APP_LOGGED_IN_FUNTIONAL_AREA_ID: input.APP_LOGGED_IN_FUNTIONAL_AREA_ID,
                });
                for (const [index, viewNavigation] of viewNavigationData.entries()) {
                    deleteRecords("TEST_CASE_VIEW_NAVIGATION_STEP_UUID", viewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_UUID"], "TEST_CASE_VIEW_NAVIGATION_STEP");
                    const viewNavAttributeQuery = `SELECT TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE WHERE TEST_CASE_VIEW_NAVIGATION_STEP_UUID = '${viewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_UUID"]}'`;
                    const viewNavAttributeData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewNavAttributeQuery, input);
                    for (const attrData of viewNavAttributeData) {
                        deleteRecords("TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID", attrData["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"], "TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE");
                    }
                }
            }
        }
    } else if (input.compositeEntityAction == "Function" || input.compositeEntityAction == "Create Function") {
        let generatedFunctionId = uuid();
        let copyCount = 0;
        let testCaseName = confirmEnding(input["TEST_CASE_NAME"], "Copy ");
        let spilData = testCaseName.split("- Copy");
        let serchedData = spilData[0].trim();
        if (serchedData.includes("'")) {
            serchedData = serchedData.split("'").join("''");
        }
        const functionQuery = `SELECT * FROM featuremanagement_app.FUNCTION where FUNCTION_NAME LIKE '%${serchedData}%' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let functionQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionQuery, input);
        copyCount = functionQueryData.length > 1 ? functionQueryData.length - 1 : "";
        let modifiedTestCaseName = functionQueryData.length != 0 ? testCaseName + copyCount : input["TEST_CASE_NAME"];
        let testCaseStepQuery = ``;
        if (input["STEP_SELECTION_TYPE"] == "Copy Selected Test Case Steps" && input["START_STEP"] && input["END_STEP"]) {
            testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and TEST_CASE_STEP_SEQ_ID>=:START_STEP and TEST_CASE_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
        } else if (input["STEP_SELECTION_TYPE"] == "Copy Selected Test Case Steps" && input["START_STEP"] && !input["END_STEP"]) {
            testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and TEST_CASE_STEP_SEQ_ID>=:START_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
        } else if (input["STEP_SELECTION_TYPE"] == "Copy All Test Case Steps") {
            testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
        }
        let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
        let startPage = "";
        let isIntermediate = "No";
        if (input["STEP_SELECTION_TYPE"] == "Copy Selected Test Case Steps") {
            let fileredCurrentData = testCaseStepQueryData.filter((item) => item["TEST_CASE_STEP_SEQ_ID"] == input["START_STEP"]);
            if (fileredCurrentData && fileredCurrentData.length > 0) {
                let fileredData = fileredCurrentData[0];
                let currentTestCaseStepId = "'" + fileredData["TEST_CASE_STEP_UUID"] + "'";
                const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${currentTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input);
                let currentAttributeDataId = testCaseStepAttributeValueQueryData && Object.keys(testCaseStepAttributeValueQueryData).length ? "'" + testCaseStepAttributeValueQueryData["TEST_CASE_STEP_ATTRIBUTE_DATA"] + "'" : "' '";
                if (fileredData["IS_UI_ELEMENT_GROUP_STEP"] == "No" && fileredData["IS_FUNCTION_STEP"] == "Yes") {
                    const functionQuery_1 = `SELECT * FROM featuremanagement_app.FUNCTION where FUNCTION_UUID in(${currentAttributeDataId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let functionQueryData_1 = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", functionQuery_1, input);
                    startPage = functionQueryData_1 && Object.keys(functionQueryData_1).length && functionQueryData_1["START_PAGE_NAME"] ? functionQueryData_1["START_PAGE_NAME"] : null;
                    isIntermediate = startPage ? "Yes" : "No";
                } else if (fileredData["IS_UI_ELEMENT_GROUP_STEP"] == "Yes" && fileredData["IS_FUNCTION_STEP"] == "No") {
                    const uiElementGroup = `SELECT * FROM UI_ELEMENT_GROUP where UI_ELEMENT_GROUP_UUID in(${currentAttributeDataId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let uiElementGroupData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", uiElementGroup, input);
                    startPage = uiElementGroupData && Object.keys(uiElementGroupData).length && uiElementGroupData["PAGE_UUID"] ? uiElementGroupData["PAGE_UUID"] : null;
                    isIntermediate = startPage ? "Yes" : "No";
                } else {
                    startPage = null;
                    isIntermediate = "No";
                }
            }
        } else {
            startPage = null;
            isIntermediate = "No";
        }
        let functionObject = {
            FUNCTION_UUID: generatedFunctionId,
            FUNCTION_NAME: modifiedTestCaseName,
            IS_INTERMEDIATE_FUNCTION: isIntermediate,
            START_PAGE_NAME: startPage,
            SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE: input["SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE"],
        };
        functionList.push(functionObject);
        for (let data of testCaseStepQueryData) {
            let existingTestCaseStepId = "'" + data["TEST_CASE_STEP_UUID"] + "'";
            if (data["IS_UI_ELEMENT_GROUP_STEP"] == "No" && data["IS_FUNCTION_STEP"] == "No") {
                let generatedFunctionStepId = uuid();
                let functionStepObject = {
                    FUNCTION_STEP_UUID: generatedFunctionStepId,
                    FUNCTION_UUID: generatedFunctionId,
                    FUNCTION_STEP_NAME: data["TEST_CASE_STEP_NAME"],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                    CURRENT_PAGE_CONTEXT: data["CURRENT_PAGE_CONTEXT"],
                    FUNCTION_STEP_TYPE: data["TEST_CASE_STEP_TYPE"] && data["TEST_CASE_STEP_TYPE"] == "Data" ? "Given" : data["TEST_CASE_STEP_TYPE"],
                    NEXT_PAGE_CONTEXT: data["NEXT_PAGE_CONTEXT"],
                    VIEW_UUID: data["VIEW_UUID"],
                    IS_UI_ELEMENT_GROUP_STEP: data["IS_UI_ELEMENT_GROUP_STEP"],
                    IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT: await checkUIElementValueExist(data),
                    IS_PURE_NAVIGATION_STEP: data["IS_PURE_NAVIGATION_STEP"],
                    IS_API_ATTRIBUTE_VALUE_PRESENT: await checkApiAttributeValueExist(data),
                    API_UUID: data["API_UUID"],
                    UI_ELEMENT_GROUP_UUID: data["UI_ELEMENT_GROUP_UUID"],
                };
                functionStepList.push(functionStepObject);
                const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input);
                for (let attribute of testCaseStepAttributeValueQueryData) {
                    let generatedFunctionStepAttributeId = uuid();
                    let functionStepAttributeObject = {
                        FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedFunctionStepAttributeId,
                        STEP_DEFINITION_ATTRIBUTE_UUID: attribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                        FUNCTION_STEP_ATTRIBUTE_DATA: attribute["TEST_CASE_STEP_ATTRIBUTE_DATA"],
                        FUNCTION_UUID: generatedFunctionId,
                        FUNCTION_STEP_UUID: generatedFunctionStepId,
                        PRE_DEFINED_VALUES_UUID: attribute["PRE_DEFINED_VALUES_UUID"],
                        SCOPE_VARIABLE_TYPE: attribute["SCOPE_VARIABLE_TYPE"],
                        SCOPE_VARIABLE_UUID: attribute["SCOPE_VARIABLE_UUID"],
                        EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"],
                    };
                    functionStepAttributeValueList.push(functionStepAttributeObject);
                }
                if (data["IS_PURE_NAVIGATION_STEP"] && data["IS_PURE_NAVIGATION_STEP"] == "Yes") {
                    const testCaseNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NULL AND FUNCTION_STEP_UUID IS NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                    let testCaseNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseNavigationQuery, input);
                    let navigationCount = 1;
                    for (let testCaseViewNavigation of testCaseNavigationQueryData) {
                        let functionViewNavigationStepId = uuid();
                        let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_UUID"] + "'";
                        let testCaseViewNavigationObject = {
                            FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                            VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation["VIEW_NAVIGATION_STEP_UUID"],
                            FUNCTION_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_NAME"],
                            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                            FUNCTION_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_TYPE"],
                            FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                            CURRENT_PAGE_CONTEXT: testCaseViewNavigation["CURRENT_PAGE_CONTEXT"],
                            NEXT_PAGE_CONTEXT: testCaseViewNavigation["NEXT_PAGE_CONTEXT"],
                            VIEW_UUID: testCaseViewNavigation["VIEW_UUID"],
                            FUNCTION_UUID: generatedFunctionId,
                            FUNCTION_STEP_UUID: generatedFunctionStepId,
                            IS_ANY_VALUE_CHANGED: "Yes",
                        };
                        functionViewNavigationList.push(testCaseViewNavigationObject);
                        navigationCount++;
                        const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseViewNavigationAttributeQuery, input);
                        for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
                            let testCaseViewNavigationAttributeId = uuid();
                            let testCaseViewNavigationAttributeObject = {
                                FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                                STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA"],
                                FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                                VIEW_UUID: viewNavigationAttribute["VIEW_UUID"],
                                PRE_DEFINED_VALUES_UUID: viewNavigationAttribute["PRE_DEFINED_VALUES_UUID"],
                                FUNCTION_UUID: viewNavigationAttribute["FUNCTION_UUID"],
                                SCOPE_VARIABLE_TYPE: viewNavigationAttribute["SCOPE_VARIABLE_TYPE"],
                                SCOPE_VARIABLE_UUID: viewNavigationAttribute["SCOPE_VARIABLE_UUID"],
                                EXISTING_FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"],
                                IS_ANY_VALUE_CHANGED: "Yes",
                            };
                            functionViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                        }
                    }
                }
            }
            if (data["IS_UI_ELEMENT_GROUP_STEP"] == "No" && data["IS_FUNCTION_STEP"] == "Yes") {
                const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${ existingTestCaseStepId ? existingTestCaseStepId : `''` }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
                let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
                if (testCaseFunctionStepData && testCaseFunctionStepData.length) {
                    for (let functionStepData of testCaseFunctionStepData) {
                        let generatedFunctionStepId = uuid();
                        let existingTestCaseFunctionStepId = "'" + functionStepData["TEST_CASE_FUNCTION_STEP_UUID"] + "'";
                        let functionStepObject = {
                            FUNCTION_STEP_UUID: generatedFunctionStepId,
                            FUNCTION_UUID: generatedFunctionId,
                            FUNCTION_STEP_NAME: functionStepData["TEST_CASE_FUNCTION_STEP_NAME"],
                            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepData["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                            CURRENT_PAGE_CONTEXT: functionStepData["CURRENT_PAGE_CONTEXT"],
                            FUNCTION_STEP_TYPE: functionStepData["TEST_CASE_FUNCTION_STEP_TYPE"],
                            NEXT_PAGE_CONTEXT: functionStepData["NEXT_PAGE_CONTEXT"],
                            IS_UI_ELEMENT_GROUP_STEP: functionStepData["IS_UI_ELEMENT_GROUP_STEP"],
                            IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT: await checkUIElementValueExist(functionStepData),
                            IS_PURE_NAVIGATION_STEP: functionStepData["IS_PURE_NAVIGATION_STEP"],
                            IS_API_ATTRIBUTE_VALUE_PRESENT: await checkApiAttributeValueExist(functionStepData),
                            API_UUID: functionStepData["API_UUID"],
                            VIEW_UUID: functionStepData["VIEW_UUID"],
                            UI_ELEMENT_GROUP_UUID: functionStepData["UI_ELEMENT_GROUP_UUID"],
                        };
                        functionStepList.push(functionStepObject);
                        const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
                        for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
                            let generatedFunctionStepAttributeId = uuid();
                            let functionStepAttributeObject = {
                                FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedFunctionStepAttributeId,
                                STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                FUNCTION_STEP_ATTRIBUTE_DATA: functionStepAttributeData["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA"],
                                FUNCTION_STEP_UUID: generatedFunctionStepId,
                                FUNCTION_UUID: generatedFunctionId,
                                PRE_DEFINED_VALUES_UUID: functionStepAttributeData["PRE_DEFINED_VALUES_UUID"],
                                SCOPE_VARIABLE_TYPE: functionStepAttributeData["SCOPE_VARIABLE_TYPE"],
                                SCOPE_VARIABLE_UUID: functionStepAttributeData["SCOPE_VARIABLE_UUID"],
                                EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"],
                            };
                            functionStepAttributeValueList.push(functionStepAttributeObject);
                        }
                        if (functionStepData["IS_UI_ELEMENT_GROUP_STEP"] == "Yes") {
                            const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
                            let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);
                            for (let functionStepUIElementGroupStepData of testCaseFunctionUIElementGroupStepQueryData) {
                                let generatedFunctionUIElementGroupStepId = uuid();
                                let existingTestCaseFunctionUIElementGroupStepId = "'" + functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID"] + "'";
                                let functionUIElementGroupStepObject = {
                                    FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                                    FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME"],
                                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepUIElementGroupStepData["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                                    CURRENT_PAGE_CONTEXT: functionStepUIElementGroupStepData["CURRENT_PAGE_CONTEXT"],
                                    FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE"],
                                    FUNCTION_STEP_UUID: generatedFunctionStepId,
                                    FUNCTION_UUID: generatedFunctionId,
                                    UI_ELEMENT_GROUP_UUID: functionStepUIElementGroupStepData["UI_ELEMENT_GROUP_UUID"],
                                    UI_ELEMENT_GROUP_STEP_UUID: functionStepUIElementGroupStepData["UI_ELEMENT_GROUP_STEP_UUID"],
                                    FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID"],
                                    IS_ANY_VALUE_CHANGED: "Yes",
                                };
                                functionUIElementGroupStepList.push(functionUIElementGroupStepObject);
                                const testCaseFunctionUIElementGroupStepAttributeQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseFunctionUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                                let testCaseFunctionUIElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeQuery, input);
                                for (let testCaseFunctionUIElementGroupStepAttribute of testCaseFunctionUIElementGroupStepAttributeQueryData) {
                                    let functionUIElementGroupStepAttributeValueId = uuid();
                                    let functionUIElementGroupStepAttributeObject = {
                                        FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionUIElementGroupStepAttributeValueId,
                                        STEP_DEFINITION_ATTRIBUTE_UUID: testCaseFunctionUIElementGroupStepAttribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                        FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: testCaseFunctionUIElementGroupStepAttribute["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA"],
                                        FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                                        FUNCTION_STEP_UUID: generatedFunctionStepId,
                                        FUNCTION_UUID: generatedFunctionId,
                                        PRE_DEFINED_VALUES_UUID: testCaseFunctionUIElementGroupStepAttribute["PRE_DEFINED_VALUES_UUID"],
                                        SCOPE_VARIABLE_TYPE: testCaseFunctionUIElementGroupStepAttribute["SCOPE_VARIABLE_TYPE"],
                                        SCOPE_VARIABLE_UUID: testCaseFunctionUIElementGroupStepAttribute["SCOPE_VARIABLE_UUID"],
                                        EXISTING_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: testCaseFunctionUIElementGroupStepAttribute["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID"],
                                        IS_ANY_VALUE_CHANGED: "Yes",
                                    };
                                    functionUIElementGroupStepAttributeList.push(functionUIElementGroupStepAttributeObject);
                                }
                            }
                        }
                        if (functionStepData["IS_PURE_NAVIGATION_STEP"] && functionStepData["IS_PURE_NAVIGATION_STEP"] == "Yes") {
                            const testCaseNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NOT NULL AND FUNCTION_STEP_UUID IS NOT NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                            let testCaseNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseNavigationQuery, input);
                            let navigationCount = 1;
                            for (let testCaseViewNavigation of testCaseNavigationQueryData) {
                                let functionViewNavigationStepId = uuid();
                                let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_UUID"] + "'";
                                let testCaseViewNavigationObject = {
                                    FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                                    VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation["VIEW_NAVIGATION_STEP_UUID"],
                                    FUNCTION_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_NAME"],
                                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                                    FUNCTION_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_TYPE"],
                                    FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                                    CURRENT_PAGE_CONTEXT: testCaseViewNavigation["CURRENT_PAGE_CONTEXT"],
                                    NEXT_PAGE_CONTEXT: testCaseViewNavigation["NEXT_PAGE_CONTEXT"],
                                    VIEW_UUID: testCaseViewNavigation["VIEW_UUID"],
                                    FUNCTION_UUID: generatedFunctionId,
                                    FUNCTION_STEP_UUID: generatedFunctionStepId,
                                    IS_ANY_VALUE_CHANGED: "Yes",
                                };
                                functionViewNavigationList.push(testCaseViewNavigationObject);
                                navigationCount++;
                                const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                                let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseViewNavigationAttributeQuery, input);
                                for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
                                    let testCaseViewNavigationAttributeId = uuid();
                                    let testCaseViewNavigationAttributeObject = {
                                        FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                                        STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                        FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA"],
                                        FUNCTION_VIEW_NAVIGATION_STEP_UUID: functionViewNavigationStepId,
                                        VIEW_UUID: viewNavigationAttribute["VIEW_UUID"],
                                        PRE_DEFINED_VALUES_UUID: viewNavigationAttribute["PRE_DEFINED_VALUES_UUID"],
                                        FUNCTION_UUID: viewNavigationAttribute["FUNCTION_UUID"],
                                        SCOPE_VARIABLE_TYPE: viewNavigationAttribute["SCOPE_VARIABLE_TYPE"],
                                        SCOPE_VARIABLE_UUID: viewNavigationAttribute["SCOPE_VARIABLE_UUID"],
                                        EXISTING_FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"],
                                        IS_ANY_VALUE_CHANGED: "Yes",
                                    };
                                    functionViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                                }
                            }
                        }
                    }
                }
            } else if (data["IS_UI_ELEMENT_GROUP_STEP"] == "Yes" && data["IS_FUNCTION_STEP"] == "No") {
                let generatedFunctionStepId = uuid();
                let functionStepObject = {
                    FUNCTION_STEP_UUID: generatedFunctionStepId,
                    FUNCTION_UUID: generatedFunctionId,
                    FUNCTION_STEP_NAME: data["TEST_CASE_STEP_NAME"],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                    CURRENT_PAGE_CONTEXT: data["CURRENT_PAGE_CONTEXT"],
                    FUNCTION_STEP_TYPE: data["TEST_CASE_STEP_TYPE"] && data["TEST_CASE_STEP_TYPE"] == "Data" ? "Given" : data["TEST_CASE_STEP_TYPE"],
                    NEXT_PAGE_CONTEXT: data["NEXT_PAGE_CONTEXT"],
                    IS_UI_ELEMENT_GROUP_STEP: data["IS_UI_ELEMENT_GROUP_STEP"],
                    IS_UI_ELEMENT_VALUE_ATTRIBUTE_PRESENT: await checkUIElementValueExist(data),
                    IS_PURE_NAVIGATION_STEP: data["IS_PURE_NAVIGATION_STEP"],
                    IS_API_ATTRIBUTE_VALUE_PRESENT: await checkApiAttributeValueExist(data),
                    API_UUID: data["API_UUID"],
                    UI_ELEMENT_GROUP_UUID: data["UI_ELEMENT_GROUP_UUID"],
                    VIEW_UUID: data["VIEW_UUID"],
                };
                functionStepList.push(functionStepObject);
                const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input);
                for (let attribute of testCaseStepAttributeValueQueryData) {
                    let generatedFunctionStepAttributeId = uuid();
                    let functionStepAttributeObject = {
                        FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedFunctionStepAttributeId,
                        STEP_DEFINITION_ATTRIBUTE_UUID: attribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                        FUNCTION_STEP_ATTRIBUTE_DATA: attribute["TEST_CASE_STEP_ATTRIBUTE_DATA"],
                        FUNCTION_UUID: generatedFunctionId,
                        FUNCTION_STEP_UUID: generatedFunctionStepId,
                        PRE_DEFINED_VALUES_UUID: attribute["PRE_DEFINED_VALUES_UUID"],
                        SCOPE_VARIABLE_TYPE: attribute["SCOPE_VARIABLE_TYPE"],
                        SCOPE_VARIABLE_UUID: attribute["SCOPE_VARIABLE_UUID"],
                        EXISTING_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"],
                    };
                    functionStepAttributeValueList.push(functionStepAttributeObject);
                }
                const testCaseUIElementStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
                let testCaseUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementStepQuery, input);
                for (let uiElementGroupStepData of testCaseUIElementStepQueryData) {
                    let generatedFunctionUIElementGroupStepId = uuid();
                    let existingTestCaseUIElementGroupStepId = "'" + uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID"] + "'";
                    let functionUIElementGroupStepObject = {
                        FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                        FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME"],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElementGroupStepData["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                        CURRENT_PAGE_CONTEXT: uiElementGroupStepData["CURRENT_PAGE_CONTEXT"],
                        FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE"],
                        FUNCTION_STEP_UUID: generatedFunctionStepId,
                        FUNCTION_UUID: generatedFunctionId,
                        UI_ELEMENT_GROUP_UUID: uiElementGroupStepData["UI_ELEMENT_GROUP_UUID"],
                        UI_ELEMENT_GROUP_STEP_UUID: uiElementGroupStepData["UI_ELEMENT_GROUP_STEP_UUID"],
                        FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID"],
                        IS_ANY_VALUE_CHANGED: "Yes",
                    };
                    functionUIElementGroupStepList.push(functionUIElementGroupStepObject);
                    const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                    let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
                    for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
                        let functionUIElementGroupStepAttributeValueId = uuid();
                        let functionUIElementGroupStepAttributeObject = {
                            FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionUIElementGroupStepAttributeValueId,
                            STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData["STEP_DEFINITION_ATTRIBUTE_UUID"],
                            FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: functionStepAttributeData["TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA"],
                            FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedFunctionUIElementGroupStepId,
                            FUNCTION_STEP_UUID: generatedFunctionStepId,
                            FUNCTION_UUID: generatedFunctionId,
                            PRE_DEFINED_VALUES_UUID: functionStepAttributeData["PRE_DEFINED_VALUES_UUID"],
                            SCOPE_VARIABLE_TYPE: functionStepAttributeData["SCOPE_VARIABLE_TYPE"],
                            SCOPE_VARIABLE_UUID: functionStepAttributeData["SCOPE_VARIABLE_UUID"],
                            EXISTING_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData["TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID"],
                            IS_ANY_VALUE_CHANGED: "Yes",
                        };
                        functionUIElementGroupStepAttributeList.push(functionUIElementGroupStepAttributeObject);
                    }
                }
            }
        }
        if (functionStepList && functionStepList.length > 0) {
            let SeqId = 1;
            for (let functionStepListData of functionStepList) {
                functionStepListData["FUNCTION_STEP_SEQ_ID"] = SeqId;
                SeqId++;
            }
        }
        updateSourceUUIDBasedOnTestSetAndTestCaseWhileCreateFuncting("No", "No");
    } else if ((input.compositeEntityAction == "Copy" || input.compositeEntityAction == "Copy Test Case") && input["FORM_TYPE"] == "Copy Test Case Steps") {
        if (input["SOURCE_TYPE"] == "TEST_CASE") {
            const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:ORIGINAL_TEST_CASE_UUID and TEST_CASE_STEP_SEQ_ID>=:START_STEP and TEST_CASE_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
            let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
            let testCaseStepDetailsWithSeq = await getSequinceBasedOnPosition();
            let count = testCaseStepDetailsWithSeq["seqId"];
            for (let data of testCaseStepQueryData) {
                let generatedTestCaseStepId = uuid();
                let testCaseStepObject = {
                    TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                    TEST_CASE_UUID: input["DESTINATION_TEST_CASE"],
                    TEST_SET_UUID: input["TEST_SET_UUID"],
                    TEST_CASE_STEP_NAME: data["TEST_CASE_STEP_NAME"],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                    CURRENT_PAGE_CONTEXT: data["CURRENT_PAGE_CONTEXT"],
                    VIEW_UUID: data["VIEW_UUID"],
                    TEST_CASE_STEP_SEQ_ID: count,
                    TEST_CASE_STEP_TYPE: data["TEST_CASE_STEP_TYPE"],
                    NEXT_PAGE_CONTEXT: data["NEXT_PAGE_CONTEXT"],
                    IS_UI_ELEMENT_GROUP_STEP: data["IS_UI_ELEMENT_GROUP_STEP"],
                    IS_FUNCTION_STEP: data["IS_FUNCTION_STEP"],
                    IS_PURE_NAVIGATION_STEP: data["IS_PURE_NAVIGATION_STEP"],
                    PLAYWRITE_STEP_CODE: data["PLAYWRITE_STEP_CODE"],
                    API_UUID: data["API_UUID"],
                    FUNCTION_UUID: data["FUNCTION_UUID"],
                    UI_ELEMENT_GROUP_UUID: data["UI_ELEMENT_GROUP_UUID"],
                };
                testCaseStepList.push(testCaseStepObject);
                count++;
                let existingTestCaseStepId = "'" + data["TEST_CASE_STEP_UUID"] + "'";
                const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input);
                for (let attribute of testCaseStepAttributeValueQueryData) {
                    let generatedTestCaseStepAttributeId = uuid();
                    let testCaseStepAttributeObject = {
                        TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseStepAttributeId,
                        STEP_DEFINITION_ATTRIBUTE_UUID: attribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                        TEST_CASE_STEP_ATTRIBUTE_DATA: attribute["TEST_CASE_STEP_ATTRIBUTE_DATA"],
                        TEST_SET_UUID: input["TEST_SET_UUID"],
                        TEST_CASE_UUID: input["DESTINATION_TEST_CASE"],
                        TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                        PRE_DEFINED_VALUES_UUID: attribute["PRE_DEFINED_VALUES_UUID"],
                        FUNCTION_UUID: attribute["FUNCTION_UUID"],
                        SCOPE_VARIABLE_TYPE: attribute["SCOPE_VARIABLE_TYPE"],
                        SCOPE_VARIABLE_UUID: attribute["SCOPE_VARIABLE_UUID"],
                        EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"],
                    };
                    testCaseStepAttributeValueList.push(testCaseStepAttributeObject);
                }
                if (data["IS_PURE_NAVIGATION_STEP"] && data["IS_PURE_NAVIGATION_STEP"] == "Yes") {
                    const testCaseViewNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NULL AND FUNCTION_STEP_UUID IS NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                    let testCaseViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseViewNavigationQuery, input);
                    let navigationCount = 1;
                    for (let testCaseViewNavigation of testCaseViewNavigationQueryData) {
                        let testCaseViewNavigationStepId = uuid();
                        let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_UUID"] + "'";
                        let testCaseViewNavigationObject = {
                            TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                            VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation["VIEW_NAVIGATION_STEP_UUID"],
                            TEST_CASE_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_NAME"],
                            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                            TEST_CASE_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_TYPE"],
                            TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                            CURRENT_PAGE_CONTEXT: testCaseViewNavigation["CURRENT_PAGE_CONTEXT"],
                            NEXT_PAGE_CONTEXT: testCaseViewNavigation["NEXT_PAGE_CONTEXT"],
                            VIEW_UUID: testCaseViewNavigation["VIEW_UUID"],
                            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                            FUNCTION_UUID: testCaseViewNavigation["FUNCTION_UUID"],
                            FUNCTION_STEP_UUID: testCaseViewNavigation["FUNCTION_STEP_UUID"],
                            IS_ANY_VALUE_CHANGED: "Yes",
                        };
                        testCaseViewNavigationList.push(testCaseViewNavigationObject);
                        navigationCount++;
                        const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseViewNavigationAttributeQuery, input);
                        for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
                            let testCaseViewNavigationAttributeId = uuid();
                            let testCaseViewNavigationAttributeObject = {
                                TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                                STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA"],
                                TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                                VIEW_UUID: viewNavigationAttribute["VIEW_UUID"],
                                PRE_DEFINED_VALUES_UUID: viewNavigationAttribute["PRE_DEFINED_VALUES_UUID"],
                                FUNCTION_UUID: viewNavigationAttribute["FUNCTION_UUID"],
                                SCOPE_VARIABLE_TYPE: viewNavigationAttribute["SCOPE_VARIABLE_TYPE"],
                                SCOPE_VARIABLE_UUID: viewNavigationAttribute["SCOPE_VARIABLE_UUID"],
                                EXISTING_TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"],
                                IS_ANY_VALUE_CHANGED: "Yes",
                            };
                            testCaseViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                        }
                    }
                }
                if (data["IS_UI_ELEMENT_GROUP_STEP"] == "No" && data["IS_FUNCTION_STEP"] == "Yes") {
                    const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${ existingTestCaseStepId ? existingTestCaseStepId : `''` }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
                    let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
                    let functionStepCount = 1;
                    if (testCaseFunctionStepData && testCaseFunctionStepData.length) {
                        for (let functionStepData of testCaseFunctionStepData) {
                            let generatedTestCaseFunctionStepId = uuid();
                            let testCaseFunctionStepObject = {
                                TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                                TEST_CASE_FUNCTION_STEP_NAME: functionStepData["TEST_CASE_FUNCTION_STEP_NAME"],
                                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepData["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                                CURRENT_PAGE_CONTEXT: functionStepData["CURRENT_PAGE_CONTEXT"],
                                NEXT_PAGE_CONTEXT: functionStepData["NEXT_PAGE_CONTEXT"],
                                VIEW_UUID: functionStepData["VIEW_UUID"],
                                TEST_CASE_FUNCTION_STEP_TYPE: functionStepData["TEST_CASE_FUNCTION_STEP_TYPE"],
                                TEST_CASE_FUNCTION_STEP_SEQ_ID: functionStepCount,
                                TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                IS_UI_ELEMENT_GROUP_STEP: functionStepData["IS_UI_ELEMENT_GROUP_STEP"],
                                FUNCTION_UUID: functionStepData["FUNCTION_UUID"],
                                FUNCTION_STEP_UUID: functionStepData["FUNCTION_STEP_UUID"],
                                IS_PURE_NAVIGATION_STEP: functionStepData["IS_PURE_NAVIGATION_STEP"],
                                API_UUID: functionStepData["API_UUID"],
                                UI_ELEMENT_GROUP_UUID: functionStepData["UI_ELEMENT_GROUP_UUID"],
                                IS_ANY_VALUE_CHANGED: "Yes",
                            };
                            testCaseFunctionStepList.push(testCaseFunctionStepObject);
                            functionStepCount++;
                            let existingTestCaseFunctionStepId = "'" + functionStepData["TEST_CASE_FUNCTION_STEP_UUID"] + "'";
                            const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                            let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
                            for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
                                let generatedTestCaseFunctionStepAttributeId = uuid();
                                let testCaseFunctionStepAttributeObject = {
                                    TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseFunctionStepAttributeId,
                                    STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                    TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA: functionStepAttributeData["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA"],
                                    TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                    TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                                    FUNCTION_UUID: functionStepAttributeData["FUNCTION_UUID"],
                                    PRE_DEFINED_VALUES_UUID: functionStepAttributeData["PRE_DEFINED_VALUES_UUID"],
                                    SCOPE_VARIABLE_TYPE: functionStepAttributeData["SCOPE_VARIABLE_TYPE"],
                                    SCOPE_VARIABLE_UUID: functionStepAttributeData["SCOPE_VARIABLE_UUID"],
                                    EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"],
                                    IS_ANY_VALUE_CHANGED: "Yes",
                                };
                                testCaseFunctionStepAttributeValueList.push(testCaseFunctionStepAttributeObject);
                            }
                            if (functionStepData["IS_UI_ELEMENT_GROUP_STEP"] == "Yes") {
                                const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
                                let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);
                                for (let functionStepUIElementGroupStepData of testCaseFunctionUIElementGroupStepQueryData) {
                                    let generatedTestCaseFunctionUIElementGroupStepId = uuid();
                                    let testCaseFunctionUIElementGroupStepObject = {
                                        TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseFunctionUIElementGroupStepId,
                                        TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME"],
                                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepUIElementGroupStepData["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                                        CURRENT_PAGE_CONTEXT: functionStepUIElementGroupStepData["CURRENT_PAGE_CONTEXT"],
                                        TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE"],
                                        TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                        TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                                        UI_ELEMENT_GROUP_UUID: functionStepUIElementGroupStepData["UI_ELEMENT_GROUP_UUID"],
                                        UI_ELEMENT_GROUP_STEP_UUID: functionStepUIElementGroupStepData["UI_ELEMENT_GROUP_STEP_UUID"],
                                        FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: functionStepUIElementGroupStepData["FUNCTION_UI_ELEMENT_GROUP_STEP_UUID"],
                                        TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID"],
                                        FUNCTION_STEP_UUID: functionStepUIElementGroupStepData["FUNCTION_STEP_UUID"],
                                        FUNCTION_UUID: functionStepUIElementGroupStepData["FUNCTION_UUID"],
                                        IS_ANY_VALUE_CHANGED: "Yes",
                                    };
                                    testCaseFunctionUIElementGroupStepList.push(testCaseFunctionUIElementGroupStepObject);
                                    let existingTestCaseFunctionUIElementGroupStepId = "'" + functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID"] + "'";
                                    const testCaseFunctionUIElementGroupStepAttributeQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseFunctionUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                                    let testCaseFunctionUIElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeQuery, input);
                                    for (let testCaseFunctionUIElementGroupStepAttribute of testCaseFunctionUIElementGroupStepAttributeQueryData) {
                                        let generatedTestCaseFunctionUIElementGroupStepAttributeId = uuid();
                                        let testCaseFunctionUIelementGroupAttributeObject = {
                                            TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseFunctionUIElementGroupStepAttributeId,
                                            STEP_DEFINITION_ATTRIBUTE_UUID: testCaseFunctionUIElementGroupStepAttribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                            TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: testCaseFunctionUIElementGroupStepAttribute["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA"],
                                            TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseFunctionUIElementGroupStepId,
                                            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                            UI_ELEMENT_GROUP_UUID: testCaseFunctionUIElementGroupStepAttribute["UI_ELEMENT_GROUP_UUID"],
                                            TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                                            PRE_DEFINED_VALUES_UUID: testCaseFunctionUIElementGroupStepAttribute["PRE_DEFINED_VALUES_UUID"],
                                            FUNCTION_UUID: testCaseFunctionUIElementGroupStepAttribute["FUNCTION_UUID"],
                                            SCOPE_VARIABLE_TYPE: testCaseFunctionUIElementGroupStepAttribute["SCOPE_VARIABLE_TYPE"],
                                            SCOPE_VARIABLE_UUID: testCaseFunctionUIElementGroupStepAttribute["SCOPE_VARIABLE_UUID"],
                                            EXISTING_TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: testCaseFunctionUIElementGroupStepAttribute["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID"],
                                            IS_ANY_VALUE_CHANGED: "Yes",
                                        };
                                        testCaseFunctionUIElementGroupStepAttributeList.push(testCaseFunctionUIelementGroupAttributeObject);
                                    }
                                }
                            }
                            if (functionStepData["IS_PURE_NAVIGATION_STEP"] && functionStepData["IS_PURE_NAVIGATION_STEP"] == "Yes") {
                                const testCaseFunctionViewNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NOT NULL AND FUNCTION_STEP_UUID IS NOT NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                                let testCaseFunctionViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionViewNavigationQuery, input);
                                let functionNavigationCount = 1;
                                for (let testCaseViewNavigation of testCaseFunctionViewNavigationQueryData) {
                                    let testCaseViewNavigationStepId = uuid();
                                    let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_UUID"] + "'";
                                    let testCaseViewNavigationObject = {
                                        TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                                        VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation["VIEW_NAVIGATION_STEP_UUID"],
                                        TEST_CASE_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_NAME"],
                                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                                        TEST_CASE_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_TYPE"],
                                        TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID: functionNavigationCount,
                                        CURRENT_PAGE_CONTEXT: testCaseViewNavigation["CURRENT_PAGE_CONTEXT"],
                                        NEXT_PAGE_CONTEXT: testCaseViewNavigation["NEXT_PAGE_CONTEXT"],
                                        VIEW_UUID: testCaseViewNavigation["VIEW_UUID"],
                                        TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                        FUNCTION_UUID: testCaseViewNavigation["FUNCTION_UUID"],
                                        FUNCTION_STEP_UUID: testCaseViewNavigation["FUNCTION_STEP_UUID"],
                                        IS_ANY_VALUE_CHANGED: "Yes",
                                    };
                                    testCaseViewNavigationList.push(testCaseViewNavigationObject);
                                    functionNavigationCount++;
                                    const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                                    let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseViewNavigationAttributeQuery, input);
                                    for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
                                        let testCaseViewNavigationAttributeId = uuid();
                                        let testCaseViewNavigationAttributeObject = {
                                            TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                                            STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                            TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA"],
                                            TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                                            VIEW_UUID: viewNavigationAttribute["VIEW_UUID"],
                                            PRE_DEFINED_VALUES_UUID: viewNavigationAttribute["PRE_DEFINED_VALUES_UUID"],
                                            FUNCTION_UUID: viewNavigationAttribute["FUNCTION_UUID"],
                                            SCOPE_VARIABLE_TYPE: viewNavigationAttribute["SCOPE_VARIABLE_TYPE"],
                                            SCOPE_VARIABLE_UUID: viewNavigationAttribute["SCOPE_VARIABLE_UUID"],
                                            EXISTING_TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"],
                                            IS_ANY_VALUE_CHANGED: "Yes",
                                        };
                                        testCaseViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                                    }
                                }
                            }
                        }
                    }
                } else if (data["IS_UI_ELEMENT_GROUP_STEP"] == "Yes" && data["IS_FUNCTION_STEP"] == "No") {
                    const testCaseUIElementStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
                    let testCaseUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementStepQuery, input);
                    for (let uiElementGroupStepData of testCaseUIElementStepQueryData) {
                        let generatedTestCaseUIElementGroupStepId = uuid();
                        let testCaseUIElementGroupStepObject = {
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME: uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME"],
                            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElementGroupStepData["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                            CURRENT_PAGE_CONTEXT: uiElementGroupStepData["CURRENT_PAGE_CONTEXT"],
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE: uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE"],
                            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                            UI_ELEMENT_GROUP_UUID: uiElementGroupStepData["UI_ELEMENT_GROUP_UUID"],
                            UI_ELEMENT_GROUP_STEP_UUID: uiElementGroupStepData["UI_ELEMENT_GROUP_STEP_UUID"],
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID: uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID"],
                            IS_ANY_VALUE_CHANGED: "Yes",
                        };
                        testCaseUIElementGroupStepList.push(testCaseUIElementGroupStepObject);
                        let existingTestCaseUIElementGroupStepId = "'" + uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID"] + "'";
                        const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
                        for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
                            let generatedTestCaseUIElementGroupStepAttributeId = uuid();
                            let testCaseUIElementGroupStepAttributeobject = {
                                TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseUIElementGroupStepAttributeId,
                                STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: functionStepAttributeData["TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA"],
                                TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
                                TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                UI_ELEMENT_GROUP_UUID: functionStepAttributeData["UI_ELEMENT_GROUP_UUID"],
                                FUNCTION_UUID: functionStepAttributeData["FUNCTION_UUID"],
                                PRE_DEFINED_VALUES_UUID: functionStepAttributeData["PRE_DEFINED_VALUES_UUID"],
                                SCOPE_VARIABLE_TYPE: functionStepAttributeData["SCOPE_VARIABLE_TYPE"],
                                SCOPE_VARIABLE_UUID: functionStepAttributeData["SCOPE_VARIABLE_UUID"],
                                EXISTING_TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData["TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID"],
                                IS_ANY_VALUE_CHANGED: "Yes",
                            };
                            testCaseUIElementGroupStepAttributeList.push(testCaseUIElementGroupStepAttributeobject);
                        }
                    }
                }
            }
            if (["First Test Case Step", "Intermediate Test Case Step"].includes(input["DESTINATION_STEP_POSITION"])) {
                reorderTestCaseStep(count, testCaseStepDetailsWithSeq["testCaseStepQueryData"]);
            }
            if (input["ORIGINAL_TEST_SET_UUID"] == input["TEST_SET_UUID"]) {
                if (input["ORIGINAL_TEST_CASE_UUID"] == input["DESTINATION_TEST_CASE"]) {
                    updateSourceUUIDBasedOnTestSetAndTestCase("Yes", "Yes");
                } else if (input["ORIGINAL_TEST_CASE_UUID"] != input["DESTINATION_TEST_CASE"]) {
                    updateSourceUUIDBasedOnTestSetAndTestCase("Yes", "No");
                }
            } else if (input["ORIGINAL_TEST_SET_UUID"] != input["TEST_SET_UUID"]) {
                updateSourceUUIDBasedOnTestSetAndTestCase("No", "No");
            }
        } else if (input["SOURCE_TYPE"] == "FUNCTION") {
            const functionStepQuery = `SELECT * FROM FUNCTION_STEP where FUNCTION_UUID=:FUNCTION_UUID and FUNCTION_STEP_SEQ_ID>=:START_STEP and FUNCTION_STEP_SEQ_ID<=:END_STEP and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_STEP_SEQ_ID asc`;
            let functionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepQuery, input);
            let testCaseStepDetailsWithSeq = await getSequinceBasedOnPosition();
            let count = testCaseStepDetailsWithSeq["seqId"];
            for (let data of functionStepQueryData) {
                let generatedTestCaseStepId = uuid();
                let testCaseStepObject = {
                    TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                    TEST_CASE_UUID: input["DESTINATION_TEST_CASE"],
                    TEST_SET_UUID: input["TEST_SET_UUID"],
                    TEST_CASE_STEP_NAME: data["FUNCTION_STEP_NAME"],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                    CURRENT_PAGE_CONTEXT: data["CURRENT_PAGE_CONTEXT"],
                    VIEW_UUID: data["VIEW_UUID"],
                    TEST_CASE_STEP_SEQ_ID: count,
                    TEST_CASE_STEP_TYPE: data["FUNCTION_STEP_TYPE"],
                    NEXT_PAGE_CONTEXT: data["NEXT_PAGE_CONTEXT"],
                    IS_UI_ELEMENT_GROUP_STEP: data["IS_UI_ELEMENT_GROUP_STEP"],
                    IS_FUNCTION_STEP: "No",
                    IS_PURE_NAVIGATION_STEP: data["IS_PURE_NAVIGATION_STEP"],
                    PLAYWRITE_STEP_CODE: null,
                    UI_ELEMENT_GROUP_UUID: data["UI_ELEMENT_GROUP_UUID"],
                    VIEW_UUID: data["VIEW_UUID"],
                };
                testCaseStepList.push(testCaseStepObject);
                count++;
                let existingFunctionStepId = "'" + data["FUNCTION_STEP_UUID"] + "'";
                const functionAttributeValueQuery = `SELECT * FROM FUNCTION_STEP_ATTRIBUTE_VALUE where FUNCTION_STEP_UUID in(${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let functionAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionAttributeValueQuery, input);
                for (let attribute of functionAttributeValueQueryData) {
                    let generatedTestCaseStepAttributeId = uuid();
                    let testCaseStepAttributeObject = {
                        TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseStepAttributeId,
                        STEP_DEFINITION_ATTRIBUTE_UUID: attribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                        TEST_CASE_STEP_ATTRIBUTE_DATA: attribute["FUNCTION_STEP_ATTRIBUTE_DATA"],
                        TEST_SET_UUID: input["TEST_SET_UUID"],
                        TEST_CASE_UUID: input["DESTINATION_TEST_CASE"],
                        TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                        PRE_DEFINED_VALUES_UUID: attribute["PRE_DEFINED_VALUES_UUID"],
                        SCOPE_VARIABLE_TYPE: attribute["SCOPE_VARIABLE_TYPE"],
                        SCOPE_VARIABLE_UUID: attribute["SCOPE_VARIABLE_UUID"],
                        EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: attribute["FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"],
                    };
                    testCaseStepAttributeValueList.push(testCaseStepAttributeObject);
                }
                if (data["IS_PURE_NAVIGATION_STEP"] && data["IS_PURE_NAVIGATION_STEP"] == "Yes") {
                    const functionViewNavigationQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP where FUNCTION_STEP_UUID in(${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                    let functionViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionViewNavigationQuery, input);
                    let navigationCount = 1;
                    for (let functionViewNavigation of functionViewNavigationQueryData) {
                        let testCaseViewNavigationStepId = uuid();
                        let existinTestCaseViewNavigationStepId = "'" + functionViewNavigation["FUNCTION_VIEW_NAVIGATION_STEP_UUID"] + "'";
                        let testCaseViewNavigationObject = {
                            TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                            VIEW_NAVIGATION_STEP_UUID: functionViewNavigation["VIEW_NAVIGATION_STEP_UUID"],
                            TEST_CASE_VIEW_NAVIGATION_STEP_NAME: functionViewNavigation["FUNCTION_VIEW_NAVIGATION_STEP_NAME"],
                            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionViewNavigation["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                            TEST_CASE_VIEW_NAVIGATION_STEP_TYPE: functionViewNavigation["FUNCTION_VIEW_NAVIGATION_STEP_TYPE"],
                            TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                            CURRENT_PAGE_CONTEXT: functionViewNavigation["CURRENT_PAGE_CONTEXT"],
                            NEXT_PAGE_CONTEXT: functionViewNavigation["NEXT_PAGE_CONTEXT"],
                            VIEW_UUID: functionViewNavigation["VIEW_UUID"],
                            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                            FUNCTION_UUID: null,
                            FUNCTION_STEP_UUID: null,
                            IS_ANY_VALUE_CHANGED: "Yes",
                        };
                        testCaseViewNavigationList.push(testCaseViewNavigationObject);
                        navigationCount++;
                        const functionViewNavigationAttributeQuery = `SELECT * FROM FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where FUNCTION_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let functionViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionViewNavigationAttributeQuery, input);
                        for (let viewNavigationAttribute of functionViewNavigationAttributeQueryData) {
                            let testCaseViewNavigationAttributeId = uuid();
                            let testCaseViewNavigationAttributeObject = {
                                TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                                STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute["FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA"],
                                TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                                VIEW_UUID: viewNavigationAttribute["VIEW_UUID"],
                                PRE_DEFINED_VALUES_UUID: viewNavigationAttribute["PRE_DEFINED_VALUES_UUID"],
                                FUNCTION_UUID: null,
                                SCOPE_VARIABLE_TYPE: viewNavigationAttribute["SCOPE_VARIABLE_TYPE"],
                                SCOPE_VARIABLE_UUID: viewNavigationAttribute["SCOPE_VARIABLE_UUID"],
                                EXISTING_TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute["FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"],
                                IS_ANY_VALUE_CHANGED: "Yes",
                            };
                            testCaseViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                        }
                    }
                }
                if (data["IS_UI_ELEMENT_GROUP_STEP"] == "Yes") {
                    const functionUIElementStepQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP where FUNCTION_STEP_UUID in(${existingFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
                    let functionUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionUIElementStepQuery, input);
                    for (let uiElementGroupStepData of functionUIElementStepQueryData) {
                        let generatedTestCaseUIElementGroupStepId = uuid();
                        let testCaseUIElementGroupStepObject = {
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME: uiElementGroupStepData["FUNCTION_UI_ELEMENT_GROUP_STEP_NAME"],
                            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElementGroupStepData["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                            CURRENT_PAGE_CONTEXT: uiElementGroupStepData["CURRENT_PAGE_CONTEXT"],
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE: uiElementGroupStepData["FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE"],
                            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                            UI_ELEMENT_GROUP_UUID: uiElementGroupStepData["UI_ELEMENT_GROUP_UUID"],
                            UI_ELEMENT_GROUP_STEP_UUID: uiElementGroupStepData["UI_ELEMENT_GROUP_STEP_UUID"],
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID: uiElementGroupStepData["FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID"],
                            IS_ANY_VALUE_CHANGED: "Yes",
                        };
                        testCaseUIElementGroupStepList.push(testCaseUIElementGroupStepObject);
                        let existingTestCaseUIElementGroupStepId = "'" + uiElementGroupStepData["FUNCTION_UI_ELEMENT_GROUP_STEP_UUID"] + "'";
                        const functionUIElementGroupStepAttributeValueQuery = `SELECT * FROM FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let functionUIElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionUIElementGroupStepAttributeValueQuery, input);
                        for (let functionUIElementGroupStepData of functionUIElementGroupStepAttributeValueQueryData) {
                            let generatedTestCaseUIElementGroupStepAttributeId = uuid();
                            let testCaseUIElementGroupStepAttributeobject = {
                                TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseUIElementGroupStepAttributeId,
                                STEP_DEFINITION_ATTRIBUTE_UUID: functionUIElementGroupStepData["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: functionUIElementGroupStepData["FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA"],
                                TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
                                TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                UI_ELEMENT_GROUP_UUID: functionUIElementGroupStepData["UI_ELEMENT_GROUP_UUID"],
                                PRE_DEFINED_VALUES_UUID: functionUIElementGroupStepData["PRE_DEFINED_VALUES_UUID"],
                                SCOPE_VARIABLE_TYPE: functionUIElementGroupStepData["SCOPE_VARIABLE_TYPE"],
                                SCOPE_VARIABLE_UUID: functionUIElementGroupStepData["SCOPE_VARIABLE_UUID"],
                                EXISTING_TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionUIElementGroupStepData["FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID"],
                                IS_ANY_VALUE_CHANGED: "Yes",
                            };
                            testCaseUIElementGroupStepAttributeList.push(testCaseUIElementGroupStepAttributeobject);
                        }
                    }
                }
            }
            if (["First Test Case Step", "Intermediate Test Case Step"].includes(input["DESTINATION_STEP_POSITION"])) {
                reorderTestCaseStep(count, testCaseStepDetailsWithSeq["testCaseStepQueryData"]);
            }
            updateSourceUUIDBasedOnFunctionTestSetAndTestCase("No", "No");
        } else if (input["SOURCE_TYPE"] == "UI_ELEMENT_GROUP") {
            input["SOURCE_UI_ELEMENT_GROUP_STEP_UUIDS"] = input["SOURCE_UI_ELEMENT_GROUP_STEP_UUIDS"] && input["SOURCE_UI_ELEMENT_GROUP_STEP_UUIDS"].split(",");
            let ids = input["SOURCE_UI_ELEMENT_GROUP_STEP_UUIDS"].map((id) => `'` + id + `'`).join(",");
            const uiElementGroupStepQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP where UI_ELEMENT_GROUP_UUID=:UI_ELEMENT_GROUP_UUID and UI_ELEMENT_GROUP_STEP_UUID in(${ ids ? ids : `''` }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by UI_ELEMENT_GROUP_STEP_ID asc`;
            let uiElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", uiElementGroupStepQuery, input);
            let testCaseStepDetailsWithSeq = await getSequinceBasedOnPosition();
            let count = testCaseStepDetailsWithSeq["seqId"];
            for (let data of uiElementGroupStepQueryData) {
                let generatedTestCaseStepId = uuid();
                let testCaseStepObject = {
                    TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                    TEST_CASE_UUID: input["DESTINATION_TEST_CASE"],
                    TEST_SET_UUID: input["TEST_SET_UUID"],
                    TEST_CASE_STEP_NAME: data["UI_ELEMENT_GROUP_STEP_NAME"],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                    CURRENT_PAGE_CONTEXT: data["CURRENT_PAGE_CONTEXT"],
                    VIEW_UUID: data["VIEW_UUID"],
                    TEST_CASE_STEP_SEQ_ID: count,
                    TEST_CASE_STEP_TYPE: data["STEP_TYPE"],
                    NEXT_PAGE_CONTEXT: data["NEXT_PAGE_CONTEXT"],
                    IS_UI_ELEMENT_GROUP_STEP: "No",
                    IS_FUNCTION_STEP: "No",
                    IS_PURE_NAVIGATION_STEP: null,
                    PLAYWRITE_STEP_CODE: null,
                };
                testCaseStepList.push(testCaseStepObject);
                count++;
                let existingUIElementGroupStepId = "'" + data["UI_ELEMENT_GROUP_STEP_UUID"] + "'";
                const uiElementGroupStepAttributeValueQuery = `SELECT * FROM UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where UI_ELEMENT_GROUP_STEP_UUID in(${existingUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let uiElementGroupStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", uiElementGroupStepAttributeValueQuery, input);
                for (let attribute of uiElementGroupStepAttributeValueQueryData) {
                    let generatedTestCaseStepAttributeId = uuid();
                    let testCaseStepAttributeObject = {
                        TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseStepAttributeId,
                        STEP_DEFINITION_ATTRIBUTE_UUID: attribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                        TEST_CASE_STEP_ATTRIBUTE_DATA: attribute["UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA"],
                        TEST_SET_UUID: input["TEST_SET_UUID"],
                        TEST_CASE_UUID: input["DESTINATION_TEST_CASE"],
                        TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                        PRE_DEFINED_VALUES_UUID: attribute["PRE_DEFINED_VALUES_UUID"],
                    };
                    testCaseStepAttributeValueList.push(testCaseStepAttributeObject);
                }
            }
            if (["First Test Case Step", "Intermediate Test Case Step"].includes(input["DESTINATION_STEP_POSITION"])) {
                reorderTestCaseStep(count, testCaseStepDetailsWithSeq["testCaseStepQueryData"]);
            }
        }
    } else {
        if (input.compositeEntityAction == "Copy" || input.compositeEntityAction == "Copy Test Case") {
            let generatedTestCaseId = uuid();
            let testCaseDescriptionUUID = uuid();
            let copyCount = 0;
            let testCaseName = confirmEnding(input["TEST_CASE_NAME"], "Copy ");
            let spilData = testCaseName.split("- Copy");
            let serchedData = spilData[0].trim();
            if (serchedData.includes("'")) {
                serchedData = serchedData.split("'").join("''");
            }
            const testCaseQuery = `SELECT * FROM TEST_CASE where TEST_CASE_NAME LIKE '%${serchedData}%' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and TEST_SET_UUID=:TEST_SET_UUID`;
            let testCaseQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseQuery, input);
            if (input["ORIGINAL_TEST_SET_UUID"] == input["TEST_SET_UUID"]) {
                copyCount = testCaseQueryData.length != 0 ? testCaseQueryData.length - 1 : "";
                copyCount = testCaseQueryData.length == 1 ? "" : testCaseQueryData.length - 1;
            } else {
                copyCount = testCaseQueryData.length == 0 ? "" : testCaseQueryData.length;
            }
            let modifiedTestCaseName = testCaseName + copyCount;
            let testCaseObject = {
                TEST_CASE_UUID: generatedTestCaseId,
                TEST_CASE_NAME: input["TEST_CASE_NAME"],
                TEST_SET_UUID: input["TEST_SET_UUID"],
                TEST_CASE_EXECUTON_TYPE: input["TEST_CASE_EXECUTON_TYPE"],
                TEST_CASE_STATUS: "DRAFT",
                TEST_CASE_DESCRIPTION_UUID: testCaseDescriptionUUID,
                TEST_CASE_OWNER: input["APP_LOGGED_IN_USER_ID"],
                SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE: input["SKIP_STEP_WITH_NO_UI_ELEMENT_VALUE"],
            };
            let testCaseDescQuery = "SELECT * FROM TEST_CASE_DESCRIPTION where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;";
            let testCaseDescQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", testCaseDescQuery, input);
            if (testCaseDescQueryData) {
                let testCaseDescriptionObject = {
                    TEST_CASE_DESCRIPTION_UUID: testCaseDescriptionUUID,
                    TEST_CASE_DESCRIPTION_DATA: testCaseDescQueryData["TEST_CASE_DESCRIPTION_DATA"],
                    TEST_CASE_PRE_CONDITION: testCaseDescQueryData["TEST_CASE_PRE_CONDITION"],
                    TEST_CASE_USER_INPUT: testCaseDescQueryData["TEST_CASE_USER_INPUT"],
                    TEST_CASE_EXPECTED_RESULT: testCaseDescQueryData["TEST_CASE_EXPECTED_RESULT"],
                    TEST_CASE_ACTUAL_RESULT: testCaseDescQueryData["TEST_CASE_ACTUAL_RESULT"],
                    TEST_CASE_PRE_EXISTING_DATA: testCaseDescQueryData["TEST_CASE_PRE_EXISTING_DATA"],
                    TEST_CASE_UUID: generatedTestCaseId,
                };
                testCaseDescriptionList.push(testCaseDescriptionObject);
                input["AppEngChildEntity:TEST_CASE_DESCRIPTION"] = testCaseDescriptionList;
            }
            testCaseList.push(testCaseObject);
            const testCaseStepQuery = `SELECT * FROM TEST_CASE_STEP where TEST_CASE_UUID=:TEST_CASE_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_STEP_SEQ_ID asc`;
            let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);
            let count = 1;
            for (let data of testCaseStepQueryData) {
                let generatedTestCaseStepId = uuid();
                let testCaseStepObject = {
                    TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                    TEST_CASE_UUID: generatedTestCaseId,
                    TEST_SET_UUID: input["TEST_SET_UUID"],
                    TEST_CASE_STEP_NAME: data["TEST_CASE_STEP_NAME"],
                    STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: data["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                    CURRENT_PAGE_CONTEXT: data["CURRENT_PAGE_CONTEXT"],
                    VIEW_UUID: data["VIEW_UUID"],
                    TEST_CASE_STEP_SEQ_ID: count,
                    TEST_CASE_STEP_TYPE: data["TEST_CASE_STEP_TYPE"],
                    NEXT_PAGE_CONTEXT: data["NEXT_PAGE_CONTEXT"],
                    IS_UI_ELEMENT_GROUP_STEP: data["IS_UI_ELEMENT_GROUP_STEP"],
                    IS_FUNCTION_STEP: data["IS_FUNCTION_STEP"],
                    IS_PURE_NAVIGATION_STEP: data["IS_PURE_NAVIGATION_STEP"],
                    PLAYWRITE_STEP_CODE: data["PLAYWRITE_STEP_CODE"],
                    API_UUID: data["API_UUID"],
                    FUNCTION_UUID: data["FUNCTION_UUID"],
                    UI_ELEMENT_GROUP_UUID: data["UI_ELEMENT_GROUP_UUID"],
                };
                testCaseStepList.push(testCaseStepObject);
                count++;
                let existingTestCaseStepId = "'" + data["TEST_CASE_STEP_UUID"] + "'";
                const encryptedDBCode = "TEST_CASE_STEP_ATTRIBUTE_DATA";
                const testCaseStepAttributeValueQuery = `SELECT * FROM TEST_CASE_STEP_ATTRIBUTE_VALUE where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                let testCaseStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepAttributeValueQuery, input, undefined, encryptedDBCode);
                for (let attribute of testCaseStepAttributeValueQueryData) {
                    let generatedTestCaseStepAttributeId = uuid();
                    let testCaseStepAttributeObject = {
                        TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseStepAttributeId,
                        STEP_DEFINITION_ATTRIBUTE_UUID: attribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                        TEST_CASE_STEP_ATTRIBUTE_DATA: attribute["TEST_CASE_STEP_ATTRIBUTE_DATA"],
                        TEST_SET_UUID: input["TEST_SET_UUID"],
                        TEST_CASE_UUID: generatedTestCaseId,
                        TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                        PRE_DEFINED_VALUES_UUID: attribute["PRE_DEFINED_VALUES_UUID"],
                        FUNCTION_UUID: attribute["FUNCTION_UUID"],
                        SCOPE_VARIABLE_TYPE: attribute["SCOPE_VARIABLE_TYPE"],
                        SCOPE_VARIABLE_UUID: attribute["SCOPE_VARIABLE_UUID"],
                        EXISTING_TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: attribute["TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID"],
                    };
                    testCaseStepAttributeValueList.push(testCaseStepAttributeObject);
                }
                if (data["IS_PURE_NAVIGATION_STEP"] && data["IS_PURE_NAVIGATION_STEP"] == "Yes") {
                    const testCaseViewNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NULL AND FUNCTION_STEP_UUID IS NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                    let testCaseViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseViewNavigationQuery, input);
                    let navigationCount = 1;
                    for (let testCaseViewNavigation of testCaseViewNavigationQueryData) {
                        let testCaseViewNavigationStepId = uuid();
                        let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_UUID"] + "'";
                        let testCaseViewNavigationObject = {
                            TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                            VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation["VIEW_NAVIGATION_STEP_UUID"],
                            TEST_CASE_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_NAME"],
                            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                            TEST_CASE_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_TYPE"],
                            TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID: navigationCount,
                            CURRENT_PAGE_CONTEXT: testCaseViewNavigation["CURRENT_PAGE_CONTEXT"],
                            NEXT_PAGE_CONTEXT: testCaseViewNavigation["NEXT_PAGE_CONTEXT"],
                            VIEW_UUID: testCaseViewNavigation["VIEW_UUID"],
                            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                            FUNCTION_UUID: testCaseViewNavigation["FUNCTION_UUID"],
                            FUNCTION_STEP_UUID: testCaseViewNavigation["FUNCTION_STEP_UUID"],
                            IS_ANY_VALUE_CHANGED: "Yes",
                        };
                        testCaseViewNavigationList.push(testCaseViewNavigationObject);
                        navigationCount++;
                        const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseViewNavigationAttributeQuery, input);
                        for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
                            let testCaseViewNavigationAttributeId = uuid();
                            let testCaseViewNavigationAttributeObject = {
                                TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                                STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA"],
                                TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                                VIEW_UUID: viewNavigationAttribute["VIEW_UUID"],
                                PRE_DEFINED_VALUES_UUID: viewNavigationAttribute["PRE_DEFINED_VALUES_UUID"],
                                FUNCTION_UUID: viewNavigationAttribute["FUNCTION_UUID"],
                                SCOPE_VARIABLE_TYPE: viewNavigationAttribute["SCOPE_VARIABLE_TYPE"],
                                SCOPE_VARIABLE_UUID: viewNavigationAttribute["SCOPE_VARIABLE_UUID"],
                                EXISTING_TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"],
                                IS_ANY_VALUE_CHANGED: "Yes",
                            };
                            testCaseViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                        }
                    }
                }
                if (data["IS_UI_ELEMENT_GROUP_STEP"] == "No" && data["IS_FUNCTION_STEP"] == "Yes") {
                    const testCaseFunctionStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP where TEST_CASE_STEP_UUID in(${ existingTestCaseStepId ? existingTestCaseStepId : `''` }) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_STEP_SEQ_ID asc`;
                    let testCaseFunctionStepData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);
                    let functionStepCount = 1;
                    if (testCaseFunctionStepData && testCaseFunctionStepData.length) {
                        for (let functionStepData of testCaseFunctionStepData) {
                            let generatedTestCaseFunctionStepId = uuid();
                            let testCaseFunctionStepObject = {
                                TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                                TEST_CASE_FUNCTION_STEP_NAME: functionStepData["TEST_CASE_FUNCTION_STEP_NAME"],
                                STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepData["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                                CURRENT_PAGE_CONTEXT: functionStepData["CURRENT_PAGE_CONTEXT"],
                                NEXT_PAGE_CONTEXT: functionStepData["NEXT_PAGE_CONTEXT"],
                                VIEW_UUID: functionStepData["VIEW_UUID"],
                                TEST_CASE_FUNCTION_STEP_TYPE: functionStepData["TEST_CASE_FUNCTION_STEP_TYPE"],
                                TEST_CASE_FUNCTION_STEP_SEQ_ID: functionStepCount,
                                TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                IS_UI_ELEMENT_GROUP_STEP: functionStepData["IS_UI_ELEMENT_GROUP_STEP"],
                                FUNCTION_UUID: functionStepData["FUNCTION_UUID"],
                                FUNCTION_STEP_UUID: functionStepData["FUNCTION_STEP_UUID"],
                                IS_PURE_NAVIGATION_STEP: functionStepData["IS_PURE_NAVIGATION_STEP"],
                                API_UUID: functionStepData["API_UUID"],
                                UI_ELEMENT_GROUP_UUID: data["UI_ELEMENT_GROUP_UUID"],
                                IS_ANY_VALUE_CHANGED: "Yes",
                            };
                            testCaseFunctionStepList.push(testCaseFunctionStepObject);
                            functionStepCount++;
                            let existingTestCaseFunctionStepId = "'" + functionStepData["TEST_CASE_FUNCTION_STEP_UUID"] + "'";
                            const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                            let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
                            for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
                                let generatedTestCaseFunctionStepAttributeId = uuid();
                                let testCaseFunctionStepAttributeObject = {
                                    TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseFunctionStepAttributeId,
                                    STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                    TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA: functionStepAttributeData["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_DATA"],
                                    TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                    TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                                    FUNCTION_UUID: functionStepAttributeData["FUNCTION_UUID"],
                                    PRE_DEFINED_VALUES_UUID: functionStepAttributeData["PRE_DEFINED_VALUES_UUID"],
                                    SCOPE_VARIABLE_TYPE: functionStepAttributeData["SCOPE_VARIABLE_TYPE"],
                                    SCOPE_VARIABLE_UUID: functionStepAttributeData["SCOPE_VARIABLE_UUID"],
                                    EXISTING_TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData["TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE_UUID"],
                                    IS_ANY_VALUE_CHANGED: "Yes",
                                };
                                testCaseFunctionStepAttributeValueList.push(testCaseFunctionStepAttributeObject);
                            }
                            if (functionStepData["IS_UI_ELEMENT_GROUP_STEP"] == "Yes") {
                                const testCaseFunctionUIElementGroupStepQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP where TEST_CASE_FUNCTION_STEP_UUID in(${existingTestCaseFunctionStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ID asc`;
                                let testCaseFunctionUIElementGroupStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepQuery, input);
                                for (let functionStepUIElementGroupStepData of testCaseFunctionUIElementGroupStepQueryData) {
                                    let generatedTestCaseFunctionUIElementGroupStepId = uuid();
                                    let testCaseFunctionUIElementGroupStepObject = {
                                        TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseFunctionUIElementGroupStepId,
                                        TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME: functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_NAME"],
                                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: functionStepUIElementGroupStepData["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                                        CURRENT_PAGE_CONTEXT: functionStepUIElementGroupStepData["CURRENT_PAGE_CONTEXT"],
                                        TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE: functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_TYPE"],
                                        TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                        TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                                        UI_ELEMENT_GROUP_UUID: functionStepUIElementGroupStepData["UI_ELEMENT_GROUP_UUID"],
                                        UI_ELEMENT_GROUP_STEP_UUID: functionStepUIElementGroupStepData["UI_ELEMENT_GROUP_STEP_UUID"],
                                        FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: functionStepUIElementGroupStepData["FUNCTION_UI_ELEMENT_GROUP_STEP_UUID"],
                                        TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID: functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_SEQ_ID"],
                                        FUNCTION_STEP_UUID: functionStepUIElementGroupStepData["FUNCTION_STEP_UUID"],
                                        FUNCTION_UUID: functionStepUIElementGroupStepData["FUNCTION_UUID"],
                                        IS_ANY_VALUE_CHANGED: "Yes",
                                    };
                                    testCaseFunctionUIElementGroupStepList.push(testCaseFunctionUIElementGroupStepObject);
                                    let existingTestCaseFunctionUIElementGroupStepId = "'" + functionStepUIElementGroupStepData["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID"] + "'";
                                    const testCaseFunctionUIElementGroupStepAttributeQuery = `SELECT * FROM TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseFunctionUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                                    let testCaseFunctionUIElementGroupStepAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionUIElementGroupStepAttributeQuery, input);
                                    for (let testCaseFunctionUIElementGroupStepAttribute of testCaseFunctionUIElementGroupStepAttributeQueryData) {
                                        let generatedTestCaseFunctionUIElementGroupStepAttributeId = uuid();
                                        let testCaseFunctionUIelementGroupAttributeObject = {
                                            TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseFunctionUIElementGroupStepAttributeId,
                                            STEP_DEFINITION_ATTRIBUTE_UUID: testCaseFunctionUIElementGroupStepAttribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                            TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: testCaseFunctionUIElementGroupStepAttribute["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA"],
                                            TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseFunctionUIElementGroupStepId,
                                            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                            UI_ELEMENT_GROUP_UUID: testCaseFunctionUIElementGroupStepAttribute["UI_ELEMENT_GROUP_UUID"],
                                            TEST_CASE_FUNCTION_STEP_UUID: generatedTestCaseFunctionStepId,
                                            PRE_DEFINED_VALUES_UUID: testCaseFunctionUIElementGroupStepAttribute["PRE_DEFINED_VALUES_UUID"],
                                            FUNCTION_UUID: testCaseFunctionUIElementGroupStepAttribute["FUNCTION_UUID"],
                                            SCOPE_VARIABLE_TYPE: testCaseFunctionUIElementGroupStepAttribute["SCOPE_VARIABLE_TYPE"],
                                            SCOPE_VARIABLE_UUID: testCaseFunctionUIElementGroupStepAttribute["SCOPE_VARIABLE_UUID"],
                                            EXISTING_TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: testCaseFunctionUIElementGroupStepAttribute["TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID"],
                                            IS_ANY_VALUE_CHANGED: "Yes",
                                        };
                                        testCaseFunctionUIElementGroupStepAttributeList.push(testCaseFunctionUIelementGroupAttributeObject);
                                    }
                                }
                            }
                            if (functionStepData["IS_PURE_NAVIGATION_STEP"] && functionStepData["IS_PURE_NAVIGATION_STEP"] == "Yes") {
                                const testCaseFunctionViewNavigationQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID AND FUNCTION_UUID IS NOT NULL AND FUNCTION_STEP_UUID IS NOT NULL order by TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID asc`;
                                let testCaseFunctionViewNavigationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionViewNavigationQuery, input);
                                let functionNavigationCount = 1;
                                for (let testCaseViewNavigation of testCaseFunctionViewNavigationQueryData) {
                                    let testCaseViewNavigationStepId = uuid();
                                    let existinTestCaseViewNavigationStepId = "'" + testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_UUID"] + "'";
                                    let testCaseViewNavigationObject = {
                                        TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                                        VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigation["VIEW_NAVIGATION_STEP_UUID"],
                                        TEST_CASE_VIEW_NAVIGATION_STEP_NAME: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_NAME"],
                                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: testCaseViewNavigation["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                                        TEST_CASE_VIEW_NAVIGATION_STEP_TYPE: testCaseViewNavigation["TEST_CASE_VIEW_NAVIGATION_STEP_TYPE"],
                                        TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID: functionNavigationCount,
                                        CURRENT_PAGE_CONTEXT: testCaseViewNavigation["CURRENT_PAGE_CONTEXT"],
                                        NEXT_PAGE_CONTEXT: testCaseViewNavigation["NEXT_PAGE_CONTEXT"],
                                        VIEW_UUID: testCaseViewNavigation["VIEW_UUID"],
                                        TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                        FUNCTION_UUID: testCaseViewNavigation["FUNCTION_UUID"],
                                        FUNCTION_STEP_UUID: testCaseViewNavigation["FUNCTION_STEP_UUID"],
                                        IS_ANY_VALUE_CHANGED: "Yes",
                                    };
                                    testCaseViewNavigationList.push(testCaseViewNavigationObject);
                                    functionNavigationCount++;
                                    const testCaseViewNavigationAttributeQuery = `SELECT * FROM TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE where TEST_CASE_VIEW_NAVIGATION_STEP_UUID in(${existinTestCaseViewNavigationStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                                    let testCaseViewNavigationAttributeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseViewNavigationAttributeQuery, input);
                                    for (let viewNavigationAttribute of testCaseViewNavigationAttributeQueryData) {
                                        let testCaseViewNavigationAttributeId = uuid();
                                        let testCaseViewNavigationAttributeObject = {
                                            TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: testCaseViewNavigationAttributeId,
                                            STEP_DEFINITION_ATTRIBUTE_UUID: viewNavigationAttribute["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                            TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA"],
                                            TEST_CASE_VIEW_NAVIGATION_STEP_UUID: testCaseViewNavigationStepId,
                                            VIEW_UUID: viewNavigationAttribute["VIEW_UUID"],
                                            PRE_DEFINED_VALUES_UUID: viewNavigationAttribute["PRE_DEFINED_VALUES_UUID"],
                                            FUNCTION_UUID: viewNavigationAttribute["FUNCTION_UUID"],
                                            SCOPE_VARIABLE_TYPE: viewNavigationAttribute["SCOPE_VARIABLE_TYPE"],
                                            SCOPE_VARIABLE_UUID: viewNavigationAttribute["SCOPE_VARIABLE_UUID"],
                                            EXISTING_TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID: viewNavigationAttribute["TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID"],
                                            IS_ANY_VALUE_CHANGED: "Yes",
                                        };
                                        testCaseViewNavigationAttributeValueList.push(testCaseViewNavigationAttributeObject);
                                    }
                                }
                            }
                        }
                    }
                } else if (data["IS_UI_ELEMENT_GROUP_STEP"] == "Yes" && data["IS_FUNCTION_STEP"] == "No") {
                    const testCaseUIElementStepQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP where TEST_CASE_STEP_UUID in(${existingTestCaseStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID order by TEST_CASE_UI_ELEMENT_GROUP_STEP_ID asc`;
                    let testCaseUIElementStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseUIElementStepQuery, input);
                    for (let uiElementGroupStepData of testCaseUIElementStepQueryData) {
                        let generatedTestCaseUIElementGroupStepId = uuid();
                        let testCaseUIElementGroupStepObject = {
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME: uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_NAME"],
                            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: uiElementGroupStepData["STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID"],
                            CURRENT_PAGE_CONTEXT: uiElementGroupStepData["CURRENT_PAGE_CONTEXT"],
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE: uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_TYPE"],
                            TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                            UI_ELEMENT_GROUP_UUID: uiElementGroupStepData["UI_ELEMENT_GROUP_UUID"],
                            UI_ELEMENT_GROUP_STEP_UUID: uiElementGroupStepData["UI_ELEMENT_GROUP_STEP_UUID"],
                            TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID: uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_SEQ_ID"],
                            IS_ANY_VALUE_CHANGED: "Yes",
                        };
                        testCaseUIElementGroupStepList.push(testCaseUIElementGroupStepObject);
                        let existingTestCaseUIElementGroupStepId = "'" + uiElementGroupStepData["TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID"] + "'";
                        const testCaseFunctionStepAttributeValueQuery = `SELECT * FROM TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE where TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID in(${existingTestCaseUIElementGroupStepId}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
                        let testCaseFunctionStepAttributeValueQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepAttributeValueQuery, input);
                        for (let functionStepAttributeData of testCaseFunctionStepAttributeValueQueryData) {
                            let generatedTestCaseUIElementGroupStepAttributeId = uuid();
                            let testCaseUIElementGroupStepAttributeobject = {
                                TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: generatedTestCaseUIElementGroupStepAttributeId,
                                STEP_DEFINITION_ATTRIBUTE_UUID: functionStepAttributeData["STEP_DEFINITION_ATTRIBUTE_UUID"],
                                TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA: functionStepAttributeData["TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_DATA"],
                                TEST_CASE_UI_ELEMENT_GROUP_STEP_UUID: generatedTestCaseUIElementGroupStepId,
                                TEST_CASE_STEP_UUID: generatedTestCaseStepId,
                                UI_ELEMENT_GROUP_UUID: functionStepAttributeData["UI_ELEMENT_GROUP_UUID"],
                                PRE_DEFINED_VALUES_UUID: functionStepAttributeData["PRE_DEFINED_VALUES_UUID"],
                                FUNCTION_UUID: functionStepAttributeData["FUNCTION_UUID"],
                                SCOPE_VARIABLE_TYPE: functionStepAttributeData["SCOPE_VARIABLE_TYPE"],
                                SCOPE_VARIABLE_UUID: functionStepAttributeData["SCOPE_VARIABLE_UUID"],
                                EXISTING_TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID: functionStepAttributeData["TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE_UUID"],
                                IS_ANY_VALUE_CHANGED: "Yes",
                            };
                            testCaseUIElementGroupStepAttributeList.push(testCaseUIElementGroupStepAttributeobject);
                        }
                    }
                }
            }
            if (input["ORIGINAL_TEST_SET_UUID"] == input["TEST_SET_UUID"]) {
                updateSourceUUIDBasedOnTestSetAndTestCase("Yes", "No");
            } else if (input["ORIGINAL_TEST_SET_UUID"] != input["TEST_SET_UUID"]) {
                updateSourceUUIDBasedOnTestSetAndTestCase("No", "No");
            }
        }
    }
    input["AppEngChildEntity:TEST_CASE_CHILD_OF_TEST_CASE"] = testCaseList;
    input["AppEngChildEntity:TEST_CASE_STEP_NEW"] = testCaseStepList;
    input["AppEngChildEntity:TEST_DATA_SET"] = testDataSet;
    input["AppEngChildEntity:TEST_DATA"] = testData;
    input["AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT"] = testCaseRequirmentList;
    input["AppEngChildEntity:TEST_CASE_STEP_ATTRIBUTE_VALUE"] = testCaseStepAttributeValueList;
    input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP"] = testCaseFunctionStepList;
    input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP_ATTRIBUTE_VALUE"] = testCaseFunctionStepAttributeValueList;
    input["AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP"] = testCaseFunctionUIElementGroupStepList;
    input["AppEngChildEntity:TEST_CASE_FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE"] = testCaseFunctionUIElementGroupStepAttributeList;
    input["AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP"] = testCaseUIElementGroupStepList;
    input["AppEngChildEntity:TEST_CASE_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE"] = testCaseUIElementGroupStepAttributeList;
    input["AppEngChildEntity:FUNCTION"] = functionList;
    input["AppEngChildEntity:FUNCTION_STEP"] = functionStepList;
    input["AppEngChildEntity:FUNCTION_STEP_ATTRIBUTE_VALUE"] = functionStepAttributeValueList;
    input["AppEngChildEntity:FUNCTION_UI_ELEMENT_GROUP_STEP"] = functionUIElementGroupStepList;
    input["AppEngChildEntity:FUNCTION_UI_ELEMENT_GROUP_STEP_ATTRIBUTE_VALUE"] = functionUIElementGroupStepAttributeList;
    input["AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP"] = testCaseViewNavigationList;
    input["AppEngChildEntity:TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE"] = testCaseViewNavigationAttributeValueList;
    input["AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP"] = functionViewNavigationList;
    input["AppEngChildEntity:FUNCTION_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE"] = functionViewNavigationAttributeValueList;
}