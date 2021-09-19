import axios from 'axios';
import ApiEndpoints from '../constants/ApiEndpoints';
import env from "react-dotenv";
import corsHeaders from '../constants/RequestConfig';

class DbConnectionService {
  baseUrl = window._env_.BASE_API_URL;

  getClientDatabases(client = 'dev') {
    return axios.get(`${this.baseUrl}${ApiEndpoints.database}/all?client=${client}`, corsHeaders);
  }
  getDatabase(type, client = 'dev') {
    return axios.get(`${this.baseUrl}${ApiEndpoints.database}?client=${client}&type=${type}`, corsHeaders);
  }
  setDatabase(databaseConfig) {
    return axios.post(`${this.baseUrl}${ApiEndpoints.database}`, databaseConfig, corsHeaders);
  }
  deleteDatabase(databaseConfig) {
    return axios.delete(`${this.baseUrl}${ApiEndpoints.database}`, databaseConfig, corsHeaders);
  }
}

export default DbConnectionService;
