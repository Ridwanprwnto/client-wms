import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/AuthService';
import regService from '../services/RegistService';
import categoryService from '../services/CategoryItemService';
import jenisService from "../services/JenisItemService";

const AuthContext = createContext();

const TOKEN_KEY = "token";
const EXPIRY_KEY = "token_expiry";
const TOKEN_LIFETIME = 60 * 60 * 1000; // 1 hour in milliseconds

export const AuthProvider = ({ children }) => {
    
    // Register account
    const registerAction = useCallback(async (values) => {
        const { nik, nickname, email, password } = values;
        try {
            const data = await regService.registerService(nik, nickname, email, password);
        } catch (error) {
            throw new Error(error.message);
        }
    }, []);


    // ------------------------------------------------------

    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");

    // Menangani login
    const loginAction = useCallback(async (credentials) => {
        const { username, password } = credentials;
        try {
            const data = await authService.login(username, password);
            setUserData(data.user);
            setToken(data.token);
            localStorage.setItem(TOKEN_KEY, data.token);
            localStorage.setItem(EXPIRY_KEY, Date.now() + TOKEN_LIFETIME); // Set expiry time
        } catch (error) {
            throw new Error(error.message);
        }
    }, []);

    // Fungsi logout
    const logOut = useCallback(() => {
        setUserData(null);
        setToken("");
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EXPIRY_KEY);
    }, []);

    // Fetch user data
    const fetchUserData = useCallback(async () => {
        if (!token) return;
        try {
            const response = await authService.getUserData(token);
            setUserData(response);
        } catch (error) {
            logOut();
        }
    }, [token, logOut]);

    // Check token expiry
    const checkTokenExpiry = useCallback(() => {
        const expiry = localStorage.getItem(EXPIRY_KEY);
        if (expiry && Date.now() > Number(expiry)) {
            logOut();
        }
    }, [logOut]);

    // Check every 30 seconds
    useEffect(() => {
        const interval = setInterval(checkTokenExpiry, 1000 * 30);
        return () => clearInterval(interval);
    }, [checkTokenExpiry]);
    
    // Refresh token expiry on user activity
    const refreshTokenExpiry = useCallback(() => {
        if (token) {
            localStorage.setItem(EXPIRY_KEY, Date.now() + TOKEN_LIFETIME);
        }
    }, [token]);

    useEffect(() => {
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
        const handleActivity = () => {
            refreshTokenExpiry();
        };
        events.forEach(eventName => {
            window.addEventListener(eventName, handleActivity);
        });
        return () => {
            events.forEach(eventName => {
                window.removeEventListener(eventName, handleActivity);
            });
        };
    }, [refreshTokenExpiry]);


    // ------------------------------------------------------

    const [categoryData, setCategoryData] = useState(null);
    
    // Fetch category data
    const readCategoryAction = useCallback(async () => {
        if (!token) return;
        try {
            const response = await categoryService.readCategoryService(token);
            setCategoryData(response);
        } catch (error) {
            console.error("Failed to fetch category data:", error);
            // Optional: consider logOut() or clearing categoryData on failure
        }
    }, [token]);

    // Create category item
    const createCategoryAction = useCallback(async (values) => {
        if (!token) return;
        const { codeCategory, nameCategory } = values;
        try {
            const data = await categoryService.createCategoryService(codeCategory, nameCategory, token);
            await readCategoryAction(); // Refresh after create
        } catch (error) {
            throw new Error(error.message);
        }
    }, [token, readCategoryAction]);

    // Uodate category item
    const updateCategoryAction = useCallback(async (values) => {
        if (!token) return;
        const { id, CTG_CODE, CTG_NAME } = values;
        try {
            const data = await categoryService.updateCategoryService(id, CTG_CODE, CTG_NAME, token);
            await readCategoryAction(); // Refresh after update
        } catch (error) {
            throw new Error(error.message);
        }
    }, [token, readCategoryAction]);
    
    // Delete category item
    const deleteCategoryAction = useCallback(async (values) => {
        if (!token) return;
        const { id, CTG_CODE, CTG_NAME } = values;
        try {
            const data = await categoryService.deleteCategoryService(id, CTG_CODE, CTG_NAME, token);
            await readCategoryAction(); // Refresh after delete
        } catch (error) {
            throw new Error(error.message);
        }
    }, [token, readCategoryAction]);


    // ------------------------------------------------------
    
    const [jenisData, setJenisData] = useState(null);

    // Fetch jenis data
    const readJenisAction = useCallback(async () => {
        if (!token) return;
        try {
            const response = await jenisService.readJenisService(token);
            setJenisData(response);
        } catch (error) {
            console.error("Failed to fetch jenis data:", error);
            // Optional: consider logOut() or clearing jenisData on failure
        }
    }, [token]);

    // Create jenis item
    const createJenisAction = useCallback(async (valuesArray) => {
        if (!token) return;
        try {
            const data = await jenisService.createJenisService(valuesArray, token);
            await readJenisAction(); // Refresh after create
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }, [token, readJenisAction]);
    
    // ------------------------------------------------------



    

    // Fetch data on token change
    // useEffect(() => {
    //     if (token) {
    //         fetchUserData();
    //         readCategoryAction();
    //     } else {
    //         setUserData(null);
    //         setCategoryData(null);
    //     }
    // }, [token, fetchUserData, readCategoryAction]);

    return (
        <AuthContext.Provider value={{
            registerAction,
        // --------------------------
            token,
            userData,
            loginAction,
            fetchUserData,
            logOut,
        // --------------------------
            categoryData,
            readCategoryAction,
            createCategoryAction,
            updateCategoryAction,
            deleteCategoryAction,
        // --------------------------
            jenisData,
            readJenisAction,
            createJenisAction,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);