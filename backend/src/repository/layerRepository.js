const database = require('../database/postgres');

module.exports = {
  async getLayer(table, columns, geometryColumn) {
    const cols = await columns
      .map((c) => {
        return c.column;
      })
      .join(',');
    return await database.query(
      `SELECT  ${cols}, ST_AsGeoJSON(t.${geometryColumn}) AS geometry  FROM \"${table}\" t`
    );
  },
};
