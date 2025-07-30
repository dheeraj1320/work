debugger;
try {
  const optionData = [
    { label: 'Appollo medicine 1', NAME: 'Appollo medicine 1', ID: 'ac90ff6a-6bc4-11f0-b67b-02a48541b261', value: 'ac90ff6a-6bc4-11f0-b67b-02a48541b261' },
    { label: 'Amul Protien Milkshake', NAME: 'Amul Protien Milkshake', ID: 'ac911c7c-6bc4-11f0-b67b-02a48541b261', value: 'ac911c7c-6bc4-11f0-b67b-02a48541b261' },
    { label: 'The Whole Truth Whey', NAME: 'The Whole Truth Whey', ID: 'bf960847-6bc4-11f0-b67b-02a48541b261', value: 'bf960847-6bc4-11f0-b67b-02a48541b261' }
  ];
  msg.payload.result = { optionData };
  node.send(msg);
} catch (error) {
  console.log('Error Occurred Process and Send Data to ui', error.message);
  console.log('Error stack:', error.stack);
  msg.payload.result = { gridData: [], error: error.message };
  node.send(msg);
}
return;
