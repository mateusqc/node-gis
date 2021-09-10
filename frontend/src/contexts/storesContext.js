import { createContext } from 'react';
import DbConnectionStore from '../stores/dbConnectionStore';
import MapStore from '../stores/mapStore';

const storesContext = createContext({
  mapStore: new MapStore(),
  dbConnectionStore: new DbConnectionStore(),
});

export default storesContext;
