const { execute, queryOne } = require('./database/sqlite');
module.exports = {
  async ddlUser() {
    execute(
      'CREATE TABLE IF NOT EXISTS database (\
            type TEXT,\
            client TEXT,\
            host TEXT,\
            port INTEGER,\
            user TEXT,\
            password TEXT,\
            database TEXT,\
            CONSTRAINT database_pk PRIMARY KEY(type, client));'
    );

    const configuration = await queryOne('SELECT * FROM database WHERE type = \'postgresql\' AND client = \'dev\'');
    if (configuration) {
      execute('UPDATE database SET host = ?, port = ? WHERE type = \'postgresql\' AND client = \'dev\';', [
        process.env.DB_IP_ADRESS,
        process.env.PROFILE === 'PROD' ? 5432 : 15432
      ]);
    } else {
      execute('INSERT INTO database(type, client, host, port, database, user, password) VALUES (?,?,?,?,?,?,?);', [
        'postgresql',
        'dev',
        process.env.DB_IP_ADRESS,
        process.env.PROFILE === 'PROD' ? 5432 : 15432,
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
