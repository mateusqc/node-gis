const repository = require('../repository/databaseRepository');

module.exports = {
  async save(request, response) {
    try {
      await repository.save(request.body);
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
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
      const { type, dialect, host, port } = request.query;
      const db = await repository.get(type, dialect, host, port);
      response.status(200).json(db);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
  async delete(request, response) {
    try {
      const { type, dialect, host, port, user, database } = request.body;
      if (!type || !dialect || !host || !port || !user || !database) {
        throw new Error('Parâmetros de remoção inválidos.');
      }
      await repository.delete(type, dialect, host, port, user, database);
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
  async setActiveDatabase(request, response) {
    try {
      const { dialect, host, port, user, database } = request.body;
      await repository.setActiveDatabase(dialect, host, port, user, database);
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
};
