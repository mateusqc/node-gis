import axios from 'axios';
import ApiEndpoints from '../constants/ApiEndpoints';
import env from 'react-dotenv';
import corsHeaders from '../constants/RequestConfig';

class DbConnectionService {
  baseUrl = window._env_.BASE_API_URL;

  getClientDatabases() {
    return axios.get(`${this.baseUrl}${ApiEndpoints.database}/all`, corsHeaders);
  }
  getDatabase(type, dialect, host, port) {
    return axios.get(
      `${this.baseUrl}${ApiEndpoints.database}?type=${type}&dialect=${dialect}&host=${host}&port=${port}`,
      corsHeaders
    );
  }
  setDatabase(databaseConfig) {
    return axios.post(`${this.baseUrl}${ApiEndpoints.database}`, databaseConfig, corsHeaders);
  }
  deleteDatabase(databaseConfig) {
    return axios.delete(`${this.baseUrl}${ApiEndpoints.database}`, databaseConfig, corsHeaders);
  }
  setActiveDatabase(databaseConfig) {
    return axios.post(`${this.baseUrl}${ApiEndpoints.database}/set-active`, databaseConfig, corsHeaders);
  }
}

export default DbConnectionService;
