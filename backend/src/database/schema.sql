-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Insert sample data for testing
INSERT INTO tasks (title, description, status, priority) VALUES
  ('Setup development environment', 'Install Node.js, Docker, and PostgreSQL', 'done', 'high'),
  ('Create Express API', 'Build REST API with Express', 'in-progress', 'high'),
  ('Implement React frontend', 'Build task management UI', 'todo', 'high'),
  ('Write unit tests', 'Add Jest tests for backend', 'todo', 'medium'),
  ('Configure Docker', 'Create Dockerfile and docker-compose', 'todo', 'medium')
ON CONFLICT DO NOTHING;
