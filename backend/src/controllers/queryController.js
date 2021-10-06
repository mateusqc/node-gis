const repository = require('../repository/queryRepository');

const validationSql = (sql) => {
  ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'CREATE', 'ALTER'].forEach((opr) => {
    if (sql.toUpperCase().includes(opr)) {
      throw new Error('Operação não permitida.');
    }
  });
};

module.exports = {
  async spatialQuery(request, response) {
    try {
      const { first, second, operation, auxiliar } = request.body;
      let data;
      switch (operation) {
        case 'union':
          data = await repository.getUnion(first);
          break;
        case 'diff':
          data = await repository.getFromGeoFunction(first, second, 'ST_Difference');
          break;
        case 'intersection':
          data = await repository.getFromGeoFunction(first, second, 'ST_Intersection');
          break;
        case 'contains':
          data = await repository.getFromBooleanFunction(first, second, 'ST_Contains');
          break;
        case 'crosses':
          data = await repository.getFromBooleanFunction(first, second, 'ST_Crosses');
          break;
        case 'touches':
          data = await repository.getFromBooleanFunction(first, second, 'ST_Touches');
          break;
        case 'within':
          data = await repository.getFromBooleanFunction(first, second, 'ST_Within', true);
          break;
        case 'disjoint':
          data = await repository.getFromBooleanFunction(first, second, 'ST_Disjoint');
          break;
        case 'intersects':
          data = await repository.getFromBooleanFunction(first, second, 'ST_Intersects');
          break;
        case 'area':
          data = await repository.getArea(first);
          break;
        case 'distance':
          data = await repository.getDistance(first, second);
          break;
        case 'length':
          data = await repository.getLength(first);
          break;
        case 'perimeter':
          data = await repository.getPerimeter(first);
          break;
        case 'buffer':
          data = await repository.getBuffer(first, auxiliar);
          break;
        case 'centroid':
          data = await repository.getCentroid(first);
          break;
      }
      response.status(200).json(data);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
  async sql(request, response) {
    try {
      const { sql } = request.body;
      validationSql(sql);
      const data = await repository.executeSql(sql);
      response.status(200).json(data);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
  async saveQueryIntoTable(request, response) {
    try {
      const { tableName, sql } = request.body;
      validationSql(sql);
      validationSql(tableName);
      await repository.saveQueryToTable(tableName, sql);
      response.status(200).json({});
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
};
