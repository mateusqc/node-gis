const { getDbConnections } = require('../database/builder');
const database = require('../database/postgres');

module.exports = {
  async getTablesNames() {
    const result = [];
    const promises = [];
    getDbConnections().forEach((db) => {
      promises.push(
        db.query(
          "SELECT DISTINCT(c.table_name) as name FROM information_schema.columns c WHERE c.column_name  = 'geom'",
          { type: db.QueryTypes.SELECT }
        )
      );
    });
    const responses = await Promise.all(promises);
    responses.forEach((res) => {
      res && result.push(...res);
    });
    return result;
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
