const { execute, query, queryOne } = require('../database/sqlite');
const { Client } = require('pg');
const mysql = require('mysql2');
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

const queryFromDb = async (queryText) => {
  const { client, dialect } = await buildClient();
  const result = await client.query(queryText);

  closeClient(client, dialect);
  return getReturnFromResult(result, dialect);
  // return result[propToAccess[dialect]];
};

const getReturnFromResult = (result, dialect) => {
  const propToAccess = {
    postgres: 'rows',
    mysql: 'results',
    mariadb: 'rows',
  };

  if (['postgres', 'mysql'].includes(dialect)) {
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

const buildClient = async () => {
  const conf = getActiveDbConnection();
  if (!conf) {
    throw new Error('Configuração de banco de dados não definida.');
  }
  const { dialect } = conf;

  const connParams = {};
  ['user', 'password', 'host', 'port', 'database'].forEach((key) => {
    connParams[key] = conf[key];
  });

  console.log('entrou');
  console.log(connParams);

  let client;
  if (dialect === 'postgres') {
    client = new Client(connParams);
    client.connect();
  } else if (dialect === 'mysql') {
    client = mysql.createConnection(connParams);
    client.connect();
  } else if (dialect === 'mariadb') {
    try {
      client = await mariadb.createConnection(connParams);
    } catch {
      throw new Error('Erro ao conectar com o banco de dados MariaDB.');
    }
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
  };
  client[propToAccess[dialect]]();
};

module.exports = { refreshDatabaseConnections, query: queryFromDb, getActiveDbConnection };
