const { query, getActiveDbConnection } = require('../database/builder');

module.exports = {
  async getTablesNames() {
    const result = await query(getTableNameQuery());
    return result;
  },

  async getColumns(table) {
    return await query(getColumnsMetadata(table));
  },

  async getGeometryColmuns(table) {
    return await query(getColumnsMetadata(table, true));
  },
};

const getTableNameQuery = () => {
  const dbParams = getActiveDbConnection();
  let resultQuery = '';
  if (dbParams.dialect === 'postgres' || dbParams.dialect === 'cockroach') {
    resultQuery = `select table_name as name from information_schema.columns where udt_name = 'geometry' and is_updatable = 'YES' and table_schema = '${dbParams.database}'`;
  } else if (dbParams.dialect === 'mariadb' || dbParams.dialect === 'mysql') {
    resultQuery =
      'select col.table_name as name ' +
      'from information_schema.columns col' +
      ' join information_schema.tables tab' +
      ' on col.table_schema = tab.table_schema' +
      ' and col.table_name = tab.table_name' +
      " and table_type = 'BASE TABLE'" +
      " where col.data_type in ('geometry', 'point', 'linestring', 'polygon'," +
      " 'multipoint', 'multilinestring', 'multipolygon'," +
      " 'geometrycollection')" +
      " and col.table_schema not in ('information_schema', 'sys'," +
      " 'performance_schema', 'mysql')" +
      ` and col.table_schema = '${dbParams.database}'` +
      ' order by col.table_schema,' +
      ' col.table_name';
  } else if (dbParams.dialect === 'mssql') {
    resultQuery = `select table_name as name from information_schema.columns where DATA_TYPE = 'geometry' AND table_schema = '${dbParams.database}'`;
  } else if (dbParams.dialect === 'sqlite') {
    resultQuery = `SELECT m.name as name FROM sqlite_master AS m, pragma_table_info(m.name) AS p WHERE UPPER(p.type) in ('POINT', 'LINESTRING', 'POLYGON', 'MULTIPOINT', 'MULTILINESTRING', 'MULTIPOLYGON', 'GEOMETRYCOLLECTION')`;
  } else {
    throw new Error('Operação não suportada para este Banco de Dados.');
  }
  return resultQuery;
};

const getColumnsMetadata = (table, spatialOnly = false) => {
  const dbParams = getActiveDbConnection();
  let resultQuery = '';
  if (dbParams.dialect === 'postgres' || dbParams.dialect === 'cockroach') {
    resultQuery = `SELECT column_name AS ${
      spatialOnly ? 'geom_' : 'norm_'
    }column FROM information_schema.columns WHERE table_name = '${table}' and table_schema = '${
      dbParams.database
    }' AND udt_name ${spatialOnly ? '=' : '!='} 'geometry'`;
  } else if (dbParams.dialect === 'mariadb' || dbParams.dialect === 'mysql') {
    resultQuery =
      `select COLUMN_NAME as ${spatialOnly ? 'geom_' : 'norm_'}column from information_schema.columns ` +
      ` where TABLE_NAME = '${table}' ` +
      ` and data_type ${spatialOnly ? '' : 'not'} in ('geometry', 'point', 'linestring', 'polygon', ` +
      " 'multipoint', 'multilinestring', 'multipolygon', " +
      " 'geometrycollection')";
  } else if (dbParams.dialect === 'mssql') {
    resultQuery = `SELECT COLUMN_NAME AS ${
      spatialOnly ? 'geom_' : 'norm_'
    }column from information_schema.columns where TABLE_NAME = '${table}' AND DATA_TYPE ${
      spatialOnly ? '=' : '!='
    } 'geometry' AND table_schema = '${dbParams.database}'`;
  } else {
    throw new Error('Operação não suportada para este Banco de Dados.');
  }
  return resultQuery;
};
