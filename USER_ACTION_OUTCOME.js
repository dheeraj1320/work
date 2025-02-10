console.log("inside USER_ACTION_OUTCOME composite entity :::::::::::::::: ", input);

const USER_ACTION_OUTCOME = [];
if(input.isNewOutcomeAdded && input.mode !== 'Edit'){

    // Scenario where new outcome is added
    const USER_ACTION_OUTCOME_UUID = uuid();
    const outcomeObj = {}
    outcomeObj.USER_ACTION_OUTCOME_UUID = USER_ACTION_OUTCOME_UUID;
    outcomeObj.OUTCOME_NAME = input.title;
    outcomeObj.PAGE_UUID = input.PAGE_UUID;
    outcomeObj.USER_ACTION_UUID = input.USER_ACTION_UUID;

    outcomeObj.FUNCTIONAL_AREA_UUID = input.APP_LOGGED_IN_FUNTIONAL_AREA_ID;
    outcomeObj.AE_INSERT_ID = input.APP_LOGGED_IN_USER_ID;
    
    USER_ACTION_OUTCOME.push(outcomeObj);
    input['USER_ACTION_OUTCOME_UUID'] = USER_ACTION_OUTCOME_UUID;
} else if (input.mode === 'Edit') {
    // Scenario where outcome name has changed
    const outcomeQuery = `SELECT * FROM PROCESS_OUTCOME WHERE PROCESS_OUTCOME_UUID = '${input.PROCESS_OUTCOME_UUID}' AND FUNCTIONAL_AREA_UUID = '${input.APP_LOGGED_IN_FUNTIONAL_AREA_ID}'`;
    const outcomeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', outcomeQuery, input);

    if(outcomeQueryData && outcomeQueryData[0]){
        input['USER_ACTION_OUTCOME_UUID'] = outcomeQueryData[0].USER_ACTION_OUTCOME_UUID;
        
        const outcomeObj = {}
        outcomeObj.USER_ACTION_OUTCOME_UUID = outcomeQueryData[0].USER_ACTION_OUTCOME_UUID;
        outcomeObj.OUTCOME_NAME = input.title;

        USER_ACTION_OUTCOME.push(outcomeObj);
    }
} else if(input.actionName === 'Delete'){
    // Scenario where an outcome is deleted
    const outcomeQuery = `SELECT * FROM PROCESS_OUTCOME WHERE PROCESS_OUTCOME_UUID = '${input.PROCESS_OUTCOME_UUID}' AND FUNCTIONAL_AREA_UUID = '${input.APP_LOGGED_IN_FUNTIONAL_AREA_ID}'`;
    const outcomeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', outcomeQuery, input);

    const allOutcomesQuery = `SELECT * FROM PROCESS_OUTCOME WHERE USER_ACTION_OUTCOME_UUID = '${outcomeQueryData[0].USER_ACTION_OUTCOME_UUID}' AND FUNCTIONAL_AREA_UUID = '${input.APP_LOGGED_IN_FUNTIONAL_AREA_ID}'`;
    const allOutcomesQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', allOutcomesQuery, input);

    if(allOutcomesQueryData.length === 1){
        USER_ACTION_OUTCOME.push({
            USER_ACTION_OUTCOME_UUID: outcomeQueryData[0].USER_ACTION_OUTCOME_UUID,
            compositeEntityAction: "Delete"
        });
    }
}

input['AppEngChildEntity:USER_ACTION_OUTCOME'] = USER_ACTION_OUTCOME;
