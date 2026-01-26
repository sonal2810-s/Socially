import { db } from '../config/db.js';

export const toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Try to insert (Like)
    try {
      await db.query(
        `INSERT INTO likes (post_id, user_id) VALUES (?, ?)`,
        [postId, userId]
      );
      return res.status(201).json({ liked: true });
    } catch (error) {
      // If Duplicate Entry, then Delete (Unlike)
      if (error.code === 'ER_DUP_ENTRY') {
        await db.query(
          `DELETE FROM likes WHERE post_id = ? AND user_id = ?`,
          [postId, userId]
        );
        return res.status(200).json({ liked: false });
      }
      throw error; // Rethrow other errors
    }
  } catch (err) {
    next(err);
  }
};
