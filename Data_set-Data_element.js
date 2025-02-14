let dataSetGroupTreeList = [];
const UI_ELEMENT = [];

function updateDataSetNameTitle(dataSetJsonTree) {
  console.log(dataSetJsonTree)
  for (let i = 0; i < dataSetJsonTree.length; i++) {
    if (dataSetJsonTree[i].primaryKey == input['DATA_SET_UUID'] && dataSetJsonTree[i].className == "DATA_SET") {
      dataSetJsonTree[i].title = input['DATA_SET_NAME']
    }
    if (dataSetJsonTree[i].children) {
      updateDataSetNameTitle(dataSetJsonTree[i].children);
    }
  }
  return JSON.stringify(dataSetJsonTree);
}

if (input.compositeEntityAction == 'Insert') {
    // const data_Element = {};
    // const data_ElementList = [];

    // let dataElement_UUID = uuid();
    // data_Element["DATA_ELEMENT_UUID"] = dataElement_UUID;
    // data_Element["DATA_ELEMENT_NAME"] = input.DATA_SET_NAME + ' ID';
    // data_Element["DATA_SET_UUID"] = input.DATA_SET_UUID;
    // data_Element["IS_UNIQUE_KEY"] = 'Yes';
    // data_Element["IS_BUSINESS_KEY"] = null;
    // data_Element["IS_VALUE_ALWAYS_REQUIRED"] = 'Yes';
    // data_Element["PRE_DEFINED_DATA"] = 'No';
    // data_Element["DATA_TYPE"] = 'NUMBER';
    // data_Element["DATA_KEY"] = 'AUTO_INCREMENT_UNIQUE_KEY';
    // data_Element["UI_VIEW_TYPE"] = 'TextBox';
    // data_Element["LENGTH"] = 9;

    // data_ElementList.push(data_Element);
    // input["AppEngChildEntity:DATA_ELEMENT"] = data_ElementList;

}

if (input.compositeEntityAction == 'Update') {
    let dataElementList = [];
    let dataElementQuery = `SELECT * FROM DATA_ELEMENT WHERE DATA_SET_UUID=:DATA_SET_UUID AND DATA_KEY='AUTO_INCREMENT_UNIQUE_KEY' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID UNION SELECT * FROM DATA_ELEMENT WHERE PARENT_DATA_SET_UUID=:DATA_SET_UUID AND DATA_KEY='FOREIGN_KEY' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`
    let dataElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", dataElementQuery, input);

    if (dataElementQueryData && dataElementQueryData.length) {
        for (let i = 0; i < dataElementQueryData.length; i++) {
            let dataElementObject = {};
            dataElementObject['DATA_SET_UUID'] = dataElementQueryData[i].DATA_SET_UUID;
            dataElementObject['DATA_ELEMENT_UUID'] = dataElementQueryData[i].DATA_ELEMENT_UUID;
            dataElementObject['DATA_ELEMENT_NAME'] = input.DATA_SET_NAME + " ID";
            dataElementList.push(dataElementObject)
        }
    }
    input["AppEngChildEntity:DATA_ELEMENT"] = dataElementList;

    const dataSetGroupQuery = "SELECT DATA_SET_GROUP_UUID From DATA_SET_GROUP_DATA_SET_MAPPING where DATA_SET_UUID=:DATA_SET_UUID";
    let dataSetGroupQueryData = JSON.parse(JSON.stringify(await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", dataSetGroupQuery, input)));

    for (let dataSetGroup of dataSetGroupQueryData) {
      const dataSetGroupTreeQuery = `SELECT DATA_SET_GROUP_TREE_UUID,DATA_SET_GROUP_TREE_JSON from DATA_SET_GROUP_TREE where DATA_SET_GROUP_UUID in (${"'" + dataSetGroup['DATA_SET_GROUP_UUID'] + "'"})`;
      let dataSetGroupTreeQueryData = JSON.parse(JSON.stringify(await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", dataSetGroupTreeQuery, input)));
  
      for (let DataSetGroupTreeData of dataSetGroupTreeQueryData) {
        let dataSetJsonTree = JSON.parse(DataSetGroupTreeData.DATA_SET_GROUP_TREE_JSON);
        if (dataSetJsonTree !== null) {
          let object = {};
          let updatedTreeJson = updateDataSetNameTitle(dataSetJsonTree);
          object["DATA_SET_GROUP_TREE_UUID"] =  DataSetGroupTreeData.DATA_SET_GROUP_TREE_UUID;
          object["DATA_SET_GROUP_UUID"] = dataSetGroup["DATA_SET_GROUP_UUID"];
          object["DATA_SET_GROUP_TREE_JSON"] =  updatedTreeJson;
          dataSetGroupTreeList.push(object);
        }
      }
    }
    console.log(dataSetGroupTreeList)
    input["AppEngChildEntity:DATA_SET_GROUP_TREE"] = dataSetGroupTreeList;
    
}

let DATA_SET = [];
let DATA_ELEMENT = [];
let DATA_ELEMENT_LONGTEXT = [];
let CODE_SET_TRANSACTION_DATA_ELEMENTS = [];

function deleteRecord(primarykey, primarykeyvalue, tablename, functionalareauuid) {

    let deleteTableData = {};

    deleteTableData[primarykey] = primarykeyvalue;
    deleteTableData["compositeEntityAction"] = "Delete";
    deleteTableData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;
    
    if (tablename == 'DATA_SET') {
        DATA_SET.push(deleteTableData);
    } else if (tablename == 'DATA_ELEMENT') {
        DATA_ELEMENT.push(deleteTableData);
    } else if (tablename == 'DATA_ELEMENT_LONGTEXT') {
        DATA_ELEMENT_LONGTEXT.push(deleteTableData);
    } else if (tablename == 'CODE_SET_TRANSACTION_DATA_ELEMENT') {
        CODE_SET_TRANSACTION_DATA_ELEMENTS.push(deleteTableData);
    }
}

if (input.compositeEntityAction == 'Delete') {
    deleteRecord('DATA_SET_UUID', input['DATA_SET_UUID'], 'DATA_SET', input['APP_LOGGED_IN_FUNTIONAL_AREA_ID']);

    let QuerytoFetchDataElements = 'select DATA_ELEMENT_UUID from DATA_ELEMENT where DATA_SET_UUID=:DATA_SET_UUID';
    let QuerytoFetchDataElementsData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", QuerytoFetchDataElements, input);
    let QuerytoFetchDataElementsRecords = JSON.parse(JSON.stringify(QuerytoFetchDataElementsData));

    for (let key in QuerytoFetchDataElementsRecords) {
        deleteRecord('DATA_ELEMENT_UUID', QuerytoFetchDataElementsRecords[key].DATA_ELEMENT_UUID, 'DATA_ELEMENT', input['APP_LOGGED_IN_FUNTIONAL_AREA_ID']);

        input.DATA_ELEMENT_UUID = QuerytoFetchDataElementsRecords[key].DATA_ELEMENT_UUID;

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
    }

    if (input.UI_ELEMENT_EXISTS && input.UI_ELEMENT_EXISTS === 'Yes') {
      const queryForUIElement = `SELECT UI_ELEMENT_UUID, DATA_SET_UUID, DATA_ELEMENT_UUID FROM UI_ELEMENT WHERE DATA_SET_UUID = '${input.DATA_SET_UUID}'`;
      const queryForUIElementData = await serviceOrchestrator.selectRecordsUsingQuery(
        'PRIMARYSPRINGFM',
        queryForUIElement,
        input
      );

      for (const uiElementData of queryForUIElementData) {
        const obj = { ...uiElementData };
        obj.DATA_SET_UUID = '';
        obj.DATA_ELEMENT_UUID = '';
        obj.compositeEntityAction = 'Update';
        UI_ELEMENT.push(obj);
      }

      input['AppEngChildEntity:UI_ELEMENT'] = UI_ELEMENT;
    }
    
    input["AppEngChildEntity:DATA_SET"] = DATA_SET;
    input["AppEngChildEntity:DATA_ELEMENT"] = DATA_ELEMENT;
    input["AppEngChildEntity:CODE_SET_TRANSACTION_DATA_ELEMENT"] = CODE_SET_TRANSACTION_DATA_ELEMENTS;
    input["AppEngChildEntity:DATA_ELEMENT_LONGTEXT"] = DATA_ELEMENT_LONGTEXT;
}