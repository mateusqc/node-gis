const express = require('express');
const cors = require('cors');
const { ddlUser } = require('./ddlUser');
const routes = require('./routes');

const app = express();

(() => {
  ddlUser();
})();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(8000);
