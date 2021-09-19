import { observable, action, computed, makeAutoObservable, runInAction } from 'mobx';
import { getStyleWithColorFunction } from '../components/addLayerModal/utils';
import columns from '../constants/Columns';
import MapService from '../services/map';
import PersistedLayersService from '../services/persistedLayers';
import { showNotification } from '../utils/utils';
class MapStore {
  layersRefs = {};
  layersActive = {};
  layers = [];
  loadingMap = false;
  loading = false;
  availableLayers = [];
  service;
  layersColumns = columns;
  selectFeaturesMode = null;
  selectedFeatures = { first: {}, second: {} };
  loadingSpatialQuery = false;
  layersPersistanceService;

  constructor() {
    makeAutoObservable(this, {
      layersRefs: observable,
      layersActive: observable,
      layers: observable,
      loadingMap: observable,
      loading: observable,
      selectFeaturesMode: observable,
      loadingSpatialQuery: observable,
      layersKeys: computed,
      layersGeomColumns: computed,
      setLayerRef: action,
      toggleActiveLayer: action,
      changeLayerStatus: action,
      getAvailableLayers: action,
      addLayerToMap: action,
      toggleFeatureSelection: action,
      hasSelectionFirst: computed,
      hasSelectionSecond: computed,
      hasSelection: action,
      addFeatureToSelection: action,
      removeFeatureFromSelection: action,
      featureSelectionGids: computed,
      getLayerGeometryType: action,
      getLayerStyle: action,
      saveLayers: action,
      loadSavedLayers: action,
      saveQueryIntoTable: action,
    });

    this.service = new MapService();
    this.layersPersistanceService = new PersistedLayersService();

    this.setLayerRef = this.setLayerRef.bind(this);
    this.toggleActiveLayer = this.toggleActiveLayer.bind(this);
    this.changeLayerStatus = this.changeLayerStatus.bind(this);
    this.getAvailableLayers = this.getAvailableLayers.bind(this);
    this.addLayerToMap = this.addLayerToMap.bind(this);
    this.toggleFeatureSelection = this.toggleFeatureSelection.bind(this);
    this.addFeatureToSelection = this.addFeatureToSelection.bind(this);
    this.getSelectionSpatialQuery = this.getSelectionSpatialQuery.bind(this);
    this.executeSql = this.executeSql.bind(this);
    this.editLayer = this.editLayer.bind(this);
    this.removeLayer = this.removeLayer.bind(this);
    this.createConnection = this.createConnection.bind(this);
    this.saveLayers = this.saveLayers.bind(this);
    this.loadSavedLayers = this.loadSavedLayers.bind(this);
  }

  setLayerRef(key, value) {
    this.layersRefs[key] = value;
  }

  toggleActiveLayer(key, value) {
    this.layersActive[key] = value;
  }

  get layersKeys() {
    return this.layers.map((item) => item.key);
  }

  get layersGeomColumns() {
    const result = {};
    this.layers.forEach((item) => {
      result[item.key] = item.geometryColumn;
    });
    return result;
  }

  changeLayerStatus(key) {
    this.loadingMap = true;
    const index = this.layersKeys.indexOf(key);
    this.layers[index].active = !this.layers[index].active;
    this.loadingMap = false;
  }

  executeSql(sql) {
    return this.service.getQuery(sql);
  }
  getAvailableLayers() {
    this.loading = true;
    this.service
      .getTables()
      .then((response) => {
        runInAction(() => {
          if (response.data) {
            this.availableLayers = response.data;
          } else {
            showNotification('info', 'Não existem tabelas com colunas de Geometria no banco de dados.');
            this.availableLayers = [];
          }
        });
      })
      .catch((error) => {
        runInAction(() => {
          showNotification('error', error ? error.toString() : null);
        });
      })
      .finally(() => {
        runInAction(() => {
          this.loading = false;
        });
      });
  }

  createConnection(object, callback) {
    this.loading = true;
    this.service
      .setDatabase(object)
      .then((response) => {
        runInAction(() => {
          if (response.status === 200) {
            showNotification('success', 'Banco de dados configurado sucesso');
            if (callback) {
              callback();
            }
          } else {
            showNotification('error', 'Ocorreu um problema na configuração do banco de dados');
          }
          this.loading = false;
        });
      })
      .catch((error) => {
        runInAction(() => {
          showNotification('error', error ? error.toString() : null);
          this.loading = false;
        });
      });
  }
  addLayerToMapWithoutRequest(
    layer = {
      name: '',
      key: '',
      type: 'query_result',
      displayColumns: [],
      data: [],
      query: '',
      geometryColumn: '',
      styles: { fillColor: '#3388ff', fillOpacity: 0.2, color: '#3388ff', weight: 3, opacity: 1 },
      styleType: 'static',
      choroplethStyleDefinition: {
        colorFunction: null,
        equal: false,
        column: null,
        defaultColor: '#3388ff',
        values: [],
      },
    }
  ) {
    return new Promise((resolve, reject) => {
      try {
        const data = layer.data.map((item) => {
          if (typeof item.geometry === 'string') {
            item.geometry = JSON.parse(item.geometry);
          }
          return item;
        });
        layer.data = data;
        this.layers.push(layer);
        this.layersActive[layer.key] = true;
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  removeLayer(key) {
    this.loading = true;
    this.loadingMap = true;
    const newLayers = this.layers.filter((layer) => {
      return layer.key !== key;
    });
    this.layers = newLayers;
    delete this.layersActive[key];
    delete this.layersRefs[key];
    this.loading = false;
    this.loadingMap = false;
  }

  editLayer(
    layer = {
      name: '',
      key: '',
      type: '',
      displayColumns: [],
      data: [],
      geometryColumn: '',
      styles: {},
    }
  ) {
    this.loading = true;
    this.loadingMap = true;
    const index = this.layersKeys.indexOf(layer.key);
    this.layers[index] = { ...layer };
    this.loading = false;
    this.loadingMap = false;
  }

  addLayerToMap(
    layer = {
      name: '',
      key: '',
      type: '',
      displayColumns: [],
      data: [],
      geometryColumn: '',
      styles: {},
      choroplethStyleDefinition: {},
    }
  ) {
    if (this.layersKeys.includes(layer.key)) {
      showNotification('error', 'Camada já adicionada!');
      return;
    }
    this.loading = true;
    this.loadingMap = true;
    this.service
      .getLayer(layer.key, layer.geometryColumn)
      .then((response) => {
        runInAction(() => {
          const data = response.data.map((item) => {
            if (typeof item.geometry === 'string') {
              item.geometry = JSON.parse(item.geometry);
            }
            return item;
          });
          layer.data = data;
          this.layers.push(layer);
          this.layersActive[layer.key] = true;
        });
      })
      .catch((error) => {
        runInAction(() => {
          showNotification('error', error ? error.toString() : null);
        });
      })
      .finally(() => {
        runInAction(() => {
          this.loading = false;
          this.loadingMap = false;
        });
      });
  }

  toggleFeatureSelection(type = 'first') {
    this.selectFeaturesMode = this.selectFeaturesMode ? null : type;
  }

  clearSelectedFeatures() {
    this.resetSelectedFeatures('first');
    this.resetSelectedFeatures('second');
    this.selectedFeatures = { first: {}, second: {} };
  }

  resetSelectedFeatures(type = 'first') {
    Object.keys(this.selectedFeatures[type]).forEach((key) => {
      this.selectedFeatures[type][key].forEach((item) => {
        item.element.setStyle(item.oldStyle);
      });
    });
  }

  get hasSelectionFirst() {
    this.hasSelection('first');
  }

  get hasSelectionSecond() {
    this.hasSelection('second');
  }

  hasSelection(type = 'first') {
    let result = false;
    Object.keys(this.selectedFeatures[type]).forEach((key) => {
      this.selectedFeatures[type][key].forEach(() => {
        result = result || true;
      });
    });
    return result;
  }

  addFeatureToSelection(key, { gid, oldStyle, element }) {
    if (this.selectFeaturesMode) {
      if (this.selectedFeatures[this.selectFeaturesMode][key]) {
        this.selectedFeatures[this.selectFeaturesMode][key].push({ gid, oldStyle, element });
      } else {
        this.selectedFeatures[this.selectFeaturesMode][key] = [{ gid, oldStyle, element }];
      }
    } else {
      showNotification('error', 'Erro! Tipo de seleção inválido.');
    }
  }

  removeFeatureFromSelection(key, gid) {
    if (this.selectFeaturesMode) {
      const index = this.featureSelectionGids[this.selectFeaturesMode][key].indexOf(gid);
      this.selectedFeatures[this.selectFeaturesMode][key].splice(index, 1);
    } else {
      showNotification('error', 'Erro! Tipo de seleção inválido.');
    }
  }

  forceDisplaySelected() {
    if (this.selectFeaturesMode) {
      Object.keys(this.selectedFeatures[this.selectFeaturesMode]).forEach((layer) => {
        this.selectedFeatures[this.selectFeaturesMode][layer].forEach((selection) => {
          const selectionStyle = {
            weight: 5,
            color: this.selectFeaturesMode === 'first' ? '#FFFF00' : '#b81212',
            dashArray: '',
            fillOpacity: 0.7,
            fillColor: this.selectFeaturesMode === 'first' ? '#FFFF00' : '#b81212',
          };

          selection.element.setStyle(selectionStyle);
        });
      });
    }
  }

  isFeatureSelected(key, gid) {
    let result = false;
    if (this.selectFeaturesMode && this.featureSelectionGids[this.selectFeaturesMode][key]) {
      result = this.featureSelectionGids[this.selectFeaturesMode][key].includes(gid);
    }
    return result;
  }

  get featureSelectionGids() {
    const result = {};
    Object.keys(this.selectedFeatures).forEach((key) => {
      result[key] = {};
      if (this.selectedFeatures[key]) {
        const layers = Object.keys(this.selectedFeatures[key]);
        layers.forEach((layer) => {
          result[key][layer] = this.selectedFeatures[key][layer].map((selection) => selection.gid);
        });
      }
    });
    return result;
  }

  getSelectionSpatialQuery({ operation, layerName, auxiliar }, callback, booleanQueryLayer = null) {
    if (this.layersKeys.includes(layerName) && !['area', 'distance', 'length', 'perimeter'].includes(operation)) {
      showNotification('error', 'Camada já adicionada!');
      return;
    }

    const keysA = Object.keys(this.selectedFeatures.first);
    const keysB = Object.keys(this.selectedFeatures.second);

    const requestData = {
      first: {},
      second: {},
      operation,
    };
    debugger;
    keysA.forEach((key) => {
      requestData.first[key] = { data: [], geometryColumn: this.layersGeomColumns[key] };
      requestData.first[key].data = this.selectedFeatures.first[key].map((item) => item.gid);
    });
    keysB.forEach((key) => {
      requestData.second[key] = { data: [], geometryColumn: this.layersGeomColumns[key] };
      requestData.second[key].data = this.selectedFeatures.second[key].map((item) => item.gid);
    });

    if (booleanQueryLayer) {
      requestData.second = {
        [booleanQueryLayer]: { data: [], geometryColumn: this.layersGeomColumns[booleanQueryLayer] },
      };
    }

    if (operation === 'buffer') {
      requestData.auxiliar = auxiliar / 111;
    }

    this.loadingSpatialQuery = true;

    this.service
      .getSpatialQuery(requestData)
      .then((response) => {
        runInAction(() => {
          const data = response.data.data.map((item) => {
            if (typeof item.geometry === 'string') {
              item.geometry = JSON.parse(item.geometry);
            }
            return item;
          });

          if (!['area', 'distance', 'length', 'perimeter'].includes(operation)) {
            const layer = {
              name: layerName,
              key: layerName,
              type: 'query_result',
              sql: response.data.query,
              displayColumns: [],
              data,
              geometryColumn: 'unknown',
              styles: { fillColor: '#3388ff', fillOpacity: 0.2, color: '#3388ff', weight: 3, opacity: 1 },
              styleType: 'static',
              choroplethStyleDefinition: {
                colorFunction: null,
                equal: false,
                column: null,
                defaultColor: '#3388ff',
                values: [],
              },
            };
            this.layers.push(layer);
            this.layersActive[layer.key] = true;
          }
          this.clearSelectedFeatures();
          if (callback) {
            callback(data);
          }
        });
      })
      .catch((error) => {
        runInAction(() => {
          showNotification('error', error ? error.toString() : null);
        });
      })
      .finally(() => {
        runInAction(() => {
          this.loadingSpatialQuery = false;
        });
      });
  }

  getLayerGeometryType(layer = null) {
    if (layer) {
      const layerIndex = this.layersKeys.indexOf(layer);
      if (layerIndex >= 0 && this.layers[layerIndex].data.length > 0) {
        const layerData = this.layers[layerIndex].data;
        let type = 'unknown';
        if (layerData.length > 0 && layerData[0].geometry && layerData[0].geometry.type) {
          type = layerData[0].geometry.type;
        }
        return type ?? 'unknown';
      }
    }
    return 'unknown';
  }

  getLayerStyle(layer = null) {
    let styles = { fillColor: '#3388ff', fillOpacity: 0.2, color: '#3388ff', weight: 3, opacity: 1 };
    if (layer) {
      const layerIndex = this.layersKeys.indexOf(layer);
      if (layerIndex >= 0 && this.layers[layerIndex].styles) {
        styles = this.layers[layerIndex].styles;
      }
    }
    return styles;
  }

  async saveLayers() {
    this.loading = true;

    try {
      await this.layersPersistanceService.deleteAll();

      const promises = [];
      this.layers.map((layer) => {
        if (layer.type !== 'query_result') {
          const data = Object.assign({}, layer);
          delete data.data;
          promises.push(this.layersPersistanceService.saveLayer({ table: layer.key, data }));
        }
      });

      Promise.all(promises);
      showNotification('success', 'Camadas salvas com sucesso!');
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      this.loading = false;
    }
  }

  loadSavedLayers() {
    this.loading = true;

    this.layersPersistanceService
      .getLayers()
      .then((response) => {
        runInAction(() => {
          if (response.data && response.data.length > 0) {
            response.data.forEach((layer) => {
              const parsedJson = JSON.parse(layer.json);
              const newStyle = getStyleWithColorFunction(parsedJson.choroplethStyleDefinition);
              parsedJson.styles.colorFunction = newStyle.colorFunction;
              this.addLayerToMap(parsedJson);
            });
          }
        });
      })
      .catch((error) => {
        runInAction(() => {
          showNotification('error', error ? error.toString() : null);
        });
      })
      .finally(() => {
        runInAction(() => {
          this.loading = false;
        });
      });
  }

  async saveQueryIntoTable(key) {
    debugger;
    this.loading = true;
    const index = this.layersKeys.indexOf(key);

    if (index === -1) {
      showNotification('error', 'Ocorreu um erro inesperado!');
      throw 'Index out of bounds';
    }
    const sql = this.layers[index].sql;

    try {
      await this.service.saveQueryIntoTable({ tableName: key, sql });

      this.layers[index].type = 'polygon';
      this.layers[index].geometryColumn = 'geom';

      showNotification('success', 'Consulta salva em Tabela com sucesso!');
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      this.loading = false;
    }
  }
}

export default MapStore;
