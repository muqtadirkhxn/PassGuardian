# PassGuardian — Secure Password Manager

**MERN Stack Application** | React.js • Node.js • Express.js • MongoDB Atlas • bcrypt • JWT • AES-256

## Features

- **Secure Authentication**: JWT-based auth with bcrypt password hashing (salt rounds 12) for user credentials
- **Full CRUD Operations**: Create, Read, Update, Delete password entries with protected routes
- **Password Management**: AES-256 encrypted storage and retrieval of website credentials with category organization
- **Password Generator**: Built-in strong password generator with visual strength indicator
- **Category Management**: Organize passwords by category (Social, Work, Finance, Shopping, Entertainment, Other)
- **Search & Filter**: Real-time search and category filtering with persistence
- **Copy to Clipboard**: One-click copy with visual feedback (Check icon animation)
- **Responsive Design**: Clean UI with sidebar navigation, mobile hamburger menu, minimal cognitive load
- **Statistics Dashboard**: Overview of your password vault with category breakdowns
- **Sidebar Navigation**: Fixed sidebar with Dashboard and Passwords menu, active states, user info

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router DOM v6, Axios |
| Styling | Custom CSS with CSS Variables (no frameworks) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (cloud) |
| Security | bcryptjs (user auth), AES-256 (stored passwords), JWT, CORS, Protected Routes |
| Notifications | React Toastify |
| Icons | Lucide React |

## Project Structure

```
passguardian/
├── backend/
│   ├── models/
│   │   ├── User.js              # User schema with bcrypt hashing
│   │   └── Password.js          # Password entry schema with categories
│   ├── routes/
│   │   ├── auth.js              # Auth routes (register, login, me)
│   │   └── passwords.js         # CRUD routes + stats API
│   ├── middleware/
│   │   └── auth.js              # JWT verification middleware
│   ├── utils/
│   │   └── encryption.js        # AES-256 encryption/decryption
│   ├── server.js                # Express server
│   ├── package.json
│   ├── render.yaml              # Render deployment config
│   ├── .env.example             # Example env file
│   └── .gitignore
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.js         # Navigation sidebar with mobile support
    │   │   ├── PasswordCard.js    # Password display with copy/visibility
    │   │   ├── PasswordForm.js    # Add/Edit modal with generator
    │   │   └── PrivateRoute.js    # Auth route protection
    │   ├── pages/
    │   │   ├── Login.js           # Login with validation
    │   │   ├── Register.js        # Registration with validation
    │   │   ├── Dashboard.js       # Stats + recent passwords
    │   │   └── Passwords.js       # Full CRUD with search/filter
    │   ├── context/
    │   │   └── AuthContext.js     # Global auth + Axios interceptors
    │   ├── App.js                 # Router setup
    │   ├── index.js               # Entry point
    │   └── index.css              # Complete custom styling
    ├── package.json
    ├── vercel.json                # SPA routing config
    ├── .env.example               # Example env file
    └── .gitignore
```

## Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/passguardian
JWT_SECRET=your_super_secret_key_min_32_chars
ENCRYPTION_KEY=your_32_char_encryption_key_for_aes256
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup (new terminal)

```bash
cd frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

App runs at `http://localhost:3000`

## Deploy to Production

### Architecture
- **Frontend**: Vercel (React SPA)
- **Backend**: Render (Node.js + Express)
- **Database**: MongoDB Atlas

### Step 1: MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user (save username/password)
4. Whitelist all IPs (`0.0.0.0/0`) for Render/Vercel
5. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/passguardian`

### Step 2: Deploy Backend to Render

**Option A: Using Render Dashboard (Recommended)**
1. Go to [render.com](https://render.com) and create an account
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Select the `backend` folder as root
5. Configure:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/passguardian
   JWT_SECRET=your_super_secret_key_at_least_32_characters_long
   ENCRYPTION_KEY=your_32_char_encryption_key_for_aes256
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
7. Click "Create Web Service"

**Option B: Using render.yaml**
The `backend/render.yaml` file is included for infrastructure-as-code deployment.

### Step 3: Deploy Frontend to Vercel

```bash
cd frontend
npm install
```

Update `.env`:
```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

Deploy:
```bash
vercel --prod
```

Or use Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Select `frontend` as root directory
4. Set Framework Preset to "Create React App"
5. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```
6. Deploy

### Step 4: Update CORS
After deploying both, update `FRONTEND_URL` in Render environment variables to match your actual Vercel URL.

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Passwords (Protected - JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/passwords` | Get all passwords (decrypted) |
| POST | `/api/passwords` | Create new password (encrypted) |
| GET | `/api/passwords/:id` | Get single password (decrypted) |
| PUT | `/api/passwords/:id` | Update password (encrypt if changed) |
| DELETE | `/api/passwords/:id` | Delete password |
| GET | `/api/passwords/stats/overview` | Get statistics |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health status |
| GET | `/` | API info |

## Security Features

1. **Bcrypt Password Hashing**: User account passwords hashed with salt rounds 12
2. **AES-256 Encryption**: Stored website credentials encrypted at rest using `crypto-js`
3. **JWT Authentication**: Stateless auth with configurable expiry
4. **Protected Routes**: Middleware verifies JWT on every protected request
5. **Input Validation**: Server-side validation on all endpoints
6. **CORS Protection**: Configured for specific origins in production
7. **Error Handling**: Sanitized error messages in production
8. **Model Guards**: Prevents Mongoose model re-registration on hot reload

## Environment Variables

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing (min 32 chars) | Yes |
| `ENCRYPTION_KEY` | Key for AES-256 encryption (min 32 chars) | Yes |
| `JWT_EXPIRE` | Token expiry (e.g., `7d`) | Yes |
| `NODE_ENV` | `development` or `production` | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `PORT` | Server port (default: 5000) | No |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_API_URL` | Backend API URL | Yes |

## License

MIT License - College Assignment Project

---

**Developed as a secure password manager application with full CRUD functionality, user authentication with bcrypt hashing, AES-256 encryption for stored credentials, and an intuitive user interface focused on minimal cognitive load.**
