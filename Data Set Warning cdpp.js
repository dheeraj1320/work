const query =
  'SELECT DISTINCT de.DATA_ELEMENT_NAME FROM UI_ELEMENT ue JOIN DATA_ELEMENT de ON ue.DATA_ELEMENT_UUID = de.DATA_ELEMENT_UUID WHERE ue.DATA_SET_UUID = :DATA_SET_UUID';
const queryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', query, input[0]);

const multiMessageTemplate = ' Data Elements $ have one or more linked UI Element(s), they will be unlinked.';
const singleMessageTemplate = ' Data Element $ has one or more linked UI Element(s), they will be unlinked.';

let warningMessage = '';
let dataElement = '';
if (queryData && queryData.length > 0) {
  input[0].UI_ELEMENT_EXISTS = 'Yes';

  if (queryData.length === 1) {
    warningMessage = singleMessageTemplate.split('$').join(queryData[0].DATA_ELEMENT_NAME);
  } else {
    let message = queryData.map((data) => data.DATA_ELEMENT_NAME).join(', ');
    warningMessage = multiMessageTemplate.split('$').join(message);
  }
} else {
  input[0].UI_ELEMENT_EXISTS = 'No';
  warningMessage = 'Are you sure you want to Delete?';
}

input[0].WARNING_MESSAGE = warningMessage;
