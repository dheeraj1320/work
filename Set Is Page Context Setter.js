// if (input[0].STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID==null){
// input[0].IS_PAGE_CONTEXT_SETTER = input[0].IS_PAGE_CONTEXT_SETTER
// }
if(!input[0].STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID){
    const QUERY = `SELECT * FROM STEP_DEFINITION_TEMPLATE WHERE STEP_DEFINITION_TEMPLATE_UUID=:STEP_DEFINITION_TEMPLATE_UUID`;
    const Data = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', QUERY, input[0]);
    const DataRecord = JSON.parse(JSON.stringify(Data));
    if (DataRecord && DataRecord.length > 0 && DataRecord[0].IS_PAGE_CONTEXT_SETTER === 'Yes') {
        input[0]['IS_PAGE_CONTEXT_SETTER'] = 'Yes';
    } else {
        input[0]['IS_PAGE_CONTEXT_SETTER'] = '';
    }
}
if (input[0].STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID !== null || input[0].STEP_DEFINITION_ATTRIBUTE_UUID) {
    const QUERY = `SELECT IS_ACTIVE_STEP_DEFINITION_TEMPLATE FROM STEP_DEFINITION_TEMPLATE WHERE STEP_DEFINITION_TEMPLATE_UUID=:STEP_DEFINITION_TEMPLATE_UUID`;
    const Data = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', QUERY, input[0]);
    const DataRecord = JSON.parse(JSON.stringify(Data));
    console.log('Query Result:', DataRecord);
    if (DataRecord && DataRecord.length > 0 && DataRecord[0].IS_ACTIVE_STEP_DEFINITION_TEMPLATE === 'No') {
        input[0]['Activefound'] = 'Yes';
        console.log('%%%%%%%%%%%%%%%',input[0]['Activefound']);
    } else {
        input[0]['Activefound'] = 'No';
        console.log('%%%%%%%%%%555%%%%%',input[0]['Activefound']);
    }
}

if(input[0]['SDTV_TENANT_ID']){
    const splittedTenantIds = input[0]['SDTV_TENANT_ID'].split(',').join("','");
    console.log('splittedTenantIds', splittedTenantIds);
    input[0]['SPLIT_TENANT_IDS'] = splittedTenantIds;
}