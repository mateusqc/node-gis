const { execute, queryOne } = require('./database/sqlite');
module.exports = {
  async ddlUser() {
    execute(
      'CREATE TABLE IF NOT EXISTS db_sequilize (\
            type TEXT,\
            host TEXT,\
            port INTEGER,\
            username TEXT,\
            password TEXT,\
            database TEXT,\
            dialect TEXT,\
            CONSTRAINT database_pk PRIMARY KEY(type, host, port, database));'
    );

    const configuration = await queryOne('SELECT * FROM database WHERE type = \'postgresql\' AND dialect = \'postgresql\'');
    if (configuration) {
      execute('UPDATE database SET host = ?, port = ? WHERE type = \'postgresql\' AND client = \'dev\';', [
        process.env.DB_IP_ADRESS,
        process.env.DB_PORT
      ]);
    } else {
      execute('INSERT INTO database(type, host, port, database, username, password) VALUES (?,?,?,?,?,?,?);', [
        'postgresql',
        process.env.DB_IP_ADRESS,
        process.env.DB_PORT,
        'postgres',
        'postgres',
        'postgres',
      ]);
    }

    execute(
      'CREATE TABLE IF NOT EXISTS saved_layers (\
                table_name TEXT,\
                json TEXT,\
                CONSTRAINT saved_layers_pk PRIMARY KEY(table_name));'
    );
  },
};
