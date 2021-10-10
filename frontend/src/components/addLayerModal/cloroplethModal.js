import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Button, Select, Collapse, Input, Modal, Radio, Table, Row, Col } from 'antd';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import './style.css';
import { getStyleWithColorFunction } from './utils';

const ChoroplethModal = observer(
  ({
    onOk,
    onCancel,
    visible,
    styleDefinition = {
      equal: false,
      column: null,
      defaultColor: '#3388ff',
      values: [],
    },
    tableColumns,
  }) => {
    const [style, setStyle] = useState(styleDefinition);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ pos: null, value: null, color: '#3388ff' });
    const [editType, setEditType] = useState('new');
    const columnsChoropleth = [
      { title: 'Precedência', dataIndex: 'pos', key: 'value' },
      { title: 'Valor', dataIndex: '', key: 'value', render: (row) => renderValue(row) },
      {
        title: 'Cor',
        dataIndex: 'color',
        key: 'color',
        render: (color) => <TableOutlined style={{ color: color, fontSize: '20px' }} />,
      },
      {
        title: '',
        dataIndex: '',
        key: '',
        render: (row) => {
          return (
            <span style={{ float: 'right' }}>
              <Button
                disabled={showForm}
                onClick={() => editValue(row)}
                style={{ marginRight: '5px' }}
                icon={<EditOutlined />}
              />
              <Button disabled={showForm} onClick={() => deleteValue(row)} danger icon={<DeleteOutlined />} />
            </span>
          );
        },
      },
    ];

    useEffect(() => {
      resetFormData();
      setStyle(styleDefinition);
      setShowForm(false);
    }, [visible]);

    const renderValue = (row) => {
      const { value } = row;
      if (style.equal) {
        return `igual à ${value}`;
      } else {
        return `maior ou igual à ${value}`;
      }
    };

    const resetFormData = () => {
      setFormData({ pos: null, value: null, color: '#3388ff' });
    };

    const onChangeFormData = (key, value) => {
      setFormData({ ...formData, [key]: value });
    };

    const renderValueForm = () => {
      return (
        <div style={{ paddingBottom: '25px' }}>
          <div className="field">
            <div className="field-label">{style.equal ? 'Valor' : 'Valor Inicial'}</div>
            <div>
              <Input
                value={formData.value}
                onChange={(e) => onChangeFormData('value', e.target.value)}
                placeholder="Informe o valor"
              />
            </div>
          </div>
          <div className="field">
            <div className="field-label">Cor</div>
            <div>
              <input
                type="color"
                style={{ width: '100px' }}
                value={formData.color}
                onChange={(event) => onChangeFormData('color', event.target.value)}
              />
            </div>
          </div>

          <div style={{ float: 'right' }}>
            <Button
              onClick={() => {
                setShowForm(false);
                resetFormData();
              }}
              icon={<CloseOutlined />}
              style={{ marginRight: '10px', color: 'red' }}
            >
              Cancelar
            </Button>
            <Button icon={<CheckOutlined />} onClick={onAddValue} style={{ color: 'green' }}>
              {editType === 'new' ? 'Adicionar' : 'Salvar'} Valor
            </Button>
          </div>
        </div>
      );
    };

    const deleteValue = (row) => {
      const newStyle = { ...style };
      newStyle.values.splice(row.pos, 1);
      newStyle.values = newStyle.values.map((item, idx) => {
        item.pos = idx;
        return item;
      });
      setStyle(newStyle);
    };

    const editValue = (row) => {
      setEditType('edit');
      setFormData(row);
      setShowForm(true);
    };

    const onAddValue = () => {
      const newStyle = { ...style };
      if (editType === 'new') {
        newStyle.values.push(formData);
        newStyle.values = newStyle.values.map((item, idx) => {
          item.pos = idx;
          return item;
        });
      } else {
        newStyle.values[formData.pos] = formData;
      }
      setStyle(newStyle);
      setShowForm(false);
      resetFormData();
    };

    const onOkGenerateFunction = () => {
      onOk(getStyleWithColorFunction(style));
    };

    return (
      <Modal
        visible={visible}
        title={'Definição de Estilo de Mapa Temático'}
        onCancel={onCancel}
        onOk={onOkGenerateFunction}
        closable={false}
        okText="Salvar"
        width={'70%'}
        cancelText="Cancelar"
      >
        <Row gutter={8}>
          <Col span={12}>
            <div className="field">
              <div className="field-label">Tipo de Comparação</div>
              <Radio.Group
                value={style.equal ? 'equal' : 'steps'}
                onChange={(e) => {
                  setStyle({ ...style, equal: e.target.value === 'equal' });
                }}
                name="radiogroup"
                defaultValue={'steps'}
              >
                <Radio value={'steps'}>Intervalos</Radio>
                <Radio value={'equal'}>Igualdade</Radio>
              </Radio.Group>
            </div>
          </Col>
          <Col span={12}>
            <div className="field">
              <div className="field-label">Cor Padrão</div>
              <input
                type="color"
                style={{ width: '100px' }}
                value={style.defaultColor}
                onChange={(event) => setStyle({ ...style, defaultColor: event.target.value })}
              />
            </div>
          </Col>
        </Row>
        <div className="field">
          <div className="field-label">Coluna</div>
          <div>
            <Select
              placeholder={'Selecione uma coluna'}
              style={{ width: '100%' }}
              showSearch
              onChange={(value) => {
                setStyle({ ...style, column: value });
              }}
              value={style.column}
              defaultValue={style.column}
            >
              {tableColumns.map((col) => {
                return <Select.Option value={col}>{col}</Select.Option>;
              })}
            </Select>
          </div>
        </div>
        <Table
          size="small"
          pagination={{ pageSize: 10 }}
          columns={columnsChoropleth}
          dataSource={style.values}
          key={new Date()}
        />
        <div className="add-value-choropleth">
          {!showForm && (
            <Button
              onClick={() => {
                setShowForm(true);
                setEditType('new');
              }}
              icon={<PlusOutlined />}
              type="dashed"
              style={{ width: '100%' }}
            >
              Adicionar Valor
            </Button>
          )}
          <Collapse activeKey={showForm ? '1' : null}>
            <Collapse.Panel header="This is panel header 1" key="1">
              {showForm && renderValueForm()}
            </Collapse.Panel>
          </Collapse>
        </div>
      </Modal>
    );
  }
);

export default ChoroplethModal;
