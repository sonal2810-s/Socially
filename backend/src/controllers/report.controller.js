import { db } from '../config/db.js';

export const createReport = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { reason } = req.body;
    const reporterId = req.user.id;

    if (!reason) {
      return res.status(400).json({ error: 'Reason is required' });
    }

    await db.query(
      `INSERT INTO reports (reporter_id, post_id, reason) VALUES (?, ?, ?)`,
      [reporterId, postId, reason]
    );

    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (err) {
    next(err);
  }
};
