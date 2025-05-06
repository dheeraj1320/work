if (input.compositeEntityAction == 'Save' || input.compositeEntityAction == 'Update') {
  if (input.IS_DEFAULT_APPLICATION_ENVIRONMENT == 'Yes') {
    let appEnvQuery = `select APPLICATION_ENVIRONMENT_UUID,IS_DEFAULT_APPLICATION_ENVIRONMENT from APPLICATION_ENVIRONMENT where FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and IS_DEFAULT_APPLICATION_ENVIRONMENT="Yes" AND APPLICATION_ENVIRONMENT_UUID NOT IN('${input['APPLICATION_ENVIRONMENT_UUID']}');`;
    let QuerytoFetchData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', appEnvQuery, input);
    let QuerytoFetchRecords = JSON.parse(JSON.stringify(QuerytoFetchData));

    if (QuerytoFetchRecords.length > 0) {
      const app_env = {};
      const app_envList = [];
      //console.log(QuerytoFetchRecords[0].APPLICATION_ENVIRONMENT_UUID,'>>>>')
      app_env['APPLICATION_ENVIRONMENT_UUID'] = QuerytoFetchRecords[0].APPLICATION_ENVIRONMENT_UUID;
      app_env['IS_DEFAULT_APPLICATION_ENVIRONMENT'] = 'No';

      app_envList.push(app_env);
      input['AppEngChildEntity:APPLICATION_ENVIRONMENT_CHILD'] = app_envList;
    }
  }

  if (input.compositeEntityAction == 'Save') {
    if (!input.IS_DEFAULT_APPLICATION_ENVIRONMENT) {
      input['IS_DEFAULT_APPLICATION_ENVIRONMENT'] = 'No';
    }
  }
}
