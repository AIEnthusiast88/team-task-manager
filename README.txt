TEAM TASK MANAGER - Full Stack Web Application
===============================================

LIVE URL: https://team-task-manager-frontend-9y84.onrender.com
GITHUB: https://github.com/AIEnthusiast88/team-task-manager
BACKEND API: https://team-task-manager-backend-wkzs.onrender.com

-----------------------------------------------
PROJECT OVERVIEW
-----------------------------------------------
Team Task Manager is a full-stack web application that allows teams to 
create projects, assign tasks, and track progress with role-based access 
control (Admin/Member).

-----------------------------------------------
KEY FEATURES
-----------------------------------------------
- User Authentication (Register/Login with JWT)
- Role-Based Access Control (Admin and Member roles)
- Project Management (Create, View, Delete projects)
- Task Management (Create, Assign, Track, Delete tasks)
- Task Status Tracking (Todo, In Progress, Done)
- Task Priority Levels (Low, Medium, High)
- Due Date Assignment
- Responsive Dashboard for each role

-----------------------------------------------
TECH STACK
-----------------------------------------------
Frontend  : React.js + Vite + React Router + Axios
Backend   : Node.js + Express.js
Database  : MongoDB Atlas
Auth      : JWT (JSON Web Tokens) + bcrypt
Deployment: Render (Frontend + Backend)

-----------------------------------------------
API ENDPOINTS
-----------------------------------------------
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/projects          - Get all projects
POST   /api/projects          - Create project (Admin only)
PUT    /api/projects/:id      - Update project (Admin only)
DELETE /api/projects/:id      - Delete project (Admin only)
GET    /api/tasks/project/:id - Get tasks by project
POST   /api/tasks             - Create task (Admin only)
PUT    /api/tasks/:id         - Update task status
DELETE /api/tasks/:id         - Delete task (Admin only)

-----------------------------------------------
ROLE-BASED ACCESS
-----------------------------------------------
ADMIN:
  - Create/Delete projects
  - Create/Delete tasks
  - Assign tasks to members
  - Set priority and due dates
  - Full dashboard access

MEMBER:
  - View projects
  - View assigned tasks
  - Update task status only (Todo/In Progress/Done)

-----------------------------------------------
TEST CREDENTIALS
-----------------------------------------------
Admin:
  Email   : admin@taskmanager.com
  Password: Admin@123

Member:
  Email   : member@taskmanager.com
  Password: Member@123

-----------------------------------------------
HOW TO RUN LOCALLY
-----------------------------------------------
1. Clone the repo:
   git clone https://github.com/AIEnthusiast88/team-task-manager.git

2. Backend setup:
   cd backend
   npm install
   Add .env file with MONGO_URI and JWT_SECRET
   node server.js

3. Frontend setup:
   cd frontend
   npm install
   npm run dev

-----------------------------------------------
DEVELOPER
-----------------------------------------------
Name: Rudresh
Assessment: Full-Stack Assessment <> Ethara.AI
Submission Date: 2nd May 2026