import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import kernelRoutes from './routes/kernel.js';
import habitRoutes from './routes/habitRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import relationshipRoutes from './routes/relationshipRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kernel', kernelRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/social', relationshipRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'up', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;
