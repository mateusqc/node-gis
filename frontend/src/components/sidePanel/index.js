import { OrderedListOutlined, TableOutlined, EditOutlined, DeleteTwoTone } from '@ant-design/icons';
import { Button, Checkbox, Collapse, Divider, Tooltip } from 'antd';
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

  return (
    <div className="side-panel">
      <Collapse defaultActiveKey={['1']} ghost>
        <Panel header="Camadas" key="1">
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
                      <Tooltip placement="topRight" title="Listagem de Registros">
                        <Button
                          size="small"
                          onClick={() => setSelectedLayerData(layer.key)}
                          icon={<OrderedListOutlined />}
                        />
                      </Tooltip>
                      <Tooltip placement="topRight" title="Editar camada">
                        <Button
                          size="small"
                          onClick={() => setSelectedLayerEditStyle(layer.key)}
                          // style={{ position: 'absolute', right: '16px' }}
                          icon={<EditOutlined />}
                        />
                      </Tooltip>
                      <Tooltip placement="topRight" title="Remover camada">
                        <Button
                          size="small"
                          onClick={() => mapStore.removeLayer(layer.key)}
                          // style={{ position: 'absolute', right: '16px' }}
                          icon={<DeleteTwoTone twoToneColor="red" />}
                        />
                      </Tooltip>
                    </div>
                  </div>
                );
              })
            ) : (
              <span>Nenhuma camada adicionada</span>
            )}
          </div>
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
