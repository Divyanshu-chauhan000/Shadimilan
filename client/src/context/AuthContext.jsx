import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const res = await api.post('/auth/login', credentials);
        setUser(res.data);
        return res.data;
    };

    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        setUser(res.data);
        return res.data;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
