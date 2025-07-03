const APPLICATION_ENVIRONMENT = [];
const APPLICATION_ENVIRONMENT_BASE_URL_CHILD = [];
const PAGE_OVERRIDE_BASE_URL = [];

const getBaseUrlRecordsForEnv = async () => {
  const appEnvBaseUrlCountQuery = `SELECT APPLICATION_ENVIRONMENT_BASE_URL_UUID, IS_DEFAULT_BASE_URL FROM APPLICATION_ENVIRONMENT_BASE_URL WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and APPLICATION_ENVIRONMENT_UUID = :APPLICATION_ENVIRONMENT_UUID`;
  return await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', appEnvBaseUrlCountQuery, input);
};

const getOverrideRecordsForEnv = async () => {
  const overrideRecordQuery = `SELECT PAGE_OVERRIDE_BASE_URL_UUID FROM PAGE_OVERRIDE_BASE_URL WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and APPLICATION_ENVIRONMENT_UUID = :APPLICATION_ENVIRONMENT_UUID`;
  return await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', overrideRecordQuery, input);
};

if (input.compositeEntityAction == 'Save' || input.compositeEntityAction == 'Update') {
  if (input.IS_DEFAULT_BASE_URL == 'Yes') {
    const appEnvBaseUrlQuery = `SELECT APPLICATION_ENVIRONMENT_BASE_URL_UUID from APPLICATION_ENVIRONMENT_BASE_URL WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and IS_DEFAULT_BASE_URL="Yes" AND APPLICATION_ENVIRONMENT_UUID = :APPLICATION_ENVIRONMENT_UUID AND APPLICATION_ENVIRONMENT_BASE_URL_UUID != :APPLICATION_ENVIRONMENT_BASE_URL_UUID;`;
    const appEnvBaseUrlData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', appEnvBaseUrlQuery, input);

    // Setting other base urls for this environment to No
    for (const envData of appEnvBaseUrlData) {
      const appEnvBaseUrlObj = {};
      appEnvBaseUrlObj['APPLICATION_ENVIRONMENT_BASE_URL_UUID'] = envData.APPLICATION_ENVIRONMENT_BASE_URL_UUID;
      appEnvBaseUrlObj['IS_DEFAULT_BASE_URL'] = 'No';
      APPLICATION_ENVIRONMENT_BASE_URL_CHILD.push(appEnvBaseUrlObj);

      input['OLD_DEFAULT_APPENV_BASE_URL_UUID'] = envData.APPLICATION_ENVIRONMENT_BASE_URL_UUID;
    }

    const appEnvObj = {};
    appEnvObj['APPLICATION_ENVIRONMENT_UUID'] = input['APPLICATION_ENVIRONMENT_UUID'];
    appEnvObj['APPLICATION_ENVIRONMENT_BASE_URL'] = input['BASE_URL'];
    APPLICATION_ENVIRONMENT.push(appEnvObj);
  }

  // Actions based on existing count of base urls for this environment
  const baseUrlData = await getBaseUrlRecordsForEnv();

  if (baseUrlData.length == 1 && input.compositeEntityAction == 'Save') {
    input['message'] = 'The Overriden URL has been added to the pages with Overridden Base URL';
    const overrideRecordData = await getOverrideRecordsForEnv();

    const urlToSet = input.IS_DEFAULT_BASE_URL == 'Yes' ? baseUrlData[0].APPLICATION_ENVIRONMENT_BASE_URL_UUID : input.APPLICATION_ENVIRONMENT_BASE_URL_UUID;

    for (const overData of overrideRecordData) {
      const pageOverrideObj = {};
      pageOverrideObj['PAGE_OVERRIDE_BASE_URL_UUID'] = overData.PAGE_OVERRIDE_BASE_URL_UUID;
      pageOverrideObj['APPLICATION_ENVIRONMENT_BASE_URL_UUID'] = urlToSet;
      pageOverrideObj['compositeEntityAction'] = 'Update';
      PAGE_OVERRIDE_BASE_URL.push(pageOverrideObj);
    }
  } else if (baseUrlData.length == 2 && input.compositeEntityAction == 'Update' && input.OLD_IS_DEFAULT_BASE_URL != input.IS_DEFAULT_BASE_URL) {
    input['message'] = 'The pages using this URL have been updated with the non default Overridden URL';
    const overrideRecordData = await getOverrideRecordsForEnv();

    let urlToSet = input.APPLICATION_ENVIRONMENT_BASE_URL_UUID;
    if (input.IS_DEFAULT_BASE_URL == 'Yes') {
      const otherUrl = baseUrlData.find((url) => url.APPLICATION_ENVIRONMENT_BASE_URL_UUID != input.APPLICATION_ENVIRONMENT_BASE_URL_UUID)?.APPLICATION_ENVIRONMENT_BASE_URL_UUID;
      urlToSet = otherUrl;
    }

    for (const overData of overrideRecordData) {
      const pageOverrideObj = {};
      pageOverrideObj['PAGE_OVERRIDE_BASE_URL_UUID'] = overData.PAGE_OVERRIDE_BASE_URL_UUID;
      pageOverrideObj['APPLICATION_ENVIRONMENT_BASE_URL_UUID'] = urlToSet;
      pageOverrideObj['compositeEntityAction'] = 'Update';
      PAGE_OVERRIDE_BASE_URL.push(pageOverrideObj);
    }
  } else if (baseUrlData.length > 2 && input.compositeEntityAction == 'Update' && input.IS_DEFAULT_BASE_URL == 'Yes') {
    input['message'] = 'This URL has been removed as overriden URL, Please select overriden URL manually for pages with overriden page URL';
    const overrideRecordForUrl = `SELECT PAGE_OVERRIDE_BASE_URL_UUID FROM PAGE_OVERRIDE_BASE_URL WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and APPLICATION_ENVIRONMENT_BASE_URL_UUID = :APPLICATION_ENVIRONMENT_BASE_URL_UUID`;
    const overrideRecordForUrlData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', overrideRecordForUrl, input);

    for (const orForUrl of overrideRecordForUrlData) {
      const pageOverrideObj = {};
      pageOverrideObj['PAGE_OVERRIDE_BASE_URL_UUID'] = orForUrl.PAGE_OVERRIDE_BASE_URL_UUID;
      pageOverrideObj['APPLICATION_ENVIRONMENT_BASE_URL_UUID'] = '';
      pageOverrideObj['compositeEntityAction'] = 'Update';
      PAGE_OVERRIDE_BASE_URL.push(pageOverrideObj);
    }
  }
} else if (input.compositeEntityAction == 'Delete') {
  // Removing or updating PAGE_OVERRIDE_BASE_URL references based on available URLs after deletion

  const pageOverrideQuery = `SELECT PAGE_OVERRIDE_BASE_URL_UUID FROM PAGE_OVERRIDE_BASE_URL WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID and APPLICATION_ENVIRONMENT_UUID = :APPLICATION_ENVIRONMENT_UUID`;
  const pageOverrideQueryResult = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageOverrideQuery, input);

  const baseUrlData = await getBaseUrlRecordsForEnv();

  const otherUrlWithNo = baseUrlData.find(
    (urlData) => urlData.IS_DEFAULT_BASE_URL != 'Yes' && urlData.APPLICATION_ENVIRONMENT_BASE_URL_UUID != input.APPLICATION_ENVIRONMENT_BASE_URL_UUID
  )?.APPLICATION_ENVIRONMENT_BASE_URL_UUID;
  let urlToSet = '';
  if (baseUrlData.length == 3) {
    urlToSet = otherUrlWithNo || '';
    input['message'] = 'The pages with Overridden Base URL have been updated with the non default Overridden URL';
  }

  for (const data of pageOverrideQueryResult) {
    const pageOverrideObj = {};
    pageOverrideObj['PAGE_OVERRIDE_BASE_URL_UUID'] = data.PAGE_OVERRIDE_BASE_URL_UUID;
    pageOverrideObj['APPLICATION_ENVIRONMENT_BASE_URL_UUID'] = urlToSet;
    pageOverrideObj['compositeEntityAction'] = 'Update';
    PAGE_OVERRIDE_BASE_URL.push(pageOverrideObj);
  }
}

input['AppEngChildEntity:APPLICATION_ENVIRONMENT'] = APPLICATION_ENVIRONMENT;
input['AppEngChildEntity:APPLICATION_ENVIRONMENT_BASE_URL_CHILD'] = APPLICATION_ENVIRONMENT_BASE_URL_CHILD;
input['AppEngChildEntity:PAGE_OVERRIDE_BASE_URL'] = PAGE_OVERRIDE_BASE_URL;
