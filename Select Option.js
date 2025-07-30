debugger;
try {
  AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let input = Object.assign(msg.payload.apiRequestBody, msg.payload.referenceData);
  const AS = [
    { label: 'Appollo medicine 1', NAME: 'Appollo medicine 1', ID: 'ac90ff6a-6bc4-11f0-b67b-02a48541b261', value: 'ac90ff6a-6bc4-11f0-b67b-02a48541b261' },
    { label: 'Amul Protien Milkshake', NAME: 'Amul Protien Milkshake', ID: 'ac911c7c-6bc4-11f0-b67b-02a48541b261', value: 'ac911c7c-6bc4-11f0-b67b-02a48541b261' },
    { label: 'The Whole Truth Whey', NAME: 'The Whole Truth Whey', ID: 'bf960847-6bc4-11f0-b67b-02a48541b261', value: 'bf960847-6bc4-11f0-b67b-02a48541b261' }
  ];
  const query = `SELECT ITEM_NAME as label, ITEM_NAME as NAME, BLINKIT_ITEMS_UUID as ID, BLINKIT_ITEMS_UUID as value FROM BLINKIT_ITEMS WHERE CATEGORY = :CATEGORY`;
  let queryData = await serviceOrchestrator.selectRecordsUsingQuery(`ZOMATO`, query, input);

  msg.payload.result = { optionData: queryData };
  node.send(msg);
} catch (error) {
  console.log('Error Occurred Process and Send Data to ui', error.message);
  console.log('Error stack:', error.stack);
  msg.payload.result = { gridData: [], error: error.message };
  node.send(msg);
}
return;
