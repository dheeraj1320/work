const app_envList = [];
const APPLICATION_ENVIRONMENT_BASE_URL = [];
const PAGE_OVERRIDE_BASE_URL = [];

function deleteRecord(primarykey, primarykeyvalue, deleteType, functionalareauuid = null) {
  let deleteParameter = {};

  deleteParameter[primarykey] = primarykeyvalue;
  deleteParameter['compositeEntityAction'] = 'Delete';
  if (functionalareauuid) deleteParameter['FUNCTIONAL_AREA_UUID'] = functionalareauuid;

  switch (deleteType) {
    case 'APPLICATION_ENVIRONMENT_BASE_URL':
      APPLICATION_ENVIRONMENT_BASE_URL.push(deleteParameter);
      break;
    case 'PAGE_OVERRIDE_BASE_URL':
      PAGE_OVERRIDE_BASE_URL.push(deleteParameter);
      break;
  }
}

if (input.compositeEntityAction == 'Save' || input.compositeEntityAction == 'Update') {
  if (input.IS_DEFAULT_APPLICATION_ENVIRONMENT == 'Yes') {
    let appEnvQuery = `select APPLICATION_ENVIRONMENT_UUID,IS_DEFAULT_APPLICATION_ENVIRONMENT from APPLICATION_ENVIRONMENT where FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and IS_DEFAULT_APPLICATION_ENVIRONMENT="Yes" AND APPLICATION_ENVIRONMENT_UUID NOT IN('${input['APPLICATION_ENVIRONMENT_UUID']}');`;
    let QuerytoFetchData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', appEnvQuery, input);
    let QuerytoFetchRecords = JSON.parse(JSON.stringify(QuerytoFetchData));

    if (QuerytoFetchRecords.length > 0) {
      const app_env = {};
      //console.log(QuerytoFetchRecords[0].APPLICATION_ENVIRONMENT_UUID,'>>>>')
      app_env['APPLICATION_ENVIRONMENT_UUID'] = QuerytoFetchRecords[0].APPLICATION_ENVIRONMENT_UUID;
      app_env['IS_DEFAULT_APPLICATION_ENVIRONMENT'] = 'No';

      app_envList.push(app_env);
    }
  }

  if (input.compositeEntityAction == 'Save') {
    if (!input.IS_DEFAULT_APPLICATION_ENVIRONMENT) {
      input['IS_DEFAULT_APPLICATION_ENVIRONMENT'] = 'No';
    }

    const baseUrlObj = {};
    baseUrlObj['IS_DEFAULT_BASE_URL'] = 'Yes';
    baseUrlObj['APPLICATION_ENVIRONMENT_UUID'] = input['APPLICATION_ENVIRONMENT_UUID'];
    baseUrlObj['BASE_URL'] = input['APPLICATION_ENVIRONMENT_BASE_URL'];
    APPLICATION_ENVIRONMENT_BASE_URL.push(baseUrlObj);
  }
} else if (input.compositeEntityAction == 'Delete') {
  // Deleting base urls
  const baseURLQuery = `select APPLICATION_ENVIRONMENT_BASE_URL_UUID from APPLICATION_ENVIRONMENT_BASE_URL where FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and APPLICATION_ENVIRONMENT_UUID = :APPLICATION_ENVIRONMENT_UUID`;
  const baseURLQueryResult = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', baseURLQuery, input);

  for(data of baseURLQueryResult){
    deleteRecord('APPLICATION_ENVIRONMENT_BASE_URL_UUID', data.APPLICATION_ENVIRONMENT_BASE_URL_UUID, 'APPLICATION_ENVIRONMENT_BASE_URL', input['FUNCTIONAL_AREA_UUID']);
  }

  // Deleting Page Override records
  const pageOverrideQuery = `SELECT PAGE_OVERRIDE_BASE_URL_UUID FROM PAGE_OVERRIDE_BASE_URL WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and APPLICATION_ENVIRONMENT_UUID = :APPLICATION_ENVIRONMENT_UUID`;
  const pageOverrideQueryResult = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageOverrideQuery, input);

  for(data of pageOverrideQueryResult){
    deleteRecord('PAGE_OVERRIDE_BASE_URL_UUID', data.PAGE_OVERRIDE_BASE_URL_UUID, 'PAGE_OVERRIDE_BASE_URL', input['FUNCTIONAL_AREA_UUID']);
  }
}

input['AppEngChildEntity:APPLICATION_ENVIRONMENT_CHILD'] = app_envList;
input['AppEngChildEntity:APPLICATION_ENVIRONMENT_BASE_URL'] = APPLICATION_ENVIRONMENT_BASE_URL;
input['AppEngChildEntity:PAGE_OVERRIDE_BASE_URL'] = PAGE_OVERRIDE_BASE_URL;
