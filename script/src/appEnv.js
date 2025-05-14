import { v4 as uuidv4 } from 'uuid';
const MY_ID = '622e9c89-cb3a-4012-9e95-67095f3bb694';

const getMssqlKnex = (knex, schemaName) => {
  return (tableName) => knex(tableName).withSchema(schemaName);
};

const updateSequence = async (mainKnex, tableName, newId) => {
  await mainKnex('SEQUENCE').where({ TABLE_NAME: tableName }).update({ MAX_TABLE_SEQ_ID: newId });
};

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
      AE_INSERT_TS: new Date(),
    });
    return 0;
  }
};

export const dataFixForAppEnv = async (req, res, knex, auditknexobj) => {
  try {
    const mainKnex = getMssqlKnex(knex, 'infoqa');
    const auditKnex = getMssqlKnex(auditknexobj, 'infoqa');

    const appEnvs = await mainKnex('APPLICATION_ENVIRONMENT').select('*').orderBy('APPLICATION_ENVIRONMENT_ID', 'desc');

    let urlSeq = await getOrInitializeSequence(mainKnex, 'APPLICATION_ENVIRONMENT_BASE_URL');

    for (let env of appEnvs) {
      const urlCount = await mainKnex('APPLICATION_ENVIRONMENT_BASE_URL')
        .where({ APPLICATION_ENVIRONMENT_UUID: env.APPLICATION_ENVIRONMENT_UUID })
        .count('*', { as: 'count' });

      if (urlCount[0].count > 0) {
        console.log('🎉🎉🎉 Skipping: Base URL already exists for ', env.APPLICATION_ENVIRONMENT_NAME);
        continue;
      }

      const baseUrlObj = {
        APPLICATION_ENVIRONMENT_BASE_URL_UUID: uuidv4(),
        APPLICATION_ENVIRONMENT_BASE_URL_ID: ++urlSeq,
        IS_DEFAULT_BASE_URL: 'Yes',
        APPLICATION_ENVIRONMENT_UUID: env.APPLICATION_ENVIRONMENT_UUID,
        BASE_URL: env.APPLICATION_ENVIRONMENT_BASE_URL,
        FUNCTIONAL_AREA_UUID: env.FUNCTIONAL_AREA_UUID,
        AE_INSERT_ID: MY_ID,
        AE_TRANSACTION_ID: uuidv4(),
        AE_INSERT_TS: new Date(),
      };

      await mainKnex('APPLICATION_ENVIRONMENT_BASE_URL').insert(baseUrlObj);
      console.log('Inserted base URL for == ', env.APPLICATION_ENVIRONMENT_NAME);

      let baseUrlObjJSON = Object.keys(baseUrlObj).reduce((acc, key) => {
        acc[key] = {
          oldValue: null,
          newValue: baseUrlObj[key],
        };
        return acc;
      }, {});

      baseUrlObj['AE_OLD_NEW_COMPARISION_DETAILS'] = JSON.stringify(baseUrlObjJSON);
      baseUrlObj['AE_AUDIT_UUID'] = uuidv4();
      baseUrlObj['AE_OPERATION_TYPE'] = 'Insert';
      baseUrlObj['AE_TIMESTAMP'] = new Date();
      baseUrlObj['OPERATION_PERFORMED_BY'] = MY_ID;
      let result = JSON.parse(JSON.stringify(baseUrlObj));

      await auditKnex('APPLICATION_ENVIRONMENT_BASE_URL_AUDIT').insert(result);
    }

    await updateSequence(mainKnex, 'APPLICATION_ENVIRONMENT_BASE_URL', urlSeq);

    const pages = await mainKnex('PAGE').where((builder) => {
      builder
        .where('IS_BASE_URL_OVERRIDDEN', '!=', 'Yes')
        .andWhere('IS_BASE_URL_OVERRIDDEN', '!=', 'No')
        .orWhereNull('IS_BASE_URL_OVERRIDDEN');
    });

    console.log(' 🀄 Updating pages ========= ', pages.length);

    for (const page of pages) {
      await mainKnex('PAGE').where({ PAGE_UUID: page.PAGE_UUID }).update({
        IS_BASE_URL_OVERRIDDEN: 'No',
      });
      const pageObj = {
        IS_BASE_URL_OVERRIDDEN: 'No',
      };
      let pageObjJSON = Object.keys(pageObj).reduce((acc, key) => {
        acc[key] = {
          oldValue: null,
          newValue: pageObj[key],
        };
        return acc;
      }, {});

      console.log('Updating page =========== ', page.PAGE_NAME);

      pageObj['AE_OLD_NEW_COMPARISION_DETAILS'] = JSON.stringify(pageObjJSON);
      pageObj['AE_AUDIT_UUID'] = uuidv4();
      pageObj['AE_OPERATION_TYPE'] = 'Update';
      pageObj['AE_TIMESTAMP'] = new Date();
      pageObj['OPERATION_PERFORMED_BY'] = MY_ID;
      let result = JSON.parse(JSON.stringify(pageObj));

      await auditKnex('PAGE_AUDIT').insert(result);
    }

    console.log('Script ran successfully! ✅✅✅');
    res.status(200).json({ message: 'Sequence table updated successfully' });
  } catch (e) {
    console.error('Error updating sequence table:', e);
    res.status(500).json({
      message: 'Failed to update sequence table',
      error: e.message || e,
    });
  }
};
