import { createContext } from 'react';
import MapStore from '../stores/mapStore';

const storesContext = createContext({
  mapStore: new MapStore(),
});

export default storesContext;
