let createPageList = [];
let createPageViewList = [];
let createUIElementList = [];
let testCaseStepList = [];
let testCaseStepAttributeValueList = [];

const TEST_SET_NEW = [];
const INTEGRATION_TEST_CASE = [];
const TEST_CASE_DESCRIPTION = [];
let TEST_SUITE_TEST_SET = [];

function isDataAvailable(str) {
    if (str === null || str === undefined || str.trim() === '' || str === 'null' || str === "' '" || str === 'undefined') {
        return false;
    } else {
        return true;
    }
}

if (input.compositeEntityAction == 'Upload') {

    const uiElementTypeMasterQuery = `SELECT * FROM UI_ELEMENT_TYPE_MASTER`;
    let uiElementTypeMasterQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", uiElementTypeMasterQuery, input);
    if (input.excelToJsonFormattedData && input.excelToJsonFormattedData['Page UI Element Upload']) {
        const dataGroupedByPage = input.excelToJsonFormattedData['Page UI Element Upload'].reduce((acc, item) => {
            const pageName = item["Page Name"];
            if (!acc[pageName]) {
                acc[pageName] = [];
            }
            acc[pageName].push(item);
            return acc;
        }, {});


        if (dataGroupedByPage && Object.keys(dataGroupedByPage).length) {
            let page_index = 0;
            for (let pageKey in dataGroupedByPage) {
                let pageUUID = '';
                let pageName = pageKey ? pageKey.trim() : pageKey;
                const pagebyPageNameQuery = `SELECT * FROM PAGE where FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and PAGE_NAME='${pageName}'`;
                let pagedata = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", pagebyPageNameQuery, input);
                if (pagedata.length === 0) {
                    page_index++;
                    pageUUID = uuid();
                    let pageObject = {
                        "PAGE_UUID": pageUUID,
                        "PAGE_NAME": pageName,
                        "PAGE_ACCESS_RELATIVE_URL": dataGroupedByPage[pageKey] && dataGroupedByPage[pageKey].length ? dataGroupedByPage[pageKey][0]["Relative Page Access URL"] : "",
                        "SheetName": "Page UI Element Upload",
                        "Row_Index": page_index
                    };

                    createPageList.push(pageObject);
                    const viewUUID = uuid();
                    let pageViewObject = {
                        "PAGE_UUID": pageUUID,
                        "VIEW_UUID": viewUUID,
                        "VIEW_NAME": 'Default View',
                        "IS_DEFAULT_VIEW": "Yes",
                        "Row_Index": page_index,
                        "Parent_Index": page_index

                    };

                    createPageViewList.push(pageViewObject);

                    // Adding Test Set for the page
                    const TEST_SET_UUID = uuid();
                    let testSetObj = {};
                    testSetObj['TEST_SET_NAME'] = pageName;
                    testSetObj['TEST_SET_TYPE'] = 'Page Navigation';
                    testSetObj['TEST_SET_UUID'] = TEST_SET_UUID;
                    testSetObj['PAGE_UUID'] = pageUUID;
                    TEST_SET_NEW.push(testSetObj);

                    // Linking test set to Page Navigation Test Suite
                    const suiteQuery = `SELECT TEST_SUITE_UUID FROM TEST_SUITE WHERE FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID AND TEST_SUITE_TYPE = 'Page Navigation'`;
                    const suiteQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", suiteQuery, input);

                    if(suiteQueryData.length > 0) {
                        const testSetTestSuiteObj = {};
                        testSetTestSuiteObj['TEST_SET_UUID'] = TEST_SET_UUID;
                        testSetTestSuiteObj['TEST_SUITE_UUID'] = suiteQueryData[0]['TEST_SUITE_UUID'];
                        testSetTestSuiteObj['FUNCTIONAL_AREA_UUID'] = input.APP_LOGGED_IN_FUNTIONAL_AREA_ID;
                        TEST_SUITE_TEST_SET.push(testSetTestSuiteObj);
                    }

                    // Adding Test Case for the page view
                    const TEST_CASE_UUID = uuid();
                    const testCaseObj = {};
                    testCaseObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
                    testCaseObj['TEST_CASE_NAME'] = 'Default View';
                    testCaseObj['TEST_CASE_STATUS'] = 'COMMITTED';
                    testCaseObj['TEST_SET_UUID'] = TEST_SET_UUID;
                    testCaseObj['TEST_CASE_EXECUTON_TYPE'] = 'Manual';
                    // testCaseObj['TEST_CASE_TYPE'] =
                    testCaseObj['ASSOCIATED_VIEW_UUID'] = viewUUID;
                    testCaseObj['compositeEntityAction'] = 'Insert';
                    INTEGRATION_TEST_CASE.push(testCaseObj);

                    // Adding Test Case Description
                    const testCaseDescriptionObj = {};
                    testCaseDescriptionObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
                    TEST_CASE_DESCRIPTION.push(testCaseDescriptionObj);
					
					
					// Adding Test Case Step
                    const TEST_CASE_STEP_UUID = uuid();
                    const testCaseStepObj = {};
                    testCaseStepObj['TEST_CASE_STEP_UUID'] = TEST_CASE_STEP_UUID;
                    testCaseStepObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
                    testCaseStepObj['TEST_SET_UUID'] = TEST_SET_UUID;
                    testCaseStepObj['TEST_CASE_STEP_NAME'] = 'When User is on ' + pageName + ' Page'
                    testCaseStepObj['PAGE_UUID'] = pageUUID;
                    testCaseStepObj['VIEW_UUID'] = viewUUID;
                    testCaseStepObj['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'] = '20b169ba-34aa-46d1-888d-9324b9b77bc8';
                    testCaseStepObj['CURRENT_PAGE_CONTEXT'] = pageUUID;
                    testCaseStepObj['TEST_CASE_STEP_SEQ_ID'] = '1';
                    testCaseStepObj['TEST_CASE_STEP_TYPE'] = 'Given'
                    testCaseStepObj['IS_PURE_NAVIGATION_STEP'] = 'Yes';
                    testCaseStepObj['IS_UI_ELEMENT_GROUP_STEP'] = 'No';
                    testCaseStepObj['IS_FUNCTION_STEP'] = 'No';
                    testCaseStepList.push(testCaseStepObj);

					
					
					//Adding Attribute Value For Test Case Step
                    const testCaseStepAttributeObj ={};
                    testCaseStepAttributeObj['STEP_DEFINITION_ATTRIBUTE_UUID'] = '11cf20fb-2cdf-4d03-a0b2-aad3644056af';
                    testCaseStepAttributeObj['TEST_CASE_STEP_ATTRIBUTE_DATA'] = pageUUID;
                    testCaseStepAttributeObj['TEST_SET_UUID'] = TEST_SET_UUID;
                    testCaseStepAttributeObj['TEST_CASE_UUID'] = TEST_CASE_UUID;
                    testCaseStepAttributeObj['TEST_CASE_STEP_UUID'] = TEST_CASE_STEP_UUID;
                    testCaseStepAttributeValueList.push(testCaseStepAttributeObj);
					

                } else {
                    pageUUID = pagedata[0].PAGE_UUID;
                    let pageObject = {
                        "PAGE_UUID": pageUUID,
                        "PAGE_NAME": pageKey,
                        "PAGE_ACCESS_RELATIVE_URL": dataGroupedByPage[pageKey] && dataGroupedByPage[pageKey].length ? dataGroupedByPage[pageKey][0]["Relative Page Access URL"] : "",
                        "SheetName": "Page UI Element Upload",
                        "Row_Index": page_index
                    };
                    createPageList.push(pageObject);
                }
                let index = 0;
                for (let pageDetails of dataGroupedByPage[pageKey]) {
                    let uiElementUUID = uuid();
                    let uiElementTypeStr = '';
                    index++;
                    if (pageDetails && pageDetails["UI Element Name"]) {
                        let uiElementTypeMasterDetails = uiElementTypeMasterQueryData.filter((item) => item["UI_ELEMENT_TYPE_NAME"] == pageDetails["Element Type"]);
                        if (uiElementTypeMasterDetails && uiElementTypeMasterDetails.length) {
                            uiElementTypeStr = uiElementTypeMasterDetails[0]['UI_ELEMENT_TYPE_UUID'];
                        }
                    }
                    if (pageDetails) {
                        let uiElementObject = {
                            "UI_ELEMENT_UUID": uiElementUUID,
                            "UI_ELEMENT_NAME": pageDetails["UI Element Name"] ? pageDetails["UI Element Name"] : null,
                            "UI_ELEMENT_TYPE": uiElementTypeStr ? uiElementTypeStr : null,
                            "LOCATOR_TYPE": pageDetails["Locator Type"] ? pageDetails["Locator Type"] : null,
                            "LOCATOR_VALUE": pageDetails["Locator Value"],
                            "IS_PAGE_IDENTIFIER": pageDetails["Is Page Identifier"],
                            "EVENT_NAME": pageDetails["Event Name"] ? pageDetails["Event Name"] : null,
                            "PAGE_NEW_UUID": pageUUID,
                            "UI_ELEMENT_MODE": pageDetails["UI Element Mode"] ? pageDetails["UI Element Mode"] : null,
                            "PAGE_NAME": pageKey,
                            "SheetName": "Page UI Element Upload",
                            "Row_Index": index,
                            "Parent_Index": page_index
                        };
                        createUIElementList.push(uiElementObject);
                    }
                }
            }
        }
    }
}

input['AppEngChildEntity:TEST_CASE_STEP_NEW'] = testCaseStepList;
input['AppEngChildEntity:TEST_CASE_STEP_ATTRIBUTE_VALUE'] = testCaseStepAttributeValueList;
input["AppEngChildEntity:PAGE"] = createPageList;
input["AppEngChildEntity:PAGE_VIEW"] = createPageViewList;
input["AppEngChildEntity:UI_ELEMENT"] = createUIElementList;

input["AppEngChildEntity:TEST_SET_NEW"] = TEST_SET_NEW;
input['AppEngChildEntity:TEST_SUITE_TEST_SET'] = TEST_SUITE_TEST_SET;
input["AppEngChildEntity:INTEGRATION_TEST_CASE"] = INTEGRATION_TEST_CASE;
input['AppEngChildEntity:TEST_CASE_DESCRIPTION'] = TEST_CASE_DESCRIPTION;