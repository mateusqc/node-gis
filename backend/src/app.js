require('dotenv').config()

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
app.use(process.env.API_PATH, routes);
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
  next();
})

app.listen(8000);
