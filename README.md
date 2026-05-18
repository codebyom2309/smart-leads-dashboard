# Smart Leads Dashboard

A production-quality MERN (MongoDB, Express, React, Node.js) CRM dashboard for managing sales leads. Built with TypeScript, TailwindCSS, and a premium modern UI.

---

## Features

### Authentication & Security
- JWT access + refresh token flow
- bcrypt password hashing (12 rounds)
- Auth middleware with role-based guards
- Request rate limiting
- Helmet security headers
- CORS configuration

### Lead Management (CRUD)
- Create / Read / Update / Delete leads
- Fields: Name, Email, Status, Source, Notes, Phone, Company, Created At
- Statuses: **New**, **Contacted**, **Qualified**, **Lost**
- Sources: **Website**, **Instagram**, **Referral**

### Filtering & Search
- Debounced search (name, email, company)
- Status filter
- Source filter
- Sort by field (newest/oldest)
- Multiple filters combined
- Active filter chips with individual clear

### Pagination
- Backend skip/limit pagination
- 10 leads per page (configurable)
- Full pagination metadata returned

### Dashboard
- Stats overview (Total, New, Qualified, 30-day activity)
- Status distribution pie chart
- Source bar chart
- Recent leads list

### Role Based Access Control
- **Admin**: Full CRUD + User management
- **Sales**: Own leads CRUD only

### Additional Features
- CSV Export with applied filters
- Dark mode (persisted to localStorage)
- Activity audit logs
- Docker production setup

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + TailwindCSS |
| State | TanStack Query v5 |
| Routing | React Router v6 |
| Charts | Recharts |
| Animations | Framer Motion |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
smart-leads-dashboard/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/         # Route guards
│   │   │   ├── dashboard/    # Charts
│   │   │   ├── layout/       # Sidebar, Navbar, DashboardLayout
│   │   │   ├── leads/        # LeadTable, LeadForm, FilterBar, LeadDetail
│   │   │   └── ui/           # Reusable: Badge, Modal, Skeleton, StatCard, Pagination
│   │   ├── constants/        # App-wide constants
│   │   ├── context/          # AuthContext, ThemeContext
│   │   ├── hooks/            # useLeads, useDebounce, etc.
│   │   ├── pages/            # LoginPage, RegisterPage, DashboardPage, LeadsPage, ProfilePage, AdminUsersPage
│   │   ├── services/         # api.client, auth.api, leads.api
│   │   └── types/            # Shared TypeScript types
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── server/                    # Express API
│   ├── src/
│   │   ├── config/           # database.ts, env.ts
│   │   ├── controllers/      # auth.controller, lead.controller
│   │   ├── middleware/        # auth.ts, validate.ts, validators.ts
│   │   ├── models/           # User, Lead, ActivityLog
│   │   ├── routes/           # auth.routes, lead.routes
│   │   ├── scripts/          # seed.ts
│   │   ├── services/         # auth.service, lead.service
│   │   ├── types/            # Server types
│   │   └── utils/            # errors.ts, jwt.ts, response.ts
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Quick Start — Local Development

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm or pnpm

### 1. Clone & Configure

```bash
git clone <repo-url>
cd smart-leads-dashboard

# Copy environment file
cp .env.example .env
# Edit .env with your values
```

### 2. Start the Backend

```bash
cd server
npm install
npm run dev        # starts on port 5000
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates:
- `admin@smartleads.io` / `Password1` (Admin role)
- `sales@smartleads.io` / `Password1` (Sales role)
- 12 sample leads

### 4. Start the Frontend

```bash
cd client
npm install
npm run dev        # starts on port 5173
```

Visit `http://localhost:5173`

---

## Docker Setup

### Run Everything with Docker Compose

```bash
# 1. Copy and configure environment
cp .env.example .env

# Required: Set secure JWT secrets
JWT_SECRET=$(openssl rand -hex 64)
JWT_REFRESH_SECRET=$(openssl rand -hex 64)

# 2. Start all services
docker compose up -d

# 3. View logs
docker compose logs -f

# 4. Stop
docker compose down
```

Services:
- **Frontend**: `http://localhost:5173`
- **API**: `http://localhost:5000`
- **MongoDB**: `mongodb://localhost:27017`

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/refresh` | No | Refresh tokens |
| GET | `/api/auth/profile` | Yes | Get current user |
| GET | `/api/auth/users` | Admin | List all users |
| PATCH | `/api/auth/users/:id/role` | Admin | Update user role |
| DELETE | `/api/auth/users/:id` | Admin | Deactivate user |

### Leads

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/leads` | Yes | List leads (filterable, paginated) |
| POST | `/api/leads` | Yes | Create lead |
| GET | `/api/leads/:id` | Yes | Get single lead |
| PUT | `/api/leads/:id` | Yes | Update lead |
| DELETE | `/api/leads/:id` | Yes | Delete lead |
| GET | `/api/leads/stats` | Yes | Get dashboard stats |
| GET | `/api/leads/export` | Yes | Export CSV |

### Query Parameters (GET /api/leads)

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `status` | string | Filter by: New, Contacted, Qualified, Lost |
| `source` | string | Filter by: Website, Instagram, Referral |
| `search` | string | Search name/email/company |
| `sortBy` | string | Sort field (default: createdAt) |
| `sortOrder` | string | asc or desc (default: desc) |
| `startDate` | string | ISO date range start |
| `endDate` | string | ISO date range end |

### Response Format

```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": {
    "leads": [...]
  },
  "pagination": {
    "total": 47,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## Environment Variables

See `.env.example` for all required variables. Key variables:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret (use 64+ chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `CLIENT_URL` | Frontend URL for CORS |
| `BCRYPT_ROUNDS` | Password hashing rounds (default: 12) |

---

## License

MIT
