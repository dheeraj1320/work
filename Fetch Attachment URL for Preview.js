console.log('Input inside preview pre processor:::::::::::::::::::::: ', input);

function isImageFile(fileName) {
  return /\.(jpe?g|png|gif|bmp|webp|svg)$/i.test(fileName);
}

if (!input[0]['PREVIEW']) {
  const fetchAttachmentUrlQuery = `SELECT att.ATCHD_FILE_NM, attin.INFO_4, attin.INFO_1 FROM ATTACHMENT att JOIN ATTACHMENTINFO attin ON att.ATTACHMENT_INFO_ID = attin.ATTACHMENTINFO_ID WHERE att.TBL_NM = :TABLE_NAME AND att.KEY_NM = :KEY_NAME AND att.TBL_RW_ID = :KEY_VALUE ORDER BY CASE WHEN att.ATCHD_FILE_NM LIKE '%after%' THEN 0 WHEN att.ATCHD_FILE_NM LIKE '%before%' THEN 1 ELSE 2 END`;

  const fetchAttachmentUrlData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', fetchAttachmentUrlQuery, input[0]);

  const attachmentUrls = fetchAttachmentUrlData
    .map((record) => {
      if (!record.INFO_4 || !isImageFile(record.ATCHD_FILE_NM)) {
        return null;
      }
      return {
        title: record.ATCHD_FILE_NM,
        attachmentId: record.INFO_1,
        url: record.INFO_4
      };
    })
    .filter(Boolean);

  for (const attach of attachmentUrls) {
    const sassUrl = await generateSASUrl({ fileName: attach.title, attachmentId: attach.attachmentId, description: 'BeforeExtension' }, input.userDetailsToken);
    if (sassUrl && sassUrl.length > 0) attach.url = sassUrl;
  }

  input[0]['PREVIEW'] = JSON.stringify(attachmentUrls);
}
