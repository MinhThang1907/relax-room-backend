import express from 'express';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { corsMiddleware } from './middleware/cors';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import healthRoutes from './routes/health';
import moodsRoutes from './routes/moods';
import roomsRoutes from './routes/rooms';

const app = express();
const PORT = process.env.PORT || 4000;


// Middleware
app.use(express.json());
app.use(corsMiddleware);
app.use(requestLogger);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/moods', moodsRoutes);
app.use('/api/rooms', roomsRoutes);

// Error handling (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ CORS enabled for: ${process.env.FRONTEND_ORIGIN || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
