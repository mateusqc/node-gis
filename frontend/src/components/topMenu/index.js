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
          <SubMenu key="add" icon={<PlusOutlined />} title="Add">
            <Menu.Item icon={<RadiusSettingOutlined />} onClick={toggleAddLayersModal} key="layer">
              Vector Layer
            </Menu.Item>
          </SubMenu>
          <SubMenu key="save" icon={<SaveOutlined />} title="Salve">
            <Menu.Item icon={<GlobalOutlined />} onClick={mapStore.saveLayers} key="map-state">
              Map Current State
            </Menu.Item>
          </SubMenu>
          <SubMenu key="spatial-query" icon={<GlobalOutlined />} title="Spatial Query">
            <Menu.Item icon={<BlockOutlined />} onClick={toggleShowSelectedQueryModal} key="query-selection">
              From Selection
            </Menu.Item>
            <Menu.Item icon={<DatabaseOutlined />} onClick={toggleSqlModal} key="query-sql">
              SQL Query
            </Menu.Item>
          </SubMenu>
          <SubMenu key="config" icon={<SettingOutlined />} title="Configuration">
            <Menu.Item icon={<DatabaseOutlined />} onClick={toggleDatabaseListModal} key="db-conexion">
              Database Conection
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
