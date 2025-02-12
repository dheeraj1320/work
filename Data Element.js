let DATA_ELEMENT = [];
let DATA_ELEMENT_LONGTEXT = [];
let CODE_SET_TRANSACTION_DATA_ELEMENTS = [];

function deleteRecord(primarykey, primarykeyvalue, tablename, functionalareauuid) {

    let deleteData = {};

    deleteData[primarykey] = primarykeyvalue;
    deleteData["compositeEntityAction"] = "Delete";
    deleteData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;
    
    if (tablename == 'DATA_SET') {
        DATA_SET.push(deleteData);
    } else if (tablename == 'DATA_ELEMENT') {
        DATA_ELEMENT.push(deleteData);
    } else if (tablename == 'DATA_ELEMENT_LONGTEXT') {
        DATA_ELEMENT_LONGTEXT.push(deleteData);
    } else if (tablename == 'CODE_SET_TRANSACTION_DATA_ELEMENT') {
        CODE_SET_TRANSACTION_DATA_ELEMENTS.push(deleteData);
    }
}

if (input.compositeEntityAction == 'Delete') {
    deleteRecord('DATA_ELEMENT_UUID', input['DATA_ELEMENT_UUID'], 'DATA_ELEMENT', input['APP_LOGGED_IN_FUNTIONAL_AREA_ID']);

 
        let QuerytoFetchDataElementsPreDefinedValues = 'select CODE_SET_TRANSACTION_DATA_ELEMENT_UUID from CODE_SET_TRANSACTION_DATA_ELEMENT where DATA_ELEMENT_UUID=:DATA_ELEMENT_UUID;';
        let QuerytoFetchDataElementsPreDefinedValuesData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_TENANT", QuerytoFetchDataElementsPreDefinedValues, input);
        let QuerytoFetchDataElementsPreDefinedValuesRecords = JSON.parse(JSON.stringify(QuerytoFetchDataElementsPreDefinedValuesData));
        for (let key in QuerytoFetchDataElementsPreDefinedValuesRecords) {
            deleteRecord('CODE_SET_TRANSACTION_DATA_ELEMENT_UUID', QuerytoFetchDataElementsPreDefinedValuesRecords[key].CODE_SET_TRANSACTION_DATA_ELEMENT_UUID, 'CODE_SET_TRANSACTION_DATA_ELEMENT', input['APP_LOGGED_IN_FUNTIONAL_AREA_ID']);
        }

        let QuerytoFetchDataElementsLongtext = 'select DATA_ELEMENT_LONGTEXT_UUID  from DATA_ELEMENT_LONGTEXT  where DATA_ELEMENT_UUID=:DATA_ELEMENT_UUID;';
        let QuerytoFetchDataElementsLongtextData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", QuerytoFetchDataElementsLongtext, input);
        let QuerytoFetchDataElementsLongtextRecords = JSON.parse(JSON.stringify(QuerytoFetchDataElementsLongtextData));
        for (let key in QuerytoFetchDataElementsLongtextRecords) {
            deleteRecord('DATA_ELEMENT_LONGTEXT_UUID', QuerytoFetchDataElementsLongtextRecords[key].DATA_ELEMENT_LONGTEXT_UUID, 'DATA_ELEMENT_LONGTEXT', input['APP_LOGGED_IN_FUNTIONAL_AREA_ID']);
        }
    

input["AppEngChildEntity:DATA_ELEMENT"] = DATA_ELEMENT;
input["AppEngChildEntity:CODE_SET_TRANSACTION_DATA_ELEMENT"] = CODE_SET_TRANSACTION_DATA_ELEMENTS;
input["AppEngChildEntity:DATA_ELEMENT_LONGTEXT"] = DATA_ELEMENT_LONGTEXT;
}


if(input.compositeEntityAction=='Insert'){
if (input["IS_BUSINESS_KEY"]==""){
input["IS_BUSINESS_KEY"]=null;
input["DATA_TYPE"]='VARCHAR';
input["LENGTH"]=500;
input["UI_VIEW_TYPE"]='TextBox';
}
const dataElementLongtextUuid = uuid();


input['DATA_ELEMENT_LONGTEXT_UUID'] = dataElementLongtextUuid;


    let dataEelemetLongtextArray = [];
    let dataEelemetLongtextObject = {};

    dataEelemetLongtextObject['DATA_ELEMENT_LONGTEXT_UUID'] = dataElementLongtextUuid;
    dataEelemetLongtextObject['DATA_ELEMENT_UUID'] = input['DATA_ELEMENT_UUID'];

    dataEelemetLongtextArray.push(dataEelemetLongtextObject);
    input["AppEngChildEntity:DATA_ELEMENT_LONGTEXT"] = dataEelemetLongtextArray;
}

if(input.compositeEntityAction=='Update'){

if(input['AppEngChildEntity:DATA_ELEMENT_LONGTEXT'] && input['AppEngChildEntity:DATA_ELEMENT_LONGTEXT'][0].DATA_ELEMENT_DEFINITION && input['AppEngChildEntity:DATA_ELEMENT_LONGTEXT'][0].DATA_ELEMENT_LONGTEXT_UUID==null){
  let longtext_uuid=uuid();
  input["DATA_ELEMENT_LONGTEXT_UUID"]=longtext_uuid;
  input['AppEngChildEntity:DATA_ELEMENT_LONGTEXT'][0].DATA_ELEMENT_LONGTEXT_UUID=longtext_uuid;
  
}
}

//logic for insert data
let queryToFetchMasterDatasetMapping = `SELECT * FROM CODE_SET_TRANSACTION_DATA_ELEMENT WHERE DATA_ELEMENT_UUID = :DATA_ELEMENT_UUID AND DATA_SET_UUID = :DATA_SET_UUID AND APPLICATION_UUID = :APP_LOGGED_IN_PROJECT_UUID`;

let queryToFetchDataElementsData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_TENANT", queryToFetchMasterDatasetMapping, input);

if (queryToFetchDataElementsData.length === 0) {
    if (input.compositeEntityAction === 'Update' && input.PRE_DEFINED_DATA === 'Yes' && input.CODE_SET_UUID) {
        let masterDatasetTransactionObject = {
            CODE_SET_UUID: input.CODE_SET_UUID,
            DATA_SET_UUID: input.DATA_SET_UUID,
            DATA_ELEMENT_UUID: input.DATA_ELEMENT_UUID,
            IS_CODE_SET_TRANSACTION_DATA_ELEMENT_ACTIVE:'Yes'
    }
         
        let masterDatasetTransactionArray = [masterDatasetTransactionObject];
        input["AppEngChildEntity:CODE_SET_TRANSACTION_DATA_ELEMENT"] = masterDatasetTransactionArray;
 }
}

//logic for update mapping table
let Update_CODE_SET_List = [];

async function updateData(primarykey, primarykeyvalue, tablename, masterDataSetUUID) {
    let updateTableData = {};
    updateTableData[primarykey] = primarykeyvalue;
    updateTableData['compositeEntityAction'] = "Update";
    updateTableData['CODE_SET_UUID'] = masterDataSetUUID;

    if (tablename === 'CODE_SET_TRANSACTION_DATA_ELEMENT') {
        Update_CODE_SET_List.push(updateTableData);
    }
}

if (input.compositeEntityAction === 'Update' && input.PRE_DEFINED_DATA === 'Yes') {
    let QuerytoFetchmasterdata = 'SELECT * FROM CODE_SET_TRANSACTION_DATA_ELEMENT WHERE DATA_ELEMENT_UUID=:DATA_ELEMENT_UUID';
    let QuerytoFetchDataElementsData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_TENANT", QuerytoFetchmasterdata, input);
    let QuerytoFetchmasterdataRecords = JSON.parse(JSON.stringify(QuerytoFetchDataElementsData));

    if (QuerytoFetchmasterdataRecords.length > 0) {
        for (let record of QuerytoFetchmasterdataRecords) {
            updateData(
                'CODE_SET_TRANSACTION_DATA_ELEMENT_UUID',
                record.CODE_SET_TRANSACTION_DATA_ELEMENT_UUID,
                'CODE_SET_TRANSACTION_DATA_ELEMENT',
                input.CODE_SET_UUID
            );
        }

        input["AppEngChildEntity:CODE_SET_TRANSACTION_DATA_ELEMENT"] = Update_CODE_SET_List;
    }
}

// logic for delete
let delete_CODE_SET_List = [];
 
async function deleteDataMaster(primarykey, primarykeyvalue, tablename, releaseName) {
    let deleteTableData = {};
    deleteTableData[primarykey] = primarykeyvalue;
    deleteTableData['compositeEntityAction'] = "Delete";
    deleteTableData["CONFIG_RELEASE_NAME"] = releaseName;
 
    if (tablename === 'CODE_SET_TRANSACTION_DATA_ELEMENT') {
        delete_CODE_SET_List.push(deleteTableData);
    }
}
 
if (input.compositeEntityAction === 'Update' && input.PRE_DEFINED_DATA === 'No') {
    let QuerytoFetchmasterdata = 'SELECT * FROM CODE_SET_TRANSACTION_DATA_ELEMENT WHERE DATA_ELEMENT_UUID=:DATA_ELEMENT_UUID';
    let QuerytoFetchDataElementsData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_TENANT", QuerytoFetchmasterdata, input);
    let QuerytoFetchmasterdataRecords = JSON.parse(JSON.stringify(QuerytoFetchDataElementsData));
    console.log('hello',QuerytoFetchmasterdataRecords);
 
    for (let record of QuerytoFetchmasterdataRecords) {
        deleteDataMaster(
            'CODE_SET_TRANSACTION_DATA_ELEMENT_UUID',
            record.CODE_SET_TRANSACTION_DATA_ELEMENT_UUID,
            'CODE_SET_TRANSACTION_DATA_ELEMENT',
            input.CONFIG_RELEASE_NAME
        );
    }
    input["AppEngChildEntity:CODE_SET_TRANSACTION_DATA_ELEMENT"] = delete_CODE_SET_List;
}