import axios from 'axios';
import ApiEndpoints from '../constants/ApiEndpoints';
import env from "react-dotenv";
import corsHeaders from '../constants/RequestConfig';

class PersistedLayersService {
  baseUrl = window._env_.BASE_API_URL;

  getLayers() {
    return axios.get(`${this.baseUrl}${ApiEndpoints.persistedLayers}/all`, corsHeaders);
  }
  getLayer(tableName) {
    return axios.get(`${this.baseUrl}${ApiEndpoints.persistedLayers}?table=${tableName}`, corsHeaders);
  }
  saveLayer(databaseConfig) {
    return axios.post(`${this.baseUrl}${ApiEndpoints.persistedLayers}`, databaseConfig, corsHeaders);
  }
  deleteLayer(databaseConfig) {
    return axios.delete(`${this.baseUrl}${ApiEndpoints.persistedLayers}`, databaseConfig, corsHeaders);
  }
  deleteAll() {
    return axios.delete(`${this.baseUrl}${ApiEndpoints.persistedLayers}/all`, corsHeaders);
  }
}

export default PersistedLayersService;
