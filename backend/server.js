// Main Express server for Smart Farm Management API
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import buyerNeedsRoutes from './routes/buyerNeeds.js';
import irrigationRoutes from './routes/irrigation.js';
import assistantRoutes from './routes/assistant.js';
import { query } from './database.js';

dotenv.config();

// Global error handlers to surface unexpected crashes during testing
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:8080'], // Support multiple Vite ports
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Farm API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/buyer-needs', buyerNeedsRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/assistant', assistantRoutes);

// Ensure buyer_needs table exists (minimal migration)
const ensureBuyerNeedsTable = async () => {
  const createSql = `
    CREATE TABLE IF NOT EXISTS buyer_needs (
      id SERIAL PRIMARY KEY,
      buyer_id INTEGER,
      buyer_email TEXT,
      crop_name TEXT NOT NULL,
      quantity NUMERIC NOT NULL,
      location TEXT,
      expected_price TEXT,
      delivery_date DATE,
      contact_phone TEXT,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  try {
    await query(createSql);
    console.log('✅ buyer_needs table ready');
  } catch (err) {
    console.error('Failed to create buyer_needs table', err);
  }
  // Ensure buyer_id column can store UUIDs/text (some user ids are UUID strings)
  try {
    await query("ALTER TABLE buyer_needs ALTER COLUMN buyer_id TYPE TEXT USING buyer_id::text;");
    console.log('✅ buyer_needs.buyer_id column ensured as TEXT');
  } catch (err) {
    // Non-fatal; log and continue
    console.log('buyer_needs.buyer_id ALTER skipped or failed (may already be TEXT)');
  }
};

// Run table creation before server fully starts
ensureBuyerNeedsTable();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: { message: 'Internal server error' }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: { message: 'Route not found' }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
