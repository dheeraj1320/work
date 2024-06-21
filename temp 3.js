/*Convert string into camel case*/ function camelCaseString(stringData) {
  let toLowerDStringData = stringData.toLowerCase();
  const words = toLowerDStringData.split('_');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0]
      ? words[i][0].toUpperCase() + words[i].substr(1)
      : '';
  }
  return words.join(' ');
}
try {
  console.log(
    ':::::::::::::::::::::::::::::: msg data :::::',
    msg.payload.apiRequestBody
  );
  const input = msg.payload.apiRequestBody;
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let tableNameQuery = `SELECT prop.PROPERTYVALUE AS TABLE_NAME FROM CONFIGITEMRELATION rel LEFT JOIN CONFIGITEMPROPERTY prop ON rel.CHILDITEMID = prop.ITEMID WHERE rel.PARENTITEMID = 'c2282b7c-e978-4ac7-adee-cf0ba228fee2' AND rel.RELATIONTYPE = 'Form_LogicalEntity' AND prop.PROPERTYNAME = 'DBTYPENAME'`;
  let tableName = await serviceOrchestrator.selectRecordsUsingQuery(
    'INFOAPPS_MD',
    tableNameQuery,
    input
  );
  console.log('form name queryjfnvkf :::: ', tableName);
  let formFieldsQuery = `SELECT DISTINCT rel2.CHILDITEMID AS FORM_FIELD_ID FROM CONFIGITEMRELATION rel1 LEFT JOIN CONFIGITEMRELATION rel2 ON rel1.CHILDITEMID = rel2.PARENTITEMID WHERE rel1.PARENTITEMID = 'c2282b7c-e978-4ac7-adee-cf0ba228fee2' AND rel1.RELATIONTYPE = 'Form_FormSection' AND rel1.ISDELETED = 0 AND rel2.ISDELETED = 0`;
  let formFieldsData = await serviceOrchestrator.selectRecordsUsingQuery(
    'INFOAPPS_MD',
    formFieldsQuery,
    input
  );
  const formFieldsArray = [];
  formFieldsData.map((field) => {
    formFieldsArray.push(field.FORM_FIELD_ID);
  });
  const formFieldsString = `'${formFieldsArray.join(`','`)}'`;
  console.log('form field array :::::: ', formFieldsArray);
  const fieldsDataQuery = `SELECT prop2.PROPERTYVALUE FORM_FIELD_ORDER, item.ITEMNAME AS FORM_FIELD_NAME, prop1.PROPERTYVALUE AS FORM_FIELD_TYPE, prop3.PROPERTYVALUE AS DBCODE FROM CONFIGITEMPROPERTY prop1 JOIN CONFIGITEMPROPERTY prop2 ON prop1.ITEMID = prop2.ITEMID LEFT JOIN CONFIGITEM item ON item.ITEMID = prop1.ITEMID LEFT JOIN CONFIGITEMRELATION rel ON rel.PARENTITEMID = item.ITEMID LEFT JOIN CONFIGITEMPROPERTY prop3 ON rel.CHILDITEMID = prop3.ITEMID WHERE prop1.ITEMID IN (${formFieldsString}) AND prop1.PROPERTYNAME = 'TYPE' AND prop1.PROPERTYVALUE not in('Label', 'Hiddenfield') AND prop2.PROPERTYNAME = 'ORDER' AND prop3.PROPERTYNAME = 'DBCODE' ORDER BY cast(FORM_FIELD_ORDER as unsigned);`;
  let fieldsData = await serviceOrchestrator.selectRecordsUsingQuery(
    'INFOAPPS_MD',
    fieldsDataQuery,
    input
  );
  console.log('fieldS DATA :::::: ', fieldsData);

  const formFieldNames = ['Form Field'];
  const DBCodes = ['DBCODE'];

  fieldsData.map((field) => {
    formFieldNames.push(field.FORM_FIELD_NAME);
    DBCodes.push(field.DBCODE);
  });

  const excelData = [formFieldNames, DBCodes];

  msg.payload.result = {};
  msg.payload.result.navigation = {};
  msg.payload.result.navigation.operationType = 'GenerateExcelDocument';
  msg.payload.result.documentData = {
    'Data Upload Template': excelData,
  };
  msg.payload.result.documentName = `Insert ${camelCaseString(
    tableName[0].TABLE_NAME
  )} Template`;
  msg.payload.result.message = `${camelCaseString(
    tableName[0].TABLE_NAME
  )} Template Downloaded`;
  msg.payload.result.mode = 'Enable Message';
  node.send(msg);
  return;
} catch (t) {
  console.log('Errorr Occured', t.message);
  return;
}
