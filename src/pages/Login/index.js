import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import React, { useState } from 'react';
import { useAuth } from '../../config/controller/AuthProvider';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Login = () => {
    const [input, setInput] = useState({});

    const { loginAction } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            await loginAction(values);
            navigate("/dashboard");
        } catch (error) {
            alert("Login failed: " + error.message);
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    
    return (
        <div className="login-container">
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                    ]}
                >
                    <Input 
                        prefix={<UserOutlined className="site-form-item-icon" />} 
                        placeholder="Username"
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={handleInput}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your Password!',
                    },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={handleInput}
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="forgot-#">
                        Forgot password
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                    </Button>
                    Or <a href="register">register now!</a>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;