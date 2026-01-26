import { db } from '../config/db.js';

export const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }

    await db.query(
      `INSERT INTO comments (post_id, user_id, text)
       VALUES (?, ?, ?)`,
      [postId, userId, text]
    );

    res.status(201).json({ message: 'Comment added' });
  } catch (err) {
    next(err);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const [comments] = await db.query(`
      SELECT comments.id, comments.text, comments.created_at, users.name
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ?
      ORDER BY comments.created_at ASC
    `, [postId]);

    res.json(comments);
  } catch (err) {
    next(err);
  }
};
