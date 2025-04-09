const { v4: uuidv4 } = require('uuid');
const getData = async (req, res, mainKnex, auditKnex) => {
    try {
        const functionStepResponse = await mainKnex.select('*').where({ IS_PURE_NAVIGATION_STEP: 'Yes'}).from('TEST_CASE_FUNCTION_STEP').orderBy('TEST_CASE_FUNCTION_STEP_ID', 'asc');
        const maxNavigationStepID = await mainKnex('TEST_CASE_VIEW_NAVIGATION_STEP').max('TEST_CASE_VIEW_NAVIGATION_STEP_ID as max_id');
        let navID = (Number(maxNavigationStepID[0]['max_id']) || 0) + 1;
        const maxNavigationStepAttributeID = await mainKnex('TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE').max('TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_ID as max_id');
        let navAttributeID = (Number(maxNavigationStepAttributeID[0]['max_id']) || 0) + 1;
		for (let functionStep of functionStepResponse) {
			if(functionStep['VIEW_UUID'] && functionStep['IS_PURE_NAVIGATION_STEP'] == 'Yes')
			{
                let transactionID =  uuidv4();
				const ViewNavigationResponse = await mainKnex.select('*').where({ VIEW_UUID: functionStep['VIEW_UUID'] }).from('VIEW_NAVIGATION_STEP');
				if(ViewNavigationResponse.length){
                    for( let navigationStep of ViewNavigationResponse){
                        let functionViewNavigationUUID = uuidv4()
                        let ownerID = navigationStep['AE_UPDATE_ID'] ? navigationStep['AE_UPDATE_ID'] : navigationStep['AE_INSERT_ID'];
                        let ViewNavigationStep = {
                            TEST_CASE_VIEW_NAVIGATION_STEP_UUID : functionViewNavigationUUID,
                            TEST_CASE_VIEW_NAVIGATION_STEP_ID : navID ,
                            TEST_CASE_STEP_UUID : functionStep['TEST_CASE_STEP_UUID'],
                            FUNCTIONAL_AREA_UUID : navigationStep['FUNCTIONAL_AREA_UUID'],
                            VIEW_UUID : functionStep['VIEW_UUID'],
                            VIEW_NAVIGATION_STEP_UUID : navigationStep['VIEW_NAVIGATION_STEP_UUID'],
                            TEST_CASE_VIEW_NAVIGATION_STEP_NAME : navigationStep['VIEW_NAVIGATION_STEP_NAME'],
                            STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID : navigationStep['STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID'],
                            TEST_CASE_VIEW_NAVIGATION_STEP_TYPE : navigationStep['VIEW_NAVIGATION_STEP_TYPE'],
                            TEST_CASE_VIEW_NAVIGATION_STEP_SEQ_ID : navigationStep['VIEW_NAVIGATION_STEP_SEQ_ID'],
                            CURRENT_PAGE_CONTEXT : navigationStep['CURRENT_PAGE_CONTEXT'],
                            FUNCTION_STEP_UUID : functionStep['FUNCTION_STEP_UUID'],
                            FUNCTION_UUID : functionStep['FUNCTION_UUID'],
                            NEXT_PAGE_CONTEXT : navigationStep['NEXT_PAGE_CONTEXT'],
                            AE_INSERT_ID : ownerID,
                            AE_TRANSACTION_ID : transactionID,
                            AE_INSERT_TS : new Date(),
                        }
                        await mainKnex('TEST_CASE_VIEW_NAVIGATION_STEP').insert(ViewNavigationStep);
                        // console.log('Navigation ID: ', navID);
                        let formattedViewNavigationStep = Object.keys(ViewNavigationStep).reduce((acc, key) => {
                            acc[key] = {
                                oldValue: null,
                                newValue: ViewNavigationStep[key]
                            };
                            return acc;
                        }, {});
                        ViewNavigationStep["AE_OLD_NEW_COMPARISION_DETAILS"] = JSON.stringify(formattedViewNavigationStep);
                        ViewNavigationStep["AE_AUDIT_UUID"] = uuidv4();
                        ViewNavigationStep["AE_OPERATION_TYPE"] = "Insert";
                        ViewNavigationStep["AE_TIMESTAMP"] = new Date();
                        ViewNavigationStep["OPERATION_PERFORMED_BY"] = "8af8e21f-9d20-4a77-82cb-bb95072fd7f1";
                        ViewNavigationStep["AE_UPDATE_ID"] = ownerID;
                        ViewNavigationStep["AE_UPDATE_TS"] = new Date();
                        ViewNavigationStep["AE_TRANSACTION_ID"] = transactionID;
                        let result = JSON.parse(JSON.stringify(ViewNavigationStep));
                        await auditKnex('TEST_CASE_VIEW_NAVIGATION_STEP_AUDIT').insert(result);
                        navID++;

                        const navigationAttributeResponse = await mainKnex.select('*').where({ VIEW_NAVIGATION_STEP_UUID: navigationStep['VIEW_NAVIGATION_STEP_UUID']}).from('VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE');
                        for( let navigationStepAttribute of navigationAttributeResponse){
                            let ViewNavigationStepAttribute = {
                                TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_UUID:  uuidv4(),
                                TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_ID: navAttributeID,
                                STEP_DEFINITION_ATTRIBUTE_UUID : navigationStepAttribute['STEP_DEFINITION_ATTRIBUTE_UUID'],
                                TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA : navigationStepAttribute['VIEW_NAVIGATION_STEP_ATTRIBUTE_DATA'],
                                TEST_CASE_VIEW_NAVIGATION_STEP_UUID : functionViewNavigationUUID,
                                VIEW_UUID : navigationStepAttribute['VIEW_UUID'],
                                PRE_DEFINED_VALUES_UUID :  navigationStepAttribute['PRE_DEFINED_VALUES_UUID'],
                                FUNCTIONAL_AREA_UUID : navigationStepAttribute['FUNCTIONAL_AREA_UUID'],
                                AE_INSERT_ID : ownerID,
                                AE_INSERT_TS : new Date(),
                                AE_TRANSACTION_ID :transactionID
                            }
                            await mainKnex('TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE').insert(ViewNavigationStepAttribute);
                            // console.log('Navigation Attribute ID: ', navAttributeID);

                            let formattedViewNavigationStepAttribute = Object.keys(ViewNavigationStepAttribute).reduce((acc, key) => {
                                acc[key] = {
                                    oldValue: null,
                                    newValue: ViewNavigationStep[key]
                                };
                                return acc;
                            }, {});
                            ViewNavigationStepAttribute["AE_OLD_NEW_COMPARISION_DETAILS"] = JSON.stringify(formattedViewNavigationStepAttribute);
                            ViewNavigationStepAttribute["AE_AUDIT_UUID"] = uuidv4();
                            ViewNavigationStepAttribute["AE_OPERATION_TYPE"] = "Insert";
                            ViewNavigationStepAttribute["AE_TIMESTAMP"] = new Date();
                            ViewNavigationStepAttribute["OPERATION_PERFORMED_BY"] = "8af8e21f-9d20-4a77-82cb-bb95072fd7f1";
                            ViewNavigationStepAttribute["AE_UPDATE_ID"] = ownerID;
                            ViewNavigationStepAttribute["AE_UPDATE_TS"] = new Date();
                            ViewNavigationStepAttribute["AE_TRANSACTION_ID"] = transactionID;
                            let result1 = JSON.parse(JSON.stringify(ViewNavigationStepAttribute));
                            await auditKnex('TEST_CASE_VIEW_NAVIGATION_STEP_ATTRIBUTE_VALUE_AUDIT').insert(result1);
                            navAttributeID++;
                        }
                        
                    }
				} 
			}
            // console.log('TEST_CASE_STEP_ID: ', functionStep['TEST_CASE_STEP_ID']);
        }
        return res.json({ success: true, message: 'Script executed successfully' });
    }
    catch (error) {
        console.log('error :::::::::::::::::', error)
        return error;
    }
}
module.exports = getData;