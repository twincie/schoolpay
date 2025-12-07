import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/categories';
import studentRoutes from './routes/students';
import paymentRoutes from './routes/payments';
import reportRoutes from './routes/reports';
import classRoutes from './routes/classes';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'School Expense Tracking API',
    version: '1.0.0',
    description: 'API for managing school expenses, students, and payments',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', authenticateToken, categoryRoutes);
app.use('/api/students', authenticateToken, studentRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);
app.use('/api/reports', authenticateToken, reportRoutes);
app.use('/api/classes', authenticateToken, classRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Server is healthy' });
});

// Error handling
app.use(errorHandler);

// Connect to database and start server
import { initializeTypeORM } from './config/typeorm';

// Initialize TypeORM connection
initializeTypeORM().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
}).catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});