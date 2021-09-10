const { execute, queryOne } = require('../database/sqlite');
module.exports = {
  async saveDb(type, client, host, port, database, user, password) {
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
  getDb(client) {
    return queryOne('SELECT * FROM database WHERE client = ?', [client]);
  },
  deleteDb(type, client) {
    return execute('DELETE FROM database WHERE type = ? AND client = ?', [type, client]);
  },
};
