const { v4: uuidv4 } = require('uuid');
// const db = require("../DbConfig")

// const db = require('knex')({
//   client: 'mysql',
//   connection: {
//     host: 'ae-development-infoapps.cnoaycsucdmt.us-east-1.rds.amazonaws.com',
//     user: 'admin',
//     password: 'aurora123',
//     database: `uat_featuremanagement_app`
//   }
// });

// const dbAudit = require('knex')({
//   client: 'mysql',
//   connection: {
//     host: 'ae-development-infoapps.cnoaycsucdmt.us-east-1.rds.amazonaws.com',
//     user: 'admin',
//     password: 'aurora123',
//     database: `uat_featuremanagement_app_audit`
//   }
// });

const db = require('knex')({
  client: 'mssql',
  connection: {
    host: 'app-engine-azsqldb.database.windows.net', // e.g., localhost or IP address
    user: 'techdbuser01ae',
    password: 'e22d4f42-f54b-444b-af4b-8b269f595a71',
    database: 'app-engine-azdb',
    options: {
      encrypt: true
    }
  }
});


async function newAPIATTRIBUTE() {
  let trx;
  try {
    let api_schema_name = 'infoqa';
    let api_schema_name_audit = 'infoqa';
    trx = await db.transaction();
    // trxAudit = await dbAudit.transaction();
    // let allApiAttributes = await trx.select('*').from('API_ATTRIBUTE').orderBy('API_ATTRIBUTE_ID');
    let allApiAttributes = await trx.withSchema(api_schema_name).select('*').from('API_ATTRIBUTE').orderBy('API_ATTRIBUTE_ID');
    // let auditArray = [];
    let originalApiAttribute = {
      Input: 'JSONPointer',
      Output: 'JSONPointer',
      'Input JSON': 'JSONPointer',
      'Output JSON': 'JSONPointer',
      'Request Payload': 'Selector',
      'URL Parameter': 'Query Parameter',
      'URL Attribute': 'URL Parameter'
    };
    for (const element of allApiAttributes) {
      console.log('Running for ', element['API_ATTRIBUTE_UUID']);
      if ((element['ATTRIBUTE_TYPE'] && originalApiAttribute[element['ATTRIBUTE_TYPE'].trim()]) || originalApiAttribute[element['ATTRIBUTE_TYPE'].trim()] !== element['ATTRIBUTE_LOCATOR_TYPE']) {
        // console.log(originalApiAttribute[element['ATTRIBUTE_TYPE'].trim()] === "URL Attribute")
        if (originalApiAttribute[element['ATTRIBUTE_TYPE'].trim()] === 'URL Parameter') {
          await trx('API_ATTRIBUTE')
            .withSchema(api_schema_name)
            .update({ ATTRIBUTE_LOCATOR_TYPE: 'Query Parameter', ATTRIBUTE_TYPE: 'URL Parameter' })
            .where({ API_ATTRIBUTE_UUID: element['API_ATTRIBUTE_UUID'] });
        } else {
          // console.log(element['ATTRIBUTE_TYPE'] === ' Input',element)
          const attributeType = typeof element['ATTRIBUTE_TYPE'] === 'string' ? element['ATTRIBUTE_TYPE'].trim() : null;
          console.log(attributeType);
          if (element['ATTRIBUTE_TYPE'].trim() === 'URL Parameter') {
            await trx('API_ATTRIBUTE')
              .withSchema(api_schema_name)
              .update({ ATTRIBUTE_LOCATOR_TYPE: 'Query Parameter', ATTRIBUTE_TYPE: 'URL Parameter' })
              .where({ API_ATTRIBUTE_UUID: element['API_ATTRIBUTE_UUID'] });
          } else {
            await trx('API_ATTRIBUTE')
              .withSchema(api_schema_name)
              .update({ ATTRIBUTE_LOCATOR_TYPE: originalApiAttribute[element['ATTRIBUTE_TYPE'].trim()], ATTRIBUTE_TYPE: attributeType })
              .where({ API_ATTRIBUTE_UUID: element['API_ATTRIBUTE_UUID'] });
          }
        }
        let AE_TRANSACTION_ID = uuidv4();
        let newValues =
          originalApiAttribute[element['ATTRIBUTE_TYPE'].trim()] === 'URL Parameter'
            ? {
                ATTRIBUTE_TYPE: {
                  oldValue: 'URL Attribute',
                  newValue: 'URL Parameter'
                }
              }
            : {};
        let newOldValues = {
          ATTRIBUTE_LOCATOR_TYPE: {
            oldValue: null,
            newValue: originalApiAttribute[element['ATTRIBUTE_TYPE'].trim()] === 'URL Parameter' ? 'Query Parameter' : originalApiAttribute[element['ATTRIBUTE_TYPE'].trim()]
          },
          ...newValues
        };
        let ownerID = element['AE_UPDATE_ID'] ? element['AE_UPDATE_ID'] : element['AE_INSERT_ID'];
        delete element['API_NEW_UUID'];
        delete element['AE_UPDATE_TS'];
        delete element['AE_UPDATE_ID'];
        let auditObj = {
          ...element,
          AE_INSERT_TS: new Date(element['AE_INSERT_TS']),
          ATTRIBUTE_TYPE: originalApiAttribute[element['ATTRIBUTE_TYPE'].trim()] === 'URL Parameter' ? 'URL Parameter' : element['ATTRIBUTE_TYPE'].trim(),
          ATTRIBUTE_LOCATOR_TYPE: originalApiAttribute[element['ATTRIBUTE_TYPE'].trim()] === 'URL Parameter' ? 'Query Parameter' : originalApiAttribute[element['ATTRIBUTE_TYPE'].trim()],
          AE_UPDATE_TS: new Date(),
          AE_UPDATE_ID: ownerID,
          AE_AUDIT_UUID: uuidv4(),
          OPERATION_PERFORMED_BY: ownerID,
          AE_OPERATION_TYPE: 'Update',
          AE_TIMESTAMP: trx.raw('CURRENT_TIMESTAMP'),
          AE_OLD_NEW_COMPARISION_DETAILS: JSON.stringify(newOldValues),
          AE_TRANSACTION_ID: AE_TRANSACTION_ID,
          TENANT_ID: null
        };
        // auditArray.push(auditObj)
        await trx('API_ATTRIBUTE_AUDIT').withSchema(api_schema_name_audit).insert(auditObj);
        // await trxAudit('API_ATTRIBUTE_AUDIT').insert(auditArray);
      }
    }
    await trx.commit();
    // await trxAudit.commit();
    console.log('success');
    return true;
  } catch (error) {
    if (trx) await trx.rollback();
    // if (trxAudit) await trxAudit.rollback();
    console.log('failed', error);

    return false;
  }
}

module.exports = { newAPIATTRIBUTE };
