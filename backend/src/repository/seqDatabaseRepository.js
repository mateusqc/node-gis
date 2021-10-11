const { execute, query, queryOne } = require('../database/sqlite');

const atts = ['type', 'host', 'database', 'username', 'password', 'port', 'dialect'];

const buildWhereClause = (params = {}) => {
  let whereClause = '';
  const paramValues = [];
  const keys = Object.keys(params);

  keys.forEach((paramKey) => {
    if (atts.includes(paramKey) && params[paramKey]) {
      whereClause += `${whereClause ? ' AND ' : ''} ${paramKey} = ? `;
      paramValues.push(params[paramKey]);
    }
  });

  return { paramValues, whereClause };
};

module.exports = {
  async save(type, host, database, username, password, port, dialect) {
    return execute(
      'INSERT INTO db_sequilize(type, host, database, username, password, port, dialect) VALUES (?,?,?,?,?,?,?);',
      [type, host, database, username, password, port, dialect]
    );
  },
  getAll(params = {}) {
    const { paramValues, whereClause } = buildWhereClause(params);
    if (whereClause) {
      return query(`SELECT * FROM db_sequilize WHERE ${whereClause}`, paramValues);
    } else {
      return query(`SELECT * FROM db_sequilize`);
    }
  },
  get(params = {}) {
    if (!Object.keys(params).length > 0) {
      throw 'Params must be passed!';
    }
    const { paramValues, whereClause } = buildWhereClause(params);
    return queryOne(`SELECT * FROM db_sequilize WHERE ${whereClause} `, paramValues);
  },
  delete(type, host, port, database) {
    return execute('DELETE FROM db_sequilize WHERE type = ? AND host = ? AND port = ? AND database = ?', [
      type,
      host,
      port,
      database,
    ]);
  },
};
