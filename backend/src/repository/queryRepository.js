const database = require('../database/postgres');

function mountBaseUnionQuery(allData = {}, finalQuery = false) {
  let topQuery = '';
  let tablesQuery = 'FROM ';
  const tables = Object.keys(allData);

  let hasGids;
  tables.forEach((table, idx) => {
    hasGids = allData[table].data.length > 0;

    topQuery += `t${idx}.geom${idx + 1 < tables.length ? ',' : ''} `;
    tablesQuery += ` (SELECT ${hasGids ? 'ST_Union(' : ''}${allData[table].geometryColumn}${
      hasGids ? ')' : ''
    } as geom FROM "${table}" ${hasGids ? 'WHERE gid IN (' + allData[table].data.join(',') + ')' : ''}) t${idx}${
      idx + 1 < tables.length ? ',' : ''
    } `;
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
    const result = await database.query(sql);
    return { data: result, query: sql };
  },

  async getUnion(data = {}) {
    const query = mountBaseUnionQuery(data, true);
    const result = await database.query(query);
    return { data: result, query };
  },

  async getFromGeoFunction(dataA = {}, dataB = {}, func) {
    const query = mountBySpatialFunction(dataA, dataB, func);
    const data = await database.query(query);
    return { data, query };
  },

  async getFromBooleanFunction(dataA = {}, dataB = {}, func, invertCondition) {
    let topQuery = 'SELECT ST_AsGeoJSON(B.geom) as geometry FROM ';

    const queryA = mountBaseUnionQuery(dataA);
    const queryB = mountBaseUnionQuery(dataB);

    const query = `${topQuery} (${queryA}) A, (${queryB}) B WHERE ${func}${
      invertCondition ? '(B.geom, A.geom)' : '(A.geom, B.geom)'
    }`;
    const result = await database.query(query);
    return { data: result, query };
  },

  async getArea(data = {}) {
    const query = `SELECT ST_Area(ST_Union(A.geom), TRUE)/(1000*1000) as area_km2 FROM (${mountBaseUnionQuery(
      data
    )}) A`;
    const result = await database.query(query);
    return { data: result, query };
  },

  async getDistance(dataA = {}, dataB = {}) {
    let topQuery = 'SELECT ST_Distance(A.geom, B.geom, TRUE)/1000 as dist_km FROM ';

    const queryA = mountBaseUnionQuery(dataA);
    const queryB = mountBaseUnionQuery(dataB);

    const query = `${topQuery} (${queryA}) A, (${queryB}) B`;
    const data = await database.query(query);
    return { data, query };
  },

  async getLength(data = {}) {
    let topQuery = 'SELECT ST_Length(A.geom, TRUE)/1000 as len_km FROM ';

    const queryA = mountBaseUnionQuery(data);

    const query = `${topQuery} (${queryA}) A`;
    const result = await database.query(query);
    return { data: result, query };
  },

  async getPerimeter(data = {}) {
    let topQuery = 'SELECT ST_Perimeter(A.geom, TRUE)/1000 as perim_km FROM ';

    const queryA = mountBaseUnionQuery(data);

    const query = `${topQuery} (${queryA}) A`;
    const result = await database.query(query);
    return { data: result, query };
  },

  async getBuffer(data = {}, radius) {
    let topQuery = `SELECT ST_AsGeoJSON(ST_Buffer(A.geom, ${radius})) as geometry FROM `;

    const queryA = mountBaseUnionQuery(data);

    const query = `${topQuery} (${queryA}) A`;
    const result = await database.query(query);
    return { data: result, query };
  },

  async getCentroid(data = {}) {
    let topQuery = `SELECT ST_AsGeoJSON(ST_Union(ST_Centroid(A.geom))) as geometry FROM `;

    const queryA = mountBaseUnionQuery(data);

    const query = `${topQuery} (${queryA}) A`;
    const result = await database.query(query);
    return { data: result, query };
  },

  async saveQueryToTable(tableName, sql) {
    if (!tableName) {
      throw 'É necessário definir o nome da tabela de destino!';
    }

    await database.query(`CREATE TABLE ${tableName} (
      ID SERIAL PRIMARY KEY,
      GID SERIAL,
      GEOM GEOMETRY
    )`);

    if (sql.includes('ST_AsGeoJSON')) {
      sql = sql.replace('ST_AsGeoJSON', '');
    }

    await database.query(`INSERT INTO ${tableName} (geom) ${sql}`);
  },
};
