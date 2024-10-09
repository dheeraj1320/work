if (!input[0].ALL_VIEW_UI_ELEMENTS) {
  const viewElementsQuery = `SELECT UI_ELEMENT_UUID FROM UI_ELEMENT WHERE PAGE_NEW_UUID = :PAGE_UUID AND UI_ELEMENT_UUID NOT IN (SELECT UI_ELEMENT_UUID FROM VIEW_UI_ELEMENT WHERE VIEW_UUID = :VIEW_UUID)`;

  let viewElementsQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGFM',
    viewElementsQuery,
    input[0]
  );

  const ui_element_uuids = viewElementsQueryData
    .map((data) => data.UI_ELEMENT_UUID)
    .sort()
    .join(',');

  if (ui_element_uuids.length == 0) {
    input[0].IS_WARNING_MESSAGE_VISIBLE = true;
  }

  input[0].ALL_VIEW_UI_ELEMENTS = ui_element_uuids;
}

console.log('input ====== >>>>>>>>>>>> ', input[0]);
if (input[0].ALL_VIEW_UI_ELEMENTS) {
  if (input[0]['SELECT_ALL'] === 'Yes') {
    if (input[0].PREVIOUS_SELECT_ALL !== 'Yes') {
      input[0].VIEW_UI_ELEMENT_NAME = input[0].ALL_VIEW_UI_ELEMENTS;
      input[0].PREVIOUS_SELECT_ALL = 'Yes';
    } else if (
      !input[0].VIEW_UI_ELEMENT_NAME ||
      input[0].VIEW_UI_ELEMENT_NAME.split(',').sort().join(',') !== input[0].ALL_VIEW_UI_ELEMENTS
    ) {
      input[0].SELECT_ALL = '';
      input[0].PREVIOUS_SELECT_ALL = '';
    }
  } else if (
    input[0].VIEW_UI_ELEMENT_NAME &&
    input[0].VIEW_UI_ELEMENT_NAME.split(',').sort().join(',') === input[0].ALL_VIEW_UI_ELEMENTS
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
