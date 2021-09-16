const repository = require('../repository/seqDatabaseRepository');

module.exports = {
  async save(request, response) {
    try {
      const { type, host, database, username, password, port, dialect } = request.body;
      await repository.save(type, host, database, username, password, port, dialect);
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.log(err);
    }
  },
  async getAll(request, response) {
    try {
      // const { type } = request.query;
      const db = await repository.getAll(request.query);
      response.status(200).json(db);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
  async get(request, response) {
    try {
      const { type, host, port, database } = request.query;
      const db = await repository.get({ type, host, port, database });
      response.status(200).json(db);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
  async delete(request, response) {
    try {
      const { type, host, port, database } = request.body;
      await repository.delete(type, host, port, database);
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.log(err);
    }
  },
};
