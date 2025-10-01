// API service for backend communication
const API_BASE_URL = 'http://localhost:3001/api';

// Auth helpers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Auth API
export const authAPI = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) throw new Error('Login failed');
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data;
    },

    register: async (name, email, password) => {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        if (!response.ok) throw new Error('Registration failed');
        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};

// Users API
export const usersAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
    },

    create: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Failed to create user');
        return response.json();
    },

    update: async (id, userData) => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Failed to update user');
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete user');
        return response.json();
    }
};

// Posts API
export const postsAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        return response.json();
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        return response.json();
    },

    getByProject: async (projectId) => {
        const response = await fetch(`${API_BASE_URL}/posts/project/${projectId}`);
        if (!response.ok) throw new Error('Failed to fetch project posts');
        return response.json();
    },

    create: async (postData) => {
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(postData)
        });
        if (!response.ok) throw new Error('Failed to create post');
        return response.json();
    },

    update: async (id, postData) => {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(postData)
        });
        if (!response.ok) throw new Error('Failed to update post');
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete post');
        return response.json();
    }
};

// Feed API
export const feedAPI = {
    getGlobal: async () => {
        const response = await fetch(`${API_BASE_URL}/feed/global`);
        if (!response.ok) throw new Error('Failed to fetch global feed');
        return response.json();
    },

    getLocal: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/feed/local/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch local feed');
        return response.json();
    }
};

// Project Feed API
export const projectFeedAPI = {
    getGlobal: async () => {
        const response = await fetch(`${API_BASE_URL}/feed/projects/global`);
        if (!response.ok) throw new Error('Failed to fetch global project feed');
        return response.json();
    },

    getLocal: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/feed/projects/local/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch local project feed');
        return response.json();
    }
};

// Projects API
export const projectsAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        return response.json();
    },

    create: async (projectData) => {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) throw new Error('Failed to create project');
        return response.json();
    },

    update: async (id, projectData) => {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
            body: JSON.stringify(projectData)
        });
        if (!response.ok) throw new Error('Failed to update project');
        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete project');
        return response.json();
    }
};

// Friends API
export const friendsAPI = {
    addFriend: async (userId, friendId) => {
        const response = await fetch(`${API_BASE_URL}/users/add-friend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, friendId })
        });
        if (!response.ok) throw new Error('Failed to add friend');
        return response.json();
    },

    getFriends: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/friends/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch friends');
        return response.json();
    }
};