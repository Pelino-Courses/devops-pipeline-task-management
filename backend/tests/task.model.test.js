const Task = require('../src/models/Task');

// Mock the database pool
jest.mock('../src/config/database', () => ({
    query: jest.fn()
}));

const pool = require('../src/config/database');

describe('Task Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all tasks', async () => {
            const mockTasks = [
                { id: 1, title: 'Task 1', status: 'todo' },
                { id: 2, title: 'Task 2', status: 'done' }
            ];

            pool.query.mockResolvedValue({ rows: mockTasks });

            const tasks = await Task.findAll();

            expect(tasks).toEqual(mockTasks);
            expect(pool.query).toHaveBeenCalled();
        });

        it('should filter tasks by status', async () => {
            const mockTasks = [
                { id: 1, title: 'Task 1', status: 'todo' }
            ];

            pool.query.mockResolvedValue({ rows: mockTasks });

            const tasks = await Task.findAll({ status: 'todo' });

            expect(tasks).toEqual(mockTasks);
        });
    });

    describe('findById', () => {
        it('should return a task by id', async () => {
            const mockTask = { id: 1, title: 'Task 1', status: 'todo' };

            pool.query.mockResolvedValue({ rows: [mockTask] });

            const task = await Task.findById(1);

            expect(task).toEqual(mockTask);
        });

        it('should return null if task not found', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const task = await Task.findById(999);

            expect(task).toBeNull();
        });
    });

    describe('create', () => {
        it('should create a new task', async () => {
            const newTask = {
                title: 'New Task',
                description: 'Description',
                status: 'todo',
                priority: 'high'
            };

            const createdTask = { id: 1, ...newTask };

            pool.query.mockResolvedValue({ rows: [createdTask] });

            const task = await Task.create(newTask);

            expect(task).toEqual(createdTask);
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO tasks'),
                expect.any(Array)
            );
        });
    });

    describe('update', () => {
        it('should update a task', async () => {
            const updates = { title: 'Updated Title', status: 'done' };
            const updatedTask = { id: 1, ...updates };

            pool.query.mockResolvedValue({ rows: [updatedTask] });

            const task = await Task.update(1, updates);

            expect(task).toEqual(updatedTask);
        });

        it('should return null if task not found', async () => {
            pool.query.mockResolvedValue({ rows: [] });

            const task = await Task.update(999, { title: 'Test' });

            expect(task).toBeNull();
        });
    });

    describe('delete', () => {
        it('should delete a task', async () => {
            pool.query.mockResolvedValue({ rowCount: 1 });

            const result = await Task.delete(1);

            expect(result).toBe(true);
        });

        it('should return false if task not found', async () => {
            pool.query.mockResolvedValue({ rowCount: 0 });

            const result = await Task.delete(999);

            expect(result).toBe(false);
        });
    });
});
