try {
  let atr = msg.payload.referenceData;
  let AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  const allCandidateQuery = `SELECT 'AllCandidate_Chasing' as Chasing_Tab, cc.CANDIDATE_CHASING_UUID,cc.REQUIREMENT_UUID,cc.CANDIDATE_CHASING_ID,concat(rt.REQUIREMENT_ID, ' - ',COALESCE(rt.PSTN_TITLE,''),' - ',COALESCE(rt.CITY,''),(', '),COALESCE(st.STATE_CODE,'')) as REQUIREMENT_ID,cc.SOURCE_UUID,cc.CANDIDATE_NAME,cc.CANDIDATE_PHONE_NUMBER,cc.CANDIDATE_EMAIL_ADDRESS,cc.CANDIDATE_CHASING_OWNER, cc.LATEST_CANDIDATE_CHASING_REMARK as Candidate_Chasing_Remark ,cc.TASK_UUID,cc.ACTIVITY_UUID,cc.PORTAL_UUID,cc.COUNTRY_UUID,cc.AE_INSERT_ID,cc.AE_INSERT_TS,cc.AE_UPDATE_ID,cc.AE_UPDATE_TS,cc.AE_TRANSACTION_ID, concat(COALESCE(tk.TASK_ID,''),COALESCE(concat(' - ',ac.ACTVTY_ID),'')) as TASK_ACTIVITY, cc.MY_TAGS, cc.LINKEDIN_ID as LNKDN_ID,cc.LINKEDIN_ID FROM REQUIREMENT rt,STATE st, CANDIDATE_CHASING cc LEFT JOIN TASK tk ON cc.TASK_UUID = tk.TASK_UUID LEFT JOIN ACTIVITY ac ON cc.ACTIVITY_UUID = ac.ACTIVITY_UUID where cc.REQUIREMENT_UUID = rt.REQUIREMENT_UUID and st.STATE_UUID = rt.STATE and cc.COUNTRY_UUID in (${atr.APP_LOGGED_IN_USER_CONTEXT_COUNTRY_ID}) order by cc.CANDIDATE_CHASING_ID desc `;
  let allCandidateData = await serviceOrchestrator.selectRecordsUsingQuery(
    'PRIMARYSPRINGSO',
    allCandidateQuery,
    atr
  );
  let allCandidateParsedData = JSON.parse(JSON.stringify(allCandidateData));
  let filteredData = allCandidateParsedData.map((data) => {
    if (data.LNKDN_ID) {
      if (
        !data.LNKDN_ID.toLowerCase().startsWith('https://www.linkedin.com') &&
        !data.LNKDN_ID.toLowerCase().startsWith('http://www.linkedin.com')
      ) {
        return {
          ...data,
          LNKDN_ID: `<a href='https://www.linkedin.com' target='_blank'><img src='https://application-attachment.s3.amazonaws.com/linkedinIcon.png' style='width:32px;margin-top:-6px;margin-left:-7px;'></a>`,
        };
      }
      return {
        ...data,
        LNKDN_ID: `<a href='${data.LNKDN_ID}' target='_blank'><img src='https://application-attachment.s3.amazonaws.com/linkedinIcon.png' style='width:32px;margin-top:-6px;margin-left:-7px;'></a>`,
      };
    } else {
      return { ...data, LNKDN_ID: '' };
    }
  });
  msg.payload.result = { gridData: filteredData };
  console.log(
    'condidate data::::::',
    allCandidateData,
    'atr == = =>>> ',
    atr.APP_LOGGED_IN_USER_CONTEXT_COUNTRY_ID
  );
} catch (a) {
  node.error(a, msg);
}
return msg;
