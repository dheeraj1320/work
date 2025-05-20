if(input['ASSOCIATION_TYPE'] == 'USER_ACTION'){
    if(input['IS_SOLO_REQUIREMENT'] == 'Yes' && (!input['CONDITION_SATISFACTION_UUID'] || input['CONDITION_SATISFACTION_UUID'] == "null")){
      input['ASSOCIATION_TYPE'] = 'PAGE-EVENT';
      input['CONDITION_SATISFACTION_UUID'] = null;
    }
    else if(input['IS_SOLO_REQUIREMENT'] == 'No' && input['CONDITION_SATISFACTION_UUID']){
      input['ASSOCIATION_TYPE'] = 'PAGE-EVENT';
    }
}if(input['ASSOCIATION_TYPE'] == 'REQUIREMENT_TITLE'){
    if(input['IS_SOLO_REQUIREMENT'] == 'Yes' && (!input['CONDITION_SATISFACTION_UUID'] || input['CONDITION_SATISFACTION_UUID'] == "null")){
      input['ASSOCIATION_TYPE'] = 'FEATURE';
      input['CONDITION_SATISFACTION_UUID'] = null;
    }
    else if(input['CONDITION_SATISFACTION_UUID']){
      input['ASSOCIATION_TYPE'] = 'FEATURE';
    }
}