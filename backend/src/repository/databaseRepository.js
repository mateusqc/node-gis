const { refreshDatabaseConnections } = require('../database/builder');
const { execute, query, queryOne } = require('../database/sqlite');
module.exports = {
  async save({ type, host, port, database, user, password, dialect, active }) {
    const configuration = await this.get(type, dialect, host, port);
    if (configuration) {
      await execute('DELETE FROM database WHERE type = ? AND dialect = ? AND host = ? AND port = ?;', [type, client]);
    }
    const result = await execute(
      'INSERT INTO database(type, host, port, database, user, password, dialect, active) VALUES (?,?,?,?,?,?,?,?);',
      [type, host, port, database, user, password, dialect, active]
    );
    refreshDatabaseConnections();
    return result;
  },
  getAll() {
    return query('SELECT * FROM database');
  },
  get(type, dialect, host, port) {
    return queryOne('SELECT * FROM database WHERE type = ? AND dialect = ? AND host = ? AND port = ?', [
      type,
      dialect,
      host,
      port,
    ]);
  },
  async delete(type, dialect, host, port, user, database) {
    const result = await execute(
      'DELETE FROM database WHERE type = ? AND dialect = ? AND host = ? AND port = ? AND user = ? AND database = ?',
      [type, dialect, host, port, user, database]
    );
    refreshDatabaseConnections();
    return result;
  },
  async setActiveDatabase(dialect, host, port, user, database) {
    await execute("UPDATE DATABASE SET ACTIVE='false'");
    await execute(
      "UPDATE DATABASE SET ACTIVE='true' WHERE DIALECT = ? AND HOST = ? AND PORT = ? AND USER = ? AND DATABASE = ?",
      [dialect, host, port, user, database]
    );
    refreshDatabaseConnections();
  },
};
