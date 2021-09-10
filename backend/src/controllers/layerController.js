const repository = require('../repository/layerRepository');
const tableRepository = require('../repository/tableRepository');

module.exports = {
  async index(request, response) {
    const layer = request.params.layer;
    const geometryColumn = request.params.geometryColumn;
    try {
      const columns = await tableRepository.getColumns(layer);
      const data = await repository.getLayer(layer, columns, geometryColumn);
      response.json(data);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
};
