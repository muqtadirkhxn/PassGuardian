# 🔐 PassGuardian

A secure full-stack password manager built with React.js, Node.js, Express.js, and MongoDB Atlas. PassGuardian helps users securely store, organize, generate, and manage passwords through encrypted credential storage, JWT-based authentication, and a responsive user-friendly dashboard.

## 🚀 Overview

PassGuardian is a personal full-stack web application designed and developed independently to provide secure password management with modern authentication and encryption techniques. The application allows users to create accounts, securely store website credentials, organize passwords by category, generate strong passwords, and access their vault through an intuitive dashboard interface.

## 🌐 Live Demo

Frontend: Coming Soon

Backend API: Coming Soon

## ✨ Features

### Authentication & Security

- JWT-based user authentication
- Secure user registration and login
- bcrypt password hashing with salt rounds
- Protected API routes
- Session persistence
- AES-encrypted credential storage

### Password Management

- Create, read, update, and delete password entries
- Store website credentials securely
- Password visibility toggle
- Copy username and password to clipboard
- Category-based organization
- Real-time search and filtering

### User Experience

- Responsive desktop and mobile interface
- Sidebar navigation with active states
- Dashboard statistics overview
- Password strength indicator
- Built-in password generator
- Toast notifications and user feedback

## 🛠️ Tech Stack

| Layer          | Technologies                         |
| -------------- | ------------------------------------ |
| Frontend       | React.js 18, React Router DOM, Axios |
| Backend        | Node.js, Express.js                  |
| Database       | MongoDB Atlas                        |
| Authentication | JWT, bcryptjs                        |
| Encryption     | CryptoJS AES Encryption              |
| Notifications  | React Toastify                       |
| Icons          | Lucide React                         |
| Deployment     | Vercel, Render                       |

## 📁 Project Structure

passguardian/
├── backend/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── utils/
│ └── server.js
│
└── frontend/
├── public/
├── src/
│ ├── components/
│ ├── context/
│ ├── pages/
│ └── App.js

## 🔒 Security Features

- bcrypt password hashing for user authentication
- AES-encrypted password storage
- JWT-based authorization
- Protected API endpoints
- Environment variable configuration
- CORS protection
- Input validation and error handling

## 📊 Core Functionality

### User Authentication

- Register new account
- Secure login
- Persistent sessions
- Logout functionality

### Password Vault

- Add credentials
- View stored passwords
- Edit password entries
- Delete password entries
- Organize by categories

### Dashboard

- Password statistics
- Category breakdown
- Recent entries overview

## ⚙️ Local Development Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas or Local MongoDB

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start Backend

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start Frontend

```bash
npm start
```

Application URL:

```text
http://localhost:3000
```

## 🚀 Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- MongoDB Atlas

## 📡 API Endpoints

### Authentication

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

### Passwords

GET /api/passwords

POST /api/passwords

PUT /api/passwords/:id

DELETE /api/passwords/:id

GET /api/passwords/stats/overview

## 🎯 Key Highlights

- Full-Stack Application Development
- JWT Authentication System
- Password Encryption & Security
- MongoDB Atlas Integration
- RESTful API Design
- Responsive UI Development
- CRUD Operations
- Production Deployment Ready

## 📚 What I Learned

- Authentication and Authorization
- Password Hashing with bcrypt
- Encryption and Secure Data Handling
- REST API Development
- MongoDB Atlas Integration
- React State Management
- Environment Variable Management
- Cloud Deployment Workflows

## 📄 License

MIT License

## 👨‍💻 Author

Muqtadir Khan

Personal Full-Stack Development Project
