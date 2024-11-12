try {
  let input = msg.payload.apiRequestBody;
  let AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let conversatonQuery = `SELECT con.CONVERSATION_ID, con.CONVERSATION_UUID, cps.SUBJECT, cps.LATEST_MESSAGE_SENDER, cps.AE_UPDATE_TS FROM info_tenant.CONVERSATION_PARTICIPANT_SUMMARY cps JOIN info_tenant.CONVERSATION con ON cps.CONVERSATION_UUID = con.CONVERSATION_UUID WHERE cps.CONVERSATION_PARTICIPANT_UUID = :APP_LOGGED_IN_USER_ID AND cps.IS_PARTICIPANT_CONVERSATION_DELETED = 'No' ORDER BY con.CONVERSATION_ID DESC, cps.AE_UPDATE_TS DESC;`;
  let conversatonQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'INFO_TENANT',
    conversatonQuery,
    input
  );
  const finalGridData = [];
  for (const data of conversatonQueryData) {
    dataObj = {...data};
    const maxUpdateTSQuery = `SELECT MAX(AE_UPDATE_TS) as MAX_UPDATE_TS FROM CONVERSATION_PARTICIPANT_SUMMARY WHERE CONVERSATION_UUID = '${data.CONVERSATION_UUID}'`;
    const maxUpdateTSData = await serviceOrchestrator.selectRecordsUsingQuery(
      'INFO_TENANT',
      maxUpdateTSQuery,
      input
    );

    let getParticipantQuery;
    if(!maxUpdateTSData[0]['MAX_UPDATE_TS']){
        getParticipantQuery = `SELECT CONVERSATION_PARTICIPANT_UUID FROM CONVERSATION_PARTICIPANT_SUMMARY WHERE  CONVERSATION_UUID = '${data.CONVERSATION_UUID}'`;
    } else {
        getParticipantQuery = `SELECT CONVERSATION_PARTICIPANT_UUID FROM CONVERSATION_PARTICIPANT_SUMMARY WHERE  CONVERSATION_UUID = '${data.CONVERSATION_UUID}' AND AE_UPDATE_TS = '${maxUpdateTSData[0]['MAX_UPDATE_TS']}'`;
    }
    const getParticipantQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
        'INFO_TENANT',
        getParticipantQuery,
        input
    );

    const participantsString = getParticipantQueryData.map(val => val['CONVERSATION_PARTICIPANT_UUID']).join(',');
    dataObj['ACTIVE_PARTICIPANTS'] = participantsString;
    finalGridData.push(dataObj);
  }


  msg.payload.result = { gridData: finalGridData };
  node.send(msg);
} catch (a) {
  node.error(a, msg);
}
return msg;
