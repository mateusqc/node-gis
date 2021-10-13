import React, { useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react';
import Modal from 'antd/lib/modal/Modal';
import { Alert, Button, Input, Select } from 'antd';
import './style.css';

const { Option } = Select;

const DbConfigModal = observer(({ visible, onCancel, isEdit }) => {
  const databaseList = [
    { value: 'postgres', name: 'PostgreSQL' },
    { value: 'cockroach', name: 'CockroachDB' },
    { value: 'mysql', name: 'MySQL' },
    { value: 'mariadb', name: 'MariaDB' },
    { value: 'sqlite', name: 'SQLite (SpatiaLite)' },
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
    user: '',
    password: '',
    database: '',
    dialect: '',
    active: 'false',
  });
  const [selectedDatabase, setSelectedDatabase] = useState(undefined);

  const onChangeValue = (value, key) => {
    setFormData({ ...formData, [key]: value });
  };

  const clearFormData = () => {
    setSelectedDatabase(undefined);
    setFormData({
      type: '',
      host: '',
      port: '',
      user: '',
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
          onChange={(event) => onChangeValue(event.target.value, 'user')}
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
          style={{ marginTop: '5px', marginBottom: '5px' }}
          onChange={(event) => onChangeValue(event.target.value, 'host')}
        />
        <Alert message="O diretório deverá ser acessível a partir do backend." type="info" showIcon />
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
              dbConnectionStore.createConnection(
                { ...formData, type: selectedDatabase, dialect: selectedDatabase },
                () => {
                  innerOnCancel();
                  dbConnectionStore.loadConnections();
                }
              );
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
          value={selectedDatabase}
          defaultValue={selectedDatabase}
          onChange={(value) => {
            debugger;
            if (value === 'sqlite' || selectedDatabase === 'sqlite') {
              clearFormData();
            }
            setSelectedDatabase(value);
          }}
        >
          {databaseList.map((type) => {
            return <Option value={type.value}>{type.name}</Option>;
          })}
        </Select>
        {selectedDatabase === 'sqlite' ? renderModalContentSqlite() : renderModalContent()}
      </Modal>
    </div>
  );
});

export default DbConfigModal;
