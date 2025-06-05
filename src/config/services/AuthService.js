import axios from 'axios';
import CryptoJS from 'crypto-js';

const API_URL = process.env.REACT_APP_API_URL;
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

const encryptPayload = (payload) => {
    return CryptoJS.AES.encrypt(JSON.stringify(payload), SECRET_KEY).toString();
};

const login = async (username, password) => {
    const encryptedData = encryptPayload({ username, password });
    const response = await axios.post(`${API_URL}auth/login`, { data: encryptedData });
    return response.data;
};

const getUserData = async (token) => {
    const response = await axios.get(`${API_URL}user/login`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export default {
    login,
    getUserData,
};