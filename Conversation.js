console.log('Imnside conveo node business rule ::::::::::::::: _______________ ', input);

const CONVERSATION_MESSAGE = [];
const CONVERSATION_MESSAGE_PARTICIPANT = [];
const CONVERSATION_PARTICIPANT_SUMMARY = [];
const CONVERSATION_CHILD_OF_CONVERSATION = [];

const conversation_primary_key = uuid();
const conversation_message_primary_key = uuid();


function deleteRecord(primarykey, primarykeyvalue, tablename, functionalareauuid) {
  
  let deleteTableData = {};

  deleteTableData[primarykey] = primarykeyvalue;
  deleteTableData["compositeEntityAction"] = "Delete";
  deleteTableData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;
  
  if (tablename == 'CONVERSATION_MESSAGE') {
    CONVERSATION_MESSAGE.push(deleteTableData);
  }
  else if(tablename == 'CONVERSATION_MESSAGE_PARTICIPANT'){
    CONVERSATION_MESSAGE_PARTICIPANT.push(deleteTableData)
  }
  else if(tablename == 'CONVERSATION_PARTICIPANT_SUMMARY'){
    CONVERSATION_PARTICIPANT_SUMMARY.push(deleteTableData)
  }
}

if (input.compositeEntityAction === 'Send Message') {
  input['CONVERSATION_UUID'] = conversation_primary_key;
  input['CONVERSATION_TYPE'] = 'Conversation';

  const conversationMessage = {};
  conversationMessage['CONVERSATION_MESSAGE_UUID'] = conversation_message_primary_key;
  conversationMessage['CONVERSATION_UUID'] = conversation_primary_key;
  conversationMessage['MESSAGE_SENDER'] = input.APP_LOGGED_IN_USER_ID;
  conversationMessage['MESSAGE_RECIPIENTS'] = input['RECIPIENT'];
  conversationMessage['MESSAGE_WATCHER'] = input['WATCHER'];
  conversationMessage['SUBJECT'] = input['SUBJECT'];
  conversationMessage['MESSAGE_CONTENT'] = input['CONTENT'];
  CONVERSATION_MESSAGE.push(conversationMessage);

  let allParticipants = input.APP_LOGGED_IN_USER_ID + ',' + input['RECIPIENT'];
  allParticipants = input['WATCHER'] ? allParticipants + ',' + input['WATCHER'] : allParticipants;

  console.log('all participants :::::::::::::::: ++++++++++++++++ >>>>>>>>>>>> ', allParticipants);

  let participantsArr = allParticipants.split(',');
  participantsArr = [...new Set(participantsArr)];

  for (const paritcipant of participantsArr) {
    const conversationParticipantSummary = {};
    conversationParticipantSummary['CONVERSATION_UUID'] = conversation_primary_key;
    conversationParticipantSummary['CONVERSATION_PARTICIPANT_UUID'] = paritcipant;
    conversationParticipantSummary['SUBJECT'] = input['SUBJECT'];
    conversationParticipantSummary['LATEST_MESSAGE_SENDER'] = input['SENDER'];
    conversationParticipantSummary['IS_PARTICIPANT_CONVERSATION_DELETED'] = 'No';
    conversationParticipantSummary['AE_UPDATE_TS'] = new Date();

    CONVERSATION_PARTICIPANT_SUMMARY.push(conversationParticipantSummary);

    const conversationMessageParticipant = {};
    conversationMessageParticipant['CONVERSATION_UUID'] = conversation_primary_key;
    conversationMessageParticipant['CONVERSATION_MESSAGE_UUID'] = conversation_message_primary_key;
    conversationMessageParticipant['RECIPIENT_PARTICIPANT_UUID'] = paritcipant;
    conversationMessageParticipant['SENDER_PARTICIPANT_UUID'] = input['SENDER'];
    conversationMessageParticipant['MESSAGE_SUBJECT'] = input['SUBJECT'];
    conversationMessageParticipant['IS_PARTICIPANT_MESSAGE_DELETED'] = 'No';

    CONVERSATION_MESSAGE_PARTICIPANT.push(conversationMessageParticipant);
  }
} else if (input.compositeEntityAction === 'Reply') {
  input['CONVERSATION_UUID'] = input.CONVERSATION_UUID_FOR_REPLY;
  input['CONVERSATION_TYPE'] = 'Conversation';

  const conversationMessage = {};
  conversationMessage['CONVERSATION_MESSAGE_UUID'] = conversation_message_primary_key;
  conversationMessage['CONVERSATION_UUID'] = input['CONVERSATION_UUID'];
  conversationMessage['MESSAGE_SENDER'] = input.APP_LOGGED_IN_USER_ID;
  conversationMessage['MESSAGE_RECIPIENTS'] = input['RECIPIENT'];
  conversationMessage['MESSAGE_WATCHER'] = input['WATCHER'];
  conversationMessage['SUBJECT'] = input['SUBJECT'];
  conversationMessage['MESSAGE_CONTENT'] = input['CONTENT'];
  CONVERSATION_MESSAGE.push(conversationMessage);

  let allParticipants = input.APP_LOGGED_IN_USER_ID + ',' + input['RECIPIENT'];
  allParticipants = input['WATCHER'] ? allParticipants + ',' + input['WATCHER'] : allParticipants;

  console.log('all participants :::::::::::::::: ++++++++++++++++ >>>>>>>>>>>> ', allParticipants);

  let participantsArr = allParticipants.split(',');
  participantsArr = [...new Set(participantsArr)];


  for (const paritcipant of participantsArr) {
    const conversationMessageParticipant = {};
    conversationMessageParticipant['CONVERSATION_UUID'] = input['CONVERSATION_UUID'];
    conversationMessageParticipant['CONVERSATION_MESSAGE_UUID'] = conversation_message_primary_key;
    conversationMessageParticipant['RECIPIENT_PARTICIPANT_UUID'] = paritcipant;
    conversationMessageParticipant['SENDER_PARTICIPANT_UUID'] = input.APP_LOGGED_IN_USER_ID;
    conversationMessageParticipant['MESSAGE_SUBJECT'] = input['SUBJECT'];
    conversationMessageParticipant['IS_PARTICIPANT_MESSAGE_DELETED'] = 'No';

    CONVERSATION_MESSAGE_PARTICIPANT.push(conversationMessageParticipant);
  }

  let QuerytoFetchParticipantSummary = `SELECT CONVERSATION_PARTICIPANT_SUMMARY_UUID, SUBJECT, LATEST_MESSAGE_SENDER, CONVERSATION_PARTICIPANT_UUID FROM CONVERSATION_PARTICIPANT_SUMMARY WHERE CONVERSATION_UUID = :CONVERSATION_UUID;`;
  let QuerytoFetchParticipantSummaryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'INFO_TENANT',
    QuerytoFetchParticipantSummary,
    input
  );

  for (const summary of QuerytoFetchParticipantSummaryData) {
    if (participantsArr.includes(summary['CONVERSATION_PARTICIPANT_UUID'])) {
      const conversationParticipantSummary = { ...summary };
      conversationParticipantSummary['SUBJECT'] = input['SUBJECT'];
      conversationParticipantSummary['LATEST_MESSAGE_SENDER'] = input.APP_LOGGED_IN_USER_ID;

      CONVERSATION_PARTICIPANT_SUMMARY.push(conversationParticipantSummary);
    }
  }

} else if (input.compositeEntityAction === 'Delete' && input.ENTITY_TYPE === 'CONVERSATION_MESSAGE') {

  let QuerytoConversationParticipant = `SELECT CONVERSATION_MESSAGE_PARTICIPANT_UUID FROM CONVERSATION_MESSAGE_PARTICIPANT where CONVERSATION_MESSAGE_UUID = :CONVERSATION_MESSAGE_UUID and RECIPIENT_PARTICIPANT_UUID = '${input.APP_LOGGED_IN_USER_ID}'`;
  let QuerytoConversationParticipantData = await serviceOrchestrator.selectRecordsUsingQuery(
    'INFO_TENANT',
    QuerytoConversationParticipant,
    input
  );

  for(const data of QuerytoConversationParticipantData){
    deleteRecord('CONVERSATION_MESSAGE_PARTICIPANT_UUID', data['CONVERSATION_MESSAGE_PARTICIPANT_UUID'], 'CONVERSATION_MESSAGE_PARTICIPANT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID)
  }

} else if (input.compositeEntityAction === 'Delete' && input.ENTITY_TYPE === 'CONVERSATION') {

  let QuerytoConversationParticipant =  `SELECT CONVERSATION_PARTICIPANT_SUMMARY_UUID FROM CONVERSATION_PARTICIPANT_SUMMARY WHERE CONVERSATION_UUID = :CONVERSATION_UUID_FOR_REPLY AND CONVERSATION_PARTICIPANT_UUID = '${input.APP_LOGGED_IN_USER_ID}';`;
  let QuerytoConversationParticipantData = await serviceOrchestrator.selectRecordsUsingQuery(
    'INFO_TENANT',
    QuerytoConversationParticipant,
    input
  );
  console.log("QuerytoConversationParticipantData ========= ", QuerytoConversationParticipantData);

  for(const data of QuerytoConversationParticipantData){
    deleteRecord('CONVERSATION_PARTICIPANT_SUMMARY_UUID', data['CONVERSATION_PARTICIPANT_SUMMARY_UUID'], 'CONVERSATION_PARTICIPANT_SUMMARY', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }


  let messageParticipantsQuery = `SELECT CONVERSATION_MESSAGE_PARTICIPANT_UUID FROM CONVERSATION_MESSAGE_PARTICIPANT  WHERE CONVERSATION_UUID = :CONVERSATION_UUID_FOR_REPLY AND RECIPIENT_PARTICIPANT_UUID = '${input.APP_LOGGED_IN_USER_ID}';`
  let messageParticipantsQueryData = await serviceOrchestrator.selectRecordsUsingQuery(
    'INFO_TENANT',
    messageParticipantsQuery,
    input
  );
  console.log("messageParticipantsQueryData ========= ", messageParticipantsQueryData);

  for(const data of messageParticipantsQueryData){
    deleteRecord('CONVERSATION_MESSAGE_PARTICIPANT_UUID', data['CONVERSATION_MESSAGE_PARTICIPANT_UUID'], 'CONVERSATION_MESSAGE_PARTICIPANT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
  }
}

console.log('CONVERSATION_MESSAGE ============================> ', CONVERSATION_MESSAGE);
console.log('CONVERSATION_MESSAGE_PARTICIPANT ============================> ', CONVERSATION_MESSAGE_PARTICIPANT);
console.log('CONVERSATION_PARTICIPANT_SUMMARY ============================> ', CONVERSATION_PARTICIPANT_SUMMARY);

input['AppEngChildEntity:CONVERSATION_MESSAGE'] = CONVERSATION_MESSAGE;
input['AppEngChildEntity:CONVERSATION_MESSAGE_PARTICIPANT'] = CONVERSATION_MESSAGE_PARTICIPANT;
input['AppEngChildEntity:CONVERSATION_PARTICIPANT_SUMMARY'] = CONVERSATION_PARTICIPANT_SUMMARY;
input['AppEngChildEntity:CONVERSATION_CHILD_OF_CONVERSATION'] = CONVERSATION_CHILD_OF_CONVERSATION;