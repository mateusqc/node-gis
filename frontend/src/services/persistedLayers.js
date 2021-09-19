import axios from 'axios';
import ApiEndpoints from '../constants/ApiEndpoints';

class PersistedLayersService {
  getLayers() {
    return axios.get(`${ApiEndpoints.baseUrl}${ApiEndpoints.persistedLayers}/all`);
  }
  getLayer(tableName) {
    return axios.get(`${ApiEndpoints.baseUrl}${ApiEndpoints.persistedLayers}?table=${tableName}`);
  }
  saveLayer(databaseConfig) {
    return axios.post(`${ApiEndpoints.baseUrl}${ApiEndpoints.persistedLayers}`, databaseConfig);
  }
  deleteLayer(databaseConfig) {
    return axios.delete(`${ApiEndpoints.baseUrl}${ApiEndpoints.persistedLayers}`, databaseConfig);
  }
  deleteAll() {
    return axios.delete(`${ApiEndpoints.baseUrl}${ApiEndpoints.persistedLayers}/all`);
  }
}

export default PersistedLayersService;
