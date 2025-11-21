const pool = require('../config/database');

class Task {
    /**
     * Get all tasks
     * @param {Object} filters - Optional filters (status)
     * @returns {Promise<Array>} Array of tasks
     */
    static async findAll(filters = {}) {
        let query = 'SELECT * FROM tasks';
        const params = [];

        if (filters.status) {
            query += ' WHERE status = $1';
            params.push(filters.status);
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        return result.rows;
    }

    /**
     * Get task by ID
     * @param {number} id - Task ID
     * @returns {Promise<Object|null>} Task object or null
     */
    static async findById(id) {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    /**
     * Create a new task
     * @param {Object} taskData - Task data
     * @returns {Promise<Object>} Created task
     */
    static async create(taskData) {
        const { title, description, status = 'todo', priority = 'medium' } = taskData;

        const result = await pool.query(
            `INSERT INTO tasks (title, description, status, priority) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
            [title, description, status, priority]
        );

        return result.rows[0];
    }

    /**
     * Update a task
     * @param {number} id - Task ID
     * @param {Object} updates - Fields to update
     * @returns {Promise<Object|null>} Updated task or null
     */
    static async update(id, updates) {
        const { title, description, status, priority } = updates;

        const result = await pool.query(
            `UPDATE tasks 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
            [title, description, status, priority, id]
        );

        return result.rows[0] || null;
    }

    /**
     * Delete a task
     * @param {number} id - Task ID
     * @returns {Promise<boolean>} True if deleted, false otherwise
     */
    static async delete(id) {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING id',
            [id]
        );

        return result.rowCount > 0;
    }

    /**
     * Get tasks by status
     * @param {string} status - Task status
     * @returns {Promise<Array>} Array of tasks
     */
    static async findByStatus(status) {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE status = $1 ORDER BY created_at DESC',
            [status]
        );
        return result.rows;
    }
}

module.exports = Task;
