try {
  const AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let input = msg.payload.apiRequestBody;
  if (input[0]['PAGE_UUID']) {
    let data =
      input[0]['UI_ELEMENT_STEP_FILTER_TYPE'] == 'User Input' ? `'Input/Output','Input'` : `'Input/Output','Output'`;
    let dataForVerbage =
      input[0]['UI_ELEMENT_STEP_FILTER_TYPE'] == 'User Input' ? `'Input Step'` : `'Expected Result Step'`;
    let stepDefTemplateVerbaleQuery = '';
    stepDefTemplateVerbaleQuery =
      input[0]['UI_ELEMENT_STEP_FILTER_TYPE'] == 'User Input'
        ? `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE WHERE STEP_FILTER=${dataForVerbage} AND IS_ACTIVE_STEP_DEFINITION_TEMPLATE_VERBIAGE='Yes'`
        : `SELECT * FROM STEP_DEFINITION_TEMPLATE_VERBIAGE SDTV INNER JOIN STEP_DEFINITION_ATTRIBUTE SDA ON SDTV.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID = SDA.STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID WHERE SDTV.STEP_FILTER=${dataForVerbage} AND SDTV.IS_ACTIVE_STEP_DEFINITION_TEMPLATE_VERBIAGE='Yes' AND SDA.STEP_DEFINITION_ATTRIBUTE_MASTER_UUID='adcf6e25-f890-476c-bdcf-e723c6d7894c'`;
    let uiElementQuery = `SELECT UI_ELEMENT_UUID, UI_ELEMENT_TYPE FROM UI_ELEMENT WHERE PAGE_NEW_UUID='${input[0]['PAGE_UUID']}' AND FUNCTIONAL_AREA_UUID='${input[0]['APP_LOGGED_IN_FUNTIONAL_AREA_ID']}' AND UI_ELEMENT_MODE IN (${data})`;
    let uiElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      uiElementQuery,
      input
    );
    let stepDefTemplateVerbaleQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
      'PRIMARYSPRINGFM',
      stepDefTemplateVerbaleQuery,
      input
    );
    input[0]['count'] = 0;
    for (let element of uiElementQueryData) {
      let uiElementTypeQuery = `SELECT UI_ELEMENT_TYPE_NAME FROM UI_ELEMENT_TYPE_MASTER WHERE UI_ELEMENT_TYPE_UUID='${element['UI_ELEMENT_TYPE']}'`;
      let uiElementTypeQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery(
        'PRIMARYSPRINGFM',
        uiElementTypeQuery,
        input
      );
      for (let verbale of stepDefTemplateVerbaleQueryData) {
        if (
          input[0]['UI_ELEMENT_STEP_FILTER_TYPE'] === 'User Input' &&
          uiElementTypeQueryData['UI_ELEMENT_TYPE_NAME'] === verbale['APPLICABLE_UI_ELEMENT_TYPE']
        ) {
          input[0]['count'] = input[0]['count'] + 1;
        } else if (input[0]['UI_ELEMENT_STEP_FILTER_TYPE'] !== 'User Input') {
          input[0]['count'] = input[0]['count'] + 1;
        }
      }
    }
    if (input[0]['count'] == 0) {
      msg.payload.result = { mode: 'Enable Message', code: 406 };
      msg.payload.result.errors = [
        {
          message: 'UI Element Group Cannot be Created For this Group',
          reason: 'Message below form field',
          warningMessage: '',
          location: '2f7b9034-b7e9-4210-abc5-2f048d545f5d=>0=>PAGE_UUID',
        },
      ];
    } else {
      input[0]['IsEnable'] = 'Hello';
      msg.payload.result = { formData: input };
    }
  } else {
    input[0]['IsEnable'] = 'Hello';
    msg.payload.result = { formData: input };
  }
  node.send(msg);
  console.log('#########', input);
} catch (e) {
  console.log('Error occurred:', e.message);
  return;
}
