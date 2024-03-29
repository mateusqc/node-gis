import React, { useEffect, useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react';
import { Button, Input, Select, Spin, Modal, Table, Tooltip } from 'antd';
import './style.css';
import { CheckOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
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
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Host',
        dataIndex: 'host',
        key: 'host',
      },
      {
        title: 'Port',
        dataIndex: 'port',
        key: 'port',
      },
      {
        title: '',
        dataIndex: '',
        key: 'btns',
        render: (row) => {
          return (
            <span style={{ float: 'right' }}>
              {row.active === 'true' ? (
                <Button style={{ color: 'green', marginRight: '10px' }} disabled icon={<CheckOutlined />} />
              ) : (
                <Tooltip title="Select as Active Conection">
                  <Button
                    style={{ color: 'red', marginRight: '10px' }}
                    icon={<CloseOutlined />}
                    onClick={() => dbConnectionStore.setActiveDatabase(row)}
                  />
                </Tooltip>
              )}
              <Tooltip title="Remove">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => dbConnectionStore.deleteConnection(row, dbConnectionStore.loadConnections)}
                />
              </Tooltip>
            </span>
          );
        },
      },
    ];
    return (
      <div>
        <Button style={{ marginBottom: '10px' }} icon={<PlusOutlined />} type="primary" onClick={toggleDBConfigModal}>
          Add Conection
        </Button>
        <Table columns={columns} dataSource={dbConnectionStore.keyedDatabaseList} loading={dbConnectionStore.loading} />
      </div>
    );
  };

  return (
    <div>
      <Modal
        title="Database Configurations"
        visible={visible}
        onCancel={onCancel}
        key="modal-sql"
        width={700}
        footer={[
          <Button key="back" onClick={onCancel}>
            Close
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
