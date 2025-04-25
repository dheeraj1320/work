let RoleQuery = `Select ROLE_ID From ROLE where AE_APPLICATION_UUID=:AE_APPLICATION_UUID`;
let RoleData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_AUTHORIZATION", RoleQuery, input);

let privilegeArray = {};
let viewPrivilegeArray = {};

RoleData.forEach(role => {
    privilegeArray[role.ROLE_ID] = "EDIT";
    viewPrivilegeArray[role.ROLE_ID] = "VIEW";
});

privilegeArray[1] = "NO PRIVILEGE";
privilegeArray[2] = "NO PRIVILEGE";
viewPrivilegeArray[1] = "NO PRIVILEGE";
viewPrivilegeArray[2] = "NO PRIVILEGE";

let entity_name = replaceSpaceAndMakeUpperCaseString(input.DATA_SET_NAME);

const createColumnDetails = (element, isLongText = false) => ({
    dbCode: replaceSpaceAndMakeUpperCaseString(element.DATA_ELEMENT_NAME),
    type: element.DATA_TYPE || 'VARCHAR',
    length: element.PRE_DEFINED_DATA === 'Yes' ? 50 : element.DATA_TYPE == 'TIMESTAMP'? 3 : (element.LENGTH || 1024),
    isunique: element.IS_UNIQUE_KEY,
    isRequired: element.IS_VALUE_ALWAYS_REQUIRED,
    data_col_key: element.DATA_KEY,
    ...(isLongText ? {} : { isLongText: false })
});

// Convert string into camel case
function camelCaseString(stringData) {
    let toLowerDStringData = stringData.toLowerCase();
    const words = toLowerDStringData.split("_");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0] ? words[i][0].toUpperCase() + words[i].substr(1) : "";
    }
    return words.join(' ')
}

// function for creating physical entity query
function queryConverter(dataObject, isLongTextDataExist) {
    let object = {};
    let data_for_queriesColumnList = dataObject.COLUMN_LIST;
    let temp = dataObject.COLUMN_LIST;
    let updateTemp = dataObject.COLUMN_LIST;
    temp = temp.map(i => {
        if (i === 'AE_INSERT_ID') {
            return ':APP_LOGGED_IN_USER_ID';
        } else {
            return ':' + i;
        }
    });

    updateTemp = updateTemp.map(i => {
        if (i === 'AE_UPDATE_ID') {
            return ':APP_LOGGED_IN_USER_ID';
        } else {
            return ':' + i;
        }
    });

    object['Insert'] = 'INSERT INTO ' + dataObject.TABLE_NAME + ' (' + data_for_queriesColumnList.join(",") + ')' + ' VALUES ' + '(' + temp + ')';

    let updateColumnArray = []
    for (let i = 0; i < data_for_queriesColumnList.length; i++) {
        for (let j = 0; j < updateTemp.length; j++) {
            if (i == j) {
                updateColumnArray.push(data_for_queriesColumnList[i] + '=' + updateTemp[j]);
            }
        }
    }

    object['Update'] = 'UPDATE ' + dataObject.TABLE_NAME + ' SET ' + updateColumnArray.join(",") + ' WHERE ' + dataObject.PRIMARY_DBCODE + '=:' + dataObject.PRIMARY_DBCODE;

    if (isLongTextDataExist && dataObject.SEQUENCE_PRIMARY_DBCODE) {
        object['Sequence'] = 'UUID:' + dataObject.SEQUENCE_PRIMARY_DBCODE + 'sEpArAtOrSEQ_TABLE:' + dataObject.TABLE_NAME + '~' + dataObject.INCREMENTAL_UUID;
        object['Delete'] = 'DELETE FROM ' + dataObject.TABLE_NAME + ' WHERE ' + dataObject.SEQUENCE_PRIMARY_DBCODE + '=:' + dataObject.SEQUENCE_PRIMARY_DBCODE;
    } else {
        object['Sequence'] = 'UUID:' + dataObject.PRIMARY_DBCODE + 'sEpArAtOrSEQ_TABLE:' + dataObject.TABLE_NAME + '~' + dataObject.INCREMENTAL_UUID;
        object['Delete'] = 'DELETE FROM ' + dataObject.TABLE_NAME + ' WHERE ' + dataObject.PRIMARY_DBCODE + '=:' + dataObject.PRIMARY_DBCODE;
    }

    object['Select'] = 'SELECT ' + data_for_queriesColumnList.join(",") + ' FROM ' + dataObject.TABLE_NAME + ' WHERE ' + dataObject.PRIMARY_DBCODE + '=:' + dataObject.PRIMARY_DBCODE;

    return object;
}

// function to create the physical entity
function createPhysicalEntity(entityName, logicalEntityConfigId, tableDataObject, isLongTextDataExist, schemaname, mainDataSource, auditDataSource) {
    let singleSelectQuery;
    let queryObj = queryConverter(tableDataObject, isLongTextDataExist);
    //Create the config item
    let physicalEntity_configitem = createConfigItem(entityName, 'PhysicalEntity', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    singleSelectQuery = queryObj.Select;
    // Create the config property
    propertyObject = {
        "IS_EXPRESSION_AVAILABLE": 0,
        "IS_MULITIVALUE_MAPPING_ADS": 0,
        "IS_PRIMARY_ENTITY": 1,
        "ORDER": 5,
        "SCHEMA_NAME": schemaname.PROPERTYVALUE,
        "DBTYPENAME": entityName,
        "DATASOURCE_ID": mainDataSource.ITEMID,
        "AUDIT_DATASOURCE_ID": auditDataSource.ITEMID,
        "INSERT_QID": queryObj.Insert,
        "UPDATE_QID": queryObj.Update,
        "SEQUENCE_QID": queryObj.Sequence,
        "SINGLE_SELECT_QID": queryObj.Select,
        "DELETE_QID": queryObj.Delete,
        "IS_AUDIT_REQUIRED": "1",
        "MULTI_SELECT_QID": isLongTextDataExist ? queryObj.Select : null
    }

    let physicalEntity_configproperty = createConfigItemProperty(propertyObject, physicalEntity_configitem);

    //Create Physical entity relation with logical entity
    createConfigItemRelation(logicalEntityConfigId, "LogicalEntity_PhysicalEntity", physicalEntity_configitem);

    return [physicalEntity_configitem, singleSelectQuery];
}

// function to create the physical column
function createPhysicalColumn(physicalEntityConfigId, tablelist, entity_name) {
    //Create other Physical Column 
    if (tablelist.length) {
        for (let i = 0; i < tablelist.length; i++) {
            //Create config item-
            let physicalcolumn_configitem = createConfigItem(tablelist[i].dbCode, 'PhysicalColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
            // Create the config property
            let physicalcolumn_propertyArray = {
                "LENGTH": tablelist[i].length,
                "DATATYPE": tablelist[i].type,
                "ISPRIMARYKEY": tablelist[i].dbCode === entity_name + '_UUID' ? 1 : 0,
                "DBCODE": tablelist[i].dbCode,
                "IS_MANDATORY": tablelist[i].isRequired == 'Yes' ? 1 : 0
            };

            let physicalColumn_configproperty = createConfigItemProperty(physicalcolumn_propertyArray, physicalcolumn_configitem);

            // Create the config relation
            createConfigItemRelation(physicalEntityConfigId, "PhysicalEntity_PhysicalColumn", physicalcolumn_configitem);
        }
    }
}

function createDataBaseValidation(item, logicalcolumn_configitemId, entity_name,mainDataSource) {
    //Create config item for DBValidation-
    let dbValidation_configitemId = createConfigItem(camelCaseString(item.dbCode), 'DatabaseValidation', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    let validationKey = 'EXISTING_' + item.dbCode + '_COUNT';
    // Create the config property for DBValidation   
    dbValidation_propertyObject = {
        "MODE": 'BOTH',
        "DATASOURCE_ID": mainDataSource.ITEMID,
        "VALIDATION_TYPE": 'Warning',
        "VALIDATION_EXPRESSION": '#{EXISTING_' + item.dbCode + '_COUNT ==' + 0 + '}',
        "VALIDATION_QID": 'SELECT COUNT(*) AS ' + validationKey + ' FROM ' + entity_name + ' WHERE ' + item.dbCode + '=:' + item.dbCode + ' and ' + entity_name + '_UUID' + '!=' + 'COALESCE(:' + entity_name + '_UUID,' + 0 + ')',
        "VALIDATION_MSG": camelCaseString(item.dbCode) + ' Already Exist.',
        "VALIDATION_EXPRESSION_KEYS": validationKey,
        "IS_CONDITION_AVAILABLE": 0
    };

    let dbValidation_configproperty = createConfigItemProperty(dbValidation_propertyObject, dbValidation_configitemId);

    // Create the config Parent relation for DBValidation        
    createConfigItemRelation(logicalcolumn_configitemId, "LogicalColumn_ValidationObject", dbValidation_configitemId);
}

// function to create the logical column
function createLogicalColumn(logicalEntityConfigId, tablelist, entity_name, constraintDetails,mainDataSource) {
    let logicalColumnDetails = {};
    //Create other config item
    if (tablelist.length) {
        for (let i = 0; i < tablelist.length; i++) {
            //Create config item for Logical Column-
            let logicalcolumn_configitemId = createConfigItem(tablelist[i].dbCode, 'LogicalColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
            let dbColumn = tablelist[i].dbCode;
            logicalColumnDetails[dbColumn] = logicalcolumn_configitemId;

            // Create the config property for Logical Column
            let propertyObject = {
                "LENGTH": tablelist[i].length,
                "DATATYPE": tablelist[i].type,
                "ISPRIMARYKEY": tablelist[i].dbCode === entity_name + '_UUID' ? 1 : 0,
                "DBCODE": tablelist[i].dbCode,
                "IS_MANDATORY": constraintDetails[tablelist[i].dbCode] ? 0 : tablelist[i].isRequired == 'Yes' ? 1 : 0,
                "IS_UNIQUE": tablelist[i].isunique ? 1 : 0
            };

            let logicalColumn_configproperty = createConfigItemProperty(propertyObject, logicalcolumn_configitemId);

            // Create the config relation for Logical Column
            createConfigItemRelation(logicalEntityConfigId, "LogicalEntity_LogicalColumn", logicalcolumn_configitemId);

            // Create Validation if IsUnique is true-
            if (tablelist[i].isunique == 'Yes' && !tablelist[i]['data_col_key']) {
                createDataBaseValidation(tablelist[i], logicalcolumn_configitemId,entity_name,mainDataSource);
            }
        }
    }
    return logicalColumnDetails;
}

// function to create the form section for add and edit form
function createFormSection(entityName, componentPerRow) {
    //Create the config item
    let formSection_configitemId = createConfigItem(entityName, 'FormSection', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    // Create the config property
    propertyObject = { "HEADER_LABEL": '', "COMPONENT_PER_ROW": componentPerRow, "ORDER": entityName == 'ATTACHMENT' ? 10 : 5, "IS_EXPRESSION_AVAILABLE": 0, "IS_RENDER_ON_REPEAT": 0, "TAB_GROUP": entityName == 'ATTACHMENT' && input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' ? 'Attachment' : input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' && entityName != 'ATTACHMENT' ? input.DATA_SET_NAME : null }

    let formSection_configproperty = createConfigItemProperty(propertyObject, formSection_configitemId);

    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, formSection_configitemId);

    return formSection_configitemId;
}

// function to create form
function createForm(type, entityName, formSectionId, logicalEntityConfigId, formType, isRepetable) {

    //Create the config item
    let form_configitemId = createConfigItem(type + ' ' + entityName + ' [(SUB PAGE)(SYSTEM)]', 'Form', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    let decideLable = type == 'Add' ? type : 'View/Edit'
    // Create the config property
    propertyObject = {
        "FORM_LABEL": decideLable + ' ' + entityName,
        "FORM_TYPE": "insertForm",
        "ORDER": 5,
        "IS_TAB_REQUIRED_IN_FORMSECTION": input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' && formType == 'Main' ? 1 : 0,
        "IS_FORM_REPEATABLE": isRepetable == 'repeatable' ? 1 : 0,
        "ADD_ALLOWED": isRepetable == 'repeatable' ? 1 : 0,
        "IS_TAB_REQUIRED_IN_FORMSECTION": isRepetable == 'repeatable' ? 1 : 0,
    }

    let form_configproperty = createConfigItemProperty(propertyObject, form_configitemId);

    //Create the config relation
    createConfigItemRelation(form_configitemId, "Form_LogicalEntity", logicalEntityConfigId);

    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, form_configitemId);

    // Create the config relation
    for (let id of formSectionId) {
        createConfigItemRelation(form_configitemId, "Form_FormSection", id);
    }

    return form_configitemId;
}
// function to genertate the multivalue list data using pre defined value
// CHANGE
async function generateMultValueQuery(dataElementUUID, dbCode, CODE_SET_UUID) {

    let query = `SELECT PRE_DEFINED_VALUES_UUID AS id, PRE_DEFINED_VALUES_TEXT AS value, PRE_DEFINED_VALUES_TEXT AS label FROM PRE_DEFINED_VALUES WHERE 
                CONCAT(',',:${dbCode}, ',') LIKE CONCAT('%,', PRE_DEFINED_VALUES_UUID, ',%')
                UNION
                SELECT PRE_DEFINED_VALUES_UUID AS id, PRE_DEFINED_VALUES_TEXT AS value, PRE_DEFINED_VALUES_TEXT AS label FROM PRE_DEFINED_VALUES WHERE CODE_SET_UUID = '${CODE_SET_UUID}' AND IS_PRE_DEFINED_VALUES_ACTIVE = 'Yes'`;

    return query;
}
// function to create the config item
function createConfigItem(itemName, itemType, projectId, releaseName) {
    const configItem = {};
    let itemId = uuid();
    configItem["ITEMID"] = itemId;
    configItem["ITEMNAME"] = itemName;
    configItem["ITEMTYPE"] = itemType;
    configItem["PROJECTID"] = projectId;
    configItem["CONFIG_RELEASE_NAME"] = releaseName;
    configItemList.push(configItem);
    return itemId;
}
// function to create the config item property
function createConfigItemProperty(propertyObject, itemId) {
    let propertyArray = [];
    for (var key in propertyObject) {
        const configproperty = {};
        configproperty["PROPERTYID"] = uuid();
        configproperty["PROPERTYNAME"] = key;
        configproperty["PROPERTYVALUE"] = propertyObject[key];
        configproperty["ITEMID"] = itemId;
        propertyArray.push(configproperty);
        configpropertyList.push(configproperty);
    }
    return propertyArray;
}
// function to create the config item privilege
function createConfigItemPrivilege(privilegeObject, itemId) {
    for (var key in privilegeObject) {
        const configprivilege = {};
        configprivilege["PRIVILEGEID"] = uuid();
        configprivilege["ROLEID"] = key;
        configprivilege["ITEMID"] = itemId;
        configprivilege["PRIVILEGETYPE"] = privilegeObject[key];
        configprivilegeList.push(configprivilege);
    }
}
// function to create the config item relation
function createConfigItemRelation(parentId, relationType, childId) {
    const configRelation = {};
    configRelation["RELATIONID"] = uuid();
    configRelation["RELATIONTYPE"] = relationType;
    configRelation["PARENTITEMID"] = parentId;
    configRelation["CHILDITEMID"] = childId;
    configrelationList.push(configRelation);
}
// // function to make string capital
function replaceSpaceAndMakeUpperCaseString(str) {
    let stringValue = str;
    stringValue = stringValue.replaceAll(' ', '_').toUpperCase();
    return stringValue;
}
// function to get the Header name for DataGrid column
function getHeaderForDataGridColumn(entityName, columnName) {
    if (entityName + '_ID' === columnName) return 'ID';
    if (headersForDataGridColumns[columnName]) return headersForDataGridColumns[columnName]
    return camelCaseString(columnName);
}

// function to get select reference query & data source according to datagrid column type and field type
async function getSelectReferenceQueryAndDataSource(dataElementUUID, isPreDefinedValue, columnName, CODE_SET_UUID) {
    const obj = { query: "", dataSourceID: "" }
    if (columnName === 'OPERATION_PERFORMED_BY') {
        obj.query = "SELECT AE_USER_PROFILE_UUID as id, concat(au.FIRST_NAME ,' ',au.LAST_NAME) as LABEL, concat(au.FIRST_NAME ,' ',au.LAST_NAME) as VALUE FROM USER_PROFILE au";
        obj.dataSourceID = infoAuthorizationDataSourceId;
    } else if (isPreDefinedValue === 'Yes') {
        obj.query = `SELECT PRE_DEFINED_VALUES_UUID AS id, PRE_DEFINED_VALUES_TEXT AS value, PRE_DEFINED_VALUES_TEXT AS label FROM PRE_DEFINED_VALUES WHERE CODE_SET_UUID='${CODE_SET_UUID}'`;
        obj.dataSourceID = infoTenantDataSourceId;
    }
    return obj;
}

function validateDataElements(dataElements) {
    let isValid = false;
    dataElements.map(el => {
        if (!el.DATA_KEY) {
            isValid = true;
        }
    })
    return isValid;
}
// function to create the form field
async function createFormField(formSectionId, logicalColumnDetails, type, attachmentFormSectionId, data_ElementId, entity_name, mainDataSource, multivalueList) {
    let formFieldDetails = {};
    let isColumnAvailable = false;
    if (data_ElementId.length) {
        let filteredArray = [];
        if (type == 'Main') {
            filteredArray = data_ElementId.filter(item => item.DATA_TYPE != 'LONGTEXT');
        } else if (type == 'LongText') {
            filteredArray = data_ElementId.filter(item => item.DATA_TYPE == 'LONGTEXT');
        }

        let formFieldDetail = {
            "title": type == 'LongText' ? "LongText UI View" : "Form",
            "className": type == 'LongText' ? "LONGTEXT_CONTAINER" : "FORM_CONTAINER",
            "primaryKey": "",
            "parentNodeID": "",
            "componentPerRow": type == 'LongText' ? 1 : 2,
            "parentNodeClassName": input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' ? "TAB_CONTAINER" : "DATA_SET_UI_VIEW",
            "level": input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' ? 3 : 2,
            "children": [],
            "expanded": true
        };

        let hiddenField_configitemId = createConfigItem(input.DATA_SET_NAME + '_UUID', 'FormField', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

        // Create property for hidden field UUID
        let hiddenFieldPropertyObject = {
            "LABEL": input.DATA_SET_NAME + '_UUID',
            "TYPE": 'Hiddenfield',
            "ORDER": 1,
        }
        let formField_configproperty = createConfigItemProperty(hiddenFieldPropertyObject, hiddenField_configitemId);

        // Create privilege for hidden uuid field
        createConfigItemPrivilege(privilegeArray, hiddenField_configitemId);

        // Create the config relation for Formfield and formsection
        createConfigItemRelation(formSectionId, "FormSection_FormField", hiddenField_configitemId);

        // Create the config relation for Formfield and logical column
        createConfigItemRelation(hiddenField_configitemId, "FormField_LogicalColumn", logicalColumnDetails[entity_name + '_UUID']);

        let orderFF = 0;
        for (let i = 0; i < filteredArray.length; i++) {
            let get_dbcode_name = replaceSpaceAndMakeUpperCaseString(filteredArray[i].DATA_ELEMENT_NAME);
            orderFF = i + 1;    //Formfield order

            //Create config item for Formfield-
            let formField_configitemId = createConfigItem(filteredArray[i].DATA_ELEMENT_NAME, 'FormField', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

            // arrange the form field id to map the form field with data grid column to make inline grid
            formFieldDetails[get_dbcode_name] = formField_configitemId;

            let multiValueQuery;
            if (filteredArray[i].PRE_DEFINED_DATA === 'Yes' && type == 'Main') {
                multiValueQuery = await generateMultValueQuery(filteredArray[i].DATA_ELEMENT_UUID, get_dbcode_name, filteredArray[i].CODE_SET_UUID);
            }

            let getLogicalColumnIdByDBCode = logicalColumnDetails[get_dbcode_name];

            if (filteredArray[i] && filteredArray[i].DATA_KEY != 'FOREIGN_KEY' && filteredArray[i].DATA_KEY != 'AUTO_INCREMENT_UNIQUE_KEY') {
                isColumnAvailable = true;
                // Create the config property for Formfield
                let formfieldpropertyObject = {
                    "LABEL": filteredArray[i].LABEL ? filteredArray[i].LABEL : filteredArray[i].DATA_ELEMENT_NAME,
                    "TYPE": filteredArray[i].UI_VIEW_TYPE,
                    "ORDER": orderFF,
                    "IS_MANDATORY": filteredArray[i].IS_VALUE_ALWAYS_REQUIRED == 'Yes' ? 1 : 0,
                    "SELECT_ITEMS_REFERENCE_ID": filteredArray[i].PRE_DEFINED_DATA === 'Yes' ? multiValueQuery : '',
                    "DATASOURCE_ID": filteredArray[i].PRE_DEFINED_DATA === 'Yes' ? infoTenantDataSourceId : '',
                    "COLSPAN": null,
                    "MULTI_VALUE_LIST": filteredArray[i].DATA_TYPE == 'BOOLEAN' ? 'Yes:Yes,No:No' : multivalueList ? multivalueList : '',
                }

                if (filteredArray[i].UI_VIEW_TYPE === 'DatePicker') {
                    formfieldpropertyObject['FORMAT_DATE'] = 'dd-MMM-yyyy';
                } else if (filteredArray[i].UI_VIEW_TYPE === 'DateTimePicker') {
                    formfieldpropertyObject['FORMAT_DATE'] = 'dd-MMM-yy h:mm a';
                }

                let formField_configproperty = createConfigItemProperty(formfieldpropertyObject, formField_configitemId);

                // Create the config relation for Formfield and formsection
                createConfigItemRelation(formSectionId, "FormSection_FormField", formField_configitemId);

                // Create the config relation for Formfield and logical column
                createConfigItemRelation(formField_configitemId, "FormField_LogicalColumn", getLogicalColumnIdByDBCode);

                // Create the config privilege for Formfield
                createConfigItemPrivilege(privilegeArray, formField_configitemId);

                // creating the form field node in the data set ui component tree table
                formFieldDetail.children.push({
                    "title": filteredArray[i].DATA_ELEMENT_NAME,
                    "className": type == 'LongText' ? "LONGTEXT_FORMFIELD" : "MAIN_FORMFIELD",
                    "parentNodeClassName": type == 'LongText' ? "LONGTEXT_CONTAINER" : "FORM_CONTAINER",
                    "primaryKey": filteredArray[i].DATA_ELEMENT_UUID,
                    "formFieldId": formField_configitemId,
                    "logicalColumnId": getLogicalColumnIdByDBCode,
                    "colspan": "",
                    "parentNodeID": "",
                    "level": input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' ? 4 : 3,
                    "children": [],
                    "expanded": true
                });


            } else if (filteredArray[i] && filteredArray[i].DATA_KEY == 'FOREIGN_KEY') {
                let hiddenFieldProperty = {
                    "LABEL": filteredArray[i].DATA_ELEMENT_NAME,
                    "TYPE": 'Hiddenfield',
                    "ORDER": 1,
                }

                let hiddenformField_configproperty = createConfigItemProperty(hiddenFieldProperty, formField_configitemId);

                // Create the config relation for Formfield and formsection
                createConfigItemRelation(formSectionId, "FormSection_FormField", formField_configitemId);

                // Create the config relation for Formfield and logical column
                createConfigItemRelation(formField_configitemId, "FormField_LogicalColumn", getLogicalColumnIdByDBCode);

                // Create the config privilege for Formfield
                createConfigItemPrivilege(privilegeArray, formField_configitemId);
            }
        }

        // Creating the attachment form field
        if (input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' && type == 'Main') {
            let attachmentFormField_configitemId = createConfigItem('Attachment', 'FormField', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

            // Create the config property for Formfield
            let attachmentformfieldpropertyObject = {
                "LABEL": 'Click Here To Upload',
                "TYPE": 'Dropzone',
                "ORDER": orderFF + 5,
                "LAYOUT": 'Both'
            }

            createConfigItemProperty(attachmentformfieldpropertyObject, attachmentFormField_configitemId);

            // Create the config relation for Formfield and formsection
            createConfigItemRelation(attachmentFormSectionId, "FormSection_FormField", attachmentFormField_configitemId);

            // Create the config relation for Formfield and logical column
            createConfigItemRelation(attachmentFormField_configitemId, "FormField_LogicalColumn", logicalColumnDetails[entity_name + '_UUID']);

            // Create the config privilege for Formfield
            createConfigItemPrivilege(privilegeArray, attachmentFormField_configitemId);
        }
        // When attachment tab is available, making form as child of tab
        if (input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' && dataSetFormFieldUiComponentData && dataSetFormFieldUiComponentData.length && dataSetFormFieldUiComponentData[0].children.length && isColumnAvailable) {
            dataSetFormFieldUiComponentData[0].children[0].children.push(formFieldDetail);
        } else if (input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'No' && dataSetFormFieldUiComponentData && dataSetFormFieldUiComponentData.length && isColumnAvailable) { // When no attachment is present making form as child of data set ui view
            dataSetFormFieldUiComponentData[0].children.push(formFieldDetail);
        }
        // dataSetFormFieldUiComponentData.push(formFieldDetail);
        return formFieldDetails;
    }
}
//function to create the button panel
function createButtonPanelAndButton(type, buttonPanelProperty, buttonList, relationType, parentItemId, dataSetName, isLongTextDataExist) {
    //Create button panel
    let buttonPanel_configitemId = createConfigItem(type + ' ' + dataSetName, 'ButtonPanel', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    // Create property for button panel
    let buttonPanel_configproperty = createConfigItemProperty(buttonPanelProperty, buttonPanel_configitemId);

    // Create privilege for button panel
    createConfigItemPrivilege(privilegeArray, buttonPanel_configitemId);

    // Create the config relation for button panel
    createConfigItemRelation(parentItemId, relationType, buttonPanel_configitemId);

    // let buttonOrder;
    for (let i = 0; i < buttonList.length; i++) {
        let button_configitemId = createConfigItem(buttonList[i] + ' ' + dataSetName + ' [(BUTTON)(SYSTEM)]', 'Button', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

        // Create Property for Button
        let buttonClass = '';
        if (buttonList[i] === "Close") {
            buttonClass = "cancelCompositeEntity";
        } else if (buttonList[i] === "Save") {
            buttonClass = "btn singleEntityModalSave";
        } else if (buttonList[i] === "Update") {
            buttonClass = "updateFormDataButton";
        } else if (buttonList[i] === "Delete") {
            buttonClass = isLongTextDataExist ? 'deleteFormCompositeEntity' : "deleteFormData";
        } else if (buttonList[i] === "Add") {
            buttonClass = "single-entity-insert";
        } else if (buttonList[i] === 'Inline Add') {
            buttonClass = "addRowInGrid";
        }

        //create property for button
        let buttonProperty = {
            LABEL: buttonList[i] === "Inline Add" ? '' : buttonList[i],
            ORDER: i + 5,
            BUTTON_ALIGNMENT: "right",
            BUTTON_CLASS: buttonClass,
            PORTAL_ID: '',
            MODAL_REQUIRED: 0,
            ACCESSBILITY_REGEX: null,
            BUTTON_STYLE: null,
            DBCODE: buttonList[i] === "Inline Add" ? 'expander' : '',
            EXPRESSION_FIELD_STRING: null,
            ICON: buttonList[i] === "Inline Add" ? 'fa fa-plus-circle' : '',
            IS_EXPRESSION_AVAILABLE: 0,
            EDITABILITY_REGEX: null,
            TOOLTIP: null
        };

        let buttonPanel_configproperty = createConfigItemProperty(buttonProperty, button_configitemId);

        // Create privilege for button
        createConfigItemPrivilege(privilegeArray, button_configitemId);

        // Create the config relation for button panel
        createConfigItemRelation(buttonPanel_configitemId, "ButtonPanel_Button", button_configitemId);
    }
}

//function to create the datagrid
function createDataGrid(dataSetName, formId) {
    //Create the config item
    let dataGridConfigItem = createConfigItem(dataSetName + ' List ' + '[(SUB PAGE)(SYSTEM)]', 'DataGrid', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    // Create the config property
    let propertyObject = {
        "GRID_TYPE": "GENERAL_GRID",
        "LABEL": dataSetName,
        "IS_SUB_COMPONENT_ENABLE": 1,
        "SUB_COMPONENT_TYPE": "SubPortal",
        "IS_EDIT_BUTTON_ENABLE": 0,
        "IS_MODAL_REQUIRED": 0,
        "IS_HOVER_ENABLE": 0,
        "IS_SCROLL_ENABLE": 0,
        "IS_SWIMLANE_REQUIRED": 0,
        "IS_SERVER_PAGINATION_ENABLE": 0,
        "IS_BORDER_ENABLE": 1,
        "IS_ROW_SELECTION_ENABLE": 0,
        "IS_ROW_REORDER": 0,
        "DEFAULT_ORDERING": 0,
        "IS_ADVANCE_FILTER_FORM": 0,
        "DEFAULT_SORTING": 0,
        "IS_STRIPPED_ENABLE": 1,
        "IS_HEADER_VISIBLE": 1
    };

    createConfigItemProperty(propertyObject, dataGridConfigItem);

    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, dataGridConfigItem);
    if (formId) {
        // Create the config relation
        createConfigItemRelation(dataGridConfigItem, "DataGrid_Form", formId);
    }



    return dataGridConfigItem;
}
// function to create the logical entity operation
function createLogicalEntityOperation(datagridId, gridList, entity_name, mainDataSource, auditDataSource, isLongTextDataExist, singleSelectQuery, auditTableDataObject = null, type = 'Main') {

    let dataSetName = gridList && gridList['Parent'] && gridList['Child'] ? gridList['Child'] + ' By ' + gridList['Parent'] : gridList['Parent'];
    //Create the config item
    let logicalEntityOperationConfigItem = createConfigItem(dataSetName, 'LogicalEntityOperation', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    //Create queries for main datagrid 
    let propertyObject;
    if (type === 'Main') {
        let replacedValue = singleSelectQuery.replace('WHERE', 'where').split('where')
        let selectQue = replacedValue[0].trim();
        if (gridList && gridList['Parent'] && gridList['Child']) {
            let parentUUID = replaceSpaceAndMakeUpperCaseString(gridList['Parent']) + '_UUID';
            selectQue = selectQue + ' WHERE ' + parentUUID + '=:' + parentUUID;
        }

        let splitValue = singleSelectQuery.split('=:');
        let formQue = splitValue[0].trim();
        // Create the config property
        propertyObject = {
            "GRID_SELECT_ID": selectQue + ' ORDER BY ' + entity_name + '_ID' + ' desc',
            "SELECT_ID": formQue + "=:entityPrimaryKey",
            "DATASOURCE_ID": mainDataSource.ITEMID
        };
    // Create queries for audit datagrid
    } else if (type === 'Audit') {
        let queryObj = queryConverter(auditTableDataObject, isLongTextDataExist);
        let splitQuery = queryObj.Select.replace('FROM', 'from').split('from');

        let fullQuery = `${splitQuery[0]},"${entity_name}" as TABLE_NAME, "${auditDataSource.PROPERTYVALUE}" as AUDIT_DATASOURCE FROM ${splitQuery[1]} ORDER BY AE_TIMESTAMP DESC`;

        let auditSingleSelectQuery = fullQuery.split('AE_OLD_NEW_COMPARISION_DETAILS,').join("");

        // Create the config property
        propertyObject = {
            "GRID_SELECT_ID": auditSingleSelectQuery,
            "SELECT_ID": "",
            "DATASOURCE_ID": auditDataSource.ITEMID
        };
    }
    createConfigItemProperty(propertyObject, logicalEntityOperationConfigItem);

    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, logicalEntityOperationConfigItem);

    // Create the config relation
    createConfigItemRelation(datagridId, "DataGrid_LogicalEntityOperation", logicalEntityOperationConfigItem);
}

// function to create the data grid column
async function createDataGridColumn(isVisible, datagridId, formFieldDetails, logicalColumnDetails, entity_name, data_ElementId, type = 'Main') {
    let dataSetDataGridColumnUiComponentData = [];

    // Create expand, view/edit and ellipsis columns only for Main datagrid
    if (type !== 'Audit') {
        //Create the view/edit config item
        let viewEditDataGridColumnConfigItem = createConfigItem('View/Edit', 'DataGridColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

        // Create the config property
        let viewEditPropertyObject = {
            "DBCODE": "View/Edit",
            "COLLAPSE_ICON": "fa fa-window-close-o",
            "ICON": "fa fa-pencil-square-o",
            "ACTION_COLUMN_TYPE": "ExpandableComponent",
            "TOOLTIP": "View/Edit",
            "HEADER_ORDER": "1",
            "IS_ACTION_COLUMN": "1",
            "IS_EXPRESSION_AVAILABLE": "0",
            "IS_VISIBLE": isVisible == 'Yes' ? "1" : "0",
            "IS_ELLIPSES_ENABLE": "0",
            "IS_DEFAULT_EDITABLE": 0,
            "IS_AUDIT_COLUMN_JSON": 0,
            "IS_DISPLAY_DETAIL": 0,
            "IS_SHOW_ONLY_ON_EDIT": 0,
            "IS_EXPRESSION_AVAILABLE": 0,
            "IS_FIXED_COLUMN": 0,
            "IS_KEY": 0,
            "IS_TIME_STAMP": 0,
            "ISPRIMARYKEY": 0,
            "IS_HYPERLINK": 0
        };

        createConfigItemProperty(viewEditPropertyObject, viewEditDataGridColumnConfigItem);

        // Create the config privilege
        createConfigItemPrivilege(privilegeArray, viewEditDataGridColumnConfigItem);

        createConfigItemRelation(datagridId, "DataGrid_DataGridColumn", viewEditDataGridColumnConfigItem);

        //Create the ellipsis config item
        let ellipsisDataGridColumnConfigItem = createConfigItem('Ellipsis', 'DataGridColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

        // Create the config property
        let ellipsisPropertyObject = {
            "DBCODE": "Ellipsis",
            "HEADER_NAME": "Show Record History",
            "GROUP": "First Column",
            "COLLAPSE_ICON": "fa fa-ellipsis-v",
            "ICON": "fa fa-ellipsis-v",
            "ACTION_COLUMN_TYPE": "ExpandableComponent",
            "TOOLTIP": "Show Record History",
            "HEADER_ORDER": "3",
            "IS_ACTION_COLUMN": "1",
            "IS_EXPRESSION_AVAILABLE": "1",
            "IS_VISIBLE": "1",
            "IS_ELLIPSES_ENABLE": "1",
            "IS_DEFAULT_EDITABLE": 0,
            "IS_AUDIT_COLUMN_JSON": 0,
            "IS_DISPLAY_DETAIL": 0,
            "IS_SHOW_ONLY_ON_EDIT": 0,
            "IS_EXPRESSION_AVAILABLE": 0,
            "IS_FIXED_COLUMN": 0,
            "IS_KEY": 0,
            "IS_TIME_STAMP": 0,
            "ISPRIMARYKEY": 0,
            "IS_HYPERLINK": 0
        };

        createConfigItemProperty(ellipsisPropertyObject, ellipsisDataGridColumnConfigItem);

        // Create the config privilege
        createConfigItemPrivilege(privilegeArray, ellipsisDataGridColumnConfigItem);
        // Create the relation 
        createConfigItemRelation(datagridId, "DataGrid_DataGridColumn", ellipsisDataGridColumnConfigItem);

        //Create the Expand config item
        let expandDataGridColumnConfigItem = createConfigItem('Expand', 'DataGridColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

        // Create the property for expand 
        let expandDGCPropertyArray = {
            "DBCODE": "Expand",
            "COLLAPSE_ICON": "fa fa-caret-square-o-down",
            "ICON": "fa fa-caret-square-o-right",
            "ACTION_COLUMN_TYPE": "ExpandableComponent",
            "TOOLTIP": "Expand",
            "HEADER_ORDER": 2,
            "IS_ACTION_COLUMN": "1",
            "IS_EXPRESSION_AVAILABLE": "0",
            "IS_VISIBLE": isVisible == 'Yes' ? "1" : "0",
            "IS_ELLIPSES_ENABLE": "0",
            "IS_DEFAULT_EDITABLE": 0,
            "IS_AUDIT_COLUMN_JSON": 0,
            "IS_DISPLAY_DETAIL": 0,
            "IS_SHOW_ONLY_ON_EDIT": 0,
            "IS_EXPRESSION_AVAILABLE": 0,
            "IS_FIXED_COLUMN": 0,
            "IS_KEY": 0,
            "IS_TIME_STAMP": 0,
            "ISPRIMARYKEY": 0,
            "IS_HYPERLINK": 0
        };
        createConfigItemProperty(expandDGCPropertyArray, expandDataGridColumnConfigItem);
        // Create the config privilege
        createConfigItemPrivilege(privilegeArray, expandDataGridColumnConfigItem);
        // Create the relation 
        createConfigItemRelation(datagridId, "DataGrid_DataGridColumn", expandDataGridColumnConfigItem);

    }

    let dataGridUuidColumnObject = {
        'DATA_ELEMENT_NAME': entity_name + '_UUID',
        'DATA_TYPE': 'VARCHAR',
        'LENGTH': 50,
        'IS_UNIQUE_KEY': 'No',
        'IS_VALUE_ALWAYS_REQUIRED': 'No',
        'PRE_DEFINED_DATA': 'No',
        'DATA_KEY': null
    };

    let dataElementArray = [];
    if (type === "Audit") {
        // Adding audit columns to dataElementArray for audit datagrid
        dataElementArray = dataElementArray.concat(auditColumnObjects);

        // Create action columns for audit datagrid
        await createActionDatagridColumnsForAudit(datagridId);
    }

    if (data_ElementId.length) {
        dataElementArray.push(dataGridUuidColumnObject);
        let filteredArray = data_ElementId.filter(item => item.DATA_TYPE != 'LONGTEXT');
        dataElementArray = dataElementArray.concat(filteredArray);
    }

    let dataColumnOrder = 5;
    for (let i = 0; i < dataElementArray.length; i++) {
        let columnName = replaceSpaceAndMakeUpperCaseString(dataElementArray[i].DATA_ELEMENT_NAME);

        //  Skipping DataGrid column creation for a few columns
        if (columnName === entity_name + '_ID' && type === 'Audit') continue;

        //Create the config item
        if (dataElementArray[i] && dataElementArray[i].DATA_KEY != 'FOREIGN_KEY') {

            let dataGridColumnConfigItem = createConfigItem(columnName, 'DataGridColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

            let getLogicalColumnIdByDBCode = logicalColumnDetails[columnName];

            if (dataElementArray[i] && dataElementArray[i]['DATA_ELEMENT_NAME'] !== entity_name + '_UUID' && dataElementArray[i].DATA_KEY != 'AUTO_INCREMENT_UNIQUE_KEY') {
                dataColumnOrder = dataColumnOrder + 1;
                dataSetDataGridColumnUiComponentData.push({
                    "title": dataElementArray[i].DATA_ELEMENT_NAME,
                    "className": "DATAGRID_COLUMN",
                    "parentNodeClassName": "",
                    "primaryKey": dataElementArray[i].DATA_ELEMENT_UUID,
                    "dataGridColumnId": dataGridColumnConfigItem,
                    "logicalColumnId": type === 'Audit' ? '' : getLogicalColumnIdByDBCode,
                    "dataKey": dataElementArray[i].DATA_KEY ? dataElementArray[i].DATA_KEY : "",
                    "parentNodeID": "",
                    "level": 1,
                    "children": [],
                    "expanded": true
                });
            }

            const queryDataSourceObj = await getSelectReferenceQueryAndDataSource(dataElementArray[i].DATA_ELEMENT_UUID, dataElementArray[i].PRE_DEFINED_DATA, columnName, dataElementArray[i].CODE_SET_UUID);

            // Create the config property
            let propertyObject = {
                "HEADER_NAME": getHeaderForDataGridColumn(entity_name, columnName),
                "HEADER_ORDER": entity_name + '_ID' === columnName ? 4 : entity_name + '_UUID' === columnName ? 5 : dataColumnOrder,
                "IS_ACTION_COLUMN": 0,
                "ACTION_COLUMN_TYPE": '',
                "IS_VISIBLE": entity_name + '_UUID' === columnName ? 0 : 1,
                "DATASOURCE_ID": queryDataSourceObj.dataSourceID,
                "SELECT_ITEMS_REFERENCE_ID": queryDataSourceObj.query,
                "IS_FILTER_ENABLE": 1,
                "FILTER_TYPE": ['DateTimePicker', 'DatePicker'].includes(dataElementArray[i].UI_VIEW_TYPE) ? 'DatePicker' : ['TextBox', 'TextArea'].includes(dataElementArray[i].UI_VIEW_TYPE) ? 'TextBox' : ['Hiddenfield'].includes(dataElementArray[i].UI_VIEW_TYPE) ? null : dataElementArray[i].UI_VIEW_TYPE,
                "IS_HYPERLINK": 0,
                "IS_ELLIPSES_ENABLE": 1,
                "IS_AUDIT_COLUMN_JSON": 0,
                "AUDIT_COLUMN_NAME": '',
                "IS_TIME_STAMP": columnName === 'AE_TIMESTAMP' ? 1 : 0,
                "WIDTH": entity_name + '_ID' === columnName ? 3 : null,
                "MULTI_VALUE_LIST": dataElementArray[i].DATA_TYPE == 'BOOLEAN' ? 'Yes:Yes,No:No' : '',
                "COLUMN_TYPE": dataElementArray[i].PRE_DEFINED_DATA === 'Yes' && dataElementArray[i].UI_VIEW_TYPE == 'MultiSelect' ? 'MultiSelect' : '',
                "IS_DEFAULT_EDITABLE": 0,
                "DBCODE": type === 'Audit' ? columnName : "",
            };

            if (dataElementArray[i].UI_VIEW_TYPE === 'DatePicker') {
                propertyObject['DATE_FORMAT'] = 'MMM-DD-YYYY';
            } else if (dataElementArray[i].UI_VIEW_TYPE === 'DateTimePicker') {
                propertyObject['DATE_FORMAT'] = 'MMM-dd-yyyy h:mm a';
            }

            createConfigItemProperty(propertyObject, dataGridColumnConfigItem);

            // Create the config privilege
            if (dataElementArray[i].PRE_DEFINED_DATA !== 'Yes') {
                createConfigItemPrivilege(privilegeArray, dataGridColumnConfigItem);
            } else {
                createConfigItemPrivilege(viewPrivilegeArray, dataGridColumnConfigItem);
            }

            // Create the config relation between datagrid and data grid column 
            createConfigItemRelation(datagridId, "DataGrid_DataGridColumn", dataGridColumnConfigItem);

            // Create the config relation between  data grid column and logical column for non audit tables
            if (type !== 'Audit') {
                createConfigItemRelation(dataGridColumnConfigItem, "DataGridColumn_LogicalColumn", getLogicalColumnIdByDBCode);
            }

            if (formFieldDetails && dataElementArray[i] &&
                dataElementArray[i].DATA_KEY != 'AUTO_INCREMENT_UNIQUE_KEY' &&
                type !== 'Audit' && dataElementArray[i].PRE_DEFINED_DATA !== 'Yes') {
                // Create the config relation between  data grid column and form field
                createConfigItemRelation(dataGridColumnConfigItem, "DataGridColumn_FormField", formFieldDetails[columnName]);
            }
        }
    }

    return dataSetDataGridColumnUiComponentData;
}

// function to create action datagrid columns for audit datagrid
async function createActionDatagridColumnsForAudit(datagridId) {

    //Create the Table Name config item
    let tableNameDataGridCol = createConfigItem('Table Name', 'DataGridColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    // Create the config property
    let tableNamePropertyObject = {
        "DBCODE": "TABLE_NAME",
        "HEADER_NAME": "TABLE_NAME",
        "GROUP": "",
        "ACTION_COLUMN_TYPE": "",
        "HEADER_ORDER": "1",
        "IS_ACTION_COLUMN": "0",
        "IS_EXPRESSION_AVAILABLE": "0",
        "IS_VISIBLE": "0",
        "IS_ELLIPSES_ENABLE": "0",
        "IS_DEFAULT_EDITABLE": 0,
        "IS_AUDIT_COLUMN_JSON": 0,
        "AUDIT_COLUMN_NAME": "",
        "IS_DISPLAY_DETAIL": 0,
        "IS_SHOW_ONLY_ON_EDIT": 0,
        "IS_EXPRESSION_AVAILABLE": 0,
        "IS_FIXED_COLUMN": 0,
        "IS_KEY": 0,
        "IS_TIME_STAMP": 0,
        "ISPRIMARYKEY": 0,
        "IS_HYPERLINK": 0
    };

    // Create the config property
    createConfigItemProperty(tableNamePropertyObject, tableNameDataGridCol);
    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, tableNameDataGridCol);
    // Create the relation 
    createConfigItemRelation(datagridId, "DataGrid_DataGridColumn", tableNameDataGridCol);

    //Create the Table Name config item
    let dataSourceDataGridCol = createConfigItem('Audit Datasource', 'DataGridColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    // Create the config property
    let dataSourcePropertyObject = {
        "DBCODE": "AUDIT_DATASOURCE",
        "HEADER_NAME": "AUDIT_DATASOURCE",
        "GROUP": "",
        "ACTION_COLUMN_TYPE": "",
        "HEADER_ORDER": "2",
        "IS_ACTION_COLUMN": "0",
        "IS_EXPRESSION_AVAILABLE": "0",
        "IS_VISIBLE": "0",
        "IS_ELLIPSES_ENABLE": "0",
        "IS_DEFAULT_EDITABLE": 0,
        "IS_AUDIT_COLUMN_JSON": 0,
        "AUDIT_COLUMN_NAME": "",
        "IS_DISPLAY_DETAIL": 0,
        "IS_SHOW_ONLY_ON_EDIT": 0,
        "IS_EXPRESSION_AVAILABLE": 0,
        "IS_FIXED_COLUMN": 0,
        "IS_KEY": 0,
        "IS_TIME_STAMP": 0,
        "ISPRIMARYKEY": 0,
        "IS_HYPERLINK": 0
    };

    // Create the config property
    createConfigItemProperty(dataSourcePropertyObject, dataSourceDataGridCol);
    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, dataSourceDataGridCol);
    // Create the relation 
    createConfigItemRelation(datagridId, "DataGrid_DataGridColumn", dataSourceDataGridCol);

    //Create the Changed Data Details config item
    let changedDataGridColumnConfigItem = createConfigItem('Changed Data Details', 'DataGridColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    // Create the config property
    let changedPropertyObject = {
        "DBCODE": "CHANGED_DATA_DETAILS",
        "HEADER_NAME": "Changed Data Details",
        "GROUP": "First Column",
        "ACTION_COLUMN_TYPE": "CallActionFlow",
        "HEADER_ORDER": "3",
        "IS_ACTION_COLUMN": "1",
        "IS_EXPRESSION_AVAILABLE": "0",
        "IS_VISIBLE": "1",
        "IS_ELLIPSES_ENABLE": "0",
        "IS_DEFAULT_EDITABLE": 0,
        "IS_AUDIT_COLUMN_JSON": 0,
        "AUDIT_COLUMN_NAME": "",
        "IS_DISPLAY_DETAIL": 0,
        "IS_SHOW_ONLY_ON_EDIT": 0,
        "IS_EXPRESSION_AVAILABLE": 0,
        "IS_FIXED_COLUMN": 0,
        "IS_KEY": 0,
        "IS_TIME_STAMP": 0,
        "ISPRIMARYKEY": 0,
        "IS_HYPERLINK": 0,
        "HREF_VALUE": ComparisionActionFlowId
    };

    // Create the config property
    createConfigItemProperty(changedPropertyObject, changedDataGridColumnConfigItem);
    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, changedDataGridColumnConfigItem);
    // Create the relation 
    createConfigItemRelation(datagridId, "DataGrid_DataGridColumn", changedDataGridColumnConfigItem);

    //Create the Transaction Details config item
    let transactionDataGridColumnConfigItem = createConfigItem('Transaction Details', 'DataGridColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    // Create the config property
    let transactionPropertyObject = {
        "DBCODE": "TRANSACTION_DETAILS",
        "HEADER_NAME": "Transaction Details",
        "GROUP": "First Column",
        "ACTION_COLUMN_TYPE": "CallActionFlow",
        "HEADER_ORDER": "4",
        "IS_ACTION_COLUMN": "1",
        "IS_EXPRESSION_AVAILABLE": "0",
        "IS_VISIBLE": "1",
        "IS_ELLIPSES_ENABLE": "0",
        "IS_DEFAULT_EDITABLE": 0,
        "IS_AUDIT_COLUMN_JSON": 0,
        "IS_DISPLAY_DETAIL": 0,
        "IS_SHOW_ONLY_ON_EDIT": 0,
        "IS_EXPRESSION_AVAILABLE": 0,
        "IS_FIXED_COLUMN": 0,
        "IS_KEY": 0,
        "IS_TIME_STAMP": 0,
        "ISPRIMARYKEY": 0,
        "IS_HYPERLINK": 0,
        "HREF_VALUE": TransactionActionFlowId
    };

    // Create the config property
    createConfigItemProperty(transactionPropertyObject, transactionDataGridColumnConfigItem);
    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, transactionDataGridColumnConfigItem);
    // Create the relation 
    createConfigItemRelation(datagridId, "DataGrid_DataGridColumn", transactionDataGridColumnConfigItem);
}
// function to create the composite entity 
function createCompositeEntity(dataSetName) {
    //Create the config item
    let item = createConfigItem(dataSetName, 'CompositeEntity', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    //Create the config privilege
    createConfigItemPrivilege(privilegeArray, item);

    return item;
}
// function to create the root composite entity node
function createRootCompositeEntityNode(dataSetName, compositeEntityId, rootCompositeEntityChild) {
    //Create the config item
    let item = createConfigItem(dataSetName, 'RootCompositeEntityNode', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    let rootCompositeEntityNodeProperty = {
        "DISPLAY_NODE_NAME": camelCaseString(dataSetName),
        "ORDER": 5,
        "ADDED_HIDDEN": 0
    };

    //Create the config property
    createConfigItemProperty(rootCompositeEntityNodeProperty, item);

    //Create the config privilege
    createConfigItemPrivilege(privilegeArray, item);

    // Create the config relation between composite entity and rootCompositeEntity
    createConfigItemRelation(compositeEntityId, "CompositeEntity_RootCompositeEntityNode", item);

    for (let key in rootCompositeEntityChild) {
        createConfigItemRelation(item, "RootCompositeEntityNode_" + key, rootCompositeEntityChild[key]);
    }

    return item;
}
function createNodeBusinessRule(dataSetName, rootCompositeEntityId, compositeEntityId) {
    let item = createConfigItem(dataSetName, 'NodeBusinessRule', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
    let rule = `function transformData(input) {
    let efectiveDates = [];
    let endDates = [];
    const uniqueDates = new Set();
    const uniqueDataElement = new Set();

    const grouped = {};
    input.forEach(item => {
        const key = item.DATA_ELEMENT;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
    });

    input.forEach(item => {
        const effectiveDate = (new Date(item.EFECTIVE_DATE)).toISOString();
        const endDate = (new Date(item.END_DATE)).toISOString();

        efectiveDates.push(effectiveDate);
        endDates.push(endDate);
        uniqueDates.add(effectiveDate);
        uniqueDates.add(endDate);
        uniqueDataElement.add(item.DATA_ELEMENT);
    });
    const sortedDates = Array.from(uniqueDates).sort((a, b) => new Date(a) - new Date(b));

    const dateRanges = [];
    for (let i = 0; i < sortedDates.length - 1; i++) {
        let newEndDate;
        if (efectiveDates.includes(sortedDates[i + 1])) {
            newEndDate = new Date(sortedDates[i + 1]);
            newEndDate.setDate(newEndDate.getDate() - 1)
        }
        let newEffectiveDate;
        if (endDates.includes(sortedDates[i])) {
            newEffectiveDate = new Date(sortedDates[i]);
            newEffectiveDate.setDate(newEffectiveDate.getDate() + 1)
        }
        dateRanges.push({
            start: newEffectiveDate ? newEffectiveDate.toISOString().split('T')[0] : sortedDates[i].toString().split('T')[0],
            end: newEndDate ? newEndDate.toISOString().split('T')[0] : sortedDates[i + 1].toString().split('T')[0]
        });
    }
    const output = dateRanges.map((range) => {
        const result = {
            EFECTIVE_DATE: range.start,
            END_DATE: range.end,
        };
        uniqueDataElement.forEach((field) => {
            result[field] = '';
        });

        return result;
    });
    Object.keys(grouped).forEach(key => {
        grouped[key].forEach(item => {
            output.forEach(range => {
                if (
                    new Date(range.EFECTIVE_DATE) >= new Date(item.EFECTIVE_DATE) &&
                    new Date(range.END_DATE) <= new Date(item.END_DATE)
                ) {
                    range[key] = item.DATA_ELEMENT_VALUE;
                }
            });
        });
    });

    const merged = [];
    let current = output[0];
    const excludeKeys = ['EFECTIVE_DATE', 'END_DATE'];

    const filterObject = (obj) => {
        return Object.keys(obj)
            .filter(key => !excludeKeys.includes(key))
            .reduce((acc, key) => {
                acc[key] = obj[key];
                return acc;
            }, {});
    };

    for (let i = 1; i < output.length; i++) {
        const next = output[i];
        const filteredCurrent = filterObject(current);
        const filteredNext = filterObject(next);
        if (JSON.stringify(filteredCurrent) === JSON.stringify(filteredNext)) {
            current.END_DATE = next.END_DATE;
        } else {
            merged.push(current);
            current = next;
        }
    }
    merged.push(current);
    return merged;
}

let summery =[];
if(input.compositeEntityAction == 'Save'){
  const result = transformData(input['AppEngChildEntity:${entity_name}_ATTRIBUTE']);
  summery = summery.concat(...result);
}
input["AppEngChildEntity:${entity_name}_SUMMARY"] = summery;`
    let businessRuleProperty = {
        "EXECUTION_TYPE": 'Custom',
        "ORDER": 5,
        "RULE": rule
    }
    createConfigItemProperty(businessRuleProperty, item);

    //Create the config privilege
    createConfigItemPrivilege(privilegeArray, item);

    // Create the config relation between composite entity and CompositeEntityNode
    createConfigItemRelation(rootCompositeEntityId, "RootCompositeEntityNode_NodeBusinessRule", item);

}

// function to create the composite entity node
function createCompositeEntityNode(dataSetName, compositeEntityId, rootCompositeEntityId, compositeEntityNodeChild, compositeEntityNodeProperty) {
    //Create the config item
    let item = createConfigItem(dataSetName, 'CompositeEntityNode', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

    //Create the config property
    createConfigItemProperty(compositeEntityNodeProperty, item);

    //Create the config privilege
    createConfigItemPrivilege(privilegeArray, item);

    // Create the config relation between composite entity and CompositeEntityNode
    createConfigItemRelation(compositeEntityId, "CompositeEntity_CompositeEntityNode", item);

    // Create the config relation between root composite entity and CompositeEntity ParentNode_ChildNode
    createConfigItemRelation(rootCompositeEntityId, "ParentNode_ChildNode", item);

    // Create the config relation between composite entity node and logical & physical entity
    for (let key in compositeEntityNodeChild) {
        createConfigItemRelation(item, "CompositeEntityNode_" + key, compositeEntityNodeChild[key]);
    }

    return item;
}
// function to create the data set rel
function createDataSetRel(dataSetName, mainlogicalEntityConfigId, longtextLogicalEntityConfigId) {
    //Create the config item
    let item = createConfigItem(dataSetName, 'DataSetRel', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
    //Create the config privilege
    createConfigItemPrivilege(privilegeArray, item);

    // Create the config relation between data set rel and child logical entity
    createConfigItemRelation(item, "DataSetRel_LogicalEntity", longtextLogicalEntityConfigId);

    // Create the config relation between data set rel and parent logical entity
    createConfigItemRelation(mainlogicalEntityConfigId, "LogicalEntity_DataSetRel", item);
    return item;
}
// function to create the data set rel property 
function createDataSetRelProperty(dataSetName, dataSetRel, mainLogicalColumnDetails, childLongTextDetails, entity_name) {
    let item = createConfigItem(dataSetName, 'DataSetRelProperty', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
    let dataSetRelProperty = {
        'PROPERTY_TYPE': 'INNERJOIN'
    };

    //Create the config property
    createConfigItemProperty(dataSetRelProperty, item);

    //Create the config privilege
    createConfigItemPrivilege(privilegeArray, item);

    // Create the config relation between composite entity and CompositeEntityNode
    createConfigItemRelation(dataSetRel, "DataSetRel_DataSetRelProperty", item);

    let childRelation = {
        'LogicalColumn_Child': childLongTextDetails[entity_name + '_UUID'],
        'LogicalColumn': mainLogicalColumnDetails[entity_name + '_UUID']
    }

    // Create the config relation between data set rel property and logical
    for (let key in childRelation) {
        createConfigItemRelation(item, "DataSetRelProperty_" + key, childRelation[key]);
    }

}
function makeUpperCaseString(str) {
    let stringValue = str.replaceAll(' ', '_').toUpperCase();
    return stringValue;
}
// function to popelate the physical column value
function populatePhysicalColumnName(dataElementList) {
    if (dataElementList.length) {

        for (let i = 0; i < dataElementList.length; i++) {
            let dataElementObject = {};
            dataElementObject['DATA_SET_UUID'] = dataElementList[i].DATA_SET_UUID;
            dataElementObject['DATA_ELEMENT_UUID'] = dataElementList[i].DATA_ELEMENT_UUID;
            dataElementObject['PHYSICAL_TABLE_COLUMN_NAME'] = makeUpperCaseString(dataElementList[i].DATA_ELEMENT_NAME);
            dataElements.push(dataElementObject)
        }

    }
}
// function to create the logical entity
function createLogicalEntity(entityName) {
    //Create the config item
    let configitemId = createConfigItem(entityName, 'LogicalEntity', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
    // Create the config property
    propertyObject = { DBTYPENAME: entityName }
    let logicalEntity_configproperty = createConfigItemProperty(propertyObject, configitemId);
    return configitemId;
}
let dataElements = [];
let configprivilegeList = [];
let configpropertyList = [];
let configrelationList = [];
let configItemList = [];
let codeSetArray = [];
let codeDescriptionArray = [];
let dataSetUiComponentTree = [];
let dataSetRelationUiComponentTree = [];
let dataSetFormFieldUiComponentData = [];

const ComparisionPortalHref = "2ad302b2-da08-4fad-8b57-cbb25c8b046b";
const TransactionListPortalHref = "b3cacc51-9b06-40b1-af63-7453603e53db";
const ComparisionActionFlowId = "c2a555ee-0724-487c-99ad-a1165f61bc86";
const TransactionActionFlowId = "b6853cad-fa41-4c89-b5fe-41a054e81822";
const infoTenantDataSourceId = 'dc576707-93e1-48df-834c-88fea0634687';
const infoAuthorizationDataSourceId = '1c49fe26-1e02-4eb0-a1e2-b4760fef3875';

const headersForDataGridColumns = {
    'OPERATION_PERFORMED_BY': 'Changed By',
    'AE_OPERATION_TYPE': 'Change Type',
    'AE_TIMESTAMP': 'Change Timestamp',
    'AE_OLD_NEW_COMPARISION_DETAILS': 'Change Data Details'
}
//  Audit columns required in the audit datagrid
let auditColumnObjects = [
    {
        'DATA_ELEMENT_NAME': 'AE_TIMESTAMP',
        'DATA_TYPE': 'VARCHAR',
        'LENGTH': 50,
        'IS_UNIQUE_KEY': 'No',
        'IS_VALUE_ALWAYS_REQUIRED': 'No',
        'PRE_DEFINED_DATA': 'No',
        'DATA_KEY': null,
        'UI_VIEW_TYPE': 'DateTimePicker'
    },
    {
        'DATA_ELEMENT_NAME': 'OPERATION_PERFORMED_BY',
        'DATA_TYPE': 'VARCHAR',
        'LENGTH': 50,
        'IS_UNIQUE_KEY': 'No',
        'IS_VALUE_ALWAYS_REQUIRED': 'No',
        'PRE_DEFINED_DATA': 'No',
        'DATA_KEY': null
    },
    {
        'DATA_ELEMENT_NAME': 'AE_OPERATION_TYPE',
        'DATA_TYPE': 'VARCHAR',
        'LENGTH': 50,
        'IS_UNIQUE_KEY': 'No',
        'IS_VALUE_ALWAYS_REQUIRED': 'No',
        'PRE_DEFINED_DATA': 'No',
        'DATA_KEY': null
    },
]

if (input.compositeEntityAction == 'Create Entity') {

    // --------------------------------------------- Validation Block----------------------------------------
    const QUERY_DataElement = "SELECT * FROM DATA_ELEMENT where DATA_SET_UUID=:DATA_SET_UUID AND (IS_TIME_SENSITIVE = 'No' OR IS_TIME_SENSITIVE IS NULL) order by DATA_ELEMENT_ID asc";
    const data_ElementId = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", QUERY_DataElement, input);
    const TimeSensitive_DataElement = "SELECT * FROM DATA_ELEMENT where DATA_SET_UUID=:DATA_SET_UUID AND IS_TIME_SENSITIVE = 'Yes' order by DATA_ELEMENT_ID asc";
    const TimeSensitive_DataElementId = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", TimeSensitive_DataElement, input);

    const dataSetQuery = `select * from DATA_SET Where DATA_SET_UUID in(Select PARENT_DATA_SET_UUID from DATA_ELEMENT  Where DATA_SET_UUID =:DATA_SET_UUID and DATA_KEY ='FOREIGN_KEY') and isnull(PHYSICAL_TABLE_NAME) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    const parsedData = await serviceOrchestrator.selectRecordsUsingQuery('INFO_APPS', dataSetQuery, input);

    const isDataElementsValid = validateDataElements(data_ElementId);
    const isParentEntityCreated = parsedData.length > 0 ? false : true;

    if (!(isDataElementsValid && isParentEntityCreated)) return;
    // --------------------------------------------- Entity Block----------------------------------------
    input.PHYSICAL_TABLE_NAME = entity_name;
    const QUERY = "SELECT PROPERTYVALUE,PROPERTYNAME,ITEMID FROM CONFIGITEMPROPERTY where PROPERTYNAME='LOOKUP_KEY' and ITEMID in (SELECT ITEMID FROM CONFIGITEMPROPERTY  where PROPERTYNAME = 'APPLICATION_ID' and PROPERTYVALUE =:AE_APPLICATION_UUID and ITEMID in (select ITEMID from CONFIGITEM where PROJECTID=:PROJECTID and ITEMTYPE = 'DataSource' and ISDELETED='0' ));";

    let mainDataSource = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", QUERY, input);

    auditApplicationID = input['AE_APPLICATION_UUID'] + "_AUDIT"

    const AUDIT_QUERY = `SELECT PROPERTYVALUE,PROPERTYNAME,ITEMID FROM CONFIGITEMPROPERTY  where PROPERTYNAME='LOOKUP_KEY' and  ITEMID in (SELECT ITEMID FROM CONFIGITEMPROPERTY  where  PROPERTYNAME = 'APPLICATION_ID' and PROPERTYVALUE="${auditApplicationID}" and ITEMID in (select ITEMID from CONFIGITEM where  PROJECTID=:PROJECTID and ITEMTYPE = 'DataSource' and ISDELETED='0' ));`

    let auditDataSource = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", AUDIT_QUERY, input);

    const QUERY_Schema = `SELECT PROPERTYVALUE,PROPERTYNAME FROM CONFIGITEMPROPERTY WHERE PROPERTYNAME ='DB_NAME' AND ITEMID IN (SELECT CHILDITEMID FROM CONFIGITEMRELATION WHERE PARENTITEMID ='${mainDataSource.ITEMID}' )`;
    let schemaname = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", QUERY_Schema, input);

    let commonFields = [{
        'dbCode': entity_name + '_UUID',
        'type': 'VARCHAR',
        'length': 50,
        'isunique': 'No'
    }];

    let jsonFields = [
        { 'dbCode': entity_name + '_LONGTEXT_DATA_UUID', 'type': 'VARCHAR', 'length': 50, 'isunique': 'No' },
        { 'dbCode': entity_name + '_LONGTEXT_DATA_ID', 'type': 'NUMBER', 'length': 10, 'isunique': 'No' },
        ...commonFields
    ];

    // Utility function to build a table data object
    const buildTableDataObject = (columnList, tableName, primaryDbCode, incrementalUuid, sequencePrimaryDbCode = null) => ({
        "COLUMN_LIST": columnList,
        "TABLE_NAME": tableName,
        "PRIMARY_DBCODE": primaryDbCode,
        "INCREMENTAL_UUID": incrementalUuid,
        ...(sequencePrimaryDbCode ? { "SEQUENCE_PRIMARY_DBCODE": sequencePrimaryDbCode } : {})
    });

    let create_table_list = [...commonFields];
    let create_audit_table_list = [...commonFields];
    let createjsonTableElementList = [...jsonFields];
    let createjsonTableElementAuditList = [...jsonFields];
    let isLongTextDataExist = false;
    let constraintDetails = {};
    const commonAuditFields = [
        { dbCode: 'AE_INSERT_ID', type: 'VARCHAR', length: 45 },
        { dbCode: 'AE_UPDATE_ID', type: 'VARCHAR', length: 45 },
        { dbCode: 'AE_TRANSACTION_ID', type: 'VARCHAR', length: 45 },
        { dbCode: 'AE_INSERT_TS', type: 'TIMESTAMP', length: 3 },
        { dbCode: 'AE_UPDATE_TS', type: 'TIMESTAMP', length: 3 }
    ];
    const auditTable = [
        { dbCode: 'AE_AUDIT_UUID', type: 'VARCHAR', length: 50, isunique: 'No' },
        { dbCode: 'OPERATION_PERFORMED_BY', type: 'VARCHAR', length: 50 },
        { dbCode: 'AE_OPERATION_TYPE', type: 'VARCHAR', length: 25 },
        { dbCode: 'AE_TIMESTAMP', type: 'TIMESTAMP', length: 3 },
        { dbCode: 'TENANT_ID', type: 'VARCHAR', length: 50 },
        { dbCode: 'AE_OLD_NEW_COMPARISION_DETAILS', type: 'LONGTEXT' },
        ...commonAuditFields
    ];
    // Define UI component data
    dataSetFormFieldUiComponentData = [{
        "title": `${input.DATA_SET_NAME} UI View (Add/Edit)`,
        "className": "DATA_SET_UI_VIEW",
        "primaryKey": "",
        "parentNodeID": "",
        "parentNodeClassName": "",
        "level": 1,
        "children": input.IS_ATTACHMENT_CAPABLITY_REQUIRED === 'Yes' ? [{
            "title": `${input.DATA_SET_NAME} Tab`,
            "className": "TAB_CONTAINER",
            "parentNodeClassName": "DATA_SET_UI_VIEW",
            "primaryKey": "",
            "parentNodeID": "",
            "level": 2,
            "children": [],
            "expanded": true
        }, {
            "title": "Attachment Tab",
            "className": "TAB_CONTAINER",
            "parentNodeClassName": "DATA_SET_UI_VIEW",
            "primaryKey": "",
            "parentNodeID": "",
            "level": 2,
            "children": [],
            "expanded": true
        }] : [],
        "expanded": true
    }];
    let dataSetUIComponent = [];
    let dataSetRelationUIComponent = [];
    let primaryGridID;
    let timeSensitiveAttributeGrid;
    if (data_ElementId.length) {
        data_ElementId.forEach(element => {
            const columnDetails = createColumnDetails(element);
            const get_dbcode_name = columnDetails.dbCode;

            if (['FOREIGN_KEY', 'AUTO_INCREMENT_UNIQUE_KEY'].includes(element.DATA_KEY)) {
                constraintDetails[get_dbcode_name] = element.DATA_KEY;
            }

            if (element.DATA_TYPE === 'LONGTEXT') {
                isLongTextDataExist = true;
                createjsonTableElementList.push(columnDetails);
                createjsonTableElementAuditList.push(columnDetails);
            } else {
                create_table_list.push(columnDetails);
                create_audit_table_list.push(columnDetails);
            }
        });

        let updatedMainTableDetails = [];
        let updatedAuditMainTableDetails = [];

        for (let columnDetails of create_table_list) {
            let columnObject = {};
            columnObject["dbCode"] = columnDetails.dbCode;
            columnObject["type"] = columnDetails.type ? columnDetails.type : "VARCHAR";
            columnObject["length"] = columnDetails.length ? columnDetails.length : columnDetails.type == 'TIMESTAMP'? 3 : 1024;
            columnObject["isunique"] = columnDetails.isunique;
            columnObject["isRequired"] = columnDetails.isRequired;
            columnObject["data_col_key"] = columnDetails.data_col_key;
            updatedMainTableDetails.push(columnObject);
            updatedAuditMainTableDetails.push(columnObject);
        }


        create_table_list.push(...commonAuditFields);
        create_audit_table_list.push(...auditTable);
        updatedMainTableDetails.push(...commonAuditFields);
        updatedAuditMainTableDetails.push(...auditTable);

        await serviceOrchestrator.createTable(entity_name, updatedMainTableDetails, mainDataSource.PROPERTYVALUE, `${entity_name}_UUID`, 'KNEX_DYNAMIC');
        await serviceOrchestrator.createTable(`${entity_name}_AUDIT`, updatedAuditMainTableDetails, auditDataSource.PROPERTYVALUE, 'AE_AUDIT_UUID', 'KNEX_DYNAMIC');

        if (isLongTextDataExist) {
            createjsonTableElementList.push(...commonAuditFields);
            createjsonTableElementAuditList.push(...auditTable);
            await serviceOrchestrator.createTable(`${entity_name}_LONGTEXT_DATA`, createjsonTableElementList, mainDataSource.PROPERTYVALUE, `${entity_name}_LONGTEXT_DATA_UUID`, 'KNEX_DYNAMIC');
            await serviceOrchestrator.createTable(`${entity_name}_LONGTEXT_DATA_AUDIT`, createjsonTableElementAuditList, auditDataSource.PROPERTYVALUE, 'AE_AUDIT_UUID', 'KNEX_DYNAMIC');
        }
    }


    // Generate column lists using map for better performance
    const columnList = create_table_list.map(item => item.dbCode);
    const auditColumnList = create_audit_table_list.map(item => item.dbCode);
    const longtextColumnList = isLongTextDataExist ? createjsonTableElementList.map(item => item.dbCode) : [];

    // Build table data objects
    const mainTableDataObject = buildTableDataObject(columnList, entity_name, `${entity_name}_UUID`, `${entity_name}_ID`);
    const auditTableDataObject = buildTableDataObject(auditColumnList, `${entity_name}_AUDIT`, `${entity_name}_UUID`, `${entity_name}_ID`);
    const longTextTableDataObject = isLongTextDataExist ? buildTableDataObject(longtextColumnList, `${entity_name}_LONGTEXT_DATA`, `${entity_name}_UUID`, `${entity_name}_LONGTEXT_DATA_ID`, `${entity_name}_LONGTEXT_DATA_UUID`) : null;



    let mainlogicalEntityConfigId = createLogicalEntity(entity_name);
    let [mainPhysicalEntityConfigId, mainSingleSelectQuery] = createPhysicalEntity(entity_name, mainlogicalEntityConfigId, mainTableDataObject, isLongTextDataExist, schemaname, mainDataSource, auditDataSource);
    createPhysicalColumn(mainPhysicalEntityConfigId, create_table_list, entity_name);
    let mainLogicalColumnDetails = createLogicalColumn(mainlogicalEntityConfigId, create_table_list, entity_name, constraintDetails,mainDataSource);
    let commonMainFormSectionId = createFormSection(entity_name, 2);
    let formSectionIdList = [commonMainFormSectionId];
    let commonAttachmentFormSectionId;
    if (input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes') {
        commonAttachmentFormSectionId = createFormSection('ATTACHMENT', 1);
        formSectionIdList.push(commonAttachmentFormSectionId)
    }
    let addMainFormId = createForm('Add', input.DATA_SET_NAME, formSectionIdList, mainlogicalEntityConfigId, 'Main');
    let formFieldDetails = await createFormField(commonMainFormSectionId, mainLogicalColumnDetails, 'Main', commonAttachmentFormSectionId, data_ElementId, entity_name, mainDataSource);
    createButtonPanelAndButton('Add', { "BUTTON_PANEL_POSITION": "TOP", "MODE": "Insert" }, ['Save'], "Form_ButtonPanel", addMainFormId, input.DATA_SET_NAME, isLongTextDataExist);
    let editMainFormId = createForm('Edit', input.DATA_SET_NAME, formSectionIdList, mainlogicalEntityConfigId, 'Main');
    createButtonPanelAndButton('Edit', { "BUTTON_PANEL_POSITION": "TOP", "MODE": "Edit" }, ['Update', 'Delete'], "Form_ButtonPanel", editMainFormId, input.DATA_SET_NAME, isLongTextDataExist);

    let dataGridList = [
        {
            "Parent": input.DATA_SET_NAME,
            "Child": "",
            "Key": "Primary",
            "DATA_SET_PARENT_UUID": "",
            "DATA_SET_CHILD_UUID": "",
            "DATA_SET_RELATIONSHIP_UUID": ""
        }
    ];

    let foreignKeyDataElement = data_ElementId.length && data_ElementId.filter(item => item.DATA_KEY == 'FOREIGN_KEY');

    if (foreignKeyDataElement && foreignKeyDataElement.length) {
        for (let element of foreignKeyDataElement) {
            const dataSetRelation = `SELECT * FROM DATA_SET_RELATIONSHIP where DATA_SET_PARENT_UUID=${"'" + element.PARENT_DATA_SET_UUID + "'"} and DATA_SET_CHILD_UUID=${"'" + input.DATA_SET_UUID + "'"};`
            let dataSetRelationData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", dataSetRelation, input);

            const parentDataSet = `SELECT DATA_SET_NAME FROM DATA_SET where DATA_SET_UUID=${"'" + element.PARENT_DATA_SET_UUID + "'"};`
            let parentDataSetData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", parentDataSet, input);
            let object = {
                "Parent": parentDataSetData[0].DATA_SET_NAME,
                "Child": input.DATA_SET_NAME,
                "Key": "Foreign",
                "DATA_SET_PARENT_UUID": dataSetRelationData[0].DATA_SET_PARENT_UUID,
                "DATA_SET_CHILD_UUID": dataSetRelationData[0].DATA_SET_CHILD_UUID,
                "DATA_SET_RELATIONSHIP_UUID": dataSetRelationData[0].DATA_SET_RELATIONSHIP_UUID
            };
            dataGridList.push(object);
        }
    }
    dataSetUIComponent.push({
        "DATA_SET_UI_VIEW_UUID": uuid(),
        "DATA_SET_UUID": input.DATA_SET_UUID,
        "DATA_SET_UI_VIEW_NAME": 'Add ' + input.DATA_SET_NAME + ' [(SUB PAGE)(SYSTEM)]',
        "DATA_SET_UI_VIEW_TYPE": 'ADD_FORM',
        "DATA_SET_UI_VIEW_CONFIG_ITEM_ID": addMainFormId,
        "COMPONENT_PER_ROW": 2
    });
    dataSetUIComponent.push({
        "DATA_SET_UI_VIEW_UUID": uuid(),
        "DATA_SET_UUID": input.DATA_SET_UUID,
        "DATA_SET_UI_VIEW_NAME": 'Edit ' + input.DATA_SET_NAME + ' [(SUB PAGE)(SYSTEM)]',
        "DATA_SET_UI_VIEW_TYPE": 'EDIT_FORM',
        "DATA_SET_UI_VIEW_CONFIG_ITEM_ID": editMainFormId,
        "COMPONENT_PER_ROW": 2
    });

    let configItemName;
    for (let gridList of dataGridList) {
        configItemName = gridList && gridList['Parent'] && gridList['Child'] ? gridList['Child'] + ' By ' + gridList['Parent'] : gridList['Parent'];
        let detailsMainDataGrid = createDataGrid(configItemName, addMainFormId);
        createLogicalEntityOperation(detailsMainDataGrid, gridList, entity_name, mainDataSource, auditDataSource, isLongTextDataExist, mainSingleSelectQuery);
        let dataSetDataGridUiComponentData = await createDataGridColumn('No', detailsMainDataGrid, formFieldDetails, mainLogicalColumnDetails, entity_name, data_ElementId);
        createButtonPanelAndButton('List', { "BUTTON_PANEL_POSITION": "TOP", "MODE": "Insert" }, ['Add', 'Inline Add'], "DataGrid_ButtonPanel", detailsMainDataGrid, configItemName, isLongTextDataExist);

        if (gridList && gridList['Key'] == 'Primary') {
            let detailsAuditDataGrid = createDataGrid(configItemName + ' Audit', addMainFormId);
            createLogicalEntityOperation(detailsAuditDataGrid, gridList, entity_name, mainDataSource, auditDataSource, isLongTextDataExist, mainSingleSelectQuery, auditTableDataObject, 'Audit');
            let auditDataSetDataGridUiComponentData = await createDataGridColumn('No', detailsAuditDataGrid, null, mainLogicalColumnDetails, entity_name, data_ElementId, 'Audit');
            dataSetUIComponent.push({
                "DATA_SET_UI_VIEW_UUID": uuid(),
                "DATA_SET_UUID": input.DATA_SET_UUID,
                "DATA_SET_UI_VIEW_NAME": input.DATA_SET_NAME + ' List ' + '[(SUB PAGE)(SYSTEM)]',
                "DATA_SET_UI_VIEW_TYPE": 'DATAGRID',
                "DATA_SET_UI_VIEW_CONFIG_ITEM_ID": detailsMainDataGrid,
                "JSON_DATA": JSON.stringify(dataSetDataGridUiComponentData)
            });
            dataSetUIComponent.push({
                "DATA_SET_UI_VIEW_UUID": uuid(),
                "DATA_SET_UUID": input.DATA_SET_UUID,
                "DATA_SET_UI_VIEW_NAME": input.DATA_SET_NAME + ' Audit List ' + '[(SUB PAGE)(SYSTEM)]',
                "DATA_SET_UI_VIEW_TYPE": 'AUDIT_DATAGRID',
                "DATA_SET_UI_VIEW_CONFIG_ITEM_ID": detailsAuditDataGrid,
                "JSON_DATA": JSON.stringify(auditDataSetDataGridUiComponentData)
            });
            timeSensitiveAttributeGrid = detailsMainDataGrid;
        } else if (gridList && gridList['Key'] == 'Foreign' && gridList['DATA_SET_PARENT_UUID'] && gridList['DATA_SET_CHILD_UUID']) {
            dataSetRelationUIComponent.push({
                "DATA_SET_RELATIONSHIP_UI_VIEW_UUID": uuid(),
                "DATA_SET_RELATIONSHIP_UUID": gridList['DATA_SET_RELATIONSHIP_UUID'],
                "DATA_SET_RELATIONSHIP_UI_VIEW_NAME": gridList['Child'] + ' By ' + gridList['Parent'] + ' List ' + '[(SUB PAGE)(SYSTEM)]',
                "DATA_SET_RELATIONSHIP_UI_VIEW_TYPE": 'DATAGRID',
                "DATA_SET_RELATIONSHIP_UI_VIEW_CONFIG_ITEM_ID": detailsMainDataGrid,
                "JSON_DATA": JSON.stringify(dataSetDataGridUiComponentData)
            })
        }
        primaryGridID = detailsMainDataGrid;
    }
    if (isLongTextDataExist && createjsonTableElementList.length) {
        let longtextLogicalEntityConfigId = createLogicalEntity(entity_name + '_LONGTEXT_DATA');
        let [longtextPhysicalEntityConfigId, singleSelectQuery] = createPhysicalEntity(entity_name + '_LONGTEXT_DATA', longtextLogicalEntityConfigId, longTextTableDataObject, isLongTextDataExist, schemaname, mainDataSource, auditDataSource);
        createPhysicalColumn(longtextPhysicalEntityConfigId, createjsonTableElementList, entity_name);
        let longtextLogicalColumnDetails = createLogicalColumn(longtextLogicalEntityConfigId, createjsonTableElementList, entity_name, constraintDetails,mainDataSource);
        let commonLongTextFormSectionId = createFormSection(entity_name + '_LONGTEXT_DATA', 1);
        let addLongTextFormId = createForm('Add', input.DATA_SET_NAME + ' LongText Data', [commonLongTextFormSectionId], longtextLogicalEntityConfigId, 'LongText');
        let returnedLongtextCodeSetId = await createFormField(commonLongTextFormSectionId, longtextLogicalColumnDetails, 'LongText', '', data_ElementId, entity_name, mainDataSource);
        let compositeEntityId = createCompositeEntity(input.DATA_SET_NAME);
        let rootCompositeEntityChild = {
            'LogicalEntity': mainlogicalEntityConfigId,
            'PhysicalEntity': mainPhysicalEntityConfigId,
            'InsertForm': addMainFormId,
            'EditForm': editMainFormId,
            'DataGrid': primaryGridID
        };
        let rootCompositeEntityId = createRootCompositeEntityNode(input.DATA_SET_NAME, compositeEntityId, rootCompositeEntityChild);
        let compositeEntityNodeChild = {
            'LogicalEntity': longtextLogicalEntityConfigId,
            'PhysicalEntity': longtextPhysicalEntityConfigId,
            'InsertForm': addLongTextFormId
        };
        let compositeEntityNodeProperty = {
            'ADDTO_PARENT_DISPLAY': '1',
            'ORDER': 5,
            'IS_EXPRESSION_AVAILABLE': '0',
            'ADDED_HIDDEN': '0',
            'ACCESSBILITY_REGEX': '',
            'ADDTO_PARENT_GRID': '0',
            'EDITABILITY_REGEX': '',
            'EXPRESSION_FIELD_STRING': '',
            'ADDTO_PARENT_EDITFORM': '1',
            'DISPLAY_NODE_NAME': camelCaseString(input.DATA_SET_NAME),
            'SHOW_GRID': '0',
            'ADDTO_PARENT_INSERTFORM': '1'
        }
        let compositeEntityNodeId = createCompositeEntityNode(input.DATA_SET_NAME, compositeEntityId, rootCompositeEntityId, compositeEntityNodeChild, compositeEntityNodeProperty);
        let dataSetRel = createDataSetRel(input.DATA_SET_NAME, mainlogicalEntityConfigId, longtextLogicalEntityConfigId);
        createDataSetRelProperty(input.DATA_SET_NAME, dataSetRel, mainLogicalColumnDetails, longtextLogicalColumnDetails, entity_name)
    }
    if (TimeSensitive_DataElementId && TimeSensitive_DataElementId.length) {
        const time_sensitive_entity_name = entity_name + '_ATTRIBUTE';
        const time_sensitive_summary_entity_name = entity_name + '_SUMMARY';
        let time_sensitive_entity_name_fields = [{
            'dbCode': time_sensitive_entity_name + '_UUID',
            'type': 'VARCHAR',
            'length': 50,
            'isunique': 'No'
        }, {
            'dbCode': time_sensitive_entity_name + '_ID',
            'type': 'NUMBER',
            'length': 10,
            'isunique': 'No'
        }, {
            'dbCode': 'DATA_ELEMENT',
            'type': 'VARCHAR',
            'length': 50,
            'isunique': 'No',
            'isRequired': 'Yes'

        }, {
            'dbCode': 'EFECTIVE_DATE',
            'type': 'TIMESTAMP',
            'isunique': 'No',
            'isRequired': 'Yes'
        }, {
            'dbCode': 'END_DATE',
            'type': 'TIMESTAMP',
            'isunique': 'No',
            'isRequired': 'Yes'
        }, {
            'dbCode': 'DATA_ELEMENT_VALUE',
            'type': 'VARCHAR',
            'length': 1024,
            'isunique': 'No'
        }, {
            'dbCode': entity_name + '_UUID',
            'type': 'VARCHAR',
            'length': 50,
            'isunique': 'No'
        }];

        let time_sensitive_summary_entity_name_fields = [{
            'dbCode': time_sensitive_summary_entity_name + '_UUID',
            'type': 'VARCHAR',
            'length': 50,
            'isunique': 'No'
        }, {
            'dbCode': time_sensitive_summary_entity_name + '_ID',
            'type': 'NUMBER',
            'length': 10,
            'isunique': 'No'
        }, {
            'dbCode': 'EFECTIVE_DATE',
            'type': 'TIMESTAMP',
            'isunique': 'No'
        }, {
            'dbCode': 'END_DATE',
            'type': 'TIMESTAMP',
            'isunique': 'No'
        }, {
            'dbCode': entity_name + '_UUID',
            'type': 'VARCHAR',
            'length': 50,
            'isunique': 'No'
        }];
        let time_sensitive_table_list = [...time_sensitive_entity_name_fields];
        let time_sensitive_audit_table_list = [...time_sensitive_entity_name_fields];
        let time_sensitive_summary_table_list = [...time_sensitive_summary_entity_name_fields];
        let time_sensitive_summary_table_audit_list = [...time_sensitive_summary_entity_name_fields];
        let constraintDetails = {};

        TimeSensitive_DataElementId.forEach(element => {
            const columnDetails = createColumnDetails(element);
            const get_dbcode_name = columnDetails.dbCode;

            if (['FOREIGN_KEY', 'AUTO_INCREMENT_UNIQUE_KEY'].includes(element.DATA_KEY)) {
                constraintDetails[get_dbcode_name] = element.DATA_KEY;
            }
            time_sensitive_summary_table_list.push(columnDetails);
            time_sensitive_summary_table_audit_list.push(columnDetails);
        });
        let updatedTimeSensitiveDetails = [];
        let updatedTimeSensitiveAuditDetails = [];
        let updatedTimeSensitivesummaryDetails = [];
        let updatedTimeSensitivesummaryAuditDetails = [];

        for (let columnDetails of time_sensitive_table_list) {
            let columnObject = {};
            columnObject["dbCode"] = columnDetails.dbCode;
            columnObject["type"] = columnDetails.type ? columnDetails.type : "VARCHAR";
            columnObject["isunique"] = columnDetails.isunique;
            columnObject["isRequired"] = columnDetails.isRequired;
            columnObject["data_col_key"] = columnDetails.data_col_key;
            if (columnDetails.type != 'TIMESTAMP') {
                columnObject["length"] = columnDetails.length ? columnDetails.length : 1024
            } else if (columnDetails.type == 'TIMESTAMP') {
                columnObject["length"] = 3
            };
            updatedTimeSensitiveDetails.push(columnObject);
            updatedTimeSensitiveAuditDetails.push(columnObject);
        }

        for (let columnDetails of time_sensitive_summary_table_list) {
            let columnObject = {};
            columnObject["dbCode"] = columnDetails.dbCode;
            columnObject["type"] = columnDetails.type ? columnDetails.type : "VARCHAR";
            if (columnDetails.type != 'TIMESTAMP') {
                columnObject["length"] = columnDetails.length ? columnDetails.length : 1024
            }
            else if (columnDetails.type == 'TIMESTAMP') {
                columnObject["length"] = 3
            };
            columnObject["isunique"] = columnDetails.isunique;
            columnObject["isRequired"] = columnDetails.isRequired;
            columnObject["data_col_key"] = columnDetails.data_col_key;
            updatedTimeSensitivesummaryDetails.push(columnObject);
            updatedTimeSensitivesummaryAuditDetails.push(columnObject);
        }
        time_sensitive_table_list.push(...commonAuditFields);
        time_sensitive_audit_table_list.push(...auditTable);
        time_sensitive_summary_table_list.push(...commonAuditFields)
        time_sensitive_summary_table_audit_list.push(...auditTable)
        updatedTimeSensitiveDetails.push(...commonAuditFields);
        updatedTimeSensitiveAuditDetails.push(...auditTable);
        updatedTimeSensitivesummaryDetails.push(...commonAuditFields);
        updatedTimeSensitivesummaryAuditDetails.push(...auditTable);

        await serviceOrchestrator.createTable(time_sensitive_entity_name, updatedTimeSensitiveDetails, mainDataSource.PROPERTYVALUE, `${time_sensitive_entity_name}_UUID`, 'KNEX_DYNAMIC');
        await serviceOrchestrator.createTable(`${time_sensitive_entity_name}_AUDIT`, updatedTimeSensitiveAuditDetails, auditDataSource.PROPERTYVALUE, 'AE_AUDIT_UUID', 'KNEX_DYNAMIC');
        await serviceOrchestrator.createTable(time_sensitive_summary_entity_name, updatedTimeSensitivesummaryDetails, mainDataSource.PROPERTYVALUE, `${time_sensitive_summary_entity_name}_UUID`, 'KNEX_DYNAMIC');
        await serviceOrchestrator.createTable(`${time_sensitive_summary_entity_name}_AUDIT`, updatedTimeSensitivesummaryAuditDetails, auditDataSource.PROPERTYVALUE, 'AE_AUDIT_UUID', 'KNEX_DYNAMIC');

        const timeSensitiveColumnList = time_sensitive_table_list.map(item => item.dbCode);
        const timeSensitiveAuditColumnList = time_sensitive_audit_table_list.map(item => item.dbCode);
        const timeSensitivesummaryColumnList = time_sensitive_summary_table_list.map(item => item.dbCode);
        const timeSensitivesummaryAuditColumnList = time_sensitive_summary_table_audit_list.map(item => item.dbCode);

        const timeSensitiveTableDataObject = buildTableDataObject(timeSensitiveColumnList, time_sensitive_entity_name, `${time_sensitive_entity_name}_UUID`, `${time_sensitive_entity_name}_ID`);
        const timeSensitiveauditTableDataObject = buildTableDataObject(timeSensitiveAuditColumnList, `${time_sensitive_entity_name}_AUDIT`, `${time_sensitive_entity_name}_UUID`, `${time_sensitive_entity_name}_ID`);
        const timeSensitivesummaryTableDataObject = buildTableDataObject(timeSensitivesummaryColumnList, time_sensitive_summary_entity_name, `${time_sensitive_summary_entity_name}_UUID`, `${time_sensitive_summary_entity_name}_ID`);
        const timeSensitivesummaryAuditTableDataObject = buildTableDataObject(timeSensitivesummaryAuditColumnList, time_sensitive_summary_entity_name, `${time_sensitive_summary_entity_name}_UUID`, `${time_sensitive_summary_entity_name}_ID`);

        let time_sensitive_logicalEntityConfigId = createLogicalEntity(time_sensitive_entity_name);
        let time_sensitive_summary_logicalEntityConfigId = createLogicalEntity(time_sensitive_summary_entity_name);

        let [timeSensitivePhysicalEntityConfigId, singleSelectQuery] = createPhysicalEntity(time_sensitive_entity_name, time_sensitive_logicalEntityConfigId, timeSensitiveTableDataObject, isLongTextDataExist, schemaname, mainDataSource, auditDataSource);
        let [timeSensitivesummaryPhysicalEntityConfigId, singleSelectQuerysummary] = createPhysicalEntity(time_sensitive_summary_entity_name, time_sensitive_summary_logicalEntityConfigId, timeSensitivesummaryTableDataObject, isLongTextDataExist, schemaname, mainDataSource, auditDataSource);

        createPhysicalColumn(timeSensitivePhysicalEntityConfigId, time_sensitive_table_list, time_sensitive_entity_name);
        createPhysicalColumn(timeSensitivesummaryPhysicalEntityConfigId, time_sensitive_summary_table_list, time_sensitive_summary_entity_name);

        let timeSensitiveLogicalColumnDetails = createLogicalColumn(time_sensitive_logicalEntityConfigId, time_sensitive_table_list, time_sensitive_entity_name, constraintDetails,mainDataSource);
        let timeSensitivesummaryLogicalColumnDetails = createLogicalColumn(time_sensitive_summary_logicalEntityConfigId, time_sensitive_summary_table_list, time_sensitive_summary_entity_name, constraintDetails,mainDataSource);

        let timeSensitiveFormSectionId = createFormSection(time_sensitive_entity_name, 2);

        let formSectionIdList = [timeSensitiveFormSectionId];
        let commonAttachmentFormSectionId;
        let timeSensitiveAttributeFormId = createForm('Add', time_sensitive_entity_name, formSectionIdList, time_sensitive_logicalEntityConfigId, 'Main', 'repeatable');
        let timeSensitiveFormFields = [{
            "DATA_ELEMENT_NAME": "DATA_ELEMENT",
            "LABEL": "Data Element",
            "DATA_SET_UUID": input.DATA_SET_UUID,
            "IS_UNIQUE_KEY": "No",
            "IS_VALUE_ALWAYS_REQUIRED": "Yes",
            "PRE_DEFINED_DATA": "No",
            "DATA_TYPE": "VARCHAR",
            "UI_VIEW_TYPE": "SelectOption",
            "LENGTH": 500,
            "IS_TIME_SENSITIVE": "Yes"
        }, {
            "DATA_ELEMENT_NAME": "DATA_ELEMENT_VALUE",
            "LABEL": "Value",
            "DATA_SET_UUID": input.DATA_SET_UUID,
            "IS_UNIQUE_KEY": "No",
            "IS_VALUE_ALWAYS_REQUIRED": "No",
            "PRE_DEFINED_DATA": "No",
            "DATA_TYPE": "VARCHAR",
            "UI_VIEW_TYPE": "TextBox",
            "LENGTH": 500,
            "IS_TIME_SENSITIVE": "Yes"
        }, {
            "DATA_ELEMENT_NAME": "EFECTIVE_DATE",
            "LABEL": "Efective Date",
            "DATA_SET_UUID": input.DATA_SET_UUID,
            "IS_UNIQUE_KEY": "No",
            "IS_VALUE_ALWAYS_REQUIRED": "No",
            "PRE_DEFINED_DATA": "No",
            "DATA_TYPE": "TIMESTAMP",
            "UI_VIEW_TYPE": "DatePicker",
            "IS_TIME_SENSITIVE": "Yes"
        }, {
            "DATA_ELEMENT_NAME": "END_DATE",
            "LABEL": "End Date",
            "DATA_SET_UUID": input.DATA_SET_UUID,
            "IS_UNIQUE_KEY": "No",
            "IS_VALUE_ALWAYS_REQUIRED": "No",
            "PRE_DEFINED_DATA": "No",
            "DATA_TYPE": "TIMESTAMP",
            "UI_VIEW_TYPE": "DatePicker",
            "IS_TIME_SENSITIVE": "Yes"
        }]
        let multivalueList = '';
        TimeSensitive_DataElementId.forEach((item, index) => {
            multivalueList += replaceSpaceAndMakeUpperCaseString(item.DATA_ELEMENT_NAME) + ':' + item.DATA_ELEMENT_NAME;
            if (index < TimeSensitive_DataElementId.length - 1) {
                multivalueList += ',';
            }
        });
        let formFieldDetails = await createFormField(timeSensitiveFormSectionId, timeSensitiveLogicalColumnDetails, 'Main', commonAttachmentFormSectionId, timeSensitiveFormFields, time_sensitive_entity_name, mainDataSource, multivalueList);
        let summrayDataGridCOlumns = [{
            "DATA_ELEMENT_NAME": "EFECTIVE_DATE",
            "LABEL": "Efective Date",
            "DATA_SET_UUID": input.DATA_SET_UUID,
            "IS_UNIQUE_KEY": "No",
            "IS_VALUE_ALWAYS_REQUIRED": "No",
            "PRE_DEFINED_DATA": "No",
            "DATA_TYPE": "TIMESTAMP",
            "UI_VIEW_TYPE": "DatePicker",
            "IS_TIME_SENSITIVE": "Yes"
        }, {
            "DATA_ELEMENT_NAME": "END_DATE",
            "LABEL": "End Date",
            "DATA_SET_UUID": input.DATA_SET_UUID,
            "IS_UNIQUE_KEY": "No",
            "IS_VALUE_ALWAYS_REQUIRED": "No",
            "PRE_DEFINED_DATA": "No",
            "DATA_TYPE": "TIMESTAMP",
            "UI_VIEW_TYPE": "DatePicker",
            "IS_TIME_SENSITIVE": "Yes"
        }];
        let TimeSensitivedataGridList = [
            {
                "Parent": entity_name,
                "Child": time_sensitive_entity_name,
                "Key": "Primary",
                "DATA_SET_PARENT_UUID": "",
                "DATA_SET_CHILD_UUID": "",
                "DATA_SET_RELATIONSHIP_UUID": "",
                "Logical_columns": timeSensitiveLogicalColumnDetails,
                "singleSelectQuery": singleSelectQuery,
                "dataGridColumns": timeSensitiveFormFields,
                "auditPreFix": "TIME_SENSITIVE_ATTRIBUTE",
                "gridType": "TIME_SENSITIVE_ATTRIBUTE_DATAGRID"
            }, {
                "Parent": entity_name,
                "Child": time_sensitive_summary_entity_name,
                "Key": "Primary",
                "DATA_SET_PARENT_UUID": "",
                "DATA_SET_CHILD_UUID": "",
                "DATA_SET_RELATIONSHIP_UUID": "",
                "Logical_columns": timeSensitivesummaryLogicalColumnDetails,
                "singleSelectQuery": singleSelectQuerysummary,
                "dataGridColumns": summrayDataGridCOlumns,
                "auditPreFix": "TIME_SENSITIVE_SUMMARY",
                "gridType": "TIME_SENSITIVE_SUMMARY_DATAGRID"
            }
        ];
        dataSetUIComponent.push({
            "DATA_SET_UI_VIEW_UUID": uuid(),
            "DATA_SET_UUID": input.DATA_SET_UUID,
            "DATA_SET_UI_VIEW_NAME": 'Add ' + time_sensitive_entity_name + ' [(SUB PAGE)(SYSTEM)]',
            "DATA_SET_UI_VIEW_TYPE": 'TIME_SENSITIVE_ATTRIBUTE_FORM',
            "DATA_SET_UI_VIEW_CONFIG_ITEM_ID": timeSensitiveAttributeFormId,
            "COMPONENT_PER_ROW": 2
        });
        let configItemName;
        let logicalColumnDetails;

        for (let gridList of TimeSensitivedataGridList) {
            configItemName = gridList['Child'];
            logicalColumnDetails = gridList['Logical_columns']
            let detailsMainDataGrid = createDataGrid(configItemName);
            createLogicalEntityOperation(detailsMainDataGrid, gridList, configItemName, mainDataSource, auditDataSource, isLongTextDataExist, gridList['singleSelectQuery']);
            let dataSetDataGridUiComponentData = await createDataGridColumn('No', detailsMainDataGrid, null, logicalColumnDetails, configItemName, gridList['dataGridColumns']);
            createButtonPanelAndButton('List', { "BUTTON_PANEL_POSITION": "TOP", "MODE": "Insert" }, ['Add', 'Inline Add'], "DataGrid_ButtonPanel", detailsMainDataGrid, configItemName, isLongTextDataExist);

            if (gridList && gridList['Key'] == 'Primary') {
                let detailsAuditDataGrid = createDataGrid(configItemName + ' Audit');
                createLogicalEntityOperation(detailsAuditDataGrid, gridList, configItemName, mainDataSource, auditDataSource, isLongTextDataExist, gridList['singleSelectQuery'], timeSensitiveauditTableDataObject, 'Audit');
                let auditDataSetDataGridUiComponentData = await createDataGridColumn('No', detailsAuditDataGrid, null, logicalColumnDetails, configItemName, TimeSensitive_DataElementId, 'Audit');
                dataSetUIComponent.push({
                    "DATA_SET_UI_VIEW_UUID": uuid(),
                    "DATA_SET_UUID": input.DATA_SET_UUID,
                    "DATA_SET_UI_VIEW_NAME": configItemName + ' List ' + '[(SUB PAGE)(SYSTEM)]',
                    "DATA_SET_UI_VIEW_TYPE": gridList['gridType'],
                    "DATA_SET_UI_VIEW_CONFIG_ITEM_ID": detailsMainDataGrid,
                    "JSON_DATA": JSON.stringify(dataSetDataGridUiComponentData)
                });
                dataSetUIComponent.push({
                    "DATA_SET_UI_VIEW_UUID": uuid(),
                    "DATA_SET_UUID": input.DATA_SET_UUID,
                    "DATA_SET_UI_VIEW_NAME": configItemName + ' Audit List ' + '[(SUB PAGE)(SYSTEM)]',
                    "DATA_SET_UI_VIEW_TYPE": gridList['auditPreFix'] + '_AUDIT_DATAGRID',
                    "DATA_SET_UI_VIEW_CONFIG_ITEM_ID": detailsAuditDataGrid,
                    "JSON_DATA": JSON.stringify(auditDataSetDataGridUiComponentData)
                });
            }
        }
        let compositeEntityId = createCompositeEntity(input.DATA_SET_NAME);
        let rootCompositeEntityChild = {
            'LogicalEntity': mainlogicalEntityConfigId,
            'PhysicalEntity': mainPhysicalEntityConfigId,
            'InsertForm': addMainFormId,
            'EditForm': editMainFormId,
            'DataGrid': primaryGridID
        };
        let rootCompositeEntityId = createRootCompositeEntityNode(input.DATA_SET_NAME, compositeEntityId, rootCompositeEntityChild);
        let nodeBusinessRule = createNodeBusinessRule(entity_name, rootCompositeEntityId, compositeEntityId);
        let compositeEntityNodeChildAttribute = {
            'LogicalEntity': time_sensitive_logicalEntityConfigId,
            'PhysicalEntity': timeSensitivePhysicalEntityConfigId,
            'InsertForm': timeSensitiveAttributeFormId,
        };
        let compositeEntityNodeChildsummary = {
            'LogicalEntity': time_sensitive_summary_logicalEntityConfigId,
            'PhysicalEntity': timeSensitivesummaryPhysicalEntityConfigId,
        };
        let compositeEntityNodePropertyAttribute = {
            'ADDTO_PARENT_DISPLAY': '1',
            'ORDER': 5,
            'IS_EXPRESSION_AVAILABLE': '0',
            'ADDED_HIDDEN': '0',
            'ACCESSBILITY_REGEX': '',
            'ADDTO_PARENT_GRID': '0',
            'EDITABILITY_REGEX': '',
            'EXPRESSION_FIELD_STRING': '',
            'ADDTO_PARENT_EDITFORM': '1',
            'DISPLAY_NODE_NAME': camelCaseString(time_sensitive_entity_name),
            'SHOW_GRID': '0',
            'ADDTO_PARENT_INSERTFORM': '1'
        }
        let compositeEntityNodePropertySummary = {
            'ADDTO_PARENT_DISPLAY': '0',
            'ORDER': 5,
            'IS_EXPRESSION_AVAILABLE': '0',
            'ADDED_HIDDEN': '1',
            'ACCESSBILITY_REGEX': '',
            'ADDTO_PARENT_GRID': '0',
            'EDITABILITY_REGEX': '',
            'EXPRESSION_FIELD_STRING': '',
            'ADDTO_PARENT_EDITFORM': '1',
            'DISPLAY_NODE_NAME': camelCaseString(time_sensitive_summary_entity_name),
            'SHOW_GRID': '0',
            'ADDTO_PARENT_INSERTFORM': '0'
        }
        let compositeEntityNodeIdAttribute = createCompositeEntityNode(input.DATA_SET_NAME + ' Attribute', compositeEntityId, rootCompositeEntityId, compositeEntityNodeChildAttribute, compositeEntityNodePropertyAttribute);
        let compositeEntityNodeIdSummary = createCompositeEntityNode(input.DATA_SET_NAME + ' Summary', compositeEntityId, rootCompositeEntityId, compositeEntityNodeChildsummary, compositeEntityNodePropertySummary);
        let dataSetRelAttribute = createDataSetRel(input.DATA_SET_NAME + ' Attribute', mainlogicalEntityConfigId, time_sensitive_logicalEntityConfigId);
        let dataSetRelSummary = createDataSetRel(input.DATA_SET_NAME + ' Summary', mainlogicalEntityConfigId, time_sensitive_summary_logicalEntityConfigId);
        createDataSetRelProperty(input.DATA_SET_NAME + ' Attribute', dataSetRelAttribute, mainLogicalColumnDetails, timeSensitiveLogicalColumnDetails, entity_name)
        createDataSetRelProperty(input.DATA_SET_NAME + ' Summary', dataSetRelSummary, mainLogicalColumnDetails, timeSensitivesummaryLogicalColumnDetails, entity_name)
    }

    for (let uiComponents of dataSetUIComponent) {
        let dataSetUiComponentTreeObject = {};
        dataSetUiComponentTreeObject['DATA_SET_UI_VIEW_UUID'] = uiComponents.DATA_SET_UI_VIEW_UUID;
        dataSetUiComponentTreeObject['DATA_SET_UI_VIEW_TREE_JSON'] = ['ADD_FORM', 'EDIT_FORM'].includes(uiComponents.DATA_SET_UI_VIEW_TYPE) ? JSON.stringify(dataSetFormFieldUiComponentData) : uiComponents && uiComponents?.JSON_DATA;
        dataSetUiComponentTreeObject['DATA_SET_UI_VIEW_TREE_LEVEL'] = ['ADD_FORM', 'EDIT_FORM'].includes(uiComponents.DATA_SET_UI_VIEW_TYPE) && input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' ? 4 : 3;
        dataSetUiComponentTree.push(dataSetUiComponentTreeObject);
    }
    for (let relationUiComponents of dataSetRelationUIComponent) {
        let dataSetRelationUiComponentTreeObject = {};
        dataSetRelationUiComponentTreeObject['DATA_SET_RELATIONSHIP_UI_VIEW_UUID'] = relationUiComponents.DATA_SET_RELATIONSHIP_UI_VIEW_UUID;
        dataSetRelationUiComponentTreeObject['DATA_SET_RELATIONSHIP_UI_VIEW_TREE_JSON'] = relationUiComponents && relationUiComponents?.JSON_DATA;
        dataSetRelationUiComponentTreeObject['DATA_SET_RELATIONSHIP_UI_VIEW_TREE_LEVEL'] = 1;
        dataSetRelationUiComponentTree.push(dataSetRelationUiComponentTreeObject);
    }
    populatePhysicalColumnName(data_ElementId);
    populatePhysicalColumnName(TimeSensitive_DataElementId);
    input["AppEngChildEntity:DATA_ELEMENT"] = dataElements;
    input["AppEngChildEntity:CONFIGITEM"] = configItemList;
    input["AppEngChildEntity:CONFIGITEMPROPERTY"] = configpropertyList;
    input["AppEngChildEntity:CONFIGITEMPRIVILEGE"] = configprivilegeList;
    input["AppEngChildEntity:CONFIGITEMRELATION"] = configrelationList;
    input["AppEngChildEntity:CODE_SET"] = codeSetArray;
    input["AppEngChildEntity:CODE_DESCRIPTION"] = codeDescriptionArray;
    input["AppEngChildEntity:DATA_SET_UI_VIEW"] = dataSetUIComponent;
    input["AppEngChildEntity:DATA_SET_RELATIONSHIP_UI_VIEW"] = dataSetRelationUIComponent;
    input["AppEngChildEntity:DATA_SET_UI_VIEW_TREE"] = dataSetUiComponentTree;
    input["AppEngChildEntity:DATA_SET_RELATIONSHIP_UI_VIEW_TREE"] = dataSetRelationUiComponentTree;
}

//  ---------------------------------------------------------- Create Logical & Physical Entitites Block -----------------------------------------------------

if (input.compositeEntityAction == 'Create Logical & Physical Entitites') {

    // --------------------------------------------- Validation Block----------------------------------------
    const QUERY_DataElement = "SELECT * FROM DATA_ELEMENT where DATA_SET_UUID=:DATA_SET_UUID AND (IS_TIME_SENSITIVE = 'No' OR IS_TIME_SENSITIVE IS NULL) order by DATA_ELEMENT_ID asc";
    const data_ElementId = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", QUERY_DataElement, input);
    const TimeSensitive_DataElement = "SELECT * FROM DATA_ELEMENT where DATA_SET_UUID=:DATA_SET_UUID AND IS_TIME_SENSITIVE = 'Yes' order by DATA_ELEMENT_ID asc";
    const TimeSensitive_DataElementId = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", TimeSensitive_DataElement, input);

    const dataSetQuery = `select * from DATA_SET Where DATA_SET_UUID in(Select PARENT_DATA_SET_UUID from DATA_ELEMENT  Where DATA_SET_UUID =:DATA_SET_UUID and DATA_KEY ='FOREIGN_KEY') and isnull(PHYSICAL_TABLE_NAME) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    const parsedData = await serviceOrchestrator.selectRecordsUsingQuery('INFO_APPS', dataSetQuery, input);

    const isDataElementsValid = validateDataElements(data_ElementId);
    const isParentEntityCreated = parsedData.length > 0 ? false : true;

    if (!(isDataElementsValid && isParentEntityCreated)) return;
    // --------------------------------------------- Entity Block----------------------------------------
    input.PHYSICAL_TABLE_NAME = entity_name;
    const QUERY = "SELECT PROPERTYVALUE,PROPERTYNAME,ITEMID FROM CONFIGITEMPROPERTY where PROPERTYNAME='LOOKUP_KEY' and ITEMID in (SELECT ITEMID FROM CONFIGITEMPROPERTY  where PROPERTYNAME = 'APPLICATION_ID' and PROPERTYVALUE =:AE_APPLICATION_UUID and ITEMID in (select ITEMID from CONFIGITEM where PROJECTID=:PROJECTID and ITEMTYPE = 'DataSource' and ISDELETED='0' ));";

    let mainDataSource = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", QUERY, input);

    auditApplicationID = input['AE_APPLICATION_UUID'] + "_AUDIT"

    const AUDIT_QUERY = `SELECT PROPERTYVALUE,PROPERTYNAME,ITEMID FROM CONFIGITEMPROPERTY  where PROPERTYNAME='LOOKUP_KEY' and  ITEMID in (SELECT ITEMID FROM CONFIGITEMPROPERTY  where  PROPERTYNAME = 'APPLICATION_ID' and PROPERTYVALUE="${auditApplicationID}" and ITEMID in (select ITEMID from CONFIGITEM where  PROJECTID=:PROJECTID and ITEMTYPE = 'DataSource' and ISDELETED='0' ));`

    let auditDataSource = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", AUDIT_QUERY, input);

    const QUERY_Schema = `SELECT PROPERTYVALUE,PROPERTYNAME FROM CONFIGITEMPROPERTY WHERE PROPERTYNAME ='DB_NAME' AND ITEMID IN (SELECT CHILDITEMID FROM CONFIGITEMRELATION WHERE PARENTITEMID ='${mainDataSource.ITEMID}' )`;
    let schemaname = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", QUERY_Schema, input);

    let commonFields = [{
        'dbCode': entity_name + '_UUID',
        'type': 'VARCHAR',
        'length': 50,
        'isunique': 'No'
    }];

    let jsonFields = [
        { 'dbCode': entity_name + '_LONGTEXT_DATA_UUID', 'type': 'VARCHAR', 'length': 50, 'isunique': 'No' },
        { 'dbCode': entity_name + '_LONGTEXT_DATA_ID', 'type': 'NUMBER', 'length': 10, 'isunique': 'No' },
        ...commonFields
    ];

    // Utility function to build a table data object
    const buildTableDataObject = (columnList, tableName, primaryDbCode, incrementalUuid, sequencePrimaryDbCode = null) => ({
        "COLUMN_LIST": columnList,
        "TABLE_NAME": tableName,
        "PRIMARY_DBCODE": primaryDbCode,
        "INCREMENTAL_UUID": incrementalUuid,
        ...(sequencePrimaryDbCode ? { "SEQUENCE_PRIMARY_DBCODE": sequencePrimaryDbCode } : {})
    });

    let create_table_list = [...commonFields];
    let create_audit_table_list = [...commonFields];
    let createjsonTableElementList = [...jsonFields];
    let createjsonTableElementAuditList = [...jsonFields];
    let isLongTextDataExist = false;
    let constraintDetails = {};
    const commonAuditFields = [
        { dbCode: 'AE_INSERT_ID', type: 'VARCHAR', length: 45 },
        { dbCode: 'AE_UPDATE_ID', type: 'VARCHAR', length: 45 },
        { dbCode: 'AE_TRANSACTION_ID', type: 'VARCHAR', length: 45 },
        { dbCode: 'AE_INSERT_TS', type: 'TIMESTAMP', length: 3 },
        { dbCode: 'AE_UPDATE_TS', type: 'TIMESTAMP', length: 3 }
    ];
    const auditTable = [
        { dbCode: 'AE_AUDIT_UUID', type: 'VARCHAR', length: 50, isunique: 'No' },
        { dbCode: 'OPERATION_PERFORMED_BY', type: 'VARCHAR', length: 50 },
        { dbCode: 'AE_OPERATION_TYPE', type: 'VARCHAR', length: 25 },
        { dbCode: 'AE_TIMESTAMP', type: 'TIMESTAMP', length: 3 },
        { dbCode: 'TENANT_ID', type: 'VARCHAR', length: 50 },
        { dbCode: 'AE_OLD_NEW_COMPARISION_DETAILS', type: 'LONGTEXT' },
        ...commonAuditFields
    ];
    // Define UI component data
    dataSetFormFieldUiComponentData = [{
        "title": `${input.DATA_SET_NAME} UI View (Add/Edit)`,
        "className": "DATA_SET_UI_VIEW",
        "primaryKey": "",
        "parentNodeID": "",
        "parentNodeClassName": "",
        "level": 1,
        "children": input.IS_ATTACHMENT_CAPABLITY_REQUIRED === 'Yes' ? [{
            "title": `${input.DATA_SET_NAME} Tab`,
            "className": "TAB_CONTAINER",
            "parentNodeClassName": "DATA_SET_UI_VIEW",
            "primaryKey": "",
            "parentNodeID": "",
            "level": 2,
            "children": [],
            "expanded": true
        }, {
            "title": "Attachment Tab",
            "className": "TAB_CONTAINER",
            "parentNodeClassName": "DATA_SET_UI_VIEW",
            "primaryKey": "",
            "parentNodeID": "",
            "level": 2,
            "children": [],
            "expanded": true
        }] : [],
        "expanded": true
    }];

    if (data_ElementId.length) {
        data_ElementId.forEach(element => {
            const columnDetails = createColumnDetails(element);
            const get_dbcode_name = columnDetails.dbCode;

            if (['FOREIGN_KEY', 'AUTO_INCREMENT_UNIQUE_KEY'].includes(element.DATA_KEY)) {
                constraintDetails[get_dbcode_name] = element.DATA_KEY;
            }

            if (element.DATA_TYPE === 'LONGTEXT') {
                isLongTextDataExist = true;
                createjsonTableElementList.push(columnDetails);
                createjsonTableElementAuditList.push(columnDetails);
            } else {
                create_table_list.push(columnDetails);
                create_audit_table_list.push(columnDetails);
            }
        });

        let updatedMainTableDetails = [];
        let updatedAuditMainTableDetails = [];

        for (let columnDetails of create_table_list) {
            let columnObject = {};
            columnObject["dbCode"] = columnDetails.dbCode;
            columnObject["type"] = columnDetails.type ? columnDetails.type : "VARCHAR";
            columnObject["length"] = columnDetails.length ? columnDetails.length : columnDetails.type == 'TIMESTAMP'? 3 : 1024;
            columnObject["isunique"] = columnDetails.isunique;
            columnObject["isRequired"] = columnDetails.isRequired;
            columnObject["data_col_key"] = columnDetails.data_col_key;
            updatedMainTableDetails.push(columnObject);
            updatedAuditMainTableDetails.push(columnObject);
        }


        create_table_list.push(...commonAuditFields);
        create_audit_table_list.push(...auditTable);
        updatedMainTableDetails.push(...commonAuditFields);
        updatedAuditMainTableDetails.push(...auditTable);

        await serviceOrchestrator.createTable(entity_name, updatedMainTableDetails, mainDataSource.PROPERTYVALUE, `${entity_name}_UUID`, 'KNEX_DYNAMIC');
        await serviceOrchestrator.createTable(`${entity_name}_AUDIT`, updatedAuditMainTableDetails, auditDataSource.PROPERTYVALUE, 'AE_AUDIT_UUID', 'KNEX_DYNAMIC');

        if (isLongTextDataExist) {
            createjsonTableElementList.push(...commonAuditFields);
            createjsonTableElementAuditList.push(...auditTable);
            await serviceOrchestrator.createTable(`${entity_name}_LONGTEXT_DATA`, createjsonTableElementList, mainDataSource.PROPERTYVALUE, `${entity_name}_LONGTEXT_DATA_UUID`, 'KNEX_DYNAMIC');
            await serviceOrchestrator.createTable(`${entity_name}_LONGTEXT_DATA_AUDIT`, createjsonTableElementAuditList, auditDataSource.PROPERTYVALUE, 'AE_AUDIT_UUID', 'KNEX_DYNAMIC');
        }
    }


    // Generate column lists using map for better performance
    const columnList = create_table_list.map(item => item.dbCode);
    const auditColumnList = create_audit_table_list.map(item => item.dbCode);
    const longtextColumnList = isLongTextDataExist ? createjsonTableElementList.map(item => item.dbCode) : [];

    // Build table data objects
    const mainTableDataObject = buildTableDataObject(columnList, entity_name, `${entity_name}_UUID`, `${entity_name}_ID`);
    const auditTableDataObject = buildTableDataObject(auditColumnList, `${entity_name}_AUDIT`, `${entity_name}_UUID`, `${entity_name}_ID`);
    const longTextTableDataObject = isLongTextDataExist ? buildTableDataObject(longtextColumnList, `${entity_name}_LONGTEXT_DATA`, `${entity_name}_UUID`, `${entity_name}_LONGTEXT_DATA_ID`, `${entity_name}_LONGTEXT_DATA_UUID`) : null;



    let mainlogicalEntityConfigId = createLogicalEntity(entity_name);
    let [mainPhysicalEntityConfigId, mainSingleSelectQuery] = createPhysicalEntity(entity_name, mainlogicalEntityConfigId, mainTableDataObject, isLongTextDataExist, schemaname, mainDataSource, auditDataSource);
    createPhysicalColumn(mainPhysicalEntityConfigId, create_table_list, entity_name);
    let mainLogicalColumnDetails = createLogicalColumn(mainlogicalEntityConfigId, create_table_list, entity_name, constraintDetails,mainDataSource);

    populatePhysicalColumnName(data_ElementId);
    populatePhysicalColumnName(TimeSensitive_DataElementId);

    console.log('dataElements ::::::::: ', dataElements)
    console.log('configItemList ::::::::: ', configItemList)
    console.log('configpropertyList ::::::::: ', configpropertyList)
    console.log('configrelationList ::::::::: ', configrelationList)

    input["AppEngChildEntity:DATA_ELEMENT"] = dataElements;
    input["AppEngChildEntity:CONFIGITEM"] = configItemList;
    input["AppEngChildEntity:CONFIGITEMPROPERTY"] = configpropertyList;
    input["AppEngChildEntity:CONFIGITEMPRIVILEGE"] = configprivilegeList;
    input["AppEngChildEntity:CONFIGITEMRELATION"] = configrelationList;

}

// ----------------------------------------------------------- Save Block ---------------------------------------------------------------------
// the below if block is responsible to create the auto increment data element column when action is save 
if (input.compositeEntityAction == 'Save') {
    const data_Element = {};
    const data_ElementList = [];
    let dataElement_UUID = uuid();
    data_Element["DATA_ELEMENT_UUID"] = dataElement_UUID;
    data_Element["DATA_ELEMENT_NAME"] = input.DATA_SET_NAME + " ID";
    data_Element["IS_TIME_SENSITIVE"] = "No";
    data_Element["DATA_SET_UUID"] = input["DATA_SET_UUID"];
    data_Element["IS_UNIQUE_KEY"] = 'Yes';
    data_Element["IS_VALUE_ALWAYS_REQUIRED"] = 'Yes';
    data_Element["PRE_DEFINED_DATA"] = 'No';
    data_Element["DATA_TYPE"] = 'NUMBER';
    data_Element["DATA_KEY"] = 'AUTO_INCREMENT_UNIQUE_KEY';
    data_Element["UI_VIEW_TYPE"] = 'TextBox';
    data_Element["LENGTH"] = 9;
    data_ElementList.push(data_Element);
    input["AppEngChildEntity:DATA_ELEMENT"] = data_ElementList;
}
// ----------------------------------------------------------- Update Block ---------------------------------------------------------------------

//the below function is responsible to update the data element whwn user update the data set before creating the entity
if (input.compositeEntityAction == 'Update') {
    let dataElementList = [];
    let dataElementQuery = `SELECT * FROM DATA_ELEMENT WHERE DATA_SET_UUID=:DATA_SET_UUID AND DATA_KEY='AUTO_INCREMENT_UNIQUE_KEY' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID UNION SELECT * FROM DATA_ELEMENT WHERE PARENT_DATA_SET_UUID=:DATA_SET_UUID AND DATA_KEY='FOREIGN_KEY' and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`
    let dataElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", dataElementQuery, input);

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
}

// ----------------------------------------------------------- Delete Block---------------------------------------------------------------------
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
    let QuerytoFetchDataElementsData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", QuerytoFetchDataElements, input);
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
        let QuerytoFetchDataElementsLongtextData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", QuerytoFetchDataElementsLongtext, input);
        let QuerytoFetchDataElementsLongtextRecords = JSON.parse(JSON.stringify(QuerytoFetchDataElementsLongtextData));
        for (let key in QuerytoFetchDataElementsLongtextRecords) {
            deleteRecord('DATA_ELEMENT_LONGTEXT_UUID', QuerytoFetchDataElementsLongtextRecords[key].DATA_ELEMENT_LONGTEXT_UUID, 'DATA_ELEMENT_LONGTEXT', input['APP_LOGGED_IN_FUNTIONAL_AREA_ID']);
        }
    }

    input["AppEngChildEntity:DATA_SET"] = DATA_SET;
    input["AppEngChildEntity:DATA_ELEMENT"] = DATA_ELEMENT;
    input["AppEngChildEntity:CODE_SET_TRANSACTION_DATA_ELEMENT"] = CODE_SET_TRANSACTION_DATA_ELEMENTS;
    input["AppEngChildEntity:DATA_ELEMENT_LONGTEXT"] = DATA_ELEMENT_LONGTEXT;
}
