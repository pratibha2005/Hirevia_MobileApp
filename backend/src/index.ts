import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';
import interviewRoutes from './routes/interviewRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import { requireAuth } from './middlewares/authMiddleware';
import { requireRole } from './middlewares/roleMiddleware';
import { requestLogger } from './middlewares/requestLogger';
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

console.log('\n🚀 Starting Hirevia Backend...\n');

// Middleware
// app.use(cors());
app.use(cors({
  origin: "https://hirevia-4bioyprpv-pratibha-portfolio.vercel.app/",
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
console.log('📁 Static files served from /uploads');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/analytics', analyticsRoutes);

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
        console.log(`📍 Database: ${MONGODB_URI.split('@')[1] || 'local'}\n`);
        app.listen(PORT, () => {
            console.log(`🎯 Server running on http://localhost:${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/health\n`);
            console.log('🔧 Available routes:');
            console.log('   POST /api/auth/register/applicant');
            console.log('   POST /api/auth/register/hr');
            console.log('   POST /api/auth/login');
            console.log('   GET  /api/auth/profile');
            console.log('   POST /api/applications');
            console.log('   GET  /api/jobs');
            console.log('   ...\n');
            console.log('✨ Ready to accept requests!\n');
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });

export default app;
