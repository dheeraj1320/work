const express = require('express');
const getData = require('./page');
const { updateSequence } = require('./sequence');
const { updateMssqlSequence } = require('./mssql-sequence');
const { dataFixForTestCaseAndUserStory } = require('./TestCaseUSerStory');
const { dataFixForAppEnv } = require('./appEnv');
const { newAPIATTRIBUTE } = require('./amey');
const { updateApiDataFix } = require('./vipresh');
const { insertAuditRecord } = require('./test');
const app = express();
const port = 8080;

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'ae-development-infoapps.cnoaycsucdmt.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'aurora123',
    database: `featuremanagement_app`
  }
});

const auditKnex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'ae-development-infoapps.cnoaycsucdmt.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'aurora123',
    database: `featuremanagement_app_audit`
  }
});

const mssqlKnex = require('knex')({
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

module.exports = knex;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// app.get('/script', (req, res) => {
//   return getData(req, res, knex, auditKnex);
// });

// app.get('/updateSequence', (req, res) => {
//   return updateMssqlSequence(req, res, mssqlKnex, 'testinfoqaSwissre');
// });

// app.get('/appenv', (req, res) => {
// uncomment this for MYSQL
// return dataFixForAppEnv(req, res, knex, auditKnex , 'infoqa');

// uncomment this for MSSQL
// return dataFixForAppEnv(req, res, mssqlKnex, mssqlKnex, 'infoqa');

// });

// app.get('/testcaseUS', (req, res) => {
// uncomment this for MYSQL
// return dataFixForTestCaseAndUserStory(req, res, knex, auditKnex, 'newinfoqaSwissre');

// uncomment this for MSSQL
// return dataFixForTestCaseAndUserStory(req, res, knex, auditKnex, 'infoqa');
// });

app.get('/test', async (req, res) => {
  await insertAuditRecord(auditKnex);
  return res.status(200).json({ message: 'Script ran successfully! ✅✅✅' });
});
// app.get('/amey', async (req, res) => {
//   await newAPIATTRIBUTE();
//   return res.status(200).json({ message: 'Script ran successfully! ✅✅✅' });
// });

// app.get('/viper', async (req, res) => {
//   return await updateApiDataFix(req, res, mssqlKnex, mssqlKnex);
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
