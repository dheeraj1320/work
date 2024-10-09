if(input[0].Information_label==""){
    input[0].CHECK=input[0]["PAGE_ACCESS_RELATIVE_URL"];
  }
  
  if (input[0].PAGE_UUID && (input[0].CHECK!=input[0]["PAGE_ACCESS_RELATIVE_URL"])) {
    input[0].CHECK=input[0]["PAGE_ACCESS_RELATIVE_URL"];
    
    if (input[0]["PAGE_ACCESS_RELATIVE_URL"]) {
      input[0].CHECK=input[0]["PAGE_ACCESS_RELATIVE_URL"];
      let QuerytoFetchNavigationStep = `select VIEW_NAVIGATION_STEP_UUID from  VIEW_NAVIGATION_STEP where VIEW_UUID in (select VIEW_UUID from PAGE_VIEW where PAGE_UUID='${input[0]["PAGE_UUID"]}' AND IS_DEFAULT_VIEW = 'Yes') AND FUNCTIONAL_AREA_UUID = '${input[0]["APP_LOGGED_IN_FUNTIONAL_AREA_ID"]}'`;
      
      let QuerytoFetchNavigationStepData = await serviceOrchestrator.selectRecordsUsingQuery(
        "PRIMARYSPRINGFM",
        QuerytoFetchNavigationStep,
        input[0]
      );
      
      let QuerytoFetchNavigationStepRecords = JSON.parse(JSON.stringify(QuerytoFetchNavigationStepData));
  
      if (QuerytoFetchNavigationStepRecords.length > 0) {
        input[0].MESSAGE = "As Relative URL is being added to access the page directly, It's Default View Navigation Steps will be deleted.";
        input[0].Informational_label = "";
      } else {
        input[0].Informational_label = "";
      }
    }
    else if(!input[0]["PAGE_ACCESS_RELATIVE_URL"]){
      input[0].Informational_label = "User can add Navigation Steps to access the page";
    }
  }
  