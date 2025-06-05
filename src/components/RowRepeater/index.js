import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Table, Modal, message } from 'antd';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, inputType, options, placeholder, required, requiredMessage, ...restProps }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    
    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    ...(required ? [{
                        required: true,
                        message: requiredMessage || `${title} is required.`
                    }] : [])
                ]}
            >
                {inputType === 'select' ? (
                <Select
                    ref={inputRef}
                    onBlur={save}
                    onPressEnter={save}
                    placeholder={`Choose ${title.toLowerCase()}`}
                >
                    {options?.map(opt => (
                    <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                    </Select.Option>
                    ))}
                </Select>
                ) : inputType === 'textarea' ? (
                <Input.TextArea 
                    ref={inputRef} 
                    onBlur={save} 
                    onPressEnter={save} 
                    autoSize
                    placeholder={placeholder || `Enter ${title.toLowerCase()}`}
                />
                ) : (
                <Input 
                    ref={inputRef} 
                    onBlur={save} 
                    onPressEnter={save} 
                    placeholder={placeholder || `Enter ${title.toLowerCase()}`}
                />
                )}
            </Form.Item>
        ) : (
           <div
                className="editable-cell-value-wrap"
                style={{ 
                    paddingInlineEnd: 24, 
                    minHeight: 32, 
                    cursor: 'pointer',
                    color: !children[1] ? '#bfbfbf' : 'inherit' 
                }}
                onClick={toggleEdit}
            >
                {children[1] || (placeholder || `Click to fill ${title.toLowerCase()}`)}
            </div>
        );
    }
    
    return <td {...restProps}>{childNode}</td>;
};

const RowRepeater = ({
    dataSource = [],
    columns = [],
    onChange = () => {},
    onAddRow = () => {},
    onDeleteRow = () => {},
    onSubmitData = () => {},
}) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSave = row => {
        const newData = [...dataSource];
        const index = newData.findIndex(item => item.key === row.key);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            onChange(newData);
        }
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const mappedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
                inputType: col.inputType,
                options: col.options,
                placeholder: col.placeholder,
                required: col.required,
                requiredMessage: col.requiredMessage
            }),
        };
    });

    const showConfirmModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = async () => {
        setIsModalVisible(false);
        try {
            const result = await onSubmitData(dataSource);
            message.success('Data berhasil dikirim!');
            // Clear dataSource when response success
            if (result) {
                onChange([]); // Clear rows
            }
        } catch (error) {
            console.error('Error sending data:', error);
            message.error('Gagal mengirim data.');
        }
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Button onClick={onAddRow} type="primary" style={{ marginBottom: 16 }}>
                Add a row
            </Button>
            <Button onClick={showConfirmModal} type="primary" style={{ marginBottom: 16, marginLeft: 8 }}>
                Submit Data
            </Button>
            <Table
                components={components}
                rowClassName={record => 
                    record.key === selectedRow ? 'selected-row' : 'editable-row'
                }
                bordered
                dataSource={dataSource}
                columns={mappedColumns}
                pagination={false}
                rowKey="key"
                onRow={(record) => ({
                    onClick: () => {
                        setSelectedRow(record.key);
                    },
                })}
            />
            <Modal
                title="Confirm Submission"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Yes"
                cancelText="No"
            >
                <p>Are you sure you want to submit all the data?</p>
            </Modal>
            <style>
                {`
                    .selected-row {
                        background-color: #e6f7ff;
                        transition: all 0.3s;
                    }
                    .editable-row:hover {
                        background-color: #fafafa;
                    }
                `}
            </style>
        </div>
    );
};

export default RowRepeater;