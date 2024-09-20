const VIEW_UI_ELEMENT = []


function deleteRecord(primarykey, primarykeyvalue, tablename, functionalareauuid) {
  
    let deleteTableData = {};

    deleteTableData[primarykey] = primarykeyvalue;
    deleteTableData["compositeEntityAction"] = "Delete";
    deleteTableData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;
    
    if (tablename == 'VIEW_UI_ELEMENT') {
        VIEW_UI_ELEMENT.push(deleteTableData);
    }
}


if (input.compositeEntityAction == 'Save' && input.VIEW_UI_ELEMENT_NAME) {

    const uiElementUuids = input.VIEW_UI_ELEMENT_NAME.split(',');

    for(id of uiElementUuids){
        const viewUiEl = {};

        viewUiEl['VIEW_UI_ELEMENT_UUID'] = uuid();
        viewUiEl['VIEW_UUID'] = input.VIEW_UUID;
        viewUiEl['PAGE_UUID'] = input.PAGE_UUID;
        viewUiEl['UI_ELEMENT_UUID'] = id;
        
        VIEW_UI_ELEMENT.push(viewUiEl);
    }

}


if (input.compositeEntityAction == 'Delete') {
    deleteRecord("VIEW_UI_ELEMENT_UUID", input.VIEW_UI_ELEMENT_UUID, "VIEW_UI_ELEMENT", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID)
}

console.log("Data to push ====================== ", VIEW_UI_ELEMENT);

input["AppEngChildEntity:VIEW_UI_ELEMENT_CHILD_OF_VIEW_UI_ELEMENT"] = VIEW_UI_ELEMENT;
