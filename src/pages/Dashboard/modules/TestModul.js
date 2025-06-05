import React, { useEffect, useState } from 'react';
import { Form, Tabs, Popconfirm, Typography, Select, Button } from 'antd';
import CustomModal from "../../../components/Modal";
import DataTable from "../../../components/Table";
import moment from 'moment';

const onChange = key => {
    console.log(key);
};

// const fetchData = async () => {
//     try {
//         const response = await fetch('https://api.example.com/data'); // Ganti dengan URL API Anda
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// };

const { Option } = Select;

const dataSelect = (value) => {
    return (
        <Select placeholder={`Select Data`} defaultValue={value}>
            <Option value="John Doe">John Doe</Option>
            <Option value="Jane Smith">Jane Smith</Option>
            <Option value="Alice Johnson">Alice Johnson</Option>
        </Select>
    );
}

const dummyData = [
    {
        "id": 1,
        "name": "John Doe",
        "age": 30,
        "bornday": "2025-06-12",
        "address": "123 Main St, Anytown, USA"
    },
    {
        "id": 2,
        "name": "Jane Smith",
        "age": 25,
        "bornday": "2025-06-12",
        "address": "456 Elm St, Othertown, USA"
    },
    {
        "id": 3,
        "name": "Alice Johnson",
        "age": 28,
        "bornday": "2025-06-12",
        "address": "789 Oak St, Sometown, USA"
    }
]

const CatoegoryItem = () => {
    const [data, setData] = useState(dummyData);
    const [editingKey, setEditingKey] = useState('');
    const [formModal] = Form.useForm(); // Form untuk modal
    const [formTable] = Form.useForm(); // Form untuk tabel


    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        const newData = {
            name: values.username,
            email: values.email,
            bornday: values.dateOfBirth.format('YYYY-MM-DD'),
            desc: values.desc,
        };
        console.log('Received values:', newData);
        setData([...data, newData]);
        setIsModalVisible(false);
    };

    const formFields = [
        {
            name: 'username',
            label: 'Username',
            type: 'input',
            rules: [{ required: true, message: 'Please input your username!' }],
            placeholder: 'Enter your username',
            style: { width: '350px' },
        },
        {
            name: 'email',
            label: 'Email',
            type: 'input',
            rules: [{ required: true, message: 'Please input your email!' }],
            placeholder: 'Enter your email',
            style: { width: '350px' },
        },
        {
            name: 'dateOfBirth',
            label: 'Date of Birth',
            type: 'date',
            rules: [{ required: true, message: 'Please select your date of birth!' }],
            placeholder: 'Select your date of birth',
            style: { width: '350px' },
        },
        {
            name: 'desc',
            label: 'Username',
            type: 'textarea',
            rules: [{ required: true, message: 'Please input your username!' }],
            placeholder: 'Enter your username',
            style: { width: '350px' },
        },
    ];


    // useEffect(() => {
    //     const fetchDataFromAPI = async () => {
    //         const dataFromAPI = await fetchData();
    //         setData(dataFromAPI);
    //     };
    //     fetchDataFromAPI();
    // }, []);

    const columns = [
        {
            title: 'Name',
            dataType: 'select',
            dataIndex: 'name',
            width: '20%',
            editable: false,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            dataType: 'number',
            width: '15%',
            editable: true,
        },
        {
            title: 'Bornday',
            dataIndex: 'bornday',
            dataType: 'date',
            width: '15%',
            editable: true,
        },
        {
            title: 'Address',
            dataType: 'text',
            dataIndex: 'address',
            width: '40%',
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = editingKey === record.id;
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => handleSave(record.id)} style={{ marginInlineEnd: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                    <Typography.Link onClick={() => handleEdit(record)} style={{ marginInlineEnd: 8 }}>
                        Edit
                    </Typography.Link>
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)} style={{ marginInlineEnd: 8 }}>
                        <a>Delete</a>
                    </Popconfirm>
                </>
                );
            },
            editable: false,
        },
    ];

    const handleEdit = (record) => {
        formTable.setFieldsValue({
            name: record.name,
            age: record.age,
            bornday: moment(record.bornday),
            address: record.address,
        });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const handleSave = async (key) => {
        try {
            const row = await formTable.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.id);
            if (index > -1) {
                const item = newData[index];
                // newData.splice(index, 1, { ...item, ...row });
                newData.splice(index, 1, { ...item, ...row, bornday: row.bornday.format('YYYY-MM-DD') });
                setData(newData);
                setEditingKey('');
                console.log(newData[index]);
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (err) {
            console.log('Validate Failed:', err);
        }
    };

    const handleDelete = (id) => {
        const newData = data.filter(item => item.id !== id);
        setData(newData);
    };

    return (
        <div>
            <Button type="primary" onClick={showModal} style={{ marginBottom: 12 }}>
                Add Items
            </Button>
            <CustomModal
                visible={isModalVisible}
                onClose={handleClose}
                onSubmit={handleSubmit}
                formFields={formFields}
                title={"Modal Content"}
                modalWidth={400}
                formModal={formModal} // Kirim form ke CustomModal
            />
            <DataTable columns={columns} data={data} editingKey={editingKey} formTable={formTable} dataSelect={dataSelect} />
        </div>
    );
};

const items = [
    {
        key: '1',
        label: 'Catoegory Items',
        children: <CatoegoryItem />,
    },
    {
        key: '2',
        label: 'Type Items',
        children: 'Content of Tab Pane 2',
    },
];

const MasterItem = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;

export default MasterItem;