console.log('::::::::::::::::', input);

let configprivilegeList = [];
let configpropertyList = [];
let configrelationList = [];
let configItemList = [];
let configOrderList = [];
let order = ['ADD_FORM', 'EDIT_FORM'].includes(input.DATA_SET_UI_VIEW_TYPE) ? 1 : ['DATAGRID'].includes(input.DATA_SET_UI_VIEW_TYPE) ? 5 : 1;
let uiComponentOrderPropertyQueryRecords = [];
let primaryKeyString = '';

// Function to update the config item property 
function updateConfigItemProperty(list, property) {
    for (let key in property) {
        for (let data of list) {
            if (data.PROPERTYNAME === key && data.PROPERTYVALUE != property[key]) {
                const configproperty = {};
                configproperty["PROPERTYID"] = data.PROPERTYID;
                configproperty["PROPERTYNAME"] = data.PROPERTYNAME;
                configproperty["PROPERTYVALUE"] = property[key]
                configproperty["ITEMID"] = data.ITEMID;
                configpropertyList.push(configproperty);
            }
        }
    }
}

// manululate the orders 
function arrangePropertyDetails() {
    let getUIComponentOrderPropertyQueryRecords = [];
    if (primaryKeyStr.length > 0) {
        let mergeUIComponentOrderPropertyQueryRecords = getUIComponentOrderPropertyQueryRecords.concat(uiComponentOrderPropertyQueryRecords);
        let updatedPropertyList = [];
        for (let i of mergeUIComponentOrderPropertyQueryRecords) {
            for (let j of configOrderList) {
                if (i.ITEMID === j.ITEMID) {
                    const configproperty = {};
                    configproperty["PROPERTYID"] = i.PROPERTYID;
                    configproperty["PROPERTYNAME"] = j.PROPERTYNAME;
                    configproperty["PROPERTYVALUE"] = j.PROPERTYVALUE;
                    configproperty["ITEMID"] = j.ITEMID;
                    updatedPropertyList.push(configproperty);
                }
            }
        }
        configpropertyList = configpropertyList.concat(updatedPropertyList);
    }
}
// recalculate the order based on the tree node
function recalculateOrderPosition(obj, order) {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            if (Array.isArray(obj[key])) {
                for (let i = 0; i < obj[key].length; i++) {
                    recalculateOrderPosition(obj[key][i], i + 1);
                }
            } else {
                recalculateOrderPosition(obj[key], order++);
            }
        } else {
            let propertyDetails = {};
            if ('level' === key && obj[key] == 1) {
                if (obj.className === 'DATAGRID_COLUMN') {
                    propertyDetails["ITEMID"] = obj.dataGridColumnId;
                    propertyDetails["PROPERTYNAME"] = 'HEADER_ORDER'
                    propertyDetails["PROPERTYVALUE"] = order;
                    configOrderList.push(propertyDetails);
                    primaryKeyString = primaryKeyString + "'" + obj.dataGridColumnId + "',";
                }
            } else if ('level' === key && obj[key] !== 1) {
                if (obj.className === 'MAIN_FORMFIELD' || obj.className === 'LONGTEXT_FORMFIELD') {
                    propertyDetails["ITEMID"] = obj.formFieldId;
                    propertyDetails["PROPERTYNAME"] = 'ORDER'
                    propertyDetails["PROPERTYVALUE"] = order;
                    configOrderList.push(propertyDetails);
                    primaryKeyString = primaryKeyString + "'" + obj.formFieldId + "',";
                }
            }
        }
    }
}


async function updateTreeData(fetchDataSetUiComponentQueryData) {
    if (fetchDataSetUiComponentQueryData && Object.keys(fetchDataSetUiComponentQueryData).length) {
        let fetchDataSetUiComponentTreeQuery = `SELECT * FROM DATA_SET_UI_VIEW_TREE WHERE DATA_SET_UI_VIEW_UUID in(${"'" + fetchDataSetUiComponentQueryData.DATA_SET_UI_VIEW_UUID + "'"}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let fetchDataSetUiComponentTreeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFO_APPS", fetchDataSetUiComponentTreeQuery, input);

        if (fetchDataSetUiComponentTreeQueryData && Object.keys(fetchDataSetUiComponentTreeQueryData).length) {
            let dataSetUicomponentTreeObject = {};
            dataSetUicomponentTreeObject['DATA_SET_UI_VIEW_TREE_UUID'] = fetchDataSetUiComponentTreeQueryData.DATA_SET_UI_VIEW_TREE_UUID;
            dataSetUicomponentTreeObject['DATA_SET_UI_VIEW_TREE_JSON'] = JSON.stringify(input.modifiedTreeData);
            // update the alternate data set ui component 
            await serviceOrchestrator.update('DATA_SET_UI_VIEW_TREE', dataSetUicomponentTreeObject, 'INFO_APPS', 'DATA_SET_UI_VIEW_TREE_UUID', 'KNEX_DYNAMIC');
        }
    }
}

if (input.compositeEntityAction === 'Update') {
    let fetchFormSectionQuery = `SELECT CHILDITEMID as ITEMID FROM CONFIGITEMRELATION where RELATIONTYPE = 'Form_FormSection' AND PARENTITEMID =:DATA_SET_UI_VIEW_CONFIG_ITEM_ID`;
    let fetchFormSectionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", fetchFormSectionQuery, input);
    if (fetchFormSectionQueryData && Object.keys(fetchFormSectionQueryData).length) {
        // Firing the query to get the expand column properties
        let getPropertyQuery = `SELECT PROPERTYID, PROPERTYNAME, PROPERTYVALUE, ITEMID, ISDELETED FROM CONFIGITEMPROPERTY where ITEMID= ${"'" + fetchFormSectionQueryData.ITEMID + "'"} and PROPERTYNAME='COMPONENT_PER_ROW'`;
        let getPropertyQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", getPropertyQuery, input);
        if (getPropertyQueryData && getPropertyQueryData.length) {
            // Modifying the properties
            updateConfigItemProperty(getPropertyQueryData, { "COMPONENT_PER_ROW": input['COMPONENT_PER_ROW'] });
        }
        let fetchDataSetUiComponentQuery = `SELECT * FROM DATA_SET_UI_VIEW WHERE DATA_SET_UI_VIEW_TYPE in('ADD_FORM','EDIT_FORM') AND DATA_SET_UI_VIEW_CONFIG_ITEM_ID not in(:DATA_SET_UI_VIEW_CONFIG_ITEM_ID) AND DATA_SET_UUID=:DATA_SET_UUID`;
        let fetchDataSetUiComponentQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFO_APPS", fetchDataSetUiComponentQuery, input);
        if (fetchDataSetUiComponentQueryData && Object.keys(fetchDataSetUiComponentQueryData).length) {
            let dataSetUicomponentObject = {};
            dataSetUicomponentObject['DATA_SET_UI_VIEW_UUID'] = fetchDataSetUiComponentQueryData.DATA_SET_UI_VIEW_UUID;
            dataSetUicomponentObject['COMPONENT_PER_ROW'] = input['COMPONENT_PER_ROW']
            // update the alternate data set ui component 
            await serviceOrchestrator.update('DATA_SET_UI_VIEW', dataSetUicomponentObject, 'INFO_APPS', 'DATA_SET_UI_VIEW_UUID', 'KNEX_DYNAMIC');
        }
    }
} else if (input.actionName === 'MoveNode') {
    // Recalculate the form field and datagrid order 
    recalculateOrderPosition(input.modifiedTreeData, order);

    // Fetch the existing property of formfield and datagrid column
    primaryKeyStr = primaryKeyString.substring(0, primaryKeyString.length - 1);
    if (primaryKeyStr.length > 0) {
        const uiComponentPropertyQuery = `select PROPERTYID,PROPERTYNAME,PROPERTYVALUE,ITEMID from CONFIGITEMPROPERTY where ITEMID in(${primaryKeyStr}) and PROPERTYNAME in('ORDER','HEADER_ORDER')`;
        let uiComponentPropertyQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", uiComponentPropertyQuery, input);
        uiComponentOrderPropertyQueryRecords = JSON.parse(JSON.stringify(uiComponentPropertyQueryData));
    }

    if (['ADD_FORM', 'EDIT_FORM'].includes(input.DATA_SET_UI_VIEW_TYPE)) {
        let fetchDataSetUiComponentQuery = `SELECT * FROM DATA_SET_UI_VIEW WHERE DATA_SET_UI_VIEW_TYPE in('ADD_FORM','EDIT_FORM') AND DATA_SET_UI_VIEW_CONFIG_ITEM_ID not in(:DATA_SET_UI_VIEW_CONFIG_ITEM_ID) AND DATA_SET_UUID=:DATA_SET_UUID AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID `;
        let fetchDataSetUiComponentQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFO_APPS", fetchDataSetUiComponentQuery, input);

        if (fetchDataSetUiComponentQueryData && Object.keys(fetchDataSetUiComponentQueryData).length) {
            let fetchDataSetUiComponentTreeQuery = `SELECT * FROM DATA_SET_UI_VIEW_TREE WHERE DATA_SET_UI_VIEW_UUID in(${"'" + fetchDataSetUiComponentQueryData.DATA_SET_UI_VIEW_UUID + "'"}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID `;
            let fetchDataSetUiComponentTreeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFO_APPS", fetchDataSetUiComponentTreeQuery, input);

            if (fetchDataSetUiComponentTreeQueryData && Object.keys(fetchDataSetUiComponentTreeQueryData).length) {
                let dataSetUicomponentTreeObject = {};
                dataSetUicomponentTreeObject['DATA_SET_UI_VIEW_TREE_UUID'] = fetchDataSetUiComponentTreeQueryData.DATA_SET_UI_VIEW_TREE_UUID;
                dataSetUicomponentTreeObject['DATA_SET_UI_VIEW_TREE_JSON'] = JSON.stringify(input.modifiedTreeData);
                // update the alternate data set ui component 
                await serviceOrchestrator.update('DATA_SET_UI_VIEW_TREE', dataSetUicomponentTreeObject, 'INFO_APPS', 'DATA_SET_UI_VIEW_TREE_UUID', 'KNEX_DYNAMIC');
            }
        }
    }
    arrangePropertyDetails();
} else if (input.compositeEntityAction === 'ModalSave') {
    if (['ADD_FORM', 'EDIT_FORM'].includes(input.DATA_SET_UI_VIEW_TYPE)) {
        // fetch the alternate data set ui component 
        let fetchDataSetUiComponentQuery = `SELECT * FROM DATA_SET_UI_VIEW WHERE DATA_SET_UI_VIEW_TYPE in('ADD_FORM','EDIT_FORM') AND DATA_SET_UI_VIEW_CONFIG_ITEM_ID not in(:DATA_SET_UI_VIEW_CONFIG_ITEM_ID) AND DATA_SET_UUID=:DATA_SET_UUID`;
        let fetchDataSetUiComponentQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFO_APPS", fetchDataSetUiComponentQuery, input);

        // the below if block will execute when user change the component per row
        if (["FORM_CONTAINER"].includes(input.ITEM_CLASS)) {
            let fetchFormChildQuery = `SELECT CHILDITEMID as ITEMID FROM CONFIGITEMRELATION where RELATIONTYPE = 'Form_FormSection' AND PARENTITEMID =:DATA_SET_UI_VIEW_CONFIG_ITEM_ID`;
            let fetchFormChildQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", fetchFormChildQuery, input);
            input['COMPONENT_PER_ROW'] = input?.nodeDetails?.componentPerRow;

            if (fetchFormChildQueryData && fetchFormChildQueryData.length) {
                let itemList = fetchFormChildQueryData.map((item) => `${"'" + item.ITEMID + "'"}`).join(",");

                let fetchFormSectionQuery = `SELECT ITEMID FROM CONFIGITEM where ITEMID in(${itemList}) and ITEMNAME not in('ATTACHMENT') AND PROJECTID=:PROJECTID`;
                let fetchFormSectionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", fetchFormSectionQuery, input);

                // Firing the query to fetch the existing property of form section
                let getPropertyQuery = `SELECT PROPERTYID, PROPERTYNAME, PROPERTYVALUE, ITEMID, ISDELETED FROM CONFIGITEMPROPERTY where ITEMID= ${"'" + fetchFormSectionQueryData.ITEMID + "'"} and PROPERTYNAME='COMPONENT_PER_ROW'`;

                let getPropertyQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", getPropertyQuery, input);
                if (getPropertyQueryData && getPropertyQueryData.length) {
                    // Modifying the properties
                    updateConfigItemProperty(getPropertyQueryData, { "COMPONENT_PER_ROW": input?.nodeDetails?.componentPerRow });
                }
                if (fetchDataSetUiComponentQueryData && Object.keys(fetchDataSetUiComponentQueryData).length) {
                    let dataSetUicomponentObject = {};
                    dataSetUicomponentObject['DATA_SET_UI_VIEW_UUID'] = fetchDataSetUiComponentQueryData.DATA_SET_UI_VIEW_UUID;
                    dataSetUicomponentObject['COMPONENT_PER_ROW'] = input?.nodeDetails?.componentPerRow;
                    // update the alternate data set ui component 
                    await serviceOrchestrator.update('DATA_SET_UI_VIEW', dataSetUicomponentObject, 'INFO_APPS', 'DATA_SET_UI_VIEW_UUID', 'KNEX_DYNAMIC');
                }
            }
            if (input.isColSpanGreater && input.formFieldIdList && input.formFieldIdList.length) {
                let itemList = input.formFieldIdList.map((item) => `${"'" + item.id + "'"}`).join(",");
                // Firing the query to fetch the existing property of form field
                let getPropertyQuery = `SELECT PROPERTYID, PROPERTYNAME, PROPERTYVALUE, ITEMID, ISDELETED FROM CONFIGITEMPROPERTY where ITEMID in(${itemList}) and PROPERTYNAME='COLSPAN'`;

                let getPropertyQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", getPropertyQuery, input);
                if (getPropertyQueryData && getPropertyQueryData.length) {
                    // Modifying the properties
                    updateConfigItemProperty(getPropertyQueryData, { "COLSPAN": input?.nodeDetails?.componentPerRow });
                }
                let dataElementList = [];
                for (let formFielditem of input.formFieldIdList) {
                    let dataElementObject = {};
                    dataElementObject['DATA_ELEMENT_UUID'] = formFielditem.primaryKey;
                    dataElementObject['COLSPAN'] = input?.nodeDetails?.componentPerRow
                    dataElementList.push(dataElementObject);
                }
                input["AppEngChildEntity:DATA_ELEMENT"] = dataElementList;
            }
        } else if (["MAIN_FORMFIELD", "LONGTEXT_FORMFIELD"].includes(input.ITEM_CLASS) && input && input.nodeDetails && input.nodeDetails.formFieldId) { //this below else if block will execute when user change the colspan
            // Firing the query to fetch the existing property of form field
            let getPropertyQuery = `SELECT PROPERTYID, PROPERTYNAME, PROPERTYVALUE, ITEMID, ISDELETED FROM CONFIGITEMPROPERTY where ITEMID= ${"'" + input.nodeDetails.formFieldId + "'"} and PROPERTYNAME='COLSPAN'`;

            let getPropertyQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", getPropertyQuery, input);
            if (getPropertyQueryData && getPropertyQueryData.length) {
                // Modifying the properties
                updateConfigItemProperty(getPropertyQueryData, { "COLSPAN": input?.nodeDetails?.colspan });
            }
            let dataElementList = [];
            if (input.nodeDetails.primaryKey) {
                let dataElementObject = {};
                dataElementObject['DATA_ELEMENT_UUID'] = input.nodeDetails.primaryKey;
                dataElementObject['COLSPAN'] = input?.nodeDetails?.colspan;
                dataElementList.push(dataElementObject);
            }
            input["AppEngChildEntity:DATA_ELEMENT"] = dataElementList;
        }
        await updateTreeData(fetchDataSetUiComponentQueryData)
    }
}

input["AppEngChildEntity:CONFIGITEMPROPERTY"] = configpropertyList;