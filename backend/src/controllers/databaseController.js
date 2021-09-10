const repository = require('../repository/databaseRepository');

module.exports = {
  async save(request, response) {
    try {
      const { type, client, host, port, database, user, password } = request.body;
      await repository.save(type, client, host, port, database, user, password);
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.log(err);
    }
  },
  async getAll(request, response) {
    try {
      const { client } = request.query;
      const db = await repository.getAll(client);
      response.status(200).json(db);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
  async get(request, response) {
    try {
      const { type, client } = request.query;
      const db = await repository.get(type, client);
      response.status(200).json(db);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
  async delete(request, response) {
    try {
      const { type, client } = request.body;
      await repository.delete(type, client);
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.log(err);
    }
  },
};
