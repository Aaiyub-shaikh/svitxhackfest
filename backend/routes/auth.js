// Authentication routes
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query, getClient } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, userType, profileData } = req.body;

    // Validate input
    if (!email || !password || !userType || !profileData) {
      return res.status(400).json({
        error: { message: 'Missing required fields: email, password, userType, and profileData' }
      });
    }

    if (!['farmer', 'buyer'].includes(userType)) {
      return res.status(400).json({
        error: { message: 'userType must be either "farmer" or "buyer"' }
      });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: { message: 'User already exists with this email' }
      });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Use transaction for atomicity
    const client = await getClient();
    try {
      await client.query('BEGIN');

      // Insert user
      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW())
         RETURNING id, email, created_at`,
        [email.toLowerCase(), passwordHash]
      );

      const userId = userResult.rows[0].id;

      // Insert profile
      const profileResult = await client.query(
        `INSERT INTO profiles (user_id, user_type, full_name, phone, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id`,
        [userId, userType, profileData.full_name, profileData.phone]
      );

      const profileId = profileResult.rows[0].id;

      // Insert type-specific profile
      if (userType === 'farmer') {
        await client.query(
          `INSERT INTO farmer_profiles (profile_id, farm_name, farm_location, farm_size_acres, created_at, updated_at)
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          [
            profileId,
            profileData.farm_name,
            profileData.farm_location,
            parseFloat(profileData.farm_size_acres)
          ]
        );
      } else if (userType === 'buyer') {
        await client.query(
          `INSERT INTO buyer_profiles (profile_id, company_name, created_at, updated_at)
           VALUES ($1, $2, NOW(), NOW())`,
          [profileId, profileData.company_name]
        );
      }

      await client.query('COMMIT');

      // Generate JWT token
      const token = jwt.sign(
        {
          id: userId,
          email: email.toLowerCase(),
          user_type: userType
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Return user data similar to Supabase format
      res.status(201).json({
        data: {
          user: {
            id: userId,
            email: email.toLowerCase(),
            user_metadata: {
              user_type: userType,
              ...profileData
            }
          },
          session: {
            access_token: token,
            token_type: 'bearer',
            user: {
              id: userId,
              email: email.toLowerCase(),
              user_metadata: {
                user_type: userType,
                ...profileData
              }
            }
          }
        },
        error: null
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: { message: 'An unexpected error occurred during registration' }
    });
  }
});

/**
 * POST /api/auth/signin
 * Login user
 */
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required' }
      });
    }

    // Find user by email
    const userResult = await query(
      `SELECT u.id, u.email, u.password_hash, p.user_type, p.full_name, p.phone
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.email = $1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      });
    }

    const user = userResult.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      });
    }

    // Get type-specific profile data
    let profileData = {};
    if (user.user_type === 'farmer') {
      const farmerProfile = await query(
        `SELECT farm_name, farm_location, farm_size_acres
         FROM farmer_profiles fp
         JOIN profiles p ON p.id = fp.profile_id
         WHERE p.user_id = $1`,
        [user.id]
      );
      if (farmerProfile.rows.length > 0) {
        profileData = farmerProfile.rows[0];
      }
    } else if (user.user_type === 'buyer') {
      const buyerProfile = await query(
        `SELECT company_name
         FROM buyer_profiles bp
         JOIN profiles p ON p.id = bp.profile_id
         WHERE p.user_id = $1`,
        [user.id]
      );
      if (buyerProfile.rows.length > 0) {
        profileData = buyerProfile.rows[0];
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        user_type: user.user_type
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return data similar to Supabase format
    res.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: {
            user_type: user.user_type,
            full_name: user.full_name,
            phone: user.phone,
            ...profileData
          }
        },
        session: {
          access_token: token,
          token_type: 'bearer',
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              user_type: user.user_type,
              full_name: user.full_name,
              phone: user.phone,
              ...profileData
            }
          }
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      error: { message: 'An unexpected error occurred during login' }
    });
  }
});

/**
 * POST /api/auth/signout
 * Logout user (client-side token removal, but endpoint for consistency)
 */
router.post('/signout', authenticateToken, async (req, res) => {
  // In JWT-based auth, logout is handled client-side by removing the token
  // This endpoint exists for API consistency
  res.json({ error: null });
});

/**
 * GET /api/auth/session
 * Get current user session
 */
router.get('/session', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user and profile data
    const userResult = await query(
      `SELECT u.id, u.email, p.user_type, p.full_name, p.phone
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        error: { message: 'User not found' }
      });
    }

    const user = userResult.rows[0];

    // Get type-specific profile data
    let profileData = {};
    if (user.user_type === 'farmer') {
      const farmerProfile = await query(
        `SELECT farm_name, farm_location, farm_size_acres
         FROM farmer_profiles fp
         JOIN profiles p ON p.id = fp.profile_id
         WHERE p.user_id = $1`,
        [userId]
      );
      if (farmerProfile.rows.length > 0) {
        profileData = farmerProfile.rows[0];
      }
    } else if (user.user_type === 'buyer') {
      const buyerProfile = await query(
        `SELECT company_name
         FROM buyer_profiles bp
         JOIN profiles p ON p.id = bp.profile_id
         WHERE p.user_id = $1`,
        [userId]
      );
      if (buyerProfile.rows.length > 0) {
        profileData = buyerProfile.rows[0];
      }
    }

    // Return session data similar to Supabase format
    res.json({
      data: {
        session: {
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              user_type: user.user_type,
              full_name: user.full_name,
              phone: user.phone,
              ...profileData
            }
          }
        }
      },
      error: null
    });
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({
      error: { message: 'An unexpected error occurred' }
    });
  }
});

export default router;
