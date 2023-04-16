import { OrderedListOutlined, TableOutlined, EditOutlined, DeleteTwoTone, SaveOutlined } from '@ant-design/icons';
import { Button, Checkbox, Collapse, Spin, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import { useStores } from '../../hooks/useStores';
import AddLayerModal from '../addLayerModal';
import LayerDataTable from '../layerDataTable';
import './style.css';

const { Panel } = Collapse;

const SidePanel = observer(({ layersRefs }) => {
  const { mapStore } = useStores();
  const [selectedLayerData, setSelectedLayerData] = useState(null);
  const [selectedLayerEditStyle, setSelectedLayerEditStyle] = useState(null);

  const map = useMap();

  const changeLayerStatus = (key) => {
    const keys = Object.keys(layersRefs);
    const zIndex = keys.indexOf(key) + 1;
    const layerRef = layersRefs[key];
    const result = map.hasLayer(layerRef.current);

    if (result) {
      map.removeLayer(layerRef.current);
      mapStore.toggleActiveLayer(key, false);
    } else {
      map.addLayer(layerRef.current);
      layerRef.current.setZIndex(zIndex);
      mapStore.toggleActiveLayer(key, true);
    }
  };

  const removeLayer = (key) => {
    const layerRef = layersRefs[key];
    const result = map.hasLayer(layerRef.current);
    if (result) {
      map.removeLayer(layerRef.current);
    }
    mapStore.removeLayer(key);
  };

  const renderLayersOperators = () => {
    return (
      <div style={{ paddingLeft: '5px', color: 'GrayText' }}>
        {mapStore.layers.length ? (
          mapStore.layers.map((layer) => {
            return (
              <div style={{ lineHeight: '26px' }}>
                <Checkbox
                  checked={
                    // map.hasLayer(layersRefs[layer.key])
                    mapStore.layersActive[layer.key]
                  }
                  onChange={() => changeLayerStatus(layer.key)}
                >
                  {layer.name}
                </Checkbox>
                <div style={{ float: 'right' }}>
                  {layer.type === 'query_result' && (
                    <Tooltip placement="topRight" title="Record Query into Database">
                      <Button
                        size="small"
                        onClick={() => mapStore.saveQueryIntoTable(layer.key)}
                        icon={<SaveOutlined />}
                      />
                    </Tooltip>
                  )}
                  <Tooltip placement="topRight" title="Data Table">
                    <Button
                      size="small"
                      disabled={layer.type === 'query_result'}
                      onClick={() => setSelectedLayerData(layer.key)}
                      icon={<OrderedListOutlined />}
                    />
                  </Tooltip>
                  <Tooltip placement="topRight" title="Edit Layer">
                    <Button
                      size="small"
                      onClick={() => setSelectedLayerEditStyle(layer.key)}
                      // style={{ position: 'absolute', right: '16px' }}
                      icon={<EditOutlined />}
                    />
                  </Tooltip>
                  <Tooltip placement="topRight" title="Remove Layer">
                    <Button
                      size="small"
                      onClick={() => removeLayer(layer.key)}
                      // style={{ position: 'absolute', right: '16px' }}
                      icon={<DeleteTwoTone twoToneColor="red" />}
                    />
                  </Tooltip>
                </div>
              </div>
            );
          })
        ) : (
          <span>No layer added to map</span>
        )}
      </div>
    );
  };

  return (
    <div className="side-panel">
      <Collapse defaultActiveKey={['1']} ghost>
        <Panel header="Layers" key="1">
          {mapStore.loading || mapStore.loadingMap ? (
            <>
              <Spin />
            </>
          ) : (
            renderLayersOperators()
          )}
        </Panel>
      </Collapse>
      {selectedLayerData && (
        <LayerDataTable
          visible={selectedLayerData}
          onClose={() => setSelectedLayerData(null)}
          layerKey={selectedLayerData}
        />
      )}
      {selectedLayerEditStyle && (
        <AddLayerModal
          editLayerKey={selectedLayerEditStyle}
          visible={selectedLayerEditStyle}
          onOk={() => setSelectedLayerEditStyle(null)}
          onCancel={() => setSelectedLayerEditStyle(null)}
        />
      )}
    </div>
  );
});

export default SidePanel;
