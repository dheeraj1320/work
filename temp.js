try {
  let input = msg.payload.apiRequestBody;
  let AppengProcessConfig = global.get('AppengProcessConfig');
  const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
  let dataSetUIViewQuery = `SELECT DATA_SET_UI_VIEW_CONFIG_ITEM_ID FROM info_apps.DATA_SET_UI_VIEW where DATA_SET_UUID='${input['DATA_SET_UUID']}' AND DATA_SET_UI_VIEW_TYPE='ADD_FORM';`;
  let dataSetUIViewQueryData =
    await serviceOrchestrator.selectSingleRecordUsingQuery(
      'PRIMARYSPRINGFM',
      dataSetUIViewQuery,
      input
    );
  let ConfigItemQuery = `SELECT DISTINCT ci.ITEMID as CONFIG_ID, ci.ITEMNAME as CONFIG_NAME, ci.ITEMTYPE as CONFIG_TYPE FROM 
infoorigin_home_md.CONFIGITEM ci JOIN infoorigin_home_md.CONFIGITEMRELATION cir1 ON cir1.CHILDITEMID = ci.ITEMID 
WHERE cir1.PARENTITEMID IN ('${dataSetUIViewQueryData['DATA_SET_UI_VIEW_CONFIG_ITEM_ID']}') and 
 ci.ITEMTYPE = 'LogicalEntity' AND ci.ISDELETED = 0 AND cir1.ISDELETED = 0;`;
  let ConfigItemQueryData = JSON.parse(
    JSON.stringify(
      await serviceOrchestrator.selectRecordsUsingQuery(
        'INFOAPPS_MD',
        ConfigItemQuery,
        input
      )
    )
  );
  msg.payload.result = { gridData: ConfigItemQueryData };
  node.send(msg);
} catch (a) {
  node.error(a, msg);
}
return msg;
