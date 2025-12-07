# School Expense Tracking System

A full-stack web application for managing school expenses, student payments, and financial tracking.

## Overview

The School Expense Tracking System is a comprehensive solution for educational institutions to manage student records, payment categories, and financial transactions. The system provides a user-friendly dashboard for administrators to track payments, generate reports, and manage student information efficiently.

## Features

### Backend Features
- **Categories Management**: Create, read, update, and delete payment categories
- **Student Management**: Manage student records and their payment categories
- **Payment Tracking**: Record and manage student payments
- **Excel Integration**: Generate reports and bulk import payments via Excel
- **JWT Authentication**: Secure admin access
- **OpenAPI Documentation**: Interactive API documentation with Swagger

### Frontend Features
- **Dashboard**: Overview of financial status and key metrics
- **Student Management**: Add, edit, view, and delete student records
- **Payment Tracking**: Record and manage individual payments
- **Category Management**: Configure payment categories
- **Reporting**: Generate and download financial reports
- **Search & Filtering**: Advanced filtering by class, payment status, and more
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Raw SQL queries with pg library
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI
- **Excel Processing**: xlsx library
- **Containerization**: Docker & Docker Compose

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Custom components with Tailwind CSS
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Notifications**: React Toastify

### Full Stack
- **Monorepo Management**: npm workspaces
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Date Handling**: date-fns

## Architecture

The application follows a modern full-stack architecture:

### Backend Structure
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle database operations
- **Utils**: Reusable utility functions
- **Middleware**: Authentication, error handling, etc.

### Frontend Structure
- **Pages**: Main application views
- **Components**: Reusable UI components
- **Context**: React context for global state
- **Lib**: API client and utilities
- **Types**: TypeScript type definitions

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- Docker & Docker Compose (optional, for containerized setup)

### Installation

1. Clone the repository
2. Install dependencies for the entire project:
   ```bash
   npm run install:all
   ```

### Development Setup

1. Start both backend and frontend in development mode:
   ```bash
   npm run dev
   ```

   This will:
   - Start the backend server on `http://localhost:3000`
   - Start the frontend development server on `http://localhost:5173`
   - Provide hot reloading for both frontend and backend

2. Access the application:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`
   - API Documentation: `http://localhost:3000/api-docs`

### Production Build

1. Build both frontend and backend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Docker Setup

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

   This will start both the application and PostgreSQL database.

## Project Structure

```
.
├── client/                  # Frontend application
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── assets/         # Images and static files
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── lib/            # API client and utilities
│   │   ├── pages/          # Main application pages
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   └── ...                 # Configuration files
│
├── server/                  # Backend API
│   ├── src/                # Source code
│   │   ├── controllers/    # Route controllers
│   │   ├── entities/       # Database entities
│   │   ├── middleware/    # Express middleware
│   │   ├── repositories/  # Database operations
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   ├── init.sql            # Database initialization script
│   └── ...                 # Configuration files
│
├── docker/                  # Docker configuration
│   ├── Dockerfile          # Backend Dockerfile
│   └── docker-compose.yml  # Docker Compose configuration
│
├── package.json             # Root package.json with workspaces
└── README.md                # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Payments
- `GET /api/payments` - Get all payments (with filters)
- `POST /api/payments` - Create payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Reports
- `GET /api/reports/generate` - Generate Excel report
- `POST /api/reports/upload` - Upload payments from Excel

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `ADMIN_EMAIL` - Admin email for login
- `ADMIN_PASSWORD` - Admin password

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API base URL

## Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm start` - Start production server
- `npm run install:all` - Install dependencies for all workspaces

### Backend (server/)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Frontend (client/)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Database Schema

The database consists of four main tables:
- `categories` - Payment categories
- `students` - Student information
- `student_categories` - Many-to-many relationship between students and categories
- `payments` - Payment records

See `server/init.sql` for the complete schema and sample data.

## Development Notes

- The frontend uses React 19 with the new compiler (disabled by default for performance)
- TypeScript is used throughout both frontend and backend
- Tailwind CSS is used for styling
- React Query handles data fetching and caching
- Zod is used for form validation
- The application follows a mobile-first responsive design approach

## License

This project is licensed under the MIT License.