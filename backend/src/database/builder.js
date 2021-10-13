const { query } = require('../database/sqlite');
const spatialite = require('spatialite');
const { Client } = require('pg');
const mariadb = require('mariadb');
require('dotenv').config();

let dbsConfiguration;
let activeConnection;

const refreshDatabaseConnections = async () => {
  dbsConfiguration = await query('SELECT * FROM database');
  activeConnection = -1;
  dbsConfiguration &&
    dbsConfiguration.length > 0 &&
    dbsConfiguration.forEach((config, idx) => {
      if (config.active && config.active === 'true') {
        activeConnection = idx;
      }
    });
};

const queryFromDb = async (queryText, ...otherParams) => {
  const { client, dialect } = await buildClient();
  if (dialect === 'sqlite') {
    return new Promise((resolve, reject) => {
      client.all(queryText, ...otherParams, (err, rows) => {
        client.close();
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  } else {
    const result = await client.query(queryText, ...otherParams);
    closeClient(client, dialect);
    return getReturnFromResult(result, dialect);
  }
};

const getReturnFromResult = (result, dialect) => {
  const propToAccess = {
    postgres: 'rows',
    mysql: 'rows',
    mariadb: 'rows',
    cockroach: 'rows',
  };

  if (['postgres', 'cockroach'].includes(dialect)) {
    return result[propToAccess[dialect]];
  } else {
    return result;
  }
};

const getActiveDbConnection = () => {
  if (dbsConfiguration !== undefined && dbsConfiguration !== null) {
    return dbsConfiguration[activeConnection];
  } else {
    throw new Error('Erro ao obter conexão ativa de banco de dados.');
  }
};

const buildClient = async (callback) => {
  const conf = getActiveDbConnection();
  if (!conf) {
    throw new Error('Configuração de banco de dados não definida.');
  }
  const { dialect } = conf;

  const connParams = {};
  ['user', 'password', 'host', 'port', 'database'].forEach((key) => {
    connParams[key] = conf[key];
  });

  let client;
  if (dialect === 'postgres') {
    client = new Client(connParams);
    client.connect();
  } else if (dialect === 'cockroach') {
    client = new Client(
      `postgres://${connParams.user}@${connParams.host}:${connParams.port}/${connParams.database}?sslmode=disable`
    );
    client.connect();
  } else if (dialect === 'mariadb' || dialect === 'mysql') {
    try {
      client = await mariadb.createConnection(connParams);
    } catch {
      throw new Error('Erro ao conectar com o banco de dados MariaDB.');
    }
    // } else if (dialect === 'mssql') {
    // client = { ...connParams, server: connParams.host, options: { trustServerCertificate: true } };
  } else if ('sqlite') {
    client = new spatialite.Database(connParams.host);
  } else {
    throw new Error('Banco de dados não suportado.');
  }
  return { client, dialect };
};

const closeClient = (client, dialect) => {
  const propToAccess = {
    postgres: 'end',
    mysql: 'end',
    mariadb: 'end',
    cockroach: 'end',
  };
  client[propToAccess[dialect]]();
};

module.exports = { refreshDatabaseConnections, query: queryFromDb, getActiveDbConnection };
