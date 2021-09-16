const { execute } = require('./database/sqlite');
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
  },
};
