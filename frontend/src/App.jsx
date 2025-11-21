import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { getAllTasks, createTask, updateTask, deleteTask } from './services/api';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllTasks();
            setTasks(response.data);
        } catch (err) {
            setError('Failed to fetch tasks. Please check if the server is running.');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            const response = await createTask(taskData);
            setTasks(prev => [response.data, ...prev]);
        } catch (err) {
            setError('Failed to create task');
            console.error('Error creating task:', err);
        }
    };

    const handleUpdateTask = async (taskData) => {
        if (!editingTask) return;

        try {
            const response = await updateTask(editingTask.id, taskData);
            setTasks(prev =>
                prev.map(task => task.id === editingTask.id ? response.data : task)
            );
            setEditingTask(null);
        } catch (err) {
            setError('Failed to update task');
            console.error('Error updating task:', err);
        }
    };

    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(id);
                setTasks(prev => prev.filter(task => task.id !== id));
            } catch (err) {
                setError('Failed to delete task');
                console.error('Error deleting task:', err);
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await updateTask(id, { status: newStatus });
            setTasks(prev =>
                prev.map(task => task.id === id ? response.data : task)
            );
        } catch (err) {
            setError('Failed to update task status');
            console.error('Error updating status:', err);
        }
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    if (loading) {
        return (
            <div className="app">
                <Header />
                <div className="container">
                    <div className="loading">Loading tasks...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <Header />

            <main className="container">
                {error && (
                    <div className="error-banner">
                        {error}
                        <button className="close-btn" onClick={() => setError(null)}>×</button>
                    </div>
                )}

                <section className="form-section">
                    <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
                    <TaskForm
                        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                        initialTask={editingTask}
                        onCancel={editingTask ? handleCancelEdit : null}
                    />
                </section>

                <section className="list-section">
                    <div className="list-header">
                        <h2>Tasks</h2>
                        <div className="filter-buttons">
                            <button
                                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All
                            </button>
                            <button
                                className={`filter-btn ${filter === 'todo' ? 'active' : ''}`}
                                onClick={() => setFilter('todo')}
                            >
                                To Do
                            </button>
                            <button
                                className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
                                onClick={() => setFilter('in-progress')}
                            >
                                In Progress
                            </button>
                            <button
                                className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
                                onClick={() => setFilter('done')}
                            >
                                Done
                            </button>
                        </div>
                    </div>

                    <TaskList
                        tasks={tasks}
                        filter={filter}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                    />
                </section>
            </main>

            <footer className="footer">
                <p>DevOps Pipeline Task Manager © 2025</p>
            </footer>
        </div>
    );
}

export default App;
