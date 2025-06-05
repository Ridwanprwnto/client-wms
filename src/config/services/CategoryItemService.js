import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const createCategoryService = async (codeCategory, nameCategory, token) => {
    const response = await axios.post(`${API_URL}category/create`, {
        codeCategory, 
        nameCategory
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const readCategoryService = async (token) => {
    const response = await axios.get(`${API_URL}category/read`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const updateCategoryService = async (id, CTG_CODE, CTG_NAME, token) => {
    const response = await axios.post(`${API_URL}category/update`, {
        id,
        CTG_CODE,
        CTG_NAME
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const deleteCategoryService = async (id, CTG_CODE, CTG_NAME, token) => {
    const response = await axios.post(`${API_URL}category/delete`, {
        id,
        CTG_CODE,
        CTG_NAME
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default {
    createCategoryService,
    readCategoryService,
    updateCategoryService,
    deleteCategoryService
};