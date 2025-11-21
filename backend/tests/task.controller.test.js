const request = require('supertest');
const app = require('../src/app');

// Mock the Task model
jest.mock('../src/models/Task');
const Task = require('../src/models/Task');

describe('Task Controller Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/tasks', () => {
        it('should get all tasks', async () => {
            const mockTasks = [
                { id: 1, title: 'Task 1', status: 'todo' },
                { id: 2, title: 'Task 2', status: 'done' }
            ];

            Task.findAll.mockResolvedValue(mockTasks);

            const response = await request(app).get('/api/tasks');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockTasks);
            expect(response.body.count).toBe(2);
        });

        it('should filter tasks by status', async () => {
            const mockTasks = [{ id: 1, title: 'Task 1', status: 'todo' }];

            Task.findAll.mockResolvedValue(mockTasks);

            const response = await request(app).get('/api/tasks?status=todo');

            expect(response.status).toBe(200);
            expect(Task.findAll).toHaveBeenCalledWith({ status: 'todo' });
        });
    });

    describe('GET /api/tasks/:id', () => {
        it('should get a task by id', async () => {
            const mockTask = { id: 1, title: 'Task 1', status: 'todo' };

            Task.findById.mockResolvedValue(mockTask);

            const response = await request(app).get('/api/tasks/1');

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockTask);
        });

        it('should return 404 if task not found', async () => {
            Task.findById.mockResolvedValue(null);

            const response = await request(app).get('/api/tasks/999');

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/tasks', () => {
        it('should create a new task', async () => {
            const newTask = {
                title: 'New Task',
                description: 'Test description',
                status: 'todo'
            };

            const createdTask = { id: 1, ...newTask };

            Task.create.mockResolvedValue(createdTask);

            const response = await request(app)
                .post('/api/tasks')
                .send(newTask);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(createdTask);
        });

        it('should return 400 if title is missing', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ description: 'No title' });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/tasks/:id', () => {
        it('should update a task', async () => {
            const updates = { title: 'Updated Title', status: 'done' };
            const updatedTask = { id: 1, ...updates };

            Task.update.mockResolvedValue(updatedTask);

            const response = await request(app)
                .put('/api/tasks/1')
                .send(updates);

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(updatedTask);
        });

        it('should return 404 if task not found', async () => {
            Task.update.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/tasks/999')
                .send({ title: 'Test' });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/tasks/:id', () => {
        it('should delete a task', async () => {
            Task.delete.mockResolvedValue(true);

            const response = await request(app).delete('/api/tasks/1');

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it('should return 404 if task not found', async () => {
            Task.delete.mockResolvedValue(false);

            const response = await request(app).delete('/api/tasks/999');

            expect(response.status).toBe(404);
        });
    });
});
