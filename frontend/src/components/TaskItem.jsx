import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'todo':
                return '#f39c12';
            case 'in-progress':
                return '#3498db';
            case 'done':
                return '#27ae60';
            default:
                return '#95a5a6';
        }
    };

    const getPriorityBadge = (priority) => {
        const colors = {
            low: '#95a5a6',
            medium: '#f39c12',
            high: '#e74c3c'
        };
        return colors[priority] || colors.medium;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="task-item">
            <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <span
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityBadge(task.priority) }}
                >
                    {task.priority}
                </span>
            </div>

            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta">
                <span className="task-date">Created: {formatDate(task.created_at)}</span>
                <select
                    className="status-select"
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                    style={{ borderColor: getStatusColor(task.status) }}
                >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <div className="task-actions">
                <button
                    className="btn-action btn-edit"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                >
                    ✏️ Edit
                </button>
                <button
                    className="btn-action btn-delete"
                    onClick={() => onDelete(task.id)}
                    title="Delete task"
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
