if (input.compositeEntityAction == "Update") {
    input["Informational_label"] = "";
    let testCaseStepList = [];
    let testCaseFunctionStepList = [];
    let functionStepList = [];
    let pageQuery = `select * FROM PAGE WHERE PAGE_UUID=:PAGE_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    let pageQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("PRIMARYSPRINGFM", pageQuery, input);

    async function updateIsPureNavigationStep(isPureNavigationStep) {
        let testCaseStepQuery = `select tcs.TEST_CASE_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_STEP tcs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes'`;

        let testCaseStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseStepQuery, input);

        for (let testCaseStep of testCaseStepQueryData) {
            let data = {};
            data["TEST_CASE_STEP_UUID"] = testCaseStep['TEST_CASE_STEP_UUID'];
            data["IS_PURE_NAVIGATION_STEP"] = isPureNavigationStep;
            testCaseStepList.push(data);
        }

        let testCaseFunctionStepQuery = `select tcfs.TEST_CASE_FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv join TEST_CASE_FUNCTION_STEP tcfs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = tcfs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where tcfs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes'`;

        let testCaseFunctionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseFunctionStepQuery, input);

        for (let testCaseFunctionStep of testCaseFunctionStepQueryData) {
            let data = {};
            data["TEST_CASE_FUNCTION_STEP_UUID"] = testCaseFunctionStep['TEST_CASE_FUNCTION_STEP_UUID'];
            data["IS_PURE_NAVIGATION_STEP"] = isPureNavigationStep;
            testCaseFunctionStepList.push(data);
        }

        let functionStepQuery = `select fs.FUNCTION_STEP_UUID from STEP_DEFINITION_TEMPLATE_VERBIAGE sdtv 
        join FUNCTION_STEP fs on sdtv.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = fs.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID where fs.CURRENT_PAGE_CONTEXT=:PAGE_UUID and sdtv.IS_PURE_NAVIGATION_STEP='Yes'`;

        let functionStepQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", functionStepQuery, input);

        for (let functionStep of functionStepQueryData) {
            let data = {};
            data["FUNCTION_STEP_UUID"] = functionStep['FUNCTION_STEP_UUID'];
            data["IS_PURE_NAVIGATION_STEP"] = isPureNavigationStep;
            functionStepList.push(data);
        }
    }

    if (pageQueryData['PAGE_ACCESS_RELATIVE_URL'] == input["PAGE_ACCESS_RELATIVE_URL"] || (pageQueryData['PAGE_ACCESS_RELATIVE_URL'] && input["PAGE_ACCESS_RELATIVE_URL"]) || (!pageQueryData['PAGE_ACCESS_RELATIVE_URL'] && !input["PAGE_ACCESS_RELATIVE_URL"])) {
        console.log('No data need to modify.');
    } else if (pageQueryData['PAGE_ACCESS_RELATIVE_URL'] != input["PAGE_ACCESS_RELATIVE_URL"] && input["PAGE_ACCESS_RELATIVE_URL"].length > 0) {
        await updateIsPureNavigationStep('No');
    } else if (pageQueryData['PAGE_ACCESS_RELATIVE_URL'] != input["PAGE_ACCESS_RELATIVE_URL"] && input["PAGE_ACCESS_RELATIVE_URL"].length == 0) {
        await updateIsPureNavigationStep('Yes');
    }
    
    input["AppEngChildEntity:TEST_CASE_STEP_NEW"] = testCaseStepList;
    input["AppEngChildEntity:TEST_CASE_FUNCTION_STEP"] = testCaseFunctionStepList;
    input["AppEngChildEntity:FUNCTION_STEP"] = functionStepList;
}