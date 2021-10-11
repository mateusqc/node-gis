const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'user.db');

const query = (query, params = []) => {
  const db = new sqlite3.Database(dbPath);
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const queryOne = (query, params = []) => {
  const db = new sqlite3.Database(dbPath);
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const execute = (query, params = [], callbackSucess = () => {}, callbackError = (err) => {}) => {
  const db = new sqlite3.Database(dbPath);
  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
      db.close();
    });
  });
};

module.exports = { query, execute, queryOne };
