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
      'CREATE TABLE IF NOT EXISTS saved_layers (\
                table_name TEXT,\
                json TEXT,\
                CONSTRAINT saved_layers_pk PRIMARY KEY(table_name));'
    );
  },
};
