console.log("inside USER_ACTION_OUTCOME composite entity :::::::::::::::: ", input);

const OUTCOME = [];
if(input.isNewOutcomeAdded && input.mode !== 'Edit'){

    // Scenario where new outcome is added
    const OUTCOME_UUID = uuid();
    const outcomeObj = {}
    outcomeObj.OUTCOME_UUID = OUTCOME_UUID;
    outcomeObj.OUTCOME_NAME = input.title;
    outcomeObj.FUNCTIONAL_AREA_UUID = input.APP_LOGGED_IN_FUNTIONAL_AREA_ID;
    outcomeObj.AE_INSERT_ID = input.APP_LOGGED_IN_USER_ID;
    
    OUTCOME.push(outcomeObj);
    input['OUTCOME_UUID'] = OUTCOME_UUID;
} else if (input.mode === 'Edit') {
    // Scenario where outcome name has changed
    const outcomeQuery = `SELECT * FROM USER_ACTION_OUTCOME WHERE USER_ACTION_OUTCOME_UUID = '${input.USER_ACTION_OUTCOME_UUID}' AND FUNCTIONAL_AREA_UUID = '${input.APP_LOGGED_IN_FUNTIONAL_AREA_ID}'`;
    const outcomeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', outcomeQuery, input);

    if(outcomeQueryData && outcomeQueryData[0]){
        input['OUTCOME_UUID'] = outcomeQueryData[0].OUTCOME_UUID;
        
        const outcomeObj = {}
        outcomeObj.OUTCOME_UUID = outcomeQueryData[0].OUTCOME_UUID;
        outcomeObj.OUTCOME_NAME = input.title;

        OUTCOME.push(outcomeObj);
    }
} else if(input.actionName === 'Delete'){
    // Scenario where an outcome is deleted
    const outcomeQuery = `SELECT * FROM USER_ACTION_OUTCOME WHERE USER_ACTION_OUTCOME_UUID = '${input.USER_ACTION_OUTCOME_UUID}' AND FUNCTIONAL_AREA_UUID = '${input.APP_LOGGED_IN_FUNTIONAL_AREA_ID}'`;
    const outcomeQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', outcomeQuery, input);

    const allOutcomesQuery = `SELECT * FROM USER_ACTION_OUTCOME WHERE OUTCOME_UUID = '${outcomeQueryData[0].OUTCOME_UUID}' AND FUNCTIONAL_AREA_UUID = '${input.APP_LOGGED_IN_FUNTIONAL_AREA_ID}'`;
    const allOutcomesQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', allOutcomesQuery, input);

    if(allOutcomesQueryData.length === 1){
        OUTCOME.push({
            OUTCOME_UUID: outcomeQueryData[0].OUTCOME_UUID,
            compositeEntityAction: "Delete"
        });
    }
}

input['AppEngChildEntity:OUTCOME'] = OUTCOME;
