const express = require('express');
const routes = express.Router();

const layerController = require('./controllers/layerController');
const tableController = require('./controllers/tableController');
const userController = require('./controllers/userController');
const sqlController = require('./controllers/sqlController');

routes.get('/layer/:layer/:geometryColumn', (req, res) => {
  return redirect(req, res, layerController.index);
});

routes.get('/tables', (req, res) => {
  return redirect(req, res, tableController.index);
});

//Rotas para armazenamento de dados do Usuário
routes.post('/user/database', (req, res) => {
  return redirect(req, res, userController.saveDb);
});
routes.get('/user/database', (req, res) => {
  return redirect(req, res, userController.getDb);
});

//Rotas para consultas espaciais básicas
routes.post('/spatial_query', (req, res) => {
  return redirect(req, res, sqlController.spatialQuery);
});

routes.post('/sql', (req, res) => {
  return redirect(req, res, sqlController.sql);
});

const redirect = (req, res, route) => {
  try {
    return route(req, res);
  } catch {
    return res.status(500).json({ mensagem: 'Ocorreu um erro interno!' });
  }
};

module.exports = routes;
