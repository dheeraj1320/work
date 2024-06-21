try{
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
     'OPERATION_PERFORMED_BY':'Changed By',
     'AE_OPERATION_TYPE':'Change Type',
     'AE_TIMESTAMP':'Change Timestamp',
     'AE_OLD_NEW_COMPARISION_DETAILS':'Change Data Details'
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
          'UI_VIEW_TYPE' : 'DateTimePicker'
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
      // stringValue = stringValue.replace(/^\s+|\s+$/g, '');
      stringValue = stringValue.replaceAll(' ', '_').toUpperCase();
      return stringValue;
  }
  // function to get the Header name for DataGrid column
  function getHeaderForDataGridColumn(entityName, columnName){
     if(entityName + '_ID' === columnName) return 'ID';
     if(headersForDataGridColumns[columnName]) return headersForDataGridColumns[columnName]
     return camelCaseString(columnName);
  }
  
  // function to get select reference query & data source according to datagrid column type and field type
  async function getSelectReferenceQueryAndDataSource(dataElementUUID, isPreDefinedValue, columnName){
      const obj = {query : "", dataSourceID : ""}
      if(columnName === 'OPERATION_PERFORMED_BY'){
          obj.query = "SELECT AE_USER_PROFILE_UUID as id, concat(au.FIRST_NAME ,' ',au.LAST_NAME) as LABEL, concat(au.FIRST_NAME ,' ',au.LAST_NAME) as VALUE FROM USER_PROFILE au";
          obj.dataSourceID = infoAuthorizationDataSourceId;
      }
  
      else if(isPreDefinedValue === 'Yes'){
          let masterDataSetUUIDQuery = `SELECT MASTER_DATA_SET_UUID FROM MASTER_DATA_SET_TRANSACTION_DATA_ELEMENT
          WHERE DATA_SET_UUID=:DATA_SET_UUID AND DATA_ELEMENT_UUID = '${dataElementUUID}'`
          let masterDataSetUUIDQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_TENANT", masterDataSetUUIDQuery, input);
          let masterDataSetUUID = JSON.parse(JSON.stringify(masterDataSetUUIDQueryData));
  
          obj.query = `SELECT PRE_DEFINED_VALUES_UUID AS id, PRE_DEFINED_VALUES_TEXT AS value, PRE_DEFINED_VALUES_TEXT AS label FROM PRE_DEFINED_VALUES WHERE MASTER_DATA_SET_UUID='${masterDataSetUUID[0]?.MASTER_DATA_SET_UUID}'`;
          obj.dataSourceID = infoTenantDataSourceId;
      }
  
      return obj;
  }
  
  function validateDataElements(dataElements){
     let isValid = false;
     dataElements.map(el => {
         if(!el.DATA_KEY){
             isValid = true;
         }
     })
     return isValid;
  }
  
  if (input.compositeEntityAction == 'Create Entity') {
      // DataSet Name in capital letter and replace the space with underscore  
      let get_entity_name = replaceSpaceAndMakeUpperCaseString(input.DATA_SET_NAME);
  
      input.PHYSICAL_TABLE_NAME = get_entity_name;
      // Query to fetch DataElements for selected DataSet-
      const QUERY_DataElement = "SELECT * FROM DATA_ELEMENT where DATA_SET_UUID=:DATA_SET_UUID order by DATA_ELEMENT_ID asc";
      let data_Element = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", QUERY_DataElement, input);
      const data_ElementId = JSON.parse(JSON.stringify(data_Element));
  
      const dataSetQuery = `select * from DATA_SET Where DATA_SET_UUID in(Select PARENT_DATA_SET_UUID from DATA_ELEMENT  Where DATA_SET_UUID =:DATA_SET_UUID and DATA_KEY ='FOREIGN_KEY') and isnull(PHYSICAL_TABLE_NAME) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      const dataSetQueryData = await serviceOrchestrator.selectRecordsUsingQuery('INFO_APPS', dataSetQuery, input);
      const parsedData = JSON.parse(JSON.stringify(dataSetQueryData));
      
      const isDataElementsValid = validateDataElements(data_ElementId);
      const isParentEntityCreated = parsedData.length > 0 ? false : true;
  
      if(!(isDataElementsValid && isParentEntityCreated)) return;
  
      // Query to fetch DataSource-
      const QUERY = "SELECT PROPERTYVALUE,PROPERTYNAME,ITEMID FROM CONFIGITEMPROPERTY  where PROPERTYNAME='LOOKUP_KEY' and  ITEMID in (SELECT ITEMID FROM CONFIGITEMPROPERTY  where  PROPERTYNAME = 'APPLICATION_ID' and PROPERTYVALUE =:AE_APPLICATION_UUID and ITEMID in (select ITEMID from CONFIGITEM where  PROJECTID=:PROJECTID and ITEMTYPE = 'DataSource' and ISDELETED='0' ));";
      let data = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", QUERY, input);
      const dataId = JSON.parse(JSON.stringify(data));
  
      // object to contain values for Main DataSource
      let mainDataSource = {
          PROPERTYVALUE : dataId[0].PROPERTYVALUE,
          PROPERTYNAME : 'LOOKUP_KEY',
          ITEMID : dataId[0].ITEMID
      };
  
      // application id for audit data source
       auditApplicationID = input['AE_APPLICATION_UUID'] + "_AUDIT"
  
      // Audit data source
      const AUDIT_QUERY = `SELECT PROPERTYVALUE,PROPERTYNAME,ITEMID FROM CONFIGITEMPROPERTY  where PROPERTYNAME='LOOKUP_KEY' and  ITEMID = (select ITEMID from CONFIGITEMPROPERTY where PROPERTYNAME = 'APPLICATION_ID' and PROPERTYVALUE = "${auditApplicationID}")`
  
      let auditData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", AUDIT_QUERY, input);
      const auditDataId = JSON.parse(JSON.stringify(auditData));
  
      // if audit data source does not exist
      if(Object.keys(auditDataId).length == 0){
           const returnedTarget = Object.assign(auditDataId, dataId);
      }
  
      let auditDataSource = {
          PROPERTYVALUE : auditDataId[0].PROPERTYVALUE,
          PROPERTYNAME : 'LOOKUP_KEY',
          ITEMID : auditDataId[0].ITEMID
      } 
  
      // Query to fetch schema name-
      let queryInputObj = {};
      queryInputObj['ITEMID'] = mainDataSource.ITEMID;
      const QUERY_Schema = "SELECT PROPERTYVALUE,PROPERTYNAME FROM CONFIGITEMPROPERTY WHERE PROPERTYNAME ='DB_NAME' AND ITEMID IN (SELECT CHILDITEMID FROM CONFIGITEMRELATION WHERE PARENTITEMID =:ITEMID )";
      let dataschema = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", QUERY_Schema, queryInputObj);
      const schemaname = JSON.parse(JSON.stringify(dataschema));
  
      // find child present or not for data set
      const fetchChildDetailsQuery = "SELECT ds.DATA_SET_UUID FROM DATA_SET ds,DATA_SET_RELATIONSHIP dsr where ds.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and ds.DATA_SET_UUID = dsr.DATA_SET_CHILD_UUID and dsr.DATA_SET_PARENT_UUID=:DATA_SET_UUID";
      let fetchChildDetailsQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", fetchChildDetailsQuery, input);
  
      let isChildPresent = fetchChildDetailsQueryData && fetchChildDetailsQueryData.length ? true : false;
  
      //assign EDIT privillege to only Product admin
      let privilegeArray = {
          1: "NO PRIVILEGE",
          2: "NO PRIVILEGE",
          3: "EDIT"
      };
  
      let viewPrivilegeArray = {
          1: "NO PRIVILEGE",
          2: "NO PRIVILEGE",
          3: "VIEW"
      };
  
      //list declared for creating main table
      let create_table_list = [{
          'dbCode': get_entity_name + '_UUID',
          'type': "VARCHAR",
          'length': 50,
          'isunique': 'No'
      }];
      //list declared for creating Audit table
      let create_audit_table_list = [{
          'dbCode': get_entity_name + '_UUID',
          'type': "VARCHAR",
          'length': 50,
          'isunique': 'No'
      }];
  
      // list decleared for creating the longtext main table  'DATA_SET_NAME_LONGTEXT_DATA'
      let createjsonTableElementList = [{
          'dbCode': get_entity_name + '_LONGTEXT_DATA_UUID',
          'type': "VARCHAR",
          'length': 50,
          'isunique': 'No'
      }, {
          'dbCode': get_entity_name + '_LONGTEXT_DATA_ID',
          'type': "NUMBER",
          'length': 10,
          'isunique': 'No'
      }, {
          'dbCode': get_entity_name + '_UUID',
          'type': "VARCHAR",
          'length': 50,
          'isunique': 'No'
      }];
      // list decleared for creating the longtext main table 'DATA_SET_NAME_LONGTEXT_DATA_AUDIT'
      let createjsonTableElementAuditList = [{
          'dbCode': get_entity_name + '_LONGTEXT_DATA_UUID',
          'type': "VARCHAR",
          'length': 50,
          'isunique': 'No'
      }, {
          'dbCode': get_entity_name + '_LONGTEXT_DATA_ID',
          'type': "NUMBER",
          'length': 10,
          'isunique': 'No'
      }, {
          'dbCode': get_entity_name + '_UUID',
          'type': "VARCHAR",
          'length': 50,
          'isunique': 'No'
      }];
  
      let isLongTextDataExist = false;
      let constraintDetails = {};
      if (data_ElementId.length) {
          // Creating Primary table column list
          for (let i = 0; i < data_ElementId.length; i++) {
              // Generating DBCODE form DataElement Name and storing it in list-
              let get_dbcode_name = replaceSpaceAndMakeUpperCaseString(data_ElementId[i].DATA_ELEMENT_NAME)
  
              if (data_ElementId[i] && data_ElementId[i]['DATA_KEY'] && ['FOREIGN_KEY', 'AUTO_INCREMENT_UNIQUE_KEY'].includes(data_ElementId[i]['DATA_KEY'])) {
                  constraintDetails[get_dbcode_name] = data_ElementId[i]['DATA_KEY'];
              }
  
              // Creating table column list- 
              let create_tablelist_columns = {};
              // the below if block will execute when the type is longtext
              if (data_ElementId[i].DATA_TYPE && data_ElementId[i].DATA_TYPE == 'LONGTEXT') {
                  isLongTextDataExist = true;
                  create_tablelist_columns["dbCode"] = get_dbcode_name;
                  create_tablelist_columns["type"] = data_ElementId[i].DATA_TYPE;
                  create_tablelist_columns["length"] = data_ElementId[i].LENGTH;
                  create_tablelist_columns["isunique"] = data_ElementId[i].IS_UNIQUE_KEY;
                  create_tablelist_columns["isRequired"] = data_ElementId[i].IS_VALUE_ALWAYS_REQUIRED;
                  createjsonTableElementList.push(create_tablelist_columns);
                  createjsonTableElementAuditList.push(create_tablelist_columns);
              } else {
                  create_tablelist_columns["dbCode"] = get_dbcode_name;
                  create_tablelist_columns["type"] = data_ElementId[i].DATA_TYPE;
                  create_tablelist_columns["length"] = data_ElementId[i].LENGTH;
                  create_tablelist_columns["isunique"] = data_ElementId[i].IS_UNIQUE_KEY;
                  create_tablelist_columns["isRequired"] = data_ElementId[i].IS_VALUE_ALWAYS_REQUIRED;
                  create_tablelist_columns["data_col_key"] = data_ElementId[i].DATA_KEY;
                  create_table_list.push(create_tablelist_columns);
                  create_audit_table_list.push(create_tablelist_columns);
              }
          }
  
          // default column for main table
          let mainTable = [{
              'dbCode': 'AE_INSERT_ID',
              'type': "VARCHAR",
              'length': 45
          }, {
              'dbCode': 'AE_UPDATE_ID',
              'type': "VARCHAR",
              'length': 45
          }, {
              'dbCode': 'AE_TRANSACTION_ID',
              'type': "VARCHAR",
              'length': 45
          }, {
              'dbCode': 'AE_INSERT_TS',
              'type': "TIMESTAMP",
              'length': 3
          }, {
              'dbCode': 'AE_UPDATE_TS',
              'type': "TIMESTAMP",
              'length': 3
          }
          ];
          // default column for audit table
          let auditTable = [{
              'dbCode': 'AE_AUDIT_UUID',
              'type': "VARCHAR",
              'length': 50,
              'isunique': 'No'
          }, {
              'dbCode': 'OPERATION_PERFORMED_BY',
              'type': "VARCHAR",
              'length': 50
          }, {
              'dbCode': 'AE_OPERATION_TYPE',
              'type': "VARCHAR",
              'length': 25
          }, {
              'dbCode': 'AE_TIMESTAMP',
              'type': "TIMESTAMP",
              'length': 3
          }, {
              'dbCode': 'TENANT_ID',
              'type': "VARCHAR",
              'length': 50
          }, {
              'dbCode': 'AE_OLD_NEW_COMPARISION_DETAILS',
              'type': "LONGTEXT"
          }, {
              'dbCode': 'AE_INSERT_ID',
              'type': "VARCHAR",
              'length': 45
          }, {
              'dbCode': 'AE_UPDATE_ID',
              'type': "VARCHAR",
              'length': 45
          }, {
              'dbCode': 'AE_INSERT_TS',
              'type': "TIMESTAMP",
              'length': 3
          }, {
              'dbCode': 'AE_UPDATE_TS',
              'type': "TIMESTAMP",
              'length': 3
          }, {
              'dbCode': 'AE_TRANSACTION_ID',
              'type': "VARCHAR",
              'length': 45
          }]
  
          let updatedMainTableDetails = [];
          let updatedAuditMainTableDetails = [];
  
          for (let columnDetails of create_table_list) {
              let columnObject = {};
              columnObject["dbCode"] = columnDetails.dbCode;
              columnObject["type"] = columnDetails.data_col_key ? columnDetails.type : "VARCHAR";
              columnObject["length"] = columnDetails.data_col_key ? columnDetails.length : 1024;
              columnObject["isunique"] = columnDetails.isunique;
              columnObject["isRequired"] = columnDetails.isRequired;
              columnObject["data_col_key"] = columnDetails.data_col_key;
              updatedMainTableDetails.push(columnObject);
              updatedAuditMainTableDetails.push(columnObject);
          }
  
          create_table_list = create_table_list.concat(mainTable);
          create_audit_table_list = create_audit_table_list.concat(auditTable);
  
          updatedMainTableDetails = updatedMainTableDetails.concat(mainTable);
          updatedAuditMainTableDetails = updatedAuditMainTableDetails.concat(auditTable);
  
  
          // Create physical main table
          let record = await serviceOrchestrator.createTable(get_entity_name, updatedMainTableDetails, mainDataSource.PROPERTYVALUE, get_entity_name + '_UUID', 'KNEX_DYNAMIC');
  
          // Create physical Audit table
          let record_audit = await serviceOrchestrator.createTable(get_entity_name + '_AUDIT', updatedAuditMainTableDetails, auditDataSource.PROPERTYVALUE, 'AE_AUDIT_UUID', 'KNEX_DYNAMIC');
  
          if (isLongTextDataExist) {
              createjsonTableElementList = createjsonTableElementList.concat(mainTable);
              createjsonTableElementAuditList = createjsonTableElementAuditList.concat(auditTable);
  
              // Create physical longtext main table
              let record = await serviceOrchestrator.createTable(get_entity_name + '_LONGTEXT_DATA', createjsonTableElementList, mainDataSource.PROPERTYVALUE, get_entity_name + '_LONGTEXT_DATA_UUID', 'KNEX_DYNAMIC');
  
              // Create physical longtext Audit table
              let record_audit = await serviceOrchestrator.createTable(get_entity_name + '_LONGTEXT_DATA_AUDIT', createjsonTableElementAuditList, auditDataSource.PROPERTYVALUE, 'AE_AUDIT_UUID', 'KNEX_DYNAMIC');
          }
      }
  
      // storing all the db code of main table for further use 
      let columnList = [];
      if (create_table_list.length) {
          for (let list = 0; list < create_table_list.length; list++) {
              columnList.push(create_table_list[list].dbCode);
          }
      }
      // storing all the db code of longtext table for further use 
      let longtextColumnList = [];
      if (isLongTextDataExist && createjsonTableElementList.length) {
          for (let list = 0; list < createjsonTableElementList.length; list++) {
              longtextColumnList.push(createjsonTableElementList[list].dbCode);
          }
      }
  
      // Required data to prepare query for main physical entity
      let mainTableDataObject = {};
      mainTableDataObject["COLUMN_LIST"] = columnList;
      mainTableDataObject["TABLE_NAME"] = get_entity_name;
      mainTableDataObject["PRIMARY_DBCODE"] = get_entity_name + '_UUID';
      mainTableDataObject["INCREMENTAL_UUID"] = get_entity_name + '_ID'
  
      // Required data to prepare query for longtext physical entity
      let longTextTableDataObject = {};
      if (isLongTextDataExist) {
          longTextTableDataObject["COLUMN_LIST"] = longtextColumnList;
          longTextTableDataObject["TABLE_NAME"] = get_entity_name + '_LONGTEXT_DATA';
          longTextTableDataObject["PRIMARY_DBCODE"] = get_entity_name + '_UUID';
          longTextTableDataObject["INCREMENTAL_UUID"] = get_entity_name + '_LONGTEXT_DATA_ID';
          longTextTableDataObject["SEQUENCE_PRIMARY_DBCODE"] = get_entity_name + '_LONGTEXT_DATA_UUID';
      }
  
     // storing all the db code of audit table for further use 
     let auditColumnList = [];
     if (create_audit_table_list.length) {
         for (let list = 0; list < create_audit_table_list.length; list++) {
             auditColumnList.push(create_audit_table_list[list].dbCode);
         }
     }
  
     // Required data to prepare query for audit physical entity
     let auditTableDataObject = {};
     auditTableDataObject["COLUMN_LIST"] = auditColumnList;
     auditTableDataObject["TABLE_NAME"] = get_entity_name + "_AUDIT";
     auditTableDataObject["PRIMARY_DBCODE"] = get_entity_name + '_UUID';
     auditTableDataObject["INCREMENTAL_UUID"] = get_entity_name + '_ID'
  
  
      // function to create the logical entity
      function createLogicalEntity(entityName) {
          //Create the config item
          let configitemId = createConfigItem(entityName, 'LogicalEntity', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
  
          // Create the config property
          propertyObject = { DBTYPENAME: entityName }
  
          let logicalEntity_configproperty = createConfigItemProperty(propertyObject, configitemId);
  
          return configitemId;
      }
  
  
      let singleSelectQuery;
      // function to create the physical entity
      function createPhysicalEntity(entityName, logicalEntityConfigId, tableDataObject, isLongTextDataExist) {
  
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
              "SCHEMA_NAME": schemaname[0].PROPERTYVALUE,
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
  
          return physicalEntity_configitem;
      }
  
      // function to create the physical column
      function createPhysicalColumn(physicalEntityConfigId, tablelist) {
          //Create other Physical Column 
          if (tablelist.length) {
              for (let i = 0; i < tablelist.length; i++) {
                  //Create config item-
                  let physicalcolumn_configitem = createConfigItem(tablelist[i].dbCode, 'PhysicalColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
                  // Create the config property
                  let physicalcolumn_propertyArray = {
                      "LENGTH": tablelist[i].length,
                      "DATATYPE": tablelist[i].type,
                      "ISPRIMARYKEY": tablelist[i].dbCode === get_entity_name + '_UUID' ? 1 : 0,
                      "DBCODE": tablelist[i].dbCode,
                      "IS_MANDATORY": tablelist[i].isRequired == 'Yes' ? 1 : 0
                  };
  
                  let physicalColumn_configproperty = createConfigItemProperty(physicalcolumn_propertyArray, physicalcolumn_configitem);
  
                  // Create the config relation
                  createConfigItemRelation(physicalEntityConfigId, "PhysicalEntity_PhysicalColumn", physicalcolumn_configitem);
              }
          }
      }
  
      function createDataBaseValidation(item,logicalcolumn_configitemId) {
          //Create config item for DBValidation-
          let dbValidation_configitemId = createConfigItem(camelCaseString(item.dbCode), 'DatabaseValidation', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
      
          let validationKey = 'EXISTING_' + item.dbCode + '_COUNT';
          // Create the config property for DBValidation   
          dbValidation_propertyObject = {
              "MODE": 'BOTH',
              "DATASOURCE_ID": mainDataSource.ITEMID,
              "VALIDATION_TYPE": 'Warning',
              "VALIDATION_EXPRESSION": '#{EXISTING_' + item.dbCode + '_COUNT ==' + 0 + '}',
              "VALIDATION_QID": 'SELECT COUNT(*) AS ' + validationKey + ' FROM ' + get_entity_name + ' WHERE ' + item.dbCode + '=:' + item.dbCode + ' and ' + get_entity_name + '_UUID' + '!=' + 'COALESCE(:' + get_entity_name + '_UUID,' + 0 + ')',
              "VALIDATION_MSG": camelCaseString(item.dbCode) + ' Already Exist.',
              "VALIDATION_EXPRESSION_KEYS": validationKey,
              "IS_CONDITION_AVAILABLE": 0
          };
      
          let dbValidation_configproperty = createConfigItemProperty(dbValidation_propertyObject, dbValidation_configitemId);
      
          // Create the config Parent relation for DBValidation        
          createConfigItemRelation(logicalcolumn_configitemId, "LogicalColumn_ValidationObject", dbValidation_configitemId);
      }
  
      // function to create the logical column
      function createLogicalColumn(logicalEntityConfigId, tablelist) {
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
                      "ISPRIMARYKEY": tablelist[i].dbCode === get_entity_name + '_UUID' ? 1 : 0,
                      "DBCODE": tablelist[i].dbCode,
                      "IS_MANDATORY": constraintDetails[tablelist[i].dbCode] ? 0 : tablelist[i].isRequired == 'Yes' ? 1 : 0,
                      "IS_UNIQUE": tablelist[i].isunique ? 1 : 0
                  };
  
                  let logicalColumn_configproperty = createConfigItemProperty(propertyObject, logicalcolumn_configitemId);
  
                  // Create the config relation for Logical Column
                  createConfigItemRelation(logicalEntityConfigId, "LogicalEntity_LogicalColumn", logicalcolumn_configitemId);
  
                  // Create Validation if IsUnique is true-
                  if (tablelist[i].isunique == 'Yes' && !tablelist[i]['data_col_key']) {
                      createDataBaseValidation(tablelist[i],logicalcolumn_configitemId);
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
      function createForm(type, entityName, formSectionId, logicalEntityConfigId, formType) {
  
          //Create the config item
          let form_configitemId = createConfigItem(type + ' ' + entityName + ' [(SUB PAGE)(SYSTEM)]', 'Form', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
  
          let decideLable = type == 'Add' ? type : 'View/Edit'
          // Create the config property
          propertyObject = { "FORM_LABEL": decideLable + ' ' + entityName, "FORM_TYPE": "insertForm", "ORDER": 5, "IS_TAB_REQUIRED_IN_FORMSECTION": input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' && formType == 'Main' ? 1 : 0 }
  
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
      async function generateMultValueQuery(dataElementUUID, dbCode) {
          let masterDataSetUUIDQuery = `SELECT MASTER_DATA_SET_UUID FROM MASTER_DATA_SET_TRANSACTION_DATA_ELEMENT
          WHERE DATA_SET_UUID=:DATA_SET_UUID AND DATA_ELEMENT_UUID = '${dataElementUUID}'`
          let masterDataSetUUIDQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_TENANT", masterDataSetUUIDQuery, input);
          let masterDataSetUUID = JSON.parse(JSON.stringify(masterDataSetUUIDQueryData));
  
          let query = `SELECT PRE_DEFINED_VALUES_UUID AS id, PRE_DEFINED_VALUES_TEXT AS value, PRE_DEFINED_VALUES_TEXT AS label FROM PRE_DEFINED_VALUES WHERE 
          CONCAT(',',:${dbCode}, ',') LIKE CONCAT('%,', PRE_DEFINED_VALUES_UUID, ',%')
          UNION
          SELECT PRE_DEFINED_VALUES_UUID AS id, PRE_DEFINED_VALUES_TEXT AS value, PRE_DEFINED_VALUES_TEXT AS label FROM PRE_DEFINED_VALUES WHERE MASTER_DATA_SET_UUID = '${masterDataSetUUID[0]?.MASTER_DATA_SET_UUID}' AND IS_PRE_DEFINED_VALUES_ACTIVE = 'Yes'`;
  
          return query;
      }
  
      dataSetFormFieldUiComponentData = [{
          "title": input.DATA_SET_NAME + ' UI View (Add/Edit)',
          "className": "DATA_SET_UI_VIEW",
          "primaryKey": "",
          "parentNodeID": "",
          "parentNodeClassName": "",
          "level": 1,
          "children": input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' ? [{
              "title": input.DATA_SET_NAME + ' Tab',
              "className": "TAB_CONTAINER",
              "parentNodeClassName": "DATA_SET_UI_VIEW",
              "primaryKey": "",
              "parentNodeID": "",
              "level": 2,
              "children": [],
              "expanded": true
          },
          {
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
  
      // function to create the form field
      async function createFormField(formSectionId, logicalColumnDetails, type, attachmentFormSectionId) {
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
              createConfigItemRelation(hiddenField_configitemId, "FormField_LogicalColumn", logicalColumnDetails[get_entity_name + '_UUID']);
  
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
                      multiValueQuery = await generateMultValueQuery(filteredArray[i].DATA_ELEMENT_UUID, get_dbcode_name);
                  }
  
                  let getLogicalColumnIdByDBCode = logicalColumnDetails[get_dbcode_name];
  
                  if (filteredArray[i] && filteredArray[i].DATA_KEY != 'FOREIGN_KEY' && filteredArray[i].DATA_KEY != 'AUTO_INCREMENT_UNIQUE_KEY') {
                      isColumnAvailable = true;
                      // Create the config property for Formfield
                      let formfieldpropertyObject = {
                          "LABEL": filteredArray[i].DATA_ELEMENT_NAME,
                          "TYPE": filteredArray[i].UI_VIEW_TYPE,
                          "ORDER": orderFF,
                          "IS_MANDATORY": filteredArray[i].IS_VALUE_ALWAYS_REQUIRED == 'Yes' ? 1 : 0,
                          "SELECT_ITEMS_REFERENCE_ID": filteredArray[i].PRE_DEFINED_DATA === 'Yes' ? multiValueQuery : '',
                          "DATASOURCE_ID": filteredArray[i].PRE_DEFINED_DATA === 'Yes' ? infoTenantDataSourceId : '',
                          "COLSPAN": null,
                          "MULTI_VALUE_LIST": filteredArray[i].DATA_TYPE == 'BOOLEAN' ? 'Yes:Yes,No:No' : ''
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
                  createConfigItemRelation(attachmentFormField_configitemId, "FormField_LogicalColumn", logicalColumnDetails[get_entity_name + '_UUID']);
  
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
      // function to create the button panel
      function createButtonPanelAndButton(type, buttonPanelProperty, buttonList, relationType, parentItemId, dataSetName) {
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
  
      // function to create the datagrid
      function createDataGrid(formId, dataSetName) {
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
  
         // Create the config relation
          createConfigItemRelation(dataGridConfigItem, "DataGrid_Form", formId);

  
          return dataGridConfigItem;
      }
  
      // function to create the logical entity operation
      function createLogicalEntityOperation(datagridId, gridList, type = 'Main') {
  
          let dataSetName = gridList && gridList['Parent'] && gridList['Child'] ? gridList['Child'] + ' By ' + gridList['Parent'] : gridList['Parent'];
          //Create the config item
          let logicalEntityOperationConfigItem = createConfigItem(dataSetName, 'LogicalEntityOperation', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
  
         //Create queries for main datagrid 
         let propertyObject;
          if(type === 'Main') {
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
              "GRID_SELECT_ID": selectQue + ' ORDER BY ' + get_entity_name + '_ID' + ' desc',
              "SELECT_ID": formQue + "=:entityPrimaryKey",
              "DATASOURCE_ID": mainDataSource.ITEMID
          };
         // Create queries for audit datagrid
         } else if(type === 'Audit') {
             let queryObj = queryConverter(auditTableDataObject, isLongTextDataExist);
             let splitQuery = queryObj.Select.replace('FROM', 'from').split('from');
             
             let fullQuery = `${splitQuery[0]},"${get_entity_name}" as TABLE_NAME, "${auditDataSource.PROPERTYVALUE}" as AUDIT_DATASOURCE FROM ${splitQuery[1]} ORDER BY AE_TIMESTAMP DESC`;

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
      async function createDataGridColumn(datagridId, formFieldDetails, logicalColumnDetails, type = 'Main') {
          let dataSetDataGridColumnUiComponentData = [];
          
          // Create expand, view/edit and ellipsis columns only for Main datagrid
         if(type !== 'Audit'){
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
              "HEADER_NAME":"Show Record History",
              "GROUP":"First Column",
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
              "IS_VISIBLE": "0",
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
              'DATA_ELEMENT_NAME': get_entity_name + '_UUID',
              'DATA_TYPE': 'VARCHAR',
              'LENGTH': 50,
              'IS_UNIQUE_KEY': 'No',
              'IS_VALUE_ALWAYS_REQUIRED': 'No',
              'PRE_DEFINED_DATA': 'No',
              'DATA_KEY': null
          };
  
          let dataElementArray = [];
          if(type === "Audit"){
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
              if(columnName === get_entity_name + '_ID' && type === 'Audit') continue;
  
              //Create the config item
              if (dataElementArray[i] && dataElementArray[i].DATA_KEY != 'FOREIGN_KEY') {
  
                  let dataGridColumnConfigItem = createConfigItem(columnName, 'DataGridColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
  
                  let getLogicalColumnIdByDBCode = logicalColumnDetails[columnName];
  
                  if (dataElementArray[i] && dataElementArray[i]['DATA_ELEMENT_NAME'] !== get_entity_name + '_UUID' && dataElementArray[i].DATA_KEY != 'AUTO_INCREMENT_UNIQUE_KEY') {
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
  
                  const queryDataSourceObj = await getSelectReferenceQueryAndDataSource(dataElementArray[i].DATA_ELEMENT_UUID, dataElementArray[i].PRE_DEFINED_DATA, columnName);
  
                  // Create the config property
                 let propertyObject = {
                     "HEADER_NAME": getHeaderForDataGridColumn(get_entity_name, columnName),
                     "HEADER_ORDER": get_entity_name + '_ID' === columnName ? 4 : get_entity_name + '_UUID' === columnName ? 5 : dataColumnOrder,
                     "IS_ACTION_COLUMN": 0,
                     "ACTION_COLUMN_TYPE": '',
                     "IS_VISIBLE": get_entity_name + '_UUID' === columnName ? 0 : 1,
                     "DATASOURCE_ID": queryDataSourceObj.dataSourceID,
                     "SELECT_ITEMS_REFERENCE_ID": queryDataSourceObj.query,
                     "IS_FILTER_ENABLE": 1,
                     "FILTER_TYPE": ['DateTimePicker', 'DatePicker'].includes(dataElementArray[i].UI_VIEW_TYPE) ? 'DatePicker' : ['TextBox', 'TextArea'].includes(dataElementArray[i].UI_VIEW_TYPE) ? 'TextBox' : ['Hiddenfield'].includes(dataElementArray[i].UI_VIEW_TYPE) ? null : dataElementArray[i].UI_VIEW_TYPE,
                     "IS_HYPERLINK": 0,
                     "IS_ELLIPSES_ENABLE": 1,
                     "IS_AUDIT_COLUMN_JSON": 0,
                     "AUDIT_COLUMN_NAME": '',
                     "IS_TIME_STAMP": columnName === 'AE_TIMESTAMP' ? 1 : 0,
                     "WIDTH": get_entity_name + '_ID' === columnName ? 3 : null,
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
                  if(dataElementArray[i].PRE_DEFINED_DATA !== 'Yes'){
                      createConfigItemPrivilege(privilegeArray, dataGridColumnConfigItem);
                  }else{
                      createConfigItemPrivilege(viewPrivilegeArray, dataGridColumnConfigItem);
                  }
  
                  // Create the config relation between datagrid and data grid column 
                  createConfigItemRelation(datagridId, "DataGrid_DataGridColumn", dataGridColumnConfigItem);
  
                 // Create the config relation between  data grid column and logical column for non audit tables
                 if(type !== 'Audit'){
                     createConfigItemRelation(dataGridColumnConfigItem, "DataGridColumn_LogicalColumn", getLogicalColumnIdByDBCode);
                  }
  
                  if (dataElementArray[i] && 
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
      async function createActionDatagridColumnsForAudit(datagridId){

        //Create the Table Name config item
        let tableNameDataGridCol = createConfigItem('Table Name', 'DataGridColumn', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);

        // Create the config property
        let tableNamePropertyObject = {
            "DBCODE": "TABLE_NAME",
            "HEADER_NAME":"TABLE_NAME",
            "GROUP":"",
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
            "HEADER_NAME":"AUDIT_DATASOURCE",
            "GROUP":"",
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
             "HEADER_NAME":"Changed Data Details",
             "GROUP":"First Column",
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
             "HEADER_NAME":"Transaction Details",
             "GROUP":"First Column",
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
      function createCompositeEntity() {
          //Create the config item
          let item = createConfigItem(input.DATA_SET_NAME, 'CompositeEntity', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
  
          //Create the config privilege
          createConfigItemPrivilege(privilegeArray, item);
  
          return item;
      }
      // function to create the root composite entity node
      function createRootCompositeEntityNode(compositeEntityId, rootCompositeEntityChild) {
          //Create the config item
          let item = createConfigItem(input.DATA_SET_NAME, 'RootCompositeEntityNode', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
  
          let rootCompositeEntityNodeProperty = {
              "DISPLAY_NODE_NAME": camelCaseString(input.DATA_SET_NAME),
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
      // function to create the composite entity node
      function createCompositeEntityNode(compositeEntityId, rootCompositeEntityId, compositeEntityNodeChild) {
          //Create the config item
          let item = createConfigItem(input.DATA_SET_NAME, 'CompositeEntityNode', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
  
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
      function createDataSetRel(mainlogicalEntityConfigId, longtextLogicalEntityConfigId) {
          //Create the config item
          let item = createConfigItem(input.DATA_SET_NAME, 'DataSetRel', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
          //Create the config privilege
          createConfigItemPrivilege(privilegeArray, item);
  
          // Create the config relation between data set rel and child logical entity
          createConfigItemRelation(item, "DataSetRel_LogicalEntity", longtextLogicalEntityConfigId);
  
          // Create the config relation between data set rel and parent logical entity
          createConfigItemRelation(mainlogicalEntityConfigId, "LogicalEntity_DataSetRel", item);
          return item;
      }
      // function to create the data set rel property 
      function createDataSetRelProperty(dataSetRel, mainLogicalColumnDetails, childLongTextDetails) {
          let item = createConfigItem(input.DATA_SET_NAME, 'DataSetRelProperty', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
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
              'LogicalColumn_Child': childLongTextDetails[get_entity_name + '_UUID'],
              'LogicalColumn': mainLogicalColumnDetails[get_entity_name + '_UUID']
          }
  
          // Create the config relation between data set rel property and logical
          for (let key in childRelation) {
              createConfigItemRelation(item, "DataSetRelProperty_" + key, childRelation[key]);
          }
  
      }
  
  
      // Calling the function to create main logical entity
      let mainlogicalEntityConfigId = createLogicalEntity(get_entity_name);
      // Calling the function to create main physical entity
      let mainPhysicalEntityConfigId = createPhysicalEntity(get_entity_name, mainlogicalEntityConfigId, mainTableDataObject, isLongTextDataExist);
      // Calling the function to create main physical column
      createPhysicalColumn(mainPhysicalEntityConfigId, create_table_list);
      // Calling the function to create main logical column
      let mainLogicalColumnDetails = createLogicalColumn(mainlogicalEntityConfigId, create_table_list);
      // Calling function to create form section for normal field
      let commonMainFormSectionId = createFormSection(get_entity_name, 2);
  
      let formSectionIdList = [commonMainFormSectionId];
      let commonAttachmentFormSectionId;
      if (input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes') {
          // Calling function to create form section for attachment field
          commonAttachmentFormSectionId = createFormSection('ATTACHMENT', 1);
          formSectionIdList.push(commonAttachmentFormSectionId)
      }
  
      // Calling function to create Add form 
      let addMainFormId = createForm('Add', input.DATA_SET_NAME, formSectionIdList, mainlogicalEntityConfigId, 'Main');
      // Calling function to create form field including attachment
      let formFieldDetails = await createFormField(commonMainFormSectionId, mainLogicalColumnDetails, 'Main', commonAttachmentFormSectionId);
      // Calling function to create button and Add button panel 
      createButtonPanelAndButton('Add', { "BUTTON_PANEL_POSITION": "TOP", "MODE": "Insert" }, ['Save'], "Form_ButtonPanel", addMainFormId, input.DATA_SET_NAME);
      // Calling function to create Edit form 
      let editMainFormId = createForm('Edit', input.DATA_SET_NAME, formSectionIdList, mainlogicalEntityConfigId, 'Main');
      // Calling function to create button and Edit button panel 
      createButtonPanelAndButton('Edit', { "BUTTON_PANEL_POSITION": "TOP", "MODE": "Edit" }, ['Update', 'Delete'], "Form_ButtonPanel", editMainFormId, input.DATA_SET_NAME);
  
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
  
      // preparing data to store details of add and edit form in Data Set Ui Component table.
      let dataSetUIComponent = [
          {
              "DATA_SET_UI_VIEW_UUID": uuid(),
              "DATA_SET_UUID": input.DATA_SET_UUID,
              "DATA_SET_UI_VIEW_NAME": 'Add ' + input.DATA_SET_NAME + ' [(SUB PAGE)(SYSTEM)]',
              "DATA_SET_UI_VIEW_TYPE": 'ADD_FORM',
              "DATA_SET_UI_VIEW_CONFIG_ITEM_ID": addMainFormId,
              "COMPONENT_PER_ROW": 2
          },
          {
              "DATA_SET_UI_VIEW_UUID": uuid(),
              "DATA_SET_UUID": input.DATA_SET_UUID,
              "DATA_SET_UI_VIEW_NAME": 'Edit ' + input.DATA_SET_NAME + ' [(SUB PAGE)(SYSTEM)]',
              "DATA_SET_UI_VIEW_TYPE": 'EDIT_FORM',
              "DATA_SET_UI_VIEW_CONFIG_ITEM_ID": editMainFormId,
              "COMPONENT_PER_ROW": 2
          }
      ];
      let dataSetRelationUIComponent = [];
      let primaryGridID;
      // the below for loop is responsible to create the multiple grid when relation exist
      let configItemName;
      for (let gridList of dataGridList) {
          configItemName = gridList && gridList['Parent'] && gridList['Child'] ? gridList['Child'] + ' By ' + gridList['Parent'] : gridList['Parent'];
          let detailsMainDataGrid = createDataGrid(addMainFormId, configItemName);
          createLogicalEntityOperation(detailsMainDataGrid, gridList);
          let dataSetDataGridUiComponentData = await createDataGridColumn(detailsMainDataGrid, formFieldDetails, mainLogicalColumnDetails);
          createButtonPanelAndButton('List', { "BUTTON_PANEL_POSITION": "TOP", "MODE": "Insert" }, ['Add', 'Inline Add'], "DataGrid_ButtonPanel", detailsMainDataGrid, configItemName);
  
          if (gridList && gridList['Key'] == 'Primary') {
             // calling function to create the audit grid
             let detailsAuditDataGrid = createDataGrid(addMainFormId, configItemName + ' Audit');
             // creating logical entity operation for audit grid  
             createLogicalEntityOperation(detailsAuditDataGrid, gridList, 'Audit');
             // creating datagrid columns for audit grid
             let auditDataSetDataGridUiComponentData = await createDataGridColumn(detailsAuditDataGrid, null, mainLogicalColumnDetails, 'Audit');
              // preparing data to store details of data grid in Data Set Ui Component table.
              dataSetUIComponent.push({
                  "DATA_SET_UI_VIEW_UUID": uuid(),
                  "DATA_SET_UUID": input.DATA_SET_UUID,
                  "DATA_SET_UI_VIEW_NAME": input.DATA_SET_NAME + ' List ' + '[(SUB PAGE)(SYSTEM)]',
                  "DATA_SET_UI_VIEW_TYPE": 'DATAGRID',
                  "DATA_SET_UI_VIEW_CONFIG_ITEM_ID": detailsMainDataGrid,
                  "JSON_DATA": JSON.stringify(dataSetDataGridUiComponentData)
              });
  
                // is data set uuid and view name correct?
             dataSetUIComponent.push({
                 "DATA_SET_UI_VIEW_UUID": uuid(),
                 "DATA_SET_UUID": input.DATA_SET_UUID,
                 "DATA_SET_UI_VIEW_NAME": input.DATA_SET_NAME + ' Audit List ' + '[(SUB PAGE)(SYSTEM)]',
                 "DATA_SET_UI_VIEW_TYPE": 'AUDIT_DATAGRID',
                 "DATA_SET_UI_VIEW_CONFIG_ITEM_ID": detailsAuditDataGrid,
                 "JSON_DATA": JSON.stringify(auditDataSetDataGridUiComponentData)
             });
              primaryGridID = detailsMainDataGrid;
          } else if (gridList && gridList['Key'] == 'Foreign' && gridList['DATA_SET_PARENT_UUID'] && gridList['DATA_SET_CHILD_UUID']) {
              // preparing data to store details of data grid in Data Set Relation Ui Component table.
              dataSetRelationUIComponent.push({
                  "DATA_SET_RELATIONSHIP_UI_VIEW_UUID": uuid(),
                  "DATA_SET_RELATIONSHIP_UUID": gridList['DATA_SET_RELATIONSHIP_UUID'],
                  "DATA_SET_RELATIONSHIP_UI_VIEW_NAME": gridList['Child'] + ' By ' + gridList['Parent'] + ' List ' + '[(SUB PAGE)(SYSTEM)]',
                  "DATA_SET_RELATIONSHIP_UI_VIEW_TYPE": 'DATAGRID',
                  "DATA_SET_RELATIONSHIP_UI_VIEW_CONFIG_ITEM_ID": detailsMainDataGrid,
                  "JSON_DATA": JSON.stringify(dataSetDataGridUiComponentData)
              })
          }         
      }
  
      //Calling the functions to create longtext entity
      if (isLongTextDataExist && createjsonTableElementList.length) {
          // Calling the function to create longtext logical entity
          let longtextLogicalEntityConfigId = createLogicalEntity(get_entity_name + '_LONGTEXT_DATA');
          // Calling the function to create longtext physical entity
          let longtextPhysicalEntityConfigId = createPhysicalEntity(get_entity_name + '_LONGTEXT_DATA', longtextLogicalEntityConfigId, longTextTableDataObject, isLongTextDataExist);
          // Calling the functions to create longtext logical column
          createPhysicalColumn(longtextPhysicalEntityConfigId, createjsonTableElementList);
          // Calling the function to create longtext logical column
          let longtextLogicalColumnDetails = createLogicalColumn(longtextLogicalEntityConfigId, createjsonTableElementList);
          // Calling the function to create longtext formsection
          let commonLongTextFormSectionId = createFormSection(get_entity_name + '_LONGTEXT_DATA', 1);
          // Calling the function to create longtext form
          let addLongTextFormId = createForm('Add', input.DATA_SET_NAME + ' LongText Data', [commonLongTextFormSectionId], longtextLogicalEntityConfigId, 'LongText');
          // Calling the function to create longtext form field
          let returnedLongtextCodeSetId = await createFormField(commonLongTextFormSectionId, longtextLogicalColumnDetails, 'LongText', '');
          // let editLongTextFormId = createForm('Edit', input.DATA_SET_NAME + ' LongText Data', [commonLongTextFormSectionId], longtextLogicalEntityConfigId,'LongText');
  
          // Calling the function to create longtext composite entity
          let compositeEntityId = createCompositeEntity();
          let rootCompositeEntityChild = {
              'LogicalEntity': mainlogicalEntityConfigId,
              'PhysicalEntity': mainPhysicalEntityConfigId,
              'InsertForm': addMainFormId,
              'EditForm': editMainFormId,
              'DataGrid': primaryGridID
          };
          // Calling the function to create longtext root composite entity
          let rootCompositeEntityId = createRootCompositeEntityNode(compositeEntityId, rootCompositeEntityChild);
          let compositeEntityNodeChild = {
              'LogicalEntity': longtextLogicalEntityConfigId,
              'PhysicalEntity': longtextPhysicalEntityConfigId,
              'InsertForm': addLongTextFormId
          };
          // Calling the function to create longtext composite entity node
          let compositeEntityNodeId = createCompositeEntityNode(compositeEntityId, rootCompositeEntityId, compositeEntityNodeChild);
          // Calling the function to create longtext data set rel
          let dataSetRel = createDataSetRel(mainlogicalEntityConfigId, longtextLogicalEntityConfigId);
          // Calling the function to create longtext data set rel property
          createDataSetRelProperty(dataSetRel, mainLogicalColumnDetails, longtextLogicalColumnDetails)
      }
  
  
      // Creating the records in the Data Set Ui Component Tree table for Add/Edit Form and Main DataGrid.
      for (let uiComponents of dataSetUIComponent) {
          let dataSetUiComponentTreeObject = {};
          dataSetUiComponentTreeObject['DATA_SET_UI_VIEW_UUID'] = uiComponents.DATA_SET_UI_VIEW_UUID;
          dataSetUiComponentTreeObject['DATA_SET_UI_VIEW_TREE_JSON'] = ['ADD_FORM', 'EDIT_FORM'].includes(uiComponents.DATA_SET_UI_VIEW_TYPE) ? JSON.stringify(dataSetFormFieldUiComponentData) : uiComponents && uiComponents?.JSON_DATA;
          dataSetUiComponentTreeObject['DATA_SET_UI_VIEW_TREE_LEVEL'] = ['ADD_FORM', 'EDIT_FORM'].includes(uiComponents.DATA_SET_UI_VIEW_TYPE) &&  input.IS_ATTACHMENT_CAPABLITY_REQUIRED == 'Yes' ? 4 : 3;
          dataSetUiComponentTree.push(dataSetUiComponentTreeObject);
      }
  
      // Creating the records in the Data Set Ui Component Tree table for Different DataGrid.
      for (let relationUiComponents of dataSetRelationUIComponent) {
          let dataSetRelationUiComponentTreeObject = {};
          dataSetRelationUiComponentTreeObject['DATA_SET_RELATIONSHIP_UI_VIEW_UUID'] = relationUiComponents.DATA_SET_RELATIONSHIP_UI_VIEW_UUID;
          dataSetRelationUiComponentTreeObject['DATA_SET_RELATIONSHIP_UI_VIEW_TREE_JSON'] = relationUiComponents && relationUiComponents?.JSON_DATA;
          dataSetRelationUiComponentTreeObject['DATA_SET_RELATIONSHIP_UI_VIEW_TREE_LEVEL'] = 1;
          dataSetRelationUiComponentTree.push(dataSetRelationUiComponentTreeObject);
      }
  
      populatePhysicalColumnName(data_ElementId);
  
      //appeng linking with generated data 
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
  // the below if block is responsible to create the auto increment data element column when action is save 
  if (input.compositeEntityAction == 'Save') {
      const data_Element = {};
      const data_ElementList = [];
      let dataElement_UUID = uuid();
      data_Element["DATA_ELEMENT_UUID"] = dataElement_UUID;
      data_Element["DATA_ELEMENT_NAME"] = input.DATA_SET_NAME + " ID";
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
  
  function makeUpperCaseString(str) {
      let stringValue = str.replaceAll(' ', '_').toUpperCase();
      return stringValue;
  }
  // function to popelate the physical column value
  function populatePhysicalColumnName(dataElementList) {
      if (dataElementList.length) {
          let dataElementArray = [];
          for (let i = 0; i < dataElementList.length; i++) {
              let dataElementObject = {};
              dataElementObject['DATA_SET_UUID'] = dataElementList[i].DATA_SET_UUID;
              dataElementObject['DATA_ELEMENT_UUID'] = dataElementList[i].DATA_ELEMENT_UUID;
              dataElementObject['PHYSICAL_TABLE_COLUMN_NAME'] = makeUpperCaseString(dataElementList[i].DATA_ELEMENT_NAME);
              dataElementArray.push(dataElementObject)
          }
          input["AppEngChildEntity:DATA_ELEMENT"] = dataElementArray;
      }
  }
  
  let DATA_SET = [];
  let DATA_ELEMENT = [];
  let DATA_ELEMENT_LONGTEXT = [];
  let MASTER_DATA_SET_TRANSACTION_DATA_ELEMENTS = [];
  
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
      } else if (tablename == 'MASTER_DATA_SET_TRANSACTION_DATA_ELEMENT') {
          MASTER_DATA_SET_TRANSACTION_DATA_ELEMENTS.push(deleteTableData);
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
  
          let QuerytoFetchDataElementsPreDefinedValues = 'select MASTER_DATA_SET_TRANSACTION_DATA_ELEMENT_UUID from MASTER_DATA_SET_TRANSACTION_DATA_ELEMENT where DATA_ELEMENT_UUID=:DATA_ELEMENT_UUID;';
          let QuerytoFetchDataElementsPreDefinedValuesData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_TENANT", QuerytoFetchDataElementsPreDefinedValues, input);
          let QuerytoFetchDataElementsPreDefinedValuesRecords = JSON.parse(JSON.stringify(QuerytoFetchDataElementsPreDefinedValuesData));
          for (let key in QuerytoFetchDataElementsPreDefinedValuesRecords) {
              deleteRecord('MASTER_DATA_SET_TRANSACTION_DATA_ELEMENT_UUID', QuerytoFetchDataElementsPreDefinedValuesRecords[key].MASTER_DATA_SET_TRANSACTION_DATA_ELEMENT_UUID, 'MASTER_DATA_SET_TRANSACTION_DATA_ELEMENT', input['APP_LOGGED_IN_FUNTIONAL_AREA_ID']);
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
  input["AppEngChildEntity:MASTER_DATA_SET_TRANSACTION_DATA_ELEMENT"] = MASTER_DATA_SET_TRANSACTION_DATA_ELEMENTS;
  input["AppEngChildEntity:DATA_ELEMENT_LONGTEXT"] = DATA_ELEMENT_LONGTEXT;
  }} catch (e) {
      console.log("::::::::::::::::::::::::::::::::error::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::", e);
  }