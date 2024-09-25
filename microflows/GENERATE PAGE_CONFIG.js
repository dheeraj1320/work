AppengProcessConfig = global.get('AppengProcessConfig');
const serviceOrchestrator = AppengProcessConfig.serviceOrchestrator;
let input = msg.payload.apiRequestBody.baseEntity.records[0];
let pageDataQuery = `SELECT * FROM PAGE WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY PAGE_ID desc`;
let pageDataQueryRecord = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', pageDataQuery, input);
let pageDatas = await pageDataQueryRecord;
let pageViewDataQuery = `SELECT * FROM PAGE_VIEW WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY VIEW_ID asc`;
let pageViewDataQueryRecord = await serviceOrchestrator.selectRecordsUsingQuery(
  'PRIMARYSPRINGFM',
  pageViewDataQuery,
  input
);
let pageViewData = await pageViewDataQueryRecord;
let viewNavigationStepQuery = `SELECT * FROM VIEW_NAVIGATION_STEP WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY VIEW_NAVIGATION_STEP_ID desc`;
let viewNavigationStepQueryRecord = await serviceOrchestrator.selectRecordsUsingQuery(
  'PRIMARYSPRINGFM',
  viewNavigationStepQuery,
  input
);
let viewNavigationStep = await viewNavigationStepQueryRecord;
let viewUserActionQuery = `SELECT * FROM VIEW_USER_ACTION WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY USER_ACTION_ID asc`;
let viewUserActionQueryRecord = await serviceOrchestrator.selectRecordsUsingQuery(
  'PRIMARYSPRINGFM',
  viewUserActionQuery,
  input
);
let viewUserAction = await viewUserActionQueryRecord;
let viewTreeDataQuery = `SELECT * FROM VIEW_TREE_DATA WHERE FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID ORDER BY VIEW_TREE_DATA_ID desc`;
let viewTreeDataQueryRecord = await serviceOrchestrator.selectRecordsUsingQuery(
  'PRIMARYSPRINGFM',
  viewTreeDataQuery,
  input
);
let viewTreeData = await viewTreeDataQueryRecord;
let html = ``;
let jsonFormat = { PageName: '', PagelId: '', Views: [] };
for (let pageData of pageDatas) {
  if (pageData.PAGE_UUID === input.PAGE_UUID) {
    jsonFormat['PageName'] = pageData.PAGE_NAME;
    jsonFormat['PagelId'] = pageData.PAGE_DIV_ID;
    for (let viewData of pageViewData) {
      if (pageData.PAGE_UUID == viewData.PAGE_UUID) {
        let viewJsonFormat = { ViewName: '', NavigationSteps: [], Actions: [], Data: [] };
        viewJsonFormat['ViewName'] = viewData.VIEW_NAME;
        viewNavigationStep.sort((a, b) => {
          return a.NAVIGATION_STEP_ORDER - b.NAVIGATION_STEP_ORDER;
        });
        for (let viewNavigationStepData of viewNavigationStep) {
          if (
            pageData.PAGE_UUID === viewNavigationStepData.PAGE_UUID &&
            viewData.VIEW_UUID === viewNavigationStepData.VIEW_UUID
          ) {
            let navigarionObject = {};
            for (let navigarionPage of pageDatas) {
              if (navigarionPage.PAGE_UUID === viewNavigationStepData.NAVIGATION_STEP_PAGE_UUID) {
                navigarionObject['PageName'] = navigarionPage.PAGE_NAME;
                for (let navigarionView of pageViewData) {
                  if (
                    navigarionPage.PAGE_UUID === navigarionView.PAGE_UUID &&
                    navigarionView.VIEW_UUID === viewNavigationStepData.NAVIGATION_STEP_VIEW_UUID
                  ) {
                    navigarionObject['ViewName'] = navigarionView.VIEW_NAME;
                    for (let navigarionUserAction of viewUserAction) {
                      if (
                        navigarionView.PAGE_UUID === navigarionUserAction.PAGE_UUID &&
                        navigarionView.VIEW_UUID === navigarionUserAction.VIEW_UUID &&
                        viewNavigationStepData.NAVIGATION_STEP_USER_ACTION_UUID ===
                          navigarionUserAction.USER_ACTION_UUID
                      ) {
                        navigarionObject['ActionName'] = navigarionUserAction.USER_ACTION_NAME;
                      }
                    }
                  }
                }
              }
            }
            navigarionObject['ActionType'] = viewNavigationStepData.NAVIGATION_STEP_ACTION_TYPE;
            viewJsonFormat.NavigationSteps.push(navigarionObject);
          }
        }
        for (let userAction of viewUserAction) {
          if (pageData.PAGE_UUID === userAction.PAGE_UUID && viewData.VIEW_UUID == userAction.VIEW_UUID) {
            let actionObject = {};
            actionObject['ComponentIDToWaitForBeforeAction'] = userAction.COMPONENT_DIV_ID_TO_WAIT_FOR_BEFORE_ACTION
              ? userAction.COMPONENT_DIV_ID_TO_WAIT_FOR_BEFORE_ACTION
              : '';
            actionObject['ComponentName'] = userAction.USER_ACTION_NAME;
            actionObject['ComponentID'] = userAction.COMPONENT_DIV_ID ? userAction.COMPONENT_DIV_ID : '';
            actionObject['ComponentType'] = userAction.COMPONENT_TYPE ? userAction.COMPONENT_TYPE : '';
            actionObject['ComponentIDToWaitForAfterAction'] = userAction.COMPONENT_DIV_ID_TO_WAIT_FOR_AFTER_ACTION
              ? userAction.COMPONENT_DIV_ID_TO_WAIT_FOR_AFTER_ACTION
              : '';
            viewJsonFormat.Actions.push(actionObject);
          }
        }
        for (let viewTree of viewTreeData) {
          if (viewData.VIEW_UUID === viewTree.VIEW_UUID) {
            let viewTreeArray = JSON.parse(viewTree.VIEW_TREE);
            if (viewTreeArray.length > 0) {
              for (let viewTreeData of viewTreeArray) {
                let componentObject = {};
                componentObject['ComponentName'] = viewTreeData.title;
                componentObject['ComponentId'] = viewTreeData.ComponentIdValue;
                componentObject['ComponentType'] = viewTreeData.ComponentTypeValue;
                if (viewTreeData.className === 'Form') {
                  componentObject['Component'] = [];
                  if (viewTreeData.children.length > 0) {
                    for (let viewTreeChildData of viewTreeData.children) {
                      let componentChildObject = {};
                      componentChildObject['ComponentName'] = viewTreeChildData.title;
                      componentChildObject['ComponentId'] = viewTreeChildData.ComponentIdValue;
                      componentChildObject['ComponentType'] = viewTreeChildData.ComponentTypeValue;
                      if (viewTreeChildData.className === 'FormSection') {
                        componentChildObject['DataElement'] = [];
                        if (viewTreeChildData.children.length > 0) {
                          for (let viewTreeChildDataElementData of viewTreeChildData.children) {
                            let dataElementObject = {};
                            dataElementObject['DataElementName'] = viewTreeChildDataElementData.title;
                            dataElementObject['DataElementId'] = viewTreeChildDataElementData.ComponentIdValue;
                            dataElementObject['DataElementType'] = viewTreeChildDataElementData.ComponentTypeValue;
                            componentChildObject.DataElement.push(dataElementObject);
                          }
                        }
                      }
                      componentObject.Component.push(componentChildObject);
                    }
                  }
                } else if (viewTreeData.className === 'DataGrid') {
                  componentObject['DataElement'] = [];
                  if (viewTreeData.children.length > 0) {
                    for (let viewTreeChildData of viewTreeData.children) {
                      let dataElementObject = {};
                      dataElementObject['DataElementName'] = viewTreeChildData.title;
                      dataElementObject['DataElementId'] = viewTreeChildData.ComponentIdValue;
                      dataElementObject['DataElementType'] = viewTreeChildData.ComponentTypeValue;
                      componentObject.DataElement.push(dataElementObject);
                    }
                  }
                }
                viewJsonFormat.Data.push(componentObject);
              }
            }
          }
        }
        jsonFormat.Views.push(viewJsonFormat);
      }
    }
  }
}
msg.payload.entityGroupData.logicalData.appData.data[0]['PAGE_CONFIG_DETAILS'] = `<div>${JSON.stringify(
  jsonFormat
)}</div>`;
node.send(msg);
