console.log('Inside the conversation column data pre processor ===========> ', input);

if (input[0]['CONVERSATION_MESSAGE_UUID']) {
  const convMessageQuery = `SELECT MESSAGE_SENDER, MESSAGE_RECIPIENTS, MESSAGE_WATCHER, SUBJECT, MESSAGE_CONTENT FROM info_tenant.CONVERSATION_MESSAGE WHERE CONVERSATION_MESSAGE_UUID = :CONVERSATION_MESSAGE_UUID;`;
  let convMessageQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'INFO_TENANT',
    convMessageQuery,
    input[0]
  );

  input[0]['WATCHER'] = convMessageQueryData[0]['MESSAGE_WATCHER'];
  input[0]['SENDER'] = convMessageQueryData[0]['MESSAGE_SENDER'];
  input[0]['RECIPIENT'] = convMessageQueryData[0]['MESSAGE_RECIPIENTS'];
  input[0]['SUBJECT'] = convMessageQueryData[0]['SUBJECT'];
  input[0]['CONTENT'] = convMessageQueryData[0]['MESSAGE_CONTENT'];
} else if (input[0]['IS_REPLY'] === 'Yes') {
  if (input[0]['WATCHER']) {
    const watchers = input[0]['WATCHER'];
    const filteredWatchers = watchers
      .split(',')
      .filter((id) => id !== 'APP_LOGGED_IN_USER_ID')
      .join(',');

    input[0]['WATCHER'] = filteredWatchers;
  }

  if (input[0]['RECIPIENT']) {
    const recipients = input[0]['RECIPIENT'];
    const filteredRecipients = recipients
      .split(',')
      .filter((id) => id !== 'APP_LOGGED_IN_USER_ID')
      .join(',');

    input[0]['RECIPIENT'] = filteredRecipients;
  }
}
