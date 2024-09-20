console.log("Preprocessor running:::::::::::::::::::::",input);

const viewElementsQuery = `SELECT UI_ELEMENT_UUID FROM UI_ELEMENT WHERE PAGE_NEW_UUID = :PAGE_UUID AND UI_ELEMENT_UUID NOT IN (SELECT UI_ELEMENT_UUID FROM VIEW_UI_ELEMENT WHERE VIEW_UUID = :VIEW_UUID)`

let viewElementsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", viewElementsQuery, input[0]);

const ui_element_uuids = viewElementsQueryData.sort().map(data => data.UI_ELEMENT_UUID).join(',');

if(ui_element_uuids.length == 0){
    input[0].IS_WARNING_MESSAGE_VISIBLE = true;
}

if(input[0]['SELECT_ALL'] === "Yes"){

    console.log('ui_element_uuids;====== >>>>>>>>>>>> ', ui_element_uuids);

    if(input[0].PREVIOUS_SELECT_ALL !== "Yes"){
        input[0].VIEW_UI_ELEMENT_NAME = ui_element_uuids;
        input[0].PREVIOUS_SELECT_ALL = "Yes";
    }else{

        if(input[0].VIEW_UI_ELEMENT_NAME.split(',').sort().join(',') !== ui_element_uuids){
            console.log("De selecting checkbox");
            input[0]['SELECT_ALL'] = '';
            input[0].PREVIOUS_SELECT_ALL = '';
        }
    }
} else {
    input[0].PREVIOUS_SELECT_ALL = '';
}