const express = require('express');
const getData = require('./page');
const app = express();
const port = 8080;

const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'ae-development-infoapps.cnoaycsucdmt.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'aurora123',
    database: `uat_featuremanagement_app`,
  },
});

const auditKnex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'ae-development-infoapps.cnoaycsucdmt.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'aurora123',
    database: `uat_featuremanagement_app_audit`,
  },
});

module.exports = knex;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/script', (req, res) => {
  return getData(req, res, knex, auditKnex);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
