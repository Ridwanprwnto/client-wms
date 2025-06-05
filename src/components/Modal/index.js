// CustomModal.js
import React from 'react';
import { Modal, Form, Input, Button, Select, DatePicker } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const CustomModal = ({ visible, onClose, onSubmit, formFields, title, modalWidth, formModal }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
        .validateFields()
        .then(values => {
            onSubmit(values);
            form.resetFields();
        })
        .catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const renderField = (field) => {
        const fieldStyle = field.style || {};
        switch (field.type) {
        case 'input':
            return (
            <Input placeholder={field.placeholder} style={{ width: fieldStyle.width }}/>
            );
        case 'select':
            return (
                <Select
                    placeholder={field.placeholder}
                    showSearch
                    style={{ width: fieldStyle.width }}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {field.options.map((option, index) => (
                        <Option key={index} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            );
        case 'date':
            return (
                <DatePicker placeholder={field.placeholder} style={{ width: fieldStyle.width }}/>
            );
        case 'textarea':
            return (
                <TextArea placeholder={field.placeholder} style={{ width: fieldStyle.width }}/>
            );
        default:
            return null;
        }
    };

    return (
        <Modal
            title={title}
            visible={visible}
            onOk={handleOk}
            onCancel={onClose}
            width={modalWidth}
        >
            <Form form={form} layout="vertical">
                {formFields.map((field, index) => (
                <Form.Item
                    key={index}
                    name={field.name}
                    label={field.label}
                    rules={field.rules}
                >
                    {renderField(field)}
                </Form.Item>
                ))}
            </Form>
        </Modal>
    );
};

export default CustomModal;