import axios from 'axios';
import ApiEndpoints from '../constants/ApiEndpoints';
import env from "react-dotenv";
// import corsHeaders from '../constants/RequestConfig';

const corsHeaders = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  }
}

class MapService {
  baseUrl = env.BASE_API_URL;
  
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
