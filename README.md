# ⚡ Smart Leads Dashboard

A **production-ready**, full-stack MERN (MongoDB, Express, React, Node.js) CRM and lead management platform built with TypeScript, TanStack Query, and a modern Geist/Vercel-inspired design system.

**Live Demo:** [https://smart-leads-dashboard-topaz.vercel.app](https://smart-leads-dashboard-topaz.vercel.app)

**API Base URL:** [https://smart-leads-dashboard-g67j.onrender.com](https://smart-leads-dashboard-g67j.onrender.com)

> **Demo Credentials:**
> - Admin: `admin@smartleads.io` / `Password123`
> - Sales: `sales@smartleads.io` / `Password123`

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started (Local)](#-getting-started-local)
- [Deployment Guide](#-deployment-guide)
- [API Reference](#-api-reference)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Security](#-security)

---

## 🎯 Overview

**Smart Leads Dashboard** is a professional CRM (Customer Relationship Management) application designed to help sales teams capture, track, and manage leads efficiently. It provides a beautiful, real-time dashboard with charts, filterable lead tables, role-based access control, and a complete audit trail of all lead activity.

The application is split into two separate services:

| Service | Technology | Hosted On |
|---------|------------|-----------|
| **Frontend (Client)** | React + Vite + TailwindCSS | Vercel |
| **Backend (API Server)** | Node.js + Express + MongoDB | Render |
| **Database** | MongoDB Atlas (Cloud) | MongoDB Atlas |

---

## ✨ Features

### Core Features
- 🔐 **JWT Authentication** — Secure login/register with access & refresh token rotation
- 👥 **Role-Based Access Control** — `Admin` and `Sales` roles with different permissions
- 📊 **Analytics Dashboard** — Live KPI cards, conversion funnel chart, leads-by-source breakdown
- 📋 **Lead Management** — Full CRUD: Create, Read, Update, Delete leads
- 🔍 **Search & Filter** — Filter leads by status, source, search by name/email/company
- 📄 **Pagination** — Server-side pagination for handling large data sets
- 🌙 **Dark / Light Mode** — Persistent theme toggle
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop

### Admin-Only Features
- 👤 **User Management** — Create and manage team members
- 📜 **Activity Log** — Full audit trail of who did what and when
- 📈 **All Leads View** — See leads from every salesperson on the team

### Sales-Only Features
- 👁️ **Own Leads View** — Salespeople only see and manage their own leads

---

## 🛠 Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **TailwindCSS** | Utility-first styling |
| **Framer Motion** | Page & component animations |
| **TanStack Query v5** | Server state management & caching |
| **Axios** | HTTP client with interceptors |
| **React Hook Form** | Form state management |
| **Recharts** | Dashboard charts |
| **React Router v6** | Client-side routing |

### Backend (`/server`)
| Technology | Purpose |
|---|---|
| **Node.js + Express** | API server |
| **TypeScript** | Type safety |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcryptjs** | Password hashing (12 rounds) |
| **Helmet** | HTTP security headers |
| **express-rate-limit** | Brute-force protection |
| **CORS** | Cross-origin request policy |
| **Morgan** | HTTP request logging |

---

## 🏗 Architecture

```
smart-leads-dashboard/
│
├── client/                  # React Frontend (deployed to Vercel)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level page components
│   │   ├── contexts/        # AuthContext (global auth state)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions (Axios)
│   │   └── types/           # Shared TypeScript interfaces
│   ├── vercel.json          # SPA rewrite rules for Vercel
│   └── vite.config.ts       # Vite build configuration
│
├── server/                  # Express API (deployed to Render)
│   ├── src/
│   │   ├── config/          # Database & environment config
│   │   ├── controllers/     # Route handler logic
│   │   ├── middleware/       # Auth, error handling middleware
│   │   ├── models/          # Mongoose schemas (User, Lead, ActivityLog)
│   │   ├── routes/          # API route definitions
│   │   ├── scripts/         # Database seed script
│   │   └── utils/           # Helper utilities
│   └── Dockerfile           # Multi-stage production Docker image
│
├── render.yaml              # Render deployment blueprint
├── docker-compose.yml       # Local Docker orchestration
└── .env.example             # Environment variable template
```

### Request Flow

```
User Browser
    │
    ▼
Vercel (React SPA)
    │  HTTPS API Request
    ▼
Render (Express API)
    │  Mongoose Query
    ▼
MongoDB Atlas (Cloud Database)
```

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017 (or a MongoDB Atlas URI)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/codebyom2309/smart-leads-dashboard.git
cd smart-leads-dashboard
```

### 2. Set up the backend
```bash
cd server
cp ../.env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm install
npm run seed    # Populates the database with sample users and leads
npm run dev     # Starts the API server at http://localhost:5000
```

### 3. Set up the frontend (in a new terminal)
```bash
cd client
npm install
npm run dev     # Starts the Vite dev server at http://localhost:5173
```

### 4. Open the app
Visit [http://localhost:5173](http://localhost:5173) and log in with:
- Admin: `admin@smartleads.io` / `Password1`
- Sales: `sales@smartleads.io` / `Password1`

---

## ☁️ Deployment Guide

### Backend → Render

The backend is hosted as a **Docker Web Service** on [Render.com](https://render.com).

**Configuration:**
| Setting | Value |
|---|---|
| **Runtime** | Docker |
| **Dockerfile Path** | `server/Dockerfile` |
| **Docker Build Context** | `server` |

**Required Environment Variables on Render:**
| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random secret string |
| `JWT_REFRESH_SECRET` | Another long random secret string |
| `CLIENT_URL` | Your Vercel frontend URL (e.g., `https://your-app.vercel.app`) |

> ⚠️ **Important:** The `CLIENT_URL` must exactly match your Vercel URL (no trailing slash) for CORS to allow the frontend to communicate with the backend.

---

### Frontend → Vercel

The frontend is deployed as a **Vite** project on [Vercel.com](https://vercel.com).

**Configuration:**
| Setting | Value |
|---|---|
| **Framework** | Vite |
| **Root Directory** | `client` |

**Required Environment Variables on Vercel:**
| Variable | Value |
|---|---|
| `VITE_API_URL` | Your Render backend URL (e.g., `https://your-api.onrender.com`) |

> ⚠️ **Important:** After deploying both services, update the `CLIENT_URL` on Render with your final Vercel URL, then redeploy the backend.

---

### MongoDB Atlas

The database is hosted on **MongoDB Atlas (Free M0 Tier)**.

**Setup checklist:**
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user under **Database Access**
3. Under **Network Access**, add IP `0.0.0.0/0` to allow Render's dynamic IPs
4. Copy the connection string and paste it as `MONGO_URI` in Render's environment variables

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create a new account | Public |
| `POST` | `/api/auth/login` | Log in and get tokens | Public |
| `POST` | `/api/auth/refresh` | Refresh access token | Public |
| `POST` | `/api/auth/logout` | Invalidate refresh token | Protected |
| `GET` | `/api/auth/me` | Get current user profile | Protected |

### Leads
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/leads` | Get paginated leads list | Protected |
| `POST` | `/api/leads` | Create a new lead | Protected |
| `GET` | `/api/leads/:id` | Get a single lead | Protected |
| `PUT` | `/api/leads/:id` | Update a lead | Protected |
| `DELETE` | `/api/leads/:id` | Delete a lead | Admin only |
| `GET` | `/api/leads/stats` | Get dashboard statistics | Protected |

### Utility
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/health` | API health check | Public |
| `GET` | `/api/seed` | Seed database with demo data | Public (temp) |

---

## 🔐 Environment Variables

### Server (`server/.env`)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart-leads
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_ROUNDS=12
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🔒 Security

- **Passwords** are hashed with `bcrypt` at 12 rounds before storage — never stored in plain text.
- **JWT tokens** have short expiry (7 days access, 30 days refresh) with automatic rotation.
- **Helmet.js** sets secure HTTP headers on every response.
- **Rate limiting** protects auth routes (20 requests per 15 minutes) and global API (300 requests per 15 minutes).
- **CORS** is restricted to only allow requests from the configured frontend URL.
- **Role-based middleware** ensures sales users cannot access admin-only endpoints.
- **Environment variables** store all secrets — never hardcoded in source code.

---

## 📝 License

This project is built for educational and portfolio purposes.

---

Built with ❤️ using the MERN Stack + TypeScript.
