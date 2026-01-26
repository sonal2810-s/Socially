import { db } from '../config/db.js';

/**
 * CREATE POST
 * POST /api/posts
 */
// CREATE POST
export const createPost = async (req, res, next) => {
  try {
    const { content, visibility, category, image_url } = req.body;
    const userId = req.user.id;

    if (!content || content.trim().length < 5) {
      return res.status(400).json({ error: 'Post content is too short' });
    }

    const [result] = await db.query(
      `INSERT INTO posts (user_id, content, image_url, visibility, category)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, content, image_url || null, visibility || 'campus', category || 'general']
    );

    res.status(201).json({
      message: 'Post created',
      postId: result.insertId
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET FEED
 * Supports Cursor-based Pagination
 * QUERY: ?cursor=TIMESTAMP_ISO&limit=20
 */
export const getFeed = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const cursor = req.query.cursor ? new Date(req.query.cursor) : new Date();

    const [posts] = await db.query(`
      SELECT 
        posts.id,
        posts.content,
        posts.image_url,
        posts.visibility,
        posts.category,
        posts.created_at,
        users.id AS user_id,
        users.name AS user_name,
        users.avatar_url,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count,
        (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) AS is_liked,
        (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comment_count
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE posts.created_at < ?
      ORDER BY posts.created_at DESC
      LIMIT ?
    `, [currentUserId, cursor, limit]);

    // Format for frontend
    const formattedPosts = posts.map(p => ({
      ...p,
      is_liked: !!p.is_liked // Convert 1/0 to boolean
    }));

    res.json({
      data: formattedPosts,
      nextCursor: posts.length === limit ? posts[posts.length - 1].created_at : null
    });
  } catch (err) {
    next(err);
  }
};
