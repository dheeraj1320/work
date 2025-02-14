if (input[0].SHARED_DATA_ELEMENT_UUID) {
  input[0].DATA_ELEMENT_UUID = input[0].SHARED_DATA_ELEMENT_UUID;
}

const query = 'SELECT COUNT(*) AS * FROM UI_ELEMENT WHERE DATA_ELEMENT_UUID = :DATA_ELEMENT_UUID';
const queryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', query, input[0]);

if(queryData[0].COUNT > 0){
    input[0].UI_ELEMENT_EXISTS = true;
    input[0].WARNING_MESSAGE = 'There are linked UI Elements, they will be unlinked. Are you sure you want to Delete?';
} else {
    input[0].UI_ELEMENT_EXISTS = false;
    input[0].WARNING_MESSAGE = 'Are you sure you want to Delete?';
}