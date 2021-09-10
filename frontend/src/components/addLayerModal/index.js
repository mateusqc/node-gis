import React, { useEffect, useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react';
import Modal from 'antd/lib/modal/Modal';
import { Button, Collapse, Input, Select, Spin, Table, Row, Col, InputNumber } from 'antd';
import './style.css';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import columns from '../../constants/Columns';
import { toJS } from 'mobx';
import { showNotification } from '../../utils/utils';

const { Option } = Select;
const { Panel } = Collapse;

const AddLayerModal = observer(({ editLayerKey, visible, onOk, onCancel }) => {
  const { mapStore } = useStores();
  const [formData, setFormData] = useState({
    name: '',
    key: null,
    type: 'polygon',
    data: [],
    geometryColumn: '',
    styles: { fillColor: '#3388ff', fillOpacity: 0.2, color: '#3388ff', weight: 3, opacity: 1 },
  });
  const [informationColumns, setInformationColumns] = useState([]);
  const [visibleInfoModal, setVisibleInfoModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [columnLabel, setColumnLabel] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const index = mapStore.layersKeys.indexOf(editLayerKey);

    if (index !== -1) {
      const layer = toJS(mapStore.layers[index]);
      setFormData(layer);
      setInformationColumns(layer.displayColumns);
    }
  }, [editLayerKey, visible]);

  const onChangeValue = (value, key) => {
    setFormData({ ...formData, [key]: value });
  };

  const onChangeValueStyles = (value, key) => {
    setFormData({ ...formData, styles: { ...formData.styles, [key]: value } });
  };

  const onChangeValueFromObject = (data) => {
    setFormData({ ...formData, ...data });
  };

  const addLayerToMap = () => {
    if (editLayerKey) {
      mapStore.editLayer({ ...formData, displayColumns: informationColumns });
    } else {
      mapStore.addLayerToMap({ ...formData, displayColumns: informationColumns });
    }
    onOk();
    setFormData({
      name: '',
      key: null,
      type: 'polygon',
      displayColumns: [],
      geometryColumn: '',
      data: [],
      styles: { fillColor: '#3388ff', fillOpacity: 0.2, color: '#3388ff', weight: 3, opacity: 1 },
    });
  };

  const renderTableSelect = () => {
    return (
      <div className="field">
        <div className="field-label">Tabela</div>
        <div>
          <Select
            disabled={editLayerKey}
            value={formData.key}
            placeholder={'Selecione uma tabela'}
            style={{ width: '100%' }}
            onChange={(value) => {
              onChangeValueFromObject({
                key: value,
                name: value,
                geometryColumn: undefined,
              });
              setInformationColumns([]);
            }}
          >
            {mapStore.availableLayers.map((layer) => {
              return <Option value={layer.name}>{layer.name}</Option>;
            })}
          </Select>
        </div>
      </div>
    );
  };

  const renderGemotryColumnSelect = () => {
    return (
      <div className="field">
        <div className="field-label">Coluna Geométrica</div>
        <div>
          <Select
            placeholder={'Selecione uma coluna geométrica'}
            style={{ width: '100%' }}
            value={formData.geometryColumn}
            onChange={(value) => {
              onChangeValue(value, 'geometryColumn');
            }}
          >
            {mapStore.availableLayers
              .find((table) => table.name === formData.key)
              .geometryColumns.map((column) => {
                return <Option value={column}>{column}</Option>;
              })}
          </Select>
        </div>
      </div>
    );
  };

  const renderNameInput = () => {
    return (
      <div className="field">
        <div className="field-label">Nome da Tabela</div>
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

  const validateColumnSelect = (columnName) => {
    return informationColumns.some((col) => col.column === columnName);
  };

  const renderColumnSelect = () => {
    return (
      <div className="field">
        <div className="field-label">Coluna</div>
        <div>
          <Select
            placeholder={'Selecione uma coluna'}
            style={{ width: '100%' }}
            onChange={(value) => {
              setSelectedColumn(value);
              setColumnLabel(value);
            }}
            // value={selectedColumn}
          >
            {mapStore.availableLayers
              .find((table) => table.name === formData.key)
              .columns.map((layer) => {
                return (
                  <Option disabled={validateColumnSelect(layer)} value={layer}>
                    {layer}
                  </Option>
                );
              })}
          </Select>
        </div>
      </div>
    );
  };

  const renderColumnNameInput = () => {
    return (
      <div className="field">
        <div className="field-label">Nome da Coluna</div>
        <div>
          <Input
            placeholder={'Informe o valor'}
            style={{ width: '100%' }}
            value={columnLabel}
            onChange={(event) => setColumnLabel(event.target.value)}
          />
        </div>
      </div>
    );
  };

  const colorPicker = (value) => {
    return (
      <input
        type="color"
        style={{ width: '50%' }}
        value={formData.styles[value]}
        onChange={(event) => onChangeValueStyles(event.target.value, [value])}
      />
    );
  };

  const renderLayerColorInput = () => {
    return (
      <div className="field">
        <div className="field-label">Cor da Camada</div>
        {colorPicker('fillColor')}
      </div>
    );
  };

  const renderLayerOpacity = () => {
    return (
      <div className="field">
        <div className="field-label">Opacidade da Camada</div>
        <InputNumber
          defaultValue={formData.styles.fillOpacity}
          min={0}
          max={1}
          step="0.1"
          onChange={(value) => onChangeValueStyles(value, 'fillOpacity')}
        />
      </div>
    );
  };

  const renderStrokeColorInput = () => {
    return (
      <div className="field">
        <div className="field-label">Cor das Linhas</div>
        {colorPicker('color')}
      </div>
    );
  };

  const renderStrokeWidth = () => {
    return (
      <div className="field">
        <div className="field-label">Largura das Linhas em Pixels</div>
        <InputNumber defaultValue={formData.styles.weight} onChange={(value) => onChangeValueStyles(value, 'weight')} />
      </div>
    );
  };

  const renderStrokeOpacity = () => {
    return (
      <div className="field">
        <div className="field-label">Opacidade das Linhas</div>
        <InputNumber
          defaultValue={formData.styles.opacity}
          min={0}
          max={1}
          step="0.1"
          onChange={(value) => onChangeValueStyles(value, 'opacity')}
        />
      </div>
    );
  };

  const removeColumn = (key) => {
    setLoading(true);
    const index = informationColumns.map((item) => item.key).indexOf(key);
    const newList = informationColumns;
    newList.splice(index, 1);
    setInformationColumns(newList);
    setTimeout(setLoading, 200);
  };

  const columnsInformation = [
    { title: 'Coluna', dataIndex: 'column', key: 'column' },
    { title: 'Nome', dataIndex: 'label', key: 'label' },
    {
      title: '',
      dataIndex: '',
      key: '',
      render: (row) => {
        return <Button danger icon={<DeleteOutlined />} onClick={() => removeColumn(row.key)} />;
      },
    },
  ];

  const addColumnToList = () => {
    setLoading(true);
    const obj = { column: selectedColumn, label: columnLabel, key: selectedColumn };
    const newList = informationColumns;
    newList.push(obj);
    setInformationColumns(newList);
    setVisibleInfoModal(false);
    setSelectedColumn('');
    setColumnLabel('');
    setTimeout(setLoading, 500);
  };

  return (
    <Modal
      title={editLayerKey ? 'Editar Camada' : 'Adicionar Nova Camada Vetorial'}
      okText={editLayerKey ? 'Salvar' : 'Adicionar'}
      cancelText="Cancelar"
      visible={visible}
      onOk={addLayerToMap}
      onCancel={onCancel}
      key="modal-add-layer"
      okButtonProps={{ disabled: !formData.key || !formData.geometryColumn }}
    >
      {mapStore.loading ? (
        <Spin />
      ) : (
        <div>
          {renderTableSelect()}
          {renderNameInput()}
          {formData.type !== 'query_result' && (
            <>
              {!editLayerKey && formData.key && renderGemotryColumnSelect()}
              <Button
                onClick={() => setVisibleInfoModal(true)}
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginBottom: '10px' }}
                disabled={!formData.key}
              >
                Nova Coluna
              </Button>
              <Table
                size="small"
                pagination={{ pageSize: 5 }}
                loading={loading}
                columns={columnsInformation}
                dataSource={informationColumns}
                key={new Date()}
              />
            </>
          )}
          {visibleInfoModal && (
            <Modal
              visible={visibleInfoModal}
              onCancel={() => {
                setVisibleInfoModal(false);
                setSelectedColumn('');
                setColumnLabel('');
              }}
              onOk={addColumnToList}
              title="Nova Coluna"
              closable={false}
              okText="Adicionar"
              cancelText="Cancelar"
              key="modal-columns-add"
            >
              {renderColumnSelect()}
              {renderColumnNameInput()}
            </Modal>
          )}
          <Collapse defaultActiveKey={['information']} ghost key="">
            {/* <Panel header="Information" key="information">
              
            </Panel> */}
            <Panel header="Estilização da camada" key="style">
              <Row>
                <Col span={12}>{renderLayerColorInput()}</Col>
                <Col span={12}>{renderLayerOpacity()}</Col>
              </Row>
              <Row>
                <Col span={12}>{renderStrokeColorInput()}</Col>
                <Col span={12}>{renderStrokeOpacity()}</Col>
              </Row>
              <Row>
                <Col span={12}>{renderStrokeWidth()}</Col>
              </Row>
            </Panel>
          </Collapse>
        </div>
      )}
    </Modal>
  );
});

export default AddLayerModal;
