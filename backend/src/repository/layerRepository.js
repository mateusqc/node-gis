const { query, getActiveDbConnection } = require('../database/builder');

module.exports = {
  async getLayer(table, columns, geometryColumn) {
    const cols = await columns
      .map((c) => {
        return c.norm_column;
      })
      .join(',');
    return query(buildLayerQuery(cols, geometryColumn, table));
  },
};

const buildLayerQuery = (cols = [], geometryColumn, table) => {
  const dbParams = getActiveDbConnection();
  let resultQuery = '';
  if (dbParams.dialect === 'postgres' || dbParams.dialect === 'cockroach') {
    resultQuery = `SELECT  ${
      cols.length > 0 ? cols + ',' : ''
    } ST_AsGeoJSON(t.${geometryColumn}) AS geometry  FROM \"${table}\" t`;
  } else if (dbParams.dialect === 'mariadb' || dbParams.dialect === 'mysql') {
    resultQuery = `SELECT  ${
      cols.length > 0 ? cols + ',' : ''
    } ST_AsGeoJSON(t.${geometryColumn}) AS geometry  FROM \`${table}\` t`;
  } else {
    throw new Error('Banco de Dados não suportado.');
  }
  return resultQuery;
};
