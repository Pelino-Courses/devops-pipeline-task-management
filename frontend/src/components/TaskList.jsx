import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange, filter }) => {
    const filteredTasks = filter === 'all'
        ? tasks
        : tasks.filter(task => task.status === filter);

    if (filteredTasks.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No tasks found</h3>
                <p>
                    {filter === 'all'
                        ? 'Create your first task to get started!'
                        : `No tasks with status "${filter}"`}
                </p>
            </div>
        );
    }

    return (
        <div className="task-list">
            <div className="task-count">{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}</div>
            {filteredTasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                />
            ))}
        </div>
    );
};

export default TaskList;
