const database = require('../database/postgres');

module.exports = {
  async getTablesNames() {
    return await database.query(
      "SELECT DISTINCT(c.table_name) as name FROM information_schema.columns c WHERE c.column_name  = 'geom'"
    );
  },

  async getColumns(table) {
    return await database.query(
      `SELECT column_name AS column FROM information_schema.columns WHERE table_name = \'${table}\' AND udt_name != 'geometry'`
    );
  },

  async getGeometryColmuns(table) {
    return await database.query(
      `SELECT col.column_name as geom_column FROM information_schema.columns col WHERE col.udt_name = 'geometry' and col.table_name = \'${table}\'`
    );
  },
};
