const express = require('express');
const routes = express.Router();

const layerController = require('./controllers/layerController');
const tableController = require('./controllers/tableController');
const databaseController = require('./controllers/databaseController');
const savedLayersController = require('./controllers/savedLayersController');
const sqlController = require('./controllers/sqlController');

routes.get('/layer/:layer/:geometryColumn', (req, res) => {
  return redirect(req, res, layerController.index);
});

routes.get('/tables', (req, res) => {
  return redirect(req, res, tableController.index);
});

//Rotas para armazenamento de dados do Usuário
routes.post('/database', (req, res) => {
  return redirect(req, res, databaseController.save);
});

routes.get('/database/all', (req, res) => {
  return redirect(req, res, databaseController.getAll);
});

routes.get('/database', (req, res) => {
  return redirect(req, res, databaseController.get);
});

routes.delete('/database', (req, res) => {
  return redirect(req, res, databaseController.delete);
});

//Rotas para armazenamento de Camadas do Mapa
routes.post('/persisted-layers', (req, res) => {
  return redirect(req, res, savedLayersController.save);
});

routes.get('/persisted-layers/all', (req, res) => {
  return redirect(req, res, savedLayersController.getAll);
});

routes.get('/persisted-layers', (req, res) => {
  return redirect(req, res, savedLayersController.get);
});

routes.delete('/persisted-layers', (req, res) => {
  return redirect(req, res, savedLayersController.delete);
});

routes.delete('/persisted-layers/all', (req, res) => {
  return redirect(req, res, savedLayersController.deleteAll);
});

//Rotas para consultas espaciais básicas
routes.post('/spatial-query', (req, res) => {
  return redirect(req, res, sqlController.spatialQuery);
});

routes.post('/sql', (req, res) => {
  return redirect(req, res, sqlController.sql);
});

routes.post('/query-to-table', (req, res) => {
  return redirect(req, res, sqlController.saveQueryIntoTable);
});

const redirect = (req, res, route) => {
  try {
    return route(req, res);
  } catch {
    return res.status(500).json({ mensagem: 'Ocorreu um erro interno!' });
  }
};

module.exports = routes;
