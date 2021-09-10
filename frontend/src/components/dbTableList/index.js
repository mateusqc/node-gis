import React, { useEffect, useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react';
import { Button, Input, Select, Spin, Modal, Table } from 'antd';
import './style.css';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import DbConfigModal from '../dbConfig';

const DatabaseTableListModal = observer(({ visible, onCancel }) => {
  const { dbConnectionStore } = useStores();

  const [showDBConfigModal, setShowDBConfigModal] = useState(false);

  useEffect(() => {
    dbConnectionStore.loadConnections();
  }, []);

  const toggleDBConfigModal = () => {
    setShowDBConfigModal(!showDBConfigModal);
  };

  const renderModalContent = () => {
    const columns = [
      {
        title: 'Tipo',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Cliente',
        dataIndex: 'client',
        key: 'client',
      },
      {
        title: 'Host',
        dataIndex: 'host',
        key: 'host',
      },
      {
        title: '',
        dataIndex: '',
        key: 'btns',
        render: (row) => {
          return (
            <Button
              style={{ float: 'right' }}
              danger
              icon={<DeleteOutlined />}
              onClick={() => dbConnectionStore.deleteConnection(row, dbConnectionStore.loadConnections)}
            />
          );
        },
      },
    ];
    return (
      <div>
        <Button style={{ marginBottom: '10px' }} icon={<PlusOutlined />} type="primary" onClick={toggleDBConfigModal}>
          Adicionar Conexão
        </Button>
        <Table columns={columns} dataSource={dbConnectionStore.keyedDatabaseList} loading={dbConnectionStore.loading} />
      </div>
    );
  };

  return (
    <div>
      <Modal
        title="Configurações de Banco de Dados"
        visible={visible}
        onCancel={onCancel}
        key="modal-sql"
        width={700}
        footer={[
          <Button key="back" onClick={onCancel}>
            Fechar
          </Button>,
        ]}
      >
        {renderModalContent()}
        <DbConfigModal visible={showDBConfigModal} onCancel={toggleDBConfigModal} />
      </Modal>
    </div>
  );
});

export default DatabaseTableListModal;
