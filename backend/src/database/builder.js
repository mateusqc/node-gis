const { execute, query, queryOne } = require('../database/sqlite');
const { Sequelize } = require('sequelize');

let dbsConfiguration;
let activeConnection;
let dbs = [];

const refreshDatabaseConnections = async () => {
  dbsConfiguration = await query('SELECT * FROM database');
  dbs =
    dbsConfiguration && dbsConfiguration.length > 0
      ? dbsConfiguration.map((config, idx) => {
          let type;
          if (config.type) {
            type = config.type;
            delete config.type;
          }
          if (config.active && config.active === 'true') {
            activeConnection = idx;
          }
          if (type === 'sqlite') {
            return new Sequelize({
              dialect: 'sqlite',
              storage: config.host,
            });
          } else {
            return new Sequelize(config.database, config.username, config.password, config);
          }
        })
      : [];
};

const getActiveDbConnection = () => {
  if (activeConnection !== undefined && activeConnection !== null) {
    return dbs[activeConnection];
  } else {
    throw 'Erro ao obter conexão ativa de banco de dados.';
  }
};

const getDbConnections = () => dbs;

module.exports = { getDbConnections, refreshDatabaseConnections, getActiveDbConnection };
