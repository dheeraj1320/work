//console.log('View User Story Details', input);
let impactedUserStoryUUIDs = [];
let requirementUUIDs = [];
let testCaseUUIDs = [];
let cosUUIDs = [];
let testCaseStepUUIDs = [];
let userStoryVersionUUID = uuid();

let requirementArray = [];
let testCaseArray = [];
let testCaseStepArray = [];
let impactedUserStoryArray = [];
let impactedProcessArray = [];
let testCaseRequirementArray = [];
let requirementDataSetDataElementArray = [];
let userStoryVersionArray = [];
let cosArray = [];

function getFirstAndLastForFirstVersion(requirements) {
    let finalArray = [];
    const firstVersionId = requirements[0].Version;
    const filteredRequirements = requirements.filter(req => req.Version === firstVersionId);
    finalArray.push(filteredRequirements[0]);
    if (firstVersionId != null) {
        if (filteredRequirements.length > 1) {
            finalArray.push(filteredRequirements[filteredRequirements.length - 1]);
        }
    }
    return finalArray;
}

function generateRecordString(record, type) {
    let newRecordString = `<p>`;
    let reqTitle = record['RequirementTitle'];
    let reqGroup = record['RequirementGroup'];
    let reqId = record['REQUIREMENT_ID'];
    if(type === 'cos'){
        if (reqTitle) {
            newRecordString += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${reqTitle},`;
            previousTitle = reqTitle;
            if (reqGroup) {
                newRecordString += `&nbsp;RS- ${reqGroup}, `;
                previousGroup = reqGroup;
            }
            newRecordString += `&nbsp;RQ- ${reqId}`;
        } else if (reqGroup) {
            newRecordString += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RS- ${reqGroup}, `;
            previousGroup = reqGroup;
            newRecordString += `&nbsp;RQ- ${reqId}`;
        } else {
            newRecordString += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RQ- ${reqId}`;
        }
        newRecordString += `,&nbsp;COS- ${record['CONDITION_SATISFACTION_ID']}`;
    } else {
        if (reqTitle) {
            newRecordString += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${reqTitle},`;
            previousTitle = reqTitle;
            if (reqGroup) {
                newRecordString += `&nbsp;RS- ${reqGroup}, `;
                previousGroup = reqGroup;
            }
            newRecordString += `&nbsp;RQ- ${reqId}`;
        } else if (reqGroup) {
            newRecordString += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RS- ${reqGroup}, `;
            previousGroup = reqGroup;
            newRecordString += `&nbsp;RQ- ${reqId}`;
        } else {
            newRecordString += `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RQ- ${reqId}`;
        }
    }
    
    newRecordString += `</p>`;

    return newRecordString;
}

function generateRecordDetails(newRecords, versionID) {
    let newRecordString = '';
    let isReq = false;
    let isCos = false;

    newRecords.forEach((req, i) => {
        if (req['Version'] || i === 0) {
            if (req['REQUIREMENT_UUID']) {
                const version = i === 0 ? versionID : req['Version'];
                newRecordString += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
                    `${req['RequirementName'].trim()}&nbsp;&nbsp;&nbsp;&nbsp;<strong>V - ${version}</strong></p>`;
                if (!isReq) isReq = true;
            }
            if (req['CONDITION_SATISFACTION_UUID']) {
                const cosVersion = isCos ? req['Version'] : versionID;
                newRecordString += generateRecordString(record, 'cos');
                newRecordString += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;` +
                    `${req['ConditionOfSatisfaction'].trim()}&nbsp;&nbsp;&nbsp;&nbsp;<strong>V - ${cosVersion}</strong></p>`;
                if (!isCos) isCos = true;
            }
        }
    });

    return newRecordString;
}
function processRequirements(resultCos, versionID) {
    let deletedRecords =[];
    let changedRecords =[];
    let newRecords = [];
    if (!resultCos || resultCos.length === 0) return;
    const deletedRequirements = resultCos.some(item => item.IS_DELETED === "Yes" || item.AE_OPERATION_TYPE === "Delete");
    
    const uniqueUserStoryIds = [...new Set(resultCos.map(item => item.USER_STORY_ID).filter(id => id !== null))];
    const hasOldRecords = uniqueUserStoryIds.length > 1;

    const hasAcceptedRequirements = resultCos.some(item => item.USER_STORY_STATUS === "Accepted");

    const hasVersion = resultCos.some(item => item.Version !== null);
    const validRecords = resultCos.filter(item => item.Version !== null || !hasVersion);
    
    validRecords[0].Version = versionID;

    let lastRecordPerVersion = {};
    validRecords.forEach(record => {
        lastRecordPerVersion[record.Version] = record;
    });

    const latestRecords = [validRecords[0], ...Object.values(lastRecordPerVersion).sort((a, b) => b.Version - a.Version)];

    let result = [];
    let lastRequirementName = null;
    let lastVersion = 'abc';
    latestRecords.forEach(item => {
        if (item.RequirementName !== lastRequirementName && item.Version !== lastVersion) {
            result.push(item);
            lastRequirementName = item.RequirementName;
            lastVersion = item.Version;
        }
    });

    if (deletedRequirements) {
        deletedRecords.push(result[0]);
    } else if (hasOldRecords || hasAcceptedRequirements) {
        changedRecords.push(...result);
    } else {
        newRecords.push(...result);
    }

    return {deletedRecords,changedRecords,newRecords}
}

function deleteRecord(primarykey, primarykeyvalue, tablename, functionalareauuid) {
    let deleteTableData = {};
    deleteTableData[primarykey] = primarykeyvalue;
    deleteTableData["compositeEntityAction"] = "Delete";
    deleteTableData["FUNCTIONAL_AREA_UUID"] = functionalareauuid;

    if (tablename == 'REQUIREMENT') {
        requirementArray = requirementArray.filter(item => item.REQUIREMENT_UUID !== primarykeyvalue);
        requirementArray.push(deleteTableData);
    }

    else if (tablename == 'CONDITION_SATISFACTION') {
        cosArray = cosArray.filter(item => item.CONDITION_SATISFACTION_UUID !== primarykeyvalue);
        cosArray.push(deleteTableData);
    }

    else if (tablename == 'IMPACTED_USER_STORY') {
        impactedUserStoryArray = impactedUserStoryArray.filter(item => item.IMPACTED_USER_STORY_UUID !== primarykeyvalue);
        impactedUserStoryArray.push(deleteTableData);
    }

    else if (tablename == 'IMPACTED_PROCESS') {
        impactedProcessArray = impactedProcessArray.filter(item => item.IMPACTED_PROCESS_UUID !== primarykeyvalue);
        impactedProcessArray.push(deleteTableData);
    }

    else if (tablename == 'TEST_CASE_REQUIREMENT') {
        testCaseRequirementArray = testCaseRequirementArray.filter(item => item.TEST_CASE_REQUIREMENT_UUID !== primarykeyvalue);
        testCaseRequirementArray.push(deleteTableData);
    }

    else if (tablename == 'REQUIREMENT_DATA_SET_DATA_ELEMENT') {
        requirementDataSetDataElementArray = requirementDataSetDataElementArray.filter(item => item.REQUIREMENT_DATA_SET_DATA_ELEMENT_UUID !== primarykeyvalue);
        requirementDataSetDataElementArray.push(deleteTableData);
    }
}


async function separateNonNullValues(data, userStoryVersionUUID) {
    data.forEach(item => {
        if (item.IMPACTED_USER_STORY_UUID !== null && !impactedUserStoryUUIDs.includes(item.IMPACTED_USER_STORY_UUID)) {
            impactedUserStoryUUIDs.push(item.IMPACTED_USER_STORY_UUID);
        }
        if (item.REQUIREMENT_UUID !== null && !requirementUUIDs.includes(item.REQUIREMENT_UUID)) {
            requirementUUIDs.push(item.REQUIREMENT_UUID);
        }
        if (item.TEST_CASE_UUID !== null && !testCaseUUIDs.includes(item.TEST_CASE_UUID)) {
            testCaseUUIDs.push(item.TEST_CASE_UUID);
        }
        if (item.TEST_CASE_STEP_UUID !== null && !testCaseStepUUIDs.includes(item.TEST_CASE_STEP_UUID)) {
            testCaseStepUUIDs.push(item.TEST_CASE_STEP_UUID);
        }
        if (item.CONDITION_SATISFACTION_UUID !== null && !testCaseStepUUIDs.includes(item.CONDITION_SATISFACTION_UUID)) {
            cosUUIDs.push(item.CONDITION_SATISFACTION_UUID);
        }
    });

    if (impactedUserStoryUUIDs.length > 0) {
        for (let impactedUserStory of impactedUserStoryUUIDs) {
            let impactedUserStoryObject = {
                'IMPACTED_USER_STORY_UUID': impactedUserStory,
                'USER_STORY_VERSION_UUID': userStoryVersionUUID
            };
            impactedUserStoryArray.push(impactedUserStoryObject);
        }
    }
    if (requirementUUIDs.length > 0) {
        for (let requirement of requirementUUIDs) {
            let requirementObject = {
                'REQUIREMENT_UUID': requirement,
                'USER_STORY_VERSION_UUID': userStoryVersionUUID
            };
            requirementArray.push(requirementObject);
        }
    }
    if (testCaseUUIDs.length > 0) {
        for (let testCase of testCaseUUIDs) {
            let testCaseObject = {
                'TEST_CASE_UUID': testCase,
                'USER_STORY_VERSION_UUID': userStoryVersionUUID,
                'compositeEntityAction': 'copy'
            };
            testCaseArray.push(testCaseObject);
        }
    }
    if (testCaseStepUUIDs.length > 0) {
        for (let testCaseStep of testCaseStepUUIDs) {
            let testCaseStepObject = {
                'TEST_CASE_STEP_UUID': testCaseStep,
                'USER_STORY_VERSION_UUID': userStoryVersionUUID
            };
            testCaseStepArray.push(testCaseStepObject);
        }
    }
    if (cosUUIDs.length > 0) {
        for (let cos of cosUUIDs) {
            let cosObject = {
                'CONDITION_SATISFACTION_UUID': cos,
                'USER_STORY_VERSION_UUID': userStoryVersionUUID
            };
            cosArray.push(cosObject);
        }
    }

}

let versionQuery = `select * FROM USER_STORY_VERSION where USER_STORY_UUID=:USER_STORY_UUID`;
let versionQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", versionQuery, input);
let versionSeq = versionQueryData.length;

let AllQuery = `SELECT ius.IMPACTED_USER_STORY_UUID, r.REQUIREMENT_UUID, tcr.TEST_CASE_UUID, tcs.TEST_CASE_STEP_UUID, cos.CONDITION_SATISFACTION_UUID FROM USER_STORY us 
LEFT JOIN IMPACTED_USER_STORY ius ON us.USER_STORY_UUID = ius.USER_STORY_UUID LEFT JOIN REQUIREMENT r ON  ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID LEFT JOIN CONDITION_SATISFACTION cos ON ius.CONDITION_SATISFACTION_UUID = cos.CONDITION_SATISFACTION_UUID LEFT JOIN TEST_CASE_REQUIREMENT tcr ON r.REQUIREMENT_UUID = tcr.REQUIREMENT_UUID LEFT JOIN TEST_CASE_STEP tcs ON tcs.TEST_CASE_UUID = tcr.TEST_CASE_UUID WHERE us.USER_STORY_UUID=:USER_STORY_UUID;`;
let AllQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", AllQuery, input);

await separateNonNullValues(AllQueryData, userStoryVersionUUID);


if (input.compositeEntityAction == 'Publish Changes') {

    input['USER_STORY_VERSION_UUID'] = userStoryVersionUUID;

    let versionObject = {};
    versionObject['USER_STORY_VERSION_UUID'] = userStoryVersionUUID;
    versionObject['USER_STORY_VERSION_SEQ_ID'] = versionSeq + 1;
    versionObject['USER_STORY_UUID'] = input['USER_STORY_UUID'];
    versionObject['SOURCE_EVENT'] = 'Publish User Story';
    versionObject['FUNCTIONAL_AREA_UUID '] = input['FUNCTIONAL_AREA_UUID '];
    userStoryVersionArray.push(versionObject);

    input["AppEngChildEntity:USER_STORY_VERSION"] = userStoryVersionArray;

}
else if (input.compositeEntityAction == 'Start Development') {
    input['USER_STORY_STATUS'] = 'In-Progress';
    input['DEVELOPMENT_START_TS'] = new Date;
    input['USER_STORY_VERSION_UUID'] = userStoryVersionUUID;
    let versionObject = {};
    versionObject['USER_STORY_VERSION_UUID'] = userStoryVersionUUID;
    versionObject['USER_STORY_VERSION_SEQ_ID'] = versionSeq + 1;
    versionObject['USER_STORY_UUID'] = input['USER_STORY_UUID'];
    versionObject['SOURCE_EVENT'] = 'Start User Story';
    versionObject['FUNCTIONAL_AREA_UUID '] = input['FUNCTIONAL_AREA_UUID '];
    userStoryVersionArray.push(versionObject);

    input["AppEngChildEntity:INTEGRATION_TEST_CASE"] = testCaseArray;
    input['AppEngChildEntity:TEST_CASE_STEP_NEW'] = testCaseStepArray;
    input["AppEngChildEntity:USER_STORY_VERSION"] = userStoryVersionArray;

}
else if (input.compositeEntityAction == 'Accept User Story') {
    input['USER_STORY_STATUS'] = 'Accepted';
    input['DEVELOPMENT_ACCEPTED_TS'] = new Date;
    requirementArray.forEach(item => {
        delete item['USER_STORY_VERSION_UUID'];
        item['DEVELOPMENT_ACCEPTED_TS'] = input['DEVELOPMENT_ACCEPTED_TS'];
    });
    impactedUserStoryArray.forEach(item => {
        delete item['USER_STORY_VERSION_UUID'];
        item['DEVELOPMENT_ACCEPTED_TS'] = input['DEVELOPMENT_ACCEPTED_TS'];
    });
    testCaseArray.forEach(item => {
        delete item['USER_STORY_VERSION_UUID'];
        item['DEVELOPMENT_ACCEPTED_TS'] = input['DEVELOPMENT_ACCEPTED_TS'];
    });
    testCaseStepArray.forEach(item => {
        delete item['USER_STORY_VERSION_UUID'];
        item['DEVELOPMENT_ACCEPTED_TS'] = input['DEVELOPMENT_ACCEPTED_TS'];
    });

    input["AppEngChildEntity:INTEGRATION_TEST_CASE"] = testCaseArray;
    input['AppEngChildEntity:TEST_CASE_STEP_NEW'] = testCaseStepArray;


    let getIsDeletedRequirementQuery = `SELECT req.REQUIREMENT_ASSOCIATION_TYPE,req.REQUIREMENT_UUID, ius.IMPACTED_USER_STORY_UUID, cos.CONDITION_SATISFACTION_UUID,req.IS_DELETED as isReqDeleted, cos.IS_DELETED as isCosDeleted FROM IMPACTED_USER_STORY ius JOIN REQUIREMENT req ON ius.REQUIREMENT_UUID = req.REQUIREMENT_UUID LEFT JOIN CONDITION_SATISFACTION cos ON req.REQUIREMENT_UUID = cos.REQUIREMENT_UUID WHERE ius.USER_STORY_UUID=:USER_STORY_UUID AND (req.IS_DELETED = 'Yes' OR cos.IS_DELETED = 'Yes') AND ius.FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID;`;
    let getIsDeletedRequirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", getIsDeletedRequirementQuery, input);

    for (let requirement of getIsDeletedRequirementQueryData) {
        let reqId = `'` + requirement['REQUIREMENT_UUID'] + `'`;

        if (requirement && requirement['isReqDeleted'] == 'Yes') {
            // requirement delete 
            deleteRecord('REQUIREMENT_UUID', requirement['REQUIREMENT_UUID'], 'REQUIREMENT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
        }

        if (requirement && requirement['isCosDeleted'] == 'Yes') {
            // condition of satisfaction delete
            let cosQuery = `SELECT * FROM CONDITION_SATISFACTION where REQUIREMENT_UUID in(${reqId}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let cosQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", cosQuery, input);

            for (let data of cosQueryData) {
                deleteRecord('CONDITION_SATISFACTION_UUID', data['CONDITION_SATISFACTION_UUID'], 'CONDITION_SATISFACTION', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
            }
        }

        if (requirement && requirement['isReqDeleted'] != 'Yes' && requirement['isCosDeleted'] == 'Yes') {
            let assocType = requirement['REQUIREMENT_ASSOCIATION_TYPE'] == 'REQUIREMENT_TITLE' ? 'REQUIREMENT' : 'USER_ACTION_REQUIREMENT';
            let impactedUserStoryObject = {
                'IMPACTED_USER_STORY_UUID': requirement['IMPACTED_USER_STORY_UUID'],
                'CONDITION_SATISFACTION_UUID': null,
                'compositeEntityAction': 'Update',
                'ASSOCIATION_TYPE': assocType
            };
            impactedUserStoryArray.push(impactedUserStoryObject);
        } else if (requirement && requirement['isReqDeleted'] == 'Yes') {
            // impacted user story delete 
            deleteRecord('IMPACTED_USER_STORY_UUID', requirement['IMPACTED_USER_STORY_UUID'], 'IMPACTED_USER_STORY', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
        }

        // impacted process delete
        let impactedProcessQuery = `SELECT * FROM IMPACTED_PROCESS where REQUIREMENT_UUID in(${reqId}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        let impactedProcessQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", impactedProcessQuery, input);

        for (let data of impactedProcessQueryData) {
            if (requirement && requirement['isReqDeleted'] != 'Yes' && requirement['isCosDeleted'] == 'Yes') {
                let assocType = requirement['REQUIREMENT_ASSOCIATION_TYPE'] == 'REQUIREMENT_TITLE' ? 'REQUIREMENT' : 'USER_ACTION_REQUIREMENT';
                let impactedProcessObject = {
                    'IMPACTED_PROCESS_UUID': data['IMPACTED_PROCESS_UUID'],
                    'CONDITION_SATISFACTION_UUID': null,
                    'compositeEntityAction': 'Update',
                    'ASSOCIATION_TYPE': assocType
                };
                impactedProcessArray.push(impactedProcessObject);
            } else if (requirement && requirement['isReqDeleted'] == 'Yes') {
                deleteRecord('IMPACTED_PROCESS_UUID', data['IMPACTED_PROCESS_UUID'], 'IMPACTED_PROCESS', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
            }
        }

        // // test case requirement delete
        // let testCaseRequirementQuery = `SELECT * FROM TEST_CASE_REQUIREMENT where REQUIREMENT_UUID in(${reqId}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
        // let testCaseRequirementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", testCaseRequirementQuery, input);

        // for (let data of testCaseRequirementQueryData) {
        //     deleteRecord('TEST_CASE_REQUIREMENT_UUID', data['TEST_CASE_REQUIREMENT_UUID'], 'TEST_CASE_REQUIREMENT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
        // }

        if (requirement && requirement['isReqDeleted'] == 'Yes') {
            // requirement data set data element delete
            let requirementDataSetDataElementQuery = `SELECT * FROM REQUIREMENT_DATA_SET_DATA_ELEMENT where REQUIREMENT_UUID in(${reqId}) AND FUNCTIONAL_AREA_UUID=:APP_LOGGED_IN_FUNTIONAL_AREA_ID`;
            let requirementDataSetDataElementQueryData = await serviceOrchestrator.selectRecordsUsingQuery("PRIMARYSPRINGFM", requirementDataSetDataElementQuery, input);

            for (let data of requirementDataSetDataElementQueryData) {
                deleteRecord('REQUIREMENT_DATA_SET_DATA_ELEMENT_UUID', data['REQUIREMENT_DATA_SET_DATA_ELEMENT_UUID'], 'REQUIREMENT_DATA_SET_DATA_ELEMENT', input.APP_LOGGED_IN_FUNTIONAL_AREA_ID);
            }
        }
    }
}


//------------------------------------------------For Second Editor----------------------------
if (input.compositeEntityAction != 'Accept User Story') {

    let detailsQuery = `SELECT p.PROCESS_UUID,pg.PAGE_UUID,vua.USER_ACTION_UUID, CONCAT(p.PROCESS_NAME,' Online Screen - ',pg.PAGE_NAME,' Page - ',vua.USER_ACTION_NAME,' User Action ') AS UserAction, '' AS RequirementTitle, CONCAT(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) AS RequirementGroup, r.REQUIREMENT_UUID,r.REQUIREMENT_ID, cos.CONDITION_SATISFACTION_UUID,cos.CONDITION_SATISFACTION_ID FROM USER_STORY us JOIN IMPACTED_USER_STORY ius ON us.USER_STORY_UUID = ius.USER_STORY_UUID AND ASSOCIATION_TYPE IN ('PAGE-EVENT') JOIN REQUIREMENT r ON ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID JOIN PROCESS p ON p.PROCESS_UUID = ius.PROCESS_UUID JOIN PAGE pg ON pg.PAGE_UUID = ius.PAGE_UUID JOIN VIEW_USER_ACTION vua ON vua.USER_ACTION_UUID = ius.USER_ACTION_UUID LEFT JOIN CONDITION_SATISFACTION cos ON ius.CONDITION_SATISFACTION_UUID = cos.CONDITION_SATISFACTION_UUID LEFT JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID WHERE us.USER_STORY_UUID = :USER_STORY_UUID UNION ALL SELECT p.PROCESS_UUID,pg.PAGE_UUID,vua.USER_ACTION_UUID,CONCAT(p.PROCESS_NAME,' Online Screen - ',pg.PAGE_NAME,' Page - ',vua.USER_ACTION_NAME,' User Action ') AS UserAction, CONCAT(rt.REQUIREMENT_TITLE_ID, ' - ', rt.REQUIREMENT_TITLE) AS RequirementTitle, CONCAT(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) AS RequirementGroup, r.REQUIREMENT_UUID,r.REQUIREMENT_ID, cos.CONDITION_SATISFACTION_UUID,cos.CONDITION_SATISFACTION_ID FROM USER_STORY us JOIN IMPACTED_USER_STORY ius ON us.USER_STORY_UUID = ius.USER_STORY_UUID AND ASSOCIATION_TYPE IN ('FEATURE') JOIN REQUIREMENT r ON ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID JOIN PROCESS p ON p.PROCESS_UUID = ius.PROCESS_UUID JOIN PAGE pg ON pg.PAGE_UUID = ius.PAGE_UUID JOIN VIEW_USER_ACTION vua ON vua.USER_ACTION_UUID = ius.USER_ACTION_UUID LEFT JOIN REQUIREMENT_TITLE rt ON rt.REQUIREMENT_TITLE_UUID = ius.REQUIREMENT_TITLE_UUID LEFT JOIN CONDITION_SATISFACTION cos ON ius.CONDITION_SATISFACTION_UUID = cos.CONDITION_SATISFACTION_UUID LEFT JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_ASSOCIATION_UUID = rt.REQUIREMENT_TITLE_UUID AND rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID WHERE us.USER_STORY_UUID = :USER_STORY_UUID ;`;

    let detailsQueryDataMain = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', detailsQuery, input);

    let deletedrequirements = `SELECT MAX(p.PROCESS_UUID) AS PROCESS_UUID, MAX(pg.PAGE_UUID) AS PAGE_UUID, MAX(vua.USER_ACTION_UUID) AS USER_ACTION_UUID, MAX(CONCAT(p.PROCESS_NAME, ' Online Screen - ', pg.PAGE_NAME, ' Page - ', vua.USER_ACTION_NAME, ' User Action ')) AS UserAction, MAX('') AS RequirementTitle, MAX(CONCAT(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME)) AS RequirementGroup, r.REQUIREMENT_UUID, MAX(r.REQUIREMENT_ID) AS REQUIREMENT_ID, MAX(cos.CONDITION_SATISFACTION_UUID) AS CONDITION_SATISFACTION_UUID, MAX(cos.CONDITION_SATISFACTION_ID) AS CONDITION_SATISFACTION_ID FROM USER_STORY us JOIN featuremanagement_app_audit.IMPACTED_USER_STORY_AUDIT ius ON us.USER_STORY_UUID = ius.USER_STORY_UUID AND ASSOCIATION_TYPE IN ('PAGE-EVENT') JOIN featuremanagement_app_audit.REQUIREMENT_AUDIT r ON ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID JOIN PROCESS p ON p.PROCESS_UUID = ius.PROCESS_UUID JOIN PAGE pg ON pg.PAGE_UUID = ius.PAGE_UUID JOIN VIEW_USER_ACTION vua ON vua.USER_ACTION_UUID = ius.USER_ACTION_UUID LEFT JOIN CONDITION_SATISFACTION cos ON ius.CONDITION_SATISFACTION_UUID = cos.CONDITION_SATISFACTION_UUID LEFT JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID WHERE us.USER_STORY_UUID = :USER_STORY_UUID AND ius.AE_OPERATION_TYPE = 'Delete' GROUP BY r.REQUIREMENT_UUID UNION ALL SELECT MAX(p.PROCESS_UUID) AS PROCESS_UUID, MAX(pg.PAGE_UUID) AS PAGE_UUID, MAX(vua.USER_ACTION_UUID) AS USER_ACTION_UUID, MAX(CONCAT(p.PROCESS_NAME, ' Online Screen - ', pg.PAGE_NAME, ' Page - ', vua.USER_ACTION_NAME, ' User Action ')) AS UserAction, MAX(CONCAT(rt.REQUIREMENT_TITLE_ID, ' - ', rt.REQUIREMENT_TITLE)) AS RequirementTitle, MAX(CONCAT(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME)) AS RequirementGroup, r.REQUIREMENT_UUID, MAX(r.REQUIREMENT_ID) AS REQUIREMENT_ID, MAX(cos.CONDITION_SATISFACTION_UUID) AS CONDITION_SATISFACTION_UUID, MAX(cos.CONDITION_SATISFACTION_ID) AS CONDITION_SATISFACTION_ID FROM USER_STORY us JOIN featuremanagement_app_audit.IMPACTED_USER_STORY_AUDIT ius ON us.USER_STORY_UUID = ius.USER_STORY_UUID AND ASSOCIATION_TYPE IN ('FEATURE') JOIN featuremanagement_app_audit.REQUIREMENT_AUDIT r ON ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID JOIN PROCESS p ON p.PROCESS_UUID = ius.PROCESS_UUID JOIN PAGE pg ON pg.PAGE_UUID = ius.PAGE_UUID JOIN VIEW_USER_ACTION vua ON vua.USER_ACTION_UUID = ius.USER_ACTION_UUID LEFT JOIN REQUIREMENT_TITLE rt ON rt.REQUIREMENT_TITLE_UUID = ius.REQUIREMENT_TITLE_UUID LEFT JOIN CONDITION_SATISFACTION cos ON ius.CONDITION_SATISFACTION_UUID = cos.CONDITION_SATISFACTION_UUID LEFT JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_ASSOCIATION_UUID = rt.REQUIREMENT_TITLE_UUID AND rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID WHERE us.USER_STORY_UUID = :USER_STORY_UUID AND ius.AE_OPERATION_TYPE = 'Delete' GROUP BY r.REQUIREMENT_UUID;`;

    let deletedrequirementsData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', deletedrequirements, input);
    if (deletedrequirementsData.length) {
        for (let deletedReq of deletedrequirementsData) {
            let delcosQuery = `SELECT DISTINCT csa.CONDITION_SATISFACTION_UUID, csa.CONDITION_SATISFACTION_ID, csa.REQUIREMENT_UUID FROM featuremanagement_app_audit.CONDITION_SATISFACTION_AUDIT csa WHERE csa.REQUIREMENT_UUID = '${deletedReq['REQUIREMENT_UUID']}' AND csa.AE_OPERATION_TYPE = 'DELETE'`;
            let delcosQueryData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', delcosQuery, input);
            if (delcosQueryData.length) {
                delcosQueryData = delcosQueryData.map(obj => {
                    return { ...deletedReq, ...obj };
                });
            }
            detailsQueryDataMain.push(...delcosQueryData);
        }
    }

    let maxversionQuery = `select max(USER_STORY_VERSION_ID)+1 as maxVersion FROM USER_STORY_VERSION`;

    let maxversionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', maxversionQuery, input);
    let versionID = maxversionQueryData['maxVersion'] ? maxversionQueryData['maxVersion'] : 1;
    let finalArray = '';
    const groupedByUserAction = detailsQueryDataMain.reduce((acc, item) => {
        if (!acc[item.UserAction]) {
            acc[item.UserAction] = [];
        }
        acc[item.UserAction].push(item);
        return acc;
    }, {});
    for (const userAction in groupedByUserAction) {
        const requirementUuids = groupedByUserAction[userAction].map(item => `'${item.REQUIREMENT_UUID}'`).join(',');
        let notChangedRequirement = `SELECT CONCAT(rt.REQUIREMENT_TITLE_ID, ' - ', rt.REQUIREMENT_TITLE) AS RequirementTitle, CONCAT(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) AS RequirementGroup, r.REQUIREMENT_TEXT AS RequirementName, r.REQUIREMENT_ID, NULL AS CONDITION_SATISFACTION_ID, NULL AS ConditionOfSatisfaction FROM IMPACTED_PROCESS ius JOIN REQUIREMENT r ON ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID LEFT JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID LEFT JOIN REQUIREMENT_TITLE rt ON rt.REQUIREMENT_TITLE_UUID = r.REQUIREMENT_ASSOCIATION_UUID WHERE ius.PROCESS_UUID = '${groupedByUserAction[userAction][0]['PROCESS_UUID']}' AND ius.PAGE_UUID = '${groupedByUserAction[userAction][0]['PAGE_UUID']}' AND ius.USER_ACTION_UUID = '${groupedByUserAction[userAction][0]['USER_ACTION_UUID']}' AND r.REQUIREMENT_UUID NOT IN (${requirementUuids}) AND r.REQUIREMENT_ASSOCIATION_TYPE = 'REQUIREMENT_TITLE' UNION ALL SELECT CONCAT(rt.REQUIREMENT_TITLE_ID, ' - ', rt.REQUIREMENT_TITLE) AS RequirementTitle, CONCAT(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) AS RequirementGroup, r.REQUIREMENT_TEXT AS RequirementName, r.REQUIREMENT_ID, cos.CONDITION_SATISFACTION_ID, cos.CONDITION_SATISFACTION_NAME AS ConditionOfSatisfaction FROM IMPACTED_PROCESS ius JOIN REQUIREMENT r ON ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID LEFT JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID LEFT JOIN REQUIREMENT_TITLE rt ON rt.REQUIREMENT_TITLE_UUID = r.REQUIREMENT_ASSOCIATION_UUID LEFT JOIN CONDITION_SATISFACTION cos ON ius.CONDITION_SATISFACTION_UUID = cos.CONDITION_SATISFACTION_UUID WHERE ius.PROCESS_UUID = '${groupedByUserAction[userAction][0]['PROCESS_UUID']}' AND ius.PAGE_UUID = '${groupedByUserAction[userAction][0]['PAGE_UUID']}' AND ius.USER_ACTION_UUID = '${groupedByUserAction[userAction][0]['USER_ACTION_UUID']}' AND r.REQUIREMENT_UUID NOT IN (${requirementUuids}) AND r.REQUIREMENT_ASSOCIATION_TYPE = 'REQUIREMENT_TITLE' AND cos.CONDITION_SATISFACTION_ID IS NOT NULL UNION ALL SELECT CONCAT(rt.REQUIREMENT_TITLE_ID, ' - ', rt.REQUIREMENT_TITLE) AS RequirementTitle, CONCAT(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) AS RequirementGroup, r.REQUIREMENT_TEXT AS RequirementName, r.REQUIREMENT_ID, cos.CONDITION_SATISFACTION_ID, cos.CONDITION_SATISFACTION_NAME AS ConditionOfSatisfaction FROM IMPACTED_PROCESS ius JOIN REQUIREMENT r ON ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID LEFT JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID LEFT JOIN REQUIREMENT_TITLE rt ON rt.REQUIREMENT_TITLE_UUID = r.REQUIREMENT_ASSOCIATION_UUID LEFT JOIN CONDITION_SATISFACTION cos ON ius.CONDITION_SATISFACTION_UUID = cos.CONDITION_SATISFACTION_UUID WHERE ius.PROCESS_UUID = '${groupedByUserAction[userAction][0]['PROCESS_UUID']}' AND ius.PAGE_UUID = '${groupedByUserAction[userAction][0]['PAGE_UUID']}' AND ius.USER_ACTION_UUID = '${groupedByUserAction[userAction][0]['USER_ACTION_UUID']}' AND r.REQUIREMENT_UUID NOT IN (${requirementUuids}) AND r.REQUIREMENT_ASSOCIATION_TYPE = 'USER_ACTION'`;
        let notChangedRequirementData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', notChangedRequirement, input);

        let newRecordString = '';
        let deletedRecordString = '';
        let changedRecordString = '';
        let notChangedRecordString = '';

        for (record of groupedByUserAction[userAction]) {

            let deletedRecords = [];
            let changedRecords = [];
            let newRecords = [];

            let requirementDetailQuery = `SELECT rsa.REQUIREMENT_UUID, rsa.REQUIREMENT_TEXT AS RequirementName, usv.USER_STORY_VERSION_ID AS Version, usa.USER_STORY_STATUS, rsa.IS_DELETED, usa.USER_STORY_ID, rsa.AE_OPERATION_TYPE FROM featuremanagement_app_audit.REQUIREMENT_AUDIT rsa Left JOIN featuremanagement_app_audit.USER_STORY_AUDIT usa ON rsa.USER_STORY_VERSION_UUID = usa.USER_STORY_VERSION_UUID Left JOIN featuremanagement_app_audit.USER_STORY_VERSION_AUDIT usv ON rsa.USER_STORY_VERSION_UUID = usv.USER_STORY_VERSION_UUID WHERE rsa.REQUIREMENT_UUID = '${record['REQUIREMENT_UUID']}' ORDER BY rsa.AE_TIMESTAMP DESC, usv.USER_STORY_VERSION_ID ;`;
            let resultreq = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', requirementDetailQuery, input);

            let cosDetailQuery = `SELECT csa.CONDITION_SATISFACTION_UUID, csa.CONDITION_SATISFACTION_NAME AS ConditionOfSatisfaction, r.REQUIREMENT_TEXT AS RequirementName, usv.USER_STORY_VERSION_ID AS Version, usa.USER_STORY_STATUS, usa.USER_STORY_ID, csa.IS_DELETED, csa.AE_OPERATION_TYPE FROM featuremanagement_app_audit.CONDITION_SATISFACTION_AUDIT csa LEFT JOIN featuremanagement_app_audit.USER_STORY_AUDIT usa ON csa.USER_STORY_VERSION_UUID = usa.USER_STORY_VERSION_UUID LEFT JOIN featuremanagement_app_audit.USER_STORY_VERSION_AUDIT usv ON csa.USER_STORY_VERSION_UUID = usv.USER_STORY_VERSION_UUID JOIN REQUIREMENT r ON r.REQUIREMENT_UUID = csa.REQUIREMENT_UUID WHERE csa.CONDITION_SATISFACTION_UUID = '${record['CONDITION_SATISFACTION_UUID']}' GROUP BY csa.CONDITION_SATISFACTION_UUID, csa.CONDITION_SATISFACTION_NAME, r.REQUIREMENT_TEXT, usv.USER_STORY_VERSION_ID, usa.USER_STORY_STATUS, usa.USER_STORY_ID, csa.IS_DELETED, csa.AE_OPERATION_TYPE ORDER BY usv.USER_STORY_VERSION_ID DESC;`;
            let resultCos = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', cosDetailQuery, input);

            
            const output = processRequirements(resultreq, versionID);
            const output1 =  processRequirements(resultCos, versionID);
            if(output && output['deletedRecords']) {
                deletedRecords.push(...output['deletedRecords'])
            }
            if(output1 && output1['deletedRecords']) {
                deletedRecords.push(...output1['deletedRecords'])
            }
            if(output && output['changedRecords']) {
                changedRecords.push(...output['changedRecords'])
            }
            if(output1 && output1['changedRecords']) {
                changedRecords.push(...output1['changedRecords'])
            }
            if(output && output['newRecords']) {
                newRecords.push(...output['newRecords'])
            }
            if(output1 && output1['newRecords']) {
                newRecords.push(...output1['newRecords'])
            }

            let deletedCos = `SELECT DISTINCT r.REQUIREMENT_TEXT AS RequirementName,csa.CONDITION_SATISFACTION_NAME AS ConditionOfSatisfaction, r.REQUIREMENT_ID, CONCAT(rt.REQUIREMENT_TITLE_ID, ' - ', rt.REQUIREMENT_TITLE) AS RequirementTitle, CONCAT(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) AS RequirementGroup, csa.CONDITION_SATISFACTION_ID, usv.USER_STORY_VERSION_ID AS Version, usa.USER_STORY_STATUS, usa.USER_STORY_ID, csa.IS_DELETED, csa.AE_OPERATION_TYPE FROM featuremanagement_app_audit.CONDITION_SATISFACTION_AUDIT csa JOIN featuremanagement_app_audit.USER_STORY_AUDIT usa ON csa.USER_STORY_VERSION_UUID = usa.USER_STORY_VERSION_UUID JOIN USER_STORY_VERSION usv ON csa.USER_STORY_VERSION_UUID = usv.USER_STORY_VERSION_UUID JOIN REQUIREMENT r ON csa.REQUIREMENT_UUID = r.REQUIREMENT_UUID Left JOIN REQUIREMENT_TITLE rt ON rt.REQUIREMENT_TITLE_UUID = r.REQUIREMENT_ASSOCIATION_UUID Left JOIN REQUIREMENT_SET rs ON r.REQUIREMENT_SET_UUID = rs.REQUIREMENT_SET_UUID WHERE csa.REQUIREMENT_UUID = '${record['REQUIREMENT_UUID']}' AND csa.AE_OPERATION_TYPE = 'DELETE' AND NOT EXISTS( SELECT 1 FROM featuremanagement_app_audit.REQUIREMENT_AUDIT ra WHERE ra.REQUIREMENT_UUID = csa.REQUIREMENT_UUID AND ra.AE_OPERATION_TYPE = 'DELETE');`;
            let deletedCosData = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', deletedCos, input);

            if (deletedCosData && deletedCosData.length > 0) {
                deletedCosData.forEach((req, i) => {
                    if (req['ConditionOfSatisfaction']) {
                        deletedRecordString += generateRecordString(req, 'cos');
                        deletedRecordString += '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + req['RequirementName'].trim() + '</p>';
                        deletedRecordString += '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + req['ConditionOfSatisfaction'].trim() + '</p>';
                    }
                });
            }
            if (newRecords.length) {
                newRecordString += generateRecordString(record, 'req');
                newRecordString += generateRecordDetails(newRecords, versionID)
            }
            if (changedRecords.length) {
                changedRecordString += generateRecordString(record, 'req')
                changedRecordString += generateRecordDetails(changedRecords, versionID)
            }
            if (deletedRecords.length) {
                deletedRecords.forEach((req, i) => {
                    if (req['Version'] || i == 0) {
                        if (req['REQUIREMENT_UUID']) {
                            deletedRecordString += generateRecordString(record, 'req')
                            deletedRecordString += '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + req['RequirementName'].trim() + '</p>';
                        }
                        if (req['CONDITION_SATISFACTION_UUID']) {
                            deletedRecordString += generateRecordString(record, 'cos');
                        deletedRecordString += '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + req['RequirementName'].trim() + '</p>';
                        deletedRecordString += '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + req['ConditionOfSatisfaction'].trim() + '</p>';
                        }
                    }
                });
            }
        }

        finalArray += `<p><strong><u>${userAction}</u></strong></p>`;
        if (newRecordString) {
            finalArray += `<p><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;New Requirements:</strong></p>`;
            finalArray += newRecordString;
        }
        if (changedRecordString) {
            finalArray += `<p><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Changed Requirements:</strong></p>`;
            finalArray += changedRecordString;
        }
        if (deletedRecordString) {
            finalArray += `<p><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Deleted Requirements:</strong></p>`;
            finalArray += deletedRecordString;
        }
        if (notChangedRequirementData.length) {
            finalArray += `<p><strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Not Changed  Requirements:</strong></p>`;
            for (const notChanged of notChangedRequirementData) {
                notChangedRecordString += generateRecordString(notChanged, 'req');
                if (notChanged['RequirementName']) {
                    notChangedRecordString += '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + notChanged['RequirementName'].trim() + '</p>';
                }
                if (notChanged['ConditionOfSatisfaction']) {
                    notChangedRecordString += generateRecordString(notChanged, 'cos');
                    notChangedRecordString += '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + notChanged['ConditionOfSatisfaction'].trim() + '</p>';
                }
            }
            finalArray += notChangedRecordString;
        }
    }
    input['EXTRACTED_DATA_BY_REQUIREMENT'] = finalArray;
}

//------------------------------------------------For 1st Editor----------------------------

if (input.compositeEntityAction != 'Accept User Story') {

    let detailsQuery = `SELECT CONCAT(p.PROCESS_NAME,' - ',pg.PAGE_NAME,' - ',vua.USER_ACTION_NAME) AS UserAction, '' AS RequirementTitle, CONCAT(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) AS RequirementGroup, r.REQUIREMENT_UUID, cos.CONDITION_SATISFACTION_UUID FROM USER_STORY us JOIN IMPACTED_USER_STORY ius ON us.USER_STORY_UUID = ius.USER_STORY_UUID AND ASSOCIATION_TYPE IN ('PAGE-EVENT') JOIN REQUIREMENT r ON ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID JOIN PROCESS p ON p.PROCESS_UUID = ius.PROCESS_UUID JOIN PAGE pg ON pg.PAGE_UUID = ius.PAGE_UUID JOIN VIEW_USER_ACTION vua ON vua.USER_ACTION_UUID = ius.USER_ACTION_UUID LEFT JOIN CONDITION_SATISFACTION cos ON ius.CONDITION_SATISFACTION_UUID = cos.CONDITION_SATISFACTION_UUID LEFT JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID WHERE us.USER_STORY_UUID = :USER_STORY_UUID UNION ALL SELECT CONCAT(p.PROCESS_NAME,' - ',pg.PAGE_NAME,' - ',vua.USER_ACTION_NAME) AS UserAction, CONCAT(rt.REQUIREMENT_TITLE_ID, ' - ', rt.REQUIREMENT_TITLE) AS RequirementTitle, CONCAT(rs.REQUIREMENT_SET_ID, ' - ', rs.REQUIREMENT_SET_NAME) AS RequirementGroup, r.REQUIREMENT_UUID, cos.CONDITION_SATISFACTION_UUID FROM USER_STORY us JOIN IMPACTED_USER_STORY ius ON us.USER_STORY_UUID = ius.USER_STORY_UUID AND ASSOCIATION_TYPE IN ('FEATURE') JOIN REQUIREMENT r ON ius.REQUIREMENT_UUID = r.REQUIREMENT_UUID JOIN PROCESS p ON p.PROCESS_UUID = ius.PROCESS_UUID JOIN PAGE pg ON pg.PAGE_UUID = ius.PAGE_UUID JOIN VIEW_USER_ACTION vua ON vua.USER_ACTION_UUID = ius.USER_ACTION_UUID LEFT JOIN REQUIREMENT_TITLE rt ON rt.REQUIREMENT_TITLE_UUID = ius.REQUIREMENT_TITLE_UUID LEFT JOIN CONDITION_SATISFACTION cos ON ius.CONDITION_SATISFACTION_UUID = cos.CONDITION_SATISFACTION_UUID LEFT JOIN REQUIREMENT_SET rs ON rs.REQUIREMENT_SET_ASSOCIATION_UUID = rt.REQUIREMENT_TITLE_UUID AND rs.REQUIREMENT_SET_UUID = r.REQUIREMENT_SET_UUID WHERE us.USER_STORY_UUID = :USER_STORY_UUID ;`;

    let detailsQueryDataMain = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', detailsQuery, input);
    let maxversionQuery = `select max(USER_STORY_VERSION_ID)+1 as maxVersion FROM USER_STORY_VERSION`;
    let maxversionQueryData = await serviceOrchestrator.selectSingleRecordUsingQuery('PRIMARYSPRINGFM', maxversionQuery, input);
    let versionID = maxversionQueryData['maxVersion'] ? maxversionQueryData['maxVersion'] : 1;
    let VersionArray = [];
    let finalArray2 = '';
    let previousTitle = '';
    for (const record of detailsQueryDataMain) {
        let reqId = `'` + record['REQUIREMENT_UUID'] + `'`;
        let cosId = `'` + record['CONDITION_SATISFACTION_UUID'] + `'`;

        let requirementDetailQuery = `SELECT r.REQUIREMENT_UUID, CONCAT(r.REQUIREMENT_ID, ' - ', r.REQUIREMENT_TEXT) AS RequirementName, usv.USER_STORY_VERSION_ID AS Version, r.AE_TIMESTAMP FROM featuremanagement_app_audit.REQUIREMENT_AUDIT r LEFT JOIN USER_STORY_VERSION usv ON usv.USER_STORY_VERSION_UUID = r.USER_STORY_VERSION_UUID WHERE r.REQUIREMENT_UUID = ${reqId} ORDER BY r.AE_TIMESTAMP DESC`;
        let resultreq = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', requirementDetailQuery, input);
        if (resultreq && resultreq.length > 0) {
            const requirementDetailQueryData = getFirstAndLastForFirstVersion(resultreq);
            requirementDetailQueryData.forEach((req, index) => {
                if (index == 0) {
                    let obj = {
                        RequirementTitle: record['RequirementTitle'],
                        RequirementGroup: record['RequirementGroup'],
                        RequirementName: req['RequirementName'],
                        RequirementUUID: req['REQUIREMENT_UUID'],
                        Version: versionID,
                        UserAction: record['UserAction'],
                    };
                    VersionArray.push(obj);
                } else {
                    if (req['Version']) {
                        let obj = {
                            RequirementTitle: record['RequirementTitle'],
                            RequirementGroup: record['RequirementGroup'],
                            RequirementName: req['RequirementName'],
                            RequirementUUID: req['REQUIREMENT_UUID'],
                            Version: req['Version'],
                            UserAction: record['UserAction'],
                        };
                        VersionArray.push(obj);
                    }
                }
            })
        }


        let cosDetailQuery = `SELECT cos.CONDITION_SATISFACTION_UUID,CONCAT(cos.CONDITION_SATISFACTION_ID, ' - ', cos.CONDITION_SATISFACTION_NAME) AS ConditionOfSatisfaction, usv.USER_STORY_VERSION_ID AS Version FROM featuremanagement_app_audit.CONDITION_SATISFACTION_AUDIT cos LEFT JOIN USER_STORY_VERSION usv ON usv.USER_STORY_VERSION_UUID = cos.USER_STORY_VERSION_UUID WHERE cos.CONDITION_SATISFACTION_UUID = ${cosId} ORDER BY cos.AE_TIMESTAMP DESC;`;
        let resultCos = await serviceOrchestrator.selectRecordsUsingQuery('PRIMARYSPRINGFM', cosDetailQuery, input);
        if (resultCos && resultCos.length > 0) {
            const cosDetailQueryData = getFirstAndLastForFirstVersion(resultCos);
            cosDetailQueryData.forEach((cos, index) => {
                if (index == 0) {
                    let obj = {
                        RequirementTitle: record['RequirementTitle'],
                        RequirementGroup: record['RequirementGroup'],
                        ConditionOfSatisfaction: cos['ConditionOfSatisfaction'],
                        CONDITION_SATISFACTION_UUID: cos['CONDITION_SATISFACTION_UUID'],
                        Version: versionID,
                        UserAction: record['UserAction'],
                    };
                    VersionArray.push(obj);
                } else {
                    if (cos['Version']) {
                        let obj = {
                            RequirementTitle: record['RequirementTitle'],
                            RequirementGroup: record['RequirementGroup'],
                            ConditionOfSatisfaction: cos['ConditionOfSatisfaction'],
                            CONDITION_SATISFACTION_UUID: cos['CONDITION_SATISFACTION_UUID'],
                            Version: cos['Version'],
                            UserAction: record['UserAction'],
                        };
                        VersionArray.push(obj);
                    }
                }
            });
        }
    }
    const groupedData = VersionArray.reduce((acc, curr) => {
        const version = curr.Version
        const userAction = curr.UserAction;
        const requirementTitle = curr.RequirementTitle || null;
        const requirementGroup = curr.RequirementGroup || null;

        if (!acc[version]) {
            acc[version] = {};
        }
        if (!acc[version][userAction]) {
            acc[version][userAction] = {};
        }
        if (!acc[version][userAction][requirementTitle]) {
            acc[version][userAction][requirementTitle] = {};
        }
        if (!acc[version][userAction][requirementTitle][requirementGroup]) {
            acc[version][userAction][requirementTitle][requirementGroup] = [];
        }
        acc[version][userAction][requirementTitle][requirementGroup].push(curr);
        return acc;
    }, {});
    const versions = Object.keys(groupedData);
    versions.sort((a, b) => {
        const versionA = parseInt(a);
        const versionB = parseInt(b);
        return versionB - versionA;
    });
    versions.forEach((version) => {
        let customVersion = 'V - ' + version;
        finalArray2 += `<p><strong>${customVersion}</strong></p>`;
        for (const userAction in groupedData[version]) {
            finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;<strong>${userAction}</strong></p>`;
            for (const title in groupedData[version][userAction]) {
                if (title !== 'null' && title !== "") {
                    finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${title.trim()}</p>`;
                    for (const Subtitle in groupedData[version][userAction][title]) {
                        if (Subtitle !== 'null' && Subtitle !== "") {
                            finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RS: ${Subtitle.trim()}</p>`;
                            for (const req of groupedData[version][userAction][title][Subtitle]) {
                                if (req['RequirementName']) {
                                    finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RQ: ${req['RequirementName'].trim()}</p>`;
                                } else if (req['ConditionOfSatisfaction'] != null && req['ConditionOfSatisfaction'] != 'null' && req['ConditionOfSatisfaction'] != '') {
                                    finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COS: ${req['ConditionOfSatisfaction'].trim()}</p>`;
                                }
                            }
                        } else {
                            for (const req of groupedData[version][userAction][title][Subtitle]) {
                                if (req['RequirementName']) {
                                    finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RQ: ${req['RequirementName'].trim()}</p>`;
                                } else if (req['ConditionOfSatisfaction'] != null && req['ConditionOfSatisfaction'] != 'null' && req['ConditionOfSatisfaction'] != '') {
                                    finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COS: ${req['ConditionOfSatisfaction'].trim()}</p>`;
                                }
                            }
                        }
                    }
                } else {
                    for (const Subtitle in groupedData[version][userAction][title]) {
                        if (Subtitle !== 'null' && Subtitle !== "") {
                            finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RS: ${Subtitle}</p>`;
                            for (const req of groupedData[version][userAction][title][Subtitle]) {
                                if (req['RequirementName']) {
                                    finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RQ: ${req['RequirementName'].trim()}</p>`;
                                } else if (req['ConditionOfSatisfaction'] != null && req['ConditionOfSatisfaction'] != 'null' && req['ConditionOfSatisfaction'] != '') {
                                    finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COS: ${req['ConditionOfSatisfaction'].trim()}</p>`;
                                }
                            }
                        } else {
                            for (const req of groupedData[version][userAction][title][Subtitle]) {
                                if (req['RequirementName']) {
                                    finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RQ: ${req['RequirementName'].trim()}</p>`;
                                } else if (req['ConditionOfSatisfaction'] != null && req['ConditionOfSatisfaction'] != 'null' && req['ConditionOfSatisfaction'] != '') {
                                    finalArray2 += `<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COS: ${req['ConditionOfSatisfaction'].trim()}</p>`;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    input['EXTRACTED_DATA_BY_VERSION'] = finalArray2;
}

if(input['USER_STORY_SOURCE_TYPE']!='Manual'){
input['USER_STORY_DESCRIPTION']	= null;
input['USER_STORY_NOTES']	= null;
}

input["AppEngChildEntity:REQUIREMENT"] = requirementArray;
input["AppEngChildEntity:CONDITION_SATISFACTION"] = cosArray;
input["AppEngChildEntity:IMPACTED_USER_STORY"] = impactedUserStoryArray;
input["AppEngChildEntity:IMPACTED_PROCESS"] = impactedProcessArray;
input["AppEngChildEntity:INTEGRATION TEST CASE REQUIREMENT"] = testCaseRequirementArray;
input["AppEngChildEntity:REQUIREMENT_DATA_SET_DATA_ELEMENT"] = requirementDataSetDataElementArray;