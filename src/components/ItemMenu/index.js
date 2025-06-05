// src/pages/Dashboard/MenuComponent.js
import React from 'react';
import { Menu } from 'antd';
import {
    DashboardOutlined,
    SettingOutlined,
    QuestionCircleOutlined,
    FileOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const MenuComponent = ({ setBreadcrumb }) => {
    const dataItem = [
        {
            id: "dashboard",
            title: "Dashboard",
            icon: <DashboardOutlined />
        },
        {
            id: "master",
            title: "Master",
            icon: <SettingOutlined />,
            subItems: [
                {
                    id: "master-item",
                    title: "Master Item",
                    icon: <FileOutlined />
                },
                {
                    id: "security",
                    title: "Security",
                    icon: <UserOutlined />
                }
            ]
        },
        {
            id: "help",
            title: "Help",
            icon: <QuestionCircleOutlined />,
        },
        {
            id: "reports",
            title: "Reports",
            icon: <FileOutlined />,
            subItems: [
                {
                    id: "monthly-reports",
                    title: "Monthly Reports",
                    icon: <FileOutlined />
                },
                {
                    id: "annual-reports",
                    title: "Annual Reports",
                    icon: <FileOutlined />,
                    subItems: [
                        {
                            id: "q1-reports",
                            title: "Q1 Reports",
                            icon: <FileOutlined />
                        },
                        {
                            id: "q2-reports",
                            title: "Q2 Reports",
                            icon: <FileOutlined />
                        }
                    ]
                }
            ]
        }
    ];

    const findItemPath = (itemId, items, path = []) => {
        for (const item of items) {
            path.push(item.title);
            if (item.id === itemId) {
                return path;
            }
            if (item.subItems) {
                const result = findItemPath(itemId, item.subItems, path);
                if (result) {
                    return result;
                }
            }
            path.pop();
        }
        return null;
    };

    const handleClick = (item) => {
        const path = findItemPath(item.id, dataItem);
        if (path) {
            setBreadcrumb(path);
        }
    };

    const buildPath = (titles) => {
        const path = titles.map(title => title.replace(/ /g, '-').toLowerCase()).join('/');
        return path;
    };

    return (
        <Menu theme="dark" mode="inline">
            {dataItem.map(item => (
                item.subItems ? (
                    <Menu.SubMenu key={item.id} icon={item.icon} title={item.title}>
                        {item.subItems.map(subItem => (
                            subItem.subItems ? (
                                <Menu.SubMenu key={subItem.id} icon={subItem.icon} title={subItem.title}>
                                    {subItem.subItems.map(subSubItem => (
                                        <Menu.Item key={subSubItem.id} onClick={() => handleClick(subSubItem)}>
                                            <Link to={`/${buildPath([item.id, subItem.id, subSubItem.id])}`}>
                                                {subSubItem.icon} {subSubItem.title}
                                            </Link>
                                        </Menu.Item>
                                    ))}
                                </Menu.SubMenu>
                            ) : (
                                <Menu.Item key={subItem.id} onClick={() => handleClick(subItem)}>
                                    <Link to={`/${buildPath([item.id, subItem.id])}`}>
                                        {subItem.icon} {subItem.title}
                                    </Link>
                                </Menu.Item>
                            )
                        ))}
                    </Menu.SubMenu>
                ) : (
                    <Menu.Item key={item.id} icon={item.icon} onClick={() => handleClick(item)}>
                        <Link to={`/${item.id}`}>
                            {item.title}
                        </Link>
                    </Menu.Item>
                )
            ))}
        </Menu>
    );
};

export default MenuComponent;