// Convert string into camel case
function camelCaseString(stringData) {
    let toLowerDStringData = stringData.toLowerCase();
    const words = toLowerDStringData.split("_");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0] ? words[i][0].toUpperCase() + words[i].substr(1) : "";
    }
    return words.join(' ')
  }
  
  let configprivilegeList = [];
  let configpropertyList = [];
  let configrelationList = [];
  let configItemList = [];
  let onlineScreenUIComponentArray = [];
  // Function to create the config item
  function createConfigItem(itemName, itemType, projectId, releaseName, isGenerateId) {
    const configItem = {};
    let itemId = isGenerateId ? isGenerateId : uuid();
    configItem["ITEMID"] = itemId;
    configItem["ITEMNAME"] = itemName;
    configItem["ITEMTYPE"] = itemType;
    configItem["PROJECTID"] = projectId;
    configItem["CONFIG_RELEASE_NAME"] = releaseName;
    configItemList.push(configItem);
    return itemId;
  }
  
  //  Function to create the config item property
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
  
  //  Function to create the config item privilege 
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
  
  //  Function to create the config item relation 
  function createConfigItemRelation(parentId, relationType, childId) {
    const configRelation = {};
    configRelation["RELATIONID"] = uuid();
    configRelation["RELATIONTYPE"] = relationType;
    configRelation["PARENTITEMID"] = parentId;
    configRelation["CHILDITEMID"] = childId;
    configrelationList.push(configRelation);
  }
  
  //  Function to update the config item
  function updateConfigItem(inputData, recordData) {
    const configItem = {};
    configItem["ITEMID"] = recordData.ITEMID;
    configItem["ITEMNAME"] = inputData;
    configItem["ITEMTYPE"] = recordData.ITEMTYPE;
    configItem["PROJECTID"] = recordData.PROJECTID;
    configItem["CONFIG_RELEASE_NAME"] = recordData.CONFIG_RELEASE_NAME;
    configItemList.push(configItem);
  }
  
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
  
  
  // Function to delete the configitem, configprivilege, configproperty, configrelation and OnlineScreenUIView
  
  function deleteRecords(key, value, deleteType, releaseName) {
    const deleteParamenter = {};
    deleteParamenter[key] = value;
    deleteParamenter["compositeEntityAction"] = "Delete";
    deleteParamenter["CONFIG_RELEASE_NAME"] = releaseName;
    if (deleteType === "CONFIGITEM") {
      configItemList.push(deleteParamenter);
    } else if (deleteType === "CONFIGITEMPROPERTY") {
      configpropertyList.push(deleteParamenter);
    } else if (deleteType === "CONFIGITEMPRIVILEGE") {
      configprivilegeList.push(deleteParamenter);
    } else if (deleteType === "CONFIGITEMRELATION") {
      configrelationList.push(deleteParamenter);
    } else if (deleteType === "ONLINE_SCREEN_UI_VIEW") {
      onlineScreenUIComponentArray.push(deleteParamenter);
    }
  }
  
  
  //assign EDIT privillege to only Product admin
  let privilegeArray = {
    1: "NO PRIVILEGE",
    2: "NO PRIVILEGE",
    3: "EDIT"
  };
  
  //  Function to create the portal config item
  function createPortal(processName, isGenerateId) {
    //Create the config item
    let portal_configItem = createConfigItem(processName, 'Portal', input.PROJECTID, input["CONFIG_RELEASE_NAME"], isGenerateId);
  
    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, portal_configItem);
  
    return portal_configItem;
  }
  
  //  Function to create the config item portal card 
  function createPortalCard(portalOrSubPortalId, processName, relationType, isGenerateId) {
    // Create portal card
    let portalCard_configItem = createConfigItem(processName, 'PortalCard', input.PROJECTID, input["CONFIG_RELEASE_NAME"], isGenerateId);
  
    // Create the config privilege for portalcard
    createConfigItemPrivilege(privilegeArray, portalCard_configItem);
  
    // Create the config relation between portal and portalcard
    createConfigItemRelation(portalOrSubPortalId, relationType, portalCard_configItem);
  
    return portalCard_configItem;
  }
  
  // Function to create the config item portal card property
  function createPortalCardProperty(portalCardId, label, componentId, componentType, initialComponent, cardDataSharing, type) {
    // When type parent item is portal creating properties present in block 1 and When type is sub portal creating properties present in block 2
    let portalCardProperty = (type == 'PORTAL' ? {
      "LABEL": label,
      "DISPLAY_HEADER": 1,
      "ORDER": 5,
      "TYPE": componentType,
      "COMPONENT_ID": componentId,
      "INITIAL_COMPONENT": initialComponent,
      "RELOAD_REQUIRED": 0,
      "IS_FULL_SCREEN_REQUIRED": 0,
      "CARD_DATA_SHARING": cardDataSharing,
      "CARD_STYLE": componentType && ['TabGroup', 'PortalDataGrid'].includes(componentType) ? 'padding-top: 0px;padding-bottom: 0px;padding-right: 4px; padding-left: 4px;margin-bottom:auto;' : "",
      "CARD_BODY_STYLE": componentType && ['TabGroup', 'PortalDataGrid'].includes(componentType) ? 'padding-top: 0px;padding-bottom: 0px;padding-right: 4px; padding-left: 4px;margin-bottom:auto;' : ""
    } : type == 'SUBPORTAL' ? {
      "LABEL": label,
      "DISPLAY_HEADER": 1,
      "ORDER": 5,
      "TYPE": componentType,
      "COMPONENT_ID": componentId,
      "CARD_DATA_SHARING": cardDataSharing,
      "BOX_SHADOW": 0,
      "IS_STATIC": 0,
      "IS_ACCESSIBLE": 0,
      "IS_FAVORITE": 0,
      "RELOAD_REQUIRED": 0,
      "REFER_DATA_FROM_PORTAL": 0,
      "IS_FULL_SCREEN_REQUIRED": 0,
      "IS_ARCHIVED": 0,
      "CARD_STYLE": componentType && ['TabGroup', 'PortalDataGrid'].includes(componentType) ? 'padding-top: 0px;padding-bottom: 0px;padding-right: 4px; padding-left: 4px;margin-bottom:auto;' : "",
      "CARD_BODY_STYLE": componentType && ['TabGroup', 'PortalDataGrid'].includes(componentType) ? 'padding-top: 0px;padding-bottom: 0px;padding-right: 4px; padding-left: 4px;margin-bottom:auto;' : ""
    } : {})
  
    // Create property for portal card
    createConfigItemProperty(portalCardProperty, portalCardId);
  }
  
  // Function to create the config item portaldatagrid  
  function createPortalDataGrid(dataSetName, datagridId, isGenerateId) {
    //Create the config item
    let portalDataGrid_ConfigItem = createConfigItem(dataSetName, 'PortalDataGrid', input.PROJECTID, input["CONFIG_RELEASE_NAME"], isGenerateId);
  
    let portalDataGridProperty = { "DATAGRID_ID": datagridId, "COMPOSITE_ENTITY_ID": "", "COMPOSITE_ENTITY_NODE_ID": "" };
  
    createConfigItemProperty(portalDataGridProperty, portalDataGrid_ConfigItem);
  
    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, portalDataGrid_ConfigItem);
  
    return portalDataGrid_ConfigItem;
  }
  
  //  Function to create the config item portal form
  function createPortalForm(type, dataSetName, formId, compositeEntity, rootCompositeEntity, isGenerateId) {
    //Create the config item
    let portalForm_configItem = createConfigItem(type + ' ' + dataSetName, 'PortalForm', input.PROJECTID, input["CONFIG_RELEASE_NAME"], isGenerateId);
  
    // Property for PortalForm
    let propertyObject = { "FORM_ID": formId, "COMPOSITE_ENTITY_ID": compositeEntity ? compositeEntity : "", "COMPOSITE_ENTITY_NODE_ID": rootCompositeEntity ? rootCompositeEntity : "" };
  
    createConfigItemProperty(propertyObject, portalForm_configItem);
  
    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, portalForm_configItem);
  
    return portalForm_configItem;
  }
  
  //  Function to create the config item sub portal
  function createSubPortal(dataSetName, actionType, relationType, portalDataGridORTabPortal, isGenerateId) {
    //Create the config item
    let subPortal_configItem = createConfigItem(dataSetName, 'SubPortal', input.PROJECTID, input["CONFIG_RELEASE_NAME"], isGenerateId);
  
    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, subPortal_configItem);
  
    let subPortalProperty = { "ACCESSBILITY_REGEX": actionType }
  
    // Create property for sub portal
    createConfigItemProperty(subPortalProperty, subPortal_configItem);
  
    if (relationType) {
      // Create relation between the subportal and the portal data grid / tab portal
      createConfigItemRelation(portalDataGridORTabPortal, relationType, subPortal_configItem);
    }
  
    return subPortal_configItem;
  }
  
  // fetch menu group details
  const menuGroupQuery = "select ITEMID from CONFIGITEM where ITEMTYPE='MenuGroup' and PROJECTID=:PROJECTID";
  let fetchMenuGroup = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", menuGroupQuery, input);
  const fetchMenuGroupData = JSON.parse(JSON.stringify(fetchMenuGroup));
  let menuGroupId = fetchMenuGroupData[0].ITEMID;
  
  //  Function to create the config item menu
  function createMenuGroupAndMenuItem(inputData, property) {
    // create the config (menu or menu group)
    let menuItemId = createConfigItem(inputData.ONLINE_SCREEN_MENU_NAME, 'Menu', inputData.PROJECTID, inputData['CONFIG_RELEASE_NAME']);
    // create the property for menu or menu group
    createConfigItemProperty(property, menuItemId);
    // create the relation for menu or menugroup
    createConfigItemRelation(menuGroupId, 'MenuGroup_Menu', menuItemId);
    // create the privilege for menugroup or menu
    createConfigItemPrivilege(privilegeArray, menuItemId);
  
    return menuItemId;
  }
  
  //  Function to create the config item tab group
  function createTabGroup(portalCardId, dataSetName, type, relationType, isGenerateId) {
  
    //Create the config item
    let tabGroup_configItem = createConfigItem(dataSetName, 'TabGroup', input.PROJECTID, input["CONFIG_RELEASE_NAME"], isGenerateId);
  
    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, tabGroup_configItem);
  
    let tabGroupProperty = { "TYPE": type }
  
    // Create property for tab group
    createConfigItemProperty(tabGroupProperty, tabGroup_configItem);
  
    // Create relation between the portalcard and tangroup
    createConfigItemRelation(portalCardId, relationType, tabGroup_configItem);
  
    return tabGroup_configItem;
  
  }
  
  //  Function to create the config item tab portal 
  function createTabPortal(tabGroup, dataSetName, tabPortalProperty, relationType) {
    //Create the config item
    let tabPortal_configItem = createConfigItem(dataSetName, 'TabPortal', input.PROJECTID, input["CONFIG_RELEASE_NAME"]);
  
    // Create the config privilege
    createConfigItemPrivilege(privilegeArray, tabPortal_configItem);
  
    // Create property for tab group
    createConfigItemProperty(tabPortalProperty, tabPortal_configItem);
  
    // Create relation between the subportal and the portal data grid
    createConfigItemRelation(tabGroup, relationType, tabPortal_configItem);
  
    return tabPortal_configItem;
  }
  
  //  Common function to fetch the composite entity 
  async function fetchCompositeEntity(dataSetName) {
    const compositeEntityConfigItemQuery = `SELECT ITEMID,ITEMNAME,ITEMTYPE FROM CONFIGITEM where ITEMNAME=${"'" + dataSetName + "'"} AND ITEMTYPE='CompositeEntity' AND PROJECTID=:PROJECTID`;
    return await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", compositeEntityConfigItemQuery, input);
  }
  
  //  Common function to fetch the root composite entity 
  async function fetchRootCompositeEntity(dataSetName) {
    const rootCompositeEntityConfigItemQuery = `SELECT ITEMID,ITEMNAME,ITEMTYPE FROM CONFIGITEM where ITEMNAME=${"'" + dataSetName + "'"} AND ITEMTYPE ='RootCompositeEntityNode' AND PROJECTID=:PROJECTID`;
    return await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", rootCompositeEntityConfigItemQuery, input);
  }
  
  function replaceSpaceAndMakeUpperCaseString(str) {
    let stringValue = str;
    //  stringValue = stringValue.replace(/^\s+|\s+$/g, '');
    stringValue = stringValue.replaceAll(' ', '_').toUpperCase();
    return stringValue;
  }
  
  // Recursion function to fetch the relation and item when user clicks on delete node
  const deleteChildConfiguration = async (parentId, activeReleaseName, storeConfigItemRelation, storeConfigItem) => {
    // Fetching the parent relation by child id
    let getParentRelationQuery = `SELECT RELATIONID,RELATIONTYPE,PARENTITEMID,CHILDITEMID,ISDELETED FROM CONFIGITEMRELATION where CHILDITEMID IN (SELECT ITEMID FROM CONFIGITEM WHERE ITEMID IN (${"'" + parentId + "'"}) AND PROJECTID=:PROJECTID) and CONFIG_RELEASE_NAME = ${"'" + activeReleaseName + "'"}`;
    let getParentRelationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", getParentRelationQuery, input);
  
    if (getParentRelationQueryData.length > 0 && getParentRelationQueryData[0].RELATIONID) {
      storeConfigItemRelation.push(getParentRelationQueryData[0].RELATIONID);
    }
  
    // Recusion function to fetch the child element by using parent id 
    const fetchChildElements = async (parentId, activeReleaseName) => {
      try {
        // Fetching the child element by parent id 
        let getChildRelationQuery = `SELECT RELATIONID,RELATIONTYPE,PARENTITEMID,CHILDITEMID,ISDELETED FROM CONFIGITEMRELATION where PARENTITEMID IN (SELECT ITEMID FROM CONFIGITEM WHERE ITEMID IN (${"'" + parentId + "'"}) AND PROJECTID=:PROJECTID) and CONFIG_RELEASE_NAME = ${"'" + activeReleaseName + "'"}`;
        let getChildRelationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", getChildRelationQuery, input);
  
        // When id exist, pushing id in the array for further use
        if (parentId) {
          if (!storeConfigItem.includes(parentId)) {
            storeConfigItem.push(parentId);
          }
        }
  
        // Checking child exist or not by checking the result length
        if (getChildRelationQueryData && getChildRelationQueryData.length) {
          // Iterating the result 
          for (let element of getChildRelationQueryData) {
            // Splitting the relkation type 
            let relationType = element.RELATIONTYPE && element.RELATIONTYPE.split('_');
            // By relation type checking the if relation type has portal card then fetching the properties of portal card to get the what item is linked with that portal card
            if (['PortalCard'].includes(relationType[1])) {
              // Storing the relation id in the array for further use
              if (!storeConfigItemRelation.includes(element.RELATIONID)) {
                storeConfigItemRelation.push(element.RELATIONID);
              }
              // Fetching the properties of portal card
              let getPropertyQuery = `SELECT PROPERTYID, PROPERTYNAME, PROPERTYVALUE, ITEMID, ISDELETED FROM CONFIGITEMPROPERTY where ITEMID= ${"'" + element.CHILDITEMID + "'"}`;
              let getPropertyQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", getPropertyQuery, input);
              // Checking property exist or not by checking the result length
              if (getPropertyQueryData && getPropertyQueryData.length) {
                // Iterating the result of property
                for (let property of getPropertyQueryData) {
                  if (['COMPONENT_ID'].includes(property.PROPERTYNAME)) {
                    if (!storeConfigItemRelation.includes(element.RELATIONID)) {
                      storeConfigItemRelation.push(element.RELATIONID)
                    }
                    // Calling the function in recursion to get the parent child result
                    await fetchChildElements(property.PROPERTYVALUE, activeReleaseName);
                  }
                }
              }
            }
            if (element.CHILDITEMID) {
              if (!storeConfigItemRelation.includes(element.RELATIONID)) {
                storeConfigItemRelation.push(element.RELATIONID)
              }
              // Calling the function in recursion to get the parent child result
              await fetchChildElements(element.CHILDITEMID, activeReleaseName);
            }
          }
        }
      } catch (e) {
        console.log("::::::::::::: error occured ::::::::::::::::", e);
      }
    }
    await fetchChildElements(parentId, activeReleaseName)
    return null;
  }
  
  // Function to link the add portal with add button of grid
  async function fetchButton(dataGridConfigId, addPortal) {
    // Firing the query in the relation table to fetch the child of grid.
    let getDatGridRelationQuery = `SELECT CHILDITEMID FROM CONFIGITEMRELATION where RELATIONTYPE = 'DataGrid_ButtonPanel' AND PARENTITEMID IN (SELECT ITEMID FROM CONFIGITEM WHERE ITEMID IN (${"'" + dataGridConfigId + "'"}) AND PROJECTID=:PROJECTID) and CONFIG_RELEASE_NAME = ${"'" + activeReleaseName + "'"}`;
    let getDatGridRelationQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", getDatGridRelationQuery, input);
  
    // Firing the query in the relation table to fetch the child of buttonpanel.
    let getButtonPanelRelationQuery = `SELECT CHILDITEMID FROM CONFIGITEMRELATION where RELATIONTYPE = 'ButtonPanel_Button' AND PARENTITEMID IN (SELECT ITEMID FROM CONFIGITEM WHERE ITEMID IN (${"'" + getDatGridRelationQueryData.CHILDITEMID + "'"}) AND PROJECTID=:PROJECTID) and CONFIG_RELEASE_NAME = ${"'" + activeReleaseName + "'"}`;
    let getButtonPanelRelationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", getButtonPanelRelationQuery, input);
  
    if (getButtonPanelRelationQueryData && getButtonPanelRelationQueryData.length) {
      for (let buttonItem of getButtonPanelRelationQueryData) {
        const addDataGridButtonConfigItemPropQuery = `SELECT * FROM CONFIGITEMPROPERTY where PROPERTYNAME in ('PORTAL_ID','MODAL_REQUIRED') AND ITEMID=${"'" + buttonItem.CHILDITEMID + "'"}`;
        const addDataGridButtonConfigItemPropQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", addDataGridButtonConfigItemPropQuery, input);
  
        if (addDataGridButtonConfigItemPropQueryData && addDataGridButtonConfigItemPropQueryData.length) {
          for (let i = 0; i < addDataGridButtonConfigItemPropQueryData.length; i++) {
            let obj = {};
            // Attaching the portal 
            if (addDataGridButtonConfigItemPropQueryData[i].PROPERTYNAME === 'PORTAL_ID') {
              obj['PROPERTYID'] = addDataGridButtonConfigItemPropQueryData[i].PROPERTYID;
              obj['PROPERTYNAME'] = addDataGridButtonConfigItemPropQueryData[i].PROPERTYNAME;
              obj['PROPERTYVALUE'] = addPortal;
              obj['ITEMID'] = addDataGridButtonConfigItemPropQueryData[i].ITEMID;
  
            } else if (addDataGridButtonConfigItemPropQueryData[i].PROPERTYNAME === 'MODAL_REQUIRED') { // Enabling the modal
              obj['PROPERTYID'] = addDataGridButtonConfigItemPropQueryData[i].PROPERTYID;
              obj['PROPERTYNAME'] = addDataGridButtonConfigItemPropQueryData[i].PROPERTYNAME;
              obj['PROPERTYVALUE'] = 1;
              obj['ITEMID'] = addDataGridButtonConfigItemPropQueryData[i].ITEMID;
            }
            configpropertyList.push(obj);
          }
        }
      }
    }
  }
  
  // Function to show and hide the expand iton of immediate parent
  async function showAndHideExpandColumn(inputData, isVisible) {
    // Extracting the immediate parent details
    let parentDataGridDetails = inputData.immediateParentDetails && inputData.immediateParentDetails.node.children.length && inputData.immediateParentDetails.node.children.filter((item) => item.className === "DATAGRID");
    if (parentDataGridDetails && parentDataGridDetails.length) {
      // Immediate parent data grid id
      let parentDataGridConfigId = parentDataGridDetails[0].primaryKey;
  
      // Firing the query in the relation table to fetch the child of grid.
      let getParentRelationQuery = `SELECT CHILDITEMID FROM CONFIGITEMRELATION where PARENTITEMID IN (SELECT ITEMID FROM CONFIGITEM WHERE ITEMID IN (${"'" + parentDataGridConfigId + "'"}) AND PROJECTID=:PROJECTID) and CONFIG_RELEASE_NAME = ${"'" + activeReleaseName + "'"}`;
      let getParentRelationQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", getParentRelationQuery, input);
  
      let result = getParentRelationQueryData && getParentRelationQueryData.map((item) => "'" + item.CHILDITEMID + "'").join(",");
  
      // By using all the child id , firing the query in item table to get al the config item
      let getItemQuery = `SELECT ITEMID,ITEMNAME FROM CONFIGITEM WHERE ITEMID IN (${result}) AND PROJECTID=:PROJECTID and CONFIG_RELEASE_NAME = ${"'" + activeReleaseName + "'"}`;
      let getItemQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", getItemQuery, input);
  
      // Checking the item exist of not in the getItemQueryData by checking the length
      if (getItemQueryData && getItemQueryData.length) {
        // Iterating the  getItemQueryData 
        for (let itemData of getItemQueryData) {
          // Checking any data grid column exist with item name Expand if exist modifing the property to show and hide
          if (itemData.ITEMNAME == 'Expand') {
            // Firing the query to get the expand column properties
            let getPropertyQuery = `SELECT PROPERTYID, PROPERTYNAME, PROPERTYVALUE, ITEMID, ISDELETED FROM CONFIGITEMPROPERTY where ITEMID= ${"'" + itemData.ITEMID + "'"} and PROPERTYNAME='IS_VISIBLE'`;
            let getPropertyQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", getPropertyQuery, input);
            if (getPropertyQueryData && getPropertyQueryData.length) {
              // Modifying the properties
              updateConfigItemProperty(getPropertyQueryData, { "IS_VISIBLE": isVisible ? '1' : '0' });
            }
          }
        }
      }
    }
  }
  
  // Firing the query to get the active release
  let getActiveReleaseQuery = `SELECT CONFIG_RELEASE_NAME FROM CONFIG_RELEASE where STATUS='Active'`;
  let getActiveReleaseQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", getActiveReleaseQuery, input);
  let activeReleaseName = getActiveReleaseQueryData && Object.keys(getActiveReleaseQueryData).length ? getActiveReleaseQueryData['CONFIG_RELEASE_NAME'] : '';
  
  // Below block will exiecute when action is save
  if (input.compositeEntityAction === 'Save') {
    // Fetching the menus tree data
    const menuDataQuery = `SELECT * FROM MENU_DATA where FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
    const menuDataQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFO_APPS", menuDataQuery, input);
    let menuJsonTree = [];
  
    if (menuDataQueryData && Object.keys(menuDataQueryData).length) {
      menuJsonTree = menuJsonTree.concat(JSON.parse(menuDataQueryData.MENU_JSON));
    }
  
    if (input.ONLINE_SCREEN_DATA_SET_UUID) {
      let onlineScreenPortal;
      let onlineScreenPortalCard;
  
      // Fetching the data set details from the data set table
      const dataSetQuery = `SELECT * FROM DATA_SET where DATA_SET_UUID=:ONLINE_SCREEN_DATA_SET_UUID`;
      const dataSetQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFO_APPS", dataSetQuery, input);
  
      //Fetching the Data Set Ui Component details
  
      const dataSetUIComponentQuery = `SELECT * FROM DATA_SET_UI_VIEW where DATA_SET_UUID=:ONLINE_SCREEN_DATA_SET_UUID`;
      const dataSetUIComponentQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", dataSetUIComponentQuery, input);
  
      let dataSetUIComponentObject = {};
      if (dataSetUIComponentQueryData && dataSetUIComponentQueryData.length) {
        // extracting the add,edit form and grid details and creating the object for further use
        dataSetUIComponentQueryData.map((item) => {
          if (["DATAGRID", "ADD_FORM", "EDIT_FORM", "AUDIT_DATAGRID"].includes(item.DATA_SET_UI_VIEW_TYPE)) {
            dataSetUIComponentObject[item.DATA_SET_UI_VIEW_TYPE] = item;
          }
        });
      }
  
      // Making data set name upper case
      let get_entity_name = replaceSpaceAndMakeUpperCaseString(dataSetQueryData.DATA_SET_NAME);
  
      // Calling fuction to get the composite entity for the selected data set
      const compositeEntityConfigItemQueryData = await fetchCompositeEntity(dataSetQueryData.DATA_SET_NAME);
  
      // Calling fuction to get the root composite entity for the selected data set
      const rootCompositeEntityConfigItemQueryData = await fetchRootCompositeEntity(dataSetQueryData.DATA_SET_NAME);
  
      // fetch the data grid
      let detailsPortalDataGridId;
  
      if (dataSetQueryData && Object.keys(dataSetUIComponentObject).length) {
  
        // calling function to create the portal data grid
        detailsPortalDataGridId = createPortalDataGrid(dataSetQueryData.DATA_SET_NAME, dataSetUIComponentObject['DATAGRID']['DATA_SET_UI_VIEW_CONFIG_ITEM_ID']);
        // calling function to create the portal 
        onlineScreenPortal = createPortal(input.PROCESS_NAME);
  
        // Storing the online screen portal id in the process table.
        input['PORTAL_CONFIG_ITEM_UUID'] = onlineScreenPortal;
        // calling function to create the portal card
        onlineScreenPortalCard = createPortalCard(onlineScreenPortal, input.PROCESS_NAME, 'Portal_PortalCard');
        // Preparing the card data sharing to reload the grid
        let onlineScreenCardDataSharing = 'SOURCE_PORTAL_CARD_ID:' + onlineScreenPortal + ',SOURCE_PORTAL_CARD_DBCODE:AE_RELOAD,TARGET_PORTAL_CARD_ID:' + onlineScreenPortalCard + ',TARGET_PORTAL_CARD_DBCODE:AE_RELOAD'
  
        // Creating property externally beacuse of card data sharing.
        createPortalCardProperty(onlineScreenPortalCard, input.PROCESS_NAME, detailsPortalDataGridId, 'PortalDataGrid', 'DataGrid', onlineScreenCardDataSharing, 'PORTAL');
  
        let menuOrderValue = 0;
        // fetching the menu order
        const menuOrderQuery = "select MAX(CAST(PROPERTYVALUE AS UNSIGNED)) as PROPERTYVALUE from CONFIGITEMPROPERTY pro,CONFIGITEM it where it.ITEMID=pro.ITEMID and  PROPERTYNAME='MENU_ORDER' AND PROJECTID=:PROJECTID";
        let menuOrderQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", menuOrderQuery, input);
  
        if (menuOrderQueryData && Object.keys(menuOrderQueryData).length) {
          menuOrderValue = menuOrderQueryData.PROPERTYVALUE;
        }
        //  Menu item property 
        let menuItemProperty = {
          "MENU_ORDER": menuOrderValue + 1,
          "MENU_LABEL": input.ONLINE_SCREEN_MENU_NAME,
          "OPEN_IN_NEW_TAB": 0,
          "COMPONENT_PER_ROW": 1,
          "LINK_TYPE": "PORTAL",
          "ACCESSBILITY_REGEX": "",
          "HREF_BASE_URL": onlineScreenPortal,
        };
  
        // Creating menu item using menu name of online screen
        let createdMenuId = createMenuGroupAndMenuItem(input, menuItemProperty);
  
        // Creating menu node in the menu tree
        let menuBody = {
          "title": input.ONLINE_SCREEN_MENU_NAME,
          "className": "MENU_ITEM",
          "id": uuid(),
          "key": uuid(),
          "primaryKey": createdMenuId,
          "parentNodeID": "",
          "children": [],
          "status": "Old Node",
          "clicked": "",
          "level": 1,
          "onlineScreenUUID": input['PROCESS_UUID']
        }
  
        menuJsonTree.push(menuBody);
  
        //Updating the menu json and level
        input['MENU_JSON'] = JSON.stringify(menuJsonTree);
        input['MENU_LEVEL_COUNT'] = menuDataQueryData && menuDataQueryData.MENU_LEVEL_COUNT ? menuDataQueryData.MENU_LEVEL_COUNT : 1
      }
  
      // calling function to create the portal form add
      let addPortalFormId = createPortalForm('Add', dataSetQueryData.DATA_SET_NAME, Object.keys(dataSetUIComponentObject).length && dataSetUIComponentObject['ADD_FORM']['DATA_SET_UI_VIEW_CONFIG_ITEM_ID'], compositeEntityConfigItemQueryData && compositeEntityConfigItemQueryData.ITEMID, rootCompositeEntityConfigItemQueryData && rootCompositeEntityConfigItemQueryData.ITEMID);
      // calling function to create the portal add
      let addPortal = createPortal('Add ' + dataSetQueryData.DATA_SET_NAME);
      // calling function to create the portal card for add
      let addPortalCard = createPortalCard(addPortal, 'Add ' + dataSetQueryData.DATA_SET_NAME, 'Portal_PortalCard');
      //preparing the card data sharing to refresh the form
      let addCardDataSharing = 'SOURCE_PORTAL_CARD_ID:' + addPortal + ',SOURCE_PORTAL_CARD_DBCODE:AE_RELOAD,TARGET_PORTAL_CARD_ID:' + addPortalCard + ',TARGET_PORTAL_CARD_DBCODE:AE_RELOAD'
  
      // Creating property externally beacuse of card data sharing.
      createPortalCardProperty(addPortalCard, 'Add ' + camelCaseString(get_entity_name), addPortalFormId, 'PortalForm', '', addCardDataSharing, 'PORTAL');
  
      if (addPortal) {
        // Attaching the add portal with the add button of grid
        const addDataGridButtonConfigItemQueryData = await fetchButton(Object.keys(dataSetUIComponentObject).length && dataSetUIComponentObject['DATAGRID']['DATA_SET_UI_VIEW_CONFIG_ITEM_ID'], addPortal);
      }
      // calling function to create the portal form edit
      let editPortalFormId = createPortalForm('Edit', dataSetQueryData.DATA_SET_NAME, Object.keys(dataSetUIComponentObject).length && dataSetUIComponentObject['EDIT_FORM']['DATA_SET_UI_VIEW_CONFIG_ITEM_ID'], compositeEntityConfigItemQueryData && compositeEntityConfigItemQueryData.ITEMID, rootCompositeEntityConfigItemQueryData && rootCompositeEntityConfigItemQueryData.ITEMID);
      // calling function to create the sub portal edit
      let editSubPortal = createSubPortal('Edit ' + dataSetQueryData.DATA_SET_NAME, "#{ACTION_TYPE=='View/Edit'}", 'PortalDataGrid_SubPortal', detailsPortalDataGridId)
      // calling function to create the portal card edit
      let editPortalCard = createPortalCard(editSubPortal, 'Edit ' + dataSetQueryData.DATA_SET_NAME, 'SubPortal_PortalCard');
      // preparing the card data sharing for edit form
      let primaryKeyData = get_entity_name + '_UUID'
      let editCardDataSharing = 'SOURCE_PORTAL_CARD_ID' + editSubPortal + ',SOURCE_PORTAL_CARD_DBCODE:primaryDBCode,TARGET_PORTAL_CARD_ID:' + editPortalCard + ',TARGET_PORTAL_CARD_DBCODE:primaryDBCode;SOURCE_PORTAL_CARD_ID:' + editSubPortal + ',SOURCE_PORTAL_CARD_DBCODE:' + primaryKeyData + ',TARGET_PORTAL_CARD_ID:' + editPortalCard + ',TARGET_PORTAL_CARD_DBCODE:' + primaryKeyData;
  
      // Creating property externally beacuse of card data sharing.
      createPortalCardProperty(editPortalCard, 'View/Edit ' + camelCaseString(get_entity_name), editPortalFormId, 'PortalForm', '', editCardDataSharing, 'SUBPORTAL');
  
      // calling function to create the portal data grid for audit datagrid
      let auditPortalDataGridId = createPortalDataGrid('Audit ' + dataSetQueryData.DATA_SET_NAME, dataSetUIComponentObject['AUDIT_DATAGRID']['DATA_SET_UI_VIEW_CONFIG_ITEM_ID']);
      // calling function to create the sub portal audit
      let auditSubPortal = createSubPortal('Audit ' + dataSetQueryData.DATA_SET_NAME, "#{ACTION_TYPE=='Ellipsis'}", 'PortalDataGrid_SubPortal', detailsPortalDataGridId)
      // calling function to create the portal card audit
      let auditPortalCard = createPortalCard(auditSubPortal, 'Audit ' + dataSetQueryData.DATA_SET_NAME, 'SubPortal_PortalCard');
      // preparing the card data sharing for the audit form
      let auditCardDataSharing = 'SOURCE_PORTAL_CARD_ID' + auditSubPortal + ',SOURCE_PORTAL_CARD_DBCODE:primaryDBCode,TARGET_PORTAL_CARD_ID:' + auditPortalCard + ',TARGET_PORTAL_CARD_DBCODE:primaryDBCode;SOURCE_PORTAL_CARD_ID:' + auditSubPortal + ',SOURCE_PORTAL_CARD_DBCODE:' + primaryKeyData + ',TARGET_PORTAL_CARD_ID:' + auditPortalCard + ',TARGET_PORTAL_CARD_DBCODE:' + primaryKeyData;
      // Creating property externally beacuse of card data sharing.
      createPortalCardProperty(auditPortalCard, camelCaseString(get_entity_name) + ' Audit', auditPortalDataGridId, 'PortalDataGrid', 'DataGrid', auditCardDataSharing, 'SUBPORTAL');
  
      let childArray = [
        {
          "title": `${dataSetQueryData.DATA_SET_NAME + ' List'}`,
          "className": "DATAGRID",
          "primaryKey": Object.keys(dataSetUIComponentObject).length && dataSetUIComponentObject['DATAGRID']['DATA_SET_UI_VIEW_CONFIG_ITEM_ID'],
          "nid": "",
          "portal": onlineScreenPortal,
          "portalCard": onlineScreenPortalCard,
          "portalDataGrid": detailsPortalDataGridId,
          "level": 2,
          "isGenerated": true,
          "expanded": true
        },
        {
          "title": `${'View/Edit ' + dataSetQueryData.DATA_SET_NAME}`,
          "className": "EDIT_FORM",
          "primaryKey": Object.keys(dataSetUIComponentObject).length && dataSetUIComponentObject['EDIT_FORM']['DATA_SET_UI_VIEW_CONFIG_ITEM_ID'],
          "nid": "",
          "subPortal": editSubPortal,
          "portalCard": editPortalCard,
          "portalForm": editPortalFormId,
          "level": 2,
          "isGenerated": true,
          "expanded": true
        },
        {
          "title": `${'Add ' + dataSetQueryData.DATA_SET_NAME}`,
          "className": "ADD_FORM",
          "primaryKey": Object.keys(dataSetUIComponentObject).length && dataSetUIComponentObject['ADD_FORM']['DATA_SET_UI_VIEW_CONFIG_ITEM_ID'],
          "nid": "",
          "portal": addPortal,
          "portalCard": addPortalCard,
          "portalForm": addPortalFormId,
          "level": 2,
          "isGenerated": true,
          "expanded": true
        },
      ]
      // creating the root node with child compenent when user click on save from online screen for root data set
      let rootDataSetNode = [
        {
          "title": `${dataSetQueryData.DATA_SET_NAME + ' Online Screen'}`,
          "className": "ROOT_DATA_SET",
          "primaryKey": `${input.ONLINE_SCREEN_DATA_SET_UUID}`,
          "nid": `${dataSetQueryData.DATA_SET_ID}-DS`,
          "parentNodeClass": "",
          "parentNodeID": "",
          "level": 1,
          "originalTitle": `${dataSetQueryData.DATA_SET_NAME}`,
          "tabGroupDetails": {
            "subPortal": uuid(),
            "portalCard": uuid(),
            "tabGroup": uuid()
          },
          "children": childArray
        }
      ];
      // upfation the online screen tree json with level
      input['ONLINE_SCREEN_TREE_JSON'] = JSON.stringify(rootDataSetNode);
      input['ONLINE_SCREEN_TREE_LEVEL'] = 2;
  
      for (let child of childArray) {
        let childObject = {};
        childObject['PROCESS_UUID'] = input.PROCESS_UUID;
        childObject['UI_VIEW_SOURCE_TYPE'] = 'DATA_SET';
        switch (child.className) {
          case 'DATAGRID':
            childObject['UI_VIEW_UUID'] = Object.keys(dataSetUIComponentObject).length && dataSetUIComponentObject['DATAGRID']['DATA_SET_UI_VIEW_UUID']
            break;
          case 'ADD_FORM':
            childObject['UI_VIEW_UUID'] = Object.keys(dataSetUIComponentObject).length && dataSetUIComponentObject['ADD_FORM']['DATA_SET_UI_VIEW_UUID']
            break;
          case 'EDIT_FORM':
            childObject['UI_VIEW_UUID'] = Object.keys(dataSetUIComponentObject).length && dataSetUIComponentObject['EDIT_FORM']['DATA_SET_UI_VIEW_UUID']
            break;
          case 'AUDIT_DATAGRID':
            childObject['UI_VIEW_UUID'] = Object.keys(dataSetUIComponentObject).length && dataSetUIComponentObject['AUDIT_DATAGRID']['DATA_SET_UI_VIEW_UUID']
            break;
        }
        onlineScreenUIComponentArray.push(childObject)
      }
    }
  } else if (input.compositeEntityAction === 'Update') {
    // fetching the current process 
    const processQuery = "SELECT * FROM PROCESS WHERE PROCESS_UUID=:PROCESS_UUID and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID";
    let processQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFO_APPS", processQuery, input);
    let existingProcessName = processQueryData['PROCESS_NAME'];
    let currentProcessName = input.PROCESS_NAME;
    if (existingProcessName !== currentProcessName && processQueryData && Object.keys(processQueryData).length) {
  
      const portalConfigItemQuery = `select * from CONFIGITEM where ITEMID IN (${"'" + processQueryData.PORTAL_CONFIG_ITEM_UUID + "'"}) and PROJECTID=:PROJECTID`;
      let portalConfigItemQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", portalConfigItemQuery, input);
  
      let configItemQueryData = [];
  
      configItemQueryData.push(portalConfigItemQueryData);
  
      let getPortalRelationQuery = `SELECT CHILDITEMID FROM CONFIGITEMRELATION where RELATIONTYPE = 'Portal_PortalCard' AND PARENTITEMID IN (SELECT ITEMID FROM CONFIGITEM WHERE ITEMID IN (${"'" + portalConfigItemQueryData.ITEMID + "'"}) AND PROJECTID=:PROJECTID) and CONFIG_RELEASE_NAME = ${"'" + activeReleaseName + "'"}`;
      let getPortalRelationQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", getPortalRelationQuery, input);
  
      const portalCardConfigItemQuery = `select * from CONFIGITEM where ITEMID IN (${"'" + getPortalRelationQueryData.CHILDITEMID + "'"}) and PROJECTID=:PROJECTID`;
      let portalCardConfigItemQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", portalCardConfigItemQuery, input);
  
      configItemQueryData.push(portalCardConfigItemQueryData);
  
      if (configItemQueryData && configItemQueryData.length) {
        for (let onlineScreenItem of configItemQueryData) {
          // updating the portal and portal card config item name when user changes the process name to other name
          updateConfigItem(input.PROCESS_NAME, onlineScreenItem);
          if (onlineScreenItem.ITEMTYPE === 'PortalCard') {
            const configItemPropertyQuery = `select * from CONFIGITEMPROPERTY where ITEMID=${"'" + onlineScreenItem.ITEMID + "'"} and PROPERTYNAME='LABEL'`;
            let configItemPropertyQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", configItemPropertyQuery, input);
            if (configItemPropertyQueryData && configItemPropertyQueryData.length) {
              // updating the portal and portal card config item property when user changes the process name to other name
              updateConfigItemProperty(configItemPropertyQueryData, { "LABEL": camelCaseString(input.PROCESS_NAME) });
            }
          }
        }
      }
    }
  } else if (input.actionName == 'ModalSave') { // when user click on the save button of model from tree that time exiecuting this block
    // As we are arranging the node details in the input from the tree.
  
    // Here we are chicking tab group details avalible or not 
    if (input.immediateParentDetails && Object.keys(input.immediateParentDetails).length && input.immediateParentDetails.node && Object.keys(input.immediateParentDetails.node).length && input.immediateParentDetails.node.tabGroupDetails && Object.keys(input.immediateParentDetails.node.tabGroupDetails).length) {
      // Firing the query in item table to check the subportal exist or not
      const subPortalConfigItemQuery = `SELECT * FROM CONFIGITEM where ITEMID=${"'" + input.immediateParentDetails.node.tabGroupDetails.subPortal + "'"} AND ITEMTYPE='SubPortal'`;
      const subPortalConfigItemQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", subPortalConfigItemQuery, input);
      // Extracting the grid details from the nodedetails present in the input.
      let parentPortalDataGrid = input.immediateParentDetails && input.immediateParentDetails.node.children.length && input.immediateParentDetails.node.children.filter((item) => item.className === "DATAGRID");
      //PortalDatagrid id
      parentPortalDataGrid = parentPortalDataGrid[0];
  
      // if subportal not exist then the below block will execute
      if (!Object.keys(subPortalConfigItemQueryData).length) {
        // calling the function to show the expand button in the immediate parent
        await showAndHideExpandColumn(input, true);
        // calling function to create the sub portal for expand
        let expandSubPortal = createSubPortal('Expand ' + input.immediateParentDetails.node.title, "#{ACTION_TYPE=='Expand'}", 'PortalDataGrid_SubPortal', parentPortalDataGrid && parentPortalDataGrid.portalDataGrid, input.immediateParentDetails.node.tabGroupDetails.subPortal);
        // calling function to create the  portal card for expand
        let expandPortalCard = createPortalCard(expandSubPortal, 'Expand ' + input.immediateParentDetails.node.title, 'SubPortal_PortalCard', input.immediateParentDetails.node.tabGroupDetails.portalCard);
        let expandCardDataSharing = ''
        // Creating property externally beacuse of card data sharing.
        createPortalCardProperty(expandPortalCard, camelCaseString(input.title), '', 'TabGroup', '', expandCardDataSharing, 'SUBPORTAL');
        // calling function to create the tabgroup for expand
        let expandTabGroup = createTabGroup(expandPortalCard, 'Expand ' + input.immediateParentDetails.node.title, 'Tab', 'PortalCard_TabGroup', input.immediateParentDetails.node.tabGroupDetails.tabGroup);
      }
      // caluating the order
      let tabPortalOrder = input.immediateParentDetails && input.immediateParentDetails.node && input.immediateParentDetails.node.children && input.immediateParentDetails.node.children.length - 2;
      // property for tab portal
      let tabPortalProperty = {
        'ORDER': tabPortalOrder,
        'IS_DEFAULT_OPEN': 0,
        'TAB_NAME': input.title
      }
      // calling function to create the tab portal for expand
      let tabPortal = createTabPortal(input.immediateParentDetails.node.tabGroupDetails.tabGroup, input.title, tabPortalProperty, 'TabGroup_TabPortal');
      if (input.nodeDetails && input.nodeDetails.children && input.nodeDetails.children.length) {
        let childObject = {};
        // extracting the add,edit form and grid details and creating the object for further use
        input.nodeDetails.children.map((item) => {
          if (["DATAGRID", "ADD_FORM", "EDIT_FORM", "AUDIT_DATAGRID"].includes(item.className)) {
            childObject[item.className] = item;
          }
        });
  
        if (childObject && Object.keys(childObject).length) {
          // parent data set title
          let parentTitle = input.immediateParentDetails.node.originalTitle ? input.immediateParentDetails.node.originalTitle : input.immediateParentDetails.node.title
  
          let parentEntityName = replaceSpaceAndMakeUpperCaseString(parentTitle);
  
          //parent data set primary column
          let parentEntityUUID = parentEntityName + '_UUID';
  
          // calling function to create the portal data grid for expand
          let childPortalDataGridId = createPortalDataGrid(input.title, childObject['DATAGRID']['primaryKey'], childObject['DATAGRID']['portalDataGrid']);
          // calling function to create the sub portal for expand
          let childSubPortal = createSubPortal(input.title + ' By ' + parentTitle, "", 'TabPortal_SubPortal', tabPortal, childObject['DATAGRID']['subPortal']);
          // calling function to create the portal card for expand
          let childPortalCard = createPortalCard(childSubPortal, input.title + ' By ' + parentTitle, 'SubPortal_PortalCard', childObject['DATAGRID']['portalCard']);
          //preparing the card data sharing to share data from parent to child
          let childCardDataSharing = 'SOURCE_PORTAL_CARD_ID:' + input.immediateParentDetails.node.tabGroupDetails.subPortal + ',SOURCE_PORTAL_CARD_DBCODE:' + parentEntityUUID + ',TARGET_PORTAL_CARD_ID:' + childPortalCard + ',TARGET_PORTAL_CARD_DBCODE:' + parentEntityUUID + ';SOURCE_PORTAL_CARD_ID:' + childSubPortal + ',SOURCE_PORTAL_CARD_DBCODE:AE_RELOAD,TARGET_PORTAL_CARD_ID:' + childPortalCard + ',TARGET_PORTAL_CARD_DBCODE:AE_RELOAD;';
  
          // Creating property externally beacuse of card data sharing.
          createPortalCardProperty(childPortalCard, input.title + ' By ' + parentTitle, childPortalDataGridId, 'PortalDataGrid', 'DataGrid', childCardDataSharing, 'SUBPORTAL');
  
          // calling function to get the composite entity for particular data set
          const compositeEntityConfigItemQueryData = await fetchCompositeEntity(input.title);
          // calling function to get the root composite entity for particular data set
          const rootCompositeEntityConfigItemQueryData = await fetchRootCompositeEntity(input.title);
          // calling function to create the  portal form for add
          let addPortalFormId = createPortalForm('Add', input.title, childObject['ADD_FORM']['primaryKey'], compositeEntityConfigItemQueryData && compositeEntityConfigItemQueryData.ITEMID, rootCompositeEntityConfigItemQueryData && rootCompositeEntityConfigItemQueryData.ITEMID, childObject['ADD_FORM']['portalForm']);
          // calling function to create the  portal for add
          let addPortal = createPortal('Add ' + input.title, childObject['ADD_FORM']['portal']);
          // calling function to create the  portal card for add
          let addPortalCard = createPortalCard(addPortal, 'Add ' + input.title, 'Portal_PortalCard', childObject['ADD_FORM']['portalCard']);
          //preparing the card data sharing for add form to share parent data into child add form
          let addCardDataSharing = 'SOURCE_PORTAL_CARD_ID:' + input.immediateParentDetails.node.tabGroupDetails.subPortal + ',SOURCE_PORTAL_CARD_DBCODE:' + parentEntityUUID + ',TARGET_PORTAL_CARD_ID:' + addPortalCard + ',TARGET_PORTAL_CARD_DBCODE:' + parentEntityUUID + ';SOURCE_PORTAL_CARD_ID:' + addPortal + ',SOURCE_PORTAL_CARD_DBCODE:AE_RELOAD,TARGET_PORTAL_CARD_ID:' + addPortalCard + ',TARGET_PORTAL_CARD_DBCODE:AE_RELOAD;'
  
          let childEntityName = replaceSpaceAndMakeUpperCaseString(input.title);
          // Creating property externally beacuse of card data sharing.
          createPortalCardProperty(addPortalCard, camelCaseString(childEntityName), addPortalFormId, 'PortalForm', '', addCardDataSharing, 'PORTAL');
  
          let concatinatedTitle = input.title + ' By ' + parentTitle;
          const addDataGridButtonConfigItemQueryData = await fetchButton(childObject['DATAGRID']['primaryKey'], addPortal);
  
          // calling function to create the  portal form for edit
          let editPortalFormId = createPortalForm('Edit', input.title, childObject['EDIT_FORM']['primaryKey'], compositeEntityConfigItemQueryData && compositeEntityConfigItemQueryData.ITEMID, rootCompositeEntityConfigItemQueryData && rootCompositeEntityConfigItemQueryData.ITEMID, childObject['EDIT_FORM']['portalForm']);
          // calling function to create the  sub portal for edit
          let editSubPortal = createSubPortal('Edit ' + input.title, "#{ACTION_TYPE=='View/Edit'}", 'PortalDataGrid_SubPortal', childPortalDataGridId, childObject['EDIT_FORM']['subPortal'])
          // calling function to create the  portal card for edit
          let editPortalCard = createPortalCard(editSubPortal, 'Edit ' + input.title, 'SubPortal_PortalCard', childObject['EDIT_FORM']['portalCard']);
          // child entity primary key 
          let primaryKeyData = childEntityName + '_UUID'
          // preparing the card data sharing for edit form
          let editCardDataSharing = 'SOURCE_PORTAL_CARD_ID' + editSubPortal + ',SOURCE_PORTAL_CARD_DBCODE:primaryDBCode,TARGET_PORTAL_CARD_ID:' + editPortalCard + ',TARGET_PORTAL_CARD_DBCODE:primaryDBCode;SOURCE_PORTAL_CARD_ID:' + editSubPortal + ',SOURCE_PORTAL_CARD_DBCODE:' + primaryKeyData + ',TARGET_PORTAL_CARD_ID:' + editPortalCard + ',TARGET_PORTAL_CARD_DBCODE:' + primaryKeyData;
  
          // Creating property externally beacuse of card data sharing.
          createPortalCardProperty(editPortalCard, camelCaseString(childEntityName), editPortalFormId, 'PortalForm', '', editCardDataSharing, 'SUBPORTAL');
  
          let childDataSet = input.primaryKey;
          const dataSetUIComponentQuery = `SELECT * FROM DATA_SET_UI_VIEW where DATA_SET_UUID='${childDataSet}' AND DATA_SET_UI_VIEW_TYPE = 'AUDIT_DATAGRID'`;
          const dataSetUIComponentQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", dataSetUIComponentQuery, input);
  
          // calling function to create the portal data grid for audit datagrid
          let auditPortalDataGridId = createPortalDataGrid('Audit ' + input.title, dataSetUIComponentQueryData[0]['DATA_SET_UI_VIEW_CONFIG_ITEM_ID'], "");
          // calling function to create the sub portal audit 
          let auditSubPortal = createSubPortal('Audit ' + input.title, "#{ACTION_TYPE=='Ellipsis'}", 'PortalDataGrid_SubPortal', childPortalDataGridId, "")
          // calling function to create the portal card audit
          let auditPortalCard = createPortalCard(auditSubPortal, 'Audit ' + input.title, 'SubPortal_PortalCard', "");
          // preparing card data sharing from audit subportal to audit portal card
          let auditCardDataSharing = 'SOURCE_PORTAL_CARD_ID' + auditSubPortal + ',SOURCE_PORTAL_CARD_DBCODE:primaryDBCode,TARGET_PORTAL_CARD_ID:' + auditPortalCard + ',TARGET_PORTAL_CARD_DBCODE:primaryDBCode;SOURCE_PORTAL_CARD_ID:' + auditSubPortal + ',SOURCE_PORTAL_CARD_DBCODE:' + primaryKeyData + ',TARGET_PORTAL_CARD_ID:' + auditPortalCard + ',TARGET_PORTAL_CARD_DBCODE:' + primaryKeyData;
  
          // Creating property externally beacuse of card data sharing.
          createPortalCardProperty(auditPortalCard, 'Audit ' + camelCaseString(input.title), auditPortalDataGridId, 'PortalDataGrid', 'DataGrid', auditCardDataSharing, 'SUBPORTAL');
        }
  
        let childArray = input.nodeDetails.children.filter((item) => ["DATAGRID", "ADD_FORM", "EDIT_FORM", "AUDIT_DATAGRID"].includes(item.className));
        for (let child of childArray) {
          let childObject = {};
          childObject['PROCESS_UUID'] = input.PROCESS_UUID;
          switch (child.className) {
            case 'DATAGRID':
              childObject['UI_VIEW_SOURCE_TYPE'] = 'DATA_SET_RELATIONSHIP';
              childObject['UI_VIEW_UUID'] = Object.keys(input['UIComponentObject']).length && input['UIComponentObject']['DATAGRID']['UI_VIEW_UUID']
              break;
            case 'ADD_FORM':
              childObject['UI_VIEW_SOURCE_TYPE'] = 'DATA_SET';
              childObject['UI_VIEW_UUID'] = Object.keys(input['UIComponentObject']).length && input['UIComponentObject']['ADD_FORM']['UI_VIEW_UUID']
              break;
            case 'EDIT_FORM':
              childObject['UI_VIEW_SOURCE_TYPE'] = 'DATA_SET';
              childObject['UI_VIEW_UUID'] = Object.keys(input['UIComponentObject']).length && input['UIComponentObject']['EDIT_FORM']['UI_VIEW_UUID']
              break;
            case 'AUDIT_DATAGRID':
              childObject['UI_VIEW_SOURCE_TYPE'] = 'DATA_SET';
              childObject['UI_VIEW_UUID'] = Object.keys(input['UIComponentObject']).length && input['UIComponentObject']['AUDIT_DATAGRID']['UI_VIEW_UUID']
              break;
          }
          onlineScreenUIComponentArray.push(childObject)
        }
      }
    }
  } else if (input.actionName == 'DeleteNode') { // it will execute when user click on the delete button of tree node
    if (input.immediateParentDetails && Object.keys(input.immediateParentDetails).length && input.immediateParentDetails.node && Object.keys(input.immediateParentDetails.node).length) {
      if (input.immediateParentDetails.node.children && input.immediateParentDetails.node.children.length) {
        let childDetails = input.immediateParentDetails && input.immediateParentDetails.node.children.length && input.immediateParentDetails.node.children.filter((item) => item.className === "DATA_SET");
  
        let storeConfigItemRelation = [];
        let storeConfigItem = [];
        // extracting the add from details from the input 
        let addFormDetails = input.nodeDetails && input.nodeDetails.node.children && input.nodeDetails.node.children.length && input.nodeDetails.node.children.filter((item) => item.className === "ADD_FORM");
        // add form id
        let addForm = addFormDetails && addFormDetails.length && addFormDetails[0].portal;
  
        let itemList = [addForm];
  
        // When only one child exist
        if (childDetails && childDetails.length === 1) {
          await showAndHideExpandColumn(input, false);
          // extracting the subportal id to remove the flow from subportal
          itemList.push(input.immediateParentDetails.node.tabGroupDetails.subPortal);
        } else if (childDetails && childDetails.length > 1) { // When multiple chile exist
          let dataGridDetails = input.nodeDetails && input.nodeDetails.node.children && input.nodeDetails.node.children.length && input.nodeDetails.node.children.filter((item) => item.className === "DATAGRID");
          // firing the query in relation table to fetch the relation between subportal and tabportal
          let subPortal = dataGridDetails && dataGridDetails.length && dataGridDetails[0].subPortal;
          let getRelationQuery = `SELECT * FROM CONFIGITEMRELATION where CHILDITEMID=${"'" + subPortal + "'"}`;
          let getRelationQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFOAPPS_MD", getRelationQuery, input);
          // arranging the tabportal id to remove the flow from tabportal
          let tabPortal = getRelationQueryData && Object.keys(getRelationQueryData).length && getRelationQueryData['PARENTITEMID'];
          itemList.push(tabPortal);
        }
  
        // fetching audit datagrid id for deleted node
        let auditDataGridDetails = input.nodeDetails && input.nodeDetails.node.children && input.nodeDetails.node.children.length && input.nodeDetails.node.children.filter((item) => item.className === "AUDIT_DATAGRID");
        // firing the query in relation table to fetch the relation between subportal and tabportal
        let auditSubPortalId = auditDataGridDetails && auditDataGridDetails.length && auditDataGridDetails[0].subPortal;
        itemList.push(auditSubPortalId);
  
        // calling function to arrange the relation and item id form delete
        for (let item of itemList) {
          await deleteChildConfiguration(item, activeReleaseName, storeConfigItemRelation, storeConfigItem);
        }
  
  
        for (let key in storeConfigItem) {
          deleteRecords('ITEMID', storeConfigItem[key], 'CONFIGITEM', input['CONFIG_RELEASE_NAME']);
        };
        let configItemID;
        if (storeConfigItem && storeConfigItem.length) {
          configItemID = storeConfigItem.map((item) =>
            `${"'" + item + "'"}`
          ).join(",");
        }
        const configItemPrivilegeQuery = `select PRIVILEGEID from CONFIGITEMPRIVILEGE where ITEMID in(${configItemID})`
        let configItemPrivilegeQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", configItemPrivilegeQuery, input);
        let configItemPrivilegeQueryDataRecords = JSON.parse(JSON.stringify(configItemPrivilegeQueryData));
  
        for (let key in configItemPrivilegeQueryDataRecords) {
          deleteRecords('PRIVILEGEID', configItemPrivilegeQueryDataRecords[key].PRIVILEGEID, 'CONFIGITEMPRIVILEGE', input['CONFIG_RELEASE_NAME']);
        };
        const configItemPropertyQuery = `select PROPERTYID from CONFIGITEMPROPERTY where ITEMID in(${configItemID})`;
        let configItemPropertyQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFOAPPS_MD", configItemPropertyQuery, input);
        let configItemPropertyQueryDataRecords = JSON.parse(JSON.stringify(configItemPropertyQueryData));
        for (let key in configItemPropertyQueryDataRecords) {
          deleteRecords('PROPERTYID', configItemPropertyQueryDataRecords[key].PROPERTYID, 'CONFIGITEMPROPERTY', input['CONFIG_RELEASE_NAME']);
        };
  
  
  
        for (let key in storeConfigItemRelation) {
          deleteRecords('RELATIONID', storeConfigItemRelation[key], 'CONFIGITEMRELATION', input['CONFIG_RELEASE_NAME']);
        };
  
  
        let parentDataSet = input.immediateParentDetails.node.primaryKey;
        let childDataSet = input.nodeDetails.node.primaryKey;
  
        // Fetching the data set ui component
        const dataSetUIComponentQuery = `SELECT DATA_SET_UI_VIEW_UUID as UI_VIEW_UUID FROM DATA_SET_UI_VIEW where DATA_SET_UUID=${"'" + childDataSet + "'"} and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and DATA_SET_UI_VIEW_TYPE in('ADD_FORM','EDIT_FORM')`;
        let dataSetUIComponentQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", dataSetUIComponentQuery, input);
  
  
        //Fetch the data set relation for parent and child
        let getDataSetRelationQuery = `SELECT * FROM DATA_SET_RELATIONSHIP where DATA_SET_PARENT_UUID=${"'" + parentDataSet + "'"} AND DATA_SET_CHILD_UUID=${"'" + childDataSet + "'"} and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let getDataSetRelationQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery("INFO_APPS", getDataSetRelationQuery, input);
  
        // Fetching the data set relation ui component
        const dataSetRelationshipUIComponentQuery = `SELECT DATA_SET_RELATIONSHIP_UI_VIEW_UUID as UI_VIEW_UUID FROM DATA_SET_RELATIONSHIP_UI_VIEW where DATA_SET_RELATIONSHIP_UUID=${"'" + getDataSetRelationQueryData['DATA_SET_RELATIONSHIP_UUID'] + "'"} and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        const dataSetRelationshipUIComponentQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", dataSetRelationshipUIComponentQuery, input);
  
        dataSetUIComponentQueryData = dataSetUIComponentQueryData.concat(dataSetRelationshipUIComponentQueryData);
  
        if (dataSetUIComponentQueryData && dataSetUIComponentQueryData.length) {
          let allUiComponentUUID = dataSetUIComponentQueryData.map((item) =>
            `${"'" + item.UI_VIEW_UUID + "'"}`
          ).join(",");
  
          const onlineScreenUIComponentQuery = `SELECT ONLINE_SCREEN_UI_VIEW_UUID FROM ONLINE_SCREEN_UI_VIEW where UI_VIEW_UUID  in(${allUiComponentUUID}) and FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and PROCESS_UUID=:PROCESS_UUID`;
          const onlineScreenUIComponentQueryData = await serviceOrchestrator.selectRecordsUsingQuery("INFO_APPS", onlineScreenUIComponentQuery, input);
  
          for (let key in onlineScreenUIComponentQueryData) {
            deleteRecords('ONLINE_SCREEN_UI_VIEW_UUID', onlineScreenUIComponentQueryData[key].ONLINE_SCREEN_UI_VIEW_UUID, 'ONLINE_SCREEN_UI_VIEW', input['CONFIG_RELEASE_NAME']);
          }
        }
      }
    }
  }
  
  //appeng linking with generated data
  input["AppEngChildEntity:CONFIGITEM"] = configItemList;
  input["AppEngChildEntity:CONFIGITEMPROPERTY"] = configpropertyList;
  input["AppEngChildEntity:CONFIGITEMPRIVILEGE"] = configprivilegeList;
  input["AppEngChildEntity:CONFIGITEMRELATION"] = configrelationList;
  input["AppEngChildEntity:ONLINE_SCREEN_UI_VIEW"] = onlineScreenUIComponentArray;