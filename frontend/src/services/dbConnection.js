import axios from 'axios';
import ApiEndpoints from '../constants/ApiEndpoints';

class DbConnectionService {
  getClientDatabases(client = 'dev') {
    return axios.get(`${ApiEndpoints.baseUrl}${ApiEndpoints.database}/all?client=${client}`);
  }
  getDatabase(type, client = 'dev') {
    return axios.get(`${ApiEndpoints.baseUrl}${ApiEndpoints.database}?client=${client}&type=${type}`);
  }
  setDatabase(databaseConfig) {
    return axios.post(`${ApiEndpoints.baseUrl}${ApiEndpoints.database}`, databaseConfig);
  }
  deleteDatabase(databaseConfig) {
    return axios.delete(`${ApiEndpoints.baseUrl}${ApiEndpoints.database}`, databaseConfig);
  }
}

export default DbConnectionService;
