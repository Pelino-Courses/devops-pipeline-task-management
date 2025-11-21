# Testing Guide

## 🧪 Testing the Task Manager Application

### Prerequisites
- Application running (see QUICKSTART.md)
- Browser (Chrome, Firefox, Safari, or Edge)

### Manual Testing Checklist

#### 1. Application Load
- [ ] Navigate to http://localhost:3000
- [ ] Verify page loads without errors
- [ ] Check browser console for any errors (F12)
- [ ] Verify header displays "📋 Task Manager"
- [ ] Confirm form is visible

#### 2. Create Task Functionality
- [ ] Fill in task title: "Test Task 1"
- [ ] Add description: "Testing create functionality"
- [ ] Select status: "To Do"
- [ ] Select priority: "High"
- [ ] Click "Create Task" button
- [ ] Verify task appears in the list below
- [ ] Verify task shows correct title, description, priority badge
- [ ] Verify form clears after creation

#### 3. View Tasks
- [ ] Verify all 5 sample tasks are visible (if database was initialized)
- [ ] Check each task displays:
  - Title
  - Description
  - Priority badge (colored)
  - Status dropdown
  - Creation date
  - Edit and Delete buttons
- [ ] Verify task cards have hover effects

#### 4. Filter Tasks
- [ ] Click "All" filter - verify all tasks show
- [ ] Click "To Do" filter - verify only todo tasks show
- [ ] Click "In Progress" filter - verify only in-progress tasks show
- [ ] Click "Done" filter - verify only completed tasks show
- [ ] Verify task count updates correctly
- [ ] Verify empty state message if no tasks match filter

#### 5. Update Task Status
- [ ] Select a task's status dropdown
- [ ] Change status from "To Do" to "In Progress"
- [ ] Verify status updates immediately
- [ ] Change status to "Done"
- [ ] Verify status persists after page refresh (F5)

#### 6. Edit Task
- [ ] Click "✏️ Edit" button on a task
- [ ] Verify form populates with task details
- [ ] Verify "Update Task" button appears
- [ ] Verify "Cancel" button appears
- [ ] Modify the title
- [ ] Click "Update Task"
- [ ] Verify task updates in the list
- [ ] Verify edit mode exits

#### 7. Cancel Edit
- [ ] Click "Edit" on a task
- [ ] Make changes to the form
- [ ] Click "Cancel" button
- [ ] Verify form returns to create mode
- [ ] Verify changes were not saved

#### 8. Delete Task
- [ ] Click "🗑️ Delete" button on a task
- [ ] Verify confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] Verify task is removed from list
- [ ] Verify task count decreases

#### 9. Responsive Design
- [ ] Resize browser window to mobile size (~400px)
- [ ] Verify layout adapts (form fields stack)
- [ ] Verify buttons remain accessible
- [ ] Verify filters remain usable
- [ ] Test on tablet size (~768px)

#### 10. Error Handling
- [ ] Try to create task with empty title
- [ ] Verify error handling (should prevent creation)
- [ ] Stop backend server (Ctrl+C in backend terminal)
- [ ] Try to create a task
- [ ] Verify error message appears
- [ ] Restart backend
- [ ] Verify app reconnects

### API Testing

#### Health Check
```bash
curl http://localhost:5000/health
```
**Expected:** `{"status":"healthy","timestamp":"...","uptime":...}`

#### Get All Tasks
```bash
curl http://localhost:5000/api/tasks
```
**Expected:** JSON array of tasks

#### Get Tasks by Status
```bash
curl http://localhost:5000/api/tasks?status=todo
```
**Expected:** JSON array of filtered tasks

#### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Test Task",
    "description": "Testing via API",
    "status": "todo",
    "priority": "medium"
  }'
```
**Expected:** `{"success":true,"data":{...}}`

#### Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```
**Expected:** `{"success":true,"data":{...}}`

#### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/1
```
**Expected:** `{"success":true,"message":"Task deleted successfully"}`

### Running Automated Tests

#### Backend Tests
```bash
cd backend
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

**Expected Output:**
```
PASS tests/api.test.js
PASS tests/task.model.test.js
PASS tests/task.controller.test.js

Test Suites: 3 passed, 3 total
Tests:       18 passed, 18 total
```

#### Frontend Tests
```bash
cd frontend
npm test

# With coverage
npm test -- --coverage --watchAll=false
```

**Expected Output:**
```
PASS src/App.test.js

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
```

### Performance Testing

#### Load Time
- [ ] Clear browser cache
- [ ] Open DevTools Network tab
- [ ] Navigate to http://localhost:3000
- [ ] Verify page loads in < 2 seconds
- [ ] Check for unnecessary requests

#### API Response Time
- [ ] Open DevTools Network tab
- [ ] Create/update/delete tasks
- [ ] Verify API responses in < 100ms
- [ ] Check for errors or slow queries

### Browser Compatibility

Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on Mac)

### Database Testing

#### Verify Data Persistence
```bash
# Connect to database
docker exec -it taskmanager-db psql -U devuser -d taskmanager

# Check tasks
SELECT * FROM tasks;

# Exit
\q
```

#### Check Sample Data
Verify 5 sample tasks exist:
1. "Setup development environment" (done, high)
2. "Create Express API" (in-progress, high)
3. "Implement React frontend" (todo, high)
4. "Write unit tests" (todo, medium)
5. "Configure Docker" (todo, medium)

### Common Issues & Solutions

**Issue:** "Failed to fetch tasks"
- **Solution:** Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` environment variable

**Issue:** "Database connection failed"
- **Solution:** Ensure PostgreSQL is running
- Check `DATABASE_URL` in backend .env

**Issue:** "Port 3000 already in use"
- **Solution:** Kill existing process or use different port

**Issue:** "npm test fails"
- **Solution:** Run `npm install` first
- Clear Jest cache: `npm test -- --clearCache`

### Test Results Template

```markdown
## Test Results - [Date]

### Manual Testing
- Application Load: ✅
- Create Task: ✅
- View Tasks: ✅
- Filter Tasks: ✅
- Update Status: ✅
- Edit Task: ✅
- Delete Task: ✅
- Responsive Design: ✅
- Error Handling: ✅

### API Testing
- Health Check: ✅
- GET /api/tasks: ✅
- POST /api/tasks: ✅
- PUT /api/tasks/:id: ✅
- DELETE /api/tasks/:id: ✅

### Automated Tests
- Backend Tests: 18/18 passed ✅
- Frontend Tests: 4/4 passed ✅

### Issues Found
None

### Notes
All functionality working as expected.
```

## 🎯 Acceptance Criteria

The application passes testing if:
- ✅ All manual testing items completed
- ✅ All API endpoints respond correctly
- ✅ All automated tests pass (22/22)
- ✅ No console errors
- ✅ Responsive on mobile, tablet, desktop
- ✅ Data persists across page refreshes

## 📊 Coverage Goals

- Backend: > 80% code coverage
- Frontend: > 70% code coverage
- All critical paths tested

---

**Ready for CI/CD** after all tests pass! 🚀
