import { Table } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { useStores } from '../../hooks/useStores';
import './style.css';

const LayerDataTable = observer(({ layerKey, onClose, visible }) => {
  const { mapStore } = useStores();
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const index = mapStore.layersKeys.indexOf(layerKey);
    const layer = toJS(mapStore.layers[index]);
    setTitle(layer.name);
    const dataSourceList = layer.data.map((item, idx) => {
      item.key = `item-key-${idx}`;
      return item;
    });
    setDataSource(dataSourceList);
    if (dataSourceList.length > 0) {
      const keys = Object.keys(dataSourceList[0]);
      const columnsList = [];
      keys.forEach((key) => {
        if (key !== 'key' && key !== 'geom' && key !== 'geometry')
          columnsList.push({ title: key, dataIndex: key, key: 'key', render: (text) => text ?? '-' });
      });
      setColumns(columnsList);
    }
  }, []);

  return (
    <Modal
      title={`Dados da Camada${title ? ' - ' + title : ''}`}
      okText="Adicionar"
      cancelText="Cancelar"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={'90%'}
      key="modal-layer-data"
    >
      <Table columns={columns} dataSource={dataSource} />
    </Modal>
  );
});

export default LayerDataTable;
