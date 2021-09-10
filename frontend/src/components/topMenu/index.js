import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  SettingOutlined,
  PlusOutlined,
  DatabaseOutlined,
  RadiusSettingOutlined,
  GlobalOutlined,
  BlockOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react';
import './style.css';
import { useStores } from '../../hooks/useStores';
import AddLayerModal from '../addLayerModal';
import SelectedQueryModal from '../selectedQueryModal';
import SqlModal from '../sqlModal';
import DbConfigModal from '../dbConfig';

const { SubMenu } = Menu;

const TopMenu = observer(() => {
  const { mapStore } = useStores();
  const [showAddLayersModal, setShowAddLayersModal] = useState(false);
  const [showSelectedQueryModal, setShowSelectedQueryModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showDBConfigModal, setShowDBConfigModal] = useState(false);

  const toggleAddLayersModal = () => {
    !showAddLayersModal && mapStore.getAvailableLayers();
    setShowAddLayersModal(!showAddLayersModal);
  };

  const toggleShowSelectedQueryModal = () => {
    setShowSelectedQueryModal(!showSelectedQueryModal);
  };

  const toggleSqlModal = () => {
    setShowSqlModal(!showSqlModal);
  };

  const toggleDBConfigModal = () => {
    setShowDBConfigModal(!showDBConfigModal);
  };

  return (
    <div>
      <span className="menu-section">
        <Menu selectedKeys={[]} mode="horizontal">
          <SubMenu key="add" icon={<PlusOutlined />} title="Adicionar">
            <Menu.Item icon={<RadiusSettingOutlined />} onClick={toggleAddLayersModal} key="layer">
              Camada Vetorial
            </Menu.Item>
          </SubMenu>
          <SubMenu key="spatial-query" icon={<GlobalOutlined />} title="Consulta Espacial">
            <Menu.Item icon={<BlockOutlined />} onClick={toggleShowSelectedQueryModal} key="query-selection">
              A partir de Seleção
            </Menu.Item>
            <Menu.Item icon={<DatabaseOutlined />} onClick={toggleSqlModal} key="query-sql">
              Consulta SQL
            </Menu.Item>
          </SubMenu>
          <SubMenu key="config" icon={<SettingOutlined />} title="Configurações">
            <Menu.Item icon={<DatabaseOutlined />} onClick={toggleDBConfigModal} key="db-conexion">
              Conexão à Banco de Dados
            </Menu.Item>
          </SubMenu>
        </Menu>
      </span>
      <span className="logo-text">
        <b>swGIS</b>
      </span>
      <SelectedQueryModal
        visible={showSelectedQueryModal}
        onOk={toggleShowSelectedQueryModal}
        onCancel={toggleShowSelectedQueryModal}
      />
      <AddLayerModal
        editLayerKey={null}
        visible={showAddLayersModal}
        onOk={toggleAddLayersModal}
        onCancel={toggleAddLayersModal}
      />
      <SqlModal visible={showSqlModal} onCancel={toggleSqlModal} />
      <DbConfigModal visible={showDBConfigModal} onCancel={toggleDBConfigModal} />
    </div>
  );
});

export default TopMenu;
