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
    { value: 'union', label: 'Union' },
    { value: 'diff', label: 'Difference' },
    { value: 'intersection', label: 'Intersection' },
    { value: 'contains', label: 'Contains' },
    { value: 'crosses', label: 'Crosses' },
    { value: 'touches', label: 'Touches' },
    { value: 'within', label: 'Within' },
    { value: 'intersects', label: 'Intersects' },
    { value: 'area', label: 'Area' },
    { value: 'distance', label: 'Distance' },
    { value: 'length', label: 'Length' },
    { value: 'perimeter', label: 'Perimeter' },
    { value: 'buffer', label: 'Buffer' },
    { value: 'centroid', label: 'Centroid' },
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
        <div className="field-label">Operation</div>
        <div>
          <Select
            placeholder={'Select an operation'}
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
        <div className="field-label">Layer Name</div>
        <div>
          <Input
            placeholder={'Input a value...'}
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
        {selectedOperation === 'buffer' && <div className="field-label">Buffer Radius (km)</div>}
        <div>
          <InputNumber
            placeholder={'Input a value...'}
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
              Select{' '}
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
                  Select B
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
        <div className="field-label">Query Result</div>
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
    setQueryLayerName('layer_query');
    setNonGeomResultData([]);
    setSelectedLayer('');
    setAuxiliarParam(0);
  };

  const validateOk = () => {
    if (!mapStore.hasSelection('first')) {
      showNotification('error', "Select the feature set 'A' to perform the query.");
      return false;
    }

    if (!mapStore.hasSelection('second') && ['diff', 'intersection', 'distance'].includes(selectedOperation)) {
      showNotification('error', "Select the feature set 'B' to perform the query.");
      return false;
    }

    if (['contains', 'crosses', 'touches', 'within', 'intersects'].includes(selectedOperation) && !selectedLayer) {
      showNotification('error', 'Select a base layer to perform the query.');
      return false;
    }

    if (selectedOperation === 'buffer' && !auxiliarParam) {
      showNotification('error', 'Inform the value of buffer radius.');
      return false;
    }
    return true;
  };

  return (
    <Modal
      title="Spatial Query - From Selection"
      okText="Query"
      cancelText="Close"
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
