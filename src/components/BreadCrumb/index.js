// src/components/Breadcrumb.js
import React from 'react';
import { Breadcrumb as AntBreadcrumb } from 'antd';

const Breadcrumb = ({ breadcrumb }) => {
    return (
        <AntBreadcrumb style={{ margin: '16px 0' }}>
            <AntBreadcrumb.Item>
                Home
            </AntBreadcrumb.Item>
            {breadcrumb.map((item, index) => {
                return (
                    <AntBreadcrumb.Item key={index}>
                        {item}
                    </AntBreadcrumb.Item>
                );
            })}
        </AntBreadcrumb>
    );
};

export default Breadcrumb;