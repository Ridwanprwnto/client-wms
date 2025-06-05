// src/pages/Dashboard/index.js
import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import MenuComponent from '../../components/ItemMenu';
import Breadcrumb from '../../components/BreadCrumb';
import HeaderContent from '../../components/Header';
import { useAuth } from '../../config/controller/AuthProvider';
import Home from './modules/Home';
import MasterItem from './modules/ModuleMasterItem';
import './style.css';

const { Content, Footer, Sider } = Layout;

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const location = useLocation();
    const { userData, fetchUserData } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            await fetchUserData();
        };
        fetchData();
    }, [fetchUserData]);

    const dataItem = [
        {
            id: 1,
            title: "Dashboard",
            path: "/dashboard",
            component: <Home />
        },
        {
            id: 2,
            title: "Master",
            path: "/master",
            component: <div>Settings Page</div>,
            subItems: [
                {
                    id: 2.1,
                    title: "Master Item",
                    path: "/master/master-item",
                    component: <MasterItem />
                },
                {
                    id: 2.2,
                    title: "Security",
                    path: "/settings/security",
                    component: <div>Security Page</div>
                }
            ]
        },
        {
            id: 3,
            title: "Help",
            path: "/help",
            component: <div>Help Page</div>
        },
        {
            id: 4,
            title: "Reports",
            path: "/reports",
            component: <div>Reports Page</div>,
            subItems: [
                {
                    id: 4.1,
                    title: "Monthly Reports",
                    path: "/reports/monthly-reports",
                    component: <div>Monthly Reports Page</div>
                },
                {
                    id: 4.2,
                    title: "Annual Reports",
                    path: "/reports/annual-reports",
                    component: <div>Annual Reports Page</div>,
                    subItems: [
                        {
                            id: 4.21,
                            title: "Q1 Reports",
                            path: "/reports/annual-reports/q1-reports",
                            component: <div>Q1 Reports Page</div>
                        },
                        {
                            id: 4.22,
                            title: "Q2 Reports",
                            path: "/reports/annual-reports/q2-reports",
                            component: <div>Q2 Reports Page</div>
                        }
                    ]
                }
            ]
        }
    ];
    
    const buildRoutes = (items) => {
        return items.map(item => {
            const routes = [];
            if (item.subItems) {
                routes.push(...buildRoutes(item.subItems));
            }
            routes.push(
                <Route key={item.id} path={item.path} element={item.component} />
            );
            return routes;
        });
    };

    const findBreadcrumb = (path, items) => {
        for (const item of items) {
            if (item.path === path) {
                return [item.title];
            }
            if (item.subItems) {
                const subBreadcrumb = findBreadcrumb(path, item.subItems);
                if (subBreadcrumb) {
                    return [item.title, ...subBreadcrumb];
                }
            }
        }
        return null;
    };

    useEffect(() => {
        const currentPath = location.pathname;
        const breadcrumbPath = findBreadcrumb(currentPath, dataItem);
        if (breadcrumbPath) {
            setBreadcrumb(breadcrumbPath);
        } else {
            setBreadcrumb([]);
        }
    }, [location]);
    

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="logo" />
                <MenuComponent setBreadcrumb={setBreadcrumb} />
            </Sider>
            <Layout className="site-layout">
                <HeaderContent user={ userData ? userData : {} } className="site-layout-header"/>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb breadcrumb={breadcrumb} />
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        <Routes>
                            {buildRoutes(dataItem)}
                            <Route path="*" element={<Navigate to="/dashboard" />} />
                        </Routes>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Developed by Purwanto Ridwan. © 2025
                </Footer>
            </Layout>
        </Layout>
    );
};

export default Dashboard;