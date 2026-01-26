import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { env } from '../config/env.js';

/* ---------------- REGISTER ---------------- */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check existing user
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role || 'student']
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------- GET CURRENT USER (ME) ---------------- */
export const getMe = async (req, res, next) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, username, email, role, avatar_url, bio, batch, campus, branch, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (err) {
    next(err);
  }
};

/* ---------------- UPDATE CURRENT USER (ME) ---------------- */
export const updateMe = async (req, res, next) => {
  try {
    // Handle file upload
    let { avatar_url, bio, username, batch, campus, branch } = req.body;
    const userId = req.user.id;

    if (req.file) {
      // Construct full URL
      const protocol = req.protocol;
      const host = req.get('host');
      avatar_url = `${protocol}://${host}/uploads/avatars/${req.file.filename}`;
    }

    await db.query(
      `UPDATE users SET 
       avatar_url = ?, bio = ?, username = ?, batch = ?, campus = ?, branch = ? 
       WHERE id = ?`,
      [avatar_url, bio, username, batch, campus, branch, userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: { ...req.user, avatar_url, bio, username, batch, campus, branch }
    });

  } catch (err) {
    next(err);
  }
};

