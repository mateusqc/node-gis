import axios from 'axios';
import ApiEndpoints from '../constants/ApiEndpoints';
import env from "react-dotenv";
import corsHeaders from '../constants/RequestConfig';

class MapService {
  baseUrl = window._env_.BASE_API_URL;
  
  getTables() {
    return axios.get(`${this.baseUrl}${ApiEndpoints.tables}`, corsHeaders);
  }
  getLayer(layer, geometryColumn) {
    return axios.get(`${this.baseUrl}${ApiEndpoints.layer}/${layer}/${geometryColumn}`, corsHeaders);
  }
  getSpatialQuery(queryObject) {
    return axios.post(`${this.baseUrl}${ApiEndpoints.spatialQuery}`, queryObject, corsHeaders);
  }
  getQuery(queryObject) {
    return axios.post(`${this.baseUrl}${ApiEndpoints.query}`, queryObject, corsHeaders);
  }
  saveQueryIntoTable(queryObject) {
    return axios.post(`${this.baseUrl}${ApiEndpoints.queryToTable}`, queryObject, corsHeaders);
  }
}

export default MapService;
