import axios from 'axios';
import ApiEndpoints from '../constants/ApiEndpoints';

class MapService {
  getTables() {
    return axios.get(`${ApiEndpoints.baseUrl}${ApiEndpoints.tables}`);
  }
  getLayer(layer, geometryColumn) {
    return axios.get(`${ApiEndpoints.baseUrl}${ApiEndpoints.layer}/${layer}/${geometryColumn}`);
  }
  getSpatialQuery(queryObject) {
    return axios.post(`${ApiEndpoints.baseUrl}${ApiEndpoints.spatialQuery}`, queryObject);
  }
  getQuery(queryObject) {
    return axios.post(`${ApiEndpoints.baseUrl}${ApiEndpoints.query}`, queryObject);
  }
}

export default MapService;
