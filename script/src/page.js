const { v4: uuidv4 } = require('uuid');
const MY_ID = '622e9c89-cb3a-4012-9e95-67095f3bb694';

const updateSequence = async (mainKnex, tableName, newId) => {
    await mainKnex('SEQUENCE').where({ TABLE_NAME: tableName }).update({ MAX_TABLE_SEQ_ID: newId });
}

const getOrInitializeSequence = async (mainKnex, tableName) => {
    const result = await mainKnex('SEQUENCE').where({ TABLE_NAME: tableName });
    
    if (result.length > 0) {
        console.log('Got sequence for table: ✅ ', tableName);
        return Number(result[0]['MAX_TABLE_SEQ_ID']);
    } else {
        console.log('Initializing sequence for table: ✨ ', tableName);
        await mainKnex('SEQUENCE').insert({
            TABLE_NAME: tableName,
            MAX_TABLE_SEQ_ID: 0,
            AE_INSERT_ID: MY_ID,
            AE_INSERT_TS: new Date()
        });
        return 0;
    }
};


const getData = async (req, res, mainKnex, auditKnex) => {
    try {
        const functionalAreas = await mainKnex.select('*').from('FUNCTIONAL_AREA').orderBy('FUNCTIONAL_AREA_ID', 'desc');
                        
        let TEST_SUITE_ID = await getOrInitializeSequence(mainKnex, 'TEST_SUITE');
        let TEST_SET_ID = await getOrInitializeSequence(mainKnex, 'TEST_SET');
        let TEST_SUITE_TEST_SET_ID = await getOrInitializeSequence(mainKnex, 'TEST_SUITE_TEST_SET');
        let TEST_CASE_ID = await getOrInitializeSequence(mainKnex, 'TEST_CASE');
        let TEST_CASE_DESCRIPTION_ID = await getOrInitializeSequence(mainKnex, 'TEST_CASE_DESCRIPTION');
        let TEST_CASE_STEP_ID = await getOrInitializeSequence(mainKnex, 'TEST_CASE_STEP');
        let TEST_CASE_STEP_ATTRIBUTE_VALUE_ID = await getOrInitializeSequence(mainKnex, 'TEST_CASE_STEP_ATTRIBUTE_VALUE');
        
        for(let funcArea of functionalAreas){

            let PAGE_NAVIGATION_TEST_SUITE_UUID = uuidv4();
            const FUNCTIONAL_AREA_UUID = funcArea['FUNCTIONAL_AREA_UUID'];


            const FUNC_TRANSACTION_ID = uuidv4();
            console.log('Functional Area ID: ', funcArea['FUNCTIONAL_AREA_NAME']);

            const pageNavigationTestSuite = await mainKnex.select('*').from('TEST_SUITE').where({TEST_SUITE_TYPE: 'Page Navigation', FUNCTIONAL_AREA_UUID: FUNCTIONAL_AREA_UUID});

            if(pageNavigationTestSuite.length){
                console.log('Page Navigation Test Suite already exists for Functional Area: ', funcArea['FUNCTIONAL_AREA_NAME'], PAGE_NAVIGATION_TEST_SUITE_UUID);
                PAGE_NAVIGATION_TEST_SUITE_UUID = pageNavigationTestSuite[0]['TEST_SUITE_UUID'];
            } else {
                console.log('creating Page Navigation Test Suite for Functional Area: ', funcArea['FUNCTIONAL_AREA_NAME']);
                ++TEST_SUITE_ID;
                const newTestSuite  = {
                    TEST_SUITE_UUID: PAGE_NAVIGATION_TEST_SUITE_UUID,
                    TEST_SUITE_ID: TEST_SUITE_ID,
                    TEST_SUITE_NAME: 'Page Navigation Test Suite',
                    TEST_SUITE_TYPE: 'Page Navigation',
                    TEST_SUITE_CREATION_TYPE: 'System',
                    FUNCTIONAL_AREA_UUID: FUNCTIONAL_AREA_UUID,
                    AE_INSERT_ID: MY_ID,
                    AE_INSERT_TS: new Date(),
                    AE_TRANSACTION_ID: FUNC_TRANSACTION_ID
                }

                await mainKnex('TEST_SUITE').insert(newTestSuite);

                let newTestSuiteJSON = Object.keys(newTestSuite).reduce((acc, key) => {
                    acc[key] = {
                        oldValue: null,
                        newValue: newTestSuite[key]
                    };
                    return acc;
                }, {});

                newTestSuite["AE_OLD_NEW_COMPARISION_DETAILS"] = JSON.stringify(newTestSuiteJSON);
                newTestSuite["AE_AUDIT_UUID"] = uuidv4();
                newTestSuite["AE_OPERATION_TYPE"] = "Insert";
                newTestSuite["AE_TIMESTAMP"] = new Date();
                newTestSuite["OPERATION_PERFORMED_BY"] = MY_ID;
                let result = JSON.parse(JSON.stringify(newTestSuite));

                await auditKnex('TEST_SUITE_AUDIT').insert(result);


                // USer Action test suite

                ++TEST_SUITE_ID;
                const uaTestSuite  = {
                    TEST_SUITE_UUID: uuidv4(),
                    TEST_SUITE_ID: TEST_SUITE_ID,
                    TEST_SUITE_NAME: 'User Action Test Suite',
                    TEST_SUITE_TYPE: 'User Action',
                    TEST_SUITE_CREATION_TYPE: 'System',
                    FUNCTIONAL_AREA_UUID: FUNCTIONAL_AREA_UUID,
                    AE_INSERT_ID: MY_ID,
                    AE_INSERT_TS: new Date(),
                    AE_TRANSACTION_ID: FUNC_TRANSACTION_ID
                }

                await mainKnex('TEST_SUITE').insert(uaTestSuite);

                let uaTestSuiteJSON = Object.keys(uaTestSuite).reduce((acc, key) => {
                    acc[key] = {
                        oldValue: null,
                        newValue: uaTestSuite[key]
                    };
                    return acc;
                }, {});

                uaTestSuite["AE_OLD_NEW_COMPARISION_DETAILS"] = JSON.stringify(uaTestSuiteJSON);
                uaTestSuite["AE_AUDIT_UUID"] = uuidv4();
                uaTestSuite["AE_OPERATION_TYPE"] = "Insert";
                uaTestSuite["AE_TIMESTAMP"] = new Date();
                uaTestSuite["OPERATION_PERFORMED_BY"] = MY_ID;
                let uaTestSuiteResult = JSON.parse(JSON.stringify(uaTestSuite));

                await auditKnex('TEST_SUITE_AUDIT').insert(uaTestSuiteResult);

            }


            const pages = await mainKnex.select('*').from('PAGE').where({FUNCTIONAL_AREA_UUID: FUNCTIONAL_AREA_UUID}).orderBy('PAGE_ID', 'asc');

            for(const page of pages){

                const pageNavigationTestSet = await mainKnex.select('*').from('TEST_SET').where({TEST_SET_TYPE: 'Page Navigation', PAGE_UUID: page['PAGE_UUID']});
                if(pageNavigationTestSet.length) {
                    console.log('Page Navigation Test Set already exists for Page: ', page['PAGE_NAME']);
                    continue;
                }

                const TEST_SET_UUID = uuidv4();
                const PAGE_TRANSACTION_ID = uuidv4();
                console.log('Page ID: ', page['PAGE_NAME']);

                ++TEST_SET_ID;
                const setObj = {
                    TEST_SET_UUID: TEST_SET_UUID,
                    TEST_SET_ID: TEST_SET_ID,
                    PAGE_UUID: page['PAGE_UUID'],
                    TEST_SET_NAME: page['PAGE_NAME'],
                    TEST_SET_TYPE: 'Page Navigation',
                    AE_INSERT_ID: MY_ID,
                    AE_INSERT_TS: new Date(),
                    FUNCTIONAL_AREA_UUID: FUNCTIONAL_AREA_UUID,
                    AE_TRANSACTION_ID: PAGE_TRANSACTION_ID,
                }

                await mainKnex('TEST_SET').insert(setObj);

                let testSetJSON = Object.keys(setObj).reduce((acc, key) => {
                    acc[key] = {
                        oldValue: null,
                        newValue: setObj[key]
                    };
                    return acc;
                }, {});

                setObj["AE_OLD_NEW_COMPARISION_DETAILS"] = JSON.stringify(testSetJSON);
                setObj["AE_AUDIT_UUID"] = uuidv4();
                setObj["AE_OPERATION_TYPE"] = "Insert";
                setObj["AE_TIMESTAMP"] = new Date();
                setObj["OPERATION_PERFORMED_BY"] = MY_ID;
                let result = JSON.parse(JSON.stringify(setObj));

                await auditKnex('TEST_SET_AUDIT').insert(result);


                // mapping to test suite
                const TEST_SUITE_TEST_SET_UUID = uuidv4();
                const TEST_SUITE_TEST_SET_TRANSACTION_UUID = uuidv4();
                
                ++TEST_SUITE_TEST_SET_ID;
                const testSuiteTestSetObj = {
                    TEST_SUITE_TEST_SET_UUID: TEST_SUITE_TEST_SET_UUID,
                    TEST_SUITE_TEST_SET_ID: TEST_SUITE_TEST_SET_ID,
                    TEST_SUITE_UUID: PAGE_NAVIGATION_TEST_SUITE_UUID,
                    TEST_SET_UUID: TEST_SET_UUID,
                    AE_INSERT_ID: MY_ID,
                    AE_INSERT_TS: new Date(),
                    FUNCTIONAL_AREA_UUID: FUNCTIONAL_AREA_UUID,
                    AE_TRANSACTION_ID: TEST_SUITE_TEST_SET_TRANSACTION_UUID
                }

                await mainKnex('TEST_SUITE_TEST_SET').insert(testSuiteTestSetObj);

                let testSuiteTestSetJSON = Object.keys(testSuiteTestSetObj).reduce((acc, key) => {
                    acc[key] = {
                        oldValue: null,
                        newValue: testSuiteTestSetObj[key]
                    };
                    return acc;
                }
                , {});

                testSuiteTestSetObj["AE_OLD_NEW_COMPARISION_DETAILS"] = JSON.stringify(testSuiteTestSetJSON);
                testSuiteTestSetObj["AE_AUDIT_UUID"] = uuidv4();
                testSuiteTestSetObj["AE_OPERATION_TYPE"] = "Insert";
                testSuiteTestSetObj["AE_TIMESTAMP"] = new Date();
                testSuiteTestSetObj["OPERATION_PERFORMED_BY"] = MY_ID;

                let mappresult = JSON.parse(JSON.stringify(testSuiteTestSetObj));
                await auditKnex('TEST_SUITE_TEST_SET_AUDIT').insert(mappresult);

                //  views
                const views = await mainKnex.select('*').from('PAGE_VIEW').where({PAGE_UUID: page['PAGE_UUID']}).orderBy('VIEW_ID', 'asc');

                for(const view of views){
                    const TEST_CASE_UUID = uuidv4();
                    const TEST_CASE_TRANSACTION_ID = uuidv4();
                    const TEST_CASE_DESCRIPTION_UUID = uuidv4();

                    ++TEST_CASE_ID;
                    const testCaseObj = {
                        TEST_CASE_UUID: TEST_CASE_UUID,
                        TEST_CASE_ID: TEST_CASE_ID,
                        TEST_CASE_NAME: view['VIEW_NAME'],
                        TEST_SET_UUID: TEST_SET_UUID,
                        AE_INSERT_ID: MY_ID,
                        AE_INSERT_TS: new Date(),
                        FUNCTIONAL_AREA_UUID: FUNCTIONAL_AREA_UUID,
                        AE_TRANSACTION_ID: TEST_CASE_TRANSACTION_ID,
                        TEST_CASE_SEQ_ID: 1,
                        TEST_CASE_STATUS: 'COMMITED',
                        TEST_CASE_EXECUTON_TYPE : 'Manual',
                        ASSOCIATED_VIEW_UUID : view['VIEW_UUID'],
                        TEST_CASE_DESCRIPTION_UUID : TEST_CASE_DESCRIPTION_UUID
                    }

                    await mainKnex('TEST_CASE').insert(testCaseObj);

                    let testCaseJSON = Object.keys(testCaseObj).reduce((acc, key) => {
                        acc[key] = {
                            oldValue: null,
                            newValue: testCaseObj[key]
                        };
                        return acc;
                    }, {});

                    testCaseObj["AE_OLD_NEW_COMPARISION_DETAILS"] = JSON.stringify(testCaseJSON);
                    testCaseObj["AE_AUDIT_UUID"] = uuidv4();
                    testCaseObj["AE_OPERATION_TYPE"] = "Insert";
                    testCaseObj["AE_TIMESTAMP"] = new Date();
                    testCaseObj["OPERATION_PERFORMED_BY"] = MY_ID;
                    let result = JSON.parse(JSON.stringify(testCaseObj));

                    await auditKnex('TEST_CASE_AUDIT').insert(result);


                    // Description
                    ++TEST_CASE_DESCRIPTION_ID;
                    const testCaseDescriptionObj = {
                        TEST_CASE_DESCRIPTION_UUID: TEST_CASE_DESCRIPTION_UUID,
                        TEST_CASE_DESCRIPTION_ID: TEST_CASE_DESCRIPTION_ID,
                        TEST_CASE_UUID: TEST_CASE_UUID,
                        AE_INSERT_ID: MY_ID,
                        AE_INSERT_TS: new Date(),
                        FUNCTIONAL_AREA_UUID: FUNCTIONAL_AREA_UUID,
                        AE_TRANSACTION_ID: TEST_CASE_TRANSACTION_ID
                    }

                    await mainKnex('TEST_CASE_DESCRIPTION').insert(testCaseDescriptionObj);

                    let testCaseDescriptionJSON = Object.keys(testCaseDescriptionObj).reduce((acc, key) => {
                        acc[key] = {
                            oldValue: null,
                            newValue: testCaseDescriptionObj[key]
                        };
                        return acc;
                    }, {});

                    testCaseDescriptionObj["AE_OLD_NEW_COMPARISION_DETAILS"] = JSON.stringify(testCaseDescriptionJSON);
                    testCaseDescriptionObj["AE_AUDIT_UUID"] = uuidv4();
                    testCaseDescriptionObj["AE_OPERATION_TYPE"] = "Insert";
                    testCaseDescriptionObj["AE_TIMESTAMP"] = new Date();
                    testCaseDescriptionObj["OPERATION_PERFORMED_BY"] = MY_ID;
                    let descResult = JSON.parse(JSON.stringify(testCaseDescriptionObj));

                    await auditKnex('TEST_CASE_DESCRIPTION_AUDIT').insert(descResult);


                    // test_case_Step
                    const TEST_CASE_STEP_UUID = uuidv4();
                    const TEST_CASE_STEP_TRANSACTION_ID = uuidv4();

                    ++TEST_CASE_STEP_ID;
                    const testCaseStepObj ={
                        TEST_CASE_STEP_UUID: TEST_CASE_STEP_UUID,
                        TEST_CASE_STEP_ID: TEST_CASE_STEP_ID,
                        TEST_CASE_UUID: TEST_CASE_UUID,
                        TEST_SET_UUID: TEST_SET_UUID,
                        TEST_CASE_STEP_NAME: 'When User is on '+ page['PAGE_NAME']+' Page',
                        PAGE_UUID: page['PAGE_UUID'],
                        VIEW_UUID: view['VIEW_UUID'],
                        STEP_DEFINITION_TEMPLATE_VERBIAGE_UUID: '20b169ba-34aa-46d1-888d-9324b9b77bc8',
                        CURRENT_PAGE_CONTEXT: page['PAGE_UUID'],
                        TEST_CASE_STEP_SEQ_ID: '1',
                        TEST_CASE_STEP_TYPE: 'Given',
                        IS_PURE_NAVIGATION_STEP: 'Yes',
                        IS_UI_ELEMENT_GROUP_STEP: 'No',
                        IS_FUNCTION_STEP: 'No',
                        AE_INSERT_ID: MY_ID,
                        AE_INSERT_TS: new Date(),
                        AE_TRANSACTION_ID: TEST_CASE_STEP_TRANSACTION_ID,
                        FUNCTIONAL_AREA_UUID: FUNCTIONAL_AREA_UUID,
                    };

                    await mainKnex('TEST_CASE_STEP').insert(testCaseStepObj);

                    let testCaseStepJSON = Object.keys(testCaseStepObj).reduce((acc, key) => {
                        acc[key] = {
                            oldValue: null,
                            newValue: testCaseStepObj[key]
                        };
                        return acc;
                    }
                    , {});

                    testCaseStepObj["AE_OLD_NEW_COMPARISION_DETAILS"] = JSON.stringify(testCaseStepJSON);
                    testCaseStepObj["AE_AUDIT_UUID"] = uuidv4();
                    testCaseStepObj["AE_OPERATION_TYPE"] = "Insert";
                    testCaseStepObj["AE_TIMESTAMP"] = new Date();
                    testCaseStepObj["OPERATION_PERFORMED_BY"] = MY_ID;

                    let stepResult = JSON.parse(JSON.stringify(testCaseStepObj));

                    await auditKnex('TEST_CASE_STEP_AUDIT').insert(stepResult);


                    // attribute
                    ++TEST_CASE_STEP_ATTRIBUTE_VALUE_ID;
                    const testCaseStepAttributeObj ={
                        TEST_CASE_STEP_ATTRIBUTE_VALUE_UUID: uuidv4(),
                        TEST_CASE_STEP_ATTRIBUTE_VALUE_ID: TEST_CASE_STEP_ATTRIBUTE_VALUE_ID,
                        STEP_DEFINITION_ATTRIBUTE_UUID: '11cf20fb-2cdf-4d03-a0b2-aad3644056af',
                        TEST_CASE_STEP_ATTRIBUTE_DATA: page['PAGE_UUID'],
                        TEST_SET_UUID: TEST_SET_UUID,
                        TEST_CASE_UUID: TEST_CASE_UUID,
                        TEST_CASE_STEP_UUID: TEST_CASE_STEP_UUID,
                        AE_INSERT_ID: MY_ID,
                        AE_INSERT_TS: new Date(),
                        FUNCTIONAL_AREA_UUID: FUNCTIONAL_AREA_UUID,
                        AE_TRANSACTION_ID: TEST_CASE_STEP_TRANSACTION_ID
                    };
                    
                    await mainKnex('TEST_CASE_STEP_ATTRIBUTE_VALUE').insert(testCaseStepAttributeObj);

                    let testCaseStepAttributeJSON = Object.keys(testCaseStepAttributeObj).reduce((acc, key) => {
                        acc[key] = {
                            oldValue: null,
                            newValue: testCaseStepAttributeObj[key]
                        };
                        return acc;
                    }
                    , {});

                    testCaseStepAttributeObj["AE_OLD_NEW_COMPARISION_DETAILS"] = JSON.stringify(testCaseStepAttributeJSON);

                    testCaseStepAttributeObj["AE_AUDIT_UUID"] = uuidv4();
                    testCaseStepAttributeObj["AE_OPERATION_TYPE"] = "Insert";
                    testCaseStepAttributeObj["AE_TIMESTAMP"] = new Date();
                    testCaseStepAttributeObj["OPERATION_PERFORMED_BY"] = MY_ID;

                    let attrResult = JSON.parse(JSON.stringify(testCaseStepAttributeObj));

                    await auditKnex('TEST_CASE_STEP_ATTRIBUTE_VALUE_AUDIT').insert(attrResult);
                    
                }

     
            }
            
            // console.log('TEST_CASE_STEP_ID: ', functionStep['TEST_CASE_STEP_ID']);
        }

        await updateSequence(mainKnex, 'TEST_SUITE', TEST_SUITE_ID);
        await updateSequence(mainKnex, 'TEST_SET', TEST_SET_ID);
        await updateSequence(mainKnex, 'TEST_SUITE_TEST_SET', TEST_SUITE_TEST_SET_ID);
        await updateSequence(mainKnex, 'TEST_CASE', TEST_CASE_ID);
        await updateSequence(mainKnex, 'TEST_CASE_DESCRIPTION', TEST_CASE_DESCRIPTION_ID);
        await updateSequence(mainKnex, 'TEST_CASE_STEP', TEST_CASE_STEP_ID);
        await updateSequence(mainKnex, 'TEST_CASE_STEP_ATTRIBUTE_VALUE', TEST_CASE_STEP_ATTRIBUTE_VALUE_ID);

        console.log('Script executed successfully ✅✅✅');

        return res.json({ success: true, message: 'Script executed successfully' });
    }
    catch (error) {
        console.log('error :::::::::::::::::', error)
        return error;
    }
}
module.exports = getData;