const express = require('express');
const getData = require('./page');
const { updateSequence } = require('./sequence');
const { updateMssqlSequence } = require('./mssql-sequence');
const { dataFixForAppEnv } = require('./appEnv');
const app = express();
const port = 8080;

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'ae-development-infoapps.cnoaycsucdmt.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'aurora123',
    database: `featuremanagement_app`,
  },
});

const auditKnex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'ae-development-infoapps.cnoaycsucdmt.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'aurora123',
    database: `featuremanagement_app_audit`,
  },

});


const mssqlKnex = require('knex')({
  client: 'mssql',
  connection: {
    host: 'app-engine-azsqldb.database.windows.net', // e.g., localhost or IP address
    user: 'techdbuser01ae',
    password: 'e22d4f42-f54b-444b-af4b-8b269f595a71',
    database: 'app-engine-azdb',
    options: {
      encrypt: true,
    },
  },
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

app.get('/appenv', (req, res) => {
  return dataFixForAppEnv(req, res, mssqlKnex, mssqlKnex);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
