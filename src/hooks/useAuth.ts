import { useState, useEffect } from 'react';
import api from '../api/axios';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'parent' | 'tutor' | 'admin';
    student_profile?: {
        learning_language: string;
        total_points: number;
        current_level: number;
    };
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await api.get('/me');
            setUser(response.data);
        } catch (error) {
            setUser(null);
            localStorage.removeItem('auth_token');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } finally {
            localStorage.removeItem('auth_token');
            setUser(null);
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        if (localStorage.getItem('auth_token')) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    return { user, loading, logout, fetchUser };
};