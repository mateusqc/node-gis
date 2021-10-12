const repository = require('../repository/tableRepository');

module.exports = {
  async index(_, response) {
    try {
      const data = await repository.getTablesNames();
      let i = 0;
      let result = [];
      let table;
      let columns;
      let geometryColumns;
      while (i < data.length) {
        table = data[i].name;
        columns = await repository.getColumns(table);
        geometryColumns = await repository.getGeometryColmuns(table);
        result = [
          ...result,
          {
            name: table,
            columns: columns.map((t) => {
              return t.norm_column;
            }),
            geometryColumns: geometryColumns.map((col) => {
              return col.geom_column;
            }),
          },
        ];
        i += 1;
      }
      response.json(result);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
};
