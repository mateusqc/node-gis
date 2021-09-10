const repository = require('../repository/userRepository');

module.exports = {
  async saveDb(request, response) {
    try {
      const { type, client, host, port, database, user, password } = request.body;
      await repository.saveDb(type, client, host, port, database, user, password);
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.log(err);
    }
  },
  async getDb(request, response) {
    try {
      const { client } = request.query;
      const db = await repository.getDb(client);
      response.status(200).json(db);
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.error(err);
    }
  },
  async deleteDb(request, response) {
    try {
      const { type, client } = request.body;
      await repository.deleteDb(type, client);
      response.status(200).json();
    } catch (err) {
      response.status(500).json({ message: err.message });
      console.log(err);
    }
  },
};
