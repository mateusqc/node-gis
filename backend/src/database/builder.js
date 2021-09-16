const { execute, query, queryOne } = require('../database/sqlite');
const { Sequelize } = require('sequelize');

let dbs_configuration;
let dbs = [];

const refreshDatabaseConnections = async () => {
  dbs_configuration = await query('SELECT * FROM db_sequilize');
  dbs =
    dbs_configuration && dbs_configuration.length > 0
      ? dbs_configuration.map((config) => {
          if (config.type) {
            delete config.type;
          }
          console.log(config);
          return new Sequelize(config.database, config.username, config.password, config);
        })
      : [];

  console.log(dbs);
};

const getDbConnections = () => dbs;

module.exports = { getDbConnections, refreshDatabaseConnections };
