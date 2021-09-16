require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { ddlUser } = require('./ddlUser');
const routes = require('./routes');
const { refreshDatabaseConnections } = require('./database/builder');

const app = express();

(() => {
  ddlUser();
  refreshDatabaseConnections();
})();

app.use(cors());
app.use(express.json());
app.use(process.env.API_PATH, routes);

app.listen(8000);
