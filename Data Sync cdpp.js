if (!input[0].ALL_FUNCTIONAL_AREAS) {
  const functionalAreaQuery = `SELECT FUNCTIONAL_AREA_UUID, FUNCTIONAL_AREA_NAME from FUNCTIONAL_AREA WHERE TENANT_UUID = :TENANT_UUID order by FUNCTIONAL_AREA_NAME;`;

  let functionalAreaQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    functionalAreaQuery,
    input[0]
  );

  const func_uuids = functionalAreaQueryData
    .map((data) => data.FUNCTIONAL_AREA_UUID)
    .sort()
    .join(',');


  input[0].ALL_FUNCTIONAL_AREAS = func_uuids;
}


if (input[0].ALL_FUNCTIONAL_AREAS) {
  if (input[0]['SELECT_ALL'] === 'Yes') {
    if (input[0].PREVIOUS_SELECT_ALL !== 'Yes') {
      input[0].SELECTED_FUNCTIONAL_AREAS = input[0].ALL_FUNCTIONAL_AREAS;
      input[0].PREVIOUS_SELECT_ALL = 'Yes';
    } else if (
      !input[0].SELECTED_FUNCTIONAL_AREAS ||
      input[0].SELECTED_FUNCTIONAL_AREAS.split(',').sort().join(',') !== input[0].ALL_FUNCTIONAL_AREAS
    ) {
      input[0].SELECT_ALL = '';
      input[0].PREVIOUS_SELECT_ALL = '';
    }
  } else if (
    input[0].SELECTED_FUNCTIONAL_AREAS &&
    input[0].SELECTED_FUNCTIONAL_AREAS.split(',').sort().join(',') === input[0].ALL_FUNCTIONAL_AREAS
  ) {
    if (input[0].PREVIOUS_SELECT_ALL != 'Yes') {
      input[0].SELECT_ALL = 'Yes';
      input[0].PREVIOUS_SELECT_ALL = 'Yes';
    } else {
      input[0].PREVIOUS_SELECT_ALL = '';
    }
  } else {
    input[0].PREVIOUS_SELECT_ALL = '';
  }
}


input[0].IS_APP_DROP_EDITABLE = 'Yes';
const roles = input[0].APP_LOGGED_IN_ROLE_ID
  .split(',')
  .map(role => role.trim());

if (roles.includes('3')) {
  input[0].IS_APP_DROP_EDITABLE = 'Yes';
} else {
  input[0].IS_APP_DROP_EDITABLE = 'No';

  if (roles.includes('15')) {
    input[0].SELECTED_FUNCTIONAL_AREAS = input[0].APP_LOGGED_IN_FUNTIONAL_AREA_ID;
  }
}
