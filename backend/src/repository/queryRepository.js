const { query, getActiveDbConnection } = require('../database/builder');

function getParsedTableName(table) {
  const { dialect } = getActiveDbConnection();
  if (dialect === 'postgres') {
    return `\"${table}\"`;
  } else if (dialect === 'mariadb') {
    return `\`${table}\``;
  } else {
    throw new Error('Operação não suportada para este Banco de Dados.');
  }
}

function mountBaseUnionQuery(allData = {}, finalQuery = false) {
  let topQuery = '';
  let tablesQuery = 'FROM ';
  const tables = Object.keys(allData);

  let hasGids;
  tables.forEach((table, idx) => {
    const parsedTableName = getParsedTableName(table);
    hasGids = allData[table].data.length > 0;

    topQuery += `t${idx}.geom${idx + 1 < tables.length ? ',' : ''} `;
    tablesQuery += ` (SELECT ${hasGids ? 'ST_Union(' : ''}${allData[table].geometryColumn}${
      hasGids ? ')' : ''
    } as geom FROM ${parsedTableName} ${
      hasGids ? 'WHERE gid IN (' + allData[table].data.join(',') + ')' : ''
    }) t${idx}${idx + 1 < tables.length ? ',' : ''} `;
  });

  topQuery = `SELECT ${finalQuery ? 'ST_AsGeoJSON(' : ''}${hasGids ? 'ST_Union(' : ''} ${topQuery}`;

  topQuery += `${finalQuery ? ')' : ''}${hasGids ? ')' : ''} as ${finalQuery ? 'geometry' : 'geom'} `;

  return topQuery + tablesQuery;
}

function mountBySpatialFunction(dataA, dataB, func) {
  let topQuery = `SELECT ST_AsGeoJSON(${func}(A.geom, B.geom)) as geometry FROM `;

  const queryA = mountBaseUnionQuery(dataA);
  const queryB = mountBaseUnionQuery(dataB);

  return `${topQuery} (${queryA}) A, (${queryB}) B`;
}

module.exports = {
  async executeSql(sql) {
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getUnion(data = {}) {
    const sql = mountBaseUnionQuery(data, true);
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getFromGeoFunction(dataA = {}, dataB = {}, func) {
    const sql = mountBySpatialFunction(dataA, dataB, func);
    const data = await query(sql);
    return { data, query: sql };
  },

  async getFromBooleanFunction(dataA = {}, dataB = {}, func, invertCondition) {
    let topQuery = 'SELECT ST_AsGeoJSON(B.geom) as geometry FROM ';

    const queryA = mountBaseUnionQuery(dataA);
    const queryB = mountBaseUnionQuery(dataB);

    const sql = `${topQuery} (${queryA}) A, (${queryB}) B WHERE ${func}${
      invertCondition ? '(B.geom, A.geom)' : '(A.geom, B.geom)'
    }`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getArea(data = {}) {
    const sql = `SELECT ST_Area(ST_Union(A.geom), TRUE)/(1000*1000) as area_km2 FROM (${mountBaseUnionQuery(data)}) A`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getDistance(dataA = {}, dataB = {}) {
    let topQuery = 'SELECT ST_Distance(A.geom, B.geom, TRUE)/1000 as dist_km FROM ';

    const queryA = mountBaseUnionQuery(dataA);
    const queryB = mountBaseUnionQuery(dataB);

    const sql = `${topQuery} (${queryA}) A, (${queryB}) B`;
    const data = await query(sql);
    return { data, query: sql };
  },

  async getLength(data = {}) {
    let topQuery = 'SELECT ST_Length(A.geom, TRUE)/1000 as len_km FROM ';

    const queryA = mountBaseUnionQuery(data);

    const sql = `${topQuery} (${queryA}) A`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getPerimeter(data = {}) {
    let topQuery = 'SELECT ST_Perimeter(A.geom, TRUE)/1000 as perim_km FROM ';

    const queryA = mountBaseUnionQuery(data);

    const sql = `${topQuery} (${queryA}) A`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getBuffer(data = {}, radius) {
    let topQuery = `SELECT ST_AsGeoJSON(ST_Buffer(A.geom, ${radius})) as geometry FROM `;

    const queryA = mountBaseUnionQuery(data);

    const sql = `${topQuery} (${queryA}) A`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getCentroid(data = {}) {
    let topQuery = `SELECT ST_AsGeoJSON(ST_Union(ST_Centroid(A.geom))) as geometry FROM `;

    const queryA = mountBaseUnionQuery(data);

    const sql = `${topQuery} (${queryA}) A`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async saveQueryToTable(tableName, sql) {
    if (!tableName) {
      throw 'É necessário definir o nome da tabela de destino!';
    }

    await query(`CREATE TABLE ${tableName} (
      ID SERIAL PRIMARY KEY,
      GID SERIAL,
      GEOM GEOMETRY
    )`);

    if (sql.includes('ST_AsGeoJSON')) {
      sql = sql.replace('ST_AsGeoJSON', '');
    }

    await query(`INSERT INTO ${tableName} (geom) ${sql}`);
  },
};
