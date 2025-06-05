import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const registerService = async (nik, nickname, email, password) => {
    const response = await axios.post(`${API_URL}auth/register`, { nik, nickname, email, password });
    return response.data;
};

export default {
    registerService,
};