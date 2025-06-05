import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Form, Tabs, Popconfirm, Typography, Select, Button } from 'antd';
import { useAuth } from '../../../config/controller/AuthProvider';
import CustomModal from "../../../components/Modal";
import DataTable from "../../../components/Table";
import RowRepeater from "../../../components/RowRepeater";

const CategoryItem = forwardRef((props, ref) => {

    const { categoryData, createCategoryAction, readCategoryAction, updateCategoryAction, deleteCategoryAction } = useAuth();
    const [dataCategory, setDataCategory] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [formModal] = Form.useForm();
    const [formTable] = Form.useForm(); 
    const [isModalVisible, setIsModalVisible] = useState(false);

    useImperativeHandle(ref, () => ({
        refetchData: async () => {
            await fetchData();
        }
    }));

    const fetchData = async () => {
        try {
            await readCategoryAction();
        } catch (error) {
            console.error("Error fetching Category data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (categoryData && Array.isArray(categoryData)) {
            setDataCategory(categoryData);
        } else {
            setDataCategory([]);
        }
    }, [categoryData]);

    const showModal = () => {
        setIsModalVisible(true);
        formModal.resetFields();
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = async (values) => {
        try {
            await createCategoryAction(values);
            alert("Successful create category item!");
            setIsModalVisible(false);
            await readCategoryAction();
        } catch (error) {
            alert("Failed create category item: " + error.message);
        }
    };

    const formFields = [
        {
            name: 'codeCategory',
            label: 'Kode Kategory',
            type: 'input',
            rules: [{ required: true, message: 'Please input category code!' }],
            placeholder: 'Enter your category code',
            style: { width: '350px' },
        },
        {
            name: 'nameCategory',
            label: 'Nama Kategori',
            type: 'textarea',
            rules: [{ required: true, message: 'Please input category name!' }],
            placeholder: 'Enter your category name',
            style: { width: '350px' },
        },
    ];

    const columns = [
        {
            title: 'Category Code',
            dataType: 'text',
            dataIndex: 'CTG_CODE',
            width: '30%',
            editable: true,
        },
        {
            title: 'Category Name',
            dataType: 'textarea',
            dataIndex: 'CTG_NAME',
            width: '50%',
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
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)} style={{ marginInlineEnd: 8 }}>
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
            CTG_CODE: record.CTG_CODE,
            CTG_NAME: record.CTG_NAME,
        });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const handleSave = async (key) => {
        try {
            const row = await formTable.validateFields();
            const newData = [...dataCategory];
            const index = newData.findIndex((item) => key === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row});
                await updateCategoryAction(newData[index]);
                setEditingKey('');
            }
        } catch (err) {
            console.log('Validate Failed:', err);
        }
    };

    const handleDelete = (record) => {
        deleteCategoryAction(record);
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
                title={"Entry Category Item"}
                modalWidth={400}
                formModal={formModal}
            />
            <DataTable columns={columns} data={dataCategory} editingKey={editingKey} formTable={formTable}/>
        </div>
    );
});

const JenisItem = forwardRef((props, ref) => {
    const { jenisData, createJenisAction, readJenisAction, categoryData, readCategoryAction } = useAuth();
    const [dataJenis, setDataJenis] = useState([]);
    const [categories, setCategories] = useState([]); // Initially empty

    useImperativeHandle(ref, () => ({
        refetchData: async () => {
            await fetchData();
        }
    }));

    const fetchData = async () => {
        try {
            await readJenisAction();
            await readCategoryAction();
        } catch (error) {
            console.error("Error fetching Jenis or Category data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (jenisData && Array.isArray(jenisData)) {
            setDataJenis(jenisData);
        } else {
            setDataJenis([]);
        }
    }, [jenisData]);

    useEffect(() => {
        if (Array.isArray(categoryData)) {
            const transformedCategories = categoryData.map(item => ({
                value: item.CTG_CODE,
                label: item.CTG_NAME
            }));
            setCategories(transformedCategories);
        } else {
            setCategories([]);
        }
    }, [categoryData]);

    const columns = [
        {
            title: 'Category Items',
            dataIndex: 'CTG_ITEM',
            editable: true,
            inputType: 'select',
            options: categories,
            width: '25%',
            required: true,
        },
        {
            title: 'Type Code',
            dataIndex: 'JNS_CODE',
            editable: true,
            inputType: 'text',
            width: '15%',
            required: true,
        },
        {
            title: 'Type Items',
            dataIndex: 'JNS_ITEM',
            editable: true,
            inputType: 'text',
            width: '25%',
            required: true,
        },
        {
            title: 'Description',
            dataIndex: 'DSC_ITEM',
            editable: true,
            inputType: 'textarea',
            width: '40%',
            required: false,
        },
        {
        title: 'Operation',
        dataIndex: 'operation',
            render: (_, record) => (
                <Popconfirm 
                title="Sure to delete?" 
                onConfirm={() => handleDelete(record.key)}
                okText="OK"
                cancelText="Cancel"
                >
                <Button type="link" danger>Delete</Button>
                </Popconfirm>
            ),
        },
    ];

    const [dataSource, setDataSource] = useState([]);
    // Handle tambah row baru
    const handleAddRow = () => {
        const newKey = Date.now().toString();
        const newItem = {
            key: newKey,
            CTG_ITEM: null,
            JNS_CODE: '',
            JNS_ITEM: '',
            DSC_ITEM: '',
        };
        setDataSource([...dataSource, newItem]);
    };
    // Handle simpan perubahan
    const handleSave = (newData) => {
        setDataSource(newData);
    };
    // Handle hapus item
    const handleDelete = (key) => {
        const newData = dataSource.filter(item => item.key !== key);
        setDataSource(newData);
    };

     // Validasi data sebelum submit
    const validateData = (data) => {
        if (!data || data.length === 0) {
            alert("Data tidak boleh kosong.");
            return false;
        }
        for (const item of data) {
            // cek required fields: CTG_ITEM dan JNS_ITEM harus ada dan tidak kosong
            if (!item.CTG_ITEM || item.CTG_ITEM === null || item.JNS_ITEM.trim() === "") {
                alert("Semua baris harus mengisi Category Items dan Type Items dengan benar.");
                return false;
            }
        }
        return true;
    };

    // Fungsi untuk mengirim data ke API menggunakan Context API
    const submitData = async (data) => {
        if (!validateData(data)) {
            // Jika validasi gagal, hentikan submit
            return;
        }
        try {
            await createJenisAction(data); // Kirim sekaligus array data
            alert("Successful create jenis items!");
            setDataSource([]); // Clear dataSource setelah sukses
        } catch (error) {
            alert("Failed create jenis item: " + error.message);
        }
    };

    return (
        <div>
            <RowRepeater
                dataSource={dataSource}
                columns={columns}
                onChange={handleSave}
                onAddRow={handleAddRow}
                onDeleteRow={handleDelete}
                onSubmitData={submitData}
            />
        </div>
    );

});

const MasterItem = () => {

    const categoryRef = useRef(null);
    const jenisRef = useRef(null);

    const onChange = (key) => {
        if (key === '1' && categoryRef.current) {
            categoryRef.current.refetchData();
        } else if (key === '2' && jenisRef.current) {
            jenisRef.current.refetchData();
        }
    };

    const items = [
        {
            key: '1',
            label: 'Category Items',
            children: <CategoryItem ref={categoryRef} />,
        },
        {
            key: '2',
            label: 'Type Items',
            children: <JenisItem ref={jenisRef} />,
        },
    ];

    return (
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    );

};

export default MasterItem;