console.log('inside base url composite entity', input)

const APPLICATION_ENVIRONMENT = [];
const APPLICATION_ENVIRONMENT_BASE_URL_CHILD = [];

if(input.compositeEntityAction == 'Save' || input.compositeEntityAction == 'Update') {
  if (input.IS_DEFAULT_BASE_URL == 'Yes') {

    const appEnvBaseUrlQuery = `SELECT APPLICATION_ENVIRONMENT_BASE_URL_UUID from APPLICATION_ENVIRONMENT_BASE_URL WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and IS_DEFAULT_BASE_URL="Yes" AND APPLICATION_ENVIRONMENT_UUID = :APPLICATION_ENVIRONMENT_UUID AND APPLICATION_ENVIRONMENT_BASE_URL_UUID != :APPLICATION_ENVIRONMENT_BASE_URL_UUID;`;
    const appEnvBaseUrlData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', appEnvBaseUrlQuery, input);

    // Setting other base urls for this environment to No
    for(envData of appEnvBaseUrlData) {
        const appEnvBaseUrlObj = {};
        appEnvBaseUrlObj['APPLICATION_ENVIRONMENT_BASE_URL_UUID'] = envData.APPLICATION_ENVIRONMENT_BASE_URL_UUID;
        appEnvBaseUrlObj['IS_DEFAULT_BASE_URL'] = 'No';
        APPLICATION_ENVIRONMENT_BASE_URL_CHILD.push(appEnvBaseUrlObj);
    }

    const appEnvObj = {};
    appEnvObj['APPLICATION_ENVIRONMENT_UUID'] = input['APPLICATION_ENVIRONMENT_UUID'];
    appEnvObj['APPLICATION_ENVIRONMENT_BASE_URL'] = input['BASE_URL'];
    APPLICATION_ENVIRONMENT.push(appEnvObj);
  }
}

input['AppEngChildEntity:APPLICATION_ENVIRONMENT'] = APPLICATION_ENVIRONMENT;
input['AppEngChildEntity:APPLICATION_ENVIRONMENT_BASE_URL_CHILD'] = APPLICATION_ENVIRONMENT_BASE_URL_CHILD;