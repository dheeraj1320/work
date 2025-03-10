let createPageList = [];
let createPageViewList = [];
let createUIElementList = [];

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
                    let pageViewObject = {
                        "PAGE_UUID": pageUUID,
                        "VIEW_NAME": 'Default View',
                        "IS_DEFAULT_VIEW": "Yes",
                        "Row_Index": page_index,
                        "Parent_Index": page_index

                    };

                    createPageViewList.push(pageViewObject);

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
                            "LOCATOR_TYPE": pageDetails["Locator Type"] ? pageDetails["Locator Type"] : 'Recorded',
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

input["AppEngChildEntity:PAGE"] = createPageList;
input["AppEngChildEntity:PAGE_VIEW"] = createPageViewList;
input["AppEngChildEntity:UI_ELEMENT"] = createUIElementList;