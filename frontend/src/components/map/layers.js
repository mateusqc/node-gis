import React, { createRef, useEffect, useState } from 'react';
import './style.css';
import { useStores } from '../../hooks/useStores';
import { LayerGroup, GeoJSON, useMap, LayersControl, Popup, CircleMarker, Tooltip } from 'react-leaflet';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import SidePanel from '../sidePanel';
import { Alert, Button, Radio } from 'antd';
import leaflet from 'leaflet';

const Layers = observer(() => {
  const { mapStore } = useStores();
  const [layersRefs, setLayersRefs] = useState({});
  const map = useMap();

  useEffect(() => {
    const refs = {};

    mapStore.layers.forEach((layer) => {
      refs[layer.key] = createRef();
    });

    setLayersRefs(refs);
  }, [mapStore.layersKeys.length]);

  const getTooltip = (registry, displayColumns) => {
    if (displayColumns.length > 0) {
      return (
        <Tooltip sticky direction="top">
          {displayColumns.map(({ column, label }) => (
            <div>
              <b>{label}: </b>
              {registry[column]}
            </div>
          ))}
        </Tooltip>
      );
    }
  };

  const handleClickEvent = (e, registry, key) => {
    debugger;
    if (mapStore.selectFeaturesMode) {
      const layerStyle = mapStore.getLayerStyle(key);
      if (mapStore.isFeatureSelected(key, registry.gid)) {
        mapStore.removeFeatureFromSelection(key, registry.gid);
        e.target.setStyle(layerStyle);
      } else {
        e.target.setStyle({
          weight: 5,
          color: mapStore.selectFeaturesMode === 'first' ? '#FFFF00' : '#b81212',
          dashArray: '',
          fillOpacity: 0.7,
          fillColor: mapStore.selectFeaturesMode === 'first' ? '#FFFF00' : '#b81212',
        });
        // e.target.bringToFront();
        mapStore.addFeatureToSelection(key, { gid: registry.gid, oldStyle: layerStyle, element: e.target });
      }
    }
  };

  const renderLayers = () => {
    const resultLayers = [];
    const layers = toJS(mapStore.layers);
    layers.forEach((layer) => {
      const styleFunction = (data) => {
        debugger;
        if (layer.styles.colorFunction) {
          return {
            ...layer.styles,
            fillColor: layer.styles.colorFunction(data),
          };
        } else {
          return layer.styles;
        }
      };
      const layerType = mapStore.getLayerGeometryType(layer.key);
      const layerData = layer.data.map((registry) => {
        if (layerType.includes('Point')) {
          const latLongList = layerType.includes('Multi')
            ? leaflet.GeoJSON.coordsToLatLngs(registry.geometry.coordinates)
            : [leaflet.GeoJSON.coordsToLatLng(registry.geometry.coordinates)];

          const markers = latLongList.map((latLong) => {
            return (
              <CircleMarker
                eventHandlers={{ click: (e) => handleClickEvent(e, registry, layer.key) }}
                // pathOptions={layer.styles}
                pathOptions={styleFunction(registry)}
                center={latLong}
                radius={5}
              >
                {getTooltip(registry, layer.displayColumns)}
              </CircleMarker>
            );
          });

          if (layerType.includes('Multi')) {
            return <LayerGroup>{markers}</LayerGroup>;
          } else {
            return markers[0];
          }
        } else {
          return (
            <GeoJSON
              eventHandlers={{ click: (e) => handleClickEvent(e, registry, layer.key) }}
              pathOptions={styleFunction(registry)}
              // style={styleFunction}
              data={registry.geometry}
            >
              {getTooltip(registry, layer.displayColumns)}
            </GeoJSON>
          );
        }
      });

      const layerComponent = <LayerGroup ref={layersRefs[layer.key]}>{layerData}</LayerGroup>;

      resultLayers.push(layerComponent);
    });
    return resultLayers;
  };

  const renderSelectionAlert = () => {
    return (
      <div className="selection-alert">
        <Alert
          message="Modo de seleção de feições."
          type="info"
          showIcon
          action={<Button onClick={() => mapStore.toggleFeatureSelection()}>Concluir</Button>}
        />
      </div>
    );
  };

  return (
    <div>
      {renderLayers()}
      <SidePanel layersRefs={layersRefs} />
      {mapStore.selectFeaturesMode && renderSelectionAlert()}
    </div>
  );
});

export default Layers;
