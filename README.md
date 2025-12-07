# School Expense Tracking System - Backend

This is the backend API for the School Expense Tracking System, built with Node.js, TypeScript, and PostgreSQL.

## Features

- **Categories Management**: Create, read, update, and delete payment categories
- **Student Management**: Manage student records and their payment categories
- **Payment Tracking**: Record and manage student payments
- **Excel Integration**: Generate reports and bulk import payments via Excel
- **JWT Authentication**: Secure admin access
- **OpenAPI Documentation**: Interactive API documentation with Swagger

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Raw SQL queries with pg library
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI
- **Excel Processing**: xlsx library
- **Containerization**: Docker & Docker Compose

## Architecture

The application follows a layered architecture:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle database operations
- **Utils**: Reusable utility functions
- **Middleware**: Authentication, error handling, etc.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- Docker & Docker Compose (optional, for containerized setup)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Set up the database:
   - Create a PostgreSQL database
   - Run the SQL script in `init.sql` to create tables and insert sample data

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`
API documentation at `http://localhost:3000/api-docs`

### Docker Setup

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

This will start both the application and PostgreSQL database.

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Admin login

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

#### Payments
- `GET /api/payments` - Get all payments (with filters)
- `POST /api/payments` - Create payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

#### Reports
- `GET /api/reports/generate` - Generate Excel report
- `POST /api/reports/upload` - Upload payments from Excel

## Environment Variables

- `PORT` - Server port (default: 3000)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT secret key
- `ADMIN_EMAIL` - Admin email for login
- `ADMIN_PASSWORD` - Admin password

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `docker:build` - Build Docker image
- `docker:run` - Run Docker container

## Database Schema

The database consists of four main tables:
- `categories` - Payment categories
- `students` - Student information
- `student_categories` - Many-to-many relationship between students and categories
- `payments` - Payment records

See `init.sql` for the complete schema and sample data.