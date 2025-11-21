import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Get all tasks
 * @param {string} status - Optional status filter
 * @returns {Promise} API response
 */
export const getAllTasks = async (status = null) => {
    try {
        const params = status ? { status } : {};
        const response = await api.get('/api/tasks', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
};

/**
 * Get single task by ID
 * @param {number} id - Task ID
 * @returns {Promise} API response
 */
export const getTaskById = async (id) => {
    try {
        const response = await api.get(`/api/tasks/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching task ${id}:`, error);
        throw error;
    }
};

/**
 * Create a new task
 * @param {Object} taskData - Task information
 * @returns {Promise} API response
 */
export const createTask = async (taskData) => {
    try {
        const response = await api.post('/api/tasks', taskData);
        return response.data;
    } catch (error) {
        console.error('Error creating task:', error);
        throw error;
    }
};

/**
 * Update an existing task
 * @param {number} id - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} API response
 */
export const updateTask = async (id, updates) => {
    try {
        const response = await api.put(`/api/tasks/${id}`, updates);
        return response.data;
    } catch (error) {
        console.error(`Error updating task ${id}:`, error);
        throw error;
    }
};

/**
 * Delete a task
 * @param {number} id - Task ID
 * @returns {Promise} API response
 */
export const deleteTask = async (id) => {
    try {
        const response = await api.delete(`/api/tasks/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting task ${id}:`, error);
        throw error;
    }
};

/**
 * Check API health
 * @returns {Promise} API response
 */
export const checkHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error('Error checking API health:', error);
        throw error;
    }
};

export default api;
