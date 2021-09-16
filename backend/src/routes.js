const express = require('express');
const routes = express.Router();

const layerController = require('./controllers/layerController');
const tableController = require('./controllers/tableController');
const databaseController = require('./controllers/databaseController');
const seqDatabaseController = require('./controllers/seqDatabaseController');
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

//Rotas para armazenamento de dados do Usuário - 2
routes.post('/db', (req, res) => {
  return redirect(req, res, seqDatabaseController.save);
});

routes.get('/db/all', (req, res) => {
  return redirect(req, res, seqDatabaseController.getAll);
});

routes.get('/db', (req, res) => {
  return redirect(req, res, seqDatabaseController.get);
});

routes.delete('/db', (req, res) => {
  return redirect(req, res, seqDatabaseController.delete);
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
