import React, { useEffect, useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react';
import Modal from 'antd/lib/modal/Modal';
import { Button, Collapse, Input, Select, Spin, Table, Row, Col, InputNumber, Radio } from 'antd';
import './style.css';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { toJS } from 'mobx';
import { showNotification } from '../../utils/utils';
import ChoroplethModal from './cloroplethModal';

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
    styleType: 'static',
  });
  // const [informationColumns, setInformationColumns] = useState([]);
  const [tooltipColumns, setTooltipColumns] = useState([]);
  const [visibleInfoModal, setVisibleInfoModal] = useState(false);
  const [visibleChoroplethModal, setVisibleChoroplethModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [columnLabel, setColumnLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [choroplethStyleDefinition, setChoroplethStyleDefinition] = useState({
    colorFunction: null,
    equal: false,
    column: null,
    defaultColor: '#3388ff',
    values: [],
  });

  useEffect(() => {
    const index = mapStore.layersKeys.indexOf(editLayerKey);

    if (index !== -1) {
      const layer = toJS(mapStore.layers[index]);
      setFormData(layer);
      setTooltipColumns(layer.displayColumns);
      setChoroplethStyleDefinition(layer.choroplethStyleDefinition);
    }
  }, [editLayerKey, visible]);

  const onChangeValue = (value, key) => {
    debugger;
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
      mapStore.editLayer({
        ...formData,
        displayColumns: tooltipColumns,
        choroplethStyleDefinition: choroplethStyleDefinition,
      });
    } else {
      mapStore.addLayerToMap({
        ...formData,
        displayColumns: tooltipColumns,
        choroplethStyleDefinition: choroplethStyleDefinition,
      });
    }
    onOk();
    setFormData({
      name: '',
      key: null,
      type: 'polygon',
      displayColumns: [],
      geometryColumn: '',
      data: [],
      styleType: 'static',
      styles: { fillColor: '#3388ff', fillOpacity: 0.2, color: '#3388ff', weight: 3, opacity: 1 },
    });
    setChoroplethStyleDefinition({
      colorFunction: null,
      equal: false,
      column: null,
      defaultColor: '#3388ff',
      values: [],
    });
  };

  const renderTableSelect = () => {
    return (
      <div className="field">
        <div className="field-label">Table</div>
        <div>
          <Select
            disabled={editLayerKey}
            value={formData.key}
            placeholder={'Selecione uma tabela'}
            style={{ width: '100%' }}
            showSearch
            onChange={(value) => {
              onChangeValueFromObject({
                key: value,
                name: value,
                geometryColumn: undefined,
              });
              setTooltipColumns([]);
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
        <div className="field-label">Geometric Column</div>
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
        <div className="field-label">Layer Name</div>
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
    return tooltipColumns.some((col) => col.column === columnName);
  };

  const renderColumnSelect = () => {
    return (
      <div className="field">
        <div className="field-label">Column</div>
        <div>
          <Select
            placeholder={'Selecione uma coluna'}
            style={{ width: '100%' }}
            showSearch
            onChange={(value) => {
              setSelectedColumn(value);
              setColumnLabel(value);
            }}
            // value={selectedColumn}
          >
            {getSelectedTableColumns().map((layer) => {
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

  const getSelectedTableColumns = () => {
    const layer = mapStore.availableLayers.find((table) => table.name === formData.key);
    return layer ? layer.columns : [];
  };

  const renderColumnNameInput = () => {
    return (
      <div className="field">
        <div className="field-label">Column Label</div>
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
        <div className="field-label">Fill Color</div>
        {colorPicker('fillColor')}
      </div>
    );
  };

  const renderLayerOpacity = () => {
    return (
      <div className="field">
        <div className="field-label">Fill Opacity</div>
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
        <div className="field-label">Stroke Color</div>
        {colorPicker('color')}
      </div>
    );
  };

  const renderStrokeWidth = () => {
    return (
      <div className="field">
        <div className="field-label">Stroke Width (px)</div>
        <InputNumber defaultValue={formData.styles.weight} onChange={(value) => onChangeValueStyles(value, 'weight')} />
      </div>
    );
  };

  const renderStrokeOpacity = () => {
    return (
      <div className="field">
        <div className="field-label">Line Opacity</div>
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
    const index = tooltipColumns.map((item) => item.key).indexOf(key);
    const newList = tooltipColumns;
    newList.splice(index, 1);
    setTooltipColumns(newList);
    setTimeout(setLoading, 200);
  };

  const columnsTooltip = [
    { title: 'Column', dataIndex: 'column', key: 'column' },
    { title: 'Label', dataIndex: 'label', key: 'label' },
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
    const newList = tooltipColumns;
    newList.push(obj);
    setTooltipColumns(newList);
    setVisibleInfoModal(false);
    setSelectedColumn('');
    setColumnLabel('');
    setTimeout(setLoading, 500);
  };

  const styleTypeSelector = () => {
    return (
      <div className="field">
        <div className="field-label">Style Type</div>
        <Radio.Group
          value={formData.styleType}
          onChange={(e) => {
            onChangeValue(e.target.value, 'styleType');
            if (e.target.value === 'static') {
              // onChangeValueStyles('#3388ff', 'fillColor');
            }
          }}
          name="radiogroup"
          defaultValue={1}
        >
          <Radio value={'static'}>Static</Radio>
          <Radio value={'choropleth'}>Thematic</Radio>
        </Radio.Group>
      </div>
    );
  };

  const renderTooltipPanelContent = () => {
    if (formData.type !== 'query_result') {
      return (
        <>
          <Button
            onClick={() => setVisibleInfoModal(true)}
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginBottom: '10px' }}
            disabled={!formData.key}
          >
            New Column
          </Button>
          <Table
            size="small"
            pagination={{ pageSize: 5 }}
            loading={loading}
            columns={columnsTooltip}
            dataSource={tooltipColumns}
            key={new Date()}
          />
          {visibleInfoModal && renderAddColumnToolTipModal()}
        </>
      );
    }
  };

  const renderAddColumnToolTipModal = () => {
    return (
      <Modal
        visible={visibleInfoModal}
        onCancel={() => {
          setVisibleInfoModal(false);
          setSelectedColumn('');
          setColumnLabel('');
        }}
        onOk={addColumnToList}
        title="New Column"
        closable={false}
        okText="Add"
        cancelText="Cancel"
        key="modal-columns-add"
      >
        {renderColumnSelect()}
        {renderColumnNameInput()}
      </Modal>
    );
  };

  const renderStylePanelContent = () => {
    return (
      <>
        <Row>{styleTypeSelector()}</Row>
        <Row>
          <Col span={12}>{renderStrokeOpacity()}</Col>
          <Col span={12}>{renderStrokeColorInput()}</Col>
        </Row>
        <Row>
          <Col span={12}>{renderLayerOpacity()}</Col>
          {formData.styleType === 'static' && <Col span={12}>{renderLayerColorInput()}</Col>}
        </Row>
        {formData.styleType === 'choropleth' && (
          <Row>
            <Button onClick={() => setVisibleChoroplethModal(true)} style={{ width: '100%', marginBottom: '20px' }}>
              Definir Condição de Preenchimento
            </Button>
            {visibleChoroplethModal && (
              <ChoroplethModal
                onOk={(styleDefinition) => {
                  // onChangeValue(styleDefinition, 'choroplethStyleDefinition');
                  setChoroplethStyleDefinition(styleDefinition);
                  onChangeValueStyles(styleDefinition.colorFunction, 'colorFunction');
                  setVisibleChoroplethModal(false);
                }}
                onCancel={() => setVisibleChoroplethModal(false)}
                visible={visibleChoroplethModal}
                styleDefinition={choroplethStyleDefinition}
                tableColumns={getSelectedTableColumns()}
              />
            )}
          </Row>
        )}
        <Row>
          <Col span={12}>{renderStrokeWidth()}</Col>
        </Row>
      </>
    );
  };

  return (
    <Modal
      title={editLayerKey ? 'Edit Layer' : 'Add New Vector Layer'}
      okText={editLayerKey ? 'Save' : 'Add'}
      cancelText="Cancel"
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
          {!editLayerKey && formData.key && renderGemotryColumnSelect()}
          <Collapse ghost key="" accordion>
            <Panel header="Tooltip" key="tooltip" disabled collapsible={formData.key ? 'header' : 'disabled'}>
              {renderTooltipPanelContent()}
            </Panel>
            <Panel header="Layer Style" key="style" collapsible={formData.key ? 'header' : 'disabled'}>
              {renderStylePanelContent()}
            </Panel>
          </Collapse>
        </div>
      )}
    </Modal>
  );
});

export default AddLayerModal;
