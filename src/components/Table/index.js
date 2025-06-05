import React from 'react';
import { Form, Input, InputNumber, Table, DatePicker } from 'antd';
import './style.css';

const { TextArea } = Input;

const DataTable = ({ columns, data, editingKey, formTable, dataSelect }) => {

    const EditableCell = ({ editing, dataIndex, title, inputType, children, record }) => {

        let inputNode;

        switch (inputType) {
            case 'number':
                inputNode = <InputNumber min={0} />;
                break;
            case 'textarea':
                inputNode = <TextArea rows={2} />;
                break;
            case 'select':
                inputNode = dataSelect(record[dataIndex]);
                break;
            case 'date':
                inputNode = <DatePicker format="YYYY-MM-DD" />;
                break;
            default:
                inputNode = <Input />;
                break;
        }

        return (
            <td>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: `Please Input ${title}!` }]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const isEditing = (record) => record.id === editingKey;

    const mergedColumns = columns.map((col) => ({
        ...col,
        onCell: (record) => ({
            record,
            inputType: col.dataType || 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record) && col.editable !== false,
        }),
    }));

    return (
        <Form form={formTable} component={false}>
            <Table
                components={{ body: { cell: EditableCell } }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{ onChange: () => editingKey }}
            />
        </Form>
    );
};

export default DataTable;