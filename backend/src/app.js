require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ddlUser } = require('./ddlUser');
const routes = require('./routes');
const { refreshDatabaseConnections } = require('./database/builder');

const app = express();

(async () => {
  await ddlUser();
  refreshDatabaseConnections();
})();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(process.env.API_PATH, routes);

app.listen(8000);
