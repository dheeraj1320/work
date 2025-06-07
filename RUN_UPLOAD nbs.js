console.log('input inside run upload nbs =========== ', input);


if (
  input['excelToJsonFormattedData'] &&
  Array.isArray(input['excelToJsonFormattedData'].run) &&
  input['excelToJsonFormattedData'].run.length > 0 &&
  Array.isArray(input['excelToJsonFormattedData'].executions) &&
  input['excelToJsonFormattedData'].executions.length > 0 &&
  Array.isArray(input['excelToJsonFormattedData'].conversationData) &&
  input['excelToJsonFormattedData'].conversationData.length > 0 &&
  Array.isArray(input['excelToJsonFormattedData'].attachment) &&
  input['excelToJsonFormattedData'].attachment.length > 0
) {
  const infoQaData = input['excelToJsonFormattedData'];
  const run = infoQaData.run;
  const executions = infoQaData.executions;
  const conversationData = infoQaData.conversationData;
  const attachment = infoQaData.attachment;

  // proceed with the data
} else {
  // handle missing or empty data
}
