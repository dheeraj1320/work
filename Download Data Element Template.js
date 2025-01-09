try {
  msg.payload.result = {};
  let input = msg.payload.apiRequestBody.baseEntity.records[0];
  msg.payload.result.documentName = input.TEMPLATE_NAME;
  console.log('input ============ ', input);
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let formFieldQuery = `SELECT prop.ITEMID, prop2.PROPERTYVALUE as ORDER_NO, prop.PROPERTYVALUE as TYPE, prop3.PROPERTYVALUE AS LABEL, prop4.PROPERTYVALUE AS DATASOURCE_ID, prop5.PROPERTYVALUE AS SELECT_ITEMS_REFERENCE_ID, prop6.PROPERTYVALUE as MULTI_VALUE_LIST FROM CONFIGITEM item JOIN CONFIGITEMRELATION rel1 ON item.ITEMID = rel1.PARENTITEMID JOIN CONFIGITEMRELATION rel2 ON rel1.CHILDITEMID = rel2.PARENTITEMID JOIN CONFIGITEMPROPERTY prop ON rel2.CHILDITEMID = prop.ITEMID JOIN CONFIGITEMPROPERTY prop2 ON prop2.ITEMID = prop.ITEMID JOIN CONFIGITEMPROPERTY prop3 ON prop3.ITEMID = prop.ITEMID JOIN CONFIGITEMPROPERTY prop4 ON prop4.ITEMID = prop.ITEMID JOIN CONFIGITEMPROPERTY prop5 ON prop5.ITEMID = prop.ITEMID JOIN CONFIGITEMPROPERTY prop6 ON prop6.ITEMID = prop.ITEMID WHERE item.ITEMID = '${input.FORM_ID}' AND rel1.RELATIONTYPE = 'Form_FormSection' AND rel2.RELATIONTYPE = 'FormSection_FormField' AND prop2.PROPERTYNAME = 'ORDER' AND prop3.PROPERTYNAME = 'LABEL' AND prop4.PROPERTYNAME = 'DATASOURCE_ID' AND prop5.PROPERTYNAME = 'SELECT_ITEMS_REFERENCE_ID' AND prop6.PROPERTYNAME = 'MULTI_VALUE_LIST' and (prop.PROPERTYNAME = 'TYPE' and prop.PROPERTYVALUE in ('CkEditor', 'SelectOption', 'TextBox', 'CheckBox', 'RadioButton'))`;
  let formFields = await serviceOrchestrator.selectRecordsUsingQuery('INFOAPPS_MD', formFieldQuery, input);
  formFields.sort((obj1, obj2) => Number(obj1.ORDER_NO) - Number(obj2.ORDER_NO));
  console.log(formFields);
  const headerData = [];
  for (const data of formFields) {
    console.log('Processing for form field====>', data);
    const currHeaderObj = {};
    currHeaderObj.NAME = data.LABEL;
    if (data.TYPE === 'SelectOption' || data.TYPE === 'RadioButton') {
      currHeaderObj.TYPE = 'LIST';
      const MASTER_DATA_LABELS = [],
        MASTER_DATA_VALUES = [];
      if (data.MULTI_VALUE_LIST && data.MULTI_VALUE_LIST.length > 0) {
        const keyValuePairs = data.MULTI_VALUE_LIST.split(',');
        for (const keyValue of keyValuePairs) {
          const keyValueArr = keyValue.split(':');
          MASTER_DATA_LABELS.push(keyValueArr[1]);
          MASTER_DATA_VALUES.push(keyValueArr[0]);
        }
      } else if (data.SELECT_ITEMS_REFERENCE_ID && data.SELECT_ITEMS_REFERENCE_ID.length > 0 && data.DATASOURCE_ID) {
        const lookupKeyQuery = `SELECT PROPERTYVALUE FROM CONFIGITEMPROPERTY WHERE ITEMID = '${data.DATASOURCE_ID}' AND PROPERTYNAME = 'LOOKUP_KEY';`;
        let lookupKeyData = await serviceOrchestrator.selectRecordsUsingQuery('INFOAPPS_MD', lookupKeyQuery, input);
        console.log(
          'Form field select reference id :::::::::::::',
          data.SELECT_ITEMS_REFERENCE_ID,
          lookupKeyData[0]['PROPERTYVALUE']
        );
        try {
          const selectOptionData = await serviceOrchestrator.selectRecordsUsingQuery(
            lookupKeyData[0]['PROPERTYVALUE'],
            data.SELECT_ITEMS_REFERENCE_ID,
            input
          );
          for (const selectData of selectOptionData) {
            MASTER_DATA_LABELS.push(selectData.label);
            MASTER_DATA_VALUES.push(selectData.id);
          }
          console.log('select option data ::::::::::::::::::::::::::::', selectOptionData);
        } catch (e) {
          console.log('error occured in firing select ref query :::::::', e);
        }
      }
      currHeaderObj.MASTER_DATA_LABELS = MASTER_DATA_LABELS;
      currHeaderObj.MASTER_DATA_VALUES = MASTER_DATA_VALUES;
    } else {
      currHeaderObj.TYPE = 'TEXT';
    }
    headerData.push(currHeaderObj);
  }
  console.log('header data -------------------==========+++++', headerData);
  msg.payload.result.headerData = {};
  const headerDataObj = {};
  headerDataObj[input.TEMPLATE_NAME] = headerData;
  Object.assign(msg.payload.result.headerData, headerDataObj);
  msg.payload.result.message = 'Template Downloaded';
  msg.payload.result.mode = 'Enable Message';
  node.send(msg);
} catch (t) {
  console.log('Errorr Occured', t.message);
  msg.payload.result.message = 'Template Generation Failed';
  msg.payload.result.mode = 'Enable Message';
  node.send(msg);
  return;
}
