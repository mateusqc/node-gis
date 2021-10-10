import React, { useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react';
import Modal from 'antd/lib/modal/Modal';
import { Alert, Button, Input, Select, Table } from 'antd';
import './style.css';
import TextArea from 'antd/lib/input/TextArea';
import { showNotification } from '../../utils/utils';
import { Option } from 'antd/lib/mentions';

const SqlModal = observer(({ visible, onCancel }) => {
  const { mapStore } = useStores();
  const [sql, setSql] = useState('');
  const [loadingSql, setLoadingSql] = useState(false);
  const [loadingAddLayer, setLoadingAddLayer] = useState(false);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [geometryColumn, setGeometryColumn] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    type: 'query_result',
    displayColumns: [],
    data: [],
  });
  const [showTableModal, setShowTableModal] = useState(false);
  const [showConfigLayer, setshowConfigLayer] = useState(false);

  const processData = (data) => {
    setColumns([]);
    setDataSource([]);
    setFormData({
      name: '',
      key: '',
      type: 'polygon',
      displayColumns: [],
      data: [],
    });
    if (data && data.length > 0) {
      const dt = data[0];
      const cols = Object.keys(dt);
      setColumns(
        cols.map((c) => {
          return {
            title: c,
            dataIndex: c,
            key: c,
            render: (text) => {
              return !text ? '-' : text.length > 50 ? `${text.substring(0, 50)}...` : text;
            },
          };
        })
      );
      setDataSource(
        data.map((item, idx) => {
          item.key = `item-key-${idx}`;
          return item;
        })
      );
      onChangeValue(data, 'data');
    }
  };

  const executeSql = async () => {
    setLoadingSql(true);
    try {
      const result = await mapStore.executeSql({ sql: sql });
      processData(result.data.data);
      setShowTableModal(true);
    } catch (err) {
      showNotification('error', err.response ? err.response.data.message : err.message);
    } finally {
      setLoadingSql(false);
    }
  };
  const onChangeValue = (value, key) => {
    setFormData({ ...formData, [key]: value });
  };

  const renderColumnsSelect = () => {
    return (
      <div className="field">
        <div className="field-label">Coluna Geométrica</div>
        <div>
          <Select
            placeholder={'Selecione a coluna da geometria'}
            style={{ width: '100%' }}
            onChange={(value) => setGeometryColumn(value)}
          >
            {columns
              ? columns.map((c) => {
                  return <Option value={c.key}>{c.title}</Option>;
                })
              : []}
          </Select>
        </div>
      </div>
    );
  };

  const renderNameInput = () => {
    return (
      <div className="field">
        <div className="field-label">Nome da Camada</div>
        <div>
          <Input
            placeholder={'Informe o valor'}
            style={{ width: '100%' }}
            value={formData.name}
            onChange={(event) => onChangeValue(event.target.value, 'name')}
          />
        </div>
      </div>
    );
  };
  const resetStates = () => {
    onChangeValue('', 'name');
    setSql('');
    setshowConfigLayer(!showConfigLayer);
    setShowTableModal(!showTableModal);
    onCancel();
  };
  const validaData = () => {
    const data = formData.data[0];
    if (!data || data.length == 0) {
      throw new Error('O conjunto de dados é vazio.');
    }
    const geom = JSON.parse(data[geometryColumn]);
    if (!Object.keys(geom).includes('coordinates')) {
      throw new Error('Coluna geométrica inválida');
    } else {
      if (!geometryColumn) {
        throw new Error('Coluna geométrica não especificada');
      }
    }
  };

  const handlerAddLayer = async () => {
    setLoadingAddLayer(true);
    debugger;
    try {
      validaData();
      const formFinal = {
        name: formData.name,
        type: formData.type,
        sql,
        data: formData.data.map((d) => {
          const geometry = d[geometryColumn];
          return { ...d, geometry: geometry };
        }),
        key: `layer-${formData.name}`,
        displayColumns: [],
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

      formFinal.data = formFinal.data.map((d) => {
        delete d[geometryColumn];
        return { ...d };
      });

      await mapStore.addLayerToMapWithoutRequest(formFinal);
      resetStates();
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setLoadingAddLayer(false);
    }
  };

  const toggleconfigLayer = () => {
    setshowConfigLayer(!showConfigLayer);
  };

  const renderModalConfig = () => {
    return (
      <Modal
        title="Configurar Camada"
        visible={showConfigLayer}
        width={'50%'}
        key="modal-sql-config"
        onCancel={toggleconfigLayer}
        footer={[
          <Button onClick={toggleconfigLayer}>Cancelar</Button>,
          <Button type="primary" loading={loadingAddLayer} onClick={handlerAddLayer}>
            Adicionar
          </Button>,
        ]}
      >
        <div>
          {renderColumnsSelect()}
          {renderNameInput()}
        </div>
      </Modal>
    );
  };

  const renderModalResultQuery = () => {
    return (
      <Modal
        title="Resultado da Consulta"
        okText="Adicionar"
        cancelText="Cancelar"
        visible={showTableModal}
        onCancel={() => {
          setShowTableModal(!showTableModal);
        }}
        footer={null}
        width={'90%'}
        key="modal-sql-data"
      >
        {' '}
        <div>
          <Button
            type="primary"
            onClick={() => {
              setshowConfigLayer(!showConfigLayer);
            }}
          >
            Adicionar como Camada
          </Button>
          <Table columns={columns} dataSource={dataSource} />
        </div>
      </Modal>
    );
  };

  return (
    <div>
      <Modal
        title="Realizar consulta SQL"
        okText="Executar"
        cancelText="Cancelar"
        visible={visible}
        onOk={executeSql}
        onCancel={onCancel}
        key="modal-sql"
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" loading={loadingSql} onClick={executeSql}>
            Executar
          </Button>,
        ]}
      >
        <Alert
          style={{ marginBottom: '10px' }}
          showIcon
          message="Dados geométricos deverão estar envolvidos pela função ST_AsGeoJSON."
        />
        <TextArea
          rows={4}
          onChange={(v) => {
            setSql(v.target.value);
          }}
        />
      </Modal>
      {renderModalResultQuery()}
      {renderModalConfig()}
    </div>
  );
});

export default SqlModal;
