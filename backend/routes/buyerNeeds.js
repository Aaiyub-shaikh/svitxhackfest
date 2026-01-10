// Routes for buyer needs (POST by buyers, GET all by farmers, GET mine by buyer)
import express from 'express';
import { query } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/buyer-needs
 * Insert a new buyer need (only buyers)
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.user_type !== 'buyer') {
      return res.status(403).json({ error: { message: 'Only buyers can post requirements' } });
    }

    const { crop_name, quantity, location, expected_price, delivery_date, contact_phone, description } = req.body;

    if (!crop_name || !quantity) {
      return res.status(400).json({ error: { message: 'Missing required fields: crop_name and quantity' } });
    }

    const insertSql = `
      INSERT INTO buyer_needs (buyer_id, buyer_email, crop_name, quantity, location, expected_price, delivery_date, contact_phone, description, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
      RETURNING id, buyer_id, buyer_email, crop_name, quantity, location, expected_price, delivery_date, contact_phone, description, created_at
    `;

    const values = [user.id, user.email, crop_name, quantity, location || null, expected_price || null, delivery_date || null, contact_phone || null, description || null];

    const result = await query(insertSql, values);
    return res.status(201).json({ data: result.rows[0], error: null });
  } catch (err) {
    console.error('Error inserting buyer need:', err);
    return res.status(500).json({ error: { message: 'Failed to save requirement' } });
  }
});

/**
 * GET /api/buyer-needs
 * Return all buyer needs (only farmers)
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.user_type !== 'farmer') {
      return res.status(403).json({ error: { message: 'Only farmers can view buyer requirements' } });
    }

    const sql = `SELECT id, buyer_id, buyer_email, crop_name, quantity, location, expected_price, delivery_date, contact_phone, description, created_at FROM buyer_needs ORDER BY created_at DESC`;
    const result = await query(sql);
    return res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error('Error fetching buyer needs:', err);
    return res.status(500).json({ error: { message: 'Failed to fetch requirements' } });
  }
});

/**
 * GET /api/buyer-needs/mine
 * Return buyer's own needs (only buyers)
 */
router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.user_type !== 'buyer') {
      return res.status(403).json({ error: { message: 'Only buyers can view their requirements' } });
    }

    const sql = `SELECT id, buyer_id, buyer_email, crop_name, quantity, location, expected_price, delivery_date, contact_phone, description, created_at FROM buyer_needs WHERE buyer_id = $1 ORDER BY created_at DESC`;
    const result = await query(sql, [user.id]);
    return res.json({ data: result.rows, error: null });
  } catch (err) {
    console.error('Error fetching buyer own needs:', err);
    return res.status(500).json({ error: { message: 'Failed to fetch your requirements' } });
  }
});

export default router;
