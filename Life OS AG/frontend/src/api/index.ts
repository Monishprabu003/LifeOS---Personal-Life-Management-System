import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add interceptor to include token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('lifeos_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

export const kernelAPI = {
    getEvents: () => api.get('/kernel/events'),
    getStatus: () => api.get('/kernel/status'),
    logGenericEvent: (data: any) => api.post('/kernel/event', data),
};

export const habitsAPI = {
    getHabits: () => api.get('/habits'),
    createHabit: (data: any) => api.post('/habits', data),
    completeHabit: (id: string) => api.post(`/habits/${id}/complete`),
};

export const financeAPI = {
    getTransactions: () => api.get('/finance'),
    createTransaction: (data: any) => api.post('/finance', data),
};

export const goalsAPI = {
    getGoals: () => api.get('/goals'),
    createGoal: (data: any) => api.post('/goals', data),
    updateProgress: (id: string, progress: number) => api.patch(`/goals/${id}/progress`, { progress }),
};

export const healthAPI = {
    getLogs: () => api.get('/health'),
    createLog: (data: any) => api.post('/health', data),
};

export const socialAPI = {
    getRelationships: () => api.get('/social'),
    createRelationship: (data: any) => api.post('/social', data),
    logInteraction: (id: string, data: any) => api.post(`/social/${id}/interact`, data),
};

export default api;
