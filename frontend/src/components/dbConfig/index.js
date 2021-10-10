import React, { useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react';
import Modal from 'antd/lib/modal/Modal';
import { Alert, Button, Input, Select } from 'antd';
import './style.css';

const { Option } = Select;

const DbConfigModal = observer(({ visible, onCancel, isEdit }) => {
  const databaseList = [
    { value: 'postgresql', name: 'PostgreSQL' },
    { value: 'mysql', name: 'MySQL' },
    { value: 'mariadb', name: 'MariaDB' },
    { value: 'mssql', name: 'Microsoft SQL Server' },
    { value: 'sqlite', name: 'SQLite' },
  ];

  const innerOnCancel = () => {
    clearFormData();
    onCancel();
  };

  const { dbConnectionStore } = useStores();

  const [formData, setFormData] = useState({
    type: '',
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
    dialect: '',
    active: 'false',
  });

  const onChangeValue = (value, key) => {
    setFormData({ ...formData, [key]: value });
  };

  const clearFormData = () => {
    setFormData({
      type: '',
      host: '',
      port: '',
      username: '',
      password: '',
      database: '',
      dialect: '',
      active: 'false',
    });
  };

  const renderModalContent = () => {
    return (
      <>
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
          onChange={(event) => onChangeValue(event.target.value, 'username')}
        />
        <Input.Password
          addonBefore="Senha"
          style={{ marginTop: '5px' }}
          onChange={(event) => onChangeValue(event.target.value, 'password')}
        />
      </>
    );
  };

  const renderModalContentSqlite = () => {
    return (
      <>
        <Input
          addonBefore="Diretório de Armazenamento"
          style={{ marginTop: '5px' }}
          onChange={(event) => onChangeValue(event.target.value, 'host')}
        />
        <Alert message="O diretório deverá ser acessível a partir do backend!" type="info" showIcon />
      </>
    );
  };

  return (
    <div>
      <Modal
        title="Adicionar Configurações de Banco de Dados"
        visible={visible}
        onCancel={innerOnCancel}
        key="modal-sql"
        footer={[
          <Button key="back" onClick={innerOnCancel}>
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={dbConnectionStore.loading}
            onClick={() => {
              dbConnectionStore.createConnection(formData, () => {
                innerOnCancel();
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
          disabled={isEdit}
          onChange={(value) => {
            if (value === 'sqlite' || formData.type === 'sqlite') {
              clearFormData();
            }
            onChangeValue(value, 'type');
            onChangeValue(value, 'dialect');
          }}
        >
          {databaseList.map((type) => {
            return <Option value={type.value}>{type.name}</Option>;
          })}
        </Select>
        {formData.type === 'sqlite' ? renderModalContentSqlite() : renderModalContent()}
      </Modal>
    </div>
  );
});

export default DbConfigModal;
