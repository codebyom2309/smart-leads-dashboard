import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import { errorHandler } from './utils/errors';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import { User } from './models/User';
import { Lead } from './models/Lead';
import bcrypt from 'bcryptjs';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts, please try again later.' },
});

app.use(limiter);

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Smart Leads Dashboard API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/leads', leadRoutes);

// Temporary Seed Route (For Demo Purposes)
app.get('/api/seed', async (req: Request, res: Response) => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});

    // Create users
    const adminPassword = await bcrypt.hash('Password123', 12);
    const salesPassword = await bcrypt.hash('Password123', 12);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@smartleads.io',
      password: adminPassword,
      role: 'admin',
      isActive: true,
    });

    await User.create({
      name: 'Sales User',
      email: 'sales@smartleads.io',
      password: salesPassword,
      role: 'sales',
      isActive: true,
    });

    // Create 100 leads
    const sources = ['Website', 'Instagram', 'Referral'];
    const statuses = ['New', 'Contacted', 'Qualified', 'Lost'];
    const companies = ['TechCorp', 'StartupCo', 'Innovate Inc', 'GlobalTech', 'Future IO', 'WebDev Studio', 'SaaS Co', 'Design Studio'];

    const leads = [];
    for (let i = 1; i <= 100; i++) {
      leads.push({
        name: `Demo User ${i}`,
        email: `user${i}@example.com`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        source: sources[Math.floor(Math.random() * sources.length)],
        company: companies[Math.floor(Math.random() * companies.length)],
        phone: `+1 555-01${i.toString().padStart(2, '0')}`,
        notes: `Automated demo lead ${i}`,
        createdBy: admin._id,
      });
    }

    await Lead.insertMany(leads);

    res.json({
      success: true,
      message: 'Database seeded successfully with 100 leads!',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use(errorHandler as (err: Error, req: Request, res: Response, next: NextFunction) => void);

// Start server
const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(`
🚀 Smart Leads Dashboard API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server:  http://localhost:${config.port}
🌍 Env:     ${config.nodeEnv}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  });
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

startServer().catch(console.error);

export default app;
