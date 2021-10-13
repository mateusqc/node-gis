const { query, getActiveDbConnection } = require('../database/builder');

function getParsedTableName(table) {
  const { dialect } = getActiveDbConnection();
  if (dialect === 'postgres' || dialect === 'cockroach') {
    return `\"${table}\"`;
  } else if (dialect === 'mariadb' || dialect === 'mysql') {
    return `\`${table}\``;
  } else {
    throw new Error('Operação não suportada para este Banco de Dados.');
  }
}

async function mountBaseUnionQuery(allData = {}, finalQuery = false) {
  const { dialect } = getActiveDbConnection();
  if (['mariadb', 'mysql'].includes(dialect)) {
    return mountBaseUnionQueryConcatText(allData, finalQuery, dialect === 'mariadb');
  } else {
    return mountBaseUnionQueryAgg(allData, finalQuery);
  }
}

/**
 * Constrói consulta de união de todas as feições passadas considerando que a função ST_Union não possui sobrecarga de agregação.
 * @param {*} allData
 * @param {*} finalQuery
 * @returns string contendo sql resultante
 */
async function mountBaseUnionQueryConcatText(allData = {}, finalQuery = false, isMariaDb = false) {
  let topQuery = 'T.geom';
  let tablesQuery = '';
  const tables = Object.keys(allData);

  let hasGids;
  for (let idx = 0; idx < tables.length; idx++) {
    const table = tables[idx];
    const parsedTableName = getParsedTableName(table);
    hasGids = allData[table].data.length > 0;

    const innerQuery = `SELECT ST_AsText(${allData[table].geometryColumn}) as geom_t FROM ${parsedTableName} ${
      hasGids ? 'WHERE gid IN (' + allData[table].data.join(',') + ')' : ''
    }`;

    const textGeometries = (await query(innerQuery)) ?? [];

    let innerUnionQuery = '';

    textGeometries.forEach(({ geom_t }, index) => {
      if (!innerUnionQuery) {
        innerUnionQuery = `ST_GeomFromText(\'${geom_t}\')`;
      } else {
        innerUnionQuery = `ST_Union(ST_GeomFromText(\'${geom_t}\'),${innerUnionQuery})`;
      }
    });

    innerUnionQuery = `SELECT ST_AsText(${innerUnionQuery}) as geom FROM DUAL`;

    let preUnionGeometry = await query(innerUnionQuery);

    if (preUnionGeometry.length > 0) {
      preUnionGeometry = preUnionGeometry[0].geom;
    } else {
      throw new Error('Erro ao construir as consultas bases de União!');
    }

    if (idx === 0) {
      tablesQuery = `ST_GeomFromText(\'${preUnionGeometry}\')`;
    } else {
      tablesQuery = `ST_Union(ST_GeomFromText(\'${preUnionGeometry}\'),${tablesQuery})`;
    }
  }

  tablesQuery = 'FROM ( SELECT ' + tablesQuery + ' as geom FROM DUAL';

  topQuery = `SELECT ${finalQuery ? 'ST_AsGeoJSON(' : ''} ${topQuery}`;

  topQuery += `${finalQuery ? ')' : ''} as ${finalQuery ? 'geometry' : 'geom'} `;

  return topQuery + tablesQuery + ') T';
}

// /**
//  * Constrói consulta de união de todas as feições passadas considerando que a função ST_Union não possui sobrecarga de agregação.
//  * @param {*} allData
//  * @param {*} finalQuery
//  * @returns string contendo sql resultante
//  */
// function mountBaseUnionQueryConcatText(allData = {}, finalQuery = false, isMariaDb = false) {
//   let topQuery = 'T.geom';
//   let tablesQuery = 'FROM (';
//   const tables = Object.keys(allData);

//   const getGeoTextConcat = (colName) => {
//     const innerElement = `concat('GEOMETRYCOLLECTION (', GROUP_CONCAT(ST_AsText(${colName})), ')')`;
//     return (
//       `ST_Union(ST_GeomFromText(${innerElement}), ` +
//       `ST_GeomFromText(${isMariaDb ? innerElement : 'GEOMETRYCOLLECTION EMPTY'}))`
//     );
//   };

//   let hasGids;
//   tables.forEach((table, idx) => {
//     const parsedTableName = getParsedTableName(table);
//     hasGids = allData[table].data.length > 0;

//     tablesQuery += ` (SELECT ${getGeoTextConcat(allData[table].geometryColumn)} as geom FROM ${parsedTableName} ${
//       hasGids ? 'WHERE gid IN (' + allData[table].data.join(',') + ')' : ''
//     }) ${idx + 1 < tables.length ? 'UNION' : ''} `;
//   });

//   topQuery = `SELECT ${finalQuery ? 'ST_AsGeoJSON(' : ''} ${topQuery}`;

//   topQuery += `${finalQuery ? ')' : ''} as ${finalQuery ? 'geometry' : 'geom'} `;

//   console.log(topQuery + tablesQuery + ') T');
//   return topQuery + tablesQuery + ') T';
// }

/**
 * Constrói consulta de união de todas as feições passadas utilizando uma função ST_Union de agregação.
 * @param {*} allData
 * @param {*} finalQuery
 * @returns string contendo sql resultante
 */
function mountBaseUnionQueryAgg(allData = {}, finalQuery = false) {
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

async function mountBySpatialFunction(dataA, dataB, func) {
  let topQuery = `SELECT ST_AsGeoJSON(${func}(A.geom, B.geom)) as geometry FROM `;

  const queryA = await mountBaseUnionQuery(dataA);
  const queryB = await mountBaseUnionQuery(dataB);

  return `${topQuery} (${queryA}) A, (${queryB}) B`;
}

module.exports = {
  async executeSql(sql) {
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getUnion(data = {}) {
    const sql = await mountBaseUnionQuery(data, true);
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getFromGeoFunction(dataA = {}, dataB = {}, func) {
    const sql = await mountBySpatialFunction(dataA, dataB, func);
    const data = await query(sql);
    return { data, query: sql };
  },

  async getFromBooleanFunction(dataA = {}, dataB = {}, func, invertCondition) {
    let topQuery = 'SELECT ST_AsGeoJSON(B.geom) as geometry FROM ';

    const queryA = await mountBaseUnionQuery(dataA);
    const queryB = await mountBaseUnionQuery(dataB);

    const sql = `${topQuery} (${queryA}) A, (${queryB}) B WHERE ${func}${
      invertCondition ? '(B.geom, A.geom)' : '(A.geom, B.geom)'
    }`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getArea(data = {}) {
    const { dialect } = getActiveDbConnection();
    const unionSql = await mountBaseUnionQuery(data);
    const sql = `SELECT ST_Area(A.geom${['mysql', 'mariadb'].includes(dialect) ? '' : ', TRUE'})${
      ['postgres', 'cockroach'].includes(dialect) ? '/(1000*1000)' : ''
    } as area_km2 FROM (${unionSql}) A`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getDistance(dataA = {}, dataB = {}) {
    let topQuery = 'SELECT ST_Distance(A.geom, B.geom, TRUE)/1000 as dist_km FROM ';

    const queryA = await mountBaseUnionQuery(dataA);
    const queryB = await mountBaseUnionQuery(dataB);

    const sql = `${topQuery} (${queryA}) A, (${queryB}) B`;
    const data = await query(sql);
    return { data, query: sql };
  },

  async getLength(data = {}) {
    let topQuery = 'SELECT ST_Length(A.geom, TRUE)/1000 as len_km FROM ';

    const queryA = await mountBaseUnionQuery(data);

    const sql = `${topQuery} (${queryA}) A`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getPerimeter(data = {}) {
    let topQuery = 'SELECT ST_Perimeter(A.geom, TRUE)/1000 as perim_km FROM ';

    const queryA = await mountBaseUnionQuery(data);

    const sql = `${topQuery} (${queryA}) A`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getBuffer(data = {}, radius) {
    let topQuery = `SELECT ST_AsGeoJSON(ST_Buffer(A.geom, ${radius})) as geometry FROM `;

    const queryA = await mountBaseUnionQuery(data);

    const sql = `${topQuery} (${queryA}) A`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async getCentroid(data = {}) {
    let topQuery = `SELECT ST_AsGeoJSON(ST_Centroid(A.geom)) as geometry FROM `;

    const queryA = await mountBaseUnionQuery(data);

    const sql = `${topQuery} (${queryA}) A`;
    const result = await query(sql);
    return { data: result, query: sql };
  },

  async saveQueryToTable(tableName, sql) {
    if (!tableName) {
      throw 'É necessário definir o nome da tabela de destino!';
    }

    await query(`CREATE TABLE ${tableName} (
      GID SERIAL PRIMARY KEY,
      GEOM GEOMETRY
    )`);

    if (sql.includes('ST_AsGeoJSON')) {
      sql = sql.replace('ST_AsGeoJSON', '');
    }

    await query(`INSERT INTO ${tableName} (geom) ${sql}`);
  },
};
