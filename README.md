# ✅ TaskFlow — Modern Task Manager

A full-stack task management application built with **React** and **Express.js**. Organize your work, study, and personal tasks with a beautiful Kanban board, subtask tracking, and an insightful dashboard — all in a sleek dark-themed UI.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 🌟 Features

- **Authentication** — Secure register, login, and logout with JWT tokens and hashed passwords (bcrypt)
- **Task CRUD** — Create, read, update, and delete tasks with title, description, category, priority, due date, and status
- **Kanban Board** — Drag-free Kanban columns to visualize tasks by status (Not Started · Pending · Completed)
- **Subtask Management** — Add, toggle, and delete subtasks within any task
- **Dashboard Stats** — At-a-glance stats cards showing task counts by status
- **Sorting & Filtering** — Sort tasks by date, priority, or status; filter by category
- **Profile Management** — Update name, email, phone, password, and profile picture (uploaded via ImageKit)
- **Protected Routes** — Both frontend and backend enforce authentication on all private pages and API endpoints
- **Dark Theme UI** — Premium glassmorphic design system with smooth animations
- **Responsive Design** — Fully optimized for desktop, tablet, and mobile viewports

---

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|------------------------------------------------|
| **Frontend** | React 19, React Router 7, Vite 8, Tailwind CSS 4 |
| **Backend**  | Node.js, Express 5                             |
| **Database** | MongoDB Atlas (Mongoose 9)                     |
| **Auth**     | JSON Web Tokens (JWT), bcrypt                  |
| **Storage**  | ImageKit (cloud image uploads)                 |
| **Deployment** | Vercel (frontend), Render (backend)          |

---

## 📁 Project Structure

```
taskManager/
├── client/                          # Frontend (React + Vite)
│   ├── index.html                   # HTML entry point
│   ├── vercel.json                  # Vercel SPA rewrite rules
│   ├── vite.config.js               # Vite configuration
│   ├── package.json
│   └── src/
│       ├── main.jsx                 # App bootstrap
│       ├── App.jsx                  # Route definitions
│       ├── index.css                # Global design system & CSS variables
│       ├── api/
│       │   └── axios.js             # Axios instance with auth interceptor
│       ├── components/
│       │   ├── AddTaskModal.jsx     # Modal to create new tasks
│       │   ├── EditTaskModal.jsx    # Modal to edit existing tasks
│       │   ├── DashboardLayout.jsx  # Main layout (sidebar + content)
│       │   ├── KanbanBoard.jsx      # Kanban column view
│       │   ├── ProfilePanel.jsx     # User profile management panel
│       │   ├── ProtectedRoute.jsx   # Auth gate for private routes
│       │   ├── Sidebar.jsx          # Navigation sidebar
│       │   ├── StatsCard.jsx        # Dashboard stat widget
│       │   ├── TaskCard.jsx         # Individual task card + subtasks
│       │   └── Toast.jsx            # Toast notification system
│       └── pages/
│           ├── Login.jsx            # Login page
│           ├── Register.jsx         # Registration page
│           └── Dashboard.jsx        # Main dashboard page
│
└── server/                          # Backend (Express.js)
    ├── server.js                    # Entry point — starts server & DB
    ├── package.json
    ├── config/
    │   ├── db.js                    # MongoDB connection
    │   ├── imagekit.js              # ImageKit SDK setup
    │   └── jwt.js                   # Token generation & verification
    ├── models/
    │   ├── task.model.js            # Task schema (title, status, subtasks, etc.)
    │   └── user.model.js            # User schema (name, email, profile picture)
    └── src/
        ├── app.js                   # Express app (middleware, CORS, routes)
        ├── controllers/
        │   ├── auth.controller.js   # Register, login, logout, /me
        │   ├── task.controller.js   # Task CRUD, stats, subtask ops
        │   └── user.controller.js   # Profile picture, name, email, password
        ├── middlewares/
        │   ├── auth.middleware.js    # JWT verification middleware
        │   └── upload.middleware.js  # Multer memory storage for file uploads
        └── routes/
            ├── auth.routes.js       # POST /auth/register, /login, /logout; GET /auth/me
            ├── task.routes.js       # /task/* endpoints
            └── user.routes.js       # /user/* endpoints
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- A **MongoDB Atlas** cluster (or local MongoDB instance)
- An **ImageKit** account (for profile picture uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/Manash2005/taskManager.git
cd taskManager
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

> ⚠️ **Never commit `.env` to version control.** Make sure `server/.env` is in your `.gitignore`.

Start the server:

```bash
npm start
```

The backend will run on `http://localhost:3000`.

### 3. Setup the Frontend

```bash
cd ../client
npm install
```

To use the local backend during development, update `src/api/axios.js`:

```js
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});
```

Start the dev server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

## 📡 API Endpoints

### Auth Routes (`/auth`)

| Method | Endpoint   | Description             | Auth Required |
|--------|-----------|-------------------------|:---:|
| POST   | `/auth/register` | Register a new user   | ❌ |
| POST   | `/auth/login`    | Login & get JWT token | ❌ |
| POST   | `/auth/logout`   | Clear auth cookie     | ❌ |
| GET    | `/auth/me`       | Get current user info | ✅ |

### Task Routes (`/task`)

| Method | Endpoint                              | Description              | Auth Required |
|--------|--------------------------------------|--------------------------|:---:|
| POST   | `/task/create-task`                  | Create a new task        | ✅ |
| GET    | `/task/get-tasks`                    | Get all user's tasks     | ✅ |
| DELETE | `/task/delete-task/:id`              | Delete a task            | ✅ |
| PATCH  | `/task/update-task/:id`              | Update a task            | ✅ |
| PATCH  | `/task/update-status/:id`            | Update task status only  | ✅ |
| GET    | `/task/filter-task`                  | Filter tasks             | ✅ |
| GET    | `/task/stats`                        | Get task statistics      | ✅ |
| POST   | `/task/add-subtask/:taskId/subtask`  | Add a subtask            | ✅ |
| PATCH  | `/task/update-subtask/:taskId/subtask/:subtaskId` | Toggle subtask | ✅ |
| DELETE | `/task/delete-subtask/:taskId/subtask/:subtaskId` | Delete subtask | ✅ |

### User Routes (`/user`)

| Method | Endpoint                  | Description                 | Auth Required |
|--------|--------------------------|------------------------------|:---:|
| GET    | `/user/details`          | Get user profile details     | ✅ |
| POST   | `/user/profile-picture`  | Upload profile picture       | ✅ |
| POST   | `/user/phone`            | Update phone number          | ✅ |
| PATCH  | `/user/name`             | Update display name          | ✅ |
| PATCH  | `/user/change-email`     | Update email address         | ✅ |
| PATCH  | `/user/change-password`  | Change password              | ✅ |

---

## 🌐 Deployment

### Frontend — Vercel

1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Set the **Root Directory** to `client`
3. Vercel auto-detects Vite — no extra config needed
4. The `vercel.json` handles SPA routing rewrites

### Backend — Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Set the **Root Directory** to `server`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add all environment variables from your `.env` file in the Render dashboard

---

## 🔐 Environment Variables

| Variable              | Description                          | Used In  |
|-----------------------|--------------------------------------|----------|
| `PORT`                | Server port (default: 3000)          | Backend  |
| `MONGODB_URI`         | MongoDB Atlas connection string      | Backend  |
| `JWT_SECRET`          | Secret key for signing JWT tokens    | Backend  |
| `IMAGEKIT_PRIVATE_KEY`| ImageKit SDK private key             | Backend  |

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

## 🙋‍♂️ Author

**Manash Swain**  
GitHub: [@Manash2005](https://github.com/Manash2005)
