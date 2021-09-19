const { execute, query, queryOne } = require('../database/sqlite');
module.exports = {
  async save(table, json) {
    const savedLayer = await this.get(table);
    if (savedLayer) {
      await execute('DELETE FROM saved_layers WHERE table_name = ?;', [table]);
    }
    return execute('INSERT INTO saved_layers(table_name, json) VALUES (?,?);', [table, json]);
  },
  getAll() {
    return query('SELECT * FROM saved_layers');
  },
  get(table) {
    return queryOne('SELECT * FROM saved_layers WHERE table_name = ?;', [table]);
  },
  delete(table) {
    return execute('DELETE FROM saved_layers WHERE table_name = ?;', [table]);
  },
  deleteAll() {
    return execute('DELETE FROM saved_layers;');
  },
};
