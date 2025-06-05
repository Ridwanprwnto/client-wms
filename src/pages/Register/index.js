import {
    Button,
    Form,
    Input
} from 'antd';
import React, { useState } from 'react';
import { useAuth } from '../../config/controller/AuthProvider';
import './style.css';

  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 8,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 16,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };
  
  const Register = () => {

    const [form] = Form.useForm();
    const [input, setInput] = useState({});

    const { registerAction } = useAuth();

    const onFinish = async (values) => {
        try {
            await registerAction(values);
            alert("Registration successful!");
            form.resetFields();
        } catch (error) {
            alert("Regist failed: " + error.message);
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
        <div className="register-container">
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                className="register-form"
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item 
                    name="nik"
                    label="NIK"
                    tooltip="Your employee ID number"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your NIK!',
                            whitespace: true,
                        },
                    ]}
                >
                    {/* <InputNumber min={0} /> */}
                    <Input
                        value={input.nik}
                        onChange={handleInput}
                    />
                </Form.Item>
                <Form.Item
                    name="nickname"
                    label="Nickname"
                    tooltip="What do you want others to call you?"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your nickname!',
                            whitespace: true,
                        },
                    ]}
                >
                <Input
                    value={input.nickname}
                    onChange={handleInput}
                />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                <Input
                    value={input.email}
                    onChange={handleInput}
                />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                <Input.Password
                    value={input.password}
                    onChange={handleInput} 
                />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                        },
                        }),
                    ]}
                >
                <Input.Password
                    value={input.confirm}
                    onChange={handleInput} 
                />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" className="register-form-button">
                        Register
                    </Button>
                If you already have an account, pelase <a href="login">Login</a>
                </Form.Item>
            </Form>
        </div>
    );
  };
  export default Register;