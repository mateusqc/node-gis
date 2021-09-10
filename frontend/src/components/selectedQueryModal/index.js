import React, { useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react';
import Modal from 'antd/lib/modal/Modal';
import { Button, Col, Collapse, Input, InputNumber, Row, Select, Spin } from 'antd';
import './style.css';
import { SelectOutlined } from '@ant-design/icons';
import descriptions from '../../constants/FunctionsDescriptions';
import { showNotification } from '../../utils/utils';

const { Option } = Select;

const SelectedQueryModal = observer(({ visible, onOk, onCancel }) => {
  const { mapStore } = useStores();
  const operationsList = [
    { value: 'union', label: 'União' },
    { value: 'diff', label: 'Diferença' },
    { value: 'intersection', label: 'Intersecção' },
    { value: 'contains', label: 'Contém' },
    { value: 'crosses', label: 'Cruza' },
    { value: 'touches', label: 'Toca' },
    { value: 'within', label: 'Está Dentro' },
    { value: 'intersects', label: 'Interceptam' },
    { value: 'area', label: 'Área' },
    { value: 'distance', label: 'Distância' },
    { value: 'length', label: 'Comprimento' },
    { value: 'perimeter', label: 'Perímetro' },
    { value: 'buffer', label: 'Buffer' },
    { value: 'centroid', label: 'Centróide' },
  ];
  const nonGeomResultOperations = ['area', 'distance', 'length', 'perimeter'];
  const layerSelectOnB = ['contains', 'crosses', 'touches', 'within', 'intersects'];
  const [selectedOperation, setSelectedOperation] = useState('union');
  const [queryLayerName, setQueryLayerName] = useState('camada_query');
  const [nonGeomResultData, setNonGeomResultData] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState('');
  const [auxiliarParam, setAuxiliarParam] = useState(0);

  const renderTableSelect = () => {
    return (
      <div className="field">
        <div className="field-label">Seleção de Operação</div>
        <div>
          <Select
            placeholder={'Selecione uma operação'}
            style={{ width: '100%' }}
            onChange={(value) => {
              clearAllData();
              setSelectedOperation(value);
            }}
            allowClear={false}
            value={selectedOperation}
          >
            {operationsList.map(({ value, label }) => {
              return <Option value={value}>{label}</Option>;
            })}
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
            value={queryLayerName}
            onChange={(event) => setQueryLayerName(event.target.value)}
          />
        </div>
      </div>
    );
  };

  const renderAuxInput = () => {
    return (
      <div className="field">
        {selectedOperation === 'buffer' && <div className="field-label">Raio do Buffer (km)</div>}
        <div>
          <InputNumber
            placeholder={'Informe o valor'}
            style={{ width: '100%' }}
            value={auxiliarParam}
            min={0}
            step={0.01}
            onChange={(value) => setAuxiliarParam(value)}
          />
        </div>
      </div>
    );
  };

  const renderFeatureSelection = () => {
    return (
      <div className="field">
        <Row>{selectedOperation ? descriptions[selectedOperation] : ''}</Row>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col span={12} style={{ alignContent: 'center' }}>
            <Button
              onClick={() => {
                mapStore.toggleFeatureSelection('first');
                mapStore.forceDisplaySelected();
              }}
              type={mapStore.hasSelectionFirst ? 'primary' : 'dashed'}
              style={{ width: '100%' }}
              icon={<SelectOutlined />}
            >
              Selecionar{' '}
              {!['union', 'area', 'buffer', 'length', 'perimeter', 'centroid'].includes(selectedOperation) ? 'A' : ''}
            </Button>
          </Col>
          <Col span={12}>
            {!['union', 'area', 'buffer', 'length', 'perimeter', 'centroid'].includes(selectedOperation) ? (
              !layerSelectOnB.includes(selectedOperation) ? (
                <Button
                  onClick={() => {
                    mapStore.toggleFeatureSelection('second');
                    mapStore.forceDisplaySelected();
                  }}
                  type={mapStore.hasSelectionFirst ? 'primary' : 'dashed'}
                  style={{ width: '100%' }}
                  icon={<SelectOutlined />}
                >
                  Selecionar B
                </Button>
              ) : (
                <Select
                  placeholder={'Selecione uma camada'}
                  style={{ width: '100%' }}
                  onChange={(value) => {
                    setSelectedLayer(value);
                  }}
                  allowClear={false}
                  value={selectedLayer}
                >
                  {mapStore.layers
                    .filter(({ type }) => type !== 'query_result')
                    .map(({ name, key }) => {
                      return <Option value={key}>{name}</Option>;
                    })}
                </Select>
              )
            ) : null}
          </Col>
        </Row>
      </div>
    );
  };

  const renderNonGeomResult = () => {
    return (
      <div className="field">
        <div className="field-label">Resultado da Consulta</div>
        {Object.keys(nonGeomResultData[0]).map((key) => {
          return (
            <div>
              <span>{key}: </span>
              <span>{nonGeomResultData[0][key]}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const clearAllData = () => {
    mapStore.clearSelectedFeatures();
    setSelectedOperation('union');
    setQueryLayerName('camada_query');
    setNonGeomResultData([]);
    setSelectedLayer('');
    setAuxiliarParam(0);
  };

  const validateOk = () => {
    if (!mapStore.hasSelection('first')) {
      showNotification('error', "Selecione o conjunto de feições 'A' para realizar a operação.");
      return false;
    }

    if (!mapStore.hasSelection('second') && ['diff', 'intersection', 'distance'].includes(selectedOperation)) {
      showNotification('error', 'Selecione o conjunto de feições B para realizar a operação.');
      return false;
    }

    if (['contains', 'crosses', 'touches', 'within', 'intersects'].includes(selectedOperation) && !selectedLayer) {
      showNotification('error', 'Selecione a camada base para realizar a operação.');
      return false;
    }

    if (selectedOperation === 'buffer' && !auxiliarParam) {
      showNotification('error', 'Informe o valor do raio do buffer');
      return false;
    }
    return true;
  };

  return (
    <Modal
      title="Consulta Espacial - A partir de seleção"
      okText="Realizar Consulta"
      cancelText="Fechar"
      visible={visible && !mapStore.selectFeaturesMode}
      onOk={() => {
        if (validateOk()) {
          mapStore.getSelectionSpatialQuery(
            { operation: selectedOperation, layerName: queryLayerName, auxiliar: auxiliarParam },
            nonGeomResultOperations.includes(selectedOperation) ? setNonGeomResultData : onCancel,
            layerSelectOnB.includes(selectedOperation) ? selectedLayer : null
          );
        }
      }}
      onCancel={() => {
        clearAllData();
        onCancel();
      }}
      confirmLoading={mapStore.loadingSpatialQuery}
      key="modal-add-layer"
    >
      {mapStore.loading ? (
        <Spin />
      ) : (
        <div>
          {renderTableSelect()}
          {renderFeatureSelection()}
          {!nonGeomResultOperations.includes(selectedOperation) && renderNameInput()}
          {selectedOperation === 'buffer' && renderAuxInput()}
          {nonGeomResultData.length > 0 && renderNonGeomResult()}
        </div>
      )}
    </Modal>
  );
});

export default SelectedQueryModal;
