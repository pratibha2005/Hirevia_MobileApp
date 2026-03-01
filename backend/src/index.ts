import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';
import interviewRoutes from './routes/interviewRoutes';
import { requireAuth } from './middlewares/authMiddleware';
import { requireRole } from './middlewares/roleMiddleware';
import {
    listInterviews,
    createInterview,
    getAvailability,
    updateAvailability
} from './controllers/interviewController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);

// Explicit interview route bindings (fallback for runtime router resolution issues)
app.get('/api/interviews', requireAuth, requireRole(['HR']), listInterviews);
app.post('/api/interviews', requireAuth, requireRole(['HR']), createInterview);
app.get('/api/interviews/availability', requireAuth, requireRole(['HR']), getAvailability);
app.put('/api/interviews/availability', requireAuth, requireRole(['HR']), updateAvailability);

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Backend running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });

export default app;
