import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the API service
jest.mock('./services/api', () => ({
    getAllTasks: jest.fn(() => Promise.resolve({ data: [] })),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn()
}));

describe('App Component', () => {
    it('renders header', async () => {
        render(<App />);
        const headerElement = screen.getByText(/Task Manager/i);
        expect(headerElement).toBeInTheDocument();
    });

    it('renders create task form', async () => {
        render(<App />);
        const titleInput = await screen.findByPlaceholderText(/Enter task title/i);
        expect(titleInput).toBeInTheDocument();
    });

    it('renders filter buttons', async () => {
        render(<App />);
        const allButton = await screen.findByText('All');
        const todoButton = await screen.findByText('To Do');
        const inProgressButton = await screen.findByText('In Progress');
        const doneButton = await screen.findByText('Done');

        expect(allButton).toBeInTheDocument();
        expect(todoButton).toBeInTheDocument();
        expect(inProgressButton).toBeInTheDocument();
        expect(doneButton).toBeInTheDocument();
    });
});
