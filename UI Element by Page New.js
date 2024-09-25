if (input.compositeEntityAction == 'Update'){
    let userActionList = [];
    
    let query= `select * from VIEW_USER_ACTION  where UI_ELEMENT_UUID=:UI_ELEMENT_UUID and UI_ELEMENT_UUID in (select UI_ELEMENT_UUID from UI_ELEMENT where  CONCAT(',',UI_ELEMENT_MODE, ',') LIKE CONCAT('%,','User Action',',%'));`;
    let queryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", query, input);
    let queryResult = JSON.parse(JSON.stringify(queryData));

    for(let i=0;i<queryResult.length;i++){
        let userActionObject={};
        userActionObject['USER_ACTION_UUID']=queryResult[i]['USER_ACTION_UUID'];
        userActionObject['USER_ACTION_NAME']=input['UI_ELEMENT_NAME'];
        userActionList.push(userActionObject);
    }

    input["AppEngChildEntity:USER_ACTION_CHILD_OF_UIELEMENT"] = userActionList;
}


const VIEW_UI_ELEMENT = []

function deleteRecord(primarykey, primarykeyvalue, tablename, functionalareauuid) {
    let deleteTableData = {};

    deleteTableData[primarykey] = primarykeyvalue;
    deleteTableData["compositeEntityAction"] = "Delete";
    deleteTableData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;
    
    if (tablename == 'VIEW_UI_ELEMENT') {
        VIEW_UI_ELEMENT.push(deleteTableData);
    }
    else if(tablename == 'VIEW_NAVIGATION_STEP'){
        VIEW_NAVIGATION_STEP.push(deleteTableData)
    }
}

if (input.compositeEntityAction == 'Delete'){
    console.log("Insiide the delete ui element composite entity =======>>>>>>>>>>>>>>>> ", input)


    let query= `SELECT VIEW_UI_ELEMENT_UUID FROM VIEW_UI_ELEMENT WHERE UI_ELEMENT_UUID = :UI_ELEMENT_UUID`;
    let queryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", query, input);


    console.log("query data =>>>>>>>>>>>>>>>>>>> ", queryData);
	
    for(data of queryData){
        deleteRecord("VIEW_UI_ELEMENT_UUID", data["VIEW_UI_ELEMENT_UUID"], "VIEW_UI_ELEMENT", input.APP_LOGGED_IN_FUNTIONAL_AREA_ID)
    }

    console.log("Delete ui element data =======>>>>>>>>>>>>>>>> ", VIEW_UI_ELEMENT)
    input["AppEngChildEntity:VIEW_UI_ELEMENT"] = VIEW_UI_ELEMENT;
}