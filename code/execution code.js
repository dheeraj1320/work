app.get("/", async (req, res) => {
    const allApplicationEnv = await db('APPLICATION_ENVIRONMENT').select('*')
    const allApplicationEnvBaseURL = await db('APPLICATION_ENVIRONMENT_BASE_URL').select('*')
    const sequence_APPLICATION_ENVIRONMENT_BASE_URL = await db('SEQUENCE').where('TABLE_NAME', 'APPLICATION_ENVIRONMENT_BASE_URL').select()
    const sequence_APPLICATION_ENVIRONMENT = await db('SEQUENCE').where('TABLE_NAME', 'APPLICATION_ENVIRONMENT').select()
    console.log("sequence", sequence_APPLICATION_ENVIRONMENT_BASE_URL)
    let ifApplicationEnvPresent = sequence_APPLICATION_ENVIRONMENT.length > 0 ? true : false
    let ifApplicationEnvBaseURLPresent = sequence_APPLICATION_ENVIRONMENT_BASE_URL.length > 0 ? true : false
    console.log("dhfdjf", ifApplicationEnvPresent, ifApplicationEnvBaseURLPresent)
    if (!ifApplicationEnvPresent) {
        try {
            // create the sequence in it
            let iii = await db('SEQUENCE').insert({
                TABLE_NAME: 'APPLICATION_ENVIRONMENT',
                MAX_TABLE_SEQ_ID: 0,
                AE_INSERT_ID: uuidv4(),
                AE_INSERT_TS: db.raw('CURRENT_TIMESTAMP(3)'),
                AE_TRANSACTION_ID: uuidv4()
            })
            console.log(iii)
            console.log("INSIDE ifApplicationEnvPresent")
        } catch (error) {
            return res.json(error)
        }
    }
    if (!ifApplicationEnvBaseURLPresent) {
        try {
            // create the sequence in it
            let dd = await db('SEQUENCE').insert({
                TABLE_NAME: 'APPLICATION_ENVIRONMENT_BASE_URL',
                MAX_TABLE_SEQ_ID: 0,
                AE_INSERT_ID: uuidv4(),
                AE_INSERT_TS: db.raw('CURRENT_TIMESTAMP(3)'),
                AE_TRANSACTION_ID: uuidv4()
            })
            console.log("INSIDE ifApplicationEnvBaseURLPresent", dd)
        } catch (error) {
            return res.json(error)
        }
    }
    try {
        let count = allApplicationEnvBaseURL.length + 1;
        let arrayOfData = [];
        let arrayOfAuditData = [];
        for (let index = 0; index < allApplicationEnv.length; index++) {
            const element = allApplicationEnv[index];
            // console.log("PROCESING ",element);
            let ifElementExists = allApplicationEnvBaseURL.some(value => value['BASE_URL'] === element['APPLICATION_ENVIRONMENT_BASE_URL'] && value['APPLICATION_ENVIRONMENT_UUID'] === element['APPLICATION_ENVIRONMENT_UUID'])
            // console.log(ifElementExists)
            if (!ifElementExists) {
                let ApplicationEnvBaseURLUUID = uuidv4()
                let newObj = {
                    'APPLICATION_ENVIRONMENT_BASE_URL_UUID': ApplicationEnvBaseURLUUID,
                    'APPLICATION_ENVIRONMENT_BASE_URL_ID': count,
                    'IS_DEFAULT_BASE_URL': 'Yes',
                    'APPLICATION_ENVIRONMENT_UUID': element['APPLICATION_ENVIRONMENT_UUID'],
                    'BASE_URL': element['APPLICATION_ENVIRONMENT_BASE_URL'],
                    'FUNCTIONAL_AREA_UUID': element['FUNCTIONAL_AREA_UUID'],
                    'AE_INSERT_ID': element['AE_INSERT_ID'],
                    'AE_UPDATE_ID': null,
                    'AE_TRANSACTION_ID': uuidv4(),
                    'AE_INSERT_TS': db.raw('CURRENT_TIMESTAMP(3)'),
                    'AE_UPDATE_TS': null
                }
                let compObject = {
                    "IS_DEFAULT_BASE_URL": {
                        "oldValue": null,
                        "newValue": "Yes"
                    },
                    "APPLICATION_ENVIRONMENT_UUID": {
                        "oldValue": null,
                        "newValue": element['APPLICATION_ENVIRONMENT_UUID']
                    },
                    "BASE_URL": {
                        "oldValue": null,
                        "newValue": element['APPLICATION_ENVIRONMENT_BASE_URL']
                    },
                    "FUNCTIONAL_AREA_UUID": {
                        "oldValue": null,
                        "newValue": element['FUNCTIONAL_AREA_UUID']
                    },
                    "isRowlocked": false
                };

                let newAuditdata = {
                    'AE_UPDATE_TS': null,
                    'AE_INSERT_ID': element['AE_INSERT_ID'],
                    'BASE_URL': element['APPLICATION_ENVIRONMENT_BASE_URL'],
                    'APPLICATION_ENVIRONMENT_BASE_URL_UUID': ApplicationEnvBaseURLUUID,
                    'IS_DEFAULT_BASE_URL': 'Yes',
                    'FUNCTIONAL_AREA_UUID': element['FUNCTIONAL_AREA_UUID'],
                    'APPLICATION_ENVIRONMENT_UUID': element['APPLICATION_ENVIRONMENT_UUID'],
                    'AE_TRANSACTION_ID': uuidv4(),
                    'AE_INSERT_TS': db.raw('CURRENT_TIMESTAMP(3)'),
                    'APPLICATION_ENVIRONMENT_BASE_URL_ID': count,
                    'AE_UPDATE_ID': null,
                    'OPERATION_PERFORMED_BY': '',
                    'AE_AUDIT_UUID': uuidv4(),
                    'AE_TIMESTAMP': db.raw('CURRENT_TIMESTAMP(3)'),
                    'AE_OPERATION_TYPE': 'Insert',
                    'AE_OLD_NEW_COMPARISION_DETAILS': JSON.stringify(compObject),
                    'TENANT_ID': null,
                }
                arrayOfData.push(newObj)
                arrayOfAuditData.push(newAuditdata)
                count = count + 1;
            }
        }
        if (arrayOfData.length > 0) {
            await db('APPLICATION_ENVIRONMENT_BASE_URL').insert(arrayOfData)
            await db('APPLICATION_ENVIRONMENT_BASE_URL_AUDIT').insert(arrayOfAuditData)
            let countOfValue = count - allApplicationEnvBaseURL.length - 1;
            await db('SEQUENCE').where({ TABLE_NAME: 'APPLICATION_ENVIRONMENT_BASE_URL' }).update({ MAX_TABLE_SEQ_ID: countOfValue })
            await db('SEQUENCE').where({ TABLE_NAME: 'APPLICATION_ENVIRONMENT' }).update({ MAX_TABLE_SEQ_ID: countOfValue })
        }
        return res.json({
            'error': null,
            'status': 'ok'
        })
    } catch (error) {
        return res.json(error)
    }
})