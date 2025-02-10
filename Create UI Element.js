try {
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let input = msg.payload.apiRequestBody;
  if (input[0]['Current_DATA_SET_UUID'] !== input[0]['DATA_SET_UUID']) {
    input[0]['INFO_MESSAGE'] = '';
    if (input[0]['DATA_SET_UUID']) {
      let keyForName = '';
      input[0]['INFO_MESSAGE'] = '';
      let QuerytoFetch = `select DATA_ELEMENT_UUID from DATA_ELEMENT where DATA_SET_UUID=:DATA_SET_UUID and FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
      let QuerytoFetchData = await serviceOrchestrator.selectRecordsUsingQuery(
        'PRIMARYSPRINGFM',
        QuerytoFetch,
        input[0]
      );
      let QuerytoFetchRecords = JSON.parse(JSON.stringify(QuerytoFetchData));
      let Query = `select * from DATA_ELEMENT where DATA_SET_UUID=:DATA_SET_UUID and FUNCTIONAL_AREA_UUID = :APP_LOGGED_IN_FUNTIONAL_AREA_ID order by DATA_ELEMENT_ID asc`;
      let Query1 = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', Query, input[0]);
      let Query2 = JSON.parse(JSON.stringify(Query1));
      input[0].child['073cd693-8b19-415f-ad44-808cba68a641'] = [];
      if (QuerytoFetchRecords.length > 0) {
        input[0]['INFO_MESSAGE'] = '';
        i = 0;
        for (let DATA_ELEMENT_UUID of QuerytoFetchRecords) {
          input[0].child['073cd693-8b19-415f-ad44-808cba68a641'][i] = DATA_ELEMENT_UUID;
          input[0].child['073cd693-8b19-415f-ad44-808cba68a641'][i]['UI_ELEMENT_NAME'] = Query2[i].DATA_ELEMENT_NAME;
          input[0].child['073cd693-8b19-415f-ad44-808cba68a641'][i]['LOCATOR_TYPE'] = 'Selector';
          input[0].child['073cd693-8b19-415f-ad44-808cba68a641'][i]['PAGE_NEW_UUID'] = input[0]['PAGE_NEW_UUID'];
          input[0].child['073cd693-8b19-415f-ad44-808cba68a641'][i]['isNew'] = true;
          i++;
        }
        for (let k = 0; k < QuerytoFetchRecords.length; k++) {
          keyForName =
            keyForName +
            `583bf4ff-1db5-4422-a1cd-b32bf1a2d1cc=>0=>9b9cff6f-f5a6-480e-b2be-a12c07f9446d=>${k}=>UI_ELEMENT_NAME` +
            ',' +
            `583bf4ff-1db5-4422-a1cd-b32bf1a2d1cc=>0=>9b9cff6f-f5a6-480e-b2be-a12c07f9446d=>${k}=>UI_ELEMENT_MODE` +
            ',' +
            `583bf4ff-1db5-4422-a1cd-b32bf1a2d1cc=>0=>9b9cff6f-f5a6-480e-b2be-a12c07f9446d=>${k}=>UI_ELEMENT_TYPE` +
            ',';
        }
      } else {
        input[0]['INFO_MESSAGE'] = 'No Data Element present for selected Data Set';
        msg.payload.result = { formData: input };
      }
      console.log(keyForName);
      msg.payload.result = { formData: input, keyToRemove: keyForName };
      input[0]['Current_DATA_SET_UUID'] = input[0]['DATA_SET_UUID'];
    } else {
      console.log('No Data Set Selected');
      msg.payload.result = { formData: input };
    }
  } else {
    console.log('No Data Set Selected');
    msg.payload.result = { formData: input };
  }
  node.send(msg);
} catch (e) {
  console.log('Error occurred:', e.message);
  return;
}
