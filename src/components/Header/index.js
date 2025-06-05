import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Drawer } from 'antd';
import { UserOutlined, LogoutOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { useAuth } from '../../config/controller/AuthProvider';
import './style.css';

const { Header } = Layout;

const HeaderContent = ({ user }) => {
    const [open, setOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { logOut } = useAuth();

    const showDrawer = () => {
      setOpen(true);
    };
  
    const onClose = () => {
      setOpen(false);
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={showDrawer}>
                <UserOutlined style={{ marginRight: 8 }}/>
                Profile
            </Menu.Item>
            <Menu.Item key="2" onClick={logOut}>
            <LogoutOutlined style={{ marginRight: 8 }}/>
                Logout
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <Header className="site-layout-background" style={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <div className="full-screen" style={{ display: 'flex', alignItems: 'center', marginLeft: 16 }}>
                    <Avatar
                        shape="square" 
                        size="medium"
                        icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                        onClick={toggleFullscreen} 
                        style={{ 
                            cursor: 'pointer', 
                            marginLeft: 'auto',
                            color: '#000000', 
                            backgroundColor: '#ffffff'
                        }} 
                    />
                </div>
                {user && (
                    <span className="user-name" style={{ marginRight: 8, color: '#888888' }}>
                        {"Welcome (" + user.id + "), " + user.name}
                    </span>
                )}
                <Dropdown overlay={menu} trigger={['click']} arrow>
                    <Avatar size="medium" icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                </Dropdown>
            </Header>

            <Drawer
                title="User  Profile"
                placement="right"
                onClose={onClose}
                open={open}
                width={300}
            >
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
            </Drawer>
        </>
    );
};

export default HeaderContent;