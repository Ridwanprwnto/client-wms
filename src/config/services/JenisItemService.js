import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const readJenisService = async (token) => {
    const response = await axios.get(`${API_URL}jenis/read`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const createJenisService = async (dataArray, token) => {
    const response = await axios.post(`${API_URL}jenis/create`, dataArray, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default {
    readJenisService,
    createJenisService,
};