try {
  debugger;
  let input = msg.payload.apiRequestBody.baseEntity.records[0];
  const AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  const appEnvBaseUrlCountQuery = `SELECT COUNT(APPLICATION_ENVIRONMENT_BASE_URL_UUID) as RECORD_COUNT FROM APPLICATION_ENVIRONMENT_BASE_URL WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and APPLICATION_ENVIRONMENT_UUID = :APPLICATION_ENVIRONMENT_UUID`;
  const appEnvBaseUrlCountData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', appEnvBaseUrlCountQuery, input);
  const baseUrlCount = Number(appEnvBaseUrlCountData?.[0]?.['RECORD_COUNT'] ?? 0);
  const poUrlQuery = `SELECT COUNT(PAGE_OVERRIDE_BASE_URL_UUID) AS PO_COUNT FROM PAGE_OVERRIDE_BASE_URL WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and APPLICATION_ENVIRONMENT_BASE_URL_UUID = :APPLICATION_ENVIRONMENT_BASE_URL_UUID`;
  const poUrlData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', poUrlQuery, input);
  const isUrlInUse = Number(poUrlData?.[0]?.['PO_COUNT'] ?? 0) > 0;
  const poAppQuery = `SELECT COUNT(PAGE_OVERRIDE_BASE_URL_UUID) AS PO_COUNT FROM PAGE_OVERRIDE_BASE_URL WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and APPLICATION_ENVIRONMENT_UUID = :APPLICATION_ENVIRONMENT_UUID`;
  const poAppData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', poAppQuery, input);
  const isAppInUse = Number(poAppData?.[0]?.['PO_COUNT'] ?? 0) > 0;
  let message = null;
  if (input.compositeEntityAction == 'Save' && baseUrlCount == 1 && isAppInUse) {
    message = 'The Overriden URL has been added to the pages with Overridden Base URL';
  } else if (input.compositeEntityAction == 'Update' && baseUrlCount >= 2 && input.OLD_IS_DEFAULT_BASE_URL == 'No' && input.IS_DEFAULT_BASE_URL == 'Yes' && isUrlInUse) {
    message =
      baseUrlCount == 2
        ? 'The pages using this URL have been updated with the non default Overridden URL'
        : 'This URL has been removed as overriden URL, Please select overriden URL manually for pages with overriden page URL';
  } else if (input.compositeEntityAction == 'Delete' && baseUrlCount == 3 && isAppInUse) {
    message = 'The pages with Overridden Base URL have been updated with the non default Overridden URL';
  }
  if (input.IS_DEFAULT_BASE_URL == 'Yes') {
    let dataGridCard = '0_9b5804b0-1850-41b5-8046-4a9e313fd5f3';
    if (message) {
      let mode = { mode: 'Enable Message', message: message };
      msg.payload['result'] = mode;
    }
    msg.payload.result['modifyOtherCard'] = {};
    msg.payload.result.modifyOtherCard[dataGridCard] = [
      {
        parameter: 'data',
        parameterKey: 'APPLICATION_ENVIRONMENT_UUID',
        type: 'PortalDataGrid',
        parameterKeyValue: input.APPLICATION_ENVIRONMENT_UUID,
        changedData: { APPLICATION_ENVIRONMENT_BASE_URL: input.BASE_URL }
      }
    ];
  }
  node.send(msg);
} catch (error) {
  console.log('Errorr Occured Process and Send Data to ui', error.message);
}
return;
