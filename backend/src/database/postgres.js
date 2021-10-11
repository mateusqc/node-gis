const pg = require('pg');
const { get } = require('../repository/databaseRepository');

const TYPE = 'postgres';
const DIALECT = 'postgres';
const HOST = process.env.DB_IP_ADRESS;
const PORT = process.env.DB_PORT;

const getClient = async () => {
  const db = await get(TYPE, DIALECT, HOST, PORT);
  console.log(db);
  if (db) {
    const client = new pg.Client(db);
    client.connect();
    return client;
  } else {
    throw new Error('Configuração de banco de dados não definida.');
  }
};

const query = async (query) => {
  const client = await getClient();
  if (client) {
    const { rows } = await client.query(query);
    client.end();
    return rows;
  }
};

module.exports = { query };
