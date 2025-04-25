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

if(input[0]['HAS_FORM_RERENDERED'] === 'Yes'){
    if(input[0]['OLD_SDTV_TENANT_ID'] !== input[0]['SDTV_TENANT_ID']){
        input[0]['SDTV_FUNCTIONAL_AREA_UUID'] = 'All';
        input[0]['OLD_SDTV_TENANT_ID'] = input[0]['SDTV_TENANT_ID'];
    }
} else {
    input[0]['HAS_FORM_RERENDERED'] = 'Yes';
    input[0]['OLD_SDTV_TENANT_ID'] = input[0]['SDTV_TENANT_ID'];
}

if(input[0]['SDTV_TENANT_ID']){
    let splittedTenantIds = input[0]['SDTV_TENANT_ID'].split(',');
    // let splittedTenantIds = input[0]['SDTV_TENANT_ID'].split(',').join("','");


    if(splittedTenantIds.includes('All') && splittedTenantIds.length > 1){
        if(splittedTenantIds[0] === 'All'){
            splittedTenantIds.shift();
        } else if(splittedTenantIds[splittedTenantIds.length - 1] === 'All'){
            splittedTenantIds = ['All'];
        }
    }
    console.log('splittedTenantIds', splittedTenantIds);
    input[0]['SPLIT_TENANT_IDS'] = splittedTenantIds.join("','");
    input[0]['SDTV_TENANT_ID'] = splittedTenantIds.join(",");
    input[0]['OLD_SDTV_TENANT_ID'] = input[0]['SDTV_TENANT_ID'];
} else {
    input[0]['SDTV_TENANT_ID'] = 'All';
    input[0]['OLD_SDTV_TENANT_ID'] = 'All';
}

if(input[0]['SDTV_FUNCTIONAL_AREA_UUID'] && input[0]['SDTV_FUNCTIONAL_AREA_UUID'].includes('All')){
    if(input[0]['SDTV_FUNCTIONAL_AREA_UUID'].startsWith('All')){
        input[0]['SDTV_FUNCTIONAL_AREA_UUID'] = input[0]['SDTV_FUNCTIONAL_AREA_UUID'].replace('All,', '');
    } else if(input[0]['SDTV_FUNCTIONAL_AREA_UUID'].endsWith('All')){
        input[0]['SDTV_FUNCTIONAL_AREA_UUID'] = 'All';
    }
}

if(!input[0]['SDTV_FUNCTIONAL_AREA_UUID']){
    input[0]['SDTV_FUNCTIONAL_AREA_UUID'] = 'All'
}

console.log('inside pre process ',  input[0]);