import React, { useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react';
import Modal from 'antd/lib/modal/Modal';
import { Button, Input, Select } from 'antd';
import './style.css';

const { Option } = Select;

const DbConfigModal = observer(({ visible, onCancel }) => {
  const { dbConnectionStore } = useStores();

  const [formData, setFormData] = useState({
    type: '',
    client: 'dev',
    host: '',
    database: '',
    user: '',
    password: '',
  });

  const onChangeValue = (value, key) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div>
      <Modal
        title="Adicionar Configurações de Banco de Dados"
        visible={visible}
        onCancel={onCancel}
        key="modal-sql"
        footer={[
          <Button key="back" onClick={onCancel}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={dbConnectionStore.loading}
            onClick={() => {
              dbConnectionStore.createConnection(formData, () => {
                onCancel();
                dbConnectionStore.loadConnections();
              });
            }}
          >
            Configurar
          </Button>,
        ]}
      >
        <Select
          placeholder={'Tipo do Banco '}
          style={{ width: '100%' }}
          onChange={(value) => {
            onChangeValue(value, 'type');
          }}
        >
          {[{ name: 'postgresql' }].map((type) => {
            return <Option value={type.name}>{type.name}</Option>;
          })}
        </Select>
        <Input
          addonBefore="Host"
          style={{ marginTop: '5px' }}
          onChange={(event) => onChangeValue(event.target.value, 'host')}
        />
        <Input
          addonBefore="Porta"
          style={{ marginTop: '5px' }}
          onChange={(event) => onChangeValue(event.target.value, 'port')}
        />
        <Input
          addonBefore="Nome do Banco"
          style={{ marginTop: '5px' }}
          onChange={(event) => onChangeValue(event.target.value, 'database')}
        />
        <Input
          addonBefore="Usuário"
          style={{ marginTop: '5px' }}
          onChange={(event) => onChangeValue(event.target.value, 'user')}
        />
        <Input.Password
          addonBefore="Senha"
          style={{ marginTop: '5px' }}
          onChange={(event) => onChangeValue(event.target.value, 'password')}
        />
      </Modal>
    </div>
  );
});

export default DbConfigModal;
