import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  SettingOutlined,
  PlusOutlined,
  DatabaseOutlined,
  RadiusSettingOutlined,
  GlobalOutlined,
  BlockOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { observer } from 'mobx-react';
import './style.css';
import { useStores } from '../../hooks/useStores';
import AddLayerModal from '../addLayerModal';
import SelectedQueryModal from '../selectedQueryModal';
import SqlModal from '../sqlModal';
import DbConfigModal from '../dbConfig';
import DatabaseTableListModal from '../dbTableList';

const { SubMenu } = Menu;

const TopMenu = observer(() => {
  const { mapStore } = useStores();
  const [showAddLayersModal, setShowAddLayersModal] = useState(false);
  const [showSelectedQueryModal, setShowSelectedQueryModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showDatabaseListModal, setShowDatabaseListModal] = useState(false);

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

  const toggleDatabaseListModal = () => {
    setShowDatabaseListModal(!showDatabaseListModal);
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
          <SubMenu key="save" icon={<SaveOutlined />} title="Salvar">
            <Menu.Item icon={<GlobalOutlined />} onClick={mapStore.saveLayers} key="map-state">
              Estado Atual do Mapa
            </Menu.Item>
          </SubMenu>
          <SubMenu key="spatial-query" icon={<GlobalOutlined />} title="Consulta Espacial">
            <Menu.Item icon={<BlockOutlined />} onClick={toggleShowSelectedQueryModal} key="query-selection">
              A partir de Sele????o
            </Menu.Item>
            <Menu.Item icon={<DatabaseOutlined />} onClick={toggleSqlModal} key="query-sql">
              Consulta SQL
            </Menu.Item>
          </SubMenu>
          <SubMenu key="config" icon={<SettingOutlined />} title="Configura????es">
            <Menu.Item icon={<DatabaseOutlined />} onClick={toggleDatabaseListModal} key="db-conexion">
              Conex??o ?? Banco de Dados
            </Menu.Item>
          </SubMenu>
        </Menu>
      </span>
      <span className="logo-text">
        <b>NodeGIS</b>
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
      <DatabaseTableListModal visible={showDatabaseListModal} onCancel={toggleDatabaseListModal} />
    </div>
  );
});

export default TopMenu;
