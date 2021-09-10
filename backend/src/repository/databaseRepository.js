const { execute, query, queryOne } = require('../database/sqlite');
module.exports = {
  async save(type, client, host, port, database, user, password) {
    const configuration = await this.getDb(type, client);
    if (configuration) {
      await execute('DELETE FROM database WHERE type = ? AND client = ?;', [type, client]);
    }
    return execute('INSERT INTO database(type, client, host, port, database, user, password) VALUES (?,?,?,?,?,?,?);', [
      type,
      client,
      host,
      port,
      database,
      user,
      password,
    ]);
  },
  getAll(client) {
    return query('SELECT * FROM database WHERE client = ?', [client]);
  },
  get(type, client) {
    return queryOne('SELECT * FROM database WHERE type = ? AND client = ?', [type, client]);
  },
  delete(type, client) {
    return execute('DELETE FROM database WHERE type = ? AND client = ?', [type, client]);
  },
};
