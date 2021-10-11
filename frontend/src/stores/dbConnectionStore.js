import { observable, action, computed, makeAutoObservable, runInAction } from 'mobx';
import DbConnectionService from '../services/dbConnection';
import { showNotification } from '../utils/utils';

class DbConnectionStore {
  service;
  databaseConnectionList = [];
  loading = false;

  constructor() {
    makeAutoObservable(this, {
      databaseConnectionList: observable,
      loading: observable,
      createConnection: action,
      deleteConnection: action,
      loadConnections: action,
      keyedDatabaseList: computed,
      setActiveDatabase: action,
    });

    this.service = new DbConnectionService();

    this.createConnection = this.createConnection.bind(this);
    this.deleteConnection = this.deleteConnection.bind(this);
    this.loadConnections = this.loadConnections.bind(this);
    this.setActiveDatabase = this.setActiveDatabase.bind(this);
  }

  get keyedDatabaseList() {
    return this.databaseConnectionList.map((db, idx) => ({ ...db, key: idx }));
  }

  loadConnections(callback) {
    const defaultClient = 'dev';
    this.loading = true;
    this.service
      .getClientDatabases(defaultClient)
      .then((response) => {
        runInAction(() => {
          this.databaseConnectionList = response.data;
          this.loading = false;
          if (callback) {
            callback();
          }
        });
      })
      .catch((error) => {
        runInAction(() => {
          showNotification('error', error ? error.toString() : null);
          this.loading = false;
        });
      });
  }

  createConnection(object, callback) {
    this.loading = true;
    this.service
      .setDatabase(object)
      .then((response) => {
        runInAction(() => {
          this.loading = false;
          if (response.status === 200) {
            showNotification('success', 'Conexão adicionada com sucesso!');
            if (callback) {
              callback();
            }
          } else {
            showNotification('error', 'Ocorreu um problema na configuração do banco de dados');
          }
        });
      })
      .catch((error) => {
        runInAction(() => {
          showNotification('error', error ? error.toString() : null);
          this.loading = false;
        });
      });
  }

  deleteConnection(object, callback) {
    this.loading = true;
    this.service
      .deleteDatabase(object)
      .then((response) => {
        runInAction(() => {
          this.loading = false;
          showNotification('success', 'Conexão removida com sucesso!');
          if (callback) {
            callback();
          }
        });
      })
      .catch((error) => {
        runInAction(() => {
          showNotification('error', error ? error.toString() : null);
          this.loading = false;
        });
      });
  }

  async setActiveDatabase(object) {
    this.loading = true;
    try {
      await this.service.setActiveDatabase(object);
      this.loadConnections();
    } catch (error) {
      showNotification('error', error ? error.toString() : null);
      this.loading = false;
    }
  }
}

export default DbConnectionStore;
