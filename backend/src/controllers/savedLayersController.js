const repository = require('../repository/savedLayersRepository');

module.exports = {
  async save(request, response) {
    try {
      const { table, data } = request.body;
      const stringJson = JSON.stringify(data);
      await repository.save(table, stringJson);
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.log(err);
    }
  },
  async getAll(request, response) {
    try {
      const db = await repository.getAll();
      response.status(200).json(db);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
  async get(request, response) {
    try {
      const { table } = request.query;
      const db = await repository.get(table);
      response.status(200).json(db);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
  async delete(request, response) {
    try {
      const { table } = request.body;
      await repository.delete(table);
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.log(err);
    }
  },
  async deleteAll(request, response) {
    try {
      await repository.deleteAll();
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.log(err);
    }
  },
};
