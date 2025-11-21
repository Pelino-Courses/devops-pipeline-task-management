# Frontend - Task Manager UI

React-based user interface for the DevOps Pipeline Task Manager application.

## 🏗️ Tech Stack

- **Framework**: React 18
- **HTTP Client**: Axios
- **Testing**: React Testing Library + Jest
- **Build Tool**: Create React App
- **Production Server**: Nginx

## 📂 Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Header.jsx          # App header with branding
│   │   ├── Header.css
│   │   ├── TaskForm.jsx        # Create/edit task form
│   │   ├── TaskForm.css
│   │   ├── TaskItem.jsx        # Individual task card
│   │   ├── TaskItem.css
│   │   ├── TaskList.jsx        # Task list with filtering
│   │   └── TaskList.css
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Global app styles
│   ├── App.test.js             # App component tests
│   ├── index.js                # React entry point
│   └── setupTests.js           # Test configuration
├── .env.example                # Environment variables template
├── Dockerfile                  # Multi-stage Docker build
├── nginx.conf                  # Nginx configuration
└── package.json                # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:5000`

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env if backend URL is different
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## ✨ Features

### Task Management
- ✅ **Create Tasks** - Add new tasks with title, description, status, and priority
- ✅ **View Tasks** - See all tasks in a clean, card-based layout
- ✅ **Edit Tasks** - Update any task field
- ✅ **Delete Tasks** - Remove completed or unwanted tasks
- ✅ **Status Management** - Quick status changes via dropdown
- ✅ **Filtering** - Filter by status (All, To Do, In Progress, Done)

### UI/UX
- 🎨 Modern gradient design
- 📱 Fully responsive layout
- 🌈 Color-coded status badges
- ⚡ Smooth animations and transitions
- 🎯 Priority indicators (Low, Medium, High)
- 📅 Creation date display
- 🔄 Real-time updates

## 🎨 Components

### Header
Displays app branding with gradient background.

### TaskForm
Controlled form component for creating and editing tasks.
- Title input (required)
- Description textarea (optional)
- Status dropdown (todo, in-progress, done)
- Priority dropdown (low, medium, high)
- Submit and cancel buttons

### TaskItem
Individual task card displaying:
- Task title and description
- Priority badge with color coding
- Status dropdown for quick updates
- Edit and delete action buttons
- Creation date
- Hover effects

### TaskList
Container for task items with:
- Task count display
- Empty state message
- Filtered task rendering
- Responsive grid layout

### App (Main Component)
Root component managing:
- Task state
- API calls (CRUD operations)
- Filter state
- Edit mode
- Error handling
- Loading states

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

**Test Coverage:**
- Component rendering tests
- User interaction tests
- API integration tests (mocked)

## 🎨 Styling

Modern, professional design with:
- **Color Scheme**: Purple gradient (#667eea to #764ba2)
- **Typography**: System fonts for optimal performance
- **Status Colors**:
  - Todo: Orange (#f39c12)
  - In Progress: Blue (#3498db)
  - Done: Green (#27ae60)
- **Priority Colors**:
  - Low: Gray (#95a5a6)
  - Medium: Orange (#f39c12)
  - High: Red (#e74c3c)

## 🐳 Docker

### Development
```bash
docker-compose up frontend
```

### Production Build
```bash
# Build optimized production image
docker build -t taskmanager-frontend .

# Run with nginx
docker run -p 80:80 taskmanager-frontend
```

The Dockerfile uses:
- Multi-stage build for optimization
- Nginx for serving static files
- Health checks
- API proxying to backend

## 📦 Build

```bash
# Create production build
npm run build

# Output will be in build/ directory
```

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | http://localhost:5000 |
| `REACT_APP_ENV` | Environment name | development |

## 🔧 npm Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Create production build |
| `npm test` | Run tests |
| `npm run lint` | Run ESLint |

## 🛠️ Development

### Adding New Components

1. Create component file in `src/components/`
2. Create corresponding CSS file
3. Import and use in `App.jsx` or other components
4. Write tests for the component

### API Service

All API calls go through `src/services/api.js`:
```javascript
import { getAllTasks, createTask, updateTask, deleteTask } from './services/api';

// Use in components
const tasks = await getAllTasks();
const newTask = await createTask(taskData);
```

## 📱 Responsive Design

The UI is fully responsive with breakpoints:
- **Desktop**: 1200px+ (full features)
- **Tablet**: 768px-1199px (adjusted layouts)
- **Mobile**: <768px (stacked layouts, full-width buttons)

## 🚀 Performance

Optimizations included:
- Code splitting with React.lazy
- Gzip compression in nginx
- Static asset caching
- Minified production builds
- Optimized images

## 🐛 Troubleshooting

**API connection errors:**
- Check backend is running on correct port
- Verify `REACT_APP_API_URL` in `.env`
- Check browser console for CORS errors

**Build fails:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

## 📝 Next Steps

- ✅ Basic CRUD interface
- ✅ Status filtering
- ✅ Responsive design
- ⏭️ Add user authentication UI
- ⏭️ Add task search
- ⏭️ Add task sorting
- ⏭️ Add date picker for due dates
- ⏭️ Add drag-and-drop for status changes

## 📄 License

MIT License - See project root LICENSE file
