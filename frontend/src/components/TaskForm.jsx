import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onSubmit, initialTask = null, onCancel }) => {
    const [formData, setFormData] = useState({
        title: initialTask?.title || '',
        description: initialTask?.description || '',
        status: initialTask?.status || 'todo',
        priority: initialTask?.priority || 'medium'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.title.trim()) {
            onSubmit(formData);
            if (!initialTask) {
                // Reset form only for new tasks
                setFormData({
                    title: '',
                    description: '',
                    status: 'todo',
                    priority: 'medium'
                });
            }
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter task description (optional)"
                    rows="3"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                    {initialTask ? 'Update Task' : 'Create Task'}
                </button>
                {onCancel && (
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default TaskForm;
